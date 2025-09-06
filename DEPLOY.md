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
- **检查文件路径**：在GitHub Pages部署时，请使用相对路径 `./audio/${filename}` 而非绝对路径 `/audio/${filename}`
- **验证文件存在**：确保所有音频文件存在于仓库的 `audio/` 目录
- **确认Git LFS已启用** (如果需要)
- **验证jsDelivr CDN链接**

### PWA不工作
- **Manifest路径问题**：将manifest.json中的路径改为相对路径
  - `start_url: "/"` → `start_url: "./"`
  - `scope: "/"` → `scope: "./"`
  - 图标路径：`"img/icon-192.png"` → `"./img/icon-192.png"`
- **检查HTTPS** (GitHub Pages自动提供)
- **验证manifest.json格式**
- **检查Service Worker注册**

### 性能问题
- **使用Lighthouse审计**
- **优化音频文件大小**
- **检查CDN加载时间**

### GitHub Pages部署修复指南

#### 音频路径配置（最终版）
**当前配置**：智能适配GitHub Pages和本地环境

**音频文件路径**：
```javascript
// 智能路径适配 - 根据域名自动选择正确路径
const basePath = window.location.hostname === 'jqtcode.github.io' ? '/soundearth/' : './';
this.audioUrls = {
    'nyc-subway.mp3': `${basePath}audio/nyc-subway.mp3`,
    'sahara-wind.mp3': `${basePath}audio/sahara-wind.mp3`,
    'iceland-waterfall.mp3': `${basePath}audio/iceland-waterfall.mp3`,
    'kyoto-birds.mp3': `${basePath}audio/kyoto-birds.mp3`
};
```

**部署验证**：
1. ✅ 所有音频文件已上传至GitHub Pages
2. ✅ 音频文件可正常访问（状态码206 Partial Content）
3. ✅ 支持跨域访问（CORS已启用）
4. ✅ 本地测试和GitHub Pages部署均可正常工作

**GitHub Pages音频访问测试**：
- ✅ https://jqtcode.github.io/soundearth/audio/sahara-wind.mp3
- ✅ https://jqtcode.github.io/soundearth/audio/kyoto-birds.mp3
- ✅ https://jqtcode.github.io/soundearth/audio/iceland-waterfall.mp3
- ✅ https://jqtcode.github.io/soundearth/audio/nyc-subway.mp3

**注意事项**：
- 音频文件大小：32MB (iceland) ~ 104MB (sahara)，首次加载可能需要时间
- 支持断点续传（206状态码）
- 缓存策略：max-age=600秒，提升用户体验

2. **manifest.json**：所有路径使用相对路径
   ```json
   {
     "start_url": "./",
     "scope": "./",
     "icons": [
       {
         "src": "./img/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       }
     ]
   }
   ```

3. **index.html**：确保manifest引用正确
   ```html
   <link rel="manifest" href="./manifest.json">
   ```

#### 部署验证步骤
1. **本地测试**：
   ```bash
   npx http-server -p 8000
   # 访问 http://localhost:8000
   ```

2. **GitHub Pages验证**：
   - 确保目录结构正确
   - 检查浏览器开发者工具的网络面板确认无404错误

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