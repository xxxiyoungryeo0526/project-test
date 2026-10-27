# ESA CNAME 测试博客

这是一套可直接上传到 GitHub Pages 的纯静态个人博客。站点没有框架、构建工具、远程字体或第三方图片依赖，适合用作 ESA CNAME 接入的源站。

## 文件结构

```text
esa-cname-test-blog/
├── .nojekyll
├── index.html
├── about/
│   └── index.html
├── posts/
│   ├── index.html
│   ├── field-notes.html
│   └── quiet-tools.html
└── assets/
    ├── css/styles.css
    ├── js/main.js
    └── images/
        ├── canal-morning.svg
        ├── desk-notes.svg
        └── favicon.svg
```

站点覆盖以下测试对象：

1. 首页与多个 HTML 子页面。
2. 独立 CSS 样式表。
3. 独立 JavaScript 文件。
4. 两张正文用本地 SVG 图片和一个本地 favicon。
5. 多层目录中的相对路径与页面跳转。
6. 深浅主题切换、随机问候、当前年份与资源自检。

## 本地预览

直接双击 `index.html` 可以查看多数效果。首页的资源自检使用 `fetch`，需要通过本地 HTTP 服务运行。

在站点目录打开终端，执行：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000/
```

## 上传到 GitHub Pages

以下方法适合独立测试仓库，步骤最少。

1. 在 GitHub 新建一个 repository。GitHub Free 用户应使用 public repository。
2. 将本目录内的全部文件上传到仓库根目录。请保留 `.nojekyll`。
3. 打开 repository 的 `Settings`。
4. 在侧栏进入 `Pages`。
5. 在 `Build and deployment` 中，将 Source 设为 `Deploy from a branch`。
6. Branch 选择 `main`，Folder 选择 `/(root)`，然后保存。
7. 等待部署完成，在同一页面点击 `Visit site`。

项目站点通常使用以下地址：

```text
https://<GitHub用户名>.github.io/<仓库名>/
```

本项目全部使用相对路径，因此放在用户站点根目录或项目站点子目录均可工作。

GitHub 官方说明：

1. [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
2. [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 作为 ESA CNAME 源站时的建议

如果 ESA 需要填写回源 Host，请使用 GitHub Pages 实际能识别的 Host。使用 GitHub Pages 默认域名作为源站时，通常应填写 `<GitHub用户名>.github.io`。如果仓库绑定了 GitHub Pages 自定义域名，则按实际自定义域名配置。

ESA 端生成 CNAME 后，还需要在当前 DNS 服务商处为待加速子域配置该 CNAME，并在 ESA 控制台确认 CNAME Status 为 `Configured`。用于验证 ESA 加速的记录需要开启 proxy acceleration。

ESA 官方英文说明：

1. [Quick start: add a domain name to ESA](https://www.alibabacloud.com/help/en/edge-security-acceleration/esa/getting-started/add-your-website-to-esa)
2. [Website connection FAQ](https://www.alibabacloud.com/help/en/edge-security-acceleration/esa/support/site-access-related-issues)

## ESA CNAME 测试清单

建议分别通过 GitHub Pages 源站地址和 ESA 加速域名执行一次，并记录结果。

### 1. HTML 与页面跳转

1. 首页可以打开，状态码为 `200`。
2. 顶部导航可进入 `文章` 和 `关于`。
3. 两篇文章详情页都能打开。
4. 详情页可以返回文章列表，也能跳转到另一篇文章。
5. 地址栏路径和页面内容一致，没有 `404` 或错误重定向。

### 2. CSS

1. 页面呈暖色背景，首页为左右分栏布局。
2. 卡片具有圆角、边框和留白。
3. 缩小浏览器宽度后，内容变为单列布局。
4. 浏览器开发者工具的 Network 面板中，`assets/css/styles.css` 返回 `200`，Content-Type 应为 `text/css`。

### 3. JavaScript

1. 右上角主题按钮可以切换深浅模式。
2. 首页 `换一句问候` 按钮可以更新文字。
3. 页脚年份显示为当前年份。
4. 首页 JavaScript 状态显示为 `已加载`。
5. `assets/js/main.js` 返回 `200`，Content-Type 应为 JavaScript 类型。

### 4. 图片

1. 首页首屏运河插画完整显示。
2. 第二篇文章卡片的桌面插画完整显示。
3. 子页面内的图片也能显示，证明上级目录相对路径正常。
4. 两个 SVG 请求均返回 `200`，Content-Type 应为 `image/svg+xml`。

### 5. 首页资源自检

点击首页的 `运行资源检查`。

预期结果：

```text
本地图片：全部正常
CSS 与子页面：6 / 6 正常
```

它会从当前域名请求：

1. `assets/css/styles.css`
2. `assets/js/main.js`
3. `assets/images/canal-morning.svg`
4. `assets/images/desk-notes.svg`
5. `posts/`
6. `about/`

### 6. ESA 与 DNS

1. 待加速子域的 CNAME 解析值与 ESA 分配值一致。
2. ESA 控制台的 CNAME Status 为 `Configured`。
3. 对应记录已开启 proxy acceleration。
4. `dig <你的加速域名>` 或 `nslookup <你的加速域名>` 能返回解析结果。
5. 开发者工具中首页、CSS、JS、SVG 和子页面均从加速域名加载。
6. 首次请求和重复请求都成功，没有证书错误、重定向循环或混合内容警告。
7. 用 ESA 的 IP Address Ownership 工具检查请求 IP，结果应归属于 ESA。
8. 如当前套餐支持 Instant Logs，可打开监控后刷新站点，确认出现对应请求日志。

## 常见异常定位

| 现象 | 优先检查 |
| --- | --- |
| 首页正常，样式完全丢失 | CSS 请求状态、Content-Type、路径重写规则 |
| 首页正常，按钮无反应 | JS 请求状态、Content-Type、Console 报错 |
| 首页图片正常，子页面图片失败 | 相对路径、URL 重写或回源路径 |
| 首页正常，子页面 404 | 目录索引支持、尾部斜杠重定向、回源 Host |
| 加速域名证书报错 | ESA 边缘证书状态、域名覆盖范围、HTTPS 配置 |
| CNAME 已配置但无 ESA 流量 | proxy acceleration 状态、DNS 传播、CNAME 值 |
| GitHub Pages 返回 404 | 发布分支与目录、入口 `index.html`、仓库 Pages 状态 |

## 测试记录模板

```text
测试时间：
源站地址：
ESA 加速地址：
DNS 解析：通过 / 失败
首页 HTML：通过 / 失败
CSS：通过 / 失败
JavaScript：通过 / 失败
本地图片：通过 / 失败
文章列表：通过 / 失败
文章详情：通过 / 失败
关于页面：通过 / 失败
深浅主题切换：通过 / 失败
首页资源自检：通过 / 失败
HTTPS 证书：通过 / 失败
ESA 节点验证：通过 / 失败
备注：
```
