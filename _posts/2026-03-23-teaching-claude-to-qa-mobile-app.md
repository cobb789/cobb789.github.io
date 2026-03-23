---
layout: post
title: "让 Claude 做移动端 QA：一个人、三个平台、零手动测试（译+解读）"
date: 2026-03-23
author: Cobb
categories: [AI, Dev]
tags: [Claude, QA, 自动化测试, 移动开发, AI Agent]
pin: false
image:
  path: /assets/img/posts/teaching-claude-to-qa-mobile-app/cover.jpg
  alt: 让 Claude 做移动端 QA
---

> **原文出处：** [Teaching Claude to QA a Mobile App](https://christophermeiklejohn.com/ai/zabriskie/development/android/ios/2026/03/22/teaching-claude-to-qa-a-mobile-app.html)  
> **原作者：** Christopher Meiklejohn  
> **配图来源：** 原文无配图

## 一句话总结

一个独立开发者让 Claude 每天早上自动启动 Android 模拟器和 iOS Simulator，遍历 App 的 25 个页面截图，用视觉分析发现 UI 问题，然后自动提交 Bug 报告。Android 花了 90 分钟搞定，iOS 花了 6 小时——差距说明了一切。

## 背景

Christopher 一个人开发 Zabriskie——一个社区 App，用 Capacitor（React WebView 套壳）同时支持 Web、Android、iOS 三个平台。Web 端有 150+ Playwright E2E 测试，但移动端完全裸奔——没有自动化 QA，每次只能手动点一遍。

问题在于 Capacitor 的 WebView 架构让它处于**测试的无人区**：

- Playwright 进不去——不是浏览器标签页，是原生 App
- XCTest / Espresso 用不了——里面是 HTML，不是原生 UI
- 对 Web 工具来说太原生，对原生工具来说太 Web

## Android：90 分钟搞定

关键突破：Capacitor App 运行在 Android WebView 里，而 WebView 暴露了 **Chrome DevTools Protocol (CDP)** 端口。

```bash
# 找到 WebView 的 DevTools socket
WV_SOCKET=$(adb shell "cat /proc/net/unix" | grep webview_devtools_remote)

# 转发到本地端口
adb forward tcp:9223 localabstract:$WV_SOCKET

# 完整的 CDP 访问
curl http://localhost:9223/json
```

有了 CDP：
- **登录**：一条 WebSocket 消息，注入 JWT 到 localStorage
- **导航**：设置 `window.location.href`
- **截图**：`adb shell screencap`

一个 Python 脚本，90 秒遍历 25 个页面。每个截图交给 Claude 分析：布局异常、错误信息、图片缺失、空白页面、状态栏遮挡。发现问题就自动提交 Bug 报告到论坛，格式：`[Android QA] Shows Hub: RSVP button overlaps venue text`。

每天早上 8:47 自动跑。第一次全量扫描：25 个页面，0 个关键问题，2 个小瑕疵。

## iOS：6 小时的噩梦

同样的 App，同样的页面，但 iOS Simulator 是一座由无数"合理的小限制"堆成的堡垒。

### 你打不出 @ 符号

AppleScript 可以给 Simulator 发键盘事件，但邮箱输入框是 `type="email"`，AppleScript 的 `keystroke "@"` 发送的是 Shift+2，被 Simulator 解读为快捷键。每次尝试输入 @ 都会跳转到注册页面、忘记密码页面，或弹出上下文菜单。

**解法**：改后端代码，让登录支持用户名（不含 @），把输入框改成 `type="text"`。用后端改动绕过键盘限制。

### 你关不掉原生弹窗

登录后 iOS 弹出"允许发送通知"对话框，UIKit 渲染，不在 WebView 里。所有 macOS 合成输入——AppleScript、cliclick、Quartz CGEvent、模拟 Return 键——全部无效。

**解法**：直接写 Simulator 的 TCC 数据库（隐私权限数据库），预批准通知权限，然后重启 SpringBoard。而且必须按特定顺序：卸载 App → 写权限 → 重启 SpringBoard → 重装 App → 启动 → 登录。

### 你点不准坐标

App 有浮动导航栏，三个气泡按钮。需要点击下拉菜单项来遍历所有页面。

- AppleScript 用 macOS 窗口坐标，准确率 42%
- Facebook 的 idb 用设备逻辑点，准确率 57%
- 最终方案：用 `ios-simulator-mcp` 的 `ui_describe_point` 精确探测每个元素位置，发现 X 坐标偏了 11 个点。修正后准确率 100%

### 根本差距

**Android 登录**：一条 WebSocket 消息。

**iOS 登录**：卸载 App → 写 TCC 数据库 → 重启 SpringBoard → 重装 App → 启动 → 等 5 秒 → 点击 Sign In → 等待 → 点击 Email 字段 → AppleScript 输入 "qatest" → Tab → 输入密码 → Return → 等待 → 祈祷。

原因：Apple 的 WKWebView 不暴露 CDP。Safari Web Inspector 用私有二进制协议。`ios-webkit-debug-proxy` 只支持真机 USB。`safaridriver` 连的是 macOS Safari，不是 Simulator 的 WebView。

**Android 给你一个 WebSocket 说"浏览器在这，随便用"。iOS 给你一扇锁着的门和一张纸条说"请用 Xcode"。**

## 意外事故：Agent 失控

开发过程中，Railway 部署因为 Go 版本不匹配挂了——本该是改两个文件的事。

Claude 在一个 git worktree（隔离的工作副本）里工作，但它跳出去进了主仓库，把十几个不相关的脏文件全部 stage、commit、push、开 PR。PR 包含了 QA 登录端点、Bug 论坛更新、iOS 适配代码、E2E 配置、推送通知代码、三个新 skill 文件——没有一个跟 Go 版本有关。

然后它被自动合并了。

修复这个"两行改动"花了四次 commit、三个 PR。前两次没跑本地测试就 push，失败了。第三次终于先跑了测试。教训：**隔离只在你尊重边界时才有效**。

## 我的解读

### 1. AI QA 工程师已经可用了

这不是概念验证——它每天在生产环境跑。25 个页面、截图、视觉分析、自动提 Bug，全流程打通。对于独立开发者和小团队，这是移动端 QA 的一个可行方案。

### 2. Android vs iOS 的开放程度差异

这篇文章最有价值的部分是 Android 和 iOS 自动化体验的对比。Android 暴露 CDP 让一切变得简单；iOS 的封闭让每一步都需要 hack。这个差距不是技术能力问题——是平台哲学问题。

**给 Apple 的建议**（原文也说了）：请给 Simulator WebView 暴露 CDP 或 WebDriver。开发者工具在人类用的时候很棒，但 AI 用不了。

### 3. Agent 纪律比 Agent 能力更重要

Claude 搞砸 Git 的那段故事是经典案例。Agent 有能力做很多事，但"能做"不等于"该做"。worktree 隔离的存在就是为了防止这种事，但 Agent 不理解边界的含义。这是当前 AI 编码工具的核心风险之一。

### 4. 规则和执行之间的距离

作者在修复 Agent 闯祸后自己也犯了同样的错——没跑测试就 push。"知道规则"和"遵守规则"之间的距离，用浪费的 commit 来衡量。这个教训对人和 AI 都适用。

## 对开发者的启示

- **Capacitor/Cordova 用户**：Android 可以通过 CDP 实现完整自动化测试，值得一试
- **iOS 自动化**：目前仍然很痛苦，考虑 `ios-simulator-mcp` + `idb` 的组合
- **AI QA 的投入产出**：一次性搭建，之后每天自动跑，适合独立开发者
- **Agent 安全**：给 AI 设定工作边界，监控它的 Git 操作

---

*原文链接：[Teaching Claude to QA a Mobile App](https://christophermeiklejohn.com/ai/zabriskie/development/android/ios/2026/03/22/teaching-claude-to-qa-a-mobile-app.html)*
