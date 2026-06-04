#!/usr/bin/env node
// PostToolUse audit logger: append one NDJSON line per mcp__quotation__.* call

import { appendFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { homedir } from "os";

// Allow override via env; default to ~/.wanding/audit.log
const logPath = process.env.WANDING_AUDIT_LOG
  ? resolve(process.env.WANDING_AUDIT_LOG)
  : resolve(homedir(), ".wanding", "audit.log");

const stdin = await readStdin();
let payload = {};
try {
  payload = JSON.parse(stdin);
} catch {
  /* 容忍空输入 */
}

const entry = {
  ts: new Date().toISOString(),
  session_id: payload.session_id ?? null,
  tool: payload.tool_name ?? "unknown",
  args_summary: summarizeArgs(payload.tool_input),
  result_summary: summarizeResult(payload.tool_response),
  duration_ms: payload.duration_ms ?? null,
  is_error: payload.is_error ?? false,
};

try {
  mkdirSync(dirname(logPath), { recursive: true });
  appendFileSync(logPath, JSON.stringify(entry) + "\n", "utf-8");
} catch (e) {
  console.error(`[wanding-posttool-audit] Failed to write log: ${e.message}`);
}
process.exit(0);

function summarizeArgs(input) {
  if (!input) return null;
  const out = {};
  for (const k of Object.keys(input)) {
    const v = input[k];
    if (Array.isArray(v)) out[k] = `[array len=${v.length}]`;
    else if (typeof v === "string" && v.length > 80) out[k] = v.slice(0, 80) + "...";
    else out[k] = v;
  }
  return out;
}

function summarizeResult(resp) {
  if (!resp) return null;
  const text = Array.isArray(resp) ? resp[0]?.text : resp?.text ?? "";
  if (typeof text === "string" && text.length > 200) return text.slice(0, 200) + "...";
  return text;
}

async function readStdin() {
  return new Promise((r) => {
    let buf = "";
    process.stdin.on("data", (c) => (buf += c));
    process.stdin.on("end", () => r(buf));
  });
}