import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { config } from "../config";

// Normaliserad fråga för klienten (spelbar). Rätt svar exponeras — casual party-spel,
// poängräkning sker i klienten (se CLAUDE.md).
export interface GameQuestion {
  themeId: string;
  theme: string;
  type: string;
  typeLabel: string;
  prompt: string;
  options: string[];
  answer: string;
  fact: string;
  reveal: string;
  audioQuery: string | null;
  audioArtist: string | null;
  audioCountry: string | null;
  cover: string | null;
}

export interface QuestionBank {
  themes: { id: string; name: string; count: number }[];
  questions: GameQuestion[];
}

const LABELS: Record<string, string> = {
  year: "Gissa årtal",
  which_artist: "Vem gjorde låten",
  one_hit_wonder: "One-hit wonder",
  which_film: "Film & TV",
  missing_word: "Saknat ord",
  listen_guess: "Lyssna & gissa",
  cover_original: "Cover → original",
};
const AUDIO_TYPES = new Set(["listen_guess", "cover_original"]);

interface RawQuestion {
  type: string;
  prompt: string;
  options: string[];
  answer: string;
  fact: string;
  song: { title: string; artist: string; year: number };
  audio?: { query: string };
  cover?: { title: string; artist: string; lang?: string };
}
interface RawTheme {
  id: string;
  name: string;
  description?: string;
  questions: RawQuestion[];
}

let cache: QuestionBank | null = null;

export async function loadBank(): Promise<QuestionBank> {
  if (cache) return cache;
  const dir = config.questionsDir;
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json") && f !== "index.json");

  const themes: QuestionBank["themes"] = [];
  const questions: GameQuestion[] = [];

  for (const file of files.sort()) {
    const raw = JSON.parse(await readFile(path.join(dir, file), "utf-8")) as RawTheme;
    themes.push({ id: raw.id, name: raw.name, count: raw.questions.length });
    for (const q of raw.questions) {
      const isAudio = AUDIO_TYPES.has(q.type) && q.audio != null;
      questions.push({
        themeId: raw.id,
        theme: raw.name,
        type: q.type,
        typeLabel: LABELS[q.type] ?? q.type,
        prompt: q.prompt,
        options: q.options,
        answer: q.answer,
        fact: q.fact,
        reveal: `${q.song.artist} – ${q.song.title} (${q.song.year})`,
        audioQuery: isAudio ? q.audio!.query : null,
        audioArtist: q.type === "cover_original" ? (q.cover?.artist ?? null) : q.song.artist,
        audioCountry: q.type === "cover_original" ? "fi" : null,
        cover: q.type === "cover_original" && q.cover ? `${q.cover.artist} – ${q.cover.title}` : null,
      });
    }
  }
  cache = { themes, questions };
  return cache;
}
