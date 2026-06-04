import { describe, test, expect } from "bun:test";
import { spawn } from "bun";

const SCRIPT = `${import.meta.dir}/../pretool-quotation-guard.js`;

function runGuard(env, stdinJson) {
  return new Promise((resolve) => {
    const proc = spawn({
      cmd: ["node", SCRIPT],
      env: { ...process.env, ...env },
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
    });
    Promise.all([proc.stdout.text(), proc.stderr.text()]).then(([out, err]) => {
      proc.exited.then((code) => resolve({ code: code ?? -1, out, err }));
    });
    proc.stdin.write(JSON.stringify(stdinJson) + "\n");
    proc.stdin.end();
  });
}

describe("pretool-quotation-guard", () => {
  test("exits 0 when file_path is in approved_paths", async () => {
    const tmpDir = `${process.cwd()}/.test-allowed-${Date.now()}`;
    const allowed = tmpDir;
    const target = `${tmpDir}/foo.xlsx`;
    const { code, err } = await runGuard(
      { WANDING_APPROVED_PATHS: allowed },
      { tool_name: "mcp__quotation__fill_quotation_sheet", tool_input: { file_path: target } }
    );
    expect(code).toBe(0);
    expect(err).toBe("");
  });

  test("exits 2 when file_path is outside approved_paths", async () => {
    const allowed = `${process.cwd()}/.test-allowed-${Date.now()}`;
    const target = `C:/Windows/System32/drivers/etc/hosts.xlsx`;
    const { code, err } = await runGuard(
      { WANDING_APPROVED_PATHS: allowed },
      { tool_name: "mcp__quotation__fill_quotation_sheet", tool_input: { file_path: target } }
    );
    expect(code).toBe(2);
    expect(err).toContain("BLOCKED");
    expect(err).toContain("not in");
  });

  test("exits 0 when no file_path in tool_input", async () => {
    const { code } = await runGuard(
      {},
      { tool_name: "mcp__quotation__match_quotation", tool_input: { keywords: "PVC" } }
    );
    expect(code).toBe(0);
  });

  test("exits 0 on malformed stdin JSON (fail open)", async () => {
    const proc = spawn({
      cmd: ["node", SCRIPT],
      env: process.env,
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
    });
    proc.stdin.write("not json\n");
    proc.stdin.end();
    const code = await proc.exited;
    expect(code).toBe(0);
  });

  test("supports semicolon-separated multiple approved paths", async () => {
    const dir1 = `${process.cwd()}/.test-multi-1-${Date.now()}`;
    const dir2 = `${process.cwd()}/.test-multi-2-${Date.now()}`;
    const target = `${dir2}/sub/foo.xlsx`;
    const { code } = await runGuard(
      { WANDING_APPROVED_PATHS: `${dir1};${dir2}` },
      { tool_name: "mcp__quotation__parse_excel_smart", tool_input: { file_path: target } }
    );
    expect(code).toBe(0);
  });
});