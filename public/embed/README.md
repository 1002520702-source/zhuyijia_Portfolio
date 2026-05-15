# Code 区项目嵌入资源

每个 Code 项目占用一个子文件夹，放最终要在 lightbox iframe 里展示的网页。

## 目录约定

```
public/embed/
├─ frontend-001/         ← 项目 001
│   ├─ index.html
│   ├─ assets/
│   │   ├─ style.css
│   │   ├─ script.js
│   │   └─ img/、fonts/...
├─ frontend-002/
│   └─ index.html
└─ ...
```

## 放文件规则

1. **入口文件必须叫 `index.html`**（Vite 自动 fallback）
2. **所有引用必须用相对路径**：
   - ✅ `<link rel="stylesheet" href="./style.css">`
   - ✅ `<img src="./img/cat.jpg">`
   - ❌ `<link rel="stylesheet" href="/style.css">`（绝对路径会找到主站根目录而不是这里）
3. **依赖最好打包内嵌**：纯 HTML/CSS/JS 直接放。如果是 React/Vue 项目，先 build，把 `dist/` 内容拷进这里
4. **iframe sandbox 限制**：
   - 允许：scripts、forms、popups、modals、same-origin
   - 不允许：top-navigation（即 demo 内 `window.top.location` 改不了主站）
5. **资源大小建议**：单个 demo 整个文件夹 < 5MB

## 配置数据

打开 `src/data/codeProjects.ts`，对应项目的 `iframeUrl` 应该是：

```ts
iframeUrl: '/embed/frontend-001/index.html'   // 显式带 index.html，dev/prod 都稳
```

> 不要写 `/embed/frontend-001/`（不带文件名），Vite dev server 会把目录路径 fallback 到主站 SPA。

## 配套资源

- **封面图**：`public/covers/frontend-001.webp`（hover 之前的静态图）
- **预览视频**：`public/previews/frontend-001.mp4`（hover 时的循环）

详见根目录数据配置 `src/data/codeProjects.ts`。
