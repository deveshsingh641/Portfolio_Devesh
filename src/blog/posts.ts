export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  description: string;
  content: string;
  readTime: number;
  wordCount: number;
};

/* ------------------------------------------------------------------ */
/*  Frontmatter parser (browser-safe, no Node deps)                    */
/* ------------------------------------------------------------------ */
export function parseFrontmatter(raw: string): {
  data: Record<string, string | string[]>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {}, content: raw };

  const frontmatterBlock = match[1];
  const content = raw.slice(match[0].length).trim();
  const data: Record<string, string | string[]> = {};
  let currentKey = "";
  let collectingList = false;

  for (const line of frontmatterBlock.split(/\r?\n/)) {
    const kvMatch = line.match(/^(\w[\w\s]*):\s*(.*)/);
    if (kvMatch) {
      currentKey = kvMatch[1].trim();
      const val = kvMatch[2].trim();
      if (val === "") {
        collectingList = true;
        data[currentKey] = [];
      } else {
        collectingList = false;
        data[currentKey] = val.replace(/^["']|["']$/g, "");
      }
    } else if (collectingList && line.match(/^\s*-\s+(.+)/)) {
      const item = line.match(/^\s*-\s+(.+)/)![1].trim();
      (data[currentKey] as string[]).push(item);
    }
  }

  return { data, content };
}

export function estimateReadTime(text: string): { readTime: number; wordCount: number } {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return { readTime: Math.max(1, Math.ceil(words / 220)), wordCount: words };
}

export function extractHeadings(markdown: string): { level: number; text: string; id: string }[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = headingRegex.exec(markdown)) !== null) {
    const text = m[2].trim();
    headings.push({
      level: m[1].length,
      text,
      id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    });
  }
  return headings;
}

function slugFromPath(path: string): string {
  const slugMatch = path.match(/([^/]+)\.md$/);
  return slugMatch ? slugMatch[1] : path;
}

export async function loadAllPosts(): Promise<Post[]> {
  const modules = import.meta.glob("/src/blog/posts/*.md", { query: "?raw", import: "default" });
  const entries = Object.entries(modules);

  const loaded: Post[] = [];

  for (const [path, resolver] of entries) {
    try {
      const raw = await (resolver as () => Promise<string>)();
      const { data, content } = parseFrontmatter(raw);
      const slug = slugFromPath(path);
      const { readTime, wordCount } = estimateReadTime(content);
      loaded.push({
        slug,
        title: (data.title as string) || slug,
        date: (data.date as string) || "",
        category: (data.category as string) || "Development",
        tags: (data.tags as string[]) || [],
        description: (data.description as string) || "",
        content,
        readTime,
        wordCount,
      });
    } catch {
      // skip bad files
    }
  }

  loaded.sort((a, b) => (a.date < b.date ? 1 : -1));
  return loaded;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await loadAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}
