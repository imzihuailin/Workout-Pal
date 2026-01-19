# 健身计划APP 💪

一个简洁、易用的健身计划管理应用，帮你轻松创建和管理个人健身计划。无需注册，数据本地存储，打开即用。

<img
src="https://github.com/user-attachments/assets/9be06974-4821-4b06-905e-e15c1b28ab4b" width="300" />


## 🌐 在线访问

**主域名（推荐）**: [https://workoutpal.fit](https://workoutpal.fit)  
*通过 GitHub Pages + 自定义域名，无需备案即可使用*

**GitHub Pages**: [https://imzihuailin.github.io/Workout-Pal](https://imzihuailin.github.io/Workout-Pal)

**阿里云 OSS（国内访问更快）**: 
- 如果域名已备案，可通过自定义域名访问：`https://workoutpal.fit`
- 如果域名未备案，可使用 OSS 默认域名访问（格式：`https://你的存储桶名.地域.aliyuncs.com`）
  - 例如：`https://workoutpal-fit.oss-cn-hangzhou.aliyuncs.com`
  - 在 OSS 控制台的存储桶概览页面可以找到默认域名

> 💡 **提示**：域名 `workoutpal.fit` 可以立即用于 GitHub Pages（无需备案），详见 [USE_DOMAIN_ON_GITHUB_PAGES.md](./USE_DOMAIN_ON_GITHUB_PAGES.md)

- ✅ 无需注册，打开即用
- ✅ 支持移动端访问
- ✅ 数据本地存储，保护隐私
- ✅ 界面简洁，操作直观
- ✅ 国内可访问（阿里云 OSS）

## ✨ 功能特性

- **多计划管理** - 创建和管理多个健身计划
- **动作记录** - 为每个计划添加动作，记录组数、次数、重量、RPE
- **查看与编辑** - 查看模式清晰展示计划，编辑模式快速修改
- **本地存储** - 数据保存在浏览器本地，无需云端同步
- **移动友好** - 响应式设计，手机和电脑都能舒适使用
- **简洁界面** - 清爽的界面设计，专注内容本身

## 📖 如何使用

1. **创建计划** - 在首页输入计划名称，点击"添加计划"
2. **查看计划** - 点击计划卡片进入查看模式，浏览所有动作和参数
3. **编辑计划** - 在查看模式下点击"编辑"按钮，可以：
   - 修改计划名称
   - 添加新动作（输入动作名称、组数、次数、重量、RPE）
   - 点击已有动作进行编辑
   - 删除不需要的动作
4. **删除计划** - 在编辑模式下点击右上角"删除计划"

所有操作都会自动保存，关闭浏览器后再次打开，数据依然存在。

## 🛠️ 技术栈

- **React** - 用户界面框架
- **Vite** - 快速构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **Local Storage** - 浏览器本地存储

## 💻 开发者指南

### 安装

```bash
npm install
```

### 运行

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 部署

本项目已配置为**双平台自动部署**：
- **GitHub Pages**：自动部署到 GitHub Pages（保留原有功能）
- **阿里云 OSS**：自动部署到阿里云 OSS，国内访问更快

**自动部署流程：**

1. **推送代码到 `master` 分支**
   - GitHub Actions 会自动触发构建和部署
   - 同时部署到 GitHub Pages 和阿里云 OSS

2. **访问网站**
   - 主域名：`https://workoutpal.fit`（阿里云 OSS，国内访问更快）
   - GitHub Pages：`https://你的用户名.github.io/Workout-Pal`

**首次配置阿里云部署：**

如果你是第一次配置阿里云部署，请按照 [DEPLOY_ALIYUN.md](./DEPLOY_ALIYUN.md) 中的详细步骤进行配置。

**部署配置：**
- 构建命令：`npm run build`
- 输出目录：`dist`
- 基础路径：`/`（根路径）
- 自动部署：推送到 `master` 分支时自动触发
- 工作流文件：`.github/workflows/deploy.yml`
