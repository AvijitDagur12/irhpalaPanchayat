// client/src/admin/ControlLogin.js
// Terminal-style secure login for the Control Officer.
// Two-step flow: ask for email → validate → ask for password → authenticate.
// Rate limiting handled server-side. Front-end tracks attempts & shows lockout.

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./ControlOfficer.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ControlLogin = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState("email"); // email | password | success | locked
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [input, setInput] = useState("");
  const [lines, setLines] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [busy, setBusy] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(null);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const MAX_ATTEMPTS = 5;

  /* --- auto scroll to latest line --- */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    if (inputRef.current) inputRef.current.focus();
  }, [lines, stage]);

  /* --- boot message --- */
  useEffect(() => {
    typeLines([
      "$ sudo access --target control_officer",
      "Establishing secure tunnel...",
      "✓ Encrypted channel ready.",
      "",
      "RESTRICTED SYSTEM — IRHPALA GRAM PANCHAYAT",
      "Unauthorized access is monitored and logged.",
      "",
      "> Enter your registered control officer email:",
    ]);
    // eslint-disable-next-line
  }, []);

  /* --- typing effect helper --- */
  const typeLines = async (newLines) => {
    for (const line of newLines) {
      setLines((prev) => [...prev, ""]);
      if (line.length === 0) {
        await sleep(60);
        continue;
      }
      let built = "";
      for (let i = 0; i < line.length; i++) {
        built += line[i];
        setLines((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = built;
          return copy;
        });
        await sleep(8);
      }
      await sleep(40);
    }
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const appendLine = (text, color) => {
    setLines((prev) => [...prev, { text, color }]);
  };

  const appendText = (text) => {
    setLines((prev) => [...prev, text]);
  };

  /* --- check lockout --- */
  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS && !lockedUntil) {
      const until = Date.now() + 15 * 60 * 1000;
      setLockedUntil(until);
      setStage("locked");
      appendLine(
        `✗ Too many failed attempts. Locked for 15 minutes.`,
        "error"
      );
    }
  }, [attempts, lockedUntil]);

  /* --- handle Enter key --- */
  const handleKeyDown = async (e) => {
    if (e.key !== "Enter" || busy) return;
    e.preventDefault();
    const value = input.trim();
    setInput("");

    if (stage === "email") {
      appendText(`> ${value}`);
      if (!EMAIL_REGEX.test(value)) {
        appendLine("✗ Invalid email format. Please enter a valid email address.", "error");
        appendText("> Enter your registered control officer email:");
        return;
      }
      setEmail(value);
      appendLine("✓ Email format accepted.", "success");
      appendText("> Enter your secure password:");
      setStage("password");
      return;
    }

    if (stage === "password") {
      appendText("> " + "•".repeat(value.length || 8));
      if (!value) {
        appendLine("✗ Password cannot be empty.", "error");
        appendText("> Enter your secure password:");
        return;
      }
      setPassword(value);
      setBusy(true);
      appendLine("Authenticating via secure channel...", "info");

      await sleep(700); // fake check delay

      try {
        const res = await api.post("/api/control/login", { email, password: value });
        const { token, officer } = res.data || {};
        if (!token || !officer) {
          appendLine("✗ Unexpected response from server.", "error");
          registerFail();
          return;
        }

        localStorage.setItem("control_token", token);
        localStorage.setItem("control_officer", JSON.stringify(officer));

        appendLine("✓ Authentication successful.", "success");
        appendLine(`✓ Welcome, ${officer.name}.`, "success");
        appendLine("Redirecting to control console...", "info");
        setStage("success");

        await sleep(1200);
        navigate("/control-officer/dashboard", { replace: true });
      } catch (err) {
        const msg = err.message || "Authentication failed.";
        appendLine(`✗ ${msg}`, "error");
        registerFail();
      } finally {
        setBusy(false);
      }
      return;
    }
  };

  const registerFail = () => {
    const next = attempts + 1;
    setAttempts(next);
    const remaining = MAX_ATTEMPTS - next;
    if (remaining > 0) {
      appendLine(`⚠ Attempt ${next}/${MAX_ATTEMPTS} failed. ${remaining} remaining.`, "warn");
      appendText("> Re-enter your registered control officer email:");
      setStage("email");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="term-login-page">
      <div className="term-login-window">
        {/* title bar */}
        <div className="term-titlebar">
          <span className="term-dot red"></span>
          <span className="term-dot amber"></span>
          <span className="term-dot green"></span>
          <span className="term-title">control_officer — secure terminal</span>
        </div>

        {/* terminal body */}
        <div className="term-body" ref={scrollRef}>
          {lines.map((l, i) =>
            typeof l === "string" ? (
              <div key={i} className="term-line">{l || "\u00A0"}</div>
            ) : (
              <div key={i} className={`term-line ${l.color || ""}`}>{l.text}</div>
            )
          )}

          {stage !== "success" && stage !== "locked" && (
            <div className="term-input-row">
              <span className="term-prompt">&gt;</span>
              <input
                ref={inputRef}
                type={stage === "password" ? "password" : "text"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={busy}
                autoFocus
                spellCheck="false"
                autoComplete="off"
              />
            </div>
          )}

          {stage === "locked" && (
            <div className="term-line error">
              ✗ Locked. Refresh after 15 minutes or contact system owner.
            </div>
          )}
        </div>

        {/* footer */}
        <div className="term-footer">
          <span>⚠ IP logged</span>
          <span>Attempts: {attempts}/{MAX_ATTEMPTS}</span>
          <Link to="/admin">← exit</Link>
        </div>
      </div>
    </div>
  );
};

export default ControlLogin;