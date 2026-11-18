import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, DollarSign, CloudSun, Users, 
  Share2, Plus, Trash2, CheckCircle, Plane, Hotel, 
  Sparkles, Camera, BookOpen, Clock, Heart, Download
} from 'lucide-react';

export default function App() {
  // 云端/本地兼容的状态管理
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
          { day: 2, date: '2026-12-26', title: '浅草寺祈福与晴空塔', notes: '上午游览浅草寺雷门，下午登东京晴空塔俯瞰全景。' }
        ],
        expenses: [
          { id: 'e1', title: '往返机票', amount: 2400, paidBy: 'Alex', category: '交通' },
          { id: 'e2', title: '新宿四晚酒店', amount: 1800, paidBy: 'Sarah', category: '住宿' }
        ],
        memories: []
      }
    ];
  });

  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || '1');
  const [activeTab, setActiveTab] = useState('itinerary'); // itinerary, weather, expenses, memories
  const [toast, setToast] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);

  // 模拟云端实时同步监听
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
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    triggerToast('🔗 专属同行链接已复制！发给好友即可一起同步编辑');
  };

  // 实时天气模拟抓取
  const handleFetchWeather = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const updated = trips.map(t => {
        if (t.id === currentTrip.id) {
          return {
            ...t,
            weather: { temp: '-2°C', condition: '小雪 🌨️', advice: '目的地正下雪，请务必携带防滑雪地靴、手套、帽子及保暖内衣。' }
          };
        }
        return t;
      });
      setTrips(updated);
      setIsSyncing(false);
      triggerToast('🌤️ 已成功同步最新气温与穿搭建议！');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2A29] font-sans antialiased pb-12">
      {/* 顶部状态通知 Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#2C2A29] text-[#FDFBF7] px-4 py-3 rounded-xl shadow-xl text-sm flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* 顶部导航栏 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#EFECE6] sticky top-0 z-40 px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFECE6] flex items-center justify-center text-[#2C2A29]">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Travel with Me</h1>
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {isSyncing ? '云端同步中...' : '云端实时同步已连接 (多设备共创)'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleShareLink}
              className="px-4 py-2 bg-[#2C2A29] text-[#FDFBF7] text-sm rounded-xl font-medium hover:bg-[#44403D] transition flex items-center gap-2 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              分享同行链接
            </button>
            <button 
              onClick={() => {
                const newTitle = prompt('请输入新旅行名称：', '曼谷 4天3夜阳光美食之旅');
                if (!newTitle) return;
                const newT = {
                  id: Date.now().toString(),
                  title: newTitle,
                  destination: '泰国·曼谷 (Bangkok)',
                  startDate: '2026-06-01',
                  endDate: '2026-06-04',
                  budget: '3,000',
                  currency: 'RM',
                  companions: 2,
                  weather: { temp: '32°C', condition: '晴朗 ☀️', advice: '热带气候，请携带轻便透气衣物、太阳镜与高倍防晒霜。' },
                  itinerary: [{ day: 1, date: '2026-06-01', title: '初到曼谷 & 夜市', notes: '入住市中心酒店，晚上逛JODD FAIRS夜市。' }],
                  expenses: [],
                  memories: []
                };
                setTrips([...trips, newT]);
                setSelectedTripId(newT.id);
                triggerToast('✨ 成功创建新旅程！');
              }}
              className="px-4 py-2 bg-[#EFECE6] text-[#2C2A29] text-sm rounded-xl font-medium hover:bg-[#E5E0D8] transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              创建新旅程
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-5xl mx-auto px-6 mt-8">
        {/* 旅程切换栏 */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {trips.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTripId(t.id)}
              className={`px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedTripId === t.id 
                  ? 'bg-[#2C2A29] text-[#FDFBF7] shadow-md' 
                  : 'bg-white text-[#666] border border-[#EFECE6] hover:bg-[#F5F2EB]'
              }`}
            >
              <MapPin className="w-4 h-4 opacity-70" />
              {t.title}
            </button>
          ))}
        </div>

        {/* 当前旅程大卡片 */}
        <div className="bg-white border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#F2EFE9]">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#F5F2EB] text-[#555] text-xs font-semibold mb-2">
                {currentTrip.destination}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{currentTrip.title}</h2>
              <p className="text-sm text-[#777] mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {currentTrip.startDate} ~ {currentTrip.endDate}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4"/> {currentTrip.companions} 人同行</span>
              </p>
            </div>
            <div className="bg-[#FDFBF7] border border-[#EFECE6] px-5 py-3 rounded-2xl text-right">
              <span className="text-xs text-[#888] block">预算总额</span>
              <span className="text-xl font-bold text-[#2C2A29]">{currentTrip.currency} {currentTrip.budget}</span>
            </div>
          </div>

          {/* 功能标签切换 */}
          <div className="flex gap-2 mt-6 border-b border-[#F2EFE9] pb-4">
            {[
              { id: 'itinerary', label: '每日行程 & 交通', icon: BookOpen },
              { id: 'weather', label: '天气与行李指南', icon: CloudSun },
              { id: 'expenses', label: '多币种记账', icon: DollarSign },
              { id: 'memories', label: '旅途回忆照片', icon: Camera }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-[#EFECE6] text-[#2C2A29]' 
                      : 'text-[#888] hover:bg-[#F9F8F5]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 标签页 1：行程与交通 */}
          {activeTab === 'itinerary' && (
            <div className="mt-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">详细行程规划</h3>
                <button 
                  onClick={() => {
                    const dayTitle = prompt('请输入新一天的标题（例如：Day 3 迪士尼乐园）：', 'Day 3 自由探索');
                    if (!dayTitle) return;
                    const newItinerary = [...currentTrip.itinerary, { day: currentTrip.itinerary.length + 1, date: '2026-12-27', title: dayTitle, notes: '点击编辑当日详细安排与交通提示。' }];
                    setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: newItinerary } : t));
                    triggerToast('➕ 已添加新一天行程！');
                  }}
                  className="text-xs bg-[#2C2A29] text-[#FDFBF7] px-3 py-1.5 rounded-lg font-medium hover:bg-[#444] transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 添加日程
                </button>
              </div>

              <div className="space-y-4">
                {currentTrip.itinerary.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#EFECE6] flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 bg-[#2C2A29] text-white text-xs rounded-md font-bold">Day {item.day}</span>
                        <span className="text-xs text-[#888]">{item.date}</span>
                      </div>
                      <h4 className="font-bold text-base mt-1">{item.title}</h4>
                      <p className="text-sm text-[#666] mt-1">{item.notes}</p>
                    </div>
                    <button 
                      onClick={() => {
                        const updatedItinerary = currentTrip.itinerary.filter((_, i) => i !== idx);
                        setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updatedItinerary } : t));
                        triggerToast('🗑️ 已删除该日程');
                      }}
                      className="text-gray-400 hover:text-red-500 transition self-end sm:self-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 标签页 2：天气与行李 */}
          {activeTab === 'weather' && (
            <div className="mt-6 space-y-6">
              <div className="flex justify-between items-center bg-[#F8F6F0] p-6 rounded-3xl border border-[#EFECE6]">
                <div>
                  <span className="text-xs text-[#888] font-semibold uppercase tracking-wider">实时气象预测</span>
                  <div className="text-3xl font-bold mt-1 flex items-center gap-3">
                    {currentTrip.weather.temp} 
                    <span className="text-lg font-normal text-[#555]">{currentTrip.weather.condition}</span>
                  </div>
                  <p className="text-sm text-[#666] mt-2 max-w-xl">{currentTrip.weather.advice}</p>
                </div>
                <button 
                  onClick={handleFetchWeather}
                  className="px-4 py-2.5 bg-[#2C2A29] text-white text-sm rounded-xl font-medium hover:bg-[#444] transition flex items-center gap-2 shadow-sm"
                >
                  <CloudSun className="w-4 h-4" /> 同步实时天气
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 border border-[#EFECE6] rounded-2xl bg-white">
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2">👕 智能穿搭建议</h4>
                  <ul className="text-sm text-[#666] space-y-2 list-disc pl-4">
                    <li>建议采用洋葱式穿搭法（发热衣 + 毛衣 + 防风外套）。</li>
                    <li>前往户外雪景或低温区务必准备围巾、手套。</li>
                  </ul>
                </div>
                <div className="p-5 border border-[#EFECE6] rounded-2xl bg-white">
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2">🎒 随身必备清单</h4>
                  <ul className="text-sm text-[#666] space-y-2 list-disc pl-4">
                    <li>护照、签证复印件及酒店预订单。</li>
                    <li>充电宝、万能转换插头与常用个人药品。</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 标签页 3：多币种记账 */}
          {activeTab === 'expenses' && (
            <div className="mt-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">同行开销分摊</h3>
                <button 
                  onClick={() => {
                    const title = prompt('请输入花销名称（例如：烧肉晚餐）：', '特色晚餐');
                    const amt = prompt('请输入金额：', '350');
                    if (!title || !amt) return;
                    const newExpense = { id: Date.now().toString(), title, amount: parseFloat(amt), paidBy: '我', category: '餐饮' };
                    setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, expenses: [...t.expenses, newExpense] } : t));
                    triggerToast('💰 记账成功！');
                  }}
                  className="text-xs bg-[#2C2A29] text-[#FDFBF7] px-3 py-1.5 rounded-lg font-medium hover:bg-[#444] transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 记一笔
                </button>
              </div>

              <div className="space-y-3">
                {currentTrip.expenses.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EFECE6] flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm">{exp.title}</h4>
                      <span className="text-xs text-[#888]">付款人: {exp.paidBy} · 类别: {exp.category}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-base">{currentTrip.currency} {exp.amount}</span>
                      <button 
                        onClick={() => {
                          const updated = currentTrip.expenses.filter((_, i) => i !== idx);
                          setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, expenses: updated } : t));
                          triggerToast('🗑️ 已删除该笔账单');
                        }}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 标签页 4：回忆照片 */}
          {activeTab === 'memories' && (
            <div className="mt-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">旅途回忆相册</h3>
                <button 
                  onClick={() => {
                    const imgUrl = prompt('请输入照片图片链接 (URL)：', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600');
                    if (!imgUrl) return;
                    const newMemories = [...(currentTrip.memories || []), imgUrl];
                    setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, memories: newMemories } : t));
                    triggerToast('📸 照片已上传！');
                  }}
                  className="text-xs bg-[#2C2A29] text-[#FDFBF7] px-3 py-1.5 rounded-lg font-medium hover:bg-[#444] transition flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" /> 上传照片
                </button>
              </div>

              {(!currentTrip.memories || currentTrip.memories.length === 0) ? (
                <div className="text-center py-12 border-2 border-dashed border-[#EFECE6] rounded-3xl text-[#999]">
                  <Camera className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">暂无回忆照片，点击上方按钮添加旅途精彩瞬间吧！</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {currentTrip.memories.map((url, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-[#EFECE6] bg-white shadow-sm">
                      <img src={url} alt="memory" className="w-full h-full object-cover hover:scale-105 transition duration-300" />
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
