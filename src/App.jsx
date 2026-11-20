import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, DollarSign, CloudSun, Users, 
  Share2, Plus, Trash2, Plane, Hotel, 
  Sparkles, Camera, BookOpen, Download, Compass, ChevronRight, ArrowLeft, Navigation, ExternalLink, Edit3, X, RefreshCw, ArrowRight, CheckSquare, Square, Briefcase, Lock
} from 'lucide-react';

// ==========================================
// 🌐 您的专属 Supabase 云端配置信息 (使用原生 REST API，无需外部 NPM 依赖)
// ==========================================
const SUPABASE_URL = 'https://zrobhkjljnmuutodkgqf.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_Ay1lQkWfcKxNbP7k9Yov1Q_SmZaSPGI';   
const CLOUD_RECORD_ID = 'travel_with_me_global_trip_v18';

// 轻量级 Supabase REST API 封装，避免预览环境缺少 @supabase/supabase-js 依赖报错
const supabaseRest = {
  async fetchTrips() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/trips_data?id=eq.${CLOUD_RECORD_ID}&select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!res.ok) throw new Error('Cloud fetch failed');
    const rows = await res.json();
    return rows && rows.length > 0 ? rows[0].data : null;
  },
  async upsertTrips(newTrips) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/trips_data`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({ id: CLOUD_RECORD_ID, data: newTrips })
    });
    if (!res.ok) throw new Error('Cloud upsert failed');
  }
};

export default function App() {
  // 解析 URL 是否带有单旅程 (?trip=xxx) 或按同行伙伴聚合分享参数 (?partner=xxx)
  const getSharedParamsFromUrl = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      return {
        tripId: params.get('trip') || null,
        partner: params.get('partner') || null
      };
    } catch (e) {
      return { tripId: null, partner: null };
    }
  };

  const initialUrlParams = getSharedParamsFromUrl();
  const [sharedLockTripId, setSharedLockTripId] = useState(initialUrlParams.tripId);
  const [sharedPartnerFilter, setSharedPartnerFilter] = useState(initialUrlParams.partner);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTripId, setSelectedTripId] = useState(initialUrlParams.tripId);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [activeDayTab, setActiveDayTab] = useState('Day 1');
  const [activeWeatherDay, setActiveWeatherDay] = useState('Day 1');
  const [packingFilter, setPackingFilter] = useState('全部');
  const [toast, setToast] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // 弹窗状态与自定义确认框状态（替代原生 alert/confirm）
  const [modalType, setModalType] = useState(null); 
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [newDayModalOpen, setNewDayModalOpen] = useState(false);
  const [newDayInput, setNewDayInput] = useState('');

  // 表单数据
  const [newTripForm, setNewTripForm] = useState({ 
    title: '', 
    destination: '日本·北海道 (Hokkaido)', 
    startDate: '2027-01-10', 
    endDate: '2027-01-15', 
    currency: 'RM', 
    companions: 3, 
    companionNames: ['我', 'Alex', 'Sarah'], 
    coverImage: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800' 
  });
  const [editTripMetaForm, setEditTripMetaForm] = useState({ title: '', startDate: '', endDate: '', companionNames: [] });
  const [itineraryForm, setItineraryForm] = useState({ time: '10:00', title: '', desc: '', transport: '步行', distance: '距上一站：...', opening: '09:00 - 18:00', mapUrl: 'https://maps.google.com/?q=', photo: '', photoRefs: [], shoppingList: [] });
  const [newRefUrlInput, setNewRefUrlInput] = useState('');
  const [newShopItemInput, setNewShopItemInput] = useState('');
  const [expenseForm, setExpenseForm] = useState({ title: '', amount: '', currency: 'MYR', paidBy: '我', category: '餐饮', splitMode: 'equal', splitAmong: ['我', 'Alex', 'Sarah'], customShares: {} });
  const [flightForm, setFlightForm] = useState({ type: '去程', flightNo: '', date: '', time: '', route: '' });
  const [hotelForm, setHotelForm] = useState({ name: '', address: '', checkIn: '', checkOut: '' });
  const [memoryForm, setMemoryForm] = useState({ url: '', date: new Date().toISOString().split('T')[0], location: '', comment: '' });
  const [spotPhotoForm, setSpotPhotoForm] = useState({ url: '' });
  const [packingForm, setPackingForm] = useState({ name: '', category: '证件与钱财', assignee: '全员各自携带', qty: 1 });
  const [newNoticeInput, setNewNoticeInput] = useState('');

  // 默认初始数据（包含东京与成都两个示例旅程，方便测试独立分享）
  const defaultInitialTrips = [
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
        { id: 'f1', type: '去程', flightNo: 'JL 0724', date: '2026-12-25', time: '09:15 -> 17:30', route: '吉隆坡 (KUL) -> 东京成田 (NRT)' },
        { id: 'f2', type: '回程', flightNo: 'JL 0723', date: '2026-12-29', time: '11:20 -> 18:05', route: '东京成田 (NRT) -> 吉隆坡 (KUL)' }
      ],
      hotels: [
        { id: 'h1', name: '新宿格拉斯丽酒店 (Hotel Gracery Shinjuku)', address: '东京都新宿区歌舞伎町 1-19-1', checkIn: '2026-12-25', checkOut: '2026-12-29' }
      ],
      itinerary: {
        'Day 1': [
          { 
            id: 'i1', 
            time: '18:00', 
            title: '抵达东京与新宿入住', 
            desc: '办理酒店入住，在露台与标志性的哥斯拉巨像合影，晚上逛歌舞伎町一番街吃一兰拉面。', 
            transport: '在成田机场B1层搭乘 Narita Express (N’EX) 直达新宿站。', 
            distance: '机场至酒店约 80km (约85分钟)', 
            opening: '全天开放', 
            mapUrl: 'https://maps.google.com/?q=Hotel+Gracery+Shinjuku', 
            photo: '',
            photoRefs: [
              'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400'
            ],
            shoppingList: [
              { id: 'sh1', name: '唐吉诃德限定抹茶零食', bought: false },
              { id: 'sh2', name: '一兰拉面盒装伴手礼', bought: false }
            ]
          }
        ],
        'Day 2': [
          { 
            id: 'i3', 
            time: '09:30', 
            title: '浅草寺雷门 & 仲见世通', 
            desc: '参观东京最古老寺庙，抽御神签，品尝现烤人形烧与抹茶冰淇淋。', 
            transport: '新宿站乘JR中央线至神田站，换乘东京地铁银座线至浅草站。', 
            distance: '距酒店约 11km (约35分钟)', 
            opening: '06:00 - 17:00', 
            mapUrl: 'https://maps.google.com/?q=Senso-ji', 
            photo: '',
            photoRefs: [
              'https://images.unsplash.com/photo-1583084647973-b5263b060d23?w=400'
            ],
            shoppingList: [
              { id: 'sh3', name: '浅草寺开运御守', bought: false },
              { id: 'sh4', name: '舟和芋羊羹', bought: false }
            ]
          }
        ],
        'Day 3': [],
        'Day 4': [],
        'Day 5': []
      },
      masterSpots: [
        { id: 's1', name: '富士山河口湖 · 罗森便利店机位', desc: '小红书爆火打卡点，拍摄富士山同框经典大片。', img: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600', mapUrl: 'https://maps.google.com/?q=Kawaguchiko', rednoteUrl: 'https://www.xiaohongshu.com/search_result?keyword=河口湖富士山' },
        { id: 's2', name: '东京迪士尼海洋 (Tokyo DisneySea)', desc: '全球唯一以海洋为主题的迪士尼乐园，新园区梦幻泉乡必打卡。', img: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=600', mapUrl: 'https://maps.google.com/?q=Tokyo+DisneySea', rednoteUrl: 'https://www.xiaohongshu.com/search_result?keyword=东京迪士尼海洋' }
      ],
      expenses: [
        { id: 'e1', title: '吉隆坡-东京往返机票', amount: 2400, currency: 'MYR', convertedRM: '2400.00', paidBy: 'Alex', splitMode: 'equal', splitAmong: ['我', 'Alex', 'Sarah'], customShares: {}, category: '交通' },
        { id: 'e2', title: '新宿思出横丁串烧晚餐', amount: 12500, currency: 'JPY', convertedRM: '362.50', paidBy: '我', splitMode: 'equal', splitAmong: ['我', 'Alex', 'Sarah'], customShares: {}, category: '餐饮' }
      ],
      memories: [
        { id: 'm1', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600', date: '2026-12-25', location: '新宿歌舞伎町', comment: '第一顿深夜串烧，霓虹灯下的东京氛围感拉满！' }
      ],
      preTripNotices: [
        '提前填写 Visit Japan Web（入境审查与海关申报二维码截图保存）',
        '准备 Suica / ICOCA 交通卡（iPhone 钱包可直接开通或抵达机场办理）',
        '确认护照有效期大于 6 个月，并开通国际漫游或购买日本 eSIM / Wi-Fi'
      ],
      packingList: [
        { id: 'p1', name: '护照 (有效期大于6个月) & Visit Japan Web 二维码', category: '证件与钱财', assignee: '全员各自携带', qty: 1, packed: true },
        { id: 'p2', name: '日元现金 & 国际免手续费信用卡', category: '证件与钱财', assignee: '全员各自携带', qty: 1, packed: false }
      ]
    },
    {
      id: '2',
      title: '中国成都 4天3夜大熊猫与川味火锅之旅',
      destination: '中国·成都 (Chengdu)',
      startDate: '2027-03-12',
      endDate: '2027-03-15',
      currency: 'RM',
      companions: 2,
      companionNames: ['我', 'C'],
      coverImage: 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800',
      dailyWeather: {
        'Day 1': { temp: '16°C / 9°C', condition: '阴天 ☁️', advice: '成都春季微凉，建议穿薄毛衣或卫衣加风衣。', packing: ['风衣外套', '肠胃药'] }
      },
      flights: [],
      hotels: [
        { id: 'h_cd1', name: '成都太古里博舍酒店', address: '成都市锦江区笔帖式街81号', checkIn: '2027-03-12', checkOut: '2027-03-15' }
      ],
      itinerary: {
        'Day 1': [
          {
            id: 'cd_i1',
            time: '14:00',
            title: '春熙路 & 成都太古里打卡',
            desc: '打卡IFS爬墙大熊猫，逛太古里买手店，晚上吃正宗牛油火锅。',
            transport: '地铁2号线/3号线春熙路站直达',
            distance: '距酒店步行 3 分钟',
            opening: '10:00 - 22:00',
            mapUrl: 'https://maps.google.com/?q=Taikoo+Li+Chengdu',
            photo: '',
            photoRefs: [],
            shoppingList: [
              { id: 'cd_s1', name: '熊猫花花周边玩偶', bought: false }
            ]
          }
        ]
      },
      masterSpots: [],
      expenses: [],
      memories: [],
      preTripNotices: [
        '提前下载并注册支付宝 / 微信国际版，绑定常用信用卡并完成实名认证',
        '确认出行证件与酒店入住人姓名一致，提前保存电子行程单'
      ],
      packingList: [
        { id: 'cd_p1', name: '支付宝/微信国际版绑定信用卡', category: '证件与钱财', assignee: '全员各自携带', qty: 1, packed: false }
      ]
    }
  ];

  // 连接 Supabase REST API 并支持优雅降级至 localStorage
  useEffect(() => {
    let isMounted = true;

    async function fetchCloudData() {
      if (!SUPABASE_URL || !SUPABASE_KEY) {
        const saved = localStorage.getItem('travel_with_me_fallback_v18');
        if (isMounted) {
          const loadedTrips = saved ? JSON.parse(saved) : defaultInitialTrips;
          setTrips(loadedTrips);
          initSharedTripFirstDay(loadedTrips);
          setLoading(false);
        }
        return;
      }

      if (isMounted) setIsSyncing(true);
      try {
        const cloudData = await supabaseRest.fetchTrips();
        if (cloudData) {
          if (isMounted) {
            const normalizedCloud = cloudData.map(t => ({
              ...t,
              itinerary: syncItineraryWithDateRange(t.itinerary, t.startDate, t.endDate)
            }));
            setTrips(normalizedCloud);
            initSharedTripFirstDay(normalizedCloud);
          }
          localStorage.setItem('travel_with_me_fallback_v18', JSON.stringify(cloudData));
      } else {
          await supabaseRest.upsertTrips(defaultInitialTrips);
          if (isMounted) {
            setTrips(defaultInitialTrips);
            initSharedTripFirstDay(defaultInitialTrips);
          }
        }
      } catch (err) {
        const saved = localStorage.getItem('travel_with_me_fallback_v18');
        if (isMounted) {
          const loadedTrips = saved ? JSON.parse(saved) : defaultInitialTrips;
          setTrips(loadedTrips);
          initSharedTripFirstDay(loadedTrips);
        }
      } finally {
        if (isMounted) {
          setIsSyncing(false);
          setLoading(false);
        }
      }
    }

    function initSharedTripFirstDay(allTrips) {
      const { tripId } = getSharedParamsFromUrl();
      if (tripId) {
        const target = allTrips.find(t => t.id === tripId);
        if (target) {
          const firstDay = Object.keys(target.itinerary || {})[0] || 'Day 1';
          setActiveDayTab(firstDay);
          setActiveWeatherDay(firstDay);
        }
      }
    }

    fetchCloudData();

    // 定时轻量轮询实现多端同步（每 15 秒检查一次云端更新）
    const pollInterval = setInterval(async () => {
      if (!SUPABASE_URL || !SUPABASE_KEY) return;
      try {
        const cloudData = await supabaseRest.fetchTrips();
        if (cloudData && isMounted) {
          const currentLocal = localStorage.getItem('travel_with_me_fallback_v18');
          const cloudStr = JSON.stringify(cloudData);
          if (currentLocal !== cloudStr) {
            setTrips(cloudData);
            localStorage.setItem('travel_with_me_fallback_v18', cloudStr);
          }
        }
      } catch (e) {
        // 忽略后台轮询网络波动
      }
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const saveTripsToCloud = async (newTrips) => {
    setTrips(newTrips);
    setIsSyncing(true);
    localStorage.setItem('travel_with_me_fallback_v18', JSON.stringify(newTrips));

    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        await supabaseRest.upsertTrips(newTrips);
      } catch (err) {
        triggerToast('⚠️ 云端同步失败，已保存至本地');
      } finally {
        setTimeout(() => setIsSyncing(false), 400);
      }
    } else {
      setTimeout(() => setIsSyncing(false), 300);
    }
  };

  const currentTrip = trips.find(t => t.id === selectedTripId);

  // 智能生成分享链接：如果在某个具体旅程内部，生成单旅程链接；如果在伙伴专属模式下，复制该伙伴专属链接
  const handleShareLink = () => {
    const urlObj = new URL(window.location.href);
    if (sharedPartnerFilter) {
      urlObj.searchParams.delete('trip');
      urlObj.searchParams.set('partner', sharedPartnerFilter);
      const shareUrl = urlObj.toString();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).catch(() => {});
      }
      triggerToast(`🔒 已复制「${sharedPartnerFilter}」的专属多旅程聚合链接！`);
    } else if (selectedTripId && currentTrip) {
      urlObj.searchParams.delete('partner');
      urlObj.searchParams.set('trip', selectedTripId);
      const shareUrl = urlObj.toString();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).catch(() => {});
      }
      const partners = (currentTrip.companionNames || []).filter(n => n !== '我').join(' & ') || '同行伙伴';
      triggerToast(`🔒 已复制「${currentTrip.title}」单旅程专属链接！发给 ${partners} 后仅可见此行程。`);
    } else {
      urlObj.searchParams.delete('trip');
      urlObj.searchParams.delete('partner');
      const shareUrl = urlObj.toString();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).catch(() => {});
      }
      triggerToast('🔗 主手账完整链接已复制！如需按伙伴隔离分享，请点击主页“按同行伙伴专属分享”。');
    }
  };

  // 生成指定同行伙伴的专属多旅程聚合链接
  const handleShareByPartner = (partnerName) => {
    const urlObj = new URL(window.location.href);
    urlObj.searchParams.delete('trip');
    urlObj.searchParams.set('partner', partnerName);
    const shareUrl = urlObj.toString();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    const matchedCount = trips.filter(t => (t.companionNames || []).includes(partnerName)).length;
    setModalType(null);
    triggerToast(`🔒 已复制「${partnerName}」的专属分享链接！对方打开后将看到与 TA 相关的全部 ${matchedCount} 个旅程，看不到其他私人行程。`);
  };

  const getDaysLeft = (startDateStr) => {
    const today = new Date();
    const start = new Date(startDateStr);
    return Math.ceil((start - today) / (1000 * 60 * 60 * 24));
  };

  const todayStr = new Date().toISOString().split('T')[0];
  // 如果是按同行伙伴过滤模式 (?partner=xxx)，只展示包含该伙伴的旅程；否则展示全部
  const visibleTrips = sharedPartnerFilter
    ? trips.filter(t => (t.companionNames || []).includes(sharedPartnerFilter))
    : trips;
  const upcomingTrips = visibleTrips.filter(t => t.endDate >= todayStr);

  // 提取所有同行伙伴名单（排除“我”）用于快捷选择分享
  const allCompanionPartners = Array.from(
    new Set(trips.flatMap(t => t.companionNames || []).filter(name => name && name !== '我'))
  );

  // 自定义二次确认删除对话框
  const requestDelete = (deleteAction, name = '此项') => {
    setConfirmDialog({
      title: '确认删除操作',
      message: `确定要删除 "${name}" 吗？删除后数据将同步更新且无法恢复。`,
      onConfirm: () => {
        deleteAction();
        setConfirmDialog(null);
        triggerToast('🗑️ 已成功删除');
      }
    });
  };

  // 实时汇率换算至 MYR (RM)
  const convertToRM = (amount, currency) => {
    const amt = parseFloat(amount) || 0;
    const rates = { MYR: 1, JPY: 0.029, USD: 4.45, THB: 0.13, EUR: 4.80, SGD: 3.35, CNY: 0.62, KRW: 0.0032 };
    return (amt * (rates[currency] || 1)).toFixed(2);
  };

  // 本地图片上传转为 Base64
  const handleLocalImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      callback(uploadEvent.target.result);
      triggerToast('📁 本地照片已加载，将自动存入手账！');
    };
    reader.readAsDataURL(file);
  };

  // 获取尚未加入行程的智能推荐景点
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
    saveTripsToCloud(updatedTrips);
    triggerToast('🔄 已为您换一批智能推荐景点！');
  };

  // 根据开始与结束日期计算总天数（至少 1 天，最多 60 天防误操作）
  const calculateTripDayCount = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return 1;
    const start = new Date(`${startDateStr}T00:00:00`);
    const end = new Date(`${endDateStr}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
    const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(diffDays, 1), 60);
  };

  // 根据开始日期与第几个 Day（从 1 开始）推算对应的月-日字符串（例如 03-12）
  const getDayDateLabel = (startDateStr, dayNumber) => {
    if (!startDateStr || !dayNumber || dayNumber < 1) return '';
    const base = new Date(`${startDateStr}T00:00:00`);
    if (Number.isNaN(base.getTime())) return '';
    base.setDate(base.getDate() + (dayNumber - 1));
    const mm = String(base.getMonth() + 1).padStart(2, '0');
    const dd = String(base.getDate()).padStart(2, '0');
    return `${mm}-${dd}`;
  };

  // 根据日期范围同步更新 itinerary 对象中的 Day 1 ~ Day N（保留已有行程与额外自定义天数）
  const syncItineraryWithDateRange = (existingItinerary, startDateStr, endDateStr) => {
    const dayCount = calculateTripDayCount(startDateStr, endDateStr);
    const nextItinerary = {};
    const standardDayKeys = new Set();

    for (let i = 1; i <= dayCount; i++) {
      const dayKey = `Day ${i}`;
      standardDayKeys.add(dayKey);
      nextItinerary[dayKey] = Array.isArray(existingItinerary?.[dayKey])
        ? [...existingItinerary[dayKey]]
        : [];
    }

    // 保留超出默认 Day 1..N 的额外自定义天数（如用户手动新增的 Day 6 等）
    Object.entries(existingItinerary || {}).forEach(([key, items]) => {
      if (!standardDayKeys.has(key) && Array.isArray(items) && items.length > 0) {
        nextItinerary[key] = [...items];
      }
    });

    return nextItinerary;
  };

  // 自动将指定旅程的 itinerary 按起止日期同步更新，并自动校验当前选中的 Day 标签
  const autoApplyDateRangeToTrip = (tripId, nextStartDate, nextEndDate) => {
    const dayCount = calculateTripDayCount(nextStartDate, nextEndDate);
    setTrips(prevTrips => {
      const updatedTrips = prevTrips.map(t => {
        if (t.id !== tripId) return t;
        const syncedItinerary = syncItineraryWithDateRange(t.itinerary, nextStartDate, nextEndDate);
        if (t.id === selectedTripId && !syncedItinerary[activeDayTab]) {
          setActiveDayTab('Day 1');
          setActiveWeatherDay('Day 1');
        }
        return {
          ...t,
          startDate: nextStartDate,
          endDate: nextEndDate,
          itinerary: syncedItinerary
        };
      });
      localStorage.setItem('travel_with_me_fallback_v18', JSON.stringify(updatedTrips));
      if (SUPABASE_URL && SUPABASE_KEY) {
        supabaseRest.upsertTrips(updatedTrips).catch(() => {});
      }
      return updatedTrips;
    });
    return dayCount;
  };

  // 导出精美 PDF 手账报告
  const handleExportPDF = () => {
    if (!currentTrip) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      triggerToast('⚠️ 浏览器拦截了弹窗，请允许弹窗后重试导出 PDF');
      return;
    }

    let htmlContent = `
      <html>
        <head>
          <title>${currentTrip.title} - 旅行手账报告</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #2C2A29; padding: 40px; background: #fff; line-height: 1.6; }
            h1 { font-size: 26px; border-bottom: 2px solid #2C2A29; padding-bottom: 10px; margin-bottom: 6px; }
            .meta { font-size: 14px; color: #666; margin-bottom: 28px; }
            h2 { font-size: 18px; border-bottom: 1px solid #DCD6CC; padding-bottom: 6px; margin-top: 28px; color: #1A1817; }
            .card { background: #F9F8F6; border: 1px solid #E5E0D8; border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
            .time { font-weight: bold; color: #b45309; margin-right: 8px; }
          </style>
        </head>
        <body>
          <h1>✈️ ${currentTrip.title}</h1>
          <div class="meta">目的地：${currentTrip.destination} | 日期：${currentTrip.startDate} ~ ${currentTrip.endDate} | 同行伙伴：${(currentTrip.companionNames || []).join(', ')}</div>

          <h2>📅 每日行程规划与交通</h2>
    `;

    Object.entries(currentTrip.itinerary || {}).forEach(([day, items]) => {
      htmlContent += `<h3>${day} ${items.length === 0 ? '(暂无行程)' : ''}</h3>`;
      if (items.length === 0) {
        htmlContent += `<p style="color:#888; font-size:13px;">当天暂无行程安排。</p>`;
      } else {
        items.forEach(item => {
          const shopHtml = (item.shoppingList && item.shoppingList.length > 0)
            ? `<div style="font-size:12px; color:#444; margin-top:6px;">🛍️ 打算买的东西：${item.shoppingList.map(s => `${s.bought ? '☑️' : '⬜'} ${s.name}`).join('、')}</div>`
            : '';
          const refCountHtml = (item.photoRefs && item.photoRefs.length > 0)
            ? `<div style="font-size:12px; color:#666; margin-top:4px;">📷 已附 ${item.photoRefs.length} 张拍照参考图</div>`
            : '';
          htmlContent += `
            <div class="card">
              <div><span class="time">${item.time}</span> <strong>${item.title}</strong> <span style="font-size:12px; color:#666;">(${item.opening})</span></div>
              <p style="margin: 6px 0; font-size:14px;">${item.desc}</p>
              <div style="font-size:12px; color:#555;">交通路线：${item.transport} | 距离：${item.distance}</div>
              ${shopHtml}
              ${refCountHtml}
            </div>
          `;
        });
      }
    });

    htmlContent += `<h2>✈️ 航班与酒店住宿</h2>`;
    (currentTrip.flights || []).forEach(f => {
      htmlContent += `<div class="card"><strong>[航班 ${f.type}] ${f.flightNo}</strong><br/>航线：${f.route} (${f.date} ${f.time})</div>`;
    });
    (currentTrip.hotels || []).forEach(h => {
      htmlContent += `<div class="card"><strong>[酒店] ${h.name}</strong><br/>地址：${h.address}<br/>入住：${h.checkIn} ~ 退房：${h.checkOut}</div>`;
    });

    htmlContent += `<h2>🎒 行李清单核对表</h2><div class="card">`;
    (currentTrip.packingList || []).forEach(p => {
      htmlContent += `<div style="margin-bottom:6px; font-size:14px;">${p.packed ? '☑️' : '⬜'} <strong>${p.name}</strong> (×${p.qty || 1}) — <span style="color:#666; font-size:12px;">[${p.category} | 负责: ${p.assignee}]</span></div>`;
    });
    htmlContent += `</div>`;

    htmlContent += `
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    triggerToast('🖨️ PDF 手账报告已生成，正在唤起打印/导出面板！');
  };

  // AA 制智能清算算法
  const calculateAAClearance = () => {
    if (!currentTrip || !currentTrip.expenses || currentTrip.expenses.length === 0) {
      return { transactions: [], totalSpent: '0.00' };
    }
    let totalSpent = 0;
    const paidMap = {};
    const shareMap = {};
    const members = currentTrip.companionNames || ['我', 'Alex', 'Sarah'];
    members.forEach(m => { paidMap[m] = 0; shareMap[m] = 0; });

    currentTrip.expenses.forEach(exp => {
      const val = parseFloat(exp.convertedRM || convertToRM(exp.amount, exp.currency));
      totalSpent += val;
      const payer = exp.paidBy || members[0];
      paidMap[payer] = (paidMap[payer] || 0) + val;

      const splitMode = exp.splitMode || 'equal';
      const splitAmong = exp.splitAmong && exp.splitAmong.length > 0 ? exp.splitAmong : members;

      if (splitMode === 'equal') {
        const sharePerPerson = val / splitAmong.length;
        splitAmong.forEach(person => {
          shareMap[person] = (shareMap[person] || 0) + sharePerPerson;
        });
      } else {
        const customShares = exp.customShares || {};
        let customTotal = 0;
        splitAmong.forEach(person => {
          const sVal = parseFloat(customShares[person]) || 0;
          customTotal += sVal;
          shareMap[person] = (shareMap[person] || 0) + sVal;
        });
        if (Math.abs(customTotal - val) > 0.01 && splitAmong.length > 0) {
          const diff = (val - customTotal) / splitAmong.length;
          splitAmong.forEach(person => {
            shareMap[person] = (shareMap[person] || 0) + diff;
          });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECE7DF] flex items-center justify-center text-[#2C2A29]">
        <div className="text-center space-y-3">
          <Compass className="w-10 h-10 animate-spin mx-auto text-amber-700" />
          <p className="text-sm font-bold">正在初始化 Travel with Me 云端手账...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECE7DF] text-[#2C2A29] font-sans antialiased pb-20">
      {/* 顶部全局消息提示 */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#2C2A29] text-[#FDFBF7] px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-3 border border-white/10 max-w-md">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* 顶栏导航 */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#DCD6CC] sticky top-0 z-40 px-4 sm:px-6 py-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <div 
            className={`flex items-center gap-3 ${sharedLockTripId ? 'cursor-default' : 'cursor-pointer'}`} 
            onClick={() => {
              if (!sharedLockTripId) setSelectedTripId(null);
            }}
          >
            <div className="w-11 h-11 rounded-2xl bg-[#2C2A29] text-[#FDFBF7] flex items-center justify-center shadow-md shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1A1817]">Travel with Me</h1>
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {sharedLockTripId
                  ? '单旅程专属访客模式 (已隔离其他私人行程)'
                  : sharedPartnerFilter
                  ? `「${sharedPartnerFilter}」的专属同行空间 (仅显示与 TA 相关的旅程)`
                  : (isSyncing ? '云端正在同步...' : 'Supabase 云端实时同步已连接')}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {selectedTripId && (
              <>
                <button 
                  onClick={handleExportPDF}
                  className="px-3.5 py-2 bg-[#E2DCD2] text-[#2C2A29] text-xs font-bold rounded-2xl hover:bg-[#D6CEC2] transition flex items-center gap-1.5 shadow-xs"
                  title="导出精美 PDF 手账报告"
                >
                  <Download className="w-4 h-4" /> 导出 PDF
                </button>
                {/* 如果是单旅程锁死模式 (?trip=xxx)，隐藏返回主页；如果是伙伴多旅程聚合模式 (?partner=xxx)，允许返回该伙伴的专属主页切换旅程 */}
                {!sharedLockTripId && (
                  <button 
                    onClick={() => setSelectedTripId(null)}
                    className="px-4 py-2 bg-[#E2DCD2] text-[#2C2A29] text-xs sm:text-sm rounded-2xl font-medium hover:bg-[#D6CEC2] transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> {sharedPartnerFilter ? `返回 ${sharedPartnerFilter} 的专属主页` : '返回主页'}
                  </button>
                )}
              </>
            )}
            <button 
              onClick={handleShareLink}
              className="px-4 py-2.5 bg-[#2C2A29] text-[#FDFBF7] text-xs sm:text-sm rounded-2xl font-medium hover:bg-[#44403D] transition flex items-center gap-2 shadow-sm"
            >
              <Share2 className="w-4 h-4" /> 
              {sharedPartnerFilter
                ? `复制 ${sharedPartnerFilter} 专属链接`
                : selectedTripId
                ? '分享此行程给同行伙伴'
                : '分享主手账链接'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        {!selectedTripId ? (
          /* ================= 主页视图 ================= */
          <div className="space-y-10">
            <div className="bg-white border border-[#DCD6CC] rounded-3xl p-8 sm:p-12 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#E2DCD2] text-[#444] text-xs font-semibold mb-3">
                  {sharedPartnerFilter
                    ? `🔒 专属同行主页 · 仅展示「${sharedPartnerFilter}」参与的旅行计划`
                    : '✨ Supabase 实时协同旅行手账 · 支持按同行人或单旅程隔离分享'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1817]">
                  {sharedPartnerFilter
                    ? `欢迎，${sharedPartnerFilter}！这是我们的专属旅行手账。`
                    : '带着热情与手账，去探索世界吧。'}
                </h2>
                <p className="text-sm text-[#666] mt-2.5 max-w-xl leading-relaxed">
                  {sharedPartnerFilter
                    ? `当前视图已自动聚合所有与你同行的 ${upcomingTrips.length} 个旅行计划，你可以随时点击进入查看与协同编辑。`
                    : '点击右侧“按同行伙伴专属分享”选择任意伙伴，系统将自动打包与 TA 同行的所有旅程生成专属链接，其他人的私人旅程完全不可见。'}
                </p>
              </div>
              {!sharedPartnerFilter && (
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <button 
                    onClick={() => setModalType('shareByPartner')}
                    className="px-5 py-3.5 bg-[#ECE7DF] text-[#2C2A29] border border-[#DCD6CC] text-sm rounded-2xl font-bold hover:bg-[#E2DCD2] transition shadow-xs flex items-center gap-2 whitespace-nowrap"
                  >
                    <Users className="w-4 h-4 text-amber-800" /> 按同行伙伴专属分享
                  </button>
                  <button 
                    onClick={() => {
                      setNewTripForm({ 
                        title: '', 
                        destination: '日本·北海道 (Hokkaido)', 
                        startDate: '2027-01-10', 
                        endDate: '2027-01-15', 
                        currency: 'RM', 
                        companions: 3, 
                        companionNames: ['我', 'Alex', 'Sarah'], 
                        coverImage: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800' 
                      });
                      setModalType('newTrip');
                    }}
                    className="px-6 py-3.5 bg-[#2C2A29] text-[#FDFBF7] text-sm rounded-2xl font-bold hover:bg-[#444] transition shadow-md flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" /> 立即规划新旅程
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-[#1A1817] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-700" /> 
                {sharedPartnerFilter ? `与「${sharedPartnerFilter}」同行的旅行计划 (${upcomingTrips.length})` : '即将来临的旅行计划'}
              </h3>

              {upcomingTrips.length === 0 ? (
                <div className="text-sm text-[#888] bg-white p-8 rounded-3xl border border-[#DCD6CC] text-center">
                  暂无即将来临的行程，点击上方“立即规划新旅程”开启第一份手账吧！
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingTrips.map(trip => {
                    const daysLeft = getDaysLeft(trip.startDate);
                    return (
                      <div 
                        key={trip.id}
                        onClick={() => {
                          const firstDay = Object.keys(trip.itinerary || {})[0] || 'Day 1';
                          setActiveDayTab(firstDay);
                          setActiveWeatherDay(firstDay);
                          setActiveTab('itinerary');
                          setSelectedTripId(trip.id);
                        }}
                        className="bg-white border border-[#DCD6CC] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="h-52 relative overflow-hidden">
                          <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#2C2A29] shadow-sm">
                            距离出发还有 {daysLeft > 0 ? `${daysLeft} 天` : '就是今天！'}
                          </div>
                          <div className="absolute bottom-3 left-4 bg-black/70 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-amber-300" />
                            同行：{(trip.companionNames || []).join(' · ')}
                          </div>
                        </div>
                        <div className="p-6 space-y-3">
                          <div className="flex justify-between items-center gap-2">
                            <span className="inline-block text-xs font-semibold text-[#555] tracking-wide uppercase bg-[#E2DCD2] px-3 py-1 rounded-full">
                              {trip.destination}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const urlObj = new URL(window.location.href);
                                urlObj.searchParams.set('trip', trip.id);
                                if (navigator.clipboard && navigator.clipboard.writeText) {
                                  navigator.clipboard.writeText(urlObj.toString()).catch(() => {});
                                }
                                const partners = (trip.companionNames || []).filter(n => n !== '我').join(' & ') || '同行伙伴';
                                triggerToast(`🔒 已复制「${trip.title}」专属分享链接！发给 ${partners} 仅可见此行程。`);
                              }}
                              className="text-xs bg-[#ECE7DF] hover:bg-[#2C2A29] hover:text-white text-[#2C2A29] px-3 py-1 rounded-full font-semibold transition flex items-center gap-1 border border-[#DCD6CC]"
                              title="复制仅限此旅程的专属分享链接"
                            >
                              <Share2 className="w-3 h-3" /> 单独分享此行程
                            </button>
                          </div>
                          <h4 className="text-xl font-bold text-[#1A1817] group-hover:text-amber-700 transition">{trip.title}</h4>
                          <div className="flex justify-between items-center text-sm text-[#777] pt-3 border-t border-[#ECE7DF]">
                            <span>{trip.startDate} ~ {trip.endDate}</span>
                            <span className="font-semibold text-[#2C2A29] flex items-center gap-1">
                              进入手账 <ChevronRight className="w-4 h-4"/>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : !currentTrip ? (
          /* 专属分享链接无效或行程已删除的提示 */
          <div className="bg-white border border-[#DCD6CC] rounded-3xl p-12 text-center space-y-4">
            <Lock className="w-12 h-12 text-amber-700 mx-auto" />
            <h3 className="text-xl font-bold text-[#1A1817]">未找到该专属分享旅程</h3>
            <p className="text-sm text-[#666]">该分享链接对应的行程可能已被删除或链接不完整。</p>
            <button
              onClick={() => {
                const urlObj = new URL(window.location.href);
                urlObj.searchParams.delete('trip');
                window.history.replaceState({}, '', urlObj.toString());
                setSharedLockTripId(null);
                setSelectedTripId(null);
              }}
              className="px-5 py-2.5 bg-[#2C2A29] text-white text-xs font-bold rounded-xl"
            >
              返回主页
            </button>
          </div>
        ) : (
          /* ================= 详情页视图 ================= */
          <div className="space-y-8">
            <div className="bg-white border border-[#DCD6CC] rounded-3xl p-6 sm:p-10 shadow-xs">
              {/* 顶部旅程概览 */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-[#DCD6CC]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-[#E2DCD2] text-[#444] text-xs font-semibold tracking-wide">
                      {currentTrip.destination}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                      <Lock className="w-3 h-3" /> 独立权限隔离：仅限本行程同行伙伴可见
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1A1817]">{currentTrip.title}</h2>
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
                      className="px-3.5 py-2 rounded-xl bg-[#ECE7DF] hover:bg-[#E2DCD2] text-[#2C2A29] text-xs font-bold transition flex items-center gap-1.5 border border-[#DCD6CC]"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> 编辑旅程信息
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#555] mt-4">
                    <span className="flex items-center gap-1.5 bg-[#ECE7DF] px-3.5 py-1.5 rounded-xl border border-[#DCD6CC]">
                      <Calendar className="w-4 h-4 text-[#444]"/> {currentTrip.startDate} ~ {currentTrip.endDate}
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#ECE7DF] px-3.5 py-1.5 rounded-xl border border-[#DCD6CC]">
                      <Users className="w-4 h-4 text-[#444]"/> 同行伙伴: {(currentTrip.companionNames || ['我', 'Alex', 'Sarah']).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 7 个功能模块选项卡 */}
              <div className="flex gap-2.5 mt-8 border-b border-[#DCD6CC] pb-4 overflow-x-auto">
                {[
                  { id: 'itinerary', label: '每日行程 & 详细交通', icon: BookOpen },
                  { id: 'packing', label: '行李清单与打勾勾选', icon: Briefcase },
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
                      className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition flex items-center gap-2 whitespace-nowrap ${
                        activeTab === tab.id ? 'bg-[#E2DCD2] text-[#2C2A29] font-bold shadow-xs' : 'text-[#666] hover:bg-[#ECE7DF]'
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: 每日行程 & 详细交通 */}
              {activeTab === 'itinerary' && (
                <div className="mt-8 space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">每日行程规划与详细交通</h3>
                      <p className="text-xs text-[#777] mt-0.5">只有当某一天添加了行程地点后，天气预报才会自动激活生效</p>
                    </div>
                    <button 
                      onClick={() => {
                        setEditingItem(null);
                        setItineraryForm({ time: '10:00', title: '', desc: '', transport: '步行', distance: '距上一站：...', opening: '09:00 - 18:00', mapUrl: 'https://maps.google.com/?q=', photo: '', photoRefs: [], shoppingList: [] });
                        setNewRefUrlInput('');
                        setNewShopItemInput('');
                        setModalType('itinerary');
                      }}
                      className="px-4 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-medium flex items-center gap-1.5 shadow-sm hover:bg-[#444]"
                    >
                      <Plus className="w-4 h-4" /> 添加新行程
                    </button>
                  </div>

                  {/* 天数切换与新增一天 */}
                  <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#DCD6CC] items-center justify-between">
                    <div className="flex gap-2">
                      {Object.keys(currentTrip.itinerary || {}).map(dayKey => {
                        const hasItems = (currentTrip.itinerary[dayKey] || []).length > 0;
                        const dayNumMatch = /^Day\s+(\d+)$/i.exec(dayKey.trim());
                        const dateLabel = dayNumMatch ? getDayDateLabel(currentTrip.startDate, parseInt(dayNumMatch[1], 10)) : '';
                        return (
                          <button
                            key={dayKey}
                            onClick={() => setActiveDayTab(dayKey)}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
                              activeDayTab === dayKey ? 'bg-[#2C2A29] text-white shadow-sm' : 'bg-[#E2DCD2] text-[#555] hover:bg-[#D6CEC2]'
                            }`}
                          >
                            <span>{dayKey}{dateLabel ? ` (${dateLabel})` : ''}</span>
                            <span className={`w-2 h-2 rounded-full ${hasItems ? 'bg-emerald-400' : 'bg-gray-400'}`} title={hasItems ? '已有行程并激活天气预报' : '行程为空，无天气预报'}></span>
                          </button>
                        );
                      })}
                    </div>
                    <button 
                      onClick={() => {
                        setNewDayInput(`Day ${Object.keys(currentTrip.itinerary || {}).length + 1}`);
                        setNewDayModalOpen(true);
                      }}
                      className="text-xs bg-[#E2DCD2] text-[#2C2A29] px-3.5 py-2 rounded-xl font-bold hover:bg-[#D6CEC2] whitespace-nowrap"
                    >
                      + 新增一天
                    </button>
                  </div>

                  {/* 当天行程列表 */}
                  <div className="space-y-4 pt-2">
                    {(!currentTrip.itinerary[activeDayTab] || currentTrip.itinerary[activeDayTab].length === 0) ? (
                      <div className="p-8 rounded-3xl bg-[#ECE7DF] border border-[#DCD6CC] text-center space-y-2">
                        <p className="text-sm font-medium text-[#666]">这一天还没有添加任何行程和地点。</p>
                        <p className="text-xs text-amber-800">💡 提示：在这一天添加行程后，“分天天气与智能建议”中才会自动出现当天的天气预计哦！</p>
                      </div>
                    ) : (
                      currentTrip.itinerary[activeDayTab].map((item, idx) => (
                        <div key={item.id || idx} className="p-6 rounded-3xl bg-[#ECE7DF] border border-[#DCD6CC] space-y-3 relative">
                          <div className="flex justify-between items-center gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-3 py-1 bg-[#2C2A29] text-white text-xs rounded-lg font-bold">{item.time}</span>
                              <span className="text-xs text-[#555] font-medium bg-[#E2DCD2] px-3 py-1 rounded-full">⏳ 开放时间: {item.opening}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button 
                                onClick={() => {
                                  setEditingItem({ day: activeDayTab, index: idx, ...item });
                                  setItineraryForm({ 
                                    ...item, 
                                    photoRefs: item.photoRefs || [], 
                                    shoppingList: item.shoppingList || [] 
                                  });
                                  setNewRefUrlInput('');
                                  setNewShopItemInput('');
                                  setModalType('editItinerary');
                                }}
                                className="text-gray-600 hover:text-amber-700 transition p-2 rounded-xl bg-white border border-[#DCD6CC]"
                                title="编辑行程"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => requestDelete(() => {
                                  const updatedDayList = currentTrip.itinerary[activeDayTab].filter((_, i) => i !== idx);
                                  const updatedItinerary = { ...currentTrip.itinerary, [activeDayTab]: updatedDayList };
                                  const updated = trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updatedItinerary } : t);
                                  saveTripsToCloud(updated);
                                }, item.title)}
                                className="text-gray-500 hover:text-red-600 transition p-2 rounded-xl bg-white border border-[#DCD6CC]"
                                title="删除行程"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <h4 className="font-bold text-lg text-[#1A1817]">{item.title}</h4>
                          <p className="text-sm text-[#555] leading-relaxed">{item.desc}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#DCD6CC] text-xs text-[#444]">
                            <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#DCD6CC]">
                              <Navigation className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <span><strong>交通：</strong> {item.transport}</span>
                            </div>
                            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#DCD6CC]">
                              <div className="flex items-center gap-2 truncate">
                                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                                <span className="truncate"><strong>距离：</strong> {item.distance}</span>
                              </div>
                              {item.mapUrl && (
                                <a href={item.mapUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 font-bold shrink-0 ml-2">
                                  Maps <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* 打算拍的照片参考 & 打算买的东西清单 */}
                          {((item.photoRefs && item.photoRefs.length > 0) || (item.shoppingList && item.shoppingList.length > 0)) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                              {item.photoRefs && item.photoRefs.length > 0 && (
                                <div className="bg-white p-3.5 rounded-2xl border border-[#DCD6CC] space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-[#1A1817] flex items-center gap-1.5">
                                      📷 打算拍的照片参考 ({item.photoRefs.length})
                                    </span>
                                    <button
                                      onClick={() => {
                                        setEditingItem({ day: activeDayTab, index: idx, ...item });
                                        setItineraryForm({ ...item, photoRefs: item.photoRefs || [], shoppingList: item.shoppingList || [] });
                                        setNewRefUrlInput('');
                                        setNewShopItemInput('');
                                        setModalType('editItinerary');
                                      }}
                                      className="text-[11px] text-amber-800 hover:underline font-medium"
                                    >
                                      编辑参考
                                    </button>
                                  </div>
                                  <div className="flex gap-2 overflow-x-auto pb-1">
                                    {item.photoRefs.map((refUrl, rIdx) => (
                                      <a key={rIdx} href={refUrl} target="_blank" rel="noopener noreferrer" className="w-20 h-20 rounded-xl overflow-hidden border border-[#DCD6CC] shrink-0 block group relative">
                                        <img src={refUrl} alt={`参考${rIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition" />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {item.shoppingList && item.shoppingList.length > 0 && (
                                <div className="bg-white p-3.5 rounded-2xl border border-[#DCD6CC] space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-[#1A1817] flex items-center gap-1.5">
                                      🛍️ 打算买的东西 ({item.shoppingList.filter(s => s.bought).length}/{item.shoppingList.length})
                                    </span>
                                    <button
                                      onClick={() => {
                                        setEditingItem({ day: activeDayTab, index: idx, ...item });
                                        setItineraryForm({ ...item, photoRefs: item.photoRefs || [], shoppingList: item.shoppingList || [] });
                                        setNewRefUrlInput('');
                                        setNewShopItemInput('');
                                        setModalType('editItinerary');
                                      }}
                                      className="text-[11px] text-amber-800 hover:underline font-medium"
                                    >
                                      增删清单
                                    </button>
                                  </div>
                                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                                    {item.shoppingList.map((shopItem, sIdx) => (
                                      <div
                                        key={shopItem.id || sIdx}
                                        onClick={() => {
                                          const updatedShopList = item.shoppingList.map((s, i) => i === sIdx ? { ...s, bought: !s.bought } : s);
                                          const updatedDayList = currentTrip.itinerary[activeDayTab].map((it, i) => i === idx ? { ...it, shoppingList: updatedShopList } : it);
                                          const updatedItinerary = { ...currentTrip.itinerary, [activeDayTab]: updatedDayList };
                                          const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updatedItinerary } : t);
                                          saveTripsToCloud(updatedTrips);
                                        }}
                                        className="flex items-center gap-2 text-xs cursor-pointer hover:bg-[#ECE7DF]/60 p-1 rounded-lg transition select-none"
                                      >
                                        {shopItem.bought ? (
                                          <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        ) : (
                                          <Square className="w-3.5 h-3.5 text-[#777] shrink-0" />
                                        )}
                                        <span className={shopItem.bought ? 'line-through text-[#888]' : 'text-[#2C2A29] font-medium'}>
                                          {shopItem.name}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="pt-2">
                            {item.photo ? (
                              <div className="relative h-48 rounded-2xl overflow-hidden border border-[#DCD6CC]">
                                <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
                                <button 
                                  onClick={() => {
                                    setEditingItem({ day: activeDayTab, index: idx, ...item });
                                    setSpotPhotoForm({ url: item.photo });
                                    setModalType('spotPhoto');
                                  }}
                                  className="absolute bottom-3 right-3 bg-black/75 text-white text-xs px-3 py-1.5 rounded-xl font-medium"
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
                                className="text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl border border-amber-200 transition flex items-center gap-1.5 font-medium"
                              >
                                <Camera className="w-4 h-4" /> + 为此景点添加照片
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: 行李清单与打勾勾选 */}
              {activeTab === 'packing' && (() => {
                const notices = currentTrip.preTripNotices || [];
                const isJapanTrip = (currentTrip.destination || '').includes('日本') || (currentTrip.title || '').includes('日本');
                const list = currentTrip.packingList || [];
                const totalCount = list.length;
                const packedCount = list.filter(item => item.packed).length;
                const progressPct = totalCount === 0 ? 0 : Math.round((packedCount / totalCount) * 100);
                const categories = ['全部', '证件与钱财', '衣物穿搭', '电子数码', '洗漱与护肤', '药品与杂物'];
                const filteredList = packingFilter === '全部' ? list : list.filter(item => item.category === packingFilter);

                return (
                  <div className="mt-8 space-y-8">
                    {/* 旅行前须知 */}
                    <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-4">
                      <div className="flex justify-between items-start flex-wrap gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-[#1A1817] flex items-center gap-2">
                            📌 旅行前须知 (Pre-Trip Checklist)
                          </h3>
                          <p className="text-xs text-[#666] mt-0.5">
                            出发前提前完成的手续与必备事项{isJapanTrip ? '（如日本行程建议确认 Suica、Visit Japan Web）' : ''}
                          </p>
                        </div>
                        {notices.length === 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const presetNotices = isJapanTrip
                                ? [
                                    '提前填写 Visit Japan Web（入境审查与海关申报二维码截图保存）',
                                    '准备 Suica / ICOCA 交通卡（iPhone 钱包可直接开通或抵达机场办理）',
                                    '确认护照有效期大于 6 个月，并开通国际漫游或购买日本 eSIM / Wi-Fi'
                                  ]
                                : [
                                    '确认护照/证件有效期大于 6 个月，提前准备签证与电子行程单',
                                    '开通国际漫游或购买目的地流量卡/eSIM，确认支付方式可用'
                                  ];
                              const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, preTripNotices: presetNotices } : t);
                              saveTripsToCloud(updatedTrips);
                              triggerToast('📌 已一键填入参考旅行前须知！');
                            }}
                            className="px-3.5 py-1.5 bg-white text-[#2C2A29] border border-amber-300 text-xs font-bold rounded-xl hover:bg-amber-100 transition"
                          >
                            + 一键填入参考须知
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newNoticeInput}
                          onChange={e => setNewNoticeInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (!newNoticeInput.trim()) return;
                              const nextNotices = [...notices, newNoticeInput.trim()];
                              const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, preTripNotices: nextNotices } : t);
                              saveTripsToCloud(updatedTrips);
                              setNewNoticeInput('');
                              triggerToast('📌 已添加旅行前须知！');
                            }
                          }}
                          placeholder="输入旅行前须知（例如：提前填好 Visit Japan Web、准备 Suica 卡）..."
                          className="flex-1 p-2.5 bg-white border border-amber-200 rounded-xl text-xs sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newNoticeInput.trim()) return;
                            const nextNotices = [...notices, newNoticeInput.trim()];
                            const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, preTripNotices: nextNotices } : t);
                            saveTripsToCloud(updatedTrips);
                            setNewNoticeInput('');
                            triggerToast('📌 已添加旅行前须知！');
                          }}
                          className="px-4 py-2.5 bg-[#2C2A29] text-white text-xs font-bold rounded-xl hover:bg-[#444] shrink-0"
                        >
                          + 添加须知
                        </button>
                      </div>

                      {notices.length > 0 && (
                        <div className="space-y-2">
                          {notices.map((notice, nIdx) => (
                            <div key={nIdx} className="bg-white/90 px-4 py-3 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
                              <span className="text-xs sm:text-sm text-[#2C2A29] font-medium flex items-start gap-2">
                                <span className="text-amber-700 font-bold">•</span>
                                <span>{notice}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextNotices = notices.filter((_, idx) => idx !== nIdx);
                                  const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, preTripNotices: nextNotices } : t);
                                  saveTripsToCloud(updatedTrips);
                                  triggerToast('🗑️ 已移除该条旅行前须知');
                                }}
                                className="text-gray-400 hover:text-rose-600 p-1 rounded-lg shrink-0"
                                title="删除此须知"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* To Pack List */}
                    <div className="space-y-6 pt-2 border-t border-[#DCD6CC]">
                      <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                          <h3 className="text-xl font-bold tracking-tight">To Pack List（行李清单与打勾勾选）</h3>
                          <p className="text-xs text-[#777] mt-0.5">点击方框即可打勾标记“已打包”，支持分配负责人并实时同步</p>
                        </div>
                        <button 
                          onClick={() => {
                            setEditingItem(null);
                            setPackingForm({ name: '', category: '证件与钱财', assignee: '全员各自携带', qty: 1 });
                            setModalType('packing');
                          }}
                          className="px-4 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-medium flex items-center gap-1.5 shadow-sm hover:bg-[#444]"
                        >
                          <Plus className="w-4 h-4" /> 添加行李物品
                        </button>
                      </div>

                      <div className="p-6 rounded-3xl bg-[#ECE7DF] border border-[#DCD6CC] space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-[#1A1817]">🧳 当前行李打包完成度</span>
                          <span className="text-sm font-extrabold text-emerald-700">
                            {packedCount} / {totalCount} 项已完成 ({progressPct}%)
                          </span>
                        </div>
                        <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-[#DCD6CC]">
                          <div 
                            className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#DCD6CC]">
                        {categories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setPackingFilter(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                              packingFilter === cat ? 'bg-[#2C2A29] text-white shadow-sm' : 'bg-[#E2DCD2] text-[#555] hover:bg-[#D6CEC2]'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {filteredList.length === 0 ? (
                        <div className="p-10 rounded-3xl bg-[#ECE7DF] border border-[#DCD6CC] text-center text-sm text-[#777]">
                          该分类下暂无行李物品，点击右上角“添加行李物品”开始准备吧！
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredList.map(item => (
                            <div 
                              key={item.id} 
                              className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                                item.packed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-[#ECE7DF] border-[#DCD6CC]'
                              }`}
                            >
                              <div 
                                onClick={() => {
                                  const updatedList = list.map(p => p.id === item.id ? { ...p, packed: !p.packed } : p);
                                  const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, packingList: updatedList } : t);
                                  saveTripsToCloud(updatedTrips);
                                }}
                                className="flex items-center gap-3.5 cursor-pointer flex-1 select-none"
                              >
                                {item.packed ? (
                                  <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                                ) : (
                                  <Square className="w-5 h-5 text-[#666] shrink-0" />
                                )}
                                <div className="space-y-1">
                                  <div className={`font-bold text-sm sm:text-base transition ${item.packed ? 'line-through text-[#888]' : 'text-[#1A1817]'}`}>
                                    {item.name} {item.qty > 1 && <span className="text-xs font-semibold text-amber-800 ml-1">× {item.qty}</span>}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#666]">
                                    <span className="px-2.5 py-0.5 rounded-lg bg-white border border-[#DCD6CC] font-medium">{item.category}</span>
                                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-100/80 text-amber-900 font-medium">👤 负责：{item.assignee}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button 
                                  onClick={() => {
                                    setEditingItem(item);
                                    setPackingForm({ name: item.name, category: item.category, assignee: item.assignee, qty: item.qty || 1 });
                                    setModalType('editPacking');
                                  }}
                                  className="text-gray-600 hover:text-amber-700 p-2 bg-white rounded-xl border border-[#DCD6CC]"
                                  title="编辑物品"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => requestDelete(() => {
                                    const updatedList = list.filter(p => p.id !== item.id);
                                    const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, packingList: updatedList } : t);
                                    saveTripsToCloud(updatedTrips);
                                  }, item.name)}
                                  className="text-gray-500 hover:text-red-600 p-2 bg-white rounded-xl border border-[#DCD6CC]"
                                  title="删除物品"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Tab 3: 智能推荐景点 */}
              {activeTab === 'recommendations' && (
                <div className="mt-8 space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">智能推荐必去景点 (小红书热榜)</h3>
                      <p className="text-xs text-[#777] mt-0.5">自动过滤您已排入每日行程的景点，探索更多宝藏机位</p>
                    </div>
                    <button 
                      onClick={handleRefreshSpots}
                      className="px-4 py-2.5 bg-[#E2DCD2] text-[#2C2A29] text-xs font-bold rounded-xl hover:bg-[#D6CEC2] transition flex items-center gap-1.5 shadow-xs"
                    >
                      <RefreshCw className="w-4 h-4" /> 换一换
                    </button>
                  </div>

                  {getSmartRecommendedSpots().length === 0 ? (
                    <div className="p-10 rounded-3xl bg-[#ECE7DF] border border-[#DCD6CC] text-center text-sm text-[#666]">
                      您已将当前所有推荐景点排入行程！
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {getSmartRecommendedSpots().map((spot, i) => (
                        <div key={spot.id || i} className="rounded-3xl overflow-hidden border border-[#DCD6CC] bg-[#ECE7DF]/50 shadow-xs flex flex-col justify-between">
                          <div>
                            <div className="h-48 overflow-hidden relative">
                              <img src={spot.img} alt={spot.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-5 space-y-2.5">
                              <h4 className="font-bold text-lg text-[#1A1817]">{spot.name}</h4>
                              <p className="text-sm text-[#555] leading-relaxed">{spot.desc}</p>
                              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                                {spot.mapUrl && (
                                  <a href={spot.mapUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-white border border-[#DCD6CC] text-[#2C2A29] px-3 py-1.5 rounded-xl font-semibold hover:bg-[#E2DCD2] flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-rose-600"/> Google Maps
                                  </a>
                                )}
                                {spot.rednoteUrl && (
                                  <a href={spot.rednoteUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-xl font-semibold hover:bg-rose-100 flex items-center gap-1">
                                    📖 小红书攻略
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: 航班与酒店住宿 */}
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
                              <span className="px-2.5 py-0.5 rounded-lg bg-[#2C2A29] text-white text-xs">{f.type} · {f.flightNo}</span>
                              <div className="flex items-center gap-1.5">
                                <button 
                                  onClick={() => {
                                    setEditingItem({ index: i, ...f });
                                    setFlightForm({ ...f });
                                    setModalType('editFlight');
                                  }}
                                  className="text-gray-600 hover:text-amber-700 p-1.5 bg-white rounded-lg border border-[#DCD6CC]"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => requestDelete(() => {
                                    const updated = currentTrip.flights.filter((_, idx) => idx !== i);
                                    const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, flights: updated } : t);
                                    saveTripsToCloud(updatedTrips);
                                  }, f.flightNo)}
                                  className="text-gray-500 hover:text-red-600 p-1.5 bg-white rounded-lg border border-[#DCD6CC]"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm font-bold text-[#1A1817] pt-1">{f.route}</p>
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
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={() => requestDelete(() => {
                                    const updated = currentTrip.hotels.filter((_, idx) => idx !== i);
                                    const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, hotels: updated } : t);
                                    saveTripsToCloud(updatedTrips);
                                  }, h.name)}
                                  className="text-gray-500 hover:text-red-600 p-1.5 bg-white rounded-lg border border-[#DCD6CC]"
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

              {/* Tab 5: 分天天气与智能建议 */}
              {activeTab === 'weather' && (
                <div className="mt-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">每日独立天气与智能穿搭/物品指南</h3>
                    <p className="text-xs text-[#777] mt-0.5">天气预报根据您在“每日行程”中添加的地点实时动态生成</p>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#DCD6CC]">
                    {Object.keys(currentTrip.itinerary || {}).map(dayKey => {
                      const hasItems = (currentTrip.itinerary[dayKey] || []).length > 0;
                      return (
                        <button
                          key={dayKey}
                          onClick={() => setActiveWeatherDay(dayKey)}
                          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
                            activeWeatherDay === dayKey ? 'bg-[#2C2A29] text-white shadow-sm' : 'bg-[#E2DCD2] text-[#555] hover:bg-[#D6CEC2]'
                          }`}
                        >
                          {dayKey} 天气
                          <span className={`w-2 h-2 rounded-full ${hasItems ? 'bg-emerald-400' : 'bg-gray-400'}`}></span>
                        </button>
                      );
                    })}
                  </div>

                  {(() => {
                    const dayItems = currentTrip.itinerary && currentTrip.itinerary[activeWeatherDay];
                    const hasItinerary = dayItems && dayItems.length > 0;

                    if (!hasItinerary) {
                      return (
                        <div className="p-12 rounded-3xl bg-[#ECE7DF] border border-[#DCD6CC] text-center space-y-3">
                          <CloudSun className="w-12 h-12 text-[#888] mx-auto opacity-50" />
                          <h4 className="font-bold text-base text-[#1A1817]">{activeWeatherDay} 暂无行程与地点安排</h4>
                          <p className="text-xs text-[#666] max-w-md mx-auto leading-relaxed">
                            因为您在 {activeWeatherDay} 还没有添加任何行程或地点，所以暂无当地天气预计。请前往<strong>“每日行程 & 详细交通”</strong>添加行程后，天气预报将自动在此解锁呈现！
                          </p>
                        </div>
                      );
                    }

                    const firstSpotTitle = dayItems[0].title;
                    const dayData = (currentTrip.dailyWeather && currentTrip.dailyWeather[activeWeatherDay]) || {
                      temp: '8°C / 1°C', 
                      condition: '多云转晴 ⛅', 
                      advice: `针对 ${activeWeatherDay} 在「${firstSpotTitle}」的行程，预计气温舒适，适合户外步行，建议穿着防风外套。`, 
                      packing: ['防风外套', '舒适运动鞋', '便携雨伞', '充电宝']
                    };

                    return (
                      <div className="space-y-6">
                        <div className="bg-[#ECE7DF] p-8 rounded-3xl border border-[#DCD6CC] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div>
                            <span className="text-xs text-[#666] font-bold uppercase tracking-wider">
                              📍 绑定行程地点：{firstSpotTitle} 等 ({activeWeatherDay} 预计气象)
                            </span>
                            <div className="text-4xl font-extrabold mt-2 flex items-center gap-4 text-[#1A1817]">
                              {dayData.temp} 
                              <span className="text-xl font-normal text-[#555]">{dayData.condition}</span>
                            </div>
                            <p className="text-sm text-[#555] mt-3 max-w-xl leading-relaxed">{dayData.advice}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="p-6 border border-[#DCD6CC] rounded-3xl bg-white shadow-xs space-y-3">
                            <h4 className="font-bold text-base flex items-center gap-2 text-[#1A1817]">👕 {activeWeatherDay} 智能穿搭建议</h4>
                            <p className="text-sm text-[#555] leading-relaxed">
                              结合当前行程地点气温（{dayData.temp}），建议采用“洋葱式多层穿搭法”，既能应对户外微风，又方便进入暖气室内时调节温度。
                            </p>
                          </div>
                          <div className="p-6 border border-[#DCD6CC] rounded-3xl bg-white shadow-xs space-y-3">
                            <h4 className="font-bold text-base flex items-center gap-2 text-[#1A1817]">🎒 {activeWeatherDay} 建议随身物品</h4>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {(dayData.packing || ['护照证件', '雨具', '充电宝']).map((item, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-[#E2DCD2] text-[#2C2A29] text-xs font-semibold rounded-xl border border-[#DCD6CC]">
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

              {/* Tab 6: 多币种记账与 AA 清算 */}
              {activeTab === 'expenses' && (
                <div className="mt-8 space-y-8">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">同行开销分摊与高级 AA 制智能清算对账</h3>
                      <p className="text-xs text-[#777] mt-0.5">支持多币种自动折算为 MYR (RM)，自动生成最优转账方案</p>
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
                        <span className="text-xs text-[#666] font-bold uppercase tracking-wider">💰 旅程总消费统计</span>
                        <div className="text-2xl font-extrabold text-[#1A1817] pt-1">
                          RM {calculateAAClearance().totalSpent}
                        </div>
                        <span className="text-xs text-[#777]">（同行成员：{(currentTrip.companionNames || ['我', 'Alex', 'Sarah']).join(', ')}）</span>
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
                          <span className="text-xs text-[#666] font-bold uppercase tracking-wider">👤 垫付人：{payer}</span>
                          <div className="text-2xl font-extrabold text-emerald-700 pt-1">
                            RM {totalAmt.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentTrip.expenses && currentTrip.expenses.length > 0 && (
                    <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-600" />
                        <h4 className="font-bold text-base text-[#1A1817]">🧮 高级 AA 制智能结账清算（谁该转给谁）</h4>
                      </div>
                      
                      {calculateAAClearance().transactions.length === 0 ? (
                        <p className="text-xs text-emerald-800 font-medium bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
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
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-sm text-[#444]">所有记账明细清单：</h4>
                    {(!currentTrip.expenses || currentTrip.expenses.length === 0) ? (
                      <div className="p-8 rounded-3xl bg-[#ECE7DF] border border-[#DCD6CC] text-center text-sm text-[#777]">
                        暂无消费记录，点击右上角“+ 记一笔”开始记录旅行账单！
                      </div>
                    ) : (
                      currentTrip.expenses.map((exp, idx) => (
                        <div key={exp.id || idx} className="p-4 rounded-2xl bg-[#ECE7DF] border border-[#DCD6CC] flex justify-between items-center gap-3">
                          <div>
                            <h4 className="font-bold text-sm text-[#1A1817]">{exp.title}</h4>
                            <span className="text-xs text-[#666]">
                              付款人: <span className="font-semibold text-amber-800">{exp.paidBy}</span> · 
                              类别: {exp.category} · 
                              分摊: {exp.splitMode === 'custom' ? '自定义金额' : `平分 (${(exp.splitAmong || []).join(', ')})`}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span className="font-bold text-base block">{exp.currency || 'MYR'} {exp.amount}</span>
                              <span className="text-xs text-emerald-700 font-medium">≈ RM {exp.convertedRM || convertToRM(exp.amount, exp.currency || 'MYR')}</span>
                            </div>
                            <button 
                              onClick={() => requestDelete(() => {
                                const updatedExp = currentTrip.expenses.filter((_, i) => i !== idx);
                                const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, expenses: updatedExp } : t);
                                saveTripsToCloud(updatedTrips);
                              }, exp.title)}
                              className="text-gray-500 hover:text-red-600 p-2 bg-white rounded-xl border border-[#DCD6CC]"
                              title="删除账单"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 7: 旅途回忆相册 */}
              {activeTab === 'memories' && (
                <div className="mt-8 space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-3">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">旅途回忆相册</h3>
                      <p className="text-xs text-[#777] mt-0.5">支持上传本地照片 (.jpg / .png) 或网络图片链接，记录沿途故事</p>
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
                    <div className="text-center py-16 bg-[#ECE7DF] rounded-3xl border border-[#DCD6CC] text-[#777]">
                      <Camera className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#555]" />
                      <p className="text-sm font-medium">暂无回忆照片，点击上方按钮添加第一张精彩瞬间吧！</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {currentTrip.memories.map((m, i) => (
                        <div key={m.id || i} className="bg-white p-4 rounded-3xl border border-[#DCD6CC] shadow-xs hover:shadow-md transition flex flex-col justify-between group relative">
                          <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 opacity-95 sm:opacity-0 sm:group-hover:opacity-100 transition">
                            <button 
                              onClick={() => {
                                setEditingItem({ index: i, ...m });
                                setMemoryForm({ url: m.url || m, date: m.date || '', location: m.location || '', comment: m.comment || '' });
                                setModalType('editMemory');
                              }}
                              className="bg-black/75 text-white p-2 rounded-xl hover:bg-amber-600 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => requestDelete(() => {
                                const updatedMemories = currentTrip.memories.filter((_, idx) => idx !== i);
                                const updatedTrips = trips.map(t => t.id === currentTrip.id ? { ...t, memories: updatedMemories } : t);
                                saveTripsToCloud(updatedTrips);
                              }, m.location || '这张回忆照片')}
                              className="bg-black/75 text-white p-2 rounded-xl hover:bg-red-600 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 mb-4">
                            <img src={m.url || m} alt="memory" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          </div>
                          <div className="space-y-2 px-1">
                            <div className="flex justify-between items-center text-xs text-[#666]">
                              <span className="flex items-center gap-1 font-medium"><MapPin className="w-3 h-3 text-rose-600"/> {m.location || '未知地点'}</span>
                              <span>{m.date || '旅行途中'}</span>
                            </div>
                            <p className="text-sm text-[#2C2A29] font-medium leading-relaxed italic bg-[#ECE7DF] p-3 rounded-2xl border border-[#DCD6CC]">
                              “{m.comment || '美好而难忘的瞬间。'}”
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

      {/* ================= 自定义二次确认对话框 ================= */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCD6CC] rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-[#1A1817]">{confirmDialog.title}</h3>
            <p className="text-sm text-[#555] leading-relaxed">{confirmDialog.message}</p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setConfirmDialog(null)} 
                className="px-4 py-2 bg-[#ECE7DF] text-[#2C2A29] text-xs font-bold rounded-xl hover:bg-[#E2DCD2]"
              >
                取消
              </button>
              <button 
                onClick={confirmDialog.onConfirm} 
                className="px-5 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 新增天数弹窗 ================= */}
      {newDayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCD6CC] rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-3">
              <h3 className="font-bold text-lg">📅 新增行程天数</h3>
              <button onClick={() => setNewDayModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
            </div>
            <div>
              <label className="text-xs text-[#666] block mb-1">天数名称（例如：Day 4）</label>
              <input 
                type="text" 
                value={newDayInput} 
                onChange={e => setNewDayInput(e.target.value)} 
                className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" 
                placeholder="Day 4" 
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setNewDayModalOpen(false)} className="px-4 py-2 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
              <button 
                onClick={() => {
                  const trimmed = newDayInput.trim();
                  if (!trimmed) {
                    triggerToast('⚠️ 请输入天数名称');
                    return;
                  }
                  if (currentTrip.itinerary[trimmed]) {
                    triggerToast('⚠️ 该天数已存在，请换一个名称');
                    return;
                  }
                  const updatedItinerary = { ...currentTrip.itinerary, [trimmed]: [] };
                  const updated = trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updatedItinerary } : t);
                  saveTripsToCloud(updated);
                  setActiveDayTab(trimmed);
                  setNewDayModalOpen(false);
                  triggerToast(`📅 成功添加 ${trimmed}！`);
                }}
                className="px-5 py-2 bg-[#2C2A29] text-white text-xs font-bold rounded-xl"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 各类业务表单 MODALS ================= */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCD6CC] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* 按同行伙伴专属分享弹窗 */}
            {modalType === 'shareByPartner' && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">👥 按同行伙伴专属聚合分享</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <p className="text-xs text-[#666] leading-relaxed">
                    选择一位同行伙伴后，系统会自动生成仅限该伙伴的专属链接（<code className="bg-[#ECE7DF] px-1.5 py-0.5 rounded">?partner=姓名</code>）。对方打开链接时，主页将<strong>自动且仅显示所有包含 TA 的旅程</strong>，其他私人旅程完全不可见。
                  </p>
                  {allCompanionPartners.length === 0 ? (
                    <div className="p-6 bg-[#ECE7DF] rounded-2xl text-center text-xs text-[#666]">
                      暂无其他同行伙伴名单，请先在旅程中添加同行伙伴姓名（如 Alex、Sarah、C）。
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {allCompanionPartners.map(partner => {
                        const partnerTrips = trips.filter(t => (t.companionNames || []).includes(partner));
                        return (
                          <div key={partner} className="p-4 rounded-2xl bg-[#ECE7DF] border border-[#DCD6CC] flex items-center justify-between gap-3">
                            <div>
                              <div className="font-bold text-sm text-[#1A1817] flex items-center gap-2">
                                👤 {partner}
                                <span className="text-[11px] bg-white px-2 py-0.5 rounded-full border border-[#DCD6CC] text-[#555]">
                                  共 {partnerTrips.length} 个同行旅程
                                </span>
                              </div>
                              <p className="text-xs text-[#666] mt-1">
                                可见：{partnerTrips.map(t => t.title).join('、')}
                              </p>
                            </div>
                            <button
                              onClick={() => handleShareByPartner(partner)}
                              className="px-4 py-2 bg-[#2C2A29] text-white text-xs font-bold rounded-xl hover:bg-[#444] shrink-0 flex items-center gap-1.5"
                            >
                              <Share2 className="w-3.5 h-3.5" /> 复制专属链接
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

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
                      <input
                        type="date"
                        value={newTripForm.startDate}
                        onChange={e => {
                          const nextStart = e.target.value;
                          const nextEnd = nextStart > newTripForm.endDate ? nextStart : newTripForm.endDate;
                          const count = calculateTripDayCount(nextStart, nextEnd);
                          setNewTripForm({ ...newTripForm, startDate: nextStart, endDate: nextEnd });
                          triggerToast(`📅 已自动检测为 ${count} 天行程 (Day 1 ~ Day ${count})`);
                        }}
                        className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">结束日期</label>
                      <input
                        type="date"
                        value={newTripForm.endDate}
                        onChange={e => {
                          const nextEnd = e.target.value;
                          const nextStart = nextEnd < newTripForm.startDate ? nextEnd : newTripForm.startDate;
                          const count = calculateTripDayCount(nextStart, nextEnd);
                          setNewTripForm({ ...newTripForm, startDate: nextStart, endDate: nextEnd });
                          triggerToast(`📅 已自动检测为 ${count} 天行程 (Day 1 ~ Day ${count})`);
                        }}
                        className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">同行伙伴姓名 (用逗号隔开)</label>
                    <input type="text" value={newTripForm.companionNames.join(', ')} onChange={e => setNewTripForm({...newTripForm, companionNames: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="我, Alex, Sarah" />
                  </div>
                  <div className="bg-[#ECE7DF] px-3.5 py-2.5 rounded-xl border border-[#DCD6CC] text-xs text-[#555] flex items-center justify-between">
                    <span>📅 根据所选日期自动生成行程标签页：</span>
                    <strong className="text-[#1A1817]">共 {calculateTripDayCount(newTripForm.startDate, newTripForm.endDate)} 天 (Day 1 ~ Day {calculateTripDayCount(newTripForm.startDate, newTripForm.endDate)})</strong>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!newTripForm.title.trim()) { triggerToast('⚠️ 请填写旅行标题'); return; }
                        const members = newTripForm.companionNames.length > 0 ? newTripForm.companionNames : ['我'];
                        const dayCount = calculateTripDayCount(newTripForm.startDate, newTripForm.endDate);
                        const generatedItinerary = syncItineraryWithDateRange({}, newTripForm.startDate, newTripForm.endDate);
                        generatedItinerary['Day 1'] = [
                          { id: 'd1', time: '14:00', title: '抵达与酒店入住', desc: '办理入住并稍作休整，探索周边美食。', transport: '机场快线 / 巴士直达市区', distance: '机场至市区', opening: '全天', mapUrl: 'https://maps.google.com', photo: '', photoRefs: [], shoppingList: [] }
                        ];
                        const newT = {
                          id: Date.now().toString(),
                          title: newTripForm.title,
                          destination: newTripForm.destination,
                          startDate: newTripForm.startDate,
                          endDate: newTripForm.endDate,
                          currency: newTripForm.currency,
                          companions: members.length,
                          companionNames: members,
                          coverImage: newTripForm.coverImage,
                          dailyWeather: { 'Day 1': { temp: '5°C / -1°C', condition: '晴朗 ☀️', advice: '气候微冷，注意防风保暖。', packing: ['羽绒服', '保暖手套'] } },
                          flights: [], 
                          hotels: [],
                          itinerary: generatedItinerary,
                          masterSpots: [], 
                          expenses: [], 
                          memories: [],
                          preTripNotices: [],
                          packingList: [
                            { id: 'p_init_1', name: '护照 & 身份证件', category: '证件与钱财', assignee: '全员各自携带', qty: 1, packed: false },
                            { id: 'p_init_2', name: '充电器 & 充电宝', category: '电子数码', assignee: '全员各自携带', qty: 1, packed: false }
                          ]
                        };
                        saveTripsToCloud([newT, ...trips]);
                        setActiveDayTab('Day 1');
                        setActiveWeatherDay('Day 1');
                        setModalType(null);
                        triggerToast(`✨ 新旅程已创建，并自动生成 Day 1 ~ Day ${dayCount} 行程页！`);
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      立即创建
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 行李清单添加或编辑 */}
            {(modalType === 'packing' || modalType === 'editPacking') && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">{modalType === 'packing' ? '🎒 添加行李清单物品' : '✏️ 编辑行李物品'}</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">物品名称</label>
                    <input type="text" value={packingForm.name} onChange={e => setPackingForm({...packingForm, name: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="例如：国际转换插头 / 晕车药" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">物品分类</label>
                      <select value={packingForm.category} onChange={e => setPackingForm({...packingForm, category: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm">
                        <option value="证件与钱财">证件与钱财</option>
                        <option value="衣物穿搭">衣物穿搭</option>
                        <option value="电子数码">电子数码</option>
                        <option value="洗漱与护肤">洗漱与护肤</option>
                        <option value="药品与杂物">药品与杂物</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">数量</label>
                      <input type="number" min="1" value={packingForm.qty} onChange={e => setPackingForm({...packingForm, qty: parseInt(e.target.value) || 1})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">负责携带伙伴</label>
                    <select value={packingForm.assignee} onChange={e => setPackingForm({...packingForm, assignee: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm font-medium">
                      <option value="全员各自携带">全员各自携带</option>
                      {(currentTrip.companionNames || ['我', 'Alex', 'Sarah']).map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!packingForm.name.trim()) { triggerToast('⚠️ 请填写物品名称'); return; }
                        const currentList = currentTrip.packingList || [];
                        if (modalType === 'packing') {
                          const newItem = { id: Date.now().toString(), ...packingForm, packed: false };
                          const updated = trips.map(t => t.id === currentTrip.id ? { ...t, packingList: [newItem, ...currentList] } : t);
                          saveTripsToCloud(updated);
                          triggerToast('🎒 物品已添加至行李清单！');
                        } else {
                          const updatedList = currentList.map(p => p.id === editingItem.id ? { ...p, ...packingForm } : p);
                          const updated = trips.map(t => t.id === currentTrip.id ? { ...t, packingList: updatedList } : t);
                          saveTripsToCloud(updated);
                          triggerToast('✏️ 行李物品已更新！');
                        }
                        setModalType(null);
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      {modalType === 'packing' ? '确认添加' : '保存修改'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 编辑旅程基本信息 */}
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
                      <input
                        type="date"
                        value={editTripMetaForm.startDate}
                        onChange={e => {
                          const nextStart = e.target.value;
                          const nextEnd = nextStart > editTripMetaForm.endDate ? nextStart : editTripMetaForm.endDate;
                          setEditTripMetaForm({ ...editTripMetaForm, startDate: nextStart, endDate: nextEnd });
                          const count = autoApplyDateRangeToTrip(currentTrip.id, nextStart, nextEnd);
                          triggerToast(`📅 已自动检测为 ${count} 天，每日行程已同步出现 Day 1 ~ Day ${count}`);
                        }}
                        className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">结束日期</label>
                      <input
                        type="date"
                        value={editTripMetaForm.endDate}
                        onChange={e => {
                          const nextEnd = e.target.value;
                          const nextStart = nextEnd < editTripMetaForm.startDate ? nextEnd : editTripMetaForm.startDate;
                          setEditTripMetaForm({ ...editTripMetaForm, startDate: nextStart, endDate: nextEnd });
                          const count = autoApplyDateRangeToTrip(currentTrip.id, nextStart, nextEnd);
                          triggerToast(`📅 已自动检测为 ${count} 天，每日行程已同步出现 Day 1 ~ Day ${count}`);
                        }}
                        className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">同行伙伴姓名 (用逗号隔开)</label>
                    <input type="text" value={editTripMetaForm.companionNames.join(', ')} onChange={e => setEditTripMetaForm({...editTripMetaForm, companionNames: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="我, Alex, Sarah" />
                  </div>
                  <div className="bg-[#ECE7DF] px-3.5 py-2.5 rounded-xl border border-[#DCD6CC] text-xs text-[#555] flex items-center justify-between">
                    <span>📅 更改日期后将自动同步行程天数：</span>
                    <strong className="text-[#1A1817]">共 {calculateTripDayCount(editTripMetaForm.startDate, editTripMetaForm.endDate)} 天 (Day 1 ~ Day {calculateTripDayCount(editTripMetaForm.startDate, editTripMetaForm.endDate)})</strong>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!editTripMetaForm.title.trim()) { triggerToast('⚠️ 标题不能为空'); return; }
                        const dayCount = calculateTripDayCount(editTripMetaForm.startDate, editTripMetaForm.endDate);
                        const syncedItinerary = syncItineraryWithDateRange(currentTrip.itinerary, editTripMetaForm.startDate, editTripMetaForm.endDate);
                        const updated = trips.map(t => t.id === currentTrip.id ? { 
                          ...t, 
                          title: editTripMetaForm.title, 
                          startDate: editTripMetaForm.startDate, 
                          endDate: editTripMetaForm.endDate, 
                          companions: editTripMetaForm.companionNames.length,
                          companionNames: editTripMetaForm.companionNames,
                          itinerary: syncedItinerary
                        } : t);
                        if (!syncedItinerary[activeDayTab]) {
                          setActiveDayTab('Day 1');
                          setActiveWeatherDay('Day 1');
                        }
                        saveTripsToCloud(updated);
                        setModalType(null);
                        triggerToast(`✨ 旅程信息与 Day 1 ~ Day ${dayCount} 行程标签页已自动同步！`);
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      保存更改
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 行程新增/编辑 */}
            {(modalType === 'itinerary' || modalType === 'editItinerary') && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">{modalType === 'itinerary' ? '📝 新增行程详情' : '✏️ 编辑行程详情'}</h3>
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
                      <label className="text-xs text-[#666] block mb-1">景点/地点名称</label>
                      <input type="text" value={itineraryForm.title} onChange={e => setItineraryForm({...itineraryForm, title: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="浅草寺" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">与上一站距离提示</label>
                    <input type="text" value={itineraryForm.distance} onChange={e => setItineraryForm({...itineraryForm, distance: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="距上一站步行 10 分钟" />
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">详细交通与路线</label>
                    <input type="text" value={itineraryForm.transport} onChange={e => setItineraryForm({...itineraryForm, transport: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="乘搭地铁..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">开放时间</label>
                      <input type="text" value={itineraryForm.opening} onChange={e => setItineraryForm({...itineraryForm, opening: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="09:00 - 18:00" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">Google Maps 链接</label>
                      <input type="text" value={itineraryForm.mapUrl} onChange={e => setItineraryForm({...itineraryForm, mapUrl: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="https://maps.google.com/..." />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">游玩描述</label>
                    <textarea value={itineraryForm.desc} onChange={e => setItineraryForm({...itineraryForm, desc: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="描述..." />
                  </div>

                  {/* 打算拍的照片参考编辑器 */}
                  <div className="p-4 rounded-2xl bg-[#ECE7DF] border border-[#DCD6CC] space-y-3">
                    <label className="text-xs font-bold text-[#1A1817] block">📷 打算拍的照片参考（小红书/IG 机位参考图）</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={e => handleLocalImageUpload(e, (base64Str) => {
                          setItineraryForm(prev => ({ ...prev, photoRefs: [...(prev.photoRefs || []), base64Str] }));
                        })}
                        className="text-xs bg-white p-2 rounded-xl border border-[#DCD6CC] flex-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newRefUrlInput}
                        onChange={e => setNewRefUrlInput(e.target.value)}
                        placeholder="或粘贴参考图链接 (https://...)"
                        className="flex-1 p-2.5 border border-[#DCD6CC] rounded-xl text-xs bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newRefUrlInput.trim()) return;
                          setItineraryForm(prev => ({ ...prev, photoRefs: [...(prev.photoRefs || []), newRefUrlInput.trim()] }));
                          setNewRefUrlInput('');
                        }}
                        className="px-3.5 py-2 bg-[#2C2A29] text-white text-xs font-bold rounded-xl shrink-0"
                      >
                        添加链接
                      </button>
                    </div>
                    {(itineraryForm.photoRefs || []).length > 0 && (
                      <div className="flex gap-2.5 overflow-x-auto pt-1">
                        {itineraryForm.photoRefs.map((url, rIdx) => (
                          <div key={rIdx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#DCD6CC] shrink-0 bg-white">
                            <img src={url} alt="参考预览" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setItineraryForm(prev => ({
                                  ...prev,
                                  photoRefs: prev.photoRefs.filter((_, idx) => idx !== rIdx)
                                }));
                              }}
                              className="absolute top-0.5 right-0.5 bg-black/75 text-white rounded-full p-0.5 hover:bg-rose-600"
                              title="移除参考图"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 打算买的东西清单编辑器 */}
                  <div className="p-4 rounded-2xl bg-[#ECE7DF] border border-[#DCD6CC] space-y-3">
                    <label className="text-xs font-bold text-[#1A1817] block">🛍️ 打算买的东西清单（伴手礼 / 药妆 / 限定好物）</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newShopItemInput}
                        onChange={e => setNewShopItemInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (!newShopItemInput.trim()) return;
                            setItineraryForm(prev => ({
                              ...prev,
                              shoppingList: [...(prev.shoppingList || []), { id: Date.now().toString(), name: newShopItemInput.trim(), bought: false }]
                            }));
                            setNewShopItemInput('');
                          }
                        }}
                        placeholder="输入想买的物品名称，点击右侧添加..."
                        className="flex-1 p-2.5 border border-[#DCD6CC] rounded-xl text-xs bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newShopItemInput.trim()) return;
                          setItineraryForm(prev => ({
                            ...prev,
                            shoppingList: [...(prev.shoppingList || []), { id: Date.now().toString(), name: newShopItemInput.trim(), bought: false }]
                          }));
                          setNewShopItemInput('');
                        }}
                        className="px-3.5 py-2 bg-[#2C2A29] text-white text-xs font-bold rounded-xl shrink-0"
                      >
                        + 添加
                      </button>
                    </div>
                    {(itineraryForm.shoppingList || []).length > 0 && (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {itineraryForm.shoppingList.map((sItem, sIdx) => (
                          <div key={sItem.id || sIdx} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#DCD6CC] text-xs">
                            <span className={sItem.bought ? 'line-through text-[#888]' : 'font-medium text-[#1A1817]'}>
                              • {sItem.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setItineraryForm(prev => ({
                                  ...prev,
                                  shoppingList: prev.shoppingList.filter((_, idx) => idx !== sIdx)
                                }));
                              }}
                              className="text-gray-400 hover:text-rose-600 p-0.5"
                              title="删除此物品"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!itineraryForm.title.trim()) { triggerToast('⚠️ 请填写景点/地点名称'); return; }
                        if (modalType === 'itinerary') {
                          const newItem = { id: Date.now().toString(), ...itineraryForm };
                          const updatedDayList = [...(currentTrip.itinerary[activeDayTab] || []), newItem];
                          const updatedItinerary = { ...currentTrip.itinerary, [activeDayTab]: updatedDayList };
                          const updated = trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updatedItinerary } : t);
                          saveTripsToCloud(updated);
                          triggerToast('✨ 新行程已保存并同步！');
                        } else {
                          const updatedItinerary = { ...currentTrip.itinerary };
                          if (editingItem.day !== activeDayTab) {
                            updatedItinerary[editingItem.day] = updatedItinerary[editingItem.day].filter((_, i) => i !== editingItem.index);
                            updatedItinerary[activeDayTab] = [...(updatedItinerary[activeDayTab] || []), { ...itineraryForm }];
                          } else {
                            updatedItinerary[activeDayTab] = updatedItinerary[activeDayTab].map((it, i) => i === editingItem.index ? { ...it, ...itineraryForm } : it);
                          }
                          const updated = trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updatedItinerary } : t);
                          saveTripsToCloud(updated);
                          triggerToast('✏️ 行程修改已保存！');
                        }
                        setModalType(null);
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      保存行程
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 景点照片更换 */}
            {modalType === 'spotPhoto' && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">📸 添加/更换景点照片</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">上传本地照片</label>
                    <input type="file" accept="image/*" onChange={e => handleLocalImageUpload(e, url => setSpotPhotoForm({ url }))} className="w-full text-xs p-2.5 border border-[#DCD6CC] rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">或输入图片链接 (URL)</label>
                    <input type="text" value={spotPhotoForm.url} onChange={e => setSpotPhotoForm({ url: e.target.value })} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="https://..." />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        const updatedDayList = currentTrip.itinerary[editingItem.day].map((it, i) => i === editingItem.index ? { ...it, photo: spotPhotoForm.url } : it);
                        const updatedItinerary = { ...currentTrip.itinerary, [editingItem.day]: updatedDayList };
                        const updated = trips.map(t => t.id === currentTrip.id ? { ...t, itinerary: updatedItinerary } : t);
                        saveTripsToCloud(updated);
                        setModalType(null);
                        triggerToast('📸 景点照片已更新！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      确认保存
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 航班添加/编辑 */}
            {(modalType === 'flight' || modalType === 'editFlight') && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">✈️ 航班信息</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">类型</label>
                    <select value={flightForm.type} onChange={e => setFlightForm({...flightForm, type: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm">
                      <option value="去程">去程</option>
                      <option value="回程">回程</option>
                      <option value="中转/内陆">中转/内陆</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">航班号</label>
                    <input type="text" value={flightForm.flightNo} onChange={e => setFlightForm({...flightForm, flightNo: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="JL 0724" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">日期</label>
                      <input type="date" value={flightForm.date} onChange={e => setFlightForm({...flightForm, date: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">起降时间</label>
                      <input type="text" value={flightForm.time} onChange={e => setFlightForm({...flightForm, time: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="09:15 -> 17:30" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">航线</label>
                    <input type="text" value={flightForm.route} onChange={e => setFlightForm({...flightForm, route: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="吉隆坡 (KUL) -> 东京成田 (NRT)" />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!flightForm.flightNo.trim()) { triggerToast('⚠️ 请填写航班号'); return; }
                        const list = currentTrip.flights || [];
                        const updatedFlights = modalType === 'flight'
                          ? [...list, { id: Date.now().toString(), ...flightForm }]
                          : list.map((f, i) => i === editingItem.index ? { ...f, ...flightForm } : f);
                        const updated = trips.map(t => t.id === currentTrip.id ? { ...t, flights: updatedFlights } : t);
                        saveTripsToCloud(updated);
                        setModalType(null);
                        triggerToast('✈️ 航班信息已保存！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      保存航班
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 酒店添加/编辑 */}
            {(modalType === 'hotel' || modalType === 'editHotel') && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">🏨 酒店住宿信息</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">酒店名称</label>
                    <input type="text" value={hotelForm.name} onChange={e => setHotelForm({...hotelForm, name: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">酒店地址</label>
                    <input type="text" value={hotelForm.address} onChange={e => setHotelForm({...hotelForm, address: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
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
                        if (!hotelForm.name.trim()) { triggerToast('⚠️ 请填写酒店名称'); return; }
                        const list = currentTrip.hotels || [];
                        const updatedHotels = modalType === 'hotel'
                          ? [...list, { id: Date.now().toString(), ...hotelForm }]
                          : list.map((h, i) => i === editingItem.index ? { ...h, ...hotelForm } : h);
                        const updated = trips.map(t => t.id === currentTrip.id ? { ...t, hotels: updatedHotels } : t);
                        saveTripsToCloud(updated);
                        setModalType(null);
                        triggerToast('🏨 酒店信息已保存！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      保存酒店
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 记账弹窗 */}
            {modalType === 'expense' && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">💰 多币种记账与 AA 分摊</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">消费项目</label>
                    <input type="text" value={expenseForm.title} onChange={e => setExpenseForm({...expenseForm, title: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="例如：一兰拉面晚餐" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">金额</label>
                      <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="100" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">币种</label>
                      <select value={expenseForm.currency} onChange={e => setExpenseForm({...expenseForm, currency: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm">
                        <option value="MYR">MYR (RM)</option>
                        <option value="JPY">JPY (日元)</option>
                        <option value="CNY">CNY (人民币)</option>
                        <option value="USD">USD (美元)</option>
                        <option value="SGD">SGD (新币)</option>
                        <option value="THB">THB (泰铢)</option>
                        <option value="KRW">KRW (韩元)</option>
                        <option value="EUR">EUR (欧元)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">付款垫付人</label>
                      <select value={expenseForm.paidBy} onChange={e => setExpenseForm({...expenseForm, paidBy: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm">
                        {(currentTrip.companionNames || ['我', 'Alex', 'Sarah']).map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">消费类别</label>
                      <select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm">
                        <option value="餐饮">餐饮</option>
                        <option value="交通">交通</option>
                        <option value="住宿">住宿</option>
                        <option value="门票">门票</option>
                        <option value="购物">购物</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1.5">参与平分伙伴</label>
                    <div className="flex flex-wrap gap-2">
                      {(currentTrip.companionNames || ['我', 'Alex', 'Sarah']).map(m => {
                        const checked = expenseForm.splitAmong.includes(m);
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              const next = checked
                                ? expenseForm.splitAmong.filter(x => x !== m)
                                : [...expenseForm.splitAmong, m];
                              setExpenseForm({ ...expenseForm, splitAmong: next });
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                              checked ? 'bg-[#2C2A29] text-white border-[#2C2A29]' : 'bg-[#ECE7DF] text-[#555] border-[#DCD6CC]'
                            }`}
                          >
                            {checked ? '✓ ' : ''}{m}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!expenseForm.title.trim() || !expenseForm.amount) { triggerToast('⚠️ 请填写消费名称与金额'); return; }
                        if (expenseForm.splitAmong.length === 0) { triggerToast('⚠️ 请至少选择一位分摊伙伴'); return; }
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
                        const updated = trips.map(t => t.id === currentTrip.id ? { ...t, expenses: [...(t.expenses || []), newExp] } : t);
                        saveTripsToCloud(updated);
                        setModalType(null);
                        triggerToast('💰 记账已同步，AA清算已更新！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      确认记账
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* 回忆相册添加/编辑 */}
            {(modalType === 'memory' || modalType === 'editMemory') && (
              <>
                <div className="flex justify-between items-center border-b border-[#DCD6CC] pb-4">
                  <h3 className="font-bold text-lg">📸 旅途回忆相册</h3>
                  <button onClick={() => setModalType(null)} className="p-1 rounded-full hover:bg-gray-100"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#666] block mb-1">上传本地照片</label>
                    <input type="file" accept="image/*" onChange={e => handleLocalImageUpload(e, url => setMemoryForm({ ...memoryForm, url }))} className="w-full text-xs p-2.5 border border-[#DCD6CC] rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">或输入图片链接 (URL)</label>
                    <input type="text" value={memoryForm.url} onChange={e => setMemoryForm({ ...memoryForm, url: e.target.value })} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="https://..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-[#666] block mb-1">日期</label>
                      <input type="date" value={memoryForm.date} onChange={e => setMemoryForm({ ...memoryForm, date: e.target.value })} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[#666] block mb-1">拍摄地点</label>
                      <input type="text" value={memoryForm.location} onChange={e => setMemoryForm({ ...memoryForm, location: e.target.value })} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="新宿歌舞伎町" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#666] block mb-1">心情/故事记录</label>
                    <textarea value={memoryForm.comment} onChange={e => setMemoryForm({ ...memoryForm, comment: e.target.value })} className="w-full p-3 border border-[#DCD6CC] rounded-xl text-sm" placeholder="写下这一刻的心情..." />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button onClick={() => setModalType(null)} className="px-5 py-2.5 bg-gray-100 text-xs rounded-xl font-medium">取消</button>
                    <button 
                      onClick={() => {
                        if (!memoryForm.url.trim()) { triggerToast('⚠️ 请上传或填写照片链接'); return; }
                        const list = currentTrip.memories || [];
                        const updatedMemories = modalType === 'memory'
                          ? [{ id: Date.now().toString(), ...memoryForm }, ...list]
                          : list.map((m, i) => i === editingItem.index ? { ...m, ...memoryForm } : m);
                        const updated = trips.map(t => t.id === currentTrip.id ? { ...t, memories: updatedMemories } : t);
                        saveTripsToCloud(updated);
                        setModalType(null);
                        triggerToast('📸 回忆相册已更新！');
                      }}
                      className="px-6 py-2.5 bg-[#2C2A29] text-white text-xs rounded-xl font-bold"
                    >
                      保存回忆
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
