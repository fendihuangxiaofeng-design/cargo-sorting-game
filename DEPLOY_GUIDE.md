# 🚀 汽水音乐官网 - GitHub Pages 部署指南

## 📋 部署方式一：GitHub Pages（推荐）

### 步骤 1: 创建 GitHub 仓库

1. 登录 GitHub 账号：https://github.com
2. 点击右上角的 **"+"** 按钮，选择 **"New repository"**
3. 填写仓库信息：
   - **Repository name**: `soda-music-landing`
   - **Description**: 汽水音乐官网 - 交互式声波粒子背景
   - **Visibility**: Public（公开）
   - **不要勾选** "Add a README file"（我们已经有了）
4. 点击 **"Create repository"**

### 步骤 2: 关联本地仓库到 GitHub

在项目根目录执行以下命令（将 `YOUR_USERNAME` 替换为您的 GitHub 用户名）：

```bash
# 添加远程仓库
git remote set-url origin https://github.com/YOUR_USERNAME/soda-music-landing.git

# 或者如果还没有设置过 remote
git remote add origin https://github.com/YOUR_USERNAME/soda-music-landing.git
```

### 步骤 3: 推送到 GitHub

```bash
# 添加所有文件
git add .

# 提交代码
git commit -m "feat: 汽水音乐官网 - 交互式声波粒子背景"

# 推送到 GitHub
git push -u origin main
```

### 步骤 4: 启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 **"Settings"**（设置）
2. 滚动到 **"Pages"** 部分
3. 在 **"Source"** 下，选择：
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. 点击 **"Save"**
5. 等待 1-2 分钟，网站将发布到：`https://YOUR_USERNAME.github.io/soda-music-landing/`

---

## 🌐 部署方式二：Vercel（更简单）

### 优点
- 自动部署，无需配置
- 支持自定义域名
- 免费套餐足够使用

### 步骤

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 **"New Project"**
4. 选择您刚创建的仓库
5. 点击 **"Deploy"**
6. 等待部署完成，获得一个 `.vercel.app` 域名
7. （可选）在 Settings 中绑定自定义域名

---

## 🎯 部署方式三：Netlify

### 步骤

1. 访问 https://netlify.com
2. 使用 GitHub 账号登录
3. 点击 **"Add new site"** → **"Import an existing project"**
4. 选择 GitHub，授权访问
5. 选择仓库，点击 **"Deploy site"**
6. 获得一个 `.netlify.app` 域名

---

## ⚠️ 注意事项

### 1. 背景图片路径
如果需要使用自定义背景图：
1. 将图片命名为 `input_file_1.jpeg`
2. 放入项目根目录
3. 在 `index.html` 第160行确认路径：
   ```javascript
   const BACKGROUND_IMAGE_PATH = './input_file_1.jpeg';
   ```

### 2. 构建项目
部署前先构建项目：
```bash
npm run build
```

### 3. 跨域问题
如果使用本地图片，确保通过本地服务器访问：
```bash
npm run dev
# 或
npx http-server
```

---

## 🎨 功能特性

- ✅ **交互式声波粒子背景** - 鼠标悬停时粒子高亮
- ✅ **Three.js 3D 渲染** - 高性能 WebGL 效果
- ✅ **响应式设计** - 适配所有屏幕尺寸
- ✅ **毛玻璃卡片** - 现代 UI 设计
- ✅ **精选音乐展示** - 动态加载真实音乐数据

---

## 🔧 常用命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

---

## 📝 自定义内容

### 修改标题和文字
编辑 `src/pages/Home.tsx` 文件

### 修改音乐列表
在 `src/pages/Home.tsx` 中的 `musicData` 数组修改

### 修改配色
编辑 `tailwind.config.js` 中的颜色配置

---

## 🎉 完成！

部署成功后，分享您的网站链接给朋友们体验吧！

**示例链接格式：**
- GitHub Pages: `https://YOUR_USERNAME.github.io/soda-music-landing/`
- Vercel: `https://soda-music-landing.vercel.app/`
- Netlify: `https://soda-music-landing.netlify.app/`

---

## 💡 提示

1. **GitHub Token**: 如果遇到权限问题，需要在 GitHub 生成 Personal Access Token
2. **HTTPS**: GitHub Pages 自动启用 HTTPS
3. **自定义域名**: 在 Pages 设置中可以绑定自己的域名
4. **自动部署**: 设置好后，每次 push 代码都会自动部署

祝部署成功！🎵✨
