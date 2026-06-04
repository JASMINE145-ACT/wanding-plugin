# 端到端 install 测试

> 人工跑此 checklist。每步必须过。

## 前置

- [ ] 干净的 Claude Code 安装（无 wanding plugin）
- [ ] 团队成员有 `wanding-plugin` 仓库的 git clone 权限
- [ ] 本机 Python 3.11+、Bun 1.x、git 都装好
- [ ] 本机有 Accurate API 凭据（aol_token / aol_signature_secret）

## 步骤

### 1. 安装
- [ ] `claude plugin install https://github.com/YJC-IT/wanding-plugin.git`
- [ ] 弹窗里填：`python_executable`（留空即可）/ `aol_token` / `aol_database_id` / `aol_signature_secret` / `approved_paths`（默认即可）

### 2. 验证加载
- [ ] 重启 Claude Code
- [ ] 在 Claude Code 里输入 `/万鼎`，下拉列表出现 3 个命令
- [ ] 工具列表出现 `mcp__quotation__*` 7 个工具
- [ ] 技能列表出现 `wanding-product-knowledge` 和 `wanding-customer-rules`

### 3. 测试 `/万鼎报价`
- [ ] 输入 `/万鼎报价 PVC-U pipe DN25`（或类似）
- [ ] 返回至少 1 条 `[matched]` 结果
- [ ] 候选列表不直接展示（除非显式说"看候选"）

### 4. 测试 `/万鼎库存`
- [ ] 输入 `/万鼎库存 8010071381`
- [ ] 返回该 code 的可用库存与仓库库存

### 5. 测试 `/万鼎填表`
- [ ] 准备一个测试 Excel（含产品描述列）
- [ ] 输入 `/万鼎填表 <path>`（path 在白名单下）
- [ ] 工具正常解析 + 填表 + 报告
- [ ] 把 path 改成 `/tmp/foo.xlsx`（白名单外）
- [ ] 应该被 PreToolUse hook 阻止（退出码 2）

### 6. 测试 hooks
- [ ] `cat ~/.wanding/audit.log` 验证每步有 NDJSON 行
- [ ] `cat ~/.wanding/audit.log | head -1 | jq .tool` 能正确解析

### 7. 测试 agent
- [ ] 在 Claude Code 里说"用 quotation-assistant 帮我看这堆 xlsx"
- [ ] agent 启动，能用 MCP 工具
- [ ] 验证 agent 不能 Bash（试一下"运行 ls"，应该被工具白名单拦）

### 8. 测试升级
- [ ] 在 wanding-plugin 仓库改一个文件、commit + push
- [ ] `claude plugin update wanding`
- [ ] 验证改动生效

## 通过标准

所有 checkboxes 都打勾。任何一个失败，回到对应 Task 排查。
