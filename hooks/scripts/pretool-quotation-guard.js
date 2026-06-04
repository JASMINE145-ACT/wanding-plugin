#!/usr/bin/env node
// PreToolUse guard: enforce file_path whitelist for fill_quotation_sheet / parse_excel_smart

import { resolve, sep, isAbsolute } from "path";
import { homedir } from "os";

const stdin = await readStdin();
let payload;
try {
  payload = JSON.parse(stdin);
} catch {
  process.exit(0); // 解析失败不拦（保守放行）
}

const filePath = payload?.tool_input?.file_path;
if (!filePath) process.exit(0);

const approvedPaths = loadApprovedPaths();
if (!isPathAllowed(filePath, approvedPaths)) {
  console.error(
    `[wanding-pretool-guard] BLOCKED: "${filePath}" not in approved_paths.\n` +
    `Approved directories: ${approvedPaths.join(", ")}\n` +
    `Add it via plugin userConfig.approved_paths.`
  );
  process.exit(2); // 退出码 2 = 阻止工具调用
}

process.exit(0);

// === helpers ===
async function readStdin() {
  return new Promise((resolve) => {
    let buf = "";
    process.stdin.on("data", (c) => (buf += c));
    process.stdin.on("end", () => resolve(buf));
  });
}

function loadApprovedPaths() {
  const cfg = process.env.WANDING_APPROVED_PATHS;
  if (cfg) return cfg.split(";").filter(Boolean).map((p) => resolve(p));
  return [resolve(homedir(), "Documents", "wanding")];
}

function isPathAllowed(target, approved) {
  const abs = resolve(target);
  return approved.some((root) => {
    const rootAbs = resolve(root);
    return abs === rootAbs || abs.startsWith(rootAbs + sep);
  });
}