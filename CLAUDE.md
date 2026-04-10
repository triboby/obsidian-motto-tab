# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Obsidian 插件：自定义新标签页，显示时钟、问候语和每日一言（motto）。界面参考 code.html 设计，使用 CSS 渐变背景。

## Development Commands

```bash
pnpm build    # 构建插件
pnpm dev      # 开发模式（监听文件变化自动重构建）
```

## Project Structure

- `main.ts` - 插件主入口，注册视图（已移除设置界面）
- `src/ui.ts` - MottoView 视图，包含新 UI 布局和时钟更新逻辑
- `src/motto.ts` - 从 Vault 加载 motto 列表
- `src/greeting.ts` - 根据时间生成问候语
- `src/settings.ts` - 设置界面（保留但未使用）
- `styles.css` - 插件样式，包含渐变背景和新 UI 样式
- `manifest.json` - Obsidian 插件清单

## Key Implementation Notes

- 插件通过 `active-leaf-change` 事件监听，当打开新标签页（type='empty'）时，将其替换为自定义的 MottoView
- motto 从 YAML 文件（如 `.mottos.yaml`）加载
- 界面使用 CSS 渐变背景 (`linear-gradient(to bottom right, #1a1a2e, #16213e, #0f3460)`)
- 时钟每秒更新，需在 onClose 中清理 interval 防止内存泄漏
- 新建笔记按钮位于右上角