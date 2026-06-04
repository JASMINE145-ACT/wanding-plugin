#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

OUT=$(mktemp)
echo '{"tool":"match_quotation","params":{"keywords":"PVC-U pipe DN25","customer_level":"B"}}' \
  | python "$ROOT/quotation-mcp/python/main.py" \
  > "$OUT" 2> /tmp/smoke-quote.err

# 验证
grep -q '"selection_context"' "$OUT" || { echo "FAIL: no selection_context"; cat "$OUT"; exit 1; }
grep -q '"wanding_business_knowledge"' "$OUT" || { echo "FAIL: no wanding_business_knowledge"; cat "$OUT"; exit 1; }
grep -q '"selection_owner"' "$OUT" || { echo "FAIL: no selection_owner"; cat "$OUT"; exit 1; }

rm -f "$OUT" /tmp/smoke-quote.err
echo "✓ smoke-quote passed"
