# 健身计划APP 💪

一个简洁、易用的健身计划管理应用，帮你轻松创建和管理个人健身计划。无需注册，数据本地存储，打开即用。

<img
src="https://github.com/user-attachments/assets/9be06974-4821-4b06-905e-e15c1b28ab4b" width="300" />


## 🌐 在线访问

**立即使用**: [https://imzihuailin.github.io/Workout-Pal](https://imzihuailin.github.io/Workout-Pal)

> 注意：请将链接中的"你的用户名"替换为你的 GitHub 用户名

- ✅ 无需注册，打开即用
- ✅ 支持移动端访问
- ✅ 数据本地存储，保护隐私
- ✅ 界面简洁，操作直观
- ✅ 国内可访问（GitHub Pages）

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

本项目已配置为使用 GitHub Pages 自动部署。

**部署步骤：**

1. **启用 GitHub Pages**
   - 在 GitHub 仓库中，进入 `Settings` → `Pages`
   - 在 `Source` 部分，选择 `GitHub Actions` 作为部署源

2. **推送代码**
   - 将代码推送到 `master` 分支
   - GitHub Actions 会自动构建并部署到 GitHub Pages

3. **访问网站**
   - 部署完成后，访问：`https://你的用户名.github.io/Workout-Pal`
   - 首次部署可能需要几分钟时间

**部署配置：**
- 构建命令：`npm run build`
- 输出目录：`dist`
- 基础路径：`/Workout-Pal/`
- 自动部署：推送到 `master` 分支时自动触发
- 工作流文件：`.github/workflows/deploy.yml`
