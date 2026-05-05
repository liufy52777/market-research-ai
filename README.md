# Market Research AI

面向企业出海和行业分析场景的 AI 市场调研报告生成网站原型。

**线上访问地址：** [https://market-research-ai-six.vercel.app/](https://market-research-ai-six.vercel.app/)

**当前版本：** v0.1 本地模板生成版

---

## 项目简介

Market Research AI 帮助用户输入目标国家、行业、产品与调研目的，快速生成结构化的市场调研报告。报告涵盖执行摘要、市场概况、客户与需求分析、竞争格局、机会分析、风险分析及初步进入建议七个章节。

---

## 已完成功能

- 首页产品展示（浅色科技风）
- 市场调研输入页（5 个字段：国家/地区、行业、具体产品、企业身份、调研目的）
- 模板化调研报告生成（7 个章节，动态填入用户输入）
- 复制报告（一键复制完整文本到剪贴板）
- 重新填写（一键清空表单和报告）
- Markdown 导出（下载 .md 文件，含报告元信息）
- 示例报告页（摩洛哥汽车线束完整示例）
- 历史报告保存（自动存入 localStorage，最多 20 条）
- 历史报告列表（卡片展示、摘要预览）
- 历史报告详情页（完整报告阅读）
- 删除历史报告
- 顶部统一导航栏（4 个入口）
- 底部统一 Footer
- 浅色科技风 UI（毛玻璃卡片、渐变按钮、柔光背景）
- Vercel 在线部署

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 4 |
| UI 库 | React 19 |
| 持久化 | 浏览器 localStorage |
| 部署 | Vercel |
| 代码托管 | GitHub |

---

## 功能边界

- 当前报告内容为**模板生成结果**，尚未接入真实 AI 模型
- 尚未接入联网搜索与真实数据源
- 历史报告保存在浏览器 localStorage 中，**不会跨设备同步**
- 当前版本适合作为**功能原型和产品展示版本**

---

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 代码检查
npm run lint

# 生产构建
npm run build

# 启动生产模式（构建后）
npm run start
```

开发服务器启动后访问 [http://localhost:3000](http://localhost:3000)。

---

## 部署

项目已通过 GitHub + Vercel 部署。推送到 `main` 分支后 Vercel 会自动触发部署。

---

## 下一阶段计划

| 版本 | 目标 | 核心内容 |
|------|------|----------|
| v0.2 | 真实 AI 生成版 | 接入 AI 模型，动态生成报告内容 |
| v0.3 | 联网搜索与来源引用版 | 接入搜索 API，报告增加参考来源 |
| v0.4 | 用户与云端保存版 | 用户登录、数据库保存、跨设备同步 |
| v0.5 | 专业报告导出版 | PDF/Word 导出、模板风格选择、图表模块 |

---

## 项目文件结构

```
src/
  app/
    page.tsx              # 首页
    layout.tsx            # 根布局（Header + Footer）
    globals.css           # 全局样式（柔光背景）
    research/
      page.tsx            # 调研表单 + 报告生成
    example/
      page.tsx            # 示例报告
    history/
      page.tsx            # 历史报告列表
      [id]/
        page.tsx          # 历史报告详情
  components/
    SiteHeader.tsx        # 顶部导航栏
    SiteFooter.tsx        # 底部 Footer
```
