# 本地测试指南

## 快速测试方法

### 方法1: 直接打开文件
1. 双击 `index.html` 用浏览器打开
2. 注意：音频文件路径需要替换为实际文件

### 方法2: 使用VS Code Live Server
1. 安装VS Code插件 "Live Server"
2. 右键点击 `index.html` → "Open with Live Server"
3. 自动打开 http://localhost:5500

### 方法3: 使用Python服务器
```bash
# 在项目目录运行
python -m http.server 8000
# 访问 http://localhost:8000
```

### 方法4: 使用Node.js http-server
```bash
# 全局安装
npm install -g http-server

# 运行服务器
http-server -p 8080
# 访问 http://localhost:8080
```

## 测试清单

- [ ] 页面正常加载
- [ ] 世界地图显示
- [ ] 点击地图上的点
- [ ] 音频播放器出现
- [ ] PWA安装提示
- [ ] 响应式设计
- [ ] 深色主题
- [ ] 图标加载

## 音频测试

当前使用的是占位音频文件。要测试完整功能：

1. 从Freesound.org下载CC0音频
2. 使用ffmpeg转换:
   ```bash
   ffmpeg -i input.wav -b:a 128k -ac 1 -ar 44100 output.mp3
   ```
3. 替换audio目录下的占位文件

## 浏览器兼容性

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

## 移动设备测试

- iOS Safari: 支持PWA安装
- Android Chrome: 支持PWA安装
- 响应式设计适配所有屏幕