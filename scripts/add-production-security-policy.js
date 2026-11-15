const fs = require("fs");
const path = require("path");

const indexPath = path.resolve(__dirname, "../build/index.html");
const policy =
  "default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self' mailto:; script-src 'self' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://api.emailjs.com https://google-analytics.com https://*.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://www.google.com https://www.recaptcha.net; frame-src 'self' https://www.google.com https://www.recaptcha.net; upgrade-insecure-requests";

if (!fs.existsSync(indexPath)) {
  console.error("Production index.html was not found. Run the React build first.");
  process.exit(1);
}

const html = fs.readFileSync(indexPath, "utf8");
if (/http-equiv=["']Content-Security-Policy["']/i.test(html)) {
  console.log("Production Content Security Policy is already present.");
  process.exit(0);
}

const charsetMeta = /<meta\s+charset=["']utf-8["']\s*\/?\s*>/i;
if (!charsetMeta.test(html)) {
  console.error("Could not find the charset meta tag to place the security policy.");
  process.exit(1);
}

const securityMeta = `<meta http-equiv="Content-Security-Policy" content="${policy}" />`;
const securedHtml = html.replace(charsetMeta, (tag) => `${tag}\n    ${securityMeta}`);
fs.writeFileSync(indexPath, securedHtml);
console.log("Production Content Security Policy added.");
