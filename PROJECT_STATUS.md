# 项目状态

## 当前阶段

**v0.2 真实 AI 生成版（阿里百炼 Qwen）**

当前阶段已完成。

## 线上地址

[https://market-research-ai-six.vercel.app/](https://market-research-ai-six.vercel.app/)

## 核心功能

1. 首页产品展示 —— 浅色科技风，三个功能卡片介绍产品价值
2. 市场调研输入页 —— 用户填写国家、行业、产品、企业身份、调研目的
3. **AI 报告生成** —— 接入阿里云百炼 DashScope Qwen 模型，动态生成 8 章节结构化报告
4. 报告操作 —— 复制报告、重新填写、导出 Markdown
5. 示例报告页 —— 摩洛哥汽车线束完整示例
6. 历史报告 —— 自动存入 localStorage，支持列表查看、详情阅读、删除
7. 历史详情页 —— 显示完整报告、生成模式、生成模型、警告信息
8. 统一导航 —— 顶部导航栏 + 底部 Footer 覆盖全站
9. 浅色科技风 UI —— 柔光背景、毛玻璃卡片、渐变按钮
10. AI 调用状态显示 —— 报告预览显示 mode、model、warning
11. AI 失败兜底 —— 接口异常时自动回退本地模板，并显示明确提示
12. Vercel 部署 —— 已上线，推送 main 分支自动更新

## 环境变量

| 变量名 | 用途 | 默认值 |
|--------|------|--------|
| `DASHSCOPE_API_KEY` | 阿里云百炼 API Key | 无（未配置时回退 mock） |
| `BAILIAN_MODEL` | 模型名称 | `qwen3.5-flash` |

## 已知限制

1. 未接入联网搜索，报告信息基于模型训练数据
2. 未接入数据库，历史报告仅存在当前浏览器的 localStorage 中
3. 不支持跨设备 / 跨浏览器同步
4. 不支持用户登录
5. 不支持 PDF / Word 导出
6. 不支持图表展示

---

## 全链路验收清单

### 本地开发验证

- [ ] `npm run lint` 通过
- [ ] `npm run build` 通过
- [ ] `npm run dev` 可正常启动
- [ ] `/research` 可提交表单
- [ ] 生成报告后显示 **生成模式** 标签（mode）
- [ ] 生成报告后显示 **模型** 标签（model）
- [ ] mode 为 `bailian-qwen` 时，说明真实调用阿里百炼成功
- [ ] mode 为 `mock-template-fallback` 时，页面显示黄色警告提示条
- [ ] mode 为 `mock-template` 时（未配置 API Key），显示对应提示
- [ ] 报告可以**复制**（navigator.clipboard）
- [ ] 报告可以**导出 Markdown**（下载 .md 文件）
- [ ] 报告自动保存到 localStorage（key: `market-research-reports`）
- [ ] `/history` 可查看历史报告列表
- [ ] 历史列表卡片点击进入 `/history/[id]` 详情页
- [ ] 历史详情页显示完整报告正文、mode、model、warning
- [ ] 历史详情页可复制报告和导出 Markdown
- [ ] 历史列表可删除报告

### localStorage 数据字段

每条历史报告保存以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 时间戳生成 |
| title | string | 国家 + 行业 + 产品 调研报告 |
| country | string | 目标国家/地区 |
| industry | string | 行业 |
| product | string | 具体产品 |
| role | string | 企业身份 |
| purpose | string | 调研目的 |
| reportText | string | 完整报告正文（8 章） |
| createdAt | string | 生成时间（中文格式） |
| mode | string | 生成模式（bailian-qwen / mock-template-fallback / mock-template） |
| model | string | 模型名称（如 qwen3.5-flash） |
| warning | string | 警告信息（仅 fallback 时有） |

### 线上部署验证

- [ ] GitHub push 到 main 分支后 Vercel 自动部署
- [ ] Vercel 环境变量 `DASHSCOPE_API_KEY` 和 `BAILIAN_MODEL` 已配置
- [ ] 线上网站可以生成真实 AI 报告（mode: bailian-qwen）
- [ ] 线上网站 `/history` 功能正常

---

## 下一阶段

**v0.3 联网搜索与来源引用版**

计划内容：
- 接入搜索 API
- 获取公开网页资料
- 报告中增加参考来源
- 增加事实核验提示
