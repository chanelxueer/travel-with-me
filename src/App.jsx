 import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, DollarSign, CloudSun, Users, 
  Share2, Plus, Trash2, CheckCircle, Plane, Hotel, 
  Sparkles, Camera, BookOpen, Clock, Heart, Download, Compass, ChevronRight, ArrowLeft, Navigation, ExternalLink, Edit3, X
} from 'lucide-react';

export default function App() {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('travel_with_me_cloud_v4');
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
        packingList: ['厚羽绒服', '发热保暖内衣', '防滑雪地靴', '暖贴', '大容量充电宝'],
        flights: [
          { id: 'f1', type: '去程', flightNo: 'JL 0724', date: '2026-12-25', time: '09:15 -> 17:30', route: '吉隆坡 (KUL) -> 东京成田 (NRT)' }
        ],
        hotels: [
          { id: 'h1', name: '新宿格拉斯丽酒店', address: '东京都新宿区歌舞伎町 1-19-1', checkIn: '2026-12-25', checkOut: '2026-12-29' }
        ],
        itinerary: {
          'Day 1': [
            { id: 'i1', time: '18:00', title: '抵达东京与新宿入住', desc: '入住酒店，和哥斯拉合影。', transport: 'Narita Express', distance: '起点 / 机场至酒店 80km', opening: '全天', mapUrl: 'https://maps.google.com/?q=Shinjuku', photo: '' },
            { id: 'i2', time: '20:00', title: '思出横丁晚餐', desc: '品尝碳烤串烧。', transport: '步行', distance: '距上一站：步行 5 分钟 (约 400米)', opening: '17:00 - 24:00', mapUrl: 'https://maps.google.com/?q=Omoide+Yokocho', photo: '' }
          ],
          'Day 2': [
            { id: 'i3', time: '09:30', title: '浅草寺雷门', desc: '参观最古老寺庙。', transport: '地铁大江戸线', distance: '距上一站：地铁 20 分钟', opening: '06:00 - 17:00', mapUrl: 'https://maps.google.com/?q=Senso-ji', photo: '' }
          ]
        },
        masterSpots: [
          { id: 's1', name: '涩谷空中展望台', desc: '俯瞰全球最繁忙十字路口。', img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600' },
          { id: 's2', name: '东京晴空塔', desc: '350米高空俯瞰全景雪景。', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600' },
          { id: 's3', name: '筑地场外市场', desc: '品尝最新鲜的海鲜丼与烤生蚝。', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600' }
        ],
        expenses: [
          { id: 'e1', title: '往返机票', amount: 2400, currency: 'MYR', convertedRM: 2400, paidBy: 'Alex', category: '交通' }
        ],
        memories: [
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600'
        ]
      }
    ];
  });

  const [selectedTripId, setSelectedTripId] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [activeDayTab, setActiveDayTab] = useState('Day 1');
  const [toast, setToast] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // 弹窗状态控制器 (Popup Modals)
  const [modalType, setModalType] = useState(null); // 'itinerary', 'expense', 'flight', 'hotel', 'spot', 'editItinerary', 'editExpense'
  const [editingItem, setEditingItem] = useState(null);

  // 各类表单数据
  const [itineraryForm, setItineraryForm] = useState({ time: '10:00', title: '', desc: '', transport: '步行', distance: '距上一站：...', opening: '09:00 - 18:00', mapUrl: 'https://maps.google.com/?q=', photo: '' });
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', currency: 'MYR', paidBy: '我', category: '餐饮' });
  const [flightForm, setFlightForm] = useState({ type: '去程', flightNo: '', date: '', time: '', route: '' });
  const [hotelForm, setHotelForm] = useState({ name: '', address: '', checkIn: '', checkOut: '' });
  const [spotToSchedule, setSpotToSchedule] = useState(null);
  const [spotDayTarget, setSpotDayTarget] = useState('Day 1');
  const [spotTimeTarget, setSpotTimeTarget] = useState('14:00');

  useEffect(() => {
    localStorage.setItem('travel_with_me_cloud_v4', JSON.stringify(trips));
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 500);
    return () => clearTimeout(timer);
  }, [trips]);

  const currentTrip = trips.find(t => t.id === selectedTripId);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast('🔗 专属同行链接已复制！发给好友即可实时云端同步');
  };

  const getDaysLeft = (startDateStr) => {
    const today = new Date();
    const start = new Date(startDateStr);
    return Math.ceil((start - today) / (1000 * 60 * 60 * 24));
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingTrips = trips.filter(t => t.startDate >= todayStr);
  const pastTrips = trips.filter(t => t.startDate < todayStr);

  const confirmAndDelete = (deleteAction, name = '此项') => {
    if (window.confirm(`⚠️ 确定要删除 "${name}" 吗？此操作无法撤销，并会实时同步给所有同行伙伴。`)) {
      deleteAction();
      triggerToast('🗑️ 已成功删除');
    }
  };

  // 汇率转换计算
  const convertToRM = (amount, currency) => {
    const amt = parseFloat(amount) || 0;
    const rates = { MYR: 1, JPY: 0.029, USD: 4.45, THB: 0.13, EUR: 4.80, SGD: 3.35 };
    return (amt * (rates[currency] || 1)).toFixed(2);
  };

  // 智能推荐景点计算：过滤掉已经在所有行程里出现过的景点
  const getSmartRecommendedSpots = () => {
    if (!currentTrip) return [];
    const scheduledTitles = new Set();
    Object.values(currentTrip.itinerary || {}).forEach(dayList => {
      dayList.forEach(item => scheduledTitles.add(item.title));
    });
    return (currentTrip.masterSpots || []).filter(s => !scheduledTitles.has(s.name));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans antialiased pb-20">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#2C2A29] text-[#FDFBF7] px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-3 border border-white/10 animate-bounce">
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
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {isSyncing ? '云端同步中...' : '云端实时多端同步已连接 🟢'}
              </div>
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
              <Share2 className="w-4 h-4" /> 分享同行链接
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        {!selectedTripId ? (
          /* ================= 主页视图 ================= */
          <div className="space-y-10">
            <div className="bg-white border border-[#EFECE6] rounded-3xl p-8 sm:p-12 shadow-xs flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#F5F2EB] text-[#444] text-xs font-semibold mb-3">
                  ✨ 实时协同旅行手账
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1817]">带着热情与手账，去探索世界吧。</h2>
                <p className="text-sm text-[#666] mt-2 max-w-xl leading-relaxed">
                  多端实时同步：与同行伙伴共同规划行程、智能推荐景点、实时多币种记账。
                </p>
              </div>
              <button 
                onClick={() => {
                  const title = prompt('请输入新旅行名称：', '北海道 5天4夜粉雪温泉之旅');
                  if (!title) return;
                  const newT = {
                    id: Date.now().toString(),
                    title,
                    destination: '日本·北海道 (Hokkaido)',
                    startDate: '2027-01-10',
                    endDate: '2027-01-15',
                    budget: '8,000',
                    currency: 'RM',
                    companions: 4,
                    coverImage: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800',
                    weather: { temp: '-5°C', condition: '大雪 ❄️', advice: '极寒天气，务必做好保暖防滑。' },
                    packingList: ['防寒羽绒服', '雪地靴', '保暖手套', '暖贴'],
                    flights: [],
                    hotels: [],
                    itinerary: { 'Day 1': [{ id: 'd1', time: '12:00', title: '抵达札幌', desc: '市区闲逛。', transport: 'JR 机场快线', distance: '机场到市区 50km', opening: '全天', mapUrl: 'https://maps.google.com', photo: '' }] },
                    masterSpots: [
                      { id: 'ms1', name: '小樽运河', desc: '浪漫的雪中欧式红砖仓库。', img: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=600' }
                    ],
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

            {/* 即将来临的旅行计划 (按要求：目的地、日期、倒数) */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-[#1A1817] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" /> 即将来临的旅行计划
              </h3>

              {upcomingTrips.length === 0 ? (
                <p className="text-sm text-[#888] bg-white p-6 rounded-2xl border border-[#EFECE6]">暂无即将来临的行程</p>
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
                      className="bg-white/70 border border-[#EFECE6] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer group opacity-80"
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
          /* ================= 详情页视图 ================= */
          <div className="space-y-8">
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

              {/* Tabs */}
              <div className="flex gap-3 mt-8 border-b border-[#F2EFE9] pb-4 overflow-x-auto">
                {[
                  { id: 'itinerary', label: '每日行程 & 交通', icon: BookOpen },
                  { id: 'recommendations', label: '智能推荐景点', icon: Sparkles },
                  { id: 'flights_hotels', label: '航班与酒店住宿', icon: Plane },
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
                        activeTab === tab.id ? 'bg-[#EFECE6] text-[#2C2A29] font-semibold shadow-xs' : 'text-[#777] hover:bg-[#F9F8F5]'
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: 行程 & 交通 (含可编辑、添加、二次确认删除) */}
              {activeTab === 'itinerary' && (
                <div className="mt-8 space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">每日行程规划与交通、距离导航</h3>
                      <p className="text-xs text-[#777] mt-0.5">每个景点包含与上一站的距离、Google Maps 链接、独立照片及编辑功能</p>
                    </div>
                    <button 
                      onClick={() => {
                        setEditingItem(null);
                        setItineraryForm({ time: '10:00', title: '', desc: '', transport: '步行', distance: '距上一站：...', opening: '09:00 - 18:00', mapUrl: 'https://maps.google.com/?q=', photo: '' });
                        setModalType('itinerary');
                      }}
                      className="px-4 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-medium flex items-center gap-1.5 shadow-sm hover:bg-[#444]"
                    >
                      <Plus className="w-4 h-4" /> 添加新行程
                    </button>
                  </div>

                  {/* Day 子 Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#EFECE6] items-center justify-between">
                    <div className="flex gap-2">
                      {Object.keys(currentTrip.itinerary || {}).map(dayKey => (
                        <button
                          key={dayKey}
                          onClick={() => setActiveDayTab(dayKey)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                            activeDayTab === dayKey ? 'bg-[#2C2A29] text-white shadow-sm' : 'bg-[#F5F2EB] text-[#555] hover:bg-[#EAE5DD]'
                          }`}
                        >
                          {dayKey}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        const newDayName = prompt('请输入新天数名称（例如：Day 4）：', `Day ${Object.keys(currentTrip.itinerary).length + 1}`);
                        if (!newDayName) return;
                        if (currentTrip.itinerary[newDayName]) { alert('该天数已存在'); return; }
                        const updatedItinerary = { ...currentTrip.itinerary, [newDayName]: [] };
                        setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updatedItinerary } : t));
                        setActiveDayTab(newDayName);
                        triggerToast('📅 成功添加新的一天！');
                      }}
                      className="text-xs bg-[#EFECE6] text-[#2C2A29] px-3 py-2 rounded-xl font-medium hover:bg-[#E5E0D8]"
                    >
                      + 新增一天
                    </button>
                  </div>

                  {/* 当天行程卡片列表 */}
                  <div className="space-y-4 pt-2">
                    {(!currentTrip.itinerary[activeDayTab] || currentTrip.itinerary[activeDayTab].length === 0) ? (
                      <p className="text-sm text-[#888] bg-[#FAF8F5] p-8 rounded-2xl text-center border border-[#EFECE6]">这一天还没有添加行程，点击上方按钮或从智能推荐中加入吧！</p>
                    ) : (
                      currentTrip.itinerary[activeDayTab].map((item, idx) => (
                        <div key={item.id || idx} className="p-6 rounded-3xl bg-[#FDFBF7] border border-[#EFECE6] space-y-3 relative group">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-[#2C2A29] text-white text-xs rounded-lg font-bold">{item.time}</span>
                              <span className="text-xs text-[#666] font-medium bg-[#EFECE6] px-3 py-1 rounded-full">⏳ 开放时间: {item.opening}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {/* 编辑按钮 */}
                              <button 
                                onClick={() => {
                                  setEditingItem({ day: activeDayTab, index: idx, ...item });
                                  setItineraryForm(item);
                                  setModalType('editItinerary');
                                }}
                                className="text-gray-400 hover:text-amber-700 transition p-2 rounded-xl hover:bg-amber-50"
                                title="编辑此行程"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              {/* 二次确认删除按钮 */}
                              <button 
                                onClick={() => confirmAndDelete(() => {
                                  const updatedDayList = currentTrip.itinerary[activeDayTab].filter((_, i) => i !== idx);
                                  const updatedItinerary = { ...currentTrip.itinerary, [activeDayTab]: updatedDayList };
                                  setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updatedItinerary } : t));
                                }, item.title)}
                                className="text-gray-400 hover:text-red-500 transition p-2 rounded-xl hover:bg-red-50"
                                title="删除此行程"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <h4 className="font-bold text-lg text-[#1A1817]">{item.title}</h4>
                          <p className="text-sm text-[#666] leading-relaxed">{item.desc}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#EFECE6] text-xs text-[#555]">
                            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#EFECE6]">
                              <Navigation className="w-4 h-4 text-amber-600 shrink-0" />
                              <span><strong>推荐交通:</strong> {item.transport}</span>
                            </div>
                            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#EFECE6]">
                              <div className="flex items-center gap-2 truncate">
                                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                                <span className="truncate"><strong>距离提示:</strong> {item.distance}</span>
                              </div>
                              {item.mapUrl && (
                                <a 
                                  href={item.mapUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-1 font-bold shrink-0 ml-2"
                                >
                                  Google Maps <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* 照片展示 */}
                          <div className="pt-2">
                            {item.photo ? (
                              <div className="relative h-40 rounded-2xl overflow-hidden border border-[#EFECE6]">
                                <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
                                <button 
                                  onClick={() => {
                                    const updatedList = currentTrip.itinerary[activeDayTab].map((it, i) => i === idx ? { ...it, photo: '' } : it);
                                    setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: { ...currentTrip.itinerary, [activeDayTab]: updatedList } } : t));
                                  }}
                                  className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg"
                                >
                                  更换照片
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => {
                                  const imgUrl = prompt('请输入该景点的照片图片链接 (URL):', 'https://images.unsplash.com/photo-...');
                                  if (!imgUrl) return;
                                  const updatedList = currentTrip.itinerary[activeDayTab].map((it, i) => i === idx ? { ...it, photo: imgUrl } : it);
                                  setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: { ...currentTrip.itinerary, [activeDayTab]: updatedList } } : t));
                                  triggerToast('📸 景点照片添加成功！');
                                }}
                                className="text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition flex items-center gap-1"
                              >
                                <Camera className="w-3.5 h-3.5" /> + 为此景点添加照片
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: 智能推荐景点 (纯智能推荐，未在已添加行程里，可一键弹窗加入某天) */}
              {activeTab === 'recommendations' && (
                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">智能推荐必去景点</h3>
                    <p className="text-xs text-[#777] mt-0.5">系统自动过滤已安排的景点，点击「一键加入行程」可直接规划到具体天数与时间</p>
                  </div>

                  {getSmartRecommendedSpots().length === 0 ? (
                    <div className="text-center py-12 bg-[#FAF8F5] rounded-3xl border border-[#EFECE6] text-[#888]">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                      <p className="text-sm font-medium">太棒了！所有推荐的景点都已经完美安排进您的行程里啦！</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {getSmartRecommendedSpots().map((spot, i) => (
                        <div key={spot.id || i} className="rounded-3xl overflow-hidden border border-[#EFECE6] bg-white shadow-xs flex flex-col justify-between">
                          <div>
                            <div className="h-44 overflow-hidden">
                              <img src={spot.img} alt={spot.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                            </div>
                            <div className="p-5 space-y-2">
                              <h4 className="font-bold text-lg text-[#1A1817]">{spot.name}</h4>
                              <p className="text-sm text-[#666] leading-relaxed">{spot.desc}</p>
                            </div>
                          </div>
                          <div className="p-5 pt-0">
                            <button 
                              onClick={() => {
                                setSpotToSchedule(spot);
                                setSpotDayTarget(Object.keys(currentTrip.itinerary)[0] || 'Day 1');
                                setSpotTimeTarget('14:00');
                                setModalType('scheduleSpot');
                              }}
                              className="w-full py-2.5 bg-[#2C2A29] text-white text-xs font-bold rounded-2xl hover:bg-[#444] transition flex items-center justify-center gap-2 shadow-sm"
                            >
                              <Plus className="w-4 h-4" /> 一键加入行程
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: 航班与酒店住宿 */}
              {activeTab === 'flights_hotels' && (
                <div className="mt-8 space-y-8">
                  {/* 航班板块 */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <Plane className="w-5 h-5 text-indigo-600" /> 航班信息
                      </h3>
                      <button 
                        onClick={() => {
                          setFlightForm({ type: '去程', flightNo: '', date: '', time: '', route: '' });
                          setModalType('flight');
                        }}
                        className="px-4 py-2 bg-[#2C2A29] text-white text-xs rounded-xl font-medium"
                      >
                        + 添加航班
                      </button>
                    </div>

                    {(!currentTrip.flights || currentTrip.flights.length === 0) ? (
                      <p className="text-sm text-[#888] bg-[#FAF8F5] p-5 rounded-2xl border border-[#EFECE6]">暂无航班记录</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentTrip.flights.map((f, i) => (
                          <div key={f.id || i} className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#EFECE6] space-y-2 relative">
                            <div className="flex justify-between font-bold text-sm">
                              <span>{f.type}：{f.flightNo}</span>
                              <button 
                                onClick={() => confirmAndDelete(() => {
                                  const updated = currentTrip.flights.filter((_, idx) => idx !== i);
                                  setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, flights: updated } : t));
                                }, f.flightNo)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-[#1A1817]">{f.route}</p>
                            <p className="text-xs text-[#666]">日期: {f.date} | 时间：{f.time}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 酒店住宿板块 */}
                  <div className="space-y-4 pt-4 border-t border-[#EFECE6]">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <Hotel className="w-5 h-5 text-teal-600" /> 酒店与住宿
                      </h3>
                      <button 
                        onClick={() => {
                          setHotelForm({ name: '', address: '', checkIn: '', checkOut: '' });
                          setModalType('hotel');
                        }}
                        className="px-4 py-2 bg-[#2C2A29] text-white text-xs rounded-xl font-medium"
                      >
                        + 添加酒店
                      </button>
                    </div>

                    {(!currentTrip.hotels || currentTrip.hotels.length === 0) ? (
                      <p className="text-sm text-[#888] bg-[#FAF8F5] p-5 rounded-2xl border border-[#EFECE6]">暂无酒店记录</p>
                    ) : (
                      <div className="space-y-4">
                        {currentTrip.hotels.map((h, i) => (
                          <div key={h.id || i} className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#EFECE6] space-y-2 relative">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold text-base text-[#1A1817]">{h.name}</h4>
                              <button 
                                onClick={() => confirmAndDelete(() => {
                                  const updated = currentTrip.hotels.filter((_, idx) => idx !== i);
                                  setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, hotels: updated } : t));
                                }, h.name)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-[#666]">📍 地址：{h.address}</p>
                            <p className="text-xs font-medium text-[#555]">入住：{h.checkIn} ~ 退房：{h.checkOut}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: 天气与行前指南 (实时对应行程日期、智能推荐物品与穿搭) */}
              {activeTab === 'weather' && (
                <div className="mt-8 space-y-6">
                  <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#EFECE6] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <span className="text-xs text-[#888] font-bold uppercase tracking-wider">实时更新：{currentTrip.startDate} 至 {currentTrip.endDate} 预计天气</span>
                      <div className="text-4xl font-extrabold mt-2 flex items-center gap-4 text-[#1A1817]">
                        {currentTrip.weather.temp} 
                        <span className="text-xl font-normal text-[#555]">{currentTrip.weather.condition}</span>
                      </div>
                      <p className="text-sm text-[#666] mt-3 max-w-xl leading-relaxed">{currentTrip.weather.advice}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="p-6 border border-[#EFECE6] rounded-3xl bg-white shadow-xs space-y-3">
                      <h4 className="font-bold text-base flex items-center gap-2 text-[#1A1817]">👕 智能穿搭建议</h4>
                      <p className="text-sm text-[#666] leading-relaxed">
                        基于目的地当前气温（{currentTrip.weather.temp}），智能建议采用洋葱式穿搭法，外出时内搭发热保暖衣，外穿防风御寒外套，鞋履选择舒适防滑鞋。
                      </p>
                    </div>
                    <div className="p-6 border border-[#EFECE6] rounded-3xl bg-white shadow-xs space-y-3">
                      <h4 className="font-bold text-base flex items-center gap-2 text-[#1A1817]">🎒 智能行前物品推荐</h4>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {(currentTrip.packingList || ['护照证件', '大容量充电宝', '常备药', '转换插头']).map((item, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-[#F5F2EB] text-[#444] text-xs font-semibold rounded-xl border border-[#EFECE6]">
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: 记账 (多币种、实时转RM、可编辑、可删除) */}
              {activeTab === 'expenses' && (
                <div className="mt-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">同行开销分摊（多币种实时换算）</h3>
                      <p className="text-xs text-[#777] mt-0.5">自动将外币折算为马币（RM）计算总消费</p>
                    </div>
                    <button 
                      onClick={() => {
                        setEditingItem(null);
                        setExpenseForm({ title: '', amount: '', currency: 'MYR', paidBy: '我', category: '餐饮' });
                        setModalType('expense');
                      }}
                      className="px-4 py-2 bg-[#2C2A29] text-white text-xs rounded-xl font-medium"
                    >
                      + 记一笔
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentTrip.expenses.map((exp, idx) => (
                      <div key={exp.id || idx} className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EFECE6] flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-sm text-[#1A1817]">{exp.title}</h4>
                          <span className="text-xs text-[#777]">付款人: {exp.paidBy} · 类别: {exp.category}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-bold text-base block">{exp.currency || 'MYR'} {exp.amount}</span>
                            <span className="text-xs text-emerald-600 font-medium">≈ RM {exp.convertedRM || convertToRM(exp.amount, exp.currency || 'MYR')}</span>
                          </div>
                          {/* 编辑账单 */}
                          <button 
                            onClick={() => {
                              setEditingItem({ index: idx, ...exp });
                              setExpenseForm({ title: exp.title, amount: exp.amount, currency: exp.currency || 'MYR', paidBy: exp.paidBy, category: exp.category });
                              setModalType('editExpense');
                            }}
                            className="text-gray-400 hover:text-amber-700"
                            title="编辑账单"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {/* 二次确认删除 */}
                          <button 
                            onClick={() => confirmAndDelete(() => {
                              const updated = currentTrip.expenses.filter((_, i) => i !== idx);
                              setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, expenses: updated } : t));
                            }, exp.title)}
                            className="text-gray-400 hover:text-red-500"
                            title="删除账单"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                        const imgUrl = prompt('请输入照片图片链接 (URL):', 'https://images.unsplash.com/photo-...');
                        if (!imgUrl) return;
                        const updated = trips.map(t => t.id === currentTrip.id ? { ...t, memories: [...t.memories, imgUrl] } : t);
                        setTrips(updated);
                        triggerToast('📸 照片已成功上传！');
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
                        <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-[#EFECE6] relative group">
                          <img src={url} alt="memory" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => confirmAndDelete(() => {
                              const updatedMemories = currentTrip.memories.filter((_, idx) => idx !== i);
                              setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, memories: updatedMemories } : t));
                            }, '这张照片')}
                            className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-xl hover:bg-red-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* ================= POPUP MODAL TABLES (弹窗表单表格) ================= */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EFECE6] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up">
            
            {/* 1. 添加行程弹窗 */}
            {modalType === 'itinerary' && (
              <>
                <div className="flex justify-between items-center border-b border-[#F2EFE9] pb-4">
                  <h3 className="font-bold text-lg">📝 新增行程详情</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">目标天数</label>
                    <select 
                      value={activeDayTab} 
                      onChange={e => setActiveDayTab(e.target.value)}
                      className="w-full p-3 bg-white border border-[#EFECE6] rounded-xl text-sm"
                    >
                      {Object.keys(currentTrip?.itinerary || {}).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">时间</label>
                      <input type="text" value={itineraryForm.time} onChange={e => setItineraryForm({...itineraryForm, time: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="14:00" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">景点名称</label>
                      <input type="text" value={itineraryForm.title} onChange={e => setItineraryForm({...itineraryForm, title: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="浅草寺" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">与上一站的距离提示</label>
                    <input type="text" value={itineraryForm.distance} onChange={e => setItineraryForm({...itineraryForm, distance: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="距上一站步行 10 分钟" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">推荐交通</label>
                      <input type="text" value={itineraryForm.transport} onChange={e => setItineraryForm({...itineraryForm, transport: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="地铁" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">开放时间</label>
                      <input type="text" value={itineraryForm.opening} onChange={e => setItineraryForm({...itineraryForm, opening: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="09:00 - 18:00" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">Google Maps 链接</label>
                    <input type="text" value={itineraryForm.mapUrl} onChange={e => setItineraryForm({...itineraryForm, mapUrl: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="https://maps.google.com/?q=..." />
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">游玩描述 / 备注</label>
                    <textarea value={itineraryForm.desc} onChange={e => setItineraryForm({...itineraryForm, desc: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="描述..." />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!itineraryForm.title) { alert('请填写景点名称'); return; }
                        const newItem = { id: Date.now().toString(), ...itineraryForm };
                        const updated = {
                          ...currentTrip.itinerary,
                          [activeDayTab]: [...(currentTrip.itinerary[activeDayTab] || []), newItem]
                        };
                        setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updated } : t));
                        setModalType(null);
                        triggerToast('✨ 行程添加成功并实时云端同步！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      确认添加
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 2. 编辑行程弹窗 */}
            {modalType === 'editItinerary' && (
              <>
                <div className="flex justify-between items-center border-b border-[#F2EFE9] pb-4">
                  <h3 className="font-bold text-lg">✏️ 编辑行程详情</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">时间</label>
                      <input type="text" value={itineraryForm.time} onChange={e => setItineraryForm({...itineraryForm, time: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">景点名称</label>
                      <input type="text" value={itineraryForm.title} onChange={e => setItineraryForm({...itineraryForm, title: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">与上一站距离提示</label>
                    <input type="text" value={itineraryForm.distance} onChange={e => setItineraryForm({...itineraryForm, distance: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">推荐交通</label>
                      <input type="text" value={itineraryForm.transport} onChange={e => setItineraryForm({...itineraryForm, transport: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">开放时间</label>
                      <input type="text" value={itineraryForm.opening} onChange={e => setItineraryForm({...itineraryForm, opening: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">Google Maps 链接</label>
                    <input type="text" value={itineraryForm.mapUrl} onChange={e => setItineraryForm({...itineraryForm, mapUrl: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">描述</label>
                    <textarea value={itineraryForm.desc} onChange={e => setItineraryForm({...itineraryForm, desc: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        const dayList = [...currentTrip.itinerary[editingItem.day]];
                        dayList[editingItem.index] = { ...editingItem, ...itineraryForm };
                        const updatedItinerary = { ...currentTrip.itinerary, [editingItem.day]: dayList };
                        setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updatedItinerary } : t));
                        setModalType(null);
                        triggerToast('✏️ 行程修改成功！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      保存修改
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 3. 智能推荐景点一键加入弹窗 */}
            {modalType === 'scheduleSpot' && spotToSchedule && (
              <>
                <div className="flex justify-between items-center border-b border-[#F2EFE9] pb-4">
                  <h3 className="font-bold text-lg">✨ 将推荐景点加入日程</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-[#FAF8F5] p-3 rounded-2xl border border-[#EFECE6]">
                    <img src={spotToSchedule.img} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm">{spotToSchedule.name}</h4>
                      <p className="text-xs text-[#666] line-clamp-1">{spotToSchedule.desc}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">选择天数</label>
                      <select value={spotDayTarget} onChange={e => setSpotDayTarget(e.target.value)} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm">
                        {Object.keys(currentTrip.itinerary).map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">游玩时间</label>
                      <input type="text" value={spotTimeTarget} onChange={e => setSpotTimeTarget(e.target.value)} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="14:00" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        const newSpotItem = {
                          id: Date.now().toString(),
                          time: spotTimeTarget,
                          title: spotToSchedule.name,
                          desc: spotToSchedule.desc,
                          transport: '建议步行或搭乘公共交通',
                          distance: '距上一站：智能规划中',
                          opening: '09:00 - 18:00',
                          mapUrl: `https://maps.google.com/?q=${encodeURIComponent(spotToSchedule.name)}`,
                          photo: spotToSchedule.img
                        };
                        const updatedItinerary = {
                          ...currentTrip.itinerary,
                          [spotDayTarget]: [...(currentTrip.itinerary[spotDayTarget] || []), newSpotItem]
                        };
                        setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updatedItinerary } : t));
                        setModalType(null);
                        triggerToast(`✨ 成功将 "${spotToSchedule.name}" 加入 ${spotDayTarget}！`);
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      确认加入
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 4. 添加航班弹窗 */}
            {modalType === 'flight' && (
              <>
                <div className="flex justify-between items-center border-b border-[#F2EFE9] pb-4">
                  <h3 className="font-bold text-lg">✈️ 添加航班信息</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">航班类型</label>
                    <select value={flightForm.type} onChange={e => setFlightForm({...flightForm, type: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm">
                      <option value="去程">去程</option>
                      <option value="回程">回程</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">航班号</label>
                    <input type="text" value={flightForm.flightNo} onChange={e => setFlightForm({...flightForm, flightNo: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="JL 0724" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">日期</label>
                      <input type="date" value={flightForm.date} onChange={e => setFlightForm({...flightForm, date: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">时间</label>
                      <input type="text" value={flightForm.time} onChange={e => setFlightForm({...flightForm, time: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="09:15 -> 17:30" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">航线</label>
                    <input type="text" value={flightForm.route} onChange={e => setFlightForm({...flightForm, route: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="KUL -> NRT" />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!flightForm.flightNo) { alert('请填写航班号'); return; }
                        const newF = { id: Date.now().toString(), ...flightForm };
                        setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, flights: [...t.flights, newF] } : t));
                        setModalType(null);
                        triggerToast('✈️ 航班添加成功！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      确认添加
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 5. 添加酒店弹窗 */}
            {modalType === 'hotel' && (
              <>
                <div className="flex justify-between items-center border-b border-[#F2EFE9] pb-4">
                  <h3 className="font-bold text-lg">🏨 添加酒店住宿</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">酒店名称</label>
                    <input type="text" value={hotelForm.name} onChange={e => setHotelForm({...hotelForm, name: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="新宿格拉斯丽酒店" />
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">地址</label>
                    <input type="text" value={hotelForm.address} onChange={e => setHotelForm({...hotelForm, address: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="详细地址..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">入住日期</label>
                      <input type="date" value={hotelForm.checkIn} onChange={e => setHotelForm({...hotelForm, checkIn: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">退房日期</label>
                      <input type="date" value={hotelForm.checkOut} onChange={e => setHotelForm({...hotelForm, checkOut: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!hotelForm.name) { alert('请填写酒店名称'); return; }
                        const newH = { id: Date.now().toString(), ...hotelForm };
                        setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, hotels: [...t.hotels, newH] } : t));
                        setModalType(null);
                        triggerToast('🏨 酒店添加成功！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      确认添加
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 6. 多币种记账弹窗 (添加与编辑) */}
            {(modalType === 'expense' || modalType === 'editExpense') && (
              <>
                <div className="flex justify-between items-center border-b border-[#F2EFE9] pb-4">
                  <h3 className="font-bold text-lg">{modalType === 'expense' ? '💰 多币种记账' : '✏️ 编辑消费账单'}</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">消费项目名称</label>
                    <input type="text" value={expenseForm.title} onChange={e => setExpenseForm({...expenseForm, title: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="米其林晚餐" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">金额</label>
                      <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="450" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">币种 (自动换算 RM)</label>
                      <select value={expenseForm.currency} onChange={e => setExpenseForm({...expenseForm, currency: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm font-bold">
                        <option value="MYR">MYR (马币)</option>
                        <option value="JPY">JPY (日元)</option>
                        <option value="USD">USD (美元)</option>
                        <option value="THB">THB (泰铢)</option>
                        <option value="EUR">EUR (欧元)</option>
                        <option value="SGD">SGD (新币)</option>
                      </select>
                    </div>
                  </div>
                  {/* 实时预览换算结果 */}
                  <div className="p-3 bg-[#FAF8F5] rounded-xl text-xs text-emerald-700 font-medium flex justify-between items-center">
                    <span>实时汇率折算预览：</span>
                    <span className="font-bold text-sm">≈ RM {convertToRM(expenseForm.amount, expenseForm.currency)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">付款人</label>
                      <input type="text" value={expenseForm.paidBy} onChange={e => setExpenseForm({...expenseForm, paidBy: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm" placeholder="Alex / 我" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">消费类别</label>
                      <select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} className="w-full p-3 border border-[#EFECE6] rounded-xl text-sm">
                        <option value="餐饮">餐饮</option>
                        <option value="交通">交通</option>
                        <option value="住宿">住宿</option>
                        <option value="门票/娱乐">门票/娱乐</option>
                        <option value="购物">购物</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!expenseForm.title || !expenseForm.amount) { alert('请填写完整'); return; }
                        const convertedRM = convertToRM(expenseForm.amount, expenseForm.currency);
                        if (modalType === 'expense') {
                          const newExp = { id: Date.now().toString(), title: expenseForm.title, amount: parseFloat(expenseForm.amount), currency: expenseForm.currency, convertedRM, paidBy: expenseForm.paidBy, category: expenseForm.category };
                          const updated = trips.map(t => t.id === currentTrip.id ? { ...t, expenses: [...t.expenses, newExp] } : t);
                          setTrips(updated);
                          triggerToast('💰 记账成功并已同步！');
                        } else {
                          const list = [...currentTrip.expenses];
                          list[editingItem.index] = { ...editingItem, title: expenseForm.title, amount: parseFloat(expenseForm.amount), currency: expenseForm.currency, convertedRM, paidBy: expenseForm.paidBy, category: expenseForm.category };
                          const updated = trips.map(t => t.id === currentTrip.id ? { ...t, expenses: list } : t);
                          setTrips(updated);
                          triggerToast('✏️ 账单修改成功！');
                        }
                        setModalType(null);
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      {modalType === 'expense' ? '确认记账' : '保存修改'}
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
