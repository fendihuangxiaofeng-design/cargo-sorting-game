import SoundWaveCanvas from '../components/SoundWaveCanvas';
import MusicCard from '../components/MusicCard';

const musicData = [
  {
    title: 'Ethereal Dreams',
    artist: 'Sonic Wave',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    duration: '3:45',
  },
  {
    title: 'Digital Horizon',
    artist: 'Neon Pulse',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    duration: '4:12',
  },
  {
    title: 'Cosmic Journey',
    artist: 'Starlight',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    duration: '5:20',
  },
  {
    title: 'Midnight Vibes',
    artist: 'Lunar Beats',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    duration: '3:58',
  },
  {
    title: 'Electric Dreams',
    artist: 'Voltage',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    duration: '4:30',
  },
  {
    title: 'Ocean Waves',
    artist: 'Aqua Sound',
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
    duration: '3:25',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <SoundWaveCanvas />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              沉浸在
            </span>
            <br />
            <span className="text-white">音乐的世界</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            体验声波的律动，感受音乐的魅力，让每一个音符都触动你的心弦
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105">
              开始探索
            </button>
            <button className="px-8 py-4 border border-gray-600 rounded-full text-white font-semibold text-lg hover:bg-white/10 transition-all">
              了解更多
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <section id="music" className="relative py-20 bg-gradient-to-b from-transparent to-black/80">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">精选音乐</h2>
            <p className="text-gray-400 text-lg">发现最新、最热门的音乐作品</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {musicData.map((music, index) => (
              <MusicCard
                key={index}
                title={music.title}
                artist={music.artist}
                cover={music.cover}
                duration={music.duration}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative py-20 bg-black/50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">关于我们</h2>
            <p className="text-gray-300 text-lg mb-6">
              Sonic Wave 致力于为音乐爱好者提供最优质的音乐体验。我们相信音乐是连接心灵的桥梁，
              每一个音符都承载着情感与故事。
            </p>
            <p className="text-gray-400 text-base">
              通过创新的声波可视化技术，我们让音乐不仅仅是听觉的享受，更是视觉的盛宴。
              让我们一起，在音乐的海洋中遨游。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
