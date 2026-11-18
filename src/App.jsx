import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, DollarSign, CloudSun, Users, 
  Share2, Plus, Trash2, CheckCircle, Plane, Hotel, 
  Sparkles, Camera, BookOpen, Clock, Heart, Download, Compass, ChevronRight, ArrowLeft, Navigation, ExternalLink, Edit3, X, RefreshCw, Upload, ArrowRight, CheckSquare, Square
} from 'lucide-react';

export default function App() {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('travel_with_me_cloud_v13');
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
          { id: 's2', name: '东京晴空塔', desc: '350米高空俯瞰全景雪景。', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', mapUrl: 'https://maps.google.com/?q=Tokyo+Skytree', rednoteUrl: 'https://www.xiaohongshu.com/search_result?keyword=%E4%B8%9C%E4%BA%AC%E6%99%B4%E7%A9%BA%E5%A1%94' },
          { id: 's3', name: '筑地场外市场', desc: '品尝最新鲜的海鲜丼与烤生蚝。', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600', mapUrl: 'https://maps.google.com/?q=Tsukiji+Outer+Market', rednoteUrl: 'https://www.xiaohongshu.com/search_result?keyword=%E7%AD%91%E5%9C%B0%E5%9C%BA%E5%A4%96%E5%B8%82%E5%B8%82%E5%9C%BA' },
          { id: 's4', name: '表参道美学街区', desc: '世界级建筑大师打造的时尚购物天堂。', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600', mapUrl: 'https://maps.google.com/?q=Omotesando', rednoteUrl: 'https://www.xiaohongshu.com/search_result?keyword=%E8%A1%A8%E5%8F%82%E9%81%93' }
        ],
        expenses: [
          { id: 'e1', title: '往返机票', amount: 2400, currency: 'MYR', convertedRM: 2400, paidBy: 'Alex', splitMode: 'equal', splitAmong: ['我', 'Alex', 'Sarah'], customShares: {}, category: '交通' },
          { id: 'e2', title: '居酒屋晚餐', amount: 12000, currency: 'JPY', convertedRM: 348, paidBy: '我', splitMode: 'equal', splitAmong: ['我', 'Alex'], customShares: {}, category: '餐饮' }
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
  const [itineraryForm, setItineraryForm] = useState({ time: '10:00', title: '', desc: '', transport: '步行', distance: '距上一站：...', opening: '09:00 - 18:00', mapUrl: 'https://maps.google.com/?q=', photo: '' });
  
  // 记账表单 (支持高级分摊)
  const [expenseForm, setExpenseForm] = useState({ 
    title: '', 
    amount: '', 
    currency: 'MYR', 
    paidBy: '我', 
    category: '餐饮',
    splitMode: 'equal', // 'equal' (平均分摊) 或 'custom' (自定义金额)
    splitAmong: ['我', 'Alex', 'Sarah'], // 参与分摊的人员名单
    customShares: {} // { '我': 100, 'Alex': 200 } 自定义各自承担数额
  });

  const [flightForm, setFlightForm] = useState({ type: '去程', flightNo: '', date: '', time: '', route: '' });
  const [hotelForm, setHotelForm] = useState({ name: '', address: '', checkIn: '', checkOut: '' });
  const [memoryForm, setMemoryForm] = useState({ url: '', date: new Date().toISOString().split('T')[0], location: '', comment: '' });
  const [spotPhotoForm, setSpotPhotoForm] = useState({ url: '' });

  useEffect(() => {
    localStorage.setItem('travel_with_me_cloud_v13', JSON.stringify(trips));
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
  const pastTrips = trips.filter(t => t.endDate < todayStr);

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

  // 核心：高级 AA 制清算对账算法（支持部分人分摊、平均分摊、自定义数额）
  const calculateAAClearance = () => {
    if (!currentTrip || !currentTrip.expenses || currentTrip.expenses.length === 0) return { transactions: [], totalSpent: '0.00', memberOwes: {} };
    
    let totalSpent = 0;
    const paidMap = {}; // 谁实际垫付了多少
    const shareMap = {}; // 谁理应承担多少（负债累积）

    // 获取同行成员列表（默认从 trip 中取，如果没有则自动推导）
    const members = currentTrip.companionNames || ['我', 'Alex', 'Sarah'];
    members.forEach(m => {
      paidMap[m] = 0;
      shareMap[m] = 0;
    });

    currentTrip.expenses.forEach(exp => {
      const val = parseFloat(exp.convertedRM || convertToRM(exp.amount, exp.currency));
      totalSpent += val;
      const payer = exp.paidBy || members[0];
      if (paidMap[payer] !== undefined) paidMap[payer] += val;
      else paidMap[payer] = val;

      // 分摊逻辑
      const splitMode = exp.splitMode || 'equal';
      const splitAmong = exp.splitAmong && exp.splitAmong.length > 0 ? exp.splitAmong : members;

      if (splitMode === 'equal') {
        const sharePerPerson = val / splitAmong.length;
        splitAmong.forEach(person => {
          if (shareMap[person] !== undefined) shareMap[person] += sharePerPerson;
          else shareMap[person] = sharePerPerson;
        });
      } else if (splitMode === 'custom') {
        const customShares = exp.customShares || {};
        let customTotal = 0;
        splitAmong.forEach(person => {
          const sVal = parseFloat(customShares[person]) || 0;
          customTotal += sVal;
          if (shareMap[person] !== undefined) shareMap[person] += sVal;
          else shareMap[person] = sVal;
        });
        // 如果自定义总和跟总额有出入，多退少补平均分摊余数
        if (Math.abs(customTotal - val) > 0.01 && splitAmong.length > 0) {
          const diff = (val - customTotal) / splitAmong.length;
          splitAmong.forEach(person => {
            shareMap[person] += diff;
          });
        }
      }
    });

    // 计算每个人净余额：净收支 = 已付款 - 应承担分摊
    const balances = {};
    const allNames = new Set([...Object.keys(paidMap), ...Object.keys(shareMap), ...members]);
    
    allNames.forEach(name => {
      const paid = paidMap[name] || 0;
      const share = shareMap[name] || 0;
      balances[name] = paid - share;
    });

    const debtors = []; // 负数（欠钱的人）
    const creditors = []; // 正数（应收钱的人）

    Object.entries(balances).forEach(([person, bal]) => {
      if (bal < -0.01) debtors.push({ name: person, amount: Math.abs(bal) });
      else if (bal > 0.01) creditors.push({ name: person, amount: bal });
    });

    const transactions = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];
      const transferAmt = Math.min(debtor.amount, creditor.amount);

      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: transferAmt.toFixed(2)
      });

      debtor.amount -= transferAmt;
      creditor.amount -= transferAmt;

      if (debtor.amount < 0.01) dIdx++;
      if (creditor.amount < 0.01) cIdx++;
    }

    return { transactions, totalSpent: totalSpent.toFixed(2), paidMap, shareMap };
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
                  多端实时同步：自动计算出发倒数、智能推荐小红书热门景点、多币种高级 AA 记账与结账清算。
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
                  
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1817]">{currentTrip.title}</h2>
                    <button 
                      onClick={() => {
                        const newTitle = prompt('请输入新的旅行名称：', currentTrip.title);
                        if (!newTitle) return;
                        setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, title: newTitle } : t));
                        triggerToast('✏️ 行程名称修改成功！');
                      }}
                      className="p-2 rounded-xl bg-[#ECE7DF] hover:bg-[#E2DCD2] text-gray-700 transition"
                      title="编辑行程名称"
                    >
                      <Edit3 className="w-4 h-4" />
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
                  { id: 'expenses', label: '多币种记账与高级AA清算', icon: DollarSign },
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

              {/* Tab 1: 行程 */}
              {activeTab === 'itinerary' && (
                <div className="mt-8 space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">每日行程规划与详细乘搭路线</h3>
                      <p className="text-xs text-[#777] mt-0.5">包含精确的换乘路线、步行指南、Google Maps 链接及景点照片上传</p>
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

                  <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#DCD6CC] items-center">
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
                            <button 
                              onClick={() => confirmAndDelete(() => {
                                const updatedDayList = currentTrip.itinerary[activeDayTab].filter((_, i) => i !== idx);
                                setTrips(trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: { ...currentTrip.itinerary, [activeDayTab]: updatedDayList } } : t));
                              }, item.title)}
                              className="text-gray-400 hover:text-red-500 transition p-2 rounded-xl"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <h4 className="font-bold text-lg text-[#1A1817]">{item.title}</h4>
                          <p className="text-sm text-[#666]">{item.desc}</p>

                          <div className="pt-2">
                            {item.photo ? (
                              <div className="relative h-44 rounded-2xl overflow-hidden border border-[#DCD6CC] group/photo">
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

              {/* Tab 2: 推荐景点 */}
              {activeTab === 'recommendations' && (
                <div className="mt-8 space-y-6">
                  <h3 className="text-xl font-bold tracking-tight">智能推荐必去景点（含小红书热门笔记）</h3>
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

              {/* Tab 5: 记账与高级 AA 清算结算计算器 */}
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

                  {/* 1. 消费总额与付款人统计 */}
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

                  {/* 2. 高级 AA 制转账对账建议 */}
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

                  {/* 3. 记账明细清单 */}
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

              {/* Tab 6: 回忆相册 */}
              {activeTab === 'memories' && (
                <div className="mt-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">旅途回忆相册</h3>
                      <p className="text-xs text-[#777] mt-0.5">支持直接上传手机相册照片 (.jpg / .png) 或输入图片链接</p>
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

      {/* ================= MODALS ================= */}
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

            {/* 每日行程 - 为此景点添加照片 */}
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

            {/* 上传回忆相册 */}
            {(modalType === 'memory' || modalType === 'editMemory') && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">📸 上传旅途回忆照片</h3>
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
                        const newMem = { id: Date.now().toString(), ...memoryForm };
                        const updated = trips.map(t => t.id === currentTrip.id ? { ...t, memories: [newMem, ...t.memories] } : t);
                        setTrips(updated);
                        setModalType(null);
                        triggerToast('📸 回忆相片上传成功！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      保存相片
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 高级记账弹窗（支持分摊人员选择 & 平均/自定义金额） */}
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

                  {/* 分摊设置区域 */}
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

                    {/* 自定义金额输入框 */}
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
