# 🚀 SoundEarth 部署指南

## 今晚开始行动清单

### 1. 创建GitHub仓库
1. 访问 https://github.com/new
2. 仓库名称: `soundearth`
3. 设置为 **Public**
4. 不要初始化 README
5. 点击 **Create repository**

### 2. 推送代码
```bash
# 在本地项目目录
git init
git add .
git commit -m "Initial commit: SoundEarth v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/soundearth.git
git push -u origin main
```

### 3. 启用GitHub Pages
1. 进入仓库 Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / root
4. 点击 Save

### 4. 等待部署
- 部署时间: 5-10分钟
- 访问: https://YOUR_USERNAME.github.io/soundearth

## 🎵 音频文件获取

### 从Freesound下载CC0音频
1. 访问 https://freesound.org
2. 搜索: `tokyo rain` 过滤: `license:"Creative Commons 0" duration:>600`
3. 下载最长的高质量音频
4. 使用ffmpeg转换:
```bash
ffmpeg -i input.wav -b:a 128k -ac 1 -ar 44100 tokyo-rain-128k.mp3
```

### 音频文件列表
- `tokyo-rain-128k.mp3` (东京夜雨)
- `iceland-waterfall-128k.mp3` (冰岛瀑布)
- `sahara-wind-128k.mp3` (撒哈拉风声)
- `kyoto-birds-128k.mp3` (京都鸟鸣)
- `newyork-subway-128k.mp3` (纽约地铁)

## 📊 添加分析

### Cloudflare Web Analytics
1. 访问 https://dash.cloudflare.com/sign-up
2. 添加站点: `YOUR_USERNAME.github.io`
3. 获取分析代码
4. 替换 index.html 中的 `your-token-here`

### Buy Me a Coffee
1. 访问 https://buymeacoffee.com
2. 创建账户
3. 替换 index.html 中的 data-id="soundearth"

## 🎯 7天推广计划

### Day 0 (今晚)
- ✅ 代码推送完成
- ✅ GitHub Pages 启用
- ✅ 基本音频文件上传

### Day 1-2
- 📱 测试PWA安装功能
- 🔍 SEO优化检查
- 📈 添加更多音频文件

### Day 3-4
- 📱 分享到 Reddit r/ambientmusic
- 🐦 Twitter 线程发布
- 📧 邮件列表创建

### Day 5-7
- 🔄 收集用户反馈
- 🆕 添加新地点
- 📊 分析数据查看

## 🛠️ 故障排除

### 音频不播放
- 检查文件路径是否正确
- 确认Git LFS已启用 (如果需要)
- 验证jsDelivr CDN链接

### PWA不工作
- 检查HTTPS (GitHub Pages自动提供)
- 验证manifest.json格式
- 检查Service Worker注册

### 性能问题
- 使用Lighthouse审计
- 优化音频文件大小
- 检查CDN加载时间

## 📈 升级路径

### 阶段1: 流量增长
- 迁移到 Cloudflare Pages + R2 ($0.015/GB)
- 自定义域名 ($9/年)

### 阶段2: 功能扩展
- 用户账户系统
- 音频上传功能
- 社交分享

### 阶段3: 商业化
- Stripe Checkout 集成
- 高级功能订阅
- 音频商店

---

🎉 **预计今晚10分钟即可上线！**

访问: https://YOUR_USERNAME.github.io/soundearth