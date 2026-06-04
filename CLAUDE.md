# Claude Code behavior for wanding plugin

This file is loaded by `findProjectRoot()` (see quotation-mcp config.ts). It also gives Claude Code conventions for using the wanding plugin.

## Commands

| Command | Use when |
|---------|---------|
| `/万鼎报价 <keywords_list>` | User provides a list of product descriptions, needs quotation matching |
| `/万鼎库存 <codes>` | User provides product codes, needs inventory lookup |
| `/万鼎填表 <file_path>` | User provides an Excel path, needs to fill in matched prices |

## Skills

Skills are auto-loaded on demand by Claude Code. You don't call them explicitly.

- `wanding-product-knowledge` —— Product taxonomy, spec conventions
- `wanding-customer-rules` —— Customer levels (A-E) and pricing rules

## Agent

`quotation-assistant` is available for multi-turn complex tasks. User invokes it via Task tool with description "万鼎报价助理..." or similar.

## Tools (MCP)

When you see `mcp__quotation__*` in available tools, the wanding plugin is loaded.

| Tool | Purpose |
|------|---------|
| `mcp__quotation__match_quotation` | Single keyword match |
| `mcp__quotation__match_quotation_batch` | Up to 50 keywords match |
| `mcp__quotation__get_inventory_by_code` | Single product code inventory |
| `mcp__quotation__get_inventory_by_code_batch` | Up to 50 codes inventory |
| `mcp__quotation__fill_quotation_sheet` | Fill Excel with matched prices |
| `mcp__quotation__parse_excel_smart` | Parse Excel into structured rows |
| `mcp__quotation__ask_clarification` | Ask user to clarify ambiguous match |

## Hard rules

- Never bypass PreToolUse hook for `fill_quotation_sheet` / `parse_excel_smart`. If a path is blocked, tell the user to add it to `userConfig.approved_paths`.
- Never call an LLM selector from inside MCP — Python returns candidates + business knowledge, **you** (Claude Code) pick the best one.
- Never show the full candidate list to the user unless they explicitly ask.
- Never write to paths outside the whitelisted directories.
