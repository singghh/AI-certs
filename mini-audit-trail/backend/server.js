import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

let versions = [];
let lastText = "";

function normalizeToken(token) {
  return token
    .trim()
    .replace(/^[\p{P}\p{S}\s]+|[\p{P}\p{S}\s]+$/gu, "")
    .toLowerCase();
}

function tokenizeWithNormalized(text) {
  if (!text || !text.trim()) return [];
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  return tokens.map((orig, idx) => ({
    orig,
    norm: normalizeToken(orig),
    index: idx,
  }));
}

// LCS-based diff: returns ordered added/removed lists (with indices and original words)
function diffWords(oldText, newText) {
  const A = tokenizeWithNormalized(oldText);
  const B = tokenizeWithNormalized(newText);

  const n = A.length;
  const m = B.length;

  if (n === 0 && m === 0) return { added: [], removed: [] };
  if (n === 0) {
    return {
      added: B.map((t) => ({ word: t.orig, index: t.index })),
      removed: [],
    };
  }
  if (m === 0) {
    return {
      added: [],
      removed: A.map((t) => ({ word: t.orig, index: t.index })),
    };
  }

  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; --i) {
    for (let j = m - 1; j >= 0; --j) {
      if (A[i].norm && A[i].norm === B[j].norm) dp[i][j] = 1 + dp[i + 1][j + 1];
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  let i = 0,
    j = 0;
  const added = [];
  const removed = [];

  while (i < n && j < m) {
    if (A[i].norm && B[j].norm && A[i].norm === B[j].norm) {
      i++;
      j++;
    } else {
      if (dp[i + 1][j] >= dp[i][j + 1]) {
        removed.push({ word: A[i].orig, index: A[i].index });
        i++;
      } else {
        added.push({ word: B[j].orig, index: B[j].index });
        j++;
      }
    }
  }

  while (i < n) {
    removed.push({ word: A[i].orig, index: A[i].index });
    i++;
  }
  while (j < m) {
    added.push({ word: B[j].orig, index: B[j].index });
    j++;
  }

  return { added, removed };
}

app.post("/save-version", (req, res) => {
  const { text } = req.body;

  const { added, removed } = diffWords(lastText, text);

  const addedWords = added.map((a) => a.word);
  const removedWords = removed.map((r) => r.word);

  const entry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    addedWords,
    removedWords,
    addedDetailed: added,
    removedDetailed: removed,
    oldLength: lastText.length,
    newLength: text.length,
    fullText: text,
  };

  versions.push(entry);
  lastText = text;

  res.json({ success: true, version: entry });
});

app.get("/versions", (req, res) => {
  res.json(versions);
});

// near bottom of server.js
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
