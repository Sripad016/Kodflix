import type { MovieRowConfig } from "../types";

export const ROW_CONFIGS: MovieRowConfig[] = [
  { id: "trending", title: "Trending Now", query: "avengers" },
  { id: "top-picks", title: "Top Picks For You", query: "batman" },
  { id: "originals", title: "Only on KodFlix", query: "star wars" },
  { id: "action", title: "Action Hits", query: "mission" },
  { id: "scifi", title: "Sci-Fi Favorites", query: "matrix" },
];
