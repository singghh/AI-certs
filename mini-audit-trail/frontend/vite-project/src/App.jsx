import { useState, useEffect } from "react";
import { saveVersion, getVersions } from "./api";

function App() {
  const [text, setText] = useState("");
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    loadVersions();
  }, []);

  async function loadVersions() {
    const data = await getVersions();
    setVersions(data);
  }

  async function handleSave() {
    await saveVersion(text);
    loadVersions();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Mini Audit Trail Generator</h1>

      <textarea
        style={{ width: "100%", height: 150 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your content..."
      />

      <button
        style={{ marginTop: 10, padding: "8px 16px" }}
        onClick={handleSave}
      >
        Save Version
      </button>

      <h2>Version History</h2>

      {versions.map((v) => (
        <div
          key={v.id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          <p>
            <strong>ID:</strong> {v.id}
          </p>
          <p>
            <strong>Timestamp:</strong> {v.timestamp}
          </p>
          <p>
            <strong>Added Words:</strong> {v.addedWords.join(", ") || "None"}
          </p>
          <p>
            <strong>Removed Words:</strong>{" "}
            {v.removedWords.join(", ") || "None"}
          </p>
          <p>
            <strong>Old Length:</strong> {v.oldLength}
          </p>
          <p>
            <strong>New Length:</strong> {v.newLength}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
