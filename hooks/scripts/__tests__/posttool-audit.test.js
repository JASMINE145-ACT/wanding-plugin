import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { spawn } from "bun";
import { existsSync, readFileSync, rmSync, unlinkSync } from "fs";
import { resolve } from "path";
import { homedir } from "os";

const SCRIPT = `${import.meta.dir}/../posttool-audit.js`;
const tmpLog = resolve(homedir(), ".wanding", "audit.test.log");

function runAudit(env, stdinJson) {
  return new Promise((resolveP) => {
    const proc = spawn({
      cmd: ["node", SCRIPT],
      env: { ...process.env, ...env, WANDING_AUDIT_LOG: tmpLog },
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
    });
    Promise.all([proc.stdout.text(), proc.stderr.text()]).then(([out, err]) => {
      proc.exited.then((code) => resolveP({ code: code ?? -1, out, err }));
    });
    proc.stdin.write(JSON.stringify(stdinJson) + "\n");
    proc.stdin.end();
  });
}

beforeEach(() => {
  if (existsSync(tmpLog)) unlinkSync(tmpLog);
});
afterEach(() => {
  if (existsSync(tmpLog)) unlinkSync(tmpLog);
});

describe("posttool-audit", () => {
  test("appends NDJSON entry on successful call", async () => {
    const { code } = await runAudit(
      {},
      {
        tool_name: "mcp__quotation__match_quotation",
        tool_input: { keywords: "PVC", customer_level: "B" },
        tool_response: [{ text: '{"candidates":[]}' }],
        duration_ms: 42,
        is_error: false,
        session_id: "abc-123",
      }
    );
    expect(code).toBe(0);
    expect(existsSync(tmpLog)).toBe(true);
    const lines = readFileSync(tmpLog, "utf-8").trim().split("\n");
    expect(lines.length).toBe(1);
    const entry = JSON.parse(lines[0]);
    expect(entry.tool).toBe("mcp__quotation__match_quotation");
    expect(entry.duration_ms).toBe(42);
    expect(entry.is_error).toBe(false);
    expect(entry.args_summary.customer_level).toBe("B");
    expect(entry.args_summary.keywords).toBe("PVC");
  });

  test("truncates long string args in summary", async () => {
    const longKw = "x".repeat(200);
    await runAudit(
      {},
      { tool_name: "mcp__quotation__match_quotation", tool_input: { keywords: longKw } }
    );
    const lines = readFileSync(tmpLog, "utf-8").trim().split("\n");
    const entry = JSON.parse(lines[0]);
    expect(entry.args_summary.keywords.length).toBeLessThanOrEqual(83); // 80 + "..."
    expect(entry.args_summary.keywords.endsWith("...")).toBe(true);
  });

  test("summarizes arrays as [array len=N]", async () => {
    await runAudit(
      {},
      { tool_name: "mcp__quotation__match_quotation_batch", tool_input: { keywords_list: ["a","b","c"] } }
    );
    const lines = readFileSync(tmpLog, "utf-8").trim().split("\n");
    const entry = JSON.parse(lines[0]);
    expect(entry.args_summary.keywords_list).toBe("[array len=3]");
  });

  test("does not crash on empty stdin", async () => {
    const proc = spawn({
      cmd: ["node", SCRIPT],
      env: { ...process.env, WANDING_AUDIT_LOG: tmpLog },
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
    });
    proc.stdin.end();
    const code = await proc.exited;
    expect(code).toBe(0);
  });

  test("does not crash on malformed JSON", async () => {
    const proc = spawn({
      cmd: ["node", SCRIPT],
      env: { ...process.env, WANDING_AUDIT_LOG: tmpLog },
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
    });
    proc.stdin.write("not json\n");
    proc.stdin.end();
    const code = await proc.exited;
    expect(code).toBe(0);
  });
});