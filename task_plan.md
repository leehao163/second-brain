---
title: 第二大脑 Next.js 应用
date: 2026-04-17
status: planning
---

# 任务规划

## 项目目标
构建一个 Next.js 应用，展示我们在合作过程中创建的文档列表，类似于 Obsidian 和 Linear 的结合体验。

## 核心功能需求

1. **文档查看器**
   - Markdown 渲染
   - 代码高亮
   - 响应式设计
   - 搜索功能
   - 目录/侧边栏导航

2. **文档自动集成**
   - 自动扫描指定文件夹中的 .md 文件
   - 从 Obsidian vault 或其他目录导入
   - 实时更新文件列表

3. **分类和标签系统**
   - 基于 frontmatter 自动分类
   - 标签云/筛选
   - 分类页面

4. **每日日志**
   - 自动创建日志条目
   - 链接到相关文档
   - 时间线视图

5. **双向链接支持**
   - [[WikiLink]] 解析
   - 引用关系图
   - 反向链接面板

6. **主题设计**
   - Linear 风格：清爽、极简、深色/浅色主题
   - Obsidian 风格：色块、图标、美观的排版
   - 响应式布局

## 实施阶段

### Phase 1: 项目初始化 (1-2小时)
- [ ] 创建 Next.js 15 项目 (使用 App Router)
- [ ] 配置 Tailwind CSS
- [ ] 设置项目结构
- [ ] 配置 TypeScript

### Phase 2: 核心组件开发 (3-4小时)
- [ ] 布局组件：Sidebar, Header, Main
- [ ] Markdown 渲染组件 (使用 react-markdown)
- [ ] 代码高亮 (prism-react-renderer)
- [ ] 文件列表组件
- [ ] 搜索组件

### Phase 3: 高级功能 (3-4小时)
- [x] WikiLink 反向链接页面 - 显示引用该文档的所有文档
- [x] WikiLink 未找到处理 - 创建占位页面或重定向策略
- [x] 引用关系图 - 使用 mermaid.js 展示文档链接网络
- [x] 每日日志系统 - 自动生成、展示和链接日志条目
- [x] 文档关系 API - GET /api/backlinks/[slug], GET /api/graph-data
- **Status:** complete

### Phase 4: 主题和优化 (2-3小时)
- [ ] 深色/浅色主题切换
- [ ] 响应式设计
- [ ] 动画和过渡
- [ ] 性能优化

### Phase 5: 部署和测试 (1-2小时)
- [ ] 构建测试
- [ ] 环境配置
- [ ] 部署到 Vercel/Netlify

## 技术栈
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- react-markdown
- prism-react-renderer
- gray-matter (frontmatter)
- date-fns

## 预期输出
- 可运行的 Next.js 应用
- 文档: ~/second-brain/README.md
- 配置: 环境变量说明
- 演示: 访问 http://localhost:3000

---

## 关键决策点

1. **文件监控**：使用 chokidar 还是轮询？ → 推荐轮询（简单）
2. **搜索**：使用 flexsearch 还是 client-side？ → 客户端搜索
3. **图表**：用 mermaid-js 还是自定义 SVG？ → mermaid-js
4. **缓存**：MemoryCache 还是文件缓存？ → 内存缓存 + 热重载

---

## 风险和缓解

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
|大量 Markdown 渲染缓慢 | 用户体验差 | 虚拟滚动,分页 |
| 文件监控性能问题 | CPU 使用高 | 增量扫描, 防抖 |
| 图表渲染复杂 | 实现耗时 | 使用现成库,简化 |
| 移动端适配 | 响应式布局复杂 | 优先移动端设计 |

---

**Project Status:** Planning phase — 等待批准后开始实施
