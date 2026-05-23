const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "index.html");
let c = fs.readFileSync(filePath, "utf8");

const globe = "\uD83C\uDF10";
const zap = "\u26A1";
const info = "\u2139\uFE0F";
const battery = "\uD83D\uDD0B";
const pkg = "\uD83D\uDCE6";
const play = "\u25B6\uFE0F";
const phone = "\uD83D\uDCDE";

// Language buttons: əÇç??ə AZ → globe AZ
c = c.replace(
  new RegExp("\u0259\u00C7\u00E7\\?\\?\u0259 AZ", "g"),
  globe + " AZ"
);
c = c.replace(
  new RegExp("\u0259\u00C7\u00E7\\?\\?\u0259 TR", "g"),
  globe + " TR"
);
c = c.replace(
  new RegExp("\u0259\u00C7\u00E7\\?\\?\u0259 RU", "g"),
  globe + " RU"
);
c = c.replace(
  new RegExp("\u0259\u00C7\u00E7\\?\\?\u0259 EN", "g"),
  globe + " EN"
);

// Brand heading: əÇç Yiğit Akü → ⚡ Yiğit Akü
c = c.replace(
  new RegExp("<span>\u0259\u00C7\u00E7 Yi\u011Fit Ak\u00FC</span>", "g"),
  "<span>" + zap + " Yi\u011Fit Ak\u00FC</span>"
);

// Battery type card icon
c = c.replace(
  '<div class="type-icon">\u0259\u00C7\u00E7</div>',
  '<div class="type-icon">' + battery + "</div>"
);

// Feature card icon
c = c.replace(
  '<div class="feat-icon">\u0259\u00C7\u00E7</div>',
  '<div class="feat-icon">' + globe + "</div>"
);

// Icons array
c = c.replace(
  "const icons = ['\u0259', '\u0259\u00C7\u00E7', '\u0259\uFE0F', '\u2014', '\u2014', '\u0259\uFE0F']",
  "const icons = ['" + zap + "', '" + globe + "', '" + info + "', '" + battery + "', '" + pkg + "', '" + play + "', '" + phone + "']"
);

fs.writeFileSync(filePath, c, "utf8");
console.log("Icon fixes done");
