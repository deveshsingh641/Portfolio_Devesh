---
title: "MongoDB at Scale: Aggregation Pipelines, Compound Indexing & Sub-50ms Telemetry"
date: "2026-01-10"
category: "Database Engineering"
tags:
  - MongoDB
  - Aggregation
  - Database
  - Performance
  - Backend
description: "How to design compound indexes, eliminate full-collection scans, and structure multi-stage aggregation pipelines for real-time analytics in high-concurrency Node.js apps."
coverImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=85"
---

When prototyping an application with MongoDB and Mongoose, basic queries like `UserModel.find({ status: 'active' })` feel instantaneous. But once a collection reaches hundreds of thousands of documents—such as real-time classroom telemetry or sensor log entries—naive queries degrade into full collection scans (`COLLSCAN`), spiking CPU usage to 100% and stalling the Node.js event loop.

While scaling **ClassIntel's** lecture analytics engine, I conducted deep query profiling with MongoDB's `.explain("executionStats")` to optimize pipeline throughput. Here is how we redesigned our indexes and aggregation pipelines to sustain sub-50ms queries.

---

## 1. The Equality, Sort, Range (ESR) Rule

The most critical principle when creating compound indexes is the **ESR Rule**:

1. **Equality (`E`)**: Place fields that match exact values first (e.g., `courseId: "cs101"`).
2. **Sort (`S`)**: Place fields used in the `$sort` stage second (e.g., `timestamp: -1`).
3. **Range (`R`)**: Place fields that use range comparisons last (e.g., `score: { $gte: 75 }`).

```javascript
// BAD INDEX (Violates ESR): Sort occurs in memory because Range is placed before Sort!
// db.feedback.createIndex({ score: 1, courseId: 1, timestamp: -1 })

// OPTIMAL COMPOUND INDEX (Strict ESR Compliance):
db.feedback.createIndex(
  { courseId: 1, timestamp: -1, score: 1 },
  { background: true, name: "idx_feedback_course_time_score" }
);
```

By following ESR, MongoDB uses the index tree to jump directly to the matched `courseId`, traverses the leaf nodes already ordered by `timestamp`, and filters `score` ranges without allocating an in-memory 100MB sort buffer.

---

## 2. Real-Time Telemetry Aggregation with `$facet` and `$bucket`

Instructors in ClassIntel need instant feedback summaries: average student sentiment, comprehension distribution (e.g. 0-40%, 40-70%, 70-100%), and the top 5 most confusing topic tags in the last 60 minutes.

Running three separate queries would cause three round-trips over the wire. Instead, we bundle the entire analytics run into a single `$facet` aggregation pipeline:

```javascript
export async function getLiveLectureTelemetry(courseId, fromTimestamp) {
  return await FeedbackModel.aggregate([
    // Stage 1: Match on indexed fields first (Filters 95% of data instantly)
    {
      $match: {
        courseId: new mongoose.Types.ObjectId(courseId),
        createdAt: { $gte: fromTimestamp }
      }
    },
    // Stage 2: Multi-faceted analytics in a single database pass
    {
      $facet: {
        // Facet A: Overall summary statistics
        overview: [
          {
            $group: {
              _id: null,
              totalSubmissions: { $sum: 1 },
              avgComprehension: { $avg: "$comprehensionRating" },
              avgPacing: { $avg: "$pacingScore" }
            }
          }
        ],
        // Facet B: Distribution Buckets (Histogram)
        comprehensionDistribution: [
          {
            $bucket: {
              groupBy: "$comprehensionRating",
              boundaries: [1, 3, 4, 6], // 1-2: Struggling, 3: Fair, 4-5: Clear
              default: "Unknown",
              output: {
                count: { $sum: 1 }
              }
            }
          }
        ],
        // Facet C: Most flagged topics
        topFlaggedTopics: [
          { $unwind: "$doubtTags" },
          { $group: { _id: "$doubtTags", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ]
      }
    }
  ]);
}
```

---

## 3. Query Profiling: From COLLSCAN to IXSCAN

Before optimizing, MongoDB execution stats revealed:
- `executionStages.stage`: `COLLSCAN`
- `totalDocsExamined`: 148,200
- `nReturned`: 450
- `executionTimeMillis`: **412ms**

After creating the covered compound index and pushing `$match` to the very top of the aggregation pipeline:
- `executionStages.stage`: `IXSCAN` (Index Scan)
- `totalDocsExamined`: 450
- `nReturned`: 450
- `executionTimeMillis`: **19ms**

A **95.4% latency reduction** with zero changes to the underlying cloud server size.

---

## 4. Key Engineering Takeaways

1. **Always run `.explain("executionStats")`**: Never guess whether your query uses an index. Check the ratio of `totalDocsExamined / nReturned`. In an ideal index, that ratio is exactly $1.0$.
2. **Limit `$lookup` in real-time paths**: Embedding bounded relational data (such as author avatars and role pills) eliminates costly joins across collections during high-frequency poll intervals.
3. **Use Partial Indexes for Large Collections**: If 90% of queries only target active exams, create an index with `partialFilterExpression: { status: 'ACTIVE' }` to save up to 70% RAM in index storage.
