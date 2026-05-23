const fs = require("fs");
const path = require("path");
const c = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

let t = c.match(/<title>([^<]+)<\/title>/);
console.log("Title:", JSON.stringify(t?.[1] || ""));

let d = c.match(/data-i18n="nav_about">([^<]+)<\/a>/);
console.log("Nav About:", JSON.stringify(d?.[1] || ""));

let v = c.match(/data-i18n="video_sub">([^<]+)<\/p>/);
if (!v) v = c.match(/data-i18n="video_sub">([^<]+?)<\/p>/);
console.log("Video Sub:", JSON.stringify(v?.[1] || "not found"));

let h = c.match(/data-i18n="hero_sub">([^<]+)<\/p>/);
if (!h) h = c.match(/data-i18n="hero_sub">([^<]+?)<\/p>/);
console.log("Hero Sub:", JSON.stringify(h?.[1] || "not found"));

// Check product names
let p = c.match(/name: 'Yi[^']+'/);
console.log("First product:", JSON.stringify(p?.[0] || "not found"));

// Check if any "Ã" or "Ä" corruption remains
let bad1 = c.match(/[\u00C3\u00C4\u00C5\u00C9\u00C7]/g);
console.log("Latin-1 corruption chars:", bad1 ? bad1.length : 0);

// Check for U+FFFD
let ffd = c.match(/\uFFFD/g);
console.log("U+FFFD remaining:", ffd ? ffd.length : 0);

// Check for remaining double-encoded patterns
let aCirc = c.match(/Ã/g);
console.log("Ã remaining:", aCirc ? aCirc.length : 0);
