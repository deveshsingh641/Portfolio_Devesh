---
title: "Building RESTful APIs with Node.js and Express"
date: "2026-01-25"
category: "Development"
tags:
  - Node.js
  - Express
  - API
description: "Learn to design and build production-ready RESTful APIs using Node.js, Express, MongoDB, and best practices for authentication, validation, and error handling."
---

Building APIs that are secure, scalable, and maintainable requires more than just routing. This guide covers the patterns and practices I use in production systems.

## Project Structure

A clean folder structure scales better than monolithic files:

```
src/
  controllers/    # Request handlers
  middleware/     # Auth, validation, logging
  models/         # Database schemas
  routes/         # Route definitions
  services/       # Business logic
  utils/          # Helpers
  config/         # Environment config
```

## Authentication with JWT

Use short-lived access tokens and long-lived refresh tokens:

```javascript
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};
```

## Input Validation

Never trust user input. Use Zod or Joi for runtime validation:

```javascript
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(2).max(50),
});
```

## Error Handling

Create a centralized error handler:

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

## Rate Limiting

Protect your API from abuse:

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});
```

## Key Takeaways

- Always validate input on the server
- Use proper HTTP status codes
- Implement pagination for list endpoints
- Log everything — but sanitize sensitive data
- Write integration tests for your endpoints

A well-designed API is a joy to work with, both for your team and your consumers.
