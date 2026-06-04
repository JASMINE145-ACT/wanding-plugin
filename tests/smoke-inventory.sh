#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

OUT=$(mktemp)
echo '{"tool":"get_inventory_by_code","params":{"code":"8010071381"}}' \
  | python "$ROOT/quotation-mcp/python/main.py" \
  > "$OUT" 2> /tmp/smoke-inventory.err

# 验证：必须有 result 字段（即使没有库存也返回 result: null）
grep -q '"result"' "$OUT" || { echo "FAIL: no result field"; cat "$OUT"; exit 1; }

rm -f "$OUT" /tmp/smoke-inventory.err
echo "✓ smoke-inventory passed"
