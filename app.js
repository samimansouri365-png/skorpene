(function () {
    'use strict';

    // ============ DATA ============
    const COUNTRY_LABELS = [
        {name:'United States',lat:39.8,lng:-98.5,minZoom:2,rank:1,names:{es:'Estados Unidos',en:'United States',fr:'États-Unis',ru:'США',zh:'美国',tr:'ABD',ar:'الولايات المتحدة',fa:'ایالات متحده',he:'ארצות הברית'}},
        {name:'Russia',lat:61.5,lng:105,minZoom:2,rank:1,names:{es:'Rusia',en:'Russia',fr:'Russie',ru:'Россия',zh:'俄罗斯',tr:'Rusya',ar:'روسيا',fa:'روسیه',he:'רוסיה'}},
        {name:'China',lat:35.8,lng:104.1,minZoom:2,rank:1,names:{es:'China',en:'China',fr:'Chine',ru:'Китай',zh:'中国',tr:'Çin',ar:'الصين',fa:'چین',he:'סין'}},
        {name:'Canada',lat:56.1,lng:-106.3,minZoom:2,rank:2,names:{es:'Canadá',en:'Canada',fr:'Canada',ru:'Канада',zh:'加拿大',tr:'Kanada',ar:'كندا',fa:'کانادا',he:'קנדה'}},
        {name:'Brazil',lat:-14.2,lng:-51.9,minZoom:2,rank:2,names:{es:'Brasil',en:'Brazil',fr:'Brésil',ru:'Бразилия',zh:'巴西',tr:'Brezilya',ar:'البرازيل',fa:'برزیل',he:'ברזיל'}},
        {name:'Australia',lat:-25.3,lng:133.8,minZoom:2,rank:2,names:{es:'Australia',en:'Australia',fr:'Australie',ru:'Австралия',zh:'澳大利亚',tr:'Avustralya',ar:'أستراليا',fa:'استرالیا',he:'אוסטרליה'}},
        {name:'India',lat:20.6,lng:79,minZoom:3,rank:2,names:{es:'India',en:'India',fr:'Inde',ru:'Индия',zh:'印度',tr:'Hindistan',ar:'الهند',fa:'هند',he:'הודו'}},
        {name:'Argentina',lat:-38.4,lng:-63.6,minZoom:3,rank:3,names:{es:'Argentina',en:'Argentina',fr:'Argentine',ru:'Аргентина',zh:'阿根廷',tr:'Arjantin',ar:'الأرجنتين',fa:'آرژانتین',he:'ארגנטינה'}},
        {name:'Algeria',lat:28.0,lng:1.7,minZoom:3,rank:4,names:{es:'Argelia',en:'Algeria',fr:'Algérie',ru:'Алжир',zh:'阿尔及利亚',tr:'Cezayir',ar:'الجزائر',fa:'الجزایر',he:'אלג\'יריה'}},
        {name:'Libya',lat:26.3,lng:17.2,minZoom:4,rank:5,names:{es:'Libia',en:'Libya',fr:'Libye',ru:'Ливия',zh:'利比亚',tr:'Libya',ar:'ليبيا',fa:'لیبی',he:'לוב'}},
        {name:'Iran',lat:32.4,lng:53.7,minZoom:3,rank:3,names:{es:'Irán',en:'Iran',fr:'Iran',ru:'Иран',zh:'伊朗',tr:'İran',ar:'إيران',fa:'ایران',he:'איראן'}},
        {name:'Saudi Arabia',lat:23.9,lng:45.1,minZoom:3,rank:3,names:{es:'Arabia Saudita',en:'Saudi Arabia',fr:'Arabie saoudite',ru:'Саудовская Аравия',zh:'沙特阿拉伯',tr:'Suudi Arabistan',ar:'المملكة العربية السعودية',fa:'عربستان سعودی',he:'ערב הסעודית'}},
        {name:'Turkey',lat:38.9,lng:35.2,minZoom:3,rank:3,names:{es:'Turquía',en:'Turkey',fr:'Turquie',ru:'Турция',zh:'土耳其',tr:'Türkiye',ar:'تركيا',fa:'ترکیه',he:'טורקיה'}},
        {name:'Egypt',lat:26.8,lng:30.8,minZoom:4,rank:3,names:{es:'Egipto',en:'Egypt',fr:'Égypte',ru:'Египет',zh:'埃及',tr:'Mısır',ar:'مصر',fa:'مصر',he:'מצרים'}},
        {name:'France',lat:46.2,lng:2.2,minZoom:4,rank:3,names:{es:'Francia',en:'France',fr:'France',ru:'Франция',zh:'法国',tr:'Fransa',ar:'فرنسا',fa:'فرانسه',he:'צרפת'}},
        {name:'Germany',lat:51.2,lng:10.5,minZoom:4,rank:3,names:{es:'Alemania',en:'Germany',fr:'Allemagne',ru:'Германия',zh:'德国',tr:'Almanya',ar:'ألمانيا',fa:'آلمان',he:'גרמניה'}},
        {name:'United Kingdom',lat:55.4,lng:-3.4,minZoom:4,rank:3,names:{es:'Reino Unido',en:'United Kingdom',fr:'Royaume-Uni',ru:'Великобритания',zh:'英国',tr:'Birleşik Krallık',ar:'المملكة المتحدة',fa:'بریتانیا',he:'הממלכה המאוחדת'}},
        {name:'Spain',lat:40.5,lng:-3.7,minZoom:4,rank:4,names:{es:'España',en:'Spain',fr:'Espagne',ru:'Испания',zh:'西班牙',tr:'İspanya',ar:'إسبانيا',fa:'اسپانیا',he:'ספרד'}},
        {name:'Italy',lat:41.9,lng:12.6,minZoom:4,rank:4,names:{es:'Italia',en:'Italy',fr:'Italie',ru:'Италия',zh:'意大利',tr:'İtalya',ar:'إيطاليا',fa:'ایتالیا',he:'איטליה'}},
        {name:'Japan',lat:36.2,lng:138.3,minZoom:3,rank:3,names:{es:'Japón',en:'Japan',fr:'Japon',ru:'Япония',zh:'日本',tr:'Japonya',ar:'اليابان',fa:'ژاپن',he:'יפן'}},
        {name:'South Korea',lat:35.9,lng:127.8,minZoom:5,rank:5,names:{es:'Corea del Sur',en:'South Korea',fr:'Corée du Sud',ru:'Южная Корея',zh:'韩国',tr:'Güney Kore',ar:'كوريا الجنوبية',fa:'کره جنوبی',he:'דרום קוריאה'}},
        {name:'North Korea',lat:40.3,lng:127.5,minZoom:5,rank:5,names:{es:'Corea del Norte',en:'North Korea',fr:'Corée du Nord',ru:'Северная Корея',zh:'朝鲜',tr:'Kuzey Kore',ar:'كوريا الشمالية',fa:'کره شمالی',he:'צפון קוריאה'}},
        {name:'Pakistan',lat:30.4,lng:69.3,minZoom:4,rank:4,names:{es:'Pakistán',en:'Pakistan',fr:'Pakistan',ru:'Пакистан',zh:'巴基斯坦',tr:'Pakistan',ar:'باكستان',fa:'پاکستان',he:'פקיסטן'}},
        {name:'Afghanistan',lat:33.9,lng:67.7,minZoom:4,rank:5,names:{es:'Afganistán',en:'Afghanistan',fr:'Afghanistan',ru:'Афганистан',zh:'阿富汗',tr:'Afganistan',ar:'أفغانستان',fa:'افغانستان',he:'אפגניסטן'}},
        {name:'Iraq',lat:33.2,lng:43.7,minZoom:4,rank:4,names:{es:'Irak',en:'Iraq',fr:'Irak',ru:'Ирак',zh:'伊拉克',tr:'Irak',ar:'العراق',fa:'عراق',he:'עיראק'}},
        {name:'Syria',lat:34.8,lng:38.9,minZoom:5,rank:5,names:{es:'Siria',en:'Syria',fr:'Syrie',ru:'Сирия',zh:'叙利亚',tr:'Suriye',ar:'سوريا',fa:'سوریه',he:'סוריה'}},
        {name:'Israel',lat:31.0,lng:34.8,minZoom:5,rank:5,names:{es:'Israel',en:'Israel',fr:'Israël',ru:'Израиль',zh:'以色列',tr:'İsrail',ar:'إسرائيل',fa:'اسرائیل',he:'ישראל'}},
        {name:'Lebanon',lat:33.9,lng:35.9,minZoom:7,rank:7,names:{es:'Líbano',en:'Lebanon',fr:'Liban',ru:'Ливан',zh:'黎巴嫩',tr:'Lübnan',ar:'لبنان',fa:'لبنان',he:'לבנון'}},
        {name:'Jordan',lat:30.6,lng:36.2,minZoom:5,rank:6,names:{es:'Jordania',en:'Jordan',fr:'Jordanie',ru:'Иордания',zh:'约旦',tr:'Ürdün',ar:'الأردن',fa:'اردن',he:'ירדן'}},
        {name:'Yemen',lat:15.6,lng:48.5,minZoom:4,rank:5,names:{es:'Yemen',en:'Yemen',fr:'Yémen',ru:'Йемен',zh:'也门',tr:'Yemen',ar:'اليمن',fa:'یمن',he:'תימן'}},
        {name:'Ukraine',lat:48.4,lng:31.2,minZoom:3,rank:4,names:{es:'Ucrania',en:'Ukraine',fr:'Ukraine',ru:'Украина',zh:'乌克兰',tr:'Ukrayna',ar:'أوكرانيا',fa:'اوکراین',he:'אוקראינה'}},
        {name:'Mexico',lat:23.6,lng:-102.6,minZoom:3,rank:3,names:{es:'México',en:'Mexico',fr:'Mexique',ru:'Мексика',zh:'墨西哥',tr:'Meksika',ar:'المكسيك',fa:'مکزیک',he:'מקסיקו'}},
        {name:'Colombia',lat:4.6,lng:-74.3,minZoom:4,rank:4,names:{es:'Colombia',en:'Colombia',fr:'Colombie',ru:'Колумбия',zh:'哥伦比亚',tr:'Kolombiya',ar:'كولومبيا',fa:'کلمبیا',he:'קולומביה'}},
        {name:'South Africa',lat:-30.6,lng:22.9,minZoom:3,rank:4,names:{es:'Sudáfrica',en:'South Africa',fr:'Afrique du Sud',ru:'ЮАР',zh:'南非',tr:'Güney Afrika',ar:'جنوب أفريقيا',fa:'آفریقای جنوبی',he:'דרום אפריקה'}},
        {name:'Nigeria',lat:9.1,lng:8.7,minZoom:4,rank:4,names:{es:'Nigeria',en:'Nigeria',fr:'Nigéria',ru:'Нигерия',zh:'尼日利亚',tr:'Nijerya',ar:'نيجيريا',fa:'نیجریه',he:'ניגריה'}},
        {name:'Ethiopia',lat:9.1,lng:40.5,minZoom:4,rank:5,names:{es:'Etiopía',en:'Ethiopia',fr:'Éthiopie',ru:'Эфиопия',zh:'埃塞俄比亚',tr:'Etiyopya',ar:'إثيوبيا',fa:'اتیوپی',he:'אתיופיה'}},
        {name:'Sudan',lat:12.9,lng:30.2,minZoom:4,rank:5,names:{es:'Sudán',en:'Sudan',fr:'Soudan',ru:'Судан',zh:'苏丹',tr:'Sudan',ar:'السودان',fa:'سودان',he:'סודן'}},
        {name:'Congo (DRC)',lat:-4.0,lng:21.8,minZoom:4,rank:5,names:{es:'RD Congo',en:'Congo (DRC)',fr:'RD Congo',ru:'ДР Конго',zh:'刚果(金)',tr:'DR Kongo',ar:'الكونغو الديمقراطية',fa:'کنگو',he:'קונגו'}},
        {name:'Indonesia',lat:-0.8,lng:113.9,minZoom:3,rank:3,names:{es:'Indonesia',en:'Indonesia',fr:'Indonésie',ru:'Индонезия',zh:'印度尼西亚',tr:'Endonezya',ar:'إندونيسيا',fa:'اندونزی',he:'אינדונזיה'}},
        {name:'Mongolia',lat:46.9,lng:103.8,minZoom:3,rank:5,names:{es:'Mongolia',en:'Mongolia',fr:'Mongolie',ru:'Монголия',zh:'蒙古',tr:'Moğolistan',ar:'منغوليا',fa:'مغولستان',he:'מונגוליה'}},
        {name:'Kazakhstan',lat:48.0,lng:68.0,minZoom:3,rank:4,names:{es:'Kazajistán',en:'Kazakhstan',fr:'Kazakhstan',ru:'Казахстан',zh:'哈萨克斯坦',tr:'Kazakistan',ar:'كازاخستان',fa:'قزاقستان',he:'קזחסטן'}},
        {name:'Poland',lat:51.9,lng:19.1,minZoom:4,rank:5,names:{es:'Polonia',en:'Poland',fr:'Pologne',ru:'Польша',zh:'波兰',tr:'Polonya',ar:'بولندا',fa:'لهستان',he:'פולין'}},
        {name:'Romania',lat:45.9,lng:24.9,minZoom:5,rank:6,names:{es:'Rumania',en:'Romania',fr:'Roumanie',ru:'Румыния',zh:'罗马尼亚',tr:'Romanya',ar:'رومانيا',fa:'رومانی',he:'רומניה'}},
        {name:'Greece',lat:39.1,lng:21.8,minZoom:5,rank:5,names:{es:'Grecia',en:'Greece',fr:'Grèce',ru:'Греция',zh:'希腊',tr:'Yunanistan',ar:'اليونان',fa:'یونان',he:'יוון'}},
        {name:'Taiwan',lat:23.7,lng:121.0,minZoom:6,rank:6,names:{es:'Taiwán',en:'Taiwan',fr:'Taïwan',ru:'Тайвань',zh:'台湾',tr:'Tayvan',ar:'تايوان',fa:'تایوان',he:'טייוואן'}},
        {name:'Philippines',lat:12.9,lng:121.8,minZoom:4,rank:5,names:{es:'Filipinas',en:'Philippines',fr:'Philippines',ru:'Филиппины',zh:'菲律宾',tr:'Filipinler',ar:'الفلبين',fa:'فیلیپین',he:'הפיליפינים'}},
        {name:'Thailand',lat:15.9,lng:101.0,minZoom:4,rank:5,names:{es:'Tailandia',en:'Thailand',fr:'Thaïlande',ru:'Таиланд',zh:'泰国',tr:'Tayland',ar:'تايلاند',fa:'تایلند',he:'תאילנד'}},
        {name:'Vietnam',lat:14.1,lng:108.3,minZoom:4,rank:5,names:{es:'Vietnam',en:'Vietnam',fr:'Viêt Nam',ru:'Вьетнам',zh:'越南',tr:'Vietnam',ar:'فيتنام',fa:'ویتنام',he:'וייטנאם'}},
        {name:'Myanmar',lat:21.9,lng:96.0,minZoom:4,rank:5,names:{es:'Myanmar',en:'Myanmar',fr:'Myanmar',ru:'Мьянма',zh:'缅甸',tr:'Myanmar',ar:'ميانمار',fa:'میانمار',he:'מיאנמר'}},
        {name:'Morocco',lat:31.8,lng:-7.1,minZoom:4,rank:5,names:{es:'Marruecos',en:'Morocco',fr:'Maroc',ru:'Марокко',zh:'摩洛哥',tr:'Fas',ar:'المغرب',fa:'مراکش',he:'מרוקו'}},
        {name:'Tunisia',lat:33.9,lng:9.5,minZoom:6,rank:6,names:{es:'Túnez',en:'Tunisia',fr:'Tunisie',ru:'Тунис',zh:'突尼斯',tr:'Tunus',ar:'تونس',fa:'تونس',he:'תוניסיה'}},
        {name:'UAE',lat:23.4,lng:53.8,minZoom:5,rank:6,names:{es:'EAU',en:'UAE',fr:'ÉAU',ru:'ОАЭ',zh:'阿联酋',tr:'BAE',ar:'الإمارات',fa:'امارات',he:'איחוד האמירויות'}},
        {name:'Qatar',lat:25.4,lng:51.2,minZoom:7,rank:7,names:{es:'Catar',en:'Qatar',fr:'Qatar',ru:'Катар',zh:'卡塔尔',tr:'Katar',ar:'قطر',fa:'قطر',he:'קטאר'}},
        {name:'Kuwait',lat:29.3,lng:47.5,minZoom:7,rank:7,names:{es:'Kuwait',en:'Kuwait',fr:'Koweït',ru:'Кувейт',zh:'科威特',tr:'Kuveyt',ar:'الكويت',fa:'کویت',he:'כווית'}},
        {name:'Oman',lat:21.5,lng:55.9,minZoom:5,rank:6,names:{es:'Omán',en:'Oman',fr:'Oman',ru:'Оман',zh:'阿曼',tr:'Umman',ar:'عُمان',fa:'عمان',he:'עומאן'}},
        {name:'Bahrain',lat:26.1,lng:50.6,minZoom:8,rank:8,names:{es:'Baréin',en:'Bahrain',fr:'Bahreïn',ru:'Бахрейн',zh:'巴林',tr:'Bahreyn',ar:'البحرين',fa:'بحرین',he:'בחריין'}},
    ];
    // — recovered constants —
    const CANONICAL_TYPE = {
        // Explosions / airstrikes
        mil_explosion: 'explosion', mil_airstrike: 'explosion', mil_blast: 'explosion',
        mil_bombardment: 'explosion', mil_strike: 'strike',
        // Combat / troops
        mil_combat: 'combat', mil_clash: 'combat', mil_battle: 'combat',
        mil_troops: 'troops', mil_casualties: 'troops', mil_pow: 'troops',
        // Naval
        mil_naval: 'naval', transport_ship: 'ship',
        // Missile
        mil_missile: 'missile', mil_rocket: 'missile', mil_ballistic: 'missile',
        mil_artillery: 'missile',
        // Drone
        mil_drone: 'drone', mil_uav: 'drone', mil_swarm: 'drone',
        // Protest / civil
        pol_protest: 'protest', civ_unrest: 'protest', civ_riot: 'protest',
        civ_demonstration: 'protest', civ_strike: 'protest',
        // Assassination / targeted killing
        mil_assassination: 'assassination', mil_targeted: 'assassination',
        mil_killed_leader: 'assassination', mil_killed_official: 'assassination',
        // Alert / damage / hazard
        dmg_damage: 'alert', dmg_destruction: 'alert', dmg_collapse: 'alert',
        dmg_explosion: 'explosion', dmg_fire: 'fire',
        nat_earthquake: 'alert', nat_flood: 'alert', nat_storm: 'alert',
        nat_disaster: 'alert',
        hlt_chemical: 'hazard', hlt_biological: 'hazard', hlt_nuclear: 'hazard',
        hlt_radiation: 'hazard', hlt_outbreak: 'hazard',
        // Diplomatic
        mil_ceasefire: 'ceasefire', pol_treaty: 'diplomatic', pol_meeting: 'diplomatic',
        pol_negotiation: 'diplomatic', pol_summit: 'diplomatic',
    };
    const CANONICAL_COLOR = {
        explosion: '#ff3b30',     // systemRed
        combat: '#ff9500',        // systemOrange
        naval: '#007aff',         // systemBlue
        missile: '#ffcc00',       // systemYellow
        drone: '#af52de',         // systemPurple
        protest: '#34c759',       // systemGreen
        assassination: '#b40000', // dark red
        alert: '#ff9f0a',         // amber
        diplomatic: '#5ac8fa',    // teal
        fire: '#ff6b3d',          // warm orange
        ceasefire: '#5ac8fa',     // teal
        hazard: '#ff2d55',        // pink-red
        ship: '#5e9eff',          // softer blue
        troops: '#a98750',        // tan-olive
        strike: '#ff453a',        // red
        news: '#00e5ff',          // accent cyan — outlet stories
        pin: '#9aa6b2',           // neutral
    };
    const CANONICAL_SVG = {
        // explosion / airstrike — 12-point starburst
        explosion: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <path d="M12 1.5 L13.4 8 L17.6 4.2 L15.8 9.4 L22 7.4 L17.4 11 L22.5 12 L17.4 13 L22 16.6 L15.8 14.6 L17.6 19.8 L13.4 16 L12 22.5 L10.6 16 L6.4 19.8 L8.2 14.6 L2 16.6 L6.6 13 L1.5 12 L6.6 11 L2 7.4 L8.2 9.4 L6.4 4.2 L10.6 8 Z"
                fill="currentColor"/>
        </svg>`,
        // ground combat — crossed swords
        combat: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <path d="M4 3 L7 3 L18 14 L18 18 L14 18 L3 7 Z M20 3 L17 3 L6 14 L6 18 L10 18 L21 7 Z"
                fill="currentColor"/>
            <circle cx="12" cy="11" r="0.9" fill="rgba(0,0,0,0.35)"/>
        </svg>`,
        // naval event — anchor
        naval: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <circle cx="12" cy="4.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/>
            <path d="M12 6.7 L12 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M8.5 10 L15.5 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M3.5 15 C5 19.5 9 21.5 12 21.5 C15 21.5 19 19.5 20.5 15"
                stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        </svg>`,
        // missile launch — upward arrow with trail
        missile: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <path d="M12 1.5 L15.6 8 L15.6 17 L17.6 19 L17.6 21.5 L12.8 19.4 L12 21 L11.2 19.4 L6.4 21.5 L6.4 19 L8.4 17 L8.4 8 Z"
                fill="currentColor"/>
            <circle cx="12" cy="11.5" r="1.4" fill="rgba(0,0,0,0.35)"/>
        </svg>`,
        // drone attack — diamond with four points
        drone: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <circle cx="4.5" cy="4.5" r="2.2" fill="currentColor"/>
            <circle cx="19.5" cy="4.5" r="2.2" fill="currentColor"/>
            <circle cx="4.5" cy="19.5" r="2.2" fill="currentColor"/>
            <circle cx="19.5" cy="19.5" r="2.2" fill="currentColor"/>
            <path d="M4.5 4.5 L19.5 19.5 M19.5 4.5 L4.5 19.5" stroke="currentColor" stroke-width="1.6" fill="none"/>
            <path d="M12 8.5 L15.5 12 L12 15.5 L8.5 12 Z" fill="currentColor"/>
        </svg>`,
        // protest / civil unrest — raised fist
        protest: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <path d="M7.5 11.5 L7.5 7 C7.5 6.2 8.1 5.5 9 5.5 C9.9 5.5 10.5 6.2 10.5 7 L10.5 11
                     L11.5 11 L11.5 6 C11.5 5.2 12.1 4.5 13 4.5 C13.9 4.5 14.5 5.2 14.5 6 L14.5 11
                     L15.5 11 L15.5 7 C15.5 6.2 16.1 5.5 17 5.5 C17.9 5.5 18.5 6.2 18.5 7 L18.5 13.5
                     C18.5 17 16 20 12.5 20 C9 20 6 17 6 13.5 L6 11.5 C6 10.7 6.6 10 7.5 10 Z"
                fill="currentColor"/>
        </svg>`,
        // assassination — crosshair
        assassination: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/>
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 1.5 L12 6.5 M12 17.5 L12 22.5 M1.5 12 L6.5 12 M17.5 12 L22.5 12"
                stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="1.4" fill="currentColor"/>
        </svg>`,
        // alert / warning — triangle with exclamation
        alert: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <path d="M12 2.5 L22.5 21 L1.5 21 Z" fill="currentColor"/>
            <rect x="11" y="9" width="2" height="6.5" rx="1" fill="rgba(0,0,0,0.5)"/>
            <circle cx="12" cy="18" r="1.2" fill="rgba(0,0,0,0.5)"/>
        </svg>`,
        // diplomatic — handshake
        diplomatic: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <path d="M2.5 9.5 L7.5 7 L11 9 L13 8 L17 8 L21.5 10
                     L21.5 14.5 L17 17 L13 16 L11 17 L7.5 16.5 L2.5 14.5 Z"
                fill="currentColor"/>
            <path d="M11 9 L13 11.5 M13 8 L15.5 11" stroke="rgba(0,0,0,0.4)" stroke-width="1.2" fill="none"/>
        </svg>`,
        // fire / damage — flame
        fire: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <path d="M12 2 C12.5 5 15 6 15 9 C15 10.5 14 11.5 13 11.5 C13.5 9 12 8 12 8
                     C12 8 9 10 9 14 C9 16.5 10 18 10 18
                     C8 17.5 5.5 15 5.5 12.5 C5.5 7.5 12 6 12 2 Z
                     M14 12 C16 13 17 15 17 17 C17 19.5 14.8 21.5 12 21.5 C9.2 21.5 7 19.5 7 17
                     C7 15.8 7.5 14.5 8.5 13.5 C8.5 15.5 9.5 17 11 17 C13 17 14 15 14 12 Z"
                fill="currentColor"/>
        </svg>`,
        // ceasefire / truce — peace dove (simplified)
        ceasefire: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <path d="M4 14 C4 10 7 8 11 8 L13 8 L16 5 L17 5 L17 7.5 L20 7.5
                     C20 10 18 12 16 12.5 L14 17 L11 19 L9 19 L11 16 L8 16 L4 14 Z"
                fill="currentColor"/>
            <circle cx="16" cy="8.5" r="0.8" fill="rgba(0,0,0,0.5)"/>
        </svg>`,
        // chemical / biological / nuclear hazard — trefoil
        hazard: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <circle cx="12" cy="12" r="2.4" fill="currentColor"/>
            <path d="M12 2 C9 2 7 4 7 7 L11 9 C11.3 8.4 11.6 8.2 12 8.2 C12.4 8.2 12.7 8.4 13 9 L17 7 C17 4 15 2 12 2 Z"
                fill="currentColor"/>
            <path d="M21.5 16 C20 13.4 17.5 12 14.5 12 L14.5 16.4 C15 16.5 15.3 16.7 15.5 17 L19.5 19.5 C21 18.5 21.5 17.4 21.5 16 Z"
                fill="currentColor"/>
            <path d="M2.5 16 C2.5 17.4 3 18.5 4.5 19.5 L8.5 17 C8.7 16.7 9 16.5 9.5 16.4 L9.5 12 C6.5 12 4 13.4 2.5 16 Z"
                fill="currentColor"/>
        </svg>`,
        // ship / cargo — boat hull
        ship: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <path d="M2 16 L4 11 L20 11 L22 16 L20 20 L4 20 Z" fill="currentColor"/>
            <path d="M12 11 L12 4 L18 7 L12 7" fill="currentColor"/>
            <path d="M5 16 L19 16" stroke="rgba(0,0,0,0.45)" stroke-width="1" fill="none"/>
        </svg>`,
        // troops / casualties — figure
        troops: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <circle cx="12" cy="5.5" r="2.6" fill="currentColor"/>
            <path d="M7 22 L7 14 C7 11.8 9 10 12 10 C15 10 17 11.8 17 14 L17 22 L14 22 L14 16 L13 16 L13 22 L11 22 L11 16 L10 16 L10 22 Z"
                fill="currentColor"/>
        </svg>`,
        // strike (kinetic) — bolt
        strike: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <path d="M14 1.5 L4 13.5 L11 13.5 L9 22.5 L20 9.5 L13 9.5 Z" fill="currentColor"/>
        </svg>`,
        // generic — pin
        pin: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <path d="M12 1.5 C7.8 1.5 4.5 4.8 4.5 9 C4.5 14.5 12 22.5 12 22.5 C12 22.5 19.5 14.5 19.5 9 C19.5 4.8 16.2 1.5 12 1.5 Z"
                fill="currentColor"/>
            <circle cx="12" cy="9" r="2.6" fill="rgba(0,0,0,0.45)"/>
        </svg>`,
    };
    const CANONICAL_BY_CATEGORY = {
        military: 'combat',
        security: 'alert',
        damage: 'alert',
        health: 'hazard',
        transport: 'ship',
        infrastructure: 'alert',
        nature: 'alert',
        political: 'diplomatic',
        diplomatic: 'diplomatic',
        civil: 'protest',
        economic: 'pin',
        media: 'news',
        news: 'news',
        technology: 'pin',
        animals: 'pin',
        crisis: 'alert',
        resources: 'pin',
        other: 'pin',
    };
    // Localized labels for every event_type produced by events_engine.py — fed into
    // the news feed, map tooltips and dispersion labels via _translateEventLabel().
    // Keys must mirror events_engine.py:EVENT_TYPES; the EN fallback matches the
    // backend's `label` field 1:1.
    const EVENT_LABEL_I18N = {
        es: {
            transport_land:'Transporte terrestre',transport_rail:'Ferrocarril',transport_metro:'Metro',transport_air:'Tráfico aéreo',transport_airport:'Aeropuerto',transport_helicopter:'Helicóptero',transport_ship:'Buque / marítimo',transport_port:'Puerto',transport_accident:'Accidente',
            mil_strike:'Bombardeo aéreo',mil_missile:'Ataque con misil',mil_drone:'Dron / UAV',mil_artillery:'Artillería',mil_airdefense:'Defensa antiaérea',mil_troops:'Movimiento de tropas',mil_tank:'Blindados / tanques',mil_naval:'Operación naval',mil_base:'Base militar',mil_casualties:'Bajas',mil_pow:'Prisionero / captura',mil_ceasefire:'Alto el fuego',mil_exercise:'Ejercicio militar',mil_nuclear:'Incidente nuclear',
            sec_explosion:'Explosión',sec_shooting:'Tiroteo',sec_terror:'Atentado terrorista',sec_arrest:'Detención / redada',sec_hostage:'Toma de rehenes',sec_border:'Incidente fronterizo',sec_cyber:'Ciberataque',sec_sanction:'Sanciones',sec_protest:'Protesta',sec_riot:'Disturbios',sec_coup:'Golpe / levantamiento',sec_assassination:'Asesinato',sec_espionage:'Espionaje',sec_smuggling:'Contrabando',
            dmg_fire:'Incendio',dmg_collapse:'Colapso',dmg_building:'Daño a edificio',dmg_infrastructure:'Daño a infraestructura',
            hlt_outbreak:'Brote epidémico',hlt_hospital:'Hospital',hlt_chemical:'Químico / nuclear',hlt_ambulance:'Emergencia médica',
            nat_earthquake:'Terremoto',nat_flood:'Inundación',nat_storm:'Tormenta',nat_wildfire:'Incendio forestal',nat_volcano:'Volcán',nat_drought:'Sequía',nat_avalanche:'Avalancha',nat_tsunami:'Tsunami',nat_weather:'Tiempo severo',
            civ_election:'Elecciones',civ_diplomacy:'Diplomacia',civ_summit:'Cumbre',civ_treaty:'Tratado',civ_refugees:'Refugiados',civ_humanitarian:'Ayuda humanitaria',civ_law:'Tribunal',civ_strike:'Huelga laboral',civ_famine:'Hambruna',civ_migration:'Migración masiva',civ_massacre:'Masacre',
            inf_power:'Red eléctrica',inf_water:'Suministro de agua',inf_internet:'Comunicaciones',inf_pipeline:'Oleoducto',inf_bridge:'Puente',inf_road:'Carretera',inf_dam:'Represa',
            med_propaganda:'Propaganda',med_press:'Prensa',med_censorship:'Censura',med_social:'Redes sociales',
            res_oil:'Petróleo',res_gas:'Gas',res_food:'Alimentos',res_finance:'Finanzas',res_currency:'Divisas',res_mining:'Minería',res_trade:'Comercio',
            tec_ai:'IA / tecnología',tec_space:'Espacio',tec_rocket:'Lanzamiento de cohete',tec_science:'Ciencia',
            ani_wildlife:'Vida silvestre',ani_agriculture:'Agricultura',ani_environmental:'Medioambiente',
            eco_stockcrash:'Caída bursátil',eco_stocksurge:'Subida bursátil',eco_inflation:'Subida de inflación',eco_rate:'Tipos de interés',eco_oil_spike:'Subida del petróleo',eco_default:'Quiebra',
            generic_event:'Evento',
        },
        en: {
            transport_land:'Land transport',transport_rail:'Rail',transport_metro:'Metro',transport_air:'Air traffic',transport_airport:'Airport',transport_helicopter:'Helicopter',transport_ship:'Ship / maritime',transport_port:'Port',transport_accident:'Accident',
            mil_strike:'Airstrike / bombing',mil_missile:'Missile attack',mil_drone:'Drone / UAV',mil_artillery:'Artillery / shelling',mil_airdefense:'Air defense',mil_troops:'Troop movement',mil_tank:'Armor / tank',mil_naval:'Naval operation',mil_base:'Military base',mil_casualties:'Casualties',mil_pow:'POW / capture',mil_ceasefire:'Ceasefire / truce',mil_exercise:'Military exercise',mil_nuclear:'Nuclear incident',
            sec_explosion:'Explosion',sec_shooting:'Shooting',sec_terror:'Terror attack',sec_arrest:'Arrest / raid',sec_hostage:'Hostage situation',sec_border:'Border incident',sec_cyber:'Cyberattack',sec_sanction:'Sanctions',sec_protest:'Protest / rally',sec_riot:'Riot / clashes',sec_coup:'Coup / uprising',sec_assassination:'Assassination',sec_espionage:'Espionage',sec_smuggling:'Smuggling',
            dmg_fire:'Fire',dmg_collapse:'Collapse',dmg_building:'Building damage',dmg_infrastructure:'Infrastructure damage',
            hlt_outbreak:'Disease outbreak',hlt_hospital:'Hospital',hlt_chemical:'Chemical / nuclear',hlt_ambulance:'Emergency medical',
            nat_earthquake:'Earthquake',nat_flood:'Flood',nat_storm:'Storm',nat_wildfire:'Wildfire',nat_volcano:'Volcano',nat_drought:'Drought',nat_avalanche:'Avalanche',nat_tsunami:'Tsunami',nat_weather:'Severe weather',
            civ_election:'Election',civ_diplomacy:'Diplomacy',civ_summit:'Summit',civ_treaty:'Treaty',civ_refugees:'Refugees',civ_humanitarian:'Humanitarian aid',civ_law:'Court',civ_strike:'Labor strike',civ_famine:'Famine',civ_migration:'Mass migration',civ_massacre:'Massacre',
            inf_power:'Power grid',inf_water:'Water supply',inf_internet:'Comms',inf_pipeline:'Pipeline',inf_bridge:'Bridge',inf_road:'Road',inf_dam:'Dam',
            med_propaganda:'Propaganda',med_press:'Press',med_censorship:'Censorship',med_social:'Social media',
            res_oil:'Oil',res_gas:'Gas',res_food:'Food',res_finance:'Finance',res_currency:'Currency',res_mining:'Mining',res_trade:'Trade',
            tec_ai:'AI / technology',tec_space:'Space',tec_rocket:'Rocket launch',tec_science:'Science',
            ani_wildlife:'Wildlife',ani_agriculture:'Agriculture',ani_environmental:'Environmental',
            eco_stockcrash:'Stock market crash',eco_stocksurge:'Stock market surge',eco_inflation:'Inflation spike',eco_rate:'Interest rate',eco_oil_spike:'Oil price spike',eco_default:'Default',
            generic_event:'Event',
        },
        fr: {
            transport_land:'Transport routier',transport_rail:'Rail',transport_metro:'Métro',transport_air:'Trafic aérien',transport_airport:'Aéroport',transport_helicopter:'Hélicoptère',transport_ship:'Navire / maritime',transport_port:'Port',transport_accident:'Accident',
            mil_strike:'Frappe aérienne',mil_missile:'Tir de missile',mil_drone:'Drone / UAV',mil_artillery:'Artillerie',mil_airdefense:'Défense aérienne',mil_troops:'Mouvement de troupes',mil_tank:'Blindés / chars',mil_naval:'Opération navale',mil_base:'Base militaire',mil_casualties:'Victimes',mil_pow:'Prisonnier / capture',mil_ceasefire:'Cessez-le-feu',mil_exercise:'Exercice militaire',mil_nuclear:'Incident nucléaire',
            sec_explosion:'Explosion',sec_shooting:'Fusillade',sec_terror:'Attentat terroriste',sec_arrest:'Arrestation',sec_hostage:'Prise d\'otages',sec_border:'Incident frontalier',sec_cyber:'Cyberattaque',sec_sanction:'Sanctions',sec_protest:'Manifestation',sec_riot:'Émeute',sec_coup:'Coup d\'état',sec_assassination:'Assassinat',sec_espionage:'Espionnage',sec_smuggling:'Contrebande',
            dmg_fire:'Incendie',dmg_collapse:'Effondrement',dmg_building:'Bâtiment endommagé',dmg_infrastructure:'Infrastructure endommagée',
            hlt_outbreak:'Épidémie',hlt_hospital:'Hôpital',hlt_chemical:'Chimique / nucléaire',hlt_ambulance:'Urgence médicale',
            nat_earthquake:'Séisme',nat_flood:'Inondation',nat_storm:'Tempête',nat_wildfire:'Feu de forêt',nat_volcano:'Volcan',nat_drought:'Sécheresse',nat_avalanche:'Avalanche',nat_tsunami:'Tsunami',nat_weather:'Météo extrême',
            civ_election:'Élection',civ_diplomacy:'Diplomatie',civ_summit:'Sommet',civ_treaty:'Traité',civ_refugees:'Réfugiés',civ_humanitarian:'Aide humanitaire',civ_law:'Justice',civ_strike:'Grève',civ_famine:'Famine',civ_migration:'Migration de masse',civ_massacre:'Massacre',
            inf_power:'Réseau électrique',inf_water:'Eau potable',inf_internet:'Communications',inf_pipeline:'Oléoduc',inf_bridge:'Pont',inf_road:'Route',inf_dam:'Barrage',
            med_propaganda:'Propagande',med_press:'Presse',med_censorship:'Censure',med_social:'Réseaux sociaux',
            res_oil:'Pétrole',res_gas:'Gaz',res_food:'Alimentation',res_finance:'Finance',res_currency:'Devises',res_mining:'Mines',res_trade:'Commerce',
            tec_ai:'IA / technologie',tec_space:'Espace',tec_rocket:'Lancement de fusée',tec_science:'Science',
            ani_wildlife:'Faune',ani_agriculture:'Agriculture',ani_environmental:'Environnement',
            eco_stockcrash:'Krach boursier',eco_stocksurge:'Envolée boursière',eco_inflation:'Pic d\'inflation',eco_rate:'Taux d\'intérêt',eco_oil_spike:'Flambée du pétrole',eco_default:'Défaut / faillite',
            generic_event:'Événement',
        },
        ru: {
            transport_land:'Наземный транспорт',transport_rail:'Ж/Д',transport_metro:'Метро',transport_air:'Авиатрафик',transport_airport:'Аэропорт',transport_helicopter:'Вертолёт',transport_ship:'Судно',transport_port:'Порт',transport_accident:'Авария',
            mil_strike:'Авиаудар',mil_missile:'Ракетный удар',mil_drone:'Беспилотник',mil_artillery:'Артобстрел',mil_airdefense:'ПВО',mil_troops:'Движение войск',mil_tank:'Бронетехника',mil_naval:'Морская операция',mil_base:'Военная база',mil_casualties:'Потери',mil_pow:'Пленные',mil_ceasefire:'Перемирие',mil_exercise:'Военные учения',mil_nuclear:'Ядерный инцидент',
            sec_explosion:'Взрыв',sec_shooting:'Стрельба',sec_terror:'Теракт',sec_arrest:'Арест',sec_hostage:'Заложники',sec_border:'Пограничный инцидент',sec_cyber:'Кибератака',sec_sanction:'Санкции',sec_protest:'Протест',sec_riot:'Беспорядки',sec_coup:'Переворот',sec_assassination:'Убийство',sec_espionage:'Шпионаж',sec_smuggling:'Контрабанда',
            dmg_fire:'Пожар',dmg_collapse:'Обрушение',dmg_building:'Ущерб зданию',dmg_infrastructure:'Ущерб инфраструктуре',
            hlt_outbreak:'Эпидемия',hlt_hospital:'Больница',hlt_chemical:'Химическое / ядерное',hlt_ambulance:'Скорая помощь',
            nat_earthquake:'Землетрясение',nat_flood:'Наводнение',nat_storm:'Шторм',nat_wildfire:'Лесной пожар',nat_volcano:'Вулкан',nat_drought:'Засуха',nat_avalanche:'Лавина',nat_tsunami:'Цунами',nat_weather:'Стихия',
            civ_election:'Выборы',civ_diplomacy:'Дипломатия',civ_summit:'Саммит',civ_treaty:'Договор',civ_refugees:'Беженцы',civ_humanitarian:'Гум. помощь',civ_law:'Суд',civ_strike:'Забастовка',civ_famine:'Голод',civ_migration:'Массовая миграция',civ_massacre:'Резня',
            inf_power:'Энергосеть',inf_water:'Водоснабжение',inf_internet:'Связь',inf_pipeline:'Трубопровод',inf_bridge:'Мост',inf_road:'Дорога',inf_dam:'Плотина',
            med_propaganda:'Пропаганда',med_press:'Пресса',med_censorship:'Цензура',med_social:'Соцсети',
            res_oil:'Нефть',res_gas:'Газ',res_food:'Продовольствие',res_finance:'Финансы',res_currency:'Валюта',res_mining:'Добыча',res_trade:'Торговля',
            tec_ai:'ИИ / технологии',tec_space:'Космос',tec_rocket:'Запуск ракеты',tec_science:'Наука',
            ani_wildlife:'Дикая природа',ani_agriculture:'Сельхоз',ani_environmental:'Экология',
            eco_stockcrash:'Обвал рынков',eco_stocksurge:'Рост рынков',eco_inflation:'Скачок инфляции',eco_rate:'Ставка',eco_oil_spike:'Скачок нефти',eco_default:'Дефолт',
            generic_event:'Событие',
        },
        zh: {
            transport_land:'陆运',transport_rail:'铁路',transport_metro:'地铁',transport_air:'空中交通',transport_airport:'机场',transport_helicopter:'直升机',transport_ship:'船舶',transport_port:'港口',transport_accident:'事故',
            mil_strike:'空袭',mil_missile:'导弹袭击',mil_drone:'无人机',mil_artillery:'炮击',mil_airdefense:'防空',mil_troops:'部队调动',mil_tank:'装甲/坦克',mil_naval:'海军行动',mil_base:'军事基地',mil_casualties:'伤亡',mil_pow:'战俘',mil_ceasefire:'停火',mil_exercise:'军演',mil_nuclear:'核事件',
            sec_explosion:'爆炸',sec_shooting:'枪击',sec_terror:'恐袭',sec_arrest:'逮捕',sec_hostage:'人质',sec_border:'边境事件',sec_cyber:'网络攻击',sec_sanction:'制裁',sec_protest:'抗议',sec_riot:'骚乱',sec_coup:'政变',sec_assassination:'暗杀',sec_espionage:'间谍',sec_smuggling:'走私',
            dmg_fire:'火灾',dmg_collapse:'倒塌',dmg_building:'建筑损毁',dmg_infrastructure:'基础设施损毁',
            hlt_outbreak:'疫情',hlt_hospital:'医院',hlt_chemical:'化学/核',hlt_ambulance:'医疗急救',
            nat_earthquake:'地震',nat_flood:'洪水',nat_storm:'风暴',nat_wildfire:'野火',nat_volcano:'火山',nat_drought:'干旱',nat_avalanche:'雪崩',nat_tsunami:'海啸',nat_weather:'恶劣天气',
            civ_election:'选举',civ_diplomacy:'外交',civ_summit:'峰会',civ_treaty:'条约',civ_refugees:'难民',civ_humanitarian:'人道援助',civ_law:'法庭',civ_strike:'罢工',civ_famine:'饥荒',civ_migration:'大规模移民',civ_massacre:'屠杀',
            inf_power:'电网',inf_water:'供水',inf_internet:'通信',inf_pipeline:'管道',inf_bridge:'桥梁',inf_road:'道路',inf_dam:'水坝',
            med_propaganda:'宣传',med_press:'媒体',med_censorship:'审查',med_social:'社交媒体',
            res_oil:'石油',res_gas:'天然气',res_food:'粮食',res_finance:'金融',res_currency:'货币',res_mining:'采矿',res_trade:'贸易',
            tec_ai:'人工智能/科技',tec_space:'太空',tec_rocket:'火箭发射',tec_science:'科学',
            ani_wildlife:'野生动物',ani_agriculture:'农业',ani_environmental:'环境',
            eco_stockcrash:'股市崩盘',eco_stocksurge:'股市暴涨',eco_inflation:'通胀飙升',eco_rate:'利率',eco_oil_spike:'油价飙升',eco_default:'违约',
            generic_event:'事件',
        },
        tr: {
            transport_land:'Kara taşımacılığı',transport_rail:'Demiryolu',transport_metro:'Metro',transport_air:'Hava trafiği',transport_airport:'Havalimanı',transport_helicopter:'Helikopter',transport_ship:'Gemi',transport_port:'Liman',transport_accident:'Kaza',
            mil_strike:'Hava saldırısı',mil_missile:'Füze saldırısı',mil_drone:'İHA',mil_artillery:'Topçu',mil_airdefense:'Hava savunması',mil_troops:'Asker hareketi',mil_tank:'Zırhlı / tank',mil_naval:'Deniz operasyonu',mil_base:'Askeri üs',mil_casualties:'Kayıplar',mil_pow:'Esir',mil_ceasefire:'Ateşkes',mil_exercise:'Tatbikat',mil_nuclear:'Nükleer olay',
            sec_explosion:'Patlama',sec_shooting:'Silahlı saldırı',sec_terror:'Terör saldırısı',sec_arrest:'Tutuklama',sec_hostage:'Rehine',sec_border:'Sınır olayı',sec_cyber:'Siber saldırı',sec_sanction:'Yaptırımlar',sec_protest:'Protesto',sec_riot:'Ayaklanma',sec_coup:'Darbe',sec_assassination:'Suikast',sec_espionage:'Casusluk',sec_smuggling:'Kaçakçılık',
            dmg_fire:'Yangın',dmg_collapse:'Çökme',dmg_building:'Bina hasarı',dmg_infrastructure:'Altyapı hasarı',
            hlt_outbreak:'Salgın',hlt_hospital:'Hastane',hlt_chemical:'Kimyasal / nükleer',hlt_ambulance:'Tıbbi acil',
            nat_earthquake:'Deprem',nat_flood:'Sel',nat_storm:'Fırtına',nat_wildfire:'Orman yangını',nat_volcano:'Yanardağ',nat_drought:'Kuraklık',nat_avalanche:'Çığ',nat_tsunami:'Tsunami',nat_weather:'Şiddetli hava',
            civ_election:'Seçim',civ_diplomacy:'Diplomasi',civ_summit:'Zirve',civ_treaty:'Antlaşma',civ_refugees:'Mülteciler',civ_humanitarian:'İnsani yardım',civ_law:'Mahkeme',civ_strike:'Grev',civ_famine:'Kıtlık',civ_migration:'Kitlesel göç',civ_massacre:'Katliam',
            inf_power:'Elektrik şebekesi',inf_water:'Su',inf_internet:'İletişim',inf_pipeline:'Boru hattı',inf_bridge:'Köprü',inf_road:'Yol',inf_dam:'Baraj',
            med_propaganda:'Propaganda',med_press:'Basın',med_censorship:'Sansür',med_social:'Sosyal medya',
            res_oil:'Petrol',res_gas:'Gaz',res_food:'Gıda',res_finance:'Finans',res_currency:'Döviz',res_mining:'Madencilik',res_trade:'Ticaret',
            tec_ai:'YZ / teknoloji',tec_space:'Uzay',tec_rocket:'Roket fırlatma',tec_science:'Bilim',
            ani_wildlife:'Yaban hayatı',ani_agriculture:'Tarım',ani_environmental:'Çevre',
            eco_stockcrash:'Borsa çöküşü',eco_stocksurge:'Borsa yükselişi',eco_inflation:'Enflasyon sıçraması',eco_rate:'Faiz',eco_oil_spike:'Petrol sıçraması',eco_default:'Temerrüt',
            generic_event:'Olay',
        },
        ar: {
            transport_land:'النقل البري',transport_rail:'السكك الحديدية',transport_metro:'المترو',transport_air:'حركة الطيران',transport_airport:'مطار',transport_helicopter:'مروحية',transport_ship:'سفينة',transport_port:'ميناء',transport_accident:'حادث',
            mil_strike:'غارة جوية',mil_missile:'هجوم صاروخي',mil_drone:'طائرة مسيّرة',mil_artillery:'قصف مدفعي',mil_airdefense:'دفاع جوي',mil_troops:'تحرك قوات',mil_tank:'مدرعات / دبابات',mil_naval:'عملية بحرية',mil_base:'قاعدة عسكرية',mil_casualties:'إصابات',mil_pow:'أسرى',mil_ceasefire:'وقف إطلاق النار',mil_exercise:'مناورة عسكرية',mil_nuclear:'حادث نووي',
            sec_explosion:'انفجار',sec_shooting:'إطلاق نار',sec_terror:'هجوم إرهابي',sec_arrest:'اعتقال',sec_hostage:'احتجاز رهائن',sec_border:'حادث حدودي',sec_cyber:'هجوم إلكتروني',sec_sanction:'عقوبات',sec_protest:'احتجاج',sec_riot:'أعمال شغب',sec_coup:'انقلاب',sec_assassination:'اغتيال',sec_espionage:'تجسس',sec_smuggling:'تهريب',
            dmg_fire:'حريق',dmg_collapse:'انهيار',dmg_building:'تضرر مبنى',dmg_infrastructure:'تضرر البنية التحتية',
            hlt_outbreak:'تفشي مرض',hlt_hospital:'مستشفى',hlt_chemical:'كيميائي / نووي',hlt_ambulance:'طوارئ طبية',
            nat_earthquake:'زلزال',nat_flood:'فيضان',nat_storm:'عاصفة',nat_wildfire:'حريق غابات',nat_volcano:'بركان',nat_drought:'جفاف',nat_avalanche:'انهيار جليدي',nat_tsunami:'تسونامي',nat_weather:'طقس قاسٍ',
            civ_election:'انتخابات',civ_diplomacy:'دبلوماسية',civ_summit:'قمة',civ_treaty:'معاهدة',civ_refugees:'لاجئون',civ_humanitarian:'مساعدات إنسانية',civ_law:'محكمة',civ_strike:'إضراب',civ_famine:'مجاعة',civ_migration:'هجرة جماعية',civ_massacre:'مجزرة',
            inf_power:'شبكة الكهرباء',inf_water:'المياه',inf_internet:'الاتصالات',inf_pipeline:'خط أنابيب',inf_bridge:'جسر',inf_road:'طريق',inf_dam:'سد',
            med_propaganda:'دعاية',med_press:'صحافة',med_censorship:'رقابة',med_social:'وسائل التواصل',
            res_oil:'النفط',res_gas:'الغاز',res_food:'الغذاء',res_finance:'المال',res_currency:'العملة',res_mining:'التعدين',res_trade:'التجارة',
            tec_ai:'الذكاء الاصطناعي',tec_space:'الفضاء',tec_rocket:'إطلاق صاروخ',tec_science:'العلوم',
            ani_wildlife:'الحياة البرية',ani_agriculture:'الزراعة',ani_environmental:'البيئة',
            eco_stockcrash:'انهيار البورصة',eco_stocksurge:'صعود البورصة',eco_inflation:'موجة تضخم',eco_rate:'الفائدة',eco_oil_spike:'ارتفاع النفط',eco_default:'تخلف عن السداد',
            generic_event:'حدث',
        },
        fa: {
            transport_land:'حمل‌ونقل زمینی',transport_rail:'ریلی',transport_metro:'مترو',transport_air:'ترافیک هوایی',transport_airport:'فرودگاه',transport_helicopter:'بالگرد',transport_ship:'کشتی',transport_port:'بندر',transport_accident:'تصادف',
            mil_strike:'حمله هوایی',mil_missile:'حمله موشکی',mil_drone:'پهپاد',mil_artillery:'توپخانه',mil_airdefense:'پدافند هوایی',mil_troops:'جابجایی نیروها',mil_tank:'زرهی / تانک',mil_naval:'عملیات دریایی',mil_base:'پایگاه نظامی',mil_casualties:'تلفات',mil_pow:'اسیر',mil_ceasefire:'آتش‌بس',mil_exercise:'مانور',mil_nuclear:'حادثه هسته‌ای',
            sec_explosion:'انفجار',sec_shooting:'تیراندازی',sec_terror:'حمله تروریستی',sec_arrest:'بازداشت',sec_hostage:'گروگان‌گیری',sec_border:'حادثه مرزی',sec_cyber:'حمله سایبری',sec_sanction:'تحریم‌ها',sec_protest:'اعتراض',sec_riot:'شورش',sec_coup:'کودتا',sec_assassination:'ترور',sec_espionage:'جاسوسی',sec_smuggling:'قاچاق',
            dmg_fire:'آتش‌سوزی',dmg_collapse:'ریزش',dmg_building:'خسارت ساختمان',dmg_infrastructure:'خسارت زیرساختی',
            hlt_outbreak:'شیوع بیماری',hlt_hospital:'بیمارستان',hlt_chemical:'شیمیایی / هسته‌ای',hlt_ambulance:'اورژانس',
            nat_earthquake:'زلزله',nat_flood:'سیل',nat_storm:'طوفان',nat_wildfire:'آتش‌سوزی جنگل',nat_volcano:'آتشفشان',nat_drought:'خشک‌سالی',nat_avalanche:'بهمن',nat_tsunami:'سونامی',nat_weather:'هوای شدید',
            civ_election:'انتخابات',civ_diplomacy:'دیپلماسی',civ_summit:'نشست',civ_treaty:'پیمان',civ_refugees:'پناهجویان',civ_humanitarian:'کمک بشردوستانه',civ_law:'دادگاه',civ_strike:'اعتصاب',civ_famine:'قحطی',civ_migration:'مهاجرت گسترده',civ_massacre:'کشتار',
            inf_power:'شبکه برق',inf_water:'آب',inf_internet:'مخابرات',inf_pipeline:'خط لوله',inf_bridge:'پل',inf_road:'جاده',inf_dam:'سد',
            med_propaganda:'تبلیغات',med_press:'رسانه',med_censorship:'سانسور',med_social:'شبکه‌های اجتماعی',
            res_oil:'نفت',res_gas:'گاز',res_food:'غذا',res_finance:'مالی',res_currency:'ارز',res_mining:'معدن',res_trade:'تجارت',
            tec_ai:'هوش مصنوعی / فناوری',tec_space:'فضا',tec_rocket:'پرتاب موشک',tec_science:'علم',
            ani_wildlife:'حیات وحش',ani_agriculture:'کشاورزی',ani_environmental:'محیط زیست',
            eco_stockcrash:'سقوط بورس',eco_stocksurge:'صعود بورس',eco_inflation:'جهش تورم',eco_rate:'نرخ بهره',eco_oil_spike:'جهش نفت',eco_default:'ورشکستگی',
            generic_event:'رویداد',
        },
        he: {
            transport_land:'תחבורה יבשתית',transport_rail:'רכבת',transport_metro:'רכבת תחתית',transport_air:'תעבורת אוויר',transport_airport:'נמל תעופה',transport_helicopter:'מסוק',transport_ship:'אונייה',transport_port:'נמל',transport_accident:'תאונה',
            mil_strike:'תקיפה אווירית',mil_missile:'מתקפת טילים',mil_drone:'מל"ט',mil_artillery:'הפגזה',mil_airdefense:'הגנה אווירית',mil_troops:'תנועת כוחות',mil_tank:'שריון / טנק',mil_naval:'מבצע ימי',mil_base:'בסיס צבאי',mil_casualties:'נפגעים',mil_pow:'שבוי',mil_ceasefire:'הפסקת אש',mil_exercise:'תרגיל צבאי',mil_nuclear:'תקרית גרעינית',
            sec_explosion:'פיצוץ',sec_shooting:'ירי',sec_terror:'פיגוע טרור',sec_arrest:'מעצר',sec_hostage:'בני ערובה',sec_border:'תקרית גבול',sec_cyber:'מתקפת סייבר',sec_sanction:'סנקציות',sec_protest:'הפגנה',sec_riot:'מהומות',sec_coup:'הפיכה',sec_assassination:'התנקשות',sec_espionage:'ריגול',sec_smuggling:'הברחה',
            dmg_fire:'שריפה',dmg_collapse:'קריסה',dmg_building:'נזק לבניין',dmg_infrastructure:'נזק לתשתית',
            hlt_outbreak:'התפרצות מחלה',hlt_hospital:'בית חולים',hlt_chemical:'כימי / גרעיני',hlt_ambulance:'חירום רפואי',
            nat_earthquake:'רעידת אדמה',nat_flood:'שיטפון',nat_storm:'סופה',nat_wildfire:'שריפת יער',nat_volcano:'הר געש',nat_drought:'בצורת',nat_avalanche:'מפולת',nat_tsunami:'צונאמי',nat_weather:'מזג אוויר קיצוני',
            civ_election:'בחירות',civ_diplomacy:'דיפלומטיה',civ_summit:'ועידה',civ_treaty:'הסכם',civ_refugees:'פליטים',civ_humanitarian:'סיוע הומניטרי',civ_law:'בית משפט',civ_strike:'שביתה',civ_famine:'רעב',civ_migration:'הגירה המונית',civ_massacre:'טבח',
            inf_power:'רשת חשמל',inf_water:'אספקת מים',inf_internet:'תקשורת',inf_pipeline:'צינור',inf_bridge:'גשר',inf_road:'כביש',inf_dam:'סכר',
            med_propaganda:'תעמולה',med_press:'עיתונות',med_censorship:'צנזורה',med_social:'מדיה חברתית',
            res_oil:'נפט',res_gas:'גז',res_food:'מזון',res_finance:'פיננסים',res_currency:'מטבע',res_mining:'כרייה',res_trade:'מסחר',
            tec_ai:'בינה מלאכותית',tec_space:'חלל',tec_rocket:'שיגור רקטה',tec_science:'מדע',
            ani_wildlife:'חיות בר',ani_agriculture:'חקלאות',ani_environmental:'סביבה',
            eco_stockcrash:'התרסקות בורסה',eco_stocksurge:'זינוק בורסה',eco_inflation:'זינוק אינפלציה',eco_rate:'ריבית',eco_oil_spike:'זינוק נפט',eco_default:'חדלות פירעון',
            generic_event:'אירוע',
        },
    };
    function _translateEventLabel(ev) {
        if (!ev) return '';
        const tbl = EVENT_LABEL_I18N[currentLang] || EVENT_LABEL_I18N.en;
        return tbl[ev.event_type] || ev.event_label || '';
    }
    const MEASURE_STYLE = {
        color: '#00e5ff', weight: 2.5, opacity: 0.95,
        lineCap: 'round', lineJoin: 'round', className: 'measure-stroke'
    };
    const MEASURE_POLY_STYLE = {
        color: '#00e5ff', fillColor: '#00e5ff', fillOpacity: 0.14, weight: 2.5,
        lineCap: 'round', lineJoin: 'round', className: 'measure-stroke'
    };
    const ICON_HTML_CACHE_MAX = 600;
    const MAX_NEWS_RENDER = 200;
    const MAX_NEWS_KEEP   = 600;
    const LOC_NATIVE = {
        'Kyiv': 'Київ', 'Kharkiv': 'Харків', 'Odesa': 'Одеса', 'Lviv': 'Львів',
        'Mariupol': 'Маріуполь', 'Bakhmut': 'Бахмут', 'Dnipro': 'Дніпро',
        'Kherson': 'Херсон', 'Zaporizhzhia': 'Запоріжжя', 'Sumy': 'Суми',
        'Chernihiv': 'Чернігів', 'Kramatorsk': 'Краматорськ', 'Avdiivka': 'Авдіївка',
        'Moscow': 'Москва', 'Belgorod': 'Белгород', 'Kursk': 'Курск',
        'Minsk': 'Мінск', 'Warsaw': 'Warszawa', 'Vilnius': 'Vilnius',
        'Gaza': 'غزة', 'Gaza City': 'غزة', 'Rafah': 'رفح', 'Khan Yunis': 'خان يونس',
        'Beirut': 'بيروت', 'Damascus': 'دمشق', 'Aleppo': 'حلب',
        'Baghdad': 'بغداد', 'Tehran': 'تهران', 'Sanaa': 'صنعاء',
        'Riyadh': 'الرياض', 'Cairo': 'القاهرة', 'Tripoli': 'طرابلس',
        'Beijing': '北京', 'Shanghai': '上海', 'Taipei': '台北',
        'Pyongyang': '평양', 'Seoul': '서울', 'Tokyo': '東京',
        'Kabul': 'کابل', 'Islamabad': 'اسلام آباد', 'Karachi': 'کراچی',
    };
    const ROADS_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const CITY_LABELS_URL = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_populated_places_simple.geojson';
    const COUNTRY_LABELS_URL = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson';
    const LABEL_THEME_FOR_BASE = { satellite: 'dark', terrain: 'dark', dark: 'dark', light: 'light' };
    const MISSILE_COLORS = {
        ballistic: '#ff5a36',   // orange-red
        cruise: '#36aaff',   // sky blue
        hypersonic: '#c040ff',   // purple
        tactical: '#ffd040',   // yellow
    };
    const COUNTRY_INFO_DATA = [
        { name: 'United States', gfp: 1, mil_active: 1388100, mil_reserve: 845000, nukes: 5550, alliances: ['NATO','Five Eyes','AUKUS','Quad'], currency: 'USD', gdp_pc: 76330 },
        { name: 'Russia', gfp: 2, mil_active: 1330000, mil_reserve: 2000000, nukes: 6257, alliances: ['CSTO','CIS','SCO'], currency: 'RUB', gdp_pc: 12200 },
        { name: 'China', gfp: 3, mil_active: 2035000, mil_reserve: 510000, nukes: 410, alliances: ['SCO','BRICS'], currency: 'CNY', gdp_pc: 12720 },
        { name: 'India', gfp: 4, mil_active: 1455550, mil_reserve: 1155000, nukes: 164, alliances: ['Quad','BRICS','SCO'], currency: 'INR', gdp_pc: 2410 },
        { name: 'United Kingdom', gfp: 5, mil_active: 148500, mil_reserve: 37000, nukes: 225, alliances: ['NATO','Five Eyes','AUKUS','G7'], currency: 'GBP', gdp_pc: 46510 },
        { name: 'South Korea', gfp: 6, mil_active: 555000, mil_reserve: 3100000, nukes: 0, alliances: ['US Alliance'], currency: 'KRW', gdp_pc: 35990 },
        { name: 'Pakistan', gfp: 7, mil_active: 654000, mil_reserve: 550000, nukes: 170, alliances: ['SCO','OIC'], currency: 'PKR', gdp_pc: 1505 },
        { name: 'Japan', gfp: 8, mil_active: 247150, mil_reserve: 56000, nukes: 0, alliances: ['US Alliance','Quad','G7'], currency: 'JPY', gdp_pc: 39240 },
        { name: 'France', gfp: 9, mil_active: 205000, mil_reserve: 35000, nukes: 290, alliances: ['NATO','EU','G7'], currency: 'EUR', gdp_pc: 43518 },
        { name: 'Italy', gfp: 10, mil_active: 165500, mil_reserve: 18300, nukes: 0, alliances: ['NATO','EU','G7'], currency: 'EUR', gdp_pc: 34776 },
        { name: 'Turkey', gfp: 11, mil_active: 355200, mil_reserve: 378700, nukes: 0, alliances: ['NATO'], currency: 'TRY', gdp_pc: 10616 },
        { name: 'Brazil', gfp: 12, mil_active: 366500, mil_reserve: 1340000, nukes: 0, alliances: ['BRICS','Mercosur'], currency: 'BRL', gdp_pc: 8917 },
        { name: 'Germany', gfp: 13, mil_active: 184000, mil_reserve: 15000, nukes: 0, alliances: ['NATO','EU','G7'], currency: 'EUR', gdp_pc: 51203 },
        { name: 'Egypt', gfp: 14, mil_active: 440000, mil_reserve: 479000, nukes: 0, alliances: ['Arab League'], currency: 'EGP', gdp_pc: 3699 },
        { name: 'Australia', gfp: 15, mil_active: 59000, mil_reserve: 29560, nukes: 0, alliances: ['Five Eyes','AUKUS','Quad'], currency: 'AUD', gdp_pc: 63529 },
        { name: 'Israel', gfp: 18, mil_active: 173600, mil_reserve: 465000, nukes: 90, alliances: ['US Alliance'], currency: 'ILS', gdp_pc: 52170 },
        { name: 'Iran', gfp: 17, mil_active: 610000, mil_reserve: 350000, nukes: 0, alliances: ['SCO (observer)','Axis of Resistance'], currency: 'IRR', gdp_pc: 4150 },
        { name: 'Saudi Arabia', gfp: 22, mil_active: 257000, mil_reserve: 25000, nukes: 0, alliances: ['GCC','Arab League','OIC'], currency: 'SAR', gdp_pc: 27680 },
        { name: 'Ukraine', gfp: 15, mil_active: 900000, mil_reserve: 400000, nukes: 0, alliances: ['EU candidate'], currency: 'UAH', gdp_pc: 4270 },
        { name: 'North Korea', gfp: 34, mil_active: 1280000, mil_reserve: 600000, nukes: 50, alliances: ['China Alliance'], currency: 'KPW', gdp_pc: 642 },
        { name: 'Syria', gfp: 60, mil_active: 169000, mil_reserve: 108000, nukes: 0, alliances: ['Russia Alliance','Iran Axis'], currency: 'SYP', gdp_pc: 533 },
        { name: 'Iraq', gfp: 40, mil_active: 193000, mil_reserve: 0, nukes: 0, alliances: ['Arab League'], currency: 'IQD', gdp_pc: 5780 },
        { name: 'Yemen', gfp: 75, mil_active: 40000, mil_reserve: 0, nukes: 0, alliances: ['Arab League'], currency: 'YER', gdp_pc: 594 },
        { name: 'Lebanon', gfp: 115, mil_active: 80000, mil_reserve: 20000, nukes: 0, alliances: ['Arab League'], currency: 'LBP', gdp_pc: 3580 },
        { name: 'Jordan', gfp: 70, mil_active: 100700, mil_reserve: 65000, nukes: 0, alliances: ['Arab League','US Alliance'], currency: 'JOD', gdp_pc: 4400 },
        { name: 'Afghanistan', gfp: 0, mil_active: 150000, mil_reserve: 0, nukes: 0, alliances: [], currency: 'AFN', gdp_pc: 381 },
        { name: 'Taiwan', gfp: 21, mil_active: 163000, mil_reserve: 1657000, nukes: 0, alliances: ['US Alliance (informal)'], currency: 'TWD', gdp_pc: 33400 },
        { name: 'Mexico', gfp: 31, mil_active: 277000, mil_reserve: 81500, nukes: 0, alliances: ['USMCA'], currency: 'MXN', gdp_pc: 10046 },
        { name: 'Canada', gfp: 27, mil_active: 72000, mil_reserve: 27000, nukes: 0, alliances: ['NATO','Five Eyes','G7','USMCA'], currency: 'CAD', gdp_pc: 52051 },
    ];
    const DEFENSE_SYSTEMS = {
        'Iron Dome':       { pk: 0.90, vsBallistic: 0.85, vsCruise: 0.92, vsDrone: 0.95, magazine: 20, rangeKm: 70,   speed: 'Mach 2.2', engages: ['ROCKET','SRBM','CRUISE','DRONE'] },
        'Patriot PAC-3':   { pk: 0.85, vsBallistic: 0.85, vsCruise: 0.70, vsDrone: 0.55, magazine: 16, rangeKm: 160,  speed: 'Mach 4.1', engages: ['SRBM','MRBM','CRUISE','DRONE','ROCKET'] },
        'THAAD':           { pk: 0.97, vsBallistic: 0.97, vsCruise: 0.30, vsDrone: 0.20, magazine: 8,  rangeKm: 200,  speed: 'Mach 8.2', engages: ['SRBM','MRBM','IRBM','HYPERSONIC'] },
        'Arrow-3':         { pk: 0.90, vsBallistic: 0.92, vsCruise: 0.20, vsDrone: 0.10, magazine: 12, rangeKm: 2400, speed: 'Mach 9.0', engages: ['MRBM','IRBM','ICBM','SLBM','HYPERSONIC'] },
        'Arrow-2':         { pk: 0.85, vsBallistic: 0.85, vsCruise: 0.25, vsDrone: 0.15, magazine: 14, rangeKm: 150,  speed: 'Mach 9.0', engages: ['SRBM','MRBM','IRBM'] },
        "David's Sling":   { pk: 0.85, vsBallistic: 0.78, vsCruise: 0.85, vsDrone: 0.70, magazine: 16, rangeKm: 300,  speed: 'Mach 7.5', engages: ['SRBM','MRBM','CRUISE','DRONE'] },
        'S-400':           { pk: 0.80, vsBallistic: 0.75, vsCruise: 0.85, vsDrone: 0.80, magazine: 24, rangeKm: 400,  speed: 'Mach 14',  engages: ['SRBM','MRBM','IRBM','CRUISE','DRONE','HYPERSONIC'] },
        'S-300':           { pk: 0.70, vsBallistic: 0.60, vsCruise: 0.78, vsDrone: 0.70, magazine: 24, rangeKm: 150,  speed: 'Mach 5.5', engages: ['SRBM','CRUISE','DRONE'] },
        'S-500':           { pk: 0.92, vsBallistic: 0.92, vsCruise: 0.85, vsDrone: 0.80, magazine: 16, rangeKm: 600,  speed: 'Mach 18',  engages: ['SRBM','MRBM','IRBM','ICBM','SLBM','CRUISE','DRONE','HYPERSONIC'] },
        'Pantsir-S1':      { pk: 0.78, vsBallistic: 0.20, vsCruise: 0.78, vsDrone: 0.85, magazine: 24, rangeKm: 30,   speed: 'Mach 2.8', engages: ['CRUISE','DRONE','ROCKET'] },
        'HQ-19':           { pk: 0.80, vsBallistic: 0.85, vsCruise: 0.55, vsDrone: 0.40, magazine: 16, rangeKm: 1000, speed: 'Mach 10',  engages: ['MRBM','IRBM','ICBM','HYPERSONIC'] },
        'HQ-9':            { pk: 0.72, vsBallistic: 0.55, vsCruise: 0.78, vsDrone: 0.65, magazine: 32, rangeKm: 200,  speed: 'Mach 4.2', engages: ['SRBM','CRUISE','DRONE'] },
        'Aster 30':        { pk: 0.78, vsBallistic: 0.65, vsCruise: 0.92, vsDrone: 0.85, magazine: 16, rangeKm: 120,  speed: 'Mach 4.5', engages: ['SRBM','CRUISE','DRONE'] },
        'Sea Ceptor':      { pk: 0.82, vsBallistic: 0.10, vsCruise: 0.88, vsDrone: 0.90, magazine: 24, rangeKm: 60,   speed: 'Mach 3.0', engages: ['CRUISE','DRONE'] },
        'AAD':             { pk: 0.70, vsBallistic: 0.78, vsCruise: 0.30, vsDrone: 0.15, magazine: 12, rangeKm: 200,  speed: 'Mach 4.5', engages: ['SRBM','MRBM','IRBM'] },
        'Akash':           { pk: 0.65, vsBallistic: 0.20, vsCruise: 0.70, vsDrone: 0.78, magazine: 24, rangeKm: 45,   speed: 'Mach 2.5', engages: ['CRUISE','DRONE'] },
        'HQ-16':           { pk: 0.65, vsBallistic: 0.25, vsCruise: 0.72, vsDrone: 0.75, magazine: 24, rangeKm: 70,   speed: 'Mach 3.5', engages: ['CRUISE','DRONE','SRBM'] },
        'Khordad 15':      { pk: 0.55, vsBallistic: 0.40, vsCruise: 0.60, vsDrone: 0.65, magazine: 12, rangeKm: 150,  speed: 'Mach 3.0', engages: ['SRBM','CRUISE','DRONE'] },
        'Bavar-373':       { pk: 0.62, vsBallistic: 0.55, vsCruise: 0.65, vsDrone: 0.60, magazine: 16, rangeKm: 300,  speed: 'Mach 4.0', engages: ['SRBM','MRBM','CRUISE','DRONE'] },
        'KN-06':           { pk: 0.40, vsBallistic: 0.20, vsCruise: 0.45, vsDrone: 0.55, magazine: 16, rangeKm: 150,  speed: 'Mach 2.5', engages: ['CRUISE','DRONE'] },
        'HİSAR-O+':        { pk: 0.72, vsBallistic: 0.20, vsCruise: 0.80, vsDrone: 0.85, magazine: 24, rangeKm: 25,   speed: 'Mach 4.0', engages: ['CRUISE','DRONE','ROCKET'] },
        'SİPER':           { pk: 0.78, vsBallistic: 0.65, vsCruise: 0.82, vsDrone: 0.78, magazine: 16, rangeKm: 150,  speed: 'Mach 4.0', engages: ['SRBM','CRUISE','DRONE'] },
    };
    const COUNTRY_DEFENSES = {
        usa:        ['THAAD', 'Patriot PAC-3', 'Aster 30'],
        israel:     ['Arrow-3', 'Arrow-2', "David's Sling", 'Iron Dome'],
        russia:     ['S-500', 'S-400', 'S-300', 'Pantsir-S1'],
        china:      ['HQ-19', 'HQ-9', 'HQ-16'],
        france:     ['Aster 30', 'Sea Ceptor'],
        uk:         ['Aster 30', 'Sea Ceptor'],
        india:      ['AAD', 'Akash'],
        pakistan:   ['HQ-9', 'HQ-16'],
        northkorea: ['KN-06', 'Pantsir-S1'],
        iran:       ['Bavar-373', 'Khordad 15'],
        turkey:     ['SİPER', 'HİSAR-O+'],
        houthis:    [],
        hezbollah:  ['Pantsir-S1'],
    };
    const ARSENAL_DATA = {
        iran: {
            name: 'Iran', flag: '🇮🇷',
            lat: 35.6892, lng: 51.3890,
            missile: [
                { name: 'Shahab-3', type: 'MRBM', range: 1300, warhead: '760 kg HE / nuclear-capable', speed: 'Mach 3.5', guidance: 'INS', payload: 'HE / Cluster / Nuclear' },
                { name: 'Ghadr-1', type: 'MRBM (Shahab var.)', range: 1800, warhead: '750 kg HE', speed: 'Mach 3.5', guidance: 'INS+TVM', payload: 'HE' },
                { name: 'Emad', type: 'MRBM (guided)', range: 1700, warhead: '750 kg HE', speed: 'Mach 3.5', guidance: 'INS+TVM', payload: 'HE' },
                { name: 'Khorramshahr', type: 'MRBM', range: 2000, warhead: '1800 kg MRV', speed: 'Mach 4', guidance: 'INS+GPS', payload: 'HE / MRV' },
                { name: 'Fattah', type: 'Hypersonic MRBM', range: 1400, warhead: 'N/A', speed: 'Mach 13+', guidance: 'Maneuvering RV', payload: 'HE' },
                { name: 'Sejjil', type: 'MRBM (solid fuel)', range: 2000, warhead: '750 kg HE', speed: 'Mach 4', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Kheibar Shekan', type: 'MRBM (solid fuel)', range: 2000, warhead: 'N/A', speed: 'Mach 4', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Zolfaghar', type: 'SRBM', range: 700, warhead: '450 kg HE', speed: 'Mach 4', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Dezful', type: 'SRBM', range: 1000, warhead: '450 kg HE', speed: 'Mach 4', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Qiam-1', type: 'SRBM', range: 800, warhead: '650 kg HE', speed: 'Mach 3', guidance: 'INS', payload: 'HE' },
                { name: 'Fateh-110', type: 'SRBM', range: 300, warhead: '450 kg HE', speed: 'Mach 3.5', guidance: 'INS+Terrain', payload: 'HE' },
                { name: 'Fateh-313', type: 'SRBM', range: 500, warhead: '450 kg HE', speed: 'Mach 3.5', guidance: 'INS+GPS', payload: 'HE' },
            ],
            drone: [
                { name: 'Shahed-136', type: 'Loitering Munition', range: 2500, warhead: '36 kg HE', speed: 'Mach 0.25', guidance: 'GPS+INS', payload: 'Shaped charge' },
                { name: 'Shahed-238', type: 'Jet Loitering Munition', range: 2000, warhead: '45 kg HE', speed: 'Mach 0.6', guidance: 'GPS+INS', payload: 'HE/Shaped charge' },
                { name: 'Arash-2', type: 'Kamikaze UAV', range: 2000, warhead: '50 kg HE', speed: 'Mach 0.4', guidance: 'GPS+INS', payload: 'HE' },
                { name: 'Shahed-129', type: 'MALE UCAV', range: 1700, warhead: '8× Sadid-1 ATM', speed: 'Mach 0.25', guidance: 'GPS+EO/IR', payload: 'PGM / Surveillance' },
                { name: 'Mohajer-6', type: 'Tactical UCAV', range: 200, warhead: '2× Qaem ATM', speed: 'Mach 0.22', guidance: 'GPS+EO/IR', payload: 'PGM / ISR' },
                { name: 'Mohajer-10', type: 'MALE UCAV', range: 2000, warhead: '300 kg payload', speed: 'Mach 0.35', guidance: 'GPS+EO/IR', payload: 'PGM / ISR' },
                { name: 'Karrar', type: 'Combat drone', range: 1000, warhead: '2× bombs', speed: 'Mach 0.8', guidance: 'GPS+Radar', payload: 'HE bombs / AAMs' },
                { name: 'Gaza', type: 'Cruise missile drone', range: 2000, warhead: 'HE', speed: 'Mach 0.7', guidance: 'GPS+INS', payload: 'HE' },
            ],
        },

        israel: {
            name: 'Israel', flag: '🇮🇱', lat: 31.7683, lng: 35.2137,
            missile: [
                { name: 'Jericho III', cat: 'ss', mtype: 'ballistic', type: 'ICBM', range: 8000, warhead: '750kg nuclear/MIRV', speed: 'Mach 18', guidance: 'INS', payload: 'nuclear' },
                { name: 'Jericho II', cat: 'ss', mtype: 'ballistic', type: 'MRBM', range: 1450, warhead: '500kg nuclear', speed: 'Mach 12', guidance: 'INS', payload: 'nuclear' },
                { name: 'LORA', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 430, warhead: '570kg HE/cluster', speed: 'Mach 5', guidance: 'INS+GPS+TV', payload: 'HE' },
                { name: 'EXTRA', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 150, warhead: '120kg HE', speed: 'Mach 3', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Predator Hawk', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 300, warhead: '140kg HE', speed: 'Mach 4', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Gabriel Mk.4', cat: 'ss', mtype: 'cruise', type: 'Anti-ship', range: 200, warhead: '100kg HE', speed: 'Mach 0.67', guidance: 'Active radar', payload: 'HE' },
                { name: 'Popeye Turbo', cat: 'as', mtype: 'cruise', type: 'ALCM', range: 320, warhead: '350kg HE', speed: 'Mach 0.85', guidance: 'INS+EO', payload: 'HE' },
                { name: 'Rampage', cat: 'as', mtype: 'cruise', type: 'ALCM', range: 250, warhead: '150kg HE', speed: 'Mach 0.85', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'ROCKS', cat: 'as', mtype: 'ballistic', type: 'ALBM', range: 800, warhead: '150kg penetration', speed: 'Mach 3', guidance: 'INS+GPS+EO', payload: 'penetration' },
                { name: 'Delilah', cat: 'as', mtype: 'cruise', type: 'Loitering', range: 200, warhead: '30kg HE', speed: 'Mach 0.3', guidance: 'INS+datalink', payload: 'HE' },
                { name: 'Arrow 3', cat: 'sa', mtype: 'hypersonic', type: 'ABM', range: 2400, warhead: 'Kinetic kill', speed: 'Mach 9', guidance: 'INS+radar', payload: 'kinetic' },
            ],
            drone: [],
        },

        northkorea: {
            name: 'North Korea', flag: '🇰🇵', lat: 39.0392, lng: 125.7625,
            missile: [
                { name: 'Hwasong-17', cat: 'ss', mtype: 'ballistic', type: 'ICBM', range: 15000, warhead: '2500kg nuclear/MIRV', speed: 'Mach 22', guidance: 'INS', payload: 'nuclear' },
                { name: 'Hwasong-18', cat: 'ss', mtype: 'ballistic', type: 'ICBM', range: 15000, warhead: '1500kg nuclear', speed: 'Mach 22', guidance: 'INS', payload: 'nuclear' },
                { name: 'Hwasong-15', cat: 'ss', mtype: 'ballistic', type: 'ICBM', range: 13000, warhead: '1000kg nuclear', speed: 'Mach 20', guidance: 'INS', payload: 'nuclear' },
                { name: 'Hwasong-14', cat: 'ss', mtype: 'ballistic', type: 'ICBM', range: 10000, warhead: '600kg nuclear', speed: 'Mach 18', guidance: 'INS', payload: 'nuclear' },
                { name: 'Pukguksong-5', cat: 'ss', mtype: 'ballistic', type: 'SLBM', range: 5000, warhead: '800kg nuclear', speed: 'Mach 16', guidance: 'INS', payload: 'nuclear' },
                { name: 'Pukguksong-3', cat: 'ss', mtype: 'ballistic', type: 'SLBM', range: 2000, warhead: '600kg nuclear', speed: 'Mach 12', guidance: 'INS', payload: 'nuclear' },
                { name: 'Pukguksong-1', cat: 'ss', mtype: 'ballistic', type: 'SLBM', range: 1200, warhead: '500kg nuclear', speed: 'Mach 10', guidance: 'INS', payload: 'nuclear' },
                { name: 'KN-23', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 690, warhead: '500kg nuclear/HE', speed: 'quasi-ballistic', guidance: 'INS', payload: 'nuclear/HE' },
                { name: 'KN-25', cat: 'ss', mtype: 'ballistic', type: 'MRBM', range: 380, warhead: '400kg HE/cluster', speed: 'Mach 4', guidance: 'INS', payload: 'HE' },
                { name: 'Hwasong-11A', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 900, warhead: '500kg nuclear', speed: 'Mach 7', guidance: 'INS', payload: 'nuclear/HE' },
            ],
            drone: [],
        },

        india: {
            name: 'India', flag: '🇮🇳', lat: 28.6139, lng: 77.2090,
            missile: [
                { name: 'Agni-V', cat: 'ss', mtype: 'ballistic', type: 'ICBM', range: 7000, warhead: '1200kg nuclear', speed: 'Mach 24', guidance: 'INS+GPS', payload: 'nuclear' },
                { name: 'Agni-IV', cat: 'ss', mtype: 'ballistic', type: 'IRBM', range: 4000, warhead: '1000kg nuclear', speed: 'Mach 19', guidance: 'INS+GPS', payload: 'nuclear' },
                { name: 'Agni-Prime', cat: 'ss', mtype: 'ballistic', type: 'MRBM', range: 2000, warhead: '800kg nuclear', speed: 'Mach 12', guidance: 'INS+GPS', payload: 'nuclear' },
                { name: 'Agni-II', cat: 'ss', mtype: 'ballistic', type: 'IRBM', range: 2500, warhead: '1000kg nuclear', speed: 'Mach 12', guidance: 'INS+GPS', payload: 'nuclear' },
                { name: 'Agni-I', cat: 'ss', mtype: 'ballistic', type: 'MRBM', range: 900, warhead: '1000kg nuclear', speed: 'Mach 7', guidance: 'INS+GPS', payload: 'nuclear' },
                { name: 'BrahMos', cat: 'ss', mtype: 'cruise', type: 'Cruise', range: 650, warhead: '200kg HE', speed: 'Mach 2.8', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'BrahMos-II', cat: 'ss', mtype: 'hypersonic', type: 'Hypersonic', range: 400, warhead: '250kg HE', speed: 'Mach 7', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Nirbhay', cat: 'ss', mtype: 'cruise', type: 'Cruise', range: 1000, warhead: '450kg HE/nuclear', speed: 'Mach 0.7', guidance: 'INS+GPS+TV', payload: 'HE' },
                { name: 'Prithvi-II', cat: 'ss', mtype: 'ballistic', type: 'MRBM', range: 350, warhead: '1000kg HE', speed: 'Mach 5', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Prahaar', cat: 'ss', mtype: 'tactical', type: 'SRBM', range: 150, warhead: '200kg HE', speed: 'Mach 4', guidance: 'INS+GPS', payload: 'HE' },
            ],
            drone: [],
        },

        pakistan: {
            name: 'Pakistan', flag: '🇵🇰', lat: 33.6844, lng: 73.0479,
            missile: [
                { name: 'Shaheen-III', cat: 'ss', mtype: 'ballistic', type: 'MRBM', range: 2750, warhead: '1200kg nuclear', speed: 'Mach 14', guidance: 'INS', payload: 'nuclear' },
                { name: 'Shaheen-II', cat: 'ss', mtype: 'ballistic', type: 'IRBM', range: 2500, warhead: '1000kg nuclear', speed: 'Mach 12', guidance: 'INS', payload: 'nuclear' },
                { name: 'Ghauri-II', cat: 'ss', mtype: 'ballistic', type: 'IRBM', range: 2300, warhead: '700kg nuclear', speed: 'Mach 10', guidance: 'INS', payload: 'nuclear' },
                { name: 'Shaheen-I', cat: 'ss', mtype: 'ballistic', type: 'MRBM', range: 900, warhead: '1000kg nuclear', speed: 'Mach 7', guidance: 'INS', payload: 'nuclear' },
                { name: 'Ghauri-I', cat: 'ss', mtype: 'ballistic', type: 'MRBM', range: 1500, warhead: '700kg nuclear', speed: 'Mach 8', guidance: 'INS', payload: 'nuclear' },
                { name: 'Babur-II', cat: 'ss', mtype: 'cruise', type: 'Cruise GLCM', range: 750, warhead: '450kg nuclear', speed: 'Mach 0.8', guidance: 'INS+GPS+TERCOM', payload: 'nuclear' },
                { name: 'Babur-III', cat: 'ss', mtype: 'cruise', type: 'SLCM', range: 450, warhead: '450kg nuclear', speed: 'Mach 0.8', guidance: 'INS+GPS', payload: 'nuclear' },
                { name: "Ra'ad-II", cat: 'as', mtype: 'cruise', type: 'ALCM', range: 600, warhead: '300kg nuclear', speed: 'Mach 0.9', guidance: 'INS+GPS', payload: 'nuclear' },
                { name: 'Nasr', cat: 'ss', mtype: 'tactical', type: 'SRBM', range: 65, warhead: '200kg nuclear', speed: 'Mach 4', guidance: 'INS', payload: 'nuclear' },
            ],
            drone: [],
        },

        china: {
            name: 'China', flag: '🇨🇳', lat: 39.9042, lng: 116.4074,
            missile: [
                { name: 'DF-41', cat: 'ss', mtype: 'ballistic', type: 'ICBM', range: 14000, warhead: '2500kg nuclear/MIRV', speed: 'Mach 25', guidance: 'INS+satellite', payload: 'nuclear' },
                { name: 'DF-31A', cat: 'ss', mtype: 'ballistic', type: 'ICBM', range: 11000, warhead: '1000kg nuclear', speed: 'Mach 22', guidance: 'INS', payload: 'nuclear' },
                { name: 'DF-5B', cat: 'ss', mtype: 'ballistic', type: 'ICBM', range: 13000, warhead: '3000kg nuclear/MIRV', speed: 'Mach 20', guidance: 'INS', payload: 'nuclear' },
                { name: 'DF-21D', cat: 'ss', mtype: 'ballistic', type: 'ASBM', range: 1500, warhead: '600kg HE/maneuvering', speed: 'Mach 10', guidance: 'INS+radar+seeker', payload: 'HE' },
                { name: 'DF-26', cat: 'ss', mtype: 'ballistic', type: 'IRBM', range: 4000, warhead: '1200kg nuclear/HE', speed: 'Mach 18', guidance: 'INS+GPS', payload: 'nuclear/HE' },
                { name: 'DF-17', cat: 'ss', mtype: 'hypersonic', type: 'HGV', range: 2500, warhead: '500kg HE', speed: 'Mach 10', guidance: 'INS+maneuvering', payload: 'HE' },
                { name: 'YJ-21', cat: 'ss', mtype: 'hypersonic', type: 'Anti-ship', range: 800, warhead: '400kg HE', speed: 'Mach 10', guidance: 'INS+seeker', payload: 'HE' },
                { name: 'CJ-10', cat: 'ss', mtype: 'cruise', type: 'Cruise GLCM', range: 2000, warhead: '500kg HE/nuclear', speed: 'Mach 0.75', guidance: 'INS+GPS+TERCOM', payload: 'nuclear/HE' },
                { name: 'YJ-18', cat: 'ss', mtype: 'cruise', type: 'Anti-ship', range: 540, warhead: '300kg HE', speed: 'Mach 2.5', guidance: 'INS+BeiDou+seeker', payload: 'HE' },
            ],
            drone: [],
        },

        usa: {
            name: 'United States', flag: '🇺🇸', lat: 38.9072, lng: -77.0369,
            missile: [
                { name: 'Minuteman III', cat: 'ss', mtype: 'ballistic', type: 'ICBM', range: 13000, warhead: '350kt nuclear', speed: 'Mach 23', guidance: 'INS+stellar', payload: 'nuclear' },
                { name: 'Trident II D5', cat: 'ss', mtype: 'ballistic', type: 'SLBM', range: 12000, warhead: '475kt nuclear/MIRV', speed: 'Mach 24', guidance: 'INS+stellar', payload: 'nuclear' },
                { name: 'Tomahawk', cat: 'ss', mtype: 'cruise', type: 'Cruise GLCM', range: 1600, warhead: '454kg HE', speed: 'Mach 0.7', guidance: 'INS+GPS+TERCOM+DSMAC', payload: 'HE/nuclear' },
                { name: 'ATACMS', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 300, warhead: '230kg HE', speed: 'Mach 3', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'JASSM-ER', cat: 'as', mtype: 'cruise', type: 'ALCM', range: 1000, warhead: '450kg penetration', speed: 'Mach 0.85', guidance: 'INS+GPS+IR', payload: 'penetration' },
                { name: 'Harpoon RGM-84', cat: 'ss', mtype: 'cruise', type: 'Anti-ship', range: 240, warhead: '221kg HE', speed: 'Mach 0.85', guidance: 'INS+radar', payload: 'HE' },
                { name: 'SM-3 Block IIA', cat: 'sa', mtype: 'hypersonic', type: 'ABM', range: 1200, warhead: 'Kinetic kill', speed: 'Mach 13', guidance: 'INS+terminal', payload: 'kinetic' },
                { name: 'Patriot PAC-3', cat: 'sa', mtype: 'tactical', type: 'SAM', range: 35, warhead: '24kg HE', speed: 'Mach 4', guidance: 'Radar command+seeker', payload: 'HE' },
            ],
            drone: [],
        },

        russia: {
            name: 'Russia', flag: '🇷🇺', lat: 55.7558, lng: 37.6173,
            missile: [
                { name: 'RS-28 Sarmat', cat: 'ss', mtype: 'ballistic', type: 'ICBM', range: 18000, warhead: '10000kg nuclear/MIRV', speed: 'Mach 25', guidance: 'INS+satellite', payload: 'nuclear' },
                { name: 'Topol-M', cat: 'ss', mtype: 'ballistic', type: 'ICBM', range: 11000, warhead: '1000kg nuclear', speed: 'Mach 22', guidance: 'INS', payload: 'nuclear' },
                { name: 'Yars RS-24', cat: 'ss', mtype: 'ballistic', type: 'ICBM', range: 11000, warhead: '1000kg nuclear/MIRV', speed: 'Mach 20', guidance: 'INS', payload: 'nuclear' },
                { name: 'Iskander-M', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 500, warhead: '700kg nuclear/HE', speed: 'Mach 6', guidance: 'INS+GLONASS+EO', payload: 'nuclear/HE' },
                { name: 'Kalibr-NK', cat: 'ss', mtype: 'cruise', type: 'Cruise', range: 2500, warhead: '450kg HE/nuclear', speed: 'Mach 0.8', guidance: 'INS+GLONASS+TERCOM', payload: 'HE/nuclear' },
                { name: '3M22 Zircon', cat: 'ss', mtype: 'hypersonic', type: 'Hypersonic', range: 1000, warhead: '400kg HE/nuclear', speed: 'Mach 9', guidance: 'INS+seeker', payload: 'HE' },
                { name: 'Kh-47M2 Kinzhal', cat: 'as', mtype: 'hypersonic', type: 'ALBM', range: 2000, warhead: '480kg nuclear/HE', speed: 'Mach 10', guidance: 'INS+terminal', payload: 'nuclear/HE' },
                { name: 'Kh-101', cat: 'as', mtype: 'cruise', type: 'ALCM', range: 2800, warhead: '400kg HE/nuclear', speed: 'Mach 0.78', guidance: 'INS+TERCOM+GLONASS', payload: 'HE/nuclear' },
                { name: 'S-400 40N6', cat: 'sa', mtype: 'ballistic', type: 'SAM', range: 400, warhead: '180kg HE', speed: 'Mach 6', guidance: 'Radar command', payload: 'HE' },
                { name: 'S-300 5V55', cat: 'sa', mtype: 'ballistic', type: 'SAM', range: 75, warhead: '133kg HE', speed: 'Mach 5', guidance: 'Radar command', payload: 'HE' },
            ],
            drone: [],
        },

        uk: {
            name: 'United Kingdom', flag: '🇬🇧', lat: 51.5074, lng: -0.1278,
            missile: [
                { name: 'Trident II D5', cat: 'ss', mtype: 'ballistic', type: 'SLBM', range: 12000, warhead: '475kt nuclear/MIRV', speed: 'Mach 24', guidance: 'INS+stellar', payload: 'nuclear' },
                { name: 'Storm Shadow', cat: 'as', mtype: 'cruise', type: 'ALCM', range: 560, warhead: '450kg BROACH penetrator', speed: 'Mach 0.8', guidance: 'INS+GPS+TERPROM+IR', payload: 'HE/penetration' },
                { name: 'SPEAR 3', cat: 'as', mtype: 'cruise', type: 'Mini cruise', range: 140, warhead: '8kg multi-effect', speed: 'Mach 0.7', guidance: 'INS+GPS+IIR+SAL', payload: 'HE' },
                { name: 'Brimstone 3', cat: 'as', mtype: 'tactical', type: 'Air-to-surface', range: 60, warhead: '6.3kg tandem HEAT', speed: 'Mach 1.3', guidance: 'mmW radar+SAL', payload: 'HE' },
                { name: 'Sea Venom', cat: 'as', mtype: 'cruise', type: 'Anti-ship', range: 25, warhead: '30kg HE', speed: 'Mach 0.95', guidance: 'IIR+datalink', payload: 'HE' },
                { name: 'FC/ASW (future)', cat: 'as', mtype: 'cruise', type: 'Cruise/Anti-ship', range: 1000, warhead: '450kg HE', speed: 'Mach 5 (variant)', guidance: 'INS+GPS+seeker', payload: 'HE' },
                { name: 'Sea Ceptor (CAMM)', cat: 'sa', mtype: 'tactical', type: 'SAM', range: 25, warhead: '10kg HE', speed: 'Mach 3', guidance: 'Active radar', payload: 'HE' },
                { name: 'Aster 30', cat: 'sa', mtype: 'tactical', type: 'SAM', range: 120, warhead: '15kg HE', speed: 'Mach 4.5', guidance: 'Active radar+command', payload: 'HE' },
                { name: 'Sky Sabre (Land Ceptor)', cat: 'sa', mtype: 'tactical', type: 'SAM', range: 25, warhead: '10kg HE', speed: 'Mach 3', guidance: 'Active radar', payload: 'HE' },
            ],
            drone: [
                { name: 'Protector RG Mk1', type: 'MALE UCAV', range: 9200, warhead: 'Brimstone/Paveway IV', speed: 'Mach 0.33', guidance: 'GPS+EO/IR+SATCOM', payload: 'PGM/ISR' },
                { name: 'Watchkeeper WK450', type: 'Tactical UAV', range: 150, warhead: 'Surveillance', speed: 'Mach 0.13', guidance: 'GPS+EO/IR/SAR', payload: 'ISR' },
            ],
        },

        france: {
            name: 'France', flag: '🇫🇷', lat: 48.8566, lng: 2.3522,
            missile: [
                { name: 'M51.3', cat: 'ss', mtype: 'ballistic', type: 'SLBM', range: 10000, warhead: '6× TN-75 100kt MIRV', speed: 'Mach 25', guidance: 'INS+stellar', payload: 'nuclear' },
                { name: 'M51.2', cat: 'ss', mtype: 'ballistic', type: 'SLBM', range: 9000, warhead: '6× TNO 100kt MIRV', speed: 'Mach 25', guidance: 'INS+stellar', payload: 'nuclear' },
                { name: 'ASMP-A', cat: 'as', mtype: 'cruise', type: 'ALCM', range: 500, warhead: '300kt TNA nuclear', speed: 'Mach 3', guidance: 'INS+TRN', payload: 'nuclear' },
                { name: 'ASN4G (future)', cat: 'as', mtype: 'hypersonic', type: 'ALCM', range: 1000, warhead: '300kt nuclear', speed: 'Mach 7', guidance: 'INS+terminal', payload: 'nuclear' },
                { name: 'SCALP-EG', cat: 'as', mtype: 'cruise', type: 'ALCM', range: 560, warhead: '450kg BROACH penetrator', speed: 'Mach 0.8', guidance: 'INS+GPS+TERPROM+IR', payload: 'HE/penetration' },
                { name: 'MdCN (Naval Cruise)', cat: 'ss', mtype: 'cruise', type: 'Cruise (sub/surf)', range: 1400, warhead: '250kg HE', speed: 'Mach 0.8', guidance: 'INS+GPS+TERCOM+IR', payload: 'HE' },
                { name: 'Exocet MM40 Block 3c', cat: 'ss', mtype: 'cruise', type: 'Anti-ship', range: 200, warhead: '165kg HE', speed: 'Mach 0.93', guidance: 'INS+active radar', payload: 'HE' },
                { name: 'Exocet AM39', cat: 'as', mtype: 'cruise', type: 'Anti-ship (air)', range: 70, warhead: '165kg HE', speed: 'Mach 0.93', guidance: 'INS+active radar', payload: 'HE' },
                { name: 'AASM Hammer', cat: 'as', mtype: 'tactical', type: 'PGM (rocket)', range: 70, warhead: '125–1000kg HE', speed: 'Mach 0.8', guidance: 'INS+GPS+IIR/SAL', payload: 'HE' },
                { name: 'Aster 30 Block 1NT', cat: 'sa', mtype: 'tactical', type: 'SAM/ABM', range: 150, warhead: '15kg HE', speed: 'Mach 4.5', guidance: 'Active radar+command', payload: 'HE' },
                { name: 'Aster 15', cat: 'sa', mtype: 'tactical', type: 'SAM', range: 30, warhead: '15kg HE', speed: 'Mach 3', guidance: 'Active radar', payload: 'HE' },
                { name: 'VL MICA', cat: 'sa', mtype: 'tactical', type: 'SAM', range: 20, warhead: '12kg HE', speed: 'Mach 4', guidance: 'Active radar/IIR', payload: 'HE' },
                { name: 'Mistral 3', cat: 'sa', mtype: 'tactical', type: 'MANPADS/SAM', range: 8, warhead: '3kg HE', speed: 'Mach 2.6', guidance: 'IIR', payload: 'HE' },
            ],
            drone: [
                { name: 'Reaper MQ-9 (FR)', type: 'MALE UCAV', range: 1850, warhead: 'GBU-12/Hellfire', speed: 'Mach 0.31', guidance: 'GPS+EO/IR+SATCOM', payload: 'PGM/ISR' },
                { name: 'Patroller', type: 'MALE UAV', range: 800, warhead: '250kg payload', speed: 'Mach 0.18', guidance: 'GPS+EO/IR/SAR', payload: 'ISR/strike' },
            ],
        },

        turkey: {
            name: 'Turkey', flag: '🇹🇷', lat: 39.9334, lng: 32.8597,
            missile: [
                { name: 'Tayfun', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 565, warhead: '500kg HE', speed: 'Mach 5', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Bora (Khan)', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 280, warhead: '470kg HE', speed: 'Mach 4', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Yıldırım (J-600T)', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 300, warhead: '480kg HE/cluster', speed: 'Mach 4', guidance: 'INS', payload: 'HE' },
                { name: 'TRG-300 Kasırga', cat: 'ss', mtype: 'tactical', type: 'MLRS/Tactical', range: 120, warhead: '105kg HE/cluster', speed: 'Mach 3', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'TRG-230', cat: 'ss', mtype: 'tactical', type: 'Guided rocket', range: 70, warhead: '42kg HE', speed: 'Mach 3', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'SOM-J', cat: 'as', mtype: 'cruise', type: 'ALCM', range: 275, warhead: '230kg HE', speed: 'Mach 0.85', guidance: 'INS+GPS+IIR+TERCOM', payload: 'HE' },
                { name: 'Atmaca', cat: 'ss', mtype: 'cruise', type: 'Anti-ship', range: 220, warhead: '220kg HE', speed: 'Mach 0.85', guidance: 'INS+GPS+barometric+active radar', payload: 'HE' },
                { name: 'Çakır', cat: 'as', mtype: 'cruise', type: 'Cruise (multi-role)', range: 150, warhead: '80kg HE', speed: 'Mach 0.85', guidance: 'INS+GPS+IIR/RF', payload: 'HE' },
                { name: 'Gezgin (in dev)', cat: 'ss', mtype: 'cruise', type: 'Cruise GLCM', range: 800, warhead: '250kg HE', speed: 'Mach 0.85', guidance: 'INS+GPS+TERCOM', payload: 'HE' },
                { name: 'HİSAR-A+', cat: 'sa', mtype: 'tactical', type: 'SHORAD', range: 15, warhead: '15kg HE', speed: 'Mach 3', guidance: 'IIR', payload: 'HE' },
                { name: 'HİSAR-O+', cat: 'sa', mtype: 'tactical', type: 'MRSAM', range: 25, warhead: '15kg HE', speed: 'Mach 4', guidance: 'Active radar', payload: 'HE' },
                { name: 'SİPER', cat: 'sa', mtype: 'tactical', type: 'LRSAM', range: 100, warhead: '40kg HE', speed: 'Mach 4', guidance: 'Active radar+command', payload: 'HE' },
            ],
            drone: [
                { name: 'Bayraktar TB2', type: 'MALE UCAV', range: 300, warhead: '4× MAM-L/MAM-C', speed: 'Mach 0.18', guidance: 'GPS+EO/IR+laser', payload: 'PGM/ISR' },
                { name: 'Bayraktar Akıncı', type: 'HALE UCAV', range: 7500, warhead: '1500kg PGM', speed: 'Mach 0.31', guidance: 'GPS+EO/IR+SATCOM', payload: 'PGM/cruise/ISR' },
                { name: 'Bayraktar Kızılelma', type: 'Stealth UCAV', range: 925, warhead: '1500kg PGM/AAM', speed: 'Mach 0.9', guidance: 'GPS+AESA+EO/IR', payload: 'PGM/AAMs' },
                { name: 'Anka-3', type: 'Stealth flying-wing UCAV', range: 1000, warhead: '1200kg PGM', speed: 'Mach 0.7', guidance: 'GPS+EO/IR+SATCOM', payload: 'PGM' },
                { name: 'TAI Aksungur', type: 'MALE UAV', range: 6500, warhead: '750kg payload', speed: 'Mach 0.21', guidance: 'GPS+EO/IR/SAR', payload: 'PGM/ISR/ASW' },
                { name: 'Kargu-2', type: 'Loitering Munition', range: 10, warhead: '1.36kg HE/AT', speed: 'Mach 0.06', guidance: 'AI+EO/IR', payload: 'HE' },
                { name: 'ALPAGU', type: 'Fixed-wing loitering', range: 10, warhead: '1.5kg HE', speed: 'Mach 0.13', guidance: 'AI+EO', payload: 'HE' },
            ],
        },

        houthis: {
            name: 'Houthis (Ansar Allah)', flag: '🇾🇪', lat: 15.3694, lng: 44.1910,
            missile: [
                { name: 'Burkan-3', cat: 'ss', mtype: 'ballistic', type: 'MRBM', range: 1200, warhead: '500kg HE', speed: 'Mach 5', guidance: 'INS', payload: 'HE' },
                { name: 'Burkan-2H', cat: 'ss', mtype: 'ballistic', type: 'MRBM', range: 1000, warhead: '500kg HE', speed: 'Mach 5', guidance: 'INS', payload: 'HE' },
                { name: 'Burkan-1', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 800, warhead: '500kg HE', speed: 'Mach 4', guidance: 'INS', payload: 'HE' },
                { name: 'Toofan', cat: 'ss', mtype: 'ballistic', type: 'MRBM', range: 1900, warhead: '500kg HE', speed: 'Mach 6', guidance: 'INS', payload: 'HE' },
                { name: 'Hatem-2', cat: 'ss', mtype: 'hypersonic', type: 'HGV (claimed)', range: 2150, warhead: '500kg HE', speed: 'Mach 8', guidance: 'INS+maneuvering', payload: 'HE' },
                { name: 'Aqil', cat: 'ss', mtype: 'ballistic', type: 'MRBM', range: 450, warhead: '350kg HE', speed: 'Mach 4', guidance: 'INS', payload: 'HE' },
                { name: 'Quds-1', cat: 'ss', mtype: 'cruise', type: 'Cruise', range: 800, warhead: '180kg HE', speed: 'Mach 0.7', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Quds-2', cat: 'ss', mtype: 'cruise', type: 'Cruise', range: 1350, warhead: '180kg HE', speed: 'Mach 0.7', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Quds-3', cat: 'ss', mtype: 'cruise', type: 'Cruise', range: 1500, warhead: '200kg HE', speed: 'Mach 0.7', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Quds-4', cat: 'ss', mtype: 'cruise', type: 'Cruise', range: 2000, warhead: '200kg HE', speed: 'Mach 0.7', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Sayyad', cat: 'ss', mtype: 'cruise', type: 'Cruise', range: 800, warhead: '150kg HE', speed: 'Mach 0.7', guidance: 'INS+GPS', payload: 'HE' },
                { name: 'Asef (Khalij Fars)', cat: 'ss', mtype: 'ballistic', type: 'Anti-ship MRBM', range: 450, warhead: '650kg HE', speed: 'Mach 4', guidance: 'INS+EO/IR seeker', payload: 'HE' },
                { name: 'Mandab-2', cat: 'ss', mtype: 'cruise', type: 'Anti-ship', range: 300, warhead: '155kg HE', speed: 'Mach 0.9', guidance: 'INS+active radar', payload: 'HE' },
                { name: 'Sejjil (Houthi var.)', cat: 'ss', mtype: 'ballistic', type: 'Anti-ship', range: 180, warhead: '500kg HE', speed: 'Mach 4', guidance: 'INS+seeker', payload: 'HE' },
                { name: 'Faleq-1 (358 loiter)', cat: 'sa', mtype: 'tactical', type: 'Loitering SAM', range: 100, warhead: '10kg HE', speed: 'Mach 0.5', guidance: 'IR seeker', payload: 'HE' },
                { name: 'Saqr (Iran 358 export)', cat: 'sa', mtype: 'tactical', type: 'Loitering SAM', range: 100, warhead: '10kg HE', speed: 'Mach 0.5', guidance: 'IR seeker', payload: 'HE' },
                { name: 'Barq-1/2', cat: 'sa', mtype: 'tactical', type: 'SAM', range: 50, warhead: '40kg HE', speed: 'Mach 3', guidance: 'IR/Radar', payload: 'HE' },
            ],
            drone: [
                { name: 'Samad-1', type: 'Loitering munition', range: 500, warhead: '18kg HE', speed: 'Mach 0.18', guidance: 'GPS+INS', payload: 'HE' },
                { name: 'Samad-2', type: 'Loitering munition', range: 1500, warhead: '18kg HE', speed: 'Mach 0.18', guidance: 'GPS+INS', payload: 'HE' },
                { name: 'Samad-3', type: 'Loitering munition', range: 1800, warhead: '40kg HE', speed: 'Mach 0.18', guidance: 'GPS+INS', payload: 'HE' },
                { name: 'Samad-4', type: 'Loitering munition', range: 2000, warhead: '50kg HE', speed: 'Mach 0.18', guidance: 'GPS+INS', payload: 'HE' },
                { name: 'Waid-1', type: 'Loitering UAV', range: 2500, warhead: '40kg HE', speed: 'Mach 0.2', guidance: 'GPS+INS', payload: 'HE' },
                { name: 'Waid-2', type: 'Loitering UAV', range: 2500, warhead: '50kg HE', speed: 'Mach 0.2', guidance: 'GPS+INS', payload: 'HE' },
                { name: 'Shahed-136 (Yemeni var.)', type: 'Loitering munition', range: 2500, warhead: '36kg HE', speed: 'Mach 0.25', guidance: 'GPS+INS', payload: 'HE' },
                { name: 'Qasef-1', type: 'Kamikaze drone', range: 150, warhead: '30kg HE', speed: 'Mach 0.18', guidance: 'GPS', payload: 'HE' },
                { name: 'Qasef-2K', type: 'Kamikaze drone', range: 200, warhead: '30kg HE', speed: 'Mach 0.18', guidance: 'GPS+altimeter (airburst)', payload: 'HE' },
                { name: 'Rased', type: 'ISR drone', range: 35, warhead: 'EO/IR sensor', speed: 'Mach 0.13', guidance: 'GPS+EO/IR', payload: 'ISR' },
                { name: 'Hudhud', type: 'ISR drone', range: 30, warhead: 'EO/IR sensor', speed: 'Mach 0.13', guidance: 'GPS+EO/IR', payload: 'ISR' },
            ],
        },

        hezbollah: {
            name: 'Hezbollah', flag: '🇱🇧', lat: 33.8938, lng: 35.5018,
            missile: [
                { name: 'Fateh-110', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 300, warhead: '450kg HE', speed: 'Mach 3.5', guidance: 'INS+EO terminal', payload: 'HE' },
                { name: 'M-600 (Fateh var.)', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 250, warhead: '500kg HE', speed: 'Mach 3.5', guidance: 'INS', payload: 'HE' },
                { name: 'Scud-B', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 300, warhead: '985kg HE', speed: 'Mach 5', guidance: 'INS', payload: 'HE' },
                { name: 'Scud-C', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 550, warhead: '770kg HE', speed: 'Mach 5', guidance: 'INS', payload: 'HE' },
                { name: 'Scud-D', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 700, warhead: '600kg HE', speed: 'Mach 5', guidance: 'INS', payload: 'HE' },
                { name: 'Zelzal-1', cat: 'ss', mtype: 'tactical', type: 'Heavy rocket', range: 150, warhead: '600kg HE', speed: 'Mach 3', guidance: 'unguided/INS', payload: 'HE' },
                { name: 'Zelzal-2', cat: 'ss', mtype: 'tactical', type: 'Heavy rocket', range: 210, warhead: '600kg HE', speed: 'Mach 3', guidance: 'unguided', payload: 'HE' },
                { name: 'Zelzal-3', cat: 'ss', mtype: 'tactical', type: 'Heavy rocket', range: 250, warhead: '600kg HE', speed: 'Mach 3', guidance: 'unguided', payload: 'HE' },
                { name: 'Fajr-3', cat: 'ss', mtype: 'tactical', type: 'Artillery rocket', range: 43, warhead: '45kg HE', speed: 'Mach 2', guidance: 'unguided', payload: 'HE' },
                { name: 'Fajr-5', cat: 'ss', mtype: 'tactical', type: 'Artillery rocket', range: 75, warhead: '90kg HE', speed: 'Mach 2', guidance: 'unguided', payload: 'HE' },
                { name: 'Khaibar-1 (Fajr-3 var.)', cat: 'ss', mtype: 'tactical', type: 'Artillery rocket', range: 100, warhead: '100kg HE', speed: 'Mach 2', guidance: 'unguided', payload: 'HE' },
                { name: 'Falaq-1', cat: 'ss', mtype: 'tactical', type: 'Heavy rocket', range: 10, warhead: '50kg HE', speed: 'Mach 2', guidance: 'unguided', payload: 'HE' },
                { name: 'Falaq-2', cat: 'ss', mtype: 'tactical', type: 'Heavy rocket', range: 11, warhead: '120kg HE', speed: 'Mach 2', guidance: 'unguided', payload: 'HE' },
                { name: 'BM-21 Grad (122mm)', cat: 'ss', mtype: 'tactical', type: 'Artillery rocket', range: 40, warhead: '20kg HE', speed: 'Mach 2', guidance: 'unguided', payload: 'HE' },
                { name: 'Qadr-1 / Burkan', cat: 'ss', mtype: 'tactical', type: 'Heavy rocket', range: 10, warhead: '500kg HE', speed: 'Mach 1.5', guidance: 'unguided', payload: 'HE' },
                { name: 'Raad / Qaher', cat: 'ss', mtype: 'ballistic', type: 'SRBM', range: 200, warhead: '500kg HE', speed: 'Mach 4', guidance: 'INS', payload: 'HE' },
                { name: 'Yakhont (P-800)', cat: 'ss', mtype: 'cruise', type: 'Anti-ship', range: 300, warhead: '250kg HE', speed: 'Mach 2.5', guidance: 'INS+active radar', payload: 'HE' },
                { name: 'C-802 / Noor', cat: 'ss', mtype: 'cruise', type: 'Anti-ship', range: 120, warhead: '165kg HE', speed: 'Mach 0.9', guidance: 'INS+active radar', payload: 'HE' },
                { name: 'C-704', cat: 'ss', mtype: 'cruise', type: 'Anti-ship', range: 35, warhead: '130kg HE', speed: 'Mach 0.85', guidance: 'INS+active radar', payload: 'HE' },
                { name: 'Almas', cat: 'as', mtype: 'tactical', type: 'ATGM (air/ground)', range: 8, warhead: '8kg tandem HEAT', speed: 'Mach 0.6', guidance: 'IIR fire-and-forget', payload: 'HE' },
                { name: 'Kornet-E', cat: 'as', mtype: 'tactical', type: 'ATGM', range: 10, warhead: '4.6kg tandem HEAT', speed: 'Mach 0.7', guidance: 'SACLOS laser', payload: 'HE' },
                { name: 'SA-22 (Pantsir)', cat: 'sa', mtype: 'tactical', type: 'SAM', range: 20, warhead: '20kg HE', speed: 'Mach 2.6', guidance: 'Radar+command', payload: 'HE' },
                { name: 'SA-17 (Buk)', cat: 'sa', mtype: 'tactical', type: 'SAM', range: 50, warhead: '70kg HE', speed: 'Mach 4', guidance: 'Radar', payload: 'HE' },
                { name: 'SA-8 (Osa)', cat: 'sa', mtype: 'tactical', type: 'SAM', range: 15, warhead: '16kg HE', speed: 'Mach 2.4', guidance: 'Radar+command', payload: 'HE' },
                { name: '358 Loitering SAM', cat: 'sa', mtype: 'tactical', type: 'Loitering SAM', range: 100, warhead: '10kg HE', speed: 'Mach 0.5', guidance: 'IR seeker', payload: 'HE' },
            ],
            drone: [
                { name: 'Mirsad-1 / Ababil-2', type: 'Recon/strike UAV', range: 150, warhead: '40kg HE', speed: 'Mach 0.25', guidance: 'GPS+EO', payload: 'HE/ISR' },
                { name: 'Ayoub (Shahed-129 var.)', type: 'MALE UAV', range: 1700, warhead: 'PGM payload', speed: 'Mach 0.25', guidance: 'GPS+EO/IR', payload: 'PGM/ISR' },
                { name: 'Karrar-class', type: 'Combat drone', range: 1000, warhead: '2× bombs', speed: 'Mach 0.8', guidance: 'GPS+Radar', payload: 'HE bombs' },
                { name: 'Mohajer-4', type: 'ISR/strike UAV', range: 150, warhead: 'Light PGM', speed: 'Mach 0.18', guidance: 'GPS+EO', payload: 'ISR/strike' },
                { name: 'Yasir', type: 'Tactical UAV', range: 200, warhead: 'ISR sensor', speed: 'Mach 0.18', guidance: 'GPS+EO/IR', payload: 'ISR' },
                { name: 'Ababil-T', type: 'Loitering munition', range: 250, warhead: '45kg HE', speed: 'Mach 0.25', guidance: 'GPS+INS', payload: 'HE' },
                { name: 'Shahed-101', type: 'Loitering munition', range: 700, warhead: '4.5kg HE', speed: 'Mach 0.16', guidance: 'GPS+INS', payload: 'HE' },
                { name: 'Shahed-136 (Hezbollah)', type: 'Loitering munition', range: 2500, warhead: '36kg HE', speed: 'Mach 0.25', guidance: 'GPS+INS', payload: 'HE' },
            ],
        },
    };
    const WATER_BODIES = [
        { name: 'Mediterranean Sea', lat: 35.5, lng: 18.0, type: 'sea', minZ: 3 },
        { name: 'Black Sea', lat: 43.5, lng: 34.0, type: 'sea', minZ: 4 },
        { name: 'Caspian Sea', lat: 42.0, lng: 50.5, type: 'sea', minZ: 4 },
        { name: 'Red Sea', lat: 20.0, lng: 38.0, type: 'sea', minZ: 4 },
        { name: 'Dead Sea', lat: 31.5, lng: 35.5, type: 'sea', minZ: 6 },
        { name: 'Aegean Sea', lat: 38.5, lng: 25.0, type: 'sea', minZ: 5 },
        { name: 'Adriatic Sea', lat: 43.0, lng: 15.0, type: 'sea', minZ: 5 },
        { name: 'North Sea', lat: 56.0, lng: 3.0, type: 'sea', minZ: 4 },
        { name: 'Baltic Sea', lat: 58.0, lng: 20.0, type: 'sea', minZ: 4 },
        { name: 'Arabian Sea', lat: 15.0, lng: 65.0, type: 'sea', minZ: 3 },
        { name: 'South China Sea', lat: 14.0, lng: 115.0, type: 'sea', minZ: 3 },
        { name: 'East China Sea', lat: 30.0, lng: 125.0, type: 'sea', minZ: 4 },
        { name: 'Sea of Japan', lat: 40.0, lng: 135.0, type: 'sea', minZ: 4 },
        { name: 'Bering Sea', lat: 58.0, lng: -178.0, type: 'sea', minZ: 3 },
        { name: 'Caribbean Sea', lat: 15.0, lng: -75.0, type: 'sea', minZ: 3 },
        { name: 'Sea of Okhotsk', lat: 55.0, lng: 150.0, type: 'sea', minZ: 4 },
        // Gulfs
        { name: 'Persian Gulf', lat: 27.0, lng: 51.0, type: 'gulf', minZ: 4 },
        { name: 'Gulf of Oman', lat: 24.5, lng: 58.5, type: 'gulf', minZ: 4 },
        { name: 'Gulf of Aden', lat: 13.0, lng: 48.0, type: 'gulf', minZ: 4 },
        { name: 'Gulf of Mexico', lat: 25.0, lng: -90.0, type: 'gulf', minZ: 3 },
        { name: 'Gulf of Guinea', lat: 2.0, lng: 3.0, type: 'gulf', minZ: 3 },
        { name: 'Gulf of Alaska', lat: 58.0, lng: -145.0, type: 'gulf', minZ: 3 },
        { name: 'Gulf of Thailand', lat: 10.0, lng: 101.0, type: 'gulf', minZ: 4 },
        { name: 'Gulf of California', lat: 28.0, lng: -112.0, type: 'gulf', minZ: 4 },
        { name: 'Bay of Bengal', lat: 15.0, lng: 88.0, type: 'gulf', minZ: 3 },
        // Straits
        { name: 'Strait of Hormuz', lat: 26.5, lng: 56.4, type: 'strait', minZ: 5 },
        { name: 'Strait of Gibraltar', lat: 35.95, lng: -5.6, type: 'strait', minZ: 5 },
        { name: 'Strait of Malacca', lat: 3.0, lng: 100.5, type: 'strait', minZ: 4 },
        { name: 'Bosphorus', lat: 41.1, lng: 29.05, type: 'strait', minZ: 6 },
        { name: 'Dardanelles', lat: 40.2, lng: 26.4, type: 'strait', minZ: 6 },
        { name: 'Bab-el-Mandeb', lat: 12.6, lng: 43.3, type: 'strait', minZ: 5 },
        { name: 'Suez Canal', lat: 30.5, lng: 32.35, type: 'strait', minZ: 5 },
        { name: 'Panama Canal', lat: 9.1, lng: -79.7, type: 'strait', minZ: 5 },
        { name: 'Strait of Dover', lat: 51.0, lng: 1.5, type: 'strait', minZ: 6 },
        { name: 'Taiwan Strait', lat: 24.5, lng: 119.5, type: 'strait', minZ: 5 },
        { name: 'Korea Strait', lat: 34.5, lng: 129.5, type: 'strait', minZ: 5 },
        { name: 'Bering Strait', lat: 65.7, lng: -169.0, type: 'strait', minZ: 4 },
        { name: 'English Channel', lat: 50.0, lng: -1.0, type: 'strait', minZ: 5 }
    ];
    const WB_NAMES = {
        'Mediterranean Sea': { es: 'Mar Mediterráneo', fr: 'Mer Méditerranée', ru: 'Средиземное море', zh: '地中海', tr: 'Akdeniz', ar: 'البحر الأبيض المتوسط', fa: 'دریای مدیترانه', he: 'הים התיכון' },
        'Black Sea': { es: 'Mar Negro', fr: 'Mer Noire', ru: 'Чёрное море', zh: '黑海', tr: 'Karadeniz', ar: 'البحر الأسود', fa: 'دریای سیاه', he: 'הים השחור' },
        'Caspian Sea': { es: 'Mar Caspio', fr: 'Mer Caspienne', ru: 'Каспийское море', zh: '里海', tr: 'Hazar Denizi', ar: 'بحر قزوين', fa: 'دریای خزر', he: 'הים הכספי' },
        'Red Sea': { es: 'Mar Rojo', fr: 'Mer Rouge', ru: 'Красное море', zh: '红海', tr: 'Kızıldeniz', ar: 'البحر الأحمر', fa: 'دریای سرخ', he: 'ים סוף' },
        'Dead Sea': { es: 'Mar Muerto', fr: 'Mer Morte', ru: 'Мёртвое море', zh: '死海', tr: 'Ölü Deniz', ar: 'البحر الميت', fa: 'دریای مرده', he: 'ים המלח' },
        'Aegean Sea': { es: 'Mar Egeo', fr: 'Mer Égée', ru: 'Эгейское море', zh: '爱琴海', tr: 'Ege Denizi', ar: 'بحر إيجه', fa: 'دریای اژه', he: 'הים האגאי' },
        'Adriatic Sea': { es: 'Mar Adriático', fr: 'Mer Adriatique', ru: 'Адриатическое море', zh: '亚得里亚海', tr: 'Adriyatik Denizi', ar: 'البحر الأدرياتيكي', fa: 'دریای آدریاتیک', he: 'הים האדריאטי' },
        'North Sea': { es: 'Mar del Norte', fr: 'Mer du Nord', ru: 'Северное море', zh: '北海', tr: 'Kuzey Denizi', ar: 'بحر الشمال', fa: 'دریای شمال', he: 'ים הצפון' },
        'Baltic Sea': { es: 'Mar Báltico', fr: 'Mer Baltique', ru: 'Балтийское море', zh: '波罗的海', tr: 'Baltık Denizi', ar: 'بحر البلطيق', fa: 'دریای بالتیک', he: 'הים הבלטי' },
        'Arabian Sea': { es: 'Mar Arábigo', fr: "Mer d'Arabie", ru: 'Аравийское море', zh: '阿拉伯海', tr: 'Arabistan Denizi', ar: 'بحر العرب', fa: 'دریای عرب', he: 'הים הערבי' },
        'South China Sea': { es: 'Mar de China Meridional', fr: 'Mer de Chine méridionale', ru: 'Южно-Китайское море', zh: '南海', tr: 'Güney Çin Denizi', ar: 'بحر الصين الجنوبي', fa: 'دریای چین جنوبی', he: 'ים סין הדרומי' },
        'East China Sea': { es: 'Mar de China Oriental', fr: 'Mer de Chine orientale', ru: 'Восточно-Китайское море', zh: '东海', tr: 'Doğu Çin Denizi', ar: 'بحر الصين الشرقي', fa: 'دریای چین شرقی', he: 'ים סין המזרחי' },
        'Sea of Japan': { es: 'Mar del Japón', fr: 'Mer du Japon', ru: 'Японское море', zh: '日本海', tr: 'Japon Denizi', ar: 'بحر اليابان', fa: 'دریای ژاپن', he: 'ים יפן' },
        'Bering Sea': { es: 'Mar de Bering', fr: 'Mer de Béring', ru: 'Берингово море', zh: '白令海', tr: 'Bering Denizi', ar: 'بحر برينغ', fa: 'دریای برینگ', he: 'ים ברינג' },
        'Caribbean Sea': { es: 'Mar Caribe', fr: 'Mer des Caraïbes', ru: 'Карибское море', zh: '加勒比海', tr: 'Karayip Denizi', ar: 'البحر الكاريبي', fa: 'دریای کارائیب', he: 'הים הקריבי' },
        'Sea of Okhotsk': { es: 'Mar de Ojotsk', fr: "Mer d'Okhotsk", ru: 'Охотское море', zh: '鄂霍次克海', tr: 'Ohotsk Denizi', ar: 'بحر أوخوتسك', fa: 'دریای اوخوتسک', he: 'ים אוחוצק' },
        'Persian Gulf': { es: 'Golfo Pérsico', fr: 'Golfe Persique', ru: 'Персидский залив', zh: '波斯湾', tr: 'Basra Körfezi', ar: 'الخليج العربي', fa: 'خلیج فارس', he: 'המפרץ הפרסי' },
        'Gulf of Oman': { es: 'Golfo de Omán', fr: "Golfe d'Oman", ru: 'Оманский залив', zh: '阿曼湾', tr: 'Umman Körfezi', ar: 'خليج عمان', fa: 'خلیج عمان', he: 'מפרץ עומאן' },
        'Gulf of Aden': { es: 'Golfo de Adén', fr: "Golfe d'Aden", ru: 'Аденский залив', zh: '亚丁湾', tr: 'Aden Körfezi', ar: 'خليج عدن', fa: 'خلیج عدن', he: 'מפרץ עדן' },
        'Gulf of Mexico': { es: 'Golfo de México', fr: 'Golfe du Mexique', ru: 'Мексиканский залив', zh: '墨西哥湾', tr: 'Meksika Körfezi', ar: 'خليج المكسيك', fa: 'خلیج مکزیک', he: 'מפרץ מקסיקו' },
        'Gulf of Guinea': { es: 'Golfo de Guinea', fr: 'Golfe de Guinée', ru: 'Гвинейский залив', zh: '几内亚湾', tr: 'Gine Körfezi', ar: 'خليج غينيا', fa: 'خلیج گینه', he: 'מפרץ גינאה' },
        'Gulf of Alaska': { es: 'Golfo de Alaska', fr: "Golfe d'Alaska", ru: 'Залив Аляска', zh: '阿拉斯加湾', tr: 'Alaska Körfezi', ar: 'خليج ألاسكا', fa: 'خلیج آلاسکا', he: 'מפרץ אלסקה' },
        'Gulf of Thailand': { es: 'Golfo de Tailandia', fr: 'Golfe de Thaïlande', ru: 'Сиамский залив', zh: '泰国湾', tr: 'Tayland Körfezi', ar: 'خليج تايلاند', fa: 'خلیج تایلند', he: 'מפרץ תאילנד' },
        'Gulf of California': { es: 'Golfo de California', fr: 'Golfe de Californie', ru: 'Калифорнийский залив', zh: '加利福尼亚湾', tr: 'Kaliforniya Körfezi', ar: 'خليج كاليفورنيا', fa: 'خلیج کالیفرنیا', he: 'מפרץ קליפורניה' },
        'Bay of Bengal': { es: 'Golfo de Bengala', fr: 'Golfe du Bengale', ru: 'Бенгальский залив', zh: '孟加拉湾', tr: 'Bengal Körfezi', ar: 'خليج البنغال', fa: 'خلیج بنگال', he: 'מפרץ בנגל' },
        'Strait of Hormuz': { es: 'Estrecho de Ormuz', fr: "Détroit d'Ormuz", ru: 'Ормузский пролив', zh: '霍尔木兹海峡', tr: 'Hürmüz Boğazı', ar: 'مضيق هرمز', fa: 'تنگه هرمز', he: 'מיצר הורמוז' },
        'Strait of Gibraltar': { es: 'Estrecho de Gibraltar', fr: 'Détroit de Gibraltar', ru: 'Гибралтарский пролив', zh: '直布罗陀海峡', tr: 'Cebelitarık Boğazı', ar: 'مضيق جبل طارق', fa: 'تنگه جبل‌الطارق', he: 'מיצר גיברלטר' },
        'Strait of Malacca': { es: 'Estrecho de Malaca', fr: 'Détroit de Malacca', ru: 'Малаккский пролив', zh: '马六甲海峡', tr: 'Malakka Boğazı', ar: 'مضيق ملقا', fa: 'تنگه مالاکا', he: 'מיצר מלאקה' },
        'Bosphorus': { es: 'Bósforo', fr: 'Bosphore', ru: 'Босфор', zh: '博斯普鲁斯海峡', tr: 'Boğaziçi', ar: 'مضيق البوسفور', fa: 'تنگه بسفر', he: 'הבוספורוס' },
        'Dardanelles': { es: 'Dardanelos', fr: 'Dardanelles', ru: 'Дарданеллы', zh: '达达尼尔海峡', tr: 'Çanakkale Boğazı', ar: 'مضيق الدردنيل', fa: 'تنگه داردانل', he: 'הדרדנלים' },
        'Bab-el-Mandeb': { es: 'Bab el-Mandeb', fr: 'Bab-el-Mandeb', ru: 'Баб-эль-Мандебский пролив', zh: '曼德海峡', tr: 'Bab-el-Mandep Boğazı', ar: 'باب المندب', fa: 'تنگه باب‌المندب', he: 'מיצר באב אל מנדב' },
        'Suez Canal': { es: 'Canal de Suez', fr: 'Canal de Suez', ru: 'Суэцкий канал', zh: '苏伊士运河', tr: 'Süveyş Kanalı', ar: 'قناة السويس', fa: 'کانال سوئز', he: 'תעלת סואץ' },
        'Panama Canal': { es: 'Canal de Panamá', fr: 'Canal de Panama', ru: 'Панамский канал', zh: '巴拿马运河', tr: 'Panama Kanalı', ar: 'قناة بنما', fa: 'کانال پاناما', he: 'תעלת פנמה' },
        'Strait of Dover': { es: 'Estrecho de Dover', fr: 'Pas-de-Calais', ru: 'Па-де-Кале', zh: '多佛尔海峡', tr: 'Dover Boğazı', ar: 'مضيق دوفر', fa: 'تنگه دوور', he: 'מיצר דובר' },
        'Taiwan Strait': { es: 'Estrecho de Taiwán', fr: 'Détroit de Taïwan', ru: 'Тайваньский пролив', zh: '台湾海峡', tr: 'Tayvan Boğazı', ar: 'مضيق تايوان', fa: 'تنگه تایوان', he: 'מיצר טייוואן' },
        'Korea Strait': { es: 'Estrecho de Corea', fr: 'Détroit de Corée', ru: 'Корейский пролив', zh: '朝鲜海峡', tr: 'Kore Boğazı', ar: 'مضيق كوريا', fa: 'تنگه کره', he: 'מיצר קוריאה' },
        'Bering Strait': { es: 'Estrecho de Bering', fr: 'Détroit de Béring', ru: 'Берингов пролив', zh: '白令海峡', tr: 'Bering Boğazı', ar: 'مضيق بيرينغ', fa: 'تنگه برینگ', he: 'מיצר ברינג' },
        'English Channel': { es: 'Canal de la Mancha', fr: 'Manche', ru: 'Ла-Манш', zh: '英吉利海峡', tr: 'Manş Denizi', ar: 'القنال الإنجليزي', fa: 'کانال انگلیس', he: 'תעלת למאנש' }
    };
    const MISSILE_ABBR = {
        'ICBM': 'Intercontinental Ballistic Missile', 'IRBM': 'Intermediate-Range Ballistic Missile',
        'MRBM': 'Medium-Range Ballistic Missile', 'SRBM': 'Short-Range Ballistic Missile',
        'SLBM': 'Submarine-Launched Ballistic Missile', 'ALCM': 'Air-Launched Cruise Missile',
        'GLCM': 'Ground-Launched Cruise Missile', 'SLCM': 'Submarine-Launched Cruise Missile',
        'ASBM': 'Anti-Ship Ballistic Missile', 'HGV': 'Hypersonic Glide Vehicle',
        'ABM': 'Anti-Ballistic Missile', 'SAM': 'Surface-to-Air Missile',
    };

    const mediaViewer = {
        el: null, stage: null, closeBtn: null,
        items: [], idx: 0,
        init() {
            this.el = document.getElementById('media-viewer');
            this.stage = document.getElementById('mv-stage');
            this.closeBtn = document.getElementById('mv-close');
            if (!this.el) return;
            if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
            this.el.addEventListener('click', (e) => { if (e.target === this.el) this.close(); });
            document.addEventListener('keydown', (e) => {
                if (!this.el.classList.contains('open')) return;
                if (e.key === 'Escape') this.close();
                else if (e.key === 'ArrowRight') this.next();
                else if (e.key === 'ArrowLeft') this.prev();
            });
            // Delegate clicks on any media thumbnail (news feed gallery markup).
            document.addEventListener('click', (e) => {
                const wrap = e.target.closest('.news-media-wrap');
                if (!wrap) return;
                e.preventDefault();
                e.stopPropagation();
                let list = [];
                const gallery = wrap.closest('.news-media-gallery');
                if (gallery && gallery.dataset.mediaList) {
                    try { list = JSON.parse(gallery.dataset.mediaList.replace(/&quot;/g, '"')); } catch (_) {}
                }
                if (!list.length) {
                    list = [{ path: wrap.dataset.mediaSrc, type: wrap.dataset.mediaType || 'photo' }];
                }
                const idx = parseInt(wrap.dataset.mediaIndex, 10) || 0;
                this.open(list, idx);
            });
        },
        open(items, idx) {
            if (!this.el || !this.stage) return;
            this.items = Array.isArray(items) ? items : [items];
            this.idx = idx || 0;
            this.render();
            this.el.classList.add('open');
            this.el.setAttribute('aria-hidden', 'false');
        },
        render() {
            if (!this.stage) return;
            const m = this.items[this.idx];
            if (!m) return;
            const src = m.path || m.url || m;
            const type = m.type || 'photo';
            const nav = this.items.length > 1
                ? `<button class="mv-nav mv-prev" type="button">‹</button>
                   <button class="mv-nav mv-next" type="button">›</button>
                   <div class="mv-count">${this.idx + 1} / ${this.items.length}</div>`
                : '';
            if (type === 'video') {
                this.stage.innerHTML = `<video src="${src}" class="mv-video" controls autoplay playsinline></video>${nav}`;
            } else {
                this.stage.innerHTML = `<img src="${src}" class="mv-img" alt="">${nav}`;
            }
            const p = this.stage.querySelector('.mv-prev');
            const n = this.stage.querySelector('.mv-next');
            if (p) p.addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });
            if (n) n.addEventListener('click', (e) => { e.stopPropagation(); this.next(); });
        },
        next() { if (this.items.length) { this.idx = (this.idx + 1) % this.items.length; this.render(); } },
        prev() { if (this.items.length) { this.idx = (this.idx - 1 + this.items.length) % this.items.length; this.render(); } },
        close() {
            if (!this.el) return;
            this.el.classList.remove('open');
            this.el.setAttribute('aria-hidden', 'true');
            if (this.stage) this.stage.innerHTML = '';
        },
    };

    // ============ STATE & CONFIG ============
    // — globals recovered via static analysis (declared once here) —
    let measureRenderer = null, scaleControl = null, measurePreview = null;
    let countryLabelGroup = null, cityLabelGroup = null, waterLabelGroup = null;
    let roadsLayer = null, arsenalLayer = null;
    let countryData = null, cityData = null;
    let newsItems = [];
    // News-panel multi-selection (by stable event_id) for the right-click context
    // menu ("Mostrar en feed" / "Analizar con IA").
    let _newsSel = new Set();
    let _renderNewsScheduled = false, _collisionRAF = null, _mapDragSuppress = false;
    let _searchTimer = null, _cityRefreshTimer = null, _restackTimer = null, _bkndPollTimer = null;
    let _bkndPollInflight = false, _lastBackendHeartbeat = null;
    let wsConnection = null, currentPlace = null;
    let _iconHtmlCache = new Map();
    let arsenalCurrentCountry = 'iran', arsenalCurrentCat = 'missile';
    const LAYERS = {
        satellite: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            attr: '© Esri | Maxar'
        },
        terrain: {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
            attr: '© Esri'
        },
        dark: {
            url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
            attr: '© CARTO'
        },
        light: {
            url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
            attr: '© CARTO'
        }
    };
    // ── Google Maps base map (via Leaflet.GoogleMutant) ──
    // Each Skorpene base-layer name maps to a Google map type. 'hybrid' = satellite
    // imagery + Google's own zoom-dependent place labels (the requested Google model).
    // Google bakes labels into every type, so the per-category label panel is hidden.
    const GMAP_TYPE       = { satellite: 'hybrid', terrain: 'terrain', light: 'roadmap', dark: 'roadmap' };
    const GMAP_TYPE_NOLAB = { satellite: 'satellite', terrain: 'terrain', light: 'roadmap', dark: 'roadmap' };
    // Google Maps `styles` rule that hides every label (country, city, region, road,
    // water, transit). Applied to roadmap-type layers (dark/light) when the user
    // toggles "No labels" — gives the same labelless behaviour as the satellite layer.
    const GMAP_HIDE_LABELS_STYLES = [
        { elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'administrative', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'water', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    ];
    let _noLabels = false;
    // Dark-mode styling for the Google 'roadmap' type (keeps the dark base look).
    const GMAP_DARK_STYLES = [
        { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
        { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
        { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
        { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d70' }] },
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] }
    ];
    // Google invokes this global when the API key is missing/invalid or billing is
    // off. We flip to the Esri/CARTO fallback and rebuild the current base layer so
    // the map keeps working instead of showing Google's error watermark.
    let _gmapsAuthFailed = false;
    window.gm_authFailure = function () {
        _gmapsAuthFailed = true;
        try { if (map) setBaseLayer(currentLayer); } catch (_) {}
    };
    const LABEL_URL = 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png';
    // Esri reference overlay (country/region/city names + boundaries) designed to sit
    // on top of the Esri World Imagery satellite — gives the classic satellite the same
    // zoom-dependent place names as the Google layers. Free, no key.
    const ESRI_LABELS_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
    let esriLabelsLayer = null;
    const T = {
        es:{ layers:'CAPAS DEL MAPA',viewMode:'MODO VISTA',mode2d:'2D MAPA',mode3d:'3D GLOBO',mapLayer:'CAPA BASE',satellite:'Satélite',satelliteClassic:'Satélite clásico',terrain:'Terreno / Relieve',dark:'Modo Oscuro',light:'Modo Claro',labels:'ETIQUETAS',lblCountries:'Países',lblCities:'Ciudades',lblRegions:'Regiones / CC.AA.',lblRoads:'Carreteras',lblWater:'Mares / Estrechos / Golfos',tools:'HERRAMIENTAS',measureLine:'─ Medir Línea',measureArea:'◊ Medir Área',clearMeasure:'✗ Limpiar',clickToPlace:'Haz clic para colocar puntos. Doble clic para terminar.',clickToClose:'Haz clic en el primer punto para cerrar el área',finish:'Finalizar',reset:'Reiniciar',lpType:'Tipo',lpCountry:'País',lpPop:'Habitantes',lpArea:'Superficie',lpCoords:'Coords',loading:'Inicializando sistema...',typeCapital:'Capital',typeCity:'Ciudad',typeTown:'Municipio',typeVillage:'Pueblo',typeIsland:'Isla',typeState:'Estado / Región',typeCounty:'Provincia',typeCountry:'País',popUnknown:'Datos no disponibles',distance:'DISTANCIA',points:'PUNTOS',area:'ÁREA',perimeter:'PERÍMETRO',reportedBy:'Reportado por {n} canales',noData:'Sin datos',noLabels:'Sin etiquetas',deleteRange:'Eliminar este rango'},
        en:{ layers:'MAP LAYERS',viewMode:'VIEW MODE',mode2d:'2D MAP',mode3d:'3D GLOBE',mapLayer:'BASE LAYER',satellite:'Satellite',satelliteClassic:'Classic satellite',terrain:'Terrain / Relief',dark:'Dark Mode',light:'Light Mode',labels:'LABELS',lblCountries:'Countries',lblCities:'Cities',lblRegions:'Regions / States',lblRoads:'Roads',lblWater:'Seas / Straits / Gulfs',tools:'TOOLS',measureLine:'─ Measure Line',measureArea:'◊ Measure Area',clearMeasure:'✗ Clear',clickToPlace:'Click to place points. Double-click to finish.',clickToClose:'Click the first point to close the area',finish:'Finish',reset:'Reset',lpType:'Type',lpCountry:'Country',lpPop:'Population',lpArea:'Area',lpCoords:'Coords',loading:'Initializing system...',typeCapital:'Capital',typeCity:'City',typeTown:'Town',typeVillage:'Village',typeIsland:'Island',typeState:'State / Region',typeCounty:'Province',typeCountry:'Country',popUnknown:'Data unavailable',distance:'DISTANCE',points:'POINTS',area:'AREA',perimeter:'PERIMETER',reportedBy:'Reported by {n} channels',noData:'No data',noLabels:'No labels',deleteRange:'Delete this range'},
        fr:{ layers:'COUCHES',viewMode:'MODE VUE',mode2d:'CARTE 2D',mode3d:'GLOBE 3D',mapLayer:'COUCHE',satellite:'Satellite',terrain:'Terrain',dark:'Mode Sombre',light:'Mode Clair',labels:'ÉTIQUETTES',lblCountries:'Pays',lblCities:'Villes',lblRegions:'Régions',lblRoads:'Routes',lblWater:'Mers / Détroits',tools:'OUTILS',measureLine:'─ Ligne',measureArea:'◊ Surface',clearMeasure:'✗ Effacer',clickToPlace:'Cliquez pour placer des points. Double-clic pour terminer.',clickToClose:'Cliquez sur le premier point pour fermer',finish:'Terminer',reset:'Réinitialiser',lpType:'Type',lpCountry:'Pays',lpPop:'Habitants',lpArea:'Superficie',lpCoords:'Coords',loading:'Initialisation...',typeCapital:'Capitale',typeCity:'Ville',typeTown:'Commune',typeVillage:'Village',typeIsland:'Île',typeState:'Région',typeCounty:'Province',typeCountry:'Pays',popUnknown:'Données indisponibles',distance:'DISTANCE',points:'POINTS',area:'SURFACE',perimeter:'PÉRIMÈTRE'},
        ru:{ layers:'СЛОИ КАРТЫ',viewMode:'РЕЖИМ',mode2d:'2D КАРТА',mode3d:'3D ГЛОБУС',mapLayer:'СЛОЙ',satellite:'Спутник',terrain:'Рельеф',dark:'Тёмный',light:'Светлый',labels:'НАДПИСИ',lblCountries:'Страны',lblCities:'Города',lblRegions:'Регионы',lblRoads:'Дороги',lblWater:'Моря / Проливы',tools:'ИНСТРУМЕНТЫ',measureLine:'─ Линия',measureArea:'◊ Площадь',clearMeasure:'✗ Очистить',clickToPlace:'Нажмите чтобы разместить точки. Двойной клик для завершения.',clickToClose:'Нажмите на первую точку чтобы закрыть область',finish:'Завершить',reset:'Сбросить',lpType:'Тип',lpCountry:'Страна',lpPop:'Население',lpArea:'Площадь',lpCoords:'Координаты',loading:'Инициализация...',typeCapital:'Столица',typeCity:'Город',typeTown:'Городок',typeVillage:'Деревня',typeIsland:'Остров',typeState:'Регион',typeCounty:'Провинция',typeCountry:'Страна',popUnknown:'Нет данных',distance:'РАССТОЯНИЕ',points:'ТОЧКИ',area:'ПЛОЩАДЬ',perimeter:'ПЕРИМЕТР'},
        zh:{ layers:'地图图层',viewMode:'视图模式',mode2d:'2D 地图',mode3d:'3D 地球',mapLayer:'基础图层',satellite:'卫星',terrain:'地形',dark:'深色',light:'浅色',labels:'标签',lblCountries:'国家',lblCities:'城市',lblRegions:'地区',lblRoads:'道路',lblWater:'海洋 / 海峡',tools:'工具',measureLine:'─ 测量线',measureArea:'◊ 测量面积',clearMeasure:'✗ 清除',clickToPlace:'点击放置点。双击完成。',clickToClose:'点击第一个点闭合区域',finish:'完成',reset:'重置',lpType:'类型',lpCountry:'国家',lpPop:'人口',lpArea:'面积',lpCoords:'坐标',loading:'初始化...',typeCapital:'首都',typeCity:'城市',typeTown:'镇',typeVillage:'村庄',typeIsland:'岛屿',typeState:'州/地区',typeCounty:'省',typeCountry:'国家',popUnknown:'数据不可用',distance:'距离',points:'点',area:'面积',perimeter:'周长'},
        tr:{ layers:'HARİTA KATMANLARI',viewMode:'GÖRÜNÜM',mode2d:'2D HARİTA',mode3d:'3D KÜRE',mapLayer:'KATMAN',satellite:'Uydu',terrain:'Arazi',dark:'Karanlık',light:'Aydınlık',labels:'ETİKETLER',lblCountries:'Ülkeler',lblCities:'Şehirler',lblRegions:'Bölgeler',lblRoads:'Yollar',lblWater:'Denizler / Boğazlar',tools:'ARAÇLAR',measureLine:'─ Çizgi',measureArea:'◊ Alan',clearMeasure:'✗ Temizle',clickToPlace:'Nokta yerleştirmek için tıklayın. Bitirmek için çift tıklayın.',clickToClose:'Alanı kapatmak için ilk noktaya tıklayın',finish:'Bitir',reset:'Sıfırla',lpType:'Tür',lpCountry:'Ülke',lpPop:'Nüfus',lpArea:'Alan',lpCoords:'Koordinatlar',loading:'Başlatılıyor...',typeCapital:'Başkent',typeCity:'Şehir',typeTown:'İlçe',typeVillage:'Köy',typeIsland:'Ada',typeState:'Bölge',typeCounty:'İl',typeCountry:'Ülke',popUnknown:'Veri yok',distance:'MESAFE',points:'NOKTA',area:'ALAN',perimeter:'ÇEVRE'},
        ar:{ layers:'طبقات الخريطة',viewMode:'وضع العرض',mode2d:'خريطة ثنائية',mode3d:'كرة ثلاثية',mapLayer:'الطبقة الأساسية',satellite:'قمر صناعي',terrain:'تضاريس',dark:'داكن',light:'فاتح',labels:'التسميات',lblCountries:'الدول',lblCities:'المدن',lblRegions:'المناطق',lblRoads:'الطرق',lblWater:'البحار / المضايق',tools:'الأدوات',measureLine:'─ خط',measureArea:'◊ مساحة',clearMeasure:'✗ مسح',clickToPlace:'انقر لوضع النقاط. انقر نقرًا مزدوجًا للإنهاء.',clickToClose:'انقر على النقطة الأولى لإغلاق المنطقة',finish:'إنهاء',reset:'إعادة',lpType:'النوع',lpCountry:'الدولة',lpPop:'السكان',lpArea:'المساحة',lpCoords:'الإحداثيات',loading:'جارٍ التهيئة...',typeCapital:'عاصمة',typeCity:'مدينة',typeTown:'بلدة',typeVillage:'قرية',typeIsland:'جزيرة',typeState:'منطقة',typeCounty:'محافظة',typeCountry:'دولة',popUnknown:'البيانات غير متوفرة',distance:'المسافة',points:'النقاط',area:'المساحة',perimeter:'المحيط'},
        fa:{ layers:'لایه‌های نقشه',viewMode:'حالت نمایش',mode2d:'نقشه ۲D',mode3d:'کره ۳D',mapLayer:'لایه پایه',satellite:'ماهواره',terrain:'زمین',dark:'تاریک',light:'روشن',labels:'برچسب‌ها',lblCountries:'کشورها',lblCities:'شهرها',lblRegions:'مناطق',lblRoads:'جاده‌ها',lblWater:'دریاها / تنگه‌ها',tools:'ابزارها',measureLine:'─ خط',measureArea:'◊ مساحت',clearMeasure:'✗ پاک',clickToPlace:'برای قرار دادن نقاط کلیک کنید. برای پایان دوبار کلیک کنید.',clickToClose:'روی نقطه اول کلیک کنید تا منطقه بسته شود',finish:'پایان',reset:'بازنشانی',lpType:'نوع',lpCountry:'کشور',lpPop:'جمعیت',lpArea:'مساحت',lpCoords:'مختصات',loading:'در حال راه‌اندازی...',typeCapital:'پایتخت',typeCity:'شهر',typeTown:'شهرستان',typeVillage:'روستا',typeIsland:'جزیره',typeState:'استان',typeCounty:'شهرستان',typeCountry:'کشور',popUnknown:'داده موجود نیست',distance:'فاصله',points:'نقاط',area:'مساحت',perimeter:'محیط'},
        nl:{ layers:'KAARTLAGEN',viewMode:'WEERGAVE',mode2d:'2D-KAART',mode3d:'3D-GLOBE',mapLayer:'BASISLAAG',satellite:'Satelliet',satelliteClassic:'Klassieke satelliet',terrain:'Terrein / Reliëf',dark:'Donkere modus',light:'Lichte modus',labels:'LABELS',lblCountries:'Landen',lblCities:'Steden',lblRegions:'Regio\'s / Staten',lblRoads:'Wegen',lblWater:'Zeeën / Zeestraten / Golven',tools:'GEREEDSCHAP',measureLine:'─ Lijn meten',measureArea:'◊ Gebied meten',clearMeasure:'✗ Wissen',clickToPlace:'Klik om punten te plaatsen. Dubbelklik om te eindigen.',clickToClose:'Klik op het eerste punt om het gebied te sluiten',finish:'Voltooien',reset:'Opnieuw',lpType:'Type',lpCountry:'Land',lpPop:'Inwoners',lpArea:'Oppervlakte',lpCoords:'Coörd.',loading:'Systeem initialiseren...',typeCapital:'Hoofdstad',typeCity:'Stad',typeTown:'Plaats',typeVillage:'Dorp',typeIsland:'Eiland',typeState:'Staat / Regio',typeCounty:'Provincie',typeCountry:'Land',popUnknown:'Geen gegevens',distance:'AFSTAND',points:'PUNTEN',area:'GEBIED',perimeter:'OMTREK',reportedBy:'Gemeld door {n} kanalen',noData:'Geen gegevens',noLabels:'Geen labels',deleteRange:'Dit bereik verwijderen'},
        it:{ layers:'LIVELLI MAPPA',viewMode:'VISTA',mode2d:'MAPPA 2D',mode3d:'GLOBO 3D',mapLayer:'LIVELLO BASE',satellite:'Satellite',satelliteClassic:'Satellite classico',terrain:'Terreno / Rilievo',dark:'Modalità scura',light:'Modalità chiara',labels:'ETICHETTE',lblCountries:'Paesi',lblCities:'Città',lblRegions:'Regioni / Stati',lblRoads:'Strade',lblWater:'Mari / Stretti / Golfi',tools:'STRUMENTI',measureLine:'─ Misura linea',measureArea:'◊ Misura area',clearMeasure:'✗ Cancella',clickToPlace:'Clicca per posizionare i punti. Doppio clic per terminare.',clickToClose:'Clicca sul primo punto per chiudere l\'area',finish:'Fine',reset:'Reimposta',lpType:'Tipo',lpCountry:'Paese',lpPop:'Abitanti',lpArea:'Superficie',lpCoords:'Coord.',loading:'Inizializzazione sistema...',typeCapital:'Capitale',typeCity:'Città',typeTown:'Comune',typeVillage:'Villaggio',typeIsland:'Isola',typeState:'Stato / Regione',typeCounty:'Provincia',typeCountry:'Paese',popUnknown:'Dati non disponibili',distance:'DISTANZA',points:'PUNTI',area:'AREA',perimeter:'PERIMETRO',reportedBy:'Segnalato da {n} canali',noData:'Nessun dato',noLabels:'Nessuna etichetta',deleteRange:'Elimina questo raggio'},
        hi:{ layers:'मानचित्र परतें',viewMode:'दृश्य मोड',mode2d:'2D मानचित्र',mode3d:'3D ग्लोब',mapLayer:'आधार परत',satellite:'उपग्रह',satelliteClassic:'क्लासिक उपग्रह',terrain:'भू-भाग / उभार',dark:'डार्क मोड',light:'लाइट मोड',labels:'लेबल',lblCountries:'देश',lblCities:'शहर',lblRegions:'क्षेत्र / राज्य',lblRoads:'सड़कें',lblWater:'समुद्र / जलसंधि / खाड़ियाँ',tools:'उपकरण',measureLine:'─ रेखा मापें',measureArea:'◊ क्षेत्र मापें',clearMeasure:'✗ साफ़ करें',clickToPlace:'बिंदु रखने के लिए क्लिक करें। समाप्त करने के लिए डबल-क्लिक करें।',clickToClose:'क्षेत्र बंद करने के लिए पहले बिंदु पर क्लिक करें',finish:'समाप्त',reset:'रीसेट',lpType:'प्रकार',lpCountry:'देश',lpPop:'जनसंख्या',lpArea:'क्षेत्रफल',lpCoords:'निर्देशांक',loading:'सिस्टम आरंभ हो रहा है...',typeCapital:'राजधानी',typeCity:'शहर',typeTown:'कस्बा',typeVillage:'गाँव',typeIsland:'द्वीप',typeState:'राज्य / क्षेत्र',typeCounty:'प्रांत',typeCountry:'देश',popUnknown:'डेटा उपलब्ध नहीं',distance:'दूरी',points:'बिंदु',area:'क्षेत्रफल',perimeter:'परिधि',reportedBy:'{n} चैनलों द्वारा रिपोर्ट किया गया',noData:'कोई डेटा नहीं',noLabels:'कोई लेबल नहीं',deleteRange:'यह रेंज हटाएँ'},
        pt:{ layers:'CAMADAS DO MAPA',viewMode:'MODO DE VISTA',mode2d:'MAPA 2D',mode3d:'GLOBO 3D',mapLayer:'CAMADA BASE',satellite:'Satélite',satelliteClassic:'Satélite clássico',terrain:'Terreno / Relevo',dark:'Modo escuro',light:'Modo claro',labels:'RÓTULOS',lblCountries:'Países',lblCities:'Cidades',lblRegions:'Regiões / Estados',lblRoads:'Estradas',lblWater:'Mares / Estreitos / Golfos',tools:'FERRAMENTAS',measureLine:'─ Medir linha',measureArea:'◊ Medir área',clearMeasure:'✗ Limpar',clickToPlace:'Clique para colocar pontos. Duplo clique para terminar.',clickToClose:'Clique no primeiro ponto para fechar a área',finish:'Concluir',reset:'Reiniciar',lpType:'Tipo',lpCountry:'País',lpPop:'População',lpArea:'Área',lpCoords:'Coords',loading:'Inicializando sistema...',typeCapital:'Capital',typeCity:'Cidade',typeTown:'Município',typeVillage:'Aldeia',typeIsland:'Ilha',typeState:'Estado / Região',typeCounty:'Província',typeCountry:'País',popUnknown:'Dados indisponíveis',distance:'DISTÂNCIA',points:'PONTOS',area:'ÁREA',perimeter:'PERÍMETRO',reportedBy:'Relatado por {n} canais',noData:'Sem dados',noLabels:'Sem rótulos',deleteRange:'Eliminar este alcance'},
        he:{ layers:'שכבות מפה',viewMode:'מצב תצוגה',mode2d:'מפה 2D',mode3d:'גלובוס 3D',mapLayer:'שכבת בסיס',satellite:'לוויין',terrain:'תבליט',dark:'מצב כהה',light:'מצב בהיר',labels:'תוויות',lblCountries:'מדינות',lblCities:'ערים',lblRegions:'אזורים',lblRoads:'כבישים',lblWater:'ימים / מיצרים',tools:'כלים',measureLine:'─ מדידת קו',measureArea:'◊ מדידת שטח',clearMeasure:'✗ נקה',clickToPlace:'לחץ למיקום נקודות. לחיצה כפולה לסיום.',clickToClose:'לחץ על הנקודה הראשונה כדי לסגור את השטח',finish:'סיום',reset:'איפוס',lpType:'סוג',lpCountry:'מדינה',lpPop:'אוכלוסייה',lpArea:'שטח',lpCoords:'קואורדינטות',loading:'מאתחל מערכת...',typeCapital:'בירה',typeCity:'עיר',typeTown:'יישוב',typeVillage:'כפר',typeIsland:'אי',typeState:'מחוז',typeCounty:'פלך',typeCountry:'מדינה',popUnknown:'נתונים לא זמינים',distance:'מרחק',points:'נקודות',area:'שטח',perimeter:'היקף'}
    };
    // ── Missile-simulator translations (merged into T so t()/applyLang resolve them) ──
    const SIM_I18N = {
        es:{ simConfigure:'CONFIGURAR',simSimulate:'SIMULAR',simResultsStep:'RESULTADOS',simEngagementMode:'MODO DE COMBATE',simUnilateral:'ATAQUE UNILATERAL',simExchange:'INTERCAMBIO SIMULTÁNEO',simModeOneway:'El bando A ataca al bando B. El bando B solo defiende.',simModeExchange:'Ambos bandos atacan y defienden a la vez. Cada país puede equipar armas ofensivas y defensas.',simAttacking:'ALIANZA ATACANTE',simDefending:'ALIANZA DEFENSORA',simAddCountry:'+ AÑADIR PAÍS',simSelectCountryOpt:'— Selecciona un país —',simRemoveCountry:'Quitar país',simRemove:'Quitar',simShowRanges:'MOSTRAR ALCANCES OFENSIVOS',simResetConfig:'↺ REINICIAR CONFIGURACIÓN',simExecute:'▶ EJECUTAR SIMULACIÓN',simClearMap:'🧹 LIMPIAR MAPA',simViewLast:'📊 VER ÚLTIMOS RESULTADOS',simStrikeProgress:'ATAQUE EN CURSO',simTelemetry:'TELEMETRÍA EN VIVO',simElapsed:'TIEMPO',simLaunched:'LANZADOS',simIntercepted:'INTERCEPTADOS',simImpacts:'IMPACTOS',simActiveForces:'FUERZAS ACTIVAS',simAbort:'■ ABORTAR SIMULACIÓN',simBackConfig:'⟵ VOLVER A CONFIGURACIÓN',simRunAgain:'▶ EJECUTAR DE NUEVO',simSelectTarget:'SELECCIONAR OBJETIVO',simConfirm:'CONFIRMAR',simPickInfo:'Busca un lugar, haz clic en el mapa o introduce coordenadas.',simPickSearchPh:'Busca ciudad, base, región… (ej. Tel Aviv)',simPickLatPh:'LAT (ej. 32.0853)',simPickLngPh:'LNG (ej. 34.7818)',simCountry:'país',simCountries:'países',vNeedCountryA:'El bando A necesita al menos un país.',vNeedCountryB:'El bando B necesita al menos un país.',vNeedWeaponA:'El bando A necesita al menos un grupo de armas.',vNeedWeapon:'Se requiere al menos un grupo de armas.',vNeedTargetSuffix:'→ asigna un objetivo a cada grupo de armas.' },
        en:{ simConfigure:'CONFIGURE',simSimulate:'SIMULATE',simResultsStep:'RESULTS',simEngagementMode:'ENGAGEMENT MODE',simUnilateral:'UNILATERAL STRIKE',simExchange:'SIMULTANEOUS EXCHANGE',simModeOneway:'Side A launches against Side B. Side B defends only.',simModeExchange:'Both sides launch and defend simultaneously. Each country may equip both offensive weapons and defenses.',simAttacking:'ATTACKING ALLIANCE',simDefending:'DEFENDING ALLIANCE',simAddCountry:'+ ADD COUNTRY',simSelectCountryOpt:'— Select a country —',simRemoveCountry:'Remove country',simRemove:'Remove',simShowRanges:'SHOW OFFENSIVE WEAPON RANGES',simResetConfig:'↺ RESET CONFIGURATION',simExecute:'▶ EXECUTE SIMULATION',simClearMap:'🧹 CLEAR MAP',simViewLast:'📊 VIEW LAST RESULTS',simStrikeProgress:'STRIKE IN PROGRESS',simTelemetry:'LIVE TELEMETRY',simElapsed:'ELAPSED',simLaunched:'LAUNCHED',simIntercepted:'INTERCEPTED',simImpacts:'IMPACTS',simActiveForces:'ACTIVE FORCES',simAbort:'■ ABORT SIMULATION',simBackConfig:'⟵ BACK TO CONFIGURATION',simRunAgain:'▶ RUN AGAIN',simSelectTarget:'SELECT TARGET',simConfirm:'CONFIRM',simPickInfo:'Search for a place, click on the map, or enter coordinates.',simPickSearchPh:'Search city, base, region… (e.g. Tel Aviv)',simPickLatPh:'LAT (e.g. 32.0853)',simPickLngPh:'LNG (e.g. 34.7818)',simCountry:'country',simCountries:'countries',vNeedCountryA:'Side A needs at least one country.',vNeedCountryB:'Side B needs at least one country.',vNeedWeaponA:'Side A needs at least one weapon group.',vNeedWeapon:'At least one weapon group is required.',vNeedTargetSuffix:'→ set a target for every weapon group.' },
        fr:{ simConfigure:'CONFIGURER',simSimulate:'SIMULER',simResultsStep:'RÉSULTATS',simEngagementMode:'MODE DE COMBAT',simUnilateral:'FRAPPE UNILATÉRALE',simExchange:'ÉCHANGE SIMULTANÉ',simModeOneway:'Le camp A attaque le camp B. Le camp B se défend uniquement.',simModeExchange:'Les deux camps attaquent et se défendent simultanément. Chaque pays peut équiper armes offensives et défenses.',simAttacking:'ALLIANCE ATTAQUANTE',simDefending:'ALLIANCE DÉFENSIVE',simAddCountry:'+ AJOUTER UN PAYS',simSelectCountryOpt:'— Choisir un pays —',simRemoveCountry:'Retirer le pays',simRemove:'Retirer',simShowRanges:'AFFICHER LES PORTÉES OFFENSIVES',simResetConfig:'↺ RÉINITIALISER',simExecute:'▶ LANCER LA SIMULATION',simClearMap:'🧹 EFFACER LA CARTE',simViewLast:'📊 DERNIERS RÉSULTATS',simStrikeProgress:'FRAPPE EN COURS',simTelemetry:'TÉLÉMÉTRIE EN DIRECT',simElapsed:'TEMPS',simLaunched:'LANCÉS',simIntercepted:'INTERCEPTÉS',simImpacts:'IMPACTS',simActiveForces:'FORCES ACTIVES',simAbort:'■ ANNULER LA SIMULATION',simBackConfig:'⟵ RETOUR À LA CONFIG',simRunAgain:'▶ RELANCER',simSelectTarget:'SÉLECTIONNER CIBLE',simConfirm:'CONFIRMER',simPickInfo:'Cherchez un lieu, cliquez sur la carte ou saisissez des coordonnées.',simPickSearchPh:'Ville, base, région… (ex. Tel Aviv)',simPickLatPh:'LAT (ex. 32.0853)',simPickLngPh:'LNG (ex. 34.7818)',simCountry:'pays',simCountries:'pays',vNeedCountryA:'Le camp A doit avoir au moins un pays.',vNeedCountryB:'Le camp B doit avoir au moins un pays.',vNeedWeaponA:'Le camp A doit avoir au moins un groupe d\'armes.',vNeedWeapon:'Au moins un groupe d\'armes est requis.',vNeedTargetSuffix:'→ définissez une cible pour chaque groupe d\'armes.' },
        ru:{ simConfigure:'НАСТРОЙКА',simSimulate:'СИМУЛЯЦИЯ',simResultsStep:'РЕЗУЛЬТАТЫ',simEngagementMode:'РЕЖИМ БОЯ',simUnilateral:'ОДНОСТОРОННИЙ УДАР',simExchange:'ОДНОВРЕМЕННЫЙ ОБМЕН',simModeOneway:'Сторона A атакует сторону B. Сторона B только защищается.',simModeExchange:'Обе стороны атакуют и защищаются одновременно. Каждая страна может иметь оружие и защиту.',simAttacking:'АТАКУЮЩИЙ АЛЬЯНС',simDefending:'ОБОРОНЯЮЩИЙСЯ АЛЬЯНС',simAddCountry:'+ ДОБАВИТЬ СТРАНУ',simSelectCountryOpt:'— Выберите страну —',simRemoveCountry:'Удалить страну',simRemove:'Удалить',simShowRanges:'ПОКАЗАТЬ ДАЛЬНОСТЬ ОРУЖИЯ',simResetConfig:'↺ СБРОСИТЬ НАСТРОЙКИ',simExecute:'▶ ЗАПУСТИТЬ СИМУЛЯЦИЮ',simClearMap:'🧹 ОЧИСТИТЬ КАРТУ',simViewLast:'📊 ПОСЛЕДНИЕ РЕЗУЛЬТАТЫ',simStrikeProgress:'УДАР В ПРОЦЕССЕ',simTelemetry:'ТЕЛЕМЕТРИЯ',simElapsed:'ВРЕМЯ',simLaunched:'ЗАПУЩЕНО',simIntercepted:'ПЕРЕХВАЧЕНО',simImpacts:'ПОПАДАНИЯ',simActiveForces:'АКТИВНЫЕ СИЛЫ',simAbort:'■ ПРЕРВАТЬ',simBackConfig:'⟵ НАЗАД К НАСТРОЙКЕ',simRunAgain:'▶ ЗАПУСТИТЬ СНОВА',simSelectTarget:'ВЫБРАТЬ ЦЕЛЬ',simConfirm:'ПОДТВЕРДИТЬ',simPickInfo:'Найдите место, щёлкните по карте или введите координаты.',simPickSearchPh:'Город, база, регион… (напр. Тель-Авив)',simPickLatPh:'ШИР (напр. 32.0853)',simPickLngPh:'ДОЛ (напр. 34.7818)',simCountry:'страна',simCountries:'стран',vNeedCountryA:'Стороне A нужна хотя бы одна страна.',vNeedCountryB:'Стороне B нужна хотя бы одна страна.',vNeedWeaponA:'Стороне A нужна хотя бы одна группа оружия.',vNeedWeapon:'Требуется хотя бы одна группа оружия.',vNeedTargetSuffix:'→ задайте цель для каждой группы оружия.' },
        zh:{ simConfigure:'配置',simSimulate:'模拟',simResultsStep:'结果',simEngagementMode:'交战模式',simUnilateral:'单方打击',simExchange:'同时交火',simModeOneway:'A方攻击B方，B方仅防御。',simModeExchange:'双方同时攻击和防御。每个国家可同时配备进攻武器和防御系统。',simAttacking:'进攻联盟',simDefending:'防御联盟',simAddCountry:'+ 添加国家',simSelectCountryOpt:'— 选择国家 —',simRemoveCountry:'移除国家',simRemove:'移除',simShowRanges:'显示进攻武器射程',simResetConfig:'↺ 重置配置',simExecute:'▶ 执行模拟',simClearMap:'🧹 清除地图',simViewLast:'📊 查看上次结果',simStrikeProgress:'打击进行中',simTelemetry:'实时遥测',simElapsed:'用时',simLaunched:'已发射',simIntercepted:'已拦截',simImpacts:'命中',simActiveForces:'活动力量',simAbort:'■ 中止模拟',simBackConfig:'⟵ 返回配置',simRunAgain:'▶ 重新运行',simSelectTarget:'选择目标',simConfirm:'确认',simPickInfo:'搜索地点、点击地图或输入坐标。',simPickSearchPh:'搜索城市、基地、地区…（例如特拉维夫）',simPickLatPh:'纬度（例如 32.0853）',simPickLngPh:'经度（例如 34.7818）',simCountry:'国家',simCountries:'国家',vNeedCountryA:'A方至少需要一个国家。',vNeedCountryB:'B方至少需要一个国家。',vNeedWeaponA:'A方至少需要一个武器组。',vNeedWeapon:'至少需要一个武器组。',vNeedTargetSuffix:'→ 为每个武器组设定目标。' },
        tr:{ simConfigure:'YAPILANDIR',simSimulate:'SİMÜLE ET',simResultsStep:'SONUÇLAR',simEngagementMode:'ÇATIŞMA MODU',simUnilateral:'TEK TARAFLI SALDIRI',simExchange:'EŞ ZAMANLI ÇATIŞMA',simModeOneway:'A tarafı B tarafına saldırır. B tarafı yalnızca savunur.',simModeExchange:'Her iki taraf da aynı anda saldırır ve savunur. Her ülke hem saldırı silahları hem de savunma kurabilir.',simAttacking:'SALDIRAN İTTİFAK',simDefending:'SAVUNAN İTTİFAK',simAddCountry:'+ ÜLKE EKLE',simSelectCountryOpt:'— Bir ülke seçin —',simRemoveCountry:'Ülkeyi kaldır',simRemove:'Kaldır',simShowRanges:'SALDIRI MENZİLLERİNİ GÖSTER',simResetConfig:'↺ YAPILANDIRMAYI SIFIRLA',simExecute:'▶ SİMÜLASYONU BAŞLAT',simClearMap:'🧹 HARİTAYI TEMİZLE',simViewLast:'📊 SON SONUÇLAR',simStrikeProgress:'SALDIRI SÜRÜYOR',simTelemetry:'CANLI TELEMETRİ',simElapsed:'SÜRE',simLaunched:'FIRLATILAN',simIntercepted:'ÖNLENEN',simImpacts:'İSABET',simActiveForces:'AKTİF KUVVETLER',simAbort:'■ SİMÜLASYONU İPTAL ET',simBackConfig:'⟵ YAPILANDIRMAYA DÖN',simRunAgain:'▶ TEKRAR ÇALIŞTIR',simSelectTarget:'HEDEF SEÇ',simConfirm:'ONAYLA',simPickInfo:'Bir yer arayın, haritaya tıklayın veya koordinat girin.',simPickSearchPh:'Şehir, üs, bölge ara… (örn. Tel Aviv)',simPickLatPh:'ENL (örn. 32.0853)',simPickLngPh:'BOY (örn. 34.7818)',simCountry:'ülke',simCountries:'ülke',vNeedCountryA:'A tarafı en az bir ülke gerektirir.',vNeedCountryB:'B tarafı en az bir ülke gerektirir.',vNeedWeaponA:'A tarafı en az bir silah grubu gerektirir.',vNeedWeapon:'En az bir silah grubu gerekli.',vNeedTargetSuffix:'→ her silah grubu için bir hedef belirleyin.' },
        ar:{ simConfigure:'الإعداد',simSimulate:'محاكاة',simResultsStep:'النتائج',simEngagementMode:'وضع الاشتباك',simUnilateral:'ضربة أحادية',simExchange:'تبادل متزامن',simModeOneway:'الطرف A يهاجم الطرف B. الطرف B يدافع فقط.',simModeExchange:'يهاجم الطرفان ويدافعان في آن واحد. يمكن لكل دولة تجهيز أسلحة هجومية ودفاعات.',simAttacking:'التحالف المهاجم',simDefending:'التحالف المدافع',simAddCountry:'+ إضافة دولة',simSelectCountryOpt:'— اختر دولة —',simRemoveCountry:'إزالة الدولة',simRemove:'إزالة',simShowRanges:'إظهار مديات الأسلحة الهجومية',simResetConfig:'↺ إعادة ضبط الإعداد',simExecute:'▶ تنفيذ المحاكاة',simClearMap:'🧹 مسح الخريطة',simViewLast:'📊 عرض آخر النتائج',simStrikeProgress:'الضربة جارية',simTelemetry:'قياس مباشر',simElapsed:'الوقت',simLaunched:'أُطلقت',simIntercepted:'اعتُرضت',simImpacts:'إصابات',simActiveForces:'القوات النشطة',simAbort:'■ إلغاء المحاكاة',simBackConfig:'⟵ العودة إلى الإعداد',simRunAgain:'▶ تشغيل مرة أخرى',simSelectTarget:'اختر الهدف',simConfirm:'تأكيد',simPickInfo:'ابحث عن مكان، انقر على الخريطة، أو أدخل الإحداثيات.',simPickSearchPh:'ابحث عن مدينة، قاعدة، منطقة… (مثل تل أبيب)',simPickLatPh:'خط العرض (مثل 32.0853)',simPickLngPh:'خط الطول (مثل 34.7818)',simCountry:'دولة',simCountries:'دول',vNeedCountryA:'يحتاج الطرف A إلى دولة واحدة على الأقل.',vNeedCountryB:'يحتاج الطرف B إلى دولة واحدة على الأقل.',vNeedWeaponA:'يحتاج الطرف A إلى مجموعة أسلحة واحدة على الأقل.',vNeedWeapon:'يلزم وجود مجموعة أسلحة واحدة على الأقل.',vNeedTargetSuffix:'→ حدد هدفًا لكل مجموعة أسلحة.' },
        fa:{ simConfigure:'پیکربندی',simSimulate:'شبیه‌سازی',simResultsStep:'نتایج',simEngagementMode:'حالت درگیری',simUnilateral:'حمله یک‌طرفه',simExchange:'تبادل همزمان',simModeOneway:'طرف A به طرف B حمله می‌کند. طرف B فقط دفاع می‌کند.',simModeExchange:'هر دو طرف همزمان حمله و دفاع می‌کنند. هر کشور می‌تواند هم سلاح تهاجمی و هم پدافند داشته باشد.',simAttacking:'ائتلاف مهاجم',simDefending:'ائتلاف مدافع',simAddCountry:'+ افزودن کشور',simSelectCountryOpt:'— یک کشور انتخاب کنید —',simRemoveCountry:'حذف کشور',simRemove:'حذف',simShowRanges:'نمایش بُرد سلاح‌های تهاجمی',simResetConfig:'↺ بازنشانی پیکربندی',simExecute:'▶ اجرای شبیه‌سازی',simClearMap:'🧹 پاک کردن نقشه',simViewLast:'📊 مشاهده نتایج اخیر',simStrikeProgress:'حمله در حال انجام',simTelemetry:'تله‌متری زنده',simElapsed:'زمان',simLaunched:'پرتاب‌شده',simIntercepted:'رهگیری‌شده',simImpacts:'اصابت',simActiveForces:'نیروهای فعال',simAbort:'■ لغو شبیه‌سازی',simBackConfig:'⟵ بازگشت به پیکربندی',simRunAgain:'▶ اجرای مجدد',simSelectTarget:'انتخاب هدف',simConfirm:'تأیید',simPickInfo:'مکانی را جستجو کنید، روی نقشه کلیک کنید یا مختصات وارد کنید.',simPickSearchPh:'شهر، پایگاه، منطقه… (مثل تل‌آویو)',simPickLatPh:'عرض (مثل 32.0853)',simPickLngPh:'طول (مثل 34.7818)',simCountry:'کشور',simCountries:'کشور',vNeedCountryA:'طرف A به حداقل یک کشور نیاز دارد.',vNeedCountryB:'طرف B به حداقل یک کشور نیاز دارد.',vNeedWeaponA:'طرف A به حداقل یک گروه سلاح نیاز دارد.',vNeedWeapon:'حداقل یک گروه سلاح لازم است.',vNeedTargetSuffix:'→ برای هر گروه سلاح یک هدف تعیین کنید.' },
        he:{ simConfigure:'הגדרה',simSimulate:'סימולציה',simResultsStep:'תוצאות',simEngagementMode:'מצב לחימה',simUnilateral:'מתקפה חד-צדדית',simExchange:'חילופי אש בו-זמניים',simModeOneway:'צד A תוקף את צד B. צד B מגן בלבד.',simModeExchange:'שני הצדדים תוקפים ומגנים בו-זמנית. כל מדינה יכולה לצייד נשק התקפי והגנות.',simAttacking:'ברית תוקפת',simDefending:'ברית מגינה',simAddCountry:'+ הוסף מדינה',simSelectCountryOpt:'— בחר מדינה —',simRemoveCountry:'הסר מדינה',simRemove:'הסר',simShowRanges:'הצג טווחי נשק התקפי',simResetConfig:'↺ אפס הגדרות',simExecute:'▶ הפעל סימולציה',simClearMap:'🧹 נקה מפה',simViewLast:'📊 הצג תוצאות אחרונות',simStrikeProgress:'מתקפה מתבצעת',simTelemetry:'טלמטריה חיה',simElapsed:'זמן',simLaunched:'שוגרו',simIntercepted:'יורטו',simImpacts:'פגיעות',simActiveForces:'כוחות פעילים',simAbort:'■ בטל סימולציה',simBackConfig:'⟵ חזרה להגדרה',simRunAgain:'▶ הפעל שוב',simSelectTarget:'בחר מטרה',simConfirm:'אשר',simPickInfo:'חפש מקום, לחץ על המפה או הזן קואורדינטות.',simPickSearchPh:'עיר, בסיס, אזור… (לדוגמה תל אביב)',simPickLatPh:'קו רוחב (לדוגמה 32.0853)',simPickLngPh:'קו אורך (לדוגמה 34.7818)',simCountry:'מדינה',simCountries:'מדינות',vNeedCountryA:'צד A צריך לפחות מדינה אחת.',vNeedCountryB:'צד B צריך לפחות מדינה אחת.',vNeedWeaponA:'צד A צריך לפחות קבוצת נשק אחת.',vNeedWeapon:'נדרשת לפחות קבוצת נשק אחת.',vNeedTargetSuffix:'→ הגדר מטרה לכל קבוצת נשק.' }
    };
    Object.keys(SIM_I18N).forEach(lng => { if (T[lng]) Object.assign(T[lng], SIM_I18N[lng]); });
    // Country-card editor strings (offensive/defensive sections, group buttons).
    const SIM_I18N_CARD = {
        es:{ simOffensiveLoadout:'CARGA OFENSIVA',simDefensiveShield:'ESCUDO DEFENSIVO',simAddWeaponGroup:'+ AÑADIR GRUPO DE ARMAS',simAddDefenseBattery:'+ AÑADIR BATERÍA DEFENSIVA',simNoWeapons:'No hay grupos de armas asignados.',simNoDefenses:'No hay sistemas de defensa asignados.',simSetTargetBtn:'⌖ FIJAR OBJETIVO',simPicking:'◉ SELECCIONANDO',simReady:'LISTO',simProjectiles:'proyectiles',simVs:'contra',simBatteries:'baterías' },
        en:{ simOffensiveLoadout:'OFFENSIVE LOADOUT',simDefensiveShield:'DEFENSIVE SHIELD',simAddWeaponGroup:'+ ADD WEAPON GROUP',simAddDefenseBattery:'+ ADD DEFENSE BATTERY',simNoWeapons:'No weapon groups assigned.',simNoDefenses:'No defense systems assigned.',simSetTargetBtn:'⌖ SET TARGET',simPicking:'◉ PICKING',simReady:'READY',simProjectiles:'projectiles',simVs:'vs',simBatteries:'batteries' },
        fr:{ simOffensiveLoadout:'ARSENAL OFFENSIF',simDefensiveShield:'BOUCLIER DÉFENSIF',simAddWeaponGroup:'+ AJOUTER UN GROUPE D\'ARMES',simAddDefenseBattery:'+ AJOUTER UNE BATTERIE',simNoWeapons:'Aucun groupe d\'armes assigné.',simNoDefenses:'Aucun système de défense assigné.',simSetTargetBtn:'⌖ DÉFINIR CIBLE',simPicking:'◉ SÉLECTION',simReady:'PRÊT',simProjectiles:'projectiles',simVs:'contre',simBatteries:'batteries' },
        ru:{ simOffensiveLoadout:'НАСТУПАТЕЛЬНОЕ ВООРУЖЕНИЕ',simDefensiveShield:'ОБОРОНИТЕЛЬНЫЙ ЩИТ',simAddWeaponGroup:'+ ДОБАВИТЬ ГРУППУ ОРУЖИЯ',simAddDefenseBattery:'+ ДОБАВИТЬ БАТАРЕЮ ПВО',simNoWeapons:'Группы оружия не назначены.',simNoDefenses:'Системы обороны не назначены.',simSetTargetBtn:'⌖ ЗАДАТЬ ЦЕЛЬ',simPicking:'◉ ВЫБОР',simReady:'ГОТОВО',simProjectiles:'снарядов',simVs:'против',simBatteries:'батарей' },
        zh:{ simOffensiveLoadout:'进攻装备',simDefensiveShield:'防御护盾',simAddWeaponGroup:'+ 添加武器组',simAddDefenseBattery:'+ 添加防御阵地',simNoWeapons:'未分配武器组。',simNoDefenses:'未分配防御系统。',simSetTargetBtn:'⌖ 设定目标',simPicking:'◉ 选择中',simReady:'就绪',simProjectiles:'枚弹药',simVs:'对',simBatteries:'个阵地' },
        tr:{ simOffensiveLoadout:'SALDIRI YÜKÜ',simDefensiveShield:'SAVUNMA KALKANI',simAddWeaponGroup:'+ SİLAH GRUBU EKLE',simAddDefenseBattery:'+ SAVUNMA BATARYASI EKLE',simNoWeapons:'Atanmış silah grubu yok.',simNoDefenses:'Atanmış savunma sistemi yok.',simSetTargetBtn:'⌖ HEDEF BELİRLE',simPicking:'◉ SEÇİLİYOR',simReady:'HAZIR',simProjectiles:'mermi',simVs:'karşı',simBatteries:'batarya' },
        ar:{ simOffensiveLoadout:'التسليح الهجومي',simDefensiveShield:'الدرع الدفاعي',simAddWeaponGroup:'+ إضافة مجموعة أسلحة',simAddDefenseBattery:'+ إضافة بطارية دفاع',simNoWeapons:'لا توجد مجموعات أسلحة معينة.',simNoDefenses:'لا توجد أنظمة دفاع معينة.',simSetTargetBtn:'⌖ تحديد الهدف',simPicking:'◉ جارٍ التحديد',simReady:'جاهز',simProjectiles:'مقذوفات',simVs:'ضد',simBatteries:'بطاريات' },
        fa:{ simOffensiveLoadout:'تجهیزات تهاجمی',simDefensiveShield:'سپر دفاعی',simAddWeaponGroup:'+ افزودن گروه سلاح',simAddDefenseBattery:'+ افزودن باتری دفاعی',simNoWeapons:'هیچ گروه سلاحی تعیین نشده.',simNoDefenses:'هیچ سامانه دفاعی تعیین نشده.',simSetTargetBtn:'⌖ تعیین هدف',simPicking:'◉ در حال انتخاب',simReady:'آماده',simProjectiles:'پرتابه',simVs:'علیه',simBatteries:'باتری' },
        he:{ simOffensiveLoadout:'מערך התקפי',simDefensiveShield:'מגן הגנתי',simAddWeaponGroup:'+ הוסף קבוצת נשק',simAddDefenseBattery:'+ הוסף סוללת הגנה',simNoWeapons:'לא הוקצו קבוצות נשק.',simNoDefenses:'לא הוקצו מערכות הגנה.',simSetTargetBtn:'⌖ קבע מטרה',simPicking:'◉ בוחר',simReady:'מוכן',simProjectiles:'טילים',simVs:'נגד',simBatteries:'סוללות' }
    };
    Object.keys(SIM_I18N_CARD).forEach(lng => { if (T[lng]) Object.assign(T[lng], SIM_I18N_CARD[lng]); });
    // AI assistant strings — all 9 languages.
    const AI_I18N = {
        es:{ aiTitle:'Asistente IA',aiWelcome:'Hola 👋 Pregúntame lo que quieras sobre los eventos del mapa.',aiPlaceholder:'Pregunta sobre el mapa…',aiAskPh:'Pregunta a la IA…',aiThinking:'Pensando…',aiError:'No se pudo contactar con la IA. Revisa que el servidor (start_server.py) esté en marcha y que ANTHROPIC_API_KEY esté configurada.',srcTelegram:'Telegram',srcOutlets:'Noticieros',outletsLoading:'Cargando noticieros…',outletsError:'No se pudieron cargar los noticieros (¿servidor en marcha?).',outletsEmpty:'Sin artículos disponibles.',newsTitle:'NOTICIAS EN VIVO',translatingNews:'Traduciendo noticias…',translateDone:'Noticias traducidas',showMore:'Mostrar más',showLess:'Mostrar menos',mapLockTitle:'El mapa en vivo es Pro',mapLockBody:'Desbloquea el mapa en vivo para ver cada noticia geolocalizada en tiempo real. En el plan Free puedes añadir hasta 5 fuentes y leerlas en el Feed.',mapLockCta:'Obtener Pro',srcLimitTitle:'Has alcanzado el límite Free',srcLimitBody:'El plan Free permite hasta 5 fuentes. Mejora a Pro para fuentes ilimitadas y el mapa en vivo.',planChoose:'Elegir plan',planLabel:'Plan',subCancel:'Cancelar suscripción',subResume:'Reanudar suscripción',subCancelConfirm:'¿Seguro que quieres cancelar tu suscripción? Mantendrás tu plan hasta el final del periodo ya pagado.',subCancelDone:'Suscripción cancelada. Tu plan sigue activo hasta el {date}.',subCancelNow:'Suscripción cancelada. Tu cuenta ahora es Free.',subResumeDone:'Suscripción reanudada ✓',subErr:'No se pudo completar la operación. Inténtalo de nuevo.',logoutLabel:'Cerrar sesión',enterApp:'Entrar a la app',backHome:'Volver a inicio',welcomeTitle:'Bienvenido a Skorpene',welcomeSub:'Preparando tu mundo…',proLockedHint:'🔒 Disponible en Pro (mapa en vivo)' },
        en:{ aiTitle:'AI Assistant',aiWelcome:'Hi 👋 Ask me anything about the events on the map.',aiPlaceholder:'Ask about the map…',aiAskPh:'Ask the AI…',aiThinking:'Thinking…',aiError:'Could not reach the AI. Make sure the server (start_server.py) is running and ANTHROPIC_API_KEY is set.',srcTelegram:'Telegram',srcOutlets:'News outlets',outletsLoading:'Loading news outlets…',outletsError:'Could not load news outlets (is the server running?).',outletsEmpty:'No articles available.',newsTitle:'LIVE NEWS',translatingNews:'Translating news…',translateDone:'News translated',showMore:'Show more',showLess:'Show less',mapLockTitle:'The live map is Pro',mapLockBody:'Unlock the live map to see every story geolocated in real time. On the Free plan you can add up to 5 sources and read them in the Feed.',mapLockCta:'Get Pro',srcLimitTitle:'You\'ve hit the Free limit',srcLimitBody:'The Free plan allows up to 5 sources. Upgrade to Pro for unlimited sources and the live map.',planChoose:'Choose plan',planLabel:'Plan',subCancel:'Cancel subscription',subResume:'Resume subscription',subCancelConfirm:'Cancel your subscription? You keep your plan until the end of the period you already paid for.',subCancelDone:'Subscription canceled. Your plan stays active until {date}.',subCancelNow:'Subscription canceled. Your account is now Free.',subResumeDone:'Subscription resumed ✓',subErr:'Something went wrong. Please try again.',logoutLabel:'Log out',enterApp:'Enter app',backHome:'Back to home',welcomeTitle:'Welcome to Skorpene',welcomeSub:'Preparing your world…',proLockedHint:'🔒 Available on Pro (live map)' },
        fr:{ aiTitle:'Assistant IA',aiWelcome:'Bonjour 👋 Posez-moi des questions sur les événements de la carte.',aiPlaceholder:'Question sur la carte…',aiAskPh:'Demandez à l\'IA…',aiThinking:'Réflexion…',aiError:'Impossible de contacter l\'IA. Vérifiez que le serveur (start_server.py) est en marche.',srcTelegram:'Telegram',srcOutlets:'Médias',outletsLoading:'Chargement…',outletsError:'Impossible de charger les médias.',outletsEmpty:'Aucun article disponible.',newsTitle:'ACTUALITÉS EN DIRECT',translatingNews:'Traduction…',translateDone:'Actualités traduites',showMore:'Afficher plus',showLess:'Afficher moins' },
        ru:{ aiTitle:'ИИ Ассистент',aiWelcome:'Привет 👋 Задайте мне вопросы о событиях на карте.',aiPlaceholder:'Вопрос о карте…',aiAskPh:'Спросите ИИ…',aiThinking:'Думаю…',aiError:'Не удалось связаться с ИИ. Проверьте, что сервер (start_server.py) запущен.',srcTelegram:'Телеграм',srcOutlets:'СМИ',outletsLoading:'Загрузка…',outletsError:'Не удалось загрузить СМИ.',outletsEmpty:'Нет доступных статей.',newsTitle:'НОВОСТИ В ПРЯМОМ ЭФИРЕ',translatingNews:'Перевод…',translateDone:'Новости переведены',showMore:'Показать больше',showLess:'Показать меньше' },
        zh:{ aiTitle:'AI 助手',aiWelcome:'你好 👋 随时可以问我地图上的事件。',aiPlaceholder:'询问地图…',aiAskPh:'询问 AI…',aiThinking:'思考中…',aiError:'无法联系 AI。请确认服务器 (start_server.py) 正在运行。',srcTelegram:'Telegram',srcOutlets:'新闻媒体',outletsLoading:'加载中…',outletsError:'无法加载新闻媒体。',outletsEmpty:'暂无文章。',newsTitle:'实时新闻',translatingNews:'翻译中…',translateDone:'新闻已翻译',showMore:'显示更多',showLess:'显示更少' },
        tr:{ aiTitle:'YZ Asistanı',aiWelcome:'Merhaba 👋 Haritadaki olaylar hakkında her şeyi sorabilirsiniz.',aiPlaceholder:'Harita hakkında sor…',aiAskPh:'YZ\'ye sor…',aiThinking:'Düşünüyor…',aiError:'YZ\'ye ulaşılamadı. Sunucunun (start_server.py) çalıştığından emin olun.',srcTelegram:'Telegram',srcOutlets:'Haber Kaynakları',outletsLoading:'Yükleniyor…',outletsError:'Haber kaynakları yüklenemedi.',outletsEmpty:'Makale bulunamadı.',newsTitle:'CANLI HABERLER',translatingNews:'Çevriliyor…',translateDone:'Haberler çevrildi',showMore:'Daha fazla göster',showLess:'Daha az göster' },
        ar:{ aiTitle:'مساعد الذكاء الاصطناعي',aiWelcome:'مرحباً 👋 اسألني عن أي شيء يتعلق بأحداث الخريطة.',aiPlaceholder:'سؤال عن الخريطة…',aiAskPh:'اسأل الذكاء الاصطناعي…',aiThinking:'جارٍ التفكير…',aiError:'تعذّر الاتصال بالذكاء الاصطناعي. تحقق من تشغيل الخادم (start_server.py).',srcTelegram:'تيليغرام',srcOutlets:'وسائل الإعلام',outletsLoading:'جارٍ التحميل…',outletsError:'تعذّر تحميل وسائل الإعلام.',outletsEmpty:'لا توجد مقالات.',newsTitle:'أخبار مباشرة',translatingNews:'جارٍ الترجمة…',translateDone:'تمت ترجمة الأخبار',showMore:'عرض المزيد',showLess:'عرض أقل' },
        fa:{ aiTitle:'دستیار هوش مصنوعی',aiWelcome:'سلام 👋 هر سوالی درباره رویدادهای نقشه دارید بپرسید.',aiPlaceholder:'سوال درباره نقشه…',aiAskPh:'از هوش مصنوعی بپرسید…',aiThinking:'در حال تفکر…',aiError:'اتصال به هوش مصنوعی ممکن نشد. مطمئن شوید سرور (start_server.py) در حال اجرا است.',srcTelegram:'تلگرام',srcOutlets:'رسانه‌ها',outletsLoading:'در حال بارگذاری…',outletsError:'بارگذاری رسانه‌ها ممکن نشد.',outletsEmpty:'مقاله‌ای موجود نیست.',newsTitle:'اخبار زنده',translatingNews:'در حال ترجمه…',translateDone:'اخبار ترجمه شد',showMore:'نمایش بیشتر',showLess:'نمایش کمتر' },
        he:{ aiTitle:'עוזר AI',aiWelcome:'שלום 👋 שאל אותי כל שאלה על האירועים במפה.',aiPlaceholder:'שאלה על המפה…',aiAskPh:'שאל את ה-AI…',aiThinking:'חושב…',aiError:'לא ניתן לפנות לבינה מלאכותית. ודא שהשרת (start_server.py) פועל.',srcTelegram:'טלגרם',srcOutlets:'מקורות חדשות',outletsLoading:'טוען…',outletsError:'לא ניתן לטעון את מקורות החדשות.',outletsEmpty:'אין מאמרים זמינים.',newsTitle:'חדשות חיות',translatingNews:'מתרגם…',translateDone:'החדשות תורגמו',showMore:'הצג עוד',showLess:'הצג פחות' }
    };
    Object.keys(AI_I18N).forEach(lng => { if (T[lng]) Object.assign(T[lng], AI_I18N[lng]); });

    // ── Missing UI keys (referenced by data-i18n in index.html but absent from the
    //    big T literal above) + custom-sources UI. Merged into T so applyLang()
    //    translates the search bar, coord/zoom labels, country-info panel, arsenal
    //    tabs and the "my sources" controls in every language. ──
    const EXTRA_I18N = {
        es:{ searchPh:'Buscar lugar…',latLbl:'LAT',lngLbl:'LNG',zoomLbl:'ZOOM',newsConnecting:'Conectando a Telegram...',extraLayers:'CAPAS ADICIONALES',eventsLayer:'Iconos de eventos',noLabels:'Sin etiquetas',arsenals:'Arsenales',missileArsenal:'🚀 Misiles',droneArsenal:'🛩 Drones',simulatorTitle:'⚔️ Simulador',politicalSystem:'Sistema',leader:'Líder',population:'Población',area_lbl:'Superficie',gdp:'PIB',ciGdpPc:'PIB per cápita',ciCurrency:'Moneda',ciGfp:'Ranking GFP',ciMilActive:'Activos',ciMilReserve:'Reserva',ciNukes:'Nucleares',ciGovernment:'Gobierno',ciDemographics:'Demografía',ciEconomy:'Economía',ciMilitary:'Militar',ciAlliances:'Alianzas',srcTelegram:'Telegram',srcOutlets:'Noticieros',srcAllNews:'Noticias',sourcesTab:'➕ Fuentes',mySources:'Mis fuentes',addSourcePh:'Pega el enlace del sitio (URL)',addBtn:'Añadir',srcHelp:'ayuda',srcHelpTitle:'¿Qué tipo de fuentes puedo añadir?',srcHelpBody:'<p>Puedes añadir <strong>cualquier tipo de fuente</strong> que produzca contenido nuevo de forma regular. Skorpene la consultará y mostrará los artículos en el feed y en el mapa.</p><h4>Telegram</h4><p>Escribe el nombre del canal con arroba: <code>@nombredelcanal</code>. También vale el enlace completo <code>https://t.me/nombredelcanal</code>.</p><h4>RSS / Atom</h4><p>Pega la URL del feed RSS o Atom. Casi todo lo que produce contenido nuevo tiene uno:</p><ul><li><strong>Noticieros</strong> (BBC, Al Jazeera, El País, The Diplomat…)</li><li><strong>Blogs y webs especializadas</strong> en tus temas (deportes, tecnología, cultura, finanzas…)</li><li><strong>Foros</strong> (Reddit con <code>/.rss</code> al final del subreddit, Hacker News, etc.)</li><li><strong>Think-tanks y publicaciones académicas</strong> (CSIS, Chatham House, Substack…)</li><li><strong>Comunidades nicho</strong> en tus aficiones</li></ul><p><em>Consejo:</em> si una web no tiene un feed visible, busca en Google <code>site:tuweb.com rss</code>.</p>',noSources:'Sin fuentes propias todavía.',srcAdded:'Fuente añadida — buscando noticias…',srcInvalid:'Introduce un enlace (URL) válido.',srcNoFeed:'No encontramos un feed en esa dirección. Prueba con la URL del RSS/Atom.',srcBlocked:'Este sitio bloquea el acceso automático. Prueba con la URL directa de su RSS/Atom.',srcUnreachable:'No pudimos conectar con ese sitio. Revisa el enlace.',srcSearching:'Buscando la fuente con IA…',srcLoading:'Cargando tus fuentes…',srcAll:'Todas las fuentes',srcDefault:'predeterminada',srcLive:'en vivo',srcCustom:'tuya',srcHide:'Ocultar',srcShow:'Mostrar',srcDelete:'Eliminar',srcConfirmDelete:'¿Seguro que quieres eliminar esta fuente?',srcTypeTg:'Telegram',srcTypeRss:'RSS' },
        en:{ searchPh:'Search place…',latLbl:'LAT',lngLbl:'LNG',zoomLbl:'ZOOM',newsConnecting:'Connecting to Telegram...',extraLayers:'ADDITIONAL LAYERS',eventsLayer:'Event icons',noLabels:'No labels',arsenals:'Arsenals',missileArsenal:'🚀 Missiles',droneArsenal:'🛩 Drones',simulatorTitle:'⚔️ Simulator',politicalSystem:'System',leader:'Leader',population:'Population',area_lbl:'Area',gdp:'GDP',ciGdpPc:'GDP per capita',ciCurrency:'Currency',ciGfp:'GFP Ranking',ciMilActive:'Active',ciMilReserve:'Reserve',ciNukes:'Nuclear',ciGovernment:'Government',ciDemographics:'Demographics',ciEconomy:'Economy',ciMilitary:'Military',ciAlliances:'Alliances',srcTelegram:'Telegram',srcOutlets:'News outlets',srcAllNews:'News',sourcesTab:'➕ Sources',mySources:'My sources',addSourcePh:'Paste the site link (URL)',addBtn:'Add',srcHelp:'help',srcHelpTitle:'What can I add as a source?',srcHelpBody:'<p>You can add <strong>any kind of source</strong> that regularly produces new content. Skorpene will fetch it and show items in the feed and on the map.</p><h4>Telegram</h4><p>Paste a channel handle with the at sign: <code>@channelname</code>. The full <code>https://t.me/channelname</code> link also works.</p><h4>RSS / Atom</h4><p>Paste the URL of any RSS or Atom feed. Most things that publish new content have one:</p><ul><li><strong>News outlets</strong> (BBC, Al Jazeera, The Diplomat…)</li><li><strong>Topic blogs and websites</strong> in your interests (sports, tech, culture, finance…)</li><li><strong>Forums</strong> (Reddit — append <code>/.rss</code> to a subreddit, Hacker News, etc.)</li><li><strong>Think-tanks and academic outlets</strong> (CSIS, Chatham House, Substack…)</li><li><strong>Niche communities</strong> around your hobbies</li></ul><p><em>Tip:</em> if a site has no visible feed, search Google for <code>site:yoursite.com rss</code>.</p>',noSources:'No custom sources yet.',srcAdded:'Source added — fetching news…',srcInvalid:'Enter a valid link (URL).',srcNoFeed:'We couldn\'t find a feed at that address. Try the RSS/Atom URL.',srcBlocked:'This site blocks automated access. Try its direct RSS/Atom URL.',srcUnreachable:'We couldn\'t reach that site. Check the link.',srcSearching:'Finding the source with AI…',srcLoading:'Loading your sources…',srcAll:'All sources',srcDefault:'default',srcLive:'live',srcCustom:'yours',srcHide:'Hide',srcShow:'Show',srcDelete:'Remove',srcConfirmDelete:'Are you sure you want to remove this source?',srcTypeTg:'Telegram',srcTypeRss:'RSS' },
        fr:{ searchPh:'Rechercher un lieu…',latLbl:'LAT',lngLbl:'LNG',zoomLbl:'ZOOM',newsConnecting:'Connexion à Telegram...',extraLayers:'COUCHES SUPPLÉMENTAIRES',eventsLayer:'Icônes d\'événements',noLabels:'Sans étiquettes',arsenals:'Arsenaux',missileArsenal:'🚀 Missiles',droneArsenal:'🛩 Drones',simulatorTitle:'⚔️ Simulateur',politicalSystem:'Système',leader:'Dirigeant',population:'Population',area_lbl:'Superficie',gdp:'PIB',ciGdpPc:'PIB par habitant',ciCurrency:'Monnaie',ciGfp:'Classement GFP',ciMilActive:'Actifs',ciMilReserve:'Réserve',ciNukes:'Nucléaire',ciGovernment:'Gouvernement',ciDemographics:'Démographie',ciEconomy:'Économie',ciMilitary:'Militaire',ciAlliances:'Alliances',srcTelegram:'Telegram',srcOutlets:'Médias',srcAllNews:'Actualités',sourcesTab:'➕ Sources',mySources:'Mes sources',addSourcePh:'Collez le lien du site (URL)',addBtn:'Ajouter',srcHelp:'aide',srcHelpTitle:'Quels types de sources puis-je ajouter ?',srcHelpBody:'<p>Vous pouvez ajouter <strong>tout type de source</strong> qui publie du contenu régulièrement. Skorpene la consultera et affichera les articles dans le flux et sur la carte.</p><h4>Telegram</h4><p>Tapez le nom du canal avec l\'arobase : <code>@nomcanal</code>. Le lien complet <code>https://t.me/nomcanal</code> fonctionne aussi.</p><h4>RSS / Atom</h4><p>Collez l\'URL d\'un flux RSS ou Atom :</p><ul><li><strong>Médias</strong> (BBC, Al Jazeera, Le Monde, The Diplomat…)</li><li><strong>Blogs et sites spécialisés</strong> selon vos centres d\'intérêt</li><li><strong>Forums</strong> (Reddit avec <code>/.rss</code>, Hacker News…)</li><li><strong>Think-tanks et publications académiques</strong></li><li><strong>Communautés de niche</strong> autour de vos hobbies</li></ul><p><em>Astuce :</em> si un site n\'a pas de flux visible, cherchez <code>site:votresite.com rss</code> sur Google.</p>',noSources:'Aucune source personnalisée.',srcAdded:'Source ajoutée — recherche en cours…',srcInvalid:'Saisissez un lien (URL) valide.',srcNoFeed:'Aucun flux trouvé à cette adresse. Essayez l\'URL du flux RSS/Atom.',srcBlocked:'Ce site bloque l\'accès automatisé. Essayez l\'URL directe de son flux RSS/Atom.',srcUnreachable:'Impossible de joindre ce site. Vérifiez le lien.',srcSearching:'Recherche de la source via l\'IA…',srcLoading:'Chargement de vos sources…',srcAll:'Toutes les sources',srcDefault:'par défaut',srcLive:'en direct',srcCustom:'à vous',srcHide:'Masquer',srcShow:'Afficher',srcDelete:'Supprimer',srcConfirmDelete:'Êtes-vous sûr de vouloir supprimer cette source ?',srcTypeTg:'Telegram',srcTypeRss:'RSS' },
        ru:{ searchPh:'Поиск места…',latLbl:'ШИР',lngLbl:'ДОЛ',zoomLbl:'МАСШТАБ',newsConnecting:'Подключение к Telegram...',extraLayers:'ДОПОЛНИТЕЛЬНЫЕ СЛОИ',eventsLayer:'Значки событий',noLabels:'Без подписей',arsenals:'Арсеналы',missileArsenal:'🚀 Ракеты',droneArsenal:'🛩 Дроны',simulatorTitle:'⚔️ Симулятор',politicalSystem:'Система',leader:'Лидер',population:'Население',area_lbl:'Площадь',gdp:'ВВП',ciGdpPc:'ВВП на душу',ciCurrency:'Валюта',ciGfp:'Рейтинг GFP',ciMilActive:'Действующие',ciMilReserve:'Резерв',ciNukes:'Ядерное',ciGovernment:'Правительство',ciDemographics:'Демография',ciEconomy:'Экономика',ciMilitary:'Армия',ciAlliances:'Союзы',srcTelegram:'Telegram',srcOutlets:'СМИ',srcAllNews:'Новости',sourcesTab:'➕ Источники',mySources:'Мои источники',addSourcePh:'Вставьте ссылку на сайт (URL)',addBtn:'Добавить',srcHelp:'помощь',srcHelpTitle:'Какие источники можно добавить?',srcHelpBody:'<p>Вы можете добавить <strong>любой источник</strong>, который регулярно публикует новый контент. Skorpene будет получать его и показывать в ленте и на карте.</p><h4>Telegram</h4><p>Введите имя канала со знаком @: <code>@названиеканала</code>. Также подойдёт полная ссылка <code>https://t.me/названиеканала</code>.</p><h4>RSS / Atom</h4><p>Вставьте URL ленты RSS или Atom:</p><ul><li><strong>СМИ</strong> (BBC, Al Jazeera, RT, Meduza…)</li><li><strong>Тематические блоги и сайты</strong> по вашим интересам</li><li><strong>Форумы</strong> (Reddit с <code>/.rss</code>, Hacker News…)</li><li><strong>Think-tanks и научные издания</strong></li><li><strong>Нишевые сообщества</strong> по вашим хобби</li></ul><p><em>Совет:</em> если на сайте нет видимой ленты, поищите в Google <code>site:вашсайт.com rss</code>.</p>',noSources:'Пока нет своих источников.',srcAdded:'Источник добавлен — загрузка новостей…',srcInvalid:'Введите корректную ссылку (URL).',srcNoFeed:'Не нашли ленту по этому адресу. Попробуйте URL RSS/Atom.',srcBlocked:'Этот сайт блокирует автоматический доступ. Попробуйте прямой URL его RSS/Atom.',srcUnreachable:'Не удалось подключиться к сайту. Проверьте ссылку.',srcSearching:'Ищем источник с помощью ИИ…',srcLoading:'Загрузка ваших источников…',srcAll:'Все источники',srcDefault:'по умолчанию',srcLive:'в эфире',srcCustom:'ваше',srcHide:'Скрыть',srcShow:'Показать',srcDelete:'Удалить',srcConfirmDelete:'Вы уверены, что хотите удалить этот источник?',srcTypeTg:'Telegram',srcTypeRss:'RSS' },
        zh:{ searchPh:'搜索地点…',latLbl:'纬度',lngLbl:'经度',zoomLbl:'缩放',newsConnecting:'正在连接 Telegram...',extraLayers:'附加图层',eventsLayer:'事件图标',noLabels:'隐藏标签',arsenals:'武器库',missileArsenal:'🚀 导弹',droneArsenal:'🛩 无人机',simulatorTitle:'⚔️ 模拟器',politicalSystem:'政体',leader:'领导人',population:'人口',area_lbl:'面积',gdp:'GDP',ciGdpPc:'人均GDP',ciCurrency:'货币',ciGfp:'GFP排名',ciMilActive:'现役',ciMilReserve:'预备役',ciNukes:'核武器',ciGovernment:'政府',ciDemographics:'人口统计',ciEconomy:'经济',ciMilitary:'军事',ciAlliances:'同盟',srcTelegram:'Telegram',srcOutlets:'媒体',srcAllNews:'新闻',sourcesTab:'➕ 来源',mySources:'我的来源',addSourcePh:'粘贴网站链接（URL）',addBtn:'添加',srcHelp:'帮助',srcHelpTitle:'我可以添加哪些类型的来源？',srcHelpBody:'<p>您可以添加<strong>任何定期发布新内容的来源</strong>。Skorpene 将获取内容并显示在 feed 和地图上。</p><h4>Telegram</h4><p>输入带 @ 的频道名：<code>@频道名</code>。完整链接 <code>https://t.me/频道名</code> 也可以。</p><h4>RSS / Atom</h4><p>粘贴任何 RSS 或 Atom feed 的 URL：</p><ul><li><strong>新闻媒体</strong>（BBC、Al Jazeera、人民日报…）</li><li><strong>主题博客和网站</strong>（您感兴趣的领域）</li><li><strong>论坛</strong>（Reddit 加 <code>/.rss</code>，Hacker News…）</li><li><strong>智库和学术出版物</strong></li><li><strong>您爱好的小众社区</strong></li></ul><p><em>提示：</em>如果网站没有可见的 feed，在 Google 上搜索 <code>site:网站.com rss</code>。</p>',noSources:'暂无自定义来源。',srcAdded:'已添加来源 — 正在获取新闻…',srcInvalid:'请输入有效的链接（URL）。',srcNoFeed:'在该地址未找到 feed。请尝试 RSS/Atom 网址。',srcBlocked:'该网站屏蔽了自动访问。请尝试其直接的 RSS/Atom 网址。',srcUnreachable:'无法连接该网站。请检查链接。',srcSearching:'正在用 AI 查找来源…',srcLoading:'正在加载你的来源…',srcAll:'所有来源',srcDefault:'默认',srcLive:'实时',srcCustom:'你的',srcHide:'隐藏',srcShow:'显示',srcDelete:'移除',srcConfirmDelete:'确定要删除此来源吗？',srcTypeTg:'Telegram',srcTypeRss:'RSS' },
        tr:{ searchPh:'Yer ara…',latLbl:'ENL',lngLbl:'BOY',zoomLbl:'YAKIN.',newsConnecting:'Telegram\'a bağlanıyor...',extraLayers:'EK KATMANLAR',eventsLayer:'Olay simgeleri',noLabels:'Etiketsiz',arsenals:'Cephanelikler',missileArsenal:'🚀 Füzeler',droneArsenal:'🛩 İHA\'lar',simulatorTitle:'⚔️ Simülatör',politicalSystem:'Sistem',leader:'Lider',population:'Nüfus',area_lbl:'Yüzölçümü',gdp:'GSYİH',ciGdpPc:'Kişi başı GSYİH',ciCurrency:'Para birimi',ciGfp:'GFP Sıralaması',ciMilActive:'Aktif',ciMilReserve:'Yedek',ciNukes:'Nükleer',ciGovernment:'Hükümet',ciDemographics:'Demografi',ciEconomy:'Ekonomi',ciMilitary:'Askeri',ciAlliances:'İttifaklar',srcTelegram:'Telegram',srcOutlets:'Haber siteleri',srcAllNews:'Haberler',sourcesTab:'➕ Kaynaklar',mySources:'Kaynaklarım',addSourcePh:'Sitenin bağlantısını yapıştırın (URL)',addBtn:'Ekle',srcHelp:'yardım',srcHelpTitle:'Hangi tür kaynakları ekleyebilirim?',srcHelpBody:'<p>Düzenli olarak yeni içerik üreten <strong>her tür kaynağı</strong> ekleyebilirsiniz. Skorpene bunları çekecek ve akışta ve haritada gösterecek.</p><h4>Telegram</h4><p>Kanal adını @ ile yazın: <code>@kanaladi</code>. Tam bağlantı <code>https://t.me/kanaladi</code> de işe yarar.</p><h4>RSS / Atom</h4><p>Herhangi bir RSS veya Atom feed URL\'sini yapıştırın:</p><ul><li><strong>Haber kuruluşları</strong> (BBC, Al Jazeera, Hürriyet…)</li><li><strong>Konu blogları ve siteler</strong> (ilgi alanlarınız)</li><li><strong>Forumlar</strong> (Reddit <code>/.rss</code> ile, Hacker News…)</li><li><strong>Düşünce kuruluşları ve akademik yayınlar</strong></li><li><strong>Hobilerinizle ilgili niş topluluklar</strong></li></ul><p><em>İpucu:</em> bir sitenin görünür feed\'i yoksa Google\'da <code>site:siteniz.com rss</code> arayın.</p>',noSources:'Henüz özel kaynak yok.',srcAdded:'Kaynak eklendi — haberler alınıyor…',srcInvalid:'Geçerli bir bağlantı (URL) girin.',srcNoFeed:'Bu adreste bir feed bulunamadı. RSS/Atom URL\'sini deneyin.',srcBlocked:'Bu site otomatik erişimi engelliyor. Doğrudan RSS/Atom URL\'sini deneyin.',srcUnreachable:'Bu siteye ulaşılamadı. Bağlantıyı kontrol edin.',srcSearching:'Kaynak yapay zekâ ile aranıyor…',srcLoading:'Kaynakların yükleniyor…',srcAll:'Tüm kaynaklar',srcDefault:'varsayılan',srcLive:'canlı',srcCustom:'sana ait',srcHide:'Gizle',srcShow:'Göster',srcDelete:'Kaldır',srcConfirmDelete:'Bu kaynağı kaldırmak istediğinizden emin misiniz?',srcTypeTg:'Telegram',srcTypeRss:'RSS' },
        ar:{ searchPh:'ابحث عن مكان…',latLbl:'العرض',lngLbl:'الطول',zoomLbl:'تكبير',newsConnecting:'جارٍ الاتصال بتيليغرام...',extraLayers:'طبقات إضافية',eventsLayer:'أيقونات الأحداث',noLabels:'بدون تسميات',arsenals:'الترسانات',missileArsenal:'🚀 الصواريخ',droneArsenal:'🛩 الطائرات المسيّرة',simulatorTitle:'⚔️ المحاكي',politicalSystem:'النظام',leader:'الزعيم',population:'السكان',area_lbl:'المساحة',gdp:'الناتج المحلي',ciGdpPc:'الناتج للفرد',ciCurrency:'العملة',ciGfp:'تصنيف GFP',ciMilActive:'نشط',ciMilReserve:'احتياط',ciNukes:'نووي',ciGovernment:'الحكومة',ciDemographics:'الديموغرافيا',ciEconomy:'الاقتصاد',ciMilitary:'الجيش',ciAlliances:'التحالفات',srcTelegram:'تيليغرام',srcOutlets:'وسائل الإعلام',srcAllNews:'الأخبار',sourcesTab:'➕ مصادر',mySources:'مصادري',addSourcePh:'الصق رابط الموقع (URL)',addBtn:'إضافة',srcHelp:'مساعدة',srcHelpTitle:'ما أنواع المصادر التي يمكنني إضافتها؟',srcHelpBody:'<p>يمكنك إضافة <strong>أي نوع من المصادر</strong> التي تنتج محتوى جديدًا بانتظام. سيقوم Skorpene بجلبها وعرضها في التغذية وعلى الخريطة.</p><h4>تيليغرام</h4><p>اكتب اسم القناة مع @: <code>@اسم_القناة</code>. الرابط الكامل <code>https://t.me/اسم_القناة</code> يعمل أيضًا.</p><h4>RSS / Atom</h4><p>الصق عنوان URL لأي تغذية RSS أو Atom:</p><ul><li><strong>وسائل الإعلام</strong> (BBC, Al Jazeera, الجزيرة…)</li><li><strong>مدونات ومواقع متخصصة</strong> في اهتماماتك</li><li><strong>المنتديات</strong> (Reddit مع <code>/.rss</code>، Hacker News…)</li><li><strong>مراكز الأبحاث والمنشورات الأكاديمية</strong></li><li><strong>المجتمعات المتخصصة</strong> حول هواياتك</li></ul><p><em>نصيحة:</em> إذا لم يكن للموقع تغذية مرئية، ابحث في Google عن <code>site:موقعك.com rss</code>.</p>',noSources:'لا توجد مصادر مخصصة بعد.',srcAdded:'تمت إضافة المصدر — جارٍ جلب الأخبار…',srcInvalid:'أدخل رابطًا صالحًا (URL).',srcNoFeed:'لم نعثر على تغذية في هذا العنوان. جرّب رابط RSS/Atom.',srcBlocked:'هذا الموقع يحظر الوصول الآلي. جرّب رابط RSS/Atom المباشر.',srcUnreachable:'تعذّر الاتصال بهذا الموقع. تحقق من الرابط.',srcSearching:'جارٍ البحث عن المصدر بالذكاء الاصطناعي…',srcLoading:'جارٍ تحميل مصادرك…',srcAll:'كل المصادر',srcDefault:'افتراضي',srcLive:'مباشر',srcCustom:'لك',srcHide:'إخفاء',srcShow:'إظهار',srcDelete:'إزالة',srcConfirmDelete:'هل أنت متأكد أنك تريد إزالة هذا المصدر؟',srcTypeTg:'Telegram',srcTypeRss:'RSS' },
        fa:{ searchPh:'جستجوی مکان…',latLbl:'عرض',lngLbl:'طول',zoomLbl:'بزرگ‌نمایی',newsConnecting:'در حال اتصال به تلگرام...',extraLayers:'لایه‌های اضافی',eventsLayer:'نمادهای رویداد',noLabels:'بدون برچسب',arsenals:'زرادخانه‌ها',missileArsenal:'🚀 موشک‌ها',droneArsenal:'🛩 پهپادها',simulatorTitle:'⚔️ شبیه‌ساز',politicalSystem:'نظام',leader:'رهبر',population:'جمعیت',area_lbl:'مساحت',gdp:'تولید ناخالص',ciGdpPc:'سرانه تولید',ciCurrency:'واحد پول',ciGfp:'رتبه GFP',ciMilActive:'فعال',ciMilReserve:'ذخیره',ciNukes:'هسته‌ای',ciGovernment:'دولت',ciDemographics:'جمعیت‌شناسی',ciEconomy:'اقتصاد',ciMilitary:'نظامی',ciAlliances:'اتحادها',srcTelegram:'تلگرام',srcOutlets:'رسانه‌ها',srcAllNews:'اخبار',sourcesTab:'➕ منابع',mySources:'منابع من',addSourcePh:'پیوند سایت را بچسبانید (URL)',addBtn:'افزودن',srcHelp:'راهنما',srcHelpTitle:'چه نوع منابعی می‌توانم اضافه کنم؟',srcHelpBody:'<p>می‌توانید <strong>هر نوع منبعی</strong> که به‌طور منظم محتوای جدید تولید می‌کند اضافه کنید. Skorpene آن را دریافت کرده و در feed و نقشه نمایش می‌دهد.</p><h4>تلگرام</h4><p>نام کانال را با @ وارد کنید: <code>@نام_کانال</code>. لینک کامل <code>https://t.me/نام_کانال</code> نیز کار می‌کند.</p><h4>RSS / Atom</h4><p>URL هر feed RSS یا Atom را وارد کنید:</p><ul><li><strong>رسانه‌های خبری</strong> (BBC، الجزیره، ایرنا…)</li><li><strong>وبلاگ‌ها و سایت‌های تخصصی</strong> در زمینه علایق شما</li><li><strong>انجمن‌ها</strong> (Reddit با <code>/.rss</code>، Hacker News…)</li><li><strong>اندیشکده‌ها و نشریات علمی</strong></li><li><strong>جوامع تخصصی</strong> پیرامون سرگرمی‌های شما</li></ul><p><em>نکته:</em> اگر سایتی feed قابل مشاهده ندارد، در Google جستجو کنید <code>site:سایت_شما.com rss</code>.</p>',noSources:'هنوز منبعی اضافه نشده.',srcAdded:'منبع اضافه شد — در حال دریافت اخبار…',srcInvalid:'یک پیوند (URL) معتبر وارد کنید.',srcNoFeed:'در آن آدرس فیدی پیدا نشد. آدرس RSS/Atom را امتحان کنید.',srcBlocked:'این سایت دسترسی خودکار را مسدود می‌کند. آدرس مستقیم RSS/Atom آن را امتحان کنید.',srcUnreachable:'نتوانستیم به این سایت متصل شویم. پیوند را بررسی کنید.',srcSearching:'در حال یافتن منبع با هوش مصنوعی…',srcLoading:'در حال بارگذاری منابع شما…',srcAll:'همه منابع',srcDefault:'پیش‌فرض',srcLive:'زنده',srcCustom:'مال شما',srcHide:'پنهان',srcShow:'نمایش',srcDelete:'حذف',srcConfirmDelete:'آیا مطمئن هستید که می‌خواهید این منبع را حذف کنید؟',srcTypeTg:'Telegram',srcTypeRss:'RSS' },
        he:{ searchPh:'חיפוש מקום…',latLbl:'רוחב',lngLbl:'אורך',zoomLbl:'זום',newsConnecting:'מתחבר לטלגרם...',extraLayers:'שכבות נוספות',eventsLayer:'סמלי אירועים',noLabels:'ללא תוויות',arsenals:'מאגרי נשק',missileArsenal:'🚀 טילים',droneArsenal:'🛩 רחפנים',simulatorTitle:'⚔️ סימולטור',politicalSystem:'משטר',leader:'מנהיג',population:'אוכלוסייה',area_lbl:'שטח',gdp:'תמ"ג',ciGdpPc:'תמ"ג לנפש',ciCurrency:'מטבע',ciGfp:'דירוג GFP',ciMilActive:'פעילים',ciMilReserve:'מילואים',ciNukes:'גרעיני',ciGovernment:'ממשל',ciDemographics:'דמוגרפיה',ciEconomy:'כלכלה',ciMilitary:'צבא',ciAlliances:'בריתות',srcTelegram:'טלגרם',srcOutlets:'כלי תקשורת',srcAllNews:'חדשות',sourcesTab:'➕ מקורות',mySources:'המקורות שלי',addSourcePh:'הדבק את קישור האתר (URL)',addBtn:'הוסף',srcHelp:'עזרה',srcHelpTitle:'אילו סוגי מקורות אפשר להוסיף?',srcHelpBody:'<p>אפשר להוסיף <strong>כל סוג של מקור</strong> שמייצר תוכן חדש באופן קבוע. Skorpene ימשוך אותו ויציג בפיד ובמפה.</p><h4>טלגרם</h4><p>הכנס את שם הערוץ עם @: <code>@שם_הערוץ</code>. גם הקישור המלא <code>https://t.me/שם_הערוץ</code> עובד.</p><h4>RSS / Atom</h4><p>הדבק את ה-URL של כל פיד RSS או Atom:</p><ul><li><strong>אתרי חדשות</strong> (BBC, Al Jazeera, Ynet…)</li><li><strong>בלוגים ואתרי נישה</strong> בתחומי העניין שלך</li><li><strong>פורומים</strong> (Reddit עם <code>/.rss</code>, Hacker News…)</li><li><strong>מכוני מחקר ופרסומים אקדמיים</strong></li><li><strong>קהילות נישה</strong> סביב התחביבים שלך</li></ul><p><em>טיפ:</em> אם לאתר אין פיד גלוי, חפש ב-Google <code>site:אתר.com rss</code>.</p>',noSources:'אין מקורות מותאמים עדיין.',srcAdded:'מקור נוסף — מביא חדשות…',srcInvalid:'הזן קישור (URL) תקין.',srcNoFeed:'לא נמצא פיד בכתובת הזו. נסה את כתובת ה-RSS/Atom.',srcBlocked:'האתר הזה חוסם גישה אוטומטית. נסה את כתובת ה-RSS/Atom הישירה שלו.',srcUnreachable:'לא הצלחנו להתחבר לאתר הזה. בדוק את הקישור.',srcSearching:'מחפש את המקור עם בינה מלאכותית…',srcLoading:'טוען את המקורות שלך…',srcAll:'כל המקורות',srcDefault:'ברירת מחדל',srcLive:'חי',srcCustom:'שלך',srcHide:'הסתר',srcShow:'הצג',srcDelete:'הסר',srcConfirmDelete:'האם אתה בטוח שברצונך להסיר מקור זה?',srcTypeTg:'Telegram',srcTypeRss:'RSS' }
    };
    Object.keys(EXTRA_I18N).forEach(lng => { if (T[lng]) Object.assign(T[lng], EXTRA_I18N[lng]); });
    const ONLINE_I18N = {
        es:{ onlineMode:'EN VIVO',  offlineMode:'PAUSADO',      onlineModeTip:'En línea — clic para pausar todo',         offlineModeTip:'Modo offline — clic para reanudar' },
        en:{ onlineMode:'LIVE',     offlineMode:'PAUSED',       onlineModeTip:'Online — click to pause everything',        offlineModeTip:'Offline mode — click to resume' },
        fr:{ onlineMode:'EN DIRECT',offlineMode:'PAUSÉ',        onlineModeTip:'En ligne — cliquer pour tout mettre en pause', offlineModeTip:'Mode hors ligne — cliquer pour reprendre' },
        ru:{ onlineMode:'В ЭФИРЕ',  offlineMode:'ПАУЗА',        onlineModeTip:'Онлайн — нажмите, чтобы приостановить',     offlineModeTip:'Офлайн — нажмите для возобновления' },
        zh:{ onlineMode:'直播',     offlineMode:'已暂停',        onlineModeTip:'在线 — 点击暂停全部',                       offlineModeTip:'离线模式 — 点击恢复' },
        tr:{ onlineMode:'CANLI',    offlineMode:'DURAKLATILDI', onlineModeTip:'Çevrimiçi — duraklatmak için tıkla',        offlineModeTip:'Çevrimdışı mod — devam etmek için tıkla' },
        ar:{ onlineMode:'مباشر',    offlineMode:'متوقف',         onlineModeTip:'متصل — انقر للإيقاف المؤقت',               offlineModeTip:'وضع عدم الاتصال — انقر للاستئناف' },
        fa:{ onlineMode:'زنده',     offlineMode:'متوقف',         onlineModeTip:'آنلاین — برای توقف کلیک کنید',             offlineModeTip:'حالت آفلاین — برای ادامه کلیک کنید' },
        he:{ onlineMode:'חי',       offlineMode:'מושהה',         onlineModeTip:'מחובר — לחץ להשהיה',                       offlineModeTip:'מצב לא מקוון — לחץ לחידוש' }
    };
    Object.keys(ONLINE_I18N).forEach(lng => { if (T[lng]) Object.assign(T[lng], ONLINE_I18N[lng]); });
    const THEME_I18N = {
        es:{ uiTheme:'TEMA DE INTERFAZ', themeDark:'🌙 Oscuro',  themeLight:'☀️ Claro'   },
        en:{ uiTheme:'INTERFACE THEME',  themeDark:'🌙 Dark',    themeLight:'☀️ Light'   },
        fr:{ uiTheme:'THÈME INTERFACE',  themeDark:'🌙 Sombre',  themeLight:'☀️ Clair'   },
        ru:{ uiTheme:'ТЕМА ИНТЕРФЕЙСА',  themeDark:'🌙 Тёмная',  themeLight:'☀️ Светлая' },
        zh:{ uiTheme:'界面主题',          themeDark:'🌙 暗色',    themeLight:'☀️ 亮色'    },
        tr:{ uiTheme:'ARAYÜZ TEMASI',    themeDark:'🌙 Koyu',    themeLight:'☀️ Açık'    },
        ar:{ uiTheme:'سمة الواجهة',       themeDark:'🌙 داكن',   themeLight:'☀️ فاتح'    },
        fa:{ uiTheme:'تم رابط کاربری',   themeDark:'🌙 تاریک',  themeLight:'☀️ روشن'    },
        he:{ uiTheme:'ערכת נושא',         themeDark:'🌙 כהה',    themeLight:'☀️ בהיר'    }
    };
    Object.keys(THEME_I18N).forEach(lng => { if (T[lng]) Object.assign(T[lng], THEME_I18N[lng]); });
    // Misc strings that were missing or partially translated across the 9 languages.
    const SETTINGS_I18N = {
        es:{ settings:'AJUSTES',           language:'IDIOMA',           satelliteClassic:'Satélite clásico', capital:'Capital'   },
        en:{ settings:'SETTINGS',          language:'LANGUAGE',         satelliteClassic:'Classic satellite', capital:'Capital'  },
        fr:{ settings:'PARAMÈTRES',        language:'LANGUE',           satelliteClassic:'Satellite classique', capital:'Capitale' },
        ru:{ settings:'НАСТРОЙКИ',         language:'ЯЗЫК',             satelliteClassic:'Классический спутник', capital:'Столица' },
        zh:{ settings:'设置',              language:'语言',              satelliteClassic:'经典卫星',           capital:'首都'      },
        tr:{ settings:'AYARLAR',           language:'DİL',              satelliteClassic:'Klasik uydu',       capital:'Başkent'   },
        ar:{ settings:'الإعدادات',          language:'اللغة',            satelliteClassic:'قمر صناعي كلاسيكي',  capital:'العاصمة'   },
        fa:{ settings:'تنظیمات',           language:'زبان',             satelliteClassic:'ماهواره کلاسیک',     capital:'پایتخت'    },
        he:{ settings:'הגדרות',            language:'שפה',              satelliteClassic:'לוויין קלאסי',      capital:'בירה'      }
    };
    Object.keys(SETTINGS_I18N).forEach(lng => { if (T[lng]) Object.assign(T[lng], SETTINGS_I18N[lng]); });
    // ── Icons-per-source setting + "Favorite Topics Box" tab — all 9 languages ──
    const FAV_I18N = {
        es:{ iconsPerSource:'ICONOS POR FUENTE', iconsPerSourceHint:'Máximo de iconos que cada fuente coloca en el mapa.',
             favTab:'Feed', favTitle:'Feed', favSubtitle:'Pregunta a la IA sobre las noticias de tus fuentes',
             favSources:'Tus fuentes', favTopics:'Tus temas', favNoSources:'Aún no has añadido fuentes. Añádelas en la pestaña «Fuentes» del panel de noticias.',
             favAskPh:'Pregunta a la IA sobre tus noticias…', favSend:'Enviar',
             favWelcome:'Hola 👋 Aquí puedes preguntarme cualquier cosa sobre las noticias de tus fuentes. Te las explico, resumo o amplío la información.',
             favThinking:'Pensando…', favError:'No se pudo contactar con la IA. Revisa que el servidor esté en marcha.', favEmptyChat:'Escribe tu primera pregunta abajo.' },
        en:{ iconsPerSource:'ICONS PER SOURCE', iconsPerSourceHint:'Max icons each source places on the map.',
             favTab:'Feed', favTitle:'Feed', favSubtitle:'Ask the AI about the news from your sources',
             favSources:'Your sources', favTopics:'Your topics', favNoSources:'You haven\'t added any sources yet. Add them in the "Sources" tab of the news panel.',
             favAskPh:'Ask the AI about your news…', favSend:'Send',
             favWelcome:'Hi 👋 Ask me anything about the news from your sources. I can explain, summarize or expand on them.',
             favThinking:'Thinking…', favError:'Could not reach the AI. Make sure the server is running.', favEmptyChat:'Type your first question below.' },
        fr:{ iconsPerSource:'ICÔNES PAR SOURCE', iconsPerSourceHint:'Nombre max d\'icônes que chaque source place sur la carte.',
             favTab:'Feed', favTitle:'Feed', favSubtitle:'Interrogez l\'IA sur les actualités de vos sources',
             favSources:'Vos sources', favTopics:'Vos thèmes', favNoSources:'Vous n\'avez encore ajouté aucune source. Ajoutez-les dans l\'onglet « Sources ».',
             favAskPh:'Interrogez l\'IA sur vos actualités…', favSend:'Envoyer',
             favWelcome:'Bonjour 👋 Posez-moi des questions sur les actualités de vos sources. Je peux les expliquer, résumer ou approfondir.',
             favThinking:'Réflexion…', favError:'Impossible de contacter l\'IA. Vérifiez que le serveur est en marche.', favEmptyChat:'Écrivez votre première question ci-dessous.' },
        ru:{ iconsPerSource:'ЗНАЧКОВ НА ИСТОЧНИК', iconsPerSourceHint:'Макс. значков, которые каждый источник ставит на карту.',
             favTab:'Feed', favTitle:'Feed', favSubtitle:'Спросите ИИ о новостях из ваших источников',
             favSources:'Ваши источники', favTopics:'Ваши темы', favNoSources:'Вы ещё не добавили источники. Добавьте их во вкладке «Источники».',
             favAskPh:'Спросите ИИ о ваших новостях…', favSend:'Отправить',
             favWelcome:'Привет 👋 Спросите меня о новостях из ваших источников. Я объясню, кратко изложу или дополню их.',
             favThinking:'Думаю…', favError:'Не удалось связаться с ИИ. Проверьте, что сервер запущен.', favEmptyChat:'Напишите свой первый вопрос ниже.' },
        zh:{ iconsPerSource:'每个来源的图标数', iconsPerSourceHint:'每个来源在地图上放置的最大图标数。',
             favTab:'Feed', favTitle:'Feed', favSubtitle:'就你来源的新闻向 AI 提问',
             favSources:'你的来源', favTopics:'你的主题', favNoSources:'你还没有添加来源。请在新闻面板的“来源”标签中添加。',
             favAskPh:'就你的新闻向 AI 提问…', favSend:'发送',
             favWelcome:'你好 👋 就你来源的新闻问我任何问题。我可以解释、总结或扩展。',
             favThinking:'思考中…', favError:'无法联系 AI。请确认服务器正在运行。', favEmptyChat:'在下面输入你的第一个问题。' },
        tr:{ iconsPerSource:'KAYNAK BAŞINA SİMGE', iconsPerSourceHint:'Her kaynağın haritaya koyduğu maksimum simge.',
             favTab:'Feed', favTitle:'Feed', favSubtitle:'Kaynaklarınızın haberleri hakkında YZ\'ye sorun',
             favSources:'Kaynaklarınız', favTopics:'Konularınız', favNoSources:'Henüz kaynak eklemediniz. «Kaynaklar» sekmesinden ekleyin.',
             favAskPh:'Haberleriniz hakkında YZ\'ye sorun…', favSend:'Gönder',
             favWelcome:'Merhaba 👋 Kaynaklarınızın haberleri hakkında her şeyi sorun. Açıklayabilir, özetleyebilir veya genişletebilirim.',
             favThinking:'Düşünüyor…', favError:'YZ\'ye ulaşılamadı. Sunucunun çalıştığından emin olun.', favEmptyChat:'İlk sorunuzu aşağıya yazın.' },
        ar:{ iconsPerSource:'الأيقونات لكل مصدر', iconsPerSourceHint:'أقصى عدد من الأيقونات يضعها كل مصدر على الخريطة.',
             favTab:'Feed', favTitle:'Feed', favSubtitle:'اسأل الذكاء الاصطناعي عن أخبار مصادرك',
             favSources:'مصادرك', favTopics:'مواضيعك', favNoSources:'لم تُضف أي مصادر بعد. أضِفها من تبويب «المصادر».',
             favAskPh:'اسأل الذكاء الاصطناعي عن أخبارك…', favSend:'إرسال',
             favWelcome:'مرحباً 👋 اسألني أي شيء عن أخبار مصادرك. يمكنني شرحها أو تلخيصها أو التوسّع فيها.',
             favThinking:'جارٍ التفكير…', favError:'تعذّر الاتصال بالذكاء الاصطناعي. تأكّد من تشغيل الخادم.', favEmptyChat:'اكتب سؤالك الأول بالأسفل.' },
        fa:{ iconsPerSource:'نمادها به ازای منبع', iconsPerSourceHint:'حداکثر نمادهایی که هر منبع روی نقشه می‌گذارد.',
             favTab:'Feed', favTitle:'Feed', favSubtitle:'درباره اخبار منابع خود از هوش مصنوعی بپرسید',
             favSources:'منابع شما', favTopics:'موضوع‌های شما', favNoSources:'هنوز منبعی اضافه نکرده‌اید. از زبانه «منابع» اضافه کنید.',
             favAskPh:'درباره اخبار خود از هوش مصنوعی بپرسید…', favSend:'ارسال',
             favWelcome:'سلام 👋 درباره اخبار منابع خود هر چیزی بپرسید. می‌توانم توضیح دهم، خلاصه کنم یا گسترش دهم.',
             favThinking:'در حال تفکر…', favError:'اتصال به هوش مصنوعی ممکن نشد. مطمئن شوید سرور در حال اجراست.', favEmptyChat:'اولین پرسش خود را پایین بنویسید.' },
        he:{ iconsPerSource:'סמלים לכל מקור', iconsPerSourceHint:'מקסימום סמלים שכל מקור מציב על המפה.',
             favTab:'Feed', favTitle:'Feed', favSubtitle:'שאל את ה-AI על החדשות מהמקורות שלך',
             favSources:'המקורות שלך', favTopics:'הנושאים שלך', favNoSources:'עדיין לא הוספת מקורות. הוסף אותם בלשונית «מקורות».',
             favAskPh:'שאל את ה-AI על החדשות שלך…', favSend:'שלח',
             favWelcome:'שלום 👋 שאל אותי כל דבר על החדשות מהמקורות שלך. אוכל להסביר, לסכם או להרחיב.',
             favThinking:'חושב…', favError:'לא ניתן לפנות ל-AI. ודא שהשרת פועל.', favEmptyChat:'כתוב את שאלתך הראשונה למטה.' }
    };
    Object.keys(FAV_I18N).forEach(lng => { if (T[lng]) Object.assign(T[lng], FAV_I18N[lng]); });
    // News-reader strings for the redesigned Favorite Topics Box.
    const FAV_I18N2 = {
        es:{ favItems:'noticias', favLoading:'Cargando noticias de tus fuentes…' },
        en:{ favItems:'news items', favLoading:'Loading news from your sources…' },
        fr:{ favItems:'actualités', favLoading:'Chargement des actualités de vos sources…' },
        ru:{ favItems:'новостей', favLoading:'Загрузка новостей из ваших источников…' },
        zh:{ favItems:'条新闻', favLoading:'正在加载你来源的新闻…' },
        tr:{ favItems:'haber', favLoading:'Kaynaklarınızdan haberler yükleniyor…' },
        ar:{ favItems:'خبر', favLoading:'جارٍ تحميل أخبار مصادرك…' },
        fa:{ favItems:'خبر', favLoading:'در حال بارگذاری اخبار منابع شما…' },
        he:{ favItems:'חדשות', favLoading:'טוען חדשות מהמקורות שלך…' }
    };
    Object.keys(FAV_I18N2).forEach(lng => { if (T[lng]) Object.assign(T[lng], FAV_I18N2[lng]); });
    // AI chat → "add sources" replies + the dev reset button, in every language.
    const AISRC_I18N = {
        es:{ aiSourcesAdded:'Listo: he añadido {n} fuentes a tu feed. Mira el mapa y el Feed.', aiSourcesNone:'No encontré fuentes nuevas para añadir (quizá ya las tenías).', devReset:'Reiniciar todo (dev)' },
        en:{ aiSourcesAdded:'Done: I added {n} sources to your feed. Check the map and the Feed.', aiSourcesNone:'I couldn\'t find new sources to add (you may already have them).', devReset:'Reset everything (dev)' },
        fr:{ aiSourcesAdded:'C\'est fait : j\'ai ajouté {n} sources à ton flux. Regarde la carte et le Feed.', aiSourcesNone:'Je n\'ai pas trouvé de nouvelles sources à ajouter (tu les as peut-être déjà).', devReset:'Tout réinitialiser (dev)' },
        ru:{ aiSourcesAdded:'Готово: я добавил {n} источников в твою ленту. Посмотри на карту и Feed.', aiSourcesNone:'Не нашёл новых источников для добавления (возможно, они уже есть).', devReset:'Сбросить всё (dev)' },
        zh:{ aiSourcesAdded:'完成：我已为你的资讯流添加了 {n} 个来源。看看地图和 Feed。', aiSourcesNone:'没有找到可添加的新来源（也许你已经有了）。', devReset:'重置全部（开发）' },
        tr:{ aiSourcesAdded:'Tamam: akışına {n} kaynak ekledim. Haritaya ve Feed\'e bak.', aiSourcesNone:'Eklenecek yeni kaynak bulamadım (belki zaten var).', devReset:'Her şeyi sıfırla (dev)' },
        ar:{ aiSourcesAdded:'تم: أضفت {n} مصادر إلى موجزك. ألقِ نظرة على الخريطة وعلى الـFeed.', aiSourcesNone:'لم أجد مصادر جديدة لإضافتها (ربما لديك بالفعل).', devReset:'إعادة ضبط كل شيء (مطوّر)' },
        fa:{ aiSourcesAdded:'انجام شد: {n} منبع به فید تو افزودم. نقشه و Feed را ببین.', aiSourcesNone:'منبع جدیدی برای افزودن پیدا نکردم (شاید از قبل داری).', devReset:'بازنشانی همه‌چیز (توسعه)' },
        he:{ aiSourcesAdded:'בוצע: הוספתי {n} מקורות לפיד שלך. הסתכל על המפה ועל ה-Feed.', aiSourcesNone:'לא מצאתי מקורות חדשים להוספה (ייתכן שכבר יש לך).', devReset:'אפס הכול (מפתח)' },
        nl:{ aiSourcesAdded:'Klaar: ik heb {n} bronnen aan je feed toegevoegd. Bekijk de kaart en de Feed.', aiSourcesNone:'Ik kon geen nieuwe bronnen vinden om toe te voegen (je hebt ze misschien al).', devReset:'Alles resetten (dev)' },
        it:{ aiSourcesAdded:'Fatto: ho aggiunto {n} fonti al tuo feed. Guarda la mappa e il Feed.', aiSourcesNone:'Non ho trovato nuove fonti da aggiungere (forse le hai già).', devReset:'Reimposta tutto (dev)' },
        pt:{ aiSourcesAdded:'Pronto: adicionei {n} fontes ao teu feed. Vê o mapa e o Feed.', aiSourcesNone:'Não encontrei novas fontes para adicionar (talvez já as tenhas).', devReset:'Repor tudo (dev)' },
        hi:{ aiSourcesAdded:'हो गया: मैंने तुम्हारे फ़ीड में {n} स्रोत जोड़े। मानचित्र और Feed देखो।', aiSourcesNone:'जोड़ने के लिए कोई नया स्रोत नहीं मिला (शायद पहले से हैं)।', devReset:'सब रीसेट करो (dev)' },
    };
    Object.keys(AISRC_I18N).forEach(lng => { if (T[lng]) Object.assign(T[lng], AISRC_I18N[lng]); });
    // News context menu (right-click) + AI "analyze" greeting + source-removal, per language.
    const NEWSCTX_I18N = {
        es:{ newsSelect:'Seleccionar', newsShowInFeed:'Mostrar en feed', newsAnalyzeOne:'Analizar noticia', newsAnalyzeN:'Analizar {n} noticias', newsGeolocate:'Geolocalizar noticia', newsGeolocateN:'Geolocalizar {n} noticias', newsGeolocating:'Geolocalizando…', newsGeolocateFail:'No se pudo geolocalizar', aiAnalyzeGreet1:'¿Qué quieres saber sobre esta noticia?', aiAnalyzeGreetN:'¿Qué quieres saber sobre estas {n} noticias?', aiSourcesRemoved:'Listo: he quitado {n} fuentes de tu feed.', aiSourcesRemovedNone:'No encontré esas fuentes para quitar.' },
        en:{ newsSelect:'Select', newsShowInFeed:'Show in feed', newsAnalyzeOne:'Analyze story', newsAnalyzeN:'Analyze {n} stories', newsGeolocate:'Geolocate story', newsGeolocateN:'Geolocate {n} stories', newsGeolocating:'Geolocating…', newsGeolocateFail:'Couldn\'t geolocate', aiAnalyzeGreet1:'What would you like to know about this story?', aiAnalyzeGreetN:'What would you like to know about these {n} stories?', aiSourcesRemoved:'Done: I removed {n} sources from your feed.', aiSourcesRemovedNone:'I couldn\'t find those sources to remove.' },
        fr:{ newsSelect:'Sélectionner', newsShowInFeed:'Afficher dans le feed', newsAnalyzeOne:'Analyser l\'actu', newsAnalyzeN:'Analyser {n} actus', newsGeolocate:'Géolocaliser l\'actu', newsGeolocateN:'Géolocaliser {n} actus', newsGeolocating:'Géolocalisation…', newsGeolocateFail:'Géolocalisation impossible', aiAnalyzeGreet1:'Que veux-tu savoir sur cette actu ?', aiAnalyzeGreetN:'Que veux-tu savoir sur ces {n} actus ?', aiSourcesRemoved:'C\'est fait : j\'ai retiré {n} sources de ton flux.', aiSourcesRemovedNone:'Je n\'ai pas trouvé ces sources à retirer.' },
        ru:{ newsSelect:'Выбрать', newsShowInFeed:'Показать в ленте', newsAnalyzeOne:'Анализировать новость', newsAnalyzeN:'Анализировать {n} новостей', newsGeolocate:'Определить местоположение', newsGeolocateN:'Определить местоположение {n} новостей', newsGeolocating:'Определяю местоположение…', newsGeolocateFail:'Не удалось определить местоположение', aiAnalyzeGreet1:'Что ты хочешь узнать об этой новости?', aiAnalyzeGreetN:'Что ты хочешь узнать об этих {n} новостях?', aiSourcesRemoved:'Готово: я удалил {n} источников из твоей ленты.', aiSourcesRemovedNone:'Не нашёл эти источники для удаления.' },
        zh:{ newsSelect:'选择', newsShowInFeed:'在 Feed 中显示', newsAnalyzeOne:'分析这条新闻', newsAnalyzeN:'分析 {n} 条新闻', newsGeolocate:'定位这条新闻', newsGeolocateN:'定位 {n} 条新闻', newsGeolocating:'正在定位…', newsGeolocateFail:'无法定位', aiAnalyzeGreet1:'关于这条新闻你想了解什么？', aiAnalyzeGreetN:'关于这 {n} 条新闻你想了解什么？', aiSourcesRemoved:'完成：我已从你的资讯流移除 {n} 个来源。', aiSourcesRemovedNone:'没有找到要移除的那些来源。' },
        tr:{ newsSelect:'Seç', newsShowInFeed:'Feed\'de göster', newsAnalyzeOne:'Haberi analiz et', newsAnalyzeN:'{n} haberi analiz et', newsGeolocate:'Haberi konumlandır', newsGeolocateN:'{n} haberi konumlandır', newsGeolocating:'Konumlandırılıyor…', newsGeolocateFail:'Konum bulunamadı', aiAnalyzeGreet1:'Bu haber hakkında ne bilmek istersin?', aiAnalyzeGreetN:'Bu {n} haber hakkında ne bilmek istersin?', aiSourcesRemoved:'Tamam: akışından {n} kaynak kaldırdım.', aiSourcesRemovedNone:'Kaldıracak o kaynakları bulamadım.' },
        ar:{ newsSelect:'تحديد', newsShowInFeed:'عرض في الـFeed', newsAnalyzeOne:'تحليل الخبر', newsAnalyzeN:'تحليل {n} أخبار', newsGeolocate:'تحديد موقع الخبر', newsGeolocateN:'تحديد موقع {n} أخبار', newsGeolocating:'جارٍ تحديد الموقع…', newsGeolocateFail:'تعذر تحديد الموقع', aiAnalyzeGreet1:'ماذا تريد أن تعرف عن هذا الخبر؟', aiAnalyzeGreetN:'ماذا تريد أن تعرف عن هذه الأخبار الـ{n}؟', aiSourcesRemoved:'تم: أزلت {n} مصادر من موجزك.', aiSourcesRemovedNone:'لم أجد تلك المصادر لإزالتها.' },
        fa:{ newsSelect:'انتخاب', newsShowInFeed:'نمایش در Feed', newsAnalyzeOne:'تحلیل خبر', newsAnalyzeN:'تحلیل {n} خبر', newsGeolocate:'مکان‌یابی خبر', newsGeolocateN:'مکان‌یابی {n} خبر', newsGeolocating:'در حال مکان‌یابی…', newsGeolocateFail:'مکان‌یابی ممکن نشد', aiAnalyzeGreet1:'می‌خواهی درباره این خبر چه بدانی؟', aiAnalyzeGreetN:'می‌خواهی درباره این {n} خبر چه بدانی؟', aiSourcesRemoved:'انجام شد: {n} منبع از فید تو حذف کردم.', aiSourcesRemovedNone:'آن منابع را برای حذف پیدا نکردم.' },
        he:{ newsSelect:'בחר', newsShowInFeed:'הצג ב-Feed', newsAnalyzeOne:'נתח ידיעה', newsAnalyzeN:'נתח {n} ידיעות', newsGeolocate:'אתר מיקום הידיעה', newsGeolocateN:'אתר מיקום {n} ידיעות', newsGeolocating:'מאתר מיקום…', newsGeolocateFail:'לא ניתן לאתר מיקום', aiAnalyzeGreet1:'מה תרצה לדעת על הידיעה הזו?', aiAnalyzeGreetN:'מה תרצה לדעת על {n} הידיעות האלה?', aiSourcesRemoved:'בוצע: הסרתי {n} מקורות מהפיד שלך.', aiSourcesRemovedNone:'לא מצאתי את המקורות האלה להסרה.' },
        nl:{ newsSelect:'Selecteren', newsShowInFeed:'Toon in feed', newsAnalyzeOne:'Nieuws analyseren', newsAnalyzeN:'{n} nieuwsberichten analyseren', newsGeolocate:'Nieuws geolokaliseren', newsGeolocateN:'{n} nieuwsberichten geolokaliseren', newsGeolocating:'Geolokaliseren…', newsGeolocateFail:'Kon niet geolokaliseren', aiAnalyzeGreet1:'Wat wil je weten over dit nieuws?', aiAnalyzeGreetN:'Wat wil je weten over deze {n} nieuwsberichten?', aiSourcesRemoved:'Klaar: ik heb {n} bronnen uit je feed verwijderd.', aiSourcesRemovedNone:'Ik kon die bronnen niet vinden om te verwijderen.' },
        it:{ newsSelect:'Seleziona', newsShowInFeed:'Mostra nel feed', newsAnalyzeOne:'Analizza notizia', newsAnalyzeN:'Analizza {n} notizie', newsGeolocate:'Geolocalizza notizia', newsGeolocateN:'Geolocalizza {n} notizie', newsGeolocating:'Geolocalizzazione…', newsGeolocateFail:'Impossibile geolocalizzare', aiAnalyzeGreet1:'Cosa vuoi sapere su questa notizia?', aiAnalyzeGreetN:'Cosa vuoi sapere su queste {n} notizie?', aiSourcesRemoved:'Fatto: ho rimosso {n} fonti dal tuo feed.', aiSourcesRemovedNone:'Non ho trovato quelle fonti da rimuovere.' },
        pt:{ newsSelect:'Selecionar', newsShowInFeed:'Mostrar no feed', newsAnalyzeOne:'Analisar notícia', newsAnalyzeN:'Analisar {n} notícias', newsGeolocate:'Geolocalizar notícia', newsGeolocateN:'Geolocalizar {n} notícias', newsGeolocating:'A geolocalizar…', newsGeolocateFail:'Não foi possível geolocalizar', aiAnalyzeGreet1:'O que queres saber sobre esta notícia?', aiAnalyzeGreetN:'O que queres saber sobre estas {n} notícias?', aiSourcesRemoved:'Pronto: removi {n} fontes do teu feed.', aiSourcesRemovedNone:'Não encontrei essas fontes para remover.' },
        hi:{ newsSelect:'चुनें', newsShowInFeed:'फ़ीड में दिखाएँ', newsAnalyzeOne:'खबर का विश्लेषण करें', newsAnalyzeN:'{n} खबरों का विश्लेषण करें', newsGeolocate:'खबर की लोकेशन दिखाएँ', newsGeolocateN:'{n} खबरों की लोकेशन दिखाएँ', newsGeolocating:'लोकेशन खोजी जा रही है…', newsGeolocateFail:'लोकेशन नहीं मिली', aiAnalyzeGreet1:'इस खबर के बारे में क्या जानना चाहते हो?', aiAnalyzeGreetN:'इन {n} खबरों के बारे में क्या जानना चाहते हो?', aiSourcesRemoved:'हो गया: मैंने तुम्हारे फ़ीड से {n} स्रोत हटा दिए।', aiSourcesRemovedNone:'हटाने के लिए वे स्रोत नहीं मिले।' },
    };
    Object.keys(NEWSCTX_I18N).forEach(lng => { if (T[lng]) Object.assign(T[lng], NEWSCTX_I18N[lng]); });
    // Source-loading veil message, per language.
    const SRC_LOAD_I18N = {
        es:{ loadingSources:'Cargando fuentes de información…' },
        en:{ loadingSources:'Loading your information sources…' },
        fr:{ loadingSources:'Chargement des sources d\'information…' },
        ru:{ loadingSources:'Загрузка источников информации…' },
        zh:{ loadingSources:'正在加载信息来源…' },
        tr:{ loadingSources:'Bilgi kaynakları yükleniyor…' },
        ar:{ loadingSources:'جارٍ تحميل مصادر المعلومات…' },
        fa:{ loadingSources:'در حال بارگذاری منابع اطلاعاتی…' },
        he:{ loadingSources:'טוען מקורות מידע…' }
    };
    Object.keys(SRC_LOAD_I18N).forEach(lng => { if (T[lng]) Object.assign(T[lng], SRC_LOAD_I18N[lng]); });
    // Friendly message when Anthropic is momentarily overloaded (after retries).
    const AI_OVERLOAD_I18N = {
        es:{ aiOverloaded:'La IA está saturada ahora mismo. Inténtalo de nuevo en unos segundos.' },
        en:{ aiOverloaded:'The AI is overloaded right now. Please try again in a few seconds.' },
        fr:{ aiOverloaded:'L\'IA est surchargée pour le moment. Réessayez dans quelques secondes.' },
        ru:{ aiOverloaded:'ИИ сейчас перегружен. Попробуйте снова через несколько секунд.' },
        zh:{ aiOverloaded:'AI 当前负载过高，请几秒后再试。' },
        tr:{ aiOverloaded:'Yapay zekâ şu anda aşırı yüklü. Birkaç saniye sonra tekrar deneyin.' },
        ar:{ aiOverloaded:'الذكاء الاصطناعي مُحمّل بشدة الآن. حاول مرة أخرى بعد ثوانٍ.' },
        fa:{ aiOverloaded:'هوش مصنوعی در حال حاضر پربار است. چند ثانیه بعد دوباره تلاش کنید.' },
        he:{ aiOverloaded:'הבינה המלאכותית עמוסה כרגע. נסה שוב בעוד כמה שניות.' }
    };
    Object.keys(AI_OVERLOAD_I18N).forEach(lng => { if (T[lng]) Object.assign(T[lng], AI_OVERLOAD_I18N[lng]); });
    // ── Plan-gating strings (Free vs Pro/Team) ── shown when a free account hits
    // the AI lock, the daily Pro quota, or the 5-source Free cap.
    const PLAN_GATE_I18N = {
        es:{ aiLockTitle:'Asistente IA — Pro', aiLockBody:'El asistente de IA está disponible en los planes Pro y Team. Mejora para preguntarle lo que quieras sobre tus noticias.', aiLockCta:'Mejorar a Pro', aiPlanRequired:'El asistente de IA es una función de pago. Mejora a Pro para usarlo.', aiQuotaReached:'Has alcanzado tu límite de 10 consultas de IA de hoy. Pásate a Team para uso ilimitado.', srcLimitFree:'Has alcanzado el límite de 5 fuentes del plan Free. Mejora a Pro para fuentes ilimitadas.' },
        en:{ aiLockTitle:'AI assistant — Pro', aiLockBody:'The AI assistant is available on the Pro and Team plans. Upgrade to ask it anything about your news.', aiLockCta:'Upgrade to Pro', aiPlanRequired:'The AI assistant is a paid feature. Upgrade to Pro to use it.', aiQuotaReached:'You\'ve reached your 10 AI queries for today. Move up to Team for unlimited use.', srcLimitFree:'You\'ve reached the Free plan limit of 5 sources. Upgrade to Pro for unlimited sources.' },
        fr:{ aiLockTitle:'Assistant IA — Pro', aiLockBody:'L\'assistant IA est disponible sur les plans Pro et Team. Passe à un plan supérieur pour tout lui demander sur tes actualités.', aiLockCta:'Passer à Pro', aiPlanRequired:'L\'assistant IA est une fonction payante. Passe à Pro pour l\'utiliser.', aiQuotaReached:'Tu as atteint tes 10 requêtes IA du jour. Passe à Team pour un usage illimité.', srcLimitFree:'Tu as atteint la limite de 5 sources du plan Free. Passe à Pro pour des sources illimitées.' },
        ru:{ aiLockTitle:'ИИ-ассистент — Pro', aiLockBody:'ИИ-ассистент доступен в планах Pro и Team. Перейдите на платный план, чтобы спрашивать его о ваших новостях.', aiLockCta:'Перейти на Pro', aiPlanRequired:'ИИ-ассистент — платная функция. Перейдите на Pro, чтобы пользоваться им.', aiQuotaReached:'Вы исчерпали 10 запросов к ИИ на сегодня. Перейдите на Team для безлимита.', srcLimitFree:'Достигнут лимит в 5 источников плана Free. Перейдите на Pro для безлимитных источников.' },
        zh:{ aiLockTitle:'AI 助手 — Pro', aiLockBody:'AI 助手在 Pro 和 Team 方案中可用。升级即可询问关于你新闻的任何问题。', aiLockCta:'升级到 Pro', aiPlanRequired:'AI 助手是付费功能。升级到 Pro 即可使用。', aiQuotaReached:'你已用完今天的 10 次 AI 查询。升级到 Team 可无限使用。', srcLimitFree:'你已达到 Free 方案的 5 个来源上限。升级到 Pro 可获得无限来源。' },
        tr:{ aiLockTitle:'YZ asistanı — Pro', aiLockBody:'YZ asistanı Pro ve Team planlarında mevcuttur. Haberlerin hakkında her şeyi sormak için yükselt.', aiLockCta:'Pro\'ya geç', aiPlanRequired:'YZ asistanı ücretli bir özelliktir. Kullanmak için Pro\'ya geç.', aiQuotaReached:'Bugünkü 10 YZ sorgu hakkını doldurdun. Sınırsız kullanım için Team\'e geç.', srcLimitFree:'Free planının 5 kaynak sınırına ulaştın. Sınırsız kaynak için Pro\'ya geç.' },
        ar:{ aiLockTitle:'مساعد الذكاء الاصطناعي — Pro', aiLockBody:'مساعد الذكاء الاصطناعي متاح في خطتي Pro و Team. قم بالترقية لتسأله أي شيء عن أخبارك.', aiLockCta:'الترقية إلى Pro', aiPlanRequired:'مساعد الذكاء الاصطناعي ميزة مدفوعة. قم بالترقية إلى Pro لاستخدامه.', aiQuotaReached:'لقد وصلت إلى حد 10 استفسارًا للذكاء الاصطناعي اليوم. انتقل إلى Team للاستخدام غير المحدود.', srcLimitFree:'لقد وصلت إلى حد 5 مصادر في خطة Free. قم بالترقية إلى Pro للحصول على مصادر غير محدودة.' },
        fa:{ aiLockTitle:'دستیار هوش مصنوعی — Pro', aiLockBody:'دستیار هوش مصنوعی در پلن‌های Pro و Team در دسترس است. ارتقا بده تا هر چیزی درباره اخبارت بپرسی.', aiLockCta:'ارتقا به Pro', aiPlanRequired:'دستیار هوش مصنوعی یک قابلیت پولی است. برای استفاده به Pro ارتقا بده.', aiQuotaReached:'به سقف ۱۰ پرسش هوش مصنوعی امروز رسیدی. برای استفاده نامحدود به Team برو.', srcLimitFree:'به محدودیت ۵ منبع پلن Free رسیدی. برای منابع نامحدود به Pro ارتقا بده.' },
        he:{ aiLockTitle:'עוזר AI — Pro', aiLockBody:'עוזר ה-AI זמין בתוכניות Pro ו-Team. שדרג כדי לשאול אותו כל דבר על החדשות שלך.', aiLockCta:'שדרג ל-Pro', aiPlanRequired:'עוזר ה-AI הוא תכונה בתשלום. שדרג ל-Pro כדי להשתמש בו.', aiQuotaReached:'הגעת ל-10 שאילתות ה-AI של היום. עבור ל-Team לשימוש ללא הגבלה.', srcLimitFree:'הגעת למגבלת 5 המקורות של תוכנית Free. שדרג ל-Pro למקורות ללא הגבלה.' },
        nl:{ aiLockTitle:'AI-assistent — Pro', aiLockBody:'De AI-assistent is beschikbaar in de Pro- en Team-plannen. Upgrade om alles over je nieuws te vragen.', aiLockCta:'Upgraden naar Pro', aiPlanRequired:'De AI-assistent is een betaalde functie. Upgrade naar Pro om hem te gebruiken.', aiQuotaReached:'Je hebt je 10 AI-vragen van vandaag bereikt. Stap over op Team voor onbeperkt gebruik.', srcLimitFree:'Je hebt de limiet van 5 bronnen van het Free-plan bereikt. Upgrade naar Pro voor onbeperkte bronnen.' },
        it:{ aiLockTitle:'Assistente IA — Pro', aiLockBody:'L\'assistente IA è disponibile nei piani Pro e Team. Passa a un piano superiore per chiedergli qualsiasi cosa sulle tue notizie.', aiLockCta:'Passa a Pro', aiPlanRequired:'L\'assistente IA è una funzione a pagamento. Passa a Pro per usarlo.', aiQuotaReached:'Hai raggiunto le 10 richieste IA di oggi. Passa a Team per un uso illimitato.', srcLimitFree:'Hai raggiunto il limite di 5 fonti del piano Free. Passa a Pro per fonti illimitate.' },
        pt:{ aiLockTitle:'Assistente IA — Pro', aiLockBody:'O assistente de IA está disponível nos planos Pro e Team. Faz upgrade para lhe perguntar tudo sobre as tuas notícias.', aiLockCta:'Obter Pro', aiPlanRequired:'O assistente de IA é uma função paga. Faz upgrade para Pro para o usar.', aiQuotaReached:'Atingiste as tuas 10 consultas de IA de hoje. Passa para Team para uso ilimitado.', srcLimitFree:'Atingiste o limite de 5 fontes do plano Free. Faz upgrade para Pro para fontes ilimitadas.' },
        hi:{ aiLockTitle:'AI सहायक — Pro', aiLockBody:'AI सहायक Pro और Team प्लान में उपलब्ध है। अपनी खबरों के बारे में कुछ भी पूछने के लिए अपग्रेड करें।', aiLockCta:'Pro में अपग्रेड करें', aiPlanRequired:'AI सहायक एक सशुल्क सुविधा है। इसे उपयोग करने के लिए Pro में अपग्रेड करें।', aiQuotaReached:'आपने आज की 10 AI क्वेरी पूरी कर ली हैं। असीमित उपयोग के लिए Team में जाएँ।', srcLimitFree:'आप Free प्लान की 5 स्रोतों की सीमा तक पहुँच गए हैं। असीमित स्रोतों के लिए Pro में अपग्रेड करें।' },
    };
    Object.keys(PLAN_GATE_I18N).forEach(lng => { if (T[lng]) Object.assign(T[lng], PLAN_GATE_I18N[lng]); });
    // ── Dutch / Italian / Hindi / Portuguese — consolidated translations for the
    // most visible chrome. Long-tail / removed-feature strings fall back to
    // English automatically (see applyLang/t). Merged LAST so it wins.
    const NEW_LANG_I18N = {
        nl: {
            aiTitle:'AI-assistent', aiWelcome:'Hoi 👋 Vraag me alles over de gebeurtenissen op de kaart.', aiPlaceholder:'Vraag over de kaart…', aiAskPh:'Vraag het de AI…', aiThinking:'Bezig…', aiError:'Kan de AI niet bereiken. Controleer of de server (start_server.py) draait en ANTHROPIC_API_KEY is ingesteld.', srcTelegram:'Telegram', srcOutlets:'Nieuwsbronnen', srcAllNews:'Nieuws', newsTitle:'LIVE NIEUWS', showMore:'Meer tonen', showLess:'Minder tonen',
            searchPh:'Plaats zoeken…', extraLayers:'EXTRA LAGEN', eventsLayer:'Gebeurtenis-iconen', noLabels:'Geen labels', sourcesTab:'➕ Bronnen', mySources:'Mijn bronnen', addSourcePh:'Plak de link van de site (URL)', addBtn:'Toevoegen', srcHelp:'help', noSources:'Nog geen eigen bronnen.', srcAdded:'Bron toegevoegd — nieuws ophalen…', srcInvalid:'Voer een geldige link (URL) in.', srcNoFeed:'Geen feed gevonden op dat adres. Probeer de RSS/Atom-URL.', srcBlocked:'Deze site blokkeert automatische toegang. Probeer de directe RSS/Atom-URL.', srcUnreachable:'Kan die site niet bereiken. Controleer de link.', srcSearching:'Bron zoeken met AI…', srcLoading:'Je bronnen laden…', srcAll:'Alle bronnen', srcDefault:'standaard', srcLive:'live', srcCustom:'eigen', srcHide:'Verbergen', srcShow:'Tonen', srcDelete:'Verwijderen', srcConfirmDelete:'Weet je zeker dat je deze bron wilt verwijderen?', srcTypeTg:'Telegram', srcTypeRss:'RSS',
            uiTheme:'INTERFACE-THEMA', themeDark:'🌙 Donker', themeLight:'☀️ Licht', settings:'INSTELLINGEN', language:'TAAL', capital:'Hoofdstad', satelliteClassic:'Klassieke satelliet',
            onlineMode:'LIVE', offlineMode:'GEPAUZEERD', onlineModeTip:'Online — klik om alles te pauzeren', offlineModeTip:'Offline — klik om te hervatten',
            favSubtitle:'Vraag de AI over het nieuws van je bronnen', favSources:'Je bronnen', favTopics:'Je onderwerpen', favNoSources:'Je hebt nog geen bronnen toegevoegd. Voeg ze toe via het tabblad «Bronnen».', favAskPh:'Vraag de AI over je nieuws…', favSend:'Versturen', favWelcome:'Hoi 👋 Vraag me alles over het nieuws van je bronnen. Ik kan het uitleggen, samenvatten of uitbreiden.', favThinking:'Bezig…', favError:'Kan de AI niet bereiken. Controleer of de server draait.', favEmptyChat:'Typ hieronder je eerste vraag.', favItems:'nieuwsberichten', favLoading:'Nieuws van je bronnen laden…',
            loadingSources:'Informatiebronnen laden…', aiOverloaded:'De AI is op dit moment overbelast. Probeer het over enkele seconden opnieuw.', iconsPerSource:'ICONEN PER BRON', iconsPerSourceHint:'Max. iconen die elke bron op de kaart plaatst.',
        },
        it: {
            aiTitle:'Assistente IA', aiWelcome:'Ciao 👋 Chiedimi qualsiasi cosa sugli eventi della mappa.', aiPlaceholder:'Chiedi sulla mappa…', aiAskPh:'Chiedi all\'IA…', aiThinking:'Sto pensando…', aiError:'Impossibile contattare l\'IA. Verifica che il server (start_server.py) sia in esecuzione e che ANTHROPIC_API_KEY sia impostata.', srcTelegram:'Telegram', srcOutlets:'Testate', srcAllNews:'Notizie', newsTitle:'NOTIZIE IN DIRETTA', showMore:'Mostra di più', showLess:'Mostra meno',
            searchPh:'Cerca un luogo…', extraLayers:'LIVELLI AGGIUNTIVI', eventsLayer:'Icone degli eventi', noLabels:'Nessuna etichetta', sourcesTab:'➕ Fonti', mySources:'Le mie fonti', addSourcePh:'Incolla il link del sito (URL)', addBtn:'Aggiungi', srcHelp:'aiuto', noSources:'Ancora nessuna fonte personale.', srcAdded:'Fonte aggiunta — recupero notizie…', srcInvalid:'Inserisci un link (URL) valido.', srcNoFeed:'Nessun feed trovato a quell\'indirizzo. Prova con l\'URL RSS/Atom.', srcBlocked:'Questo sito blocca l\'accesso automatico. Prova con il suo URL RSS/Atom diretto.', srcUnreachable:'Impossibile raggiungere quel sito. Controlla il link.', srcSearching:'Ricerca della fonte con l\'IA…', srcLoading:'Caricamento delle tue fonti…', srcAll:'Tutte le fonti', srcDefault:'predefinita', srcLive:'in diretta', srcCustom:'tua', srcHide:'Nascondi', srcShow:'Mostra', srcDelete:'Elimina', srcConfirmDelete:'Vuoi davvero eliminare questa fonte?', srcTypeTg:'Telegram', srcTypeRss:'RSS',
            uiTheme:'TEMA INTERFACCIA', themeDark:'🌙 Scuro', themeLight:'☀️ Chiaro', settings:'IMPOSTAZIONI', language:'LINGUA', capital:'Capitale', satelliteClassic:'Satellite classico',
            onlineMode:'IN DIRETTA', offlineMode:'IN PAUSA', onlineModeTip:'Online — clicca per mettere tutto in pausa', offlineModeTip:'Offline — clicca per riprendere',
            favSubtitle:'Chiedi all\'IA sulle notizie delle tue fonti', favSources:'Le tue fonti', favTopics:'I tuoi temi', favNoSources:'Non hai ancora aggiunto fonti. Aggiungile nella scheda «Fonti».', favAskPh:'Chiedi all\'IA sulle tue notizie…', favSend:'Invia', favWelcome:'Ciao 👋 Chiedimi qualsiasi cosa sulle notizie delle tue fonti. Posso spiegarle, riassumerle o approfondirle.', favThinking:'Sto pensando…', favError:'Impossibile contattare l\'IA. Verifica che il server sia in esecuzione.', favEmptyChat:'Scrivi la tua prima domanda qui sotto.', favItems:'notizie', favLoading:'Caricamento notizie dalle tue fonti…',
            loadingSources:'Caricamento delle fonti d\'informazione…', aiOverloaded:'L\'IA è sovraccarica in questo momento. Riprova tra qualche secondo.', iconsPerSource:'ICONE PER FONTE', iconsPerSourceHint:'Numero massimo di icone che ogni fonte mette sulla mappa.',
        },
        hi: {
            aiTitle:'AI सहायक', aiWelcome:'नमस्ते 👋 मानचित्र की घटनाओं के बारे में मुझसे कुछ भी पूछें।', aiPlaceholder:'मानचित्र के बारे में पूछें…', aiAskPh:'AI से पूछें…', aiThinking:'सोच रहा हूँ…', aiError:'AI से संपर्क नहीं हो सका। सुनिश्चित करें कि सर्वर (start_server.py) चल रहा है और ANTHROPIC_API_KEY सेट है।', srcTelegram:'टेलीग्राम', srcOutlets:'समाचार स्रोत', srcAllNews:'समाचार', newsTitle:'लाइव समाचार', showMore:'और दिखाएँ', showLess:'कम दिखाएँ',
            searchPh:'स्थान खोजें…', extraLayers:'अतिरिक्त परतें', eventsLayer:'घटना आइकन', noLabels:'कोई लेबल नहीं', sourcesTab:'➕ स्रोत', mySources:'मेरे स्रोत', addSourcePh:'साइट का लिंक (URL) पेस्ट करें', addBtn:'जोड़ें', srcHelp:'मदद', noSources:'अभी तक कोई अपना स्रोत नहीं।', srcAdded:'स्रोत जोड़ा गया — समाचार लाए जा रहे हैं…', srcInvalid:'एक मान्य लिंक (URL) दर्ज करें।', srcNoFeed:'उस पते पर कोई फ़ीड नहीं मिली। RSS/Atom URL आज़माएँ।', srcBlocked:'यह साइट स्वचालित पहुँच रोकती है। इसका सीधा RSS/Atom URL आज़माएँ।', srcUnreachable:'उस साइट तक नहीं पहुँच सके। लिंक जाँचें।', srcSearching:'AI से स्रोत खोजा जा रहा है…', srcLoading:'आपके स्रोत लोड हो रहे हैं…', srcAll:'सभी स्रोत', srcDefault:'डिफ़ॉल्ट', srcLive:'लाइव', srcCustom:'आपका', srcHide:'छिपाएँ', srcShow:'दिखाएँ', srcDelete:'हटाएँ', srcConfirmDelete:'क्या आप वाकई इस स्रोत को हटाना चाहते हैं?', srcTypeTg:'टेलीग्राम', srcTypeRss:'RSS',
            uiTheme:'इंटरफ़ेस थीम', themeDark:'🌙 गहरा', themeLight:'☀️ हल्का', settings:'सेटिंग्स', language:'भाषा', capital:'राजधानी', satelliteClassic:'क्लासिक उपग्रह',
            onlineMode:'लाइव', offlineMode:'रुका हुआ', onlineModeTip:'ऑनलाइन — सब रोकने के लिए क्लिक करें', offlineModeTip:'ऑफ़लाइन — फिर से शुरू करने के लिए क्लिक करें',
            favSubtitle:'अपने स्रोतों के समाचारों के बारे में AI से पूछें', favSources:'आपके स्रोत', favTopics:'आपके विषय', favNoSources:'आपने अभी तक कोई स्रोत नहीं जोड़ा। उन्हें «स्रोत» टैब में जोड़ें।', favAskPh:'अपने समाचारों के बारे में AI से पूछें…', favSend:'भेजें', favWelcome:'नमस्ते 👋 अपने स्रोतों के समाचारों के बारे में मुझसे कुछ भी पूछें। मैं उन्हें समझा, सारांशित या विस्तृत कर सकता हूँ।', favThinking:'सोच रहा हूँ…', favError:'AI से संपर्क नहीं हो सका। सुनिश्चित करें कि सर्वर चल रहा है।', favEmptyChat:'नीचे अपना पहला प्रश्न लिखें।', favItems:'समाचार', favLoading:'आपके स्रोतों से समाचार लोड हो रहे हैं…',
            loadingSources:'सूचना स्रोत लोड हो रहे हैं…', aiOverloaded:'AI अभी अत्यधिक व्यस्त है। कुछ सेकंड बाद पुनः प्रयास करें।', iconsPerSource:'प्रति स्रोत आइकन', iconsPerSourceHint:'प्रत्येक स्रोत मानचित्र पर अधिकतम कितने आइकन रखे।',
        },
        pt: {
            aiTitle:'Assistente de IA', aiWelcome:'Olá 👋 Pergunte-me qualquer coisa sobre os eventos do mapa.', aiPlaceholder:'Pergunte sobre o mapa…', aiAskPh:'Pergunte à IA…', aiThinking:'A pensar…', aiError:'Não foi possível contactar a IA. Verifique se o servidor (start_server.py) está em execução e se ANTHROPIC_API_KEY está definida.', srcTelegram:'Telegram', srcOutlets:'Meios de notícia', srcAllNews:'Notícias', newsTitle:'NOTÍCIAS AO VIVO', showMore:'Mostrar mais', showLess:'Mostrar menos',
            searchPh:'Procurar lugar…', extraLayers:'CAMADAS ADICIONAIS', eventsLayer:'Ícones de eventos', noLabels:'Sem rótulos', sourcesTab:'➕ Fontes', mySources:'As minhas fontes', addSourcePh:'Cole o link do site (URL)', addBtn:'Adicionar', srcHelp:'ajuda', noSources:'Ainda sem fontes próprias.', srcAdded:'Fonte adicionada — a procurar notícias…', srcInvalid:'Introduza um link (URL) válido.', srcNoFeed:'Não encontrámos um feed nesse endereço. Tente o URL RSS/Atom.', srcBlocked:'Este site bloqueia o acesso automático. Tente o URL RSS/Atom direto.', srcUnreachable:'Não foi possível aceder a esse site. Verifique o link.', srcSearching:'A procurar a fonte com IA…', srcLoading:'A carregar as suas fontes…', srcAll:'Todas as fontes', srcDefault:'predefinida', srcLive:'ao vivo', srcCustom:'sua', srcHide:'Ocultar', srcShow:'Mostrar', srcDelete:'Eliminar', srcConfirmDelete:'Tem a certeza de que quer eliminar esta fonte?', srcTypeTg:'Telegram', srcTypeRss:'RSS',
            uiTheme:'TEMA DA INTERFACE', themeDark:'🌙 Escuro', themeLight:'☀️ Claro', settings:'DEFINIÇÕES', language:'IDIOMA', capital:'Capital', satelliteClassic:'Satélite clássico',
            onlineMode:'AO VIVO', offlineMode:'EM PAUSA', onlineModeTip:'Online — clique para pausar tudo', offlineModeTip:'Offline — clique para retomar',
            favSubtitle:'Pergunte à IA sobre as notícias das suas fontes', favSources:'As suas fontes', favTopics:'Os seus temas', favNoSources:'Ainda não adicionou fontes. Adicione-as no separador «Fontes».', favAskPh:'Pergunte à IA sobre as suas notícias…', favSend:'Enviar', favWelcome:'Olá 👋 Pergunte-me qualquer coisa sobre as notícias das suas fontes. Posso explicá-las, resumi-las ou aprofundá-las.', favThinking:'A pensar…', favError:'Não foi possível contactar a IA. Verifique se o servidor está em execução.', favEmptyChat:'Escreva a sua primeira pergunta abaixo.', favItems:'notícias', favLoading:'A carregar notícias das suas fontes…',
            loadingSources:'A carregar fontes de informação…', aiOverloaded:'A IA está sobrecarregada neste momento. Tente novamente dentro de alguns segundos.', iconsPerSource:'ÍCONES POR FONTE', iconsPerSourceHint:'Máximo de ícones que cada fonte coloca no mapa.',
        },
    };
    Object.keys(NEW_LANG_I18N).forEach(lng => { if (T[lng]) Object.assign(T[lng], NEW_LANG_I18N[lng]); });

    // ── Localize <title> and <meta name=description> to the user's browser
    // language (falls back to English — which is the SEO default in the HTML).
    // Runs BEFORE any other init so search-engine previews and the browser tab
    // both see the right text, regardless of the user's app-language pick later.
    const SEO_I18N = {
        en:{ t:'Skorpene — Personalized real-time feed with map', d:'A real-time map with a personalized feed of the topics you love — sports, markets, tech, your hobbies, or any combination of them — with AI assistance.' },
        es:{ t:'Skorpene — Feed personalizado en tiempo real con mapa', d:'Un mapa en tiempo real con un feed personalizado de los temas que te gustan — deportes, mercados, tecnología, tus hobbies o cualquier combinación — con asistencia de IA.' },
        fr:{ t:'Skorpene — Flux personnalisé en temps réel avec carte', d:'Une carte en temps réel avec un flux personnalisé des sujets qui te plaisent — sports, marchés, tech, tes hobbies ou toute combinaison — avec l\'aide de l\'IA.' },
        ru:{ t:'Skorpene — Персональная лента в реальном времени с картой', d:'Карта в реальном времени с персональной лентой любимых тем — спорт, рынки, техно, твои хобби или любое сочетание — с помощью ИИ.' },
        zh:{ t:'Skorpene — 带地图的实时个性化资讯流', d:'实时地图 + 你喜欢的主题的个性化资讯流 — 体育、市场、科技、你的爱好或任意组合 — 配有 AI 助手。' },
        tr:{ t:'Skorpene — Haritalı, kişiselleştirilmiş gerçek zamanlı akış', d:'Sevdiğin konuların gerçek zamanlı haritası ve kişiselleştirilmiş akışı — spor, piyasalar, teknoloji, hobilerin ya da herhangi bir bileşim — yapay zekâ desteğiyle.' },
        ar:{ t:'Skorpene — موجز مخصص في الوقت الحقيقي مع خريطة', d:'خريطة حية مع موجز مخصص للمواضيع التي تحبها — رياضة، أسواق، تقنية، هواياتك أو أي مزيج — مع مساعدة الذكاء الاصطناعي.' },
        fa:{ t:'Skorpene — فید شخصی‌سازی‌شده در لحظه با نقشه', d:'یک نقشه در لحظه با فید شخصی‌سازی‌شده از موضوعاتی که دوست داری — ورزش، بازارها، فناوری، سرگرمی‌ها یا هر ترکیب — همراه با کمک هوش مصنوعی.' },
        he:{ t:'Skorpene — פיד מותאם אישית בזמן אמת עם מפה', d:'מפה בזמן אמת עם פיד מותאם אישית של הנושאים שאתה אוהב — ספורט, שווקים, טכנולוגיה, תחביבים או כל שילוב — עם עזרה של בינה מלאכותית.' },
        nl:{ t:'Skorpene — Persoonlijke realtime feed met kaart', d:'Een realtime kaart met een persoonlijke feed van de onderwerpen die je leuk vindt — sport, markten, tech, je hobby\'s of elke combinatie — met AI-assistentie.' },
        it:{ t:'Skorpene — Feed personalizzato in tempo reale con mappa', d:'Una mappa in tempo reale con un feed personalizzato degli argomenti che ami — sport, mercati, tech, i tuoi hobby o qualsiasi combinazione — con l\'aiuto dell\'IA.' },
        pt:{ t:'Skorpene — Feed personalizado em tempo real com mapa', d:'Um mapa em tempo real com um feed personalizado dos temas que gostas — desporto, mercados, tech, os teus hobbies ou qualquer combinação — com assistência de IA.' },
        hi:{ t:'Skorpene — नक्शे के साथ रीयल-टाइम पर्सनल फ़ीड', d:'तुम्हारे पसंदीदा विषयों की रीयल-टाइम मैप और पर्सनल फ़ीड — खेल, बाज़ार, टेक, तुम्हारे शौक या कोई भी संयोजन — AI सहायता के साथ।' },
    };
    (function _localizeSeo() {
        try {
            const nl = String(navigator.language || navigator.userLanguage || 'en').toLowerCase();
            const key = (nl.split('-')[0] || 'en');
            const s = SEO_I18N[key] || SEO_I18N.en;
            if (s.t) document.title = s.t;
            const md = document.querySelector('meta[name="description"]');
            if (md && s.d) md.setAttribute('content', s.d);
            // Update the html lang attribute for a11y + browser hints.
            if (SEO_I18N[key] && document.documentElement) document.documentElement.setAttribute('lang', key);
        } catch (_) {}
    })();

    let map, baseLayer, labelsLayer;
    let currentLayer = 'satellite', currentLang = 'en', currentUnit = 'km';
    let labelState = { countries:false, cities:false, regions:false, roads:false, water:false };
    let measureMode = null;
    let measureActive = false;
    let measurePts = [];
    let measureMarkers = [];
    let measureLine = null;
    let measureClosingLine = null;
    let measurePoly = null;
    let previewPos = null;
    const EVENT_SVG = {
        mil_drone: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <circle cx="5" cy="5" r="2.6" fill="currentColor"/>
            <circle cx="19" cy="5" r="2.6" fill="currentColor"/>
            <circle cx="5" cy="19" r="2.6" fill="currentColor"/>
            <circle cx="19" cy="19" r="2.6" fill="currentColor"/>
            <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <rect x="9.5" y="9.5" width="5" height="5" rx="0.8" fill="currentColor"/>
        </svg>`,
        mil_missile: `<svg viewBox="0 0 24 24" class="ev-svg" aria-hidden="true">
            <path d="M12 2 L15 9 L15 18 L17 20 L17 22 L12 20 L7 22 L7 20 L9 18 L9 9 Z"
                  fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
            <path d="M12 4 L12 14" stroke="rgba(0,0,0,0.3)" stroke-width="0.8"/>
        </svg>`,
    };
    // ── Spiderfy: click a cluster chip to fan its events out in a ring around a
    // central beacon. MULTIPLE fans can be open at once — each is tracked in
    // `_fans` and all of its transient layers are torn down on collapse. A fan:
    //   { id, center, deployZoom, ids:[], beacon, legs:[], footprintPx }
    const _fans = new Map();          // fanId -> fan
    const _deployedIds = new Set();   // every event id currently in some fan
    let _fanSeq = 0;
    let _fansCollapsing = 0;          // # of fans mid collapse-animation
    let _spiderAnimDepth = 0;         // ref-count for the shared pane transition class
    const _isDeployed = (eid) => _deployedIds.has(eid);
    function _spiderAnimBegin() {
        const pane = map && map.getPane('eventPane');
        if (!pane) return null;
        _spiderAnimDepth++;
        pane.classList.add('ev-spider-anim');
        return pane;
    }
    function _spiderAnimEnd() {
        const pane = map && map.getPane('eventPane');
        _spiderAnimDepth = Math.max(0, _spiderAnimDepth - 1);
        if (pane && _spiderAnimDepth === 0) pane.classList.remove('ev-spider-anim');
    }
    // Currently focused news item (from a map-icon click). Re-applied after each
    // feed re-render so live WS updates don't wipe the scroll/highlight.
    let _focusedEventId = null;
    let _focusedAt = 0;
    const EVENT_TTL_MS = 24 * 60 * 60 * 1000;
    const EVENT_NEAR_EXPIRY_MS = 60 * 60 * 1000;
    let _ttlReference = Date.now();
    let _ttlMode = 'live';
    const userIconOffset = {};
    let _activeClusters = new Map();
    let _spatialIndex = new Map();
    let _clusterRebuildScheduled = false;
    let _clusteredEventIds = new Set();
    // Min pixel gap enforced between cluster chips / standalone icons. Must
    // exceed the chip's visual footprint (max 56px circle + glow) so nothing
    // overlaps when zoomed out.
    const CLUSTER_RADIUS_PX = 68;
    const CLUSTER_MIN = 2;
    // Same-coordinate clusters fan out on click; pull the map to this zoom the
    // first time only (re-opening when already this close won't zoom again).
    const SPIDER_COMFORT_ZOOM = 5;
    // Clicking a standalone event icon flies to at least this zoom (never out).
    const EVENT_FOCUS_ZOOM = 9;
    let _clusterLayer = null;
    let _pollInflight = false;
    const MISSILE_MTYPE_ORDER = { ballistic: 0, hypersonic: 1, cruise: 2, tactical: 3 };
    const COUNTRY_ACCENT = {
        iran:       '#239f40',   // green (flag)
        israel:     '#0038b8',   // blue (flag)
        northkorea: '#d0142c',   // red
        india:      '#ff9933',   // saffron
        pakistan:   '#006600',   // green
        china:      '#de2910',   // red
        usa:        '#3c3b6e',   // navy
        russia:     '#0039a6',   // blue
    };
    let measureHistory = [];
    let nextMeasureId = 0;
    let currentPopupMeasureId = null;
    let bordersLayer = null;
    let bordersVisible = false;
    const SNAP_PX = 14;
    let eventsEnabled = true;
    const eventMarkers = {};
    const eventsById = {};
    const newsById = {};
    // AI-curated emoji per event_id (Phase 2 — filled by iconCurator, persisted in localStorage).
    let _aiIconCache = {};
    // Phase 3: news source selector. 'telegram' = live channels; 'outlets' = RSS news sites.
    let newsSource = 'news';
    let _outletsData = null;
    let _outletsLoading = false;
    // Phase 3: outlet article markers + AI geolocation cache (persisted).
    const _outletMarkers = {};
    let _outletGeoCache = {};
    const orderedEventIds = [];
    // Hard cap on simultaneously-plotted event markers. This was 40, which the map
    // sat permanently at: with a live Telegram feed plus several RSS outlets, far
    // more than 40 events geolocate in a 24h window, so every new arrival evicted
    // the lowest-priority marker — and since news/outlet icons score below military
    // /security ones, they were the ones constantly evicted and then re-added on the
    // 5-min refresh. THAT was the "icons appear and disappear" churn. Clustering now
    // manages visual density (dense icons fold into numbered chips), so we can hold
    // a much larger working set; eviction then only triggers in genuinely extreme
    // volumes, which the current sources never reach — so icons stay put.
    const MAX_VISIBLE_EVENTS = 300;
    const EVENT_CAT_PRIORITY = {
        military: 100,
        security: 85,
        damage: 70,
        nature: 75,
        health: 65,
        news: 60,          // RSS/outlet articles — base; refined by event_importance
        infrastructure: 55,
        transport: 45,
        civil: 35,
        resources: 30,
        technology: 25,
        media: 20,
        animals: 15,
        other: 10,
    };
    const BORDERS_STYLE = {
        satellite: { color: '#d4e8ff', weight: 2.2, opacity: 0.92 },
        dark: { color: '#c8d8ee', weight: 1.4, opacity: 0.65 },
        light: { color: '#1a2a3a', weight: 1.6, opacity: 0.95 }
    };
    const MISSILE_COLOR_LABELS = {
        ballistic: 'Ballistic',
        cruise: 'Cruise',
        hypersonic: 'Hypersonic',
        tactical: 'Tactical',
    };
    const _countryInfoIndex = (() => {
        const idx = {};
        const norm = s => (s || '').toLowerCase().trim();
        COUNTRY_INFO_DATA.forEach(c => { idx[norm(c.name)] = c; });
        return { get: name => idx[norm(name)] || null };
    })();
    const _restCountryCache = {};
    let eventLayer = null;
    let dispersionLineLayer = null;
    const dispersionGroups = {};
    const dispersionLines = {};
    const dispersionGlowLines = {};
    const dispersionCenterDots = {};
    const eventClusterKey = {};
    let _simState = null;
    const _simAlliance = {
        mode: 'oneway',
        sides: {
            A: { countries: [] },
            B: { countries: [] },
        },
    };
    let _simRAF = null;
    let _simPicking = null;
    let _simPickRangeGuide = null;
    let _simPickRangeData = null;
    let _simPickWarnTimer = null;
    let _simGroupSeq = 1;
    let _simStep = 'config';
    let _lastResultsHTML = '';
    let _simDefenseRangeLayer = null;
    let _simOffensiveRangeLayer = null;
    let _simShowOffensiveRanges = true;
    let _simResidualLayer = null;
    let _placeSearchAbort = null;

    // ============ FUNCTIONS ============
    function _buildWeaponInfoTooltip({ flag, countryName, weapons }) {
        const head = `<div class="wpn-tt-head"><span class="wpn-tt-flag">${flag || ''}</span><span class="wpn-tt-country">${escapeHtml(countryName || '')}</span></div>`;
        const rows = (weapons || []).map(w => {
            const typeLbl = escapeHtml(w.type || MISSILE_COLOR_LABELS[w.mtype] || 'Weapon');
            const rangeFmt = (w.range || 0).toLocaleString();
            const qtySuffix = (w.qty && w.qty > 1) ? ` <span class="wpn-tt-qty">×${w.qty}</span>` : '';
            const warheadRow = w.warhead ? `<div class="wpn-tt-row">Warhead: ${escapeHtml(String(w.warhead))}</div>` : '';
            const batteriesRow = w.batteries ? `<div class="wpn-tt-row">${w.batteries} batter${w.batteries > 1 ? 'ies' : 'y'}</div>` : '';
            return `<div class="wpn-tt-weapon">`
                + `<div class="wpn-tt-name">${escapeHtml(w.name)}${qtySuffix}</div>`
                + `<div class="wpn-tt-type">${typeLbl}</div>`
                + `<div class="wpn-tt-row">Range: ${rangeFmt} km</div>`
                + warheadRow + batteriesRow
                + `</div>`;
        }).join('');
        return head + rows;
    }
    function _installOriginMarker(country, latlng) {
        try { const ll = latlng || (country ? [country.lat, country.lng] : null); if (!ll || !map) return null;
            const flag = (country && country.flag) ? country.flag : '🎯';
            const m = L.marker(ll, { icon: L.divIcon({ className: 'ars-origin-marker', html: `<div class="ars-origin-dot"></div><div class="ars-origin-flag">${flag}</div>`, iconSize:[0,0], iconAnchor:[0,0] }), interactive:true, keyboard:false, zIndexOffset:1000 });
            m.addTo(map); return m;
        } catch(_) { return null; }
    }
    function initMap() {
        const loadingScreen = document.getElementById('loading-screen');
        map = L.map('map', {
            center: [20, 10], zoom: 3, minZoom: 2, maxZoom: 19,
            zoomControl: false, attributionControl: false, doubleClickZoom: false,
            preferCanvas: false, zoomSnap: 1, zoomDelta: 1,
            wheelPxPerZoomLevel: 100, wheelDebounceTime: 40,
            zoomAnimation: true, fadeAnimation: true, worldCopyJump: true
        });
        window._geoMap = map;
        measureRenderer = L.svg({ padding: 0.5 });
        measureRenderer.addTo(map);
        setBaseLayer(currentLayer);

        // Dedicated pane for event markers (zIndex below clusterPane=560, above overlays).
        if (!map.getPane('eventPane')) {
            const ep = map.createPane('eventPane');
            ep.style.zIndex = 550;
            ep.style.pointerEvents = 'auto';
        }
        if (!map.getPane('dispersionPane')) {
            const dp = map.createPane('dispersionPane');
            dp.style.zIndex = 540;
            dp.style.pointerEvents = 'none';
        }
        // Layer groups the rest of the app expects to exist.
        if (!eventLayer) eventLayer = L.layerGroup().addTo(map);
        if (!dispersionLineLayer) dispersionLineLayer = L.layerGroup().addTo(map);
        try { ensureRoadsPane(); } catch (_) {}
        try { _ensureClusterLayer(); } catch (_) {}
        try { ensureEventPane(); } catch (_) {}

        // Live coordinate readout.
        map.on('mousemove', (e) => {
            const la = document.getElementById('coord-lat');
            const lo = document.getElementById('coord-lng');
            if (la) la.textContent = e.latlng.lat.toFixed(4);
            if (lo) lo.textContent = (((e.latlng.lng % 360) + 540) % 360 - 180).toFixed(4);
        });

        // Zoom-driven label scaling/visibility (zoom badge UI removed).
        const onZoom = () => { try { applyLabelZoomFilter(); } catch (_) {} };
        map.on('zoom zoomend', onZoom);

        // Keep open fans through normal zooming; collapse only the fans zoomed out
        // below the level they opened at (their icons would converge / re-cluster).
        map.on('zoomend', () => {
            if (!_fans.size) return;
            const z = map.getZoom();
            Array.from(_fans.values()).forEach(f => {
                if (z < f.deployZoom) { try { _collapseFan(f); } catch (_) {} }
            });
        });

        // Re-cluster, resize icons for the new zoom, and refresh labels.
        map.on('moveend zoomend', () => {
            try { _scheduleClusterRebuild(); } catch (_) {}
            try { _scheduleEventZoomFilter(); } catch (_) {}
            try { if (labelState.cities) refreshVisibleCities(); } catch (_) {}
        });

        // Left-click on the empty map: only the measurement tool uses it now.
        // The place-info popup (name/country/coords on click) was REMOVED per the
        // user's request — a plain map click no longer pops anything.
        map.on('click', (e) => {
            if (document.body.classList.contains('sim-picking')) return;
            if (measureActive) { try { handleMeasureClick(e); } catch (_) {} return; }
        });

        // Right-click on the map background is now a no-op (measure tool removed).
        // Interactive overlays (range circles, markers) still get their own
        // right-click handlers — they bind contextmenu themselves.
        map.getContainer().addEventListener('contextmenu', (ev) => {
            ev.preventDefault();
        });

        // Esc collapses all open fans.
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && _fans.size) { try { _collapseAllFans(); } catch (_) {} }
        });
        // Force-remove any surviving spiderfy layers on page unload.
        window.addEventListener('beforeunload', () => { try { _collapseAllFans(true); } catch (_) {} });

        onZoom();

        // Simulator integration: install the target-pick click guard and keep
        // the missile-animation tick alive (originally driven by setInterval).
        try { _installMapClickGuards(); } catch (_) {}
        if (!window._simTickInterval) {
            window._simTickInterval = setInterval(() => { try { _ensureSimTickRunning(); } catch (_) {} }, 200);
        }

        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => { loadingScreen.style.display = 'none'; }, 600);
        }
    }

    let _ctxMenuLatLng = null;

    function setupUI() {
        // Base layer radios
        document.querySelectorAll('.radio-opt[data-layer]').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.radio-opt[data-layer]').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                setBaseLayer(opt.dataset.layer);
            });
        });

        // "Sin etiquetas" toggle — switches Google from hybrid (labels) to satellite (no labels)
        const nlEl = document.getElementById('tog-nolabels');
        if (nlEl) nlEl.addEventListener('click', () => {
            _noLabels = !_noLabels;
            const chk = nlEl.querySelector('.chk'); if (chk) chk.classList.toggle('on', _noLabels);
            nlEl.classList.toggle('active', _noLabels);
            setBaseLayer(currentLayer);
        });

        // Events toggle
        const evEl = document.getElementById('tog-events');
        if (evEl) evEl.addEventListener('click', () => {
            const on = !eventsEnabled;
            setEventsEnabled(on);
            const chk = evEl.querySelector('.chk'); if (chk) chk.classList.toggle('on', on);
            evEl.classList.toggle('active', on);
        });

        // Label toggles
        const wireLabel = (id, key, fn) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('click', () => {
                labelState[key] = !labelState[key];
                const chk = el.querySelector('.chk'); if (chk) chk.classList.toggle('on', labelState[key]);
                el.classList.toggle('active', labelState[key]);
                try { fn(); } catch (_) {}
            });
        };
        wireLabel('tog-countries', 'countries', rebuildCountryLabels);
        wireLabel('tog-cities', 'cities', rebuildCityLabels);
        wireLabel('tog-water', 'water', rebuildWaterLabels);
        wireLabel('tog-regions', 'regions', () => { if (typeof rebuildAllLabels === 'function') rebuildAllLabels(); });

        // Roads toggle
        const rEl = document.getElementById('tog-roads');
        if (rEl) rEl.addEventListener('click', () => {
            const on = !(rEl.dataset.on === '1');
            rEl.dataset.on = on ? '1' : '0';
            setRoads(on);
            const chk = rEl.querySelector('.chk'); if (chk) chk.classList.toggle('on', on);
            rEl.classList.toggle('active', on);
        });

        // Arsenal UI wires its own open/close/category handlers.
        try { if (typeof setupArsenalUI === 'function') setupArsenalUI(); } catch (_) {}

        // The in-panel ━ collapse button was removed per user request — the only
        // Map layers now live in the Settings panel (no separate layers panel).

        // Theme switcher buttons (inside the Settings panel)
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => _applyTheme(btn.dataset.themeVal));
        });

        // Icons-per-source range slider (Settings). Controls how many map markers
        // each source may place. Lowering it removes excess icons immediately;
        // raising it re-places cached-geo articles (no extra AI cost) via refresh.
        const iconRange = document.getElementById('icons-per-source');
        const iconRangeVal = document.getElementById('icons-per-source-val');
        if (iconRange) {
            const cur = geoFeed.maxIconsPerSource();
            iconRange.value = String(cur);
            if (iconRangeVal) iconRangeVal.textContent = String(cur);
            iconRange.addEventListener('input', () => {
                if (iconRangeVal) iconRangeVal.textContent = iconRange.value;
            });
            iconRange.addEventListener('change', () => {
                const prev = geoFeed.maxIconsPerSource();
                const next = geoFeed.setMaxIconsPerSource(iconRange.value);
                if (next < prev) geoFeed.applyIconCap();        // lowered → trim excess now
                else if (next > prev) geoFeed.refresh(true);    // raised → add more (cached geo, free)
            });
        }

        // Helper: wire a top-bar FAB to open/close a panel as a dropdown.
        function _wireFabPanel(fabId, panelId) {
            const fab = document.getElementById(fabId);
            const panel = document.getElementById(panelId);
            if (!fab || !panel) return;
            fab.addEventListener('click', (e) => {
                e.stopPropagation();
                const open = panel.classList.toggle('is-open');
                fab.classList.toggle('is-active', open);
            });
            document.addEventListener('click', (e) => {
                if (!panel.classList.contains('is-open')) return;
                if (panel.contains(e.target) || fab.contains(e.target)) return;
                panel.classList.remove('is-open');
                fab.classList.remove('is-active');
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && panel.classList.contains('is-open')) {
                    panel.classList.remove('is-open');
                    fab.classList.remove('is-active');
                }
            });
        }

        // Map layers now live inside the Settings panel — no separate layers FAB.
        _wireFabPanel('settings-fab', 'settings-panel');

        // Tools context menu / measure panel removed.

        // Location popup close. The popup is shown/hidden via style.display
        // everywhere, so the X must set display:none (removing an 'open' class did
        // nothing — that was why the X appeared dead).
        const lpClose = document.getElementById('lp-close');
        if (lpClose) lpClose.addEventListener('click', () => {
            const p = document.getElementById('loc-popup');
            if (p) { p.style.display = 'none'; p.classList.remove('open'); }
        });

        // Country info panel close
        const ciClose = document.getElementById('ci-close');
        if (ciClose) ciClose.addEventListener('click', () => { const p = document.getElementById('country-info-panel'); if (p) { p.classList.remove('open'); p.setAttribute('aria-hidden', 'true'); } });

        // Range context menu delete
        const rcm = document.getElementById('range-cm');
        if (rcm) {
            const del = rcm.querySelector('.range-cm-delete');
            if (del) del.addEventListener('click', () => {
                const id = parseInt(del.dataset.rangeId, 10);
                if (!isNaN(id) && typeof removeArsenalRange === 'function') removeArsenalRange(id);
                rcm.classList.remove('open');
                rcm.style.display = 'none';
            });
            document.addEventListener('click', (e) => {
                if (rcm.classList.contains('open') && !e.target.closest('#range-cm')) { rcm.classList.remove('open'); rcm.style.display = 'none'; }
            });
        }

        // Language selector — uses the custom langDropdown (replaces the
        // native <select> whose system popup hid the chevron).
        langDropdown.init();
        langDropdown.setValue(currentLang);
        // One unified switch covers app strings, landing/pricing strings, every
        // dynamic re-render and both picker chips — so the change is complete and
        // instant whether triggered here or from the landing picker.
        langDropdown.onChange = (v) => { setLanguage(v); };
    }

    // ── Google Maps language swap (preserves view + all overlays) ─────────────
    // Google Maps JS only honours the `language` query param at script-load time,
    // so to change the labels' language we tear down the API and reload it.
    // While the script is loading, app.js falls back to Esri/CARTO tiles automatically
    // via the existing `_gmapsAuthFailed` / gReady check in setBaseLayer.
    let _gmapsScriptLoading = false;
    function _currentMapLang() { return currentLang || 'es'; }
    function _reloadGoogleMapsForLang(lang) {
        if (_gmapsScriptLoading) return;
        const wantLang = lang || _currentMapLang();
        // If the already-loaded script's language matches, nothing to do.
        const existing = document.querySelector('script[data-gmaps-loader="1"]');
        const currentScriptLang = existing && existing.getAttribute('data-lang');
        if (existing && currentScriptLang === wantLang) return;
        _gmapsScriptLoading = true;

        // Preserve the current view so the swap is invisible to the user.
        const center = map ? map.getCenter() : null;
        const zoom = map ? map.getZoom() : null;

        // Drop the live base layer (its internal Google map instance is about to die).
        try { if (baseLayer && map.hasLayer(baseLayer)) map.removeLayer(baseLayer); } catch (_) {}
        baseLayer = null;

        // Strip every Google-injected <script>/<link> + clear the global. After this,
        // setBaseLayer's `gReady` check is false → it renders the raster fallback while
        // the new API loads. As soon as the new script's onload fires we rebuild.
        document.querySelectorAll('script[src*="maps.googleapis.com"], script[src*="googleapis.com/maps"]').forEach(s => s.remove());
        document.querySelectorAll('link[href*="googleapis.com"]').forEach(l => l.remove());
        try { delete window.google; } catch (_) { window.google = undefined; }
        _gmapsAuthFailed = false;

        // Render the fallback raster base immediately so the map isn't blank.
        try { setBaseLayer(currentLayer); } catch (_) {}

        // Inject a fresh API script with the new `language` param.
        const s = document.createElement('script');
        s.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBYi2ig-ZkmwkXv_dt-0glm0o17BxKTCJk&v=quarterly&language=${encodeURIComponent(wantLang)}`;
        s.async = true;
        s.setAttribute('data-gmaps-loader', '1');
        s.setAttribute('data-lang', wantLang);
        s.onload = () => {
            _gmapsScriptLoading = false;
            // GoogleMutant might be loaded already; if not, the original page <script>
            // for it stays in the DOM. Recreate the base layer using the new API.
            try { setBaseLayer(currentLayer); } catch (_) {}
            // Restore view if it drifted (raster fallback might have nudged it).
            try { if (center && zoom != null) map.setView(center, zoom, { animate: false }); } catch (_) {}
        };
        s.onerror = () => { _gmapsScriptLoading = false; };
        document.head.appendChild(s);
    }

    function _abortSimulation() {
        if (_simRAF) {
            try { cancelAnimationFrame(_simRAF); } catch (_) {}
            try { clearTimeout(_simRAF); } catch (_) {}
            _simRAF = null;
        }
        if (_simState && _simState.layer) {
            try { map.removeLayer(_simState.layer); } catch (_) {}
        }
        _simState = null;
        document.body.classList.remove('sim-running', 'sim-step-running', 'sim-mode-active');
        // Repaint persistent defense coverage now that the runtime overlay
        // is gone (it was suppressed while sim was active).
        try { _renderDefenseRanges(); } catch (_) {}
    }

    function _addCountry(side, key) {
        if (_simAlliance.sides[side].countries.some(c => c.key === key)) return;
        _simAlliance.sides[side].countries.push({
            key,
            weaponGroups: [],
            defenseGroups: [],
        });
        _refreshAddSelectors();
        _renderSide(side);
        _renderLaunchSummary();
        // Pan/preview the newly-added country on the map so the user
        // sees their selection take effect (req: "show selected country
        // on map during configuration").
        try {
            const a = ARSENAL_DATA[key];
            if (a && typeof map !== 'undefined' && map && isFinite(a.lat) && isFinite(a.lng)) {
                const cur = map.getZoom ? map.getZoom() : 4;
                map.flyTo([a.lat, a.lng], Math.max(cur, 4), { duration: 0.8 });
            }
        } catch (_) {}
        _renderConfigPreview();
    }

    function _addDefenseGroup(side, key) {
        const c = _findCountry(side, key);
        if (!c) return;
        const list = _availableDefenses(key);
        if (list.length === 0) return;
        const arsenal = ARSENAL_DATA[key];
        c.defenseGroups.push({
            id: _simGroupSeq++,
            system: list[0],
            batteries: 1,
            position: { lat: arsenal.lat, lng: arsenal.lng, name: arsenal.name + ' HQ' },
        });
        _renderSide(side);
        _renderLaunchSummary();
        _renderDefenseRanges();
    }

    function _addWeaponGroup(side, key) {
        const c = _findCountry(side, key);
        if (!c) return;
        const offensive = _offensiveWeapons(key);
        if (offensive.length === 0) return;
        const first = offensive[0];
        const arsenal = ARSENAL_DATA[key];
        c.weaponGroups.push({
            id: _simGroupSeq++,
            weaponKey: `${first.kind}:${first.idx}`,
            quantity: 5,
            target: null, // {lat,lng,name}
            origin: { lat: arsenal.lat, lng: arsenal.lng }, // can be edited later
        });
        _renderSide(side);
        _renderLaunchSummary();
        _renderConfigPreview();
    }

    function _addedKeys(side) {
        return new Set(_simAlliance.sides[side].countries.map(c => c.key));
    }

    function _allCountryKeys() {
        return Object.keys(ARSENAL_DATA).sort((a, b) =>
            ARSENAL_DATA[a].name.localeCompare(ARSENAL_DATA[b].name));
    }

    function _applyTargetPick(lat, lng, name) {
        if (!_simPicking) return;
        const found = _findGroup(_simPicking.groupId);
        if (!found) return;
        // Range validation for weapon targets. Battery positions have no
        // hard range constraint — they can be deployed anywhere.
        if (found.kind === 'weapon' && _simPickRangeData) {
            const d = _haversineKm(_simPickRangeData.origin, { lat, lng });
            if (d > _simPickRangeData.rangeKm) {
                _showSimPickWarning(
                    `Target out of range — maximum range is ${Math.round(_simPickRangeData.rangeKm).toLocaleString()} km, selected point is ${Math.round(d).toLocaleString()} km away`
                );
                return; // keep picker armed so the user can try again
            }
        }
        const side = _simPicking.side;
        if (found.kind === 'weapon') {
            found.group.target = { lat, lng, name: name || 'Custom target' };
            try { _renderOffensiveRanges(); } catch (_) {}
        } else {
            found.group.position = { lat, lng, name: name || 'Forward battery' };
            try { _renderDefenseRanges(); } catch (_) {}
        }
        _cancelTargetPicker();
        _renderLaunchSummary();
    }

    function _armTargetPicker(side, countryKey, groupId) {
        _simPicking = { side, countryKey, groupId };
        const found = _findGroup(groupId);
        const isWeapon = found && found.kind === 'weapon';
        // Draw the dashed max-range guide and capture range data so the picker
        // can validate that the chosen target is within reach.
        _removeSimPickGuide();
        if (isWeapon && found.country) {
            const w = _resolveWeaponFromKey(found.country.key, found.group.weaponKey);
            const ad = ARSENAL_DATA[found.country.key];
            const origin = found.group.origin || (ad ? { lat: ad.lat, lng: ad.lng } : null);
            const accent = (typeof COUNTRY_ACCENT !== 'undefined' && COUNTRY_ACCENT[found.country.key]) || '#239f40';
            if (w && origin && w.range > 0) _drawSimPickGuide(origin, w.range, accent);
        }
        document.body.classList.add('sim-picking');
        const overlay = document.getElementById('sim-target-picker');
        const info = document.getElementById('sim-pick-info');
        const title = overlay && overlay.querySelector('.sim-pick-title');
        if (title) title.textContent = isWeapon ? 'SELECT TARGET' : 'SELECT BATTERY POSITION';
        if (info) {
            info.textContent = isWeapon
                ? 'Click anywhere on the map to pick the strike target, or enter coordinates below.'
                : 'Click on the map to deploy the battery, or enter coordinates below.';
        }
        if (overlay) overlay.style.display = 'block';
        _renderSide(side);
    }

    function _availableDefenses(countryKey) {
        const list = COUNTRY_DEFENSES[countryKey] || [];
        // Always allow choosing any system in exchange mode (some countries have none listed)
        return list.length > 0 ? list : Object.keys(DEFENSE_SYSTEMS);
    }

    function _bearingDeg(a, b) {
        const f1 = a.lat * Math.PI / 180;
        const f2 = b.lat * Math.PI / 180;
        const dl = (b.lng - a.lng) * Math.PI / 180;
        const y = Math.sin(dl) * Math.cos(f2);
        const x = Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dl);
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    }

    function _buildArcPath(start, end, amplitude, distKm, offsetIdx, n) {
        const dLat = end.lat - start.lat;
        const dLng = end.lng - start.lng;
        const len = Math.hypot(dLat, dLng) || 1;
        const px = -dLng / len, py = dLat / len;       // perpendicular unit vec
        const scale = Math.min(8, distKm / 600);
        const fanDeg = (offsetIdx || 0) * 0.35;        // baseline lateral fan
        const path = new Array(n + 1);
        for (let i = 0; i <= n; i++) {
            const t = i / n;
            const arc = 4 * t * (1 - t) * amplitude;
            const lat0 = start.lat + dLat * t;
            const lng0 = start.lng + dLng * t;
            const fan  = 4 * t * (1 - t) * fanDeg;     // fan peaks at midpoint
            const lat = lat0 + py * (arc * scale + fan);
            const lng = lng0 + px * (arc * scale + fan);
            path[i] = L.latLng(lat, lng);
        }
        return path;
    }

    function _buildIconTooltipHtml(ev) {
        const icon = ev.event_icon || '📍';
        const label = escapeHtml(_translateEventLabel(ev) || canonicalForEvent(ev));
        const items = newsById[ev.event_id] || [];
        const newest = items[0];
        const channel = newest ? escapeHtml(newest.channel || '') : '';
        const ts = _eventTimestampMs(ev);
        const elapsed = ts ? _timeAgo(ts) : '';
        const loc = ev.location ? escapeHtml(ev.location) : '';
        const summary = _eventNewsSummary(ev);
        const sumHtml = summary
            ? `<div class="ev-tt-sum">${escapeHtml(summary.slice(0, 200))}</div>`
            : '';
        const chips = [];
        if (channel) chips.push(`<span class="ev-tt-ch">${channel}</span>`);
        if (loc) chips.push(`<span class="ev-tt-loc">${loc}</span>`);
        if (elapsed) chips.push(`<span class="ev-tt-ago">${elapsed}</span>`);
        const row3 = chips.length
            ? `<div class="ev-tt-meta">${chips.join('<span class="ev-tt-sep">·</span>')}</div>`
            : '';
        return `<div class="ev-tt-row1"><span class="ev-tt-ico">${icon}</span><span class="ev-tt-lbl">${label}</span></div>${sumHtml}${row3}`;
    }

    function _buildSimMarkerTooltip(site, kind) {
        const flag = site.flag || '';
        const cName = escapeHtml(site.name || '');
        const head = `<div class="smt-head"><span class="smt-flag">${flag}</span><span class="smt-country">${cName}</span></div>`;
        if (kind === 'defense') {
            const sys = site.systemMeta || {};
            const typeLbl = sys.kind ? escapeHtml(sys.kind) : 'Air-defense system';
            const rngLbl = (site.rangeKm || 0).toLocaleString();
            const batLbl = site.batteries ? `${site.batteries} battery${site.batteries > 1 ? 'ies' : ''}` : '';
            return head
                + `<div class="smt-weapon">`
                + `<div class="smt-wname">${escapeHtml(site.system || '')}</div>`
                + `<div class="smt-wtype">${typeLbl}</div>`
                + `<div class="smt-wmeta">Range: ${rngLbl} km${batLbl ? ` · ${batLbl}` : ''}</div>`
                + `</div>`;
        }
        // Offensive: bucket weapons by name (sum qty) for a clean list.
        const uniq = new Map();
        (site.weapons || []).forEach(w => {
            const e = uniq.get(w.name) || { name: w.name, qty: 0, rng: w.rng, type: w.type, mtype: w.mtype, warhead: w.warhead };
            e.qty += w.qty;
            uniq.set(w.name, e);
        });
        const rows = Array.from(uniq.values())
            .sort((a, b) => b.rng - a.rng)
            .map(w => {
                const typeLbl = w.type ? escapeHtml(w.type)
                    : (MISSILE_COLOR_LABELS[w.mtype] || 'Weapon');
                const warheadLbl = w.warhead ? `<div class="smt-wmeta">Warhead: ${escapeHtml(w.warhead)}</div>` : '';
                return `<div class="smt-weapon">`
                    + `<div class="smt-wname">${escapeHtml(w.name)} <span class="smt-wqty">×${w.qty}</span></div>`
                    + `<div class="smt-wtype">${typeLbl}</div>`
                    + `<div class="smt-wmeta">Range: ${w.rng.toLocaleString()} km</div>`
                    + warheadLbl
                    + `</div>`;
            }).join('');
        return head + rows;
    }

    function _buildTargetCrosshair({ lat, lng, accent, origin, rangeKm, onDrop }) {
        const html = `<div class="sim-target-cross" style="--col:${accent}">
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                <line x1="12" y1="0" x2="12" y2="24" stroke="${accent}" stroke-width="1.6"/>
                <line x1="0" y1="12" x2="24" y2="12" stroke="${accent}" stroke-width="1.6"/>
                <circle cx="12" cy="12" r="3.5" fill="none" stroke="${accent}" stroke-width="1.6"/>
            </svg>
            <div class="sim-target-label">${lat.toFixed(3)}°, ${lng.toFixed(3)}°</div>
        </div>`;
        const marker = L.marker([lat, lng], {
            icon: L.divIcon({ className: '', html, iconSize: [26, 26], iconAnchor: [13, 13] }),
            draggable: true,
            keyboard: false,
            zIndexOffset: 1500,
        });
        marker.on('drag', e => {
            const ll = e.target.getLatLng();
            const d = _haversineKm(origin, { lat: ll.lat, lng: ll.lng });
            let curLat = ll.lat, curLng = ll.lng;
            if (d > rangeKm) {
                const bearing = _bearingDeg(origin, { lat: ll.lat, lng: ll.lng });
                const [snapLat, snapLng] = geodesicDestination(origin.lat, origin.lng, bearing, rangeKm * 0.999);
                marker.setLatLng([snapLat, snapLng]);
                curLat = snapLat; curLng = snapLng;
            }
            const el = marker.getElement && marker.getElement();
            const lbl = el && el.querySelector('.sim-target-label');
            if (lbl) lbl.textContent = `${curLat.toFixed(3)}°, ${curLng.toFixed(3)}°`;
        });
        marker.on('dragend', e => {
            const ll = e.target.getLatLng();
            if (onDrop) onDrop(ll.lat, ll.lng);
        });
        return marker;
    }

    function _cancelTargetPicker() {
        const overlay = document.getElementById('sim-target-picker');
        if (overlay) overlay.style.display = 'none';
        const side = _simPicking ? _simPicking.side : null;
        _simPicking = null;
        document.body.classList.remove('sim-picking');
        _removeSimPickGuide();
        if (side) _renderSide(side);
    }

    function _classifyMissileClass(weapon) {
        const type = String(weapon?.type || '').toUpperCase();
        const mtype = String(weapon?.mtype || '').toLowerCase();
        const name = String(weapon?.name || '');
        const range = Number(weapon?.range || 0);
        if (mtype === 'hypersonic' || /hyperson/i.test(type)) return 'HYPERSONIC';
        if (mtype === 'cruise' || /cruise|alcm|glcm|slcm|anti-?ship/i.test(type)) return 'CRUISE';
        if (/drone|loiter|kamikaze|ucav|uav/i.test(type + name)) return 'DRONE';
        if (/icbm/i.test(type)) return 'ICBM';
        if (/slbm/i.test(type)) return 'SLBM';
        if (/irbm/i.test(type)) return 'IRBM';
        if (/mrbm/i.test(type)) return 'MRBM';
        if (/srbm|tactical/i.test(type)) return 'SRBM';
        if (/rocket|artillery/i.test(type)) return 'ROCKET';
        // Fallback by published range (km).
        if (mtype === 'ballistic') {
            if (range >= 5500) return 'ICBM';
            if (range >= 3000) return 'IRBM';
            if (range >= 1000) return 'MRBM';
            return 'SRBM';
        }
        return 'CRUISE';
    }

    function _classifyMissileType(weapon) {
        const t = (weapon?.mtype || '').toLowerCase();
        if (t === 'ballistic' || t === 'hypersonic') return 'ballistic';
        if (t === 'cruise') return 'cruise';
        if (t === 'tactical') return 'cruise';
        // Drones (no mtype) → drone
        if (weapon && !weapon.mtype && /drone|loiter|kamikaze|uav|ucav/i.test((weapon.type||'')+(weapon.name||''))) return 'drone';
        return 'ballistic';
    }

    const _decodeEl = document.createElement('textarea');
    function _decodeEntities(str) {
        _decodeEl.innerHTML = str;
        return _decodeEl.value;
    }
    function _cleanMessage(msg) {
        return _decodeEntities((msg || '')
            .replace(/<[^>]+>/g, '')
            .replace(/\*\*/g, '')
            .replace(/__/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/\n{2,}/g, '\n')
            .trim());
    }

    function _cleanupMissile(m) {
        if (!_simState || !_simState.layer) return;
        if (m.trail && _simState.layer.hasLayer(m.trail)) {
            _simState.layer.removeLayer(m.trail);
        }
        if (m.head && _simState.layer.hasLayer(m.head)) {
            _simState.layer.removeLayer(m.head);
        }
    }

    function _clearMapArtifacts() {
        // Abort any running sim first
        if (_simState) _abortSimulation();
        if (_simResidualLayer && typeof map !== 'undefined' && map) {
            try { map.removeLayer(_simResidualLayer); } catch(e) {}
            _simResidualLayer = null;
        }
        _lastResultsHTML = '';
        _renderDefenseRanges();
        // Refresh the "View Last Results" pill visibility
        const lastRow = document.getElementById('sim-last-results-row');
        if (lastRow) lastRow.style.display = 'none';
        if (typeof _setSimStep === 'function') _setSimStep('config');
    }

    function _clusterKey(lat, lng) {
        return `${lat.toFixed(3)}|${lng.toFixed(3)}`;
    }

    function _computeBlastKm(weapon) {
        const w = String(weapon?.warhead || '').toLowerCase();
        if (/nuclear|nuke|mirv/.test(w)) {
            const mKt = w.match(/(\d+(?:\.\d+)?)\s*kt/);
            const kt = mKt ? parseFloat(mKt[1]) : 100;
            return Math.max(2, 2.0 * Math.pow(kt, 1/3));
        }
        const m = w.match(/(\d+(?:\.\d+)?)\s*kg/);
        const kg = m ? parseFloat(m[1]) : 200;
        return Math.max(0.05, 0.015 * Math.pow(kg, 0.45));
    }

    function _computeBlastRings(weapon) {
        const w = String(weapon?.warhead || '').toLowerCase();
        if (/nuclear|nuke|mirv/.test(w)) {
            const mKt = w.match(/(\d+(?:\.\d+)?)\s*kt/);
            const kt = mKt ? parseFloat(mKt[1]) : 100;
            const cbrt = Math.pow(kt, 1/3);
            return {
                lethal:   Math.max(0.5, 1.0 * cbrt),
                severe:   Math.max(1.0, 1.7 * cbrt),
                moderate: Math.max(2.0, 3.0 * cbrt),
            };
        }
        const m = w.match(/(\d+(?:\.\d+)?)\s*kg/);
        const kg = m ? parseFloat(m[1]) : 200;
        const cbrt = Math.pow(kg, 1/3);
        return {
            lethal:   Math.max(0.020, 0.0050 * cbrt),
            severe:   Math.max(0.040, 0.0110 * cbrt),
            moderate: Math.max(0.080, 0.0220 * cbrt),
        };
    }

    function _confirmTargetPickerCoords() {
        if (!_simPicking) return;
        const lat = parseFloat(document.getElementById('sim-pick-lat').value);
        const lng = parseFloat(document.getElementById('sim-pick-lng').value);
        if (!isFinite(lat) || !isFinite(lng)) return;
        if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return;
        _applyTargetPick(lat, lng);
    }

    function _countryColor(countryKey) {
        const k = String(countryKey || '');
        let h = 0;
        for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
        const hue = h % 360;
        return `hsl(${hue}, 78%, 62%)`;
    }

    function _damageAssessment(impacts, blastKm) {
        if (impacts === 0) return 'Ninguno';
        const area = impacts * Math.PI * blastKm * blastKm;
        if (area < 5) return 'Daño localizado';
        if (area < 25) return 'Daño moderado a varios distritos';
        if (area < 100) return 'Daño urbano severo';
        return 'Devastación regional';
    }

    function _damageCategory(impacts, area) {
        if (impacts === 0) return { label: 'NONE', cls: 'verdict-none' };
        if (area < 5)   return { label: 'LOCALISED',   cls: 'verdict-low' };
        if (area < 25)  return { label: 'MODERATE',    cls: 'verdict-mid' };
        if (area < 100) return { label: 'SEVERE',      cls: 'verdict-high' };
        if (area < 400) return { label: 'CATASTROPHIC',cls: 'verdict-crit' };
        return { label: 'REGIONAL DEVASTATION', cls: 'verdict-crit' };
    }

    function _deregisterCluster(eventId) {
        const key = eventClusterKey[eventId];
        if (!key) return;
        delete eventClusterKey[eventId];
        delete userIconOffset[eventId];
        if (dispersionGroups[key]) {
            dispersionGroups[key] = dispersionGroups[key].filter(id => id !== eventId);
            if (dispersionGroups[key].length === 0) {
                delete dispersionGroups[key];
                // Last member gone — also drop the central anchor dot so we
                // never leave an orphan marker behind after eviction.
                _removeCenterDot(key);
            } else {
                _redisperse(key);
            }
        }
        _removeDispersionLine(eventId);
    }

    function _dominantAccent(eventIds) {
        const counts = {};
        let bestType = 'pin', bestCount = 0;
        for (const eid of eventIds) {
            const ev = eventsById[eid];
            if (!ev) continue;
            const c = canonicalForEvent(ev);
            counts[c] = (counts[c] || 0) + 1;
            if (counts[c] > bestCount) { bestCount = counts[c]; bestType = c; }
        }
        return CANONICAL_COLOR[bestType] || CANONICAL_COLOR.pin;
    }

    function _drawRange(range) {
        _ensureArsenalPane();

        // Tear down any previous layers for this range
        if (range.main) { map.removeLayer(range.main); range.main = null; }
        if (range.blast) { map.removeLayer(range.blast); range.blast = null; }
        if (range.radiusLine) { map.removeLayer(range.radiusLine); range.radiusLine = null; }
        if (range.radiusLabel) { map.removeLayer(range.radiusLabel); range.radiusLabel = null; }

        const center = [range.lat, range.lng];
        const rangeKm = Math.max(1, range.weapon.range || 100);
        const blastKm = explosionRadiusKm(range.weapon);

        // Outer max-range circle. Geodesic, solid outline, very subtle fill.
        range.main = L.circle(center, {
            radius: rangeKm * 1000,
            color: range.accent,
            weight: 1.8,
            opacity: 0.92,
            fillColor: range.color,
            fillOpacity: 0.06,
            pane: 'arsenalPane',
            className: 'ars-range-main',
            interactive: true,
            bubblingMouseEvents: false,
        }).addTo(map);

        range.main.on('contextmenu', (e) => {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e.originalEvent);
            const oe = e.originalEvent;
            showRangeContextMenu(oe.clientX, oe.clientY, range.id);
        });

        // Inner blast / impact zone. Crisp ring with flat fill — no filter,
        // no drop-shadow, so it stays sharp at every zoom level.
        if (blastKm > 0) {
            range.blast = L.circle(center, {
                radius: blastKm * 1000,
                color: '#ff3b30',
                weight: 1.4,
                opacity: 0.92,
                fillColor: '#ff3b30',
                fillOpacity: 0.22,
                interactive: false,
                pane: 'arsenalPane',
                className: 'ars-range-blast',
            }).addTo(map);
        }

        // Geodesic radius leader pointing due north — a small visual aid that
        // makes the range size readable even when the user is zoomed deep
        // inside the circle. Polyline is geodesic so it reprojects with zoom.
        const [tipLat, tipLng] = geodesicDestination(range.lat, range.lng, 0, rangeKm);
        range.radiusLine = L.polyline([center, [tipLat, tipLng]], {
            color: range.accent,
            weight: 1.2,
            opacity: 0.55,
            dashArray: '4 5',
            interactive: false,
            pane: 'arsenalPane',
            className: 'ars-range-radius',
        }).addTo(map);
    }

    function _drawSimPickGuide(originLL, rangeKm, accent) {
        _removeSimPickGuide();
        if (typeof map === 'undefined' || !map) return;
        if (!originLL || !(rangeKm > 0)) return;
        _simPickRangeGuide = L.circle([originLL.lat, originLL.lng], {
            radius: rangeKm * 1000,
            color: accent,
            weight: 1.8,
            opacity: 0.4,
            fillColor: accent,
            fillOpacity: 0.05,
            dashArray: '8 6',
            interactive: false,
        }).addTo(map);
        _simPickRangeData = {
            origin: { lat: originLL.lat, lng: originLL.lng },
            rangeKm: rangeKm,
        };
    }

    function _ensureArsenalPane() {
        if (!map) return;
        if (!map.getPane('arsenalPane')) {
            const p = map.createPane('arsenalPane');
            p.style.zIndex = 450;
            p.style.pointerEvents = 'auto';
        }
    }

    function _ensureClusterLayer() {
        if (typeof map === 'undefined' || !map) return null;
        if (!_clusterLayer) {
            if (!map.getPane('clusterPane')) {
                const p = map.createPane('clusterPane');
                p.style.zIndex = 560;             // above eventPane (550)
                p.style.pointerEvents = 'auto';
            }
            _clusterLayer = L.layerGroup([], { pane: 'clusterPane' });
            if (eventsEnabled) _clusterLayer.addTo(map);
            console.debug('[news-pipe] cluster layer created');
        } else if (eventsEnabled && !map.hasLayer(_clusterLayer)) {
            _clusterLayer.addTo(map);
        }
        return _clusterLayer;
    }

    function _ensureEl() {
            if (_el) return;
            _el = document.createElement('div');
            _el.className = 'ev-tt';
            _el.setAttribute('aria-hidden', 'true');
            document.body.appendChild(_el);
        }

    function _ensureSimTickRunning() {
           if (_simState && !_simRAF) {
               _simRAF = document.hidden
                   ? setTimeout(_simTick, 33)
                   : requestAnimationFrame(_simTick);
           }
       }

    function _eventNewsSummary(ev) {
        if (!ev || !ev.event_id) return '';
        const items = newsById[ev.event_id];
        if (!Array.isArray(items) || items.length === 0) return '';
        const raw = (items[0].message || '').replace(/\s+/g, ' ').trim();
        if (!raw) return '';
        return raw.length > 140 ? raw.slice(0, 137) + '…' : raw;
    }

    function _eventTimeLeftMs(ev) {
        const ts = _eventTimestampMs(ev);
        if (!ts) return EVENT_TTL_MS;   // unknown age → treat as fresh
        const reference = _ttlMode === 'frozen' ? _ttlReference : Date.now();
        return EVENT_TTL_MS - (reference - ts);
    }

    function _eventTimestampMs(ev) {
        if (!ev) return 0;
        const raw = ev.timestamp || ev.created_at || ev.first_seen || null;
        if (!raw) return 0;
        // Backend timestamps may arrive as ISO strings, plain numeric ms,
        // or numeric seconds. Detect and normalise.
        if (typeof raw === 'number') {
            return raw > 1e12 ? raw : raw * 1000;   // ms vs seconds
        }
        const ms = Date.parse(raw);
        return isFinite(ms) ? ms : 0;
    }

    function _explodeImpact(m) {
        if (!_simState) return;
        const pane = _simState.pane;
        // Trajectory line + head dot vanish on impact — only the explosion
        // radii remain on the map.
        _cleanupMissile(m);
        const rings = _computeBlastRings(m.t.weapon);
        // Three concentric damage zones (overpressure-tier coloring).
        const moderate = L.circle(m.end, {
            radius: rings.moderate * 1000, color: '#ffd84d', weight: 1,
            fillColor: '#ffd84d', fillOpacity: 0.14, pane,
            interactive: false, className: 'sim-explosion-moderate',
        }).addTo(_simState.layer);
        const severe = L.circle(m.end, {
            radius: rings.severe * 1000, color: '#ff8a30', weight: 1,
            fillColor: '#ff8a30', fillOpacity: 0.22, pane,
            interactive: false, className: 'sim-explosion-severe',
        }).addTo(_simState.layer);
        const lethal = L.circle(m.end, {
            radius: rings.lethal * 1000, color: '#ff3b30', weight: 2,
            fillColor: '#ff3b30', fillOpacity: 0.42, pane,
            interactive: false, className: 'sim-explosion-lethal',
        }).addTo(_simState.layer);
        // Bright flash that fades out fast.
        const flash = L.circle(m.end, {
            radius: rings.lethal * 1500, color: '#ffffe6', weight: 3,
            fillColor: '#fff5b0', fillOpacity: 0.85, pane,
            interactive: false, className: 'sim-explosion-flash',
        }).addTo(_simState.layer);
        let op = 0.85;
        const fade = setInterval(() => {
            if (!_simState) { clearInterval(fade); return; }
            op -= 0.085;
            flash.setStyle({ fillOpacity: Math.max(0, op), opacity: Math.max(0, op) });
            if (op <= 0) {
                clearInterval(fade);
                if (_simState && _simState.layer && _simState.layer.hasLayer(flash)) _simState.layer.removeLayer(flash);
            }
        }, 55);
        if (_simState.layer.hasLayer(m.head)) _simState.layer.removeLayer(m.head);
        m.trail.setStyle({ opacity: 0.32, color: '#aa1f10' });
        // Track persistent rings on the missile so reset can clean them.
        m.persistent = m.persistent || [];
        m.persistent.push(moderate, severe, lethal);
    }

    function _explodeIntercept(m, pos) {
        if (!_simState) return;
        const pane = 'simPane';
        const ring = L.circle(pos, {
            radius: 8000, color: '#ffae42', weight: 2, fillColor: '#ffae42',
            fillOpacity: 0.45, pane, interactive: false, className: 'sim-explosion-intercept'
        }).addTo(_simState.layer);
        let r = 8000;
        const grow = setInterval(() => {
            // _simState may have been cleared (sim stopped) — defensive guard
            if (!_simState) { clearInterval(grow); return; }
            r += 4000;
            ring.setRadius(r);
            const op = ring.options.fillOpacity * 0.85;
            ring.setStyle({ fillOpacity: op });
            if (op < 0.05) {
                clearInterval(grow);
                if (_simState && _simState.layer) _simState.layer.removeLayer(ring);
            }
        }, 80);
        if (_simState.layer.hasLayer(m.trail)) {
            setTimeout(() => _simState && _simState.layer && _simState.layer.removeLayer(m.trail), 600);
        }
        if (_simState.layer.hasLayer(m.head)) {
            _simState.layer.removeLayer(m.head);
        }
    }

    function _findCountry(side, key) {
        return _simAlliance.sides[side].countries.find(c => c.key === key);
    }

    function _findGroup(groupId) {
        for (const side of ['A', 'B']) {
            for (const c of _simAlliance.sides[side].countries) {
                const wg = c.weaponGroups.find(g => g.id === groupId);
                if (wg) return { side, country: c, group: wg, kind: 'weapon' };
                const dg = c.defenseGroups.find(g => g.id === groupId);
                if (dg) return { side, country: c, group: dg, kind: 'defense' };
            }
        }
        return null;
    }

    function _finishSimulation() {
        if (!_simState) return;
        // Anything still alive resolves now
        _simState.missiles.forEach(m => {
            if (m.alive) {
                if (m.t.intercepted) {
                    _explodeIntercept(m, m.head.getLatLng());
                    _simState.stats.intercepted += 1;
                } else if (m.t.outOfRange) {
                    _simState.stats.fizzled = (_simState.stats.fizzled || 0) + 1;
                } else {
                    _explodeImpact(m);
                    _simState.stats.impacted += 1;
                }
                m.alive = false;
            }
        });
        _updateHud();
        // Donate the still-on-map sim layer (impact rings, blast circles,
        // defense markers) to the residual store so the user can see
        // damage zones after results, and a single Clear Map call wipes it.
        if (_simResidualLayer && window.map) {
            try { window.map.removeLayer(_simResidualLayer); } catch(e) {}
        }
        _simResidualLayer = _simState.layer;   // ownership transfer
        if (_simRAF) {
            try { cancelAnimationFrame(_simRAF); } catch(_) {}
            try { clearTimeout(_simRAF); } catch(_) {}
            _simRAF = null;
        }
        // _showResults reads _simState, so call it BEFORE nulling.
        _showResults();
        _simState = null;
        document.body.classList.remove('sim-running', 'sim-step-running');
        try { _renderDefenseRanges(); } catch(_) {}
    }

    function _formatLoc(location, tier) {
        if (!location) return '';
        const esc = escapeHtml(location);
        const native = LOC_NATIVE[location];
        const nativePart = native ? ` <span class="loc-native">${escapeHtml(native)}</span>` : '';
        if (tier === 'country') return `<span class="loc-approx">≈</span> ${esc}${nativePart}`;
        return `${esc}${nativePart}`;
    }

    function _haversineKm(a, b) {
        const R = 6371;
        const dLat = (b.lat - a.lat) * Math.PI / 180;
        const dLng = (b.lng - a.lng) * Math.PI / 180;
        const la1 = a.lat * Math.PI / 180, la2 = b.lat * Math.PI / 180;
        const h = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;
        return 2 * R * Math.asin(Math.sqrt(h));
    }

    function _highlightOffensiveGroup(groupId, on) {
        if (!_simOffensiveRangeLayer) return;
        try {
            _simOffensiveRangeLayer.eachLayer(l => {
                const ids = l._simGroupIds ? l._simGroupIds.split(',')
                    : ((l.getElement && l.getElement() && l.getElement().dataset && l.getElement().dataset.groupIds)
                        ? l.getElement().dataset.groupIds.split(',')
                        : null);
                if (!ids || ids.indexOf(String(groupId)) === -1) return;
                const el = l.getElement && l.getElement();
                if (el) el.classList.toggle('sim-off-ring-hl', !!on);
            });
        } catch (_) {}
    }

    function _iconHtmlCacheSet(key, html) {
        if (_iconHtmlCache.size >= ICON_HTML_CACHE_MAX) {
            // Drop oldest insertion (Map preserves insertion order)
            const oldest = _iconHtmlCache.keys().next().value;
            if (oldest !== undefined) _iconHtmlCache.delete(oldest);
        }
        _iconHtmlCache.set(key, html);
    }

    function _installMapClickGuards() {
        if (!map || map._simGuardInstalled) return;
        map._simGuardInstalled = true;

        const container = map.getContainer();
        let dx = 0, dy = 0, sx = 0, sy = 0, isDown = false;
        const onDown = (e) => {
            const ev = e.touches ? e.touches[0] : e;
            sx = ev.clientX; sy = ev.clientY;
            dx = 0; dy = 0; isDown = true;
            _mapDragSuppress = false;
        };
        const onMove = (e) => {
            if (!isDown) return;
            const ev = e.touches ? e.touches[0] : e;
            dx = ev.clientX - sx; dy = ev.clientY - sy;
            if (Math.hypot(dx, dy) > 5) _mapDragSuppress = true;
        };
        const onUp = () => { isDown = false; };
        container.addEventListener('mousedown', onDown);
        container.addEventListener('mousemove', onMove);
        container.addEventListener('mouseup', onUp);
        container.addEventListener('touchstart', onDown, { passive: true });
        container.addEventListener('touchmove', onMove, { passive: true });
        container.addEventListener('touchend', onUp);

        // Insert our handler BEFORE the existing click chain by using
        // L.DomEvent to capture and stop propagation when picking.
        map.on('click', (e) => {
            if (document.body.classList.contains('sim-picking') && _simPicking) {
                _applyTargetPick(e.latlng.lat, e.latlng.lng);
                return;
            }
        });
    }

    function _interpolateArc(m, t) {
        // Slerp on the sphere for the projected lat/lng (great-circle path)
        const a = m.start, b = m.end;
        const lat = a.lat + (b.lat - a.lat) * t;
        const lng = a.lng + (b.lng - a.lng) * t;
        if (m.arcAmplitude < 0.03) return L.latLng(lat, lng);
        // Parabolic arc - max amplitude at t=0.5
        const arc = 4 * t * (1 - t) * m.arcAmplitude;
        // Perpendicular bearing (rotate the path direction by -90deg in lat-lng)
        const dLat = b.lat - a.lat;
        const dLng = b.lng - a.lng;
        // Normalize and rotate
        const len = Math.hypot(dLat, dLng) || 1;
        const px = -dLng / len, py = dLat / len;
        // Use a fraction of distance as displacement scale
        const scale = Math.min(8, m.distKm / 600);
        return L.latLng(lat + py * arc * scale, lng + px * arc * scale);
    }

    function _labelPriority(m) {
        const t = m._labelType;
        if (t === 'country') {
            // LABELRANK 1 = world capital, 10 = obscure. We multiply by 10
            // to leave room for cities to fall *between* country priorities.
            return ((m._labelData && m._labelData.rank) || 5) * 10;
        }
        if (t === 'city') {
            // scalerank 0 (megacity) → 1 (capital) … 10 (small town)
            return 30 + ((m._labelData && m._labelData.rank) || 8) * 5;
        }
        if (t === 'water') return 5;       // major geographic features always survive
        if (t === 'province') return 80;
        if (t === 'range') return 0;       // user-placed: never hide
        return 100;
    }

    function _newsKey(n) {
        return `${n.channel || ''}|${n.message_id || ''}`;
    }

    function _newsMediaList(item) {
        if (item.media_items && item.media_items.length) return item.media_items;
        if (item.media_path) return [{ path: item.media_path, type: item.media_type }];
        return [];
    }

    function _offensiveWeapons(countryKey) {
        const arsenal = ARSENAL_DATA[countryKey];
        if (!arsenal) return [];
        const out = [];
        (arsenal.missile || []).forEach((w, i) => {
            if (w.cat === 'sa') return;
            out.push({ kind: 'missile', idx: i, weapon: w });
        });
        (arsenal.drone || []).forEach((w, i) => {
            out.push({ kind: 'drone', idx: i, weapon: w });
        });
        return out;
    }


    function _pixelToDeg(px, lat, zoom) {
        const mpx = (20037508.34 * 2) / (256 * Math.pow(2, zoom));
        const latDeg = (mpx * px) / 111320;
        const lngDeg = latDeg / Math.max(0.001, Math.cos(lat * Math.PI / 180));
        return { lat: latDeg, lng: lngDeg };
    }

    function _placePanelEl() { return document.getElementById('place-info-panel'); }


    function _rebuildClusters() {
        if (!map || !eventsEnabled) return;
        // Don't re-cluster mid collapse-animation (it would fight the fold-back);
        // collapse schedules a rebuild itself when done. Open fans DON'T block the
        // rebuild — their members are simply held out of clustering below.
        if (_fansCollapsing > 0) return;
        const layer = _ensureClusterLayer();
        if (!layer) return;

        // Project every on-screen, non-deployed event to container pixels. Events
        // currently fanned out are excluded so opening a fan never re-clusters the
        // rest away — multiple fans can stay open with normal clustering around them.
        const bounds = map.getBounds();
        const pts = [];
        _spatialIndex.forEach((p, eid) => {
            if (_deployedIds.has(eid)) return;
            if (!bounds.contains([p.lat, p.lng])) return;
            const pt = map.latLngToContainerPoint([p.lat, p.lng]);
            pts.push({ eid, lat: p.lat, lng: p.lng, x: pt.x, y: pt.y });
        });
        // Deterministic order keeps clustering stable between rebuilds.
        pts.sort((a, b) => (a.x - b.x) || (a.y - b.y));

        // Greedy proximity clustering: a point joins the nearest cluster whose
        // centre is within R, else seeds a new one. R tracks the current (zoom-
        // driven) icon size so chips/icons never overlap at any zoom level.
        const iconPx = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--event-size')
        ) || 40;
        const R = Math.max(CLUSTER_RADIUS_PX, iconPx + 14);
        const clusters = [];
        pts.forEach(p => {
            let best = null, bestD = R;
            for (const c of clusters) {
                const d = Math.hypot(c.cx - p.x, c.cy - p.y);
                if (d < bestD) { bestD = d; best = c; }
            }
            if (best) {
                best.ids.push(p.eid);
                best.sx += p.x; best.sy += p.y;
                best.sumLat += p.lat; best.sumLng += p.lng;
                best.cx = best.sx / best.ids.length;
                best.cy = best.sy / best.ids.length;
            } else {
                clusters.push({ ids: [p.eid], sx: p.x, sy: p.y, cx: p.x, cy: p.y, sumLat: p.lat, sumLng: p.lng });
            }
        });
        // Merge until no two centres sit closer than R, so chips (and singleton
        // icons) can never visually overlap, even slightly, when zoomed out.
        let mergedAny = true;
        while (mergedAny) {
            mergedAny = false;
            for (let i = 0; i < clusters.length && !mergedAny; i++) {
                for (let j = i + 1; j < clusters.length; j++) {
                    const a = clusters[i], b = clusters[j];
                    if (Math.hypot(a.cx - b.cx, a.cy - b.cy) < R) {
                        a.ids = a.ids.concat(b.ids);
                        a.sx += b.sx; a.sy += b.sy;
                        a.sumLat += b.sumLat; a.sumLng += b.sumLng;
                        a.cx = a.sx / a.ids.length; a.cy = a.sy / a.ids.length;
                        clusters.splice(j, 1);
                        mergedAny = true;
                        break;
                    }
                }
            }
        }

        // Render: size >= CLUSTER_MIN becomes a numbered chip; size 1 stays a
        // standalone event marker.
        const liveKeys = new Set();
        const newlyClustered = new Set();
        clusters.forEach(c => {
            if (c.ids.length < CLUSTER_MIN) return;
            c.ids.forEach(id => newlyClustered.add(id));
            // Stable key (smallest member id) lets us reuse the chip across rebuilds.
            let minId = c.ids[0];
            for (const id of c.ids) if (id < minId) minId = id;
            const key = 'c' + minId;
            liveKeys.add(key);
            const centerLat = c.sumLat / c.ids.length;
            const centerLng = c.sumLng / c.ids.length;
            const color = _dominantAccent(c.ids);
            const count = c.ids.length;
            const size = Math.min(56, 36 + Math.log2(count) * 6);
            const html = `<div class="ev-cluster" style="--accent:${color}; --cluster-size:${size}px"><span class="ev-cluster-count">${count}</span></div>`;
            let chip = _activeClusters.get(key);
            if (chip) {
                chip.setLatLng([centerLat, centerLng]);
                chip.setIcon(L.divIcon({ className: 'ev-clusterIcon', html, iconSize: [56, 56], iconAnchor: [28, 28] }));
                chip._evIds = c.ids;
            } else {
                chip = L.marker([centerLat, centerLng], {
                    pane: 'clusterPane',
                    icon: L.divIcon({ className: 'ev-clusterIcon', html, iconSize: [56, 56], iconAnchor: [28, 28] }),
                    keyboard: false,
                    riseOnHover: true,
                });
                chip._evIds = c.ids;
                chip.on('click', (e) => {
                    L.DomEvent.stop(e);
                    _handleClusterClick(chip);
                });
                chip.addTo(layer);
                _activeClusters.set(key, chip);
            }
        });
        // Remove chips that no longer correspond to a live cluster.
        _activeClusters.forEach((chip, key) => {
            if (!liveKeys.has(key)) {
                try { chip.off(); } catch (_) {}
                if (layer.hasLayer(chip)) layer.removeLayer(chip);
                _activeClusters.delete(key);
            }
        });
        _clusteredEventIds = newlyClustered;

        // Absolute visibility pass: a marker is shown unless it's folded into a
        // chip. Deployed (fanned-out) icons are always shown. We intentionally do
        // NOT hide standalone icons that merely sit near an open fan — doing so
        // was the cause of the bug where surrounding icons vanished the moment a
        // cluster was expanded. A little overlap with the fan ring is fine.
        Object.keys(eventMarkers).forEach(eid => {
            const m = eventMarkers[eid];
            const el = m && m.getElement && m.getElement();
            if (!el) return;
            if (_deployedIds.has(eid)) { el.style.visibility = ''; return; }
            el.style.visibility = newlyClustered.has(eid) ? 'hidden' : '';
        });
    }

    function _redisperse(key) {
        // Co-located events are now revealed on demand via click-to-spiderfy, so
        // there is no always-on scatter. Strip any legacy dispersion artifacts for
        // this cell and leave the markers stacked at their true coordinate (the
        // pixel-bucket clusterer folds them into a single chip).
        _removeCenterDot(key);
        const group = dispersionGroups[key] || [];
        group.forEach(eid => {
            _removeDispersionLine(eid);
            const m = eventMarkers[eid];
            if (m && m.dragging && m.dragging.disable) m.dragging.disable();
        });
    }

    function _refreshAddSelectors() {
        ['A', 'B'].forEach(side => {
            const sel = document.getElementById('sim-add-' + side);
            if (!sel) return;
            const taken = new Set([
                ..._addedKeys('A'),
                ..._addedKeys('B'),
            ]);
            sel.innerHTML = '';
            const placeholder = new Option(t('simSelectCountryOpt'), '');
            placeholder.disabled = true;
            placeholder.selected = true;
            sel.appendChild(placeholder);
            _allCountryKeys().forEach(k => {
                if (taken.has(k)) return;
                const c = ARSENAL_DATA[k];
                sel.appendChild(new Option(`${c.flag} ${c.name}`, k));
            });
        });
    }

    function _refreshTtlReference(events) {
        const now = Date.now();
        const newest = events.reduce((acc, ev) => Math.max(acc, _eventTimestampMs(ev)), 0);
        if (!newest) return;
        if ((now - newest) > EVENT_TTL_MS) {
            // Stale dump — anchor to the freshest event so it renders.
            const prevMode = _ttlMode;
            _ttlReference = newest;
            _ttlMode = 'frozen';
            if (prevMode !== 'frozen') {
                const ageHours = ((now - newest) / 3600000).toFixed(1);
                console.warn(`[news-pipe] Stale data detected: newest event is ${ageHours}h old. ` +
                    `Anchoring TTL window to freshest event timestamp so icons render. ` +
                    `Backend should resume publishing fresh data to restore live mode.`);
            }
        } else if (newest > _ttlReference) {
            // Fresh event arrived — return to live mode.
            if (_ttlMode !== 'live') console.info('[news-pipe] Fresh data received — back in live TTL mode.');
            _ttlReference = now;
            _ttlMode = 'live';
        }
    }

    function _registerCluster(eventId, lat, lng) {
        const key = _clusterKey(lat, lng);
        eventClusterKey[eventId] = key;
        if (!dispersionGroups[key]) dispersionGroups[key] = [];
        if (!dispersionGroups[key].includes(eventId)) dispersionGroups[key].push(eventId);
        _redisperse(key);
        // Pixel-bucket index (separate from same-coord dispersion above).
        _spatialIndexAdd(eventId, lat, lng);
        _scheduleClusterRebuild();
    }

    function _removeCenterDot(key) {
        if (dispersionCenterDots[key] && dispersionLineLayer) {
            dispersionLineLayer.removeLayer(dispersionCenterDots[key]);
            delete dispersionCenterDots[key];
        }
    }

    function _removeCountry(side, key) {
        const arr = _simAlliance.sides[side].countries;
        const idx = arr.findIndex(c => c.key === key);
        if (idx >= 0) arr.splice(idx, 1);
        _refreshAddSelectors();
        _renderSide(side);
        _renderLaunchSummary();
        _renderConfigPreview();
    }

    function _removeDefenseGroup(side, key, gid) {
        const c = _findCountry(side, key);
        if (!c) return;
        const idx = c.defenseGroups.findIndex(g => g.id === gid);
        if (idx >= 0) c.defenseGroups.splice(idx, 1);
        _renderSide(side);
        _renderLaunchSummary();
        _renderDefenseRanges();
    }

    function _removeDispersionLine(eid) {
        if (dispersionLines[eid] && dispersionLineLayer) {
            dispersionLineLayer.removeLayer(dispersionLines[eid]);
            delete dispersionLines[eid];
        }
        // Legacy glow lines — keep removal in case any older instances linger.
        if (dispersionGlowLines[eid] && dispersionLineLayer) {
            dispersionLineLayer.removeLayer(dispersionGlowLines[eid]);
            delete dispersionGlowLines[eid];
        }
    }

    function _removeSimPickGuide() {
        if (_simPickRangeGuide && typeof map !== 'undefined' && map) {
            try { map.removeLayer(_simPickRangeGuide); } catch (_) {}
        }
        _simPickRangeGuide = null;
        _simPickRangeData = null;
    }

    function _removeWeaponGroup(side, key, gid) {
        const c = _findCountry(side, key);
        if (!c) return;
        const idx = c.weaponGroups.findIndex(g => g.id === gid);
        if (idx >= 0) c.weaponGroups.splice(idx, 1);
        _renderSide(side);
        _renderLaunchSummary();
        _renderConfigPreview();
    }

    function _renderBackendStatus() {
        const el = document.getElementById('news-status');
        if (!el) return;
        // Don't override the "no items" placeholder
        if (newsItems.length === 0) return;
        const ageSec = _lastBackendHeartbeat
            ? Math.round((Date.now() - _lastBackendHeartbeat) / 1000)
            : Infinity;
        let label, color;
        if (_wsAlive) { label = 'En vivo · WebSocket'; color = 'var(--accent2)'; }
        else if (ageSec <= 60) { label = `En vivo · heartbeat ${ageSec}s`; color = 'var(--accent2)'; }
        else if (ageSec <= 300) { label = `Retraso · ${ageSec}s sin heartbeat`; color = '#ffb866'; }
        else if (isFinite(ageSec)) { label = `Backend caído · ${Math.round(ageSec/60)} min sin señal`; color = '#ff6060'; }
        else { label = 'Backend desconocido'; color = 'var(--muted)'; }
        // Don't fight the explicit WS-state strings set by initWebSocket()
        // for the brief window before the first heartbeat poll fires.
        if (newsItems.length > 0) {
            el.textContent = label;
            el.style.color = color;
            el.style.display = '';
        }
    }

    function _renderConfigPreview() {
        try { _renderDefenseRanges(); } catch (_) {}
        try { _renderOffensiveRanges(); } catch (_) {}
    }

    function _renderDefenseGroup(side, c, g) {
        const list = _availableDefenses(c.key);
        const sys = DEFENSE_SYSTEMS[g.system];
        const wrap = document.createElement('div');
        wrap.className = 'sim-group sim-group-defense';
        wrap.dataset.groupId = g.id;

        const optsHtml = list.map(d => {
            const sel = d === g.system ? ' selected' : '';
            return `<option value="${d}"${sel}>${d}</option>`;
        }).join('');

        const armed = _simPicking && _simPicking.groupId === g.id ? ' armed' : '';
        const posTxt = `${g.position.lat.toFixed(2)}, ${g.position.lng.toFixed(2)}`;

        wrap.innerHTML = `
            <div class="sim-group-row sim-group-row-top">
                <select class="sim-defense-sel">${optsHtml}</select>
                <button class="sim-group-remove" title="${t('simRemove')}">×</button>
            </div>
            <div class="sim-group-row">
                <label class="sim-group-qty">
                    <span class="sim-group-qty-lbl">BATT.</span>
                    <input type="number" class="sim-defense-batteries" min="1" max="20" value="${g.batteries}">
                </label>
                <div class="sim-group-target">
                    <span class="sim-group-target-label">${posTxt}</span>
                </div>
            </div>
            <div class="sim-group-row">
                <button class="sim-group-pick${armed}">${armed ? '◉ PICKING — CLICK MAP' : '⌖ SET POSITION ON MAP'}</button>
            </div>
            <div class="sim-group-meta">
                ${sys ? `<span class="sim-group-meta-item">⌑ Pk ${(sys.pk*100).toFixed(0)}%</span>
                <span class="sim-group-meta-item">⌒ Range ${sys.rangeKm||'—'}km</span>
                <span class="sim-group-meta-item">⌬ Mag ${sys.magazine}</span>` : ''}
            </div>
        `;
        wrap.querySelector('.sim-group-remove').addEventListener('click', () => _removeDefenseGroup(side, c.key, g.id));
        wrap.querySelector('.sim-defense-sel').addEventListener('change', (e) => {
            g.system = e.target.value;
            _renderSide(side);
            _renderLaunchSummary();
        });
        wrap.querySelector('.sim-defense-batteries').addEventListener('input', (e) => {
            const v = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
            g.batteries = v;
            _renderLaunchSummary();
        });
        wrap.querySelector('.sim-group-pick').addEventListener('click', () => _armTargetPicker(side, c.key, g.id));
        return wrap;
    }

    function _renderDefenseRanges() {
        if (typeof L === 'undefined' || typeof map === 'undefined' || !map) return;
        if (!_simDefenseRangeLayer) {
            _simDefenseRangeLayer = L.layerGroup().addTo(map);
        }
        _simDefenseRangeLayer.clearLayers();
        // Hide ranges while a sim is running — runtime engine draws its own.
        if (_simState) return;
        const all = [];
        ['A','B'].forEach(side => {
            (_simAlliance.sides[side]?.countries || []).forEach(c => {
                (c.defenseGroups || []).forEach(g => {
                    const sys = DEFENSE_SYSTEMS[g.system];
                    if (!sys || !g.position) return;
                    // countryKey is required for the arsenal-range lookup
                    // below; previous version dropped it on the floor and
                    // silently fell back to DEFENSE_SYSTEMS.rangeKm.
                    all.push({ side, system: g.system, sys, pos: g.position, batteries: g.batteries, countryKey: c.key });
                });
            });
        });
        // Always-mint defense color so users never confuse coverage rings
        // with red impact rings.
        const col = '#22d3a8';
        all.forEach(b => {
            const arsenal = ARSENAL_DATA[b.countryKey];
            // Range lookup: prefer the published value from the country's
            // arsenal entry (so the simulator agrees with what the user sees
            // when browsing weapons). Fall back to DEFENSE_SYSTEMS rangeKm.
            const armEntry = arsenal && Array.isArray(arsenal.weapons)
                ? arsenal.weapons.find(w => w && w.name === b.system && (w.range || 0) > 0)
                : null;
            const rangeKm = (armEntry && armEntry.range) || b.sys.rangeKm || 100;
            // Solid coverage ring (matches arsenal range visualisation)
            L.circle([b.pos.lat, b.pos.lng], {
                radius: rangeKm * 1000,
                color: col, weight: 1.6, opacity: 0.85,
                fillColor: col, fillOpacity: 0.06,
                interactive: false,
            }).addTo(_simDefenseRangeLayer);
            // Origin dot styled like arsenal's `ars-origin-marker` —
            // a small ringed dot with the country flag inside.
            const flag = arsenal && arsenal.flag ? arsenal.flag : '';
            const icon = L.divIcon({
                className: '',
                html: `<div class="sim-defense-dot" style="--col:${col}">
                           <span class="sim-defense-flag">${flag}</span>
                       </div>`,
                iconSize: [18, 18], iconAnchor: [9, 9],
            });
            L.marker([b.pos.lat, b.pos.lng], { icon, interactive: false }).addTo(_simDefenseRangeLayer);
        });
    }

    function _renderLaunchSummary() {
        const el = document.getElementById('sim-launch-summary');
        const btn = document.getElementById('sim-launch');
        if (!el) return;
        const v = _validateConfig();
        const a = _simAlliance.sides.A.countries;
        const b = _simAlliance.sides.B.countries;
        const exchange = _simAlliance.mode === 'exchange';
        const totalLaunches = (exchange ? a.concat(b) : a).reduce((s,c) =>
            s + c.weaponGroups.reduce((ss,g) => ss + g.quantity, 0), 0);
        const totalDefense = (exchange ? a.concat(b) : b).reduce((s,c) =>
            s + c.defenseGroups.reduce((ss,g) => ss + g.batteries, 0), 0);
        if (!v.ok) {
            el.innerHTML = `⚠ ${v.msg}`;
            el.style.color = '#ff8c70';
            if (btn) btn.disabled = true;
        } else {
            const warns = (v.warnings || []).slice(0, 4);
            const warnHTML = warns.length
                ? `<div style="margin-top:6px;color:#ffb866;font-size:0.72rem;line-height:1.35">⚠ ${warns.length} range warning${warns.length===1?'':'s'}:<br>${warns.map(w => '· ' + escapeHtml(w)).join('<br>')}${(v.warnings||[]).length > warns.length ? '<br>· …' : ''}</div>`
                : '';
            el.innerHTML = `<strong>${t('simReady')}</strong> · ${totalLaunches} ${t('simProjectiles')} ${t('simVs')} ${totalDefense} ${t('simBatteries')}${warnHTML}`;
            el.style.color = '';
            if (btn) btn.disabled = false;
        }
    }

    function _renderOffensiveRanges() {
        if (typeof L === 'undefined' || typeof map === 'undefined' || !map) return;
        if (!_simOffensiveRangeLayer) {
            _simOffensiveRangeLayer = L.layerGroup().addTo(map);
        }
        _simOffensiveRangeLayer.clearLayers();
        if (_simState) return;                  // engine owns the map during run
        // Target crosshairs always render — independent of the range-ring toggle.
        try { _renderTargetCrosshairsInto(_simOffensiveRangeLayer); } catch (_) {}
        if (!_simShowOffensiveRanges) return;   // user opted out
        // Only render origins for the side(s) that actually fire in this
        // mode (oneway = A only; exchange = both). Mirrors threat-build.
        const exchange = _simAlliance.mode === 'exchange';
        const sides = exchange ? ['A','B'] : ['A'];
        // Bucket weapon groups by ~1km origin coord so overlapping launch
        // sites collapse to a single chip + circle.
        const SITE_KEY = (lat, lng) => `${lat.toFixed(2)},${lng.toFixed(2)}`;
        const sites = new Map();
        sides.forEach(side => {
            (_simAlliance.sides[side]?.countries || []).forEach(c => {
                const arsenal = ARSENAL_DATA[c.key];
                (c.weaponGroups || []).forEach(g => {
                    if (!g.origin) return;
                    const w = _resolveWeaponFromKey(c.key, g.weaponKey);
                    if (!w) return;
                    const rng = (w.range || 0);
                    if (rng <= 0) return;
                    const k = SITE_KEY(g.origin.lat, g.origin.lng);
                    let s = sites.get(k);
                    if (!s) {
                        s = {
                            lat: g.origin.lat, lng: g.origin.lng,
                            flag: arsenal && arsenal.flag ? arsenal.flag : '',
                            name: arsenal && arsenal.name ? arsenal.name : c.key,
                            weapons: [],
                            maxRangeKm: 0,
                        };
                        sites.set(k, s);
                    }
                    s.weapons.push({
                        name: w.name, qty: g.quantity || 1, rng,
                        mclass: _classifyMissileClass(w),
                        groupId: g.id,
                    });
                    if (rng > s.maxRangeKm) s.maxRangeKm = rng;
                });
            });
        });
        const col = '#ff6b5a';   // soft red — distinct from impact rings
        sites.forEach(s => {
            // Draw a dashed range circle for EACH unique weapon (so a
            // launch site fielding both an SRBM and an MRBM shows both
            // envelopes). Sort small→large so smaller circles paint on top.
            const uniq = new Map();
            s.weapons.forEach(w => {
                const e = uniq.get(w.name) || { name: w.name, rng: w.rng, qty: 0, mclass: w.mclass, groupIds: [] };
                e.qty += w.qty; e.groupIds.push(w.groupId);
                uniq.set(w.name, e);
            });
            const ordered = Array.from(uniq.values()).sort((a, b) => b.rng - a.rng);
            ordered.forEach(w => {
                const ring = L.circle([s.lat, s.lng], {
                    radius: w.rng * 1000,
                    color: col, weight: 1.4, opacity: 0.7,
                    fillColor: col, fillOpacity: 0.04,
                    dashArray: '6 5',
                    interactive: true,
                    bubblingMouseEvents: false,
                });
                ring.addTo(_simOffensiveRangeLayer);
                // Lightweight tooltip on the ring itself
                ring.bindTooltip(
                    `<div style="font-weight:700;color:#ffb6ad">${escapeHtml(w.name)}</div>`
                    + `<div style="opacity:.85">${w.qty}× · ${w.rng} km · ${escapeHtml(w.mclass||'WPN')}</div>`,
                    { direction: 'top', sticky: true, opacity: 0.95, className: 'sim-info-wrap sim-info-mini' }
                );
                // Tag the DOM element with the group ids so the panel
                // hover handler can find + highlight it.
                ring.on('add', () => {
                    const el = ring.getElement && ring.getElement();
                    if (el) el.dataset.groupIds = w.groupIds.join(',');
                });
            });
            // Origin chip — small dot with country flag, styled like
            // the defense origin marker but in red.
            const icon = L.divIcon({
                className: '',
                html: `<div class="sim-offensive-dot" style="--col:${col}">
                           <span class="sim-offensive-flag">${s.flag}</span>
                       </div>`,
                iconSize: [18, 18], iconAnchor: [9, 9],
            });
            L.marker([s.lat, s.lng], { icon, interactive: false }).addTo(_simOffensiveRangeLayer);
        });
    }

    function _renderRunningLegend(threats, batteries) {
        const wrap = document.getElementById('sim-running-legend');
        if (!wrap) return;
        const seen = new Map();
        threats.forEach(t => {
            const key = `${t.attackingSide}:${t.countryKey}`;
            if (seen.has(key)) return;
            seen.set(key, {
                side: t.attackingSide,
                country: t.country,
                color: t.attackingSide === 'A' ? '#ff4530' : '#36aaff',
                role: 'attacker',
            });
        });
        batteries.forEach(b => {
            const key = `${b.defendingSide}:${b.countryKey}:def`;
            if (seen.has(key)) return;
            seen.set(key, {
                side: b.defendingSide,
                country: b.country,
                color: b.defendingSide === 'A' ? '#ff8a55' : '#36ffd6',
                role: 'defender',
            });
        });
        wrap.innerHTML = Array.from(seen.values()).map(e =>
            `<div class="sim-legend-row">
                <span class="sim-legend-dot" style="background:${e.color}"></span>
                <span class="sim-legend-flag">${e.country.flag}</span>
                <span class="sim-legend-name">${e.country.name}</span>
                <span class="sim-legend-role">${e.role.toUpperCase()}</span>
            </div>`
        ).join('') || '<div class="sim-empty-min">No active forces.</div>';
    }

    function _renderSide(side) {
        const container = document.getElementById('sim-side-' + side);
        const summary = document.getElementById('sim-side-' + side + '-summary');
        if (!container) return;
        const countries = _simAlliance.sides[side].countries;
        const { showWeapons, showDefenses } = _sideRoles(side);

        if (summary) {
            const n = countries.length;
            const weapons = countries.reduce((s, c) => s + c.weaponGroups.length, 0);
            const defenses = countries.reduce((s, c) => s + c.defenseGroups.length, 0);
            const parts = [`${n} ${n===1?t('simCountry'):t('simCountries')}`];
            if (showWeapons) parts.push(`${weapons} weapon ${weapons===1?'group':'groups'}`);
            if (showDefenses) parts.push(`${defenses} defense ${defenses===1?'system':'systems'}`);
            summary.textContent = parts.join(' · ');
        }

        if (countries.length === 0) {
            container.innerHTML = `<div class="sim-empty">No countries assigned. Use the selector above to add one.</div>`;
            return;
        }

        container.innerHTML = '';
        countries.forEach(c => {
            const arsenal = ARSENAL_DATA[c.key];
            if (!arsenal) return;
            const card = document.createElement('div');
            card.className = 'sim-country-card';
            card.dataset.country = c.key;
            card.innerHTML = `
                <div class="sim-cc-hdr">
                    <span class="sim-cc-flag">${arsenal.flag}</span>
                    <span class="sim-cc-name">${arsenal.name}</span>
                    <button class="sim-cc-remove" title="${t('simRemoveCountry')}">×</button>
                </div>
                <div class="sim-cc-body"></div>
            `;
            card.querySelector('.sim-cc-remove').addEventListener('click', () => _removeCountry(side, c.key));
            const body = card.querySelector('.sim-cc-body');

            if (showWeapons) {
                const wsec = document.createElement('div');
                wsec.className = 'sim-cc-sec';
                wsec.innerHTML = `
                    <div class="sim-cc-sec-hdr">
                        <span class="sim-cc-sec-tag sim-cc-sec-tag-attack">${t('simOffensiveLoadout')}</span>
                        <button class="sim-cc-add-group sim-cc-add-weapon" data-country="${c.key}" data-side="${side}">${t('simAddWeaponGroup')}</button>
                    </div>
                    <div class="sim-groups sim-groups-weapon"></div>
                `;
                const groupsWrap = wsec.querySelector('.sim-groups-weapon');
                if (c.weaponGroups.length === 0) {
                    groupsWrap.innerHTML = `<div class="sim-empty-min">${t('simNoWeapons')}</div>`;
                } else {
                    c.weaponGroups.forEach(g => groupsWrap.appendChild(_renderWeaponGroup(side, c, g)));
                }
                wsec.querySelector('.sim-cc-add-weapon').addEventListener('click', () => _addWeaponGroup(side, c.key));
                body.appendChild(wsec);
            }

            if (showDefenses) {
                const dsec = document.createElement('div');
                dsec.className = 'sim-cc-sec';
                dsec.innerHTML = `
                    <div class="sim-cc-sec-hdr">
                        <span class="sim-cc-sec-tag sim-cc-sec-tag-defend">${t('simDefensiveShield')}</span>
                        <button class="sim-cc-add-group sim-cc-add-defense" data-country="${c.key}" data-side="${side}">${t('simAddDefenseBattery')}</button>
                    </div>
                    <div class="sim-groups sim-groups-defense"></div>
                `;
                const groupsWrap = dsec.querySelector('.sim-groups-defense');
                if (c.defenseGroups.length === 0) {
                    groupsWrap.innerHTML = `<div class="sim-empty-min">${t('simNoDefenses')}</div>`;
                } else {
                    c.defenseGroups.forEach(g => groupsWrap.appendChild(_renderDefenseGroup(side, c, g)));
                }
                dsec.querySelector('.sim-cc-add-defense').addEventListener('click', () => _addDefenseGroup(side, c.key));
                body.appendChild(dsec);
            }

            container.appendChild(card);
        });
    }

    function _renderTargetCrosshairsInto(layer) {
        if (!layer) return;
        const exchange = _simAlliance.mode === 'exchange';
        const sides = exchange ? ['A', 'B'] : ['A'];
        sides.forEach(side => {
            (_simAlliance.sides[side]?.countries || []).forEach(c => {
                const accent = COUNTRY_ACCENT[c.key] || '#ff6b5a';
                (c.weaponGroups || []).forEach(g => {
                    if (!g.target || !g.origin) return;
                    const w = _resolveWeaponFromKey(c.key, g.weaponKey);
                    if (!w || !(w.range > 0)) return;
                    const cross = _buildTargetCrosshair({
                        lat: g.target.lat,
                        lng: g.target.lng,
                        accent,
                        origin: g.origin,
                        rangeKm: w.range,
                        onDrop: (la, ln) => {
                            g.target.lat = la;
                            g.target.lng = ln;
                            try { _renderLaunchSummary(); } catch (_) {}
                        },
                    });
                    cross.addTo(layer);
                });
            });
        });
    }

    function _renderWeaponGroup(side, c, g) {
        const arsenal = ARSENAL_DATA[c.key];
        const offensive = _offensiveWeapons(c.key);
        const weapon = _resolveWeaponFromKey(c.key, g.weaponKey);
        const wrap = document.createElement('div');
        wrap.className = 'sim-group';
        wrap.dataset.groupId = g.id;

        const optsHtml = offensive.map(o => {
            const val = `${o.kind}:${o.idx}`;
            const tag = o.kind === 'drone' ? 'DRONE' : (o.weapon.mtype || 'BAL').toUpperCase().slice(0,4);
            const label = `${o.weapon.name} — ${o.weapon.range}km — ${tag}`;
            const sel = val === g.weaponKey ? ' selected' : '';
            return `<option value="${val}"${sel}>${label}</option>`;
        }).join('');

        const targetTxt = g.target
            ? `${g.target.name || ''} ${g.target.lat.toFixed(3)}, ${g.target.lng.toFixed(3)}`
            : 'No target set';
        const armed = _simPicking && _simPicking.groupId === g.id ? ' armed' : '';

        const tgtCls = g.target ? 'sim-group-tgt-info set' : 'sim-group-tgt-info';
        // Weapon-class color swatch — same color used for trajectory line.
        const mclass = weapon ? _classifyMissileClass(weapon) : '';
        const swatchCol = _weaponHeadColor(mclass);
        // Vertical color stripe on the group container (CSS hook)
        wrap.style.setProperty('--weapon-col', swatchCol);
        wrap.classList.add('has-weapon-col');
        wrap.innerHTML = `
            <div class="sim-group-row sim-group-row-top">
                <span class="sim-weapon-swatch" style="background:${swatchCol}" title="${mclass || 'weapon'} \u2014 trajectory color"></span>
                <select class="sim-group-weapon">${optsHtml}</select>
                <button class="sim-group-rm" title="${t('simRemove')}">×</button>
            </div>
            <div class="sim-group-row">
                <input type="number" class="sim-group-qty" min="1" max="200" value="${g.quantity}" title="Quantity">
                <button class="sim-group-pick${armed}">${armed ? t('simPicking') : t('simSetTargetBtn')}</button>
            </div>
            <div class="${tgtCls}">${targetTxt}</div>
            ${weapon ? `<div class="sim-group-meta">
                <span class="sim-class-tag" style="--swatch:${swatchCol}">${mclass || 'WPN'}</span>
                <span>⌜ ${weapon.type || ''}</span>
                <span>⊗ ${weapon.warhead || '—'}</span>
                <span>⌃ ${weapon.speed || '—'}</span>
            </div>` : ''}
        `;
        // Wire interactions
        wrap.querySelector('.sim-group-rm').addEventListener('click', () => _removeWeaponGroup(side, c.key, g.id));
        wrap.querySelector('.sim-group-weapon').addEventListener('change', (e) => {
            g.weaponKey = e.target.value;
            _renderSide(side);
            _renderLaunchSummary();
        });
        wrap.querySelector('.sim-group-qty').addEventListener('input', (e) => {
            const v = Math.max(1, Math.min(200, parseInt(e.target.value) || 1));
            g.quantity = v;
            _renderLaunchSummary();
        });
        wrap.querySelector('.sim-group-pick').addEventListener('click', () => _armTargetPicker(side, c.key, g.id));
        return wrap;
    }

    function _resetAlliance() {
        // Hard reset: wipe alliance config AND every map artifact (impact
        // rings, defense coverage, leftover trails). Configuration form
        // returns to empty default.
        _simAlliance.mode = 'oneway';
        _simAlliance.sides.A.countries.length = 0;
        _simAlliance.sides.B.countries.length = 0;
        document.querySelectorAll('.sim-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === 'oneway'));
        const desc = document.getElementById('sim-mode-desc');
        if (desc) { desc.setAttribute('data-i18n', 'simModeOneway'); desc.textContent = t('simModeOneway'); }
        // Tear down ALL map state — running sim, residual impact layer, and
        // persistent defense-range layer.
        if (_simState) _abortSimulation();
        if (_simResidualLayer && typeof map !== 'undefined' && map) {
            try { map.removeLayer(_simResidualLayer); } catch(_) {}
            _simResidualLayer = null;
        }
        if (_simDefenseRangeLayer && typeof map !== 'undefined' && map) {
            try { map.removeLayer(_simDefenseRangeLayer); } catch(_) {}
            _simDefenseRangeLayer = null;
        }
        _lastResultsHTML = '';
        const lastRow = document.getElementById('sim-last-results-row');
        if (lastRow) lastRow.style.display = 'none';
        _refreshAddSelectors();
        _renderSide('A');
        _renderSide('B');
        _renderLaunchSummary();
        if (typeof _setSimStep === 'function') _setSimStep('config');
    }

    function _resolveInterceptions(quantity, weapon, activeDefenses) {
        const mtype = _classifyMissileType(weapon);
        const vsKey = mtype === 'ballistic' ? 'vsBallistic' : 'vsCruise';

        const magazines = {};
        activeDefenses.forEach(d => {
            magazines[d] = (DEFENSE_SYSTEMS[d]?.magazine || 0);
        });

        const results = [];
        for (let i = 0; i < quantity; i++) {
            let intercepted = false;
            let interceptedBy = null;
            for (const d of activeDefenses) {
                if (magazines[d] <= 0) continue;
                const sys = DEFENSE_SYSTEMS[d];
                if (!sys) continue;
                magazines[d] -= 1;
                const pk = sys[vsKey] || sys.pk;
                if (Math.random() < pk) {
                    intercepted = true;
                    interceptedBy = d;
                    break;
                }
            }
            results.push({ idx: i, intercepted, interceptedBy });
        }

        const usage = {};
        activeDefenses.forEach(d => {
            usage[d] = (DEFENSE_SYSTEMS[d].magazine || 0) - magazines[d];
        });

        return { results, usage };
    }

    function _resolveWeaponFromKey(countryKey, weaponKey) {
        // weaponKey format: "missile:3" / "drone:0"
        if (!weaponKey) return null;
        const [kind, idxStr] = weaponKey.split(':');
        const idx = parseInt(idxStr);
        const arsenal = ARSENAL_DATA[countryKey];
        if (!arsenal) return null;
        return (arsenal[kind] || [])[idx] || null;
    }

    function _restackRangeTags() {
        clearTimeout(_restackTimer);
        _restackTimer = setTimeout(() => {
            if (!map || arsenalRanges.length === 0) return;
            const TAG_H = 17;     // height of one tag row + spacing
            const COLLIDE_PX = 26;
            // Project every range to container pixels in current viewport.
            const points = arsenalRanges.map(r => {
                const p = map.latLngToContainerPoint([r.lat, r.lng]);
                return { range: r, x: p.x, y: p.y };
            });
            // Bucket near-coincident origins: sort by x then y so neighbouring
            // markers cluster naturally; collision check uses Euclidean distance.
            points.sort((a, b) => (a.x - b.x) || (a.y - b.y));
            const placed = [];
            points.forEach(p => {
                let stack = 0;
                for (const other of placed) {
                    const dx = p.x - other.x, dy = p.y - other.y;
                    if (Math.hypot(dx, dy) < COLLIDE_PX) {
                        stack = Math.max(stack, other.stack + 1);
                    }
                }
                p.stack = stack;
                placed.push(p);
                const r = p.range;
                if (!r.marker) return;
                const el = r.marker.getElement && r.marker.getElement();
                if (!el) return;
                const tag = el.querySelector('.ars-origin-tag');
                if (tag) {
                    tag.style.transform = `translateX(-50%) translateY(${stack * TAG_H}px)`;
                    tag.style.zIndex = String(100 - stack);
                }
            });
        }, 30);
    }

    async function _runPlaceSearch() {
        const input = document.getElementById('sim-pick-search');
        const list = document.getElementById('sim-pick-search-results');
        if (!input || !list) return;
        const q = input.value.trim();
        if (!q) { list.style.display = 'none'; list.innerHTML = ''; return; }
        // Allow direct "lat, lng" entry as a shortcut.
        const directMatch = q.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)\s*$/);
        if (directMatch) {
            const lat = parseFloat(directMatch[1]);
            const lng = parseFloat(directMatch[2]);
            if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
                _applyTargetPick(lat, lng, `${lat.toFixed(3)}, ${lng.toFixed(3)}`);
                input.value = '';
                return;
            }
        }
        if (_placeSearchAbort) { try { _placeSearchAbort.abort(); } catch (_) {} }
        _placeSearchAbort = new AbortController();
        list.innerHTML = '<div class="sim-pick-result-loading">Searching…</div>';
        list.style.display = 'block';
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&q=${encodeURIComponent(q)}`;
            const resp = await fetch(url, {
                signal: _placeSearchAbort.signal,
                headers: { 'Accept-Language': 'en' },
            });
            if (!resp.ok) throw new Error('search failed');
            const data = await resp.json();
            if (!Array.isArray(data) || data.length === 0) {
                list.innerHTML = '<div class="sim-pick-result-empty">No results.</div>';
                return;
            }
            list.innerHTML = '';
            data.forEach(r => {
                const item = document.createElement('div');
                item.className = 'sim-pick-result';
                const name = r.display_name || r.name || `${r.lat}, ${r.lon}`;
                item.innerHTML = `<span class="sim-pick-result-name">${name}</span><span class="sim-pick-result-coords">${parseFloat(r.lat).toFixed(3)}, ${parseFloat(r.lon).toFixed(3)}</span>`;
                item.addEventListener('click', () => {
                    const lat = parseFloat(r.lat);
                    const lng = parseFloat(r.lon);
                    if (!isFinite(lat) || !isFinite(lng)) return;
                    const short = (r.display_name || '').split(',').slice(0, 2).join(',').trim() || 'Searched location';
                    _applyTargetPick(lat, lng, short);
                    input.value = '';
                    list.style.display = 'none';
                });
                list.appendChild(item);
            });
        } catch (err) {
            if (err && err.name === 'AbortError') return;
            list.innerHTML = '<div class="sim-pick-result-empty">Search failed. Check your network.</div>';
        }
    }

    function _scheduleClusterRebuild() {
        if (_clusterRebuildScheduled) return;
        _clusterRebuildScheduled = true;
        // setTimeout, not requestAnimationFrame: rAF is paused while the tab
        // isn't painting (e.g. the headless preview), which would stall the
        // cluster rebuild entirely. A 0ms debounce still coalesces bursts.
        setTimeout(() => {
            _clusterRebuildScheduled = false;
            _rebuildClusters();
        }, 0);
    }

    let _zoomFilterScheduled = false;
    function _scheduleEventZoomFilter() {
        if (_zoomFilterScheduled) return;
        _zoomFilterScheduled = true;
        // Coalesce the per-marker filter so a burst of upserts (e.g. the initial
        // news.json load placing dozens of events) runs it once, not N times.
        setTimeout(() => {
            _zoomFilterScheduled = false;
            try { applyEventZoomFilter(); } catch (_) {}
        }, 0);
    }

    function _seededRand(eid, salt) {
        const s = String(eid) + '|' + salt;
        let h = 2166136261 >>> 0;
        for (let i = 0; i < s.length; i++) {
            h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
        }
        return (h & 0xffffff) / 0xffffff;   // 0..1
    }

    function _setSimStep(step) {
        _simStep = step;
        ['config', 'running', 'results'].forEach(s => {
            const el = document.getElementById('sim-step-' + s);
            if (el) el.style.display = (s === step) ? 'block' : 'none';
        });
        document.querySelectorAll('#sim-stepnav .sim-step-pill').forEach(pill => {
            const isActive = pill.dataset.step === step;
            pill.classList.toggle('active', isActive);
            const isReachable =
                pill.dataset.step === 'config' ||
                (pill.dataset.step === 'running' && _simState) ||
                (pill.dataset.step === 'results' && _lastResultsHTML);
            pill.classList.toggle('disabled', !isReachable);
        });
        // Reflect in body for any global styling (e.g. hide scale switcher).
        document.body.classList.toggle('sim-step-running', step === 'running');
        document.body.classList.toggle('sim-step-results', step === 'results');
        // Show "View Last Results" pill in config when we have cached results.
        const lastRow = document.getElementById('sim-last-results-row');
        if (lastRow) lastRow.style.display = (_lastResultsHTML && step === 'config') ? 'flex' : 'none';
    }

    function _showResults() {
        if (!_simState) return;
        const { stats, threats, batteries } = _simState;
        const body = document.getElementById('sim-results-body');
        if (!body) return;

        const intPct = stats.fired ? (stats.intercepted / stats.fired * 100) : 0;
        const impPct = stats.fired ? (stats.impacted / stats.fired * 100) : 0;

        // Aggregate per-target outcomes
        const targets = new Map();
        threats.forEach(t => {
            const key = `${t.target.lat.toFixed(3)},${t.target.lng.toFixed(3)}:${t.attackingSide}`;
            if (!targets.has(key)) targets.set(key, {
                attackingSide: t.attackingSide,
                target: t.target,
                impacts: 0,
                intercepts: 0,
                weapons: new Map(),
                blastMaxKm: 0,
            });
            const tg = targets.get(key);
            if (t.intercepted) tg.intercepts += 1;
            else { tg.impacts += 1; tg.blastMaxKm = Math.max(tg.blastMaxKm, t.blastKm); }
            const wKey = `${t.country.name}|${t.weapon.name}`;
            tg.weapons.set(wKey, (tg.weapons.get(wKey) || 0) + 1);
        });

        // Aggregate per-country offensive performance
        const countryAgg = {};
        threats.forEach(t => {
            const k = `${t.attackingSide}:${t.countryKey}`;
            if (!countryAgg[k]) countryAgg[k] = {
                side: t.attackingSide, country: t.country, fired: 0, intercepted: 0, impacted: 0,
            };
            countryAgg[k].fired += 1;
            if (t.intercepted) countryAgg[k].intercepted += 1;
            else countryAgg[k].impacted += 1;
        });

        // Aggregate per-defense-system performance
        const sysAgg = {};
        batteries.forEach(b => {
            const k = `${b.defendingSide}:${b.countryKey}:${b.system}`;
            if (!sysAgg[k]) sysAgg[k] = {
                side: b.defendingSide, country: b.country, system: b.system, sys: b.sys,
                batteries: 0, shots: 0, kills: 0,
            };
            sysAgg[k].batteries += 1;
            sysAgg[k].shots += b.shots;
            sysAgg[k].kills += b.kills;
        });

        // Casualties: 4500 ppl/km², 18% lethality factor. Scaled per impact target.
        const urbanDensity = 4500;
        let totalCasualties = 0;
        let totalArea = 0;
        targets.forEach(tg => {
            const a = tg.impacts * Math.PI * Math.pow(tg.blastMaxKm || 0.1, 2);
            totalArea += a;
            totalCasualties += Math.round(a * urbanDensity * 0.18);
        });

        const dmg = _damageCategory(stats.impacted, totalArea);

        // ── Build HTML ──
        const headerStats = `
            <div class="sim-r-section">
                <div class="sim-r-section-hdr">
                    <span class="sim-r-num">01</span>
                    <span class="sim-r-title">STRIKE OUTCOME</span>
                </div>
                <div class="sim-r-grid">
                    <div class="sim-r-cell"><div class="sim-r-cell-lbl">PROJECTILES LAUNCHED</div><div class="sim-r-cell-val">${stats.fired}</div></div>
                    <div class="sim-r-cell sim-r-cell-good"><div class="sim-r-cell-lbl">INTERCEPTED</div><div class="sim-r-cell-val">${stats.intercepted} <span class="sim-r-cell-pct">(${intPct.toFixed(1)}%)</span></div></div>
                    <div class="sim-r-cell sim-r-cell-bad"><div class="sim-r-cell-lbl">IMPACTS</div><div class="sim-r-cell-val">${stats.impacted} <span class="sim-r-cell-pct">(${impPct.toFixed(1)}%)</span></div></div>
                    <div class="sim-r-cell"><div class="sim-r-cell-lbl">EST. CASUALTIES</div><div class="sim-r-cell-val">${totalCasualties.toLocaleString()}</div></div>
                    <div class="sim-r-cell"><div class="sim-r-cell-lbl">DAMAGE AREA</div><div class="sim-r-cell-val">${totalArea.toFixed(1)} km²</div></div>
                    <div class="sim-r-cell sim-r-cell-${dmg.cls}"><div class="sim-r-cell-lbl">VERDICT</div><div class="sim-r-cell-val">${dmg.label}</div></div>
                </div>
            </div>
        `;

        // Per-country breakdown
        const cAgg = Object.values(countryAgg);
        const countryHtml = cAgg.length === 0 ? '' : `
            <div class="sim-r-section">
                <div class="sim-r-section-hdr">
                    <span class="sim-r-num">02</span>
                    <span class="sim-r-title">OFFENSIVE PERFORMANCE — BY COUNTRY</span>
                </div>
                <div class="sim-r-table">
                    <div class="sim-r-thead">
                        <span>SIDE</span><span>COUNTRY</span><span>LAUNCHED</span><span>INTERCEPTED</span><span>IMPACTS</span><span>SUCCESS</span>
                    </div>
                    ${cAgg.map(c => {
                        const succ = c.fired ? (c.impacted / c.fired * 100) : 0;
                        return `<div class="sim-r-row">
                            <span class="sim-r-side sim-r-side-${c.side}">${c.side}</span>
                            <span>${c.country.flag} ${c.country.name}</span>
                            <span>${c.fired}</span>
                            <span>${c.intercepted}</span>
                            <span>${c.impacted}</span>
                            <span>${succ.toFixed(1)}%</span>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `;

        // Per-defense-system breakdown
        const sAgg = Object.values(sysAgg);
        const defHtml = sAgg.length === 0 ? '' : `
            <div class="sim-r-section">
                <div class="sim-r-section-hdr">
                    <span class="sim-r-num">03</span>
                    <span class="sim-r-title">DEFENSIVE PERFORMANCE — BY SYSTEM</span>
                </div>
                <div class="sim-r-table">
                    <div class="sim-r-thead">
                        <span>SIDE</span><span>COUNTRY</span><span>SYSTEM</span><span>BATT.</span><span>SHOTS</span><span>KILLS</span><span>EFFECTIVENESS</span>
                    </div>
                    ${sAgg.map(s => {
                        const eff = s.shots ? (s.kills / s.shots * 100) : 0;
                        return `<div class="sim-r-row">
                            <span class="sim-r-side sim-r-side-${s.side}">${s.side}</span>
                            <span>${s.country.flag} ${s.country.name}</span>
                            <span class="sim-r-sysname">${s.system}</span>
                            <span>${s.batteries}</span>
                            <span>${s.shots}</span>
                            <span>${s.kills}</span>
                            <span>${eff.toFixed(1)}%</span>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `;

        // Per-target breakdown
        const tArr = Array.from(targets.values());
        const tgtHtml = tArr.length === 0 ? '' : `
            <div class="sim-r-section">
                <div class="sim-r-section-hdr">
                    <span class="sim-r-num">04</span>
                    <span class="sim-r-title">PER-TARGET ANALYSIS</span>
                </div>
                <div class="sim-r-targets">
                    ${tArr.map(tg => {
                        const wTxt = Array.from(tg.weapons.entries()).map(([k,v]) => `${k.replace('|',' / ')} × ${v}`).join('<br>');
                        const status = tg.impacts > 0 ? 'STRUCK' : 'PROTECTED';
                        const cls = tg.impacts > 0 ? 'sim-r-target-hit' : 'sim-r-target-safe';
                        const cas = Math.round(tg.impacts * Math.PI * Math.pow(tg.blastMaxKm || 0.1, 2) * urbanDensity * 0.18);
                        return `<div class="sim-r-target ${cls}">
                            <div class="sim-r-target-hdr">
                                <span class="sim-r-target-status">${status}</span>
                                <span class="sim-r-target-coords">${tg.target.lat.toFixed(3)}, ${tg.target.lng.toFixed(3)}</span>
                            </div>
                            <div class="sim-r-target-stats">
                                <div><span class="sim-r-tlbl">IMPACTS</span><span class="sim-r-tval">${tg.impacts}</span></div>
                                <div><span class="sim-r-tlbl">INTERCEPTED</span><span class="sim-r-tval">${tg.intercepts}</span></div>
                                <div><span class="sim-r-tlbl">BLAST RAD.</span><span class="sim-r-tval">${tg.blastMaxKm.toFixed(2)} km</span></div>
                                <div><span class="sim-r-tlbl">CASUALTIES</span><span class="sim-r-tval">${cas.toLocaleString()}</span></div>
                            </div>
                            <div class="sim-r-target-weapons">${wTxt}</div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        `;

        // Strategic verdict
        const verdict = `
            <div class="sim-r-section">
                <div class="sim-r-section-hdr">
                    <span class="sim-r-num">05</span>
                    <span class="sim-r-title">STRATEGIC ASSESSMENT</span>
                </div>
                <div class="sim-r-verdict ${dmg.cls}">
                    ${_verdictText(stats)}
                </div>
            </div>
        `;

        body.innerHTML = headerStats + countryHtml + defHtml + tgtHtml + verdict;
        _lastResultsHTML = body.innerHTML;
        _setSimStep('results');
        const panel = document.getElementById('arsenal-panel');
        if (panel) { panel.classList.remove('sim-hidden'); panel.classList.add('open'); document.body.classList.add('arsenal-open'); }
    }

    function _showSimPickWarning(msg) {
        let el = document.getElementById('sim-pick-warning');
        if (!el) {
            el = document.createElement('div');
            el.id = 'sim-pick-warning';
            el.className = 'sim-pick-warning';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.classList.add('show');
        if (_simPickWarnTimer) clearTimeout(_simPickWarnTimer);
        _simPickWarnTimer = setTimeout(() => el.classList.remove('show'), 2800);
    }

    function _sideRoles(side) {
        const exchange = _simAlliance.mode === 'exchange';
        const showWeapons = exchange || side === 'A';
        const showDefenses = exchange || side === 'B';
        return { showWeapons, showDefenses };
    }

    function _simPane() {
        if (!map.getPane('simPane')) {
            const p = map.createPane('simPane');
            p.style.zIndex = 700;
            p.style.pointerEvents = 'none';
        }
        if (!map.getPane('simLabelPane')) {
            const p2 = map.createPane('simLabelPane');
            p2.style.zIndex = 720;
            p2.style.pointerEvents = 'none';
        }
        return 'simPane';
    }

    function _simTick() {
        if (!_simState) return;
        const now = performance.now();
        let alive = false;

        // HUD time
        const elapsed = (now - _simState.startTime) / 1000;
        const hudEl = document.getElementById('sim-hud-elapsed');
        if (hudEl) hudEl.textContent = elapsed.toFixed(1) + 's';

        _simState.missiles.forEach(m => {
            if (!m.alive) return;
            alive = true;
            const e = now - m.startTime;
            const tFull = Math.min(1, e / m.flightTime);

            if (m.t.intercepted && !m.interceptorFired && tFull >= m.interceptT * 0.85) {
                m.interceptorFired = true;
                _spawnInterceptor(m);
            }

            const tMissile = m.t.intercepted ? Math.min(tFull, m.interceptT) : tFull;
            // Trail and head share the same precomputed path → never desync.
            // Trail = path[0..currentIdx]; head = exact position at currentIdx.
            const path = m.path;
            const f = Math.max(0, Math.min(1, tMissile)) * (path.length - 1);
            const i = Math.floor(f);
            const pos = _interpolateArc(m, tMissile);
            m.head.setLatLng(pos);
            // Build the visible portion: full integer path slice up to i, then
            // the interpolated tip — guarantees the line lands exactly under
            // the head dot.
            const visible = path.slice(0, i + 1);
            visible.push(pos);
            m.trail.setLatLngs(visible);

            if (m.t.intercepted && tFull >= m.interceptT) {
                _explodeIntercept(m, pos);
                m.alive = false;
                _simState.stats.intercepted += 1;
                _updateHud();
            } else if (!m.t.intercepted && tFull >= 1) {
                if (m.t.outOfRange) {
                    // Out-of-range projectile fizzles short of target — no
                    // blast, and trail+head are scrubbed (no debris on map).
                    _cleanupMissile(m);
                    m.alive = false;
                    _simState.stats.fizzled = (_simState.stats.fizzled || 0) + 1;
                } else {
                    _explodeImpact(m);
                    m.alive = false;
                    _simState.stats.impacted += 1;
                }
                _updateHud();
            }
        });

        // Continue the loop while:
        //   1) any missile is still alive in flight, OR
        //   2) we haven't reached the expected end time (missiles may still
        //      be queued to spawn), OR
        //   3) the resolved count hasn't reached the fired count yet.
        const expectedRun = _simState.expectedEnd ? now < _simState.expectedEnd : false;
        const resolved = _simState.stats.intercepted + _simState.stats.impacted + (_simState.stats.fizzled || 0);
        const stillToResolve = resolved < _simState.stats.fired;

        if (alive || expectedRun || stillToResolve) {
            // RAF when visible, setTimeout fallback when tab is hidden so
            // the simulation engine still resolves while user is away.
            if (document.hidden) {
                _simRAF = setTimeout(_simTick, 33);
            } else {
                _simRAF = requestAnimationFrame(_simTick);
            }
        } else {
            // Wait briefly so explosion ring animations can finish, then show results
            setTimeout(() => _finishSimulation(), 1400);
            _simRAF = null;
        }
    }

    function _spatialIndexAdd(eventId, lat, lng) {
        _spatialIndex.set(eventId, { lat, lng });
    }

    function _spatialIndexRemove(eventId) {
        _spatialIndex.delete(eventId);
        _clusteredEventIds.delete(eventId);
    }

    function _spawnInterceptor(m) {
        if (!_simState) return;
        const pane = _simState.pane;
        const headPos = m.head.getLatLng();
        // Pick the actual intercepting battery if available
        const battery = m.t.interceptedBy;
        const startPt = battery
            ? L.latLng(battery.position.lat, battery.position.lng)
            : L.latLng(headPos.lat - 0.4, headPos.lng - 0.3);

        const intColor = '#36ffd6';
        const intLine = L.polyline([startPt, headPos], {
            color: intColor, weight: 2.4, opacity: 0.95, pane,
            className: 'sim-interceptor-line', dashArray: '5,4',
        }).addTo(_simState.layer);

        // Animate growth for ~600ms toward the missile head
        const t0 = performance.now();
        const dur = 700;
        const grow = () => {
            if (!_simState || !_simState.layer.hasLayer(intLine)) return;
            const elapsed = performance.now() - t0;
            const tt = Math.min(1, elapsed / dur);
            const cur = m.head.getLatLng();
            const lat = startPt.lat + (cur.lat - startPt.lat) * tt;
            const lng = startPt.lng + (cur.lng - startPt.lng) * tt;
            intLine.setLatLngs([startPt, [lat, lng]]);
            if (tt < 1) requestAnimationFrame(grow);
        };
        grow();

        setTimeout(() => {
            if (_simState && _simState.layer.hasLayer(intLine)) _simState.layer.removeLayer(intLine);
        }, 1500);
    }

    function _spawnMissile(t) {
        if (!_simState) return;
        const layer = _simState.layer;
        const pane = _simState.pane;
        const start = L.latLng(t.origin.lat, t.origin.lng);
        const end = L.latLng(t.target.lat, t.target.lng);

        const distKm = _haversineKm(t.origin, t.target);
        // Flight time scales with distance and missile class.
        let flightTime = t.mtype === 'ballistic'
            ? Math.max(2200, Math.min(8000, 2000 + distKm * 0.8))
            : t.mtype === 'cruise'
            ? Math.max(3000, Math.min(10000, 2500 + distKm * 1.6))
            : Math.max(4000, Math.min(11000, 3500 + distKm * 2.4)); // drone
        // Hypersonic boost
        if ((t.weapon.mtype||'').toLowerCase() === 'hypersonic') flightTime *= 0.55;

        // Two-dimension color system:
        //   trail color = country of origin (deterministic per country)
        //   head color  = weapon class (ICBM red, cruise cyan, drone green, …)
        // The faint side-tint (red attacker / blue defender) is preserved as a
        // 1px halo via CSS so analysts can still read sides at a glance.
        const trailColor = _countryColor(t.countryKey);
        const headColor = _weaponHeadColor(t.mclass);

        const trail = L.polyline([start], {
            color: trailColor, weight: 2.6, opacity: 0.9, pane,
            className: 'sim-missile-trail',
        }).addTo(layer);

        const headIcon = L.divIcon({
            className: '',
            html: `<div class="sim-missile-head" style="--col:${headColor};--trail:${trailColor}"></div>`,
            iconSize: [14, 14], iconAnchor: [7, 7],
        });
        const head = L.marker(start, { icon: headIcon, pane, interactive: false }).addTo(layer);

        // Launch flash at origin
        const launchFlash = L.divIcon({
            className: '',
            html: `<div class="sim-launch-pulse" style="--col:${trailColor}"></div>`,
            iconSize: [50, 50], iconAnchor: [25, 25],
        });
        const lm = L.marker(start, { icon: launchFlash, pane, interactive: false }).addTo(layer);
        setTimeout(() => { if (_simState && _simState.layer.hasLayer(lm)) _simState.layer.removeLayer(lm); }, 1200);

        // Origin label (fades after ~3s)
        const originLabel = L.divIcon({
            className: '',
            html: `<div class="sim-origin-label" style="--col:${trailColor}">
                       <span class="sim-ol-flag">${t.country.flag}</span>
                       <span class="sim-ol-text">${t.country.name} — ${t.weapon.name}</span>
                   </div>`,
            iconSize: [220, 24], iconAnchor: [110, 38],
        });
        const ol = L.marker(start, { icon: originLabel, pane: 'simLabelPane', interactive: false }).addTo(layer);
        setTimeout(() => { if (_simState && _simState.layer.hasLayer(ol)) _simState.layer.removeLayer(ol); }, 3200);

        const interceptT = t.intercepted ? (0.55 + Math.random() * 0.3) : 1.0;

        const m = {
            t, start, end,
            trail, head,
            startTime: performance.now(),
            flightTime, mtype: t.mtype,
            interceptT, alive: true,
            interceptorFired: false,
            blastKm: t.blastKm,
            distKm,
            arcAmplitude: t.mtype === 'ballistic' ? 0.35 : t.mtype === 'cruise' ? 0.08 : 0.04,
            color: trailColor,
            path: [],
        };
        const ARC_SEGS = 64;
        for (let s = 0; s <= ARC_SEGS; s++) {
            m.path.push(_interpolateArc(m, s / ARC_SEGS));
        }
        _simState.missiles.push(m);
    }

    // Pack N icons onto concentric rings sized to the current icon diameter so
    // nothing overlaps, even at 50+. Returns pixel offsets from the centre.
    function _spiderRingOffsets(n) {
        const iconPx = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--event-size')
        ) || 36;
        const gap = iconPx + 10;
        const offsets = [];
        let placed = 0, ring = 0;
        while (placed < n) {
            ring++;
            const radius = ring * gap * 0.92 + iconPx * 0.5;
            const slots = Math.min(n - placed, Math.max(1, Math.floor((2 * Math.PI * radius) / gap)));
            const phase = (ring % 2) ? 0 : Math.PI / slots;
            for (let s = 0; s < slots; s++) {
                const ang = (2 * Math.PI * s / slots) - Math.PI / 2 + phase;
                offsets.push({ dx: Math.cos(ang) * radius, dy: Math.sin(ang) * radius });
                placed++;
            }
        }
        return offsets;
    }

    function _spiderfyDeploy(centerLL, ids, chip) {
        const liveIds = (ids || []).filter(id => eventMarkers[id] && !_deployedIds.has(id));
        if (liveIds.length < 2 || !map) return;

        const fan = {
            id: ++_fanSeq,
            center: L.latLng(centerLL),
            deployZoom: map.getZoom(),
            ids: liveIds,
            beacon: null,
            legs: [],
            footprintPx: 0,
        };
        liveIds.forEach(id => _deployedIds.add(id));
        _fans.set(fan.id, fan);

        // Hide the fanned chip immediately; the rebuild (which now excludes
        // deployed ids) drops it and re-clusters everything else.
        const chipEl = chip && chip.getElement && chip.getElement();
        if (chipEl) chipEl.style.visibility = 'hidden';

        const z = map.getZoom();
        const centerPt = map.project(fan.center, z);
        const offsets = _spiderRingOffsets(liveIds.length);
        const accent = _dominantAccent(liveIds);
        const iconPx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--event-size')) || 34;
        let maxR = 0;

        // Central beacon — clicking it collapses THIS fan only.
        fan.beacon = L.marker(fan.center, {
            pane: 'clusterPane',
            icon: L.divIcon({
                className: 'ev-beacon-wrap',
                html: '<div class="ev-beacon" style="--accent:' + accent + '"></div>',
                iconSize: [18, 18], iconAnchor: [9, 9],
            }),
            interactive: true, keyboard: false, zIndexOffset: 3000,
        }).addTo(map);
        fan.beacon.on('click', (e) => { L.DomEvent.stop(e); _collapseFan(fan); });

        const targets = [];
        liveIds.forEach((id, i) => {
            const m = eventMarkers[id];
            const off = offsets[i] || { dx: 0, dy: 0 };
            maxR = Math.max(maxR, Math.hypot(off.dx, off.dy));
            const ll = map.unproject(L.point(centerPt.x + off.dx, centerPt.y + off.dy), z);
            targets.push({ m, ll });
            const el = m.getElement && m.getElement();
            if (el) {
                el.style.visibility = '';
                el.style.display = '';
                // The one-shot entrance animation can leave .ev-pin at opacity 0
                // for icons hidden in a cluster when it "ran"; clear it.
                el.classList.remove('ev-fade-in');
            }
            m.setZIndexOffset(2000);
            m.setLatLng(fan.center);   // start collapsed at the centre
            const leg = L.polyline([fan.center, ll], {
                pane: 'spiderLegPane', className: 'ev-leg',
                color: accent, weight: 1.5, opacity: 0.5,
                dashArray: '5 5', interactive: false,
                lineCap: 'round', lineJoin: 'round',
            }).addTo(map);
            fan.legs.push(leg);
        });
        fan.footprintPx = maxR + iconPx;

        // Slide icons out from the centre (GPU transform transition; legs fade in).
        const pane = _spiderAnimBegin();
        if (pane) {
            void pane.offsetWidth;            // commit the centre positions first
            targets.forEach(t => t.m.setLatLng(t.ll));
            setTimeout(_spiderAnimEnd, 340);
        } else {
            targets.forEach(t => t.m.setLatLng(t.ll));
        }

        // Drop the fanned chip + hide any singletons the fan now covers.
        _scheduleClusterRebuild();
    }

    function _collapseFan(fan, instant) {
        if (!fan || !_fans.has(fan.id)) return;
        _fans.delete(fan.id);
        fan.ids.forEach(id => _deployedIds.delete(id));
        const center = fan.center;
        const ids = fan.ids.slice();
        const legs = fan.legs.slice();
        const beacon = fan.beacon;
        const pane = map && map.getPane('eventPane');

        // Remove the beacon NOW so it never lingers frozen over the restored chip.
        if (beacon) { try { beacon.off(); map.removeLayer(beacon); } catch (_) {} }

        const finish = () => {
            legs.forEach(l => { try { map.removeLayer(l); } catch (_) {} });
            // Snap icons back to true coordinates so the next rebuild re-clusters.
            ids.forEach(id => {
                const m = eventMarkers[id];
                if (!m) return;
                const p = _spatialIndex.get(id);
                if (p) m.setLatLng([p.lat, p.lng]);
                m.setZIndexOffset(0);
            });
            if (!instant) { _fansCollapsing = Math.max(0, _fansCollapsing - 1); _spiderAnimEnd(); }
            _scheduleClusterRebuild();
        };

        if (instant || !pane) { finish(); return; }

        // Animate icons sliding back to the centre, then clean up.
        _fansCollapsing++;
        _spiderAnimBegin();
        ids.forEach(id => { const m = eventMarkers[id]; if (m) m.setLatLng(center); });
        legs.forEach(l => { try { l.setLatLngs([center, center]); if (l._path) l._path.style.opacity = '0'; } catch (_) {} });
        setTimeout(finish, 300);
    }

    function _collapseAllFans(instant) {
        Array.from(_fans.values()).forEach(f => _collapseFan(f, instant));
    }

    // Recompute every open fan's ring for the current zoom + icon size so the
    // deployed icons keep sensible spacing as the user zooms (the size itself
    // tracks --event-size via CSS; this keeps the layout + footprint tidy).
    function _spiderfyRelayoutAll() {
        if (!map || !_fans.size) return;
        const z = map.getZoom();
        const iconPx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--event-size')) || 34;
        _fans.forEach(fan => {
            const centerPt = map.project(fan.center, z);
            const offsets = _spiderRingOffsets(fan.ids.length);
            let maxR = 0;
            fan.ids.forEach((id, i) => {
                const m = eventMarkers[id];
                if (!m) return;
                const off = offsets[i] || { dx: 0, dy: 0 };
                maxR = Math.max(maxR, Math.hypot(off.dx, off.dy));
                const ll = map.unproject(L.point(centerPt.x + off.dx, centerPt.y + off.dy), z);
                m.setLatLng(ll);
                const leg = fan.legs[i];
                if (leg) leg.setLatLngs([fan.center, ll]);
            });
            fan.footprintPx = maxR + iconPx;
        });
    }

    // Cluster chip click. Drill-down model: a cluster of geographically SPREAD
    // events (the kind you get when zoomed far out) zooms in to break apart into
    // sub-clusters; only a cluster of genuinely CO-LOCATED news (that can't be
    // separated by zooming) fans its icons out. Multiple fans can stay open.
    function _handleClusterClick(chip) {
        const ids = (chip._evIds || []).filter(id => _spatialIndex.has(id) && !_deployedIds.has(id));
        if (ids.length < 2 || !map) return;
        const pts = ids.map(id => _spatialIndex.get(id));
        // Measure the members' pixel span at the deepest zoom. If they'd still sit
        // within one cluster radius even fully zoomed in, they're co-located →
        // fan them out. Otherwise zoom to fit so the big cluster splits apart.
        const maxZ = (map.getMaxZoom && map.getMaxZoom()) || 18;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        pts.forEach(p => {
            const pt = map.project([p.lat, p.lng], maxZ);
            if (pt.x < minX) minX = pt.x; if (pt.x > maxX) maxX = pt.x;
            if (pt.y < minY) minY = pt.y; if (pt.y > maxY) maxY = pt.y;
        });
        const spanPx = Math.max(maxX - minX, maxY - minY);
        if (spanPx < CLUSTER_RADIUS_PX) {
            _spiderfyDeploy(chip.getLatLng(), ids, chip);
        } else {
            const b = L.latLngBounds(pts.map(p => [p.lat, p.lng])).pad(0.2);
            const tz = Math.min(map.getBoundsZoom(b), maxZ);
            map.flyToBounds(b, { maxZoom: tz, duration: Math.max(0.6, 0.15 * Math.abs(tz - map.getZoom())) });
        }
    }

    function _timeAgo(tsMs) {
        const diff = Date.now() - tsMs;
        const m = Math.floor(diff / 60000);
        if (m < 1) return 'ahora';
        if (m < 60) return m + 'm';
        const h = Math.floor(m / 60);
        if (h < 24) return h + 'h';
        return Math.floor(h / 24) + 'd';
    }

    function _trimRangeRadiusEndpoints(centerLatLng, tipLatLng) {
        if (typeof map === 'undefined' || !map) return [centerLatLng, tipLatLng];
        const a = map.latLngToContainerPoint(centerLatLng);
        const b = map.latLngToContainerPoint(tipLatLng);
        const dx = b.x - a.x, dy = b.y - a.y;
        const len = Math.hypot(dx, dy);
        if (len < 24) return [centerLatLng, tipLatLng];   // too short to trim
        const startFrac = Math.min(0.45, 10 / len);
        const endFrac = Math.min(0.45, 6 / len);
        const startPx = L.point(a.x + dx * startFrac, a.y + dy * startFrac);
        const endPx = L.point(a.x + dx * (1 - endFrac), a.y + dy * (1 - endFrac));
        return [map.containerPointToLatLng(startPx), map.containerPointToLatLng(endPx)];
    }


    function _updateHud() {
        if (!_simState) return;
        const hudL = document.getElementById('sim-hud-launched');
        const hudI = document.getElementById('sim-hud-intercepted');
        const hudP = document.getElementById('sim-hud-impacts');
        const launched = _simState.missiles.length;
        if (hudL) hudL.textContent = launched;
        if (hudI) hudI.textContent = _simState.stats.intercepted;
        if (hudP) hudP.textContent = _simState.stats.impacted;
        const total = Math.max(1, _simState.stats.fired);
        const intPct = (_simState.stats.intercepted / total * 100);
        const impPct = (_simState.stats.impacted / total * 100);
        const barI = document.getElementById('sim-hud-bar-int');
        const barP = document.getElementById('sim-hud-bar-imp');
        if (barI) barI.style.width = intPct.toFixed(1) + '%';
        if (barP) barP.style.width = impPct.toFixed(1) + '%';
    }

    function _updateRangesInfo() {
        const info = document.getElementById('ars-range-info');
        const label = document.getElementById('ars-range-label');
        if (!info || !label) return;
        if (arsenalRanges.length === 0) { info.style.display = 'none'; return; }
        info.style.display = 'flex';
        const last = arsenalRanges[arsenalRanges.length - 1];
        label.textContent = arsenalRanges.length === 1
            ? `${last.country.flag} ${last.weapon.name} · ${last.weapon.range.toLocaleString()} km`
            : `${arsenalRanges.length} ranges active`;
    }

    function _validateConfig() {
        const exchange = _simAlliance.mode === 'exchange';
        const sideA = _simAlliance.sides.A.countries;
        const sideB = _simAlliance.sides.B.countries;
        if (sideA.length === 0) return { ok: false, msg: t('vNeedCountryA') };
        if (sideB.length === 0) return { ok: false, msg: t('vNeedCountryB') };
        const aWeaps = sideA.reduce((s, c) => s + c.weaponGroups.length, 0);
        const bWeaps = sideB.reduce((s, c) => s + c.weaponGroups.length, 0);
        if (!exchange && aWeaps === 0) return { ok: false, msg: t('vNeedWeaponA') };
        if (exchange && (aWeaps + bWeaps === 0)) return { ok: false, msg: t('vNeedWeapon') };
        // Every weapon group must have a target
        const allCountries = exchange ? sideA.concat(sideB) : sideA;
        const warnings = [];
        for (const c of allCountries) {
            for (const g of c.weaponGroups) {
                if (!g.target) return { ok: false, msg: `${ARSENAL_DATA[c.key].name} ${t('vNeedTargetSuffix')}` };
                // Pre-launch reachability check: published max range vs origin-target distance.
                const w = _resolveWeaponFromKey(c.key, g.weaponKey);
                if (w && w.range && g.origin && g.target) {
                    const d = _haversineKm(g.origin, g.target);
                    if (d > w.range * 1.05) {
                        warnings.push(`${ARSENAL_DATA[c.key].name} ${w.name}: target ${Math.round(d)} km away, max range ${w.range} km — out of reach.`);
                    }
                }
            }
        }
        return { ok: true, warnings };
    }

    function _verdictText(stats) {
        if (stats.fired === 0) return 'No projectiles were launched.';
        const rate = stats.intercepted / stats.fired;
        if (rate >= 0.9) return 'Defense network performed near-perfectly. The strike was effectively neutralised before any meaningful damage could be inflicted.';
        if (rate >= 0.7) return 'Air-defense layers held strong. A small number of projectiles leaked through but the defending coalition retained operational integrity.';
        if (rate >= 0.45) return 'Defenses absorbed the bulk of the strike, but saturation breached several layers. Targeted areas suffered measurable losses.';
        if (rate >= 0.2) return 'Defensive shield was overwhelmed by saturation. The attacking alliance achieved widespread effect on protected targets.';
        return 'Defensive grid collapsed under the attack volume. The attacking alliance achieved decisive impact across the targeted territory.';
    }

    function _weaponBias(rangeKm, bearingDeg, mtype) {
        const rad = bearingDeg * Math.PI / 180;
        let v = 1
            + 0.07 * Math.sin(rad * 2 + (rangeKm % 7))
            + 0.04 * Math.cos(rad * 3 + (rangeKm % 5))
            - 0.03 * Math.sin(rad);
        if (mtype === 'hypersonic') v += 0.05 * Math.cos(rad);
        else if (mtype === 'tactical') v += 0.08 * Math.cos(rad);
        return Math.max(0.82, Math.min(1.15, v));
    }

    function _weaponHeadColor(mclass) {
        switch (mclass) {
            case 'ICBM':       return '#ff2a18';
            case 'IRBM':       return '#ff6b3c';
            case 'MRBM':       return '#ff9a4d';
            case 'SRBM':       return '#ffd24d';
            case 'SLBM':       return '#ff4dc4';
            case 'HYPERSONIC': return '#ff00aa';
            case 'CRUISE':     return '#46e0ff';
            case 'DRONE':      return '#9affb0';
            case 'ROCKET':     return '#ffe080';
            default:           return '#ffffff';
        }
    }

    function _wireNewsDelegation() {
        const list = document.getElementById('news-list');
        if (!list || list._newsWired) return;
        list._newsWired = true;   // delegation survives re-renders; wire once
        list.addEventListener('click', (e) => {
            // Media thumbnails open in the lightbox via mediaViewer's own
            // document-level delegation — don't also treat them as item clicks.
            if (e.target.closest('.news-media-wrap')) return;
            // Selection checkbox → toggle this item in the multi-selection.
            const checkBtn = e.target.closest('[data-news-check]');
            if (checkBtn) {
                e.stopPropagation();
                newsContextMenu.toggleSelect(checkBtn.getAttribute('data-news-check'), checkBtn.closest('.news-item'));
                return;
            }
            // Expand / collapse long text.
            const expandBtn = e.target.closest('[data-expand]');
            if (expandBtn) {
                e.stopPropagation();
                const itemEl = expandBtn.closest('.news-item');
                const txt = itemEl && itemEl.querySelector('.news-item-text');
                if (txt) {
                    const expanded = txt.classList.toggle('expanded');
                    const _tExp = T[currentLang] || T.en;
                    expandBtn.textContent = expanded ? (_tExp.showLess || 'Mostrar menos') : (_tExp.showMore || 'Mostrar más');
                }
                return;
            }
            // Click a news item → focus + highlight its icon on the map.
            const itemEl = e.target.closest('.news-item');
            if (!itemEl) return;
            const eid = itemEl.dataset.eventId;
            if (eid && eventMarkers[eid]) { focusEventOnMap(eid); return; }
            if (itemEl.dataset.geo != null) {
                const it = newsItems[parseInt(itemEl.dataset.geo, 10)];
                if (it && it.lat != null) flyToNews(it.lat, it.lng, it.event_id);
            }
        });
        // Right-click a news item → context menu (Show in feed / Analyze with AI).
        list.addEventListener('contextmenu', (e) => {
            const itemEl = e.target.closest('.news-item');
            if (!itemEl) return;
            e.preventDefault();
            newsContextMenu.openFor(itemEl, e.clientX, e.clientY);
        });
    }

    // ── News right-click context menu + multi-selection ──
    // Right-click a news item to "Show in feed" or "Analyze with AI". Items can
    // be multi-selected via the hover checkbox; the menu then acts on the whole
    // selection (or just the right-clicked item when nothing is selected).
    const newsContextMenu = {
        _ids: [], _primaryId: null,
        _t() { return T[currentLang] || T.en; },
        // Resolve a stable news id back to its live news item object.
        _itemById(id) {
            if (!id) return null;
            if (newsById[id] && newsById[id][0]) return newsById[id][0];
            const found = newsItems.find(it => (it.event_id || '') === id);
            if (found) return found;
            const m = /^gf-idx-(\d+)$/.exec(id);
            if (m) return newsItems[parseInt(m[1], 10)];
            return null;
        },
        toggleSelect(id, itemEl) {
            if (!id) return;
            if (_newsSel.has(id)) _newsSel.delete(id); else _newsSel.add(id);
            if (itemEl) itemEl.classList.toggle('is-selected', _newsSel.has(id));
        },
        clearSelection() {
            _newsSel.clear();
            document.querySelectorAll('.news-item.is-selected').forEach(el => el.classList.remove('is-selected'));
        },
        _ensureMenu() {
            if (this._menu) return this._menu;
            const menu = document.createElement('div');
            menu.id = 'news-ctx-menu';
            menu.className = 'news-ctx-menu';
            menu.hidden = true;
            menu.innerHTML =
                `<button type="button" class="news-ctx-item" data-ctx="feed"><span class="news-ctx-ico">📰</span><span class="news-ctx-lbl"></span></button>` +
                `<button type="button" class="news-ctx-item" data-ctx="analyze"><span class="news-ctx-ico">🧠</span><span class="news-ctx-lbl"></span></button>` +
                `<button type="button" class="news-ctx-item" data-ctx="geolocate"><span class="news-ctx-ico">📍</span><span class="news-ctx-lbl"></span></button>`;
            document.body.appendChild(menu);
            menu.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-ctx]');
                if (!btn) return;
                const action = btn.getAttribute('data-ctx');
                this.close();
                if (action === 'feed') this._showInFeed(this._primaryId);
                else if (action === 'analyze') this._analyze(this._ids);
                else if (action === 'geolocate') this._geolocate(this._ids);
            });
            // Dismiss on outside click, escape, scroll or resize.
            document.addEventListener('click', (e) => { if (!menu.hidden && !menu.contains(e.target)) this.close(); });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
            window.addEventListener('resize', () => this.close());
            const newsBody = document.getElementById('news-body');
            if (newsBody) newsBody.addEventListener('scroll', () => this.close(), { passive: true });
            this._menu = menu;
            return menu;
        },
        openFor(itemEl, x, y) {
            const thisId = itemEl.getAttribute('data-news-id');
            if (!thisId) return;
            // Act on the whole selection when the right-clicked item is part of it;
            // otherwise act on just this item (standard file-manager behavior).
            this._ids = (_newsSel.has(thisId) && _newsSel.size > 0) ? [..._newsSel] : [thisId];
            this._primaryId = thisId;
            const menu = this._ensureMenu();
            const tr = this._t();
            const n = this._ids.length;
            menu.querySelector('[data-ctx="feed"] .news-ctx-lbl').textContent = tr.newsShowInFeed || 'Mostrar en feed';
            menu.querySelector('[data-ctx="analyze"] .news-ctx-lbl').textContent = n > 1
                ? (tr.newsAnalyzeN || 'Analizar {n} noticias').replace('{n}', n)
                : (tr.newsAnalyzeOne || 'Analizar noticia');
            menu.querySelector('[data-ctx="geolocate"] .news-ctx-lbl').textContent = n > 1
                ? (tr.newsGeolocateN || 'Geolocalizar {n} noticias').replace('{n}', n)
                : (tr.newsGeolocate || 'Geolocalizar noticia');
            // Show then position (needs measured size to clamp within the viewport).
            menu.hidden = false;
            menu.style.visibility = 'hidden';
            const mw = menu.offsetWidth, mh = menu.offsetHeight;
            const px = Math.min(x, window.innerWidth - mw - 8);
            const py = Math.min(y, window.innerHeight - mh - 8);
            menu.style.left = Math.max(8, px) + 'px';
            menu.style.top = Math.max(8, py) + 'px';
            menu.style.visibility = '';
        },
        close() { if (this._menu) this._menu.hidden = true; },
        _showInFeed(id) {
            const it = this._itemById(id);
            if (!it) return;
            try { favBox.open(); } catch (_) {}
            try { favBox.showItem(it.event_id || id); } catch (_) {}
        },
        _analyze(ids) {
            const items = (ids || []).map(id => this._itemById(id)).filter(Boolean);
            if (!items.length) return;
            try { aiAssistant.analyzeNews(items); } catch (_) {}
            this.clearSelection();
        },
        // "Geolocalizar": put the selected news on the map. Items already placed
        // (or with cached geo) are free; only the rest go to the AI, in one call.
        _geolocate(ids) {
            const items = (ids || []).map(id => this._itemById(id)).filter(Boolean);
            if (!items.length) return;
            this.clearSelection();
            try { geoFeed.geolocateNewsItems(items); } catch (_) {}
        },
    };

    // Build the compact news card shown inside the AI chat when the user picks
    // "Analyze" — one row per selected item (source · time + headline).
    function _renderNewsCard(items) {
        const wrap = document.createElement('div');
        wrap.className = 'ai-news-card';
        (items || []).forEach(it => {
            const row = document.createElement('div');
            row.className = 'ai-news-card-item';
            const clean = _cleanMessage(it.message || '');
            const nl = clean.indexOf('\n');
            const title = (nl > 0 ? clean.slice(0, nl) : clean).slice(0, 160) || (it.channel || '');
            const src = it.channel || '';
            const when = it.timestamp ? `${it.timestamp.substring(5, 10)} ${it.timestamp.substring(11, 16)}` : '';
            row.innerHTML =
                `<div class="ai-news-card-src">${it.event_icon || '📰'} ${escapeHtml(src)}${when ? ` · <span class="ai-news-card-when">${escapeHtml(when)}</span>` : ''}</div>` +
                `<div class="ai-news-card-title">${escapeHtml(title)}</div>`;
            wrap.appendChild(row);
        });
        return wrap;
    }

    // Build the assistant's confirmation line after it added/removed sources.
    function _sourceActionMsg(res) {
        const tr = T[currentLang] || T.en;
        if (res.removed > 0) return (tr.aiSourcesRemoved || 'Listo: he quitado {n} fuentes de tu feed.').replace('{n}', res.removed);
        if (res.added > 0) return (tr.aiSourcesAdded || 'Listo: he añadido {n} fuentes a tu feed.').replace('{n}', res.added);
        if (res.action === 'remove') return tr.aiSourcesRemovedNone || 'No encontré esas fuentes para quitar.';
        return tr.aiSourcesNone || 'No encontré fuentes nuevas para añadir.';
    }

    function abandonActiveMeasure() {
        measureMode = null;
        measureActive = false;
        measurePts = [];
        previewPos = null;
        measureMarkers.forEach(m => map.removeLayer(m));
        if (measureLine) { map.removeLayer(measureLine); measureLine = null; }
        if (measurePreview) { map.removeLayer(measurePreview); measurePreview = null; }
        if (measureClosingLine) { map.removeLayer(measureClosingLine); measureClosingLine = null; }
        if (measurePoly) { map.removeLayer(measurePoly); measurePoly = null; }
        measureMarkers = [];
        map.getContainer().style.cursor = '';
        document.getElementById('measure-panel').style.display = 'none';
    }

    function addMeasurePoint(latlng) {
        const idx = measurePts.length;
        measurePts.push({ lat: latlng.lat, lng: latlng.lng });

        const isFirst = (idx === 0);
        const marker = L.marker(latlng, {
            icon: makeVertexIcon(isFirst),
            draggable: true,
            zIndexOffset: 1000,
            keyboard: false,
            riseOnHover: true,
            autoPan: false
        }).addTo(map);

        marker.on('drag', e => {
            measurePts[idx] = { lat: e.latlng.lat, lng: e.latlng.lng };
            redrawMeasure();
            updateMeasureInfo();
        });

        // Click on first point → close area
        if (isFirst) {
            marker.on('click', () => {
                if (measureActive && measureMode === 'area' && measurePts.length >= 3) {
                    finishMeasure();
                }
            });
        }

        measureMarkers.push(marker);
        redrawMeasure();
        updateMeasureInfo();
    }

    function addNewsItem(data) {
        newsItems.unshift(data);
        // Bound the in-memory store. Trimming from the tail discards the
        // oldest entries first, which is exactly what the prompt asks for.
        if (newsItems.length > MAX_NEWS_KEEP) newsItems.length = MAX_NEWS_KEEP;
        indexNewsByEvent(data);
        scheduleRenderNewsList();
    }

    function animateMissiles(attacker, target, weapon, total, intercepted, penetrated) {
        const canvas = document.getElementById('sim-canvas');
        const container = document.getElementById('sim-canvas-container');
        if (!canvas || !container) return;

        container.style.display = 'block';
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        const startX = 50;
        const startY = h / 2;
        const endX = w - 50;
        const endY = h / 2;

        let frame = 0;
        const duration = 120;

        function draw() {
            ctx.clearRect(0, 0, w, h);

            ctx.fillStyle = 'rgba(0, 229, 255, 0.05)';
            ctx.fillRect(0, 0, w, h);

            ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.setLineDash([]);

            const t = Math.min(1, frame / duration);

            for (let i = 0; i < total; i++) {
                const offset = (i % 5) * 8 - 16;
                const x = startX + (endX - startX) * t;
                const arcHeight = 40 * Math.sin(t * Math.PI);
                const y = startY - arcHeight + offset;

                const isIntercepted = i < intercepted;
                const color = isIntercepted ? '#ff6b35' : '#00ff88';

                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();

                if (isIntercepted && t > 0.5) {
                    ctx.strokeStyle = 'rgba(255, 107, 53, 0.6)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(x, y, 6 + (t - 0.5) * 4, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }

            ctx.fillStyle = '#e2e8f0';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('⬤ Attacker', startX - 40, 20);
            ctx.fillText('⬤ Target', endX - 30, 20);

            ctx.fillStyle = '#00ff88';
            ctx.beginPath();
            ctx.arc(startX - 50, 20, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ff6b35';
            ctx.beginPath();
            ctx.arc(endX + 30, 20, 4, 0, Math.PI * 2);
            ctx.fill();

            frame++;
            if (frame <= duration) {
                requestAnimationFrame(draw);
            }
        }

        draw();
    }

    function applyEventZoomFilter() {
        if (!map) return;
        const z = map.getZoom();
        // Icon size scales logically with zoom — NEVER shrinks on zoom-in. Driven
        // via width/height (not transform; a cascade rule nullifies transforms on
        // .ev-pin). Base 34 px (just slightly above the original 32) up to ~78 px.
        // z≤3 → 34 px.  z=6 → ~50 px.  z=10 → ~70 px.  z≥13 → ~78 px (cap).
        const EVENT_BASE_PX = 34;
        const scale = z <= 3
            ? 1.0
            : Math.min(2.3, 1.0 + (z - 3) * 0.15);
        const sizePx = (EVENT_BASE_PX * scale).toFixed(1) + 'px';
        document.documentElement.style.setProperty('--event-scale', scale.toFixed(2));
        document.documentElement.style.setProperty('--event-size', sizePx);

        // Visibility is owned SOLELY by the clustering pass (_rebuildClusters),
        // which folds dense icons into numbered chips. We deliberately no longer
        // hide icons by a zoom/score threshold — every icon (Telegram channel OR
        // news outlet) is treated identically: shown, or folded into a chip.
        // That score-based hiding was what made icons blink in and out on zoom.
        // Here we only clear any stale display:none so clustering's `visibility`
        // flag is the single source of truth (display and visibility never fight).
        Object.keys(eventMarkers).forEach(eid => {
            const m = eventMarkers[eid];
            const el = m && m.getElement && m.getElement();
            if (el && el.style.display === 'none') el.style.display = '';
        });

        // Dispersion connector lines/dots follow their marker's REAL visibility
        // (folded-into-chip markers carry visibility:hidden from the cluster pass).
        const isVis = (eid) => {
            const m = eventMarkers[eid];
            const el = m && m.getElement && m.getElement();
            return !!el && el.style.visibility !== 'hidden' && el.style.display !== 'none';
        };
        Object.keys(dispersionLines).forEach(eid => {
            const line = dispersionLines[eid];
            if (line && line._path) line._path.style.display = isVis(eid) ? '' : 'none';
        });
        Object.keys(dispersionCenterDots).forEach(key => {
            const group = dispersionGroups[key] || [];
            const visCount = group.filter(isVis).length;
            const dot = dispersionCenterDots[key];
            if (dot && dot._path) dot._path.style.display = (visCount >= 2) ? '' : 'none';
        });

        // If a fan is open, re-fit its ring to the (now updated) icon size/zoom.
        if (_fans.size) { try { _spiderfyRelayoutAll(); } catch (_) {} }
    }

    function applyLabelCollision() {
           // Collect candidates from countryLabelGroup, cityLabelGroup, waterLabelGroup
           // Apply zoom filter (m._labelMinZoom)
           // Cull viewport with PAD_X=80, PAD_Y=30
           // Project lat/lng to container points
           // Sort by priority asc
           // Use 80px spatial grid with addBox/overlaps helpers
           // For each candidate: measure inner offsetWidth/Height + 4px PAD
           // Hide if overlaps; addBox if free
           // Range tags: never hidden, auto-stack vertically (TAG_H=17px) when colliding
       }

    function applyLabelZoomFilter() {
           const z = map.getZoom();
           const scale = Math.max(0.7, Math.min(2.2, Math.pow(1.13, z - 4)));
           document.documentElement.style.setProperty('--label-scale', scale.toFixed(3));
           // ... existing scale code ...
           if (labelState.cities) refreshVisibleCities();
           scheduleLabelCollision();
       }

    // Profile-chip + welcome + locked-setting words for the 11 languages that
    // didn't have them, so the chrome never falls back to English. (es/en already
    // carry these keys inline in T above.) Merged into T so applyLang/tk see them.
    const _UI_EXTRA = {
        fr: { planChoose:'Choisir un plan', logoutLabel:'Se déconnecter', enterApp:"Ouvrir l'app", backHome:"Retour à l'accueil", welcomeTitle:'Bienvenue sur Skorpene', welcomeSub:'Préparation de ton monde…', proLockedHint:'🔒 Disponible avec Pro (carte en direct)', subCancel:"Annuler l'abonnement", subResume:"Reprendre l'abonnement", subCancelConfirm:"Annuler ton abonnement ? Tu gardes ton plan jusqu'à la fin de la période déjà payée.", subCancelDone:"Abonnement annulé. Ton plan reste actif jusqu'au {date}.", subCancelNow:'Abonnement annulé. Ton compte est maintenant Free.', subResumeDone:'Abonnement repris ✓', subErr:"L'opération a échoué. Réessaie." },
        ru: { planChoose:'Выбрать план', logoutLabel:'Выйти', enterApp:'Войти в приложение', backHome:'На главную', welcomeTitle:'Добро пожаловать в Skorpene', welcomeSub:'Готовим твой мир…', proLockedHint:'🔒 Доступно в Pro (живая карта)', subCancel:'Отменить подписку', subResume:'Возобновить подписку', subCancelConfirm:'Отменить подписку? Твой план останется активным до конца уже оплаченного периода.', subCancelDone:'Подписка отменена. План активен до {date}.', subCancelNow:'Подписка отменена. Теперь у тебя план Free.', subResumeDone:'Подписка возобновлена ✓', subErr:'Не удалось выполнить операцию. Попробуй ещё раз.' },
        zh: { planChoose:'选择方案', logoutLabel:'退出登录', enterApp:'进入应用', backHome:'返回首页', welcomeTitle:'欢迎使用 Skorpene', welcomeSub:'正在准备你的世界…', proLockedHint:'🔒 Pro 专享（实时地图）', subCancel:'取消订阅', subResume:'恢复订阅', subCancelConfirm:'确定要取消订阅吗？已付费期间内你仍可继续使用当前方案。', subCancelDone:'订阅已取消。你的方案将保留至 {date}。', subCancelNow:'订阅已取消。你的账户现在是 Free。', subResumeDone:'订阅已恢复 ✓', subErr:'操作失败，请重试。' },
        tr: { planChoose:'Plan seç', logoutLabel:'Çıkış yap', enterApp:'Uygulamaya gir', backHome:'Ana sayfaya dön', welcomeTitle:"Skorpene'ye hoş geldin", welcomeSub:'Dünyan hazırlanıyor…', proLockedHint:"🔒 Pro'da mevcut (canlı harita)", subCancel:'Aboneliği iptal et', subResume:'Aboneliği sürdür', subCancelConfirm:'Aboneliğini iptal etmek istiyor musun? Ödediğin dönemin sonuna kadar planın aktif kalır.', subCancelDone:'Abonelik iptal edildi. Planın {date} tarihine kadar aktif.', subCancelNow:'Abonelik iptal edildi. Hesabın artık Free.', subResumeDone:'Abonelik sürdürüldü ✓', subErr:'İşlem tamamlanamadı. Tekrar dene.' },
        ar: { planChoose:'اختر خطة', logoutLabel:'تسجيل الخروج', enterApp:'ادخل التطبيق', backHome:'العودة للرئيسية', welcomeTitle:'مرحبًا بك في Skorpene', welcomeSub:'نُجهّز عالمك…', proLockedHint:'🔒 متاح في Pro (خريطة حية)', subCancel:'إلغاء الاشتراك', subResume:'استئناف الاشتراك', subCancelConfirm:'هل تريد إلغاء اشتراكك؟ ستحتفظ بخطتك حتى نهاية الفترة المدفوعة.', subCancelDone:'تم إلغاء الاشتراك. تبقى خطتك فعّالة حتى {date}.', subCancelNow:'تم إلغاء الاشتراك. حسابك الآن Free.', subResumeDone:'تم استئناف الاشتراك ✓', subErr:'تعذّر إتمام العملية. حاول مجددًا.' },
        fa: { planChoose:'انتخاب پلن', logoutLabel:'خروج', enterApp:'ورود به برنامه', backHome:'بازگشت به خانه', welcomeTitle:'به Skorpene خوش آمدید', welcomeSub:'در حال آماده‌سازی دنیای تو…', proLockedHint:'🔒 در Pro موجود است (نقشه زنده)', subCancel:'لغو اشتراک', subResume:'ازسرگیری اشتراک', subCancelConfirm:'اشتراکت لغو شود؟ تا پایان دورهٔ پرداخت‌شده پلنت فعال می‌ماند.', subCancelDone:'اشتراک لغو شد. پلنت تا {date} فعال می‌ماند.', subCancelNow:'اشتراک لغو شد. حسابت اکنون Free است.', subResumeDone:'اشتراک از سر گرفته شد ✓', subErr:'عملیات انجام نشد. دوباره تلاش کن.' },
        he: { planChoose:'בחר תוכנית', logoutLabel:'התנתק', enterApp:'כניסה לאפליקציה', backHome:'חזרה לדף הבית', welcomeTitle:'ברוכים הבאים ל-Skorpene', welcomeSub:'מכינים את העולם שלך…', proLockedHint:'🔒 זמין ב-Pro (מפה חיה)', subCancel:'ביטול המנוי', subResume:'חידוש המנוי', subCancelConfirm:'לבטל את המנוי? התוכנית תישאר פעילה עד סוף התקופה ששולמה.', subCancelDone:'המנוי בוטל. התוכנית פעילה עד {date}.', subCancelNow:'המנוי בוטל. החשבון שלך עכשיו Free.', subResumeDone:'המנוי חודש ✓', subErr:'הפעולה נכשלה. נסה שוב.' },
        nl: { planChoose:'Plan kiezen', logoutLabel:'Uitloggen', enterApp:'App openen', backHome:'Terug naar start', welcomeTitle:'Welkom bij Skorpene', welcomeSub:'Je wereld wordt voorbereid…', proLockedHint:'🔒 Beschikbaar in Pro (live kaart)', subCancel:'Abonnement opzeggen', subResume:'Abonnement hervatten', subCancelConfirm:'Abonnement opzeggen? Je houdt je plan tot het einde van de al betaalde periode.', subCancelDone:'Abonnement opgezegd. Je plan blijft actief tot {date}.', subCancelNow:'Abonnement opgezegd. Je account is nu Free.', subResumeDone:'Abonnement hervat ✓', subErr:'Bewerking mislukt. Probeer opnieuw.' },
        it: { planChoose:'Scegli piano', logoutLabel:'Esci', enterApp:"Apri l'app", backHome:'Torna alla home', welcomeTitle:'Benvenuto su Skorpene', welcomeSub:'Stiamo preparando il tuo mondo…', proLockedHint:'🔒 Disponibile in Pro (mappa live)', subCancel:'Annulla abbonamento', subResume:'Riattiva abbonamento', subCancelConfirm:"Vuoi annullare l'abbonamento? Manterrai il tuo piano fino alla fine del periodo già pagato.", subCancelDone:'Abbonamento annullato. Il piano resta attivo fino al {date}.', subCancelNow:'Abbonamento annullato. Il tuo account ora è Free.', subResumeDone:'Abbonamento riattivato ✓', subErr:'Operazione non riuscita. Riprova.' },
        pt: { planChoose:'Escolher plano', logoutLabel:'Terminar sessão', enterApp:'Entrar na app', backHome:'Voltar ao início', welcomeTitle:'Bem-vindo ao Skorpene', welcomeSub:'A preparar o teu mundo…', proLockedHint:'🔒 Disponível no Pro (mapa em direto)', subCancel:'Cancelar subscrição', subResume:'Retomar subscrição', subCancelConfirm:'Cancelar a tua subscrição? Manténs o teu plano até ao fim do período já pago.', subCancelDone:'Subscrição cancelada. O teu plano fica ativo até {date}.', subCancelNow:'Subscrição cancelada. A tua conta agora é Free.', subResumeDone:'Subscrição retomada ✓', subErr:'Não foi possível concluir. Tenta novamente.' },
        hi: { planChoose:'प्लान चुनें', logoutLabel:'लॉग आउट', enterApp:'ऐप खोलें', backHome:'होम पर वापस', welcomeTitle:'Skorpene में आपका स्वागत है', welcomeSub:'आपकी दुनिया तैयार हो रही है…', proLockedHint:'🔒 Pro में उपलब्ध (लाइव मानचित्र)', subCancel:'सदस्यता रद्द करें', subResume:'सदस्यता फिर शुरू करें', subCancelConfirm:'क्या सदस्यता रद्द करनी है? भुगतान की गई अवधि के अंत तक आपका प्लान सक्रिय रहेगा।', subCancelDone:'सदस्यता रद्द हो गई। आपका प्लान {date} तक सक्रिय रहेगा।', subCancelNow:'सदस्यता रद्द हो गई। आपका खाता अब Free है।', subResumeDone:'सदस्यता फिर शुरू हो गई ✓', subErr:'कार्रवाई पूरी नहीं हो सकी। फिर से आज़माएँ।' },
    };
    for (const _l in _UI_EXTRA) { T[_l] = Object.assign(T[_l] || {}, _UI_EXTRA[_l]); }

    function applyLang() {
        const lang = T[currentLang] || T.es;
        // Per-key fallback: chosen language → English → Spanish. This lets newly
        // added languages (nl, it, hi, pt) stay fully usable even where a given
        // sub-dictionary hasn't been translated yet — the key shows in English
        // instead of leaving a stale string from a previously applied language.
        const tk = (k) => lang[k] || (T.en && T.en[k]) || (T.es && T.es[k]);
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const v = tk(el.getAttribute('data-i18n'));
            if (v) el.textContent = v;
        });
        // Placeholder translations (input elements)
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const v = tk(el.getAttribute('data-i18n-ph'));
            if (v) el.placeholder = v;
        });
        // Tooltip / title translations
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const v = tk(el.getAttribute('data-i18n-title'));
            if (v) el.title = v;
        });
        document.documentElement.lang = currentLang;
        document.body.dir = (currentLang === 'ar' || currentLang === 'fa' || currentLang === 'he') ? 'rtl' : 'ltr';
    }

    // ── Single source of truth for switching language ──
    // The app historically had TWO disconnected i18n passes: applyLang() (the
    // `data-i18n` app strings) and landingI18n.apply() (the `data-i18n-landing`
    // landing/pricing strings). Whichever entry point you used only refreshed
    // ITS half, so the other half stayed in the old language until a reload —
    // the root cause of "some words don't translate / only after refresh".
    // setLanguage() runs BOTH passes plus every dynamic re-render, so a language
    // change is complete and instant from anywhere (settings dropdown OR the
    // landing picker). Only live news content stays in its original language.
    function setLanguage(lng) {
        if (!lng) return;
        currentLang = lng;
        try { localStorage.setItem('geoscope_landing_lang', lng); } catch (_) {}
        // 1) Static strings — app + landing.
        try { applyLang(); } catch (_) {}
        try { if (window.__landingI18n) window.__landingI18n.apply(lng); } catch (_) {}
        // 2) Keep both language pickers' chips in sync.
        try { langDropdown && langDropdown.setValue && langDropdown.setValue(lng); } catch (_) {}
        // 3) Dynamic app surfaces that build their own markup.
        try { if (typeof rebuildAllLabels === 'function') rebuildAllLabels(); } catch (_) {}
        try { if (typeof renderNewsList === 'function') renderNewsList(); } catch (_) {}
        // The Feed box builds its own markup (count + empty state + items), so it
        // must be re-rendered or it keeps the language it was first opened in.
        try { if (typeof favBox !== 'undefined' && favBox._renderHook) favBox._renderHook(); } catch (_) {}
        try { if (typeof _refreshAddSelectors === 'function') _refreshAddSelectors(); } catch (_) {}
        try {
            const simEl = document.getElementById('ars-simulator');
            if (simEl && simEl.style.display !== 'none') {
                if (typeof _renderSide === 'function') { _renderSide('A'); _renderSide('B'); }
                if (typeof _renderLaunchSummary === 'function') _renderLaunchSummary();
            }
        } catch (_) {}
        try { if (typeof renderUserSourcesList === 'function') renderUserSourcesList(); } catch (_) {}
        // 4) Profile chips (app + landing) and pricing CTAs carry localized text.
        try { renderProfileChip(); } catch (_) {}
        try { auth && auth._fillLandingProfile && auth._fillLandingProfile(); } catch (_) {}
        try { auth && auth._refreshPricingCtas && auth._refreshPricingCtas(); } catch (_) {}
        // 5) The onboarding wizard, if it's currently open.
        try {
            if (onboarding && onboarding.el &&
                onboarding.el.getAttribute('aria-hidden') === 'false' &&
                typeof onboarding.render === 'function') onboarding.render();
        } catch (_) {}
        // 6) Google Maps base labels (country / city / sea names).
        try { _reloadGoogleMapsForLang(currentLang); } catch (_) {}
    }
    window.__setLanguage = setLanguage;

    function applyUnit(unit) {
        currentUnit = unit;
        if (scaleControl) map.removeControl(scaleControl);
        scaleControl = L.control.scale({
            position: 'bottomleft', imperial: unit === 'mi', metric: unit !== 'mi', maxWidth: 140
        }).addTo(map);
        updateMeasureInfo();
    }

    function bilingualHtml(trText, natText, innerClass) {
        const tr = escapeHtml(trText);
        const showNat = natText && natText !== trText;
        const nat = showNat ? `<span class="geo-bi-nat">${escapeHtml(natText)}</span>` : '';
        return `<span class="geo-inner ${innerClass}"><span class="geo-bi-tr">${tr}</span>${nat}</span>`;
    }

    // ── AI master switch ──
    // The user can disable AI from a top-bar toggle to save Anthropic credits.
    // ── Offline Mode ──────────────────────────────────────────────────────────
    // When OFFLINE, ALL outbound network calls stop:
    //   • WebSocket is closed and won't auto-reconnect
    //   • geoFeed.refresh() and pollNewsUpdates() become no-ops
    //   • Every /api/claude call goes through aiFetch(), which returns null
    // State persists in localStorage; default is ONLINE for first-time users.
    // ── UI Theme (dark/light) ──
    const LS_THEME = 'geoscope_ui_theme';
    function _applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : '');
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.themeVal === theme);
        });
        try { localStorage.setItem(LS_THEME, theme); } catch (_) {}
    }
    // Load persisted theme on startup
    (() => {
        try { _applyTheme(localStorage.getItem(LS_THEME) || 'dark'); } catch (_) { _applyTheme('dark'); }
    })();

    // ── Custom language dropdown (replaces the native <select>) ──
    // Native macOS / Windows selects open a system popup that overlaps the
    // trigger and hides the chevron, so the user can't see how to collapse it.
    // This custom dropdown opens BELOW the trigger and the chevron rotates in
    // place so it's always visible. The options come from ONB_LANGS to keep
    // the wizard and the settings panel in sync.
    const langDropdown = {
        el: null,
        onChange: null,

        init() {
            this.el = document.getElementById('lang-dropdown');
            if (!this.el) return;
            this._render();
            this._wire();
        },

        setValue(v) {
            if (!this.el) return;
            this.el.dataset.value = v;
            const item = (typeof ONB_LANGS !== 'undefined') && ONB_LANGS.find(l => l.id === v);
            const lbl = this.el.querySelector('.cs-label');
            if (lbl && item) lbl.textContent = item.label;
            this.el.querySelectorAll('.cs-option').forEach(o =>
                o.classList.toggle('sel', o.dataset.val === v));
        },

        _render() {
            const cur = this.el.dataset.value || 'es';
            const items = (typeof ONB_LANGS !== 'undefined') ? ONB_LANGS : [{ id: 'es', label: '🇪🇸 Español' }];
            const curItem = items.find(l => l.id === cur) || items[0];
            // Inline SVG chevron — minimalist 10×10 stroke.
            const chevron = `<svg class="cs-chevron" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,3.5 5,6.5 8,3.5"/></svg>`;
            this.el.innerHTML = `
                <button type="button" class="cs-trigger" aria-haspopup="listbox" aria-expanded="false">
                    <span class="cs-label">${curItem.label}</span>
                    ${chevron}
                </button>
                <ul class="cs-menu" role="listbox" hidden>
                    ${items.map(l => `<li class="cs-option${l.id === cur ? ' sel' : ''}" data-val="${l.id}" role="option">${l.label}</li>`).join('')}
                </ul>`;
        },

        _wire() {
            const trigger = this.el.querySelector('.cs-trigger');
            const menu = this.el.querySelector('.cs-menu');
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this._toggle();
            });
            menu.addEventListener('click', (e) => {
                const opt = e.target.closest('.cs-option');
                if (!opt) return;
                const v = opt.dataset.val;
                this.setValue(v);
                this._close();
                if (typeof this.onChange === 'function') this.onChange(v);
            });
            document.addEventListener('click', (e) => {
                if (!this.el.contains(e.target)) this._close();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this._close();
            });
        },

        _toggle() { this.el.classList.contains('is-open') ? this._close() : this._open(); },
        _open() {
            this.el.classList.add('is-open');
            const menu = this.el.querySelector('.cs-menu'); if (menu) menu.hidden = false;
            const trg = this.el.querySelector('.cs-trigger'); if (trg) trg.setAttribute('aria-expanded', 'true');
        },
        _close() {
            this.el.classList.remove('is-open');
            const menu = this.el.querySelector('.cs-menu'); if (menu) menu.hidden = true;
            const trg = this.el.querySelector('.cs-trigger'); if (trg) trg.setAttribute('aria-expanded', 'false');
        },
    };

    let _isOnline = true;   // always live — toggle removed; kill the server to pause
    // Legacy alias used by iconCurator / geoFeed — keep working.
    // The signed-in user's plan ('free' | 'pro' | 'team'). Read straight from the
    // stored auth user so any code path can gate features without reaching into
    // the auth module. Defaults to 'free' (no AI) when unknown.
    function currentPlan() {
        try { return (JSON.parse(localStorage.getItem('geoscope_auth_user') || '{}').plan) || 'free'; }
        catch (_) { return 'free'; }
    }
    function isPaidPlan() { const p = currentPlan(); return p === 'pro' || p === 'team'; }
    // AI is a paid feature: free accounts have NO access to /api/claude (assistant,
    // news translation OR source resolving) so they never consume API credits.
    function isAiEnabled() { return _isOnline && isPaidPlan(); }
    async function aiFetch(url, opts) {
        if (!_isOnline || !isPaidPlan()) return null;
        opts = opts || {};
        const tok = (() => { try { return localStorage.getItem('geoscope_auth_token') || ''; } catch (_) { return ''; } })();
        if (tok) opts.headers = Object.assign({ Authorization: 'Bearer ' + tok }, opts.headers || {});
        return fetch(url, opts);
    }
    // Render the "AI is a Pro feature" lock inside an assistant island's
    // conversation area, with a button that opens Stripe Checkout right away.
    function showAiUpgradeLock(island) {
        if (!island) return;
        island.classList.add('open', 'has-convo');
        island.classList.remove('collapsed');
        const convo = island.querySelector('.ai-island-convo, .fav-island-convo');
        if (!convo) return;
        const tr = T[currentLang] || T.en;
        convo.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'ai-lock';
        const icon = document.createElement('div'); icon.className = 'ai-lock-icon'; icon.textContent = '🔒';
        const title = document.createElement('div'); title.className = 'ai-lock-title';
        title.textContent = tr.aiLockTitle || 'Asistente IA — Pro';
        const bodyEl = document.createElement('div'); bodyEl.className = 'ai-lock-body';
        bodyEl.textContent = tr.aiLockBody || 'Mejora a Pro para usar el asistente de IA.';
        const cta = document.createElement('button'); cta.type = 'button'; cta.className = 'ai-lock-cta';
        cta.textContent = tr.aiLockCta || 'Mejorar a Pro';
        cta.addEventListener('click', () => { try { auth._startCheckout('pro'); } catch (_) {} });
        card.append(icon, title, bodyEl, cta);
        convo.appendChild(card);
        convo.scrollTop = 0;
    }
    // ── Plan-based UI gating ──
    // Free accounts get the live map LOCKED behind a blurred upgrade veil; they
    // keep the Feed (up to 5 sources). Pro/Team see the full map. Idempotent —
    // safe to call on app entry and whenever the plan changes.
    let _mapLockWired = false;
    function applyPlanGating() {
        const locked = !isPaidPlan();
        document.body.classList.toggle('plan-locked', locked);
        const lock = document.getElementById('map-lock');
        if (lock) lock.setAttribute('aria-hidden', locked ? 'false' : 'true');
        // Free has no live map, so the "icons per source" map control is useless
        // for them → disable it and show a Pro hint (gates a setting Free can't use).
        const iconRange = document.getElementById('icons-per-source');
        if (iconRange) iconRange.disabled = locked;
        const iconSec = document.getElementById('icons-section');
        if (iconSec) iconSec.classList.toggle('p-locked', locked);
        if (!_mapLockWired) {
            const cta = document.getElementById('map-lock-cta');
            if (cta) { cta.addEventListener('click', () => { try { auth.showPlans(); } catch (_) {} }); _mapLockWired = true; }
        }
        try { renderProfileChip(); } catch (_) {}
    }
    window.applyPlanGating = applyPlanGating;

    // ── Subscription self-service ──
    // Cancel (and un-cancel) the paid plan WITHOUT leaving Skorpene: one button
    // in both profile menus talks to /api/subscription/*. Cancelling keeps the
    // plan until the end of the already-paid period (planUntil); while that is
    // pending the same button flips to "Resume subscription".
    const subCtl = {
        _busy: false,
        _tk(k) {
            const L = T[currentLang] || {};
            return L[k] || (T.en && T.en[k]) || (T.es && T.es[k]) || '';
        },
        _fmtDate(ts) {
            try { return new Date(ts * 1000).toLocaleDateString(currentLang, { year: 'numeric', month: 'short', day: 'numeric' }); }
            catch (_) { return new Date(ts * 1000).toLocaleDateString(); }
        },
        _user() { try { return JSON.parse(localStorage.getItem('geoscope_auth_user') || '{}') || {}; } catch (_) { return {}; } },
        _saveUser(u) { try { localStorage.setItem('geoscope_auth_user', JSON.stringify(u)); } catch (_) {} },
        _closeMenus() {
            ['profile-menu', 'landing-profile-menu'].forEach(id => {
                const m = document.getElementById(id);
                if (m) m.setAttribute('hidden', '');
            });
        },
        // Paint the cancel/resume item of ONE profile menu. Hidden on free.
        renderInto(btnId) {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            const u = this._user();
            const plan = (u.plan || 'free').toLowerCase();
            const paid = plan === 'pro' || plan === 'team';
            btn.hidden = !paid;
            if (!paid) return;
            const pending = !!u.planUntil;
            btn.textContent = pending ? this._tk('subResume') : this._tk('subCancel');
            btn.classList.toggle('lpm-cancelsub', !pending);
            btn.classList.toggle('lpm-resumesub', pending);
            if (pending) btn.title = this._fmtDate(u.planUntil); else btn.removeAttribute('title');
            if (btn.dataset.wired !== '1') {
                btn.dataset.wired = '1';
                btn.addEventListener('click', () => {
                    if (this._user().planUntil) this.resume(); else this.cancel();
                });
            }
        },
        renderAll() { this.renderInto('profile-cancelsub-btn'); this.renderInto('landing-cancelsub-btn'); },
        async _post(path) {
            let tok = '';
            try { tok = localStorage.getItem('geoscope_auth_token') || ''; } catch (_) {}
            if (!tok) return null;
            try {
                const r = await fetch(path, { method: 'POST', headers: { Authorization: 'Bearer ' + tok } });
                const d = await r.json().catch(() => ({}));
                return r.ok ? d : null;
            } catch (_) { return null; }
        },
        async cancel() {
            if (this._busy) return;
            this._closeMenus();
            try { if (!confirm(this._tk('subCancelConfirm'))) return; } catch (_) {}
            this._busy = true;
            try {
                const d = await this._post('/api/subscription/cancel');
                if (!d || !d.ok) { alert(this._tk('subErr')); return; }
                const u = this._user();
                u.plan = d.plan || u.plan;
                u.planUntil = d.until || null;
                this._saveUser(u);
                this._refreshUi();
                alert(d.until
                    ? this._tk('subCancelDone').replace('{date}', this._fmtDate(d.until))
                    : this._tk('subCancelNow'));
            } finally { this._busy = false; }
        },
        async resume() {
            if (this._busy) return;
            this._closeMenus();
            this._busy = true;
            try {
                const d = await this._post('/api/subscription/resume');
                if (!d || !d.ok) { alert(this._tk('subErr')); return; }
                const u = this._user();
                u.planUntil = null;
                this._saveUser(u);
                this._refreshUi();
                alert(this._tk('subResumeDone'));
            } finally { this._busy = false; }
        },
        _refreshUi() {
            // Re-locks the map + re-renders the app chip if the plan dropped to
            // free, and refreshes the landing chip/pricing CTAs.
            try { applyPlanGating(); } catch (_) {}
            try { auth && auth._fillLandingProfile && auth._fillLandingProfile(); } catch (_) {}
            try { auth && auth._refreshPricingCtas && auth._refreshPricingCtas(); } catch (_) {}
            this.renderAll();
        },
    };
    window.subCtl = subCtl;

    // ── Profile chip (top-right) ──
    // Shows the signed-in user + their current plan. Free users get a "Choose
    // plan" pill that opens the plans view. Idempotent.
    let _profileWired = false;
    function renderProfileChip() {
        const chip = document.getElementById('profile-chip');
        if (!chip) return;
        let user = {};
        try { user = JSON.parse(localStorage.getItem('geoscope_auth_user') || '{}') || {}; } catch (_) {}
        const tok = (() => { try { return localStorage.getItem('geoscope_auth_token') || ''; } catch (_) { return ''; } })();
        if (!tok || !user.email) { chip.hidden = true; return; }
        chip.hidden = false;
        const tr = T[currentLang] || T.en;
        const name = user.name || (user.email ? user.email.split('@')[0] : 'Skorpene');
        const plan = (user.plan || 'free').toLowerCase();
        const paid = (plan === 'pro' || plan === 'team');
        const avatar = document.getElementById('profile-avatar');
        const nameEl = document.getElementById('profile-name');
        const planEl = document.getElementById('profile-plan');
        const emailEl = document.getElementById('profile-email');
        if (avatar) avatar.textContent = (name[0] || 'S').toUpperCase();
        if (nameEl) nameEl.textContent = name;
        if (emailEl) emailEl.textContent = user.email || '';
        if (planEl) {
            planEl.classList.toggle('is-choose', !paid);
            planEl.textContent = paid ? (plan === 'team' ? 'Team' : 'Pro') : (tr.planChoose || 'Choose plan');
        }
        const backBtn = document.getElementById('profile-back-btn');
        if (backBtn) backBtn.textContent = tr.backHome || 'Back to home';
        const plansBtn = document.getElementById('profile-plans-btn');
        if (plansBtn) plansBtn.style.display = paid ? 'none' : '';
        const logoutBtn = document.getElementById('profile-logout-btn');
        if (logoutBtn) logoutBtn.textContent = tr.logoutLabel || 'Log out';
        // Dev-only "Reset everything" — shown only for developer accounts.
        const resetBtn = document.getElementById('profile-reset-btn');
        if (resetBtn) {
            const isDev = !!(auth && auth._isDevUser && auth._isDevUser());
            resetBtn.hidden = !isDev;
            resetBtn.textContent = tr.devReset || 'Reset everything (dev)';
        }
        try { subCtl.renderInto('profile-cancelsub-btn'); } catch (_) {}
        if (!_profileWired) {
            _profileWired = true;
            const btn = document.getElementById('profile-chip-btn');
            const menu = document.getElementById('profile-menu');
            const setOpen = (open) => {
                if (!menu) return;
                if (open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', '');
                if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            };
            if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(menu && menu.hasAttribute('hidden')); });
            document.addEventListener('click', () => setOpen(false));
            if (menu) menu.addEventListener('click', e => e.stopPropagation());
            // "Volver a inicio" → re-open the landing over the app (mirror of the
            // landing chip's "Enter app").
            if (backBtn) backBtn.addEventListener('click', () => { setOpen(false); try { auth._showLanding(); } catch (_) {} });
            if (plansBtn) plansBtn.addEventListener('click', () => { setOpen(false); try { auth.showPlans(); } catch (_) {} });
            if (resetBtn) resetBtn.addEventListener('click', () => { setOpen(false); try { auth._devReset(); } catch (_) {} });
            if (logoutBtn) logoutBtn.addEventListener('click', async () => { setOpen(false); try { await auth.logout(); } catch (_) {} location.reload(); });
        }
    }
    window.renderProfileChip = renderProfileChip;
    // Flag that prevents the WS onclose handler from auto-reconnecting.
    let _wsSuppressReconnect = false;

    // ── Source-loading veil ── A blurred, minimalist overlay with a centered
    // localized message, shown while sources load (AI finder OR manual add).
    let _srcLoadCount = 0;
    function showSourceLoading() {
        _srcLoadCount++;
        const ov = document.getElementById('src-loading-overlay');
        const msg = document.getElementById('src-loading-msg');
        if (msg) msg.textContent = t('loadingSources') || 'Cargando fuentes de información…';
        if (ov) { ov.style.display = 'flex'; ov.setAttribute('aria-hidden', 'false'); }
    }
    function hideSourceLoading(force) {
        _srcLoadCount = force ? 0 : Math.max(0, _srcLoadCount - 1);
        if (_srcLoadCount > 0) return;
        const ov = document.getElementById('src-loading-overlay');
        if (ov) { ov.style.display = 'none'; ov.setAttribute('aria-hidden', 'true'); }
    }

    // ── Smooth "typewriter" reveal for streamed AI text ──
    // The network delivers tokens in uneven bursts; rendering each burst as it
    // arrives looks janky. Instead we feed received text into a target buffer and
    // reveal characters at a steady, slightly eased pace — the smooth,
    // character-by-character effect Claude's chat uses.
    // NOTE: driven by setTimeout (NOT requestAnimationFrame) on purpose — rAF is
    // paused when the tab is backgrounded, which would freeze the reveal and leave
    // the bubble stuck on "Pensando…". setTimeout keeps progressing either way.
    function makeTypewriter(el, onTick) {
        let target = '', shown = 0, timer = null, done = false;
        const TICK = 12;   // frequent, small updates → smooth, continuous flow
        const render = () => { if (el) el.textContent = target.slice(0, shown); if (onTick) onTick(); };
        const step = () => {
            timer = null;
            if (shown < target.length) {
                // Reveal a SMALL, capped number of characters every tick. Small +
                // frequent = the smooth, continuous "writing" feel (like Claude),
                // with no big blocks dumped at once. We nudge the rate up only
                // slightly when we've fallen behind a fast stream, never jumping.
                const remaining = target.length - shown;
                const stepSize = Math.min(3, Math.max(1, Math.ceil(remaining / 60)));
                shown += stepSize;
                if (shown > target.length) shown = target.length;
                render();
                timer = setTimeout(step, TICK);
            } else if (done) {
                render();
            }
        };
        return {
            push(text) { target = text; if (!timer) timer = setTimeout(step, TICK); },
            finish(text) {
                if (typeof text === 'string') target = text;
                done = true;
                if (!timer) timer = setTimeout(step, TICK);
            },
            stop() { if (timer) { clearTimeout(timer); timer = null; } },
        };
    }

    // Stream a Claude completion through the backend SSE proxy, with automatic
    // retry on transient overload (Anthropic returns an "overloaded_error" event
    // when capacity is tight — common, and the #1 cause of the assistant seeming
    // to fail or stall). onText(fullSoFar) fires as text accumulates. Returns the
    // final text, or throws { offline } / { overloaded } / { message }.
    async function streamClaude(payload, onText) {
        const MAX = 4;
        const STREAM_TIMEOUT = 22000;   // guard against a hung/stalled stream
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        for (let attempt = 0; attempt < MAX; attempt++) {
            const last = attempt === MAX - 1;
            const ctrl = new AbortController();
            const killer = setTimeout(() => ctrl.abort(), STREAM_TIMEOUT);
            let retry = false;
            try {
                const res = await aiFetch('/api/claude', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...payload, stream: true }), signal: ctrl.signal,
                });
                if (!res) throw { offline: true };
                if (!res.ok || !res.body) {
                    // Plan gates from the server — surface them as typed errors so
                    // the chat can show an upgrade / quota message, never a retry.
                    if (res.status === 403) throw { planRequired: true };
                    if (res.status === 429) throw { quotaExceeded: true };
                    let m = ''; try { const d = await res.json(); m = (d && d.error && (d.error.message || d.error)) || ''; } catch (_) {}
                    const over = res.status === 529 || /overload/i.test(m);
                    if (over && !last) retry = true;
                    else throw over ? { overloaded: true } : { message: m };
                } else {
                    const reader = res.body.getReader();
                    const dec = new TextDecoder();
                    let buf = '', answer = '', errType = '', gotText = false;
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;
                        buf += dec.decode(value, { stream: true });
                        let nl;
                        while ((nl = buf.indexOf('\n')) >= 0) {
                            const line = buf.slice(0, nl).trim();
                            buf = buf.slice(nl + 1);
                            if (!line.startsWith('data:')) continue;
                            const p = line.slice(5).trim();
                            if (!p || p === '[DONE]') continue;
                            let ev; try { ev = JSON.parse(p); } catch (_) { continue; }
                            if (ev.type === 'content_block_delta' && ev.delta && typeof ev.delta.text === 'string') {
                                answer += ev.delta.text; gotText = true; if (onText) onText(answer);
                            } else if (ev.type === 'error') {
                                errType = (ev.error && (ev.error.type || ev.error.message)) || 'error';
                            }
                        }
                    }
                    if (gotText) return answer;
                    const over = /overload/i.test(errType);
                    if (over && !last) retry = true;
                    else throw over ? { overloaded: true } : { message: errType || 'empty' };
                }
            } catch (e) {
                // Intentional control-flow throws bubble up immediately.
                if (e && (e.offline || e.overloaded || e.planRequired || e.quotaExceeded || e.message !== undefined)) throw e;
                // AbortError (hung stream) or a network error → retry if any left.
                if (last) throw { overloaded: true };
                retry = true;
            } finally {
                clearTimeout(killer);
            }
            if (retry) await sleep(500 * Math.pow(2, attempt));
        }
        throw { overloaded: true };
    }

    // Non-streaming Claude call with the same transient-overload retry as the
    // streaming path. Returns the joined text content, or null on hard failure.
    // Used by the AI source finder and the icon geolocator so they survive the
    // overload spikes that were making them silently produce nothing.
    async function claudeComplete(payload) {
        const MAX = 4;
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        for (let attempt = 0; attempt < MAX; attempt++) {
            let res;
            try {
                res = await aiFetch('/api/claude', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } catch (_) { return null; }
            if (!res) return null;
            const data = await res.json().catch(() => null);
            if (!res.ok) {
                const m = (data && data.error && (data.error.message || data.error)) || '';
                if ((res.status === 529 || /overload/i.test(m)) && attempt < MAX - 1) { await sleep(500 * Math.pow(2, attempt)); continue; }
                return null;
            }
            let txt = '';
            if (data && Array.isArray(data.content)) txt = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
            return txt;
        }
        return null;
    }

    // Run a forced refresh and wait for it to finish (news Step 1 + icon Step 2),
    // but never hang the UI longer than maxMs. Lets the source-loading veil stay
    // up until news AND icons are actually on screen, with a hard safety cap.
    function _refreshAndWait(maxMs) {
        return Promise.race([
            Promise.resolve().then(() => geoFeed.refresh(true)).catch(() => {}),
            new Promise(r => setTimeout(r, maxMs || 35000)),
        ]);
    }

    // Strip stray Markdown the model may still emit, so answers read as clean prose.
    function stripMarkdown(s) {
        if (!s) return s;
        return s
            .replace(/```[\s\S]*?```/g, m => m.replace(/```\w*\n?/g, '').replace(/```/g, ''))
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/(^|\s)\*([^*\n]+)\*/g, '$1$2')
            .replace(/^#{1,6}\s+/gm, '')
            .replace(/^\s*[-•]\s+/gm, '')
            .replace(/`([^`]+)`/g, '$1');
    }

    // ── AI language helper ──
    // The assistant replies in the language the USER wrote in (not the UI
    // language). The UI language is only a fallback hint for the very first
    // greeting, before the user has typed anything.
    // Used by aiAssistant.send and by any other client-side call to /api/claude
    // that produces user-facing text (vs. structured JSON-only calls).
    const AI_LANG_NAMES = {
        es: 'Spanish (español)', en: 'English', fr: 'French (français)',
        ru: 'Russian (русский)', zh: 'Chinese (中文)', tr: 'Turkish (Türkçe)',
        ar: 'Arabic (العربية)', fa: 'Persian (فارسی)', he: 'Hebrew (עברית)',
        nl: 'Dutch (Nederlands)', it: 'Italian (italiano)', hi: 'Hindi (हिन्दी)',
        pt: 'Portuguese (português)',
    };
    function _aiLangName() { return AI_LANG_NAMES[currentLang] || AI_LANG_NAMES.en; }
    // The user's chosen topics (English labels) + whether they have any sources.
    // Used to keep the assistant topic-agnostic: it adapts to whatever the user
    // picked instead of assuming geopolitics.
    function _userProfileForAI() {
        let p = {};
        try { p = JSON.parse(localStorage.getItem('geoscope_profile') || '{}') || {}; } catch (_) {}
        const topics = [];
        (p.topics || []).forEach(id => {
            const tp = (typeof ONB_TOPICS !== 'undefined') && ONB_TOPICS.find(x => x.id === id);
            topics.push(tp ? (tp.t.en || id) : id);
        });
        if (p.topicsText) topics.push(String(p.topicsText));
        return { topics, hasSources: ((geoFeed.sources || []).length > 0) };
    }
    // Shared with both assistants (map island + Feed box). Lets the STREAMING
    // model itself add/remove sources by replying with an inline directive the
    // client executes — this is what makes "add sources about X" work with ANY
    // phrasing/typo/language ("ad one source about soccer in morocco") instead
    // of only the ones the quick regex gate catches. Zero extra API calls: the
    // directive rides the normal answer.
    const AI_SOURCES_DIRECTIVE = `
SOURCE MANAGEMENT — you CAN add and remove the user's news sources yourself:
• If the user asks you to ADD sources (add / find / follow / subscribe to feeds, channels or sites
  about some topic), reply with ONLY this single line — no other words before or after it:
  ##SOURCES## {"action":"add","items":[{"type":"telegram","value":"@handle","name":"Display Name"},{"type":"rss","value":"https://feed-url","name":"Display Name"}]}
  Pick REAL, active, well-known sources that match what they asked (type "rss": value MUST be the
  feed URL). Honor an explicit count if the user names one ("one source", "3 fuentes") — return
  exactly that many; otherwise return 6-10.
• If the user asks you to REMOVE / stop following sources, reply with ONLY:
  ##SOURCES## {"action":"remove","ids":["<source name or handle exactly as the user refers to it>"]}
• NEVER claim you cannot add or remove sources — you can, via that directive. Do not mention the
  directive in normal answers, and never emit it unless the user is clearly asking for it.`;

    function _aiSystemPrompt(context) {
        const lang = _aiLangName();
        const prof = _userProfileForAI();
        // Topic framing — NEVER assume geopolitics. Adapt to the user's picks.
        let framing;
        if (prof.topics.length) {
            framing = `The user's chosen topics are: ${prof.topics.join(', ')}. Center your help around ` +
                `these interests. (Only treat geopolitics as the focus if it is actually in that list.)`;
        } else {
            framing = `The user has NOT chosen any topics yet, so do NOT assume what they care about. ` +
                `Stay general and friendly; this app adapts to whatever the user is into — world news, ` +
                `sports, technology, finance, science, a hobby, anything. Never describe yourself as a ` +
                `"geopolitics" guide unless the user brings up geopolitics themselves.`;
        }
        // Onboarding nudge when there are no sources yet.
        const noSourcesNudge = prof.hasSources ? '' :
            `\nThe user has not added any news sources yet. If they greet you or ask what you can do, ` +
            `introduce yourself briefly and warmly as their personal assistant, and invite them — whenever ` +
            `they like — to add their own sources (Telegram channels, websites, Reddit communities, their ` +
            `favourite news outlets) so you can keep them informed and answer anything about their favourite ` +
            `topics. Keep it short and inviting, not a wall of text.`;

        return `You are the assistant inside Skorpene, a personal app that adapts to WHATEVER topics and
sources the user cares about. You are a warm, knowledgeable, genuinely helpful assistant — like a smart
friend the user can ask anything. You are NOT a geopolitics-only tool; do not assume the user's interests.
${framing}${noSourcesNudge}
${AI_SOURCES_DIRECTIVE}

HOW TO ANSWER — this matters a lot:
• Write like a real person talking, not like a report. Warm, direct, confident. No corporate hedging.
• Be genuinely informative and complete. Give the context, the background, the "why" — enough that the
  user truly understands. Depth over brevity, but never padding.
• ALWAYS finish your thought. Never stop mid-sentence or trail off.
• PLAIN TEXT ONLY. Do NOT use Markdown. No asterisks (* or **), no #, no backticks, no bullet characters,
  no tables. Write in natural flowing paragraphs.
• GROUND YOURSELF IN THE USER'S NEWS when they have sources. The data below is the live feed from the
  sources the user chose. When they ask about a topic or "the news", READ those items, reason over them,
  connect them, and explain what they mean — never ignore them to answer only from generic knowledge.
  Blend in your own background knowledge for context, but their feed is your primary material.
• LANGUAGE — this is critical: reply in the SAME language the user wrote their
  most recent message in. Detect it from their words, not from any app setting.
  You know every language in the world, so if the user writes in a language that
  is NOT one of the app's interface languages, you STILL answer fully in that
  language. The app's interface is currently set to ${lang}; use that ONLY as a
  fallback for a first greeting before the user has written anything. Never switch
  the user to a different language than the one they just used.

${context}`;
    }

    // ── AI assistant (Claude via the /api/claude backend proxy) ──
    // The user asks questions; we send the current map/news data as context and
    // render Claude's answer. The API key lives ONLY on the server (env var).
    // ── Conversation persistence ── both assistant chats survive a tab reload
    // (user request: "toda la conversación desaparece al recargar"). Saved
    // per-account (key suffixed with the user id) only at points where a turn
    // has its FINAL text — never the "Pensando…" placeholder — and restored on
    // init, capped to the last 30 turns.
    function _convoKey(base) {
        let uid = 'anon';
        try {
            const u = JSON.parse(localStorage.getItem('geoscope_auth_user') || 'null');
            if (u && (u.id != null || u.email)) uid = String(u.id != null ? u.id : u.email);
        } catch (_) {}
        return base + ':' + uid;
    }
    function _saveConvo(base, history) {
        try {
            const h = (history || []).filter(m =>
                m && (m.role === 'user' || m.role === 'assistant' || m.role === 'analyze')).slice(-30);
            localStorage.setItem(_convoKey(base), JSON.stringify(h));
        } catch (_) {}
    }
    function _loadConvo(base) {
        try {
            const arr = JSON.parse(localStorage.getItem(_convoKey(base)) || 'null');
            return Array.isArray(arr) ? arr.slice(-30) : [];
        } catch (_) { return []; }
    }

    const aiAssistant = {
        history: [],          // [{role, content}] conversation turns
        busy: false,
        init() {
            const island = document.getElementById('ai-island');
            const input = document.getElementById('ai-island-input');
            const send = document.getElementById('ai-island-send');
            const toggle = document.getElementById('ai-island-toggle');
            if (!island) return;

            const fire = () => this.send();
            if (send) send.addEventListener('click', fire);
            if (input) {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') { e.preventDefault(); fire(); }
                });
                // Focusing re-opens a collapsed conversation.
                input.addEventListener('focus', () => {
                    island.classList.add('focus');
                    if (island.classList.contains('has-convo')) island.classList.remove('collapsed');
                });
            }
            // Fold / unfold the conversation so it doesn't cover the map.
            if (toggle) toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                island.classList.toggle('collapsed');
                this._scrollConvo();
            });
            // Restore the conversation from before the reload. Collapsed on
            // purpose: it unfolds when the user focuses the input again.
            this.history = _loadConvo('geoscope_ai_convo');
            if (this.history.length) {
                this._renderConvo();
                island.classList.add('has-convo', 'collapsed');
            }
        },
        // Build grounding context: the user's live news feed (primary) + the map
        // events. This is what lets the assistant actually read and explain the
        // user's news instead of answering from generic knowledge alone.
        buildContext() {
            const lang = (T[currentLang] && currentLang) || 'es';
            // News from the user's own sources — headlines + summaries, newest first.
            const news = [];
            for (let i = 0; i < newsItems.length && news.length < 50; i++) {
                const it = newsItems[i];
                if (geoFeed.isChannelHidden && geoFeed.isChannelHidden(it.channel)) continue;
                const src = (it.channel || '').trim();
                const when = it.timestamp ? String(it.timestamp).slice(0, 10) : '';
                const msg = _cleanMessage(it.message || '').replace(/\s+/g, ' ').slice(0, 260);
                if (!msg) continue;
                news.push(`- [${src}${when ? ', ' + when : ''}] ${msg}`);
            }
            const srcNames = (geoFeed.sources || []).map(s => s.name || s.value).filter(Boolean);
            // Map events (icons currently placed).
            const ev = [];
            for (const id of Object.keys(eventsById)) {
                const data = eventsById[id];
                if (!data) continue;
                const loc = data.location ||
                    (data.lat != null ? `${Number(data.lat).toFixed(2)},${Number(data.lng).toFixed(2)}` : '');
                const label = data.event_label || data.event_cat || '';
                const icon = data.event_icon || '';
                ev.push(`- ${icon} ${label} @ ${loc}`.trim());
                if (ev.length >= 40) break;
            }
            let ctx = '';
            // If the user opened specific news via "Analyze", put those FIRST and
            // make them the focus of the conversation.
            if (this._analyzeItems && this._analyzeItems.length) {
                const foc = this._analyzeItems.map((it, i) => {
                    const src = (it.channel || '').trim();
                    const when = it.timestamp ? String(it.timestamp).slice(0, 10) : '';
                    const msg = _cleanMessage(it.message || '').replace(/\s+/g, ' ').slice(0, 700);
                    return `${this._analyzeItems.length > 1 ? (i + 1) + '. ' : ''}[${src}${when ? ', ' + when : ''}] ${msg}`;
                }).join('\n\n');
                ctx += `The user selected THESE specific news item(s) to analyze — center the conversation on them, answer questions about them, and explain/expand as asked:\n${foc}\n\n`;
            }
            if (srcNames.length) ctx += `The user's chosen sources: ${srcNames.join(', ')}.\n\n`;
            ctx += news.length
                ? `LIVE NEWS from the user's sources (newest first) — read and use these:\n${news.join('\n')}\n\n`
                : 'No news has loaded from the user\'s sources yet.\n\n';
            ctx += ev.length
                ? `Event icons currently on the map (${ev.length}):\n${ev.join('\n')}\n\n`
                : '';
            ctx += `App interface language (fallback only): ${lang}. Always answer in the language of the user's own message.`;
            return ctx;
        },
        // Conversation rendering — bubbles for each turn; the last assistant bubble
        // is the live-streaming one. Returns that element so the stream can fill it.
        // An 'analyze' entry renders as a card showing the news being discussed.
        _renderConvo() {
            const convo = document.getElementById('ai-island-convo');
            if (!convo) return null;
            convo.innerHTML = '';
            let last = null;
            this.history.forEach(m => {
                if (m.role === 'analyze') {
                    convo.appendChild(_renderNewsCard(m.items));
                    return;
                }
                const el = document.createElement('div');
                el.className = 'ai-msg ai-msg-' + (m.role === 'user' ? 'user' : 'bot');
                el.textContent = m.content;
                convo.appendChild(el);
                last = el;
            });
            return last;
        },
        _scrollConvo() {
            const convo = document.getElementById('ai-island-convo');
            if (convo) convo.scrollTop = convo.scrollHeight;
        },
        async send() {
            const input = document.getElementById('ai-island-input');
            const island = document.getElementById('ai-island');
            if (!input || this.busy) return;
            const q = input.value.trim();
            if (!q) return;
            // Plan gate: AI is Pro/Team only. Free accounts see the upgrade lock
            // instead of sending (the server also rejects, this is just instant UX).
            if (!isPaidPlan()) { input.value = ''; showAiUpgradeLock(island); return; }
            input.value = '';
            this.busy = true;
            // Open + uncollapse + mark as a conversation (widens via CSS).
            island.classList.add('open', 'has-convo');
            island.classList.remove('collapsed');
            this.history.push({ role: 'user', content: q });
            // Add a placeholder assistant turn that we stream into.
            this.history.push({ role: 'assistant', content: t('aiThinking') || 'Pensando…' });
            let bubble = this._renderConvo();
            if (bubble) bubble.classList.add('ai-msg-pending');
            this._scrollConvo();

            // Source-adding shortcut: if the user is asking to ADD sources, let
            // Claude pick them and add them (icons appear on the map; the blur
            // veil shows while news loads) instead of a normal answer. Falls
            // through to a normal answer if it isn't actually a source request.
            if (aiSourceFinder.looksLikeSourceRequest(q)) {
                try {
                    const res = await aiSourceFinder.runForChat(q);
                    if (res.handled) {
                        this.history[this.history.length - 1].content = _sourceActionMsg(res);
                        _saveConvo('geoscope_ai_convo', this.history);
                        bubble = this._renderConvo();
                        if (bubble) bubble.classList.remove('ai-msg-pending');
                        this._scrollConvo();
                        this.busy = false;
                        return;
                    }
                } catch (_) {}
            }

            // Build the request from history WITHOUT the empty placeholder, and
            // WITHOUT the visual-only 'analyze' cards (not valid API turns — the
            // selected news are injected via buildContext instead).
            const msgs = this.history.slice(0, -1)
                .filter(m => m.role === 'user' || m.role === 'assistant')
                .slice(-12);
            // The API requires the first message to be from the user. After an
            // "Analyze" action the history opens with the assistant's greeting —
            // drop any leading assistant turns so the request stays valid.
            while (msgs.length && msgs[0].role !== 'user') msgs.shift();
            const system = _aiSystemPrompt(this.buildContext());
            const fail = (msg) => {
                this.history[this.history.length - 1].content = msg;
                _saveConvo('geoscope_ai_convo', this.history);
                bubble = this._renderConvo();
                if (bubble) bubble.classList.add('ai-msg-error');
                this._scrollConvo();
            };
            if (bubble) bubble.classList.remove('ai-msg-pending');
            const typer = makeTypewriter(bubble, () => this._scrollConvo());
            try {
                const answer = stripMarkdown((await streamClaude(
                    { system, max_tokens: 2048, count_quota: true, messages: msgs },
                    // Hold the typewriter back while the reply may be an inline
                    // ##SOURCES## directive — raw JSON must never be shown.
                    (sofar) => { if (/^#/.test(sofar.trimStart())) return; typer.push(stripMarkdown(sofar)); }
                )).trim());
                if (!answer) { fail(t('aiError') || 'Error'); return; }
                // Inline source directive: the robust add/remove path for any
                // phrasing the quick regex gate missed. Execute it and show the
                // localized confirmation instead of the raw reply.
                if (answer.indexOf('##SOURCES##') === 0) {
                    typer.stop();
                    const dObj = aiSourceFinder._parseObj(answer.slice(11));
                    const dRes = dObj ? await aiSourceFinder.applyDirective(dObj) : { handled: false };
                    this.history[this.history.length - 1].content =
                        dRes.handled ? _sourceActionMsg(dRes) : (t('aiError') || 'Error');
                    _saveConvo('geoscope_ai_convo', this.history);
                    bubble = this._renderConvo();
                    this._scrollConvo();
                    return;
                }
                typer.finish(answer);
                this.history[this.history.length - 1].content = answer;
                _saveConvo('geoscope_ai_convo', this.history);
            } catch (e) {
                typer.stop();
                if (e && e.planRequired) fail(t('aiPlanRequired') || 'Función de pago.');
                else if (e && e.quotaExceeded) fail(t('aiQuotaReached') || 'Límite diario alcanzado.');
                else fail(e && e.overloaded ? (t('aiOverloaded') || t('aiError') || 'Error') : (t('aiError') || 'Error'));
            } finally {
                this.busy = false;
            }
        },
        // Open the assistant focused on specific news item(s) picked from the news
        // panel's "Analyze" context-menu action. The item(s) show as a card in the
        // chat and the assistant greets, inviting questions about them.
        analyzeNews(items) {
            const island = document.getElementById('ai-island');
            if (!island || !items || !items.length) return;
            // Free accounts: AI is Pro-only — route to the upgrade lock instead.
            if (!isPaidPlan()) { showAiUpgradeLock(island); return; }
            this._analyzeItems = items.slice();
            island.classList.add('open', 'has-convo');
            island.classList.remove('collapsed');
            const tr = T[currentLang] || T.en;
            const greet = items.length > 1
                ? (tr.aiAnalyzeGreetN || '¿Qué quieres saber sobre estas {n} noticias?').replace('{n}', items.length)
                : (tr.aiAnalyzeGreet1 || '¿Qué quieres saber sobre esta noticia?');
            // A visual news card, then the assistant's greeting.
            this.history.push({ role: 'analyze', items: items.slice() });
            this.history.push({ role: 'assistant', content: greet });
            _saveConvo('geoscope_ai_convo', this.history);
            this._renderConvo();
            this._scrollConvo();
            const input = document.getElementById('ai-island-input');
            if (input) try { input.focus(); } catch (_) {}
        }
    };

    // ── "Caja de temas favoritos" (Favorite Topics Box) ──
    // A full-screen tab — NO map. It is a NEWS READER: it shows ALL the news from
    // the sources the user has added, like a noticiero. Plus a small, minimalist
    // Dynamic-Island-style box to ask the AI about that news. The AI is grounded
    // in the user's current feed (newsItems).
    const favBox = {
        history: [],
        busy: false,
        init() {
            const fab = document.getElementById('fav-fab');
            const closeBtn = document.getElementById('fav-close');
            const overlay = document.getElementById('fav-overlay');
            const island = document.getElementById('fav-island');
            const send = document.getElementById('fav-island-send');
            const input = document.getElementById('fav-island-input');
            if (fab) fab.addEventListener('click', () => this.open());
            if (closeBtn) closeBtn.addEventListener('click', () => this.close());
            if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) this.close(); });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && overlay && overlay.style.display !== 'none') this.close();
            });
            const toggle = document.getElementById('fav-island-toggle');
            if (send) send.addEventListener('click', () => this.send());
            if (input) {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') { e.preventDefault(); this.send(); }
                });
                // Focusing re-opens a collapsed conversation.
                input.addEventListener('focus', () => {
                    if (!island) return;
                    island.classList.add('open');
                    if (island.classList.contains('has-convo')) island.classList.remove('collapsed');
                });
            }
            // Fold / unfold the conversation.
            if (toggle) toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (island) island.classList.toggle('collapsed');
                this._scrollConvo();
            });
            // Re-render the reader live as new posts arrive while it's open.
            this._renderHook = () => { if (overlay && overlay.style.display !== 'none') this.renderFeed(); };
            // Restore the conversation from before the reload (same as the map
            // island): collapsed until the user focuses the input again.
            this.history = _loadConvo('geoscope_fav_convo');
            if (this.history.length) {
                this._renderConvo();
                if (island) island.classList.add('has-convo', 'collapsed');
            }
        },
        open() {
            const overlay = document.getElementById('fav-overlay');
            if (!overlay) return;
            this.renderFeed();
            overlay.style.display = 'flex';
            overlay.setAttribute('aria-hidden', 'false');
            try { applyLang(); } catch (_) {}
            // If the feed is sparse, kick a refresh so the reader fills up.
            try { if (newsItems.length < 5) geoFeed.refresh(true); } catch (_) {}
        },
        close() {
            const overlay = document.getElementById('fav-overlay');
            if (!overlay) return;
            overlay.style.display = 'none';
            overlay.setAttribute('aria-hidden', 'true');
            const island = document.getElementById('fav-island');
            if (island) island.classList.remove('open');
        },
        // The news reader: ALL items from the user's sources, newest first.
        renderFeed() {
            const feed = document.getElementById('fav-feed');
            if (!feed) return;
            const tr = T[currentLang] || T.en;
            const items = [];
            for (let i = 0; i < newsItems.length && items.length < 120; i++) {
                const it = newsItems[i];
                if (geoFeed.isChannelHidden && geoFeed.isChannelHidden(it.channel)) continue;
                items.push(it);
            }
            const countEl = document.getElementById('fav-count');
            if (countEl) {
                const nSrc = (geoFeed.sources || []).length;
                countEl.textContent = items.length
                    ? `${items.length} ${(tr.favItems || 'noticias')} · 📡 ${nSrc}`
                    : '';
            }
            if (!items.length) {
                feed.innerHTML = `<div class="fav-feed-empty">${escapeHtml((geoFeed.sources || []).length ? (tr.favLoading || 'Cargando noticias de tus fuentes…') : (tr.favNoSources || ''))}</div>`;
                return;
            }
            feed.innerHTML = items.map(it => {
                const icon = it.event_icon || '📰';
                const channel = escapeHtml(it.channel || '');
                const time = it.timestamp ? `${it.timestamp.substring(5, 10)} ${it.timestamp.substring(11, 16)}` : '';
                const clean = _cleanMessage(it.message || '');
                const nl = clean.indexOf('\n');
                const title = escapeHtml((nl > 0 ? clean.slice(0, nl) : clean).slice(0, 180));
                const body = nl > 0 ? escapeHtml(clean.slice(nl).trim().slice(0, 300)) : '';
                const loc = it.location ? `<span class="fav-news-loc">📍 ${escapeHtml(it.location)}</span>` : '';
                const img = it.image ? `<img class="fav-news-img" loading="lazy" src="${escapeHtml(it.image)}" alt="">` : '';
                const link = it.link
                    ? `<a class="fav-news-link" href="${escapeHtml(it.link)}" target="_blank" rel="noopener noreferrer">↗</a>` : '';
                return `<article class="fav-news-item"${it.event_id ? ` data-event-id="${escapeHtml(it.event_id)}"` : ''}>
                    ${img}
                    <div class="fav-news-main">
                        <div class="fav-news-top"><span class="fav-news-src">${icon} ${channel}</span><span class="fav-news-when">${time}</span></div>
                        <div class="fav-news-title">${title}</div>
                        ${body ? `<div class="fav-news-body">${body}</div>` : ''}
                        <div class="fav-news-foot">${loc}${link}</div>
                    </div>
                </article>`;
            }).join('');
        },
        // Scroll the feed to a specific news item (by event_id) and flash it —
        // used by the news panel's "Show in feed" context-menu action.
        showItem(eventId) {
            if (!eventId) return;
            const feed = document.getElementById('fav-feed');
            if (!feed) return;
            const find = () => feed.querySelector(`.fav-news-item[data-event-id="${(window.CSS && CSS.escape) ? CSS.escape(eventId) : eventId}"]`);
            const go = () => {
                const el = find();
                if (!el) return false;
                el.scrollIntoView({ block: 'center', behavior: 'smooth' });
                el.classList.remove('fav-news-flash');
                void el.offsetWidth;
                el.classList.add('fav-news-flash');
                setTimeout(() => el.classList.remove('fav-news-flash'), 1800);
                return true;
            };
            // The feed may still be rendering when opened — retry briefly.
            if (go()) return;
            let tries = 0;
            const timer = setInterval(() => { if (go() || ++tries > 20) clearInterval(timer); }, 150);
        },
        // Ground the AI in the user's CURRENT feed — headlines + summaries from the
        // sources they follow, newest first.
        buildContext() {
            const lines = [];
            for (let i = 0; i < newsItems.length && lines.length < 60; i++) {
                const it = newsItems[i];
                if (geoFeed.isChannelHidden && geoFeed.isChannelHidden(it.channel)) continue;
                const src = (it.channel || '').trim();
                const when = it.timestamp ? String(it.timestamp).slice(0, 10) : '';
                const msg = _cleanMessage(it.message || '').replace(/\s+/g, ' ').slice(0, 240);
                if (!msg) continue;
                lines.push(`- [${src}${when ? ', ' + when : ''}] ${msg}`);
            }
            const srcNames = (geoFeed.sources || []).map(s => s.name || s.value).filter(Boolean);
            const head = srcNames.length ? `User's sources: ${srcNames.join(', ')}.\n\n` : '';
            return head + (lines.length
                ? `Recent items from those sources (newest first):\n${lines.join('\n')}`
                : 'No items have loaded from the user\'s sources yet.');
        },
        _systemPrompt() {
            const lang = _aiLangName();
            return `You are the assistant inside the user's "Favorite Topics Box" in Skorpene. Below is
the live feed of news from the sources the user themselves chose. Your job is to help them explore
and truly understand THIS news.
${AI_SOURCES_DIRECTIVE}

HOW TO ANSWER:
• Read the items below, reason over them, connect them, and explain what they mean. When the user
  asks for a summary or synthesis, base it on these specific items and what the sources report —
  never ignore them to answer only from generic knowledge. Add your own background knowledge for
  context, but their feed is your primary material.
• Talk like a knowledgeable person, warm and clear and complete — never trail off mid-thought.
• PLAIN TEXT ONLY: no Markdown, no asterisks, no #, no bullet characters. Natural paragraphs.
• IMPORTANT: Always reply in ${lang}.

${this.buildContext()}`;
        },
        // Conversation rendering — same model as the map island.
        _renderConvo() {
            const convo = document.getElementById('fav-island-convo');
            if (!convo) return null;
            convo.innerHTML = '';
            this.history.forEach(m => {
                const el = document.createElement('div');
                el.className = 'fav-msg fav-msg-' + (m.role === 'user' ? 'user' : 'bot');
                el.textContent = m.content;
                convo.appendChild(el);
            });
            return convo.lastElementChild;
        },
        _scrollConvo() {
            const convo = document.getElementById('fav-island-convo');
            if (convo) convo.scrollTop = convo.scrollHeight;
        },
        async send() {
            const input = document.getElementById('fav-island-input');
            const island = document.getElementById('fav-island');
            if (!input || this.busy) return;
            const q = input.value.trim();
            if (!q) return;
            const tr = T[currentLang] || T.en;
            // Plan gate — same as the map assistant. Free accounts get the lock.
            if (!isPaidPlan()) { input.value = ''; showAiUpgradeLock(island); return; }
            input.value = '';
            this.busy = true;
            if (island) { island.classList.add('open', 'has-convo'); island.classList.remove('collapsed'); }
            this.history.push({ role: 'user', content: q });
            this.history.push({ role: 'assistant', content: tr.favThinking || 'Pensando…' });
            let bubble = this._renderConvo();
            if (bubble) bubble.classList.add('fav-island-pending');
            this._scrollConvo();

            // Source-adding shortcut (same as the map assistant): ask the AI to
            // add sources → it picks + adds them, icons appear, the veil shows.
            if (aiSourceFinder.looksLikeSourceRequest(q)) {
                try {
                    const res = await aiSourceFinder.runForChat(q);
                    if (res.handled) {
                        this.history[this.history.length - 1].content = _sourceActionMsg(res);
                        _saveConvo('geoscope_fav_convo', this.history);
                        bubble = this._renderConvo();
                        if (bubble) bubble.classList.remove('fav-island-pending');
                        this._scrollConvo();
                        try { this.renderFeed(); } catch (_) {}
                        this.busy = false;
                        return;
                    }
                } catch (_) {}
            }

            const msgs = this.history.slice(0, -1).slice(-10);
            const fail = (msg) => {
                this.history[this.history.length - 1].content = msg;
                _saveConvo('geoscope_fav_convo', this.history);
                bubble = this._renderConvo();
                if (bubble) bubble.classList.add('fav-island-error');
                this._scrollConvo();
            };
            if (bubble) bubble.classList.remove('fav-island-pending');
            const typer = makeTypewriter(bubble, () => this._scrollConvo());
            try {
                const answer = stripMarkdown((await streamClaude(
                    { system: this._systemPrompt(), max_tokens: 1500, count_quota: true, messages: msgs },
                    // Hold the typewriter back while the reply may be an inline
                    // ##SOURCES## directive — raw JSON must never be shown.
                    (sofar) => { if (/^#/.test(sofar.trimStart())) return; typer.push(stripMarkdown(sofar)); }
                )).trim());
                if (!answer) { fail(tr.favError || 'Error'); return; }
                // Inline source directive (same as the map assistant).
                if (answer.indexOf('##SOURCES##') === 0) {
                    typer.stop();
                    const dObj = aiSourceFinder._parseObj(answer.slice(11));
                    const dRes = dObj ? await aiSourceFinder.applyDirective(dObj) : { handled: false };
                    this.history[this.history.length - 1].content =
                        dRes.handled ? _sourceActionMsg(dRes) : (tr.favError || 'Error');
                    _saveConvo('geoscope_fav_convo', this.history);
                    bubble = this._renderConvo();
                    this._scrollConvo();
                    try { this.renderFeed(); } catch (_) {}
                    return;
                }
                typer.finish(answer);
                this.history[this.history.length - 1].content = answer;
                _saveConvo('geoscope_fav_convo', this.history);
            } catch (e) {
                typer.stop();
                if (e && e.planRequired) fail(tr.aiPlanRequired || 'Función de pago.');
                else if (e && e.quotaExceeded) fail(tr.aiQuotaReached || 'Límite diario alcanzado.');
                else fail(e && e.overloaded ? (tr.aiOverloaded || tr.favError || 'Error') : (tr.favError || 'Error'));
            } finally {
                this.busy = false;
            }
        }
    };

    // ── Phase 2: AI icon curation ──
    // Claude picks the single best emoji for each event when the backend's icon
    // doesn't fit the headline. Results are cached per event_id in localStorage so
    // each event is only curated once (keeps cost low; uses the cheap default model).
    const iconCurator = {
        LS_KEY: 'geoscope_ai_icons',
        running: false,
        _timer: null,
        _failed: false,        // becomes true if /api/claude is unavailable — stop trying this session
        init() {
            try { _aiIconCache = JSON.parse(localStorage.getItem(this.LS_KEY) || '{}') || {}; }
            catch (_) { _aiIconCache = {}; }
        },
        save() { try { localStorage.setItem(this.LS_KEY, JSON.stringify(_aiIconCache)); } catch (_) {} },
        // Re-skin a marker after its emoji changed.
        _refresh(id) {
            const m = eventMarkers[id];
            if (m && m.setIcon && eventsById[id]) {
                try { m.setIcon(buildEventDivIcon(eventsById[id])); } catch (_) {}
            }
        },
        schedule() {
            if (this._failed) return;
            if (!isAiEnabled()) return;           // AI master switch off → skip
            clearTimeout(this._timer);
            this._timer = setTimeout(() => this._run(), 3500);
        },
        async _run() {
            if (this.running || this._failed) return;
            if (!isAiEnabled()) return;           // double-check at run time
            // Events not yet curated. geoFeed articles ('gf|') are excluded: they
            // already carry the country-flag emoji from the local gazetteer, and
            // sending every feed article here would burn AI credits per refresh.
            const todo = Object.keys(eventsById).filter(id => !_aiIconCache[id] && id.indexOf('gf|') !== 0);
            if (!todo.length) return;
            this.running = true;
            const batch = todo.slice(0, 25);
            const items = batch.map(id => {
                const ev = eventsById[id];
                return { id, text: [ev.event_label, ev.location, ev.event_cat].filter(Boolean).join(' — ') };
            });
            const system =
                'Eres un curador de iconos. Para cada elemento (una breve descripción de un evento ' +
                'geopolítico), elige el ÚNICO emoji que mejor lo represente. Responde SOLO con un array ' +
                'JSON, sin texto extra, con el formato: [{"id":"<id>","emoji":"<un emoji>"}].';
            try {
                const res = await aiFetch('/api/claude', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system, max_tokens: 1024,
                        messages: [{ role: 'user', content: JSON.stringify(items) }],
                    }),
                });
                if (!res) return;                  // AI off → exit cleanly, don't mark _failed
                if (!res.ok) { this._failed = true; return; }
                const data = await res.json();
                let txt = '';
                if (Array.isArray(data.content)) txt = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
                const match = txt.match(/\[[\s\S]*\]/);
                if (!match) return;
                const arr = JSON.parse(match[0]);
                let changed = 0;
                arr.forEach(o => {
                    if (o && o.id && o.emoji && eventsById[o.id]) {
                        _aiIconCache[o.id] = o.emoji;
                        this._refresh(o.id);
                        changed++;
                    }
                });
                if (changed) { this.save(); try { scheduleNewsRender(); } catch (_) {} }
            } catch (e) {
                this._failed = true;   // backend/AI unavailable — stop for this session
            } finally {
                this.running = false;
                // More to do? Continue after a short throttle.
                if (!this._failed && Object.keys(eventsById).some(id => !_aiIconCache[id] && id.indexOf('gf|') !== 0)) {
                    setTimeout(() => this._run(), 1500);
                }
            }
        }
    };

    // ── Phase 3 (map): plot outlet articles via Claude-driven geolocation ──
    // RSS articles have no coordinates, so the AI extracts {lat,lng,place,emoji}
    // from each headline+summary. Cached per article URL in localStorage so each
    // article is geolocated exactly once.
    const outletMap = {
        LS_KEY: 'geoscope_outlet_geo',
        _failed: false,
        _busy: false,
        init() {
            try { _outletGeoCache = JSON.parse(localStorage.getItem(this.LS_KEY) || '{}') || {}; }
            catch (_) { _outletGeoCache = {}; }
        },
        _save() { try { localStorage.setItem(this.LS_KEY, JSON.stringify(_outletGeoCache)); } catch (_) {} },
        clearMarkers() {
            for (const k in _outletMarkers) {
                try { map.removeLayer(_outletMarkers[k]); } catch (_) {}
                delete _outletMarkers[k];
            }
        },
        _placeOne(article, geo) {
            if (!geo || typeof geo.lat !== 'number' || typeof geo.lng !== 'number') return;
            const key = article.link || article.title;
            if (_outletMarkers[key]) return;
            const emoji = geo.emoji || '📰';
            const html = `<div class="ev-pin ev-pin-emoji ev-pin-outlet">
                            <span class="ev-icon ev-icon-emoji">${emoji}</span>
                          </div>`;
            const m = L.marker([geo.lat, geo.lng], {
                pane: 'eventPane',
                icon: L.divIcon({ className: 'ev-divicon ev-outlet', html, iconSize: [32, 32], iconAnchor: [16, 16] }),
                interactive: true, keyboard: false, riseOnHover: true,
            });
            const title = (article.title || '').replace(/"/g, '&quot;');
            m.bindPopup(
                `<div class="outlet-popup">
                    <div class="outlet-popup-src">${(article.source || '').toString()}</div>
                    <a href="${article.link || '#'}" target="_blank" rel="noopener noreferrer" class="outlet-popup-title">${title}</a>
                    ${article.summary ? `<div class="outlet-popup-summary">${article.summary}</div>` : ''}
                 </div>`,
                { maxWidth: 320 }
            );
            m.addTo(map);
            _outletMarkers[key] = m;
        },
        async show() {
            // Place anything we already have geo for, then geolocate the rest via AI.
            this.clearMarkers();
            const arts = (_outletsData && _outletsData.outlets) || [];
            if (!arts.length) return;
            arts.forEach(a => {
                const key = a.link || a.title;
                if (_outletGeoCache[key]) this._placeOne(a, _outletGeoCache[key]);
            });
            if (this._failed) return;
            const todo = arts.filter(a => !_outletGeoCache[a.link || a.title]).slice(0, 30);
            if (!todo.length || this._busy) return;
            this._busy = true;
            const items = todo.map(a => ({
                id: a.link || a.title,
                text: [a.title, a.summary].filter(Boolean).join(' — ').slice(0, 350),
            }));
            const system =
                'Eres un geolocalizador de noticias. Para cada elemento (un titular + resumen breve), ' +
                'extrae el lugar PRINCIPAL al que se refiere. Responde SOLO con un array JSON, sin texto extra, ' +
                'con el formato exacto:\n' +
                '[{"id":"<id>","place":"<ciudad o país en inglés>","lat":<número>,"lng":<número>,"emoji":"<un emoji que resuma el tema>"}]\n' +
                'Si una noticia no tiene un lugar claro (ej. opinión general), OMÍTELA del array (no la incluyas).';
            try {
                const res = await aiFetch('/api/claude', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ system, max_tokens: 2000, messages: [{ role: 'user', content: JSON.stringify(items) }] }),
                });
                if (!res) return;                       // AI off → exit cleanly
                if (!res.ok) { this._failed = true; return; }
                const data = await res.json();
                let txt = '';
                if (Array.isArray(data.content)) txt = data.content.filter(b => b.type === 'text').map(b => b.text).join('');
                const match = txt.match(/\[[\s\S]*\]/);
                if (!match) return;
                const arr = JSON.parse(match[0]);
                const byId = new Map(arts.map(a => [a.link || a.title, a]));
                let changed = 0;
                arr.forEach(g => {
                    if (g && g.id && typeof g.lat === 'number' && typeof g.lng === 'number' && byId.has(g.id)) {
                        _outletGeoCache[g.id] = { lat: g.lat, lng: g.lng, place: g.place, emoji: g.emoji };
                        this._placeOne(byId.get(g.id), _outletGeoCache[g.id]);
                        changed++;
                    }
                });
                if (changed) this._save();
            } catch (_) {
                this._failed = true;
            } finally { this._busy = false; }
        }
    };

    // ── geoFeed: user-added Telegram channels / RSS feeds + built-in outlets, all
    //    plotted on the SAME map as the live Telegram events. Each article is
    //    geolocated once by TITLE against the local gazetteer above (cached, no
    //    AI) and given a timestamp so the existing expiry sweep removes it
    //    automatically. Titles that name no known place get no icon. ──
    // Default sources the app ships with (first run only — the user can delete
    // any of these and add their own; their choices are then persisted).
    // Outlets only — the live backend Telegram channels (Middle_East_Spectator,
    // intelslava, geopolitics_prime) already appear as removable "live channels"
    // in the sources panel, so seeding them here too would double every icon.
    // Seeded on first run AND topped up on every load so newly-added defaults
    // appear automatically. Mirrors the backend NEWS_OUTLETS list in start_server.py
    // so every outlet visible in the "Noticieros" tab is also listed (and removable)
    // No default sources — the user starts with zero feeds and either picks
    // them manually or lets the AI source finder populate them after the
    // onboarding wizard. The empty array keeps the rest of the code paths
    // (top-up on reload, "is default" checks for name upgrades) working as
    // no-ops without further changes.
    const GEOFEED_DEFAULTS = [];

    // Known popular outlets, by name → their REAL feed URL. Lets the user type a
    // bare name ("bbc", "el país", "the verge") and get the right feed INSTANTLY,
    // with NO AI call and NO API key — solving the common case (esp. BBC, whose
    // feed lives on feeds.bbci.co.uk and is NOT discoverable from bbc.com). The
    // AI resolver remains the fallback for anything not in this list. All URLs
    // below verified to return articles on 2026-06-22.
    const KNOWN_FEEDS = {
        'bbc':            { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC' },
        'bbc news':       { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC' },
        'cnn':            { url: 'http://rss.cnn.com/rss/edition.rss', name: 'CNN' },
        'el pais':        { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', name: 'El País' },
        'el país':        { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', name: 'El País' },
        'elpais':         { url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', name: 'El País' },
        'el mundo':       { url: 'https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml', name: 'El Mundo' },
        'elmundo':        { url: 'https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml', name: 'El Mundo' },
        'marca':          { url: 'https://e00-marca.uecdn.es/rss/portada.xml', name: 'Marca' },
        'the guardian':   { url: 'https://www.theguardian.com/world/rss', name: 'The Guardian' },
        'guardian':       { url: 'https://www.theguardian.com/world/rss', name: 'The Guardian' },
        'nyt':            { url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', name: 'The New York Times' },
        'nytimes':        { url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', name: 'The New York Times' },
        'new york times': { url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', name: 'The New York Times' },
        'al jazeera':     { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera' },
        'aljazeera':      { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera' },
        'the verge':      { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge' },
        'theverge':       { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge' },
        'verge':          { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge' },
        'espn':           { url: 'https://www.espn.com/espn/rss/news', name: 'ESPN' },
        'hacker news':    { url: 'https://news.ycombinator.com/rss', name: 'Hacker News' },
        'hackernews':     { url: 'https://news.ycombinator.com/rss', name: 'Hacker News' },
        'hn':             { url: 'https://news.ycombinator.com/rss', name: 'Hacker News' },
        'wired':          { url: 'https://www.wired.com/feed/rss', name: 'Wired' },
        'techcrunch':     { url: 'https://techcrunch.com/feed/', name: 'TechCrunch' },
        'tech crunch':    { url: 'https://techcrunch.com/feed/', name: 'TechCrunch' },
    };

    // ── Local news geolocation (NO AI, zero cost) ──
    // July 2026: the Claude-based geolocator was replaced with this built-in
    // gazetteer. Each article's TITLE is matched against known country/city
    // names (English + Spanish, unaccented); a title that names no known place
    // simply doesn't get a map icon. That's the accepted trade-off for a
    // geolocation path with zero API calls and zero per-refresh credit burn.
    // Entry: ['name|alt|alt', lat, lng, iso2] — iso2 gives the flag emoji used
    // as the marker. Countries/regions first, CITIES last: cities win over
    // countries when both appear in a title ("…en Kyiv, Ucrania" → Kyiv).
    const GAZ_COUNTRIES = [
        ['afghanistan|afganistan', 33.9, 67.7, 'af'], ['albania', 41.2, 20.2, 'al'], ['germany|alemania', 51.2, 10.4, 'de'],
        ['andorra', 42.5, 1.5, 'ad'], ['angola', -11.2, 17.9, 'ao'], ['argentina', -38.4, -63.6, 'ar'],
        ['armenia', 40.1, 45.0, 'am'], ['australia', -25.3, 133.8, 'au'], ['austria', 47.5, 14.6, 'at'],
        ['azerbaijan|azerbaiyan', 40.1, 47.6, 'az'], ['bahamas', 25.0, -77.4, 'bs'], ['bahrain|barein|bahrein', 26.0, 50.6, 'bh'],
        ['bangladesh', 23.7, 90.4, 'bd'], ['barbados', 13.2, -59.5, 'bb'], ['belgium|belgica', 50.5, 4.5, 'be'],
        ['belize|belice', 17.2, -88.5, 'bz'], ['benin', 9.3, 2.3, 'bj'], ['belarus|bielorrusia', 53.7, 27.9, 'by'],
        ['bolivia', -16.3, -63.6, 'bo'], ['bosnia and herzegovina|bosnia', 43.9, 17.7, 'ba'], ['botswana|botsuana', -22.3, 24.7, 'bw'],
        ['brazil|brasil', -10.3, -53.2, 'br'], ['brunei', 4.5, 114.7, 'bn'], ['bulgaria', 42.7, 25.5, 'bg'],
        ['burkina faso|burkina', 12.2, -1.6, 'bf'], ['burundi', -3.4, 29.9, 'bi'], ['bhutan|butan', 27.5, 90.4, 'bt'],
        ['cape verde|cabo verde', 15.1, -23.6, 'cv'], ['cambodia|camboya', 12.6, 105.0, 'kh'], ['cameroon|camerun', 5.7, 12.7, 'cm'],
        ['canada', 56.1, -106.3, 'ca'], ['chad', 15.5, 18.7, 'td'], ['chile', -35.7, -71.5, 'cl'],
        ['china', 35.0, 103.0, 'cn'], ['cyprus|chipre', 35.1, 33.4, 'cy'], ['colombia', 4.6, -74.1, 'co'],
        ['comoros|comoras', -11.6, 43.3, 'km'], ['north korea|corea del norte', 40.3, 127.0, 'kp'],
        ['south korea|corea del sur', 36.5, 127.8, 'kr'], ['korea|corea', 36.5, 127.8, 'kr'],
        ['ivory coast|costa de marfil', 7.5, -5.5, 'ci'], ['costa rica', 9.9, -84.1, 'cr'], ['croatia|croacia', 45.1, 15.2, 'hr'],
        ['cuba', 21.5, -79.5, 'cu'], ['denmark|dinamarca', 56.0, 9.5, 'dk'],
        ['dominican republic|republica dominicana', 18.7, -70.2, 'do'], ['dominica', 15.4, -61.4, 'dm'],
        ['ecuador', -1.8, -78.2, 'ec'], ['egypt|egipto', 26.8, 30.0, 'eg'], ['el salvador', 13.7, -88.9, 'sv'],
        ['united arab emirates|emiratos arabes unidos|emiratos|uae', 24.0, 54.0, 'ae'], ['eritrea', 15.2, 39.0, 'er'],
        ['slovakia|eslovaquia', 48.7, 19.7, 'sk'], ['slovenia|eslovenia', 46.1, 14.8, 'si'], ['spain|espana', 40.4, -3.7, 'es'],
        ['united states|estados unidos|eeuu|ee.uu|usa|u.s.', 39.8, -98.6, 'us'], ['estonia', 58.6, 25.0, 'ee'],
        ['eswatini|swaziland|suazilandia', -26.5, 31.5, 'sz'], ['ethiopia|etiopia', 9.1, 40.5, 'et'],
        ['philippines|filipinas', 12.9, 121.8, 'ph'], ['finland|finlandia', 61.9, 25.7, 'fi'], ['fiji|fiyi', -17.7, 178.0, 'fj'],
        ['france|francia', 46.6, 2.2, 'fr'], ['gabon', -0.8, 11.6, 'ga'], ['gambia', 13.4, -15.3, 'gm'],
        ['georgia', 42.3, 43.4, 'ge'], ['ghana', 7.9, -1.0, 'gh'], ['greece|grecia', 39.1, 22.9, 'gr'],
        ['grenada', 12.1, -61.7, 'gd'], ['guatemala', 15.8, -90.2, 'gt'],
        ['guinea-bissau|guinea bissau', 11.8, -15.2, 'gw'], ['equatorial guinea|guinea ecuatorial', 1.6, 10.3, 'gq'],
        ['papua new guinea|papua nueva guinea', -6.3, 143.9, 'pg'], ['guinea', 9.9, -11.3, 'gn'],
        ['guyana', 4.9, -58.9, 'gy'], ['haiti', 18.9, -72.7, 'ht'], ['honduras', 14.7, -86.6, 'hn'],
        ['hungary|hungria', 47.2, 19.5, 'hu'], ['india', 22.0, 79.0, 'in'], ['indonesia', -2.5, 118.0, 'id'],
        ['iran', 32.4, 53.7, 'ir'], ['iraq|irak', 33.2, 43.7, 'iq'], ['ireland|irlanda', 53.2, -7.7, 'ie'],
        ['iceland|islandia', 64.9, -18.6, 'is'], ['israel', 31.4, 35.0, 'il'], ['italy|italia', 42.8, 12.8, 'it'],
        ['jamaica', 18.1, -77.3, 'jm'], ['japan|japon', 36.5, 138.0, 'jp'], ['jordan|jordania', 31.3, 36.4, 'jo'],
        ['kazakhstan|kazajistan|kazajstan', 48.0, 66.9, 'kz'], ['kenya|kenia', 0.4, 37.9, 'ke'],
        ['kyrgyzstan|kirguistan', 41.4, 74.6, 'kg'], ['kiribati', 1.9, -157.4, 'ki'], ['kosovo', 42.6, 20.9, 'xk'],
        ['kuwait', 29.3, 47.5, 'kw'], ['laos', 19.9, 102.5, 'la'], ['lesotho|lesoto', -29.6, 28.2, 'ls'],
        ['latvia|letonia', 56.9, 24.9, 'lv'], ['lebanon|libano', 33.9, 35.9, 'lb'], ['liberia', 6.5, -9.4, 'lr'],
        ['libya|libia', 27.0, 17.0, 'ly'], ['liechtenstein', 47.2, 9.5, 'li'], ['lithuania|lituania', 55.2, 23.9, 'lt'],
        ['luxembourg|luxemburgo', 49.8, 6.1, 'lu'], ['north macedonia|macedonia', 41.6, 21.7, 'mk'],
        ['madagascar', -19.4, 46.7, 'mg'], ['malaysia|malasia', 4.2, 102.0, 'my'], ['malawi|malaui', -13.3, 34.3, 'mw'],
        ['maldives|maldivas', 3.2, 73.2, 'mv'], ['mali', 17.6, -4.0, 'ml'], ['malta', 35.9, 14.4, 'mt'],
        ['morocco|marruecos', 31.8, -7.1, 'ma'], ['mauritius|isla mauricio', -20.3, 57.6, 'mu'], ['mauritania', 20.3, -10.3, 'mr'],
        ['mexico|mejico', 23.6, -102.6, 'mx'], ['micronesia', 6.9, 158.2, 'fm'], ['moldova|moldavia', 47.2, 28.5, 'md'],
        ['monaco', 43.7, 7.4, 'mc'], ['mongolia', 46.9, 103.8, 'mn'], ['montenegro', 42.7, 19.4, 'me'],
        ['mozambique', -18.7, 35.5, 'mz'], ['myanmar|birmania', 21.9, 96.1, 'mm'], ['namibia', -22.6, 17.1, 'na'],
        ['nauru', -0.5, 166.9, 'nr'], ['nepal', 28.4, 84.1, 'np'], ['nicaragua', 12.9, -85.2, 'ni'],
        ['nigeria', 9.1, 8.7, 'ng'], ['niger', 17.6, 8.1, 'ne'], ['norway|noruega', 61.0, 8.8, 'no'],
        ['new zealand|nueva zelanda', -41.0, 173.0, 'nz'], ['oman', 21.5, 56.1, 'om'],
        ['netherlands|paises bajos|holanda', 52.2, 5.3, 'nl'], ['pakistan|paquistan', 30.4, 69.4, 'pk'],
        ['palau', 7.5, 134.6, 'pw'], ['palestine|palestina', 31.9, 35.2, 'ps'], ['panama', 8.5, -80.1, 'pa'],
        ['paraguay', -23.4, -58.4, 'py'], ['peru', -9.2, -75.0, 'pe'], ['poland|polonia', 51.9, 19.1, 'pl'],
        ['portugal', 39.6, -8.0, 'pt'], ['qatar|catar', 25.3, 51.2, 'qa'],
        ['united kingdom|reino unido|great britain|gran bretana|uk', 54.0, -2.5, 'gb'],
        ['england|inglaterra', 52.4, -1.5, 'gb'], ['scotland|escocia', 56.5, -4.0, 'gb'], ['wales|gales', 52.3, -3.6, 'gb'],
        ['czech republic|republica checa|chequia|czechia', 49.8, 15.5, 'cz'],
        ['central african republic|republica centroafricana', 6.6, 20.9, 'cf'],
        ['democratic republic of the congo|republica democratica del congo|rd congo|dr congo|drc', -2.9, 23.6, 'cd'],
        ['congo', -0.7, 15.2, 'cg'], ['rwanda|ruanda', -2.0, 29.9, 'rw'], ['romania|rumania', 45.9, 25.0, 'ro'],
        ['russia|rusia', 56.0, 60.0, 'ru'], ['samoa', -13.8, -172.1, 'ws'], ['san marino', 43.9, 12.5, 'sm'],
        ['saudi arabia|arabia saudita|arabia saudi', 23.9, 45.1, 'sa'], ['algeria|argelia', 28.0, 2.6, 'dz'],
        ['senegal', 14.5, -14.5, 'sn'], ['serbia', 44.2, 21.0, 'rs'], ['seychelles', -4.7, 55.5, 'sc'],
        ['sierra leone|sierra leona', 8.5, -11.8, 'sl'], ['singapore|singapur', 1.35, 103.8, 'sg'],
        ['syria|siria', 35.0, 38.5, 'sy'], ['somalia', 5.2, 46.2, 'so'], ['sri lanka', 7.9, 80.8, 'lk'],
        ['south africa|sudafrica', -29.0, 25.0, 'za'], ['south sudan|sudan del sur', 7.9, 30.0, 'ss'],
        ['sudan', 15.5, 30.2, 'sd'], ['sweden|suecia', 62.2, 14.8, 'se'], ['switzerland|suiza', 46.8, 8.2, 'ch'],
        ['suriname|surinam', 4.1, -55.9, 'sr'], ['thailand|tailandia', 15.0, 101.0, 'th'], ['taiwan', 23.7, 121.0, 'tw'],
        ['tanzania', -6.4, 34.9, 'tz'], ['tajikistan|tayikistan', 38.9, 71.3, 'tj'],
        ['east timor|timor oriental|timor-leste', -8.9, 125.7, 'tl'], ['togo', 8.6, 1.0, 'tg'], ['tonga', -21.2, -175.2, 'to'],
        ['trinidad and tobago|trinidad y tobago', 10.5, -61.3, 'tt'], ['tunisia|tunez', 34.0, 9.5, 'tn'],
        ['turkmenistan', 39.0, 59.5, 'tm'], ['turkey|turquia|turkiye', 39.0, 35.0, 'tr'], ['tuvalu', -7.5, 178.7, 'tv'],
        ['ukraine|ucrania', 48.9, 31.5, 'ua'], ['uganda', 1.4, 32.3, 'ug'], ['uruguay', -32.8, -55.8, 'uy'],
        ['uzbekistan', 41.6, 63.9, 'uz'], ['vanuatu', -15.4, 166.9, 'vu'], ['vatican|vaticano', 41.9, 12.45, 'va'],
        ['venezuela', 7.1, -66.2, 've'], ['vietnam', 15.9, 106.0, 'vn'], ['yemen', 15.6, 47.9, 'ye'],
        ['djibouti|yibuti', 11.8, 42.6, 'dj'], ['zambia', -13.5, 27.9, 'zm'], ['zimbabwe|zimbabue', -19.0, 29.9, 'zw'],
        // Regions / territories
        ['west bank|cisjordania', 31.9, 35.3, 'ps'], ['crimea', 45.3, 34.4, 'ua'], ['donbas|donbass', 48.3, 37.9, 'ua'],
        ['kashmir|cachemira', 34.1, 74.8, ''], ['kurdistan', 36.4, 44.4, ''], ['sahel', 14.5, 0.0, ''],
        ['balkans|balcanes', 43.0, 21.0, ''], ['greenland|groenlandia', 71.7, -42.6, 'gl'],
        ['western sahara|sahara occidental', 24.6, -13.3, 'eh'], ['puerto rico', 18.2, -66.4, 'pr'],
        ['catalonia|cataluna|catalunya', 41.8, 1.6, 'es'], ['pais vasco|euskadi', 43.0, -2.6, 'es'],
        ['andalucia', 37.5, -4.7, 'es'], ['galicia', 42.8, -8.0, 'es'],
        ['canary islands|islas canarias|canarias', 28.3, -16.5, 'es'],
        ['siberia', 60.0, 100.0, 'ru'], ['tibet', 31.5, 88.0, 'cn'], ['xinjiang', 41.0, 85.0, 'cn'],
        ['antarctica|antartida', -75.0, 0.0, 'aq'],
        ['texas', 31.5, -99.4, 'us'], ['california', 36.8, -119.4, 'us'], ['florida', 28.6, -82.4, 'us'],
        ['alaska', 64.7, -152.5, 'us'], ['hawaii|hawai', 20.9, -156.3, 'us'],
    ];
    const GAZ_CITIES = [
        ['washington', 38.9, -77.0, 'us'], ['new york|nueva york', 40.7, -74.0, 'us'], ['los angeles', 34.05, -118.2, 'us'],
        ['chicago', 41.9, -87.6, 'us'], ['houston', 29.8, -95.4, 'us'], ['miami', 25.8, -80.2, 'us'],
        ['boston', 42.4, -71.06, 'us'], ['seattle', 47.6, -122.3, 'us'], ['san francisco', 37.8, -122.4, 'us'],
        ['las vegas', 36.2, -115.1, 'us'], ['dallas', 32.8, -96.8, 'us'], ['atlanta', 33.7, -84.4, 'us'],
        ['philadelphia|filadelfia', 40.0, -75.2, 'us'], ['detroit', 42.3, -83.05, 'us'], ['denver', 39.7, -105.0, 'us'],
        ['phoenix', 33.4, -112.1, 'us'], ['austin', 30.3, -97.7, 'us'], ['new orleans|nueva orleans', 30.0, -90.1, 'us'],
        ['baltimore', 39.3, -76.6, 'us'], ['pittsburgh', 40.4, -80.0, 'us'], ['minneapolis', 44.98, -93.3, 'us'],
        ['san diego', 32.7, -117.2, 'us'], ['silicon valley', 37.4, -122.1, 'us'], ['hollywood', 34.1, -118.3, 'us'],
        ['ottawa', 45.4, -75.7, 'ca'], ['toronto', 43.7, -79.4, 'ca'], ['montreal', 45.5, -73.6, 'ca'],
        ['vancouver', 49.3, -123.1, 'ca'], ['quebec', 46.8, -71.2, 'ca'],
        ['mexico city|ciudad de mexico|cdmx', 19.4, -99.1, 'mx'], ['guadalajara', 20.7, -103.3, 'mx'],
        ['monterrey', 25.7, -100.3, 'mx'], ['tijuana', 32.5, -117.0, 'mx'], ['cancun', 21.2, -86.8, 'mx'],
        ['buenos aires', -34.6, -58.4, 'ar'], ['sao paulo', -23.55, -46.6, 'br'], ['rio de janeiro', -22.9, -43.2, 'br'],
        ['brasilia', -15.8, -47.9, 'br'], ['lima', -12.05, -77.05, 'pe'], ['bogota', 4.7, -74.1, 'co'],
        ['medellin', 6.25, -75.6, 'co'], ['cali', 3.45, -76.5, 'co'], ['caracas', 10.5, -66.9, 've'],
        ['quito', -0.2, -78.5, 'ec'], ['guayaquil', -2.2, -79.9, 'ec'], ['montevideo', -34.9, -56.2, 'uy'],
        ['asuncion', -25.3, -57.6, 'py'], ['havana|la habana', 23.1, -82.4, 'cu'], ['santo domingo', 18.5, -69.9, 'do'],
        ['tegucigalpa', 14.1, -87.2, 'hn'], ['managua', 12.1, -86.3, 'ni'], ['san salvador', 13.7, -89.2, 'sv'],
        ['santiago de chile', -33.45, -70.7, 'cl'], ['santiago de compostela', 42.9, -8.5, 'es'],
        ['london|londres', 51.5, -0.13, 'gb'], ['manchester', 53.5, -2.2, 'gb'], ['liverpool', 53.4, -3.0, 'gb'],
        ['birmingham', 52.5, -1.9, 'gb'], ['glasgow', 55.9, -4.3, 'gb'], ['edinburgh|edimburgo', 55.95, -3.2, 'gb'],
        ['cardiff', 51.5, -3.2, 'gb'], ['belfast', 54.6, -5.9, 'gb'], ['oxford', 51.75, -1.26, 'gb'],
        ['cambridge', 52.2, 0.12, 'gb'],
        ['paris', 48.86, 2.35, 'fr'], ['marseille|marsella', 43.3, 5.4, 'fr'], ['lyon', 45.75, 4.85, 'fr'],
        ['toulouse', 43.6, 1.44, 'fr'], ['niza', 43.7, 7.27, 'fr'], ['bordeaux|burdeos', 44.84, -0.58, 'fr'],
        ['strasbourg|estrasburgo', 48.58, 7.75, 'fr'], ['cannes', 43.55, 7.02, 'fr'], ['lille', 50.63, 3.06, 'fr'],
        ['nantes', 47.2, -1.55, 'fr'],
        ['berlin', 52.52, 13.4, 'de'], ['munich', 48.14, 11.58, 'de'], ['frankfurt|francfort', 50.11, 8.68, 'de'],
        ['hamburg|hamburgo', 53.55, 10.0, 'de'], ['cologne', 50.94, 6.96, 'de'], ['dresden|dresde', 51.05, 13.74, 'de'],
        ['stuttgart', 48.78, 9.18, 'de'], ['leipzig', 51.34, 12.37, 'de'], ['dusseldorf', 51.23, 6.78, 'de'],
        ['madrid', 40.42, -3.7, 'es'], ['barcelona', 41.39, 2.17, 'es'], ['valencia', 39.47, -0.38, 'es'],
        ['sevilla|seville', 37.39, -5.99, 'es'], ['bilbao', 43.26, -2.93, 'es'], ['zaragoza', 41.65, -0.88, 'es'],
        ['malaga', 36.72, -4.42, 'es'], ['murcia', 37.99, -1.13, 'es'], ['palma de mallorca|mallorca', 39.57, 2.65, 'es'],
        ['ibiza', 38.91, 1.43, 'es'], ['ceuta', 35.89, -5.32, 'es'], ['melilla', 35.29, -2.94, 'es'],
        ['toledo', 39.86, -4.03, 'es'], ['gibraltar', 36.14, -5.35, 'gi'],
        ['lisbon|lisboa', 38.72, -9.14, 'pt'], ['porto|oporto', 41.15, -8.61, 'pt'],
        ['rome|roma', 41.9, 12.5, 'it'], ['milan', 45.46, 9.19, 'it'], ['naples|napoles', 40.85, 14.27, 'it'],
        ['turin', 45.07, 7.69, 'it'], ['venice|venecia', 45.44, 12.34, 'it'], ['florence|florencia', 43.77, 11.26, 'it'],
        ['genoa|genova', 44.41, 8.93, 'it'], ['palermo', 38.12, 13.36, 'it'],
        ['amsterdam', 52.37, 4.9, 'nl'], ['rotterdam|roterdam', 51.92, 4.48, 'nl'], ['the hague|la haya', 52.08, 4.31, 'nl'],
        ['brussels|bruselas', 50.85, 4.35, 'be'], ['antwerp|amberes', 51.22, 4.4, 'be'],
        ['vienna|viena', 48.21, 16.37, 'at'], ['zurich', 47.37, 8.54, 'ch'], ['geneva|ginebra', 46.2, 6.14, 'ch'],
        ['davos', 46.8, 9.84, 'ch'], ['bern|berna', 46.95, 7.45, 'ch'], ['basel|basilea', 47.56, 7.59, 'ch'],
        ['stockholm|estocolmo', 59.33, 18.07, 'se'], ['gothenburg|gotemburgo', 57.7, 11.97, 'se'],
        ['oslo', 59.91, 10.75, 'no'], ['copenhagen|copenhague', 55.68, 12.57, 'dk'], ['helsinki', 60.17, 24.94, 'fi'],
        ['reykjavik|reikiavik', 64.15, -21.94, 'is'], ['dublin', 53.35, -6.26, 'ie'],
        ['warsaw|varsovia', 52.23, 21.01, 'pl'], ['krakow|cracovia', 50.06, 19.94, 'pl'], ['prague|praga', 50.08, 14.44, 'cz'],
        ['budapest', 47.5, 19.04, 'hu'], ['bucharest|bucarest', 44.43, 26.1, 'ro'], ['athens|atenas', 37.98, 23.73, 'gr'],
        ['thessaloniki|salonica', 40.64, 22.94, 'gr'], ['belgrade|belgrado', 44.79, 20.45, 'rs'], ['zagreb', 45.81, 15.98, 'hr'],
        ['sarajevo', 43.86, 18.41, 'ba'], ['skopje', 42.0, 21.43, 'mk'], ['tirana', 41.33, 19.82, 'al'],
        ['pristina', 42.66, 21.17, 'xk'], ['podgorica', 42.44, 19.26, 'me'], ['ljubljana', 46.06, 14.51, 'si'],
        ['bratislava', 48.15, 17.11, 'sk'], ['chisinau', 47.01, 28.86, 'md'], ['minsk', 53.9, 27.57, 'by'],
        ['vilnius|vilna', 54.69, 25.28, 'lt'], ['riga', 56.95, 24.11, 'lv'], ['tallinn|tallin', 59.44, 24.75, 'ee'],
        ['kyiv|kiev', 50.45, 30.52, 'ua'], ['kharkiv|jarkov', 49.99, 36.23, 'ua'], ['odesa|odessa', 46.48, 30.73, 'ua'],
        ['lviv', 49.84, 24.03, 'ua'], ['mariupol', 47.1, 37.55, 'ua'], ['donetsk', 48.0, 37.8, 'ua'],
        ['luhansk|lugansk', 48.57, 39.3, 'ua'], ['kherson|jerson', 46.64, 32.61, 'ua'],
        ['zaporizhzhia|zaporiyia', 47.84, 35.14, 'ua'], ['sevastopol', 44.6, 33.53, 'ua'],
        ['moscow|moscu', 55.76, 37.62, 'ru'], ['saint petersburg|st petersburg|san petersburgo', 59.93, 30.36, 'ru'],
        ['vladivostok', 43.12, 131.9, 'ru'], ['tbilisi', 41.72, 44.79, 'ge'], ['yerevan|erevan', 40.18, 44.51, 'am'],
        ['baku', 40.41, 49.87, 'az'], ['astana', 51.17, 71.43, 'kz'], ['almaty', 43.24, 76.95, 'kz'],
        ['tashkent|taskent', 41.3, 69.24, 'uz'], ['bishkek', 42.87, 74.59, 'kg'], ['dushanbe', 38.56, 68.79, 'tj'],
        ['ashgabat', 37.95, 58.38, 'tm'], ['ulaanbaatar|ulan bator', 47.89, 106.9, 'mn'],
        ['istanbul|estambul', 41.01, 28.98, 'tr'], ['ankara', 39.93, 32.86, 'tr'], ['izmir|esmirna', 38.42, 27.13, 'tr'],
        ['jerusalem|jerusalen', 31.78, 35.22, 'il'], ['tel aviv', 32.08, 34.78, 'il'], ['gaza|franja de gaza', 31.4, 34.4, 'ps'],
        ['ramallah|ramala', 31.9, 35.2, 'ps'], ['hebron', 31.53, 35.1, 'ps'], ['rafah', 31.29, 34.25, 'ps'],
        ['beirut', 33.89, 35.5, 'lb'], ['damascus|damasco', 33.51, 36.29, 'sy'], ['aleppo|alepo', 36.2, 37.16, 'sy'],
        ['idlib', 35.93, 36.63, 'sy'], ['amman', 31.95, 35.93, 'jo'], ['baghdad|bagdad', 33.31, 44.37, 'iq'],
        ['mosul', 36.34, 43.13, 'iq'], ['basra|basora', 30.51, 47.78, 'iq'], ['tehran|teheran', 35.69, 51.39, 'ir'],
        ['isfahan', 32.65, 51.68, 'ir'], ['riyadh|riad', 24.71, 46.68, 'sa'], ['jeddah|yeda', 21.49, 39.19, 'sa'],
        ['mecca|la meca', 21.39, 39.86, 'sa'], ['dubai', 25.2, 55.27, 'ae'], ['abu dhabi|abu dabi', 24.45, 54.38, 'ae'],
        ['doha', 25.29, 51.53, 'qa'], ['manama', 26.23, 50.59, 'bh'], ['muscat|mascate', 23.59, 58.41, 'om'],
        ['sanaa', 15.35, 44.21, 'ye'], ['aden', 12.79, 45.03, 'ye'], ['kabul', 34.53, 69.17, 'af'],
        ['kandahar', 31.62, 65.72, 'af'], ['islamabad', 33.69, 73.06, 'pk'], ['karachi', 24.86, 67.0, 'pk'],
        ['lahore', 31.55, 74.34, 'pk'], ['new delhi|nueva delhi|delhi', 28.61, 77.21, 'in'],
        ['mumbai|bombay', 19.08, 72.88, 'in'], ['kolkata|calcuta', 22.57, 88.36, 'in'],
        ['bangalore|bengaluru', 12.97, 77.59, 'in'], ['chennai', 13.08, 80.27, 'in'], ['dhaka', 23.81, 90.41, 'bd'],
        ['colombo', 6.93, 79.85, 'lk'], ['kathmandu|katmandu', 27.72, 85.32, 'np'],
        ['beijing|pekin', 39.9, 116.4, 'cn'], ['shanghai', 31.23, 121.47, 'cn'], ['shenzhen', 22.54, 114.06, 'cn'],
        ['guangzhou', 23.13, 113.26, 'cn'], ['wuhan', 30.59, 114.31, 'cn'], ['hong kong', 22.3, 114.2, 'hk'],
        ['taipei', 25.03, 121.57, 'tw'], ['tokyo|tokio', 35.68, 139.69, 'jp'], ['osaka', 34.69, 135.5, 'jp'],
        ['kyoto|kioto', 35.01, 135.77, 'jp'], ['hiroshima', 34.39, 132.46, 'jp'], ['nagasaki', 32.75, 129.88, 'jp'],
        ['fukushima', 37.75, 140.47, 'jp'], ['okinawa', 26.33, 127.8, 'jp'], ['seoul|seul', 37.57, 126.98, 'kr'],
        ['pyongyang', 39.03, 125.75, 'kp'], ['jakarta|yakarta', -6.21, 106.85, 'id'], ['bali', -8.34, 115.09, 'id'],
        ['manila', 14.6, 120.98, 'ph'], ['bangkok', 13.76, 100.5, 'th'], ['hanoi', 21.03, 105.85, 'vn'],
        ['ho chi minh|saigon', 10.82, 106.63, 'vn'], ['kuala lumpur', 3.14, 101.69, 'my'],
        ['phnom penh', 11.55, 104.92, 'kh'], ['yangon|rangun', 16.87, 96.2, 'mm'],
        ['sydney|sidney', -33.87, 151.21, 'au'], ['melbourne', -37.81, 144.96, 'au'], ['canberra', -35.28, 149.13, 'au'],
        ['brisbane', -27.47, 153.03, 'au'], ['perth', -31.95, 115.86, 'au'], ['auckland', -36.85, 174.76, 'nz'],
        ['wellington', -41.29, 174.78, 'nz'],
        ['cairo|el cairo', 30.04, 31.24, 'eg'], ['alexandria|alejandria', 31.2, 29.92, 'eg'],
        ['casablanca', 33.57, -7.59, 'ma'], ['rabat', 34.02, -6.84, 'ma'], ['marrakech|marraquech', 31.63, -8.0, 'ma'],
        ['algiers|argel', 36.75, 3.06, 'dz'], ['tripoli', 32.89, 13.19, 'ly'], ['benghazi|bengasi', 32.12, 20.07, 'ly'],
        ['khartoum|jartum', 15.5, 32.56, 'sd'], ['mogadishu|mogadiscio', 2.05, 45.32, 'so'],
        ['addis ababa|addis abeba', 9.02, 38.75, 'et'], ['nairobi', -1.29, 36.82, 'ke'], ['mombasa', -4.04, 39.67, 'ke'],
        ['kampala', 0.35, 32.58, 'ug'], ['kigali', -1.94, 30.06, 'rw'], ['dar es salaam', -6.79, 39.21, 'tz'],
        ['johannesburg|johannesburgo', -26.2, 28.05, 'za'], ['cape town|ciudad del cabo', -33.92, 18.42, 'za'],
        ['pretoria', -25.75, 28.19, 'za'], ['durban', -29.86, 31.02, 'za'], ['lagos', 6.52, 3.38, 'ng'],
        ['abuja', 9.06, 7.49, 'ng'], ['accra', 5.6, -0.19, 'gh'], ['dakar', 14.72, -17.47, 'sn'],
        ['abidjan|abiyan', 5.36, -4.01, 'ci'], ['bamako', 12.64, -8.0, 'ml'], ['ouagadougou|uagadugu', 12.37, -1.52, 'bf'],
        ['niamey', 13.51, 2.13, 'ne'], ['kinshasa', -4.44, 15.27, 'cd'], ['luanda', -8.84, 13.23, 'ao'],
        ['lusaka', -15.39, 28.32, 'zm'], ['harare', -17.83, 31.05, 'zw'], ['maputo', -25.97, 32.57, 'mz'],
        ['antananarivo', -18.88, 47.51, 'mg'],
    ];

    // Flat index built once on first use: {name, lat, lng, iso, kind, display}.
    let _gazIndex = null;
    function _gazNorm(s) {
        return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }
    function _gazFlag(iso) {
        if (!iso || iso.length !== 2) return '📰';
        return String.fromCodePoint(...[...iso.toUpperCase()].map(c => 127397 + c.charCodeAt(0)));
    }
    function _gazBuild() {
        _gazIndex = [];
        const add = (rows, kind) => rows.forEach(([names, lat, lng, iso]) => {
            const variants = names.split('|');
            // Display name = first variant, title-cased ("new york" → "New York").
            const display = variants[0].replace(/\b\p{L}/gu, c => c.toUpperCase());
            variants.forEach(name => _gazIndex.push({ name, lat, lng, iso, kind, display }));
        });
        add(GAZ_COUNTRIES, 0);
        add(GAZ_CITIES, 1);   // cities win over countries on a tie
    }
    const _GAZ_LETTER = /[\p{L}\p{N}]/u;
    // Whole-word occurrence of `name` in normalized `text` → position, else -1.
    function _gazHit(text, name) {
        let i = text.indexOf(name);
        while (i !== -1) {
            const b = i > 0 ? text[i - 1] : '';
            const a = text[i + name.length] || '';
            if (!(b && _GAZ_LETTER.test(b)) && !(a && _GAZ_LETTER.test(a))) return i;
            i = text.indexOf(name, i + 1);
        }
        return -1;
    }
    // Best place named in a headline → {lat,lng,place,emoji,importance} or null.
    // Preference: city over country, then earliest mention, then longest name
    // (so "Guinea-Bissau" beats "Guinea", "South Sudan" beats "Sudan").
    function localGeolocate(title) {
        const text = _gazNorm(title);
        if (!text) return null;
        if (!_gazIndex) _gazBuild();
        let best = null, bestPos = -1;
        for (const e of _gazIndex) {
            const pos = _gazHit(text, e.name);
            if (pos === -1) continue;
            if (!best ||
                e.kind > best.kind ||
                (e.kind === best.kind && (pos < bestPos || (pos === bestPos && e.name.length > best.name.length)))) {
                best = e; bestPos = pos;
            }
        }
        if (!best) return null;
        return { lat: best.lat, lng: best.lng, place: best.display, emoji: _gazFlag(best.iso), importance: 5 };
    }

    const FREE_MAX_SOURCES = 5;   // free plan: up to 5 sources; Pro/Team unlimited
    const geoFeed = {
        LS_SRC: 'geoscope_user_sources',
        LS_GEO: 'geoscope_geofeed_geo',
        LS_HIDDEN: 'geoscope_hidden_channels',
        LS_REMOVED_DEFAULTS: 'geoscope_removed_defaults',
        LS_MAXICONS: 'geoscope_max_icons',   // user setting: max map icons per source
        DEFAULT_MAXICONS: 6,
        // Window of content we keep. Skorpene is a GENERAL topics app (sports,
        // anime, tech, niche blogs, Telegram channels…) — most sources do NOT
        // post daily. A 24h window made the feed look empty for any channel that
        // hadn't posted today (e.g. @durov: newest post 5 days old). 30 days is
        // the right balance: weekly/monthly posters still show up.
        EXPIRY_MS: 30 * 24 * 60 * 60 * 1000,
        sources: [],            // [{id,type:'telegram'|'rss',value,name,important}]
        geoCache: {},           // articleId -> {lat,lng,emoji,place,importance}
        markers: {},            // articleKey -> {eventId, ts, sourceId}
        hidden: {},             // lowercased channel name -> true (live channels the user hid)
        removedDefaults: {},    // default id -> true (defaults the user has explicitly removed)
        _busy: false,

        init() {
            const stored = localStorage.getItem(this.LS_SRC);
            try { this.removedDefaults = JSON.parse(localStorage.getItem(this.LS_REMOVED_DEFAULTS) || '{}') || {}; } catch (_) { this.removedDefaults = {}; }
            if (stored === null) {
                this.sources = GEOFEED_DEFAULTS.map(s => ({ ...s }));   // first run → seed defaults
            } else {
                try { this.sources = JSON.parse(stored) || []; } catch (_) { this.sources = []; }
                // Top up any defaults missing from storage but not explicitly removed —
                // lets newly-added defaults (e.g. CSIS) appear automatically for existing users.
                const existing = new Set(this.sources.map(s => s.id));
                GEOFEED_DEFAULTS.forEach(d => {
                    if (!existing.has(d.id) && !this.removedDefaults[d.id]) {
                        this.sources.push({ ...d });
                    }
                });
            }
            this._saveSrc();
            // One-time purge (v2): the short-lived gazetteer hybrid cached
            // context-blind (often wrong) coords in this same cache, and cached
            // entries are trusted forever — so bad placements survived the code
            // revert. Indistinguishable from AI entries, so wipe once and let the
            // capped AI batches refill (small one-time cost, correct forever).
            try {
                if (localStorage.getItem(this.LS_GEO + '_v') !== '2') {
                    localStorage.removeItem(this.LS_GEO);
                    localStorage.setItem(this.LS_GEO + '_v', '2');
                }
            } catch (_) {}
            try { this.geoCache = JSON.parse(localStorage.getItem(this.LS_GEO) || '{}') || {}; } catch (_) { this.geoCache = {}; }
            try { this.hidden = JSON.parse(localStorage.getItem(this.LS_HIDDEN) || '{}') || {}; } catch (_) { this.hidden = {}; }
        },
        _saveSrc() {
            try { localStorage.setItem(this.LS_SRC, JSON.stringify(this.sources)); } catch (_) {}
            this._pushSrcToAccount();
        },
        // Mirror the sources onto the user's account (debounced) so the feed
        // follows them across devices/logins — "the web doesn't forget".
        _pushSrcToAccount() {
            let tok = '';
            try { tok = localStorage.getItem('geoscope_auth_token') || ''; } catch (_) {}
            if (!tok) return;
            clearTimeout(this._srcPushT);
            this._srcPushT = setTimeout(() => {
                try {
                    fetch('/api/auth/sources', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok },
                        body: JSON.stringify(this.sources),
                    }).catch(() => {});
                } catch (_) {}
            }, 900);
        },
        // Write sources locally WITHOUT pushing back to the server (used when we
        // just pulled them FROM the server, to avoid an echo round-trip).
        _setSrcLocal(arr) {
            this.sources = Array.isArray(arr) ? arr : [];
            try { localStorage.setItem(this.LS_SRC, JSON.stringify(this.sources)); } catch (_) {}
        },
        _saveGeo() { try { localStorage.setItem(this.LS_GEO, JSON.stringify(this.geoCache)); } catch (_) {} },
        _saveHidden() { try { localStorage.setItem(this.LS_HIDDEN, JSON.stringify(this.hidden)); } catch (_) {} },
        _saveRemovedDefaults() { try { localStorage.setItem(this.LS_REMOVED_DEFAULTS, JSON.stringify(this.removedDefaults)); } catch (_) {} },

        // Classify user input into a source — LINKS ONLY. We deliberately do NOT
        // accept bare names or @handles anymore: typing "bbc" used to create a
        // random, often non-existent Telegram channel. The user adds the LINK of
        // the site they want. Returns {type,value,name} or null if not a link.
        //   • https://t.me/<channel>  → telegram (a t.me link is still a link)
        //   • any other http(s) URL    → rss feed (auto-discovered server-side)
        //   • "example.com/path"       → treated as https:// URL (domain + dot)
        normalizeSource(raw) {
            let v = (raw || '').trim();
            if (!v) return null;
            // LINKS ONLY — a bare word like "bbc" is rejected. The user must paste
            // a link; the backend then accesses it and reads the news (RSS feed if
            // present, otherwise headlines extracted from the page HTML).
            // A Telegram channel link (only the full t.me/telegram.me link form).
            const tgLink = v.match(/^(?:https?:\/\/)?(?:www\.)?t(?:elegram)?\.me\/(?:s\/)?@?([A-Za-z0-9_]{3,})/i);
            if (tgLink) return { type: 'telegram', value: tgLink[1], name: '@' + tgLink[1] };
            // Reddit: a subreddit or user URL → its .rss feed (no AI needed).
            const reddit = v.match(/reddit\.com\/(r\/[A-Za-z0-9_]+|user\/[A-Za-z0-9_\-]+)/i);
            if (reddit) {
                const path = reddit[1].replace(/\/+$/, '');
                return { type: 'rss', value: 'https://www.reddit.com/' + path + '/.rss', name: 'reddit.com/' + path };
            }
            // Bare "domain.tld[/path]" without a scheme → assume https.
            if (!/^https?:\/\//i.test(v) && /^[^\s]+\.[a-z]{2,}(?:[/?#]\S*)?$/i.test(v)) {
                v = 'https://' + v;
            }
            if (/^https?:\/\//i.test(v)) {
                const name = v.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0];
                return { type: 'rss', value: v, name };
            }
            return null;   // not a link → reject (the AI resolver may still rescue it)
        },

        // AI resolver — the robust fallback. Turns ANY user input (a bare name
        // like "bbc", a site whose homepage hides its feed, a subreddit, an X
        // handle, a Telegram channel name…) into a concrete, fetchable source.
        // Runs ONCE per add (not per refresh) → credit-light. Returns
        // {type:'rss'|'telegram', value, name} or null.
        async aiResolve(input) {
            if (!isAiEnabled()) return null;
            const sys =
                'You map a user request to ONE concrete, fetchable news source. The user typed a name, ' +
                'URL, handle, subreddit or channel. Reply with ONLY one JSON object, no prose:\n' +
                '{"type":"rss"|"telegram"|"none","value":"<...>","name":"<short display name>"}\n' +
                '- rss: value = the FULL working RSS/Atom feed URL. Use the outlet\'s REAL feed, e.g. ' +
                'BBC News → https://feeds.bbci.co.uk/news/world/rss.xml ; a subreddit → ' +
                'https://www.reddit.com/r/<sub>/.rss ; a YouTube channel → its feeds/videos.xml URL.\n' +
                '- telegram: value = the channel username without @ (for t.me public channels).\n' +
                '- none: only if there is genuinely no reliable public feed (most X/Twitter accounts).\n' +
                'Prefer rss when a real feed exists. Do NOT invent a URL you are not confident serves a valid feed.';
            try {
                const res = await aiFetch('/api/claude', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ system: sys, max_tokens: 300, messages: [{ role: 'user', content: String(input).slice(0, 200) }] }),
                });
                if (!res || !res.ok) return null;
                const data = await res.json();
                let txt = '';
                if (Array.isArray(data.content)) txt = data.content.filter(x => x.type === 'text').map(x => x.text).join('');
                txt = txt.replace(/```json/gi, '').replace(/```/g, '').trim();
                const m = txt.match(/\{[\s\S]*\}/);
                if (!m) return null;
                const obj = JSON.parse(m[0]);
                if (!obj || !obj.type || obj.type === 'none' || !obj.value) return null;
                return obj;
            } catch (_) { return null; }
        },

        // `opts.deferRefresh` lets callers add many sources in a tight loop
        // (e.g. the AI source finder) and trigger ONE refresh at the end
        // instead of one per source — otherwise the `_busy` lock drops every
        // refresh after the first and most sources never get fetched.
        addSource(raw, opts) {
            opts = opts || {};
            const norm = geoFeed.normalizeSource(raw);
            if (!norm) return { ok: false };
            const { type, value } = norm;
            const name = opts.name || norm.name;   // AI resolver / probe can supply a nicer name
            const id = type + ':' + value.toLowerCase();
            if (this.sources.some(s => s.id === id)) return { ok: true, dup: true };
            // Free plan cap: at most FREE_MAX_SOURCES sources. Pro/Team unlimited.
            if (!isPaidPlan() && this.sources.length >= FREE_MAX_SOURCES) {
                return { ok: false, limit: true };
            }
            this.sources.push({ id, type, value, name, important: false });
            this._saveSrc();
            // Clear any "removed default" flag for this id so it stays added.
            if (this.removedDefaults[id]) { delete this.removedDefaults[id]; this._saveRemovedDefaults(); }
            if (!opts.deferRefresh) this.refresh(true);
            return { ok: true };
        },
        removeSource(id) {
            this.sources = this.sources.filter(s => s.id !== id);
            this._saveSrc();
            // If the user removed a default, remember it — don't re-add on next reload.
            if (GEOFEED_DEFAULTS.some(d => d.id === id)) {
                this.removedDefaults[id] = true;
                this._saveRemovedDefaults();
            }
            this._dropBySource(id);   // remove that source's icons + feed entries
            renderUserSourcesList();
        },

        // ── live (backend) Telegram channels: the user can hide any of them; their
        //    icons + feed items vanish and stay filtered out, no backend restart. ──
        isChannelHidden(name) { return !!this.hidden[(name || '').toLowerCase()]; },
        isEventHidden(ev) {
            const chs = (ev && ev.channels) || [];
            return chs.length > 0 && chs.every(c => this.isChannelHidden(c));
        },
        hideChannel(name) {
            if (!name) return;
            this.hidden[name.toLowerCase()] = true;
            this._saveHidden();
            Object.keys(eventsById).forEach(eid => {
                if (this.isEventHidden(eventsById[eid])) { try { removeEventMarker(eid); } catch (_) {} }
            });
            scheduleNewsRender();
            renderUserSourcesList();
        },
        unhideChannel(name) {
            if (!name) return;
            delete this.hidden[name.toLowerCase()];
            this._saveHidden();
            renderUserSourcesList();
        },
        // Distinct live channels currently on the map/feed (for the sources panel).
        liveChannels() {
            const set = new Set();
            newsItems.forEach(it => { if (it.channel && !it.is_outlet) set.add(it.channel); });
            Object.keys(this.hidden).forEach(h => {
                // keep hidden ones listed too so they can be re-enabled
                const match = newsItems.find(it => (it.channel || '').toLowerCase() === h);
                if (match) set.add(match.channel); else set.add(h);
            });
            return Array.from(set);
        },

        _dropBySource(sourceId) {
            // 1. Remove the geolocated map markers tracked for this source.
            Object.keys(this.markers).forEach(k => {
                if (this.markers[k].sourceId === sourceId) this._removeMarkerRec(k);
            });
            // 2. Remove ALL feed items from this source — including the ones that
            //    were never geolocated (added in refresh Step 1, so absent from
            //    this.markers). Without this, removing a source left its articles
            //    sitting in the news panel forever. Their event_id is
            //    `gf|<sourceId>|<articleId>`.
            const prefix = 'gf|' + sourceId + '|';
            for (let i = newsItems.length - 1; i >= 0; i--) {
                const eid = newsItems[i].event_id || '';
                if (eid.indexOf(prefix) === 0) {
                    try { removeEventMarker(eid); } catch (_) {}
                    delete newsById[eid];
                    try { if (typeof eventsById !== 'undefined') delete eventsById[eid]; } catch (_) {}
                    newsItems.splice(i, 1);
                }
            }
            scheduleNewsRender();
        },
        _removeMarkerRec(key) {
            const rec = this.markers[key];
            if (!rec) return;
            try { removeEventMarker(rec.eventId); } catch (_) {}
            delete newsById[rec.eventId];
            for (let i = newsItems.length - 1; i >= 0; i--) {
                if (newsItems[i].event_id === rec.eventId) newsItems.splice(i, 1);
            }
            delete this.markers[key];
        },
        prune() {
            const cut = Date.now() - this.EXPIRY_MS;
            Object.keys(this.markers).forEach(k => {
                if (this.markers[k].ts < cut) this._removeMarkerRec(k);
            });
        },

        _fetchJSON(url) {
            return fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);
        },

        // Pull articles from every configured source — in parallel so adding
        // 10 sources doesn't serialize 10 round-trips.
        async _collect() {
            const bag = [];   // {key,id,sourceId,source,title,summary,link,published,image,onlyImportant}
            const push = (src, a) => {
                const aid = a.link || a.title;
                if (!aid) return;
                bag.push({
                    key: src.id + '|' + aid, id: aid, sourceId: src.id,
                    source: a.source || src.name || '', title: a.title || '', summary: a.summary || '',
                    link: a.link || '', published: a.published || '', image: a.image || '',
                    onlyImportant: !!src.important,
                    // RSS news outlets → "Noticieros" tab; Telegram channels → "Telegram" tab.
                    isOutlet: src.type === 'rss',
                });
            };
            await Promise.all(this.sources.map(async (s) => {
                if (s.type === 'telegram') {
                    const r = await this._fetchJSON('/api/tg?channel=' + encodeURIComponent(s.value));
                    if (r && Array.isArray(r.posts)) r.posts.forEach(a => push(s, { ...a, source: s.name }));
                } else if (s.type === 'rss') {
                    const r = await this._fetchJSON('/api/rss?url=' + encodeURIComponent(s.value));
                    if (r) {
                        // Upgrade a host-only name (e.g. "feeds.bbci.co.uk") to the feed's
                        // real <title> once we know it, so the Sources list is identifiable.
                        const isDefault = (typeof GEOFEED_DEFAULTS !== 'undefined') && GEOFEED_DEFAULTS.some(d => d.id === s.id);
                        if (r.name && !isDefault && (!s.name || /\./.test(s.name)) && s.name !== r.name) {
                            s.name = r.name; this._saveSrc();
                            try { renderUserSourcesList(); } catch (_) {}
                        }
                        if (Array.isArray(r.articles)) r.articles.forEach(a => push(s, { ...a, source: s.name || r.name }));
                    }
                }
            }));
            return bag;
        },

        // ── "News pass done" signal ──
        // A refresh does a FAST pass (fetch + list the articles) then a second
        // pass (local geolocation). A source-loading veil should drop after the
        // fast pass, not block on the second. refresh() calls _signalNewsPass()
        // between the two; onceNewsPass() lets a caller await just the fast pass
        // (or a timeout), so the UI never freezes behind the veil for ~35s.
        _newsPassWaiters: [],
        _signalNewsPass() {
            const w = this._newsPassWaiters;
            this._newsPassWaiters = [];
            w.forEach(fn => { try { fn(); } catch (_) {} });
        },
        onceNewsPass(maxMs) {
            return new Promise(resolve => {
                let done = false;
                const fin = () => { if (done) return; done = true; resolve(); };
                this._newsPassWaiters.push(fin);
                setTimeout(fin, maxMs || 9000);
            });
        },

        async refresh(force) {
            if (!_isOnline) return;               // offline mode — skip all fetching
            if (!map) return;
            // Forced refreshes (after adding sources, etc.) WAIT for the current
            // refresh to finish instead of being dropped — otherwise sources
            // added in a tight loop (AI source finder) silently never get fetched.
            if (this._busy) {
                if (!force) return;
                let waited = 0;
                while (this._busy && waited < 15000) {
                    await new Promise(r => setTimeout(r, 200)); waited += 200;
                }
                if (this._busy) return;             // gave up after 15s
            }
            this._busy = true;
            // Neutral fetching status — NOT "Telegram". Only shown while we
            // actually have sources to fetch; cleared in finally.
            const _statusEl = document.getElementById('news-status');
            if (_statusEl && this.sources.length) {
                _statusEl.textContent = (T[currentLang] || T.en).srcLoading || '';
                _statusEl.style.color = 'var(--muted)';
            }
            try {
                const bag = await this._collect();
                const cut = Date.now() - this.EXPIRY_MS;

                // ── Step 1: add ALL collected posts to the news panel immediately,
                // regardless of AI state or geolocalization. This ensures user-added
                // Telegram channels always appear in the Telegram tab (same UX as
                // the live backend channels).
                let newsAdded = 0;
                for (const art of bag) {
                    const eventId = 'gf|' + art.key;
                    if (newsById[eventId]) continue;
                    const ts = this._articleTs(art.published);
                    if (ts < cut) continue;
                    const iso = new Date(ts).toISOString();
                    const item = {
                        event_id: eventId, channel: art.source || '',
                        message: [art.title, art.summary].filter(Boolean).join('\n\n'),
                        timestamp: iso, event_icon: '📰', event_label: art.source || '',
                        event_cat: 'news', location: '',
                        link: art.link || '', image: art.image || '', is_outlet: !!art.isOutlet,
                    };
                    newsItems.unshift(item);
                    indexNewsByEvent(item);
                    newsAdded++;
                }
                if (newsAdded) scheduleNewsRender();
                // News are on screen now — let any source-loading veil drop and
                // let the (slow) geolocation below finish in the BACKGROUND. This
                // is what fixes the "app freezes for up to 35s" bug: the veil no
                // longer waits for every Claude geolocation batch.
                this._signalNewsPass();

                // ── Step 2: geolocate → place up to (cap) icons PER SOURCE.
                // The user sets how many icons each source may put on the map
                // (Settings → "Iconos por fuente"). We honor that exactly: for each
                // source, take its NEWEST articles and geolocate just enough to
                // reach the cap. This is what fixes "I set 10 but only 3 show" —
                // we now select the right number per source instead of relying on
                // whatever the AI happened to geolocate.
                const cap = this.maxIconsPerSource();
                const placedBySrc = {};
                Object.keys(this.markers).forEach(k => {
                    const sid = this.markers[k].sourceId || '';
                    placedBySrc[sid] = (placedBySrc[sid] || 0) + 1;
                });
                // Group fresh, not-yet-placed articles by source, newest first.
                const bySrc = {};
                for (const art of bag) {
                    if (this.markers[art.key]) continue;
                    const ts = this._articleTs(art.published);
                    if (ts < cut) continue;
                    (bySrc[art.sourceId] = bySrc[art.sourceId] || []).push({ art, ts });
                }
                const todo = [];
                Object.keys(bySrc).forEach(sid => {
                    const arr = bySrc[sid].sort((a, b) => b.ts - a.ts);   // newest first
                    let need = cap - (placedBySrc[sid] || 0);
                    for (const { art, ts } of arr) {
                        if (need <= 0) break;
                        const geo = this.geoCache[art.id];
                        if (geo && geo.skip) continue;             // known un-locatable → don't waste a slot, try the next
                        if (geo) { this._place(art, geo, ts); need--; }   // cached placement (free)
                        else { todo.push(art); need--; }           // needs AI geolocation
                    }
                });
                if (!todo.length) return;
                if (!isAiEnabled()) return;
                const byId = new Map(todo.map(a => [a.id, a]));
                const system =
                    'You are a precise news geolocator. For each item (a headline + short summary) decide ' +
                    'WHERE on Earth the story actually takes place, using your full world knowledge and the ' +
                    'CONTEXT of the item — not just surface words.\n' +
                    'Think about what the story is really about: the people, organizations, events and places ' +
                    'named, and resolve ambiguous names using context. Example: "the White House" / "Casa ' +
                    'Blanca" in a story about US politics or a fight/event there is the White House in ' +
                    'Washington DC, USA — NOT the city of Casablanca in Morocco. A name can be a building, an ' +
                    'organization, or a person; infer the REAL place it refers to.\n' +
                    'STRICT RULES:\n' +
                    '- Accuracy matters far more than coverage. Only return a location you are genuinely ' +
                    'confident is correct.\n' +
                    '- If the item is ambiguous, generic, or has no clearly locatable place, OMIT it entirely. ' +
                    'Do NOT guess and do NOT force a country. Returning fewer items than given is expected and good.\n' +
                    '- If there is only a partial hint (a region, province or town), use it only if you can ' +
                    'place it confidently; otherwise omit.\n' +
                    '- Prefer the most specific correct place (city > region > country).\n' +
                    'Reply ONLY with a JSON array, no extra text:\n' +
                    '[{"id":"<id>","place":"<city or country, English>","lat":<number>,"lng":<number>,' +
                    '"emoji":"<one emoji for the topic>","confidence":<0-10 how sure you are about the LOCATION>,' +
                    '"importance":<0-10 newsworthiness>}]\n' +
                    'Include an item ONLY if its location confidence is 7 or higher. Omit everything else.';
                // Small batches so the JSON reply never gets truncated by the token cap.
                const BATCH = 12;
                let changed = 0;
                for (let b = 0; b < todo.length && b < 96; b += BATCH) {
                    const slice = todo.slice(b, b + BATCH);
                    const items = slice.map(a => ({
                        id: a.id, text: [a.title, a.summary].filter(Boolean).join(' — ').slice(0, 280),
                    }));
                    let arr = null;
                    try {
                        // claudeComplete retries transient overloads, so icons still
                        // get placed during the API's busy spikes.
                        const txt = await claudeComplete({ system, max_tokens: 4000, messages: [{ role: 'user', content: JSON.stringify(items) }] });
                        if (txt == null) continue;
                        arr = this._parseGeoArray(txt);
                    } catch (_) { continue; }
                    if (!Array.isArray(arr)) continue;
                    // Track which ids the AI confidently placed; everything else in
                    // this batch is treated as "un-locatable" and cached as a skip so
                    // we never force a wrong marker and never re-query it every refresh.
                    const placedIds = new Set();
                    arr.forEach(g => {
                        if (!g || !g.id || typeof g.lat !== 'number' || typeof g.lng !== 'number' || !byId.has(g.id)) return;
                        // Confidence gate — correctness over coverage. Skip low-confidence
                        // guesses (this is what stops "Casa Blanca" → Casablanca errors).
                        const conf = typeof g.confidence === 'number' ? g.confidence : 0;
                        if (conf < 7) return;
                        const geo = { lat: g.lat, lng: g.lng, place: g.place || '', emoji: g.emoji || '📰', importance: typeof g.importance === 'number' ? g.importance : 5 };
                        this.geoCache[g.id] = geo; changed++;
                        placedIds.add(g.id);
                        const art = byId.get(g.id);
                        this._place(art, geo, this._articleTs(art.published));
                    });
                    // Cache un-locatable items so they don't get re-queried forever.
                    slice.forEach(a => {
                        if (!placedIds.has(a.id) && !this.geoCache[a.id]) { this.geoCache[a.id] = { skip: true }; changed++; }
                    });
                    if (changed) this._saveGeo();
                }
            } finally {
                this._busy = false;
                // Clear the neutral fetching status once done.
                const el = document.getElementById('news-status');
                if (el && el.textContent === ((T[currentLang] || T.en).srcLoading || '')) {
                    el.textContent = '';
                }
            }
        },

        _articleTs(published) {
            if (!published) return Date.now();
            const ms = Date.parse(published);
            return isFinite(ms) ? ms : Date.now();
        },

        // ── Shared AI geolocation call ──
        // entries = [{id, text}]. Returns {id → {lat,lng,place,emoji,importance}}
        // (possibly empty = AI answered but placed none) or null if the AI is
        // unreachable/off. The marker emoji is the country flag (iso2), so
        // AI-placed icons look exactly like gazetteer-placed ones.
        async _aiGeolocate(entries) {
            if (!isAiEnabled() || !entries.length) return null;
            const system =
                'You are a precise news geolocator. For each item decide WHERE on Earth the story takes ' +
                'place, resolving ambiguous names from context (e.g. "Casa Blanca" in a US-politics story ' +
                'is the White House in Washington DC, not Casablanca). Prefer the most specific correct ' +
                'place (city > region > country). Accuracy beats coverage: OMIT any item you cannot place ' +
                'with high confidence — never guess. Reply ONLY with a JSON array, no other text:\n' +
                '[{"id":"<id>","place":"<city or country, in English>","lat":<number>,"lng":<number>,' +
                '"iso2":"<2-letter country code>"}]';
            let txt = null;
            try {
                txt = await claudeComplete({ system, max_tokens: 1500, messages: [{ role: 'user', content: JSON.stringify(entries) }] });
            } catch (_) { return null; }
            if (txt == null) return null;
            const arr = this._parseGeoArray(txt);
            const out = {};
            (Array.isArray(arr) ? arr : []).forEach(g => {
                if (!g || !g.id || typeof g.lat !== 'number' || typeof g.lng !== 'number') return;
                out[g.id] = { lat: g.lat, lng: g.lng, place: g.place || '', emoji: _gazFlag(g.iso2 || ''), importance: 5 };
            });
            return out;
        },

        // Robust extraction of a JSON array from Claude's reply: strips ```json
        // fences, and if the array is truncated, salvages whole {...} objects.
        _parseGeoArray(txt) {
            if (!txt) return null;
            const s = txt.replace(/```json/gi, '').replace(/```/g, '').trim();
            const start = s.indexOf('[');
            if (start === -1) return null;
            const end = s.lastIndexOf(']');
            if (end > start) {
                try { return JSON.parse(s.slice(start, end + 1)); } catch (_) {}
            }
            const objs = s.slice(start).match(/\{[^{}]*\}/g) || [];
            const out = [];
            objs.forEach(o => { try { out.push(JSON.parse(o)); } catch (_) {} });
            return out.length ? out : null;
        },

        // ── Explicit "Geolocalizar" from the news context menu ──
        // Free when possible (items already on the map + cached geo); ONE small
        // AI call for the rest. Ends by flying the map to the result(s), or
        // showing a brief "couldn't geolocate" note in the news-status strip.
        async geolocateNewsItems(items) {
            const tr = T[currentLang] || T.en;
            const status = document.getElementById('news-status');
            const placed = [];      // {id, lat, lng}
            const todo = [];
            for (const it of (items || [])) {
                if (it.lat != null && it.lng != null) { placed.push({ id: it.event_id, lat: it.lat, lng: it.lng }); continue; }
                const aid = this._articleIdForItem(it);
                const cached = aid ? this.geoCache[aid] : null;
                if (cached && !cached.skip) {
                    this._placeNewsItem(it, cached);
                    placed.push({ id: it.event_id, lat: cached.lat, lng: cached.lng });
                    continue;
                }
                todo.push(it);
            }
            if (todo.length && isAiEnabled()) {
                if (status) { status.textContent = tr.newsGeolocating || ''; status.style.color = 'var(--muted)'; }
                const slice = todo.slice(0, 12);
                const entries = slice.map((it, i) => ({ id: String(i), text: _cleanMessage(it.message || '').replace(/\s+/g, ' ').slice(0, 300) }));
                const got = await this._aiGeolocate(entries);
                slice.forEach((it, i) => {
                    const geo = got && got[String(i)];
                    if (!geo) return;
                    const aid = this._articleIdForItem(it);
                    if (aid) { this.geoCache[aid] = geo; this._saveGeo(); }
                    this._placeNewsItem(it, geo);
                    placed.push({ id: it.event_id, lat: geo.lat, lng: geo.lng });
                });
                if (status && status.textContent === (tr.newsGeolocating || '')) status.textContent = '';
            }
            if (!placed.length) {
                if (status) {
                    const msg = tr.newsGeolocateFail || 'No se pudo geolocalizar';
                    status.textContent = msg;
                    status.style.color = 'var(--muted)';
                    setTimeout(() => { if (status.textContent === msg) status.textContent = ''; }, 4000);
                }
                return;
            }
            // Fly to the result: one item → full focus (zoom + highlight);
            // several → fit them all in view.
            try {
                if (!map || !placed.length) { /* nothing to fly to */ }
                else if (placed.length === 1) {
                    // Fly straight to the coordinates (we always have them) so the
                    // map ALWAYS moves — focusEventOnMap alone silently no-ops when
                    // the just-placed marker isn't in the event index yet (this is
                    // why "geolocate" only flew for some items). Then, once the
                    // marker has settled, focus it for the pulse + tooltip.
                    const p = placed[0];
                    map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), EVENT_FOCUS_ZOOM), { duration: 0.8 });
                    if (p.id) setTimeout(() => { try { focusEventOnMap(p.id); } catch (_) {} }, 350);
                } else {
                    map.flyToBounds(L.latLngBounds(placed.map(p => [p.lat, p.lng])), { padding: [70, 70], maxZoom: 6 });
                }
            } catch (_) {}
        },

        // The geoCache key for a news item (geoFeed articles only): the cache is
        // keyed by article id = link-or-title, recoverable from 'gf|<src>|<id>'.
        _articleIdForItem(it) {
            const eid = (it && it.event_id) || '';
            if (eid.indexOf('gf|') !== 0) return '';
            const key = eid.slice(3);
            const cut = key.indexOf('|');
            return cut === -1 ? '' : key.slice(cut + 1);
        },

        // Put ANY news item on the map at the given geo. Explicit user action:
        // not subject to the per-source icon cap. Updates the feed entry too so
        // the news item ↔ map icon linkage works both ways.
        _placeNewsItem(item, geo) {
            if (!item.event_id) {
                item.event_id = 'gf|ctx|' + Math.random().toString(36).slice(2);
                try { indexNewsByEvent(item); } catch (_) {}
            }
            item.lat = geo.lat; item.lng = geo.lng;
            item.location = geo.place || item.location || '';
            if (geo.emoji) item.event_icon = geo.emoji;
            const ts = this._articleTs(item.timestamp);
            upsertEventMarker({
                event_id: item.event_id, event_type: 'news', event_icon: item.event_icon || '📰',
                event_label: item.channel || geo.place || '', event_cat: 'news', event_status: '',
                lat: geo.lat, lng: geo.lng, location: geo.place || '', loc_tier: '',
                timestamp: item.timestamp || new Date(ts).toISOString(),
                channels: [item.channel || ''], channels_count: 1, event_importance: 5,
            }, true);
            // Register geoFeed articles so prune/cap accounting sees the marker.
            if (item.event_id.indexOf('gf|') === 0) {
                const key = item.event_id.slice(3);
                this.markers[key] = { eventId: item.event_id, ts, sourceId: key.split('|')[0] };
            }
            scheduleNewsRender();
        },

        // ── Icons-per-source cap (Settings slider) ──
        // The user chooses how many map icons each source may place. Default 6.
        maxIconsPerSource() {
            const v = parseInt(localStorage.getItem(this.LS_MAXICONS), 10);
            return (isFinite(v) && v > 0) ? v : this.DEFAULT_MAXICONS;
        },
        setMaxIconsPerSource(n) {
            const v = Math.max(1, Math.min(50, parseInt(n, 10) || this.DEFAULT_MAXICONS));
            try { localStorage.setItem(this.LS_MAXICONS, String(v)); } catch (_) {}
            return v;
        },
        // How many markers a source already has on the map.
        _markerCountForSource(sourceId) {
            let n = 0;
            for (const k in this.markers) { if (this.markers[k].sourceId === sourceId) n++; }
            return n;
        },
        // Re-enforce the cap after the user lowers it: keep each source's NEWEST
        // markers, drop the excess. (Raising the cap is handled by refresh(true),
        // which re-places cached-geo items that were previously skipped — no AI cost.)
        applyIconCap() {
            const cap = this.maxIconsPerSource();
            const bySrc = {};
            Object.keys(this.markers).forEach(k => {
                const sid = this.markers[k].sourceId || '';
                (bySrc[sid] = bySrc[sid] || []).push(k);
            });
            let removed = 0;
            Object.values(bySrc).forEach(keys => {
                keys.sort((a, b) => (this.markers[b].ts || 0) - (this.markers[a].ts || 0));
                keys.slice(cap).forEach(k => { this._removeMarkerRec(k); removed++; });
            });
            if (removed) scheduleNewsRender();
        },

        // The user's interests (English labels) from their onboarding profile.
        // Used to let the AI curate which items reach the map — "escoge las
        // noticias en relación a lo que le gusta el usuario". Empty = no filter.
        _userTopics() {
            try {
                const p = JSON.parse(localStorage.getItem('geoscope_profile') || 'null');
                if (!p) return [];
                const labels = (p.topics || []).map(id => {
                    const t = (typeof ONB_TOPICS !== 'undefined') && ONB_TOPICS.find(x => x.id === id);
                    return t ? (t.t.en || id) : id;
                });
                if (p.topicsText) labels.push(p.topicsText);
                return labels.filter(Boolean);
            } catch (_) { return []; }
        },

        // Inject the article as a FIRST-CLASS event so it clusters, spiderfies and
        // opens in the news panel on click — exactly like the live Telegram icons.
        _place(art, geo, ts) {
            if (this.markers[art.key]) return;
            if (ts < Date.now() - this.EXPIRY_MS) return;
            // Per-source icon cap (Settings → "Iconos por fuente") is the ONLY
            // limiter now: place up to N icons per source. No importance/relevance
            // hard-drops — those made the map show far fewer icons than the user
            // asked for ("I set 10 but only 3 appear"). Step 2 already selected the
            // newest N articles per source; this is the safety net that enforces N.
            if (this._markerCountForSource(art.sourceId) >= this.maxIconsPerSource()) return;
            const eventId = 'gf|' + art.key;
            const iso = new Date(ts).toISOString();
            const emoji = geo.emoji || '📰';
            const label = art.source || geo.place || '';
            const isOutlet = !!art.isOutlet;   // RSS → Noticieros tab; Telegram → Telegram tab
            // Feed entry (so a click can scroll/highlight it in the panel).
            if (!newsById[eventId]) {
                const item = {
                    event_id: eventId, channel: art.source || '',
                    message: [art.title, art.summary].filter(Boolean).join('\n\n'),
                    timestamp: iso, event_icon: emoji, event_label: label,
                    event_cat: 'news', location: geo.place || '',
                    lat: geo.lat, lng: geo.lng,
                    link: art.link || '', image: art.image || '', is_outlet: isOutlet,
                };
                newsItems.unshift(item);
                indexNewsByEvent(item);
            } else {
                const existing = newsById[eventId];
                existing.lat = geo.lat;
                existing.lng = geo.lng;
                existing.location = geo.place || '';
                existing.event_icon = emoji;
                existing.event_label = label;
            }
            // Map marker via the shared pipeline (clustering + spiderfy + zoom + focus).
            // event_importance carries the AI's 0–10 newsworthiness so eventScore can
            // rank these alongside Telegram events (else they vanish at mid-zoom).
            upsertEventMarker({
                event_id: eventId, event_type: 'news', event_icon: emoji,
                event_label: label, event_cat: 'news', event_status: '',
                lat: geo.lat, lng: geo.lng, location: geo.place || '', loc_tier: '',
                timestamp: iso, channels: [art.source || ''], channels_count: 1,
                event_importance: (typeof geo.importance === 'number' ? geo.importance : 5),
            }, true);
            this.markers[art.key] = { eventId, ts, sourceId: art.sourceId };
        },
    };

    function renderUserSourcesList() {
        const list = document.getElementById('usp-list');
        if (!list) return;
        const tr = T[currentLang] || T.en;
        // Bucket every source by type so the panel ALWAYS shows Telegram channels
        // grouped together and news outlets grouped together — regardless of the
        // order the user added them. Each row shows just the name + a remove button
        // (no "default"/"live" origin tags — those only confused the user).
        // ONLY the user's own sources (manually added or AI-found) show here.
        // We used to also mix in `geoFeed.liveChannels()` — Telegram channels
        // streamed by the backend — but the user never added those, so seeing
        // them after a Reset was confusing ("I cleared everything, why are
        // these still here?"). The live news feed itself still flows; the
        // Sources tab is now strictly what the user / AI configured.
        const tgItems = [];
        const rssItems = [];
        geoFeed.sources.forEach(s => {
            const row = { name: s.name, action: 'delete', actionData: { 'data-src-id': s.id }, hidden: false };
            (s.type === 'telegram' ? tgItems : rssItems).push(row);
        });

        if (!tgItems.length && !rssItems.length) {
            list.innerHTML = `<div class="usp-empty">${escapeHtml(tr.noSources || 'No custom sources yet.')}</div>`;
            return;
        }

        const renderRow = (it, ico) => {
            const btnTitle = it.action === 'hide'   ? (tr.srcHide   || 'Hide')
                           : it.action === 'unhide' ? (tr.srcShow   || 'Show')
                           :                          (tr.srcDelete || 'Remove');
            const btnIco = it.action === 'unhide' ? '↺' : '✕';
            const attrs = Object.entries(it.actionData).map(([k, v]) => `${k}="${escapeHtml(v)}"`).join(' ');
            return `<div class="usp-item${it.hidden ? ' usp-item-off' : ''}">
                <span class="usp-item-ico">${ico}</span>
                <span class="usp-item-name">${escapeHtml(it.name)}</span>
                <button class="usp-item-del" ${attrs} title="${escapeHtml(btnTitle)}">${btnIco}</button>
            </div>`;
        };

        let html = '';
        if (tgItems.length) {
            html += `<div class="usp-group-hdr">${escapeHtml(tr.srcTelegram || 'Telegram')}</div>`;
            html += tgItems.map(it => renderRow(it, '✈️')).join('');
        }
        if (rssItems.length) {
            html += `<div class="usp-group-hdr">${escapeHtml(tr.srcOutlets || 'News outlets')}</div>`;
            html += rssItems.map(it => renderRow(it, '📡')).join('');
        }
        list.innerHTML = html;
    }

    function wireUserSources() {
        const input = document.getElementById('usp-input');
        const submit = document.getElementById('usp-add-btn');
        const status = document.getElementById('usp-status');
        const list = document.getElementById('usp-list');

        // Add ANYTHING: a name ("bbc"), a site URL, a subreddit, a Telegram
        // channel, an X handle… Resolution chain: (1) direct classification +
        // backend feed auto-discovery (free); (2) AI resolver fallback (one call
        // per add) that turns the input into a real feed/channel. Telegram and
        // discoverable feeds never touch the AI; only the hard cases do.
        const doAdd = async () => {
            const tr = T[currentLang] || T.en;
            const v = (input.value || '').trim();
            if (!v) return;

            const setErr = (msg) => { if (status) { status.textContent = msg || tr.srcInvalid; status.classList.add('usp-status-err'); } };
            // Free plan: hard cap at FREE_MAX_SOURCES sources. Block before the
            // loading veil / probe and send the user straight to the plans view
            // so the only way past the limit is upgrading.
            if (!isPaidPlan() && geoFeed.sources.length >= FREE_MAX_SOURCES) {
                setErr((tr.srcLimitFree || 'Has alcanzado el límite de 5 fuentes del plan Free. Mejora a Pro para fuentes ilimitadas.'));
                try { auth.showPlans(); } catch (_) {}
                return;
            }
            const probeRss = async (url) => {
                try {
                    const res = await fetch('/api/rss?url=' + encodeURIComponent(url));
                    return res.ok ? await res.json() : null;   // {ok,articles,name,error} | null
                } catch (_) { return null; }
            };
            // Defer the per-source refresh so we trigger ONE awaited refresh below
            // and can keep the veil up until news + icons are actually loaded.
            const finish = (raw, name) => {
                const opts = { deferRefresh: true };
                if (name) opts.name = name;
                const r = geoFeed.addSource(raw, opts);
                if (!r.ok) { setErr(r.limit ? (tr.srcLimitFree || 'Has alcanzado el límite de 5 fuentes del plan Free. Mejora a Pro para fuentes ilimitadas.') : tr.srcInvalid); return false; }
                input.value = '';
                renderUserSourcesList();   // source shows in the list immediately
                if (status) { status.classList.remove('usp-status-err'); status.textContent = tr.srcAdded || 'Source added — fetching news…'; }
                setTimeout(() => { if (status) status.textContent = ''; }, 4000);
                return true;
            };

            // ── Links only ──
            const norm = geoFeed.normalizeSource(v);
            if (!norm) { setErr(tr.srcInvalid); return; }   // not a link → reject

            // Show the blurred source-loading veil for the whole add — both for a
            // Telegram channel and for an RSS/website. It stays up until the source,
            // its news AND its icons are on screen (or a hard cap), so the user is
            // never left looking at a half-loaded state.
            showSourceLoading();
            let added = false;
            try {
                if (norm.type === 'telegram') {
                    added = finish('https://t.me/' + norm.value, norm.name);
                } else {
                    // RSS / website: probe the link so we (a) confirm the news is
                    // readable and (b) get a good display name / an honest error.
                    if (status) { status.textContent = tr.srcLoading || 'Loading…'; status.classList.remove('usp-status-err'); }
                    const probe = await probeRss(norm.value);
                    if (probe && probe.ok && Array.isArray(probe.articles) && probe.articles.length) {
                        added = finish(norm.value, probe.name || norm.name);
                    } else if (probe && probe.error === 'blocked') {
                        setErr(tr.srcBlocked);
                    } else if (probe && probe.error === 'unreachable') {
                        setErr(tr.srcUnreachable);
                    } else if (norm.value.startsWith('http')) {
                        // Reachable but nothing parseable right now → still add it;
                        // refreshes retry and may pick it up later.
                        added = finish(norm.value, norm.name);
                    } else {
                        setErr(tr.srcNoFeed);
                    }
                }
                // Only wait if a source was actually added. Keep the veil up only
                // until the news list is populated (fast pass); icons keep
                // geolocating in the background so the UI never freezes.
                if (added) { geoFeed.refresh(true).catch(() => {}); await geoFeed.onceNewsPass(9000); }
            } finally {
                hideSourceLoading();
            }
        };
        if (submit) submit.addEventListener('click', doAdd);
        if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doAdd(); } });
        if (list) list.addEventListener('click', e => {
            const tr = T[currentLang] || T.en;
            const confirmMsg = tr.srcConfirmDelete || 'Are you sure you want to remove this source?';
            const del = e.target.closest('[data-src-id]');
            if (del) {
                if (!window.confirm(confirmMsg)) return;
                geoFeed.removeSource(del.dataset.srcId);
                renderUserSourcesList();
                return;
            }
            const hide = e.target.closest('[data-hide-ch]');
            if (hide) {
                if (!window.confirm(confirmMsg)) return;
                geoFeed.hideChannel(hide.dataset.hideCh);
                renderUserSourcesList();
                return;
            }
            const unhide = e.target.closest('[data-unhide-ch]');
            if (unhide) { geoFeed.unhideChannel(unhide.dataset.unhideCh); renderUserSourcesList(); return; }
        });

        // "ayuda" link in the Sources panel header — opens a modal that
        // explains every source type the user can add (Telegram, RSS from
        // news outlets, blogs, forums, niche communities, etc.). Without
        // this the placeholder ("Añade URL o fuente deseada") doesn't make
        // clear what's actually accepted.
        const helpBtn = document.getElementById('usp-help-btn');
        if (helpBtn) helpBtn.addEventListener('click', () => sourceHelp.open());
    }

    // Help modal for the Sources panel. Renders into #src-help-overlay using
    // localized title + HTML body from T[lang].srcHelp{Title,Body}.
    const sourceHelp = {
        open() {
            const ov = document.getElementById('src-help-overlay');
            if (!ov) return;
            const tr = T[currentLang] || T.en;
            const rtl = (currentLang === 'ar' || currentLang === 'fa' || currentLang === 'he');
            ov.innerHTML = `<div class="src-help-modal" dir="${rtl ? 'rtl' : 'ltr'}">
                <button class="src-help-close" type="button" aria-label="Close">×</button>
                <h2 class="src-help-title">${escapeHtml(tr.srcHelpTitle || 'What can I add?')}</h2>
                <div class="src-help-body">${tr.srcHelpBody || ''}</div>
            </div>`;
            ov.style.display = 'flex';
            ov.setAttribute('aria-hidden', 'false');
            const close = () => this.close();
            ov.querySelector('.src-help-close').addEventListener('click', close);
            ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
            document.addEventListener('keydown', this._esc = (e) => { if (e.key === 'Escape') close(); });
        },
        close() {
            const ov = document.getElementById('src-help-overlay');
            if (!ov) return;
            ov.style.display = 'none';
            ov.setAttribute('aria-hidden', 'true');
            ov.innerHTML = '';
            if (this._esc) { document.removeEventListener('keydown', this._esc); this._esc = null; }
        },
    };

    // ───────────────────────────────────────────────────────────────────────
    // Onboarding — first-run setup wizard. Collects language, theme, name,
    // email, topics, source preference (manual vs AI), regions and
    // notifications, then persists the profile to localStorage. Shows once;
    // a provisional dev "reset" button in the top bar wipes the profile so the
    // flow can be replayed as a brand-new user.
    // ───────────────────────────────────────────────────────────────────────
    const LS_PROFILE = 'geoscope_profile';

    // Language picker labels (same set as the settings <select>).
    // No flag emojis — user asked for no emojis in the onboarding stages
    // and the same list is reused in the settings dropdown to stay consistent.
    const ONB_LANGS = [
        { id: 'es', label: '🇪🇸 Español'  }, { id: 'en', label: '🇬🇧 English' },
        { id: 'fr', label: '🇫🇷 Français' }, { id: 'ru', label: '🇷🇺 Русский' },
        { id: 'zh', label: '🇨🇳 中文'      }, { id: 'tr', label: '🇹🇷 Türkçe'  },
        { id: 'ar', label: '🇸🇦 العربية'  }, { id: 'fa', label: '🇮🇷 فارسی'   },
        { id: 'he', label: '🇮🇱 עברית'    }, { id: 'nl', label: '🇳🇱 Nederlands' },
        { id: 'it', label: '🇮🇹 Italiano' }, { id: 'pt', label: '🇵🇹 Português' },
        { id: 'hi', label: '🇮🇳 हिन्दी'    },
    ];

    // Topic chips (multi-select). Each carries a per-language label.
    const ONB_TOPICS = [
        { id: 'armed',     ico: '⚔️', t:{ es:'Conflictos armados', en:'Armed conflicts', fr:'Conflits armés', ru:'Вооружённые конфликты', zh:'武装冲突', tr:'Silahlı çatışmalar', ar:'النزاعات المسلحة', fa:'درگیری‌های مسلحانه', he:'סכסוכים מזוינים', nl:'Gewapende conflicten', it:'Conflitti armati', pt:'Conflitos armados', hi:'सशस्त्र संघर्ष' } },
        { id: 'diplomacy', ico: '🤝', t:{ es:'Diplomacia', en:'Diplomacy', fr:'Diplomatie', ru:'Дипломатия', zh:'外交', tr:'Diplomasi', ar:'الدبلوماسية', fa:'دیپلماسی', he:'דיפלומטיה', nl:'Diplomatie', it:'Diplomazia', pt:'Diplomacia', hi:'कूटनीति' } },
        { id: 'economy',   ico: '💰', t:{ es:'Economía', en:'Economy', fr:'Économie', ru:'Экономика', zh:'经济', tr:'Ekonomi', ar:'الاقتصاد', fa:'اقتصاد', he:'כלכלה', nl:'Economie', it:'Economia', pt:'Economia', hi:'अर्थव्यवस्था' } },
        { id: 'energy',    ico: '⚡', t:{ es:'Energía', en:'Energy', fr:'Énergie', ru:'Энергетика', zh:'能源', tr:'Enerji', ar:'الطاقة', fa:'انرژی', he:'אנרגיה', nl:'Energie', it:'Energia', pt:'Energia', hi:'ऊर्जा' } },
        { id: 'terror',    ico: '💥', t:{ es:'Terrorismo', en:'Terrorism', fr:'Terrorisme', ru:'Терроризм', zh:'恐怖主义', tr:'Terörizm', ar:'الإرهاب', fa:'تروریسم', he:'טרור', nl:'Terrorisme', it:'Terrorismo', pt:'Terrorismo', hi:'आतंकवाद' } },
        { id: 'cyber',     ico: '🛡️', t:{ es:'Ciberseguridad', en:'Cybersecurity', fr:'Cybersécurité', ru:'Кибербезопасность', zh:'网络安全', tr:'Siber güvenlik', ar:'الأمن السيبراني', fa:'امنیت سایبری', he:'סייבר', nl:'Cyberbeveiliging', it:'Cybersicurezza', pt:'Cibersegurança', hi:'साइबर सुरक्षा' } },
        { id: 'climate',   ico: '🌍', t:{ es:'Clima', en:'Climate', fr:'Climat', ru:'Климат', zh:'气候', tr:'İklim', ar:'المناخ', fa:'اقلیم', he:'אקלים', nl:'Klimaat', it:'Clima', pt:'Clima', hi:'जलवायु' } },
        { id: 'migration', ico: '🚶', t:{ es:'Migración', en:'Migration', fr:'Migration', ru:'Миграция', zh:'移民', tr:'Göç', ar:'الهجرة', fa:'مهاجرت', he:'הגירה', nl:'Migratie', it:'Migrazione', pt:'Migração', hi:'प्रवासन' } },
        { id: 'elections', ico: '🗳️', t:{ es:'Elecciones', en:'Elections', fr:'Élections', ru:'Выборы', zh:'选举', tr:'Seçimler', ar:'الانتخابات', fa:'انتخابات', he:'בחירות', nl:'Verkiezingen', it:'Elezioni', pt:'Eleições', hi:'चुनाव' } },
        { id: 'defense',   ico: '🪖', t:{ es:'Defensa / Militar', en:'Defense / Military', fr:'Défense / Militaire', ru:'Оборона / Армия', zh:'国防/军事', tr:'Savunma / Askeri', ar:'الدفاع / العسكري', fa:'دفاع / نظامی', he:'ביטחון / צבא', nl:'Defensie / Militair', it:'Difesa / Militare', pt:'Defesa / Militar', hi:'रक्षा / सैन्य' } },
    ];

    // Region chips (multi-select, only when AI sources are chosen).
    const ONB_REGIONS = [
        { id: 'latam',    ico: '🌎', t:{ es:'Latinoamérica', en:'Latin America', fr:'Amérique latine', ru:'Латинская Америка', zh:'拉丁美洲', tr:'Latin Amerika', ar:'أمريكا اللاتينية', fa:'آمریکای لاتین', he:'אמריקה הלטינית', nl:'Latijns-Amerika', it:'America Latina', pt:'América Latina', hi:'लैटिन अमेरिका' } },
        { id: 'europe',   ico: '🇪🇺', t:{ es:'Europa', en:'Europe', fr:'Europe', ru:'Европа', zh:'欧洲', tr:'Avrupa', ar:'أوروبا', fa:'اروپا', he:'אירופה', nl:'Europa', it:'Europa', pt:'Europa', hi:'यूरोप' } },
        { id: 'asia',     ico: '🌏', t:{ es:'Asia', en:'Asia', fr:'Asie', ru:'Азия', zh:'亚洲', tr:'Asya', ar:'آسيا', fa:'آسیا', he:'אסיה', nl:'Azië', it:'Asia', pt:'Ásia', hi:'एशिया' } },
        { id: 'africa',   ico: '🌍', t:{ es:'África', en:'Africa', fr:'Afrique', ru:'Африка', zh:'非洲', tr:'Afrika', ar:'أفريقيا', fa:'آفریقا', he:'אפריקה', nl:'Afrika', it:'Africa', pt:'África', hi:'अफ़्रीका' } },
        { id: 'namerica', ico: '🌎', t:{ es:'Norteamérica', en:'North America', fr:'Amérique du Nord', ru:'Северная Америка', zh:'北美', tr:'Kuzey Amerika', ar:'أمريكا الشمالية', fa:'آمریکای شمالی', he:'צפון אמריקה', nl:'Noord-Amerika', it:'America del Nord', pt:'América do Norte', hi:'उत्तर अमेरिका' } },
        { id: 'mideast',  ico: '🕌', t:{ es:'Oriente Medio', en:'Middle East', fr:'Moyen-Orient', ru:'Ближний Восток', zh:'中东', tr:'Orta Doğu', ar:'الشرق الأوسط', fa:'خاورمیانه', he:'המזרח התיכון', nl:'Midden-Oosten', it:'Medio Oriente', pt:'Médio Oriente', hi:'मध्य पूर्व' } },
        { id: 'oceania',  ico: '🦘', t:{ es:'Oceanía', en:'Oceania', fr:'Océanie', ru:'Океания', zh:'大洋洲', tr:'Okyanusya', ar:'أوقيانوسيا', fa:'اقیانوسیه', he:'אוקיאניה', nl:'Oceanië', it:'Oceania', pt:'Oceânia', hi:'ओशिनिया' } },
        { id: 'world',    ico: '🌐', t:{ es:'Todo el mundo', en:'Whole world', fr:'Le monde entier', ru:'Весь мир', zh:'全世界', tr:'Tüm dünya', ar:'العالم كله', fa:'سراسر جهان', he:'כל העולם', nl:'De hele wereld', it:'Tutto il mondo', pt:'O mundo inteiro', hi:'पूरी दुनिया' } },
    ];

    // Wizard UI strings (titles, buttons) per language.
    // Note: email step removed (we'll have it from registration). Old s8/notifications
    // merged into a single step (s4 "updates") with two yes/no questions.
    const ONB_UI = {
        es:{ welcome:'Bienvenido a Skorpene', stepOf:'Paso {a} de {b}', next:'Siguiente', back:'Atrás', finish:'Empezar', s1T:'Elige tu idioma', s1S:'Toda la interfaz se mostrará en este idioma', s2T:'Elige el tema', s2S:'¿Prefieres modo oscuro o claro?', dark:'Oscuro', light:'Claro', s3T:'¿Cómo te llamas?', s3S:'Para dirigirnos a ti correctamente', s3P:'Tu nombre', s3T2:'¿cuál es tu género?', s3Greet:'Hola {name},', s3GreetSub:'Así podremos dirigirnos a ti correctamente', sexMale:'Masculino', sexFemale:'Femenino', sexNoSay:'Prefiero no decirlo', s4T:'Novedades y notificaciones', s4S:'Para que no te pierdas nada importante', s4qNews:'¿Quieres recibir novedades?', s4qNotif:'¿Aceptas notificaciones?', s5T:'¿Qué temas te interesan?', s5S:'Elige al menos uno (o escribe los tuyos)', s5P:'Otros temas (separados por comas)', s6T:'¿Cómo quieres tus fuentes?', s6S:'Podrás cambiarlo cuando quieras', s6mT:'Las elijo yo', s6mS:'Añade tus propias fuentes: canales, foros, blogs, RSS, webs…', s6aT:'Que la IA las busque', s6aS:'Skorpene buscará canales, foros, blogs, webs y RSS según tus gustos', s7T:'¿Qué regiones te interesan?', s7S:'Elige al menos una (o escribe países concretos)', s7P:'Otros países o regiones (separados por comas)', yes:'Sí', no:'No' },
        en:{ welcome:'Welcome to Skorpene', stepOf:'Step {a} of {b}', next:'Next', back:'Back', finish:'Start', s1T:'Choose your language', s1S:'The whole interface will use this language', s2T:'Choose a theme', s2S:'Do you prefer dark or light mode?', dark:'Dark', light:'Light', s3T:'What is your name?', s3S:'So we can address you correctly', s3P:'Your name', s3T2:'what is your gender?', s3Greet:'Hi {name},', s3GreetSub:'So we can address you correctly', sexMale:'Male', sexFemale:'Female', sexNoSay:'Prefer not to say', s4T:'Updates & notifications', s4S:'So you don\'t miss anything important', s4qNews:'Receive newsletter?', s4qNotif:'Allow notifications?', s5T:'Which topics interest you?', s5S:'Pick at least one (or type your own)', s5P:'Other topics (comma-separated)', s6T:'How do you want your sources?', s6S:'You can change this anytime', s6mT:'I pick them', s6mS:'Add your own sources: channels, forums, blogs, RSS, websites…', s6aT:'Let the AI find them', s6aS:'Skorpene will find channels, forums, blogs, websites and RSS for your interests', s7T:'Which regions interest you?', s7S:'Pick at least one (or type specific countries)', s7P:'Other countries or regions (comma-separated)', yes:'Yes', no:'No' },
        fr:{ welcome:'Bienvenue sur Skorpene', stepOf:'Étape {a} sur {b}', next:'Suivant', back:'Retour', finish:'Commencer', s1T:'Choisissez votre langue', s1S:'Toute l\'interface utilisera cette langue', s2T:'Choisissez un thème', s2S:'Préférez-vous le mode sombre ou clair ?', dark:'Sombre', light:'Clair', s3T:'Comment vous appelez-vous ?', s3S:'Pour vous adresser correctement', s3P:'Votre nom', s3T2:'Et votre genre ?', sexMale:'Masculin', sexFemale:'Féminin', sexNoSay:'Préfère ne pas le dire', s4T:'Nouveautés et notifications', s4S:'Pour ne rien manquer d\'important', s4qNews:'Recevoir la newsletter ?', s4qNotif:'Autoriser les notifications ?', s5T:'Quels sujets vous intéressent ?', s5S:'Choisissez-en au moins un (ou tapez le vôtre)', s5P:'Autres sujets (séparés par des virgules)', s6T:'Comment voulez-vous vos sources ?', s6S:'Modifiable à tout moment', s6mT:'Je les choisis', s6mS:'Ajoutez vos sources : chaînes, forums, blogs, RSS, sites web…', s6aT:'Que l\'IA les trouve', s6aS:'Skorpene trouvera des chaînes, forums, blogs, sites et RSS selon vos goûts', s7T:'Quelles régions vous intéressent ?', s7S:'Choisissez-en au moins une (ou tapez des pays)', s7P:'Autres pays ou régions (séparés par des virgules)', yes:'Oui', no:'Non' },
        ru:{ welcome:'Добро пожаловать в Skorpene', stepOf:'Шаг {a} из {b}', next:'Далее', back:'Назад', finish:'Начать', s1T:'Выберите язык', s1S:'Весь интерфейс будет на этом языке', s2T:'Выберите тему', s2S:'Тёмный или светлый режим?', dark:'Тёмная', light:'Светлая', s3T:'Как вас зовут?', s3S:'Чтобы правильно к вам обращаться', s3P:'Ваше имя', s3T2:'Ваш пол?', sexMale:'Мужской', sexFemale:'Женский', sexNoSay:'Не хочу указывать', s4T:'Новости и уведомления', s4S:'Чтобы ничего не пропустить', s4qNews:'Получать рассылку?', s4qNotif:'Разрешить уведомления?', s5T:'Какие темы вам интересны?', s5S:'Выберите хотя бы одну (или впишите свои)', s5P:'Другие темы (через запятую)', s6T:'Как выбрать источники?', s6S:'Можно изменить в любой момент', s6mT:'Выберу сам', s6mS:'Добавьте свои источники: каналы, форумы, блоги, RSS, сайты…', s6aT:'Пусть найдёт ИИ', s6aS:'Skorpene найдёт каналы, форумы, блоги, сайты и RSS по вашим интересам', s7T:'Какие регионы вам интересны?', s7S:'Выберите хотя бы один (или впишите страны)', s7P:'Другие страны или регионы (через запятую)', yes:'Да', no:'Нет' },
        zh:{ welcome:'欢迎使用 Skorpene', stepOf:'第 {a} 步，共 {b} 步', next:'下一步', back:'返回', finish:'开始', s1T:'选择语言', s1S:'整个界面将使用此语言', s2T:'选择主题', s2S:'您喜欢深色还是浅色？', dark:'深色', light:'浅色', s3T:'您的名字？', s3S:'以便正确称呼您', s3P:'您的名字', s3T2:'您的性别？', sexMale:'男', sexFemale:'女', sexNoSay:'不愿透露', s4T:'更新和通知', s4S:'这样您不会错过任何重要内容', s4qNews:'接收新闻通讯？', s4qNotif:'允许通知？', s5T:'您对哪些主题感兴趣？', s5S:'至少选一个（或输入您自己的）', s5P:'其他主题（用逗号分隔）', s6T:'如何获取来源？', s6S:'随时可更改', s6mT:'我自己选', s6mS:'添加您自己的来源：频道、论坛、博客、RSS、网站…', s6aT:'让 AI 查找', s6aS:'Skorpene 将根据您的兴趣查找频道、论坛、博客、网站和 RSS', s7T:'您对哪些地区感兴趣？', s7S:'至少选一个（或输入具体国家）', s7P:'其他国家或地区（用逗号分隔）', yes:'是', no:'否' },
        tr:{ welcome:'Skorpene\'a hoş geldiniz', stepOf:'Adım {a} / {b}', next:'İleri', back:'Geri', finish:'Başla', s1T:'Dilinizi seçin', s1S:'Tüm arayüz bu dili kullanacak', s2T:'Tema seçin', s2S:'Karanlık mı aydınlık mı?', dark:'Koyu', light:'Açık', s3T:'Adınız nedir?', s3S:'Size doğru hitap edebilmek için', s3P:'Adınız', s3T2:'Cinsiyetiniz?', sexMale:'Erkek', sexFemale:'Kadın', sexNoSay:'Söylemek istemiyorum', s4T:'Güncellemeler ve bildirimler', s4S:'Önemli hiçbir şeyi kaçırmamak için', s4qNews:'Bülten alacak mısın?', s4qNotif:'Bildirimleri kabul ediyor musun?', s5T:'Hangi konular ilginizi çekiyor?', s5S:'En az birini seçin (veya kendiniz yazın)', s5P:'Diğer konular (virgülle)', s6T:'Kaynakları nasıl istersiniz?', s6S:'İstediğiniz zaman değiştirebilirsiniz', s6mT:'Ben seçerim', s6mS:'Kendi kaynaklarınızı ekleyin: kanallar, forumlar, bloglar, RSS, web siteleri…', s6aT:'Yapay zeka bulsun', s6aS:'Skorpene ilgi alanlarınıza göre kanal, forum, blog, web ve RSS bulacak', s7T:'Hangi bölgeler ilginizi çekiyor?', s7S:'En az birini seçin (veya ülke yazın)', s7P:'Diğer ülke veya bölgeler (virgülle)', yes:'Evet', no:'Hayır' },
        ar:{ welcome:'مرحبًا بك في Skorpene', stepOf:'الخطوة {a} من {b}', next:'التالي', back:'رجوع', finish:'ابدأ', s1T:'اختر لغتك', s1S:'ستستخدم الواجهة بالكامل هذه اللغة', s2T:'اختر سمة', s2S:'هل تفضل الوضع الداكن أم الفاتح؟', dark:'داكن', light:'فاتح', s3T:'ما اسمك؟', s3S:'لكي نخاطبك بشكل صحيح', s3P:'اسمك', s3T2:'ما هو جنسك؟', sexMale:'ذكر', sexFemale:'أنثى', sexNoSay:'أفضل عدم الإفصاح', s4T:'التحديثات والإشعارات', s4S:'حتى لا تفوتك أي أمور مهمة', s4qNews:'هل تريد تلقي النشرة؟', s4qNotif:'هل توافق على الإشعارات؟', s5T:'ما المواضيع التي تهمك؟', s5S:'اختر واحدًا على الأقل (أو اكتب مواضيعك)', s5P:'مواضيع أخرى (مفصولة بفواصل)', s6T:'كيف تريد مصادرك؟', s6S:'يمكنك تغييرها في أي وقت', s6mT:'أنا أختارها', s6mS:'أضف مصادرك الخاصة: قنوات، منتديات، مدونات، RSS، مواقع…', s6aT:'دع الذكاء الاصطناعي يجدها', s6aS:'سيجد Skorpene قنوات ومنتديات ومدونات ومواقع وRSS حسب اهتماماتك', s7T:'ما المناطق التي تهمك؟', s7S:'اختر واحدة على الأقل (أو اكتب دولًا)', s7P:'دول أو مناطق أخرى (مفصولة بفواصل)', yes:'نعم', no:'لا' },
        fa:{ welcome:'به Skorpene خوش آمدید', stepOf:'مرحله {a} از {b}', next:'بعدی', back:'بازگشت', finish:'شروع', s1T:'زبان خود را انتخاب کنید', s1S:'کل رابط کاربری از این زبان استفاده می‌کند', s2T:'یک تم انتخاب کنید', s2S:'حالت تاریک یا روشن؟', dark:'تاریک', light:'روشن', s3T:'نام شما چیست؟', s3S:'تا شما را به درستی خطاب کنیم', s3P:'نام شما', s3T2:'جنسیت شما؟', sexMale:'مرد', sexFemale:'زن', sexNoSay:'ترجیح می‌دهم نگویم', s4T:'به‌روزرسانی‌ها و اعلان‌ها', s4S:'تا چیز مهمی را از دست ندهید', s4qNews:'خبرنامه دریافت کنید؟', s4qNotif:'اعلان‌ها را بپذیرید؟', s5T:'به چه موضوعاتی علاقه دارید؟', s5S:'حداقل یکی را انتخاب کنید (یا بنویسید)', s5P:'موضوعات دیگر (با کاما جدا کنید)', s6T:'منابع را چگونه می‌خواهید؟', s6S:'هر زمان می‌توانید تغییر دهید', s6mT:'خودم انتخاب می‌کنم', s6mS:'منابع خود را اضافه کنید: کانال‌ها، انجمن‌ها، وبلاگ‌ها، RSS، وب‌سایت‌ها…', s6aT:'هوش مصنوعی پیدا کند', s6aS:'Skorpene بر اساس علایق شما کانال، انجمن، وبلاگ، وب و RSS پیدا می‌کند', s7T:'به چه مناطقی علاقه دارید؟', s7S:'حداقل یکی را انتخاب کنید (یا کشورها را بنویسید)', s7P:'کشورها یا مناطق دیگر (با کاما)', yes:'بله', no:'خیر' },
        he:{ welcome:'ברוכים הבאים ל-Skorpene', stepOf:'שלב {a} מתוך {b}', next:'הבא', back:'חזרה', finish:'התחל', s1T:'בחר שפה', s1S:'כל הממשק יוצג בשפה זו', s2T:'בחר ערכת נושא', s2S:'מצב כהה או בהיר?', dark:'כהה', light:'בהיר', s3T:'מה שמך?', s3S:'כדי לפנות אליך נכון', s3P:'שמך', s3T2:'המגדר שלך?', sexMale:'זכר', sexFemale:'נקבה', sexNoSay:'מעדיף לא לומר', s4T:'עדכונים והתראות', s4S:'כדי שלא תפספס דבר חשוב', s4qNews:'לקבל ניוזלטר?', s4qNotif:'לאשר התראות?', s5T:'אילו נושאים מעניינים אותך?', s5S:'בחר לפחות אחד (או הקלד משלך)', s5P:'נושאים נוספים (מופרדים בפסיקים)', s6T:'איך תרצה את המקורות?', s6S:'אפשר לשנות בכל עת', s6mT:'אני אבחר', s6mS:'הוסף מקורות משלך: ערוצים, פורומים, בלוגים, RSS, אתרים…', s6aT:'שה-AI ימצא', s6aS:'Skorpene ימצא ערוצים, פורומים, בלוגים, אתרים ו-RSS לפי תחומי העניין שלך', s7T:'אילו אזורים מעניינים אותך?', s7S:'בחר לפחות אחד (או הקלד מדינות)', s7P:'מדינות או אזורים אחרים (מופרדים בפסיקים)', yes:'כן', no:'לא' },
        nl:{ welcome:'Welkom bij Skorpene', stepOf:'Stap {a} van {b}', next:'Volgende', back:'Terug', finish:'Beginnen', s1T:'Kies je taal', s1S:'De hele interface gebruikt deze taal', s2T:'Kies een thema', s2S:'Geef je de voorkeur aan donker of licht?', dark:'Donker', light:'Licht', s3T:'Hoe heet je?', s3S:'Zodat we je correct aanspreken', s3P:'Je naam', s3T2:'En je geslacht?', sexMale:'Man', sexFemale:'Vrouw', sexNoSay:'Zeg ik liever niet', s4T:'Updates en meldingen', s4S:'Zodat je niets belangrijks mist', s4qNews:'Nieuwsbrief ontvangen?', s4qNotif:'Meldingen toestaan?', s5T:'Welke onderwerpen interesseren je?', s5S:'Kies er minstens één (of typ je eigen)', s5P:'Andere onderwerpen (komma-gescheiden)', s6T:'Hoe wil je je bronnen?', s6S:'Je kunt dit altijd wijzigen', s6mT:'Ik kies ze', s6mS:'Voeg je eigen bronnen toe: kanalen, forums, blogs, RSS, websites…', s6aT:'Laat de AI ze vinden', s6aS:'Skorpene vindt kanalen, forums, blogs, websites en RSS voor jouw interesses', s7T:'Welke regio\'s interesseren je?', s7S:'Kies er minstens één (of typ landen)', s7P:'Andere landen of regio\'s (komma-gescheiden)', yes:'Ja', no:'Nee' },
        it:{ welcome:'Benvenuto su Skorpene', stepOf:'Passo {a} di {b}', next:'Avanti', back:'Indietro', finish:'Inizia', s1T:'Scegli la lingua', s1S:'Tutta l\'interfaccia userà questa lingua', s2T:'Scegli un tema', s2S:'Preferisci la modalità scura o chiara?', dark:'Scuro', light:'Chiaro', s3T:'Come ti chiami?', s3S:'Per rivolgerci a te correttamente', s3P:'Il tuo nome', s3T2:'E il tuo genere?', sexMale:'Maschio', sexFemale:'Femmina', sexNoSay:'Preferisco non dirlo', s4T:'Aggiornamenti e notifiche', s4S:'Per non perderti nulla di importante', s4qNews:'Ricevere la newsletter?', s4qNotif:'Accettare le notifiche?', s5T:'Quali temi ti interessano?', s5S:'Scegline almeno uno (o scrivi i tuoi)', s5P:'Altri temi (separati da virgole)', s6T:'Come vuoi le tue fonti?', s6S:'Puoi cambiarlo quando vuoi', s6mT:'Le scelgo io', s6mS:'Aggiungi le tue fonti: canali, forum, blog, RSS, siti web…', s6aT:'Falle trovare all\'IA', s6aS:'Skorpene troverà canali, forum, blog, siti e RSS in base ai tuoi gusti', s7T:'Quali regioni ti interessano?', s7S:'Scegline almeno una (o scrivi i paesi)', s7P:'Altri paesi o regioni (separati da virgole)', yes:'Sì', no:'No' },
        pt:{ welcome:'Bem-vindo ao Skorpene', stepOf:'Passo {a} de {b}', next:'Seguinte', back:'Voltar', finish:'Começar', s1T:'Escolha o seu idioma', s1S:'Toda a interface usará este idioma', s2T:'Escolha um tema', s2S:'Prefere o modo escuro ou claro?', dark:'Escuro', light:'Claro', s3T:'Como se chama?', s3S:'Para nos dirigirmos a si corretamente', s3P:'O seu nome', s3T2:'E o seu género?', sexMale:'Masculino', sexFemale:'Feminino', sexNoSay:'Prefiro não dizer', s4T:'Novidades e notificações', s4S:'Para não perder nada importante', s4qNews:'Receber a newsletter?', s4qNotif:'Aceitar notificações?', s5T:'Que temas lhe interessam?', s5S:'Escolha pelo menos um (ou escreva os seus)', s5P:'Outros temas (separados por vírgulas)', s6T:'Como quer as suas fontes?', s6S:'Pode alterar quando quiser', s6mT:'Escolho-as eu', s6mS:'Adicione as suas fontes: canais, fóruns, blogs, RSS, sites…', s6aT:'Deixe a IA encontrá-las', s6aS:'O Skorpene encontrará canais, fóruns, blogs, sites e RSS conforme os seus gostos', s7T:'Que regiões lhe interessam?', s7S:'Escolha pelo menos uma (ou escreva países)', s7P:'Outros países ou regiões (separados por vírgulas)', yes:'Sim', no:'Não' },
        hi:{ welcome:'Skorpene में आपका स्वागत है', stepOf:'चरण {a}/{b}', next:'आगे', back:'पीछे', finish:'शुरू करें', s1T:'अपनी भाषा चुनें', s1S:'पूरा इंटरफ़ेस इसी भाषा में होगा', s2T:'थीम चुनें', s2S:'आप डार्क या लाइट क्या पसंद करते हैं?', dark:'गहरा', light:'हल्का', s3T:'आपका नाम क्या है?', s3S:'ताकि हम आपको सही तरीके से संबोधित करें', s3P:'आपका नाम', s3T2:'और आपका लिंग?', sexMale:'पुरुष', sexFemale:'महिला', sexNoSay:'नहीं बताना चाहता', s4T:'अपडेट और सूचनाएँ', s4S:'ताकि आप कुछ ज़रूरी न चूकें', s4qNews:'न्यूज़लेटर प्राप्त करें?', s4qNotif:'सूचनाएँ स्वीकार करें?', s5T:'आपको कौन से विषय पसंद हैं?', s5S:'कम से कम एक चुनें (या अपने लिखें)', s5P:'अन्य विषय (अल्पविराम से अलग)', s6T:'आप अपने स्रोत कैसे चाहते हैं?', s6S:'आप इसे कभी भी बदल सकते हैं', s6mT:'मैं चुनूँगा', s6mS:'अपने स्रोत जोड़ें: चैनल, फ़ोरम, ब्लॉग, RSS, वेबसाइट…', s6aT:'AI को खोजने दें', s6aS:'Skorpene आपकी रुचि के अनुसार चैनल, फ़ोरम, ब्लॉग, वेबसाइट और RSS खोजेगा', s7T:'आपको कौन से क्षेत्र पसंद हैं?', s7S:'कम से कम एक चुनें (या देश लिखें)', s7P:'अन्य देश या क्षेत्र (अल्पविराम से अलग)', yes:'हाँ', no:'नहीं' },
    };

    const onboarding = {
        el: null,
        state: null,

        hasProfile() {
            try { return !!localStorage.getItem(LS_PROFILE); } catch (_) { return false; }
        },
        loadProfile() {
            try { return JSON.parse(localStorage.getItem(LS_PROFILE) || 'null'); } catch (_) { return null; }
        },

        init() {
            this.el = document.getElementById('onboarding-overlay');
            if (!this.el) return;
            if (this.hasProfile()) return;   // returning user — skip
            this.start();
        },

        // Wipe ALL Skorpene state and re-run the wizard (dev reset button).
        // Just removing the profile left old sources, geo cache, hidden
        // channels and theme behind — clicking Reset felt like nothing happened.
        // Now we nuke every key in the geoscope_ namespace so the next load is
        // truly a first-run.
        reset() {
            // Log out the server session too, then wipe every geoscope_ key
            // (profile, sources, caches, theme, AND the auth token) so the next
            // load starts at the landing page as a brand-new visitor.
            const done = () => {
                try {
                    Object.keys(localStorage)
                        .filter(k => k.startsWith('geoscope_'))
                        .forEach(k => localStorage.removeItem(k));
                } catch (_) {}
                location.reload();
            };
            try { auth.logout().then(done, done); } catch (_) { done(); }
        },

        start() {
            // Prefill the name from the account the user already registered with
            // — the onboarding no longer asks for it again (only gender).
            let acctName = '';
            try { acctName = (JSON.parse(localStorage.getItem('geoscope_auth_user') || '{}') || {}).name || ''; } catch (_) {}
            this.state = {
                lang: currentLang || 'es',
                theme: (document.documentElement.getAttribute('data-theme') === 'light') ? 'light' : 'dark',
                name: acctName, sex: '',
                newsletter: true, notifications: true,
                topics: new Set(), topicsText: '',
                sourceMode: 'ai',
                regions: new Set(), regionsText: '',
                idx: 0,
            };
            this.el.style.display = 'flex';
            this.el.setAttribute('aria-hidden', 'false');
            document.body.classList.add('onb-active');
            this._wire();
            this.render();
        },

        // Step order: lang → theme → name+sex → updates → topics → region →
        // decision. Region is always asked (before the manual/AI choice) so
        // the user picks them up front and the AI search has them ready.
        steps() {
            return ['lang', 'theme', 'name', 'updates', 'topics', 'region', 'decision'];
        },

        // Per-step validation. Returns true when the user can advance.
        // Only optional steps return true unconditionally — required ones gate
        // the Next button until filled.
        _validStep() {
            const s = this.state;
            const key = this.steps()[s.idx];
            if (key === 'name') return s.name.length > 0 && !!s.sex;
            if (key === 'topics') return s.topics.size > 0 || s.topicsText.length > 0;
            if (key === 'region') return s.regions.size > 0 || s.regionsText.length > 0;
            return true;   // lang, theme, updates, decision always have defaults
        },

        // Toggle the Next button's disabled state in place — no full re-render
        // so chip-click flashes are avoided.
        _updateNavState() {
            const nextBtn = this.el.querySelector('[data-onb-nav="next"]');
            if (!nextBtn) return;
            const ok = this._validStep();
            nextBtn.disabled = !ok;
            nextBtn.classList.toggle('onb-btn-disabled', !ok);
        },

        render() {
            const s = this.state;
            const u = ONB_UI[s.lang] || ONB_UI.en;
            const steps = this.steps();
            if (s.idx >= steps.length) s.idx = steps.length - 1;
            const key = steps[s.idx];
            const isLast = s.idx === steps.length - 1;
            const rtl = (s.lang === 'ar' || s.lang === 'fa' || s.lang === 'he');

            let title = '', sub = '', body = '';
            if (key === 'lang') {
                title = u.s1T; sub = u.s1S;
                body = `<div class="onb-grid onb-grid-lang">` + ONB_LANGS.map(l =>
                    `<button class="onb-chip${s.lang === l.id ? ' sel' : ''}" data-onb-lang="${l.id}">${l.label}</button>`
                ).join('') + `</div>`;
            } else if (key === 'theme') {
                title = u.s2T; sub = u.s2S;
                body = `<div class="onb-grid onb-grid-2">
                    <button class="onb-card${s.theme === 'dark' ? ' sel' : ''}" data-onb-theme="dark"><span class="onb-card-t">${u.dark}</span></button>
                    <button class="onb-card${s.theme === 'light' ? ' sel' : ''}" data-onb-theme="light"><span class="onb-card-t">${u.light}</span></button>
                </div>`;
            } else if (key === 'name') {
                // The name already came from registration, so this step only
                // asks for gender — and greets the user by their name.
                const greetName = (s.name || '').trim();
                if (greetName) {
                    // "Hi Sami, what's your gender?"
                    title = (u.s3Greet || 'Hi {name},').replace('{name}', greetName) + ' ' + (u.s3T2 || '');
                    sub = u.s3GreetSub || u.s3S;
                } else {
                    // Fallback (no account name): keep the name input + gender.
                    title = u.s3T; sub = u.s3S;
                }
                body = (greetName ? '' :
                    `<input type="text" class="onb-input" id="onb-name" maxlength="60" placeholder="${escapeHtml(u.s3P)}" value="${escapeHtml(s.name)}">
                     <div class="onb-q-label">${escapeHtml(u.s3T2)}</div>`)
                + `<div class="onb-grid onb-grid-3">
                    <button class="onb-chip onb-chip-sex${s.sex === 'male' ? ' sel' : ''}" data-onb-sex="male">${escapeHtml(u.sexMale)}</button>
                    <button class="onb-chip onb-chip-sex${s.sex === 'female' ? ' sel' : ''}" data-onb-sex="female">${escapeHtml(u.sexFemale)}</button>
                    <button class="onb-chip onb-chip-sex${s.sex === 'nosay' ? ' sel' : ''}" data-onb-sex="nosay">${escapeHtml(u.sexNoSay)}</button>
                </div>`;
            } else if (key === 'updates') {
                // Two yes/no questions in the same step: newsletter + notifications.
                title = u.s4T; sub = u.s4S;
                body = `<div class="onb-subq">
                    <div class="onb-q-label">${escapeHtml(u.s4qNews)}</div>
                    <div class="onb-grid onb-grid-2">
                        <button class="onb-card onb-card-sm${s.newsletter ? ' sel' : ''}" data-onb-news="1"><span class="onb-card-t">${u.yes}</span></button>
                        <button class="onb-card onb-card-sm${!s.newsletter ? ' sel' : ''}" data-onb-news="0"><span class="onb-card-t">${u.no}</span></button>
                    </div>
                </div>
                <div class="onb-subq">
                    <div class="onb-q-label">${escapeHtml(u.s4qNotif)}</div>
                    <div class="onb-grid onb-grid-2">
                        <button class="onb-card onb-card-sm${s.notifications ? ' sel' : ''}" data-onb-notif="1"><span class="onb-card-t">${u.yes}</span></button>
                        <button class="onb-card onb-card-sm${!s.notifications ? ' sel' : ''}" data-onb-notif="0"><span class="onb-card-t">${u.no}</span></button>
                    </div>
                </div>`;
            } else if (key === 'topics') {
                title = u.s5T; sub = u.s5S;
                body = `<div class="onb-grid onb-grid-chips">` + ONB_TOPICS.map(tp =>
                    `<button class="onb-chip${s.topics.has(tp.id) ? ' sel' : ''}" data-onb-topic="${tp.id}">${escapeHtml(tp.t[s.lang] || tp.t.en)}</button>`
                ).join('') + `</div>
                <input type="text" class="onb-input onb-input-sm" id="onb-topics-text" placeholder="${escapeHtml(u.s5P)}" value="${escapeHtml(s.topicsText)}">`;
            } else if (key === 'decision') {
                title = u.s6T; sub = u.s6S;
                body = `<div class="onb-grid onb-grid-2">
                    <button class="onb-card onb-card-tall${s.sourceMode === 'manual' ? ' sel' : ''}" data-onb-mode="manual"><span class="onb-card-t">${u.s6mT}</span><span class="onb-card-s">${u.s6mS}</span></button>
                    <button class="onb-card onb-card-tall${s.sourceMode === 'ai' ? ' sel' : ''}" data-onb-mode="ai"><span class="onb-card-t">${u.s6aT}</span><span class="onb-card-s">${u.s6aS}</span></button>
                </div>`;
            } else if (key === 'region') {
                title = u.s7T; sub = u.s7S;
                body = `<div class="onb-grid onb-grid-chips">` + ONB_REGIONS.map(rg =>
                    `<button class="onb-chip${s.regions.has(rg.id) ? ' sel' : ''}" data-onb-region="${rg.id}">${escapeHtml(rg.t[s.lang] || rg.t.en)}</button>`
                ).join('') + `</div>
                <input type="text" class="onb-input onb-input-sm" id="onb-regions-text" placeholder="${escapeHtml(u.s7P)}" value="${escapeHtml(s.regionsText)}">`;
            }

            const dots = steps.map((_, i) =>
                `<span class="onb-dot${i === s.idx ? ' on' : ''}${i < s.idx ? ' done' : ''}"></span>`
            ).join('');

            this.el.innerHTML = `<div class="onb-modal" dir="${rtl ? 'rtl' : 'ltr'}">
                <div class="onb-brand"><span class="onb-brand-diamond">◆</span> SKORPENE</div>
                <div class="onb-progress-row">
                    <span class="onb-stepnum">${u.stepOf.replace('{a}', s.idx + 1).replace('{b}', steps.length)}</span>
                    <span class="onb-dots">${dots}</span>
                </div>
                <h2 class="onb-title">${escapeHtml(title)}</h2>
                <p class="onb-sub">${escapeHtml(sub)}</p>
                <div class="onb-body">${body}</div>
                <div class="onb-footer">
                    <button class="onb-btn onb-btn-ghost" data-onb-nav="back" ${s.idx === 0 ? 'style="visibility:hidden"' : ''}>${u.back}</button>
                    <button class="onb-btn onb-btn-primary" data-onb-nav="next">${isLast ? u.finish : u.next}</button>
                </div>
            </div>`;

            this._updateNavState();
            const first = this.el.querySelector('.onb-input');
            if (first) setTimeout(() => first.focus(), 50);
        },

        _capture() {
            const s = this.state;
            const n = this.el.querySelector('#onb-name'); if (n) s.name = n.value.trim();
            const tt = this.el.querySelector('#onb-topics-text'); if (tt) s.topicsText = tt.value.trim();
            const rt = this.el.querySelector('#onb-regions-text'); if (rt) s.regionsText = rt.value.trim();
        },

        _wire() {
            if (this._wired) return;
            this._wired = true;
            this.el.addEventListener('click', (e) => {
                const s = this.state;

                // Language is the only toggle that triggers a full re-render,
                // because all wizard labels change. Everything else uses partial
                // updates (toggle .sel class) so the modal doesn't flash.
                const langBtn = e.target.closest('[data-onb-lang]');
                if (langBtn) {
                    this._capture();
                    s.lang = langBtn.dataset.onbLang;
                    currentLang = s.lang; try { applyLang(); } catch (_) {}
                    try { langDropdown.setValue(s.lang); } catch (_) {}
                    this.render();
                    return;
                }

                const themeBtn = e.target.closest('[data-onb-theme]');
                if (themeBtn) {
                    s.theme = themeBtn.dataset.onbTheme;
                    try { _applyTheme(s.theme); } catch (_) {}
                    this.el.querySelectorAll('[data-onb-theme]').forEach(b =>
                        b.classList.toggle('sel', b.dataset.onbTheme === s.theme));
                    this._updateNavState();
                    return;
                }

                const sexBtn = e.target.closest('[data-onb-sex]');
                if (sexBtn) {
                    s.sex = sexBtn.dataset.onbSex;
                    this.el.querySelectorAll('[data-onb-sex]').forEach(b =>
                        b.classList.toggle('sel', b.dataset.onbSex === s.sex));
                    this._updateNavState();
                    return;
                }

                const newsBtn = e.target.closest('[data-onb-news]');
                if (newsBtn) {
                    s.newsletter = newsBtn.dataset.onbNews === '1';
                    this.el.querySelectorAll('[data-onb-news]').forEach(b =>
                        b.classList.toggle('sel', (b.dataset.onbNews === '1') === s.newsletter));
                    this._updateNavState();
                    return;
                }

                const notifBtn = e.target.closest('[data-onb-notif]');
                if (notifBtn) {
                    s.notifications = notifBtn.dataset.onbNotif === '1';
                    this.el.querySelectorAll('[data-onb-notif]').forEach(b =>
                        b.classList.toggle('sel', (b.dataset.onbNotif === '1') === s.notifications));
                    this._updateNavState();
                    return;
                }

                const topicBtn = e.target.closest('[data-onb-topic]');
                if (topicBtn) {
                    this._capture();
                    const id = topicBtn.dataset.onbTopic;
                    s.topics.has(id) ? s.topics.delete(id) : s.topics.add(id);
                    topicBtn.classList.toggle('sel');
                    this._updateNavState();
                    return;
                }

                const regionBtn = e.target.closest('[data-onb-region]');
                if (regionBtn) {
                    this._capture();
                    const id = regionBtn.dataset.onbRegion;
                    s.regions.has(id) ? s.regions.delete(id) : s.regions.add(id);
                    regionBtn.classList.toggle('sel');
                    this._updateNavState();
                    return;
                }

                const modeBtn = e.target.closest('[data-onb-mode]');
                if (modeBtn) {
                    s.sourceMode = modeBtn.dataset.onbMode;
                    this.el.querySelectorAll('[data-onb-mode]').forEach(b =>
                        b.classList.toggle('sel', b.dataset.onbMode === s.sourceMode));
                    this._updateNavState();
                    return;
                }

                const nav = e.target.closest('[data-onb-nav]');
                if (nav) {
                    if (nav.disabled) return;   // guard against keyboard activation
                    this._capture();
                    if (nav.dataset.onbNav === 'back') {
                        if (s.idx > 0) s.idx--;
                        this.render();
                    } else {
                        if (!this._validStep()) return;
                        const steps = this.steps();
                        if (s.idx < steps.length - 1) { s.idx++; this.render(); }
                        else this.finish();
                    }
                }
            });

            // Re-evaluate validation whenever the user types in any input
            // (name, topics free text, regions free text) so the Next button
            // unlocks the moment the required field is filled.
            this.el.addEventListener('input', (e) => {
                if (e.target.classList && e.target.classList.contains('onb-input')) {
                    this._capture();
                    this._updateNavState();
                }
            });

            this.el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.target.classList.contains('onb-input')) {
                    e.preventDefault();
                    const next = this.el.querySelector('[data-onb-nav="next"]');
                    if (next && !next.disabled) next.click();
                }
            });
        },

        finish() {
            this._capture();
            const s = this.state;
            const profile = {
                v: 2, completed: true,
                lang: s.lang, theme: s.theme,
                name: s.name, sex: s.sex,
                newsletter: s.newsletter, notifications: s.notifications,
                topics: Array.from(s.topics), topicsText: s.topicsText,
                sourceMode: s.sourceMode,
                regions: Array.from(s.regions), regionsText: s.regionsText,
                ts: Date.now(),
            };
            try { localStorage.setItem(LS_PROFILE, JSON.stringify(profile)); } catch (_) {}
            // Persist the profile to the ACCOUNT (server-side) so it follows the
            // user across devices/logins and the wizard is never asked again.
            // Fire-and-forget; the local copy already unlocks the app instantly.
            try {
                const tok = (typeof auth !== 'undefined' && auth.token) ? auth.token() : '';
                if (tok) {
                    fetch('/api/auth/profile', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok },
                        body: JSON.stringify(profile),
                    }).catch(() => {});
                    // Keep the cached user object in sync so a same-session
                    // re-read of /me-style data reflects the new profile.
                    try {
                        const u = JSON.parse(localStorage.getItem('geoscope_auth_user') || '{}') || {};
                        u.profile = profile;
                        localStorage.setItem('geoscope_auth_user', JSON.stringify(u));
                    } catch (_) {}
                }
            } catch (_) {}

            // Apply final language + theme to the live app.
            currentLang = s.lang;
            try { langDropdown.setValue(s.lang); } catch (_) {}
            try { applyLang(); } catch (_) {}
            try { _applyTheme(s.theme); } catch (_) {}
            try { if (typeof rebuildAllLabels === 'function') rebuildAllLabels(); } catch (_) {}
            try { _reloadGoogleMapsForLang(currentLang); } catch (_) {}

            // Close the overlay.
            this.el.style.display = 'none';
            this.el.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('onb-active');

            // Kick off the AI source search if the user picked the AI mode.
            // We don't await — the wizard closes immediately and sources are
            // added in the background to the Sources panel.
            if (profile.sourceMode === 'ai') {
                try { aiSourceFinder.run(profile); } catch (e) { console.error('[onboarding] aiSourceFinder failed:', e); }
            }
        },
    };

    // ───────────────────────────────────────────────────────────────────────
    // AI source finder — runs after onboarding when the user picked the AI
    // mode. Asks Claude for Telegram channels and RSS feeds (forums, blogs,
    // think-tanks, regional outlets…) matching the user's topics + regions,
    // then adds them to geoFeed. Status is shown in the news-status strip.
    // ───────────────────────────────────────────────────────────────────────

    // Localized status strings for the source finder (news-status strip). These
    // used to be hardcoded Spanish, so they showed in Spanish for every UI
    // language — this table + _sfMsg() fix that across all 13 languages.
    const SF_I18N = {
        es: { searching:'🤖 Buscando fuentes para ti…', busy:'⚠️ No se pudieron buscar fuentes ahora (IA saturada). Reinténtalo en unos segundos.', invalid:'⚠️ La IA no devolvió fuentes válidas.', addedSearching:'✓ {n} fuentes añadidas — buscando noticias…', addedDone:'✓ {n} fuentes añadidas y noticias cargadas', noneNew:'⚠️ No se añadió ninguna fuente nueva (ya las tenías).' },
        en: { searching:'🤖 Finding sources for you…', busy:'⚠️ Couldn\'t find sources right now (AI overloaded). Try again in a few seconds.', invalid:'⚠️ The AI didn\'t return valid sources.', addedSearching:'✓ {n} sources added — finding news…', addedDone:'✓ {n} sources added and news loaded', noneNew:'⚠️ No new source added (you already had them).' },
        fr: { searching:'🤖 Recherche de sources pour toi…', busy:'⚠️ Impossible de trouver des sources maintenant (IA surchargée). Réessaie dans quelques secondes.', invalid:'⚠️ L\'IA n\'a pas renvoyé de sources valides.', addedSearching:'✓ {n} sources ajoutées — recherche d\'actus…', addedDone:'✓ {n} sources ajoutées et actus chargées', noneNew:'⚠️ Aucune nouvelle source ajoutée (tu les avais déjà).' },
        ru: { searching:'🤖 Ищу источники для вас…', busy:'⚠️ Сейчас не удалось найти источники (ИИ перегружен). Повторите через несколько секунд.', invalid:'⚠️ ИИ не вернул допустимые источники.', addedSearching:'✓ Добавлено источников: {n} — ищу новости…', addedDone:'✓ Добавлено источников: {n}, новости загружены', noneNew:'⚠️ Новых источников не добавлено (они уже были).' },
        zh: { searching:'🤖 正在为你查找来源…', busy:'⚠️ 现在无法查找来源（AI 过载）。请几秒后重试。', invalid:'⚠️ AI 未返回有效来源。', addedSearching:'✓ 已添加 {n} 个来源 — 正在查找新闻…', addedDone:'✓ 已添加 {n} 个来源，新闻已加载', noneNew:'⚠️ 未添加新来源（你已经有了）。' },
        tr: { searching:'🤖 Senin için kaynaklar aranıyor…', busy:'⚠️ Şu anda kaynak bulunamadı (yapay zeka yoğun). Birkaç saniye sonra tekrar dene.', invalid:'⚠️ Yapay zeka geçerli kaynak döndürmedi.', addedSearching:'✓ {n} kaynak eklendi — haberler aranıyor…', addedDone:'✓ {n} kaynak eklendi ve haberler yüklendi', noneNew:'⚠️ Yeni kaynak eklenmedi (zaten vardı).' },
        ar: { searching:'🤖 جارٍ البحث عن مصادر لك…', busy:'⚠️ تعذّر البحث عن مصادر الآن (الذكاء الاصطناعي مثقل). أعد المحاولة بعد ثوانٍ.', invalid:'⚠️ لم يُرجِع الذكاء الاصطناعي مصادر صالحة.', addedSearching:'✓ تمت إضافة {n} مصدرًا — جارٍ جلب الأخبار…', addedDone:'✓ تمت إضافة {n} مصدرًا وتحميل الأخبار', noneNew:'⚠️ لم تتم إضافة أي مصدر جديد (كانت لديك بالفعل).' },
        fa: { searching:'🤖 در حال یافتن منابع برای شما…', busy:'⚠️ اکنون نمی‌توان منابع را جست‌وجو کرد (هوش مصنوعی مشغول است). چند ثانیه دیگر دوباره تلاش کنید.', invalid:'⚠️ هوش مصنوعی منابع معتبری برنگرداند.', addedSearching:'✓ {n} منبع افزوده شد — در حال یافتن اخبار…', addedDone:'✓ {n} منبع افزوده شد و اخبار بارگذاری شد', noneNew:'⚠️ منبع جدیدی افزوده نشد (قبلاً داشتید).' },
        he: { searching:'🤖 מחפש מקורות עבורך…', busy:'⚠️ לא ניתן לחפש מקורות כעת (ה-AI עמוס). נסה שוב בעוד כמה שניות.', invalid:'⚠️ ה-AI לא החזיר מקורות תקינים.', addedSearching:'✓ נוספו {n} מקורות — מחפש חדשות…', addedDone:'✓ נוספו {n} מקורות והחדשות נטענו', noneNew:'⚠️ לא נוסף מקור חדש (כבר היו לך).' },
        nl: { searching:'🤖 Bronnen zoeken voor jou…', busy:'⚠️ Kon nu geen bronnen vinden (AI overbelast). Probeer het over enkele seconden opnieuw.', invalid:'⚠️ De AI gaf geen geldige bronnen terug.', addedSearching:'✓ {n} bronnen toegevoegd — nieuws zoeken…', addedDone:'✓ {n} bronnen toegevoegd en nieuws geladen', noneNew:'⚠️ Geen nieuwe bron toegevoegd (had je al).' },
        it: { searching:'🤖 Ricerca di fonti per te…', busy:'⚠️ Impossibile cercare fonti ora (IA sovraccarica). Riprova tra qualche secondo.', invalid:'⚠️ L\'IA non ha restituito fonti valide.', addedSearching:'✓ {n} fonti aggiunte — ricerca notizie…', addedDone:'✓ {n} fonti aggiunte e notizie caricate', noneNew:'⚠️ Nessuna nuova fonte aggiunta (le avevi già).' },
        pt: { searching:'🤖 A procurar fontes para ti…', busy:'⚠️ Não foi possível procurar fontes agora (IA sobrecarregada). Tenta novamente em alguns segundos.', invalid:'⚠️ A IA não devolveu fontes válidas.', addedSearching:'✓ {n} fontes adicionadas — a procurar notícias…', addedDone:'✓ {n} fontes adicionadas e notícias carregadas', noneNew:'⚠️ Nenhuma fonte nova adicionada (já as tinhas).' },
        hi: { searching:'🤖 आपके लिए स्रोत खोज रहे हैं…', busy:'⚠️ अभी स्रोत नहीं खोजे जा सके (AI व्यस्त)। कुछ सेकंड में पुनः प्रयास करें।', invalid:'⚠️ AI ने मान्य स्रोत नहीं लौटाए।', addedSearching:'✓ {n} स्रोत जोड़े गए — समाचार खोज रहे हैं…', addedDone:'✓ {n} स्रोत जोड़े गए और समाचार लोड हुए', noneNew:'⚠️ कोई नया स्रोत नहीं जोड़ा गया (आपके पास पहले से थे)।' },
    };
    function _sfMsg(key, n) {
        const tbl = SF_I18N[currentLang] || SF_I18N.en;
        return String(tbl[key] || SF_I18N.en[key] || '').replace('{n}', n != null ? n : '');
    }

    const aiSourceFinder = {
        // Resolve a topic id (or free-text token) to its English label so the
        // prompt is unambiguous regardless of the user's UI language.
        _resolveTopics(profile) {
            const labels = (profile.topics || []).map(id => {
                const t = (typeof ONB_TOPICS !== 'undefined') && ONB_TOPICS.find(x => x.id === id);
                return t ? t.t.en : id;
            });
            if (profile.topicsText) labels.push(profile.topicsText);
            return labels;
        },
        _resolveRegions(profile) {
            const labels = (profile.regions || []).map(id => {
                const r = (typeof ONB_REGIONS !== 'undefined') && ONB_REGIONS.find(x => x.id === id);
                return r ? r.t.en : id;
            });
            if (profile.regionsText) labels.push(profile.regionsText);
            return labels;
        },

        _setStatus(msg) {
            const el = document.getElementById('news-status');
            if (el) { el.textContent = msg; el.style.display = ''; }
        },
        _clearStatus(after) {
            const el = document.getElementById('news-status');
            if (!el) return;
            setTimeout(() => { try { el.textContent = ''; } catch (_) {} }, after || 5000);
        },

        // Public entry — shows the blurred source-loading veil for the whole run.
        async run(profile) {
            const topics  = this._resolveTopics(profile);
            const regions = this._resolveRegions(profile);
            if (!topics.length && !regions.length) return;
            // Letting the AI pick your sources is a Pro feature. Free accounts
            // get the plans view instead of a veil that finds nothing (this is
            // why the blurred "finding sources" screen stopped appearing once
            // AI was gated — now Free is routed to upgrade, Pro/Team search).
            if (!isPaidPlan()) { try { auth.showPlans(); } catch (_) {} return; }
            showSourceLoading();
            try { await this._run(profile, topics, regions); }
            finally { hideSourceLoading(); }
        },
        async _run(profile, topics, regions) {
            this._setStatus(_sfMsg('searching'));

            const system = [
                'You are a research assistant. The user wants to discover information',
                'sources tailored to THEIR specific interests — do NOT assume any particular',
                'subject area (politics, sports, tech, science, finance, culture, hobbies…',
                'whatever they listed). Recommend high-quality sources matching the topics',
                'and regions they actually picked.',
                'Eligible source types: Telegram channels (open/public), RSS or Atom feeds from',
                'news outlets, forums, expert blogs, think-tanks, OSINT collectives, regional',
                'publications, niche communities and analyst Substacks. Prefer well-known',
                'sources you are confident still exist and are active.',
                '',
                'Output STRICT JSON ONLY — no markdown, no prose, no code fences. Schema:',
                '[{"type":"telegram"|"rss","value":string,"name":string,"note":string}]',
                '  • type: "telegram" or "rss"',
                '  • value: for telegram, the @handle (with or without @); for rss, the full feed URL',
                '  • name: short human-readable display name',
                '  • note: 1 short sentence on what they cover',
                'Return 8–12 items total, mixing telegram + rss. Spread coverage across the user\'s',
                'topics and regions; avoid duplicates of the same outlet.',
            ].join('\n');

            const user = [
                'User profile:',
                `  Topics: ${topics.join(', ') || '(none)'}`,
                `  Regions: ${regions.join(', ') || '(none)'}`,
                `  UI language: ${profile.lang}`,
                '',
                'Return the JSON array now.',
            ].join('\n');

            // Use the retrying non-streaming helper so a transient overload spike
            // doesn't silently abort the whole source search (the bug where the
            // veil flashed and no news loaded).
            const raw = await claudeComplete({ system, max_tokens: 2048, messages: [{ role: 'user', content: user }] });
            if (raw == null) {
                this._setStatus(_sfMsg('busy'));
                this._clearStatus(); return;
            }
            const text = raw.trim();
            // Strip optional code fences if the model misbehaves and adds them.
            const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
            let arr = null;
            try { arr = JSON.parse(cleaned); } catch (_) {}
            if (!Array.isArray(arr)) {
                // Try to extract the first JSON array embedded in the text.
                const m = cleaned.match(/\[[\s\S]*\]/);
                if (m) { try { arr = JSON.parse(m[0]); } catch (_) {} }
            }
            if (!Array.isArray(arr) || !arr.length) {
                this._setStatus(_sfMsg('invalid'));
                this._clearStatus(); return;
            }

            const added = this._addItems(arr).added;
            try { if (typeof renderUserSourcesList === 'function') renderUserSourcesList(); } catch (_) {}

            if (added > 0) {
                this._setStatus(_sfMsg('addedSearching', added));
                // Keep the blur veil up until the icons are actually ON the map
                // (user request): await the FULL refresh — news pass + the AI
                // geolocation batches — with a hard 60s cap so a hung network
                // can never freeze the app behind the veil forever.
                await _refreshAndWait(60000);
                this._setStatus(_sfMsg('addedDone', added));
            } else {
                this._setStatus(_sfMsg('noneNew'));
            }
            this._clearStatus(8000);
            return added;
        },

        // Add a batch of {type,value,name} suggestions. Tight loop with
        // deferRefresh so geoFeed's _busy lock doesn't drop fetches; the caller
        // triggers ONE refresh afterwards. Returns { added, names }.
        _addItems(arr) {
            let added = 0; const names = [];
            for (const item of (arr || [])) {
                if (!item || !item.type || !item.value) continue;
                const raw = item.type === 'telegram'
                    ? (String(item.value).startsWith('@') ? item.value : '@' + String(item.value).replace(/^@/, ''))
                    : String(item.value);
                const r = geoFeed.addSource(raw, { deferRefresh: true });
                if (r && r.ok && !r.dup) {
                    added++;
                    if (item.name) {
                        const id = (item.type === 'telegram' ? 'telegram:' : 'rss:') + String(item.value).replace(/^@/, '').toLowerCase();
                        const src = geoFeed.sources.find(s => s.id === id);
                        if (src) { src.name = String(item.name); geoFeed._saveSrc(); }
                        names.push(String(item.name));
                    }
                }
            }
            return { added, names };
        },

        // Broad, multilingual heuristic: does this chat message PLAUSIBLY ask to
        // add sources? Only a gate — the AI then makes the precise decision in
        // runForChat (so a false positive just costs one classify call).
        looksLikeSourceRequest(q) {
            // Strip diacritics so accented imperatives (añádeme, recomiéndame,
            // suscríbeme…) match the accent-free latin patterns below.
            const s = ' ' + String(q || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') + ' ';
            const noun = /(fuente|source|canal|channel|feed|rss|telegram|notici|notiz|news|nieuws|nouvelle|новост|haber|medio|outlet|periodic|diario|revista|magazine|\bweb|sitio|\bsite|blog|foro|forum|reddit|podcast|substack|fonte|bron|kaynak|подписк|источник|来源|频道|新闻|قناة|مصدر|منبع|أخبار|خبر|स्रोत|समाचार)/i.test(s);
            // Add OR remove intent — runForChat then classifies precisely.
            const addVerb = /(anad|agreg|adicion|\badd\b|incorpor|mete|\bpon|dame|\bgive|busca|encuentr|\bfind\b|recomien|recommend|suscr|sigue|seguir|\bfollow\b|lee|leer|\bread\b|informa|quiero|necesit|interes|\bgust|\bwant\b|voeg|ekle|添加|加入|推荐|أضف|اضف|جोड़|اضافه)/i.test(s);
            const remVerb = /(quita|elimin|borra|\bremove\b|\bdelete\b|unsub|unfollow|retir|\bsaca|deja de|verwijder|kaldir|\bsil\b|удали|убер|отпис|删除|移除|取消|احذف|حذف|ازل|ازاله|हटा)/i.test(s);
            return noun && (addVerb || remVerb);
        },
        _parseObj(raw) {
            const cleaned = String(raw).trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
            try { return JSON.parse(cleaned); } catch (_) {}
            const m = cleaned.match(/\{[\s\S]*\}/);
            if (m) { try { return JSON.parse(m[0]); } catch (_) {} }
            return null;
        },
        // Remove the sources Claude picked from the user's CURRENT list. `ids` are
        // exact source ids; we also fall back to fuzzy name/value matching so a
        // loose id still resolves. Returns the count removed.
        _removeItems(ids) {
            const cur = (geoFeed.sources || []);
            const toRemove = new Set();
            (ids || []).forEach(raw => {
                const key = String(raw || '').trim().toLowerCase();
                if (!key) return;
                cur.forEach(s => {
                    const sid = String(s.id || '').toLowerCase();
                    const sval = String(s.value || '').toLowerCase();
                    const sname = String(s.name || '').toLowerCase();
                    if (sid === key || sval === key || sname === key ||
                        (key.length >= 3 && (sid.includes(key) || sname.includes(key) || sval.includes(key)))) {
                        toRemove.add(s.id);
                    }
                });
            });
            toRemove.forEach(id => { try { geoFeed.removeSource(id); } catch (_) {} });
            return toRemove.size;
        },
        // Chat shortcut: when the user asks the AI to ADD or REMOVE sources, let
        // Claude decide and do it (icons appear/disappear on the map; the veil
        // shows while news loads on add). Returns { handled, added, removed,
        // action }. handled=false means "not a source request — answer normally".
        async runForChat(q) {
            // Give Claude the current sources so it can pick which to remove.
            const cur = (geoFeed.sources || []).map(s =>
                `  id=${s.id} | name=${s.name || s.value} | value=${s.value} | type=${s.type}`).join('\n') || '  (none)';
            const system = [
                'You decide whether the user is asking to ADD information sources, REMOVE',
                'sources they already follow, or neither. Output STRICT JSON ONLY — no prose,',
                'no markdown, no code fences.',
                'If NEITHER: output exactly {"action":"none"}',
                'If ADD: {"action":"add","items":[{"type":"telegram"|"rss","value":string,"name":string}]}',
                '  • type "telegram": value = the @handle. type "rss": value = the full feed URL.',
                '  • Honor an explicit count if named; otherwise 8–12 strong, real, active picks matching the topic/region.',
                'If REMOVE: {"action":"remove","ids":[string,...]}',
                '  • Each id MUST be an exact id copied from the CURRENT SOURCES list below.',
                '  • Match the source(s) the user names (by name or handle); include EVERY matching id.',
                '  • If they say "remove all"/"quita todas", include every id in the list.',
            ].join('\n');
            const user = `CURRENT SOURCES:\n${cur}\n\nUser message: "${String(q || '').slice(0, 500)}"\nReturn the JSON now.`;
            let raw = null;
            // count_quota: a chat-initiated source add/remove burns one unit of
            // the Pro allowance, exactly like a normal assistant message (the
            // user asked that source operations count too).
            try { raw = await claudeComplete({ system, max_tokens: 2048, count_quota: true, messages: [{ role: 'user', content: user }] }); }
            catch (_) { return { handled: false }; }
            if (raw == null) return { handled: false };
            const obj = this._parseObj(raw);
            if (!obj) return { handled: false };
            const action = obj.action || (obj.add === true ? 'add' : 'none');

            // ── Remove ──
            if (action === 'remove' && Array.isArray(obj.ids) && obj.ids.length) {
                const removed = this._removeItems(obj.ids);
                try { if (typeof renderUserSourcesList === 'function') renderUserSourcesList(); } catch (_) {}
                if (removed > 0) { try { geoFeed.refresh(true); } catch (_) {} }
                return { handled: true, action: 'remove', added: 0, removed };
            }

            // ── Add ──
            if (action === 'add') {
                let added = 0;
                showSourceLoading();
                try {
                    if (Array.isArray(obj.items) && obj.items.length) {
                        added = this._addItems(obj.items).added;
                    }
                    if (added > 0) {
                        try { if (typeof renderUserSourcesList === 'function') renderUserSourcesList(); } catch (_) {}
                        // Veil stays until the icons are on the map (60s cap).
                        await _refreshAndWait(60000);
                    } else {
                        // The classify gave no usable items (none, all failed to
                        // normalize, or all duplicates). Fall back to the richer
                        // onboarding finder with the user's message as the topic —
                        // it reliably returns real, valid sources. THIS is what
                        // makes chat "add sources about X" actually work instead of
                        // the assistant replying that it can't.
                        try { added = (await this._run({ lang: currentLang }, [String(q || '').slice(0, 200)], [])) || 0; } catch (_) {}
                        try { if (typeof renderUserSourcesList === 'function') renderUserSourcesList(); } catch (_) {}
                    }
                } finally { hideSourceLoading(); }
                return { handled: true, action: 'add', added, removed: 0 };
            }

            return { handled: false };
        },

        // Execute an inline ##SOURCES## directive the STREAMING assistant put in
        // its reply (see AI_SOURCES_DIRECTIVE). Same behavior as runForChat's
        // add/remove paths, but with NO extra classify call — the intent already
        // came inside the normal answer, so this path costs zero extra credits.
        async applyDirective(obj) {
            if (!obj || !obj.action) return { handled: false };
            if (obj.action === 'remove' && Array.isArray(obj.ids) && obj.ids.length) {
                const removed = this._removeItems(obj.ids);
                try { if (typeof renderUserSourcesList === 'function') renderUserSourcesList(); } catch (_) {}
                if (removed > 0) { try { geoFeed.refresh(true); } catch (_) {} }
                return { handled: true, action: 'remove', added: 0, removed };
            }
            if (obj.action === 'add' && Array.isArray(obj.items) && obj.items.length) {
                let added = 0;
                showSourceLoading();
                try {
                    added = this._addItems(obj.items).added;
                    if (added > 0) {
                        try { if (typeof renderUserSourcesList === 'function') renderUserSourcesList(); } catch (_) {}
                        // Veil stays until the icons are on the map (60s cap).
                        await _refreshAndWait(60000);
                    }
                } finally { hideSourceLoading(); }
                return { handled: true, action: 'add', added, removed: 0 };
            }
            return { handled: false };
        },
    };

    // ── Auth gate (server-side accounts via /api/auth/*) ──
    // Shows the landing page until the user logs in or registers. The session
    // token + basic user info live in localStorage under the geoscope_ namespace
    // so the dev Reset wipes them and returns to the landing as a fresh visitor.
    const LS_TOKEN = 'geoscope_auth_token';
    const LS_USER = 'geoscope_auth_user';
    const auth = {
        el: null, mode: 'login', wired: false,
        token() { try { return localStorage.getItem(LS_TOKEN) || ''; } catch (_) { return ''; } },
        _setSession(token, user) {
            try {
                localStorage.setItem(LS_TOKEN, token);
                localStorage.setItem(LS_USER, JSON.stringify(user || {}));
            } catch (_) {}
            this._syncProfile(user);
            this._syncSources(user);
        },
        // Mirror the account's server-side onboarding profile into localStorage so
        // hasProfile()/the wizard reflect THIS account. If the account has no
        // profile yet (null), the local one is CLEARED — so the wizard runs for a
        // brand-new account and a different user on the same browser never
        // inherits a stale profile.
        _syncProfile(user) {
            if (!user || typeof user.profile === 'undefined') return;  // unknown → leave as-is
            try {
                if (user.profile) localStorage.setItem(LS_PROFILE, JSON.stringify(user.profile));
                else localStorage.removeItem(LS_PROFILE);
            } catch (_) {}
        },
        // Pull the account's saved sources into geoFeed (so the feed follows the
        // user across devices). Only applies a non-empty server list; a brand-new
        // account (null) keeps the local defaults, which get pushed up on change.
        _syncSources(user) {
            if (!user || !Array.isArray(user.sources) || !user.sources.length) return;
            try {
                if (typeof geoFeed === 'undefined' || !geoFeed._setSrcLocal) return;
                geoFeed._setSrcLocal(user.sources);
                if (typeof renderUserSourcesList === 'function') renderUserSourcesList();
                if (geoFeed.refresh) geoFeed.refresh(true);
            } catch (_) {}
        },
        async init() {
            this.el = document.getElementById('landing-overlay');
            if (!this.el) { onboarding.init(); return; }
            this._wire();
            this._wireHistory();
            // Init the landing language picker + apply the resolved language to
            // every data-i18n-landing string (incl. error messages and the auth
            // switch markup), BEFORE the form is shown.
            try { landingI18n.init(); } catch (_) {}
            // Clean the black box off the brand PNG logo.
            try { _processLandingLogo(); } catch (_) {}
            // Wire the showcase carousel (map screenshots slider).
            try { _wireLandingCarousels(); } catch (_) {}
            const tok = this.token();
            if (tok) {
                // Validate the saved session against the server before letting them in.
                try {
                    const r = await fetch('/api/auth/me', { headers: { Authorization: 'Bearer ' + tok } });
                    if (r.ok) {
                        // Refresh the stored user so the plan reflects the server
                        // (e.g. an upgrade made in another tab) — gating reads it.
                        try {
                            const me = await r.clone().json();
                            if (me && me.user) {
                                localStorage.setItem(LS_USER, JSON.stringify(me.user));
                                // Pull the account-bound onboarding profile down so
                                // the wizard is skipped for a user who already did it
                                // (and cleared for a fresh account).
                                this._syncProfile(me.user);
                                this._syncSources(me.user);
                            }
                        } catch (_) {}
                        // Returning from a Stripe Checkout success URL? Confirm
                        // the payment with the server and persist the new plan.
                        await this._handleCheckoutReturn(tok);
                        // Refresh-restore: if the user was IN THE APP when they
                        // reloaded, put them back in the app instead of bouncing
                        // them to the landing. Seed a 'home' base entry beneath so
                        // a single Back press returns to the landing (never off the
                        // site, never to a stale checkout URL). Only restore the
                        // app — auth/plans views always re-resolve through _route.
                        let saved = '';
                        try { saved = sessionStorage.getItem('geoscope_view') || ''; } catch (_) {}
                        if (saved === 'app') {
                            try { history.replaceState({ skView: 'home' }, ''); } catch (_) {}
                            try { history.pushState({ skView: 'app' }, ''); } catch (_) {}
                            this._popping = true;          // states already seeded
                            try { this._revealApp(false); } finally { this._popping = false; }
                            return;
                        }
                        // Route by account state: paid plan or a user who has
                        // already set up (completed onboarding) → straight into
                        // the product; a brand-new free user who hasn't entered
                        // yet → stay on the landing, now showing a profile chip.
                        this._route();
                        return;
                    }
                } catch (_) { /* server unreachable — fall through to landing */ }
            }
            // If they came back from Stripe but their session expired, we still
            // want to strip the ?checkout= params so they don't loop on reload.
            this._cleanCheckoutParams();
            this._showLanding();
        },
        async _handleCheckoutReturn(tok) {
            const url = new URL(window.location.href);
            const status = url.searchParams.get('checkout');
            const sid = url.searchParams.get('session_id');
            if (status === 'success' && sid && /^cs_/.test(sid)) {
                try {
                    const vr = await fetch('/api/billing/verify-session?session_id=' + encodeURIComponent(sid),
                        { headers: { Authorization: 'Bearer ' + tok } });
                    const vd = await vr.json().catch(() => ({}));
                    // Persist the freshly purchased plan so AI/source gating unlocks
                    // immediately without waiting for the next /api/auth/me.
                    if (vd && vd.plan) {
                        try {
                            const u = JSON.parse(localStorage.getItem(LS_USER) || '{}') || {};
                            u.plan = vd.plan;
                            localStorage.setItem(LS_USER, JSON.stringify(u));
                        } catch (_) {}
                    }
                } catch (_) {}
            }
            if (status) this._cleanCheckoutParams();
        },
        _cleanCheckoutParams() {
            try {
                const url = new URL(window.location.href);
                if (!url.searchParams.has('checkout') && !url.searchParams.has('session_id')) return;
                url.searchParams.delete('checkout');
                url.searchParams.delete('session_id');
                const next = url.pathname + (url.search || '') + url.hash;
                // Preserve the current view state so history navigation stays intact.
                window.history.replaceState(history.state || { skView: 'home' }, '', next);
            } catch (_) {}
        },
        _showLanding() {
            this._closeAppChrome();
            this._nav(() => {
                this.el.setAttribute('data-view', 'home');
                this.el.setAttribute('aria-hidden', 'false');
                this._setMode('login');
                document.body.classList.add('onb-active');
                this._syncLandingChrome();
            }, document.querySelector('.landing-inner'));
            this._setView('home');
        },
        // Close every in-app panel/overlay so none of them linger on top of the
        // landing when the user goes back to it (e.g. Settings was open and they
        // clicked "Back to home" — the profile menu stops click propagation, so
        // the panels' own outside-click close never fires).
        _closeAppChrome() {
            const settings = document.getElementById('settings-panel');
            if (settings) settings.classList.remove('is-open');
            const sf = document.getElementById('settings-fab');
            if (sf) sf.classList.remove('is-active');
            try { if (typeof favBox !== 'undefined' && favBox.close) favBox.close(); } catch (_) {}
            ['news-panel', 'country-info-panel'].forEach(id => {
                const p = document.getElementById(id);
                if (p) { p.classList.remove('open', 'is-open'); p.setAttribute('aria-hidden', 'true'); }
            });
        },
        // ── Post-auth action (Stripe checkout intent) ──
        // The ONLY thing that can send a user to payment is an explicit Pro/Team
        // click, which stamps this. Free never sets it. It is consumed exactly
        // once (read-and-clear) so a stale intent can never silently bill or
        // unlock — the root cause of the "Free → payment screen" nonsense.
        _setPostAuth(action) { try { sessionStorage.setItem('geoscope_post_auth', action || ''); } catch (_) {} },
        _takePostAuth() {
            let a = '';
            try { a = sessionStorage.getItem('geoscope_post_auth') || ''; sessionStorage.removeItem('geoscope_post_auth'); } catch (_) {}
            return a;
        },
        // Replay the entrance animation on an element by re-adding the class with
        // a forced reflow in between — so the glide-in plays on every navigation
        // (including Back), not just the first time the element is shown.
        _pulse(el) {
            if (!el) return;
            el.classList.remove('lv-anim');
            void el.offsetWidth;   // force reflow so the animation restarts
            el.classList.add('lv-anim');
        },
        // Premium view morph. Wrap a DOM mutation that changes which landing view
        // is shown so the browser smoothly crossfades the before/after states via
        // the View Transitions API (Chrome/Arc/Edge), giving the continuous,
        // Linear/Apple-style feel. Falls back to running the mutation directly +
        // replaying the entrance `pulse` only where View Transitions are absent
        // (so the animation never doubles up).
        _nav(mutate, pulse) {
            const run = () => { try { mutate(); } catch (_) {} };
            if (document.startViewTransition) {
                try { document.startViewTransition(run); return; } catch (_) {}
            }
            run();
            if (pulse) this._pulse(pulse);
        },
        // After auth (login/register or a returning valid token), ALWAYS land on
        // the landing page — never auto-jump into the app. The user enters the
        // product deliberately via the profile chip's "Enter app" button. This
        // is intentional per the product's UX.
        _route() {
            this._showLanding();
        },
        // ── Browser history integration ──────────────────────────────────────
        // The app is a single page that swaps between four "views": home, auth,
        // plans and app (the map). Without history integration the browser Back
        // button walked the REAL history — leaving the site or, worse, landing on
        // a stale Stripe checkout URL. Here every view change records a history
        // entry, Back/Forward move BETWEEN views, and the current view is mirrored
        // to sessionStorage so a refresh restores where you were (notably: stay in
        // the app instead of being kicked to the landing).
        _popping: false,
        _view: 'home',
        // Record a view as the current one: persist it (for refresh-restore) and
        // push/replace a matching browser-history entry (unless we got here from a
        // Back/Forward pop, in which case the history is already correct).
        _setView(view) {
            this._view = view;
            try { sessionStorage.setItem('geoscope_view', view); } catch (_) {}
            if (this._popping) return;
            try {
                if (history.state && history.state.skView === view) {
                    history.replaceState({ skView: view }, '');
                } else {
                    history.pushState({ skView: view }, '');
                }
            } catch (_) {}
        },
        // Render a view WITHOUT pushing a new history entry. Used by popstate so
        // Back/Forward navigate between views instead of off the site.
        _goView(view, fromPop) {
            this._popping = !!fromPop;
            try {
                if (view === 'app') this._revealApp(false);
                else if (view === 'plans') this.showPlans();
                else if (view === 'auth') this.showAuth(this.mode);
                else this.showHome();
            } finally { this._popping = false; }
        },
        // Wire the popstate listener once. On Back/Forward, render the target
        // view internally. A missing state means we'd be walking off our own
        // stack — fall back to the landing home so the user never leaves the app
        // unexpectedly (true navigation away from home is still allowed normally).
        _wireHistory() {
            if (this._historyWired) return;
            this._historyWired = true;
            // Seed the current entry as the 'home' base so the first view set
            // replaces it (no phantom entry) and Back from home leaves the site
            // normally rather than being absorbed.
            try { if (!history.state || !history.state.skView) history.replaceState({ skView: 'home' }, ''); } catch (_) {}
            window.addEventListener('popstate', (e) => {
                const view = (e && e.state && e.state.skView) || 'home';
                this._goView(view, true);
            });
        },
        // Swap the top-bar Login/Create-account buttons for a profile chip once
        // the user is authenticated, on the landing itself (the in-app chip is
        // separate). Idempotent — safe to call on every landing render.
        _syncLandingChrome() {
            const logged = !!this.token();
            const login = document.getElementById('landing-login-btn');
            const reg = document.getElementById('landing-register-btn');
            const prof = document.getElementById('landing-profile');
            if (login) login.hidden = logged;
            if (reg) reg.hidden = logged;
            if (prof) {
                prof.hidden = !logged;
                if (logged) { try { this._fillLandingProfile(); } catch (_) {} }
            }
            // Reflect login/plan state on the pricing CTAs (current plan → "in use").
            try { this._refreshPricingCtas(); } catch (_) {}
        },
        _fillLandingProfile() {
            let user = {};
            try { user = JSON.parse(localStorage.getItem(LS_USER) || '{}') || {}; } catch (_) {}
            const name = user.name || (user.email ? user.email.split('@')[0] : 'Skorpene');
            const plan = (user.plan || 'free').toLowerCase();
            const tr = (T[currentLang] || T.en);
            const av = document.getElementById('landing-profile-avatar');
            const nm = document.getElementById('landing-profile-name');
            const pl = document.getElementById('landing-profile-plan');
            const em = document.getElementById('landing-profile-email');
            const planBtn = document.getElementById('landing-profile-plans');
            const enterBtn = document.getElementById('landing-profile-enter');
            if (av) av.textContent = (name[0] || 'S').toUpperCase();
            if (nm) nm.textContent = name;
            if (em) em.textContent = user.email || '';
            if (pl) {
                pl.classList.toggle('is-choose', !(plan === 'pro' || plan === 'team'));
                pl.textContent = plan === 'team' ? 'Team' : plan === 'pro' ? 'Pro' : (tr.planChoose || 'Choose plan');
            }
            if (planBtn) {
                planBtn.style.display = (plan === 'pro' || plan === 'team') ? 'none' : '';
                planBtn.textContent = tr.planChoose || 'Choose plan';
            }
            const logoutBtn = document.getElementById('landing-profile-logout');
            if (logoutBtn) logoutBtn.textContent = tr.logoutLabel || 'Log out';
            if (enterBtn) enterBtn.textContent = tr.enterApp || 'Enter app';
            const resetBtn = document.getElementById('landing-profile-reset');
            if (resetBtn) {
                resetBtn.hidden = !this._isDevUser();
                resetBtn.textContent = tr.devReset || 'Reset everything (dev)';
            }
            try { window.subCtl && window.subCtl.renderInto('landing-cancelsub-btn'); } catch (_) {}
        },
        _enterApp() { this._revealApp(true); },
        // Reveal the product (map) by hiding the landing overlay. `withWelcome`
        // plays the minimalist intro first (deliberate "Enter app"); without it
        // the app appears immediately (used when RESTORING the app after a page
        // refresh, where a welcome animation every reload would be annoying).
        _revealApp(withWelcome) {
            const doReveal = () => {
                this.el.removeAttribute('data-view');
                this.el.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('onb-active');
                // Apply plan gating (locks the live map for Free) + render the
                // profile chip now that we know who the user is.
                try { applyPlanGating(); } catch (_) {}
                // Continue the normal first-run flow (wizard shows only if no profile).
                onboarding.init();
            };
            // GUARANTEE a 'home' entry sits BENEATH 'app' in the browser history
            // so Back from the map always returns to Skorpene's landing, never off
            // to Google or wherever the user came from. Without this, entering the
            // app from a landing view that was itself a REPLACE (not a push) — the
            // usual flow on first visit — leaves Back walking straight off the site.
            if (!this._popping) {
                try {
                    const st = history.state;
                    if (!st || st.skView !== 'app') {
                        history.replaceState({ skView: 'home' }, '');
                        history.pushState({ skView: 'app' }, '');
                    }
                } catch (_) {}
                this._view = 'app';
                try { sessionStorage.setItem('geoscope_view', 'app'); } catch (_) {}
            } else {
                this._setView('app');
            }
            if (withWelcome) this._playWelcome(doReveal);
            else doReveal();
        },
        // Minimalist "Welcome to Skorpene" intro (spinning globe). `swap` runs
        // once the overlay is fully shown — that's when we switch the view
        // underneath, so the fade-out reveals the wizard/map with no flash.
        _playWelcome(swap) {
            const ov = document.getElementById('welcome-overlay');
            if (!ov) { try { swap(); } catch (_) {} return; }
            const tr = T[currentLang] || T.en;
            const titleEl = ov.querySelector('.welcome-title');
            const subEl = ov.querySelector('.welcome-sub');
            if (titleEl) titleEl.textContent = tr.welcomeTitle || 'Welcome to Skorpene';
            if (subEl) subEl.textContent = tr.welcomeSub || '';
            ov.hidden = false;
            ov.setAttribute('aria-hidden', 'false');
            ov.classList.remove('welcome-in', 'welcome-out');
            void ov.offsetWidth;                 // reflow so the fade-in plays
            ov.classList.add('welcome-in');
            window.setTimeout(() => {
                try { swap(); } catch (_) {}     // swap the view underneath
                // Remove welcome-in FIRST: its `animation … both` fill pins
                // opacity:1 and would otherwise override welcome-out's fade, making
                // the intro vanish abruptly instead of dissolving into the map.
                ov.classList.remove('welcome-in');
                ov.classList.add('welcome-out');
                window.setTimeout(() => {
                    ov.hidden = true;
                    ov.setAttribute('aria-hidden', 'true');
                    ov.classList.remove('welcome-in', 'welcome-out');
                    ov.style.transform = '';
                }, 620);
            }, 1250);
        },
        // Re-open the landing overlay in PLANS-ONLY mode (logged-in users who
        // need to pick a plan: Free trying to use the map, the "Choose plan"
        // chip, or the 6th-source nudge). Hides the hero/auth, shows only the
        // pricing cards + a close button.
        showPlans() {
            if (!this.el) return;
            // Remember where Back should return to: if we were already on a
            // landing view (home/auth) Back goes home; if plans was opened from
            // inside the app (no data-view), Back closes back to the app.
            const prev = this.el.getAttribute('data-view');
            this._plansFrom = (prev === 'home' || prev === 'auth') ? 'home' : 'app';
            const pricing = document.getElementById('landing-pricing');
            this._nav(() => {
                this.el.setAttribute('data-view', 'plans');
                this.el.setAttribute('aria-hidden', 'false');
                document.body.classList.add('onb-active');
                try { this._wirePricing(); } catch (_) {}
            }, pricing);
            this._setView('plans');
            try { this.el.scrollTo({ top: 0 }); } catch (_) {}
            if (pricing) try { pricing.scrollIntoView({ block: 'start' }); } catch (_) {}
        },
        hidePlans() {
            if (!this.el) return;
            // View Transitions crossfade plans → app smoothly; on browsers without
            // them, fall back to a quick opacity fade (not an instant light-switch).
            const mutate = () => {
                this.el.removeAttribute('data-view');
                this.el.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('onb-active');
            };
            this._setView('app');
            if (document.startViewTransition) { this._nav(mutate); return; }
            this._fadeOutThen(mutate);
        },
        _fadeOutThen(fn) {
            const el = this.el;
            if (!el) { try { fn(); } catch (_) {} return; }
            el.classList.add('landing-leaving');
            window.setTimeout(() => {
                try { fn(); } finally { el.classList.remove('landing-leaving'); }
            }, 300);
        },
        // Back from the plans view → return to wherever the user came from.
        // Hard guard: this may ONLY act while the plans view is actually showing,
        // so it can never accidentally drop a user into the app from another view
        // (defense in depth against the button leaking outside plans mode).
        _plansBack() {
            if (!this.el || this.el.getAttribute('data-view') !== 'plans') return;
            if (this._plansFrom === 'home') this.showHome();
            else this.hidePlans();
        },
        _setMode(mode) {
            this.mode = mode;
            this.el.setAttribute('data-mode', mode);
            this.el.querySelectorAll('[data-auth-tab]').forEach(b =>
                b.classList.toggle('active', b.getAttribute('data-auth-tab') === mode && b.classList.contains('auth-tab')));
            this.el.querySelectorAll('[data-auth-switch]').forEach(s =>
                s.hidden = (s.getAttribute('data-auth-switch') !== mode));
            const submit = document.getElementById('auth-submit');
            if (submit) submit.textContent = landingI18n.get(currentLang, mode === 'register' ? 'lpCreate' : 'lpEnter');
            const pw = document.getElementById('auth-password');
            if (pw) pw.setAttribute('autocomplete', mode === 'register' ? 'new-password' : 'current-password');
            this._clearError();
        },
        _clearError() {
            const e = document.getElementById('auth-error');
            if (e) { e.textContent = ''; e.classList.remove('show'); }
        },
        _error(msg) {
            const e = document.getElementById('auth-error');
            if (e) { e.textContent = msg; e.classList.add('show'); }
        },
        _msgFor(code) {
            const map = {
                invalid_email: 'lpErrInvalidEmail',
                weak_password: 'lpErrWeakPwd',
                email_taken:   'lpErrEmailTaken',
                bad_credentials: 'lpErrBadCreds',
                no_token: 'lpErrInvalidSession', invalid_token: 'lpErrInvalidSession',
            };
            return landingI18n.get(currentLang, map[code] || 'lpErrGeneric');
        },
        _wire() {
            if (this.wired) return;
            this.wired = true;
            this._rewireAuthLinks();
            this._wirePricing();
            const form = document.getElementById('auth-form');
            if (form) form.addEventListener('submit', (e) => { e.preventDefault(); this._submit(); });
            // Top-bar auth buttons → dedicated auth view; back → home.
            // Entering auth from the top bar is a plain login/register with NO
            // plan attached, so clear any stale checkout intent first.
            const loginBtn = document.getElementById('landing-login-btn');
            const regBtn = document.getElementById('landing-register-btn');
            const backBtn = document.getElementById('landing-auth-back');
            if (loginBtn) loginBtn.addEventListener('click', () => { this._setPostAuth(''); this.showAuth('login'); });
            if (regBtn) regBtn.addEventListener('click', () => { this._setPostAuth(''); this.showAuth('register'); });
            if (backBtn) backBtn.addEventListener('click', () => this.showHome());
            // Plans-view Back button (wired here so it works even before the app
            // is ever entered, e.g. a landing visitor opening "Choose plan").
            const plansBack = document.getElementById('landing-close');
            if (plansBack) plansBack.addEventListener('click', () => this._plansBack());
            this._wireLandingProfile();
        },
        // Landing profile chip: dropdown with the user's info, "Enter app",
        // "Choose plan" (free only) and "Log out".
        _wireLandingProfile() {
            const btn = document.getElementById('landing-profile-btn');
            const menu = document.getElementById('landing-profile-menu');
            if (!btn || !menu || btn.dataset.wired === '1') return;
            btn.dataset.wired = '1';
            const setOpen = (open) => {
                if (open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden', '');
                btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            };
            btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(menu.hasAttribute('hidden')); });
            document.addEventListener('click', () => setOpen(false));
            menu.addEventListener('click', e => e.stopPropagation());
            const enterBtn = document.getElementById('landing-profile-enter');
            if (enterBtn) enterBtn.addEventListener('click', () => { setOpen(false); this._enterApp(); });
            const plansBtn = document.getElementById('landing-profile-plans');
            if (plansBtn) plansBtn.addEventListener('click', () => { setOpen(false); this.showPlans(); });
            const resetBtn = document.getElementById('landing-profile-reset');
            if (resetBtn) resetBtn.addEventListener('click', () => { setOpen(false); try { this._devReset(); } catch (_) {} });
            const logoutBtn = document.getElementById('landing-profile-logout');
            if (logoutBtn) logoutBtn.addEventListener('click', async () => { setOpen(false); try { await this.logout(); } catch (_) {} location.reload(); });
        },
        // Show the dedicated auth view (login or register).
        showAuth(mode) {
            if (!this.el) return;
            this._nav(() => {
                this.el.setAttribute('data-view', 'auth');
                this.el.setAttribute('aria-hidden', 'false');
                document.body.classList.add('onb-active');
                this._setMode(mode || 'login');
            }, document.getElementById('landing-authview'));
            this._setView('auth');
            try { this.el.scrollTo({ top: 0 }); } catch (_) {}
            setTimeout(() => {
                const f = (mode === 'register' && document.getElementById('auth-name')) || document.getElementById('auth-email');
                if (f && f.focus) try { f.focus(); } catch (_) {}
            }, 240);
        },
        // Back to the home view (hero + showcase + pricing).
        showHome() {
            if (!this.el) return;
            this._nav(() => {
                this.el.setAttribute('data-view', 'home');
                this.el.setAttribute('aria-hidden', 'false');
                document.body.classList.add('onb-active');
                this._syncLandingChrome();
            }, document.querySelector('.landing-inner'));
            this._setView('home');
            try { this.el.scrollTo({ top: 0 }); } catch (_) {}
        },
        // Hook up the pricing CTAs. Free → scroll up + open register tab.
        // Pro → if logged in, jump to Stripe Checkout; else remember the intent
        //       and route through register first.
        _wirePricing() {
            if (!this.el) return;
            this.el.querySelectorAll('.lpr-cta').forEach(b => {
                if (b.dataset.wired !== '1') {
                    b.dataset.wired = '1';
                    b.addEventListener('click', () => {
                        const plan = b.getAttribute('data-plan') || 'free';
                        if (this.token()) {
                            // Logged in: NO plan card ever enters the app — the only
                            // way into the product is Enter app on the profile. The
                            // current plan's card is inert ("Plan en uso"); the
                            // others just SWITCH plan and stay on the plans view.
                            if (plan === currentPlan()) return;
                            if (plan === 'pro' || plan === 'team') { this._startCheckout(plan); return; }
                            // Free: switch the plan down (dev bypass for now); stay put.
                            if (this._isDevUser()) { this._devUpgrade('free'); }
                            return;
                        }
                        // Logged out: any plan CTA → register. Pro/Team stash a
                        // checkout intent; Free stashes none, so after register the
                        // user lands on the landing and enters via Enter app.
                        this._setPostAuth((plan === 'pro' || plan === 'team') ? ('checkout-' + plan) : '');
                        this._gotoRegister();
                    });
                }
            });
            this._refreshPricingCtas();
        },
        // Localize each plan card's CTA, and for a logged-in user mark their
        // current plan's CTA as "Plan en uso" (label + .is-current, kept hoverable
        // but inert). Runs after landingI18n.apply() so it wins over the static
        // data-i18n-landing label, and on every language switch / plan change.
        _refreshPricingCtas() {
            if (!this.el) return;
            const logged = !!this.token();
            const plan = currentPlan();
            const inUse = (window.__landingI18n && window.__landingI18n.get(currentLang, 'prInUse')) || 'Current plan';
            this.el.querySelectorAll('.lpr-cta').forEach(b => {
                const cardPlan = b.getAttribute('data-plan') || 'free';
                const isCurrent = logged && cardPlan === plan;
                b.classList.toggle('is-current', isCurrent);
                if (isCurrent) { b.textContent = inUse; return; }
                const key = cardPlan === 'pro' ? 'prProCta' : cardPlan === 'team' ? 'prTeamCta' : 'prFreeCta';
                const v = window.__landingI18n && window.__landingI18n.get(currentLang, key);
                if (v) b.textContent = v;
            });
        },
        _gotoRegister() {
            // Open the dedicated auth view in register mode (used when a logged-
            // out user clicks a plan CTA).
            this.showAuth('register');
        },
        async _startCheckout(plan) {
            const tok = this.token();
            if (!tok) {
                // Not logged in yet — stash the checkout intent, send them to
                // register, and finish the checkout right after they create the
                // account. Only Pro/Team ever reach here.
                this._setPostAuth('checkout-' + plan);
                this._gotoRegister();
                return;
            }
            // Developer accounts switch plan instantly without Stripe (the server
            // enforces who qualifies). Lets the owner test the full gated Pro/Team
            // experience. Non-dev accounts get 403 and fall through to Stripe.
            if (this._isDevUser() && await this._devUpgrade(plan, tok)) return;
            try {
                const r = await fetch('/api/billing/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok },
                    body: JSON.stringify({ plan, origin: window.location.origin }),
                });
                const data = await r.json().catch(() => ({}));
                if (r.ok && data.url) { window.location.href = data.url; return; }
                this._error(this._msgFor(data.error || 'stripe_unreachable'));
            } catch (_) {
                this._error(landingI18n.get(currentLang, 'lpErrServer'));
            }
        },
        // The single owner account that gets dev powers (Reset, plan bypass).
        // Hard-coded on BOTH client and server so neither a stale cached is_dev
        // nor a misconfigured server can ever show the destructive Reset to any
        // other account. The server still independently enforces the endpoints.
        OWNER_EMAIL: 'samimansouri365@gmail.com',
        _isDevUser() {
            try {
                const u = JSON.parse(localStorage.getItem(LS_USER) || '{}') || {};
                return u.is_dev === true &&
                    String(u.email || '').trim().toLowerCase() === this.OWNER_EMAIL;
            } catch (_) { return false; }
        },
        // Developer-only HARD reset: wipe the account's profile + sources + plan
        // on the server, clear the matching local state, and reload → the whole
        // first-run (onboarding included) replays. Dev accounts only.
        async _devReset() {
            const tok = this.token();
            if (!tok) return;
            try { if (typeof confirm === 'function' && !confirm('DEV: reset profile, sources and plan to first-run?')) return; } catch (_) {}
            try { await fetch('/api/auth/dev-reset', { method: 'POST', headers: { Authorization: 'Bearer ' + tok } }); } catch (_) {}
            ['geoscope_profile', 'geoscope_user_sources', 'geoscope_geofeed_geo', 'geoscope_hidden_channels', 'geoscope_removed_defaults']
                .forEach(k => { try { localStorage.removeItem(k); } catch (_) {} });
            try {
                const u = JSON.parse(localStorage.getItem(LS_USER) || '{}') || {};
                u.plan = 'free'; u.profile = null; u.sources = null;
                localStorage.setItem(LS_USER, JSON.stringify(u));
            } catch (_) {}
            location.reload();
        },
        // Switch a developer account's plan with no payment, then unlock the UI
        // in place (no reload). Returns true if the upgrade happened.
        async _devUpgrade(plan, tok) {
            tok = tok || this.token();
            if (!tok) return false;
            try {
                const r = await fetch('/api/billing/dev-upgrade', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tok },
                    body: JSON.stringify({ plan }),
                });
                if (!r.ok) return false;
                const d = await r.json().catch(() => ({}));
                if (!d || !d.plan) return false;
                // Persist the new plan locally so gating unlocks immediately.
                try {
                    const u = JSON.parse(localStorage.getItem(LS_USER) || '{}') || {};
                    u.plan = d.plan;
                    localStorage.setItem(LS_USER, JSON.stringify(u));
                } catch (_) {}
                try { applyPlanGating(); } catch (_) {}      // unlock map + re-render chip
                try { this._fillLandingProfile(); } catch (_) {}
                try { this._refreshPricingCtas(); } catch (_) {}  // current card → "Plan en uso"
                return true;
            } catch (_) { return false; }
        },
        // Re-attach click handlers to every [data-auth-tab] in the landing.
        // Needed after landingI18n.apply() rewrites .auth-switch via innerHTML,
        // which replaces the inner <button>s and drops their listeners.
        _rewireAuthLinks() {
            if (!this.el) return;
            this.el.querySelectorAll('[data-auth-tab]').forEach(b => {
                if (b.dataset.wired === '1') return;
                b.dataset.wired = '1';
                b.addEventListener('click', () => this._switchMode(b.getAttribute('data-auth-tab')));
            });
        },
        // User-initiated login↔register switch: change the mode AND replay a soft
        // crossfade on the whole auth card so the name field appearing/leaving is
        // fluid rather than an instant jump.
        _switchMode(mode) {
            if (!mode || mode === this.mode) return;
            this._setMode(mode);
            const card = document.querySelector('.auth-card');
            if (card) {
                card.classList.remove('auth-anim');
                void card.offsetWidth;   // force reflow so the animation restarts
                card.classList.add('auth-anim');
            }
        },
        async _submit() {
            const email = (document.getElementById('auth-email') || {}).value || '';
            const password = (document.getElementById('auth-password') || {}).value || '';
            const name = (document.getElementById('auth-name') || {}).value || '';
            const submit = document.getElementById('auth-submit');
            this._clearError();
            if (!email.trim() || !password) { this._error('Rellena email y contraseña.'); return; }
            if (this.mode === 'register' && password.length < 6) { this._error(this._msgFor('weak_password')); return; }
            if (submit) { submit.disabled = true; submit.textContent = '…'; }
            const path = this.mode === 'register' ? '/api/auth/register' : '/api/auth/login';
            const payload = this.mode === 'register'
                ? { email, password, name } : { email, password };
            try {
                const r = await fetch(path, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = await r.json().catch(() => ({}));
                if (r.ok && data.token) {
                    this._setSession(data.token, data.user);
                    // Consume the post-auth action (set exactly once by a plan
                    // CTA). ONLY Pro/Team checkout is honored; everything else
                    // lands on the landing — the app is entered solely via the
                    // profile's "Enter app" (no plan CTA ever auto-enters).
                    const post = this._takePostAuth();
                    if (post === 'checkout-pro') { await this._startCheckout('pro'); return; }
                    if (post === 'checkout-team') { await this._startCheckout('team'); return; }
                    this._route();
                    return;
                }
                this._error(this._msgFor(data.error));
            } catch (_) {
                this._error('No se pudo contactar con el servidor. Inicia start_server.py.');
            } finally {
                if (submit) { submit.disabled = false; submit.textContent = (this.mode === 'register') ? 'Crear cuenta' : 'Entrar'; }
            }
        },
        async logout() {
            const tok = this.token();
            if (tok) {
                try { await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: 'Bearer ' + tok } }); } catch (_) {}
            }
            // Clear the local onboarding profile too, so the next account that
            // logs in on this browser doesn't inherit it (it's re-synced from the
            // server on the next login).
            try { localStorage.removeItem(LS_TOKEN); localStorage.removeItem(LS_USER); localStorage.removeItem(LS_PROFILE); } catch (_) {}
        },
    };

    // ── Landing page i18n + language picker ──
    // The landing has its own self-contained translation table because it is
    // shown BEFORE the user has chosen anything, so we can't rely on the main
    // app's profile. Picking a language here also sets currentLang so the rest
    // of the app (onboarding included) immediately reads that language.
    const LANDING_I18N = {
        es: { lpTitle:'Tu feed, tu mundo.', lpSub:'Reúne las fuentes que te importan —canales, webs, foros, RSS— y obsérvalas en el mapa en vivo. Tienes a tu alcance una IA para ayudarte con cualquier duda sobre tus temas favoritos, todo desde tu propio feed personalizado.', lpF1T:'Mapa en vivo', lpF1S:'Cada noticia, geolocalizada en tiempo real.', lpF2T:'Asistente IA', lpF2S:'Pregunta y obtén respuestas sobre tus fuentes.', lpF3T:'Tus fuentes', lpF3S:'Añade tus fuentes; nosotros lo unimos.', lpF4T:'13 idiomas', lpF4S:'Toda la interfaz, en el idioma que elijas.', lpLogin:'Iniciar sesión', lpRegister:'Crear cuenta', lpName:'Nombre', lpNamePh:'Tu nombre', lpEmail:'Email', lpEmailPh:'Dirección de correo', lpPwd:'Contraseña', lpPwdPh:'Mínimo 6 caracteres', lpEnter:'Entrar', lpCreate:'Crear cuenta', lpHaveAccountNo:'¿No tienes cuenta? <button type="button" class="auth-link" data-auth-tab="register">Crea una</button>', lpHaveAccountYes:'¿Ya tienes cuenta? <button type="button" class="auth-link" data-auth-tab="login">Inicia sesión</button>', lpFoot:'Tus datos se guardan solo en tu propio servidor.', lpErrEmptyFields:'Rellena email y contraseña.', lpErrServer:'No se pudo contactar con el servidor. Inicia start_server.py.', lpErrInvalidEmail:'Introduce un email válido.', lpErrWeakPwd:'La contraseña debe tener al menos 6 caracteres.', lpErrEmailTaken:'Ese email ya está registrado. Inicia sesión.', lpErrBadCreds:'Email o contraseña incorrectos.', lpErrInvalidSession:'Sesión expirada, vuelve a entrar.', lpErrGeneric:'No se pudo completar. ¿Está el servidor (start_server.py) en marcha?', lpBack:'← Volver', scTitle:'Tu mundo, en un solo feed', scSub:'Reúne tus fuentes favoritas, ubícalas en el mapa y deja que la IA te ayude.', sc1T:'Un feed personalizado', sc1B:'Canales, webs, foros y RSS que te importan, reunidos en un único feed que puedes leer sin límite.', sc2T:'Geolocalizado en el mapa', sc2B:'Ve dónde pasa cada cosa, en vivo y con exactitud. Iconos por evento para saber qué ocurre y dónde, al instante.', sc3T:'Una IA de tu lado', sc3B:'Sintetiza noticias, te explica lo que no entiendes y hasta te elige las mejores fuentes para tus temas.', scCases:'Geopolítica en tiempo real, fichajes del fútbol internacional por todo el mundo, mercados, tu deporte o afición… tú eliges los temas, Skorpene los pone en el mapa.' },
        en: { lpTitle:'Your feed, your world.', lpSub:'Bring together the sources that matter to you —channels, websites, forums, RSS— and watch them unfold on the live map. You\'ve got an AI on hand to answer anything about your favorite topics, all from your own personalized feed.', lpF1T:'Live map', lpF1S:'Every story, geolocated in real time.', lpF2T:'AI assistant', lpF2S:'Ask and get answers about your sources.', lpF3T:'Your sources', lpF3S:'Add your sources; we connect them.', lpF4T:'13 languages', lpF4S:'The whole interface in the language you pick.', lpLogin:'Log in', lpRegister:'Create account', lpName:'Name', lpNamePh:'Your name', lpEmail:'Email', lpEmailPh:'Email address', lpPwd:'Password', lpPwdPh:'At least 6 characters', lpEnter:'Enter', lpCreate:'Create account', lpHaveAccountNo:'No account yet? <button type="button" class="auth-link" data-auth-tab="register">Create one</button>', lpHaveAccountYes:'Already have an account? <button type="button" class="auth-link" data-auth-tab="login">Log in</button>', lpFoot:'Your data lives only on your own server.', lpErrEmptyFields:'Please fill in email and password.', lpErrServer:'Could not contact the server. Start start_server.py.', lpErrInvalidEmail:'Enter a valid email.', lpErrWeakPwd:'Password must be at least 6 characters.', lpErrEmailTaken:'That email is already registered. Log in instead.', lpErrBadCreds:'Wrong email or password.', lpErrInvalidSession:'Session expired, please log in again.', lpErrGeneric:'Could not complete. Is the server (start_server.py) running?', lpBack:'← Back', scTitle:'Your world, in a single feed', scSub:'Gather your favorite sources, place them on the map, and let AI help.', sc1T:'A personalized feed', sc1B:'The channels, sites, forums and RSS you care about, gathered in one feed you can read without limits.', sc2T:'Geolocated on the map', sc2B:'See where everything happens, live and precisely. Per-event icons tell you what is going on and where, instantly.', sc3T:'An AI on your side', sc3B:'It synthesizes news, explains what you didn\'t get, and even picks the best sources for your topics.', scCases:'Real-time geopolitics, international football transfers around the world, markets, your sport or hobby… you choose the topics, Skorpene puts them on the map.' },
        fr: { lpTitle:'Ton flux, ton monde.', lpSub:'Rassemble les sources qui comptent —chaînes, sites, forums, RSS— et observe-les sur la carte en direct. Une IA est à ta disposition pour répondre à toutes tes questions sur tes sujets favoris, depuis ton propre flux personnalisé.', lpF1T:'Carte en direct', lpF1S:'Chaque actualité, géolocalisée en temps réel.', lpF2T:'Assistant IA', lpF2S:'Pose des questions sur tes sources.', lpF3T:'Tes sources', lpF3S:'Ajoute tes sources ; nous les réunissons.', lpF4T:'13 langues', lpF4S:'Toute l\'interface dans la langue de ton choix.', lpLogin:'Se connecter', lpRegister:'Créer un compte', lpName:'Nom', lpNamePh:'Ton nom', lpEmail:'Email', lpEmailPh:'Adresse e-mail', lpPwd:'Mot de passe', lpPwdPh:'Au moins 6 caractères', lpEnter:'Entrer', lpCreate:'Créer un compte', lpHaveAccountNo:'Pas encore de compte ? <button type="button" class="auth-link" data-auth-tab="register">Crée-en un</button>', lpHaveAccountYes:'Déjà inscrit ? <button type="button" class="auth-link" data-auth-tab="login">Connecte-toi</button>', lpFoot:'Tes données restent sur ton propre serveur.', lpErrEmptyFields:'Renseigne email et mot de passe.', lpErrServer:'Impossible de contacter le serveur. Lance start_server.py.', lpErrInvalidEmail:'Entre un email valide.', lpErrWeakPwd:'Le mot de passe doit faire au moins 6 caractères.', lpErrEmailTaken:'Cet email est déjà enregistré. Connecte-toi.', lpErrBadCreds:'Email ou mot de passe incorrect.', lpErrInvalidSession:'Session expirée, reconnecte-toi.', lpErrGeneric:'Impossible de terminer. Le serveur (start_server.py) est-il lancé ?' },
        ru: { lpTitle:'Твоя лента, твой мир.', lpSub:'Собери источники, которые тебе важны —каналы, сайты, форумы, RSS— и наблюдай за ними на живой карте. ИИ всегда рядом, чтобы ответить на любые вопросы по твоим темам, прямо в твоей ленте.', lpF1T:'Живая карта', lpF1S:'Каждая новость геолоцирована в реальном времени.', lpF2T:'ИИ-ассистент', lpF2S:'Задавай вопросы по своим источникам.', lpF3T:'Твои источники', lpF3S:'Добавь свои источники; мы их объединим.', lpF4T:'13 языков', lpF4S:'Весь интерфейс на выбранном языке.', lpLogin:'Войти', lpRegister:'Создать аккаунт', lpName:'Имя', lpNamePh:'Твоё имя', lpEmail:'Email', lpEmailPh:'Адрес эл. почты', lpPwd:'Пароль', lpPwdPh:'Минимум 6 символов', lpEnter:'Войти', lpCreate:'Создать аккаунт', lpHaveAccountNo:'Нет аккаунта? <button type="button" class="auth-link" data-auth-tab="register">Создай</button>', lpHaveAccountYes:'Уже есть аккаунт? <button type="button" class="auth-link" data-auth-tab="login">Войди</button>', lpFoot:'Твои данные хранятся только на твоём сервере.', lpErrEmptyFields:'Заполни email и пароль.', lpErrServer:'Не удалось связаться с сервером. Запусти start_server.py.', lpErrInvalidEmail:'Введи корректный email.', lpErrWeakPwd:'Пароль должен быть не короче 6 символов.', lpErrEmailTaken:'Этот email уже зарегистрирован. Войди.', lpErrBadCreds:'Неверный email или пароль.', lpErrInvalidSession:'Сессия истекла, войди снова.', lpErrGeneric:'Не удалось выполнить. Запущен ли start_server.py?' },
        zh: { lpTitle:'你的资讯流，你的世界。', lpSub:'集合你重视的所有来源——频道、网站、论坛、RSS——并在实时地图上观察它们。一位 AI 随时为你解答关于你最爱话题的任何疑问，全部来自你自己的个性化资讯流。', lpF1T:'实时地图', lpF1S:'每条新闻，实时定位。', lpF2T:'AI 助手', lpF2S:'提问并获得关于你来源的答案。', lpF3T:'你的来源', lpF3S:'添加你的来源；我们为你串联。', lpF4T:'13 种语言', lpF4S:'整个界面，使用你选择的语言。', lpLogin:'登录', lpRegister:'创建账户', lpName:'姓名', lpNamePh:'你的名字', lpEmail:'电子邮件', lpEmailPh:'电子邮件地址', lpPwd:'密码', lpPwdPh:'至少 6 个字符', lpEnter:'进入', lpCreate:'创建账户', lpHaveAccountNo:'还没有账户？<button type="button" class="auth-link" data-auth-tab="register">立即创建</button>', lpHaveAccountYes:'已有账户？<button type="button" class="auth-link" data-auth-tab="login">登录</button>', lpFoot:'你的数据只保留在你自己的服务器上。', lpErrEmptyFields:'请填写邮箱和密码。', lpErrServer:'无法连接服务器。请启动 start_server.py。', lpErrInvalidEmail:'请输入有效的邮箱。', lpErrWeakPwd:'密码至少需要 6 个字符。', lpErrEmailTaken:'该邮箱已注册。请登录。', lpErrBadCreds:'邮箱或密码错误。', lpErrInvalidSession:'会话已过期，请重新登录。', lpErrGeneric:'无法完成。start_server.py 是否正在运行？' },
        tr: { lpTitle:'Senin akışın, senin dünyan.', lpSub:'Önemsediğin kaynakları —kanallar, web siteleri, forumlar, RSS— bir araya getir ve canlı haritada izle. Favori konularınla ilgili her sorunu yanıtlayacak bir YZ elinin altında, kendi kişiselleştirilmiş akışında.', lpF1T:'Canlı harita', lpF1S:'Her haber, gerçek zamanlı konum.', lpF2T:'YZ asistanı', lpF2S:'Kaynaklarınla ilgili soru sor, cevap al.', lpF3T:'Kaynakların', lpF3S:'Kaynaklarını ekle; biz birleştiririz.', lpF4T:'13 dil', lpF4S:'Tüm arayüz, seçtiğin dilde.', lpLogin:'Giriş yap', lpRegister:'Hesap oluştur', lpName:'Ad', lpNamePh:'Adın', lpEmail:'E-posta', lpEmailPh:'E-posta adresi', lpPwd:'Şifre', lpPwdPh:'En az 6 karakter', lpEnter:'Gir', lpCreate:'Hesap oluştur', lpHaveAccountNo:'Hesabın yok mu? <button type="button" class="auth-link" data-auth-tab="register">Oluştur</button>', lpHaveAccountYes:'Zaten hesabın var mı? <button type="button" class="auth-link" data-auth-tab="login">Giriş yap</button>', lpFoot:'Verilerin yalnızca kendi sunucunda saklanır.', lpErrEmptyFields:'E-posta ve şifreyi doldur.', lpErrServer:'Sunucuya bağlanılamadı. start_server.py\'yi başlat.', lpErrInvalidEmail:'Geçerli bir e-posta gir.', lpErrWeakPwd:'Şifre en az 6 karakter olmalı.', lpErrEmailTaken:'Bu e-posta zaten kayıtlı. Giriş yap.', lpErrBadCreds:'E-posta veya şifre hatalı.', lpErrInvalidSession:'Oturum doldu, tekrar giriş yap.', lpErrGeneric:'Tamamlanamadı. Sunucu (start_server.py) çalışıyor mu?' },
        ar: { lpTitle:'موجزك، عالمك.', lpSub:'اجمع المصادر التي تهمّك —قنوات، مواقع، منتديات، RSS— وراقبها على الخريطة الحيّة. هناك ذكاء اصطناعي بين يديك للإجابة على كل ما يخطر ببالك حول مواضيعك المفضّلة، من موجزك الشخصي.', lpF1T:'خريطة حيّة', lpF1S:'كل خبر، موقعه الجغرافي في الوقت الفعلي.', lpF2T:'مساعد ذكي', lpF2S:'اسأل واحصل على إجابات حول مصادرك.', lpF3T:'مصادرك', lpF3S:'أضف مصادرك؛ ونحن نجمعها.', lpF4T:'13 لغة', lpF4S:'كل الواجهة باللغة التي تختارها.', lpLogin:'تسجيل الدخول', lpRegister:'إنشاء حساب', lpName:'الاسم', lpNamePh:'اسمك', lpEmail:'البريد الإلكتروني', lpEmailPh:'عنوان البريد الإلكتروني', lpPwd:'كلمة المرور', lpPwdPh:'6 أحرف على الأقل', lpEnter:'دخول', lpCreate:'إنشاء حساب', lpHaveAccountNo:'ليس لديك حساب؟ <button type="button" class="auth-link" data-auth-tab="register">أنشئ واحدًا</button>', lpHaveAccountYes:'لديك حساب بالفعل؟ <button type="button" class="auth-link" data-auth-tab="login">سجّل الدخول</button>', lpFoot:'بياناتك تبقى على خادمك الخاص فقط.', lpErrEmptyFields:'أدخل البريد الإلكتروني وكلمة المرور.', lpErrServer:'تعذّر الاتصال بالخادم. شغّل start_server.py.', lpErrInvalidEmail:'أدخل بريدًا إلكترونيًا صحيحًا.', lpErrWeakPwd:'يجب ألا تقلّ كلمة المرور عن 6 أحرف.', lpErrEmailTaken:'هذا البريد مسجّل بالفعل. سجّل الدخول.', lpErrBadCreds:'البريد أو كلمة المرور غير صحيحة.', lpErrInvalidSession:'انتهت الجلسة، سجّل الدخول من جديد.', lpErrGeneric:'تعذّر الإتمام. هل الخادم (start_server.py) يعمل؟' },
        fa: { lpTitle:'فید تو، دنیای تو.', lpSub:'منابع مهم خود را —کانال‌ها، وب‌سایت‌ها، انجمن‌ها، RSS— گرد هم آور و روی نقشه زنده ببین. یک هوش مصنوعی همیشه در دسترس توست تا به هر سؤالی درباره موضوعات دلخواهت پاسخ دهد، از فید شخصی‌سازی‌شده‌ات.', lpF1T:'نقشه زنده', lpF1S:'هر خبر، با موقعیت جغرافیایی لحظه‌ای.', lpF2T:'دستیار هوش مصنوعی', lpF2S:'بپرس و درباره منابعت پاسخ بگیر.', lpF3T:'منابع تو', lpF3S:'منابع خود را اضافه کن؛ ما به هم وصلشان می‌کنیم.', lpF4T:'۱۳ زبان', lpF4S:'تمام رابط کاربری به زبان دلخواه تو.', lpLogin:'ورود', lpRegister:'ساخت حساب', lpName:'نام', lpNamePh:'نام تو', lpEmail:'ایمیل', lpEmailPh:'آدرس ایمیل', lpPwd:'رمز عبور', lpPwdPh:'حداقل ۶ نویسه', lpEnter:'ورود', lpCreate:'ساخت حساب', lpHaveAccountNo:'هنوز حساب نداری؟ <button type="button" class="auth-link" data-auth-tab="register">یکی بساز</button>', lpHaveAccountYes:'از قبل حساب داری؟ <button type="button" class="auth-link" data-auth-tab="login">وارد شو</button>', lpFoot:'داده‌های تو فقط روی سرور خودت می‌ماند.', lpErrEmptyFields:'ایمیل و رمز عبور را پر کن.', lpErrServer:'اتصال به سرور ممکن نشد. start_server.py را اجرا کن.', lpErrInvalidEmail:'یک ایمیل معتبر وارد کن.', lpErrWeakPwd:'رمز عبور باید حداقل ۶ نویسه باشد.', lpErrEmailTaken:'این ایمیل قبلاً ثبت شده. وارد شو.', lpErrBadCreds:'ایمیل یا رمز عبور نادرست است.', lpErrInvalidSession:'نشست منقضی شد، دوباره وارد شو.', lpErrGeneric:'تکمیل ممکن نشد. آیا سرور (start_server.py) اجرا است؟' },
        he: { lpTitle:'הפיד שלך, העולם שלך.', lpSub:'אסוף את המקורות שחשובים לך —ערוצים, אתרים, פורומים, RSS— וצפה בהם על המפה החיה. יש לך AI זמין כדי לענות על כל שאלה בנושאים האהובים עליך, הכול מהפיד האישי שלך.', lpF1T:'מפה חיה', lpF1S:'כל ידיעה, ממוקמת בזמן אמת.', lpF2T:'עוזר AI', lpF2S:'שאל וקבל תשובות על המקורות שלך.', lpF3T:'המקורות שלך', lpF3S:'הוסף את המקורות שלך; אנחנו נחבר אותם.', lpF4T:'13 שפות', lpF4S:'כל הממשק, בשפה שתבחר.', lpLogin:'התחבר', lpRegister:'צור חשבון', lpName:'שם', lpNamePh:'השם שלך', lpEmail:'אימייל', lpEmailPh:'כתובת אימייל', lpPwd:'סיסמה', lpPwdPh:'לפחות 6 תווים', lpEnter:'כניסה', lpCreate:'צור חשבון', lpHaveAccountNo:'אין לך חשבון? <button type="button" class="auth-link" data-auth-tab="register">צור אחד</button>', lpHaveAccountYes:'כבר יש לך חשבון? <button type="button" class="auth-link" data-auth-tab="login">התחבר</button>', lpFoot:'הנתונים שלך נשמרים רק בשרת שלך.', lpErrEmptyFields:'מלא אימייל וסיסמה.', lpErrServer:'לא ניתן ליצור קשר עם השרת. הפעל את start_server.py.', lpErrInvalidEmail:'הזן אימייל תקין.', lpErrWeakPwd:'הסיסמה חייבת להיות לפחות 6 תווים.', lpErrEmailTaken:'האימייל הזה כבר רשום. התחבר.', lpErrBadCreds:'אימייל או סיסמה שגויים.', lpErrInvalidSession:'הסשן פג, התחבר שוב.', lpErrGeneric:'לא הצליח. האם השרת (start_server.py) פועל?' },
        nl: { lpTitle:'Jouw feed, jouw wereld.', lpSub:'Verzamel de bronnen die voor jou belangrijk zijn —kanalen, websites, forums, RSS— en bekijk ze op de live kaart. Een AI staat klaar om al je vragen over je favoriete onderwerpen te beantwoorden, vanuit je eigen gepersonaliseerde feed.', lpF1T:'Live kaart', lpF1S:'Elk nieuws, in realtime gelokaliseerd.', lpF2T:'AI-assistent', lpF2S:'Stel vragen over je bronnen.', lpF3T:'Jouw bronnen', lpF3S:'Voeg je bronnen toe; wij koppelen ze.', lpF4T:'13 talen', lpF4S:'De hele interface in de taal van jouw keuze.', lpLogin:'Inloggen', lpRegister:'Account maken', lpName:'Naam', lpNamePh:'Je naam', lpEmail:'E-mail', lpEmailPh:'E-mailadres', lpPwd:'Wachtwoord', lpPwdPh:'Minimaal 6 tekens', lpEnter:'Inloggen', lpCreate:'Account maken', lpHaveAccountNo:'Nog geen account? <button type="button" class="auth-link" data-auth-tab="register">Maak er een</button>', lpHaveAccountYes:'Heb je al een account? <button type="button" class="auth-link" data-auth-tab="login">Log in</button>', lpFoot:'Je gegevens blijven alleen op je eigen server.', lpErrEmptyFields:'Vul e-mail en wachtwoord in.', lpErrServer:'Kan de server niet bereiken. Start start_server.py.', lpErrInvalidEmail:'Voer een geldig e-mailadres in.', lpErrWeakPwd:'Wachtwoord moet minstens 6 tekens hebben.', lpErrEmailTaken:'Dit e-mailadres is al geregistreerd. Log in.', lpErrBadCreds:'Verkeerd e-mailadres of wachtwoord.', lpErrInvalidSession:'Sessie verlopen, log opnieuw in.', lpErrGeneric:'Kon niet voltooien. Draait de server (start_server.py)?' },
        it: { lpTitle:'Il tuo feed, il tuo mondo.', lpSub:'Raccogli le fonti che ti interessano —canali, siti, forum, RSS— e osservale sulla mappa in tempo reale. Hai a disposizione un\'IA per rispondere a qualsiasi domanda sui tuoi temi preferiti, tutto dal tuo feed personalizzato.', lpF1T:'Mappa in diretta', lpF1S:'Ogni notizia, geolocalizzata in tempo reale.', lpF2T:'Assistente IA', lpF2S:'Chiedi e ottieni risposte sulle tue fonti.', lpF3T:'Le tue fonti', lpF3S:'Aggiungi le tue fonti; noi le colleghiamo.', lpF4T:'13 lingue', lpF4S:'Tutta l\'interfaccia nella lingua che scegli.', lpLogin:'Accedi', lpRegister:'Crea account', lpName:'Nome', lpNamePh:'Il tuo nome', lpEmail:'Email', lpEmailPh:'Indirizzo email', lpPwd:'Password', lpPwdPh:'Almeno 6 caratteri', lpEnter:'Entra', lpCreate:'Crea account', lpHaveAccountNo:'Non hai un account? <button type="button" class="auth-link" data-auth-tab="register">Creane uno</button>', lpHaveAccountYes:'Hai già un account? <button type="button" class="auth-link" data-auth-tab="login">Accedi</button>', lpFoot:'I tuoi dati restano solo sul tuo server.', lpErrEmptyFields:'Compila email e password.', lpErrServer:'Impossibile contattare il server. Avvia start_server.py.', lpErrInvalidEmail:'Inserisci un\'email valida.', lpErrWeakPwd:'La password deve avere almeno 6 caratteri.', lpErrEmailTaken:'Questa email è già registrata. Accedi.', lpErrBadCreds:'Email o password errati.', lpErrInvalidSession:'Sessione scaduta, accedi di nuovo.', lpErrGeneric:'Impossibile completare. Il server (start_server.py) è in esecuzione?' },
        pt: { lpTitle:'O teu feed, o teu mundo.', lpSub:'Reúne as fontes que te importam —canais, sites, fóruns, RSS— e observa-as no mapa em direto. Tens uma IA à disposição para responder a qualquer dúvida sobre os teus temas favoritos, tudo a partir do teu feed personalizado.', lpF1T:'Mapa em direto', lpF1S:'Cada notícia, geolocalizada em tempo real.', lpF2T:'Assistente IA', lpF2S:'Pergunta e obtém respostas sobre as tuas fontes.', lpF3T:'As tuas fontes', lpF3S:'Adiciona as tuas fontes; nós ligamo-las.', lpF4T:'13 idiomas', lpF4S:'Toda a interface no idioma que escolheres.', lpLogin:'Entrar', lpRegister:'Criar conta', lpName:'Nome', lpNamePh:'O teu nome', lpEmail:'Email', lpEmailPh:'Endereço de email', lpPwd:'Palavra-passe', lpPwdPh:'Mínimo 6 caracteres', lpEnter:'Entrar', lpCreate:'Criar conta', lpHaveAccountNo:'Ainda não tens conta? <button type="button" class="auth-link" data-auth-tab="register">Cria uma</button>', lpHaveAccountYes:'Já tens conta? <button type="button" class="auth-link" data-auth-tab="login">Entra</button>', lpFoot:'Os teus dados ficam apenas no teu próprio servidor.', lpErrEmptyFields:'Preenche email e palavra-passe.', lpErrServer:'Não foi possível contactar o servidor. Inicia o start_server.py.', lpErrInvalidEmail:'Introduz um email válido.', lpErrWeakPwd:'A palavra-passe deve ter pelo menos 6 caracteres.', lpErrEmailTaken:'Esse email já está registado. Entra.', lpErrBadCreds:'Email ou palavra-passe incorretos.', lpErrInvalidSession:'Sessão expirada, entra novamente.', lpErrGeneric:'Não foi possível concluir. O servidor (start_server.py) está em execução?' },
        hi: { lpTitle:'तुम्हारा फ़ीड, तुम्हारी दुनिया।', lpSub:'अपने पसंदीदा स्रोत —चैनल, वेबसाइट, फ़ोरम, RSS— एक जगह लाओ और उन्हें लाइव मानचित्र पर देखो। तुम्हारे पसंदीदा विषयों पर किसी भी सवाल का जवाब देने के लिए AI हमेशा हाज़िर है, सब कुछ तुम्हारे अपने व्यक्तिगत फ़ीड से।', lpF1T:'लाइव मानचित्र', lpF1S:'हर समाचार, वास्तविक समय में जियो-स्थित।', lpF2T:'AI सहायक', lpF2S:'अपने स्रोतों के बारे में पूछो और जवाब पाओ।', lpF3T:'तुम्हारे स्रोत', lpF3S:'अपने स्रोत जोड़ो; हम उन्हें जोड़ते हैं।', lpF4T:'13 भाषाएँ', lpF4S:'पूरा इंटरफ़ेस तुम्हारी चुनी भाषा में।', lpLogin:'लॉग इन', lpRegister:'खाता बनाओ', lpName:'नाम', lpNamePh:'तुम्हारा नाम', lpEmail:'ईमेल', lpEmailPh:'ईमेल पता', lpPwd:'पासवर्ड', lpPwdPh:'कम से कम 6 अक्षर', lpEnter:'प्रवेश', lpCreate:'खाता बनाओ', lpHaveAccountNo:'खाता नहीं है? <button type="button" class="auth-link" data-auth-tab="register">बनाओ</button>', lpHaveAccountYes:'पहले से खाता है? <button type="button" class="auth-link" data-auth-tab="login">लॉग इन</button>', lpFoot:'तुम्हारा डेटा केवल तुम्हारे अपने सर्वर पर रहता है।', lpErrEmptyFields:'ईमेल और पासवर्ड भरो।', lpErrServer:'सर्वर से संपर्क नहीं हो सका। start_server.py शुरू करो।', lpErrInvalidEmail:'मान्य ईमेल लिखो।', lpErrWeakPwd:'पासवर्ड कम से कम 6 अक्षर का होना चाहिए।', lpErrEmailTaken:'यह ईमेल पहले से पंजीकृत है। लॉग इन करो।', lpErrBadCreds:'ईमेल या पासवर्ड ग़लत है।', lpErrInvalidSession:'सत्र समाप्त, फिर से लॉग इन करो।', lpErrGeneric:'पूरा नहीं हो सका। क्या सर्वर (start_server.py) चल रहा है?' },
    };
    // Pricing-card strings, kept in their own block so the per-language one-liners
    // above don't grow unreadably long. Merged into LANDING_I18N below.
    const PRICING_I18N = {
        es: { prTitle:'Elige tu plan', prSub:'Empieza gratis. Pásate a Pro cuando lo necesites.', prBadge:'Popular', prPeriod:'/mes',
              prFreeName:'Free', prFreeTag:'Para empezar.', prFreeF1:'Hasta 5 fuentes personalizadas', prFreeF2:'Feed personalizado', prFreeF3:'Sin mapa en vivo', prFreeF4:'13 idiomas', prFreeF5:'Sin asistente IA', prFreeCta:'Empezar gratis',
              prProName:'Pro', prProTag:'Todo lo que necesitas.', prProF1:'Fuentes ilimitadas', prProF2:'Mapa en vivo', prProF3:'Asistente IA (10 consultas/día)', prProF4:'13 idiomas', prProF5:'Soporte prioritario', prProCta:'Empezar Pro',
              prTeamName:'Team', prTeamTag:'Para los más exigentes.', prTeamF1:'Todo lo de Pro', prTeamF2:'Asistente IA ilimitado', prTeamF3:'Fuentes ilimitadas', prTeamF4:'13 idiomas', prTeamF5:'Soporte prioritario', prTeamCta:'Empezar Team' },
        en: { prTitle:'Choose your plan', prSub:'Start free. Move up to Pro whenever you need more.', prBadge:'Popular', prPeriod:'/mo',
              prFreeName:'Free', prFreeTag:'To get started.', prFreeF1:'Up to 5 custom sources', prFreeF2:'Personalized feed', prFreeF3:'No live map', prFreeF4:'13 languages', prFreeF5:'No AI assistant', prFreeCta:'Start free',
              prProName:'Pro', prProTag:'Everything you need.', prProF1:'Unlimited sources', prProF2:'Live map', prProF3:'AI assistant (10 queries/day)', prProF4:'13 languages', prProF5:'Priority support', prProCta:'Get Pro',
              prTeamName:'Team', prTeamTag:'For power users.', prTeamF1:'Everything in Pro', prTeamF2:'Unlimited AI assistant', prTeamF3:'Unlimited sources', prTeamF4:'13 languages', prTeamF5:'Priority support', prTeamCta:'Get Team' },
        fr: { prTitle:'Choisis ton plan', prSub:'Commence gratuitement. Passe à Pro quand tu en as besoin.', prBadge:'Populaire', prPeriod:'/mois',
              prFreeName:'Free', prFreeTag:'Pour démarrer.', prFreeF1:'Jusqu\'à 5 sources personnalisées', prFreeF2:'Flux personnalisé', prFreeF3:'Carte en direct', prFreeF4:'13 langues', prFreeF5:'Pas d\'assistant IA', prFreeCta:'Commencer gratuitement',
              prProName:'Pro', prProTag:'Tout ce qu\'il te faut.', prProF1:'Sources illimitées', prProF2:'Carte en direct + toutes les couches', prProF3:'Assistant IA (10 requêtes/jour)', prProF4:'13 langues', prProF5:'Support prioritaire', prProCta:'Passer à Pro',
              prTeamName:'Team', prTeamTag:'Pour les utilisateurs avancés.', prTeamF1:'Tout ce qu\'il y a dans Pro', prTeamF2:'Assistant IA illimité', prTeamF3:'Sources illimitées', prTeamF4:'13 langues', prTeamF5:'Support prioritaire', prTeamCta:'Obtenir Team' },
        ru: { prTitle:'Выбери план', prSub:'Начни бесплатно. Перейди на Pro, когда понадобится.', prBadge:'Популярный', prPeriod:'/мес',
              prFreeName:'Free', prFreeTag:'Чтобы начать.', prFreeF1:'До 5 своих источников', prFreeF2:'Персональная лента', prFreeF3:'Живая карта', prFreeF4:'13 языков', prFreeF5:'Без ИИ-ассистента', prFreeCta:'Начать бесплатно',
              prProName:'Pro', prProTag:'Всё, что нужно.', prProF1:'Безлимитные источники', prProF2:'Живая карта + все слои', prProF3:'ИИ-ассистент (10 запросов/день)', prProF4:'13 языков', prProF5:'Приоритетная поддержка', prProCta:'Перейти на Pro',
              prTeamName:'Team', prTeamTag:'Для продвинутых пользователей.', prTeamF1:'Всё из Pro', prTeamF2:'Безлимитный ИИ-ассистент', prTeamF3:'Безлимитные источники', prTeamF4:'13 языков', prTeamF5:'Приоритетная поддержка', prTeamCta:'Получить Team' },
        zh: { prTitle:'选择你的方案', prSub:'免费开始。需要时升级到 Pro。', prBadge:'最受欢迎', prPeriod:'/月',
              prFreeName:'Free', prFreeTag:'入门使用。', prFreeF1:'最多 5 个自定义来源', prFreeF2:'个性化资讯流', prFreeF3:'实时地图', prFreeF4:'13 种语言', prFreeF5:'无 AI 助手', prFreeCta:'免费开始',
              prProName:'Pro', prProTag:'一应俱全。', prProF1:'无限来源', prProF2:'实时地图 + 所有图层', prProF3:'AI 助手（每日 10 次）', prProF4:'13 种语言', prProF5:'优先支持', prProCta:'升级 Pro',
              prTeamName:'Team', prTeamTag:'专业用户首选。', prTeamF1:'Pro 的全部功能', prTeamF2:'无限 AI 助手', prTeamF3:'无限来源', prTeamF4:'13 种语言', prTeamF5:'优先支持', prTeamCta:'获取 Team' },
        tr: { prTitle:'Planını seç', prSub:'Ücretsiz başla. İhtiyacın olduğunda Pro\'ya geç.', prBadge:'Popüler', prPeriod:'/ay',
              prFreeName:'Free', prFreeTag:'Başlamak için.', prFreeF1:'5\'e kadar özel kaynak', prFreeF2:'Kişiselleştirilmiş akış', prFreeF3:'Canlı harita', prFreeF4:'13 dil', prFreeF5:'YZ asistanı yok', prFreeCta:'Ücretsiz başla',
              prProName:'Pro', prProTag:'İhtiyacın olan her şey.', prProF1:'Sınırsız kaynak', prProF2:'Canlı harita + tüm katmanlar', prProF3:'YZ asistanı (günde 10 sorgu)', prProF4:'13 dil', prProF5:'Öncelikli destek', prProCta:'Pro\'ya geç',
              prTeamName:'Team', prTeamTag:'Güçlü kullanıcılar için.', prTeamF1:'Pro\'daki her şey', prTeamF2:'Sınırsız YZ asistanı', prTeamF3:'Sınırsız kaynak', prTeamF4:'13 dil', prTeamF5:'Öncelikli destek', prTeamCta:'Team\'e geç' },
        ar: { prTitle:'اختر خطتك', prSub:'ابدأ مجانًا. انتقل إلى Pro عندما تحتاج إلى المزيد.', prBadge:'الأكثر شيوعًا', prPeriod:'/شهر',
              prFreeName:'Free', prFreeTag:'للبدء.', prFreeF1:'حتى 5 مصادر مخصصة', prFreeF2:'موجز مخصص', prFreeF3:'خريطة حيّة', prFreeF4:'13 لغة', prFreeF5:'بدون مساعد ذكي', prFreeCta:'ابدأ مجانًا',
              prProName:'Pro', prProTag:'كل ما تحتاجه.', prProF1:'مصادر غير محدودة', prProF2:'خريطة حيّة + كل الطبقات', prProF3:'مساعد ذكي (10 استفسارًا/يوم)', prProF4:'13 لغة', prProF5:'دعم ذو أولوية', prProCta:'الترقية إلى Pro',
              prTeamName:'Team', prTeamTag:'للمستخدمين المتقدمين.', prTeamF1:'كل ما في Pro', prTeamF2:'مساعد ذكي غير محدود', prTeamF3:'مصادر غير محدودة', prTeamF4:'13 لغة', prTeamF5:'دعم ذو أولوية', prTeamCta:'الحصول على Team' },
        fa: { prTitle:'پلن خود را انتخاب کن', prSub:'رایگان شروع کن. هر وقت نیاز داشتی به Pro ارتقا بده.', prBadge:'محبوب', prPeriod:'/ماه',
              prFreeName:'Free', prFreeTag:'برای شروع.', prFreeF1:'تا ۵ منبع شخصی', prFreeF2:'فید شخصی‌سازی‌شده', prFreeF3:'نقشه زنده', prFreeF4:'۱۳ زبان', prFreeF5:'بدون دستیار هوش مصنوعی', prFreeCta:'شروع رایگان',
              prProName:'Pro', prProTag:'هر چه نیاز داری.', prProF1:'منابع نامحدود', prProF2:'نقشه زنده + همه لایه‌ها', prProF3:'دستیار AI (۱۰ پرسش/روز)', prProF4:'۱۳ زبان', prProF5:'پشتیبانی اولویت‌دار', prProCta:'دریافت Pro',
              prTeamName:'Team', prTeamTag:'برای کاربران حرفه‌ای.', prTeamF1:'همه چیز Pro', prTeamF2:'دستیار AI نامحدود', prTeamF3:'منابع نامحدود', prTeamF4:'۱۳ زبان', prTeamF5:'پشتیبانی اولویت‌دار', prTeamCta:'دریافت Team' },
        he: { prTitle:'בחר את התוכנית שלך', prSub:'התחל בחינם. עבור ל-Pro כשתצטרך יותר.', prBadge:'הכי פופולרי', prPeriod:'/חודש',
              prFreeName:'Free', prFreeTag:'להתחלה.', prFreeF1:'עד 5 מקורות מותאמים', prFreeF2:'פיד אישי', prFreeF3:'מפה חיה', prFreeF4:'13 שפות', prFreeF5:'ללא עוזר AI', prFreeCta:'התחל בחינם',
              prProName:'Pro', prProTag:'כל מה שאתה צריך.', prProF1:'מקורות בלתי מוגבלים', prProF2:'מפה חיה + כל השכבות', prProF3:'עוזר AI (10 שאילתות/יום)', prProF4:'13 שפות', prProF5:'תמיכה בעדיפות', prProCta:'קבל Pro',
              prTeamName:'Team', prTeamTag:'למשתמשים מתקדמים.', prTeamF1:'כל מה שיש ב-Pro', prTeamF2:'עוזר AI ללא הגבלה', prTeamF3:'מקורות ללא הגבלה', prTeamF4:'13 שפות', prTeamF5:'תמיכה בעדיפות', prTeamCta:'קבל Team' },
        nl: { prTitle:'Kies je plan', prSub:'Begin gratis. Stap over op Pro wanneer je wilt.', prBadge:'Populair', prPeriod:'/mnd',
              prFreeName:'Free', prFreeTag:'Om te beginnen.', prFreeF1:'Tot 5 eigen bronnen', prFreeF2:'Persoonlijke feed', prFreeF3:'Live kaart', prFreeF4:'13 talen', prFreeF5:'Geen AI-assistent', prFreeCta:'Gratis beginnen',
              prProName:'Pro', prProTag:'Alles wat je nodig hebt.', prProF1:'Onbeperkte bronnen', prProF2:'Live kaart + alle lagen', prProF3:'AI-assistent (10 vragen/dag)', prProF4:'13 talen', prProF5:'Prioritaire ondersteuning', prProCta:'Pro nemen',
              prTeamName:'Team', prTeamTag:'Voor gevorderde gebruikers.', prTeamF1:'Alles van Pro', prTeamF2:'Onbeperkte AI-assistent', prTeamF3:'Onbeperkte bronnen', prTeamF4:'13 talen', prTeamF5:'Prioritaire ondersteuning', prTeamCta:'Team nemen' },
        it: { prTitle:'Scegli il tuo piano', prSub:'Inizia gratis. Passa a Pro quando ti serve.', prBadge:'Popolare', prPeriod:'/mese',
              prFreeName:'Free', prFreeTag:'Per iniziare.', prFreeF1:'Fino a 5 fonti personalizzate', prFreeF2:'Feed personalizzato', prFreeF3:'Mappa in diretta', prFreeF4:'13 lingue', prFreeF5:'Nessun assistente IA', prFreeCta:'Inizia gratis',
              prProName:'Pro', prProTag:'Tutto ciò che ti serve.', prProF1:'Fonti illimitate', prProF2:'Mappa in diretta + tutti i livelli', prProF3:'Assistente IA (10 query/giorno)', prProF4:'13 lingue', prProF5:'Supporto prioritario', prProCta:'Passa a Pro',
              prTeamName:'Team', prTeamTag:'Per gli utenti avanzati.', prTeamF1:'Tutto di Pro', prTeamF2:'Assistente IA illimitato', prTeamF3:'Fonti illimitate', prTeamF4:'13 lingue', prTeamF5:'Supporto prioritario', prTeamCta:'Ottieni Team' },
        pt: { prTitle:'Escolhe o teu plano', prSub:'Começa grátis. Passa a Pro quando precisares.', prBadge:'Popular', prPeriod:'/mês',
              prFreeName:'Free', prFreeTag:'Para começar.', prFreeF1:'Até 5 fontes personalizadas', prFreeF2:'Feed personalizado', prFreeF3:'Mapa em direto', prFreeF4:'13 idiomas', prFreeF5:'Sem assistente IA', prFreeCta:'Começar grátis',
              prProName:'Pro', prProTag:'Tudo o que precisas.', prProF1:'Fontes ilimitadas', prProF2:'Mapa em direto + todas as camadas', prProF3:'Assistente IA (10 consultas/dia)', prProF4:'13 idiomas', prProF5:'Suporte prioritário', prProCta:'Obter Pro',
              prTeamName:'Team', prTeamTag:'Para utilizadores avançados.', prTeamF1:'Tudo do Pro', prTeamF2:'Assistente IA ilimitado', prTeamF3:'Fontes ilimitadas', prTeamF4:'13 idiomas', prTeamF5:'Suporte prioritário', prTeamCta:'Obter Team' },
        hi: { prTitle:'अपना प्लान चुनें', prSub:'मुफ़्त शुरू करें। ज़रूरत पड़ने पर Pro में जाएँ।', prBadge:'लोकप्रिय', prPeriod:'/माह',
              prFreeName:'Free', prFreeTag:'शुरुआत के लिए।', prFreeF1:'5 तक कस्टम स्रोत', prFreeF2:'व्यक्तिगत फ़ीड', prFreeF3:'लाइव मानचित्र', prFreeF4:'13 भाषाएँ', prFreeF5:'कोई AI सहायक नहीं', prFreeCta:'मुफ़्त शुरू करें',
              prProName:'Pro', prProTag:'जो भी चाहिए, सब कुछ।', prProF1:'असीमित स्रोत', prProF2:'लाइव मानचित्र + सभी लेयर्स', prProF3:'AI सहायक (10 क्वेरी/दिन)', prProF4:'13 भाषाएँ', prProF5:'प्राथमिक सहायता', prProCta:'Pro लें',
              prTeamName:'Team', prTeamTag:'पावर यूज़र्स के लिए।', prTeamF1:'Pro की सभी सुविधाएँ', prTeamF2:'असीमित AI सहायक', prTeamF3:'असीमित स्रोत', prTeamF4:'13 भाषाएँ', prTeamF5:'प्राथमिक सहायता', prTeamCta:'Team लें' },
    };
    // Label shown on the CTA of the user's CURRENT plan (non-actionable — see
    // auth._refreshPricingCtas / _wirePricing).
    const _PR_INUSE = { es:'Plan en uso', en:'Current plan', fr:'Plan actuel', ru:'Текущий план',
        zh:'当前方案', tr:'Mevcut plan', ar:'الخطة الحالية', fa:'پلن فعلی', he:'התוכנית הנוכחית',
        nl:'Huidig plan', it:'Piano attuale', pt:'Plano atual', hi:'मौजूदा प्लान' };
    for (const _l in PRICING_I18N) { PRICING_I18N[_l].prInUse = _PR_INUSE[_l] || _PR_INUSE.en; }
    for (const _lng in PRICING_I18N) {
        LANDING_I18N[_lng] = Object.assign(LANDING_I18N[_lng] || {}, PRICING_I18N[_lng]);
    }
    // Showcase strings for the 11 languages that lacked them (es/en carry them
    // inline in LANDING_I18N above). Without this the whole #landing-showcase
    // section fell back to English in zh/ar/ru/etc.
    const _SC_I18N = {
        fr: { scTitle:'Ton monde, dans un seul flux', scSub:'Rassemble tes sources préférées, place-les sur la carte et laisse l\'IA t\'aider.', sc1T:'Un flux personnalisé', sc1B:'Les chaînes, sites, forums et RSS qui comptent pour toi, réunis dans un seul flux que tu peux lire sans limite.', sc2T:'Géolocalisé sur la carte', sc2B:'Vois où tout se passe, en direct et avec précision. Des icônes par événement te disent quoi et où, instantanément.', sc3T:'Une IA à tes côtés', sc3B:'Elle synthétise l\'actu, t\'explique ce que tu n\'as pas saisi et choisit même les meilleures sources pour tes sujets.', scCases:'Géopolitique en temps réel, transferts du football international partout dans le monde, marchés, ton sport ou ton hobby… tu choisis les sujets, Skorpene les met sur la carte.' },
        ru: { scTitle:'Твой мир в одной ленте', scSub:'Собери любимые источники, размести их на карте и доверь помощь ИИ.', sc1T:'Персональная лента', sc1B:'Каналы, сайты, форумы и RSS, которые тебе важны, собраны в одну ленту, которую можно читать без ограничений.', sc2T:'Геолокация на карте', sc2B:'Смотри, где что происходит, в реальном времени и точно. Значки событий мгновенно показывают, что и где.', sc3T:'ИИ на твоей стороне', sc3B:'Он обобщает новости, объясняет непонятное и даже подбирает лучшие источники по твоим темам.', scCases:'Геополитика в реальном времени, международные футбольные трансферы по всему миру, рынки, твой спорт или хобби… ты выбираешь темы, Skorpene наносит их на карту.' },
        zh: { scTitle:'你的世界，汇于一条资讯流', scSub:'聚合你喜爱的来源，放上地图，让 AI 来帮忙。', sc1T:'个性化资讯流', sc1B:'你在意的频道、网站、论坛和 RSS，汇集成一条可无限阅读的资讯流。', sc2T:'在地图上定位', sc2B:'实时、精准地看到每件事发生的地点。逐事件图标让你立刻知道发生了什么、在哪里。', sc3T:'AI 站在你这边', sc3B:'它汇总新闻、解释你没看懂的内容，甚至为你的话题挑选最佳来源。', scCases:'实时地缘政治、全球国际足球转会、市场行情、你的运动或爱好……你来选主题，Skorpene 把它们放上地图。' },
        tr: { scTitle:'Dünyan tek bir akışta', scSub:'Favori kaynaklarını topla, haritaya yerleştir ve YZ\'nin yardım etmesine izin ver.', sc1T:'Kişiselleştirilmiş akış', sc1B:'Önemsediğin kanallar, siteler, forumlar ve RSS, sınırsız okuyabileceğin tek bir akışta toplanır.', sc2T:'Haritada konumlanmış', sc2B:'Her şeyin nerede olduğunu canlı ve tam olarak gör. Olay başına simgeler ne olduğunu ve nerede olduğunu anında söyler.', sc3T:'Yanında bir YZ', sc3B:'Haberleri özetler, anlamadığını açıklar ve hatta konuların için en iyi kaynakları seçer.', scCases:'Gerçek zamanlı jeopolitik, dünya çapında uluslararası futbol transferleri, piyasalar, sporun ya da hobin… konuları sen seç, Skorpene haritaya koysun.' },
        ar: { scTitle:'عالمك في موجز واحد', scSub:'اجمع مصادرك المفضّلة، ضعها على الخريطة، ودع الذكاء الاصطناعي يساعدك.', sc1T:'موجز مخصّص', sc1B:'القنوات والمواقع والمنتديات وخلاصات RSS التي تهمّك، مجمّعة في موجز واحد تقرأه بلا حدود.', sc2T:'محدَّد جغرافيًا على الخريطة', sc2B:'شاهد أين يحدث كل شيء، حيًّا وبدقة. أيقونات لكل حدث تخبرك بما يجري وأين، في الحال.', sc3T:'ذكاء اصطناعي إلى جانبك', sc3B:'يلخّص الأخبار، ويشرح ما لم تفهمه، بل ويختار لك أفضل المصادر لمواضيعك.', scCases:'جغرافيا سياسية لحظية، انتقالات كرة القدم الدولية حول العالم، أسواق، رياضتك أو هوايتك… أنت تختار المواضيع، وSkorpene يضعها على الخريطة.' },
        fa: { scTitle:'دنیای تو در یک فید', scSub:'منابع محبوبت را جمع کن، روی نقشه بگذار و بگذار هوش مصنوعی کمکت کند.', sc1T:'فید شخصی‌سازی‌شده', sc1B:'کانال‌ها، سایت‌ها، انجمن‌ها و RSSهایی که برایت مهم‌اند، در یک فید گرد می‌آیند که بی‌حد می‌خوانی.', sc2T:'مکان‌یابی‌شده روی نقشه', sc2B:'ببین هر چیزی کجا رخ می‌دهد، زنده و دقیق. آیکون هر رویداد فوراً می‌گوید چه خبر است و کجا.', sc3T:'یک هوش مصنوعی در کنار تو', sc3B:'خبرها را خلاصه می‌کند، آنچه نفهمیدی را توضیح می‌دهد و حتی بهترین منابع را برای موضوعاتت برمی‌گزیند.', scCases:'ژئوپلیتیک لحظه‌ای، نقل‌وانتقالات فوتبال بین‌المللی در سراسر جهان، بازارها، ورزش یا سرگرمی‌ات… تو موضوع‌ها را انتخاب کن، Skorpene آن‌ها را روی نقشه می‌گذارد.' },
        he: { scTitle:'העולם שלך, בפיד אחד', scSub:'אסוף את המקורות האהובים עליך, מקם אותם על המפה ותן ל-AI לעזור.', sc1T:'פיד מותאם אישית', sc1B:'הערוצים, האתרים, הפורומים וה-RSS שחשובים לך, מרוכזים בפיד אחד שאפשר לקרוא בלי הגבלה.', sc2T:'ממוקם על המפה', sc2B:'ראה היכן כל דבר קורה, בשידור חי ובדיוק. אייקון לכל אירוע אומר לך מה קורה ואיפה, מיד.', sc3T:'AI לצידך', sc3B:'הוא מסכם חדשות, מסביר את מה שלא הבנת, ואפילו בוחר את המקורות הטובים ביותר לנושאים שלך.', scCases:'גאופוליטיקה בזמן אמת, העברות כדורגל בינלאומיות מכל העולם, שווקים, הספורט או התחביב שלך… אתה בוחר את הנושאים, ו-Skorpene שם אותם על המפה.' },
        nl: { scTitle:'Jouw wereld, in één feed', scSub:'Verzamel je favoriete bronnen, plaats ze op de kaart en laat AI helpen.', sc1T:'Een gepersonaliseerde feed', sc1B:'De kanalen, sites, forums en RSS die er voor jou toe doen, gebundeld in één feed die je zonder limiet kunt lezen.', sc2T:'Gelokaliseerd op de kaart', sc2B:'Zie waar alles gebeurt, live en nauwkeurig. Iconen per gebeurtenis vertellen je meteen wat er aan de hand is en waar.', sc3T:'Een AI aan jouw kant', sc3B:'Het vat nieuws samen, legt uit wat je niet begreep en kiest zelfs de beste bronnen voor jouw onderwerpen.', scCases:'Realtime geopolitiek, internationale voetbaltransfers over de hele wereld, markten, jouw sport of hobby… jij kiest de onderwerpen, Skorpene zet ze op de kaart.' },
        it: { scTitle:'Il tuo mondo, in un unico feed', scSub:'Raccogli le tue fonti preferite, posizionale sulla mappa e lascia che l\'IA ti aiuti.', sc1T:'Un feed personalizzato', sc1B:'I canali, i siti, i forum e gli RSS che ti interessano, riuniti in un unico feed che puoi leggere senza limiti.', sc2T:'Geolocalizzato sulla mappa', sc2B:'Guarda dove succede tutto, in diretta e con precisione. Le icone per evento ti dicono cosa accade e dove, all\'istante.', sc3T:'Un\'IA dalla tua parte', sc3B:'Sintetizza le notizie, ti spiega ciò che non hai capito e sceglie persino le migliori fonti per i tuoi temi.', scCases:'Geopolitica in tempo reale, trasferimenti del calcio internazionale in tutto il mondo, mercati, il tuo sport o hobby… scegli tu i temi, Skorpene li mette sulla mappa.' },
        pt: { scTitle:'O teu mundo, num só feed', scSub:'Reúne as tuas fontes favoritas, coloca-as no mapa e deixa a IA ajudar.', sc1T:'Um feed personalizado', sc1B:'Os canais, sites, fóruns e RSS que te importam, reunidos num só feed que podes ler sem limites.', sc2T:'Geolocalizado no mapa', sc2B:'Vê onde tudo acontece, em direto e com precisão. Ícones por evento dizem-te o que se passa e onde, num instante.', sc3T:'Uma IA do teu lado', sc3B:'Sintetiza notícias, explica o que não percebeste e até escolhe as melhores fontes para os teus temas.', scCases:'Geopolítica em tempo real, transferências do futebol internacional por todo o mundo, mercados, o teu desporto ou passatempo… escolhes os temas, o Skorpene põe-nos no mapa.' },
        hi: { scTitle:'तुम्हारी दुनिया, एक ही फ़ीड में', scSub:'अपने पसंदीदा स्रोत इकट्ठा करो, उन्हें मानचित्र पर रखो और AI को मदद करने दो।', sc1T:'एक व्यक्तिगत फ़ीड', sc1B:'तुम्हारे पसंदीदा चैनल, साइट, फ़ोरम और RSS, एक ही फ़ीड में इकट्ठा जिसे तुम बिना सीमा पढ़ सको।', sc2T:'मानचित्र पर जियो-स्थित', sc2B:'देखो हर चीज़ कहाँ हो रही है, लाइव और सटीक। हर घटना के आइकन तुरंत बताते हैं कि क्या और कहाँ हो रहा है।', sc3T:'तुम्हारे साथ एक AI', sc3B:'यह समाचार का सार देता है, जो तुम्हें समझ न आया उसे समझाता है, और तुम्हारे विषयों के लिए सबसे अच्छे स्रोत भी चुनता है।', scCases:'रियल-टाइम भू-राजनीति, दुनिया भर के अंतरराष्ट्रीय फ़ुटबॉल ट्रांसफ़र, बाज़ार, तुम्हारा खेल या शौक… तुम विषय चुनो, Skorpene उन्हें मानचित्र पर रखता है।' },
    };
    for (const _l in _SC_I18N) { LANDING_I18N[_l] = Object.assign(LANDING_I18N[_l] || {}, _SC_I18N[_l]); }
    // Rewrite the closing scCases line across every locale to drop the old
    // "geopolitics" framing per the product's current positioning.
    const _CASES_I18N = {
        es:{ scCases:'Un mapa en tiempo real con un feed personalizado de los temas que más te gustan — deportes, mercados, tecnología, tus hobbies o cualquier combinación — con asistencia de IA.' },
        en:{ scCases:'A real-time map with a personalized feed of the topics you love — sports, markets, tech, your hobbies, or any combination of them — with AI assistance.' },
        fr:{ scCases:'Une carte en temps réel avec un flux personnalisé des sujets qui te plaisent — sports, marchés, tech, tes hobbies ou toute combinaison — avec l\'aide de l\'IA.' },
        ru:{ scCases:'Карта в реальном времени с персональной лентой любимых тем — спорт, рынки, техно, твои хобби или любое сочетание — с помощью ИИ.' },
        zh:{ scCases:'实时地图 + 你喜欢的主题的个性化资讯流 — 体育、市场、科技、你的爱好或任意组合 — 配有 AI 助手。' },
        tr:{ scCases:'Sevdiğin konuların gerçek zamanlı haritası ve kişiselleştirilmiş akışı — spor, piyasalar, teknoloji, hobilerin ya da herhangi bir bileşim — yapay zekâ desteğiyle.' },
        ar:{ scCases:'خريطة حية مع موجز مخصص للمواضيع التي تحبها — رياضة، أسواق، تقنية، هواياتك أو أي مزيج — مع مساعدة الذكاء الاصطناعي.' },
        fa:{ scCases:'یک نقشه در لحظه با فید شخصی‌سازی‌شده از موضوعاتی که دوست داری — ورزش، بازارها، فناوری، سرگرمی‌ها یا هر ترکیب — همراه با کمک هوش مصنوعی.' },
        he:{ scCases:'מפה בזמן אמת עם פיד מותאם אישית של הנושאים שאתה אוהב — ספורט, שווקים, טכנולוגיה, תחביבים או כל שילוב — עם עזרה של בינה מלאכותית.' },
        nl:{ scCases:'Een realtime kaart met een persoonlijke feed van de onderwerpen die je leuk vindt — sport, markten, tech, je hobby\'s of elke combinatie — met AI-assistentie.' },
        it:{ scCases:'Una mappa in tempo reale con un feed personalizzato degli argomenti che ami — sport, mercati, tech, i tuoi hobby o qualsiasi combinazione — con l\'aiuto dell\'IA.' },
        pt:{ scCases:'Um mapa em tempo real com um feed personalizado dos temas que gostas — desporto, mercados, tech, os teus hobbies ou qualquer combinação — com assistência de IA.' },
        hi:{ scCases:'तुम्हारे पसंदीदा विषयों की रीयल-टाइम मैप और पर्सनल फ़ीड — खेल, बाज़ार, टेक, तुम्हारे शौक या कोई भी संयोजन — AI सहायता के साथ।' },
    };
    for (const _l in _CASES_I18N) { LANDING_I18N[_l] = Object.assign(LANDING_I18N[_l] || {}, _CASES_I18N[_l]); }
    // Flags + native names for the picker. Mirrors ONB_LANGS but adds flag emoji
    // so the landing dropdown can show 🇪🇸 Español etc. compactly.
    const LANDING_LANGS = [
        { id:'es', flag:'🇪🇸', name:'Español' },   { id:'en', flag:'🇬🇧', name:'English' },
        { id:'fr', flag:'🇫🇷', name:'Français' },  { id:'ru', flag:'🇷🇺', name:'Русский' },
        { id:'zh', flag:'🇨🇳', name:'中文' },       { id:'tr', flag:'🇹🇷', name:'Türkçe' },
        { id:'ar', flag:'🇸🇦', name:'العربية' },   { id:'fa', flag:'🇮🇷', name:'فارسی' },
        { id:'he', flag:'🇮🇱', name:'עברית' },     { id:'nl', flag:'🇳🇱', name:'Nederlands' },
        { id:'it', flag:'🇮🇹', name:'Italiano' },  { id:'pt', flag:'🇵🇹', name:'Português' },
        { id:'hi', flag:'🇮🇳', name:'हिन्दी' },
    ];
    const landingI18n = {
        // Per-key fallback: chosen → English → Spanish, like applyLang.
        get(lng, key) {
            const t = LANDING_I18N[lng] || {};
            return t[key] || (LANDING_I18N.en && LANDING_I18N.en[key]) || (LANDING_I18N.es && LANDING_I18N.es[key]) || '';
        },
        apply(lng) {
            // Keep the main app's `data-i18n` strings in sync with the landing's
            // `data-i18n-landing` strings. Without this, a non-English language
            // resolved at boot (or picked from the landing) left every app string
            // in English until a reload. currentLang is already set by the caller.
            try { currentLang = lng; applyLang(); } catch (_) {}
            const root = document.getElementById('landing-overlay');
            if (!root) return;
            root.querySelectorAll('[data-i18n-landing]').forEach(el => {
                const v = this.get(lng, el.getAttribute('data-i18n-landing'));
                if (v) el.textContent = v;
            });
            // innerHTML variant (for the auth-switch lines that embed a button).
            root.querySelectorAll('[data-i18n-landing-html]').forEach(el => {
                const v = this.get(lng, el.getAttribute('data-i18n-landing-html'));
                if (v) el.innerHTML = v;
            });
            root.querySelectorAll('[data-i18n-landing-ph]').forEach(el => {
                const v = this.get(lng, el.getAttribute('data-i18n-landing-ph'));
                if (v) el.placeholder = v;
            });
            // RTL + html lang for the document while the landing is up.
            document.documentElement.lang = lng;
            document.body.dir = (lng === 'ar' || lng === 'fa' || lng === 'he') ? 'rtl' : 'ltr';
            // Re-wire the auth-switch buttons because innerHTML replaced them.
            try { auth._rewireAuthLinks && auth._rewireAuthLinks(); } catch (_) {}
            // Reflect the chosen lang on the picker chip.
            const meta = LANDING_LANGS.find(l => l.id === lng) || LANDING_LANGS[0];
            const fEl = document.getElementById('landing-lang-flag');
            const nEl = document.getElementById('landing-lang-name');
            if (fEl) fEl.textContent = meta.flag;
            if (nEl) nEl.textContent = meta.name;
            // Update submit button label too (mode-dependent).
            try { auth._setMode(auth.mode); } catch (_) {}
        },
        // Resolve the initial language: saved profile > a previously-picked
        // landing lang > English (the default). We intentionally do NOT use the
        // browser language so the default is always English; the user can pick
        // any of the 13 languages from the picker and their choice is saved.
        resolve() {
            try {
                const p = JSON.parse(localStorage.getItem('geoscope_profile') || 'null');
                if (p && p.lang && LANDING_I18N[p.lang]) return p.lang;
            } catch (_) {}
            try {
                const saved = localStorage.getItem('geoscope_landing_lang');
                if (saved && LANDING_I18N[saved]) return saved;
            } catch (_) {}
            return 'en';
        },
        save(lng) {
            try { localStorage.setItem('geoscope_landing_lang', lng); } catch (_) {}
        },
        wire() {
            const btn = document.getElementById('landing-lang-btn');
            const menu = document.getElementById('landing-lang-menu');
            if (!btn || !menu) return;
            // Build the menu once.
            menu.innerHTML = LANDING_LANGS.map(l =>
                `<li role="option" data-lang="${l.id}"><span class="ll-flag">${l.flag}</span><span>${l.name}</span></li>`
            ).join('');
            const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
            const open  = () => { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (menu.hidden) open(); else close();
            });
            menu.addEventListener('click', (e) => {
                const li = e.target.closest('li[data-lang]');
                if (!li) return;
                const lng = li.getAttribute('data-lang');
                // Route through the unified switch so the WHOLE app (not just the
                // landing strings) re-localizes instantly.
                try { setLanguage(lng); } catch (_) { this.apply(lng); }
                // Update the menu's selected state.
                menu.querySelectorAll('li').forEach(x => x.classList.toggle('sel', x.getAttribute('data-lang') === lng));
                close();
            });
            document.addEventListener('click', (e) => {
                if (!menu.hidden && !menu.contains(e.target) && e.target !== btn) close();
            });
        },
        init() {
            this.wire();
            const lng = this.resolve();
            currentLang = lng;
            try { langDropdown && langDropdown.setValue && langDropdown.setValue(lng); } catch (_) {}
            // Mark the initial option as selected.
            const menu = document.getElementById('landing-lang-menu');
            if (menu) menu.querySelectorAll('li').forEach(x => x.classList.toggle('sel', x.getAttribute('data-lang') === lng));
            this.apply(lng);
        },
    };
    // Expose so auth._msgFor + label re-applies can read the table.
    window.__landingI18n = landingI18n;

    // ── Landing showcase carousel ──
    // Wire every [data-carousel] block on the landing: prev/next buttons drive a
    // scroll-snapping track; the scroll position (drag, wheel, keyboard) drives
    // the dots + button-disabled state back. Idempotent — safe to call again.
    function _wireLandingCarousels() {
        document.querySelectorAll('[data-carousel]').forEach(root => {
            if (root._wired) return;
            const track = root.querySelector('[data-carousel-track]');
            const prev = root.querySelector('[data-carousel-prev]');
            const next = root.querySelector('[data-carousel-next]');
            const dots = root.querySelector('[data-carousel-dots]');
            if (!track) return;
            const slides = track.children.length;
            if (!slides) return;
            root._wired = true;

            // Build dots.
            if (dots) {
                dots.innerHTML = '';
                for (let i = 0; i < slides; i++) {
                    const b = document.createElement('button');
                    b.type = 'button';
                    b.setAttribute('aria-label', 'Slide ' + (i + 1));
                    b.addEventListener('click', () => goTo(i));
                    dots.appendChild(b);
                }
            }

            const currentIndex = () => {
                const w = track.clientWidth || 1;
                return Math.round(track.scrollLeft / w);
            };
            const sync = () => {
                const i = currentIndex();
                if (dots) [...dots.children].forEach((d, k) => d.classList.toggle('is-active', k === i));
                if (prev) prev.disabled = (i <= 0);
                if (next) next.disabled = (i >= slides - 1);
            };
            const goTo = (i) => {
                const clamped = Math.max(0, Math.min(slides - 1, i));
                track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
            };

            if (prev) prev.addEventListener('click', () => goTo(currentIndex() - 1));
            if (next) next.addEventListener('click', () => goTo(currentIndex() + 1));
            track.addEventListener('scroll', () => {
                if (track._raf) return;
                track._raf = requestAnimationFrame(() => { track._raf = null; sync(); });
            });
            window.addEventListener('resize', sync);
            sync();
        });
    }

    // ── Landing logo: drop the PNG's black background ──
    // The brand logo.png is purple on an OPAQUE black background (not a
    // transparent PNG), which shows as an ugly dark box on the landing. Rather
    // than rely only on mix-blend-mode, we chroma-key it: draw the image to a
    // canvas, turn near-black pixels transparent (with a soft edge so the
    // antialiased outline stays smooth), and swap in the cleaned PNG. Same
    // origin, so the canvas isn't tainted. Falls back to the CSS screen blend
    // if anything throws.
    function _processLandingLogo() {
        const img = document.querySelector('.landing-logo-img');
        if (!img) return;
        const run = () => {
            try {
                if (!img.naturalWidth) return;
                const c = document.createElement('canvas');
                c.width = img.naturalWidth; c.height = img.naturalHeight;
                const ctx = c.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const d = ctx.getImageData(0, 0, c.width, c.height);
                const a = d.data;
                for (let i = 0; i < a.length; i += 4) {
                    const max = Math.max(a[i], a[i + 1], a[i + 2]);
                    if (max < 38) a[i + 3] = 0;                       // near-black → transparent
                    else if (max < 96) a[i + 3] = Math.round(a[i + 3] * (max - 38) / 58); // soft edge
                }
                ctx.putImageData(d, 0, 0);
                img.style.mixBlendMode = 'normal';   // no longer needed once keyed
                img.src = c.toDataURL('image/png');
            } catch (_) { /* keep the CSS screen-blend fallback */ }
        };
        if (img.complete && img.naturalWidth) run();
        else img.addEventListener('load', run, { once: true });
    }

    function boot() {
        setupUI();
        initMap();
        applyLang();
        mediaViewer.init();
        aiAssistant.init();      // Claude-powered assistant (chat over site data)
        favBox.init();           // "Caja de temas favoritos" tab (chat over user sources)
        iconCurator.init();      // Phase 2: load cached AI emoji choices
        outletMap.init();        // Phase 3: load cached AI geolocation for outlets
        geoFeed.init();          // Phase 4: user sources + outlets plotted on the map
        wireNewsSourceTabs();    // Phase 3: Telegram ↔ Outlets selector
        wireUserSources();       // Phase 4: add/remove custom Telegram/RSS sources
        _wireNewsDelegation();   // Show More, video lightbox, news→map focus
        initSearch();
        // NOTE: the legacy backend pipeline (news.json + WebSocket) is the old
        // Telegram/geopolitics feed (GrassyGep, BBC, …). It is intentionally NOT
        // started — this is a general news app driven SOLELY by the user's own
        // sources via geoFeed. Starting it leaked default geopolitics items onto
        // the map the moment the user added any source.

        // Auth gate: show the landing page until login/registration. On success it
        // runs onboarding.init() (which shows the wizard only if no saved profile).
        auth.init();

        // Phase 4: plot user sources + important outlet stories on the map
        // (mixed with Telegram events). Refresh every 5 min; prune 24h-old icons.
        setTimeout(() => geoFeed.refresh(), 2500);
        setInterval(() => geoFeed.refresh(), 5 * 60 * 1000);
        setInterval(() => geoFeed.prune(), 5 * 60 * 1000);

        // (Backend news.json polling removed — see note above. Only geoFeed
        // drives the feed/map now.)

        // 24h auto-expiry: cull any events older than the TTL on load and
        // every 5 minutes thereafter so the map never accumulates stale data.
        pruneExpiredEvents();
        setInterval(pruneExpiredEvents, 5 * 60 * 1000);

        // Collapse/expand the whole Live News panel. Collapsing hides EVERYTHING
        // below the header (tabs, news body, AND the sources panel) so only the
        // "Live News" header bar remains — works on every tab. We toggle a class
        // on the panel itself; CSS hides the inner sections.
        document.getElementById('news-toggle').addEventListener('click', () => {
            const panel = document.getElementById('news-panel');
            const btn = document.getElementById('news-toggle');
            const collap = panel.querySelector('.news-collapsible');
            const willCollapse = !panel.classList.contains('collapsed');
            btn.textContent = willCollapse ? '╋' : '━';
            if (!collap) { panel.classList.toggle('collapsed'); return; }
            // Bulletproof max-height accordion: pin the current px height, force a
            // reflow, then animate to/from 0. On expand we clear the inline cap
            // after the transition so the news-body can flex + scroll normally.
            collap._tEnd && collap.removeEventListener('transitionend', collap._tEnd);
            if (willCollapse) {
                collap.style.maxHeight = collap.getBoundingClientRect().height + 'px';
                void collap.offsetHeight;
                panel.classList.add('collapsed');
                collap.style.maxHeight = '0px';
            } else {
                panel.classList.remove('collapsed');
                collap.style.maxHeight = '0px';
                void collap.offsetHeight;
                collap.style.maxHeight = collap.scrollHeight + 'px';
                collap._tEnd = () => { collap.style.maxHeight = ''; collap.removeEventListener('transitionend', collap._tEnd); collap._tEnd = null; };
                collap.addEventListener('transitionend', collap._tEnd);
                // Background tabs pause CSS transitions, so transitionend may never
                // fire — clear the pixel cap anyway once the animation must be done,
                // or the panel stays frozen at this height forever.
                setTimeout(() => { if (collap._tEnd && !panel.classList.contains('collapsed')) collap._tEnd(); }, 700);
            }
        });
    }

    function buildEventDivIcon(ev) {
        const canonical = canonicalForEvent(ev);
        const count = ev.channels_count || 1;
        const nearExpiry = isEventNearExpiry(ev) ? 1 : 0;
        // Render the emoji marker — prefer the AI-curated emoji (Phase 2), else the
        // backend's event_icon, else a pin.
        const emoji = _aiIconCache[ev.event_id] || ev.event_icon || '📍';
        const cacheKey = `emoji|${emoji}|${count}|${nearExpiry}`;
        let html = _iconHtmlCache.get(cacheKey);
        if (!html) {
            const color = CANONICAL_COLOR[canonical] || CANONICAL_COLOR.pin;
            const badge = count > 1 ? `<span class="ev-badge">${count}</span>` : '';
            html = `<div class="ev-pin ev-pin-emoji ev-canonical-${canonical}" style="--accent:${color}">
                        <span class="ev-icon ev-icon-emoji">${emoji}</span>
                        ${badge}
                    </div>`;
            _iconHtmlCache.set(cacheKey, html);
        }
        return L.divIcon({
            className: 'ev-divicon ev-fade-in' + (nearExpiry ? ' ev-near-expiry' : ''),
            html,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });
    }

    function buildTooltipHtml(ev) {
        const t = (T[currentLang] || T.en);
        const loc = _formatLoc(ev.location, ev.loc_tier);
        const when = ev.timestamp ? escapeHtml(String(ev.timestamp).slice(0, 16).replace('T', ' ')) : '';
        const channels = (ev.channels || []).map(escapeHtml).join(', ');
        const credLine = (ev.channels_count > 1)
            ? `<div class="evt-line evt-cred">${(t.reportedBy || 'Reported by {n} channels').replace('{n}', ev.channels_count)}</div>`
            : '';
        return `
            <div class="evt-tooltip">
                <div class="evt-head">
                    <span class="evt-ico">${ev.event_icon || '📍'}</span>
                    <span class="evt-label">${escapeHtml(_translateEventLabel(ev))}</span>
                </div>
                ${loc ? `<div class="evt-line evt-loc">${loc}</div>` : ''}
                ${credLine}
                <div class="evt-line evt-meta">${channels}</div>
                ${when ? `<div class="evt-line evt-meta">${when}</div>` : ''}
            </div>`;
    }

    function canonicalForEvent(ev) {
        if (!ev) return 'pin';
        if (CANONICAL_TYPE[ev.event_type]) return CANONICAL_TYPE[ev.event_type];
        return CANONICAL_BY_CATEGORY[ev.event_cat] || 'pin';
    }

    function cityBudget(z) {
        if (z <= 4) return 90;
        if (z <= 6) return 180;
        if (z <= 9) return 320;
        return 500;
    }

    function cityMinZoom(rank) {
        return rank <= 1 ? 3 :
            rank <= 3 ? 4 :
                rank <= 5 ? 5 :
                    rank <= 7 ? 7 :
                        rank <= 9 ? 9 : 10;
    }

    function clearAllMeasures() {
        abandonActiveMeasure();
        measureHistory.forEach(entry => {
            entry.markers.forEach(m => map.removeLayer(m));
            if (entry.line) map.removeLayer(entry.line);
            if (entry.poly) map.removeLayer(entry.poly);
        });
        measureHistory = [];
        currentPopupMeasureId = null;
    }

    function clearMeasureById(id) {
        const idx = measureHistory.findIndex(e => e.id === id);
        if (idx === -1) return;
        const entry = measureHistory[idx];
        entry.markers.forEach(m => map.removeLayer(m));
        if (entry.line) map.removeLayer(entry.line);
        if (entry.poly) map.removeLayer(entry.poly);
        measureHistory.splice(idx, 1);
        currentPopupMeasureId = null;
    }

    function closeArsenal() {
        const panel = document.getElementById('arsenal-panel');
        if (panel) panel.classList.remove('open');
        document.body.classList.remove('arsenal-open');
    }

    function closeCountryInfoPanel() {
        const panel = document.getElementById('country-info-panel');
        if (panel) panel.classList.remove('open');
    }

    function closeLocPopup() {
        const popup = document.getElementById('loc-popup');
        popup.style.display = 'none';
        popup.dataset.measurePopup = '';
        document.getElementById('lp-clear-btn').style.display = 'none';
        currentPopupMeasureId = null;
        const flag = document.getElementById('lp-flag');
        flag.classList.remove('visible');
        flag.removeAttribute('src');
        const sub = document.getElementById('lp-name-sub');
        if (sub) { sub.textContent = ''; sub.classList.remove('visible'); }
        // Restore default labels
        document.querySelector('[data-i18n="lpCountry"]').textContent = t('lpCountry');
        document.querySelector('[data-i18n="lpPop"]').textContent = t('lpPop');
        document.querySelector('[data-i18n="lpArea"]').textContent = t('lpArea');
        document.querySelector('[data-i18n="lpCoords"]').textContent = t('lpCoords');
    }

    function closePlacePanel() {
        const el = _placePanelEl();
        if (el) el.classList.remove('open');
    }


    function currentTheme() { return LABEL_THEME_FOR_BASE[currentLayer] || 'dark'; }

    async function doSearch(q) {
        const results = document.getElementById('search-results');
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=8&accept-language=${currentLang}&addressdetails=1`;
            const res = await fetch(url, { headers: { 'Accept-Language': currentLang } });
            const data = await res.json();
            renderSearchResults(data);
        } catch (e) {
            console.error('Search error:', e);
        }
    }

    function endSimulation() {
        if (_simState && _simState.layer) {
            try { map.removeLayer(_simState.layer); } catch (e) {}
        }
        if (_simRAF) { cancelAnimationFrame(_simRAF); _simRAF = null; }
        _simState = null;

        document.body.classList.remove('sim-running', 'sim-step-running', 'sim-step-results', 'sim-mode-active');

        const hud = document.getElementById('sim-hud');
        if (hud) hud.style.display = 'none';
        const panel = document.getElementById('arsenal-panel');
        if (panel) panel.classList.remove('sim-hidden');
        _setSimStep('config');
    }

    async function ensureCityData() {
        if (cityData) return cityData;
        const res = await fetch(CITY_LABELS_URL);
        const fc = await res.json();
        cityData = fc.features.map(f => {
            const p = f.properties || {};
            const [lng, lat] = f.geometry.coordinates;
            const name = p.name || p.NAME || p.nameascii || p.name_en || '';
            const rank = (typeof p.scalerank === 'number') ? p.scalerank
                : (typeof p.SCALERANK === 'number') ? p.SCALERANK : 8;
            // Natural Earth 10m uses lower-case keys: name_en, name_es, name_fr ...
            const names = {
                en: p.name_en || name, es: p.name_es || name,
                fr: p.name_fr || name, ru: p.name_ru || name,
                zh: p.name_zh || name, tr: p.name_tr || name,
                ar: p.name_ar || name, fa: p.name_fa || p.name_ar || name,
                he: p.name_he || name
            };
            return { name, names, lat, lng, rank };
        }).filter(c => c.name);
        return cityData;
    }

    async function ensureCountryData() {
        if (countryData) return countryData;
        // Curated country label set with multilingual names + centroids.
        countryData = COUNTRY_LABELS.map(c => ({
            name: c.name,
            names: c.names || {},
            lat: c.lat, lng: c.lng,
            rank: c.rank || 5,
            minZoom: c.minZoom,
        }));
        return countryData;
    }

    function ensureEventPane() {
        if (!map) return;
        // Event icons (eventPane=550) and cluster chips (clusterPane=560) get their
        // panes elsewhere; spiderfy legs need their own pane just below the icons.
        if (!map.getPane('spiderLegPane')) {
            const p = map.createPane('spiderLegPane');
            p.style.zIndex = 545;            // above dispersionPane(540), below eventPane(550)
            p.style.pointerEvents = 'none';
        }
        try { _ensureClusterLayer(); } catch (_) {}
        if (eventLayer && eventsEnabled && !map.hasLayer(eventLayer)) eventLayer.addTo(map);
    }

    function ensureRoadsPane() {
        if (map.getPane('roadsPane')) return;
        map.createPane('roadsPane');
        // tilePane=200, overlayPane=400, markerPane=600.
        // 350 keeps roads above the basemap + borders but below country/city labels.
        map.getPane('roadsPane').style.zIndex = 350;
        map.getPane('roadsPane').style.pointerEvents = 'none';
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function eventScore(id) {
        const ev = eventsById[id];
        if (!ev) return 0;
        const catScore = EVENT_CAT_PRIORITY[ev.event_cat] || 10;
        const credBoost = Math.min(20, (ev.channels_count || 1) * 5);
        // News/outlet events carry an AI newsworthiness rating (0–10); fold it in
        // so important stories outrank filler but all still clear the zoom filter.
        const impBoost = typeof ev.event_importance === 'number' ? ev.event_importance * 2 : 0;
        const ts = ev.timestamp ? Date.parse(ev.timestamp) || 0 : 0;
        // Age in hours penalises older events gently (1 pt per hour, capped 24)
        const age = ts ? Math.min(24, (Date.now() - ts) / 3.6e6) : 0;
        return catScore + credBoost + impBoost - age;
    }

    function explosionRadiusKm(weapon) {
        const mtype = weapon.mtype || 'ballistic';
        const warhead = String(weapon.warhead || '').toLowerCase();
        // Rough nuclear yield heuristic (kt) → fireball + severe damage radius.
        if (/nuclear|nuke|mirv/.test(warhead)) {
            // Extract kt or kg number if present
            const mKt = warhead.match(/(\d+(?:\.\d+)?)\s*kt/);
            const mKg = warhead.match(/(\d+(?:\.\d+)?)\s*kg/);
            let kt = 0;
            if (mKt) kt = parseFloat(mKt[1]);
            else if (mKg) {
                // Assume ~half of warhead kg is fissile — very rough mapping.
                const kg = parseFloat(mKg[1]);
                kt = Math.max(10, Math.min(1000, kg * 0.5));
            } else {
                kt = 100;
            }
            // Severe blast radius ≈ 2.2 × (kt)^0.33 km
            return Math.max(3, 2.2 * Math.pow(kt, 1 / 3));
        }
        // Conventional HE warheads — a few hundred kg TNT equivalent at most.
        const defaults = {
            ballistic: 0.6, hypersonic: 0.5, cruise: 0.35,
            tactical: 0.25, other: 0.4,
        };
        return defaults[mtype] || 0.4;
    }

    function extractLocalizedNames(p, fallback) {
        return {
            en: p.NAME_EN || fallback, es: p.NAME_ES || fallback,
            fr: p.NAME_FR || fallback, ru: p.NAME_RU || fallback,
            zh: p.NAME_ZH || fallback, tr: p.NAME_TR || fallback,
            ar: p.NAME_AR || fallback, fa: p.NAME_FA || p.NAME_AR || fallback,
            he: p.NAME_HE || fallback
        };
    }

    function fadeRemoveMarker(eventId) {
        _deregisterCluster(eventId);
        const m = eventMarkers[eventId];
        if (!m) return;
        const el = m.getElement && m.getElement();
        const finalize = () => {
            try { m.off(); } catch (_) {}                     // detach all listeners
            try { m.unbindTooltip(); } catch (_) {}
            try { m.unbindPopup(); } catch (_) {}
            if (eventLayer && eventLayer.hasLayer(m)) eventLayer.removeLayer(m);
            delete eventMarkers[eventId];
            delete userIconOffset[eventId];
            _spatialIndexRemove(eventId);
        };
        if (el) {
            el.classList.add('ev-fade-out');
            setTimeout(finalize, 520);                         // matches CSS 0.5s
        } else {
            finalize();
        }
    }

    async function fetchLocation(latlng, cp) {
        const popup = document.getElementById('loc-popup');
        popup.dataset.measurePopup = '';
        document.getElementById('lp-clear-btn').style.display = 'none';
        // Restore default labels
        document.querySelector('[data-i18n="lpCountry"]').textContent = t('lpCountry');
        document.querySelector('[data-i18n="lpPop"]').textContent = t('lpPop');
        document.querySelector('[data-i18n="lpArea"]').textContent = t('lpArea');
        document.querySelector('[data-i18n="lpCoords"]').textContent = t('lpCoords');
        ['lp-name', 'lp-type', 'lp-country', 'lp-pop', 'lp-area'].forEach(id => document.getElementById(id).textContent = '...');
        const sub = document.getElementById('lp-name-sub');
        if (sub) { sub.textContent = ''; sub.classList.remove('visible'); }
        document.getElementById('lp-coords').textContent = latlng.lat.toFixed(4) + '°, ' + latlng.lng.toFixed(4) + '°';
        const flag = document.getElementById('lp-flag');
        flag.classList.remove('visible');
        flag.removeAttribute('src');
        popup.style.display = 'block';
        placePopup(cp.x, cp.y + 50);

        try {
            // `namedetails=1` gives us a map of all name:<lang> variants so we
            // can show BOTH the native/local name and the translated one at once.
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=10&addressdetails=1&extratags=1&namedetails=1&accept-language=${currentLang}`);
            const data = await res.json();
            if (!data || data.error) { document.getElementById('lp-name').textContent = t('popUnknown'); return; }

            const addr = data.address || {}, osmType = data.type || data.class || '';
            const nd = data.namedetails || {};
            // Fallback chain for the primary local label
            const fallbackName = data.name || addr.city || addr.town || addr.village || addr.county || addr.country || '—';

            // Western Sahara → display as Morocco (per project requirement).
            // Nominatim returns country_code 'eh' / country 'Western Sahara'; override
            // both fields so the flag, country label, and downstream code all use MA.
            const isWS = ((addr.country_code || '').toLowerCase() === 'eh') ||
                /western\s*sahara|sahara\s*occidental|sahrawi/i.test(addr.country || '');
            if (isWS) {
                addr.country = 'Morocco';
                addr.country_code = 'ma';
            }

            // Native name = local-script name (OSM's default `name` tag).
            // Translated name = the UI language variant if available.
            // English name = universal fallback so at least two readable
            // variants appear whenever possible (users expect LATIN always).
            const nativeName = nd.name || fallbackName;
            const translatedKey = 'name:' + currentLang;
            const translatedName = nd[translatedKey] || null;
            const englishName = nd['name:en'] || null;

            // Header (primary) + subtitle (secondary) selection.
            //   1. Translated in user's language → native below (if different)
            //   2. No translation, but English exists → English primary, native below
            //   3. Otherwise → native alone
            let primary, secondary = '';
            if (translatedName) {
                primary = translatedName;
                if (nativeName && nativeName !== translatedName) secondary = nativeName;
                else if (englishName && englishName !== translatedName) secondary = englishName;
            } else if (englishName && englishName !== nativeName && currentLang !== 'en') {
                primary = englishName;
                secondary = nativeName;
            } else {
                primary = nativeName;
                if (englishName && englishName !== nativeName) secondary = englishName;
            }

            let typeLabel = '—';
            if (osmType === 'capital' || addr.capital) typeLabel = t('typeCapital');
            else if (osmType === 'city' || addr.city) typeLabel = t('typeCity');
            else if (osmType === 'town' || addr.town) typeLabel = t('typeTown');
            else if (osmType === 'village' || addr.village) typeLabel = t('typeVillage');
            else if (osmType === 'island' || osmType === 'islet') typeLabel = t('typeIsland');
            else if (osmType === 'state' || addr.state) typeLabel = t('typeState');
            else if (osmType === 'county' || addr.county) typeLabel = t('typeCounty');
            else if (addr.country) typeLabel = t('typeCountry');

            const pop = data.extratags && parseInt(data.extratags.population) || null;
            const area = data.extratags && data.extratags['area:ha']
                ? (parseFloat(data.extratags['area:ha']) / 100).toFixed(1) + ' km²' : null;

            document.getElementById('lp-name').textContent = primary.toUpperCase();
            if (sub) {
                if (secondary) { sub.textContent = secondary; sub.classList.add('visible'); }
                else { sub.textContent = ''; sub.classList.remove('visible'); }
            }
            document.getElementById('lp-type').textContent = typeLabel;
            document.getElementById('lp-country').textContent = addr.country || '—';
            document.getElementById('lp-pop').textContent = pop ? fmtNum(pop) : t('popUnknown');
            document.getElementById('lp-area').textContent = area || t('popUnknown');
            document.getElementById('lp-coords').textContent = latlng.lat.toFixed(4) + '°, ' + latlng.lng.toFixed(4) + '°';

            // Country flag (ISO 3166-1 alpha-2 from Nominatim → flagcdn.com)
            const cc = (addr.country_code || '').toLowerCase();
            if (cc && /^[a-z]{2}$/.test(cc)) {
                const flag = document.getElementById('lp-flag');
                flag.src = `https://flagcdn.com/w40/${cc}.png`;
                flag.alt = addr.country || cc.toUpperCase();
                flag.onload = () => flag.classList.add('visible');
                flag.onerror = () => flag.classList.remove('visible');
            }
        } catch (e) {
            document.getElementById('lp-name').textContent = t('popUnknown');
        }
    }

    async function fetchRestCountry(name) {
        const key = (name || '').toLowerCase().trim();
        if (!key) return null;
        if (_restCountryCache[key]) return _restCountryCache[key];
        try {
            const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
            let arr = res.ok ? await res.json() : null;
            if (!Array.isArray(arr) || arr.length === 0) {
                // Fall back to non-fulltext name search and pick the closest match.
                const r2 = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`);
                arr = r2.ok ? await r2.json() : null;
            }
            if (!Array.isArray(arr) || arr.length === 0) return null;
            const r = arr[0];
            const formatN = n => n == null ? null : Number(n).toLocaleString();
            const cca2 = (r.cca2 || '').toLowerCase();
            const flagEmoji = r.flag || '';
            const data = {
                cca2,
                cca3: r.cca3,
                flag: flagEmoji,
                capital: (Array.isArray(r.capital) && r.capital[0]) || null,
                pop: formatN(r.population),
                area: r.area ? `${formatN(r.area)} km²` : null,
                region: r.region || null,
                subregion: r.subregion || null,
                system: r.government || null,
                languages: r.languages ? Object.values(r.languages).join(', ') : null,
                currency: (() => {
                    if (!r.currencies) return null;
                    const ks = Object.keys(r.currencies);
                    if (!ks.length) return null;
                    const c = r.currencies[ks[0]];
                    return `${ks[0]} ${c.symbol || ''}`.trim();
                })(),
                borders: Array.isArray(r.borders) ? r.borders : [],
            };
            _restCountryCache[key] = data;
            return data;
        } catch (e) {
            return null;
        }
    }

    async function fetchWikiSummary(title, lang) {
        const key = `${lang}:${title}`;
        if (_wikiCache[key]) return _wikiCache[key];
        try {
            const r = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
            if (!r.ok) return null;
            const data = await r.json();
            _wikiCache[key] = data;
            return data;
        } catch (_) { return null; }
    }

    function findCountryInfo(countryRec) {
        // Try every localised variant + the canonical name until one matches.
        const names = [countryRec.name, ...(countryRec.names ? Object.values(countryRec.names) : [])];
        for (const n of names) {
            const hit = _countryInfoIndex.get(n);
            if (hit) return hit;
        }
        return null;
    }

    function flyToNews(lat, lng, eventId) {
        if (!map) return;
        map.flyTo([lat, lng], Math.max(map.getZoom(), 7), { duration: 1 });
        if (eventId && eventMarkers[eventId]) {
            setTimeout(() => { try { eventMarkers[eventId].openPopup(); } catch (_) {} }, 1100);
        }
    }

    function fmtArea(m2) {
        if (currentUnit === 'mi') return (m2 / 2589988).toFixed(2) + ' mi²';
        if (currentUnit === 'nm') return (m2 / 3429904).toFixed(2) + ' nm²';
        return m2 >= 1e6 ? (m2 / 1e6).toFixed(2) + ' km²' : m2.toFixed(0) + ' m²';
    }

    function fmtDist(m) {
        if (currentUnit === 'mi') { const mi = m / 1609.344; return mi >= 1 ? mi.toFixed(2) + ' mi' : (m * 3.28084).toFixed(1) + ' ft'; }
        if (currentUnit === 'nm') return (m / 1852).toFixed(2) + ' nm';
        return m >= 1000 ? (m / 1000).toFixed(2) + ' km' : m.toFixed(0) + ' m';
    }

    function fmtNum(n) {
        if (n == null) return '—';
        return Number(n).toLocaleString();
    }

    function _findClusterChipFor(eventId) {
        for (const chip of _activeClusters.values()) {
            if (chip._evIds && chip._evIds.indexOf(eventId) !== -1) return chip;
        }
        return null;
    }

    function focusEventOnMap(eventId) {
        const ev = eventsById[eventId];
        const m = eventMarkers[eventId];
        if (!ev || !m) return;
        if (!eventsEnabled) setEventsEnabled(true);  // auto-reveal if hidden
        const chkEl = document.getElementById('tog-events');
        if (chkEl && !chkEl.classList.contains('active')) chkEl.classList.add('active');
        map.flyTo([ev.lat, ev.lng], Math.max(map.getZoom(), EVENT_FOCUS_ZOOM), { duration: 0.8 });
        // After the flight (and the cluster rebuild it triggers) settles, reveal
        // the exact icon: if it's still folded into a cluster, fan that cluster
        // out, then pulse + open the tooltip so the user sees which one it is.
        setTimeout(() => {
            let mk = eventMarkers[eventId];
            if (!mk) return;
            const el = mk.getElement && mk.getElement();
            const hidden = !el || el.style.visibility === 'hidden' || el.style.display === 'none';
            if (hidden && !_isDeployed(eventId)) {
                const chip = _findClusterChipFor(eventId);
                if (chip) _spiderfyDeploy(chip.getLatLng(), chip._evIds, chip);
            }
            mk = eventMarkers[eventId];
            if (mk) { try { mk.openTooltip(); } catch (_) {} pulseMarker(mk); }
        }, 900);
    }

    function focusNewsForEvent(eventId) {
        // One unified "Noticias" tab now holds both Telegram posts and RSS outlet
        // stories, so just make sure we're on it (not the Fuentes manager) before
        // scrolling to the article.
        if (newsSource !== 'news') { try { setNewsSource('news'); } catch (_) {} }
        // Ensure news panel is open
        const body = document.getElementById('news-body');
        const btn = document.getElementById('news-toggle');
        if (body && body.classList.contains('collapsed')) {
            body.classList.remove('collapsed');
            if (btn) btn.textContent = '━';
        }
        const list = document.getElementById('news-list');
        if (!list) return;
        // Remember the focus so re-renders (live WS updates) don't drop it.
        _focusedEventId = eventId;
        _focusedAt = Date.now();
        // Jump straight to the exact article (instant, not smooth) so a single
        // click lands on it — a long smooth scroll looked like it was wandering
        // through "random" articles and made the user click again. Deferred one
        // frame so a just-uncollapsed panel has settled its layout first.
        requestAnimationFrame(() => _applyNewsFocus(false));
        // Fallback for when rAF is throttled (background/headless).
        setTimeout(() => _applyNewsFocus(false), 60);
        // Clear the focus + highlight once the window passes (unless re-focused).
        const at = _focusedAt;
        setTimeout(() => {
            if (_focusedAt !== at) return;   // a newer focus superseded this one
            _focusedEventId = null;
            const list = document.getElementById('news-list');
            if (list) list.querySelectorAll('.news-item.highlighted').forEach(el => el.classList.remove('highlighted'));
        }, 6000);
    }

    // Scroll to + highlight the focused news item. Called from focusNewsForEvent
    // and re-called after every renderNewsList so the focus survives live updates.
    function _applyNewsFocus(smooth) {
        if (!_focusedEventId) return;
        if (Date.now() - _focusedAt > 6000) { _focusedEventId = null; return; }
        const list = document.getElementById('news-list');
        if (!list) return;
        const target = list.querySelector(`.news-item[data-event-id="${CSS.escape(_focusedEventId)}"]`);
        if (!target) return;
        list.querySelectorAll('.news-item.highlighted').forEach(el => {
            if (el !== target) el.classList.remove('highlighted');
        });
        target.classList.add('highlighted');
        try {
            target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });
        } catch (_) { target.scrollIntoView(); }
    }

    function geodesicCirclePoints(lat, lng, distKm, points) {
        const out = [];
        const n = points || 128;
        let prevLng = null;
        let offset = 0;
        for (let i = 0; i <= n; i++) {
            const bearing = (i * 360) / n;
            const [la, lo] = geodesicDestination(lat, lng, bearing, distKm);
            let lo2 = lo;
            if (prevLng !== null) {
                const d = lo2 + offset - prevLng;
                if (d > 180) offset -= 360;
                else if (d < -180) offset += 360;
            }
            const finalLng = lo2 + offset;
            out.push([la, finalLng]);
            prevLng = finalLng;
        }
        return out;
    }

    function geodesicCrossesAntimeridian(lat, lng, distKm) {
         const R = 6371;
         const d = distKm / R;
         if (d >= Math.PI) return true;
         const cosLat = Math.cos(lat * Math.PI / 180);
         if (Math.abs(lat) + (distKm / 111) >= 89) return true;
         const ratio = Math.sin(d) / Math.max(0.001, cosLat);
         if (Math.abs(ratio) >= 1) return true;
         const halfSpan = Math.asin(ratio) * 180 / Math.PI;
         const east = lng + halfSpan, west = lng - halfSpan;
         return east > 180 || west < -180;
     }

    function geodesicDestination(lat, lng, bearingDeg, distKm) {
        const R = 6371;
        const bearingRad = (bearingDeg * Math.PI) / 180;
        const lat1 = (lat * Math.PI) / 180;
        const lng1 = (lng * Math.PI) / 180;
        const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distKm / R) +
                              Math.cos(lat1) * Math.sin(distKm / R) * Math.cos(bearingRad));
        const lng2 = lng1 + Math.atan2(Math.sin(bearingRad) * Math.sin(distKm / R) * Math.cos(lat1),
                                       Math.cos(distKm / R) - Math.sin(lat1) * Math.sin(lat2));
        return { lat: (lat2 * 180) / Math.PI, lng: (lng2 * 180) / Math.PI };
    }

    function handleMeasureClick(latlng) {
        // Check snap-to-close for area mode
        if (measureMode === 'area' && measurePts.length >= 3 && isNearFirstPoint(latlng)) {
            finishMeasure();
            return;
        }
        // General snap to any existing vertex (locks coordinate exactly)
        const snapped = snapToVertex(latlng);
        addMeasurePoint({ lat: snapped.lat, lng: snapped.lng });
    }

    function haversine(a, b) {
        const R = 6371000, r = x => x * Math.PI / 180;
        const dLat = r(b.lat - a.lat), dLng = r(b.lng - a.lng);
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    }

    function haversineDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function haversineKm(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(a));
    }

    function hide() {
            if (_el) _el.style.display = 'none';
        }

    function hideContextMenu() {
        document.getElementById('context-menu').style.display = 'none';
    }

    function hideRangeContextMenu() {
        const menu = document.getElementById('range-cm');
        if (menu) menu.classList.remove('open');
    }

    function hideSimulator() {
        const sim = document.getElementById('ars-simulator');
        const list = document.getElementById('ars-list');
        if (sim) sim.style.display = 'none';
        if (list) list.style.display = '';
        document.body.classList.remove('sim-mode');
        document.body.classList.remove('sim-picking');
        _simPicking = null;
        // Drop the persistent config-time overlays when leaving the
        // simulator so the main map stays uncluttered.
        if (_simDefenseRangeLayer && typeof map !== 'undefined' && map) {
            try { map.removeLayer(_simDefenseRangeLayer); } catch(_) {}
            _simDefenseRangeLayer = null;
        }
        if (_simOffensiveRangeLayer && typeof map !== 'undefined' && map) {
            try { map.removeLayer(_simOffensiveRangeLayer); } catch(_) {}
            _simOffensiveRangeLayer = null;
        }
        const overlay = document.getElementById('sim-target-picker');
        if (overlay) overlay.style.display = 'none';
        const sel = document.querySelector('.ars-selectors .ars-country-row');
        if (sel) sel.style.display = '';
    }

    function indexNewsByEvent(item) {
        const eid = item.event_id;
        if (!eid) return;
        (newsById[eid] = newsById[eid] || []).unshift(item);
    }

    function initSearch() {
        const input = document.getElementById('search-input');
        const results = document.getElementById('search-results');
        if (!input || !results) return;

        input.addEventListener('input', () => {
            clearTimeout(_searchTimer);
            const q = input.value.trim();
            if (q.length < 2) { results.style.display = 'none'; return; }
            _searchTimer = setTimeout(() => doSearch(q), 320);
        });

        input.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                input.value = '';
                results.style.display = 'none';
                input.blur();
            } else if (e.key === 'Enter') {
                const first = results.querySelector('.sr-item');
                if (first) first.click();
            } else if (e.key === 'ArrowDown') {
                const items = results.querySelectorAll('.sr-item');
                if (items.length) { e.preventDefault(); items[0].focus(); }
            }
        });

        results.addEventListener('keydown', e => {
            const items = [...results.querySelectorAll('.sr-item')];
            const idx = items.indexOf(document.activeElement);
            if (e.key === 'ArrowDown' && idx < items.length - 1) { e.preventDefault(); items[idx + 1].focus(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); (idx > 0 ? items[idx - 1] : input).focus(); }
            else if (e.key === 'Escape') { input.focus(); results.style.display = 'none'; }
        });

        document.addEventListener('click', e => {
            if (!e.target.closest('.search-wrap')) results.style.display = 'none';
        });
    }

    function initSimulator() {
        const root = document.getElementById('ars-simulator');
        if (!root || root._inited) return;
        root._inited = true;

        // Mode toggle
        document.querySelectorAll('.sim-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sim-mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                _simAlliance.mode = btn.dataset.mode;
                const desc = document.getElementById('sim-mode-desc');
                if (desc) {
                    const dKey = _simAlliance.mode === 'exchange' ? 'simModeExchange' : 'simModeOneway';
                    desc.setAttribute('data-i18n', dKey);  // keep applyLang in sync
                    desc.textContent = t(dKey);
                }
                _renderSide('A');
                _renderSide('B');
                _renderLaunchSummary();
            });
        });

        // Add-country selectors and buttons
        ['A', 'B'].forEach(side => {
            const sel = document.getElementById('sim-add-' + side);
            const btn = document.getElementById('sim-add-' + side + '-btn');
            if (btn) btn.addEventListener('click', () => {
                if (!sel || !sel.value) return;
                _addCountry(side, sel.value);
            });
        });

        // Launch / reset
        const launchBtn = document.getElementById('sim-launch');
        if (launchBtn) launchBtn.addEventListener('click', startSimulation);
        const clearBtn = document.getElementById('sim-clear-all');
        if (clearBtn) clearBtn.addEventListener('click', _resetAlliance);

        // Results step buttons
        const ret1 = document.getElementById('sim-return');
        if (ret1) ret1.addEventListener('click', endSimulation);
        const ret2 = document.getElementById('sim-return-2');
        if (ret2) ret2.addEventListener('click', endSimulation);
        const backBtn = document.getElementById('sim-back-to-config');
        if (backBtn) backBtn.addEventListener('click', () => {
            endSimulation();
            _setSimStep('config');
        });
        const runAgainBtn = document.getElementById('sim-run-again');
        if (runAgainBtn) runAgainBtn.addEventListener('click', startSimulation);
        const cancelRunBtn = document.getElementById('sim-cancel-run');
        if (cancelRunBtn) cancelRunBtn.addEventListener('click', () => {
            _abortSimulation();
            _setSimStep('config');
        });
        const clearMapBtn = document.getElementById('sim-clear-map');
        if (clearMapBtn) clearMapBtn.addEventListener('click', () => {
            if (_simResidualLayer && map) { try { map.removeLayer(_simResidualLayer); } catch(_) {} _simResidualLayer = null; }
        });
        const viewLastBtn = document.getElementById('sim-view-last');
        if (viewLastBtn) viewLastBtn.addEventListener('click', () => {
            const body = document.getElementById('sim-results-body');
            if (body && _lastResultsHTML) { body.innerHTML = _lastResultsHTML; _setSimStep('results'); }
        });

        // Target picker overlay buttons
        const pickCancel = document.getElementById('sim-pick-cancel');
        if (pickCancel) pickCancel.addEventListener('click', _cancelTargetPicker);
        const pickConfirm = document.getElementById('sim-pick-confirm');
        if (pickConfirm) pickConfirm.addEventListener('click', _confirmTargetPickerCoords);

        _refreshAddSelectors();
        _renderSide('A');
        _renderSide('B');
        _renderLaunchSummary();
    }

    function initWebSocket() {
        if (!_isOnline) return;             // offline mode — don't open a connection
        // No user sources → don't subscribe to the backend's live news stream.
        // Otherwise GrassyGep & co. flood the map even after Reset.
        if (!geoFeed.sources.length) {
            console.info('[ws] Skipping WebSocket — no user sources configured.');
            return;
        }
        try {
            wsConnection = new WebSocket('ws://localhost:8765');

            wsConnection.onopen = () => {
                console.log('WebSocket connected');
                document.getElementById('news-status').textContent = 'Conectado • En vivo';
                document.getElementById('news-status').style.color = 'var(--accent2)';
            };

            wsConnection.onmessage = (event) => {
                let data;
                try { data = JSON.parse(event.data); } catch (e) { return; }
                switch (data.type) {
                    case 'news': addNewsItem(data); break;
                    case 'event_new': upsertEventMarker(data.event, true); break;
                    case 'event_update': upsertEventMarker(data.event, false); break;
                    case 'event_expired': removeEventMarker(data.event_id); break;
                    case 'snapshot': {
                        if (Array.isArray(data.events)) {
                            data.events.forEach(ev => upsertEventMarker(ev, false));
                        }
                        if (Array.isArray(data.news)) {
                            // merge historical news returned with the snapshot
                            data.news.forEach(n => {
                                if (!newsItems.some(x => x.message_id === n.message_id &&
                                    x.channel === n.channel)) {
                                    newsItems.unshift(n);
                                    indexNewsByEvent(n);
                                }
                            });
                            scheduleNewsRender();
                        }
                        break;
                    }
                }
            };

            wsConnection.onerror = () => {
                document.getElementById('news-status').textContent = 'Error de conexión';
                document.getElementById('news-status').style.color = '#ff6060';
            };

            wsConnection.onclose = () => {
                if (_wsSuppressReconnect) return;   // offline mode — don't reconnect
                document.getElementById('news-status').textContent = 'Desconectado';
                document.getElementById('news-status').style.color = 'var(--muted)';
                setTimeout(initWebSocket, 5000);
            };
        } catch (e) {
            console.error('WebSocket error:', e);
            document.getElementById('news-status').textContent = 'Esperando backend...';
        }
    }


    function isEventExpired(ev) {
        const ts = _eventTimestampMs(ev);
        if (!ts) return false;
        const reference = _ttlMode === 'frozen' ? _ttlReference : Date.now();
        return (reference - ts) > EVENT_TTL_MS;
    }

    function isEventNearExpiry(ev) {
        const left = _eventTimeLeftMs(ev);
        return left > 0 && left < EVENT_NEAR_EXPIRY_MS;
    }

    function isNearFirstPoint(latlng) {
        if (measurePts.length < 3) return false;
        return pixelDistance(measurePts[0], latlng) < SNAP_PX;
    }

    function launchSimulation() {
        const attackerSel = document.getElementById('sim-attacker');
        const targetSel = document.getElementById('sim-target');
        const weaponSel = document.getElementById('sim-weapon');
        const quantityInput = document.getElementById('sim-quantity');

        const attacker = ARSENAL_DATA[attackerSel.value];
        const target = ARSENAL_DATA[targetSel.value];
        const weaponIdx = parseInt(weaponSel.value);
        const quantity = parseInt(quantityInput.value) || 1;

        if (!attacker || !target || !attacker.missile || !attacker.missile[weaponIdx]) return;

        const weapon = attacker.missile[weaponIdx];
        const defense = DEFENSE_SYSTEMS[targetSel.value] || { name: 'Minimal', intercept_rate: 0.1 };

        const intercepted = Math.floor(quantity * defense.intercept_rate);
        const penetrated = Math.max(0, quantity - intercepted);
        const blastRadius = Math.sqrt(parseInt(weapon.warhead) || 100) / 2;
        const casualties = penetrated * (parseInt(weapon.warhead) || 100) * 2;

        document.getElementById('sim-stat-fired').textContent = quantity;
        document.getElementById('sim-stat-intercepted').textContent = intercepted;
        document.getElementById('sim-stat-penetrated').textContent = penetrated;
        document.getElementById('sim-stat-casualties').textContent = casualties.toLocaleString();
        document.getElementById('sim-stat-radius').textContent = blastRadius.toFixed(1) + ' km';
        document.getElementById('sim-stat-intercept-pct').textContent = Math.round(defense.intercept_rate * 100) + '%';

        animateMissiles(attacker, target, weapon, quantity, intercepted, penetrated);

        document.getElementById('sim-results').style.display = 'block';
    }

    function loadHistoricalNews() {
        // Don't pull backend news.json when the user has no sources configured —
        // they explicitly asked for a blank slate after Reset / first-run.
        if (!geoFeed.sources.length) {
            console.info('[news-pipe] Skipping news.json — no user sources configured.');
            return;
        }
        console.info('[news-pipe] Fetching news.json…');
        fetch('news.json', { cache: 'no-store' })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    console.warn('[news-pipe] news.json is not an array', typeof data);
                    return;
                }
                newsItems = data;
                // Reconstruct event payloads from inline news fields so the
                // map shows icons even with no live backend.
                const seen = {};
                let withCoords = 0, withoutCoords = 0, noEventId = 0;
                data.forEach(n => {
                    if (!n.event_id) { noEventId++; return; }
                    if (n.lat == null || n.lng == null) { withoutCoords++; return; }
                    withCoords++;
                    indexNewsByEvent(n);
                    if (!seen[n.event_id]) {
                        seen[n.event_id] = {
                            event_id: n.event_id,
                            event_type: n.event_type,
                            event_icon: n.event_icon,
                            event_label: n.event_label,
                            event_cat: n.event_cat,
                            event_status: n.event_status,
                            lat: n.lat, lng: n.lng,
                            location: n.location,
                            loc_tier: n.loc_tier,
                            timestamp: n.timestamp,
                            channels: [n.channel].filter(Boolean),
                            channels_count: 1,
                        };
                    } else if (n.channel && !seen[n.event_id].channels.includes(n.channel)) {
                        seen[n.event_id].channels.push(n.channel);
                        seen[n.event_id].channels_count = seen[n.event_id].channels.length;
                    }
                });
                const eventList = Object.values(seen);
                console.info(`[news-pipe] news.json parsed: ${data.length} messages | ${eventList.length} unique events | ${withCoords} geocoded | ${withoutCoords} no-coords | ${noEventId} no-event_id`);
                // Pick TTL mode from the data we just received.
                _refreshTtlReference(eventList);
                let placed = 0, expired = 0;
                eventList.forEach(ev => {
                    if (isEventExpired(ev)) { expired++; return; }
                    upsertEventMarker(ev, false);
                    placed++;
                });
                // Defer the heavy 200-item feed render to its own task so it
                // doesn't extend the parse+marker-placement task into a hitch.
                scheduleNewsRender();
                console.info(`[news-pipe] placed ${placed} markers, rejected ${expired} as expired (mode=${_ttlMode})`);
                if (placed === 0 && eventList.length > 0) {
                    console.error('[news-pipe] CRITICAL: 0 markers placed despite ' + eventList.length + ' valid events. ' +
                        'Investigate isEventExpired, ensureEventPane, eventsEnabled flag.');
                }
            })
            .catch(e => console.warn('[news-pipe] news.json fetch failed', e));
    }

    function localizedName(rec) {
        return (rec.names && rec.names[currentLang]) || rec.name;
    }

    function localizedWaterName(wb) {
        const map_ = WB_NAMES[wb.name];
        if (!map_) return wb.name;
        return (currentLang !== 'en' && map_[currentLang]) ? map_[currentLang] : wb.name;
    }

    function makeVertexIcon(isFirst) {
        const cls = 'measure-vertex' + (isFirst ? ' first-point' : '');
        return L.divIcon({
            className: 'measure-vertex-wrap',
            html: '<div class="' + cls + '"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });
    }



    function openArsenal() {
        const panel = document.getElementById('arsenal-panel');
        if (!panel) return;
        document.body.classList.add('arsenal-open');
        panel.classList.add('open');
        renderArsenalList();
    }

    async function openCountryPanel(c) {
        const trName = localizedName(c);
        const natName = c.names && c.names.en ? c.names.en : c.name;
        const local = findCountryInfo(c);

        // Show the panel immediately with what we have, then enrich.
        const merged = { name: natName };
        if (local) Object.assign(merged, local);

        renderCountryPanel(merged, trName, natName, /*loading=*/!local || true);

        // Always try to enrich with live data (population, area, currency, capital).
        try {
            const rc = await fetchRestCountry(natName);
            if (rc) {
                // Local data takes precedence for fields we curate (leader, gfp, nukes...).
                if (!merged.cap) merged.cap = rc.capital;
                if (!merged.pop) merged.pop = rc.pop;
                if (!merged.area) merged.area = rc.area;
                if (!merged.currency) merged.currency = rc.currency;
                if (!merged.flag) merged.flag = rc.flag;
                merged.languages = rc.languages;
                merged.region = rc.region;
                merged.subregion = rc.subregion;
                merged.borders = rc.borders;
                merged.system = merged.system || rc.system;
                renderCountryPanel(merged, trName, natName, false);
            } else {
                renderCountryPanel(merged, trName, natName, false);
            }
        } catch (e) {
            renderCountryPanel(merged, trName, natName, false);
        }
    }

    function openEventPopup(ev, marker) {
    // builds L.popup with full news content, iOS animation
    // user now says: REMOVE THIS, navigate to news panel instead
}

    async function openPlacePanel(data, kind) {
        // Build the panel lazily on first call (kept in sync via i18n attrs).
        let panel = _placePanelEl();
        if (!panel) {
            panel = document.createElement('aside');
            panel.id = 'place-info-panel';
            panel.className = 'place-info-panel';
            panel.innerHTML = `
                <button class="pi-close" aria-label="Cerrar">×</button>
                <div class="pi-header">
                    <div class="pi-name"></div>
                    <div class="pi-name-sub"></div>
                    <div class="pi-type"></div>
                </div>
                <img class="pi-thumb" alt="">
                <div class="pi-summary"></div>
                <div class="pi-grid"></div>
                <a class="pi-link" target="_blank" rel="noopener">Wikipedia →</a>`;
            document.body.appendChild(panel);
            panel.querySelector('.pi-close').addEventListener('click', closePlacePanel);
        }

        // Compute names: translated primary + original below in smaller text.
        const trName = (data.names && data.names[currentLang]) || data.name;
        const natName = (data.names && data.names.en) || data.name;
        const showSub = natName && natName !== trName;

        panel.querySelector('.pi-name').textContent = (trName || '').toString();
        const sub = panel.querySelector('.pi-name-sub');
        sub.textContent = showSub ? natName : '';
        sub.style.display = showSub ? '' : 'none';
        panel.querySelector('.pi-type').textContent = placePanelTypeLabel(kind, data);
        panel.querySelector('.pi-summary').textContent = '…';
        const thumb = panel.querySelector('.pi-thumb');
        thumb.style.display = 'none';
        thumb.removeAttribute('src');
        panel.querySelector('.pi-grid').innerHTML = '';
        const linkEl = panel.querySelector('.pi-link');
        linkEl.style.display = 'none';
        panel.classList.add('open');

        // Pull Wikipedia summary in user lang first, then fall back to English.
        const queryName = natName || trName;
        let wiki = await fetchWikiSummary(queryName, currentLang);
        if (!wiki || wiki.type === 'disambiguation') {
            wiki = await fetchWikiSummary(queryName, 'en');
        }
        if (!wiki) {
            panel.querySelector('.pi-summary').textContent = (T[currentLang] && T[currentLang].noData) || 'No data';
            return;
        }
        if (wiki.extract) panel.querySelector('.pi-summary').textContent = wiki.extract;
        if (wiki.thumbnail && wiki.thumbnail.source) {
            thumb.src = wiki.thumbnail.source;
            thumb.style.display = '';
        }
        if (wiki.content_urls && wiki.content_urls.desktop && wiki.content_urls.desktop.page) {
            linkEl.href = wiki.content_urls.desktop.page;
            linkEl.style.display = '';
        }

        // For cities, also try to fetch country data so we can show flag/population.
        if (kind === 'city') {
            try {
                const cp = map.latLngToContainerPoint([data.lat, data.lng]);
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.lat}&lon=${data.lng}&zoom=10&addressdetails=1&accept-language=${currentLang}`);
                if (res.ok) {
                    const json = await res.json();
                    const addr = json.address || {};
                    const country = addr.country || '';
                    const grid = panel.querySelector('.pi-grid');
                    const tr = T[currentLang] || T.es;
                    const rows = [];
                    if (country) rows.push([tr.lpCountry || 'Country', country]);
                    if (addr.state) rows.push([tr.typeState || 'Region', addr.state]);
                    if (data.lat != null) rows.push([tr.lpCoords || 'Coords', `${data.lat.toFixed(3)}, ${data.lng.toFixed(3)}`]);
                    grid.innerHTML = rows.map(([k, v]) => `<div class="pi-row"><span class="pi-k">${escapeHtml(k)}</span><span class="pi-v">${escapeHtml(v)}</span></div>`).join('');
                }
            } catch (_) { /* network may fail, panel still useful */ }
        } else if (kind === 'water') {
            const grid = panel.querySelector('.pi-grid');
            const tr = T[currentLang] || T.es;
            grid.innerHTML = `<div class="pi-row"><span class="pi-k">${escapeHtml(tr.lpCoords || 'Coords')}</span><span class="pi-v">${data.lat.toFixed(2)}, ${data.lng.toFixed(2)}</span></div>`;
        }
    }

    function pixelDistance(a, b) {
        const p1 = map.latLngToContainerPoint([a.lat, a.lng]);
        const p2 = map.latLngToContainerPoint([b.lat, b.lng]);
        const dx = p1.x - p2.x, dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function placeContextMenu(x, y) {
        const el = document.getElementById('context-menu');
        const w = 210, h = 160;
        let px = x, py = y;
        if (px + w > window.innerWidth - 10) px = window.innerWidth - w - 10;
        if (py + h > window.innerHeight - 10) py = window.innerHeight - h - 10;
        el.style.left = px + 'px'; el.style.top = py + 'px';
    }

    function placePanelTypeLabel(kind, data) {
        const tr = T[currentLang] || T.es;
        if (kind === 'city') {
            const r = (data.rank != null) ? data.rank : 8;
            if (r <= 1) return tr.typeCapital || 'Capital';
            if (r <= 5) return tr.typeCity || 'City';
            if (r <= 7) return tr.typeTown || 'Town';
            return tr.typeVillage || 'Village';
        }
        if (kind === 'water') {
            if (data.type === 'sea') return 'Sea';
            if (data.type === 'gulf') return 'Gulf';
            if (data.type === 'strait') return 'Strait';
            return 'Body of water';
        }
        if (kind === 'province') return tr.typeState || 'Region';
        return '';
    }

    function placePopup(x, y) {
        const el = document.getElementById('loc-popup'), pw = 270, ph = 230;
        let px = x + 16, py = y - 10;
        if (px + pw > window.innerWidth - 10) px = x - pw - 16;
        if (py + ph > window.innerHeight - 10) py = window.innerHeight - ph - 10;
        if (py < 60) py = 60;
        el.style.left = px + 'px'; el.style.top = py + 'px';
    }

    function pollBackendStatus() {
        if (_bkndPollInflight) return;
        _bkndPollInflight = true;
        fetch('telegram_heartbeat.json', { cache: 'no-store' })
            .then(r => r.ok ? r.json() : null)
            .then(hb => {
                if (hb && typeof hb.ts === 'number') {
                    _lastBackendHeartbeat = hb.ts * 1000;
                }
                _renderBackendStatus();
            })
            .catch(() => _renderBackendStatus())
            .finally(() => { _bkndPollInflight = false; });
    }

    function pollNewsUpdates() {
        if (!_isOnline) return;               // offline mode — no polling
        if (!geoFeed.sources.length) return;  // no user sources → no backend news
        if (_pollInflight) return;
        _pollInflight = true;
        fetch('news.json', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (!Array.isArray(data)) return;
                const known = new Set(newsItems.map(_newsKey));
                // news.json is sorted newest-first → iterate oldest-first so
                // unshifting into newsItems preserves correct chronological order.
                const fresh = data.filter(n => !known.has(_newsKey(n))).reverse();
                if (fresh.length === 0) return;

                // Group new items by event_id so credibility counts update properly.
                const byEvent = {};
                fresh.forEach(n => {
                    newsItems.unshift(n);
                    indexNewsByEvent(n);
                    if (!n.event_id || n.lat == null || n.lng == null) return;
                    if (!byEvent[n.event_id]) {
                        byEvent[n.event_id] = {
                            event_id: n.event_id,
                            event_type: n.event_type,
                            event_icon: n.event_icon,
                            event_label: n.event_label,
                            event_cat: n.event_cat,
                            event_status: n.event_status,
                            lat: n.lat, lng: n.lng,
                            location: n.location,
                            timestamp: n.timestamp,
                            channels: [n.channel].filter(Boolean),
                            channels_count: 1,
                        };
                    } else if (n.channel && !byEvent[n.event_id].channels.includes(n.channel)) {
                        byEvent[n.event_id].channels.push(n.channel);
                        byEvent[n.event_id].channels_count = byEvent[n.event_id].channels.length;
                    }
                });
                Object.entries(byEvent).forEach(([eid, ev]) => {
                    // Merge with any existing event so channel counters stay accurate.
                    const existing = eventsById[eid];
                    if (existing) {
                        ev.channels = Array.from(new Set([...(existing.channels || []), ...ev.channels]));
                        ev.channels_count = ev.channels.length;
                    }
                    upsertEventMarker(ev, !existing);
                });
                renderNewsList();
            })
            .catch(() => { /* backend not writing news.json yet; benign */ })
            .finally(() => { _pollInflight = false; });
    }

    function pruneExpiredEvents() {
        const ids = Object.keys(eventsById);
        let removed = 0, fading = 0;
        ids.forEach(eid => {
            const ev = eventsById[eid];
            if (isEventExpired(ev)) {
                removeEventMarker(eid);
                removed++;
            } else if (isEventNearExpiry(ev)) {
                const m = eventMarkers[eid];
                const el = m && m.getElement && m.getElement();
                if (el && !el.classList.contains('ev-near-expiry')) {
                    el.classList.add('ev-near-expiry');
                    fading++;
                }
            }
        });
        if (removed > 0 || fading > 0) {
            console.info(`[news-pipe] expiry sweep: ${removed} removed, ${fading} fading (mode=${_ttlMode})`);
        }
        if (removed > 0) renderNewsList();
    }

    function pulseMarker(marker) {
        const el = marker.getElement && marker.getElement();
        if (!el) return;
        el.classList.add('ev-pulse');
        setTimeout(() => el && el.classList.remove('ev-pulse'), 1800);
    }

    function rebuildAllLabels() {
        rebuildCountryLabels();
        rebuildCityLabels();
        rebuildWaterLabels();
        // roads is a tile layer — no theming needed, just add/remove
    }

    function rebuildCityLabels() {
        if (cityLabelGroup) { map.removeLayer(cityLabelGroup); cityLabelGroup = null; }
        if (!labelState.cities) return;
        ensureCityData().then(() => {
            if (!labelState.cities) return;
            refreshVisibleCities();
        }).catch(e => console.error('city labels:', e));
    }

    function rebuildCountryLabels() {
        if (countryLabelGroup) { map.removeLayer(countryLabelGroup); countryLabelGroup = null; }
        if (!labelState.countries) return;
        const theme = currentTheme();

        ensureCountryData().then(data => {
            if (!labelState.countries) return; // user toggled off mid-fetch
            countryLabelGroup = L.layerGroup();
            data.forEach(c => {
                const minZ = c.rank <= 2 ? 2 : c.rank <= 4 ? 3 : c.rank <= 6 ? 4 : c.rank <= 8 ? 5 : 6;
                const trName = localizedName(c).toUpperCase();
                const natName = (c.names.en || c.name).toUpperCase();
                // EVERY country is clickable — has-info kept as interaction hint.
                const html = bilingualHtml(trName, natName, 'geo-country geo-theme-' + theme + ' has-info');
                const m = L.marker([c.lat, c.lng], {
                    interactive: true, keyboard: false,
                    icon: L.divIcon({ className: 'geo-marker', html, iconSize: [0, 0], iconAnchor: [0, 0] })
                });
                m._labelMinZoom = minZ;
                m._labelType = 'country';
                m._labelData = c;
                // Country labels are no longer clickable for info — the custom
                // country-info panel (government/military/economy) was removed.
                // This is a general news app, not a geopolitics dashboard.
                countryLabelGroup.addLayer(m);
            });
            countryLabelGroup.addTo(map);
            applyLabelZoomFilter();
        }).catch(e => console.error('country labels:', e));
    }

    function rebuildWaterLabels() {
        if (waterLabelGroup) { map.removeLayer(waterLabelGroup); waterLabelGroup = null; }
        if (!labelState.water) return;
        const theme = currentTheme();
        waterLabelGroup = L.layerGroup();
        WATER_BODIES.forEach(wb => {
            const trName = localizedWaterName(wb);
            const natName = wb.name; // English reference
            const innerClass = `water-label water-label-${wb.type} geo-theme-${theme}`;
            const html = bilingualHtml(trName, natName, innerClass);
            const marker = L.marker([wb.lat, wb.lng], {
                interactive: true, keyboard: false,
                icon: L.divIcon({ className: 'geo-marker', html, iconSize: [0, 0], iconAnchor: [0, 0] })
            });
            marker._labelMinZoom = wb.minZ;
            // Place-info popup removed per user request — clicking a water label
            // no longer pops anything (it just swallows the click).
            marker.on('click', e => { L.DomEvent.stopPropagation(e); });
            waterLabelGroup.addLayer(marker);
        });
        waterLabelGroup.addTo(map);
        applyLabelZoomFilter();
    }

    function redrawEntryLayers(entry) {
        const pts = entry.info.points.map(p => [p.lat, p.lng]);

        if (entry.line) { map.removeLayer(entry.line); entry.line = null; }
        if (entry.poly) { map.removeLayer(entry.poly); entry.poly = null; }

        if (pts.length >= 2) {
            entry.line = L.polyline(pts, { ...MEASURE_STYLE, renderer: measureRenderer }).addTo(map);
        }
        if (entry.mode === 'area' && pts.length >= 3) {
            entry.poly = L.polygon(pts, { ...MEASURE_POLY_STYLE, renderer: measureRenderer }).addTo(map);
        }

        // Recalculate
        let d = 0;
        for (let i = 1; i < entry.info.points.length; i++) d += haversine(entry.info.points[i - 1], entry.info.points[i]);
        entry.info.distance = d;
        if (entry.mode === 'area' && entry.info.points.length >= 3) entry.info.area = sphericalArea(entry.info.points);

        bindEntryClick(entry);
    }

    function refreshVisibleCities() {
        clearTimeout(_cityRefreshTimer);
        _cityRefreshTimer = setTimeout(() => {
            if (!labelState.cities || !cityData || !map) return;
            const theme = currentTheme();
            const bounds = map.getBounds();
            const zoom = map.getZoom();
            const budget = cityBudget(zoom);

            // Collect visible candidates (sorted insertion by rank — low scalerank
            // wins, so world cities survive budget clipping at every zoom level).
            const visible = [];
            for (let i = 0; i < cityData.length; i++) {
                const c = cityData[i];
                if (zoom < cityMinZoom(c.rank)) continue;
                if (!bounds.contains([c.lat, c.lng])) continue;
                visible.push(c);
            }
            visible.sort((a, b) => a.rank - b.rank);
            const toShow = visible.length > budget ? visible.slice(0, budget) : visible;

            if (cityLabelGroup) { map.removeLayer(cityLabelGroup); cityLabelGroup = null; }
            cityLabelGroup = L.layerGroup();
            toShow.forEach(c => {
                const trName = escapeHtml(localizedName(c));
                const natName = escapeHtml(c.names.en || c.name);
                const showNat = natName && natName !== trName;
                // Dot lives inside .geo-bi-tr so it inherits the correct color.
                const natSpan = showNat ? `<span class="geo-bi-nat">${natName}</span>` : '';
                const html = `<span class="geo-inner geo-city geo-theme-${theme}">` +
                    `<span class="geo-bi-tr"><i class="geo-city-dot"></i>${trName}</span>` +
                    natSpan + `</span>`;
                const m = L.marker([c.lat, c.lng], {
                    interactive: true, keyboard: false,
                    icon: L.divIcon({ className: 'geo-marker', html, iconSize: [0, 0], iconAnchor: [0, 0] })
                });
                m._labelType = 'city';
                m._labelData = c;
                m._labelMinZoom = cityMinZoom(c.rank);
                m.on('click', e => {
                    L.DomEvent.stopPropagation(e);
                    openPlacePanel(c, 'city');
                });
                cityLabelGroup.addLayer(m);
            });
            cityLabelGroup.addTo(map);
            scheduleLabelCollision();
        }, 90);
    }

    function removeArsenalRange(id) {
        const idx = arsenalRanges.findIndex(r => r.id === id);
        if (idx < 0) return;
        const r = arsenalRanges[idx];
        if (r.main && map) map.removeLayer(r.main);
        if (r.blast && map) map.removeLayer(r.blast);
        if (r.radiusLine && map) map.removeLayer(r.radiusLine);
        if (r.radiusLabel && map) map.removeLayer(r.radiusLabel);
        if (r.marker && map) map.removeLayer(r.marker);
        arsenalRanges.splice(idx, 1);
        _updateRangesInfo();
        _restackRangeTags();
        // Re-render the active list inside the arsenal panel if open
        if (document.getElementById('arsenal-panel')?.classList.contains('open')) {
            renderArsenalList();
        }
    }

    function removeEventMarker(eventId) {
        const idx = orderedEventIds.indexOf(eventId);
        if (idx !== -1) orderedEventIds.splice(idx, 1);
        fadeRemoveMarker(eventId);
        delete eventsById[eventId];
    }

    function renderCountryPanel(info, displayName, originalName, isLoading) {
        const panel = document.getElementById('country-info-panel');
        if (!panel) return;
        const tr = displayName || info.name;
        const orig = originalName && originalName !== tr ? originalName : '';
        panel.querySelector('.ci-name').textContent = (tr || '').toUpperCase();
        const sub = panel.querySelector('.ci-name-sub');
        sub.textContent = orig;
        sub.classList.toggle('visible', !!orig);

        const flagEl = panel.querySelector('.ci-flag');
        flagEl.classList.remove('visible');
        flagEl.removeAttribute('src');
        // Try ISO from cached REST data first, else from emoji flag.
        let iso2 = (info.cca2 || '').toLowerCase();
        if (!iso2) {
            iso2 = (info.flag || '').replace(/[\uD83C\uDDE6-\uDDFF]/g, m => {
                const c = m.codePointAt(0) - 0x1F1E6 + 65;
                return String.fromCharCode(c);
            }).toLowerCase();
        }
        if (/^[a-z]{2}$/.test(iso2)) {
            flagEl.src = `https://flagcdn.com/w80/${iso2}.png`;
            flagEl.alt = info.name;
            flagEl.onload = () => flagEl.classList.add('visible');
            flagEl.onerror = () => flagEl.classList.remove('visible');
        }

        const placeholder = isLoading ? '…' : (T[currentLang] && T[currentLang].noData) || '—';
        const rows = [
            ['ci-system', info.system],
            ['ci-leader', info.leader],
            ['ci-capital', info.cap || info.capital],
            ['ci-pop', info.pop],
            ['ci-area', info.area],
            ['ci-gdp', info.gdp],
            ['ci-gdp-pc', info.gdp_pc],
            ['ci-currency', info.currency],
            ['ci-gfp', info.gfp ? `#${info.gfp}` : null],
            ['ci-mil-active', info.mil_active],
            ['ci-mil-reserve', info.mil_reserve],
            ['ci-nukes', info.nukes != null ? (info.nukes > 0 ? `Yes — ${info.nukes}` : 'No') : null],
            ['ci-alliances', info.alliances],
        ];
        rows.forEach(([id, val]) => {
            const el = panel.querySelector('#' + id);
            if (el) el.textContent = (val == null || val === '') ? placeholder : String(val);
        });

        panel.classList.add('open');
    }

    function renderNewsList() {
        // Single unified "Noticias" feed: every item in `newsItems` — Telegram channel
        // posts AND RSS news-outlet articles — listed together, newest first. The map
        // always shows every icon regardless; the only tab now is Noticias vs Fuentes.
        if (newsSource !== 'news') return;
        const list = document.getElementById('news-list');
        if (!list) return;
        const slice = [];
        for (let idx = 0; idx < newsItems.length && slice.length < MAX_NEWS_RENDER; idx++) {
            const it = newsItems[idx];
            if (geoFeed.isChannelHidden(it.channel)) continue;
            slice.push({ item: it, idx });
        }
        list.innerHTML = slice.map(({ item, idx }, i) => {
            const time = item.timestamp ? item.timestamp.substring(11, 16) : '';
            const date = item.timestamp ? item.timestamp.substring(5, 10) : '';
            const channel = escapeHtml(item.channel || '');
            const icon = item.event_icon || '';
            const isEvent = !!item.event_id && item.event_cat !== 'other';
            const label = isEvent ? escapeHtml(_translateEventLabel(item)) : '';
            const loc = isEvent && item.location ? escapeHtml(item.location) : '';
            const clean = _cleanMessage(item.message);
            const text = escapeHtml(clean);
            const longText = clean.length > 220;
            const hasGeo = item.lat != null && item.lng != null;

            // Media gallery (supports Telegram albums) — first 4 shown, rest as +N.
            const media = _newsMediaList(item);
            let mediaHtml = '';
            if (media.length) {
                const shown = media.slice(0, 4);
                const extra = media.length - shown.length;
                // data-media-list / data-media-src/type/index match what
                // mediaViewer's delegated click handler reads to open the lightbox.
                mediaHtml = `<div class="news-media-gallery count-${Math.min(media.length, 4)}" data-media-list="${escapeHtml(JSON.stringify(media))}">` +
                    shown.map((m, mi) => {
                        const isVid = m.type === 'video';
                        const more = (mi === shown.length - 1 && extra > 0)
                            ? `<div class="news-media-more">+${extra}</div>` : '';
                        const inner = isVid
                            ? `<video class="news-media" src="${escapeHtml(m.path)}" preload="none" muted></video>`
                            : `<img class="news-media" loading="lazy" src="${escapeHtml(m.path)}" alt="">`;
                        return `<div class="news-media-wrap${isVid ? ' is-video' : ''}" data-media-src="${escapeHtml(m.path)}" data-media-type="${isVid ? 'video' : 'photo'}" data-media-index="${mi}">${inner}${more}</div>`;
                    }).join('') +
                    `</div>`;
            }

            const eventTag = isEvent
                ? `<div class="news-event-tag"><span class="ev-ico">${icon}</span><span class="ev-lbl">${label}</span>${loc ? `<span class="ev-loc">${loc}</span>` : ''}</div>`
                : '';

            const outletLink = (item.is_outlet && item.link)
                ? `<a class="news-outlet-link" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">↗ ${channel || 'Fuente'}</a>`
                : '';
            // Stable per-item id for selection + context menu (event_id when present).
            const selId = item.event_id || ('gf-idx-' + idx);
            const isSel = _newsSel.has(selId);
            return `<div class="news-item${isEvent ? ' has-event' : ''}${isSel ? ' is-selected' : ''}" data-idx="${i}"${hasGeo ? ` data-geo="${idx}"` : ''}${item.event_id ? ` data-event-id="${escapeHtml(item.event_id)}"` : ''} data-news-id="${escapeHtml(selId)}">
                <button class="news-item-check" data-news-check="${escapeHtml(selId)}" title="${escapeHtml((T[currentLang] || T.en).newsSelect || 'Seleccionar')}" aria-label="${escapeHtml((T[currentLang] || T.en).newsSelect || 'Seleccionar')}">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
                <div class="news-item-top">
                    <span class="news-channel">${icon ? icon + ' ' : ''}${channel}</span>
                    <span class="news-item-time">${date} ${time}</span>
                </div>
                ${eventTag}
                ${mediaHtml}
                <div class="news-item-text${longText ? ' collapsible' : ''}">${text}</div>
                ${longText ? `<button class="news-expand-btn" data-expand="${i}">${(T[currentLang] || T.en).showMore || 'Mostrar más'}</button>` : ''}
                ${outletLink}
            </div>`;
        }).join('');
        // Re-assert a recent map-icon focus so this re-render (often a live WS
        // update) doesn't drop the scroll/highlight — the cause of needing
        // several clicks before the article actually came into view.
        _applyNewsFocus(false);
    }

    function renderSearchResults(items) {
        const results = document.getElementById('search-results');
        if (!items || !items.length) { results.style.display = 'none'; return; }

        results.innerHTML = items.map(item => {
            const parts = (item.display_name || '').split(',');
            const name = escapeHtml(parts.slice(0, 2).join(',').trim());
            const rest = parts.length > 2 ? escapeHtml(parts.slice(2, 4).map(s => s.trim()).join(', ')) : '';
            const typeTag = escapeHtml(item.type || item.class || '');
            return `<div class="sr-item" tabindex="0"
                data-lat="${item.lat}" data-lon="${item.lon}"
                data-bb='${JSON.stringify(item.boundingbox || [])}'>
                <div class="sr-name">${name}${rest ? `<span style="color:var(--muted);font-size:0.68rem">, ${rest}</span>` : ''}</div>
                ${typeTag ? `<div class="sr-type">${typeTag}</div>` : ''}
            </div>`;
        }).join('');

        results.querySelectorAll('.sr-item').forEach(el => {
            el.addEventListener('click', selectSearchResult.bind(null, el));
            el.addEventListener('keydown', e => { if (e.key === 'Enter') selectSearchResult(el); });
        });
        results.style.display = 'block';
    }

    function restyleBorders() {
        if (!bordersLayer) return;
        const style = BORDERS_STYLE[currentLayer] || BORDERS_STYLE.satellite;
        bordersLayer.setStyle(style);
    }

    function roadsOpacityForZoom(z) {
        return Math.max(0, Math.min(1, (z - 5) / 4));
    }

    function runMapSimulation(opts) {
         const layer = L.layerGroup().addTo(map);
         _simState = { opts, layer, missiles: [], blastCircles: [], stats: { fired, intercepted: 0, impacted: 0 } };
         
         const start = L.latLng(attacker.lat, attacker.lng);
         const end = L.latLng(target.lat, target.lng);
         const bounds = L.latLngBounds([start, end]).pad(0.5);
         map.flyToBounds(bounds, { duration: 1.2, padding: [60, 60] });
         
         // Pulsing origin/target markers
         L.marker([attacker.lat, attacker.lng], { icon: originIcon, pane }).addTo(layer);
         L.marker([target.lat, target.lng], { icon: targetIcon, pane }).addTo(layer);
         
         const { results, usage } = _resolveInterceptions(quantity, weapon, activeDefenses);
         
         // Stagger missile launches every 250ms
         setTimeout(() => {
           results.forEach((res, i) => {
             setTimeout(() => _spawnMissile(res, i, start, end, weapon, mtype, baseFlightTime, blastKm, target), i * 250);
           });
         }, 1500);
         
         setTimeout(() => _finishSimulation(), 1500 + quantity * 250 + baseFlightTime + 1500);
       }

    function runOrphanGC() {
        const t0 = performance.now();
        const alive = new Set(Object.keys(eventMarkers));
        let removedRefs = 0;
        for (const eid of Object.keys(eventsById)) {
            if (!alive.has(eid)) { delete eventsById[eid]; removedRefs++; }
        }
        for (const eid of Object.keys(userIconOffset)) {
            if (!alive.has(eid)) { delete userIconOffset[eid]; removedRefs++; }
        }
        for (const eid of Object.keys(dispersionLines)) {
            if (!alive.has(eid)) {
                _removeDispersionLine(eid); removedRefs++;
            }
        }
        for (const eid of Object.keys(eventClusterKey)) {
            if (!alive.has(eid)) { delete eventClusterKey[eid]; removedRefs++; }
        }
        // Drop empty dispersion groups
        for (const k of Object.keys(dispersionGroups)) {
            if (!dispersionGroups[k] || dispersionGroups[k].length === 0) {
                delete dispersionGroups[k];
                _removeCenterDot(k);
            }
        }
        // Cull spatial-index entries for dead events
        const indexedIds = Array.from(_spatialIndex.keys());
        for (const eid of indexedIds) {
            if (!alive.has(eid)) { _spatialIndexRemove(eid); removedRefs++; }
        }
        // Drop newsById entries whose event is gone
        for (const eid of Object.keys(newsById)) {
            if (!alive.has(eid) && !eventsById[eid]) {
                delete newsById[eid]; removedRefs++;
            }
        }
        const dt = (performance.now() - t0).toFixed(1);
        console.info(`[news-pipe] GC: pruned ${removedRefs} orphan refs in ${dt}ms (markers=${alive.size}, news=${newsItems.length}, iconCache=${_iconHtmlCache.size})`);
    }

    function scheduleLabelCollision() {
           if (_collisionRAF) return;
           _collisionRAF = requestAnimationFrame(() => {
               _collisionRAF = null;
               applyLabelCollision();
           });
       }

    function scheduleNewsRender() {
        if (_renderNewsScheduled) return;
        _renderNewsScheduled = true;
        // setTimeout (not rAF) so the feed still renders when the tab is in the
        // background — rAF is throttled/paused on hidden tabs.
        setTimeout(() => {
            _renderNewsScheduled = false;
            renderNewsList();
            // Keep the Favorite Topics Box reader live while it's open.
            try { if (typeof favBox !== 'undefined' && favBox._renderHook) favBox._renderHook(); } catch (_) {}
        }, 60);
    }

    function scheduleRenderNewsList() {
        if (_renderNewsScheduled) return;
        _renderNewsScheduled = true;
        const run = () => { _renderNewsScheduled = false; renderNewsList(); };
        if (typeof requestAnimationFrame === 'function' && !document.hidden) {
            requestAnimationFrame(run);
        } else {
            setTimeout(run, 16);
        }
    }

    // ── Phase 3: news outlets (RSS) ──
    function wireNewsSourceTabs() {
        document.querySelectorAll('.news-src-tab').forEach(tab => {
            tab.addEventListener('click', () => setNewsSource(tab.dataset.src));
        });
    }

    function setNewsSource(src) {
        if (src !== 'news' && src !== 'sources') return;
        newsSource = src;
        document.querySelectorAll('.news-src-tab').forEach(t =>
            t.classList.toggle('active', t.dataset.src === src));
        // Two panes now: the unified "Noticias" feed (Telegram posts + RSS outlet
        // stories together) and the "Fuentes" manager. The map always shows every
        // icon regardless — the tab switch only affects which sidebar pane is shown.
        const body = document.getElementById('news-body');
        const sources = document.getElementById('user-src-panel');
        if (src === 'sources') {
            if (body) body.style.display = 'none';
            if (sources) sources.style.display = 'block';
            renderUserSourcesList();
            const input = document.getElementById('usp-input');
            if (input) input.focus();
        } else {
            if (sources) sources.style.display = 'none';
            if (body) body.style.display = '';
            renderNewsList();   // single render path handles both telegram + outlets tabs
        }
    }

    async function fetchOutlets() {
        if (_outletsLoading) return;
        _outletsLoading = true;
        const list = document.getElementById('news-list');
        if (list) list.innerHTML = `<div class="news-status">${escapeHtml(t('outletsLoading') || 'Cargando noticieros…')}</div>`;
        try {
            const res = await fetch('/api/outlets');
            const data = await res.json();
            _outletsData = data;
            if (newsSource === 'outlets') renderOutletsList();
        } catch (e) {
            if (newsSource === 'outlets' && list) {
                list.innerHTML = `<div class="news-status news-status-err">${escapeHtml(t('outletsError') || 'No se pudieron cargar los noticieros.')}</div>`;
            }
        } finally {
            _outletsLoading = false;
        }
    }

    function renderOutletsList() {
        const list = document.getElementById('news-list');
        if (!list) return;
        const arts = (_outletsData && _outletsData.outlets) || [];
        if (!arts.length) {
            list.innerHTML = `<div class="news-status">${escapeHtml(t('outletsEmpty') || 'Sin artículos disponibles.')}</div>`;
            return;
        }
        list.innerHTML = arts.map(a => {
            const src = escapeHtml(a.source || '');
            const title = escapeHtml(_decodeEntities(a.title || ''));
            const summary = escapeHtml(_decodeEntities(a.summary || ''));
            const link = escapeHtml(a.link || '#');
            const when = a.published ? escapeHtml(String(a.published).slice(0, 22)) : '';
            return `<div class="news-item outlet-item">
                <div class="outlet-hdr"><span class="outlet-src">${src}</span><span class="outlet-when">${when}</span></div>
                <a class="outlet-title" href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
                ${summary ? `<div class="outlet-summary">${summary}</div>` : ''}
            </div>`;
        }).join('');
    }

    function selectSearchResult(el) {
        const lat = parseFloat(el.dataset.lat);
        const lon = parseFloat(el.dataset.lon);
        let bb;
        try { bb = JSON.parse(el.dataset.bb); } catch (e) { bb = []; }
        if (bb && bb.length === 4) {
            map.fitBounds([[parseFloat(bb[0]), parseFloat(bb[2])], [parseFloat(bb[1]), parseFloat(bb[3])]],
                { maxZoom: 14 });
        } else {
            map.setView([lat, lon], 12);
        }
        const nameEl = el.querySelector('.sr-name');
        if (nameEl) document.getElementById('search-input').value = nameEl.textContent.trim();
        document.getElementById('search-results').style.display = 'none';
    }

    function setBaseLayer(name) {
        if (baseLayer) map.removeLayer(baseLayer);
        currentLayer = name;

        // Prefer Google Maps (exact imagery + Google's zoom-dependent labels) via
        // GoogleMutant. If the Google Maps API hasn't loaded (no/invalid key), fall
        // back to the original Esri/CARTO raster tiles so the map still renders.
        // 'satellite-esri' is the user's classic Esri imagery — always raster, never Google.
        const forceRaster = (name === 'satellite-esri');
        const gReady = !forceRaster && !_gmapsAuthFailed && !!(window.google && window.google.maps &&
                          L.gridLayer && L.gridLayer.googleMutant);
        if (gReady) {
            const typeMap = _noLabels ? GMAP_TYPE_NOLAB : GMAP_TYPE;
            const gOpts = {
                type: typeMap[name] || 'hybrid',
                maxZoom: 21,
                // Tile-smoothing (GridLayer options honoured by GoogleMutant):
                // defer tile fetches until the zoom animation settles and keep a
                // large off-screen buffer so panning/zooming reveals far fewer
                // empty slots — this is what kills the "black squares" flashing.
                updateWhenZooming: false,
                updateWhenIdle: false,
                keepBuffer: 6,
            };
            // Layer-specific Google Maps `styles` (dark theme + optional label hiding).
            // Roadmap-type layers (dark/light) need explicit label-hiding rules because
            // Google's 'satellite' subtype trick that works for the satellite layer does
            // nothing on roadmap — labels stay unless we hide them via `styles`.
            let styles = [];
            if (name === 'dark') styles = styles.concat(GMAP_DARK_STYLES);
            if (_noLabels && (name === 'dark' || name === 'light' || name === 'terrain')) {
                styles = styles.concat(GMAP_HIDE_LABELS_STYLES);
            }
            if (styles.length) gOpts.styles = styles;
            // Pass the current UI language so Google's labels (when shown) render in it.
            if (typeof _currentMapLang === 'function') gOpts.language = _currentMapLang();
            baseLayer = L.gridLayer.googleMutant(gOpts).addTo(map);
        } else {
            const def = LAYERS[name] || LAYERS.satellite;
            baseLayer = L.tileLayer(def.url, {
                attribution: def.attr,
                maxZoom: 19,
                detectRetina: true,
                updateWhenIdle: false,
                updateWhenZooming: false,  // defer tile fetches until zoom anim completes — kills mid-zoom flicker
                keepBuffer: 8,             // larger off-screen buffer eliminates seams during pan
                crossOrigin: true          // enables GPU-friendly compositing on tiles
            }).addTo(map);
        }

        // Classic Esri satellite stays as pure imagery — no place-name labels by default.
        if (esriLabelsLayer) { map.removeLayer(esriLabelsLayer); esriLabelsLayer = null; }

        document.querySelectorAll('.radio-opt').forEach(o =>
            o.classList.toggle('active', o.dataset.layer === name)
        );

        // Scale bar color follows the base layer for readability
        document.body.classList.toggle('scale-dark', name === 'light');
        document.body.classList.toggle('scale-light', name !== 'light');

        // Borders toggle is allowed on every base layer; the style adapts per-layer
        // so contrast stays strong (white on satellite/dark, black on light).
        const bordersSection = document.getElementById('borders-section');
        if (bordersSection) bordersSection.classList.remove('hidden');
        restyleBorders();

        // Re-theme any visible label categories so colours/halos match the new base
        rebuildAllLabels();
    }

    function setEventsEnabled(on) {
        eventsEnabled = !!on;
        ensureEventPane();
        if (eventsEnabled) {
            if (dispersionLineLayer && !map.hasLayer(dispersionLineLayer)) dispersionLineLayer.addTo(map);
            if (!map.hasLayer(eventLayer)) eventLayer.addTo(map);
            if (_clusterLayer && !map.hasLayer(_clusterLayer)) _clusterLayer.addTo(map);
            _scheduleClusterRebuild();
        } else {
            if (dispersionLineLayer && map.hasLayer(dispersionLineLayer)) map.removeLayer(dispersionLineLayer);
            if (map.hasLayer(eventLayer)) map.removeLayer(eventLayer);
            if (_clusterLayer && map.hasLayer(_clusterLayer)) map.removeLayer(_clusterLayer);
        }
    }

    function setRoads(show) {
        if (!show) {
            if (roadsLayer) { map.removeLayer(roadsLayer); roadsLayer = null; }
            return;
        }
        if (roadsLayer) return;
        ensureRoadsPane();
        roadsLayer = L.tileLayer(ROADS_TILE_URL, {
            pane: 'roadsPane',
            maxZoom: 19,
            detectRetina: true,
            crossOrigin: true,
            updateWhenZooming: false,
            keepBuffer: 6,
            opacity: roadsOpacityForZoom(map.getZoom())
        }).addTo(map);
    }

    let arsenalRanges = [];
    let _arsRangeSeq = 0;

    // Render the weapon list for the currently-selected country + category.
    function renderArsenalList() {
        const list = document.getElementById('ars-list');
        const simEl = document.getElementById('ars-simulator');
        if (!list) return;
        if (arsenalCurrentCat === 'simulator') {
            list.style.display = 'none';
            if (simEl) simEl.style.display = '';
            return;
        }
        list.style.display = '';
        if (simEl) simEl.style.display = 'none';

        const country = ARSENAL_DATA[arsenalCurrentCountry];
        if (!country) { list.innerHTML = '<div class="ars-empty">Sin datos</div>'; return; }
        const items = country[arsenalCurrentCat] || [];
        if (!items.length) { list.innerHTML = '<div class="ars-empty">Sin armamento en esta categoría</div>'; return; }

        const order = (typeof MISSILE_MTYPE_ORDER !== 'undefined') ? MISSILE_MTYPE_ORDER : {};
        const sorted = items.map((w, i) => ({ w, i })).sort((a, b) => {
            const oa = order[a.w.mtype] ?? 99, ob = order[b.w.mtype] ?? 99;
            if (oa !== ob) return oa - ob;
            return (b.w.range || 0) - (a.w.range || 0);
        });

        let html = '';
        sorted.forEach(({ w, i }) => {
            const color = (typeof MISSILE_COLORS !== 'undefined' && MISSILE_COLORS[w.mtype]) || '#8fd3ff';
            const typeAbbr = w.type || '';
            const fullName = (typeof MISSILE_ABBR !== 'undefined' && MISSILE_ABBR[typeAbbr]) || typeAbbr;
            const rangeStr = w.range ? `${fmtNum(w.range)} km` : '—';
            const catLabel = (w.cat === 'sa') ? 'DEFENSA' : (w.cat === 'as') ? 'AIRE' : 'TIERRA';
            const active = arsenalRanges.some(r => r.countryKey === arsenalCurrentCountry && r.cat === arsenalCurrentCat && r.idx === i);
            html += `<div class="ars-item${active ? ' ars-item-active' : ''}" data-idx="${i}">
                <div class="ars-item-hdr">
                    <span class="ars-color-dot" style="background:${color}"></span>
                    <span class="ars-item-name">${escapeHtml(w.name)}</span>
                    <span class="ars-item-cat">${catLabel}</span>
                </div>
                <div class="ars-item-meta">
                    <span class="ars-item-type" title="${escapeHtml(fullName)}">${escapeHtml(typeAbbr)}</span>
                    <span class="ars-item-range">${rangeStr}</span>
                    <span class="ars-item-speed">${escapeHtml(w.speed || '')}</span>
                </div>
                <div class="ars-item-details">
                    <span>Ojiva: ${escapeHtml(w.warhead || '—')}</span>
                    <span>Guía: ${escapeHtml(w.guidance || '—')}</span>
                </div>
                <div class="ars-item-actions">
                    <button class="ars-range-btn" data-range-idx="${i}">${active ? '✕ Quitar alcance' : '📍 Ver alcance'}</button>
                </div>
            </div>`;
        });
        list.innerHTML = html;

        if (!list._rangeWired) {
            list._rangeWired = true;
            list.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-range-idx]');
                if (!btn) return;
                const idx = parseInt(btn.dataset.rangeIdx, 10);
                const existing = arsenalRanges.find(r => r.countryKey === arsenalCurrentCountry && r.cat === arsenalCurrentCat && r.idx === idx);
                if (existing) { removeArsenalRange(existing.id); }
                else { _addArsenalRange(arsenalCurrentCountry, arsenalCurrentCat, idx); }
                renderArsenalList();
            });
        }
    }

    // Build a range record for a weapon and render it on the map.
    function _addArsenalRange(countryKey, cat, idx) {
        const country = ARSENAL_DATA[countryKey];
        if (!country) return;
        const weapon = (country[cat] || [])[idx];
        if (!weapon || !weapon.range) return;
        const color = (typeof MISSILE_COLORS !== 'undefined' && MISSILE_COLORS[weapon.mtype]) || '#8fd3ff';
        const accent = (typeof COUNTRY_ACCENT !== 'undefined' && COUNTRY_ACCENT[countryKey]) || color;
        const range = {
            id: ++_arsRangeSeq, countryKey, cat, idx,
            country, weapon, lat: country.lat, lng: country.lng,
            color, accent,
        };
        arsenalRanges.push(range);
        try { _drawRange(range); } catch (_) {}
        try { range.marker = _installOriginMarker(country, [country.lat, country.lng], range); } catch (_) {}
        try { _updateRangesInfo(); } catch (_) {}
        try { _restackRangeTags(); } catch (_) {}
    }

    function setupArsenalUI() {
        const openBtn = document.getElementById('open-arsenal');
        if (openBtn) openBtn.addEventListener('click', () => {
            const panel = document.getElementById('arsenal-panel');
            if (panel && panel.classList.contains('open')) closeArsenal();
            else openArsenal();
        });

        const closeBtn = document.getElementById('ars-close');
        if (closeBtn) closeBtn.addEventListener('click', closeArsenal);

        const backBtn = document.getElementById('ars-back');
        if (backBtn) backBtn.addEventListener('click', closeArsenal);

        // (Bulk "clear all" was removed by user request — each range is
        // deleted individually via the ✕ on the origin marker or in the
        // active-ranges list.)

        const countrySelect = document.getElementById('ars-country');
        if (countrySelect) {
            countrySelect.addEventListener('change', () => {
                arsenalCurrentCountry = countrySelect.value;
                const c = ARSENAL_DATA[arsenalCurrentCountry];
                const flagEl = document.getElementById('ars-flag');
                if (flagEl && c) flagEl.textContent = c.flag;
                renderArsenalList();
            });
        }

        const catBtns = document.querySelectorAll('.ars-cat');
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                arsenalCurrentCat = btn.dataset.cat;
                if (btn.dataset.cat === 'simulator') {
                    showSimulator();
                } else {
                    hideSimulator();
                    renderArsenalList();
                }
            });
        });

        initSimulator();
    }

    function show(html, iconX, iconY) {
            _ensureEl();
            _el.innerHTML = html;
            _el.style.display = 'block';
            _el.style.transform = 'translate3d(-9999px,0,0)';
            const rect = _el.getBoundingClientRect();
            const ttW = rect.width;
            const ttH = rect.height;
            const vw = window.innerWidth;
            const gap = 8;
            const iconH = 36;
            let ty = iconY - iconH - ttH - gap;
            if (ty < 4) ty = iconY + gap;
            let tx = iconX - ttW / 2;
            if (tx < 4) tx = 4;
            if (tx + ttW > vw - 4) tx = vw - 4 - ttW;
            _el.style.transform = `translate3d(${tx}px,${ty}px,0)`;
        }

    function showContextMenu(x, y) {
        const cm = document.getElementById('context-menu');
        cm.style.display = 'block';
        placeContextMenu(x, y);
    }

    function showCountryInfoPopup(info, latlng, cp, displayName, originalName) {
        renderCountryPanel(info, displayName, originalName, false);
    }

    function showMeasureInfo(id, cp) {
        const entry = measureHistory.find(e => e.id === id);
        if (!entry) return;

        currentPopupMeasureId = id;
        const popup = document.getElementById('loc-popup');
        popup.dataset.measurePopup = '1';
        const flag = document.getElementById('lp-flag');
        flag.classList.remove('visible');
        flag.removeAttribute('src');

        const isArea = entry.mode === 'area';
        document.getElementById('lp-name').textContent = isArea ? t('measureArea') : t('measureLine');
        document.getElementById('lp-type').textContent = isArea ? '◊' : '─';
        document.getElementById('lp-country').textContent = fmtDist(entry.info.distance);
        document.getElementById('lp-pop').textContent = entry.info.area ? fmtArea(entry.info.area) : '—';
        document.getElementById('lp-area').textContent = entry.info.points.length;
        document.getElementById('lp-coords').textContent = '—';

        document.querySelector('[data-i18n="lpType"]').textContent = 'Tipo';
        document.querySelector('[data-i18n="lpCountry"]').textContent = t('distance');
        document.querySelector('[data-i18n="lpPop"]').textContent = isArea ? t('area') : '—';
        document.querySelector('[data-i18n="lpArea"]').textContent = t('points');
        document.querySelector('[data-i18n="lpCoords"]').textContent = 'Coords';

        document.getElementById('lp-clear-btn').style.display = 'block';
        popup.style.display = 'block';
        placePopup(cp ? cp.x : window.innerWidth / 2, cp ? cp.y : window.innerHeight / 2);
    }

    function showRangeContextMenu(x, y, rangeId) {
        let menu = document.getElementById('range-cm');
        if (!menu) return;
        const r = arsenalRanges.find(rr => rr.id === rangeId);
        if (!r) return;
        // Populate label with weapon name + country flag
        const lbl = menu.querySelector('.range-cm-label');
        if (lbl) lbl.innerHTML = `${r.country.flag || ''} ${escapeHtml(r.weapon.name)}`;
        const delBtn = menu.querySelector('.range-cm-delete');
        if (delBtn) {
            delBtn.dataset.rangeId = String(rangeId);
        }
        const W = 200, H = 88;
        const px = Math.min(window.innerWidth - W - 10, Math.max(10, x));
        const py = Math.min(window.innerHeight - H - 10, Math.max(60, y));
        menu.style.left = px + 'px';
        menu.style.top = py + 'px';
        menu.classList.add('open');
    }

    function showSimulator() {
        const list = document.getElementById('ars-list');
        const sim = document.getElementById('ars-simulator');
        if (list) list.style.display = 'none';
        if (sim) sim.style.display = 'block';
        const rangeInfo = document.getElementById('ars-range-info');
        if (rangeInfo) rangeInfo.style.display = 'none';
        document.body.classList.add('sim-mode');
        // Hide arsenal selectors header (country picker / category buttons) — the
        // simulator has its own self-contained controls.
        const sel = document.querySelector('.ars-selectors .ars-country-row');
        if (sel) sel.style.display = 'none';
        // Land on the appropriate step (results if user has unsaved results
        // from a previous run, otherwise configuration).
        _setSimStep(_simState ? 'running' : (_lastResultsHTML ? 'config' : 'config'));
        // Paint the persistent air-defense coverage layer for the current
        // saved alliance so the analyst sees engagement envelopes at-a-glance.
        try { _renderDefenseRanges(); } catch (_) {}
    }

    function snapToVertex(latlng) {
        if (!measurePts.length) return latlng;
        let best = null, bestDist = SNAP_PX;
        for (let i = 0; i < measurePts.length; i++) {
            const d = pixelDistance(measurePts[i], latlng);
            if (d < bestDist) { bestDist = d; best = i; }
        }
        if (best === null) return latlng;
        return { lat: measurePts[best].lat, lng: measurePts[best].lng, _snapIdx: best };
    }

    function sphericalArea(pts) {
        if (pts.length < 3) return 0;
        const R = 6371000, r = x => x * Math.PI / 180;
        let total = 0;
        for (let i = 0; i < pts.length; i++) {
            const j = (i + 1) % pts.length;
            total += r(pts[j].lng - pts[i].lng) * (2 + Math.sin(r(pts[i].lat)) + Math.sin(r(pts[j].lat)));
        }
        return Math.abs(total * R * R / 2);
    }

    function startMeasure(mode) {
        abandonActiveMeasure(); // only cancel in-progress, keep finished ones
        measureMode = mode;
        measureActive = true;
        measurePts = [];
        previewPos = null;
        map.getContainer().style.cursor = 'crosshair';
        document.getElementById('measure-panel').style.display = 'block';
        document.getElementById('mp-title').textContent = mode === 'line' ? t('measureLine') : t('measureArea');
        document.getElementById('mp-info').innerHTML = '<span class="mp-hint">' + t('clickToPlace') + '</span>';
    }

    function startSimulation() {
        const v = _validateConfig();
        if (!v.ok) { alert(v.msg); return; }

        const exchange = _simAlliance.mode === 'exchange';
        const aSide = _simAlliance.sides.A.countries;
        const bSide = _simAlliance.sides.B.countries;

        // Build threats list (one entry per launched projectile).
        const threats = [];
        const ofSide = (side, countries) => {
            countries.forEach(c => {
                c.weaponGroups.forEach(g => {
                    const weapon = _resolveWeaponFromKey(c.key, g.weaponKey);
                    if (!weapon) return;
                    for (let i = 0; i < g.quantity; i++) {
                        threats.push({
                            attackingSide: side,
                            countryKey: c.key,
                            country: ARSENAL_DATA[c.key],
                            weapon,
                            origin: { lat: g.origin.lat, lng: g.origin.lng },
                            target: { ...g.target },
                            mtype: _classifyMissileType(weapon),
                            blastKm: _computeBlastKm(weapon),
                        });
                    }
                });
            });
        };
        ofSide('A', aSide);
        if (exchange) ofSide('B', bSide);

        // Build defense batteries.
        const batteries = [];
        const defOf = (defendingSide, countries) => {
            countries.forEach(c => {
                c.defenseGroups.forEach(g => {
                    const sys = DEFENSE_SYSTEMS[g.system];
                    if (!sys) return;
                    for (let i = 0; i < g.batteries; i++) {
                        batteries.push({
                            defendingSide,
                            countryKey: c.key,
                            country: ARSENAL_DATA[c.key],
                            system: g.system,
                            sys,
                            position: { lat: g.position.lat, lng: g.position.lng },
                            magazine: sys.magazine,
                            engaged: 0,
                            kills: 0,
                            shots: 0,
                            shotsByType: { ballistic: 0, cruise: 0, drone: 0 },
                            killsByType: { ballistic: 0, cruise: 0, drone: 0 },
                        });
                    }
                });
            });
        };
        defOf('B', bSide);
        if (exchange) defOf('A', aSide);

        // Pre-resolve interception assignments per threat.
        threats.forEach((t, idx) => {
            const vsKey = t.mtype === 'ballistic' ? 'vsBallistic'
                        : t.mtype === 'drone' ? 'vsDrone' : 'vsCruise';
            // Defenders are the OPPOSITE of the attacking side.
            const defenderSide = t.attackingSide === 'A' ? 'B' : 'A';
            const candidates = batteries.filter(b => {
                if (b.defendingSide !== defenderSide) return false;
                if (b.magazine <= 0) return false;
                const d = _haversineKm(t.target, b.position);
                return d <= (b.sys.rangeKm || 200);
            }).sort((a, b) => (b.sys[vsKey] || b.sys.pk) - (a.sys[vsKey] || a.sys.pk));

            t.intercepted = false;
            t.interceptedBy = null;
            for (const b of candidates) {
                if (b.magazine <= 0) continue;
                b.magazine -= 1;
                b.shots += 1;
                b.shotsByType[t.mtype] = (b.shotsByType[t.mtype] || 0) + 1;
                const pk = b.sys[vsKey] || b.sys.pk;
                if (Math.random() < pk) {
                    t.intercepted = true;
                    t.interceptedBy = b;
                    b.kills += 1;
                    b.killsByType[t.mtype] = (b.killsByType[t.mtype] || 0) + 1;
                    break;
                }
            }
            t.idx = idx;
        });

        // ── Setup engine state and map presentation ───────────
        const pane = _simPane();
        const layer = L.layerGroup().addTo(map);
        document.body.classList.add('sim-running');
        document.body.classList.add('sim-mode-active');
        _setSimStep('running');

        _simState = {
            mode: _simAlliance.mode,
            layer, pane,
            missiles: [],
            startTime: performance.now(),
            stats: { fired: threats.length, intercepted: 0, impacted: 0 },
            threats,
            batteries,
            originLabels: [],
        };

        // Frame the map to encompass all origins, targets and batteries.
        const allPts = [];
        threats.forEach(t => { allPts.push(L.latLng(t.origin.lat, t.origin.lng)); allPts.push(L.latLng(t.target.lat, t.target.lng)); });
        batteries.forEach(b => allPts.push(L.latLng(b.position.lat, b.position.lng)));
        if (allPts.length >= 2) {
            const bounds = L.latLngBounds(allPts).pad(0.4);
            map.flyToBounds(bounds, { duration: 1.4, padding: [80, 80], maxZoom: 6 });
        }

        // Hide the panel while simulation runs (the user requested an unobstructed map view).
        const panel = document.getElementById('arsenal-panel');
        if (panel) panel.classList.add('sim-hidden');

        // Place per-country origin pulses + defense battery markers.
        const placedOrigins = new Set();
        threats.forEach(t => {
            const k = `${t.attackingSide}:${t.countryKey}`;
            if (placedOrigins.has(k)) return;
            placedOrigins.add(k);
            const col = t.attackingSide === 'A' ? '#ff4530' : '#36aaff';
            const icon = L.divIcon({
                className: '',
                html: `<div class="sim-origin-pulse" style="--col:${col}">${t.country.flag}</div>`,
                iconSize: [40, 40], iconAnchor: [20, 20],
            });
            L.marker([t.origin.lat, t.origin.lng], { icon, pane, interactive: false }).addTo(layer);
        });

        const placedTargets = new Map();
        threats.forEach(t => {
            const key = `${t.target.lat.toFixed(3)},${t.target.lng.toFixed(3)}`;
            if (placedTargets.has(key)) return;
            placedTargets.set(key, t);
            const col = t.attackingSide === 'A' ? '#ffd699' : '#ffd699';
            const icon = L.divIcon({
                className: '',
                html: `<div class="sim-target-marker" style="--col:${col}"></div>`,
                iconSize: [22, 22], iconAnchor: [11, 11],
            });
            L.marker([t.target.lat, t.target.lng], { icon, pane, interactive: false }).addTo(layer);
        });

        batteries.forEach(b => {
            const col = b.defendingSide === 'B' ? '#36aaff' : '#ff4530';
            const icon = L.divIcon({
                className: '',
                html: `<div class="sim-defense-marker" style="--col:${col}"><span>${b.system.replace(/[^A-Z0-9]/gi,'').slice(0,3)}</span></div>`,
                iconSize: [26, 26], iconAnchor: [13, 13],
            });
            L.marker([b.position.lat, b.position.lng], { icon, pane, interactive: false }).addTo(layer);
            // Range ring (faint)
            L.circle([b.position.lat, b.position.lng], {
                radius: (b.sys.rangeKm || 200) * 1000,
                color: col, weight: 1, opacity: 0.18,
                fillColor: col, fillOpacity: 0.04,
                pane, interactive: false, dashArray: '3,4',
                className: 'sim-defense-ring',
            }).addTo(layer);
        });

        // Show HUD
        const hud = document.getElementById('sim-hud');
        if (hud) hud.style.display = 'block';
        _updateHud();

        // Stagger missile launches (also vary by side so both fire intermixed).
        const launchInterval = Math.max(80, Math.min(420, Math.round(8000 / Math.max(1, threats.length))));
        threats.forEach((t, i) => {
            setTimeout(() => _spawnMissile(t), 1200 + i * launchInterval);
        });

        // Start RAF loop
        if (_simRAF) cancelAnimationFrame(_simRAF);
        _simRAF = requestAnimationFrame(_simTick);

        // Schedule completion check (engine ends naturally when all missiles resolve).
        const totalDur = 1200 + threats.length * launchInterval + 7500;
        _simState.expectedEnd = performance.now() + totalDur;
    }

    function statusDecoratedLabel(label, status) {
        if (!label) return '';
        if (!status) return label;
        const key = {
            ongoing: 'statusOngoing',
            possible: 'statusPossible',
            confirmed: 'statusConfirmed',
            past: 'statusPast',
        }[status];
        const prefix = key ? (T[currentLang] && T[currentLang][key]) || '' : '';
        return prefix ? `${prefix} ${label}` : label;
    }

    function t(k) { return (T[currentLang] || {})[k] || (T.en || {})[k] || (T.es || {})[k] || k; }

    async function toggleBorders(show) {
        bordersVisible = show;
        document.getElementById('tog-borders').querySelector('.chk').classList.toggle('on', show);

        if (!show) {
            if (bordersLayer) { map.removeLayer(bordersLayer); bordersLayer = null; }
            return;
        }

        if (!bordersLayer) {
            try {
                const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json');
                const topo = await res.json();
                // Use mesh to get LINE features only — avoids antimeridian polygon deformations
                const borders = topojson.mesh(topo, topo.objects.countries, (a, b) => a !== b);
                bordersLayer = L.geoJSON(borders, {
                    style: BORDERS_STYLE[currentLayer] || BORDERS_STYLE.satellite
                });
            } catch (e) {
                console.error('Failed to load borders:', e);
                return;
            }
        }

        restyleBorders();
        bordersLayer.addTo(map);
    }

    function updateDefenseList() {
        const targetSel = document.getElementById('sim-target');
        const list = document.getElementById('sim-defense-list');
        if (!list) return;
        list.innerHTML = '';
        const defenses = COUNTRY_DEFENSES[targetSel.value] || [];
        if (defenses.length === 0) {
            list.innerHTML = '<span class="sim-no-def">— Sin sistemas de defensa —</span>';
            return;
        }
        defenses.forEach(d => {
            const sys = DEFENSE_SYSTEMS[d];
            if (!sys) return;
            const id = 'sim-def-' + d.replace(/[^a-z0-9]/gi, '-');
            const wrap = document.createElement('label');
            wrap.className = 'sim-defense-item';
            wrap.innerHTML = `
                <input type="checkbox" id="${id}" value="${d}" checked>
                <span class="sim-def-name">${d}</span>
                <span class="sim-def-stats">Pk ${(sys.pk*100).toFixed(0)}% · ${sys.magazine}×</span>
            `;
            list.appendChild(wrap);
        });
    }

    function updateWeaponSelect() {
        const attackerSel = document.getElementById('sim-attacker');
        const weaponSel = document.getElementById('sim-weapon');
        if (!weaponSel) return;
        const attacker = ARSENAL_DATA[attackerSel.value];
        weaponSel.innerHTML = '';

        const offensive = (attacker?.missile || []).filter(w => w.cat !== 'sa');
        offensive.forEach((w, i) => {
            const idx = (attacker.missile || []).indexOf(w);
            const opt = new Option(`${w.name} — ${w.range} km — ${w.warhead || ''}`, idx);
            weaponSel.appendChild(opt);
        });
    }

    function upsertEventMarker(ev, isNew) {
        if (!ev || ev.lat == null || ev.lng == null) return;
        // Refuse to add events older than the 24h TTL (replays / stale snapshots).
        if (isEventExpired(ev)) return;
        // Channels the user hid from the sources panel never make it onto the map.
        if (geoFeed.isEventHidden(ev)) {
            if (eventMarkers[ev.event_id]) { try { removeEventMarker(ev.event_id); } catch (_) {} }
            return;
        }
        ensureEventPane();
        eventsById[ev.event_id] = ev;

        const existing = eventMarkers[ev.event_id];
        if (existing) {
            existing.setIcon(buildEventDivIcon(ev));
            existing.setTooltipContent(buildTooltipHtml(ev));
            // Refresh recency: move this id to the end of the queue
            const idx = orderedEventIds.indexOf(ev.event_id);
            if (idx !== -1) orderedEventIds.splice(idx, 1);
            orderedEventIds.push(ev.event_id);
        } else {
            const marker = L.marker([ev.lat, ev.lng], {
                pane: 'eventPane',
                icon: buildEventDivIcon(ev),
                keyboard: false,
                riseOnHover: true,
                draggable: false,      // initially non-draggable; enabled only if cluster
                autoPan: false,
            });
            // Tooltip on hover disabled per user request.
            marker.on('click', () => {
                // If this icon is part of an open fan, just open its article and
                // keep the fan expanded (no zoom, no collapse).
                if (_isDeployed(ev.event_id)) {
                    focusNewsForEvent(ev.event_id);
                    return;
                }
                // Standalone icon: zoom toward it (only ever closer) and surface
                // its story in the live news feed.
                const target = Math.max(map.getZoom(), EVENT_FOCUS_ZOOM);
                map.flyTo([ev.lat, ev.lng], target, { duration: 0.6 });
                focusNewsForEvent(ev.event_id);
            });
            marker.addTo(eventLayer);
            eventMarkers[ev.event_id] = marker;
            orderedEventIds.push(ev.event_id);
            _registerCluster(ev.event_id, ev.lat, ev.lng);
            _scheduleEventZoomFilter();
            try { iconCurator.schedule(); } catch (_) {}   // Phase 2: AI emoji curation (debounced)
            if (isNew) pulseMarker(marker);
            // The one-shot entrance animation must not linger: with `both` fill it
            // pins .ev-pin at opacity 0 for markers hidden in a cluster when it
            // "ran". Drop the class once the animation window passes.
            setTimeout(() => {
                const el = marker.getElement && marker.getElement();
                if (el) el.classList.remove('ev-fade-in');
            }, 420);

            // Enforce cap: when over the limit, evict the LOWEST-priority event
            // (not just the oldest). High-impact military events therefore
            // survive longer than, say, a minor infrastructure note.
            while (orderedEventIds.length > MAX_VISIBLE_EVENTS) {
                let worstIdx = 0, worstScore = Infinity;
                for (let i = 0; i < orderedEventIds.length; i++) {
                    // Never evict the event that was just added
                    if (orderedEventIds[i] === ev.event_id) continue;
                    const s = eventScore(orderedEventIds[i]);
                    if (s < worstScore) { worstScore = s; worstIdx = i; }
                }
                const [evictId] = orderedEventIds.splice(worstIdx, 1);
                fadeRemoveMarker(evictId);
            }
        }

        // Re-render sidebar so the credibility counter / icon update propagate.
        // Debounced so a burst of upserts coalesces into a single render.
        scheduleNewsRender();
    }

    document.addEventListener('DOMContentLoaded', boot);
})();