const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const DATA_FILE = path.join(__dirname, "..", "data", "projects.json");
const SOURCES = [
  {
    dir: path.join(__dirname, "..", "content", "blog"),
    section: "blog",
    defaultCategory: "blog",
  },
  {
    dir: path.join(__dirname, "..", "content", "portfolio"),
    section: "me",
    defaultCategory: "layout",
  },
  {
    dir: path.join(__dirname, "..", "content", "games"),
    section: "games",
    defaultCategory: "js",
  },
  {
    dir: path.join(__dirname, "..", "content", "posts"),
    section: null,
    defaultCategory: "blog",
  },
];

function readPost(filePath) {
  const full = fs.readFileSync(filePath, "utf8");
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

function collectFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter(f => f.endsWith(".md"));
}

function generate() {
  const db = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const generated = {
    me: [],
    blog: [],
    games: [],
  };

  SOURCES.forEach(source => {
    const files = collectFiles(source.dir);
    files.forEach(file => {
      const filePath = path.join(source.dir, file);
      const { meta } = readPost(filePath);
      const slug = meta.slug || file.replace(/\.md$/, "");
      const category = String(meta.category || source.defaultCategory)
        .trim()
        .toLowerCase();
      const section = source.section || sectionForCategory(category);

      generated[section].push({
        title: meta.title || slug,
        slug,
        content_path: path
          .relative(path.join(__dirname, ".."), filePath)
          .replace(/\\/g, "/"),
        tags: normalizeTags(meta.tags),
        category,
        image: meta.image || "assets/images/blog-intro.webp",
        link: meta.link || "#",
        desc: buildDesc(meta),
        date: meta.date || new Date().toISOString().slice(0, 10),
        featured: !!meta.featured,
      });
    });
  });

  const output = { ...db };

  Object.keys(generated).forEach(section => {
    output[section] = output[section] || {};
    const existingPosts = Array.isArray(output[section].posts)
      ? output[section].posts
      : [];
    const manualPosts = existingPosts.filter(post => !post.content_path);
    output[section].posts = [...manualPosts, ...generated[section]].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(output, null, 2), "utf8");
  console.log(
    "Generated index for posts:",
    Object.entries(generated).reduce((sum, [, list]) => sum + list.length, 0),
    "items",
  );
}

generate();
