---
layout: post
title: "Claude Code 隐藏技能全解锁：15 个你可能不知道的快捷命令"
date: 2026-03-23
author: Cobb
categories: [AI, Dev]
tags: [Claude, Claude Code, AI编程, 开发工具, 效率]
pin: false
image:
  path: /assets/img/posts/claude-code-slash-commands-guide/cover.jpg
  alt: Claude Code 快捷命令指南
---

你用 Claude Code 写代码，但你真的会用它吗？

大多数人只会在终端里输入自然语言让 Claude 干活。但 Claude Code 内置了一整套 `/` 快捷命令系统，从上下文管理到并行重构，从会话分支到自动巡检——很多功能藏得很深，官方文档都不一定能一眼看全。

这篇文章整理了 **15 个最实用的快捷命令**，按使用场景分类，每个都附带实际用法。

## 一、上下文管理

### 1. `/compact` — 压缩对话，释放上下文

```
/compact
/compact 只保留数据库相关的讨论
```

对话太长、上下文快满了？`/compact` 会智能压缩历史对话，保留关键信息。加参数可以指定保留哪部分内容，比如"只保留架构讨论"。

**什么时候用：** 长对话中 Claude 开始"忘事"，或者 `/context` 显示上下文快满了。

### 2. `/context` — 可视化上下文使用情况

```
/context
```

用彩色网格显示当前上下文的使用情况，还会给出优化建议——哪些工具占用太多、有没有 memory 膨胀、容量是否告急。

**什么时候用：** Claude 响应变慢或回答质量下降时，先看看上下文是不是炸了。

### 3. `/clear` — 清空对话重新开始

```
/clear
```

别名：`/reset`、`/new`。清空当前对话历史，释放全部上下文。适合切换到完全不同的任务时使用。

## 二、会话控制

### 4. `/branch` — 会话分支，平行宇宙

```
/branch experiment-v2
```

别名：`/fork`。在当前对话的某个节点创建一个分支。想试一个不同的方案但不想丢掉当前进度？分支出去试，不行就切回来。

**什么时候用：** "这个方案我不确定行不行，先试试"——分支比撤回安全得多。

### 5. `/btw` — 插一句题外话

```
/btw Node.js 的 Buffer.from 和 Uint8Array 有什么区别？
```

在不打断当前对话的情况下问一个无关问题。这个问题不会加入对话历史，不会污染上下文。

**什么时候用：** 正在让 Claude 重构代码，突然想查个 API 用法，但不想打断它的思路。

### 6. `/effort` — 调节思考深度

```
/effort low      # 简单问题，快速回答
/effort high     # 复杂问题，深度思考
/effort max      # 全力以赴（仅 Opus 4.6）
/effort auto     # 恢复默认
```

控制 Claude 的"用力程度"。`low/medium/high` 会跨会话保持，`max` 只在当前会话生效（需要 Opus 4.6）。**修改立即生效**，不需要等当前回复结束。

**什么时候用：** 简单的代码格式化用 `low`，复杂的架构设计用 `high`，能省不少 token。

## 三、代码工作流

### 7. `/diff` — 交互式 diff 查看器

```
/diff
```

打开一个交互式 diff 界面，显示未提交的改动和每个 Claude 回合的变更。左右键切换"当前 git diff"和"单次 Claude 操作的 diff"，上下键浏览文件。

**什么时候用：** Claude 改了一堆文件，想快速审查每一步改了什么。

### 8. `/pr-comments` — 拉取 PR 评论

```
/pr-comments
/pr-comments https://github.com/org/repo/pull/123
```

自动检测当前分支的 PR 并拉取评论，或者指定 PR URL。需要 `gh` CLI。

**什么时候用：** Code Review 收到反馈后，直接让 Claude 看评论然后修。

### 9. `/batch` — 并行大规模重构

```
/batch 把 src/ 下所有组件从 Class 改成 Hooks
/batch migrate src/ from Solid to React
```

这是一个 **bundled skill**（内置技能），不是普通命令。它会：
1. 分析代码库，把任务分解成 5-30 个独立单元
2. 给你看计划，等你批准
3. 每个单元起一个独立 agent，在隔离的 git worktree 里执行
4. 每个 agent 完成后跑测试，开 PR

**什么时候用：** 大规模迁移、批量修改。一个人改 30 个文件要一天，`/batch` 并行搞可能 10 分钟。

### 10. `/simplify` — 自动代码审查 + 优化

```
/simplify
/simplify focus on memory efficiency
```

另一个 bundled skill。自动检查你最近改过的文件，找代码复用、质量和效率问题。它会 **并行起三个审查 agent**，汇总发现的问题，然后自动修复。

**什么时候用：** 写完一堆代码，发布前让它扫一遍。比自己 review 快，还能发现盲点。

## 四、环境与配置

### 11. `/doctor` — 诊断安装问题

```
/doctor
```

检查 Claude Code 的安装和配置是否正常。网络、认证、权限、MCP 服务器连接状态——一条命令全查。

**什么时候用：** Claude Code 行为异常、连接失败、工具不可用时先跑一次。

### 12. `/memory` — 管理记忆文件

```
/memory
```

编辑 `CLAUDE.md` 记忆文件，开启/关闭 auto-memory，查看自动记忆的条目。CLAUDE.md 是 Claude Code 的"长期记忆"，项目约定、偏好、架构决策都可以写在里面。

**什么时候用：** 项目刚开始时写 CLAUDE.md，或者发现 Claude 老是忘记某个约定。

### 13. `/init` — 项目初始化向导

```
/init
```

为项目初始化一个 `CLAUDE.md` 文件。设置 `CLAUDE_CODE_NEW_INIT=true` 可以启动交互式流程，一步步配置 skills、hooks 和个人记忆文件。

**什么时候用：** 新项目的第一件事。好的 CLAUDE.md = 好的 Claude Code 体验。

## 五、实用工具

### 14. `/copy` — 复制回复到剪贴板

```
/copy          # 复制最近一条回复
/copy 2        # 复制倒数第二条
```

当回复中有代码块时，会弹出交互式选择器，让你选复制整条回复还是某个代码块。

**什么时候用：** 想把 Claude 生成的代码片段粘贴到其他地方。

### 15. `/loop` — 定时循环执行

```
/loop 5m check if the deploy finished
/loop 30s run tests and report status
```

Bundled skill。在会话保持打开的情况下，按指定间隔重复执行一个 prompt。

**什么时候用：** 盯部署、监控 CI、定期检查 PR 状态——让 Claude 替你守着。

## 附赠：其他值得知道的命令

| 命令 | 用途 |
|------|------|
| `/fast` | 切换 fast mode，用更快的模型回答简单问题 |
| `/model` | 切换模型，左右键调整 effort level |
| `/export` | 导出当前对话为纯文本 |
| `/color` | 给 prompt bar 换颜色（多会话区分用） |
| `/desktop` | 把当前会话转到桌面端继续 |
| `/hooks` | 查看 hook 配置（工具调用前后的自定义脚本） |
| `/insights` | 生成使用报告，分析你的编码模式和摩擦点 |
| `/permissions` | 管理工具权限 |
| `/remote-control` | 让 claude.ai 远程控制当前会话 |
| `/chrome` | 配置 Chrome 集成，做 Web 自动化和测试 |

## 自定义命令：Skills 系统

以上都是内置的。Claude Code 还支持你 **创建自己的 `/` 命令**——这就是 Skills 系统。

在 `~/.claude/skills/deploy/SKILL.md` 创建一个文件，就能用 `/deploy` 调用它。Skills 遵循 [Agent Skills](https://agentskills.io) 开放标准，可以跨工具使用。

```yaml
# ~/.claude/skills/deploy/SKILL.md
---
name: deploy
description: Deploy the application to production
disable-model-invocation: true
---

部署应用：
1. 运行测试套件
2. 构建应用
3. 推送到部署目标
```

Skills 的存放位置决定了作用范围：

| 位置 | 路径 | 作用范围 |
|------|------|---------|
| 个人 | `~/.claude/skills/<name>/SKILL.md` | 你的所有项目 |
| 项目 | `.claude/skills/<name>/SKILL.md` | 仅当前项目 |
| 企业 | managed settings | 组织内所有人 |

## 最后

Claude Code 不只是一个能写代码的 AI——它是一个完整的开发环境。这些命令是它的"键盘快捷键"。

我的建议：不用一次全记住。先把 `/compact`、`/context`、`/diff` 三个用起来，这三个解决 80% 的痛点。然后遇到具体场景再回来查。

---

*数据来源：[Claude Code 官方文档](https://code.claude.com/docs/en/commands)*
