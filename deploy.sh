#!/bin/bash

# ===========================================
# 汽水音乐官网 - 一键部署脚本
# ===========================================

echo "🎵 汽水音乐官网部署脚本"
echo "=========================================="

# 检查 Git
if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装，请先安装 Git"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 Node.js"
    exit 1
fi

echo "✅ Git 和 npm 已就绪"

# 询问 GitHub 用户名
read -p "请输入您的 GitHub 用户名: " github_username

if [ -z "$github_username" ]; then
    echo "❌ 用户名不能为空"
    exit 1
fi

# 仓库名称
repo_name="soda-music-landing"
remote_url="https://github.com/${github_username}/${repo_name}.git"

echo ""
echo "📦 开始部署..."
echo "仓库地址: $remote_url"

# 安装依赖
echo ""
echo "🔧 安装项目依赖..."
npm install

# 构建项目
echo ""
echo "🔨 构建生产版本..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist 目录不存在"
    exit 1
fi

# 初始化 Git（如果需要）
if [ ! -d ".git" ]; then
    echo ""
    echo "📚 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "feat: 汽水音乐官网 - 交互式声波粒子背景"
fi

# 设置远程仓库
echo ""
echo "🔗 设置远程仓库..."
git remote set-url origin "$remote_url" 2>/dev/null || git remote add origin "$remote_url"

# 推送到 GitHub
echo ""
echo "🚀 推送到 GitHub..."
echo "请在出现提示时输入您的 GitHub Personal Access Token"

git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ 部署成功！"
    echo "=========================================="
    echo ""
    echo "📋 下一步操作："
    echo "1. 访问 https://github.com/$github_username/$repo_name"
    echo "2. 进入 Settings → Pages"
    echo "3. Source 选择 'main' 和 '/ (root)'"
    echo "4. 点击 Save"
    echo "5. 等待 1-2 分钟，网站将发布到："
    echo "   https://$github_username.github.io/$repo_name/"
    echo ""
    echo "🎉 恭喜！您的音乐官网即将上线！"
else
    echo ""
    echo "❌ 推送失败，请检查："
    echo "1. GitHub 用户名是否正确"
    echo "2. Personal Access Token 是否有权限"
    echo "3. 仓库是否已创建"
    echo ""
    echo "💡 如果仓库不存在，请先在 GitHub 上创建仓库"
fi
