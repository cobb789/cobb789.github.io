---
layout: post
title: "tui-use：让 AI Agent 终于能控制交互式终端了"
date: 2026-04-09
author: Cobb
categories: [AI, Dev]
tags: [AI, Agent, Terminal, TUI, CLI, 开发工具]
pin: false
image: /assets/img/posts/tui-use-ai-agent-terminal.png
---

今天在 HN 上看到一个项目，解决了一个我一直觉得很痛的问题：**AI Agent 能跑 shell 命令，但碰到需要人类交互的程序就傻眼了**。

项目叫 [tui-use](https://github.com/onesuper/tui-use)，口号是"Like BrowserUse, but for the terminal"。BrowserUse 让 Agent 能控制浏览器，tui-use 让 Agent 能控制 REPL、调试器、vim、htop 这些交互式终端程序。

## Agent 的盲区

现在的 coding agent（Claude Code、Cursor、Codex 等）在执行 shell 命令时已经相当溜了。但有一类场景它们完全无能为力：

- Python 调试器 `pdb` 停在断点，等你输入命令
- Node REPL 等待你的下一行代码
- `vim` 或 `lazygit` 这样的全屏 TUI 应用
- 任何需要"等待人类输入"的交互式程序

Agent 执行 `python -i script.py` 进入交互模式后，就卡住了。它不知道程序在等输入，不知道屏幕上显示了什么，也不知道该按什么键。

这在实际工作中非常痛。比如你有一个科学计算脚本，跑了一小时才把几百万条数据加载到内存。中间出了问题想调试？对不起，Agent 帮不了你，因为它没法进入那个运行中的 Python 进程的交互环境。

## tui-use 怎么解决

核心思路很简单：在 PTY（伪终端）层做文章。

```
程序输出 → PTY → xterm 模拟器 → 渲染事件
                              → 每次变化重置 debounce 计时器
                              → 100ms 稳定 → wait 返回 ✓
```

tui-use 在 PTY 事件流上直接监听，用一个 headless xterm 模拟器处理所有输出。这意味着：

1. **ANSI 转义序列正确处理** —— 屏幕内容永远是干净的纯文本
2. **智能等待** —— `wait` 命令会阻塞直到屏幕稳定，不用瞎猜 `sleep 2`
3. **语义信号** —— `wait --text ">>>"` 等待特定提示符出现，比"安静了一会儿"更可靠

## 比 tmux send-keys 好在哪

tmux 是给人用的，不是给 Agent 用的。

`tmux send-keys` 最大的问题是**没有反馈机制**。你发了键，但不知道程序什么时候处理完。Agent 只能盲猜：`sleep 2` 然后祈祷；或者疯狂轮询 `capture-pane`。

tui-use 的 `wait` 命令直接解决这个问题。它监听每一个渲染事件，只有屏幕真正稳定后才返回。不用 sleep，不用轮询。

还有个细节很赞：`highlights` 字段。很多 TUI 程序用反白表示当前选中项，tui-use 会自动提取这些高亮区域，Agent 不用自己解析文本去猜"哪个菜单项被选中了"。

## 实际用例

几个我觉得最有价值的场景：

**科学计算调试**

```bash
tui-use start "python -i heavy_computation.py"
tui-use wait --text ">>>"
tui-use type "print(large_array.shape)\n"
tui-use wait
tui-use snapshot
```

几百 MB 的 numpy 数组在内存里，不用 dump 到文件，不用重新跑，直接在 live session 里检查。

**交互式 git rebase**

```bash
tui-use start "git rebase -i HEAD~5"
tui-use wait
tui-use type "cwip\x1b:wq\n"  # 修改 commit message
tui-use wait
```

自动化那些"必须在编辑器里操作"的 git 流程。

**调试器会话**

```bash
tui-use start "python -m pdb buggy_script.py"
tui-use wait --text "(Pdb)"
tui-use type "n\n"  # next
tui-use wait --text "(Pdb)"
tui-use type "p some_variable\n"
tui-use snapshot
```

Agent 终于能单步调试、检查变量了。

## 架构简洁

tui-use 的实现很干净：一个 daemon 进程管理所有 PTY session，CLI 只是发命令。Session 在 CLI 调用之间持久化，这意味着你可以在不同的 Agent turn 之间保持同一个终端会话。

已经有 Codex 插件了，Claude Code、Cursor、Gemini CLI 也都能用。

## 我的看法

这个工具填补了一个真实的空白。BrowserUse 让 Agent 能操作 Web 界面，tui-use 让 Agent 能操作终端界面。两者结合，Agent 的能力边界又扩展了一圈。

当然也有局限：复杂的 TUI 交互（比如 vim 的 modal editing）还是需要精心设计 prompt 和 keystroke 序列。但至少技术层面的障碍扫清了。

---

如果你在多个 AI 模型之间频繁切换测试这类 Agent 工具，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）— 一个账号搞定 Claude、GPT、Gemini 等主流模型，省掉管理多个 API key 的麻烦。
