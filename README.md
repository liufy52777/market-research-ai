# Market Research AI

面向企业出海与行业分析场景的 **AI 市场调研报告生成工具**。

线上地址：[https://market-research-ai-six.vercel.app/](https://market-research-ai-six.vercel.app/)

当前版本：**v0.2 增强版**（已接入 AI 模型与联网搜索）

---

## 项目简介

Market Research AI 帮助用户输入目标国家/地区、行业、具体产品、企业身份和调研目的，由 AI 模型实时生成结构化的市场调研报告。报告涵盖市场概况、客户结构、竞争格局、机会与风险分析、进入策略建议等章节，并包含市场可视化分析（雷达图、综合评分等）。

---

## 核心功能

- **AI 报告生成** — 接入阿里云百炼 DashScope Qwen 模型，支持联网搜索增强
- **结构化报告渲染** — 标题层级、表格、分节展示，排版清晰
- **市场可视化分析** — 六维雷达图、综合评分仪表盘、维度评分详情
- **Markdown 导出** — 一键下载 .md 文件，包含元信息和资料来源
- **历史报告管理** — localStorage 本地保存（最多 20 条），支持列表查看、详情阅读、复制、删除
- **示例报告** — 内置完整示例，展示报告结构和分析维度
- **科技风 UI** — 浅色渐变背景、毛玻璃卡片、SVG 图表、Dashboard 预览

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 4 |
| UI | React 19 |
| AI 模型 | 阿里云百炼 DashScope Qwen |
| 搜索增强 | 百炼内置联网搜索 |
| 图表 | 原生 SVG（折线图、环形图、雷达图） |
| 持久化 | 浏览器 localStorage |
| 部署 | Vercel |
| 代码托管 | GitHub |

---

## 本地运行

```bash
# 安装依赖
npm install

# 配置环境变量（创建 .env.local）
# DASHSCOPE_API_KEY=你的阿里云百炼 API Key
# BAILIAN_MODEL=qwen3.5-flash（可选，默认值）

# 启动开发服务器
npm run dev

# 代码检查
npm run lint

# 生产构建
npm run build
```

开发服务器启动后访问 [http://localhost:3000](http://localhost:3000)。

---

## 部署

项目通过 GitHub + Vercel 部署。推送 `main` 分支后 Vercel 自动触发构建。

需在 Vercel 环境变量中配置 `DASHSCOPE_API_KEY`，否则将回退到模板生成模式。

---

## 项目结构

```
src/
  app/
    page.tsx                  # 首页（Hero + Dashboard 预览 + 功能卡片）
    layout.tsx                # 根布局
    globals.css               # 全局样式（光晕背景、点阵）
    research/
      page.tsx                # 调研表单 + 报告生成
    example/
      page.tsx                # 示例报告
    history/
      page.tsx                # 历史报告列表
      [id]/
        page.tsx              # 历史报告详情
    api/
      generate-report/
        route.ts              # AI 报告生成 API
  components/
    SiteHeader.tsx            # 顶部导航栏
    SiteFooter.tsx            # 底部页脚
    ReportRenderer.tsx        # 报告正文渲染器
    ScoreRadarChart.tsx       # 五维雷达图
    MarketVisualization.tsx   # 六维市场可视化分析
  lib/
    types.ts                  # 共享类型定义
    storage.ts                # localStorage 读写工具
```

---

## 功能边界

- 报告为 AI 辅助生成的初步市场调研结果，不等同于正式咨询报告
- 历史报告保存在浏览器 localStorage，不支持跨设备同步
- Vercel 部署在国内访问可能不稳定
- API Key 通过环境变量管理，不可提交到 GitHub

---

## 路线图

| 版本 | 目标 | 状态 |
|------|------|------|
| v0.1 | 本地模板生成版 | 已完成 |
| v0.2 | AI 模型生成 + 联网搜索版 | 已完成 |
| v0.3 | 增强联网搜索与来源引用 | 计划中 |
| v0.4 | 优化报告结构与可视化模块 | 计划中 |
| v0.5 | 接入数据库与用户系统 | 计划中 |
| v0.6 | PDF / Word 导出 | 计划中 |
| v0.7 | 国内服务器部署 | 计划中 |
| v1.0 | 可交付产品原型 | 计划中 |

详见 [ROADMAP.md](./ROADMAP.md)。
