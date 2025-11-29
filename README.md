# 📘 Mini Audit Trail Generator

A full-stack web application that tracks changes in user-entered text and automatically generates version history with added/removed words using a custom LCS-based diff algorithm.

Frontend: React + Vite
Backend: Node.js + Express
Deployment: Render (backend) + Vercel (frontend)

# 🚀 Project Goal

The goal was to build a small but powerful audit-trail system that automatically detects modifications between two versions of text and stores detailed, structured version history.

🎯 Key Focus Areas

Implement custom diff logic (not from templates/libraries)

Show meaningful word-level changes

Practice algorithmic thinking
(arrays, dynamic programming, sequence matching)

Build a clean API + frontend interaction

# 🧠 How I Approached the Problem

## 1️⃣ Identifying What Needed to Be Tracked

Every time the user clicks Save Version, the system must detect:

✔ What words were added

✔ What words were removed

✔ The size of change

✔ The timestamp

Initially, I tried a simple array comparison, but that approach had limitations.

# 🟦 Initial Approach: Basic Array Difference Method
const oldWords = oldText.split(/\s+/);
const newWords = newText.split(/\s+/);

``` const added = newWords.filter(w => !oldWords.includes(w));
const removed = oldWords.filter(w => !newWords.includes(w));
```

## Pros
- Easy to implement
- Works for simple cases

## ❌ Limitations
- Fails when words repeat
- Cannot detect ordering
- Cannot detect positions
- Misidentifies moved words
- Not accurate for real edits

# 🟥 Final Approach: LCS-Based Diff (Longest Common Subsequence)
To generate human-like, minimal diffs, I implemented LCS (Longest Common Subsequence).
## ✔ Why LCS?
LCS is ideal for:
- Detecting minimal edits
- Preserving order
- Handling repeated words
- Identifying exact insertions/deletions
- Producing natural & accurate diffs

# 🧩 How LCS Works (Simple Explanation)

```
Old: "This is a simple test"
New: "This was a very simple test"

```
```
LCS = ["This", "a", "simple", "test"]
```
- Removed words = Words in OLD not in LCS
- Added words = Words in NEW not in LCS

# 💻 Implementation Details

## 🔹 Step 1 — Tokenizing Input

```
{ orig: "Hello,", norm: "hello", index: 0 }
```
- orig → original form
- norm → lowercase, punctuation-trimmed
- index → position
## 🔹 Step 2 — Building the LCS DP Table
```
dp[i][j] = longest common subsequence length of
           oldWords[i:] and newWords[j:]

```
## 🔹 Step 3 — Walking the DP Table to Extract Diffs
- example output
  ```
  {
  "added":   [{ "word": "very", "index": 3 }],
  "removed": [{ "word": "is", "index": 1 }]
  }
  ```
## 📦 Version History Object Stored
```
{
  "id": "uuid",
  "timestamp": "2025-11-26T13:40:00Z",
  "addedWords": ["very"],
  "removedWords": ["is"],
  "addedDetailed": [{ "word": "very", "index": 3 }],
  "removedDetailed": [{ "word": "is", "index": 1 }],
  "oldLength": 43,
  "newLength": 51,
  "fullText": "..."
}

```
