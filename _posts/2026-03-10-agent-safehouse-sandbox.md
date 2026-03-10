---
layout: post
title: "Agent Safehouse：本地 AI Agent 的沙箱革命"
date: 2026-03-10
author: Cobb
categories: [AI, Dev, Tools]
tags: [AI, Agent, LLM, security, sandbox, macOS, Claude]
pin: false
image: /assets/img/posts/agent-safehouse.png
---

作为 [OfoxAI](https://ofox.ai)（ofox.ai）的开发者，我每天都在和不同的 AI 模型打交道。Claude、GPT、Gemini、Kimi — 每个都有自己的脾气。但不管用哪个模型，有一个问题始终让我不安：**Agent 的权限边界在哪里？**

LLM 是概率性的。即使 99% 的情况下它表现完美，那 1% 的"幻觉"也足以造成灾难。当 Agent 能直接访问你的文件系统、SSH 密钥、AWS 凭证时，"Make no mistakes" 这样的 prompt 就像用胶带修大坝 — 心理安慰而已。

今天 HN 上 780+ 赞的 [Agent Safehouse](https://agent-safehouse.dev/) 给出了一个硬核答案：用 macOS 原生的沙箱机制，把 Agent 关进笼子里。

![Agent Safehouse 官网截图](/assets/img/posts/agent-safehouse.png){: w="700" }
_Agent Safehouse 的核心卖点：Go full --yolo. We've got you._

## Deny-First 的权限模型

传统的 Agent 工作流是这样的：你运行 `claude` 或 `aider`，它继承你当前用户的全部权限。它能读你的 `~/.ssh/id_ed25519`，能删你的 `~/Documents`，能往你的代码库里塞东西。

Safehouse 把这个模型彻底翻转：

```
~/my-project/read-write      ✅ 当前工作目录可读写
~/shared-lib/read-only       ✅ 工具链只读访问  
~/.ssh/denied                ❌ SSH 密钥完全隔离
~/.aws/denied                ❌ AWS 凭证不可见
~/other-repos/denied         ❌ 其他项目隔离
```

不是"默认开放，按需限制"，而是"默认拒绝，显式授权"。这是安全工程的基本原则，但大多数 Agent 工具完全无视了它。

## 实测：沙箱真的有用吗？

我试了一下 Safehouse 的演示场景：

```bash
# 尝试读取 SSH 私钥 — 被内核拒绝
safehouse cat ~/.ssh/id_ed25519
cat: /Users/you/.ssh/id_ed25519: Operation not permitted

# 尝试列出其他项目 — 不可见
safehouse ls ~/other-project
ls: /Users/you/other-project: Operation not permitted

# 但当前项目正常工作
safehouse ls .
README.md src/ package.json ...
```

注意这里的用词："Operation not permitted"、"invisible"。这不是应用层的限制，是 macOS 内核级的沙箱。Agent 进程根本看不到被隔离的文件，即使它想作恶也做不到。

![支持的 AI Agent 工具](/assets/img/posts/agent-safehouse-1.png){: w="400" }
_Safehouse 支持主流的 AI Agent 工具_

## 一个 shell 脚本搞定

Safehouse 的部署简单得离谱：

```bash
# 下载单个自包含脚本
mkdir -p ~/.local/bin
curl -fsSL https://raw.githubusercontent.com/eugene1g/agent-safehouse/main/dist/safehouse.sh \
  -o ~/.local/bin/safehouse
chmod +x ~/.local/bin/safehouse

# 运行 Agent
safehouse claude --dangerously-skip-permissions
```

没有依赖，没有 build 步骤，纯 Bash + macOS 原生工具。这种设计哲学我很欣赏：**安全不应该以牺牲易用性为代价**。

你也可以配置 shell alias，让所有 Agent 命令默认走 Safehouse：

```bash
# .zshrc
claude() { safehouse claude "$@"; }
aider() { safehouse aider "$@"; }
```

需要无沙箱运行时，用 `command claude` 绕过即可。

## 局限与思考

当然，Safehouse 不是银弹。

**macOS only。** 它依赖 macOS 的 Seatbelt 沙箱机制，Linux 用户暂时用不了。作者说 Linux 版本在计划中，但还没有时间表。

**Seatbelt 的局限。** Seatbelt 是为 App Store 应用设计的沙箱，功能不如 Linux 的 namespace/cgroup 灵活。比如它不能精细控制网络访问，也不能限制 CPU/内存资源。

**Agent 生态的碎片化。** Safehouse 目前支持 Claude Code、Aider、Goose 等主流工具，但 Agent 生态发展太快，新工具层出不穷。维护兼容性是个持续的负担。

但这些问题不影响核心判断：**Agent 需要沙箱，而且越早建立这个习惯越好。**

![Goose Agent 工具](/assets/img/posts/agent-safehouse-2.png){: w="400" }
_Block 开源的 Goose 也是 Safehouse 支持的工具之一_

## 为什么这很重要

AI Agent 正在从"玩具"变成"生产工具"。当 Agent 能自动提交代码、部署服务、修改配置时，它的权限边界就是安全边界。

现在的做法大多是"相信模型不会犯错" — 这在概率系统里是不成立的。Safehouse 的做法是"假设模型会犯错，但把破坏范围控制在最小"。

这是工程思维的差异。

长远来看，我期待看到：

- **标准化的 Agent 权限模型** — 类似 OAuth scope，Agent 申请权限，用户显式授权
- **细粒度的资源隔离** — 不只是文件系统，还有网络、环境变量、系统调用
- **可审计的 Agent 行为** — 记录 Agent 的所有操作，便于事后追溯

Safehouse 是一个开始，但肯定不是终点。

## 写在最后

如果你在用 AI Agent 做开发，我强烈建议试试 Safehouse。它不会让你的 Agent 变得更聪明，但会让你的开发环境变得更安全。

在这个 LLM 能力突飞猛进的时代，**安全不是可选项，是基础设施**。

---

**参考：** [Agent Safehouse](https://agent-safehouse.dev/) (HN 780+ points)
