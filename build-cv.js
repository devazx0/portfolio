import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.resolve(__dirname, 'resume.html');
const outPdfPath = path.resolve(__dirname, 'public', 'Azeem_Sanusi_resume.pdf');

const browsers = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser'
];

const browserExe = browsers.find(b => fs.existsSync(b));

if (!browserExe) {
  console.error('No compatible Chromium browser found to generate PDF.');
  process.exit(1);
}

console.log(`Generating CV using: ${browserExe}`);
const cmd = `"${browserExe}" --headless --no-pdf-header-footer --print-to-pdf="${outPdfPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log(`Successfully generated: ${outPdfPath}`);
} catch (err) {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
}
