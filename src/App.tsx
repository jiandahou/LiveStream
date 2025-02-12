import { useEffect, useRef } from 'react';
import './App.css';
import Hls from 'hls.js';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  useEffect(() => {
    console.log('Initializing Video.js player');
    
    // 确保 videoRef.current 不为 null 时才初始化 Video.js 播放器
    if (videoRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
      });

      console.log('Video.js player initialized');
      playerRef.current = player;

      // 检查 Hls.js 是否支持，并且加载流
      if (Hls.isSupported()) {
        const hls = new Hls();

        // 在解析 manifest 后，设置 Video.js 播放器的流源
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed, setting source to Video.js');
          player.src({
            type: 'application/x-mpegURL',
            src: 'http://120.26.70.216/hls/stream.m3u8',
          });
        });

        // 加载 HLS 流
        hls.loadSource('http://120.26.70.216/hls/stream.m3u8');
        hls.attachMedia(videoRef.current); // 将流绑定到 video 元素上

        // 清理函数，销毁 Hls.js 和 Video.js 实例
        return () => {
          console.log('Cleaning up HLS and Video.js');
          hls.destroy(); // 销毁 Hls.js 实例
          player.dispose(); // 销毁 Video.js 播放器实例
        };
      }
    }

    // 清理 Video.js 播放器实例
    return () => {
      console.log('Disposing Video.js player');
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  return (
    <div>
      <h1>Live Stream with Video.js & HLS.js</h1>
      <video ref={videoRef} className="video-js vjs-default-skin w-full max-h-[500px]" />
    </div>
  );
}

export default App;