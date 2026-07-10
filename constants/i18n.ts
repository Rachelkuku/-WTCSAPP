// 방문객 페이지 다국어 리소스 (KR / EN)
export type Lang = 'KR' | 'EN';

export const I18N = {
  // ── 게이트웨이 화면 ──────────────────────────────────────────
  gateway: {
    welcome: {
      KR: 'WTC Seoul(무역센터)\n방문을 환영합니다.',
      EN: 'WTC Seoul\nWorld Trade Center Seoul\nWelcome!',
    },
    tenantTitle: { KR: '입주사 임직원이신가요?', EN: 'Tenant Staff' },
    tenantSub: { KR: '입주사 전용 어플 이용', EN: 'Access the tenant-only app' },
    visitorTitle: { KR: '일반 방문객이신가요?', EN: 'Visitor / Foreigner' },
    visitorSub: {
      KR: '실시간 주차, 코엑스 전시 일정,\n복합몰 맛집 및 K-컬처 명소 안내',
      EN: 'Parking status, COEX exhibitions,\ndining guide & K-Culture spots',
    },
  },

  // ── 방문객 메인 헤더 ─────────────────────────────────────────
  visitor: {
    headerTitle: { KR: 'WTC Seoul 방문객 안내', EN: 'WTC Seoul Visitor Guide' },
    headerSub: { KR: '무역센터에 오신 것을 환영합니다', EN: 'Welcome to World Trade Center Seoul' },

    // ① 주차
    parkingTitle: { KR: '실시간 주차 현황', EN: 'Parking Status' },
    parkingRate: { KR: '현재 주차율', EN: 'Current Parking Rate' },
    parkingStatus: { KR: '혼잡 여부', EN: 'Congestion Level' },
    parkingFreeLabel: { KR: '여유', EN: 'Available' },
    parkingBusyLabel: { KR: '혼잡', EN: 'Busy' },
    parkingFullLabel: { KR: '만차', EN: 'Full' },
    parkingFreeMsg: {
      KR: '현재 주차 공간에 여유가 있습니다.\n지하 주차장을 편리하게 이용하세요!',
      EN: 'There is plenty of parking space available.\nEnjoy convenient parking in our underground garage!',
    },
    parkingBusyMsg: {
      KR: '주차장이 다소 혼잡합니다. 대중교통 이용을 권장합니다.',
      EN: 'The parking lot is somewhat busy. Public transportation is recommended.',
    },

    // ② 코엑스 전시
    coexTitle: { KR: '이번 주 코엑스 전시회', EN: 'COEX Exhibitions This Week' },
    coexBtn: { KR: '전체 일정 보기', EN: 'View Full Schedule' },
    coexEvents: [
      {
        KR: { title: '국제인공지능대전', date: '05.06 ~ 05.08', hall: 'A홀' },
        EN: { title: 'AI Expo Korea 2026', date: 'May 06 ~ May 08', hall: 'Hall A' },
      },
      {
        KR: { title: '국제 전기전력 전시회', date: '05.06 ~ 05.08', hall: 'C홀' },
        EN: { title: 'International Electric Power Exhibition', date: 'May 06 ~ May 08', hall: 'Hall C' },
      },
      {
        KR: { title: '제62회 백상예술대상', date: '05.08', hall: 'D홀' },
        EN: { title: 'The 62nd Baeksang Arts Awards', date: 'May 08', hall: 'Hall D' },
      },
      {
        KR: { title: '2026 서울머니쇼', date: '05.07 ~ 05.09', hall: 'B홀' },
        EN: { title: 'Seoul Money Show 2026', date: 'May 07 ~ May 09', hall: 'Hall B' },
      },
      {
        KR: { title: 'KOBA 2026', date: '05.12 ~ 05.15', hall: 'B·C·D홀' },
        EN: { title: 'KOBA 2026', date: 'May 12 ~ May 15', hall: 'Hall B, C, D' },
      },
    ],

    // ③ 스타필드 식당
    diningTitle: { KR: '스타필드 코엑스몰 식당 안내', EN: 'Starfield Coex Mall Dining Guide' },
    diningDesc: {
      KR: '삼성역 최고의 핫플레이스!\n스타필드몰에서 즐기는 맛있는 한 끼.',
      EN: 'The best culinary hotspot in Samseong-dong!\nEnjoy a delicious meal at Starfield Coex Mall.',
    },
    diningBtn: { KR: '식당 안내 보기', EN: 'View Dining Guide' },

    // ④ 교통/편의
    travelTitle: { KR: '글로벌 교통 및 편의 서비스', EN: 'Travel Convenience Services' },
    limoTitle: { KR: '도심공항 리무진 버스', EN: 'Airport Limousine Bus' },
    limoDesc: {
      KR: '인천공항까지 가장 편안하고 빠르게!\n무역센터에서 바로 출발하는 공항 리무진 버스 정보를 확인하세요.',
      EN: 'The fastest way to Incheon Airport!\nTake the limousine bus directly from WTC Seoul.',
    },
    limoBtn: { KR: '시간표 보기', EN: 'View Schedule' },
    luggageTitle: { KR: 'GOODLUG 짐 배송 서비스', EN: 'GOODLUG Luggage Delivery' },
    luggageDesc: {
      KR: '무거운 캐리어는 당일 공항/호텔로 먼저 보내고,\n무역센터를 빈손으로 가볍게 여행하세요!',
      EN: 'Deliver your heavy suitcases to the airport/hotel on the same day,\nand enjoy WTC Seoul hands-free!',
    },
    luggageBtn: { KR: '예약하기', EN: 'Book Now' },

    // ⑤ 편의시설
    amenitiesTitle: { KR: '편의시설 및 약자 배려 서비스', EN: 'Amenities & Accessibility' },
    amenities: [
      {
        icon: 'accessibility-outline' as const,
        KR: { title: '유모차 & 휠체어 대여', desc: '지하 1층 센트럴플라자/라이브플라자\n안내데스크 무료 대여' },
        EN: { title: 'Stroller & Wheelchair Rental', desc: 'B1F Starfield Coex Mall\n(Central/Live Plaza Info Desk) - Free' },
      },
      {
        icon: 'heart-outline' as const,
        KR: { title: '수유실 / 유아휴게실', desc: '지하 1층 라이브플라자 및\n메가박스 진입로 인근' },
        EN: { title: 'Baby Care Room', desc: 'B1F, near Live Plaza & Megabox' },
      },
      {
        icon: 'medical-outline' as const,
        KR: { title: '의무실 / 응급의료센터', desc: '1층 동문 안내데스크 옆\n응급 처치실' },
        EN: { title: 'First Aid Room', desc: '1F, next to the East Gate Info Desk' },
      },
      {
        icon: 'moon-outline' as const,
        KR: { title: '기도실', desc: '3층 아셈홀 인근\n글로벌 무슬림/다종교 방문객용 (세족실 포함)' },
        EN: { title: 'Prayer Room', desc: '3F, near Asem Hall\n(wudu station equipped)' },
      },
    ],

    // ③ 실내 길찾기
    indoorMapTitle: { KR: '실내 길찾기', EN: 'Indoor Navigation' },
    indoorMapBadge: { KR: '프로토타입', EN: 'Prototype' },
    indoorMapDesc: { KR: 'API 연동 서비스 준비 중', EN: 'Full navigation API coming soon' },

    // ⑤ 별마당 도서관 초대행사
    libraryEventTitle: { KR: '별마당 도서관 초대행사', EN: 'Starfield Library Events' },
    libraryEventDesc: {
      KR: '별마당 도서관의 강연, 토크 콘서트 등\n다채로운 문화 행사 일정을 확인하세요.',
      EN: 'Check out lectures, talk concerts,\nand cultural events at Starfield Library.',
    },
    libraryEventBtn: { KR: '행사 일정 보기', EN: 'View Event Schedule' },

    // ⑥ K-컬처 명소
    attractionsTitle: { KR: '주변 볼거리 & K-컬처 명소', EN: 'Nearby Attractions & K-Culture' },
    attractions: [
      {
        id: '0',
        icon: 'musical-notes-outline' as const,
        KR: '강남스타일 말춤 동상',
        EN: 'Gangnam Style Statue',
        category: { KR: 'K-POP', EN: 'K-POP' },
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80',
        location: { KR: '코엑스 동문 광장 앞', EN: 'In front of COEX East Gate Square' },
        desc: {
          KR: "싸이의 글로벌 히트곡 '강남스타일'의 시그니처 말춤 손동작을 형상화한 거대한 청동 조형물입니다. 센서 근처에 서면 신나는 강남스타일 음악이 흘러나오며, 전 세계 관광객들의 필수 인증샷 성지입니다.",
          EN: "A massive bronze monument depicting the iconic hand gesture from PSY's global hit 'Gangnam Style'. Standing near the monument triggers the exciting music, making it a must-visit photo spot for tourists from around the world."
        }
      },
      {
        id: '1',
        icon: 'tv-outline' as const,
        KR: '아티움 미디어',
        EN: 'Artium Media',
        category: { KR: '미디어', EN: 'Media' },
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        location: { KR: '삼성역 6번 출구 코엑스 아티움 외벽', EN: 'COEX Artium outer wall, Samseong Station Exit 6' },
        desc: {
          KR: "국내 최대 규모의 초대형 고화질 LED 스크린으로, 도심 속 거대한 파도가 일렁이는 등 경이롭고 생동감 넘치는 K-Pop 및 미디어 아트 작품들이 상영되는 야외 디지털 갤러리입니다.",
          EN: "Korea's largest ultra-high-definition outdoor LED screen. An outdoor digital gallery presenting jaw-dropping and dynamic media art displays, including the famous gigantic physical-simulated ocean waves."
        }
      },
      {
        id: '2',
        icon: 'camera-outline' as const,
        KR: 'S-live 갤러리',
        EN: 'S-live Gallery',
        category: { KR: '갤러리', EN: 'Gallery' },
        imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
        location: { KR: '코엑스몰 지하 1층 및 주요 연결 통로', EN: 'B1F Starfield Coex Mall & main passages' },
        desc: {
          KR: "무역센터 내부 통로를 감각적인 디지털 캔버스로 채운 갤러리입니다. 화려한 미디어 아트와 현대 작가들의 다채로운 디지털 시각 예술 작품을 무료로 감상하실 수 있습니다.",
          EN: "An exhibition gallery filling the hallways of WTC Seoul with digital canvases. Visitors can enjoy spectacular media art and colorful digital visual artworks by contemporary artists for free."
        }
      },
      {
        id: '3',
        icon: 'storefront-outline' as const,
        KR: 'Ktown4u 문화체험',
        EN: 'Ktown4u K-Culture',
        category: { KR: 'K-POP', EN: 'K-POP' },
        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        location: { KR: '코엑스 아티움 2~4층', EN: '2F-4F, COEX Artium' },
        desc: {
          KR: "글로벌 K-POP 팬들을 위한 성지로, 인기 아이돌의 팝업스토어, 다양한 아티스트 굿즈 쇼핑, 소속 댄스 트레이너에게 직접 배우는 K-POP 댄스 아카데미 등 다양한 K-컬처 체험 공간입니다.",
          EN: "A paradise for global K-POP fans. It features exclusive pop-up stores of popular idol groups, artist merchandise, and a dance academy where you can learn real K-POP choreography from professional trainers."
        }
      },
      {
        id: '4',
        icon: 'library-outline' as const,
        KR: '별마당 도서관',
        EN: 'Starfield Library',
        category: { KR: '문화', EN: 'Culture' },
        imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
        location: { KR: '스타필드 코엑스몰 센트럴플라자 지하 1층', EN: 'B1F, Central Plaza, Starfield Coex Mall' },
        desc: {
          KR: "스타필드 코엑스몰의 중심에 위치한 오픈형 문화 공간입니다. 13m 높이의 웅장한 서가와 은은한 조명이 어우러져 압도적인 비주얼을 자랑하며, 다양한 독서, 토크 콘서트, 문화 행사가 열리는 복합 쉼터입니다.",
          EN: "An open cultural space at the heart of Starfield Coex Mall. It boasts a spectacular view with 13-meter-tall wooden bookshelves and warm lights, offering a pleasant shelter for reading, talk concerts, and art exhibitions."
        }
      },
      {
        id: '5',
        icon: 'leaf-outline' as const,
        KR: '봉은사 사찰',
        EN: 'Bongeunsa Temple',
        category: { KR: '문화', EN: 'Culture' },
        imageUrl: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=800&q=80',
        location: { KR: '코엑스 북측 건너편 (도보 5분)', EN: 'Across the street on the north side of COEX (5 min walk)' },
        desc: {
          KR: "번잡한 현대 도심 한복판에 위치한 천년 고찰입니다. 한국 불교의 역사와 평온함을 간직하고 있으며, 거대한 미륵대불상과 아름다운 산책로, 템플스테이 체험을 통해 지친 마음을 달랠 수 있는 힐링 명소입니다.",
          EN: "A historic Buddhist temple with a thousand-year heritage, standing in the middle of a bustling modern city. Features a giant Buddha statue, serene walking paths, and temple-stay programs for a peaceful retreat."
        }
      },
      {
        id: '6',
        icon: 'fish-outline' as const,
        KR: '코엑스 아쿠아리움',
        EN: 'COEX Aquarium',
        category: { KR: '액티비티', EN: 'Activity' },
        imageUrl: 'https://images.unsplash.com/photo-1503480203567-06624fbe727b?auto=format&fit=crop&w=800&q=80',
        location: { KR: '스타필드 코엑스몰 지하 1층 북측 구역', EN: 'B1F, North Area, Starfield Coex Mall' },
        desc: {
          KR: "환상적인 수중 세계를 만날 수 있는 테마형 수족관입니다. 650여 종 4만여 마리의 다양한 해양 생물들이 서식하고 있으며, 국내 최다 상어 서식지이자 신비로운 해저 터널 체험으로 가족, 연인들의 인기 데이트 코스입니다.",
          EN: "A massive themed aquarium presenting a fantastic underwater world. Home to over 40,000 marine creatures of 650 species, featuring the largest shark habitat in Korea and a mystical underwater glass tunnel."
        }
      },
      {
        id: '7',
        icon: 'film-outline' as const,
        KR: '메가박스 필름 소사이어티',
        EN: 'Megabox Film Society',
        category: { KR: '영화', EN: 'Cinema' },
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
        location: { KR: '스타필드 코엑스몰 지하 1층 메가박스 내', EN: 'Inside Megabox cinema, B1F Starfield Coex Mall' },
        desc: {
          KR: "단순한 멀티플렉스를 넘어 영화 매니아들을 위해 예술 영화, 클래식 영화 기획전과 깊이 있는 시네마 토크를 제공하는 고품격 영화 문화 공간입니다. 클래식하고 안락한 라운지가 돋보입니다.",
          EN: "A high-quality cinema space offering art house movies, classic film festivals, and in-depth cinema talks for true movie enthusiasts. Features an extremely comfortable and classically designed lounge."
        }
      },
      {
        id: '8',
        icon: 'ice-cream-outline' as const,
        KR: '배스킨라빈스 콘셉트 스토어',
        EN: 'Baskin Robbins Concept Store',
        category: { KR: '맛집', EN: 'Food' },
        imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80',
        location: { KR: '스타필드 코엑스몰 지하 1층 세로길 구역', EN: 'B1F, Serogil Area, Starfield Coex Mall' },
        desc: {
          KR: "전국에서 가장 유니크한 100가지 맛의 아이스크림을 맛볼 수 있는 스페셜 플래그십 스토어입니다. 화려하고 미래지향적인 네온 아트 인테리어와 이곳에서만 판매하는 유니크한 시그니처 디저트를 제공합니다.",
          EN: "A special flagship store offering a unique menu of 100 different ice cream flavors. Experience a colorful, futuristic neon-art interior along with signature visual desserts exclusive to this location."
        }
      },
    ],
  },
};

// 외부 링크 URL
export const EXTERNAL_URLS = {
  coex: 'https://www.coex.co.kr/event/full-schedules/',
  dining: 'https://www.starfield.co.kr/coexmall/cafeDining/restaurant.do',
  limo: 'https://www.calt.co.kr/',
  luggage: 'https://www.goodlugg.com/?NaPm=ct%3Dmq0ao9yf%7Cci%3DERc5da180c-6084-11f1-9aa2-62afc38c16ab%7Ctr%3Dsa%7Chk%3D7c9c949d1fa6d87c21419826ba9d17881deada5e%7Cnacn%3DfcIgCAifN2TYD',
  starfieldLibrary: 'https://m.starfield.co.kr/coexmall/library/lectureList',
};
