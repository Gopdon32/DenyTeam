const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const POSTS_DIR = path.join(__dirname, "..", "content", "posts");
const DATA_FILE = path.join(__dirname, "..", "data", "projects.json");

function readPost(file) {
  const full = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const fm = full.match(/^---\n([\s\S]*?)\n---\n/);
  let meta = {};
  let body = full;
  if (fm) {
    meta = yaml.load(fm[1]) || {};
    body = full.slice(fm[0].length);
  }
  return { meta, body };
}

function generate() {
  const db = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const posts = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".md"));

  const blogSection = db.blog || { posts: [] };
  const newPosts = posts.map(file => {
    const { meta } = readPost(file);
    const slug = meta.slug || file.replace(/\.md$/, "");
    return {
      title: meta.title || slug,
      slug,
      content_path: `content/posts/${file}`,
      tags: meta.tags || [],
      category: meta.category || "blog",
      image: meta.image || "assets/images/blog-intro.webp",
      link: meta.link || "#",
      desc: meta.desc || { ua: meta.excerpt || "" },
      date: meta.date || new Date().toISOString().slice(0, 10),
      featured: !!meta.featured,
    };
  });

  // Replace blog.posts with generated list
  db.blog = db.blog || {};
  db.blog.posts = newPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
  console.log("Generated index for", newPosts.length, "posts");
}

generate();
