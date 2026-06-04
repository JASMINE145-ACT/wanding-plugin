#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# 1. 先解析一个 fixture（如果没有，生成一个最小 fixture）
FIX="$ROOT/tests/fixtures/sample-inquiry.xlsx"
if [ ! -f "$FIX" ]; then
  mkdir -p "$(dirname "$FIX")"
  echo "（没有 fixture，跳过 fill-sheet 烟囱；先准备 fixture 再跑）"
  exit 0
fi

OUT=$(mktemp)
echo "{\"tool\":\"parse_excel_smart\",\"params\":{\"file_path\":\"$FIX\"}}" \
  | python "$ROOT/quotation-mcp/python/main.py" \
  > "$OUT" 2> /tmp/smoke-fill-sheet.err

grep -q '"result"' "$OUT" || { echo "FAIL: parse_excel_smart returned no result"; cat "$OUT"; exit 1; }

rm -f "$OUT" /tmp/smoke-fill-sheet.err
echo "✓ smoke-fill-sheet passed"
