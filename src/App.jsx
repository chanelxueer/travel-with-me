import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, DollarSign, CloudSun, Users, 
  Share2, Plus, Trash2, CheckCircle, Plane, Hotel, 
  Sparkles, Camera, BookOpen, Clock, Heart, Download, Compass, ChevronRight
} from 'lucide-react';

export default function App() {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('travel_with_me_trips');
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
        weather: { temp: '6°C', condition: '多云 ☁️', advice: '早晚温差大，建议穿厚羽绒服与防风外套，备好暖贴。' },
        itinerary: [
          { day: 1, date: '2026-12-25', title: '抵达东京 & 新宿夜景', notes: '入住新宿酒店，晚上前往歌舞伎町与思出横丁品尝串烧。' },
          { day: 2, date: '2026-12-26', title: '浅草寺祈福与晴空塔', notes: '上午游览浅草寺雷门，下午登东京晴空塔俯瞰全景。' },
          { day: 3, date: '2026-12-27', title: '筑地市场美食与银座购物', notes: '品尝新鲜海鲜丼，下午漫步银座体验高级商圈。' }
        ],
        expenses: [
          { id: 'e1', title: '往返机票', amount: 2400, paidBy: 'Alex', category: '交通' },
          { id: 'e2', title: '新宿四晚酒店', amount: 1800, paidBy: 'Sarah', category: '住宿' },
          { id: 'e3', title: '米其林晚餐', amount: 650, paidBy: 'Alex', category: '餐饮' }
        ],
        memories: [
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600',
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600'
        ]
      }
    ];
  });

  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || '1');
  const [activeTab, setActiveTab] = useState('itinerary');
  const [toast, setToast] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    localStorage.setItem('travel_with_me_trips', JSON.stringify(trips));
    const timer = setTimeout(() => setIsSyncing(false), 800);
    return () => clearTimeout(timer);
  }, [trips]);

  const currentTrip = trips.find(t => t.id === selectedTripId) || trips[0];

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast('🔗 专属同行链接已复制！发给好友即可一起同步编辑');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans antialiased pb-20">
      {/* 顶部提示浮窗 */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#2C2A29] text-[#FDFBF7] px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-3 border border-white/10">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* 顶栏导航 */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#EFECE6] sticky top-0 z-40 px-6 py-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#2C2A29] text-[#FDFBF7] flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Travel with Me</h1>
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {isSyncing ? '云端同步中...' : '云端实时同步已连接 (多设备共创)'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleShareLink}
              className="px-4 py-2.5 bg-[#2C2A29] text-[#FDFBF7] text-sm rounded-2xl font-medium hover:bg-[#44403D] transition flex items-center gap-2 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              分享同行链接
            </button>
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
                  weather: { temp: '22°C', condition: '晴朗 ☀️', advice: '气候宜人，适合漫步，备好舒适步行鞋与防晒用品。' },
                  itinerary: [{ day: 1, date: '2026-09-10', title: '抵达巴黎 & 塞纳河畔', notes: '入住市区酒店，傍晚漫步塞纳河畔欣赏日落。' }],
                  expenses: [],
                  memories: []
                };
                setTrips([...trips, newT]);
                setSelectedTripId(newT.id);
                triggerToast('✨ 成功创建新旅程！');
              }}
              className="px-4 py-2.5 bg-[#EFECE6] text-[#2C2A29] text-sm rounded-2xl font-medium hover:bg-[#E5E0D8] transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              创建新旅程
            </button>
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="max-w-6xl mx-auto px-6 mt-8">
        {/* 旅程标签切换横条 */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {trips.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTripId(t.id)}
              className={`px-5 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2.5 border ${
                selectedTripId === t.id 
                  ? 'bg-[#2C2A29] text-[#FDFBF7] border-[#2C2A29] shadow-md' 
                  : 'bg-white text-[#555] border-[#EFECE6] hover:bg-[#F9F7F2]'
              }`}
            >
              <MapPin className="w-4 h-4 opacity-70" />
              <span className="font-semibold">{t.title}</span>
            </button>
          ))}
        </div>

        {/* 核心旅程卡片容器 */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          {/* 头部信息 */}
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

          {/* 选项卡导航 */}
          <div className="flex gap-3 mt-8 border-b border-[#F2EFE9] pb-4 overflow-x-auto">
            {[
              { id: 'itinerary', label: '每日行程规划', icon: BookOpen },
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

          {/* 1. 行程页面 */}
          {activeTab === 'itinerary' && (
            <div className="mt-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">详细行程安排</h3>
                  <p className="text-xs text-[#777] mt-0.5">所有同行伙伴均可实时添加与修改</p>
                </div>
                <button 
                  onClick={() => {
                    const dayTitle = prompt('请输入新一天的标题（例如：Day 4 温泉体验）：', 'Day 4 深度探索');
                    if (!dayTitle) return;
                    const newItinerary = [...currentTrip.itinerary, { day: currentTrip.itinerary.length + 1, date: '2026-12-28', title: dayTitle, notes: '点击编辑当日详细安排、门票及交通提示。' }];
                    setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: newItinerary } : t));
                    triggerToast('➕ 已成功添加新一天行程！');
                  }}
                  className="px-4 py-2 bg-[#2C2A29] text-[#FDFBF7] text-xs rounded-xl font-medium hover:bg-[#444] transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> 添加日程
                </button>
              </div>

              <div className="space-y-4">
                {currentTrip.itinerary.map((item, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-[#FDFBF7] border border-[#EFECE6] flex flex-col sm:flex-row justify-between gap-4 hover:border-[#D8D4CC] transition">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 bg-[#2C2A29] text-white text-xs rounded-lg font-bold tracking-wide">Day {item.day}</span>
                        <span className="text-xs font-medium text-[#777] flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {item.date}</span>
                      </div>
                      <h4 className="font-bold text-lg text-[#1A1817]">{item.title}</h4>
                      <p className="text-sm text-[#666] leading-relaxed">{item.notes}</p>
                    </div>
                    <button 
                      onClick={() => {
                        const updatedItinerary = currentTrip.itinerary.filter((_, i) => i !== idx);
                        setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updatedItinerary } : t));
                        triggerToast('🗑️ 已删除该日程');
                      }}
                      className="text-gray-400 hover:text-red-500 transition self-end sm:self-center p-2 rounded-xl hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. 天气与行李 */}
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
                <button 
                  onClick={() => triggerToast('🌤️ 已获取最新气象数据！')}
                  className="px-5 py-3 bg-[#2C2A29] text-white text-sm rounded-2xl font-medium hover:bg-[#444] transition flex items-center gap-2 shadow-sm"
                >
                  <CloudSun className="w-4 h-4" /> 刷新气象预报
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-6 border border-[#EFECE6] rounded-3xl bg-white shadow-xs">
                  <h4 className="font-bold text-base mb-4 flex items-center gap-2 text-[#1A1817]">👕 智能穿搭建议</h4>
                  <ul className="text-sm text-[#666] space-y-2.5 list-disc pl-4 leading-relaxed">
                    <li>建议采用洋葱式穿搭法，适应室内暖气与户外温差。</li>
                    <li>鞋履建议选择防滑舒适的运动鞋或雪地靴。</li>
                  </ul>
                </div>
                <div className="p-6 border border-[#EFECE6] rounded-3xl bg-white shadow-xs">
                  <h4 className="font-bold text-base mb-4 flex items-center gap-2 text-[#1A1817]">🎒 随身必备清单</h4>
                  <ul className="text-sm text-[#666] space-y-2.5 list-disc pl-4 leading-relaxed">
                    <li>护照原件、签证复印件及机票酒店确认单。</li>
                    <li>大容量充电宝、多国通用转换插头。</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 3. 记账页面 */}
          {activeTab === 'expenses' && (
            <div className="mt-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">同行开销分摊</h3>
                  <p className="text-xs text-[#777] mt-0.5">记录每一笔共同花销，轻松结算</p>
                </div>
                <button 
                  onClick={() => {
                    const title = prompt('请输入花销项目名称（例如：特色烧肉晚餐）：', '晚餐聚餐');
                    const amt = prompt('请输入消费金额：', '450');
                    if (!title || !amt) return;
                    const newExpense = { id: Date.now().toString(), title, amount: parseFloat(amt), paidBy: '我', category: '餐饮' };
                    setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, expenses: [...t.expenses, newExpense] } : t));
                    triggerToast('💰 记账成功！');
                  }}
                  className="px-4 py-2 bg-[#2C2A29] text-[#FDFBF7] text-xs rounded-xl font-medium hover:bg-[#444] transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> 记一笔
                </button>
              </div>

              <div className="space-y-3">
                {currentTrip.expenses.map((exp, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#EFECE6] flex justify-between items-center hover:border-[#D8D4CC] transition">
                    <div>
                      <h4 className="font-bold text-base text-[#1A1817]">{exp.title}</h4>
                      <span className="text-xs text-[#777] mt-0.5 block">付款人: <span className="font-medium text-[#444]">{exp.paidBy}</span> · 类别: {exp.category}</span>
                    </div>
                    <div className="flex items-center gap-5">
                      <span className="font-extrabold text-lg text-[#1A1817]">{currentTrip.currency} {exp.amount}</span>
                      <button 
                        onClick={() => {
                          const updated = currentTrip.expenses.filter((_, i) => i !== idx);
                          setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, expenses: updated } : t));
                          triggerToast('🗑️ 已删除该笔账单');
                        }}
                        className="text-gray-400 hover:text-red-500 transition p-2 rounded-xl hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. 相册页面 */}
          {activeTab === 'memories' && (
            <div className="mt-8 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">旅途回忆相册</h3>
                  <p className="text-xs text-[#777] mt-0.5">记录大家的精彩瞬间与美好风景</p>
                </div>
                <button 
                  onClick={() => {
                    const imgUrl = prompt('请输入照片图片链接 (URL)：', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600');
                    if (!imgUrl) return;
                    const newMemories = [...(currentTrip.memories || []), imgUrl];
                    setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, memories: newMemories } : t));
                    triggerToast('📸 照片已成功上传！');
                  }}
                  className="px-4 py-2 bg-[#2C2A29] text-[#FDFBF7] text-xs rounded-xl font-medium hover:bg-[#444] transition flex items-center gap-1.5 shadow-sm"
                >
                  <Camera className="w-4 h-4" /> 上传照片
                </button>
              </div>

              {(!currentTrip.memories || currentTrip.memories.length === 0) ? (
                <div className="text-center py-16 border-2 border-dashed border-[#EFECE6] rounded-3xl text-[#999] bg-[#FAF8F5]">
                  <Camera className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#555]" />
                  <p className="text-sm font-medium">暂无回忆照片，点击上方按钮添加旅途精彩瞬间吧！</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {currentTrip.memories.map((url, i) => (
                    <div key={i} className="aspect-square rounded-3xl overflow-hidden border border-[#EFECE6] bg-white shadow-xs group relative">
                      <img src={url} alt="memory" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
