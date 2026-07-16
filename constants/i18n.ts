// 방문객 페이지 다국어 리소스 (KR / EN)
export type Lang = 'KR' | 'EN';

export const I18N = {
  // 편의시설 안내 (홈 탭 > 코엑스 라이프 & 편의 서비스 > /amenities 에서 사용)
  visitor: {
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
  },
};

// 외부 링크 URL
export const EXTERNAL_URLS = {
  coex: 'https://www.coex.co.kr/event/full-schedules/',
  dining: 'https://www.starfield.co.kr/coexmall/cafeDining/restaurant.do',
  limo: 'https://www.calt.co.kr/limousine/01.php',
  luggage: 'https://www.goodlugg.com/',
  starfieldLibrary: 'https://www.starfield.co.kr/coexmall/starfieldLibrary/lecture.do',
};
