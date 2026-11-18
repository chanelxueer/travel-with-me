import React, { useState, useEffect } from 'react';
import {
  Plane,
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Trash2,
  Edit3,
  DollarSign,
  Share2,
  Camera,
  CheckCircle2,
  Circle,
  ExternalLink,
  Navigation,
  CloudSun,
  Info,
  ChevronRight,
  ChevronLeft,
  Coffee,
  Sun,
  Sparkles,
  ArrowRight,
  Download,
  Check,
  X,
  Image as ImageIcon,
  Video,
  Smile,
  Compass,
  BedDouble,
  FileText,
  RefreshCw,
  Thermometer,
  Umbrella,
  Cloud,
  CheckCheck
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';

// Initialize Cloud Sync Services
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const app = firebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'travel-with-me-default';

// Currency exchange rates to MYR (base 1)
const CURRENCY_RATES_TO_MYR = {
  MYR: 1.0,
  JPY: 0.029, // 1 JPY = 0.029 MYR
  THB: 0.13,  // 1 THB = 0.13 MYR
  KRW: 0.0034,// 1 KRW = 0.0034 MYR
  SGD: 3.52,  // 1 SGD = 3.52 MYR
  TWD: 0.14,  // 1 TWD = 0.14 MYR
  USD: 4.45,  // 1 USD = 4.45 MYR
  EUR: 4.85   // 1 EUR = 4.85 MYR
};

// Initial Sample Trips
const INITIAL_TRIPS = [
  {
    id: 'trip-tokyo-2026',
    title: '日本东京 5天4夜冬季美食与雪景之旅',
    destination: '日本 · 东京 (Tokyo)',
    startDate: '2026-12-25',
    endDate: '2026-12-29',
    status: 'upcoming',
    currency: 'JPY',
    budgetMYR: 5500,
    companions: ['我 (主理人)', 'Aiden', 'Jing Yi'],
    coverGradient: 'from-amber-800 via-stone-800 to-amber-950',
    flights: [
      { id: 'f1', type: '去程', flightNo: 'JL 724', route: 'KUL (吉隆坡) ➔ NRT (成田)', time: '2026-12-25 00:15 - 08:00', seat: '32A', pnr: 'ABC123Z', terminal: 'T1' },
      { id: 'f2', type: '回程', flightNo: 'JL 723', route: 'NRT (成田) ➔ KUL (吉隆坡)', time: '2026-12-29 17:35 - 23:55', seat: '32C', pnr: 'ABC123Z', terminal: 'T2' }
    ],
    hotels: [
      { id: 'h1', name: 'Tokyo Prince Hotel (东京王子大饭店)', address: '3-3-1 Shibakoen, Minato City, Tokyo', checkIn: '2026-12-25', checkOut: '2026-12-29', contact: '+81 3-3432-1111', mapQuery: 'Tokyo Prince Hotel' }
    ],
    weatherGuide: {
      tempRange: '2°C ~ 11°C',
      condition: 'snow/sunny',
      outfitAdvice: '冬季寒冷干燥，建议穿羽绒服、呢大衣、保暖内衣、围巾手套。',
      essentialGear: '暖宝宝、润唇膏、护照、西瓜卡 (Suica)'
    },
    checklist: [
      { id: 'ck1', category: '证件与金融', text: '马来西亚护照 (6个月有效期)', checked: true },
      { id: 'ck2', category: '证件与金融', text: 'Visit Japan Web 电子入境卡填妥', checked: true },
      { id: 'ck3', category: '电子与网络', text: '日本 eSIM / 漫游流量包', checked: false },
      { id: 'ck4', category: '衣物穿搭', text: '保暖发热衣与防滑雪靴', checked: false }
    ],
    days: [
      {
        dayNum: 1,
        date: '2026-12-25',
        title: '抵达东京 · 银座闪烁圣诞与一兰拉面',
        weatherNote: '5°C 晴间多云',
        stops: [
          {
            id: 's1-1',
            time: '09:30',
            name: '成田机场入境 & 乘搭成田特快 (NEX)',
            category: '交通',
            address: 'Narita Airport Terminal 1',
            openHours: '05:00 - 24:00',
            duration: '1小时乘坐',
            notes: '兑换 JR Pass 凭证并搭乘直达东京站',
            photoUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&auto=format&fit=crop&q=80',
            mapQuery: 'Narita Airport Station'
          },
          {
            id: 's1-2',
            time: '12:30',
            name: 'Tokyo Prince Hotel 寄放行李',
            category: '住宿',
            address: '3-3-1 Shibakoen, Minato',
            openHours: '24小时前台',
            duration: '30分钟',
            notes: '先完成check-in登记并寄存行李',
            photoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
            mapQuery: 'Tokyo Prince Hotel'
          },
          {
            id: 's1-3',
            time: '14:00',
            name: '银座 (Ginza) 逛街与下午茶',
            category: '景点',
            address: 'Ginza, Chuo City, Tokyo',
            openHours: '全天开放 (店铺 11:00 - 20:00)',
            duration: '3小时',
            notes: '欣赏圣诞灯饰，逛 Ginza Six 旗舰店',
            photoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
            mapQuery: 'Ginza Tokyo'
          }
        ],
        transitBetween: [
          { fromIndex: 0, toIndex: 1, distance: '65 km', duration: '60 mins', transport: '火车 (NEX Express)', link: 'https://maps.google.com/?q=Narita+to+Tokyo+Prince+Hotel' },
          { fromIndex: 1, toIndex: 2, distance: '4.2 km', duration: '15 mins', transport: '地下铁大江戸线', link: 'https://maps.google.com/?q=Shibakoen+to+Ginza' }
        ]
      },
      {
        dayNum: 2,
        date: '2026-12-26',
        title: '浅草寺祈福 & 晴空塔俯瞰东京夜景',
        weatherNote: '3°C 晴',
        stops: [
          {
            id: 's2-1',
            time: '09:30',
            name: '浅草寺 (Senso-ji)',
            category: '景点',
            address: '2-3-1 Asakusa, Taito City, Tokyo',
            openHours: '06:00 - 17:00',
            duration: '2小时',
            notes: '雷门拍合照，品尝人形烧与草莓大福',
            photoUrl: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&auto=format&fit=crop&q=80',
            mapQuery: 'Senso-ji Asakusa'
          },
          {
            id: 's2-2',
            time: '14:00',
            name: '东京晴空塔 (Tokyo Skytree)',
            category: '景点',
            address: '1-1-2 Oshiage, Sumida City, Tokyo',
            openHours: '10:00 - 21:00',
            duration: '3小时',
            notes: '登上展望台俯瞰全东京，傍晚观赏落日',
            photoUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&auto=format&fit=crop&q=80',
            mapQuery: 'Tokyo Skytree'
          }
        ],
        transitBetween: [
          { fromIndex: 0, toIndex: 1, distance: '2.5 km', duration: '12 mins', transport: '东武晴空塔线', link: 'https://maps.google.com/?q=Asakusa+to+Tokyo+Skytree' }
        ]
      },
      {
        dayNum: 3,
        date: '2026-12-27',
        title: '筑地场外市场美食暴击 & 涩谷十字路口',
        weatherNote: '6°C 多云',
        stops: [
          {
            id: 's3-1',
            time: '09:00',
            name: '筑地场外市场 (Tsukiji Outer Market)',
            category: '美食',
            address: '4-16-2 Tsukiji, Chuo City, Tokyo',
            openHours: '05:00 - 14:00',
            duration: '2.5小时',
            notes: '必吃海鲜丼、玉子烧、草莓大福、烤扇贝',
            photoUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&auto=format&fit=crop&q=80',
            mapQuery: 'Tsukiji Outer Market'
          }
        ],
        transitBetween: []
      },
      {
        dayNum: 4,
        date: '2026-12-28',
        title: '新宿御苑漫步 & 歌舞伎町',
        weatherNote: '4°C 晴',
        stops: [
          {
            id: 's4-1',
            time: '10:00',
            name: '新宿御苑 (Shinjuku Gyoen)',
            category: '景点',
            address: '11 Naitomachi, Shinjuku City, Tokyo',
            openHours: '09:00 - 16:30',
            duration: '2小时',
            notes: '欣赏冬日庭园雪景，空气清新',
            photoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
            mapQuery: 'Shinjuku Gyoen National Garden'
          }
        ],
        transitBetween: []
      },
      {
        dayNum: 5,
        date: '2026-12-29',
        title: '表参道潮流买手店 & 成田机场返程',
        weatherNote: '5°C 晴',
        stops: [
          {
            id: 's5-1',
            time: '11:00',
            name: '表参道 (Omotesando)',
            category: '购物',
            address: 'Omotesando, Shibuya City, Tokyo',
            openHours: '11:00 - 20:00',
            duration: '3小时',
            notes: '建筑美学街区，最后采购伴手礼',
            photoUrl: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=600&auto=format&fit=crop&q=80',
            mapQuery: 'Omotesando Tokyo'
          }
        ],
        transitBetween: []
      }
    ],
    recommendations: [
      {
        id: 'r1',
        name: '鸟贵族 (Torikizoku Shinjuku)',
        category: '居酒屋',
        rating: '4.7',
        desc: '均一价优质日式烤鸡串连锁，氛围热闹，营业至深夜。',
        address: 'Shinjuku 3-Chome',
        photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
        mapQuery: 'Torikizoku Shinjuku'
      },
      {
        id: 'r2',
        name: 'Blue Bottle Coffee (清澄白河)',
        category: '精品咖啡',
        rating: '4.8',
        desc: '蓝瓶咖啡日本一号店，工业风空间，手冲咖啡香气浓郁。',
        address: 'Kiyosumi, Koto City',
        photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
        mapQuery: 'Blue Bottle Coffee Kiyosumi'
      }
    ],
    expenses: [
      { id: 'ex1', title: 'NEX 成田特快车票', category: '交通', amountLocal: 8000, currency: 'JPY', amountMYR: 232, paidBy: '我 (主理人)' },
      { id: 'ex2', title: '筑地市场海鲜早餐', category: '餐饮', amountLocal: 6500, currency: 'JPY', amountMYR: 188.5, paidBy: 'Aiden' },
      { id: 'ex3', title: '晴空塔门票', category: '门票', amountLocal: 12000, currency: 'JPY', amountMYR: 348, paidBy: 'Jing Yi' }
    ],
    memories: [
      {
        id: 'm1',
        title: '成田机场落地第一杯热抹茶',
        dayTag: 'Day 1',
        mood: '☕ 悠闲时光',
        author: '我 (主理人)',
        date: '2026-12-25',
        note: '虽然零下有些冷，但喝到热抹茶瞬间身心舒畅，开启东京之旅！',
        mediaUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
        mediaType: 'image',
        location: 'Narita Airport'
      },
      {
        id: 'm2',
        title: '浅草寺雷门前的合照',
        dayTag: 'Day 2',
        mood: '😍 超难忘瞬间',
        author: 'Aiden',
        date: '2026-12-26',
        note: '人潮虽然多，但红色巨型灯笼真的非常宏伟震撼！',
        mediaUrl: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&auto=format&fit=crop&q=80',
        mediaType: 'image',
        location: 'Senso-ji Temple'
      }
    ]
  }
];

export default function App() {
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [user, setUser] = useState(null);
  const [syncStatus, setSyncStatus] = useState('connecting'); // 'connecting' | 'synced' | 'offline'
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const [selectedTripId, setSelectedTripId] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('trip') || null;
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState('itinerary'); 
  const [activeDayNum, setActiveDayNum] = useState(1);

  // Modals
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [showEditTripModal, setShowEditTripModal] = useState(false);
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [editingDayInfo, setEditingDayInfo] = useState(null);
  const [showAddRecModal, setShowAddRecModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [showAddChecklistModal, setShowAddChecklistModal] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);

  const [toastMsg, setToastMsg] = useState('');
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);

  // Helper: Map WMO weather code to readable Chinese label
  const decodeWeatherCode = (code) => {
    if (code === 0) return '晴朗无云 ☀️';
    if ([1, 2, 3].includes(code)) return '晴间多云 ⛅';
    if ([45, 48].includes(code)) return '有雾/薄雾 🌫️';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '有雨/阵雨 🌧️';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return '降雪 ❄️';
    if ([95, 96, 99].includes(code)) return '雷阵雨 ⛈️';
    return '多云微风 🌤️';
  };

  // Helper: Generate smart outfit & essential gear from temperature & weather
  const generateSmartWeatherAdvice = (minTemp, maxTemp, hasRain, hasSnow) => {
    let outfitAdvice = '';
    let essentialGear = '护照、充电宝、转换插头';

    if (minTemp <= 5 || hasSnow) {
      outfitAdvice = `气温较低（${minTemp}°C ~ ${maxTemp}°C），建议采用“洋葱式穿法”：内搭保暖发热衣 + 毛衣/抓绒衣，外穿防风羽绒服或厚呢大衣，搭配围巾、手套与保暖袜。`;
      essentialGear = '暖宝宝贴、高保湿润唇膏/护手霜、防滑保暖鞋、保温水壶';
    } else if (minTemp <= 15) {
      outfitAdvice = `天气凉爽偏冷（${minTemp}°C ~ ${maxTemp}°C），建议长袖卫衣、针织衫搭配风衣、夹克或轻薄羽绒外套，早晚温差大注意添衣。`;
      essentialGear = '轻便折叠伞、保湿护肤品、舒适运动鞋、便携保温杯';
    } else if (maxTemp >= 28) {
      outfitAdvice = `天气炎热阳光充足（${minTemp}°C ~ ${maxTemp}°C），建议穿着透气吸汗的棉麻短袖、短裤或长裙，搭配轻薄防晒开衫。`;
      essentialGear = '高倍数防晒霜、太阳眼镜、遮阳帽、便携小风扇、晴雨两用伞';
    } else {
      outfitAdvice = `气候舒适宜人（${minTemp}°C ~ ${maxTemp}°C），建议长袖T恤、衬衫或薄外套搭配休闲长裤，方便白天活动与拍照。`;
      essentialGear = '折叠晴雨伞、舒适步行鞋、轻量外套、常用随身药品';
    }

    if (hasRain) {
      outfitAdvice += ' 预报显示行程期间可能有降雨，建议携带防水外套或耐脏鞋履。';
      essentialGear = '晴雨伞/轻便雨衣、防水鞋套、' + essentialGear;
    }

    return { outfitAdvice, essentialGear };
  };

  // Real-time Weather Fetch via Open-Meteo Geocoding + Forecast API
  const handleSyncRealtimeWeather = async (targetTrip = selectedTrip) => {
    if (!targetTrip) return;
    setIsFetchingWeather(true);
    try {
      // Extract clean city/region query (e.g., "日本 · 东京 (Tokyo)" -> "Tokyo" or "东京")
      const parenMatch = targetTrip.destination.match(/\(([^)]+)\)/);
      const rawCity = parenMatch
        ? parenMatch[1].trim()
        : targetTrip.destination.split(/[·\-/,，]/).pop().trim();

      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(rawCity)}&count=1&language=zh&format=json`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        triggerToast(`未找到「${rawCity}」的气象坐标，请尝试在目的地名称中加入英文城市名（如 Tokyo）`);
        setIsFetchingWeather(false);
        return;
      }

      const { latitude, longitude, name: resolvedName, country } = geoData.results[0];

      // Fetch up to 16-day real-time forecast from Open-Meteo
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=14`
      );
      const weatherData = await weatherRes.json();

      if (!weatherData.daily || !weatherData.daily.time) {
        throw new Error('Weather data unavailable');
      }

      const daily = weatherData.daily;
      const forecastList = daily.time.map((dateStr, idx) => ({
        date: dateStr,
        minTemp: Math.round(daily.temperature_2m_min[idx]),
        maxTemp: Math.round(daily.temperature_2m_max[idx]),
        code: daily.weathercode[idx],
        label: decodeWeatherCode(daily.weathercode[idx]),
        rainProb: daily.precipitation_probability_max?.[idx] ?? 0
      }));

      // Match trip dates if within the 14-day window, otherwise use the available upcoming forecast
      const matchedDays = forecastList.filter(
        (f) => f.date >= targetTrip.startDate && f.date <= targetTrip.endDate
      );
      const activeForecast = matchedDays.length > 0 ? matchedDays : forecastList.slice(0, 7);
      const isExactTripWindow = matchedDays.length > 0;

      const overallMin = Math.min(...activeForecast.map((d) => d.minTemp));
      const overallMax = Math.max(...activeForecast.map((d) => d.maxTemp));
      const hasRain = activeForecast.some((d) =>
        [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(d.code) || d.rainProb >= 50
      );
      const hasSnow = activeForecast.some((d) =>
        [71, 73, 75, 77, 85, 86].includes(d.code)
      );

      const { outfitAdvice, essentialGear } = generateSmartWeatherAdvice(
        overallMin,
        overallMax,
        hasRain,
        hasSnow
      );

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Update daily itinerary weather notes where dates match (or map sequentially)
      const updatedDays = (targetTrip.days || []).map((day, idx) => {
        const exactMatch = forecastList.find((f) => f.date === day.date);
        const fallbackMatch = activeForecast[idx % activeForecast.length];
        const chosen = exactMatch || fallbackMatch;
        if (!chosen) return day;
        return {
          ...day,
          weatherNote: `${chosen.minTemp}°C~${chosen.maxTemp}°C · ${chosen.label}`
        };
      });

      const updatedTrip = {
        ...targetTrip,
        days: updatedDays,
        weatherGuide: {
          ...targetTrip.weatherGuide,
          resolvedLocation: `${resolvedName}${country ? ` (${country})` : ''}`,
          tempRange: `${overallMin}°C ~ ${overallMax}°C`,
          condition: hasSnow ? 'snow' : hasRain ? 'rain' : 'sunny',
          outfitAdvice,
          essentialGear,
          lastUpdated: nowStr,
          isExactTripWindow,
          dailyForecast: activeForecast
        }
      };

      updateTrip(updatedTrip);
      triggerToast(`已同步 ${resolvedName} 实时天气预报！`);
    } catch (err) {
      console.error('Weather sync error:', err);
      triggerToast('实时天气抓取失败，请检查网络连接后重试');
    } finally {
      setIsFetchingWeather(false);
    }
  };

  // 1. Authenticate first for real-time cloud collaboration
  useEffect(() => {
    if (!auth) {
      setSyncStatus('offline');
      return;
    }
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Auth error:', err);
        setSyncStatus('offline');
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore listener so all companions see live edits immediately
  useEffect(() => {
    if (!user || !db) return;

    const tripsColRef = collection(db, 'artifacts', appId, 'public', 'data', 'trips');
    const unsubscribe = onSnapshot(
      tripsColRef,
      async (snapshot) => {
        if (snapshot.empty) {
          // Seed initial sample trip once if cloud database is empty
          for (const sample of INITIAL_TRIPS) {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'trips', sample.id), sample);
          }
          setTrips(INITIAL_TRIPS);
        } else {
          const loadedTrips = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
          loadedTrips.sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
          setTrips(loadedTrips);
        }
        setSyncStatus('synced');
      },
      (err) => {
        console.error('Real-time sync error:', err);
        setSyncStatus('offline');
      }
    );

    return () => unsubscribe();
  }, [user]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const selectedTrip = trips.find((t) => t.id === selectedTripId) || null;

  const getDaysCountdown = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diff = Math.round((start - now) / (1000 * 60 * 60 * 24));
    if (diff > 0) return `距离出发还有 ${diff} 天`;
    if (diff === 0) return '今天出发！';
    return `已出发 ${Math.abs(diff)} 天`;
  };

  const updateTrip = async (updatedTrip) => {
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
    if (user && db) {
      try {
        setSyncStatus('connecting');
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'trips', updatedTrip.id), updatedTrip);
        setSyncStatus('synced');
      } catch (err) {
        console.error('Cloud update error:', err);
        setSyncStatus('offline');
      }
    }
  };

  const handleShareTripLink = async () => {
    try {
      const shareUrl = new URL(window.location.href);
      if (selectedTrip) {
        shareUrl.searchParams.set('trip', selectedTrip.id);
      } else {
        shareUrl.searchParams.delete('trip');
      }
      await navigator.clipboard.writeText(shareUrl.toString());
      setCopiedShareLink(true);
      triggerToast('已复制实时同行分享链接！发给同行人即可同步查看与编辑');
      setTimeout(() => setCopiedShareLink(false), 3000);
    } catch {
      triggerToast('请直接复制浏览器顶部网址分享给同行人');
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    const destination = form.destination.value.trim();
    const startDate = form.startDate.value;
    const endDate = form.endDate.value;
    const currency = form.currency.value;
    const budgetMYR = Number(form.budgetMYR.value) || 3000;
    const companionsRaw = form.companions.value.trim();
    const companions = companionsRaw
      ? companionsRaw.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
      : ['我 (主理人)'];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.max(1, Math.min(14, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1));

    const generatedDays = Array.from({ length: diffDays }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        dayNum: i + 1,
        date: d.toISOString().slice(0, 10),
        title: `第 ${i + 1} 天精彩行程`,
        weatherNote: '气温舒适，晴朗',
        stops: [],
        transitBetween: []
      };
    });

    const newTrip = {
      id: `trip-${Date.now()}`,
      title,
      destination,
      startDate,
      endDate,
      status: 'upcoming',
      currency,
      budgetMYR,
      companions,
      coverGradient: 'from-amber-800 via-stone-800 to-amber-950',
      flights: [],
      hotels: [],
      weatherGuide: {
        tempRange: '20°C ~ 28°C',
        condition: 'sunny',
        outfitAdvice: '建议穿着透气舒适服装与好走的运动鞋。',
        essentialGear: '充电宝、雨伞、防晒霜'
      },
      checklist: [
        { id: `ck-${Date.now()}-1`, category: '证件与金融', text: '马来西亚护照 (有效期6个月以上)', checked: true }
      ],
      days: generatedDays,
      recommendations: [],
      expenses: [],
      memories: []
    };

    setTrips((prev) => [newTrip, ...prev]);
    if (user && db) {
      try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'trips', newTrip.id), newTrip);
      } catch (err) {
        console.error('Cloud create error:', err);
      }
    }
    setSelectedTripId(newTrip.id);
    setActiveTab('itinerary');
    setActiveDayNum(1);
    setShowNewTripModal(false);
    triggerToast('新旅程创建成功！');
  };

  const handleEditTrip = (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    const form = e.target;
    const title = form.title.value.trim();
    const destination = form.destination.value.trim();
    const startDate = form.startDate.value;
    const endDate = form.endDate.value;
    const currency = form.currency.value;
    const budgetMYR = Number(form.budgetMYR.value) || selectedTrip.budgetMYR;
    const companionsRaw = form.companions.value.trim();
    const companions = companionsRaw
      ? companionsRaw.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
      : selectedTrip.companions;

    const updated = {
      ...selectedTrip,
      title,
      destination,
      startDate,
      endDate,
      currency,
      budgetMYR,
      companions
    };
    updateTrip(updated);
    setShowEditTripModal(false);
    triggerToast('旅程资料已同步更新！');
  };

  const handleDeleteTrip = async (tripId, e) => {
    if (e) e.stopPropagation();
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (selectedTripId === tripId) setSelectedTripId(null);
    if (user && db) {
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'trips', tripId));
      } catch (err) {
        console.error('Cloud delete error:', err);
      }
    }
    triggerToast('已从云端彻底删除该旅程');
  };

  const handleToggleTripStatus = (trip, e) => {
    if (e) e.stopPropagation();
    const nextStatus = trip.status === 'upcoming' ? 'past' : 'upcoming';
    updateTrip({ ...trip, status: nextStatus });
    triggerToast(nextStatus === 'past' ? '旅程已归档至已结束' : '旅程已恢复为来临计划');
  };

  const handleAddStop = (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    const form = e.target;
    const time = form.time.value;
    const name = form.name.value.trim();
    const category = form.category.value;
    const address = form.address.value.trim();
    const openHours = form.openHours.value.trim();
    const duration = form.duration.value.trim();
    const notes = form.notes.value.trim();
    const photoUrl = form.photoUrl.value.trim();

    const newStop = {
      id: `stop-${Date.now()}`,
      time,
      name,
      category,
      address,
      openHours: openHours || '全天开放',
      duration: duration || '1-2小时',
      notes,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80',
      mapQuery: name
    };

    const updatedDays = selectedTrip.days.map((day) => {
      if (day.dayNum === activeDayNum) {
        return {
          ...day,
          stops: [...day.stops, newStop]
        };
      }
      return day;
    });

    updateTrip({ ...selectedTrip, days: updatedDays });
    setShowAddStopModal(false);
    form.reset();
    triggerToast('新景点/行程已添加！');
  };

  const handleEditStop = (e) => {
    e.preventDefault();
    if (!selectedTrip || !editingStop) return;
    const form = e.target;
    const time = form.time.value;
    const name = form.name.value.trim();
    const category = form.category.value;
    const address = form.address.value.trim();
    const openHours = form.openHours.value.trim();
    const duration = form.duration.value.trim();
    const notes = form.notes.value.trim();
    const photoUrl = form.photoUrl.value.trim();

    const updatedDays = selectedTrip.days.map((day) => {
      if (day.dayNum === activeDayNum) {
        return {
          ...day,
          stops: day.stops.map((s) =>
            s.id === editingStop.id
              ? {
                  ...s,
                  time,
                  name,
                  category,
                  address,
                  openHours: openHours || '全天开放',
                  duration: duration || '1-2小时',
                  notes,
                  photoUrl: photoUrl || s.photoUrl,
                  mapQuery: name
                }
              : s
          )
        };
      }
      return day;
    });

    updateTrip({ ...selectedTrip, days: updatedDays });
    setEditingStop(null);
    triggerToast('行程点内容已更新！');
  };

  const handleEditDayInfo = (e) => {
    e.preventDefault();
    if (!selectedTrip || !editingDayInfo) return;
    const form = e.target;
    const title = form.title.value.trim();
    const weatherNote = form.weatherNote.value.trim();

    const updatedDays = selectedTrip.days.map((day) =>
      day.dayNum === editingDayInfo.dayNum
        ? { ...day, title: title || day.title, weatherNote: weatherNote || day.weatherNote }
        : day
    );

    updateTrip({ ...selectedTrip, days: updatedDays });
    setEditingDayInfo(null);
    triggerToast('当天主题与天气备注已更新！');
  };

  const handleDeleteStop = (dayNum, stopId) => {
    if (!selectedTrip) return;
    const updatedDays = selectedTrip.days.map((day) => {
      if (day.dayNum === dayNum) {
        return {
          ...day,
          stops: day.stops.filter((s) => s.id !== stopId)
        };
      }
      return day;
    });
    updateTrip({ ...selectedTrip, days: updatedDays });
    triggerToast('已删除该行程点');
  };

  const handleAddRecommendation = (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    const form = e.target;
    const name = form.name.value.trim();
    const category = form.category.value;
    const rating = form.rating.value;
    const desc = form.desc.value.trim();
    const address = form.address.value.trim();
    const photoUrl = form.photoUrl.value.trim();

    const newRec = {
      id: `rec-${Date.now()}`,
      name,
      category,
      rating,
      desc,
      address,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
      mapQuery: name
    };

    updateTrip({
      ...selectedTrip,
      recommendations: [...(selectedTrip.recommendations || []), newRec]
    });
    setShowAddRecModal(false);
    form.reset();
    triggerToast('已添加备选推荐！');
  };

  const handleDeleteRecommendation = (recId) => {
    if (!selectedTrip) return;
    updateTrip({
      ...selectedTrip,
      recommendations: selectedTrip.recommendations.filter((r) => r.id !== recId)
    });
    triggerToast('已删除该推荐项');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    const form = e.target;
    const title = form.title.value.trim();
    const category = form.category.value;
    const amountLocal = Number(form.amountLocal.value) || 0;
    const paidBy = form.paidBy.value;

    const rate = CURRENCY_RATES_TO_MYR[selectedTrip.currency] || 1.0;
    const amountMYR = Number((amountLocal * rate).toFixed(2));

    const newExp = {
      id: `exp-${Date.now()}`,
      title,
      category,
      amountLocal,
      currency: selectedTrip.currency,
      amountMYR,
      paidBy
    };

    updateTrip({
      ...selectedTrip,
      expenses: [newExp, ...(selectedTrip.expenses || [])]
    });
    setShowAddExpenseModal(false);
    form.reset();
    triggerToast('记账添加成功！');
  };

  const handleDeleteExpense = (expId) => {
    if (!selectedTrip) return;
    updateTrip({
      ...selectedTrip,
      expenses: selectedTrip.expenses.filter((e) => e.id !== expId)
    });
    triggerToast('已删除该笔开销');
  };

  const handleEditExpense = (e) => {
    e.preventDefault();
    if (!selectedTrip || !editingExpense) return;
    const form = e.target;
    const title = form.title.value.trim();
    const category = form.category.value;
    const amountLocal = Number(form.amountLocal.value) || 0;
    const paidBy = form.paidBy.value;

    const rate = CURRENCY_RATES_TO_MYR[selectedTrip.currency] || 1.0;
    const amountMYR = Number((amountLocal * rate).toFixed(2));

    updateTrip({
      ...selectedTrip,
      expenses: selectedTrip.expenses.map((exp) =>
        exp.id === editingExpense.id
          ? { ...exp, title, category, amountLocal, amountMYR, paidBy }
          : exp
      )
    });
    setEditingExpense(null);
    triggerToast('记账记录已更新！');
  };

  const handleSaveFlight = (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    const form = e.target;
    const flightData = {
      id: editingFlight ? editingFlight.id : `f-${Date.now()}`,
      type: form.type.value,
      flightNo: form.flightNo.value.trim(),
      route: form.route.value.trim(),
      time: form.time.value.trim(),
      seat: form.seat.value.trim(),
      pnr: form.pnr.value.trim(),
      terminal: form.terminal.value.trim()
    };

    const updatedFlights = editingFlight
      ? (selectedTrip.flights || []).map((f) => (f.id === editingFlight.id ? flightData : f))
      : [...(selectedTrip.flights || []), flightData];

    updateTrip({ ...selectedTrip, flights: updatedFlights });
    setShowFlightModal(false);
    setEditingFlight(null);
    triggerToast(editingFlight ? '航班信息已更新！' : '新航班已添加！');
  };

  const handleDeleteFlight = (flightId) => {
    if (!selectedTrip) return;
    updateTrip({
      ...selectedTrip,
      flights: (selectedTrip.flights || []).filter((f) => f.id !== flightId)
    });
    triggerToast('已删除该航班');
  };

  const handleSaveHotel = (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    const form = e.target;
    const name = form.name.value.trim();
    const hotelData = {
      id: editingHotel ? editingHotel.id : `h-${Date.now()}`,
      name,
      address: form.address.value.trim(),
      checkIn: form.checkIn.value,
      checkOut: form.checkOut.value,
      contact: form.contact.value.trim(),
      mapQuery: name
    };

    const updatedHotels = editingHotel
      ? (selectedTrip.hotels || []).map((h) => (h.id === editingHotel.id ? hotelData : h))
      : [...(selectedTrip.hotels || []), hotelData];

    updateTrip({ ...selectedTrip, hotels: updatedHotels });
    setShowHotelModal(false);
    setEditingHotel(null);
    triggerToast(editingHotel ? '酒店信息已更新！' : '新酒店已添加！');
  };

  const handleDeleteHotel = (hotelId) => {
    if (!selectedTrip) return;
    updateTrip({
      ...selectedTrip,
      hotels: (selectedTrip.hotels || []).filter((h) => h.id !== hotelId)
    });
    triggerToast('已删除该酒店');
  };

  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    const form = e.target;
    const title = form.title.value.trim();
    const dayTag = form.dayTag.value;
    const mood = form.mood.value;
    const author = form.author.value;
    const note = form.note.value.trim();
    const mediaUrl = form.mediaUrl.value.trim();
    const location = form.location.value.trim();

    const newMem = {
      id: `mem-${Date.now()}`,
      title,
      dayTag,
      mood,
      author,
      date: new Date().toISOString().slice(0, 10),
      note,
      mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
      mediaType: 'image',
      location
    };

    updateTrip({
      ...selectedTrip,
      memories: [newMem, ...(selectedTrip.memories || [])]
    });
    setShowAddMemoryModal(false);
    form.reset();
    triggerToast('旅途回忆上传成功！');
  };

  const handleDeleteMemory = (memId) => {
    if (!selectedTrip) return;
    updateTrip({
      ...selectedTrip,
      memories: selectedTrip.memories.filter((m) => m.id !== memId)
    });
    triggerToast('已删除该回忆');
  };

  const handleToggleChecklist = (itemId) => {
    if (!selectedTrip) return;
    const updated = selectedTrip.checklist.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    updateTrip({ ...selectedTrip, checklist: updated });
  };

  const handleAddChecklistItem = (e) => {
    e.preventDefault();
    if (!selectedTrip) return;
    const form = e.target;
    const category = form.category.value;
    const text = form.text.value.trim();
    if (!text) return;

    const newItem = {
      id: `ck-${Date.now()}`,
      category,
      text,
      checked: false
    };

    updateTrip({
      ...selectedTrip,
      checklist: [...selectedTrip.checklist, newItem]
    });
    setShowAddChecklistModal(false);
    form.reset();
    triggerToast('已加入清单');
  };

  const handlePrintPDF = () => {
    if (!selectedTrip) return;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert('弹出窗口被浏览器拦截，请允许弹窗或直接使用浏览器自带的列印功能 (Ctrl+P / Cmd+P)。');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${selectedTrip.destination} - Travel with Me</title>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #2C2622; padding: 40px; line-height: 1.5; background: #fff; }
          h1, h2, h3 { color: #2C2622; }
          .header { border-bottom: 3px solid #78350f; padding-bottom: 20px; margin-bottom: 30px; }
          .badge { background: #fef3c7; color: #78350f; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 8px; }
          .section { margin-bottom: 40px; page-break-inside: avoid; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
          th, td { border: 1px solid #d6d3d1; padding: 10px 12px; font-size: 13px; text-align: left; }
          th { background: #f5f2ec; color: #44403c; }
          .day-box { background: #faf8f5; border: 1px solid #e7e5e4; border-radius: 12px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid; }
          .stop-item { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #d6d3d1; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <span class="badge">${selectedTrip.startDate} ~ ${selectedTrip.endDate}</span>
          <h1>${selectedTrip.title}</h1>
          <p>目的地：<strong>${selectedTrip.destination}</strong> &nbsp;|&nbsp; 同行人：${selectedTrip.companions?.join('、')}</p>
          <p>总预算：RM ${selectedTrip.budgetMYR?.toLocaleString()} &nbsp;|&nbsp; 当地币种：${selectedTrip.currency}</p>
        </div>

        <div class="section">
          <h2>✈️ 航班与酒店资讯</h2>
          <table>
            <tr><th>类别</th><th>班次 / 名称</th><th>航线 / 地址</th><th>时间 / 日期</th><th>座位 / PNR / 联络</th></tr>
            ${selectedTrip.flights?.map(f => `<tr><td>去/回程</td><td>${f.flightNo} (${f.type})</td><td>${f.route}</td><td>${f.time}</td><td>座: ${f.seat} / PNR: ${f.pnr}</td></tr>`).join('') || ''}
            ${selectedTrip.hotels?.map(h => `<tr><td>酒店住宿</td><td>${h.name}</td><td>${h.address}</td><td>入住: ${h.checkIn}<br>退房: ${h.checkOut}</td><td>电: ${h.contact}</td></tr>`).join('') || ''}
          </table>
        </div>

        <div class="section">
          <h2>🎒 气温与穿搭指南</h2>
          <p><strong>预估气温：</strong>${selectedTrip.weatherGuide?.tempRange}</p>
          <p><strong>穿搭建议：</strong>${selectedTrip.weatherGuide?.outfitAdvice}</p>
          <p><strong>应备物品：</strong>${selectedTrip.weatherGuide?.essentialGear}</p>
        </div>

        <div class="section">
          <h2>📅 每日行程规划</h2>
          ${selectedTrip.days?.map(day => `
            <div class="day-box">
              <h3>Day ${day.dayNum} (${day.date})：${day.title}</h3>
              <p style="font-size: 12px; color: #78716c; margin-bottom: 12px;">天气/备注：${day.weatherNote}</p>
              ${day.stops?.map(stop => `
                <div class="stop-item">
                  <strong>[${stop.time}] ${stop.name}</strong> (${stop.category})<br>
                  <span style="font-size: 12px; color: #57534e;">📍 ${stop.address} &nbsp;|&nbsp; ⏱️ 停留: ${stop.duration} &nbsp;|&nbsp; 🕒 开放: ${stop.openHours}</span>
                  ${stop.notes ? `<br><em style="font-size: 12px; color: #78350f;">💡 ${stop.notes}</em>` : ''}
                </div>
              `).join('') || '<p>当天暂无行程点</p>'}
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>💰 旅行记账总览 (MYR)</h2>
          <table>
            <tr><th>项目</th><th>分类</th><th>当地金额</th><th>折算 MYR</th><th>付款人</th></tr>
            ${selectedTrip.expenses?.map(e => `<tr><td>${e.title}</td><td>${e.category}</td><td>${e.currency} ${e.amountLocal}</td><td>RM ${e.amountMYR?.toFixed(2)}</td><td>${e.paidBy}</td></tr>`).join('') || '<tr><td colspan="5">暂无记账</td></tr>'}
          </table>
        </div>

        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const upcomingTrips = trips.filter((t) => t.status === 'upcoming');
  const pastTrips = trips.filter((t) => t.status === 'past');

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2622] font-sans selection:bg-[#E7D7C1] selection:text-[#5C4033]">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#4A3B32] text-[#FDFBF7] px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 border border-[#6B564B] animate-bounce">
          <Sparkles className="w-5 h-5 text-[#E7D7C1]" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE3DC] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setSelectedTripId(null)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#78350f] to-[#451a03] flex items-center justify-center text-white shadow-md">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-[#44403C]">Travel with Me</h1>
              <span
                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  syncStatus === 'synced'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : syncStatus === 'connecting'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-stone-100 text-stone-500 border border-stone-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    syncStatus === 'synced'
                      ? 'bg-emerald-500 animate-pulse'
                      : syncStatus === 'connecting'
                      ? 'bg-amber-500 animate-ping'
                      : 'bg-stone-400'
                  }`}
                />
                <span>{syncStatus === 'synced' ? '云端实时同步中' : syncStatus === 'connecting' ? '同步中...' : '离线模式'}</span>
              </span>
            </div>
            <p className="text-xs text-[#8C827A]">你的优雅私人旅行手账 & 实时同行助手</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleShareTripLink}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold flex items-center space-x-1.5 transition"
          >
            {copiedShareLink ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedShareLink ? '已复制链接' : '分享同行链接'}</span>
          </button>
          {selectedTrip ? (
            <>
              <button
                onClick={() => setShowEditTripModal(true)}
                className="px-3.5 py-2 rounded-xl border border-[#D6CFC7] text-[#5C554E] hover:bg-[#F5F0EB] text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">编辑旅程</span>
              </button>
              <button
                onClick={handlePrintPDF}
                className="px-3.5 py-2 rounded-xl bg-[#78350f] text-white hover:bg-[#451a03] text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>导出手账 PDF</span>
              </button>
              <button
                onClick={() => setSelectedTripId(null)}
                className="px-3.5 py-2 rounded-xl bg-[#EFECE6] text-[#5C554E] hover:bg-[#E7E2DA] text-xs font-semibold transition"
              >
                返回首页
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowNewTripModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#78350f] text-white hover:bg-[#451a03] text-xs font-bold flex items-center space-x-2 shadow-md transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ 创建新旅程</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        {!selectedTrip ? (
          /* HOME SCREEN: DASHBOARD */
          <div className="space-y-10">
            {/* Hero Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-[#5C4033] via-[#78350f] to-[#3D2817] text-white p-8 sm:p-12 overflow-hidden shadow-xl">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="relative z-10 max-w-2xl space-y-4">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-[#FDFBF7] border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>定制您的下一场完美冒险</span>
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">带着热情与手账，去探索世界吧。</h2>
                <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
                  轻松规划每日行程、管理同行多币种开销、记录沿途回忆，并一键分享给同行好友。
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setShowNewTripModal(true)}
                    className="px-6 py-3 rounded-2xl bg-[#FDFBF7] text-[#451a03] font-bold text-sm hover:bg-stone-100 shadow-lg transition flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>立即规划新旅程</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Trips Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Plane className="w-5 h-5 text-[#78350f]" />
                  <h3 className="text-xl font-bold text-[#44403C]">来临的旅行计划</h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#EFECE6] text-[#78716C] font-semibold">
                  {upcomingTrips.length} 个计划中
                </span>
              </div>

              {upcomingTrips.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE3DC] shadow-sm">
                  <Compass className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500 font-medium">目前没有来临的旅程，点击上方开始规划吧！</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingTrips.map((trip) => {
                    const countdownText = getDaysCountdown(trip.startDate);
                    return (
                      <div
                        key={trip.id}
                        onClick={() => setSelectedTripId(trip.id)}
                        className="group relative bg-white rounded-3xl p-7 border border-[#EAE3DC] hover:border-[#78350f]/40 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>

                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <span className="px-3 py-1 rounded-full bg-[#F5F0EB] text-[#78350f] text-xs font-bold">
                              {trip.startDate} ~ {trip.endDate}
                            </span>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                              <button
                                title="归档为已结束"
                                onClick={(e) => handleToggleTripStatus(trip, e)}
                                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                title="删除旅程"
                                onClick={(e) => handleDeleteTrip(trip.id, e)}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xl font-bold text-[#2C2622] group-hover:text-[#78350f] transition">
                              {trip.destination}
                            </h4>
                            <p className="text-xs text-stone-500 mt-0.5">{trip.title}</p>
                          </div>

                          {/* Large Progress-Bar Style Countdown Badge */}
                          <div className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-50 to-stone-100 border border-amber-200/50 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-amber-700 animate-pulse" />
                              <span className="text-sm font-extrabold text-amber-900">{countdownText}</span>
                            </div>
                            <span className="text-xs font-semibold text-stone-500">{trip.companions?.length || 1} 人同行</span>
                          </div>
                        </div>

                        <div className="pt-5 mt-5 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-xs text-stone-400 font-medium">预算: RM {trip.budgetMYR?.toLocaleString()}</span>
                          <span className="text-xs font-bold text-[#78350f] flex items-center space-x-1 group-hover:translate-x-1 transition">
                            <span>进入手账</span>
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Past Trips Section */}
            {pastTrips.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-[#EAE3DC]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-stone-500" />
                    <h3 className="text-xl font-bold text-[#44403C]">已结束的旅程与回忆</h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#EFECE6] text-[#78716C] font-semibold">
                    {pastTrips.length} 个回忆
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastTrips.map((trip) => (
                    <div
                      key={trip.id}
                      onClick={() => setSelectedTripId(trip.id)}
                      className="group bg-white rounded-3xl p-6 border border-[#EAE3DC] opacity-85 hover:opacity-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs">
                            {trip.startDate} (已完成)
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              title="恢复为来临计划"
                              onClick={(e) => handleToggleTripStatus(trip, e)}
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs"
                            >
                              恢复
                            </button>
                            <button
                              title="删除旅程"
                              onClick={(e) => handleDeleteTrip(trip.id, e)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                        <h4 className="text-lg font-bold text-stone-700">{trip.destination}</h4>
                        <p className="text-xs text-stone-500">{trip.title}</p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                        <span>{trip.memories?.length || 0} 个旅途回忆</span>
                        <span className="text-[#78350f] font-semibold group-hover:translate-x-1 transition flex items-center space-x-1">
                          <span>查看回忆录</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* TRIP WORKSPACE */
          <div className="space-y-8">
            {/* Trip Header Banner */}
            <div className={`rounded-3xl bg-gradient-to-r ${selectedTrip.coverGradient || 'from-amber-800 via-stone-800 to-amber-950'} text-white p-8 sm:p-10 shadow-xl relative overflow-hidden`}>
              <div className="absolute right-0 bottom-0 opacity-10 p-8 pointer-events-none">
                <Compass className="w-64 h-64" />
              </div>
              <div className="relative z-10 space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
                    {selectedTrip.startDate} ~ {selectedTrip.endDate}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold">
                    币种: {selectedTrip.currency}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-stone-900/30 text-stone-200 text-xs font-semibold">
                    预算: RM {selectedTrip.budgetMYR?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{selectedTrip.destination}</h2>
                  <p className="text-sm text-stone-200 mt-1">{selectedTrip.title}</p>
                </div>
                <div className="flex items-center space-x-4 pt-2 text-xs text-stone-300">
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-amber-300" />
                    <span>同行人: {selectedTrip.companions?.join('、')}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#EAE3DC]">
              {[
                { id: 'itinerary', label: '每日行程 & 交通', icon: Calendar },
                { id: 'flights', label: '航班与酒店', icon: Plane },
                { id: 'weather', label: '天气与行李', icon: CloudSun },
                { id: 'recommendations', label: '附近推荐', icon: Compass },
                { id: 'expenses', label: '旅行记账 (MYR)', icon: DollarSign },
                { id: 'memories', label: '旅途回忆', icon: Camera }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#78350f] text-white shadow-md'
                        : 'bg-white text-[#6B5E55] hover:bg-[#F5F0EB] border border-[#EAE3DC]'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: 1. ITINERARY */}
            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                {/* Day Selector Tabs */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                  {selectedTrip.days?.map((day) => {
                    const isDayActive = activeDayNum === day.dayNum;
                    return (
                      <button
                        key={day.dayNum}
                        onClick={() => setActiveDayNum(day.dayNum)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
                          isDayActive
                            ? 'bg-[#4A3B32] text-white shadow'
                            : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span>Day {day.dayNum}</span>
                        <span className="text-[10px] opacity-75">({day.date})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Day Content */}
                {selectedTrip.days
                  .filter((d) => d.dayNum === activeDayNum)
                  .map((day) => (
                    <div key={day.dayNum} className="space-y-6">
                      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3DC] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-[#78350f] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50">
                              Day {day.dayNum} · {day.date}
                            </span>
                            <button
                              onClick={() => setEditingDayInfo(day)}
                              className="text-xs text-stone-400 hover:text-[#78350f] flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-stone-100 transition"
                              title="编辑当天主题与天气"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>编辑主题</span>
                            </button>
                          </div>
                          <h3 className="text-xl font-bold text-[#2C2622] mt-2">{day.title}</h3>
                          <p className="text-xs text-stone-500 mt-0.5 flex items-center space-x-1">
                            <CloudSun className="w-3.5 h-3.5 text-amber-600" />
                            <span>天气速览：{day.weatherNote}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => setShowAddStopModal(true)}
                          className="px-4 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow transition flex items-center justify-center space-x-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ 添加当天行程点</span>
                        </button>
                      </div>

                      {/* Stops Timeline */}
                      {(!day.stops || day.stops.length === 0) ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE3DC]">
                          <MapPin className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                          <p className="text-stone-500 text-sm font-medium">这一天还没有添加行程点，快来规划吧！</p>
                        </div>
                      ) : (
                        <div className="space-y-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#EAE3DC]">
                          {day.stops.map((stop, sIdx) => {
                            const transit = day.transitBetween?.find((t) => t.fromIndex === sIdx);
                            return (
                              <div key={stop.id} className="relative pl-14">
                                <div className="absolute left-3 top-3 w-6 h-6 rounded-full bg-[#78350f] text-white flex items-center justify-center text-xs font-bold shadow">
                                  {sIdx + 1}
                                </div>

                                <div className="bg-white rounded-3xl border border-[#EAE3DC] p-6 shadow-sm hover:shadow-md transition space-y-4">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-bold">
                                        {stop.time}
                                      </span>
                                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-[#78350f] text-xs font-semibold">
                                        {stop.category}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-3 self-start sm:self-auto">
                                      <button
                                        onClick={() => setEditingStop(stop)}
                                        className="text-stone-500 hover:text-[#78350f] transition text-xs font-semibold flex items-center space-x-1"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>编辑</span>
                                      </button>
                                      <button
                                        onClick={() => handleDeleteStop(day.dayNum, stop.id)}
                                        className="text-stone-400 hover:text-rose-600 transition text-xs flex items-center space-x-1"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>删除</span>
                                      </button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                    <div className="md:col-span-2 space-y-2">
                                      <h4 className="text-lg font-bold text-[#2C2622]">{stop.name}</h4>
                                      <p className="text-xs text-stone-500 flex items-center space-x-1">
                                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                        <span>{stop.address}</span>
                                      </p>
                                      <div className="flex flex-wrap gap-4 text-xs text-stone-600 pt-1">
                                        <span className="flex items-center space-x-1">
                                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                                          <span>开放: {stop.openHours}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                          <span>建议停留: {stop.duration}</span>
                                        </span>
                                      </div>
                                      {stop.notes && (
                                        <p className="text-xs text-[#78350f] bg-amber-50/70 p-3 rounded-xl border border-amber-200/50 mt-2">
                                          💡 备注：{stop.notes}
                                        </p>
                                      )}
                                      <div className="pt-2">
                                        <a
                                          href={`https://maps.google.com/?q=${encodeURIComponent(stop.mapQuery || stop.name)}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center space-x-1 text-xs font-bold text-[#78350f] hover:underline"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />
                                          <span>Google Maps 导航</span>
                                        </a>
                                      </div>
                                    </div>

                                    {stop.photoUrl && (
                                      <div className="overflow-hidden rounded-2xl h-36 border border-stone-200 shadow-inner">
                                        <img src={stop.photoUrl} alt={stop.name} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Transit Card between stops */}
                                {transit && (
                                  <div className="my-4 ml-6 p-4 rounded-2xl bg-[#F5F0EB] border border-[#E7E2DA] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-700 gap-3">
                                    <div className="flex items-center space-x-2 font-medium">
                                      <Navigation className="w-4 h-4 text-[#78350f]" />
                                      <span>推荐交通：<strong>{transit.transport}</strong>（距离约 {transit.distance}，耗时约 {transit.duration}）</span>
                                    </div>
                                    <a
                                      href={transit.link || '#'}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-3 py-1.5 rounded-xl bg-white text-[#78350f] font-bold border border-stone-200 hover:bg-stone-50 shadow-sm transition flex items-center space-x-1"
                                    >
                                      <span>查看路线</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* TAB CONTENT: 2. FLIGHTS & HOTELS */}
            {activeTab === 'flights' && (
              <div className="space-y-8">
                <div className="bg-white rounded-3xl p-8 border border-[#EAE3DC] shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Plane className="w-5 h-5 text-[#78350f]" />
                      <h3 className="text-xl font-bold text-[#44403C]">航班班次信息</h3>
                    </div>
                    <button
                      onClick={() => {
                        setEditingFlight(null);
                        setShowFlightModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] transition flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ 添加航班</span>
                    </button>
                  </div>

                  {(!selectedTrip.flights || selectedTrip.flights.length === 0) ? (
                    <p className="text-center py-8 text-xs text-stone-400">暂无航班信息，点击右上角添加</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedTrip.flights.map((f) => (
                        <div key={f.id} className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E2DA] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-[#78350f] text-white text-xs font-bold">{f.type}航班</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-stone-600">{f.flightNo}</span>
                              <button
                                onClick={() => {
                                  setEditingFlight(f);
                                  setShowFlightModal(true);
                                }}
                                className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-500 hover:text-[#78350f] transition"
                                title="编辑航班"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteFlight(f.id)}
                                className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-400 hover:text-rose-600 transition"
                                title="删除航班"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <h4 className="text-lg font-bold text-[#2C2622]">{f.route}</h4>
                          <p className="text-xs text-stone-600 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>时间：{f.time}</span>
                          </p>
                          <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs text-stone-500">
                            <span>座位号: <strong>{f.seat || '未选'}</strong></span>
                            <span>PNR: <strong>{f.pnr || 'N/A'}</strong></span>
                            <span>航站楼: <strong>{f.terminal || 'T1'}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-3xl p-8 border border-[#EAE3DC] shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BedDouble className="w-5 h-5 text-[#78350f]" />
                      <h3 className="text-xl font-bold text-[#44403C]">酒店住宿资讯</h3>
                    </div>
                    <button
                      onClick={() => {
                        setEditingHotel(null);
                        setShowHotelModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] transition flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ 添加酒店</span>
                    </button>
                  </div>

                  {(!selectedTrip.hotels || selectedTrip.hotels.length === 0) ? (
                    <p className="text-center py-8 text-xs text-stone-400">暂无酒店住宿信息，点击右上角添加</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedTrip.hotels.map((h) => (
                        <div key={h.id} className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E2DA] space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-lg font-bold text-[#2C2622]">{h.name}</h4>
                            <div className="flex items-center space-x-1.5 flex-shrink-0">
                              <button
                                onClick={() => {
                                  setEditingHotel(h);
                                  setShowHotelModal(true);
                                }}
                                className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-500 hover:text-[#78350f] transition"
                                title="编辑酒店"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteHotel(h.id)}
                                className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-400 hover:text-rose-600 transition"
                                title="删除酒店"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-stone-600 flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            <span>{h.address}</span>
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-stone-600">
                            <span>入住: <strong>{h.checkIn}</strong></span>
                            <span>退房: <strong>{h.checkOut}</strong></span>
                          </div>
                          <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                            <span className="text-stone-500">电话: {h.contact || '无'}</span>
                            <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(h.mapQuery || h.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-[#78350f] hover:underline flex items-center space-x-1"
                            >
                              <span>导航至酒店</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3. WEATHER & CHECKLIST */}
            {activeTab === 'weather' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Weather Guide */}
                <div className="lg:col-span-1 bg-white rounded-3xl p-8 border border-[#EAE3DC] shadow-sm space-y-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <CloudSun className="w-5 h-5 text-[#78350f]" />
                      <h3 className="text-xl font-bold text-[#44403C]">天气与穿搭指南</h3>
                    </div>
                    <button
                      onClick={() => handleSyncRealtimeWeather(selectedTrip)}
                      disabled={isFetchingWeather}
                      className="px-3 py-1.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] disabled:opacity-60 transition flex items-center space-x-1 shadow-sm"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isFetchingWeather ? 'animate-spin' : ''}`} />
                      <span>{isFetchingWeather ? '同步中...' : '同步实时天气'}</span>
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs text-stone-500">
                          {selectedTrip.weatherGuide?.resolvedLocation
                            ? `${selectedTrip.weatherGuide.resolvedLocation} 实时预报气温`
                            : '预估当地气温'}
                        </span>
                        <p className="text-2xl font-black text-[#78350f] mt-0.5">{selectedTrip.weatherGuide?.tempRange || '20°C ~ 28°C'}</p>
                      </div>
                      {selectedTrip.weatherGuide?.lastUpdated && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                          已更新 {selectedTrip.weatherGuide.lastUpdated}
                        </span>
                      )}
                    </div>

                    {selectedTrip.weatherGuide?.dailyForecast && selectedTrip.weatherGuide.dailyForecast.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-stone-600">多日气象明细</span>
                          {!selectedTrip.weatherGuide.isExactTripWindow && (
                            <span className="text-[10px] text-amber-700">参考近期实况预报</span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                          {selectedTrip.weatherGuide.dailyForecast.map((f) => (
                            <div
                              key={f.date}
                              className="flex items-center justify-between text-xs bg-white/90 px-3 py-2 rounded-xl border border-amber-200/50"
                            >
                              <span className="font-semibold text-stone-700">{f.date.slice(5)}</span>
                              <span className="text-stone-600">{f.label}</span>
                              <span className="font-bold text-[#78350f]">
                                {f.minTemp}°~{f.maxTemp}°C
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-xs text-stone-500 font-semibold">智能建议穿搭</span>
                      <p className="text-xs text-stone-700 mt-1 leading-relaxed">{selectedTrip.weatherGuide?.outfitAdvice}</p>
                    </div>
                    <div>
                      <span className="text-xs text-stone-500 font-semibold">智能应备物品</span>
                      <p className="text-xs text-stone-700 mt-1 leading-relaxed">{selectedTrip.weatherGuide?.essentialGear}</p>
                    </div>
                  </div>
                </div>

                {/* Checklist */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-[#EAE3DC] shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-[#78350f]" />
                      <h3 className="text-xl font-bold text-[#44403C]">To-Bring Checklist (行前准备清单)</h3>
                    </div>
                    <button
                      onClick={() => setShowAddChecklistModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] transition flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>添加物品</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedTrip.checklist?.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleChecklist(item.id)}
                        className={`p-4 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                          item.checked ? 'bg-stone-50 border-stone-200 opacity-60' : 'bg-white border-[#EAE3DC] hover:border-amber-700/40'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {item.checked ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-stone-400 flex-shrink-0" />
                          )}
                          <div>
                            <p className={`text-sm font-semibold ${item.checked ? 'line-through text-stone-400' : 'text-[#2C2622]'}`}>
                              {item.text}
                            </p>
                            <span className="text-[10px] text-stone-400">{item.category}</span>
                          </div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full ${item.checked ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {item.checked ? '已准备' : '未准备'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 4. RECOMMENDATIONS */}
            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#44403C]">附近备选美食与隐藏景点</h3>
                    <p className="text-xs text-stone-500">没记录在每日主行程里的宝藏去处，随时可以去探索！</p>
                  </div>
                  <button
                    onClick={() => setShowAddRecModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] transition flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ 添加备选推荐</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedTrip.recommendations?.map((rec) => (
                    <div key={rec.id} className="bg-white rounded-3xl border border-[#EAE3DC] p-6 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-amber-50 text-[#78350f] text-xs font-bold">{rec.category}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">⭐ {rec.rating}</span>
                            <button
                              onClick={() => handleDeleteRecommendation(rec.id)}
                              className="text-stone-400 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-lg font-bold text-[#2C2622]">{rec.name}</h4>
                        <p className="text-xs text-stone-600 leading-relaxed">{rec.desc}</p>
                        <p className="text-xs text-stone-400 flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{rec.address}</span>
                        </p>
                      </div>

                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(rec.mapQuery || rec.name)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-[#78350f] hover:underline flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Google Maps 导航</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 5. EXPENSES (MYR) */}
            {activeTab === 'expenses' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-[#EAE3DC] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-stone-500">旅行开销概览 (自动折算 MYR)</span>
                    <h3 className="text-3xl font-black text-[#78350f]">
                      RM {selectedTrip.expenses?.reduce((acc, curr) => acc + (curr.amountMYR || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                    <p className="text-xs text-stone-400">总预算: RM {selectedTrip.budgetMYR?.toLocaleString()} | 当地币种: {selectedTrip.currency}</p>
                  </div>
                  <button
                    onClick={() => setShowAddExpenseModal(true)}
                    className="px-5 py-3 rounded-2xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow transition flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ 记录新开销</span>
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-[#EAE3DC] overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-[#EAE3DC]">
                    <h4 className="text-lg font-bold text-[#44403C]">开销明细与分账记录</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FAF8F5] text-stone-600 text-xs font-bold border-b border-[#EAE3DC]">
                          <th className="p-4">项目名称</th>
                          <th className="p-4">分类</th>
                          <th className="p-4">当地金额</th>
                          <th className="p-4">折算马币 (MYR)</th>
                          <th className="p-4">付款人</th>
                          <th className="p-4 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAE3DC] text-xs text-stone-700">
                        {selectedTrip.expenses?.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-10 text-stone-400">暂无记账记录</td>
                          </tr>
                        ) : (
                          selectedTrip.expenses?.map((exp) => (
                            <tr key={exp.id} className="hover:bg-stone-50 transition">
                              <td className="p-4 font-bold text-[#2C2622]">{exp.title}</td>
                              <td className="p-4">
                                <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 font-semibold">{exp.category}</span>
                              </td>
                              <td className="p-4 font-medium">{exp.currency} {exp.amountLocal?.toLocaleString()}</td>
                              <td className="p-4 font-bold text-[#78350f]">RM {exp.amountMYR?.toFixed(2)}</td>
                              <td className="p-4">
                                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold">{exp.paidBy}</span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="inline-flex items-center space-x-1">
                                  <button
                                    onClick={() => setEditingExpense(exp)}
                                    className="text-stone-500 hover:text-[#78350f] transition p-1"
                                    title="编辑记账"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteExpense(exp.id)}
                                    className="text-stone-400 hover:text-rose-600 transition p-1"
                                    title="删除记账"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 6. MEMORIES */}
            {activeTab === 'memories' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#44403C]">旅途回忆墙 (照片/影片与感言)</h3>
                    <p className="text-xs text-stone-500">记录旅途中的感动瞬间、美食暴击与趣味故事</p>
                  </div>
                  <button
                    onClick={() => setShowAddMemoryModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] transition flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ 上传旅途回忆</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedTrip.memories?.map((mem) => (
                    <div
                      key={mem.id}
                      onClick={() => setLightboxItem(mem)}
                      className="group bg-white rounded-3xl border border-[#EAE3DC] overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative h-52 overflow-hidden bg-stone-100">
                        <img src={mem.mediaUrl} alt={mem.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                          {mem.dayTag}
                        </div>
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-stone-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
                          {mem.mood}
                        </div>
                      </div>

                      <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h4 className="text-lg font-bold text-[#2C2622]">{mem.title}</h4>
                          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">{mem.note}</p>
                        </div>
                        <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                          <span>👤 {mem.author}</span>
                          <span>{mem.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- MODALS --- */}

      {/* 1. New Trip Modal */}
      {showNewTripModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-[#EAE3DC] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#44403C]">规划新旅程</h3>
              <button onClick={() => setShowNewTripModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">目的地名称 (如: 日本东京 5天4夜)</label>
                <input name="title" required placeholder="例如：东京浪漫美食之旅" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">国家 / 城市地区</label>
                <input name="destination" required placeholder="日本 · 东京 (Tokyo)" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">出发日期</label>
                  <input type="date" name="startDate" required defaultValue="2026-12-25" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">结束日期</label>
                  <input type="date" name="endDate" required defaultValue="2026-12-29" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">当地消费币种</label>
                  <select name="currency" defaultValue="JPY" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                    <option value="JPY">JPY (日圆)</option>
                    <option value="THB">THB (泰铢)</option>
                    <option value="KRW">KRW (韩元)</option>
                    <option value="SGD">SGD (新币)</option>
                    <option value="TWD">TWD (台币)</option>
                    <option value="USD">USD (美元)</option>
                    <option value="EUR">EUR (欧元)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">总预算 (MYR)</label>
                  <input type="number" name="budgetMYR" defaultValue="5500" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">同行伙伴 (逗号分隔)</label>
                <input name="companions" defaultValue="我, Aiden, Jing Yi" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowNewTripModal(false)} className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold">
                  取消
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow">
                  确认创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Trip Modal */}
      {showEditTripModal && selectedTrip && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-[#EAE3DC] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#44403C]">编辑旅程基本信息</h3>
              <button onClick={() => setShowEditTripModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">旅程名称标题</label>
                <input name="title" defaultValue={selectedTrip.title} required className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">目的地</label>
                <input name="destination" defaultValue={selectedTrip.destination} required className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">出发日期</label>
                  <input type="date" name="startDate" defaultValue={selectedTrip.startDate} required className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">结束日期</label>
                  <input type="date" name="endDate" defaultValue={selectedTrip.endDate} required className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">消费币种</label>
                  <select name="currency" defaultValue={selectedTrip.currency} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                    <option value="JPY">JPY (日圆)</option>
                    <option value="THB">THB (泰铢)</option>
                    <option value="KRW">KRW (韩元)</option>
                    <option value="SGD">SGD (新币)</option>
                    <option value="TWD">TWD (台币)</option>
                    <option value="USD">USD (美元)</option>
                    <option value="EUR">EUR (欧元)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">总预算 (MYR)</label>
                  <input type="number" name="budgetMYR" defaultValue={selectedTrip.budgetMYR} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">同行伙伴</label>
                <input name="companions" defaultValue={selectedTrip.companions?.join(', ')} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowEditTripModal(false)} className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold">
                  取消
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow">
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Stop Modal */}
      {showAddStopModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-[#EAE3DC] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#44403C]">添加 Day {activeDayNum} 行程点</h3>
              <button onClick={() => setShowAddStopModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStop} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">时间 (如 09:30)</label>
                  <input name="time" required defaultValue="10:00" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">分类</label>
                  <select name="category" defaultValue="景点" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                    <option value="景点">景点</option>
                    <option value="美食">美食</option>
                    <option value="交通">交通</option>
                    <option value="住宿">住宿</option>
                    <option value="购物">购物</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">名称</label>
                <input name="name" required placeholder="例如：浅草寺雷门" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">地址 (Google Maps 搜索用)</label>
                <input name="address" required placeholder="例如：2-3-1 Asakusa, Taito City" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">开放时间</label>
                  <input name="openHours" defaultValue="09:00 - 18:00" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">建议停留</label>
                  <input name="duration" defaultValue="2小时" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">照片图片链接 (支持 Unsplash 或高清图)</label>
                <input name="photoUrl" placeholder="https://images.unsplash.com/..." className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">备注 / 门票 / 必吃指南</label>
                <textarea name="notes" rows="2" placeholder="必吃雷门人形烧、买御守..." className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAddStopModal(false)} className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold">
                  取消
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow">
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3B. Edit Stop Modal */}
      {editingStop && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-[#EAE3DC] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#44403C]">编辑行程点内容</h3>
              <button onClick={() => setEditingStop(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditStop} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">时间</label>
                  <input name="time" required defaultValue={editingStop.time} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">分类</label>
                  <select name="category" defaultValue={editingStop.category} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                    <option value="景点">景点</option>
                    <option value="美食">美食</option>
                    <option value="交通">交通</option>
                    <option value="住宿">住宿</option>
                    <option value="购物">购物</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">景点 / 行程名称</label>
                <input name="name" required defaultValue={editingStop.name} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">地址 (Google Maps 搜索用)</label>
                <input name="address" required defaultValue={editingStop.address} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">开放时间</label>
                  <input name="openHours" defaultValue={editingStop.openHours} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">建议停留</label>
                  <input name="duration" defaultValue={editingStop.duration} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">照片图片链接</label>
                <input name="photoUrl" defaultValue={editingStop.photoUrl} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">备注 / 门票 / 必吃指南</label>
                <textarea name="notes" rows="2" defaultValue={editingStop.notes} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setEditingStop(null)} className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold">
                  取消
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow">
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3C. Edit Day Title & Weather Modal */}
      {editingDayInfo && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#EAE3DC] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#44403C]">编辑 Day {editingDayInfo.dayNum} 主题与天气</h3>
              <button onClick={() => setEditingDayInfo(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditDayInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">当天行程主题</label>
                <input name="title" required defaultValue={editingDayInfo.title} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">天气速览备注</label>
                <input name="weatherNote" defaultValue={editingDayInfo.weatherNote} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setEditingDayInfo(null)} className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold">
                  取消
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow">
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#EAE3DC] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#44403C]">记录旅行开销 ({selectedTrip?.currency})</h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">项目名称</label>
                <input name="title" required placeholder="如: 筑地市场海鲜早餐" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">分类</label>
                  <select name="category" defaultValue="餐饮" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                    <option value="餐饮">餐饮</option>
                    <option value="交通">交通</option>
                    <option value="门票">门票</option>
                    <option value="购物">购物</option>
                    <option value="住宿">住宿</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">当地金额 ({selectedTrip?.currency})</label>
                  <input type="number" step="any" name="amountLocal" required placeholder="6500" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">付款人</label>
                <select name="paidBy" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                  {selectedTrip?.companions?.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  )) || <option value="我">我</option>}
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAddExpenseModal(false)} className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold">
                  取消
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow">
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5B. Edit Expense Modal */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#EAE3DC] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#44403C]">编辑旅行开销 ({selectedTrip?.currency})</h3>
              <button onClick={() => setEditingExpense(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">项目名称</label>
                <input name="title" required defaultValue={editingExpense.title} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">分类</label>
                  <select name="category" defaultValue={editingExpense.category} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                    <option value="餐饮">餐饮</option>
                    <option value="交通">交通</option>
                    <option value="门票">门票</option>
                    <option value="购物">购物</option>
                    <option value="住宿">住宿</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">当地金额 ({selectedTrip?.currency})</label>
                  <input type="number" step="any" name="amountLocal" required defaultValue={editingExpense.amountLocal} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">付款人</label>
                <select name="paidBy" defaultValue={editingExpense.paidBy} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                  {selectedTrip?.companions?.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  )) || <option value="我">我</option>}
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setEditingExpense(null)} className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold">
                  取消
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow">
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5C. Add / Edit Flight Modal */}
      {showFlightModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#EAE3DC] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#44403C]">{editingFlight ? '编辑航班班次' : '添加航班班次'}</h3>
              <button
                onClick={() => {
                  setShowFlightModal(false);
                  setEditingFlight(null);
                }}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFlight} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">行程方向</label>
                  <select name="type" defaultValue={editingFlight?.type || '去程'} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                    <option value="去程">去程</option>
                    <option value="回程">回程</option>
                    <option value="转机/内陆">转机/内陆</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">航班号</label>
                  <input name="flightNo" required defaultValue={editingFlight?.flightNo || ''} placeholder="如: MH 70 / AK 510" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">起降航线</label>
                <input name="route" required defaultValue={editingFlight?.route || ''} placeholder="如: KUL (吉隆坡) ➔ NRT (东京)" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">起飞与抵达时间</label>
                <input name="time" required defaultValue={editingFlight?.time || ''} placeholder="如: 2026-12-25 00:15 - 08:00" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">座位号</label>
                  <input name="seat" defaultValue={editingFlight?.seat || ''} placeholder="32A" className="w-full px-3 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">预订码 (PNR)</label>
                  <input name="pnr" defaultValue={editingFlight?.pnr || ''} placeholder="ABC123" className="w-full px-3 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">航站楼</label>
                  <input name="terminal" defaultValue={editingFlight?.terminal || 'T1'} placeholder="T1" className="w-full px-3 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowFlightModal(false);
                    setEditingFlight(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold"
                >
                  取消
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow">
                  {editingFlight ? '保存修改' : '确认添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5D. Add / Edit Hotel Modal */}
      {showHotelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#EAE3DC] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#44403C]">{editingHotel ? '编辑酒店住宿' : '添加酒店住宿'}</h3>
              <button
                onClick={() => {
                  setShowHotelModal(false);
                  setEditingHotel(null);
                }}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHotel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">酒店名称</label>
                <input name="name" required defaultValue={editingHotel?.name || ''} placeholder="如: Tokyo Prince Hotel" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">酒店地址 (用于导航)</label>
                <input name="address" required defaultValue={editingHotel?.address || ''} placeholder="如: 3-3-1 Shibakoen, Minato City" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">入住日期</label>
                  <input type="date" name="checkIn" required defaultValue={editingHotel?.checkIn || selectedTrip?.startDate} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">退房日期</label>
                  <input type="date" name="checkOut" required defaultValue={editingHotel?.checkOut || selectedTrip?.endDate} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">酒店联系电话 / 订单备注</label>
                <input name="contact" defaultValue={editingHotel?.contact || ''} placeholder="如: +81 3-3432-1111" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowHotelModal(false);
                    setEditingHotel(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold"
                >
                  取消
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow">
                  {editingHotel ? '保存修改' : '确认添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Add Recommendation Modal */}
      {showAddRecModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#EAE3DC] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#44403C]">添加附近备选推荐</h3>
              <button onClick={() => setShowAddRecModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecommendation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">餐厅 / 景点名称</label>
                <input name="name" required placeholder="例如：一兰拉面 新宿中央东口店" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">类型</label>
                  <select name="category" defaultValue="美食餐厅" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                    <option value="美食餐厅">美食餐厅</option>
                    <option value="精品咖啡">精品咖啡</option>
                    <option value="隐藏景点">隐藏景点</option>
                    <option value="购物好去处">购物好去处</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">推荐评分 (1-5)</label>
                  <input name="rating" defaultValue="4.8" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">地址 / 区域</label>
                <input name="address" required placeholder="例如：Shinjuku, Tokyo" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">配图链接 (可选)</label>
                <input name="photoUrl" placeholder="https://images.unsplash.com/..." className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">推荐理由</label>
                <textarea name="desc" rows="2" placeholder="24小时营业，宵夜首选..." className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAddRecModal(false)} className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold">
                  取消
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow">
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6B. Add Memory Modal */}
      {showAddMemoryModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#EAE3DC] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#44403C]">上传旅途回忆与感言</h3>
              <button onClick={() => setShowAddMemoryModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">回忆标题</label>
                <input name="title" required placeholder="例如：晴空塔上的日落与夜景" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">所属天数</label>
                  <select name="dayTag" defaultValue={`Day ${activeDayNum}`} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                    {selectedTrip?.days?.map((d) => (
                      <option key={d.dayNum} value={`Day ${d.dayNum}`}>Day {d.dayNum}</option>
                    )) || <option value="Day 1">Day 1</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">心情标签</label>
                  <select name="mood" defaultValue="😍 超难忘瞬间" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                    <option value="😍 超难忘瞬间">😍 超难忘瞬间</option>
                    <option value="🍜 美食暴击">🍜 美食暴击</option>
                    <option value="🌅 绝美风景">🌅 绝美风景</option>
                    <option value="😂 旅途趣事">😂 旅途趣事</option>
                    <option value="☕ 悠闲时光">☕ 悠闲时光</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">记录人</label>
                  <select name="author" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                    {selectedTrip?.companions?.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    )) || <option value="我">我</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">地点备注</label>
                  <input name="location" placeholder="Tokyo Skytree" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">照片链接</label>
                <input name="mediaUrl" placeholder="https://images.unsplash.com/..." className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">感言与心情笔记</label>
                <textarea name="note" rows="3" required placeholder="写下这一刻的感动与故事..." className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAddMemoryModal(false)} className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold">
                  取消
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow">
                  发布回忆
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Add Checklist Item Modal */}
      {showAddChecklistModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#EAE3DC] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#44403C]">添加行前准备物品</h3>
              <button onClick={() => setShowAddChecklistModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChecklistItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">分类</label>
                <select name="category" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]">
                  <option value="证件与金融">证件与金融</option>
                  <option value="衣物穿搭">衣物穿搭</option>
                  <option value="电子与网络">电子与网络</option>
                  <option value="药品与洗漱">药品与洗漱</option>
                  <option value="其他必备">其他必备</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">物品名称</label>
                <input name="text" required placeholder="例如：转换插头、常备药..." className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#78350f]" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAddChecklistModal(false)} className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold">
                  取消
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#78350f] text-white text-xs font-bold hover:bg-[#451a03] shadow">
                  确认添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Memories */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setLightboxItem(null)}>
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
            <div className="md:w-1/2 bg-black flex items-center justify-center relative min-h-[300px]">
              <img src={lightboxItem.mediaUrl} alt={lightboxItem.title} className="w-full h-full object-cover max-h-[500px]" />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-[#78350f] text-xs font-bold">{lightboxItem.dayTag}</span>
                  <span className="text-xs font-bold text-stone-600">{lightboxItem.mood}</span>
                </div>
                <h3 className="text-2xl font-bold text-[#2C2622]">{lightboxItem.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{lightboxItem.note}</p>
              </div>

              <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-stone-700">记录人: {lightboxItem.author}</p>
                  <p className="text-[10px] text-stone-400">{lightboxItem.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      handleDeleteMemory(lightboxItem.id);
                      setLightboxItem(null);
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>删除</span>
                  </button>
                  <button
                    onClick={() => setLightboxItem(null)}
                    className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-bold"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}