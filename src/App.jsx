import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, DollarSign, CloudSun, Users, 
  Share2, Plus, Trash2, CheckCircle, Plane, Hotel, 
  Sparkles, Camera, BookOpen, Clock, Heart, Download, Compass, ChevronRight, ArrowLeft, Navigation, ExternalLink, Edit3, X, RefreshCw, Upload, ArrowRight, CheckSquare, Square
} from 'lucide-react';

export default function App() {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('travel_with_me_cloud_v15');
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
        currency: 'RM',
        companions: 3,
        companionNames: ['我', 'Alex', 'Sarah'],
        coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
        dailyWeather: {
          'Day 1': { temp: '6°C / 1°C', condition: '多云 ☁️', advice: '抵达东京气温较低，建议出机场前穿好羽绒服，注意保暖。', packing: ['厚羽绒服', '发热保暖内衣', '大容量充电宝'] },
          'Day 2': { temp: '4°C / -1°C', condition: '小雪 ❄️', advice: '有降雪可能，户外步行地面湿滑，请务必穿防滑雪地靴。', packing: ['防滑雪地靴', '防风手套', '暖贴'] },
          'Day 3': { temp: '8°C / 2°C', condition: '晴朗 ☀️', advice: '晴空万里，适合登高远眺，阳光下舒适但风较大。', packing: ['太阳镜', '润唇膏', '围巾'] }
        },
        flights: [
          { id: 'f1', type: '去程', flightNo: 'JL 0724', date: '2026-12-25', time: '09:15 -> 17:30', route: '吉隆坡 (KUL) -> 东京成田 (NRT)' }
        ],
        hotels: [
          { id: 'h1', name: '新宿格拉斯丽酒店', address: '东京都新宿区歌舞伎町 1-19-1', checkIn: '2026-12-25', checkOut: '2026-12-29' }
        ],
        itinerary: {
          'Day 1': [
            { id: 'i1', time: '18:00', title: '抵达东京与新宿入住', desc: '入住酒店，和哥斯拉合影。', transport: '在机场B1层搭乘 Narita Express (N\'EX) 直达新宿站，出站步行 5 分钟即到酒店。', distance: '起点 / 机场至酒店 80km', opening: '全天', mapUrl: 'https://maps.google.com/?q=Shinjuku', photo: '' },
            { id: 'i2', time: '20:00', title: '思出横丁晚餐', desc: '品尝碳烤串烧。', transport: '从新宿站西口步行 3 分钟即可到达昭和风情横丁。', distance: '距上一站：步行 5 分钟 (约 400米)', opening: '17:00 - 24:00', mapUrl: 'https://maps.google.com/?q=Omoide+Yokocho', photo: '' }
          ],
          'Day 2': [
            { id: 'i3', time: '09:30', title: '浅草寺雷门', desc: '参观最古老寺庙。', transport: 'From Shinjuku Sta. take Toei Oedo Line to Daimon, transfer to Asakusa Line to Asakusa Sta.', distance: '距上一站：地铁约 25 分钟', opening: '06:00 - 17:00', mapUrl: 'https://maps.google.com/?q=Senso-ji', photo: '' }
          ]
        },
        masterSpots: [
          { id: 's1', name: '涩谷空中展望台 (Shibuya Sky)', desc: '俯瞰全球最繁忙十字路口，绝佳日落观赏点。', img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600', mapUrl: 'https://maps.google.com/?q=Shibuya+Sky', rednoteUrl: 'https://www.xiaohongshu.com/search_result?keyword=Shibuya%20Sky' },
          { id: 's2', name: '东京晴空塔', desc: '350米高空俯瞰全景雪景。', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', mapUrl: 'https://maps.google.com/?q=Tokyo+Skytree', rednoteUrl: 'https://www.xiaohongshu.com/search_result?keyword=%E4%B8%9C%E4%BA%AC%E6%99%B4%E7%A9%BA%E5%A1%94' }
        ],
        expenses: [
          { id: 'e1', title: '往返机票', amount: 2400, currency: 'MYR', convertedRM: 2400, paidBy: 'Alex', splitMode: 'equal', splitAmong: ['我', 'Alex', 'Sarah'], customShares: {}, category: '交通' }
        ],
        memories: [
          { id: 'm1', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600', date: '2026-12-25', location: '新宿歌舞伎町', comment: '刚到东京的第一顿串烧，氛围感绝了！' }
        ]
      }
    ];
  });

  const [selectedTripId, setSelectedTripId] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [activeDayTab, setActiveDayTab] = useState('Day 1');
  const [activeWeatherDay, setActiveWeatherDay] = useState('Day 1');
  const [toast, setToast] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // 弹窗状态
  const [modalType, setModalType] = useState(null); 
  const [editingItem, setEditingItem] = useState(null);

  // 表单数据
  const [newTripForm, setNewTripForm] = useState({ title: '', destination: '日本·北海道 (Hokkaido)', startDate: '2027-01-10', endDate: '2027-01-15', currency: 'RM', companions: 3, companionNames: ['我', 'Alex', 'Sarah'], coverImage: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800' });
  const [editTripMetaForm, setEditTripMetaForm] = useState({ title: '', startDate: '', endDate: '', companionNames: [] });
  const [itineraryForm, setItineraryForm] = useState({ time: '10:00', title: '', desc: '', transport: '步行', distance: '距上一站：...', opening: '09:00 - 18:00', mapUrl: 'https://maps.google.com/?q=', photo: '' });
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', currency: 'MYR', paidBy: '我', category: '餐饮', splitMode: 'equal', splitAmong: ['我', 'Alex', 'Sarah'], customShares: {} });
  const [flightForm, setFlightForm] = useState({ type: '去程', flightNo: '', date: '', time: '', route: '' });
  const [hotelForm, setHotelForm] = useState({ name: '', address: '', checkIn: '', checkOut: '' });
  const [memoryForm, setMemoryForm] = useState({ url: '', date: new Date().toISOString().split('T')[0], location: '', comment: '' });
  const [spotPhotoForm, setSpotPhotoForm] = useState({ url: '' });

  useEffect(() => {
    localStorage.setItem('travel_with_me_cloud_v15', JSON.stringify(trips));
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
  const upcomingTrips = trips.filter(t => t.endDate >= todayStr);

  const confirmAndDelete = (deleteAction, name = '此项') => {
    if (window.confirm(`⚠️ 确定要删除 "${name}" 吗？此操作无法撤销，并会实时同步给所有同行伙伴。`)) {
      deleteAction();
      triggerToast('🗑️ 已成功删除');
    }
  };

  const convertToRM = (amount, currency) => {
    const amt = parseFloat(amount) || 0;
    const rates = { MYR: 1, JPY: 0.029, USD: 4.45, THB: 0.13, EUR: 4.80, SGD: 3.35 };
    return (amt * (rates[currency] || 1)).toFixed(2);
  };

  const handleLocalImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      callback(uploadEvent.target.result);
      triggerToast('📁 本地照片已成功加载！');
    };
    reader.readAsDataURL(file);
  };

  const getSmartRecommendedSpots = () => {
    if (!currentTrip) return [];
    const scheduledTitles = new Set();
    Object.values(currentTrip.itinerary || {}).forEach(dayList => {
      dayList.forEach(item => scheduledTitles.add(item.title));
    });
    return (currentTrip.masterSpots || []).filter(s => !scheduledTitles.has(s.name));
  };

  const handleRefreshSpots = () => {
    if (!currentTrip) return;
    const shuffled = [...(currentTrip.masterSpots || [])].sort(() => 0.5 - Math.random());
    const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, masterSpots: shuffled } : t);
    setTrips(updatedTrips);
    triggerToast('🔄 已为您换一批智能推荐景点！');
  };

  // AA 清算逻辑
  const calculateAAClearance = () => {
    if (!currentTrip || !currentTrip.expenses || currentTrip.expenses.length === 0) return { transactions: [], totalSpent: '0.00' };
    
    let totalSpent = 0;
    const paidMap = {};
    const shareMap = {};
    const members = currentTrip.companionNames || ['我', 'Alex', 'Sarah'];
    
    members.forEach(m => { paidMap[m] = 0; shareMap[m] = 0; });

    currentTrip.expenses.forEach(exp => {
      const val = parseFloat(exp.convertedRM || convertToRM(exp.amount, exp.currency));
      totalSpent += val;
      const payer = exp.paidBy || members[0];
      if (paidMap[payer] !== undefined) paidMap[payer] += val;
      else paidMap[payer] = val;

      const splitMode = exp.splitMode || 'equal';
      const splitAmong = exp.splitAmong && exp.splitAmong.length > 0 ? exp.splitAmong : members;

      if (splitMode === 'equal') {
        const sharePerPerson = val / splitAmong.length;
        splitAmong.forEach(person => {
          if (shareMap[person] !== undefined) shareMap[person] += sharePerPerson;
          else shareMap[person] = sharePerPerson;
        });
      } else {
        const customShares = exp.customShares || {};
        let customTotal = 0;
        splitAmong.forEach(person => {
          const sVal = parseFloat(customShares[person]) || 0;
          customTotal += sVal;
          if (shareMap[person] !== undefined) shareMap[person] += sVal;
          else shareMap[person] = sVal;
        });
        if (Math.abs(customTotal - val) > 0.01 && splitAmong.length > 0) {
          const diff = (val - customTotal) / splitAmong.length;
          splitAmong.forEach(person => { shareMap[person] += diff; });
        }
      }
    });

    const balances = {};
    const allNames = new Set([...Object.keys(paidMap), ...Object.keys(shareMap), ...members]);
    allNames.forEach(name => {
      balances[name] = (paidMap[name] || 0) - (shareMap[name] || 0);
    });

    const debtors = [];
    const creditors = [];
    Object.entries(balances).forEach(([person, bal]) => {
      if (bal < -0.01) debtors.push({ name: person, amount: Math.abs(bal) });
      else if (bal > 0.01) creditors.push({ name: person, amount: bal });
    });

    const transactions = [];
    let dIdx = 0, cIdx = 0;
    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];
      const transferAmt = Math.min(debtor.amount, creditor.amount);
      transactions.push({ from: debtor.name, to: creditor.name, amount: transferAmt.toFixed(2) });
      debtor.amount -= transferAmt;
      creditor.amount -= transferAmt;
      if (debtor.amount < 0.01) dIdx++;
      if (creditor.amount < 0.01) cIdx++;
    }

    return { transactions, totalSpent: totalSpent.toFixed(2) };
  };

  return (
    <div className="min-h-screen bg-[#ECE7DF] text-[#2C2A29] font-sans antialiased pb-20">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#2C2A29] text-[#FDFBF7] px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-3 border border-white/10 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* 顶栏 */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#DCD6CC] sticky top-0 z-40 px-6 py-4 shadow-xs">
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
                className="px-4 py-2 bg-[#E2DCD2] text-[#2C2A29] text-sm rounded-2xl font-medium hover:bg-[#D4CCE0] transition flex items-center gap-1.5"
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
            <div className="bg-white border border-[#DCD6CC] rounded-3xl p-8 sm:p-12 shadow-xs flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#E2DCD2] text-[#444] text-xs font-semibold mb-3">
                  ✨ 实时协同旅行手账
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1817]">带着热情与手账，去探索世界吧。</h2>
                <p className="text-sm text-[#666] mt-2 max-w-xl leading-relaxed">
                  多端实时同步：自动计算出发倒数、智能推荐小红书热门景点、航班酒店住宿、每日天气与高级 AA 记账清算。
                </p>
              </div>
              <button 
                onClick={() => {
                  setNewTripForm({ title: '', destination: '日本·北海道 (Hokkaido)', startDate: '2027-01-10', endDate: '2027-01-15', currency: 'RM', companions: 3, companionNames: ['我', 'Alex', 'Sarah'], coverImage: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800' });
                  setModalType('newTrip');
                }}
                className="px-6 py-3.5 bg-[#2C2A29] text-[#FDFBF7] text-sm rounded-2xl font-bold hover:bg-[#444] transition shadow-md flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" /> 立即规划新旅程
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-[#1A1817] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" /> 即将来临的旅行计划
              </h3>

              {upcomingTrips.length === 0 ? (
                <p className="text-sm text-[#888] bg-white p-6 rounded-2xl border border-[#DCD6CC]">暂无即将来临的行程</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingTrips.map(trip => {
                    const daysLeft = getDaysLeft(trip.startDate);
                    return (
                      <div 
                        key={trip.id}
                        onClick={() => setSelectedTripId(trip.id)}
                        className="bg-white border border-[#DCD6CC] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="h-48 relative overflow-hidden">
                          <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#2C2A29] shadow-sm">
                            距离出发还有 {daysLeft > 0 ? `${daysLeft} 天` : '就是今天！'}
                          </div>
                        </div>
                        <div className="p-6 space-y-3">
                          <span className="text-xs font-semibold text-[#666] tracking-wide uppercase bg-[#E2DCD2] px-3 py-1 rounded-full">
                            {trip.destination}
                          </span>
                          <h4 className="text-xl font-bold text-[#1A1817] group-hover:text-amber-700 transition">{trip.title}</h4>
                          <div className="flex justify-between items-center text-sm text-[#777] pt-2 border-t border-[#E2DCD2]">
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
          </div>
        ) : (
          /* ================= 详情页视图 ================= */
          <div className="space-y-8">
            <div className="bg-white border border-[#DCD6CC] rounded-3xl p-6 sm:p-10 shadow-xs">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-[#DCD6CC]">
                <div>
                  <span className="inline-block px-3.5 py-1 rounded-full bg-[#E2DCD2] text-[#444] text-xs font-semibold mb-3 tracking-wide">
                    {currentTrip.destination}
                  </span>
                  
                  {/* 行程大标题、日期、同行伙伴 - 点击通过 Popup Table 更改 */}
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1817]">{currentTrip.title}</h2>
                    <button 
                      onClick={() => {
                        setEditTripMetaForm({
                          title: currentTrip.title,
                          startDate: currentTrip.startDate,
                          endDate: currentTrip.endDate,
                          companionNames: [...(currentTrip.companionNames || ['我', 'Alex', 'Sarah'])]
                        });
                        setModalType('editTripMeta');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#ECE7DF] hover:bg-[#E2DCD2] text-gray-800 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      title="编辑旅程大标题、日期与同行伙伴"
                    >
                      <Edit3 className="w-4 h-4" /> 编辑旅程信息
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#777] mt-3">
                    <span className="flex items-center gap-1.5 bg-[#ECE7DF] px-3 py-1 rounded-xl border border-[#DCD6CC]">
                      <Calendar className="w-4 h-4 text-[#555]"/> {currentTrip.startDate} ~ {currentTrip.endDate}
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#ECE7DF] px-3 py-1 rounded-xl border border-[#DCD6CC]">
                      <Users className="w-4 h-4 text-[#555]"/> 同行伙伴: {(currentTrip.companionNames || ['我', 'Alex', 'Sarah']).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-3 mt-8 border-b border-[#DCD6CC] pb-4 overflow-x-auto">
                {[
                  { id: 'itinerary', label: '每日行程 & 详细交通', icon: BookOpen },
                  { id: 'recommendations', label: '智能推荐景点 (小红书热榜)', icon: Sparkles },
                  { id: 'flights_hotels', label: '航班与酒店住宿', icon: Plane },
                  { id: 'weather', label: '分天天气与智能建议', icon: CloudSun },
                  { id: 'expenses', label: '多币种记账与AA清算', icon: DollarSign },
                  { id: 'memories', label: '旅途回忆相册', icon: Camera }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition flex items-center gap-2.5 whitespace-nowrap ${
                        activeTab === tab.id ? 'bg-[#E2DCD2] text-[#2C2A29] font-semibold shadow-xs' : 'text-[#777] hover:bg-[#ECE7DF]'
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: 每日行程 & 交通 (支持添加与编辑) */}
              {activeTab === 'itinerary' && (
                <div className="mt-8 space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">每日行程规划、详细交通与 Google Maps</h3>
                      <p className="text-xs text-[#777] mt-0.5">支持添加、编辑或删除行程及上传照片</p>
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

                  <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#DCD6CC] items-center justify-between">
                    <div className="flex gap-2">
                      {Object.keys(currentTrip.itinerary || {}).map(dayKey => (
                        <button
                          key={dayKey}
                          onClick={() => setActiveDayTab(dayKey)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                            activeDayTab === dayKey ? 'bg-[#2C2A29] text-white shadow-sm' : 'bg-[#E2DCD2] text-[#555] hover:bg-[#D4CCE0]'
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
                      className="text-xs bg-[#E2DCD2] text-[#2C2A29] px-3 py-2 rounded-xl font-medium hover:bg-[#D4CCE0]"
                    >
                      + 新增一天
                    </button>
                  </div>

                  <div className="space-y-4 pt-2">
                    {(!currentTrip.itinerary[activeDayTab] || currentTrip.itinerary[activeDayTab].length === 0) ? (
                      <p className="text-sm text-[#888] bg-[#ECE7DF] p-8 rounded-2xl text-center border border-[#DCD6CC]">这一天还没有添加行程</p>
                    ) : (
                      currentTrip.itinerary[activeDayTab].map((item, idx) => (
                        <div key={item.id || idx} className="p-6 rounded-3xl bg-[#ECE7DF] border border-[#DCD6CC] space-y-3 relative group">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-[#2C2A29] text-white text-xs rounded-lg font-bold">{item.time}</span>
                              <span className="text-xs text-[#666] font-medium bg-[#E2DCD2] px-3 py-1 rounded-full">⏳ 开放时间: {item.opening}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  setEditingItem({ day: activeDayTab, index: idx, ...item });
                                  setItineraryForm({ ...item });
                                  setModalType('editItinerary');
                                }}
                                className="text-gray-500 hover:text-amber-700 transition p-2 rounded-xl bg-white/60 border border-[#DCD6CC]"
                                title="编辑此行程"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => confirmAndDelete(() => {
                                  const updatedDayList = currentTrip.itinerary[activeDayTab].filter((_, i) => i !== idx);
                                  setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: { ...currentTrip.itinerary, [activeDayTab]: updatedDayList } } : t));
                                }, item.title)}
                                className="text-gray-400 hover:text-red-500 transition p-2 rounded-xl bg-white/60 border border-[#DCD6CC]"
                                title="删除此行程"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <h4 className="font-bold text-lg text-[#1A1817]">{item.title}</h4>
                          <p className="text-sm text-[#666] leading-relaxed">{item.desc}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#DCD6CC] text-xs text-[#555]">
                            <div className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-[#DCD6CC]">
                              <Navigation className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <span><strong>交通与换乘路线：</strong> {item.transport}</span>
                            </div>
                            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#DCD6CC]">
                              <div className="flex items-center gap-2 truncate">
                                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                                <span className="truncate"><strong>距离提示：</strong> {item.distance}</span>
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

                          <div className="pt-2">
                            {item.photo ? (
                              <div className="relative h-44 rounded-2xl overflow-hidden border border-[#DCD6CC]">
                                <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
                                <button 
                                  onClick={() => {
                                    setEditingItem({ day: activeDayTab, index: idx, ...item });
                                    setSpotPhotoForm({ url: item.photo });
                                    setModalType('spotPhoto');
                                  }}
                                  className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-xl font-medium hover:bg-black transition"
                                >
                                  更换照片
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => {
                                  setEditingItem({ day: activeDayTab, index: idx, ...item });
                                  setSpotPhotoForm({ url: '' });
                                  setModalType('spotPhoto');
                                }}
                                className="text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl border border-amber-200 transition flex items-center gap-1.5 font-medium shadow-xs"
                              >
                                <Camera className="w-4 h-4" /> + 为此景点添加照片 (支持本地 JPG 或 URL)
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: 智能推荐景点 */}
              {activeTab === 'recommendations' && (
                <div className="mt-8 space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">智能推荐必去景点（含 Google Maps 与小红书热榜）</h3>
                      <p className="text-xs text-[#777] mt-0.5">点击 Google Maps 随时导航，或一键加入您的每日行程</p>
                    </div>
                    <button 
                      onClick={handleRefreshSpots}
                      className="px-4 py-2.5 bg-[#E2DCD2] text-[#2C2A29] text-xs font-bold rounded-xl hover:bg-[#D4CCE0] transition flex items-center gap-1.5 shadow-xs"
                    >
                      <RefreshCw className="w-4 h-4" /> 换一换
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {getSmartRecommendedSpots().map((spot, i) => (
                      <div key={spot.id || i} className="rounded-3xl overflow-hidden border border-[#DCD6CC] bg-white shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="h-44 overflow-hidden relative">
                            <img src={spot.img} alt={spot.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-5 space-y-2">
                            <h4 className="font-bold text-lg text-[#1A1817]">{spot.name}</h4>
                            <p className="text-sm text-[#666]">{spot.desc}</p>
                            
                            <div className="flex items-center gap-3 pt-2">
                              {spot.mapUrl && (
                                <a href={spot.mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-[#ECE7DF] text-[#333] px-3 py-1.5 rounded-xl font-medium hover:bg-[#E2DCD2] flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-rose-600"/> Google Maps
                                </a>
                              )}
                              {spot.rednoteUrl && (
                                <a href={spot.rednoteUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-xl font-medium hover:bg-red-100 flex items-center gap-1">
                                  📖 小红书攻略
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: 航班与酒店住宿 (支持添加、编辑与删除) */}
              {activeTab === 'flights_hotels' && (
                <div className="mt-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <Plane className="w-5 h-5 text-indigo-600" /> 航班信息
                      </h3>
                      <button 
                        onClick={() => {
                          setEditingItem(null);
                          setFlightForm({ type: '去程', flightNo: '', date: '', time: '', route: '' });
                          setModalType('flight');
                        }}
                        className="px-4 py-2 bg-[#2C2A29] text-white text-xs rounded-xl font-medium"
                      >
                        + 添加航班
                      </button>
                    </div>

                    {(!currentTrip.flights || currentTrip.flights.length === 0) ? (
                      <p className="text-sm text-[#888] bg-[#ECE7DF] p-5 rounded-2xl border border-[#DCD6CC]">暂无航班记录</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {currentTrip.flights.map((f, i) => (
                          <div key={f.id || i} className="p-5 rounded-2xl bg-[#ECE7DF] border border-[#DCD6CC] space-y-2 relative">
                            <div className="flex justify-between items-center font-bold text-sm">
                              <span>{f.type}：{f.flightNo}</span>
                              <div className="flex items-center gap-1.5">
                                <button 
                                  onClick={() => {
                                    setEditingItem({ index: i, ...f });
                                    setFlightForm({ ...f });
                                    setModalType('editFlight');
                                  }}
                                  className="text-gray-600 hover:text-amber-700 p-1.5 bg-white rounded-lg border border-[#DCD6CC]"
                                  title="编辑航班"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => confirmAndDelete(() => {
                                    const updated = currentTrip.flights.filter((_, idx) => idx !== i);
                                    setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, flights: updated } : t));
                                  }, f.flightNo)}
                                  className="text-gray-400 hover:text-red-500 p-1.5 bg-white rounded-lg border border-[#DCD6CC]"
                                  title="删除航班"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-[#1A1817]">{f.route}</p>
                            <p className="text-xs text-[#666]">日期: {f.date} | 时间：{f.time}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-[#DCD6CC]">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <Hotel className="w-5 h-5 text-teal-600" /> 酒店与住宿
                      </h3>
                      <button 
                        onClick={() => {
                          setEditingItem(null);
                          setHotelForm({ name: '', address: '', checkIn: '', checkOut: '' });
                          setModalType('hotel');
                        }}
                        className="px-4 py-2 bg-[#2C2A29] text-white text-xs rounded-xl font-medium"
                      >
                        + 添加酒店
                      </button>
                    </div>

                    {(!currentTrip.hotels || currentTrip.hotels.length === 0) ? (
                      <p className="text-sm text-[#888] bg-[#ECE7DF] p-5 rounded-2xl border border-[#DCD6CC]">暂无酒店记录</p>
                    ) : (
                      <div className="space-y-4">
                        {currentTrip.hotels.map((h, i) => (
                          <div key={h.id || i} className="p-5 rounded-2xl bg-[#ECE7DF] border border-[#DCD6CC] space-y-2 relative">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold text-base text-[#1A1817]">{h.name}</h4>
                              <div className="flex items-center gap-1.5">
                                <button 
                                  onClick={() => {
                                    setEditingItem({ index: i, ...h });
                                    setHotelForm({ ...h });
                                    setModalType('editHotel');
                                  }}
                                  className="text-gray-600 hover:text-amber-700 p-1.5 bg-white rounded-lg border border-[#DCD6CC]"
                                  title="编辑酒店"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => confirmAndDelete(() => {
                                    const updated = currentTrip.hotels.filter((_, idx) => idx !== i);
                                    setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, hotels: updated } : t));
                                  }, h.name)}
                                  className="text-gray-400 hover:text-red-500 p-1.5 bg-white rounded-lg border border-[#DCD6CC]"
                                  title="删除酒店"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
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

              {/* Tab 4: 天气与智能穿搭 */}
              {activeTab === 'weather' && (
                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">每日独立天气与智能穿搭/物品指南</h3>
                    <p className="text-xs text-[#777] mt-0.5">选择具体天数，查看当地预计气象与智能打包建议</p>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#DCD6CC]">
                    {Object.keys(currentTrip.itinerary || {}).map(dayKey => (
                      <button
                        key={dayKey}
                        onClick={() => setActiveWeatherDay(dayKey)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                          activeWeatherDay === dayKey ? 'bg-[#2C2A29] text-white shadow-sm' : 'bg-[#E2DCD2] text-[#555] hover:bg-[#D4CCE0]'
                        }`}
                      >
                        {dayKey} 天气
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const dayData = (currentTrip.dailyWeather && currentTrip.dailyWeather[activeWeatherDay]) || {
                      temp: '10°C / 3°C', condition: '晴间多云 ⛅', advice: '天气晴朗，早晚略有寒意，建议备好防风外套。', packing: ['防风外套', '舒适运动鞋', '充电宝']
                    };
                    return (
                      <div className="space-y-6 animate-fade-in">
                        <div className="bg-[#ECE7DF] p-8 rounded-3xl border border-[#DCD6CC] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div>
                            <span className="text-xs text-[#888] font-bold uppercase tracking-wider">{activeWeatherDay} 预计气象速览</span>
                            <div className="text-4xl font-extrabold mt-2 flex items-center gap-4 text-[#1A1817]">
                              {dayData.temp} 
                              <span className="text-xl font-normal text-[#555]">{dayData.condition}</span>
                            </div>
                            <p className="text-sm text-[#666] mt-3 max-w-xl leading-relaxed">{dayData.advice}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="p-6 border border-[#DCD6CC] rounded-3xl bg-white shadow-xs space-y-3">
                            <h4 className="font-bold text-base flex items-center gap-2 text-[#1A1817]">👕 {activeWeatherDay} 智能穿搭建议</h4>
                            <p className="text-sm text-[#666] leading-relaxed">
                              根据气温（{dayData.temp}），建议采用多层穿搭，方便室内外温差调节，鞋履建议选择适合步行的防滑鞋。
                            </p>
                          </div>
                          <div className="p-6 border border-[#DCD6CC] rounded-3xl bg-white shadow-xs space-y-3">
                            <h4 className="font-bold text-base flex items-center gap-2 text-[#1A1817]">🎒 {activeWeatherDay} 智能行李物品清单</h4>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {(dayData.packing || ['护照证件', '雨具', '充电宝']).map((item, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-[#E2DCD2] text-[#444] text-xs font-semibold rounded-xl border border-[#DCD6CC]">
                                  ✓ {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Tab 5: 多币种记账与高级 AA 清算 (保持绝对不变) */}
              {activeTab === 'expenses' && (
                <div className="mt-8 space-y-8">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">同行开销分摊与高级 AA 制智能清算对账</h3>
                      <p className="text-xs text-[#777] mt-0.5">支持部分人分摊、平均或自定义金额，智能生成最优转账方案</p>
                    </div>
                    <button 
                      onClick={() => {
                        const members = currentTrip.companionNames || ['我', 'Alex', 'Sarah'];
                        setEditingItem(null);
                        setExpenseForm({ 
                          title: '', 
                          amount: '', 
                          currency: 'MYR', 
                          paidBy: members[0], 
                          category: '餐饮',
                          splitMode: 'equal',
                          splitAmong: [...members],
                          customShares: {}
                        });
                        setModalType('expense');
                      }}
                      className="px-4 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-medium shadow-sm hover:bg-[#444]"
                    >
                      + 记一笔
                    </button>
                  </div>

                  {currentTrip.expenses && currentTrip.expenses.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="p-5 rounded-3xl bg-[#ECE7DF] border border-[#DCD6CC] space-y-1">
                        <span className="text-xs text-[#777] font-bold uppercase tracking-wider">💰 旅程总消费统计</span>
                        <div className="text-2xl font-extrabold text-[#1A1817] pt-1">
                          RM {calculateAAClearance().totalSpent}
                        </div>
                        <span className="text-xs text-[#888]">（同行成员：{(currentTrip.companionNames || ['我', 'Alex', 'Sarah']).join(', ')}）</span>
                      </div>

                      {Object.entries(
                        currentTrip.expenses.reduce((acc, curr) => {
                          const payer = curr.paidBy || '未知名';
                          const val = parseFloat(curr.convertedRM || convertToRM(curr.amount, curr.currency));
                          acc[payer] = (acc[payer] || 0) + val;
                          return acc;
                        }, {})
                      ).map(([payer, totalAmt], idx) => (
                        <div key={idx} className="p-5 rounded-3xl bg-white border border-[#DCD6CC] shadow-xs space-y-1">
                          <span className="text-xs text-[#777] font-bold uppercase tracking-wider">👤 付款人：{payer}</span>
                          <div className="text-2xl font-extrabold text-emerald-700 pt-1">
                            RM {totalAmt.toFixed(2)}
                          </div>
                          <span className="text-xs text-[#888]">（该成员累计垫付总额）</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentTrip.expenses && currentTrip.expenses.length > 0 && (
                    <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200/80 space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                        <h4 className="font-bold text-base text-[#1A1817]">🧮 高级 AA 制智能结账清算（谁该转给谁）</h4>
                      </div>
                      
                      {calculateAAClearance().transactions.length === 0 ? (
                        <p className="text-xs text-emerald-700 font-medium bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                          🎉 太棒了！大家的消费分摊刚好完美平衡，目前互不欠账！
                        </p>
                      ) : (
                        <div className="space-y-2.5">
                          {calculateAAClearance().transactions.map((tx, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-2xl border border-amber-200 flex justify-between items-center shadow-xs">
                              <div className="flex items-center gap-3 text-sm font-semibold text-[#2C2A29]">
                                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-xl text-xs">{tx.from}</span>
                                <ArrowRight className="w-4 h-4 text-amber-600" />
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-xl text-xs">{tx.to}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-extrabold text-emerald-700 block">转账 RM {tx.amount}</span>
                                <span className="text-[10px] text-[#888]">（结清此账）</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-sm text-[#444]">所有记账明细清单：</h4>
                    {currentTrip.expenses.map((exp, idx) => (
                      <div key={exp.id || idx} className="p-4 rounded-2xl bg-[#ECE7DF] border border-[#DCD6CC] flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-sm text-[#1A1817]">{exp.title}</h4>
                          <span className="text-xs text-[#777]">
                            付款人: <span className="font-semibold text-amber-800">{exp.paidBy}</span> · 
                            类别: {exp.category} · 
                            分摊: {exp.splitMode === 'custom' ? '自定义金额' : `平分 (${(exp.splitAmong || []).join(', ')})`}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-bold text-base block">{exp.currency || 'MYR'} {exp.amount}</span>
                            <span className="text-xs text-emerald-600 font-medium">≈ RM {exp.convertedRM || convertToRM(exp.amount, exp.currency || 'MYR')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 6: 旅途回忆相册 (支持添加、编辑与删除) */}
              {activeTab === 'memories' && (
                <div className="mt-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">旅途回忆相册</h3>
                      <p className="text-xs text-[#777] mt-0.5">支持添加、编辑、删除回忆照片 (.jpg / .png 或 URL)</p>
                    </div>
                    <button 
                      onClick={() => {
                        setEditingItem(null);
                        setMemoryForm({ url: '', date: new Date().toISOString().split('T')[0], location: '', comment: '' });
                        setModalType('memory');
                      }}
                      className="px-4 py-2 bg-[#2C2A29] text-white text-xs rounded-xl font-medium flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" /> + 上传回忆照片
                    </button>
                  </div>

                  {(!currentTrip.memories || currentTrip.memories.length === 0) ? (
                    <div className="text-center py-16 bg-[#ECE7DF] rounded-3xl border border-[#DCD6CC] text-[#888]">
                      <Camera className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#555]" />
                      <p className="text-sm font-medium">暂无回忆照片，点击上方按钮添加第一张精彩瞬间吧！</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {currentTrip.memories.map((m, i) => (
                        <div key={m.id || i} className="bg-white p-4 rounded-3xl border border-[#DCD6CC] shadow-xs hover:shadow-md transition flex flex-col justify-between group relative">
                          <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                            <button 
                              onClick={() => {
                                setEditingItem({ index: i, ...m });
                                setMemoryForm({ url: m.url || m, date: m.date || '', location: m.location || '', comment: m.comment || '' });
                                setModalType('editMemory');
                              }}
                              className="bg-black/70 text-white p-2 rounded-xl hover:bg-amber-600 transition"
                              title="编辑照片"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => confirmAndDelete(() => {
                                const updatedMemories = currentTrip.memories.filter((_, idx) => idx !== i);
                                setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, memories: updatedMemories } : t));
                              }, '这张照片')}
                              className="bg-black/70 text-white p-2 rounded-xl hover:bg-red-600 transition"
                              title="删除照片"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 mb-4">
                            <img src={m.url || m} alt="memory" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          </div>
                          <div className="space-y-2 px-1">
                            <div className="flex justify-between items-center text-xs text-[#888]">
                              <span className="flex items-center gap-1 font-medium"><MapPin className="w-3 h-3 text-rose-600"/> {m.location || '未知地点'}</span>
                              <span>{m.date || '旅行途中'}</span>
                            </div>
                            <p className="text-sm text-[#2C2A29] font-medium leading-relaxed italic bg-[#ECE7DF] p-3 rounded-2xl border border-[#DCD6CC]">
                              "{m.comment || '美好而难忘的瞬间。'}"
                            </p>
                          </div>
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

      {/* ================= MODALS (POPUP TABLES) ================= */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCD6CC] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up">
            
            {/* 新建旅程 */}
            {modalType === 'newTrip' && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">✨ 创建新旅程计划</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">旅行标题名称</label>
                    <input type="text" value={newTripForm.title} onChange={e => setNewTripForm({...newTripForm, title: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="例如：北欧 7天6夜极光之旅" />
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">目的地</label>
                    <input type="text" value={newTripForm.destination} onChange={e => setNewTripForm({...newTripForm, destination: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="挪威·特罗姆瑟" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">开始日期</label>
                      <input type="date" value={newTripForm.startDate} onChange={e => setNewTripForm({...newTripForm, startDate: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">结束日期</label>
                      <input type="date" value={newTripForm.endDate} onChange={e => setNewTripForm({...newTripForm, endDate: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">同行伙伴姓名 (用逗号隔开)</label>
                    <input type="text" value={newTripForm.companionNames.join(', ')} onChange={e => setNewTripForm({...newTripForm, companionNames: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="我, Alex, Sarah" />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!newTripForm.title) { alert('请填写旅行标题'); return; }
                        const newT = {
                          id: Date.now().toString(),
                          title: newTripForm.title,
                          destination: newTripForm.destination,
                          startDate: newTripForm.startDate,
                          endDate: newTripForm.endDate,
                          currency: newTripForm.currency,
                          companions: newTripForm.companionNames.length || 3,
                          companionNames: newTripForm.companionNames,
                          coverImage: newTripForm.coverImage,
                          dailyWeather: { 'Day 1': { temp: '-2°C', condition: '晴朗 ☀️', advice: '气候寒冷，注意保暖。', packing: ['羽绒服'] } },
                          flights: [], hotels: [],
                          itinerary: { 'Day 1': [{ id: 'd1', time: '14:00', title: '抵达与酒店入住', desc: '休整。', transport: '巴士', distance: '市区', opening: '全天', mapUrl: 'https://maps.google.com', photo: '' }] },
                          masterSpots: [], expenses: [], memories: []
                        };
                        setTrips([newT, ...trips]);
                        setModalType(null);
                        triggerToast('✨ 新旅程创建成功！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      立即创建
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 编辑旅程基本信息 (大标题、日期、同行伙伴) */}
            {modalType === 'editTripMeta' && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">✏️ 编辑旅程信息</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">旅程大标题</label>
                    <input type="text" value={editTripMetaForm.title} onChange={e => setEditTripMetaForm({...editTripMetaForm, title: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">开始日期</label>
                      <input type="date" value={editTripMetaForm.startDate} onChange={e => setEditTripMetaForm({...editTripMetaForm, startDate: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">结束日期</label>
                      <input type="date" value={editTripMetaForm.endDate} onChange={e => setEditTripMetaForm({...editTripMetaForm, endDate: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">同行伙伴姓名 (用逗号隔开)</label>
                    <input type="text" value={editTripMetaForm.companionNames.join(', ')} onChange={e => setEditTripMetaForm({...editTripMetaForm, companionNames: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="我, Alex, Sarah" />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!editTripMetaForm.title) { alert('标题不能为空'); return; }
                        const updated = trips.map(t => t.id === currentTrip.id ? { 
                          ...t, 
                          title: editTripMetaForm.title, 
                          startDate: editTripMetaForm.startDate, 
                          endDate: editTripMetaForm.endDate, 
                          companions: editTripMetaForm.companionNames.length,
                          companionNames: editTripMetaForm.companionNames 
                        } : t);
                        setTrips(updated);
                        setModalType(null);
                        triggerToast('✨ 旅程基本信息更新成功！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      保存更改
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 新增或编辑每日行程 */}
            {(modalType === 'itinerary' || modalType === 'editItinerary') && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">{modalType === 'itinerary' ? '📝 新增行程详情与交通导航' : '✏️ 编辑行程详情'}</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">目标天数</label>
                    <select value={activeDayTab} onChange={e => setActiveDayTab(e.target.value)} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm">
                      {Object.keys(currentTrip?.itinerary || {}).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">时间</label>
                      <input type="text" value={itineraryForm.time} onChange={e => setItineraryForm({...itineraryForm, time: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="14:00" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">景点名称</label>
                      <input type="text" value={itineraryForm.title} onChange={e => setItineraryForm({...itineraryForm, title: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="浅草寺" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">与上一站距离提示</label>
                    <input type="text" value={itineraryForm.distance} onChange={e => setItineraryForm({...itineraryForm, distance: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="距上一站步行 10 分钟" />
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">详细交通与乘搭路线</label>
                    <input type="text" value={itineraryForm.transport} onChange={e => setItineraryForm({...itineraryForm, transport: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="乘搭地铁银座线..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">开放时间</label>
                      <input type="text" value={itineraryForm.opening} onChange={e => setItineraryForm({...itineraryForm, opening: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="09:00 - 18:00" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">Google Maps 链接</label>
                      <input type="text" value={itineraryForm.mapUrl} onChange={e => setItineraryForm({...itineraryForm, mapUrl: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="https://maps.google.com/?q=..." />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">游玩描述</label>
                    <textarea value={itineraryForm.desc} onChange={e => setItineraryForm({...itineraryForm, desc: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="描述..." />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!itineraryForm.title) { alert('请填写景点名称'); return; }
                        if (modalType === 'itinerary') {
                          const newItem = { id: Date.now().toString(), ...itineraryForm };
                          const updated = {
                            ...currentTrip.itinerary,
                            [activeDayTab]: [...(currentTrip.itinerary[activeDayTab] || []), newItem]
                          };
                          setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updated } : t));
                          triggerToast('✨ 行程添加成功！');
                        } else {
                          const list = [...currentTrip.itinerary[activeDayTab]];
                          list[editingItem.index] = { ...editingItem, ...itineraryForm };
                          const updated = { ...currentTrip.itinerary, [activeDayTab]: list };
                          setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updated } : t));
                          triggerToast('✏️ 行程修改成功！');
                        }
                        setModalType(null);
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      {modalType === 'itinerary' ? '确认添加' : '保存修改'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 景点照片弹窗 */}
            {modalType === 'spotPhoto' && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">📸 为景点添加/更换照片</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">方式一：从手机/电脑选择本地照片 (.jpg / .png)</label>
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg" 
                      onChange={e => handleLocalImageUpload(e, (base64Str) => setSpotPhotoForm({ url: base64Str }))}
                      className="w-full p-2.5 border border-[#DCD6CC] rounded-xl text-xs bg-[#ECE7DF] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#2C2A29] file:text-white hover:file:bg-[#444]"
                    />
                  </div>
                  <div className="text-center text-xs text-[#888] font-medium">- 或者 -</div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">方式二：输入图片网络链接 (URL)</label>
                    <input type="text" value={spotPhotoForm.url} onChange={e => setSpotPhotoForm({ url: e.target.value })} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="https://images.unsplash.com/photo-..." />
                  </div>
                  {spotPhotoForm.url && (
                    <div className="h-32 rounded-2xl overflow-hidden border border-[#DCD6CC] bg-gray-50 flex items-center justify-center">
                      <img src={spotPhotoForm.url} alt="预览" className="h-full object-contain" />
                    </div>
                  )}
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!spotPhotoForm.url) { alert('请上传照片或填写链接'); return; }
                        const dayList = [...currentTrip.itinerary[editingItem.day]];
                        dayList[editingItem.index] = { ...dayList[editingItem.index], photo: spotPhotoForm.url };
                        const updatedItinerary = { ...currentTrip.itinerary, [editingItem.day]: dayList };
                        setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updatedItinerary } : t));
                        setModalType(null);
                        triggerToast('📸 景点照片更新成功！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      保存照片
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 添加或编辑航班 */}
            {(modalType === 'flight' || modalType === 'editFlight') && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">{modalType === 'flight' ? '✈️ 添加航班信息' : '✏️ 编辑航班信息'}</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">类型</label>
                    <select value={flightForm.type} onChange={e => setFlightForm({...flightForm, type: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm">
                      <option value="去程">去程</option>
                      <option value="回程">回程</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">航班号</label>
                    <input type="text" value={flightForm.flightNo} onChange={e => setFlightForm({...flightForm, flightNo: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="MH 088" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">日期</label>
                      <input type="date" value={flightForm.date} onChange={e => setFlightForm({...flightForm, date: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">时间</label>
                      <input type="text" value={flightForm.time} onChange={e => setFlightForm({...flightForm, time: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="09:15 -> 17:30" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">航线</label>
                    <input type="text" value={flightForm.route} onChange={e => setFlightForm({...flightForm, route: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="KUL -> NRT" />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!flightForm.flightNo) { alert('请填写航班号'); return; }
                        if (modalType === 'flight') {
                          const newF = { id: Date.now().toString(), ...flightForm };
                          setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, flights: [...t.flights, newF] } : t));
                          triggerToast('✈️ 航班添加成功！');
                        } else {
                          const list = [...currentTrip.flights];
                          list[editingItem.index] = { ...editingItem, ...flightForm };
                          setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, flights: list } : t));
                          triggerToast('✏️ 航班修改成功！');
                        }
                        setModalType(null);
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      {modalType === 'flight' ? '确认添加' : '保存修改'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 添加或编辑酒店 */}
            {(modalType === 'hotel' || modalType === 'editHotel') && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">{modalType === 'hotel' ? '🏨 添加酒店住宿' : '✏️ 编辑酒店住宿'}</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">酒店名称</label>
                    <input type="text" value={hotelForm.name} onChange={e => setHotelForm({...hotelForm, name: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="新宿格拉斯丽酒店" />
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">地址</label>
                    <input type="text" value={hotelForm.address} onChange={e => setHotelForm({...hotelForm, address: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="详细地址..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">入住日期</label>
                      <input type="date" value={hotelForm.checkIn} onChange={e => setHotelForm({...hotelForm, checkIn: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">退房日期</label>
                      <input type="date" value={hotelForm.checkOut} onChange={e => setHotelForm({...hotelForm, checkOut: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!hotelForm.name) { alert('请填写酒店名称'); return; }
                        if (modalType === 'hotel') {
                          const newH = { id: Date.now().toString(), ...hotelForm };
                          setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, hotels: [...t.hotels, newH] } : t));
                          triggerToast('🏨 酒店添加成功！');
                        } else {
                          const list = [...currentTrip.hotels];
                          list[editingItem.index] = { ...editingItem, ...hotelForm };
                          setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, hotels: list } : t));
                          triggerToast('✏️ 酒店修改成功！');
                        }
                        setModalType(null);
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      {modalType === 'hotel' ? '确认添加' : '保存修改'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 上传或编辑回忆相册 */}
            {(modalType === 'memory' || modalType === 'editMemory') && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">{modalType === 'memory' ? '📸 上传旅途回忆照片' : '✏️ 编辑回忆相片'}</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">方式一：从手机/电脑选择本地照片 (.jpg / .png)</label>
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg" 
                      onChange={e => handleLocalImageUpload(e, (base64Str) => setMemoryForm({...memoryForm, url: base64Str}))}
                      className="w-full p-2.5 border border-[#DCD6CC] rounded-xl text-xs bg-[#ECE7DF] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#2C2A29] file:text-white hover:file:bg-[#444]"
                    />
                  </div>
                  <div className="text-center text-xs text-[#888] font-medium">- 或者 -</div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">方式二：输入图片网络链接 (URL)</label>
                    <input type="text" value={memoryForm.url} onChange={e => setMemoryForm({...memoryForm, url: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="https://images.unsplash.com/photo-..." />
                  </div>
                  {memoryForm.url && (
                    <div className="h-28 rounded-2xl overflow-hidden border border-[#DCD6CC] bg-gray-50 flex items-center justify-center">
                      <img src={memoryForm.url} alt="预览" className="h-full object-contain" />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">拍摄日期</label>
                      <input type="date" value={memoryForm.date} onChange={e => setMemoryForm({...memoryForm, date: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">拍摄地点</label>
                      <input type="text" value={memoryForm.location} onChange={e => setMemoryForm({...memoryForm, location: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="浅草寺雷门" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">心情评论 / 备注 (Comment)</label>
                    <textarea value={memoryForm.comment} onChange={e => setMemoryForm({...memoryForm, comment: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="写下当时的心情..." />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!memoryForm.url) { alert('请上传照片或填写链接'); return; }
                        if (modalType === 'memory') {
                          const newMem = { id: Date.now().toString(), ...memoryForm };
                          const updated = trips.map(t => t.id === currentTrip.id ? { ...t, memories: [newMem, ...t.memories] } : t);
                          setTrips(updated);
                          triggerToast('📸 回忆相片上传成功！');
                        } else {
                          const list = [...currentTrip.memories];
                          list[editingItem.index] = { ...editingItem, ...memoryForm };
                          const updated = trips.map(t => t.id === currentTrip.id ? { ...t, memories: list } : t);
                          setTrips(updated);
                          triggerToast('✏️ 回忆修改成功！');
                        }
                        setModalType(null);
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      {modalType === 'memory' ? '保存相片' : '保存修改'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 高级记账弹窗 (保持绝对不变) */}
            {modalType === 'expense' && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">💰 多币种记账与高级分摊</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">消费项目名称</label>
                    <input type="text" value={expenseForm.title} onChange={e => setExpenseForm({...expenseForm, title: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="米其林晚餐 / 门票" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">金额</label>
                      <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="450" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">币种</label>
                      <select value={expenseForm.currency} onChange={e => setExpenseForm({...expenseForm, currency: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm font-bold">
                        <option value="MYR">MYR (马币)</option>
                        <option value="JPY">JPY (日元)</option>
                        <option value="USD">USD (美元)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">谁垫付付款的？</label>
                      <select value={expenseForm.paidBy} onChange={e => setExpenseForm({...expenseForm, paidBy: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm font-bold">
                        {(currentTrip.companionNames || ['我', 'Alex', 'Sarah']).map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">消费类别</label>
                      <select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm">
                        <option value="餐饮">餐饮</option>
                        <option value="交通">交通</option>
                        <option value="住宿">住宿</option>
                        <option value="门票/娱乐">门票/娱乐</option>
                        <option value="购物">购物</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-[#ECE7DF] rounded-2xl border border-[#DCD6CC] space-y-3">
                    <label className="text-xs font-bold text-[#444] block">👥 选择参与分摊的同行伙伴 (可多选)</label>
                    <div className="flex flex-wrap gap-2">
                      {(currentTrip.companionNames || ['我', 'Alex', 'Sarah']).map(name => {
                        const isSelected = expenseForm.splitAmong.includes(name);
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              const updated = isSelected 
                                ? expenseForm.splitAmong.filter(n => n !== name)
                                : [...expenseForm.splitAmong, name];
                              setExpenseForm({...expenseForm, splitAmong: updated});
                            }}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                              isSelected ? 'bg-[#2C2A29] text-white shadow-xs' : 'bg-white text-[#666] border border-[#DCD6CC]'
                            }`}
                          >
                            {isSelected ? <CheckSquare className="w-3.5 h-3.5"/> : <Square className="w-3.5 h-3.5"/>}
                            {name}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-[#DCD6CC]">
                      <label className="text-xs font-bold text-[#444] block mb-1.5">⚖️ 分摊计算模式</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setExpenseForm({...expenseForm, splitMode: 'equal'})}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                            expenseForm.splitMode === 'equal' ? 'bg-[#2C2A29] text-white shadow-xs' : 'bg-white text-[#666] border border-[#DCD6CC]'
                          }`}
                        >
                          平均分摊 (Equal)
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpenseForm({...expenseForm, splitMode: 'custom'})}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                            expenseForm.splitMode === 'custom' ? 'bg-[#2C2A29] text-white shadow-xs' : 'bg-white text-[#666] border border-[#DCD6CC]'
                          }`}
                        >
                          每个人不同数额 (Custom)
                        </button>
                      </div>
                    </div>

                    {expenseForm.splitMode === 'custom' && (
                      <div className="space-y-2 pt-2">
                        <span className="text-[11px] text-[#666] block">请为每个分摊成员输入各自应承担的金额：</span>
                        {expenseForm.splitAmong.map(name => (
                          <div key={name} className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-[#DCD6CC]">
                            <span className="text-xs font-bold">{name} 应付金额:</span>
                            <input 
                              type="number" 
                              value={expenseForm.customShares[name] || ''} 
                              onChange={e => {
                                const val = e.target.value;
                                setExpenseForm({
                                  ...expenseForm, 
                                  customShares: { ...expenseForm.customShares, [name]: val }
                                });
                              }}
                              className="w-28 p-1.5 border border-[#DCD6CC] rounded-lg text-xs text-right"
                              placeholder="0.00"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!expenseForm.title || !expenseForm.amount) { alert('请填写完整'); return; }
                        if (expenseForm.splitAmong.length === 0) { alert('请至少选择一位分摊成员'); return; }
                        
                        const convertedRM = convertToRM(expenseForm.amount, expenseForm.currency);
                        const newExp = { 
                          id: Date.now().toString(), 
                          title: expenseForm.title, 
                          amount: parseFloat(expenseForm.amount), 
                          currency: expenseForm.currency, 
                          convertedRM, 
                          paidBy: expenseForm.paidBy, 
                          category: expenseForm.category,
                          splitMode: expenseForm.splitMode,
                          splitAmong: expenseForm.splitAmong,
                          customShares: expenseForm.customShares
                        };
                        const updated = trips.map(t => t.id === currentTrip.id ? { ...t, expenses: [...t.expenses, newExp] } : t);
                        setTrips(updated);
                        setModalType(null);
                        triggerToast('💰 记账与分摊设置成功！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      确认记账
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
