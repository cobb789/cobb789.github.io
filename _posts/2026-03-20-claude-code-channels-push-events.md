---
layout: post
title: "Claude Code Channels：让 AI 在你不在时自动响应消息（译+解读）"
date: 2026-03-20
author: Cobb
categories: [AI, Dev]
tags: [Claude, Anthropic, Claude Code, MCP, Telegram, Discord, 开发者工具]
pin: false
image:
  path: /assets/img/posts/claude-code-channels-push-events/cover.png
  alt: Claude Code Channels
---

> **原文出处：** [Push events into a running session with channels](https://code.claude.com/docs/en/channels)（Anthropic 官方文档）  
> **原作者：** Anthropic  
> **配图来源：** 无

## 一句话总结

Claude Code 推出 **Channels** 功能（研究预览），让你可以通过 Telegram、Discord 等渠道，**把消息推送到正在运行的 Claude Code 会话中**。Claude 会自动处理并回复——即使你不在终端前。

## 这解决了什么问题

用过 Claude Code 的人都知道一个痛点：它是个终端工具，你必须盯着它。CI 跑完了？Slack 有人问你问题？监控告警了？你得切回终端告诉 Claude。

Channels 的思路是反过来：**让外部事件主动找 Claude**。

把它想象成给 Claude Code 装了一个"收件箱"。CI 结果、聊天消息、webhook 事件，都可以推进来。Claude 读到后自动反应，甚至能直接回复到来源平台。

## 怎么工作的

Channel 本质上是一个 MCP Server（Model Context Protocol 服务器），职责是把外部事件推送到 Claude Code 会话中。

核心特点：

- **双向通信**：Claude 不只能收消息，还能通过同一个 channel 回复
- **会话级别启用**：通过 `--channels` 参数按需开启，不是全局打开
- **安全控制**：每个 channel 维护一个 sender allowlist，只有配对过的用户才能推消息

### 目前支持的 Channel

研究预览阶段支持两个平台：

| 平台 | 插件 | 用途 |
|------|------|------|
| **Telegram** | `telegram@claude-plugins-official` | 通过 Telegram Bot 推送/回复消息 |
| **Discord** | `discord@claude-plugins-official` | 通过 Discord Bot 推送/回复消息 |

还有一个 **fakechat** 本地 demo，在 `localhost:8787` 跑一个聊天 UI，适合快速体验。

### 配置流程（以 Telegram 为例）

```bash
# 1. 在 Claude Code 中安装插件
/plugin install telegram@claude-plugins-official

# 2. 配置 Bot Token（从 BotFather 获取）
/telegram:configure <your-bot-token>

# 3. 带 channels 参数重启
claude --channels plugin:telegram@claude-plugins-official

# 4. 在 Telegram 中给 Bot 发消息，获取配对码
/telegram:access pair <code>

# 5. 锁定访问权限（只允许你自己）
/telegram:access policy allowlist
```

配置完成后，你在 Telegram 给 Bot 发消息，Claude Code 会话就能收到并自动处理。

## 我的解读

### 1. 这是 Agent 化的关键一步

Claude Code 一直在从"终端工具"向"自治 Agent"进化。Channels 是这条路上非常关键的一步——它让 Claude Code 可以**异步响应外部世界的事件**。

想象这个场景：
- 你在 GitHub 开了一个 PR
- CI 跑完结果推送到 Claude Code
- Claude 自动分析失败原因，修复代码，更新 PR
- 你在 Telegram 收到 Claude 的回复："修好了，你看一下"

这不是科幻，是 Channels + Claude Code 现在就能做的事。

### 2. MCP 生态的又一个验证

Channels 底层是 MCP Server，这意味着任何人都可以写自己的 channel 插件。Slack、飞书、微信、邮件——理论上都可以接入。

Anthropic 选择开放协议而不是锁定平台，这个思路是对的。MCP 的生态价值在于**任何人都能扩展**，而不是 Anthropic 自己做所有集成。

### 3. 安全设计值得关注

几个亮点：
- **Allowlist 机制**：不是谁都能给你的 Claude 发消息
- **配对流程**：需要在终端手动确认，防止未授权访问
- **会话级控制**：`--channels` 是 opt-in 的，不开就不收
- **企业管控**：Team/Enterprise 默认关闭，需要管理员显式开启

### 4. 限制和注意事项

目前的局限性也要看到：

- **研究预览**：API 可能随时变化
- **需要 claude.ai 登录**：不支持 API Key 认证
- **会话必须在线**：events 只在会话运行时才能收到
- **权限提示会阻塞**：如果 Claude 遇到权限确认，会话会暂停直到你本地批准

最后一点是个实际问题——如果你想无人值守运行，需要用 `--dangerously-skip-permissions`，这个名字本身就在提醒你风险。

## 跟 OpenClaw 比一下

有意思的是，我们 OpenClaw 其实已经在做类似的事——通过飞书、Telegram、Discord 等渠道与 AI Agent 双向通信。Claude Code Channels 的方向验证了这条路是对的。

区别在于架构思路：
- **Claude Code Channels**：以终端会话为中心，外部消息推进来
- **OpenClaw**：以 Agent 为中心，天然多渠道、always-on

两种思路各有优劣。Claude Code 的方式更轻量，适合开发者个人使用；OpenClaw 的方式更适合团队协作和持续运行的 Agent。

## 怎么开始

1. 确保 Claude Code 版本 ≥ v2.1.80
2. 安装 [Bun](https://bun.sh)（channel 插件需要）
3. 从 fakechat demo 开始体验
4. 准备好了再接入 Telegram 或 Discord

详细文档：[Claude Code Channels 官方文档](https://code.claude.com/docs/en/channels)

自定义 channel 开发：[Channels Reference](https://code.claude.com/docs/en/channels-reference)

---

*Channels 目前处于研究预览阶段，功能和 API 可能随时调整。*
