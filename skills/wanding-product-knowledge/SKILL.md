---
name: wanding-product-knowledge
description: 万鼎产品分类与规格术语速查。当用户问到万鼎有什么产品、PPR 和 PVC-U 区别、规格怎么写、批号体系、材质代号等"产品概览"问题时触发。
---

# 万鼎产品知识

## 主营产品分类

- **PPR 冷热水管** (#E 系列)：dn20-dn160，主要做建筑给水
- **PVC-U 给水管** (#U 系列)：dn20-dn315
- **PVC-U 排水管** (#D 系列)：dn50-dn315
- **PVC-U 电工套管** (#C 系列)：dn16-dn50
- **PE 给水管** (#PE 系列)：dn20-dn500
- **HDPE 双壁波纹管** (#W 系列)：dn200-dn800，用于市政排水

## 规格术语约定

- "dn" 标公称外径（mm），不是内径
- "PN" 标压力等级（如 PN1.0 = 1.0 MPa）
- "S" 系列管（如 S5、S6.3）是 SDR 标准对应

## 常见歧义

- "50 管" 可能是 dn50 也可能是 2 寸（≈60mm）—— 必问
- "PPR" 不写 PN 默认按 PN1.6
- "国标" / "非标" 影响价格档位

## 品牌与代工

- 自主：**LESSO**（联塑）代工产品
- 自有：**Wanding 万鼎** 自主品牌（部分 PPR/PVC-U）

## 何时**不要**用本 skill

- 用户给具体 keywords 要求匹配报价 → 调 mcp__quotation__match_quotation，不读本 skill
- 用户给 product code 查库存 → 调 mcp__quotation__get_inventory_by_code
