import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, DollarSign, CloudSun, Users, 
  Share2, Plus, Trash2, CheckCircle, Plane, Hotel, 
  Sparkles, Camera, BookOpen, Clock, Heart, Download, Compass, ChevronRight, ArrowLeft, Navigation, Compass as CompassIcon, Ticket
} from 'lucide-react';

export default function App() {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('travel_with_me_trips_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: '1',
        title: '日本东京 5天4夜冬季美食与雪景之旅',
        destination: '日本·东京 (Tokyo)',
        startDate: '2026-12-25',
        endDate: '2026-12-29',
        budget: '5,500',
        currency: 'RM',
        companions: 3,
        coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
        weather: { temp: '6°C', condition: '多云 ☁️', advice: '早晚温差大，建议穿厚羽绒服与防风外套，备好暖贴。' },
        flights: [
          { type: '去程', flightNo: 'JL 0724', date: '2026-12-25', time: '09:15 -> 17:30', route: '吉隆坡 (KUL) -> 东京成田 (NRT)' },
          { type: '回程', flightNo: 'JL 0725', date: '2026-12-29', time: '10:30 -> 18:15', route: '东京成田 (NRT) -> 吉隆坡 (KUL)' }
        ],
        hotels: [
          { name: '新宿格拉斯丽酒店 (Hotel Gracery Shinjuku)', address: '东京都新宿区歌舞伎町 1-19-1', checkIn: '2026-12-25', checkOut: '2026-12-29' }
        ],
        itinerary: {
          'Day 1': [
            { time: '18:00', title: '抵达东京与新宿入住', desc: '入住格拉斯丽酒店，和哥斯拉巨型头像合影。', transport: '搭乘 Narita Express 直达新宿', distance: '机场到酒店约 80 公里', opening: '全天开放' },
            { time: '20:00', title: '思出横丁晚餐', desc: '在充满昭和风情的居酒屋品尝碳烤串烧。', transport: '步行 5 分钟', distance: '酒店旁', opening: '17:00 - 24:00' }
          ],
          'Day 2': [
            { time: '09:30', title: '浅草寺雷门祈福', desc: '参观东京最古老的寺庙，在仲见世商店街买人形烧。', transport: '搭乘大江戸线至浅草站', distance: '约 20 分钟车程', opening: '06:00 - 17:00' },
            { time: '14:00', title: '东京晴空塔 (Skytree)', desc: '登上 350 米展望台俯瞰全东京雪景。', transport: '搭乘东武晴空塔线', distance: '浅草出发约 5 分钟', opening: '10:00 - 21:00' }
          ],
          'Day 3': [
            { time: '08:30', title: '筑地场外市场海鲜早餐', desc: '品尝最新鲜的海鲜丼与现烤厚蛋烧。', transport: '搭乘地铁日比谷线', distance: '市区出发 15 分钟', opening: '05:00 - 14:00' }
          ]
        },
        recommendedSpots: [
          { name: '涩谷空中展望台 (Shibuya Sky)', desc: '俯瞰全球最繁忙的涩谷十字路口，绝佳日落观赏点。', img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600' },
          { name: '新宿御苑', desc: '闹市中的宁静日式庭园，冬季雪景美不胜收。', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600' }
        ],
        expenses: [
          { id: 'e1', title: '往返机票', amount: 2400, paidBy: 'Alex', category: '交通' },
          { id: 'e2', title: '新宿四晚酒店', amount: 1800, paidBy: 'Sarah', category: '住宿' }
        ],
        memories: [
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600'
        ]
      },
      {
        id: '2',
        title: '槟城美食与古迹怀旧之旅',
        destination: '马来西亚·槟城 (Penang)',
        startDate: '2025-05-01',
        endDate: '2025-05-03',
        budget: '1,200',
        currency: 'RM',
        companions: 2,
        coverImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800',
        weather: { temp: '31°C', condition: '晴朗 ☀️', advice: '热带气候，注意防晒与补水。' },
        flights: [],
        hotels: [{ name: '乔治市韵蝶酒店', address: '槟城乔治市', checkIn: '2025-05-01', checkOut: '2025-05-03' }],
        itinerary: { 'Day 1': [{ time: '12:00', title: '品尝槟城叻沙', desc: '驰名潮州煎蕊与炒粿条。', transport: '步行', distance: '市区', opening: '10:00 - 18:00' }] },
        recommendedSpots: [],
        expenses: [],
        memories: []
      }
    ];
  });

  // 状态：选中的旅程 ID。若为 null，则显示主页列表
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [activeDayTab, setActiveDayTab] = useState('Day 1');
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem('travel_with_me_trips_v2', JSON.stringify(trips));
  }, [trips]);

  const currentTrip = trips.find(t => t.id === selectedTripId);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast('🔗 专属同行链接已复制！发给好友即可一起同步编辑');
  };

  // 计算距离出发还有几天
  const getDaysLeft = (startDateStr) => {
    const today = new Date();
    const start = new Date(startDateStr);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 分类：即将来临 vs 过去
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingTrips = trips.filter(t => t.startDate >= todayStr);
  const pastTrips = trips.filter(t => t.startDate < todayStr);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans antialiased pb-20">
      {/* 顶部通知 */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#2C2A29] text-[#FDFBF7] px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-3 border border-white/10">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* 顶栏 */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#EFECE6] sticky top-0 z-40 px-6 py-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedTripId(null)}>
            <div className="w-11 h-11 rounded-2xl bg-[#2C2A29] text-[#FDFBF7] flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Travel with Me</h1>
              <p className="text-xs text-[#777]">实时协同旅行手账</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedTripId && (
              <button 
                onClick={() => setSelectedTripId(null)}
                className="px-4 py-2 bg-[#EFECE6] text-[#2C2A29] text-sm rounded-2xl font-medium hover:bg-[#E5E0D8] transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> 返回主页
              </button>
            )}
            <button 
              onClick={handleShareLink}
              className="px-4 py-2.5 bg-[#2C2A29] text-[#FDFBF7] text-sm rounded-2xl font-medium hover:bg-[#44403D] transition flex items-center gap-2 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              分享同行链接
            </button>
          </div>
        </div>
      </header>

      {/* 主体内容：如果没选具体旅程，显示主页仪表盘；如果选了，显示具体旅程详情 */}
      <main className="max-w-6xl mx-auto px-6 mt-8">
        {!selectedTripId ? (
          /* ================= 主页视图 ================= */
          <div className="space-y-10">
            {/* 欢迎 Banner */}
            <div className="bg-white border border-[#EFECE6] rounded-3xl p-8 sm:p-12 shadow-xs flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#F5F2EB] text-[#444] text-xs font-semibold mb-3">
                  ✨ 优雅私人生存手账
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1817]">带着热情与手账，去探索世界吧。</h2>
                <p className="text-sm text-[#666] mt-2 max-w-xl leading-relaxed">
                  轻松规划每日行程、管理同行多币种开销、查看天气与景点距离，并一键分享给同行好友。
                </p>
              </div>
              <button 
                onClick={() => {
                  const newTitle = prompt('请输入新旅行名称：', '欧洲浪漫 7天6夜深度游');
                  if (!newTitle) return;
                  const newT = {
                    id: Date.now().toString(),
                    title: newTitle,
                    destination: '法国·巴黎 (Paris)',
                    startDate: '2026-09-10',
                    endDate: '2026-09-17',
                    budget: '12,000',
                    currency: 'RM',
                    companions: 2,
                    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
                    weather: { temp: '22°C', condition: '晴朗 ☀️', advice: '气候宜人，适合漫步。' },
                    flights: [],
                    hotels: [],
                    itinerary: { 'Day 1': [{ time: '10:00', title: '抵达巴黎', desc: '入住酒店。', transport: '地铁', distance: '市区', opening: '全天' }] },
                    recommendedSpots: [],
                    expenses: [],
                    memories: []
                  };
                  setTrips([newT, ...trips]);
                  triggerToast('✨ 成功创建新旅程！');
                }}
                className="px-6 py-3.5 bg-[#2C2A29] text-[#FDFBF7] text-sm rounded-2xl font-bold hover:bg-[#444] transition shadow-md flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" /> 立即规划新旅程
              </button>
            </div>

            {/* 即将来临的旅行计划 */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-[#1A1817] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" /> 即将来临的旅行计划
              </h3>

              {upcomingTrips.length === 0 ? (
                <p className="text-sm text-[#888] bg-white p-6 rounded-2xl border border-[#EFECE6]">暂无即将来临的行程，点击上方按钮添加吧！</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingTrips.map(trip => {
                    const daysLeft = getDaysLeft(trip.startDate);
                    return (
                      <div 
                        key={trip.id}
                        onClick={() => setSelectedTripId(trip.id)}
                        className="bg-white border border-[#EFECE6] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="h-48 relative overflow-hidden">
                          <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#2C2A29] shadow-sm">
                            距离出发还有 {daysLeft > 0 ? `${daysLeft} 天` : '就是今天！'}
                          </div>
                        </div>
                        <div className="p-6 space-y-3">
                          <span className="text-xs font-semibold text-[#666] tracking-wide uppercase bg-[#F5F2EB] px-3 py-1 rounded-full">
                            {trip.destination}
                          </span>
                          <h4 className="text-xl font-bold text-[#1A1817] group-hover:text-amber-700 transition">{trip.title}</h4>
                          <div className="flex justify-between items-center text-sm text-[#777] pt-2 border-t border-[#F2EFE9]">
                            <span>{trip.startDate} ~ {trip.endDate}</span>
                            <span className="font-semibold text-[#2C2A29] flex items-center gap-1">进入手账 <ChevronRight className="w-4 h-4"/></span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 过去的旅程 */}
            {pastTrips.length > 0 && (
              <div className="space-y-4 pt-6">
                <h3 className="text-xl font-bold tracking-tight text-[#1A1817] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" /> 过去的旅程回忆
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastTrips.map(trip => (
                    <div 
                      key={trip.id}
                      onClick={() => setSelectedTripId(trip.id)}
                      className="bg-white/70 border border-[#EFECE6] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer group opacity-80 hover:opacity-100"
                    >
                      <div className="p-6 space-y-2">
                        <span className="text-xs text-[#888]">{trip.destination}</span>
                        <h4 className="text-lg font-bold text-[#1A1817]">{trip.title}</h4>
                        <span className="text-xs text-[#777] block">{trip.startDate} ~ {trip.endDate} (已完成)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================= 旅程详情视图 ================= */
          <div className="space-y-8">
            {/* 详情页头部大卡片 */}
            <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-10 shadow-xs">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-[#F2EFE9]">
                <div>
                  <span className="inline-block px-3.5 py-1 rounded-full bg-[#F5F2EB] text-[#444] text-xs font-semibold mb-3 tracking-wide">
                    {currentTrip.destination}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1817]">{currentTrip.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#777] mt-3">
                    <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-3 py-1 rounded-xl border border-[#EFECE6]">
                      <Calendar className="w-4 h-4 text-[#555]"/> {currentTrip.startDate} ~ {currentTrip.endDate}
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#FDFBF7] px-3 py-1 rounded-xl border border-[#EFECE6]">
                      <Users className="w-4 h-4 text-[#555]"/> {currentTrip.companions} 人同行
                    </span>
                  </div>
                </div>
                <div className="bg-[#FAF8F5] border border-[#EFECE6] px-6 py-4 rounded-2xl text-right min-w-[160px]">
                  <span className="text-xs text-[#888] block font-medium uppercase tracking-wider">总预算</span>
                  <span className="text-2xl font-bold text-[#2C2A29] mt-0.5 block">{currentTrip.currency} {currentTrip.budget}</span>
                </div>
              </div>

              {/* 详情页 Tab 切换 */}
              <div className="flex gap-3 mt-8 border-b border-[#F2EFE9] pb-4 overflow-x-auto">
                {[
                  { id: 'itinerary', label: '每日行程 & 交通', icon: BookOpen },
                  { id: 'flights_hotels', label: '航班与酒店住宿', icon: Plane },
                  { id: 'recommendations', label: '推荐行程与景点', icon: Sparkles },
                  { id: 'weather', label: '天气与行前指南', icon: CloudSun },
                  { id: 'expenses', label: '同行多币种记账', icon: DollarSign },
                  { id: 'memories', label: '旅途回忆相册', icon: Camera }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition flex items-center gap-2.5 whitespace-nowrap ${
                        activeTab === tab.id 
                          ? 'bg-[#EFECE6] text-[#2C2A29] font-semibold shadow-xs' 
                          : 'text-[#777] hover:bg-[#F9F8F5] hover:text-[#2C2A29]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: 每日行程 & 交通 (带有 Day 1, Day 2 等子 Tabs) */}
              {activeTab === 'itinerary' && (
                <div className="mt-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">每日行程规划与交通指南</h3>
                      <p className="text-xs text-[#777] mt-0.5">点击不同天数查看详细安排、开放时间与交通距离</p>
                    </div>
                  </div>

                  {/* Day 子 Tabs 切换栏 */}
                  <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#EFECE6]">
                    {Object.keys(currentTrip.itinerary || {}).map(dayKey => (
                      <button
                        key={dayKey}
                        onClick={() => setActiveDayTab(dayKey)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                          activeDayTab === dayKey 
                            ? 'bg-[#2C2A29] text-white shadow-sm' 
                            : 'bg-[#F5F2EB] text-[#555] hover:bg-[#EAE5DD]'
                        }`}
                      >
                        {dayKey}
                      </button>
                    ))}
                  </div>

                  {/* 当前选中 Day 的具体行程卡片列表 */}
                  <div className="space-y-4 pt-2">
                    {(currentTrip.itinerary[activeDayTab] || []).map((item, idx) => (
                      <div key={idx} className="p-6 rounded-3xl bg-[#FDFBF7] border border-[#EFECE6] space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="px-3 py-1 bg-[#2C2A29] text-white text-xs rounded-lg font-bold">
                            {item.time}
                          </span>
                          <span className="text-xs text-[#666] font-medium bg-[#EFECE6] px-3 py-1 rounded-full">
                            ⏳ 开放时间: {item.opening}
                          </span>
                        </div>
                        <h4 className="font-bold text-lg text-[#1A1817]">{item.title}</h4>
                        <p className="text-sm text-[#666] leading-relaxed">{item.desc}</p>
                        
                        {/* 交通与距离指引 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#EFECE6] text-xs text-[#555]">
                          <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#EFECE6]">
                            <Navigation className="w-4 h-4 text-amber-600 shrink-0" />
                            <span><strong>推荐交通:</strong> {item.transport}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#EFECE6]">
                            <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                            <span><strong>距离提示:</strong> {item.distance}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: 航班与酒店住宿 */}
              {activeTab === 'flights_hotels' && (
                <div className="mt-8 space-y-8">
                  {/* 航班信息 */}
                  <div>
                    <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                      <Plane className="w-5 h-5 text-indigo-600" /> 航班信息
                    </h3>
                    {(!currentTrip.flights || currentTrip.flights.length === 0) ? (
                      <p className="text-sm text-[#888] bg-[#FAF8F5] p-5 rounded-2xl border border-[#EFECE6]">暂无航班记录</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentTrip.flights.map((f, i) => (
                          <div key={i} className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#EFECE6] space-y-2">
                            <div className="flex justify-between font-bold text-sm">
                              <span>{f.type}：{f.flightNo}</span>
                              <span className="text-xs text-[#777]">{f.date}</span>
                            </div>
                            <p className="text-sm font-semibold text-[#1A1817]">{f.route}</p>
                            <p className="text-xs text-[#666]">时间：{f.time}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 酒店住宿 */}
                  <div>
                    <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
                      <Hotel className="w-5 h-5 text-teal-600" /> 酒店与住宿
                    </h3>
                    {(!currentTrip.hotels || currentTrip.hotels.length === 0) ? (
                      <p className="text-sm text-[#888] bg-[#FAF8F5] p-5 rounded-2xl border border-[#EFECE6]">暂无酒店记录</p>
                    ) : (
                      <div className="space-y-4">
                        {currentTrip.hotels.map((h, i) => (
                          <div key={i} className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#EFECE6] space-y-2">
                            <h4 className="font-bold text-base text-[#1A1817]">{h.name}</h4>
                            <p className="text-xs text-[#666]">📍 地址：{h.address}</p>
                            <p className="text-xs font-medium text-[#555]">入住：{h.checkIn} ~ 退房：{h.checkOut}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: 推荐行程与景点 */}
              {activeTab === 'recommendations' && (
                <div className="mt-8 space-y-6">
                  <h3 className="text-xl font-bold tracking-tight">精选推荐行程与必去景点</h3>
                  {(!currentTrip.recommendedSpots || currentTrip.recommendedSpots.length === 0) ? (
                    <p className="text-sm text-[#888] bg-[#FAF8F5] p-5 rounded-2xl border border-[#EFECE6]">暂无推荐景点</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {currentTrip.recommendedSpots.map((spot, i) => (
                        <div key={i} className="rounded-3xl overflow-hidden border border-[#EFECE6] bg-white shadow-xs">
                          <div className="h-44 overflow-hidden">
                            <img src={spot.img} alt={spot.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                          </div>
                          <div className="p-5 space-y-2">
                            <h4 className="font-bold text-lg text-[#1A1817]">{spot.name}</h4>
                            <p className="text-sm text-[#666] leading-relaxed">{spot.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: 天气与指南 */}
              {activeTab === 'weather' && (
                <div className="mt-8 space-y-6">
                  <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#EFECE6] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <span className="text-xs text-[#888] font-bold uppercase tracking-wider">气象与穿搭实时指南</span>
                      <div className="text-4xl font-extrabold mt-2 flex items-center gap-4 text-[#1A1817]">
                        {currentTrip.weather.temp} 
                        <span className="text-xl font-normal text-[#555]">{currentTrip.weather.condition}</span>
                      </div>
                      <p className="text-sm text-[#666] mt-3 max-w-xl leading-relaxed">{currentTrip.weather.advice}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: 记账 */}
              {activeTab === 'expenses' && (
                <div className="mt-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold tracking-tight">同行开销分摊</h3>
                    <button 
                      onClick={() => {
                        const title = prompt('请输入花销名称：', '特色晚餐');
                        const amt = prompt('请输入金额：', '350');
                        if (!title || !amt) return;
                        const newExp = { id: Date.now().toString(), title, amount: parseFloat(amt), paidBy: '我', category: '餐饮' };
                        const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, expenses: [...t.expenses, newExp] } : t);
                        setTrips(updatedTrips);
                        triggerToast('💰 记账成功！');
                      }}
                      className="px-4 py-2 bg-[#2C2A29] text-white text-xs rounded-xl font-medium"
                    >
                      + 记一笔
                    </button>
                  </div>
                  <div className="space-y-3">
                    {currentTrip.expenses.map((exp, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EFECE6] flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-sm">{exp.title}</h4>
                          <span className="text-xs text-[#777]">付款人: {exp.paidBy} · 类别: {exp.category}</span>
                        </div>
                        <span className="font-bold text-base">{currentTrip.currency} {exp.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 6: 相册 */}
              {activeTab === 'memories' && (
                <div className="mt-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold tracking-tight">旅途回忆相册</h3>
                    <button 
                      onClick={() => {
                        const imgUrl = prompt('请输入图片链接 (URL)：', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600');
                        if (!imgUrl) return;
                        const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, memories: [...t.memories, imgUrl] } : t);
                        setTrips(updatedTrips);
                        triggerToast('📸 照片已上传！');
                      }}
                      className="px-4 py-2 bg-[#2C2A29] text-white text-xs rounded-xl font-medium"
                    >
                      + 上传照片
                    </button>
                  </div>
                  {currentTrip.memories.length === 0 ? (
                    <p className="text-sm text-[#888] text-center py-12">暂无照片</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {currentTrip.memories.map((url, i) => (
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-[#EFECE6]">
                          <img src={url} alt="memory" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
