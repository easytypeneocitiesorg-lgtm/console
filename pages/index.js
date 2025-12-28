import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState("console"); // console | editor | run
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([
    "Custom Console v1",
    "Type /help for commands"
  ]);

  const [files, setFiles] = useState({});
  const [currentFile, setCurrentFile] = useState("");
  const [editorText, setEditorText] = useState("");

  function runCommand(cmd) {
    const args = cmd.trim().split(" ");
    const base = args[0];

    if (base === "/help") {
      setOutput(o => [
        ...o,
        "",
        "/help - show commands",
        "/new - create new file",
        "/run <filename> - run file"
      ]);
    }

    else if (base === "/new") {
      setEditorText("");
      setCurrentFile("");
      setMode("editor");
    }

    else if (base === "/run") {
      const name = args[1];
      if (!name || !files[name]) {
        setOutput(o => [...o, "File not found"]);
        return;
      }
      setCurrentFile(name);
      setMode("run");
    }

    else {
      setOutput(o => [...o, `Unknown command: ${cmd}`]);
    }
  }

  function handleEnter(e) {
    if (e.key === "Enter") {
      setOutput(o => [...o, `> ${input}`]);
      runCommand(input);
      setInput("");
    }
  }

  function saveFile() {
    const name = prompt("File name:");
    if (!name) return;
    setFiles(f => ({ ...f, [name]: editorText }));
    setMode("console");
    setOutput(o => [...o, `Saved "${name}"`]);
  }

  return (
    <div style={styles.app}>
      {mode === "console" && (
        <>
          <div style={styles.console}>
            {output.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
          <input
            style={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleEnter}
            placeholder="Type a command..."
            autoFocus
          />
        </>
      )}

      {mode === "editor" && (
        <>
          <button style={styles.save} onClick={saveFile}>Save</button>
          <textarea
            style={styles.editor}
            value={editorText}
            onChange={e => setEditorText(e.target.value)}
            placeholder="Describe what you want the program to do..."
          />
        </>
      )}

      {mode === "run" && (
        <>
          <button style={styles.exit} onClick={() => setMode("console")}>
            Exit
          </button>
          <div style={styles.run}>
            <h3>Running: {currentFile}</h3>
            <pre>{files[currentFile]}</pre>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  app: {
    background: "#000",
    color: "#0f0",
    height: "100vh",
    fontFamily: "monospace",
    padding: "10px",
  },
  console: {
    height: "90%",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
  },
  input: {
    width: "100%",
    background: "#000",
    color: "#0f0",
    border: "none",
    outline: "none",
    fontFamily: "monospace",
    fontSize: "16px",
  },
  editor: {
    width: "100%",
    height: "100%",
    background: "#000",
    color: "#0f0",
    border: "none",
    outline: "none",
    fontFamily: "monospace",
    fontSize: "16px",
  },
  save: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  exit: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  run: {
    paddingTop: "40px",
  }
};
