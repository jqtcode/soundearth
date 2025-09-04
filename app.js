// SoundEarth - Interactive Audio Map
class SoundEarth {
    constructor() {
        this.audioPlayer = document.getElementById('audio-player');
        this.playBtn = document.getElementById('play-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.currentLocation = document.getElementById('current-location');
        this.audioContainer = document.getElementById('audio-container');
        this.locationInfo = document.getElementById('location-info');
        this.playerControls = document.getElementById('player-controls');
        this.audioStatus = document.getElementById('audio-status');
        this.currentTime = document.getElementById('current-time');
        this.duration = document.getElementById('duration');
        this.progressBar = document.getElementById('progress-bar');
        this.locationIcon = document.getElementById('location-icon');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        this.currentFile = null;
        this.isPlaying = false;
        this.currentLocationIndex = 0;
        this.isDragging = false;
        
        this.init();
    }

    init() {
        this.setupMap();
        this.setupEventListeners();
        this.preloadAudioFiles();
    }

    preloadAudioFiles() {
        // 预加载音频文件以确保可用性
        this.audioFiles = {
            'tokyo-rain.mp3': '东京雨声',
            'iceland-waterfall.mp3': '冰岛瀑布',
            'sahara-wind.mp3': '撒哈拉风声',
            'kyoto-birds.mp3': '京都鸟鸣',
            'nyc-subway.mp3': '纽约地铁'
        };
        
        // 检查每个音频文件
        Object.keys(this.audioFiles).forEach(filename => {
            const audio = new Audio(`./audio/${filename}`);
            audio.preload = 'metadata';
            audio.onerror = () => console.error(`无法加载音频文件: ${filename}`);
        });
    }

    setupMap() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initMap());
        } else {
            this.initMap();
        }
    }

    initMap() {
        try {
            // 确保地图容器存在
            const mapContainer = document.getElementById('map');
            if (!mapContainer) {
                console.error('地图容器未找到');
                return;
            }

            // 初始化Leaflet地图
            this.map = L.map('map', {
                center: [30, 0],
                zoom: 2,
                minZoom: 2,
                maxZoom: 10,
                worldCopyJump: true,
                zoomControl: true,
                scrollWheelZoom: true
            });
            
            // 添加地图图层
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18,
                tileSize: 512,
                zoomOffset: -1
            }).addTo(this.map);

            // 定义位置数据
            this.locations = [
                {
                    name: "东京雨声",
                    lat: 35.6762,
                    lng: 139.6503,
                    file: "tokyo-rain.mp3",
                    icon: "🌧️",
                    color: "#ef4444"
                },
                {
                    name: "冰岛瀑布",
                    lat: 64.1466,
                    lng: -21.9426,
                    file: "iceland-waterfall.mp3",
                    icon: "💧",
                    color: "#3b82f6"
                },
                {
                    name: "撒哈拉风声",
                    lat: 23.4162,
                    lng: 25.6628,
                    file: "sahara-wind.mp3",
                    icon: "🌪️",
                    color: "#eab308"
                },
                {
                    name: "京都鸟鸣",
                    lat: 35.0116,
                    lng: 135.7681,
                    file: "kyoto-birds.mp3",
                    icon: "🐦",
                    color: "#22c55e"
                },
                {
                    name: "纽约地铁",
                    lat: 40.7128,
                    lng: -74.0060,
                    file: "nyc-subway.mp3",
                    icon: "🚇",
                    color: "#a855f7"
                }
            ];

            // 添加标记到地图
            this.addLocationMarkers();
            
            // 调整地图视图
            this.adjustMapView();
            
        } catch (error) {
            console.error('地图初始化错误:', error);
            this.showMapError();
        }
    }

    addLocationMarkers() {
        this.markers = [];
        
        this.locations.forEach((location, index) => {
            // 创建脉冲动画标记
            const pulseIcon = L.divIcon({
                className: 'pulse-marker',
                html: `
                    <div style="
                        position: relative;
                        width: 30px;
                        height: 30px;
                    ">
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 20px;
                            height: 20px;
                            background: ${location.color};
                            border: 3px solid white;
                            border-radius: 50%;
                            z-index: 2;
                            cursor: pointer;
                        "></div>
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 30px;
                            height: 30px;
                            background: ${location.color};
                            border-radius: 50%;
                            opacity: 0.4;
                            animation: pulse 2s infinite;
                        "></div>
                    </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const marker = L.marker([location.lat, location.lng], {
                icon: pulseIcon,
                title: location.name
            }).addTo(this.map);

            // 添加点击事件 - 直接播放音频
            marker.on('click', () => {
                console.log('点击标记:', location.name, location.file);
                this.playLocation(location.file, location.name, location.icon);
            });

            // 添加悬停效果
            marker.on('mouseover', function() {
                this.openPopup();
            });

            // 添加弹出窗口
            const popupContent = this.createPopupContent(location);
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'audio-popup',
                offset: [0, -15]
            });

            this.markers.push(marker);
        });
    }

    createPopupContent(location) {
        return `
            <div class="text-center p-4 min-w-40" style="
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.95));
                border-radius: 16px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(148, 163, 184, 0.3);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            ">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">
                    ${location.icon}
                </div>
                <div style="
                    font-weight: bold;
                    font-size: 1.25rem;
                    margin-bottom: 0.5rem;
                    color: #e2e8f0;
                ">
                    ${location.name}
                </div>
                <p style="
                    font-size: 0.875rem;
                    color: #cbd5e1;
                    margin-bottom: 1rem;
                ">
                    点击播放环境声音
            </div>
        `;
    }

    adjustMapView() {
        const group = new L.featureGroup(this.locations.map(loc => 
            L.circleMarker([loc.lat, loc.lng])
        ));
        this.map.fitBounds(group.getBounds().pad(0.1));
    }

    setupEventListeners() {
        // 音频控制按钮
        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.prevBtn.addEventListener('click', () => this.previousLocation());
        this.nextBtn.addEventListener('click', () => this.nextLocation());

        // 音频事件
        this.audioPlayer.addEventListener('ended', () => this.onAudioEnd());
        this.audioPlayer.addEventListener('error', (e) => this.onAudioError(e));
        this.audioPlayer.addEventListener('loadedmetadata', () => this.onLoadedMetadata());
        this.audioPlayer.addEventListener('timeupdate', () => this.onTimeUpdate());
        this.audioPlayer.addEventListener('loadeddata', () => this.onAudioLoaded());
        
        // 进度条交互
        this.setupProgressBar();
    }

    setupProgressBar() {
        const progressContainer = document.querySelector('.bg-white/20');
        if (progressContainer) {
            // 点击进度条
            progressContainer.addEventListener('click', (e) => this.seekTo(e));
            
            // 拖拽进度条
            progressContainer.addEventListener('mousedown', (e) => this.startDrag(e));
            progressContainer.addEventListener('mousemove', (e) => this.handleDrag(e));
            progressContainer.addEventListener('mouseup', () => this.endDrag());
            progressContainer.addEventListener('mouseleave', () => this.endDrag());
            
            // 触摸事件支持
            progressContainer.addEventListener('touchstart', (e) => this.startDrag(e));
            progressContainer.addEventListener('touchmove', (e) => this.handleDrag(e));
            progressContainer.addEventListener('touchend', () => this.endDrag());
        }
    }

    startDrag(e) {
        this.isDragging = true;
        this.handleDrag(e);
    }

    handleDrag(e) {
        if (!this.isDragging) return;
        
        const progressContainer = document.querySelector('.bg-white/20');
        const rect = progressContainer.getBoundingClientRect();
        
        let clientX;
        if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }
        
        const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = clickX / rect.width;
        
        if (this.audioPlayer.duration) {
            const newTime = this.audioPlayer.duration * percentage;
            this.audioPlayer.currentTime = newTime;
            
            // 更新进度条显示
            this.progressBar.style.width = (percentage * 100) + '%';
            this.currentTime.textContent = this.formatTime(newTime);
        }
    }

    endDrag() {
        this.isDragging = false;
    }

    playLocation(filename, locationName, icon) {
        console.log('开始播放:', filename, locationName);
        
        this.currentFile = filename;
        this.currentLocation.textContent = locationName;
        this.locationIcon.textContent = icon || '🌍';
        this.currentLocationIndex = this.locations.findIndex(loc => loc.file === filename);
        
        // 显示播放器
        this.locationInfo.classList.add('hidden');
        this.playerControls.classList.remove('hidden');
        
        // 添加淡入动画
        this.playerControls.style.opacity = '0';
        setTimeout(() => {
            this.playerControls.style.transition = 'opacity 0.5s ease';
            this.playerControls.style.opacity = '1';
        }, 50);
        
        // 设置音频源
        const audioPath = `./audio/${filename}`;
        this.audioPlayer.src = audioPath;
        
        // 重置进度条
        this.progressBar.style.width = '0%';
        this.currentTime.textContent = '0:00';
        this.duration.textContent = '0:00';
        
        // 更新状态
        this.audioStatus.innerHTML = `<i class="ti ti-loader-2 animate-spin mr-2"></i>正在加载 ${locationName}...`;
        
        // 加载音频
        this.audioPlayer.load();
    }

    onAudioLoaded() {
        this.duration.textContent = this.formatTime(this.audioPlayer.duration);
        this.audioStatus.innerHTML = `<i class="ti ti-player-play mr-2"></i>准备播放`;
        
        // 尝试自动播放
        this.play();
    }

    play() {
        if (this.audioPlayer.src) {
            this.audioPlayer.play().then(() => {
                this.isPlaying = true;
                this.updatePlayButton();
                this.audioStatus.innerHTML = `<i class="ti ti-player-play mr-2"></i>正在播放`;
                
                // 添加播放动画效果
                this.playBtn.classList.add('animate-pulse');
                setTimeout(() => this.playBtn.classList.remove('animate-pulse'), 1000);
            }).catch(error => {
                console.error('播放失败:', error);
                this.audioStatus.innerHTML = `<i class="ti ti-alert-triangle mr-2"></i>播放失败: ${error.message}`;
                
                // 用户可能需要交互才能播放
                if (error.name === 'NotAllowedError') {
                    this.audioStatus.innerHTML = `<i class="ti ti-click mr-2"></i>请点击播放按钮`;
                }
            });
        }
    }

    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.updatePlayButton();
        this.audioStatus.innerHTML = `<i class="ti ti-player-pause mr-2"></i>已暂停`;
        
        // 添加暂停动画效果
        this.pauseBtn.classList.add('animate-pulse');
        setTimeout(() => this.pauseBtn.classList.remove('animate-pulse'), 500);
    }

    stop() {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.isPlaying = false;
        this.updatePlayButton();
        
        // 返回初始状态
        this.playerControls.style.opacity = '0';
        setTimeout(() => {
            this.playerControls.classList.add('hidden');
            this.locationInfo.classList.remove('hidden');
        }, 500);
        
        this.progressBar.style.width = '0%';
        this.currentTime.textContent = '0:00';
        this.duration.textContent = '0:00';
        
        this.audioStatus.innerHTML = `<i class="ti ti-map-pin mr-2"></i>点击地图上的标记播放音频`;
    }

    updatePlayButton() {
        if (this.isPlaying) {
            this.playBtn.classList.add('hidden');
            this.pauseBtn.classList.remove('hidden');
        } else {
            this.playBtn.classList.remove('hidden');
            this.pauseBtn.classList.add('hidden');
        }
    }

    onLoadedMetadata() {
        this.duration.textContent = this.formatTime(this.audioPlayer.duration);
    }

    onTimeUpdate() {
        if (this.isDragging) return;
        
        const current = this.audioPlayer.currentTime;
        const duration = this.audioPlayer.duration;
        if (duration && !isNaN(duration)) {
            const progress = (current / duration) * 100;
            this.currentTime.textContent = this.formatTime(current);
            this.progressBar.style.width = progress + '%';
        }
    }

    seekTo(e) {
        if (this.isDragging) return;
        
        const progressContainer = document.querySelector('.bg-white/20');
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(clickX / width, 1));
        
        if (this.audioPlayer.duration) {
            const newTime = this.audioPlayer.duration * percentage;
            this.audioPlayer.currentTime = newTime;
            this.progressBar.style.width = (percentage * 100) + '%';
            this.currentTime.textContent = this.formatTime(newTime);
        }
    }

    onAudioEnd() {
        this.isPlaying = false;
        this.updatePlayButton();
        this.audioStatus.innerHTML = `<i class="ti ti-check mr-2"></i>播放完成`;
        
        // 重置进度条
        this.progressBar.style.width = '0%';
        this.currentTime.textContent = '0:00';
        
        // 3秒后自动播放下一首
        setTimeout(() => {
            this.nextLocation();
        }, 2000);
    }

    onAudioError(e) {
        console.error('音频错误:', e);
        this.audioStatus.innerHTML = `<i class="ti ti-alert-triangle mr-2"></i>音频错误`;
        this.isPlaying = false;
        this.updatePlayButton();
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    previousLocation() {
        if (this.locations && this.locations.length > 0) {
            this.currentLocationIndex = (this.currentLocationIndex - 1 + this.locations.length) % this.locations.length;
            const location = this.locations[this.currentLocationIndex];
            this.playLocation(location.file, location.name, location.icon);
        }
    }

    nextLocation() {
        if (this.locations && this.locations.length > 0) {
            this.currentLocationIndex = (this.currentLocationIndex + 1) % this.locations.length;
            const location = this.locations[this.currentLocationIndex];
            this.playLocation(location.file, location.name, location.icon);
        } else {
            this.stop();
        }
    }

    showMapError() {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="flex items-center justify-center h-full bg-red-50 rounded-xl">
                    <div class="text-center p-8">
                        <div class="text-6xl mb-4">🗺️</div>
                        <h3 class="text-xl font-semibold text-red-800 mb-2">地图加载失败</h3>
                        <p class="text-red-600 mb-4">${error.message || '请检查网络连接并刷新页面'}</p>
                        <button onclick="location.reload()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                            重新加载
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SoundEarth();
});

// PWA Install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    const installBtn = document.createElement('button');
    installBtn.textContent = 'Install SoundEarth';
    installBtn.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                installBtn.remove();
            }
            deferredPrompt = null;
        }
    });
    
    document.body.appendChild(installBtn);
});