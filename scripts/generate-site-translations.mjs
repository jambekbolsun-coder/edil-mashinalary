import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const projectRoot = process.cwd();
const sourceRoots = [
  path.join(projectRoot, "src", "app", "(site)"),
  path.join(projectRoot, "src", "components"),
  path.join(projectRoot, "src", "lib", "content.ts"),
  path.join(projectRoot, "src", "lib", "i18n.ts"),
];

const cyrillic = /[\u0400-\u04ff]/;
const locales = ["ky", "en", "tr", "zh"];
const separator = "[987654321]";

async function collectFiles(target) {
  const stat = await import("node:fs/promises").then(({ stat }) => stat(target));
  if (stat.isFile()) return [target];
  const entries = await readdir(target, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => !entry.name.startsWith("."))
      .map((entry) => collectFiles(path.join(target, entry.name))),
  );
  return nested.flat().filter((file) => /\.(tsx?|jsx?)$/.test(file));
}

function clean(value) {
  return value
    .replace(/\\n/g, " ")
    .replace(/\\(["'`])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function extractStrings(source) {
  const found = new Set();
  const sourceFile = ts.createSourceFile("source.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  function visit(node) {
    if (ts.isStringLiteralLike(node) || ts.isJsxText(node)) {
      const value = clean(node.text);
      if (value.length > 1 && value.length < 1200 && cyrillic.test(value) && !value.startsWith("@")) {
        found.add(value);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return found;
}

function chunkStrings(strings, maxChars = 3400) {
  const chunks = [];
  let current = [];
  let length = 0;
  for (const value of strings) {
    const addition = value.length + separator.length + 2;
    if (current.length && length + addition > maxChars) {
      chunks.push(current);
      current = [];
      length = 0;
    }
    current.push(value);
    length += addition;
  }
  if (current.length) chunks.push(current);
  return chunks;
}

async function translateChunk(strings, locale) {
  const joined = strings.join(`\n${separator}\n`);
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "ru");
  url.searchParams.set("tl", locale);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", joined);
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Translation failed (${locale}): ${response.status}`);
  const payload = await response.json();
  const translated = payload[0].map((part) => part[0]).join("");
  const results = translated.split(new RegExp(`\\s*\\${separator}\\s*`)).map(clean);
  if (results.length !== strings.length) {
    throw new Error(`Translation split mismatch (${locale}): ${results.length}/${strings.length}`);
  }
  return results;
}

const sourceFiles = (await Promise.all(sourceRoots.map(collectFiles)))
  .flat()
  .filter((file) => !file.includes(`${path.sep}components${path.sep}admin${path.sep}`));
const phrases = new Set();
for (const file of sourceFiles) {
  const source = await readFile(file, "utf8");
  for (const phrase of extractStrings(source)) phrases.add(phrase);
}

const sorted = [...phrases].sort((a, b) => a.localeCompare(b, "ru"));
const table = Object.fromEntries(sorted.map((source) => [source, { ru: source }]));

for (const locale of locales) {
  for (const chunk of chunkStrings(sorted)) {
    const translated = await translateChunk(chunk, locale);
    chunk.forEach((source, index) => {
      table[source][locale] = translated[index];
    });
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
}

const output = `import type { Locale } from "@/lib/types";\n\n` +
  `export const siteTranslations: Record<string, Record<Locale, string>> = ${JSON.stringify(table, null, 2)};\n`;

await writeFile(path.join(projectRoot, "src", "lib", "site-translations.ts"), output, "utf8");
console.log(`Generated ${sorted.length} translated phrases.`);
