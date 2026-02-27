import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROW_CONFIGS = [
  { title: "Trending Now", query: "avengers" },
  { title: "Top Picks For You", query: "batman" },
  { title: "Only on KodFlix", query: "star wars" },
  { title: "Action Hits", query: "mission" },
  { title: "Sci-Fi Favorites", query: "matrix" },
];

function loadEnvFile() {
  const envPath = join(process.cwd(), ".env");
  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const splitIndex = trimmed.indexOf("=");
    if (splitIndex < 1) {
      continue;
    }
    const key = trimmed.slice(0, splitIndex).trim();
    const value = trimmed.slice(splitIndex + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const apiKey = process.env.VITE_OMDB_API_KEY;
if (!apiKey) {
  console.error("Missing VITE_OMDB_API_KEY. Add it to .env before running verification.");
  process.exit(1);
}

let failures = 0;

for (const row of ROW_CONFIGS) {
  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("s", row.query);
  url.searchParams.set("type", "movie");
  url.searchParams.set("page", "1");

  const response = await fetch(url);
  if (!response.ok) {
    failures += 1;
    console.error(`[FAIL] ${row.title}: HTTP ${response.status}`);
    continue;
  }

  const data = await response.json();
  if (data.Response !== "True" || !Array.isArray(data.Search)) {
    failures += 1;
    console.error(`[FAIL] ${row.title}: ${data.Error ?? "Unexpected OMDb response shape"}`);
    continue;
  }

  const titles = data.Search.map((item) => item.Title).slice(0, 3);
  if (!titles.length) {
    failures += 1;
    console.error(`[FAIL] ${row.title}: no titles returned.`);
    continue;
  }

  console.log(`[OK] ${row.title}: ${titles.join(" | ")}`);
}

if (failures > 0) {
  console.error(`OMDb verification failed for ${failures} row(s).`);
  process.exit(1);
}

console.log("OMDb verification passed for all configured rows.");
