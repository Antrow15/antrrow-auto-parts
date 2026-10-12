// Audits the built site in /dist: titles, descriptions, H1 count, canonical and JSON-LD validity.
// Run after `npm run build` with: npm run audit:seo
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.html') ? [path.join(dir, e.name)] : [],
  );

let problems = 0;
const rows = [];

for (const file of walk('dist')) {
  const html = readFileSync(file, 'utf8');
  const page = path.relative('dist', file).replaceAll('\\', '/');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? '';
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  const types = [];

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(json);
      types.push(...data['@graph'].map((n) => [].concat(n['@type']).join('+')));
    } catch {
      problems++;
      console.error(`Invalid JSON-LD: ${page}`);
    }
  }

  const issues = [];
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (h1 !== 1) issues.push(`h1=${h1}`);
  if (!title || title.length > 70) issues.push(`title=${title.length}`);
  if (!noindex && (description.length < 70 || description.length > 170)) issues.push(`desc=${description.length}`);
  if (!canonical) issues.push('no canonical');
  if (!noindex && types.length === 0) issues.push('no JSON-LD');
  problems += issues.length;

  rows.push({ page, title: title.length, desc: description.length, h1, schema: types.join(', '), issues: issues.join('; ') });
}

console.table(rows);
console.log(problems === 0 ? 'SEO audit passed.' : `SEO audit found ${problems} issue(s).`);
process.exitCode = problems === 0 ? 0 : 1;
