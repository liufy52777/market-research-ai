# 项目状态

## 当前阶段

**v0.2 增强版 — AI 模型生成 + 联网搜索**

当前阶段已完成，处于 MVP 到增强版过渡期。

## 线上地址

[https://market-research-ai-six.vercel.app/](https://market-research-ai-six.vercel.app/)

---

## 已完成功能

### 首页
- 浅色科技风 UI，蓝紫渐变光晕背景 + 点阵纹理
- Hero 区左右分栏：左侧标题 + 按钮组，右侧 Dashboard 预览卡片
- Dashboard 包含 KPI 卡片（4 项）、折线图（2021-2028 市场规模）、环形图（细分市场占比）
- 三张功能卡片：结构化报告、适合出海调研、可持续升级
- 背景装饰波浪线（双层 SVG）和光晕层
- 导航栏（4 个入口 + 开始使用按钮）+ 页脚

### 调研与报告生成
- 表单页（5 个字段）：目标国家/地区、行业、具体产品、企业身份、调研目的
- API 路由 `/api/generate-report` 调用阿里云百炼 DashScope Qwen 模型
- 支持联网搜索增强（`enable_search`），报告包含搜索来源
- 未配置 API Key 时回退 mock 模板并显示警告
- API 异常时返回 502 错误，不做静默回退

### 报告展示与操作
- 报告预览区显示：生成模式、模型名称、联网状态、生成时间
- ReportRenderer 组件解析 markdown 风格文本为结构化 JSX（标题层级、列表、表格）
- ScoreRadarChart：五维雷达图（市场需求、进入门槛、竞争压力、供应链匹配度、中国企业机会）
- MarketVisualization：六维关键词评分 + 六边形雷达图 + 综合评分仪表盘 + 维度详情进度条
- 资料来源展示（可点击链接）
- 复制报告（一键复制到剪贴板）
- 导出 Markdown（含元信息头部和资料来源）
- 重新填写（清空表单和结果）

### 历史报告
- localStorage 保存（key: `market-research-reports`，最多 20 条）
- 历史列表页：卡片展示，含标签（国家、行业、产品、模型、联网状态）
- 历史详情页：完整报告、可视化分析、资料来源
- 复制完整报告、导出 Markdown、删除报告
- 存储字段：id, title, country, industry, product, role, purpose, reportText, createdAt, mode, model, warning, webSearchEnabled, sources

### 示例报告
- 内置示例报告展示完整功能，不包含虚构具体数据

### UI 与部署
- 浅色科技风 SaaS 风格，毛玻璃卡片、渐变按钮、柔光背景
- 所有 SVG 图表原生实现，零外部图表库依赖
- 响应式布局（桌面端为主，移动端自适应）
- GitHub 仓库托管 + Vercel 自动部署

---

## 环境变量

| 变量名 | 用途 | 默认值 |
|--------|------|--------|
| `DASHSCOPE_API_KEY` | 阿里云百炼 API Key | 无（未配置时回退模板） |
| `BAILIAN_MODEL` | 模型名称 | `qwen3.5-flash` |

---

## 已知限制

1. **搜索来源仍需增强** — 当前依赖百炼内置搜索，来源数量和覆盖度有限
2. **报告质量取决于 AI** — 属于初步市场调研辅助，不等同于正式咨询报告
3. **无用户系统** — 历史报告仅存于浏览器 localStorage，不支持跨设备同步
4. **无数据库** — 无法持久化存储和服务端管理
5. **无导出格式** — 仅支持 Markdown 导出，不支持 PDF / Word
6. **Vercel 国内访问** — 部分国内用户访问可能不稳定
7. **搜索来源验证** — 部分场景下联网搜索可能未返回结果

---

## 当前文件结构

```
src/
  app/
    page.tsx                  # 首页（Hero + Dashboard 预览 + 功能卡片）
    layout.tsx                # 根布局
    globals.css               # 全局样式
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

## 下一阶段

**v0.3：增强联网搜索与来源引用能力**

- 优化搜索策略，提高来源覆盖度
- 增强来源引用展示格式
- 增加事实核验提示
- 报告信息可信度标注

详见 [ROADMAP.md](./ROADMAP.md)。
