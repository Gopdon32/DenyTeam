const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const POSTS_DIR = path.join(__dirname, "..", "content", "posts");
const DATA_FILE = path.join(__dirname, "..", "data", "projects.json");

function readPost(file) {
  const full = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const fm = full.match(/^---\n([\s\S]*?)\n---\n/);
  let meta = {};
  if (fm) {
    meta = yaml.load(fm[1]) || {};
  }
  return { meta };
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags))
    return tags
      .map(String)
      .map(tag => tag.trim())
      .filter(Boolean);
  return String(tags)
    .split(/[,;\n]/)
    .map(tag => tag.trim())
    .filter(Boolean);
}

function sectionForCategory(category) {
  if (category === "blog") return "blog";
  if (category === "js") return "games";
  return "me"; // layout and all other post sections go to portfolio
}

function buildDesc(meta) {
  const desc = { ua: "", en: "" };

  if (typeof meta.desc === "string") {
    desc.ua = meta.desc;
  }
  if (meta.desc && typeof meta.desc === "object") {
    desc.ua = meta.desc.ua || desc.ua;
    desc.en = meta.desc.en || desc.en;
  }
  desc.ua = desc.ua || meta.desc_ua || meta.excerpt_ua || meta.excerpt || "";
  desc.en = desc.en || meta.desc_en || "";

  return desc;
}

function generate() {
  const db = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const posts = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".md"));

  const generated = {
    me: [],
    blog: [],
    games: [],
  };

  posts.forEach(file => {
    const { meta } = readPost(file);
    const slug = meta.slug || file.replace(/\.md$/, "");
    const category = String(meta.category || "blog")
      .trim()
      .toLowerCase();
    const section = sectionForCategory(category);

    generated[section].push({
      title: meta.title || slug,
      slug,
      content_path: `content/posts/${file}`,
      tags: normalizeTags(meta.tags),
      category,
      image: meta.image || "assets/images/blog-intro.webp",
      link: meta.link || "#",
      desc: buildDesc(meta),
      date: meta.date || new Date().toISOString().slice(0, 10),
      featured: !!meta.featured,
    });
  });

  Object.keys(generated).forEach(section => {
    db[section] = db[section] || {};
    const existing = Array.isArray(db[section].posts) ? db[section].posts : [];
    const manualPosts = existing.filter(post => !post.content_path);
    db[section].posts = [...manualPosts, ...generated[section]].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
  console.log(
    "Generated index for posts:",
    Object.entries(generated).reduce((sum, [, list]) => sum + list.length, 0),
    "items",
  );
}

generate();
