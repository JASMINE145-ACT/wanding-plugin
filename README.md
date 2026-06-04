# 万鼎 Plugin (wanding)

Claude Code 外部可安装 plugin：把 `wanding-quotation-mcp` + 3 个 slash command + 2 个业务知识 skill + 1 个 agent + 2 个安全 hook 一次性装上。

## 安装

```bash
claude plugin install https://github.com/YJC-IT/wanding-plugin.git
```

安装时弹窗填：
- **Python executable**（可选，留空则自动选）
- **AOL Access Token**（敏感、走 keychain；用于查库存）
- **AOL Database ID**（默认 `iris`）
- **AOL Signature Secret**（敏感、走 keychain）
- **Whitelisted directories**（默认 `~/Documents/wanding/`；fill_quotation_sheet 只写这里）

## 使用

### Slash commands
- `/万鼎报价 <keywords_list>` —— 批量匹配报价
- `/万鼎库存 <codes>` —— 批量查库存
- `/万鼎填表 <file_path>` —— 把 Excel 产品描述列自动填入价格

### Skills（自动按需触发）
- `wanding-product-knowledge` —— 万鼎产品分类与规格术语
- `wanding-customer-rules` —— 客户等级与价格规则

### Agent
- `quotation-assistant` —— 复杂多轮报价任务（用 Task 工具召唤）

## 升级

```bash
claude plugin update wanding
```

## 开发者

仓库结构、迁移清单、CI 流程见 [docs/superpowers/specs/2026-06-04-wanding-plugin-design.md](docs/superpowers/specs/2026-06-04-wanding-plugin-design.md)。

## 仓库组成

```
wanding-plugin/
├── plugin.json                 # manifest
├── commands/  skills/  agents/ hooks/  # plugin 壳
├── quotation-mcp/              # 整包搬入的 MCP server
│   ├── python/  data/  dist/  src/
│   └── ...
└── tests/                      # 单元 + 烟囱
```

## License

UNLICENSED — 内部团队用。
