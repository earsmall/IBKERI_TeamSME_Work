const firebaseConfig = {
  apiKey: "AIzaSyC2IAgurX44nkiTkSLMRjVEe6hCPLarQGA",
  authDomain: "ibkeri-team-sme.firebaseapp.com",
  projectId: "ibkeri-team-sme",
  storageBucket: "ibkeri-team-sme.firebasestorage.app",
  messagingSenderId: "528354283514",
  appId: "1:528354283514:web:61517916ea841af4609e43"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const meetingCollection = db.collection("meetingMinutes");
const workCollection = db.collection("workStatus");
const scheduleCollection = db.collection("schedules");
const memoCollection = db.collection("memos");
const readingCollection = db.collection("readings");
const adminRolesRef = db.collection("settings").doc("adminRoles");
const passwordSettingsRef = db.collection("settings").doc("passwords");
const userAccessRef = db.collection("settings").doc("userAccess");
const READINGS_EXPORT_URL = "readings_export.json";
const READINGS_PAGE_SIZE = 20;
const LINK_QUICK_SECTIONS = [
  {
    title: "포털",
    items: [
      ["Google", "https://www.google.com/"],
      ["Naver", "https://www.naver.com/"],
      ["Youtube", "https://www.youtube.com/"],
      ["Google 뉴스", "https://news.google.com/home?hl=ko&gl=KR&ceid=KR:ko"],
      ["Naver 뉴스", "https://news.naver.com/"]
    ]
  },
  {
    title: "AI도구",
    items: [
      ["ChatGPT", "https://chatgpt.com/"],
      ["Gemini", "https://gemini.google.com/app?hl=ko"],
      ["Claude", "https://claude.ai/new"],
      ["NotebookLM", "https://notebooklm.google.com/"],
      ["Genspark AI", "https://www.genspark.ai/ko"]
    ]
  }
];
const LINK_SITE_SECTIONS = [
  {
    title: "IBK",
    tone: "tone-ibk",
    wide: true,
    note: "IBK 업무와 교육 관련 바로가기입니다.",
    items: [
      ["웹메일", "https://mail.ibk.co.kr/mail/login"],
      ["EDGE 연수", "https://ibkedge.kbitube.or.kr/platformTubeWeb/CareLogin.do?cmd=moveLogin"],
      ["IBK에듀", "https://edu.ibk.co.kr/login"],
      ["법정의무교육", "https://ibk.getsmart.co.kr/members/login?returnUrl=http%3A%2F%2Fibk.getsmart.co.kr%2F"]
    ]
  },
  {
    title: "통계",
    tone: "tone-stats",
    note: "통계 원자료와 대시보드 중심으로 정리했습니다.",
    items: [
      ["국가데이터처", "https://kosis.kr/index/index.do"],
      ["한국은행 경제통계시스템", "https://ecos.bok.or.kr/#/"],
      ["금융통계정보시스템", "https://fisis.fss.or.kr/page/main.jsp"],
      ["은행통계정보시스템", "http://bss.kfb.or.kr/"],
      ["산업통계분석시스템", "https://www.istans.or.kr/main.html"],
      ["중소벤처기업부 통계", "https://www.mss.go.kr/site/smba/submain/submain04.do"],
      ["중소기업중앙회 조사연구통계", "https://www.kbiz.or.kr/ko/contents/contents/contents.do?mnSeq=317"],
      ["국가데이터처 빅데이터 활용", "https://data.kostat.go.kr/nowcast/bigmain.do"],
      ["한국벤처캐피탈협회 통계", "https://www.kvca.or.kr/Program/board/list.html?a_gb=board&a_cd=15&a_item=0&sm=4_1"],
      ["벤처투자종합포털 통계", "https://www.vcs.go.kr/web/portal/statistics/dashboard"],
      ["통계데이터센터", "https://data.mods.go.kr/sbchome/index.do"],
      ["마이크로데이터 통합서비스", "https://mdis.mods.go.kr/index.do"]
    ]
  },
  {
    title: "정부 부처/유관기관",
    tone: "tone-gov",
    note: "정책 자료와 공식 발표를 확인할 수 있는 기관입니다.",
    items: [
      ["재정경제부", "https://www.mofe.go.kr/"],
      ["산업통상부", "https://www.motir.go.kr/"],
      ["중소벤처기업부", "https://www.mss.go.kr/site/smba/main.do"],
      ["금융위원회", "https://www.fsc.go.kr/index"],
      ["금융감독원", "https://www.fss.or.kr/fss/main/main.do?menuNo=200000"],
      ["한국은행", "https://www.bok.or.kr/portal/main/main.do"],
      ["은행연합회", "https://www.kfb.or.kr/main/main.php"],
      ["중소기업중앙회", "https://www.kbiz.or.kr/ko/index/index.do"],
      ["법제처 국민참여입법센터", "https://opinion.lawmaking.go.kr/"],
      ["한국벤처캐피탈 협회", "https://www.kvca.or.kr/"],
      ["벤처투자종합포털", "https://www.vcs.go.kr/web/portal/main"],
      ["국제금융센터", "https://www.kcif.or.kr/"],
      ["KDI 정책시계열서비스", "https://epts.kdi.re.kr/polcTmsesSrvc/them"],
      ["KDI 경제정책정보 최신 경제정책", "https://eiec.kdi.re.kr/policy/materialList.do"],
      ["KDI 경제정책정보 최신 국내연구", "https://eiec.kdi.re.kr/policy/domesticList.do"]
    ]
  },
  {
    title: "연구기관",
    tone: "tone-research",
    note: "중소기업, 금융, 거시경제 리포트를 참고할 수 있습니다.",
    items: [
      ["한국개발연구원", "https://www.kdi.re.kr/"],
      ["산업연구원", "https://www.kiet.re.kr/"],
      ["대외경제정책연구원", "https://www.kiep.go.kr/"],
      ["한국은행 경제연구원", "https://www.bok.or.kr/imer/main/main.do"],
      ["한국금융연구원", "https://www.kif.re.kr/kif4/main/"],
      ["중소벤처기업연구원", "https://www.kosi.re.kr/kosbiWar/main"],
      ["국회예산정책처", "https://www.nabo.go.kr/"],
      ["국회미래연구원", "https://www.nafi.re.kr/home/kor/main.do"],
      ["현대경제연구원", "https://www.hri.co.kr/kor/main/main.html"],
      ["IBK경제연구소", "http://research.ibk.co.kr/research"],
      ["산업은행 미래전략연구소", "https://rd.kdb.co.kr/index.jsp"],
      ["수출입은행 해외경제연구소", "https://keri.koreaexim.go.kr/index"],
      ["우리금융경영연구소", "https://www.wfri.re.kr/ko/web/main.php"],
      ["하나금융연구소", "https://www.hanaif.re.kr/main.do"],
      ["KB경영연구소", "https://www.kbfg.com/kbresearch/index.do"]
    ]
  }
];
const SME_STATS_GROUPS = [
  {
    title: "중소기업",
    subgroups: [
      {
        title: "1. 중소기업 기본통계",
        items: [
          ["기업규모별 기업수(중소기업 기본통계, 중소벤처기업부)", "https://kosis.kr/statHtml/statHtml.do?orgId=142&tblId=DT_BR_A001&conn_path=I2"],
          ["기업규모별 종사자수(중소기업 기본통계, 중소벤처기업부)", "https://kosis.kr/statHtml/statHtml.do?orgId=142&tblId=DT_BR_B001&conn_path=I2"],
          ["매출액(중소기업 기본통계, 중소벤처기업부)", "https://kosis.kr/statHtml/statHtml.do?orgId=142&tblId=DT_BR_C001&conn_path=I2"]
        ]
      },
      {
        title: "2. 실물경기",
        items: [
          ["중소기업 경기동행지수(중소기업 경기동행지수, 중소기업은행)", "https://kosis.kr/statHtml/statHtml.do?orgId=303&tblId=DT_303005_CI001&conn_path=I2"],
          ["기업규모별 제조업 생산지수(광업제조업동향조사, 국가데이터처)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1F02007&conn_path=I2"],
          ["중소기업 평균가동률(중소기업경기전망조사, 중소벤처기업부)", "https://kosis.kr/statHtml/statHtml.do?orgId=340&tblId=DT_D10125&conn_path=I2"],
          ["시도/산업별 광공업 생산지수(광업제조업동향조사, 국가데이터처)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1F02001&conn_path=I2"],
          ["기업규모별 서비스업 생산지수(서비스업동향조사, 국가데이터처)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1KC2022&conn_path=I2"],
          ["음식점 포함 소매판매액지수(서비스업동향조사, 국가데이터처)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1K41017&conn_path=I2"],
          ["재별 상품군별 소매판매액지수(서비스업동향조사, 국가데이터처)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1K41012&conn_path=I2"],
          ["산업별 서비스업 생산지수(서비스업동향조사, 국가데이터처)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1KC2020&conn_path=I2"]
        ]
      },
      {
        title: "3. 체감경기",
        items: [
          ["BSI실적(기업경기조사, 한국은행)", "https://kosis.kr/statHtml/statHtml.do?orgId=301&tblId=DT_512Y013&conn_path=I2"],
          ["BSI전망(기업경기조사, 한국은행)", "https://kosis.kr/statHtml/statHtml.do?orgId=301&tblId=DT_512Y014&conn_path=I2"],
          ["SBHI 실적(중소기업경기전망조사, 중소벤처기업부 등)", "https://kosis.kr/statHtml/statHtml.do?orgId=340&tblId=DT_D10100A&conn_path=I2"],
          ["SBHI 전망(중소기업경기전망조사, 중소벤처기업부 등)", "https://kosis.kr/statHtml/statHtml.do?orgId=340&tblId=DT_D10100B&conn_path=I2"],
          ["기업경영상 애로요인(중소기업경기전망조사, 중소벤처기업부 등)", "https://kosis.kr/statHtml/statHtml.do?orgId=340&tblId=DT_D10127&conn_path=I2"]
        ]
      }
    ]
  },
  {
    title: "소상공인, 자영업자",
    subgroups: [
      {
        title: "1. 자영업자 기본현황",
        items: [
          ["성/종사상지위별 취업자(경제활동인구조사, 국가데이터처)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1DA7028S&conn_path=I2"],
          ["시도·산업·종사상지위별 종사자수(전국사업체조사, 국가데이터처)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1K52F01&conn_path=I2"],
          ["소득5분위별 가구주 종사상지위별 자산, 부채, 소득 현황(가계금융복지조사, 국가데이터처 등)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1HDAAA13&conn_path=I2"]
        ]
      },
      {
        title: "2. 실물경기",
        items: [
          ["재별 상품군별 판매액(서비스업동향조사, 국가데이터처)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1K41002&conn_path=I2"],
          ["재별 및 상품군별 소매판매액지수(서비스업동향조사, 국가데이터처)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1K41012&conn_path=I2"]
        ]
      },
      {
        title: "3. 체감경기",
        items: [
          ["소상공인 부문별 실적 및 전망(소상공인시장경기동향조사, 중소벤처기업부)", "https://kosis.kr/statHtml/statHtml.do?orgId=142&tblId=DT_S0001N_001&conn_path=I2"],
          ["소상공인 업종별 실적 및 전망(소상공인시장경기동향조사, 중소벤처기업부)", "https://kosis.kr/statHtml/statHtml.do?orgId=142&tblId=DT_S0001N_002&conn_path=I2"],
          ["소상공인 지역별 실적 및 전망(소상공인시장경기동향조사, 중소벤처기업부)", "https://kosis.kr/statHtml/statHtml.do?orgId=142&tblId=DT_S0001N_005&conn_path=I2"]
        ]
      },
      {
        title: "4. 창업, 폐업",
        items: [
          ["업종별 창업기업수(창업기업동향, 중소벤처기업부)", "https://kosis.kr/statHtml/statHtml.do?orgId=142&tblId=DT_142N_F201&conn_path=I2"],
          ["산업별 조직형태별 기업수(기업생멸행정통계, 국가데이터처)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1BD1106&conn_path=I2"],
          ["사업자 현황(국세통계, 국세청)", "https://kosis.kr/statHtml/statHtml.do?orgId=133&tblId=DT_133N_981&conn_path=I2"],
          ["폐업자 현황(국세통계, 국세청)", "https://kosis.kr/statHtml/statHtml.do?orgId=133&tblId=TX_13301_A169&conn_path=I2"]
        ]
      }
    ]
  },
  {
    title: "중소기업 금융",
    subgroups: [
      {
        title: "1. 대출금, 금리",
        items: [
          ["예금은행 기업규모별 산업별대출금(통화금융통계, 한국은행)", "https://kosis.kr/statHtml/statHtml.do?orgId=301&tblId=DT_131Y018&conn_path=I2"],
          ["예금은행 시설, 운전자금 대출(통화금융통계, 한국은행)", "https://kosis.kr/statHtml/statHtml.do?orgId=301&tblId=DT_141Y004&conn_path=I2"],
          ["대출금리, 신규취급액 기준(통화금융통계, 한국은행)", "https://kosis.kr/statHtml/statHtml.do?orgId=301&tblId=DT_121Y006&conn_path=I2"],
          ["대출금리, 잔액 기준(통화금융통계, 한국은행)", "https://kosis.kr/statHtml/statHtml.do?orgId=301&tblId=DT_121Y015&conn_path=I2"]
        ]
      },
      {
        title: "2. 대출행태 서베이",
        items: [
          ["대출태도(금융기관대출행태조사, 한국은행)", "https://kosis.kr/statHtml/statHtml.do?orgId=301&tblId=DT_514Y001&conn_path=I2"],
          ["신용위험(금융기관대출행태조사, 한국은행)", "https://kosis.kr/statHtml/statHtml.do?orgId=301&tblId=DT_514Y002&conn_path=I2"],
          ["대출 수요(금융기관대출행태조사, 한국은행)", "https://kosis.kr/statHtml/statHtml.do?orgId=301&tblId=DT_514Y003&conn_path=I2"]
        ]
      }
    ]
  },
  {
    title: "수출 중소기업",
    subgroups: [
      {
        title: "주요 수출 통계",
        items: [
          ["기업규모별 수출입(기업특성별무역통계, 국가데이터처 등)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1TEC_P116&conn_path=I2"],
          ["기업규모별, 주요국가별 수출입(기업특성별무역통계, 국가데이터처 등)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1TEC_P227&conn_path=I2"],
          ["산업별, 기업규모별 수출입(기업특성별무역통계, 국가데이터처 등)", "https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1TEC_P116&conn_path=I2"],
          ["대륙별, 국가별 중소기업 수출(중소기업수출동향, 중소벤처기업부)", "https://kosis.kr/statHtml/statHtml.do?orgId=142&tblId=DT_B10066&conn_path=I2"]
        ]
      }
    ]
  }
];
const DASHBOARDS = [
  ["sme-overview", "중소기업 주요 현황", "중소기업 전반의 핵심 흐름을 빠르게 확인할 수 있는 기본 현황 대시보드입니다.", "https://public.tableau.com/views/__17502119731210/sheet30?:language=ko-KR&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"],
  ["self-employed-overview", "자영업자 주요 현황", "자영업자 관련 주요 지표를 같은 레이아웃으로 확인할 수 있도록 연결했습니다.", "https://public.tableau.com/views/__17502333777740/sheet26?:language=ko-KR&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"],
  ["export-sme-overview", "수출 중소기업 주요 현황", "수출 중소기업의 실적과 흐름을 집중해서 볼 수 있는 대시보드입니다.", "https://public.tableau.com/views/__17502346824890/sheet0_1?:language=ko-KR&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"],
  ["bank-loan-market", "은행권 중소기업대출 시장 현황", "은행권의 중소기업대출 시장 규모와 동향을 살펴볼 수 있습니다.", "https://public.tableau.com/views/__17478138225250/sheet12?:language=ko-KR&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"],
  ["venture-investment", "벤처투자 현황", "벤처투자 관련 지표를 빠르게 점검할 수 있는 시각화입니다.", "https://public.tableau.com/views/__17742427007920/sheet0?:language=ko-KR&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"],
  ["domestic-bank-overview", "국내은행 주요 현황", "국내은행의 핵심 현황을 요약해서 살펴볼 수 있는 대시보드입니다.", "https://public.tableau.com/views/__17512724069940/sheet16?:language=ko-KR&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"],
  ["bok-fsa", "한국은행 연간 기업경영분석 주요 결과", "한국은행 기업경영분석의 주요 결과를 시각적으로 정리한 대시보드입니다.", "https://public.tableau.com/views/___17744202844510/sheet5?:language=ko-KR&publish=yes&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link"]
].map(([id, title, description, url]) => ({ id, title, description, url }));

function doc(database, collectionName, id) {
  return database.collection(collectionName).doc(id);
}

function setDoc(documentRef, data, options) {
  return documentRef.set(data, options);
}

function addDoc(collectionRef, data) {
  return collectionRef.add(data);
}

function deleteDoc(documentRef) {
  return documentRef.delete();
}

function getDoc(documentRef) {
  return documentRef.get();
}

function onSnapshot(reference, onNext, onError) {
  return reference.onSnapshot(onNext, onError);
}

const ko = {
  admin: "\uad00\ub9ac\uc790",
  choi: "\ucd5c\uc815\ud6c8",
  loggedIn: "\ub85c\uadf8\uc778 \uc911",
  badLogin: "\uc0ac\ubc88\uc744 \ud655\uc778\ud574\uc8fc\uc138\uc694.",
  loginDisabled: "\ub85c\uadf8\uc778 \uad8c\ud55c\uc774 \uc81c\uac70\ub41c \uc0ac\uc6a9\uc790\uc785\ub2c8\ub2e4.",
  badPassword: "\ube44\ubc00\ubc88\ud638\ub97c \ud655\uc778\ud574\uc8fc\uc138\uc694.",
  authFailed: "\uc778\uc99d \uc5f0\uacb0\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4. \uc7a0\uc2dc \ud6c4 \ub2e4\uc2dc \uc2dc\ub3c4\ud574\uc8fc\uc138\uc694.",
  passwordChanged: "\ube44\ubc00\ubc88\ud638\uac00 \ubcc0\uacbd\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",
  passwordMismatch: "\uc0c8 \ube44\ubc00\ubc88\ud638\uac00 \uc11c\ub85c \ub2e4\ub985\ub2c8\ub2e4.",
  passwordTooShort: "\uc0c8 \ube44\ubc00\ubc88\ud638\ub294 4\uc790 \uc774\uc0c1\uc73c\ub85c \uc785\ub825\ud574\uc8fc\uc138\uc694.",
  saved: "\uac8c\uc2dc\uae00\uc774 \ub4f1\ub85d\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",
  participantRequired: "\ucc38\uc5ec\uc790\ub97c 1\uba85 \uc774\uc0c1 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.",
  allLab: "\uc5f0\uad6c\uc18c \uc804\uccb4",
  underHead: "\uc18c\uc7a5 \uc774\ud558",
  underDirector: "\uc2e4\uc7a5 \uc774\ud558",
  underTeamLead: "\ud300\uc7a5 \uc774\ud558"
};

const VALID_USERS = [
  { id: "admin", name: ko.admin, role: "admin" },
  { id: "43222", name: ko.choi, role: "admin" },
  { id: "24810", name: "\uc774\uc6b0\uc885", role: "member" },
  { id: "25360", name: "\ub0a8\uad81\uc124", role: "member" },
  { id: "44975", name: "\uc624\uc815\ud0dd", role: "member" },
  { id: "43343", name: "\uae40\ub0a8\ud76c", role: "member" },
  { id: "42128", name: "\uae40\uc218\uc601", role: "member" },
  { id: "22194", name: "\uc2ec\ud615\uc900", role: "member" }
];

const TYPE_OPTIONS = [ko.underHead, ko.underDirector, ko.underTeamLead];
const WORK_CATEGORY_OPTIONS = [
  "\uc5f0\uad6c\ubcf4\uace0\uc11c",
  "\uc815\uae30\ubcf4\uace0\uc11c",
  "\ube0c\ub9ac\ud504",
  "\uc804\ub9dd",
  "\uae30\ud0c0"
];
const WORK_STATUS_OPTIONS = [
  "\uc9c4\ud589",
  "\uc77c\uc2dc\uc911\uc9c0",
  "\ub300\uae30",
  "\uace0\ub824\uc911",
  "\uc644\ub8cc"
];
const WORK_DASHBOARD_STATUS_ORDER = WORK_STATUS_OPTIONS;
const SCHEDULE_CATEGORY_OPTIONS = [
  "\ud589\uc0ac",
  "\ud734\uac00",
  "\ud68c\uc758",
  "\uae30\ud0c0"
];

let boardItems = [];
let workItems = [];
let scheduleItems = [];
let memoItems = [];
let baseReadingItems = [];
let firestoreReadingItems = [];
let readingItems = [];

const loginView = document.querySelector("#loginView");
const boardView = document.querySelector("#boardView");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const loginBadge = document.querySelector("#loginBadge");
const logoutButton = document.querySelector("#logoutButton");
const adminPageButton = document.querySelector("#adminPageButton");
const changePasswordButton = document.querySelector("#changePasswordButton");
const homeButton = document.querySelector("#homeButton");
const brandHomeButton = document.querySelector("#brandHomeButton");
const newPostButton = document.querySelector("#newPostButton");
const deleteSelectedButton = document.querySelector("#deleteSelectedButton");
const boardActions = document.querySelector("#boardActions");
const cancelPostButton = document.querySelector("#cancelPostButton");
const backToListButton = document.querySelector("#backToListButton");
const editPostButton = document.querySelector("#editPostButton");
const deletePostButton = document.querySelector("#deletePostButton");
const menuWorkDashboardButton = document.querySelector("#menuWorkDashboardButton");
const menuWorkListButton = document.querySelector("#menuWorkListButton");
const menuListButton = document.querySelector("#menuListButton");
const menuCalendarButton = document.querySelector("#menuCalendarButton");
const menuReadingsListButton = document.querySelector("#menuReadingsListButton");
const menuReadingsButton = document.querySelector("#menuReadingsButton");
const menuScheduleListButton = document.querySelector("#menuScheduleListButton");
const menuScheduleCalendarButton = document.querySelector("#menuScheduleCalendarButton");
const menuSmeStatsButton = document.querySelector("#menuSmeStatsButton");
const menuDashboardButton = document.querySelector("#menuDashboardButton");
const menuLinkSitesButton = document.querySelector("#menuLinkSitesButton");
const menuMemoListButton = document.querySelector("#menuMemoListButton");
const prevMonthButton = document.querySelector("#prevMonthButton");
const nextMonthButton = document.querySelector("#nextMonthButton");
const boardRows = document.querySelector("#boardRows");
const boardList = document.querySelector("#boardList");
const tableWrap = document.querySelector("#tableWrap");
const deleteSelectHeader = document.querySelector(".delete-select-header");
const selectAllPosts = document.querySelector("#selectAllPosts");
const workDeleteSelectHeader = document.querySelector(".work-delete-select-header");
const selectAllWorkItems = document.querySelector("#selectAllWorkItems");
const pagination = document.querySelector("#pagination");
const workDashboardPanel = document.querySelector("#workDashboardPanel");
const workListPanel = document.querySelector("#workListPanel");
const workFormPanel = document.querySelector("#workFormPanel");
const workForm = document.querySelector("#workForm");
const workFormTitle = document.querySelector("#workFormTitle");
const workStartDate = document.querySelector("#workStartDate");
const workEndDate = document.querySelector("#workEndDate");
const workNoStartDate = document.querySelector("#workNoStartDate");
const workNoEndDate = document.querySelector("#workNoEndDate");
const workAlwaysOn = document.querySelector("#workAlwaysOn");
const workTitle = document.querySelector("#workTitle");
const workAssigneeChoices = document.querySelector("#workAssigneeChoices");
const workStatus = document.querySelector("#workStatus");
const workCategory = document.querySelector("#workCategory");
const workRows = document.querySelector("#workRows");
const workEmptyState = document.querySelector("#workEmptyState");
const workFormMessage = document.querySelector("#workFormMessage");
const cancelWorkButton = document.querySelector("#cancelWorkButton");
const workFilters = document.querySelector("#workFilters");
const workFilterStartDate = document.querySelector("#workFilterStartDate");
const workFilterEndDate = document.querySelector("#workFilterEndDate");
const workFilterAssignee = document.querySelector("#workFilterAssignee");
const workFilterStatus = document.querySelector("#workFilterStatus");
const workFilterCategory = document.querySelector("#workFilterCategory");
const scheduleFormPanel = document.querySelector("#scheduleFormPanel");
const scheduleForm = document.querySelector("#scheduleForm");
const scheduleFormTitle = document.querySelector("#scheduleFormTitle");
const scheduleStartDate = document.querySelector("#scheduleStartDate");
const scheduleEndDate = document.querySelector("#scheduleEndDate");
const scheduleCategory = document.querySelector("#scheduleCategory");
const scheduleDescription = document.querySelector("#scheduleDescription");
const scheduleFormMessage = document.querySelector("#scheduleFormMessage");
const cancelScheduleButton = document.querySelector("#cancelScheduleButton");
const scheduleListPanel = document.querySelector("#scheduleListPanel");
const scheduleRows = document.querySelector("#scheduleRows");
const scheduleEmptyState = document.querySelector("#scheduleEmptyState");
const scheduleDeleteSelectHeader = document.querySelector(".schedule-delete-select-header");
const selectAllSchedules = document.querySelector("#selectAllSchedules");
const scheduleCalendarPanel = document.querySelector("#scheduleCalendarPanel");
const scheduleCalendarGrid = document.querySelector("#scheduleCalendarGrid");
const scheduleCalendarTitle = document.querySelector("#scheduleCalendarTitle");
const prevScheduleMonthButton = document.querySelector("#prevScheduleMonthButton");
const nextScheduleMonthButton = document.querySelector("#nextScheduleMonthButton");
const linkSitesPanel = document.querySelector("#linkSitesPanel");
const linkSitesGrid = document.querySelector("#linkSitesGrid");
const smeStatsPanel = document.querySelector("#smeStatsPanel");
const smeStatsList = document.querySelector("#smeStatsList");
const dashboardPanel = document.querySelector("#dashboardPanel");
const dashboardSelect = document.querySelector("#dashboardSelect");
const dashboardHelper = document.querySelector("#dashboardHelper");
const dashboardViewerTitle = document.querySelector("#dashboardViewerTitle");
const dashboardVizMount = document.querySelector("#dashboardVizMount");
const dashboardZoomRange = document.querySelector("#dashboardZoomRange");
const dashboardZoomValue = document.querySelector("#dashboardZoomValue");
const dashboardZoomReset = document.querySelector("#dashboardZoomReset");
const readingsPanel = document.querySelector("#readingsPanel");
const readingsCalendarGrid = document.querySelector("#readingsCalendarGrid");
const readingsCalendarTitle = document.querySelector("#readingsCalendarTitle");
const readingsSelectedTitle = document.querySelector("#readingsSelectedTitle");
const readingsMeta = document.querySelector("#readingsMeta");
const readingsList = document.querySelector("#readingsList");
const readingsEmptyState = document.querySelector("#readingsEmptyState");
const readingsSearchInput = document.querySelector("#readingsSearchInput");
const readingsStartDateFilter = document.querySelector("#readingsStartDateFilter");
const readingsEndDateFilter = document.querySelector("#readingsEndDateFilter");
const clearReadingsFiltersButton = document.querySelector("#clearReadingsFiltersButton");
const readingsListTabButton = document.querySelector("#readingsListTabButton");
const readingsCalendarTabButton = document.querySelector("#readingsCalendarTabButton");
const readingsBoardPanel = document.querySelector("#readingsBoardPanel");
const readingsTableRows = document.querySelector("#readingsTableRows");
const readingsTableEmptyState = document.querySelector("#readingsTableEmptyState");
const readingsPagination = document.querySelector("#readingsPagination");
const prevReadingsMonthButton = document.querySelector("#prevReadingsMonthButton");
const nextReadingsMonthButton = document.querySelector("#nextReadingsMonthButton");
const todayReadingsButton = document.querySelector("#todayReadingsButton");
const openReadingSubmissionButton = document.querySelector("#openReadingSubmissionButton");
const readingSubmissionModal = document.querySelector("#readingSubmissionModal");
const readingSubmissionForm = document.querySelector("#readingSubmissionForm");
const readingSubmissionTitle = document.querySelector("#readingSubmissionTitle");
const readingSubmissionDate = document.querySelector("#readingSubmissionDate");
const readingSubmissionSubmitter = document.querySelector("#readingSubmissionSubmitter");
const readingSubmissionDetails = document.querySelector("#readingSubmissionDetails");
const readingMarkdownControls = document.querySelectorAll("[data-reading-markdown-action]");
const readingSubmissionMessage = document.querySelector("#readingSubmissionMessage");
const closeReadingSubmissionButton = document.querySelector("#closeReadingSubmissionButton");
const cancelReadingSubmissionButton = document.querySelector("#cancelReadingSubmissionButton");
const memoFormPanel = document.querySelector("#memoFormPanel");
const memoForm = document.querySelector("#memoForm");
const memoFormTitle = document.querySelector("#memoFormTitle");
const memoTitle = document.querySelector("#memoTitle");
const memoContent = document.querySelector("#memoContent");
const memoFormMessage = document.querySelector("#memoFormMessage");
const cancelMemoButton = document.querySelector("#cancelMemoButton");
const memoListPanel = document.querySelector("#memoListPanel");
const memoRows = document.querySelector("#memoRows");
const memoEmptyState = document.querySelector("#memoEmptyState");
const memoDeleteSelectHeader = document.querySelector(".memo-delete-select-header");
const selectAllMemos = document.querySelector("#selectAllMemos");
const memoDetailPanel = document.querySelector("#memoDetailPanel");
const deleteMemoButton = document.querySelector("#deleteMemoButton");
const editMemoButton = document.querySelector("#editMemoButton");
const backToMemoListButton = document.querySelector("#backToMemoListButton");
const memoDetailDate = document.querySelector("#memoDetailDate");
const memoDetailTitle = document.querySelector("#memoDetailTitle");
const memoDetailAuthor = document.querySelector("#memoDetailAuthor");
const memoDetailContent = document.querySelector("#memoDetailContent");
const calendarPanel = document.querySelector("#calendarPanel");
const adminPanel = document.querySelector("#adminPanel");
const adminRows = document.querySelector("#adminRows");
const saveAdminRolesButton = document.querySelector("#saveAdminRolesButton");
const adminMessage = document.querySelector("#adminMessage");
const calendarGrid = document.querySelector("#calendarGrid");
const calendarTitle = document.querySelector("#calendarTitle");
const viewHeading = document.querySelector("#viewHeading");
const detailPanel = document.querySelector("#detailPanel");
const workDetailPanel = document.querySelector("#workDetailPanel");
const deleteWorkButton = document.querySelector("#deleteWorkButton");
const editWorkButton = document.querySelector("#editWorkButton");
const backToWorkListButton = document.querySelector("#backToWorkListButton");
const workDetailPeriod = document.querySelector("#workDetailPeriod");
const workDetailTitle = document.querySelector("#workDetailTitle");
const workDetailCategory = document.querySelector("#workDetailCategory");
const workDetailStatus = document.querySelector("#workDetailStatus");
const workDetailAssignees = document.querySelector("#workDetailAssignees");
const workDetailAuthor = document.querySelector("#workDetailAuthor");
const workUpdateForm = document.querySelector("#workUpdateForm");
const workUpdateDate = document.querySelector("#workUpdateDate");
const workUpdateContent = document.querySelector("#workUpdateContent");
const workUpdateRows = document.querySelector("#workUpdateRows");
const workUpdateEmpty = document.querySelector("#workUpdateEmpty");
const searchInput = document.querySelector("#searchInput");
const startDateFilter = document.querySelector("#startDateFilter");
const endDateFilter = document.querySelector("#endDateFilter");
const categoryTwo = document.querySelector("#categoryTwo");
const postForm = document.querySelector("#postForm");
const postPanel = document.querySelector("#postPanel");
const postDate = document.querySelector("#postDate");
const postPeriod = document.querySelector("#postPeriod");
const postHour = document.querySelector("#postHour");
const postAuthor = document.querySelector("#postAuthor");
const postContent = document.querySelector("#postContent");
const markdownControls = document.querySelectorAll("[data-markdown-action]");
const postTypeTwo = document.querySelector("#postTypeTwo");
const participantChoices = document.querySelector("#participantChoices");
const formMessage = document.querySelector("#formMessage");
const emptyState = document.querySelector("#emptyState");
const detailDate = document.querySelector("#detailDate");
const detailTitle = document.querySelector("#detailTitle");
const detailTopic = document.querySelector("#detailTopic");
const detailTypeTwo = document.querySelector("#detailTypeTwo");
const detailAuthor = document.querySelector("#detailAuthor");
const detailParticipants = document.querySelector("#detailParticipants");
const detailContent = document.querySelector("#detailContent");
const deleteConfirmModal = document.querySelector("#deleteConfirmModal");
const confirmDeleteYes = document.querySelector("#confirmDeleteYes");
const confirmDeleteNo = document.querySelector("#confirmDeleteNo");
const passwordModal = document.querySelector("#passwordModal");
const passwordForm = document.querySelector("#passwordForm");
const passwordMessage = document.querySelector("#passwordMessage");
const cancelPasswordButton = document.querySelector("#cancelPasswordButton");

let editingPostId = null;
let editingWorkId = null;
let editingScheduleId = null;
let editingMemoId = null;
let editingReadingId = null;
let editingReadingOriginalKey = null;
let activeView = "work-dashboard";
let workDetailReturnView = "work-list";
let currentCalendarDate = new Date();
let currentScheduleCalendarDate = new Date();
let currentReadingsCalendarDate = new Date();
let selectedReadingDate = getLocalDateValue(new Date());
let selectedReadingDetailKey = "";
let currentReadingsPage = 1;
let selectedDashboardId = DASHBOARDS[0]?.id || "";
let dashboardUserZoom = 1;
let hasTriedLoadingBaseReadings = false;
let activeReadingsView = "list";
let adminRoleMap = {};
let passwordHashMap = {};
let disabledUserIds = [];
let firestoreUnsubscribers = [];
let pendingDeleteAction = null;
let currentWorkDetailId = null;
let currentBoardPage = 1;
const BOARD_PAGE_SIZE = 20;

const tagColor = {
  [ko.underHead]: "red",
  [ko.underDirector]: "blue",
  [ko.underTeamLead]: "green"
};

function normalizeType(value) {
  return value === ko.allLab ? ko.underHead : value || ko.underHead;
}

function normalizeDateValue(value) {
  if (!value) return "";
  if (/^\d{2}-\d{2}-\d{2}$/.test(value)) {
    return `20${value}`;
  }
  return value;
}

function normalizeMeetingPost(id, post) {
  const legacyDate = new Date(post.date);
  const hasLegacyDate = !Number.isNaN(legacyDate.getTime());
  const dateValue = normalizeDateValue(post.dateValue || (hasLegacyDate ? getLocalDateValue(legacyDate) : post.date || ""));
  const hour24 = hasLegacyDate ? legacyDate.getHours() : 9;
  const period = post.period || (hour24 >= 12 ? "PM" : "AM");
  const hour = post.hour || String(hour24 % 12 || 12);
  const author = post.authorName || VALID_USERS.find((user) => user.id === post.authorId)?.name || "";

  return {
    ...post,
    id,
    legacyId: post.id || "",
    dateValue,
    period,
    hour,
    dateText: formatDateLabel(dateValue, period, hour) || post.dateText || "",
    authorName: author,
    content: post.content || "",
    contentFontSize: post.contentFontSize || "16",
    contentColor: post.contentColor || "#263442",
    type1: "",
    type2: normalizeType(post.type2),
    participants: Array.isArray(post.participants) ? post.participants : []
  };
}

function getUserName(userId) {
  if (userId === "team-sme") return "\uc911\uc18c\uae30\uc5c5\ud300";
  return VALID_USERS.find((user) => user.id === userId)?.name || "";
}

function isUserDisabled(userId) {
  return disabledUserIds.includes(userId);
}

function getActiveUsers() {
  return VALID_USERS.filter((user) => user.id !== "admin" && !isUserDisabled(user.id));
}

function getAssigneeIds(item) {
  if (Array.isArray(item.assigneeIds)) return item.assigneeIds;
  return item.assigneeId ? [item.assigneeId] : [];
}

function getAssigneeNames(item) {
  if (Array.isArray(item.assigneeNames)) return item.assigneeNames;
  return getAssigneeIds(item).map(getUserName).filter(Boolean);
}

function normalizeWorkItem(id, item) {
  const assigneeIds = getAssigneeIds(item);
  const assigneeNames = Array.isArray(item.assigneeNames) ? item.assigneeNames : assigneeIds.map(getUserName).filter(Boolean);
  const authorId = item.authorId || "";
  const updates = Array.isArray(item.updates)
    ? item.updates.map((update) => ({
      id: update.id || String(Date.now()),
      date: normalizeDateValue(update.date || ""),
      content: update.content || ""
    }))
    : [];
  return {
    id,
    startDate: normalizeDateValue(item.startDate || ""),
    endDate: normalizeDateValue(item.endDate || ""),
    noStartDate: Boolean(item.noStartDate || item.alwaysOn),
    noEndDate: Boolean(item.noEndDate),
    alwaysOn: Boolean(item.alwaysOn),
    title: item.title || "",
    assigneeId: assigneeIds[0] || "",
    assigneeIds,
    assigneeName: assigneeNames[0] || "",
    assigneeNames,
    status: item.status || WORK_STATUS_OPTIONS[0],
    category: item.category || WORK_CATEGORY_OPTIONS[0],
    authorId,
    authorName: item.authorName || getUserName(authorId),
    updates,
    createdAt: item.createdAt || ""
  };
}

function normalizeScheduleItem(id, item) {
  const authorId = item.authorId || "";
  return {
    id,
    startDate: normalizeDateValue(item.startDate || ""),
    endDate: normalizeDateValue(item.endDate || item.startDate || ""),
    category: item.category || SCHEDULE_CATEGORY_OPTIONS[0],
    description: item.description || "",
    authorId,
    authorName: item.authorName || getUserName(authorId),
    createdAt: item.createdAt || ""
  };
}

function normalizeMemoItem(id, item) {
  const authorId = item.authorId || "";
  return {
    id,
    title: item.title || "",
    content: item.content || "",
    authorId,
    authorName: item.authorName || getUserName(authorId),
    createdAt: item.createdAt || "",
    updatedAt: item.updatedAt || ""
  };
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function loadPasswordSettings() {
  const snapshot = await getDoc(passwordSettingsRef);
  passwordHashMap = snapshot.exists ? snapshot.data().hashes || {} : {};
  return passwordHashMap;
}

async function loadUserAccessSettings() {
  const snapshot = await getDoc(userAccessRef);
  disabledUserIds = snapshot.exists ? snapshot.data().disabledUserIds || [] : [];
  return disabledUserIds;
}

async function isValidPassword(userId, password) {
  const storedHash = passwordHashMap[userId];
  if (!storedHash) return password === userId;
  return storedHash === await hashPassword(password);
}

async function saveUserPassword(userId, password) {
  const passwordHash = await hashPassword(password);
  passwordHashMap = { ...passwordHashMap, [userId]: passwordHash };
  await setDoc(passwordSettingsRef, {
    hashes: passwordHashMap,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

async function ensureAnonymousAuth() {
  if (auth.currentUser) return auth.currentUser;
  const credential = await auth.signInAnonymously();
  return credential.user;
}

function stopFirestoreListeners() {
  firestoreUnsubscribers.forEach((unsubscribe) => unsubscribe());
  firestoreUnsubscribers = [];
}

function startFirestoreListeners() {
  if (firestoreUnsubscribers.length > 0) return;

  firestoreUnsubscribers.push(onSnapshot(meetingCollection, (snapshot) => {
    boardItems = snapshot.docs.map((item) => normalizeMeetingPost(item.id, item.data()));
    snapshot.docs.forEach((item) => {
      if (item.data().type2 === ko.allLab) {
        setDoc(doc(db, "meetingMinutes", item.id), { type1: "", type2: ko.underHead }, { merge: true });
      }
      if (/^\d{2}-\d{2}-\d{2}$/.test(item.data().dateValue || "")) {
        setDoc(doc(db, "meetingMinutes", item.id), { dateValue: normalizeDateValue(item.data().dateValue) }, { merge: true });
      }
    });
    renderBoard();
    renderCalendar();
  }, (error) => {
    console.error("회의록을 불러오지 못했습니다.", error);
  }));

  firestoreUnsubscribers.push(onSnapshot(adminRolesRef, (snapshot) => {
    adminRoleMap = snapshot.exists ? snapshot.data().roles || {} : {};
    syncCurrentUserRole();
    renderAdminRows();
  }, (error) => {
    console.error("관리자 권한 정보를 불러오지 못했습니다.", error);
  }));

  firestoreUnsubscribers.push(onSnapshot(passwordSettingsRef, (snapshot) => {
    passwordHashMap = snapshot.exists ? snapshot.data().hashes || {} : {};
  }, (error) => {
    console.error("Failed to load password settings.", error);
  }));

  firestoreUnsubscribers.push(onSnapshot(userAccessRef, (snapshot) => {
    disabledUserIds = snapshot.exists ? snapshot.data().disabledUserIds || [] : [];
    const user = getCurrentUser();
    if (user && isUserDisabled(user.id)) {
      sessionStorage.removeItem("currentUser");
      stopFirestoreListeners();
      auth.signOut();
      loginForm.reset();
      setView(null);
      return;
    }
    renderAdminRows();
    renderUserChoices();
  }, (error) => {
    console.error("Failed to load user access settings.", error);
  }));

  firestoreUnsubscribers.push(onSnapshot(workCollection, (snapshot) => {
    workItems = snapshot.docs.map((item) => normalizeWorkItem(item.id, item.data()));
    renderWorkList();
    renderWorkDashboard();
  }, (error) => {
    console.error("Failed to load work status.", error);
  }));

  firestoreUnsubscribers.push(onSnapshot(scheduleCollection, (snapshot) => {
    scheduleItems = snapshot.docs.map((item) => normalizeScheduleItem(item.id, item.data()));
    renderScheduleList();
    renderScheduleCalendar();
  }, (error) => {
    console.error("Failed to load schedules.", error);
  }));

  firestoreUnsubscribers.push(onSnapshot(memoCollection, (snapshot) => {
    memoItems = snapshot.docs.map((item) => normalizeMemoItem(item.id, item.data()));
    renderMemoList();
  }, (error) => {
    console.error("Failed to load memos.", error);
  }));

  firestoreUnsubscribers.push(onSnapshot(readingCollection, (snapshot) => {
    firestoreReadingItems = snapshot.docs.map((item) => normalizeFirestoreReadingItem(item.id, item.data()));
    mergeReadingItems();
    renderReadings();
  }, (error) => {
    console.error("Failed to load readings from Firestore.", error);
  }));
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("currentUser") || "null");
}

function getStoredUserRole(userId) {
  if (userId === "admin") return "admin";
  const baseUser = VALID_USERS.find((user) => user.id === userId);
  return adminRoleMap[userId] || baseUser?.role || "member";
}

function isAdminUser(user) {
  return Boolean(user && getStoredUserRole(user.id) === "admin");
}

function syncCurrentUserRole() {
  const user = getCurrentUser();
  if (!user) return;
  const syncedUser = { ...user, role: getStoredUserRole(user.id) };
  sessionStorage.setItem("currentUser", JSON.stringify(syncedUser));
  setView(syncedUser);
  if (!isAdminUser(syncedUser) && !adminPanel.classList.contains("hidden")) {
    showListView();
  }
}

function setView(user) {
  if (user) {
    const wasLoggedOut = boardView.classList.contains("hidden");
    loginView.classList.add("hidden");
    boardView.classList.remove("hidden");
    const roleLabel = isAdminUser(user) ? ko.admin : "\uc77c\ubc18";
    loginBadge.textContent = `${user.name} (${roleLabel}) ${ko.loggedIn}`;
    adminPageButton.classList.toggle("hidden", !isAdminUser(user));
    changePasswordButton.classList.remove("hidden");
    deleteSelectedButton.classList.toggle("hidden", !isAdminUser(user) || boardList.classList.contains("hidden"));
    postAuthor.value = user.name;
    setDefaultDate();
    if (wasLoggedOut) {
      showWorkDashboardView();
    }
    return;
  }

  loginView.classList.remove("hidden");
  boardView.classList.add("hidden");
  loginBadge.textContent = "";
  adminPageButton.classList.add("hidden");
  changePasswordButton.classList.add("hidden");
  deleteSelectedButton.classList.add("hidden");
  postAuthor.value = "";
}

function showWorkDashboardView() {
  activeView = "work-dashboard";
  hideMainPanels();
  viewHeading.textContent = "\uc5c5\ubb34 \ud604\ud669 - \ub300\uc26c\ubcf4\ub4dc";
  viewHeading.classList.remove("hidden");
  workFilters.classList.remove("hidden");
  workDashboardPanel.classList.remove("hidden");
  newPostButton.classList.add("hidden");
  setMenuActive(menuWorkDashboardButton);
  renderWorkDashboard();
}

function showWorkListView() {
  const user = getCurrentUser();
  activeView = "work-list";
  hideMainPanels();
  viewHeading.textContent = "\uc5c5\ubb34 \ud604\ud669 - \ubaa9\ub85d";
  viewHeading.classList.remove("hidden");
  boardActions.classList.remove("hidden");
  workFilters.classList.remove("hidden");
  workListPanel.classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  deleteSelectedButton.classList.toggle("hidden", !isAdminUser(user));
  setMenuActive(menuWorkListButton);
  renderWorkList();
}

function getLocalDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function setDefaultDate() {
  const now = new Date();
  postDate.value = getLocalDateValue(now);
  postPeriod.value = now.getHours() >= 12 ? "PM" : "AM";
  postHour.value = String(now.getHours() % 12 || 12);
}

function setPostFormOpen(isOpen) {
  postPanel.classList.toggle("hidden", !isOpen);
  newPostButton.setAttribute("aria-expanded", String(isOpen));
  newPostButton.textContent = isOpen ? "\uc791\uc131 \ub2eb\uae30" : "\uc0c8\ub85c \ub9cc\ub4e4\uae30";
  document.querySelector("#postFormTitle").textContent = editingPostId ? "\uac8c\uc2dc\uae00 \uc218\uc815" : "\uac8c\uc2dc\uae00 \uc791\uc131";

  if (isOpen) {
    if (!editingPostId) {
      setDefaultDate();
    }
    applyContentInputStyle();
    document.querySelector("#postTitle").focus();
  } else {
    formMessage.textContent = "";
  }
}

function clearPostForm() {
  editingPostId = null;
  postForm.reset();
  postAuthor.value = getCurrentUser()?.name || "";
  setDefaultDate();
  applyContentInputStyle();
  document.querySelector("#postFormTitle").textContent = "\uac8c\uc2dc\uae00 \uc791\uc131";
}

function fillPostForm(post) {
  editingPostId = post.id;
  postDate.value = normalizeDateValue(post.dateValue || post.date);
  postPeriod.value = post.period || "AM";
  postHour.value = post.hour || "9";
  postAuthor.value = post.authorName || getCurrentUser()?.name || "";
  document.querySelector("#postTitle").value = post.title;
  document.querySelector("#postTopic").value = post.topic;
  postContent.value = post.content || "";
  postTypeTwo.value = normalizeType(post.type2);
  document.querySelectorAll('input[name="participants"]').forEach((checkbox) => {
    checkbox.checked = post.participants.includes(checkbox.value);
  });
  applyContentInputStyle();
}

function setWorkFormOpen(isOpen) {
  workFormPanel.classList.toggle("hidden", !isOpen);
  newPostButton.setAttribute("aria-expanded", String(isOpen));
  newPostButton.textContent = isOpen ? "\uc791\uc131 \ub2eb\uae30" : "\uc0c8\ub85c \ub9cc\ub4e4\uae30";
  workFormTitle.textContent = editingWorkId ? "\uc5c5\ubb34 \ud604\ud669 \uc218\uc815" : "\uc5c5\ubb34 \ud604\ud669 \uc791\uc131";
  if (isOpen) workTitle.focus();
}

function syncWorkDateControls() {
  const isAlwaysOn = workAlwaysOn.checked;
  if (isAlwaysOn) {
    workNoStartDate.checked = true;
    workNoEndDate.checked = true;
    workStartDate.value = "";
    workEndDate.value = "";
  }

  workStartDate.disabled = isAlwaysOn || workNoStartDate.checked;
  workEndDate.disabled = isAlwaysOn || workNoEndDate.checked;

  if (workNoStartDate.checked) {
    workStartDate.value = "";
  }
  if (workNoEndDate.checked) {
    workEndDate.value = "";
  }
}

function clearWorkForm() {
  editingWorkId = null;
  workForm.reset();
  workStartDate.value = getLocalDateValue(new Date());
  workEndDate.value = getLocalDateValue(new Date());
  workNoStartDate.checked = false;
  workNoEndDate.checked = false;
  workAlwaysOn.checked = false;
  syncWorkDateControls();
  document.querySelectorAll('input[name="workAssignees"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  workFormMessage.textContent = "";
  workFormTitle.textContent = "\uc5c5\ubb34 \ud604\ud669 \uc791\uc131";
}

function fillWorkForm(item) {
  editingWorkId = item.id;
  workStartDate.value = normalizeDateValue(item.startDate);
  workEndDate.value = normalizeDateValue(item.endDate);
  workNoStartDate.checked = Boolean(item.noStartDate || item.alwaysOn);
  workNoEndDate.checked = Boolean(item.noEndDate);
  workAlwaysOn.checked = Boolean(item.alwaysOn);
  syncWorkDateControls();
  workTitle.value = item.title;
  const assigneeIds = getAssigneeIds(item);
  document.querySelectorAll('input[name="workAssignees"]').forEach((checkbox) => {
    checkbox.checked = assigneeIds.includes(checkbox.value);
  });
  workStatus.value = item.status;
  workCategory.value = item.category;
}

function setScheduleFormOpen(isOpen) {
  scheduleFormPanel.classList.toggle("hidden", !isOpen);
  newPostButton.setAttribute("aria-expanded", String(isOpen));
  newPostButton.textContent = isOpen ? "\uc791\uc131 \ub2eb\uae30" : "\uc0c8\ub85c \ub9cc\ub4e4\uae30";
  scheduleFormTitle.textContent = editingScheduleId ? "\uc77c\uc815 \uc218\uc815" : "\uc77c\uc815 \uc791\uc131";
  if (isOpen) scheduleDescription.focus();
}

function clearScheduleForm() {
  editingScheduleId = null;
  scheduleForm.reset();
  const today = getLocalDateValue(new Date());
  scheduleStartDate.value = today;
  scheduleEndDate.value = today;
  scheduleFormMessage.textContent = "";
  scheduleFormTitle.textContent = "\uc77c\uc815 \uc791\uc131";
}

function fillScheduleForm(item) {
  editingScheduleId = item.id;
  scheduleStartDate.value = normalizeDateValue(item.startDate);
  scheduleEndDate.value = normalizeDateValue(item.endDate || item.startDate);
  scheduleCategory.value = item.category;
  scheduleDescription.value = item.description;
}

function setMemoFormOpen(isOpen) {
  memoFormPanel.classList.toggle("hidden", !isOpen);
  newPostButton.setAttribute("aria-expanded", String(isOpen));
  newPostButton.textContent = isOpen ? "\uc791\uc131 \ub2eb\uae30" : "\uc0c8\ub85c \ub9cc\ub4e4\uae30";
  memoFormTitle.textContent = editingMemoId ? "\uba54\ubaa8 \uc218\uc815" : "\uba54\ubaa8 \uc791\uc131";
  if (isOpen) memoTitle.focus();
}

function clearMemoForm() {
  editingMemoId = null;
  memoForm.reset();
  memoFormMessage.textContent = "";
  memoFormTitle.textContent = "\uba54\ubaa8 \uc791\uc131";
}

function fillMemoForm(item) {
  editingMemoId = item.id;
  memoTitle.value = item.title;
  memoContent.value = item.content;
  memoFormMessage.textContent = "";
  memoFormTitle.textContent = "\uba54\ubaa8 \uc218\uc815";
}

function hideMainPanels() {
  workDashboardPanel.classList.add("hidden");
  workListPanel.classList.add("hidden");
  workFormPanel.classList.add("hidden");
  workFilters.classList.add("hidden");
  scheduleFormPanel.classList.add("hidden");
  scheduleListPanel.classList.add("hidden");
  scheduleCalendarPanel.classList.add("hidden");
  linkSitesPanel.classList.add("hidden");
  smeStatsPanel.classList.add("hidden");
  dashboardPanel.classList.add("hidden");
  readingsPanel.classList.add("hidden");
  memoFormPanel.classList.add("hidden");
  memoListPanel.classList.add("hidden");
  memoDetailPanel.classList.add("hidden");
  detailPanel.classList.add("hidden");
  workDetailPanel.classList.add("hidden");
  calendarPanel.classList.add("hidden");
  adminPanel.classList.add("hidden");
  boardList.classList.add("hidden");
  searchInput.closest(".controls").classList.add("hidden");
  postPanel.classList.add("hidden");
  pagination.classList.add("hidden");
  boardActions.classList.add("hidden");
  deleteSelectedButton.classList.add("hidden");
  editPostButton.classList.add("hidden");
  deletePostButton.classList.add("hidden");
  editWorkButton.classList.add("hidden");
  deleteWorkButton.classList.add("hidden");
  editMemoButton.classList.add("hidden");
  deleteMemoButton.classList.add("hidden");
}

function setMenuActive(activeButton) {
  [menuWorkDashboardButton, menuWorkListButton, menuListButton, menuCalendarButton, menuReadingsListButton, menuReadingsButton, menuSmeStatsButton, menuDashboardButton, menuLinkSitesButton, menuMemoListButton, menuScheduleListButton, menuScheduleCalendarButton].forEach((button) => {
    button.classList.toggle("active", button === activeButton);
  });
}

function applyContentInputStyle() {
  postContent.style.fontSize = "16px";
  postContent.style.color = "#263442";
}

function replacePostContentSelection(nextValue, selectionStart, selectionEnd) {
  postContent.value = nextValue;
  postContent.focus();
  postContent.setSelectionRange(selectionStart, selectionEnd);
}

function wrapPostContentSelection(prefix, suffix = prefix, fallback = "text") {
  const start = postContent.selectionStart;
  const end = postContent.selectionEnd;
  const selected = postContent.value.slice(start, end) || fallback;
  const before = postContent.value.slice(0, start);
  const after = postContent.value.slice(end);
  const nextValue = `${before}${prefix}${selected}${suffix}${after}`;
  const nextStart = start + prefix.length;
  const nextEnd = nextStart + selected.length;
  replacePostContentSelection(nextValue, nextStart, nextEnd);
}

function prefixPostContentLines(prefix, fallback = "text") {
  const start = postContent.selectionStart;
  const end = postContent.selectionEnd;
  const selected = postContent.value.slice(start, end) || fallback;
  const before = postContent.value.slice(0, start);
  const after = postContent.value.slice(end);
  const prefixed = selected
    .split("\n")
    .map((line) => line.startsWith(prefix) ? line : `${prefix}${line}`)
    .join("\n");
  replacePostContentSelection(`${before}${prefixed}${after}`, start, start + prefixed.length);
}

function applyMarkdownAction(action) {
  if (action === "heading") {
    prefixPostContentLines("### ");
    return;
  }
  if (action === "bold") {
    wrapPostContentSelection("**");
    return;
  }
  if (action === "italic") {
    wrapPostContentSelection("*");
    return;
  }
  if (action === "list") {
    prefixPostContentLines("- ");
    return;
  }
  if (action === "code") {
    wrapPostContentSelection("`");
  }
}

function replaceReadingDetailsSelection(nextValue, selectionStart, selectionEnd) {
  readingSubmissionDetails.value = nextValue;
  readingSubmissionDetails.focus();
  readingSubmissionDetails.setSelectionRange(selectionStart, selectionEnd);
}

function wrapReadingDetailsSelection(prefix, suffix = prefix, fallback = "text") {
  const start = readingSubmissionDetails.selectionStart;
  const end = readingSubmissionDetails.selectionEnd;
  const selected = readingSubmissionDetails.value.slice(start, end) || fallback;
  const before = readingSubmissionDetails.value.slice(0, start);
  const after = readingSubmissionDetails.value.slice(end);
  const nextValue = `${before}${prefix}${selected}${suffix}${after}`;
  const nextStart = start + prefix.length;
  const nextEnd = nextStart + selected.length;
  replaceReadingDetailsSelection(nextValue, nextStart, nextEnd);
}

function prefixReadingDetailsLines(prefix, fallback = "text") {
  const start = readingSubmissionDetails.selectionStart;
  const end = readingSubmissionDetails.selectionEnd;
  const selected = readingSubmissionDetails.value.slice(start, end) || fallback;
  const before = readingSubmissionDetails.value.slice(0, start);
  const after = readingSubmissionDetails.value.slice(end);
  const prefixed = selected
    .split("\n")
    .map((line) => line.startsWith(prefix) ? line : `${prefix}${line}`)
    .join("\n");
  replaceReadingDetailsSelection(`${before}${prefixed}${after}`, start, start + prefixed.length);
}

function applyReadingMarkdownAction(action) {
  if (action === "heading") {
    prefixReadingDetailsLines("### ");
    return;
  }
  if (action === "bold") {
    wrapReadingDetailsSelection("**");
    return;
  }
  if (action === "italic") {
    wrapReadingDetailsSelection("*");
    return;
  }
  if (action === "list") {
    prefixReadingDetailsLines("- ");
    return;
  }
  if (action === "code") {
    wrapReadingDetailsSelection("`");
  }
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function splitStatText(text) {
  const match = text.match(/^(.*?)(?:\(([^()]*)\))$/);
  if (!match) return { title: text, meta: "" };
  return { title: match[1].trim(), meta: match[2].trim() };
}

function formatStatMeta(meta) {
  if (!meta) return "";
  const parts = meta.split(",");
  const lead = parts.shift()?.trim() || "";
  const rest = parts.join(",").trim();
  return lead ? `< ${lead} >${rest ? `, ${rest}` : ""}` : meta;
}

function renderSmeStats() {
  smeStatsList.replaceChildren();
  SME_STATS_GROUPS.forEach((group) => {
    const major = document.createElement("article");
    major.className = "sme-major-card";

    const head = document.createElement("div");
    head.className = "sme-major-head";
    const title = document.createElement("h2");
    title.textContent = group.title;
    head.append(title);

    const subGrid = document.createElement("div");
    subGrid.className = "sme-sub-grid";

    group.subgroups.forEach((subgroup) => {
      const sub = document.createElement("section");
      sub.className = "sme-sub-card";

      const subTitle = document.createElement("h3");
      subTitle.textContent = subgroup.title;

      const list = document.createElement("div");
      list.className = "sme-stat-link-list";

      subgroup.items.forEach(([itemTitle, url]) => {
        const parts = splitStatText(itemTitle);
        const link = document.createElement("a");
        link.className = "sme-stat-chip";
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const content = document.createElement("span");
        content.className = "sme-stat-chip-content";

        const name = document.createElement("span");
        name.className = "sme-stat-chip-title";
        name.textContent = parts.title;
        content.append(name);

        if (parts.meta) {
          const meta = document.createElement("span");
          meta.className = "sme-stat-chip-meta";
          meta.textContent = formatStatMeta(parts.meta);
          content.append(meta);
        }

        link.append(content);
        list.append(link);
      });

      sub.append(subTitle, list);
      subGrid.append(sub);
    });

    major.append(head, subGrid);
    smeStatsList.append(major);
  });
}

function getDashboardViewportPreset() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width <= 640) return { device: "phone", targetWidth: 390, baseHeight: 760 };
  if (width <= 1280) return { device: "tablet", targetWidth: 1100, baseHeight: 700 };
  if (width >= 2200 && height >= 1200) return { device: "desktop", targetWidth: 1600, baseHeight: Math.max(940, height - 90) };
  return { device: "desktop", targetWidth: 1366, baseHeight: 720 };
}

function syncDashboardZoomControl() {
  const percent = Math.round(dashboardUserZoom * 100);
  dashboardZoomRange.value = String(percent);
  dashboardZoomValue.textContent = `${percent}%`;
}

function updateDashboardVizScale() {
  const frame = document.querySelector(".dashboard-frame");
  const stage = document.querySelector(".dashboard-viz-stage");
  if (!frame || !stage) return;

  const preset = getDashboardViewportPreset();
  const autoScale = clampNumber(frame.clientWidth / preset.targetWidth, 0.24, 1);
  const effectiveScale = clampNumber(autoScale * dashboardUserZoom, 0.24, 1.3);
  frame.style.setProperty("--dashboard-effective-scale", effectiveScale.toFixed(3));
  frame.style.setProperty("--dashboard-base-height", `${Math.round(preset.baseHeight)}px`);
  frame.style.setProperty("--dashboard-target-width", `${preset.targetWidth}px`);
}

function getSelectedDashboard() {
  return DASHBOARDS.find((item) => item.id === selectedDashboardId) || DASHBOARDS[0] || null;
}

function renderDashboardPicker(selectedDashboard) {
  dashboardSelect.replaceChildren();
  DASHBOARDS.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.title;
    option.selected = selectedDashboard?.id === item.id;
    dashboardSelect.append(option);
  });
  dashboardHelper.textContent = selectedDashboard?.description || "";
}

function renderDashboardViz(selectedDashboard) {
  const preset = getDashboardViewportPreset();
  if (!selectedDashboard) {
    dashboardVizMount.className = "dashboard-empty";
    dashboardVizMount.textContent = "표시할 대시보드가 없습니다.";
    return;
  }

  dashboardVizMount.className = "";
  dashboardVizMount.dataset.device = preset.device;
  dashboardVizMount.replaceChildren();

  const wrap = document.createElement("div");
  wrap.className = "dashboard-viz-stage-wrap";
  const stage = document.createElement("div");
  stage.className = "dashboard-viz-stage";
  const viz = document.createElement("tableau-viz");
  viz.id = "tableauViz";
  viz.setAttribute("src", selectedDashboard.url);
  viz.setAttribute("toolbar", "bottom");
  viz.setAttribute("hide-tabs", "");
  viz.setAttribute("device", preset.device);

  stage.append(viz);
  wrap.append(stage);
  dashboardVizMount.append(wrap);

  requestAnimationFrame(updateDashboardVizScale);
  setTimeout(updateDashboardVizScale, 600);
  setTimeout(updateDashboardVizScale, 1400);
}

function renderDashboard() {
  const selectedDashboard = getSelectedDashboard();
  renderDashboardPicker(selectedDashboard);
  dashboardViewerTitle.textContent = selectedDashboard?.title || "대시보드 보기";
  dashboardHelper.textContent = selectedDashboard?.description || "";
  renderDashboardViz(selectedDashboard);
  syncDashboardZoomControl();
}

function renderLinkSites() {
  linkSitesGrid.replaceChildren();
  LINK_QUICK_SECTIONS.forEach((section) => {
    const card = document.createElement("article");
    card.className = "link-site-card";

    const head = document.createElement("div");
    head.className = "link-site-head";

    const title = document.createElement("h2");
    title.textContent = section.title;

    head.append(title);

    const list = document.createElement("div");
    list.className = "link-site-list";

    section.items.forEach(([itemTitle, url]) => {
      const link = document.createElement("a");
      link.className = "link-site-chip";
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = itemTitle;
      list.append(link);
    });

    card.append(head, list);
    linkSitesGrid.append(card);
  });

  LINK_SITE_SECTIONS.forEach((section) => {
    const card = document.createElement("article");
    card.className = `link-site-card ${section.tone || ""}${section.wide ? " is-wide" : ""}`;

    const head = document.createElement("div");
    head.className = "link-site-head";

    const title = document.createElement("h2");
    title.textContent = section.title;

    const note = document.createElement("p");
    note.textContent = section.note;

    head.append(title, note);

    const list = document.createElement("div");
    list.className = "link-site-list";

    section.items.forEach(([itemTitle, url]) => {
      const link = document.createElement("a");
      link.className = "link-site-chip";
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = itemTitle;
      list.append(link);
    });

    card.append(head, list);
    linkSitesGrid.append(card);
  });
}

function showListView() {
  const user = getCurrentUser();
  activeView = "meeting-list";
  hideMainPanels();
  viewHeading.textContent = "\ud68c\uc758\ub85d - \ubaa9\ub85d";
  viewHeading.classList.remove("hidden");
  boardActions.classList.remove("hidden");
  boardList.classList.remove("hidden");
  searchInput.closest(".controls").classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  deleteSelectedButton.classList.toggle("hidden", !isAdminUser(user));
  setMenuActive(menuListButton);
  renderBoard();
}

function showCalendarView() {
  activeView = "meeting-calendar";
  hideMainPanels();
  viewHeading.textContent = "\ud68c\uc758\ub85d - \uce98\ub9b0\ub354";
  viewHeading.classList.remove("hidden");
  boardActions.classList.remove("hidden");
  calendarPanel.classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  setMenuActive(menuCalendarButton);
  renderCalendar();
}

function showReadingsView() {
  activeView = "readings";
  hideMainPanels();
  viewHeading.textContent = "\uc77d\uc744\uac70\ub9ac";
  viewHeading.classList.remove("hidden");
  readingsPanel.classList.remove("hidden");
  newPostButton.classList.add("hidden");
  setMenuActive(activeReadingsView === "list" ? menuReadingsListButton : menuReadingsButton);
  if (!hasTriedLoadingBaseReadings) {
    loadReadings();
    return;
  }
  renderReadings();
}

function showLinkSitesView() {
  activeView = "link-sites";
  hideMainPanels();
  viewHeading.textContent = "링크사이트";
  viewHeading.classList.remove("hidden");
  linkSitesPanel.classList.remove("hidden");
  newPostButton.classList.add("hidden");
  setMenuActive(menuLinkSitesButton);
  renderLinkSites();
}

function showSmeStatsView() {
  activeView = "sme-stats";
  hideMainPanels();
  viewHeading.textContent = "중소기업 통계";
  viewHeading.classList.remove("hidden");
  smeStatsPanel.classList.remove("hidden");
  newPostButton.classList.add("hidden");
  setMenuActive(menuSmeStatsButton);
  renderSmeStats();
}

function showDashboardView() {
  activeView = "dashboard";
  hideMainPanels();
  viewHeading.textContent = "시각화 대쉬보드";
  viewHeading.classList.remove("hidden");
  dashboardPanel.classList.remove("hidden");
  newPostButton.classList.add("hidden");
  setMenuActive(menuDashboardButton);
  renderDashboard();
}

function showScheduleListView() {
  const user = getCurrentUser();
  activeView = "schedule-list";
  hideMainPanels();
  viewHeading.textContent = "\uc77c\uc815 - \ubaa9\ub85d";
  viewHeading.classList.remove("hidden");
  boardActions.classList.remove("hidden");
  scheduleListPanel.classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  deleteSelectedButton.classList.toggle("hidden", !isAdminUser(user));
  setMenuActive(menuScheduleListButton);
  renderScheduleList();
}

function showScheduleCalendarView() {
  activeView = "schedule-calendar";
  hideMainPanels();
  viewHeading.textContent = "\uc77c\uc815 - \uce98\ub9b0\ub354";
  viewHeading.classList.remove("hidden");
  boardActions.classList.remove("hidden");
  scheduleCalendarPanel.classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  setMenuActive(menuScheduleCalendarButton);
  renderScheduleCalendar();
}

function showMemoListView() {
  const user = getCurrentUser();
  activeView = "memo-list";
  hideMainPanels();
  viewHeading.textContent = "\uba54\ubaa8 - \ubaa9\ub85d";
  viewHeading.classList.remove("hidden");
  boardActions.classList.remove("hidden");
  memoListPanel.classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  deleteSelectedButton.classList.toggle("hidden", !isAdminUser(user));
  setMenuActive(menuMemoListButton);
  renderMemoList();
}

function showAdminView() {
  const user = getCurrentUser();
  if (!isAdminUser(user)) return;

  viewHeading.textContent = "\uad00\ub9ac\uc790 \ud398\uc774\uc9c0";
  viewHeading.classList.remove("hidden");
  hideMainPanels();
  setPostFormOpen(false);
  adminPanel.classList.remove("hidden");
  newPostButton.classList.add("hidden");
  setMenuActive(null);
  renderAdminRows();
}

function showDetailView(postId) {
  const post = boardItems.find((item) => item.id === postId);
  if (!post) return;
  const user = getCurrentUser();
  const canDelete = isAdminUser(user) || post.authorId === user?.id || (!post.authorId && post.authorName === user?.name);

  setPostFormOpen(false);
  hideMainPanels();
  viewHeading.classList.add("hidden");
  detailPanel.classList.remove("hidden");
  editPostButton.classList.remove("hidden");
  editPostButton.dataset.postId = post.id;
  deletePostButton.classList.toggle("hidden", !canDelete);
  deletePostButton.dataset.postId = post.id;

  detailDate.textContent = post.dateText;
  detailTitle.textContent = post.title;
  detailTopic.textContent = post.topic;
  detailTypeTwo.replaceChildren(makeTag(normalizeType(post.type2)));
  detailAuthor.textContent = post.authorName || "";
  detailParticipants.replaceChildren(makeParticipants(post.participants));
  detailContent.style.fontSize = `${post.contentFontSize || "16"}px`;
  detailContent.style.color = post.contentColor || "#263442";
  detailContent.innerHTML = renderMarkdown(post.content || "");
  backToListButton.focus();
}

function showWorkDetailView(itemId) {
  const item = workItems.find((workItem) => workItem.id === itemId);
  if (!item) return;
  currentWorkDetailId = item.id;
  workDetailReturnView = activeView === "work-dashboard" ? "work-dashboard" : "work-list";
  const canEdit = canEditWorkItem(item);

  setWorkFormOpen(false);
  hideMainPanels();
  viewHeading.classList.add("hidden");
  workDetailPanel.classList.remove("hidden");
  editWorkButton.classList.toggle("hidden", !canEdit);
  editWorkButton.dataset.workId = item.id;
  deleteWorkButton.classList.toggle("hidden", !canDeleteWorkItem(item));
  deleteWorkButton.dataset.workId = item.id;
  workUpdateForm.classList.toggle("hidden", !canEdit);
  workUpdateForm.reset();
  delete workUpdateForm.dataset.editUpdateId;
  workUpdateDate.value = getLocalDateValue(new Date());

  workDetailPeriod.textContent = formatWorkPeriod(item);
  workDetailTitle.textContent = item.title;
  workDetailCategory.textContent = item.category;
  workDetailStatus.replaceChildren(makeStatusTag(item.status));
  workDetailAssignees.textContent = getAssigneeNames(item).join(", ");
  workDetailAuthor.textContent = item.authorName || "";
  renderWorkUpdates(item);
  backToWorkListButton.focus();
}

function showWorkDetailReturnView() {
  if (workDetailReturnView === "work-dashboard") {
    showWorkDashboardView();
    return;
  }
  showWorkListView();
}

function showMemoDetailView(itemId) {
  const item = memoItems.find((memo) => memo.id === itemId);
  if (!item) return;
  const canManage = canManageMemoItem(item);

  setMemoFormOpen(false);
  hideMainPanels();
  viewHeading.classList.add("hidden");
  memoDetailPanel.classList.remove("hidden");
  editMemoButton.classList.toggle("hidden", !canManage);
  editMemoButton.dataset.memoId = item.id;
  deleteMemoButton.classList.toggle("hidden", !canManage);
  deleteMemoButton.dataset.memoId = item.id;

  memoDetailDate.textContent = formatShortDate((item.createdAt || "").slice(0, 10));
  memoDetailTitle.textContent = item.title;
  memoDetailAuthor.textContent = item.authorName || "";
  memoDetailContent.textContent = item.content || "";
  backToMemoListButton.focus();
}

function getPostDate(post) {
  const value = normalizeDateValue(post.dateValue || post.date);
  const hour = Number(post.hour || 0);
  const hour24 = post.period === "PM" && hour < 12
    ? hour + 12
    : post.period === "AM" && hour === 12
      ? 0
      : hour;
  const paddedHour = String(hour24).padStart(2, "0");
  const date = new Date(value && value.length === 10 ? `${value}T${paddedHour}:00:00` : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sortPostsByRecent(posts) {
  return [...posts].sort((a, b) => {
    const dateA = getPostDate(a)?.getTime() || 0;
    const dateB = getPostDate(b)?.getTime() || 0;
    return dateB - dateA;
  });
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderCalendar() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const postsByDate = new Map();

  boardItems.forEach((post) => {
    const date = getPostDate(post);
    if (!date) return;
    const key = getDateKey(date);
    if (!postsByDate.has(key)) postsByDate.set(key, []);
    postsByDate.get(key).push(post);
  });

  calendarTitle.textContent = `${year}.${String(month + 1).padStart(2, "0")}`;
  calendarGrid.replaceChildren();

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    const blank = document.createElement("div");
    blank.className = "calendar-day muted";
    calendarGrid.append(blank);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const key = getDateKey(date);
    const cell = document.createElement("div");
    cell.className = "calendar-day";

    const dayNumber = document.createElement("span");
    dayNumber.className = "calendar-day-number";
    dayNumber.textContent = day;
    cell.append(dayNumber);

    (postsByDate.get(key) || []).forEach((post) => {
      const button = document.createElement("button");
      button.className = `calendar-event ${tagColor[normalizeType(post.type2)] || "blue"}`;
      button.type = "button";
      button.textContent = post.title;
      button.addEventListener("click", () => showDetailView(post.id));
      cell.append(button);
    });

    calendarGrid.append(cell);
  }
}

function parseReadingDate(value) {
  const text = String(value || "");
  const match = text.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : "";
}

function formatKoreanDateLabel(dateValue) {
  if (!dateValue) return "";
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return dateValue;
  const weekdays = ["\uc77c\uc694\uc77c", "\uc6d4\uc694\uc77c", "\ud654\uc694\uc77c", "\uc218\uc694\uc77c", "\ubaa9\uc694\uc77c", "\uae08\uc694\uc77c", "\ud1a0\uc694\uc77c"];
  return `${year}\ub144 ${month}\uc6d4 ${day}\uc77c ${weekdays[date.getDay()]}`;
}

function normalizeReadingItem(item) {
  const date = parseReadingDate(item.date || item.isoDate || item.dateLabel);
  const attachments = Array.isArray(item.attachments) ? item.attachments : [];
  return {
    id: item.id || "",
    originalKey: String(item.originalKey || ""),
    source: String(item.source || ""),
    deleted: item.deleted === true,
    date,
    dateLabel: item.dateLabel || formatKoreanDateLabel(date),
    agency: String(item.agency || ""),
    title: String(item.title || ""),
    details: String(item.details || ""),
    attachments,
    link: String(item.link || ""),
    submitter: String(item.submitter || ""),
    savedAt: String(item.savedAt || item.createdAt || ""),
    authorId: String(item.authorId || ""),
    authorName: String(item.authorName || item.submitter || "")
  };
}

function normalizeFirestoreReadingItem(id, item) {
  return normalizeReadingItem({
    ...item,
    id,
    source: "firestore",
    submitter: item.submitter || item.authorName || getUserName(item.authorId)
  });
}

function sortReadings(items) {
  return [...items].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare) return dateCompare;
    return (b.savedAt || "").localeCompare(a.savedAt || "");
  });
}

function getReadingKey(item) {
  return item.originalKey || item.id || item.savedAt || [item.date, item.title, item.link].join("|");
}

function getReadingDateCount(items = readingItems) {
  return new Set(items.map((item) => item.date).filter(Boolean)).size;
}

function hasActiveReadingFilters() {
  return Boolean(
    readingsSearchInput.value.trim()
    || readingsStartDateFilter.value
    || readingsEndDateFilter.value
  );
}

function getFilteredReadings() {
  const query = readingsSearchInput.value.trim().toLowerCase();
  const start = readingsStartDateFilter.value;
  const end = readingsEndDateFilter.value;

  return readingItems.filter((item) => {
    const searchText = [item.agency, item.title].join(" ").toLowerCase();
    const matchesQuery = !query || searchText.includes(query);
    const matchesStart = !start || item.date >= start;
    const matchesEnd = !end || item.date <= end;
    return matchesQuery && matchesStart && matchesEnd;
  });
}

function canManageReadingItem(item) {
  const user = getCurrentUser();
  if (!item || !user) return false;
  if (!item.id) return isAdminUser(user);
  return isAdminUser(user) || item.authorId === user.id || (!item.authorId && item.submitter === user.name);
}

function mergeReadingItems() {
  const seen = new Set();
  const merged = [];

  sortReadings(firestoreReadingItems).forEach((item) => {
    const key = getReadingKey(item);
    if (!key || seen.has(key)) return;
    seen.add(key);
    if (!item.deleted && item.date && item.title) {
      merged.push(item);
    }
  });

  sortReadings(baseReadingItems).forEach((item) => {
    const key = getReadingKey(item);
    if (!key || seen.has(key)) return;
    seen.add(key);
    if (!item.deleted && item.date && item.title) {
      merged.push(item);
    }
  });

  readingItems = sortReadings(merged);
}

function getReadingsByDate(items = readingItems) {
  const grouped = new Map();
  items.forEach((item) => {
    if (!item.date) return;
    if (!grouped.has(item.date)) grouped.set(item.date, []);
    grouped.get(item.date).push(item);
  });
  grouped.forEach((items, date) => grouped.set(date, sortReadings(items)));
  return grouped;
}

function ensureSelectedReadingDate(grouped, items = readingItems) {
  if (selectedReadingDate && grouped.has(selectedReadingDate)) return;
  selectedReadingDate = sortReadings(items)[0]?.date || getLocalDateValue(new Date());
  if (selectedReadingDate) {
    const [year, month] = selectedReadingDate.split("-").map(Number);
    currentReadingsCalendarDate = new Date(year, month - 1, 1);
  }
}

function renderReadings({ preserveSelectedDate = false } = {}) {
  const filteredItems = getFilteredReadings();
  const grouped = getReadingsByDate(filteredItems);
  if (!preserveSelectedDate) {
    ensureSelectedReadingDate(grouped, filteredItems);
  }
  renderReadingsTabs();
  renderReadingsBoard(filteredItems);
  renderReadingsCalendar(grouped);
  renderSelectedReadings(grouped, filteredItems);
}

function renderReadingsTabs() {
  const isList = activeReadingsView === "list";
  readingsListTabButton.classList.toggle("active", isList);
  readingsCalendarTabButton.classList.toggle("active", !isList);
  setMenuActive(isList ? menuReadingsListButton : menuReadingsButton);
  readingsBoardPanel.classList.toggle("hidden", !isList);
  document.querySelector(".readings-layout").classList.toggle("hidden", isList);
}

function renderReadingsBoard(items) {
  readingsTableRows.replaceChildren();
  readingsTableEmptyState.classList.toggle("hidden", items.length > 0);

  const sortedItems = sortReadings(items);
  const pageCount = Math.max(1, Math.ceil(sortedItems.length / READINGS_PAGE_SIZE));
  currentReadingsPage = Math.min(Math.max(currentReadingsPage, 1), pageCount);
  const startIndex = (currentReadingsPage - 1) * READINGS_PAGE_SIZE;
  const pageItems = sortedItems.slice(startIndex, startIndex + READINGS_PAGE_SIZE);

  pageItems.forEach((item) => {
    const itemKey = getReadingKey(item);
    const row = document.createElement("tr");
    row.className = "clickable-row";
    row.classList.toggle("selected", itemKey === selectedReadingDetailKey);

    const date = document.createElement("td");
    const title = document.createElement("td");
    const agency = document.createElement("td");
    const submitter = document.createElement("td");

    date.textContent = item.date || "";
    title.textContent = item.title || "";
    agency.textContent = item.agency || "";
    submitter.textContent = item.submitter || item.authorName || "";

    row.append(date, title, agency, submitter);
    row.addEventListener("click", () => showReadingDetailFromList(itemKey, item));
    readingsTableRows.append(row);

    if (itemKey === selectedReadingDetailKey) {
      const detailRow = document.createElement("tr");
      detailRow.className = "readings-inline-detail-row";

      const detailCell = document.createElement("td");
      detailCell.colSpan = 4;
      detailCell.append(createReadingCard(item));

      detailRow.append(detailCell);
      readingsTableRows.append(detailRow);
    }
  });
  renderReadingsPagination(sortedItems.length, pageCount);
}

function showReadingDetailFromList(itemKey, item) {
  selectedReadingDetailKey = selectedReadingDetailKey === itemKey ? "" : itemKey;
  selectedReadingDate = item.date;
  renderReadings({ preserveSelectedDate: true });
}

function renderReadingsPagination(totalCount, pageCount) {
  readingsPagination.replaceChildren();
  readingsPagination.classList.toggle("hidden", totalCount <= READINGS_PAGE_SIZE);
  if (totalCount <= READINGS_PAGE_SIZE) return;

  const prev = document.createElement("button");
  prev.className = "ghost-button";
  prev.type = "button";
  prev.textContent = "\uc774\uc804";
  prev.disabled = currentReadingsPage <= 1;
  prev.addEventListener("click", () => {
    currentReadingsPage -= 1;
    renderReadings({ preserveSelectedDate: true });
  });

  const info = document.createElement("span");
  info.className = "readings-pagination-info";
  const start = (currentReadingsPage - 1) * READINGS_PAGE_SIZE + 1;
  const end = Math.min(currentReadingsPage * READINGS_PAGE_SIZE, totalCount);
  info.textContent = `${start}-${end} / ${totalCount} (\ud398\uc774\uc9c0 ${currentReadingsPage}/${pageCount})`;

  const next = document.createElement("button");
  next.className = "ghost-button";
  next.type = "button";
  next.textContent = "\ub2e4\uc74c";
  next.disabled = currentReadingsPage >= pageCount;
  next.addEventListener("click", () => {
    currentReadingsPage += 1;
    renderReadings({ preserveSelectedDate: true });
  });

  readingsPagination.append(prev, info, next);
}

function renderReadingsCalendar(grouped) {
  const year = currentReadingsCalendarDate.getFullYear();
  const month = currentReadingsCalendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  readingsCalendarTitle.textContent = `${year}.${String(month + 1).padStart(2, "0")}`;
  readingsCalendarGrid.replaceChildren();

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    const blank = document.createElement("div");
    blank.className = "calendar-day muted";
    readingsCalendarGrid.append(blank);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const dateValue = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const items = grouped.get(dateValue) || [];
    const cell = document.createElement("button");
    cell.className = "calendar-day readings-day";
    cell.type = "button";
    cell.disabled = items.length === 0;
    cell.classList.toggle("has-readings", items.length > 0);
    cell.classList.toggle("active", dateValue === selectedReadingDate);

    const dayNumber = document.createElement("span");
    dayNumber.className = "calendar-day-number";
    dayNumber.textContent = String(day);
    cell.append(dayNumber);

    if (items.length > 0) {
      const count = document.createElement("span");
      count.className = "readings-count";
      count.textContent = `${items.length}\uac1c`;
      cell.append(count);
    }

    cell.addEventListener("click", () => {
      selectedReadingDate = dateValue;
      renderReadings();
    });
    readingsCalendarGrid.append(cell);
  }
}

function createReadingCard(item) {
  const card = document.createElement("article");
  card.className = "reading-card";

  const top = document.createElement("div");
  top.className = "reading-card-top";

  const agency = document.createElement("span");
  agency.className = "reading-agency";
  agency.textContent = item.agency || "\uae30\uad00 \ubbf8\uc785\ub825";

  const submitter = document.createElement("span");
  submitter.className = "reading-submitter";
  submitter.textContent = item.submitter ? `\ub4f1\ub85d ${item.submitter}` : "";

  const title = document.createElement("a");
  title.className = "reading-title";
  title.href = item.link || "";
  if (item.link) {
    title.target = "_blank";
    title.rel = "noopener noreferrer";
  } else {
    title.setAttribute("aria-disabled", "true");
    title.addEventListener("click", (event) => event.preventDefault());
  }
  title.textContent = item.title || "\uc81c\ubaa9 \uc5c6\uc74c";

  const details = document.createElement("p");
  details.className = "reading-details";
  details.innerHTML = renderMarkdown(item.details || "\uc8fc\uc694 \ub0b4\uc6a9\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.");

  top.append(agency, submitter);
  card.append(top, title, details);

  if (canManageReadingItem(item)) {
    const actions = document.createElement("div");
    actions.className = "reading-card-actions";

    const edit = document.createElement("button");
    edit.className = "ghost-button";
    edit.type = "button";
    edit.textContent = "\uc218\uc815";
    edit.addEventListener("click", () => {
      fillReadingSubmissionForm(item);
      setReadingSubmissionOpen(true);
    });

    const remove = document.createElement("button");
    remove.className = "danger-button";
    remove.type = "button";
    remove.textContent = "\uc0ad\uc81c";
    remove.addEventListener("click", () => {
      requestDelete(async () => {
        if (item.id) {
          await deleteDoc(doc(db, "readings", item.id));
          return;
        }
        const user = getCurrentUser();
          await addDoc(readingCollection, {
            originalKey: getReadingKey(item),
            deleted: true,
            authorId: user?.id || "",
            authorName: user?.name || "",
            authUid: auth.currentUser?.uid || "",
            createdAt: new Date().toISOString()
          });
      });
    });

    actions.append(edit, remove);
    card.append(actions);
  }

  if (item.attachments.length > 0) {
    const attachmentList = document.createElement("div");
    attachmentList.className = "reading-attachments";
    item.attachments.forEach((attachment) => {
      const href = attachment.href || attachment.url || attachment.link || "";
      const label = attachment.label || attachment.name || "\ucca8\ubd80";
      if (!href) return;
      const attachmentLink = document.createElement("a");
      attachmentLink.href = href;
      attachmentLink.target = "_blank";
      attachmentLink.rel = "noopener noreferrer";
      attachmentLink.textContent = label;
      attachmentList.append(attachmentLink);
    });
    if (attachmentList.childElementCount) card.append(attachmentList);
  }

  return card;
}

function renderSelectedReadings(grouped, filteredItems = readingItems) {
  const items = grouped.get(selectedReadingDate) || [];
  readingsList.replaceChildren();
  readingsSelectedTitle.textContent = formatKoreanDateLabel(selectedReadingDate);
  const filterText = hasActiveReadingFilters() ? ` · \ud544\ud130 ${filteredItems.length}\uac1c/${getReadingDateCount(filteredItems)}\uc77c` : "";
  readingsMeta.textContent = `\ucd1d ${readingItems.length}\uac1c · ${getReadingDateCount()}\uc77c${filterText} · \uc120\ud0dd\ud55c \ub0a0\uc9dc ${items.length}\uac1c`;
  readingsEmptyState.textContent = readingItems.length === 0
    ? "\uc77d\uc744\uac70\ub9ac \ub370\uc774\ud130\uac00 \uc544\uc9c1 \uc5c6\uc2b5\ub2c8\ub2e4. \ub4f1\ub85d \ubc84\ud2bc\uc73c\ub85c \uc0c8 \uc77d\uc744\uac70\ub9ac\ub97c \ucd94\uac00\ud574\uc8fc\uc138\uc694."
    : hasActiveReadingFilters() && filteredItems.length === 0
      ? "\uac80\uc0c9 \uc870\uac74\uc5d0 \ub9de\ub294 \uc77d\uc744\uac70\ub9ac\uac00 \uc5c6\uc2b5\ub2c8\ub2e4."
    : "\uc120\ud0dd\ud55c \ub0a0\uc9dc\uc5d0 \ub4f1\ub85d\ub41c \uc77d\uc744\uac70\ub9ac\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.";
  readingsEmptyState.classList.toggle("hidden", items.length > 0);

  items.forEach((item) => {
    readingsList.append(createReadingCard(item));
  });
}

async function loadReadings() {
  hasTriedLoadingBaseReadings = true;
  try {
    let payload = window.__READINGS_EXPORT__ || null;
    if (!payload) {
      const url = new URL(READINGS_EXPORT_URL, window.location.href);
      url.searchParams.set("_", Date.now());
      const response = await fetch(url.toString(), { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load readings.");
      payload = await response.json();
    }
    const rows = Array.isArray(payload) ? payload : payload.items;
    baseReadingItems = Array.isArray(rows)
      ? sortReadings(rows.map((row) => {
        const item = normalizeReadingItem({ ...row, source: "base" });
        item.originalKey = getReadingKey(item);
        return item;
      }).filter((item) => item.date && item.title))
      : [];
  } catch (error) {
    console.error("Failed to load readings.", error);
    baseReadingItems = [];
  }
  mergeReadingItems();
  renderReadings();
}

function setReadingSubmissionOpen(isOpen) {
  readingSubmissionModal.classList.toggle("hidden", !isOpen);
  readingSubmissionTitle.textContent = editingReadingId ? "\uc77d\uc744\uac70\ub9ac \uc218\uc815" : "\uc77d\uc744\uac70\ub9ac \ub4f1\ub85d\ud558\uae30";
  if (isOpen) {
    if (!editingReadingId) {
      readingSubmissionDate.value = selectedReadingDate || getLocalDateValue(new Date());
      readingSubmissionSubmitter.value = getCurrentUser()?.name || "";
      readingSubmissionDetails.value = readingSubmissionDetails.value || "\uc5c6\uc74c";
    }
    readingSubmissionMessage.textContent = "";
    document.querySelector("#readingSubmissionAgency").focus();
  } else {
    readingSubmissionMessage.textContent = "";
  }
}

function clearReadingSubmissionForm() {
  editingReadingId = null;
  editingReadingOriginalKey = null;
  readingSubmissionForm.reset();
  readingSubmissionDetails.value = "\uc5c6\uc74c";
  readingSubmissionTitle.textContent = "\uc77d\uc744\uac70\ub9ac \ub4f1\ub85d\ud558\uae30";
}

function fillReadingSubmissionForm(item) {
  editingReadingId = item.id || null;
  editingReadingOriginalKey = item.id ? item.originalKey || null : getReadingKey(item);
  readingSubmissionDate.value = item.date;
  readingSubmissionSubmitter.value = item.submitter || item.authorName || getCurrentUser()?.name || "";
  document.querySelector("#readingSubmissionAgency").value = item.agency || "";
  document.querySelector("#readingSubmissionEntryTitle").value = item.title || "";
  readingSubmissionDetails.value = item.details || "\uc5c6\uc74c";
  document.querySelector("#readingSubmissionLink").value = item.link || "";
  readingSubmissionMessage.textContent = "";
}

function createReadingSubmissionPayload(form) {
  const formData = new FormData(form);
  const value = (name) => String(formData.get(name) || "").trim();
  const date = value("date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("\ub0a0\uc9dc\ub97c \uc120\ud0dd\ud574\uc8fc\uc138\uc694.");
  }
  const details = value("details");
  const savedAt = new Date().toISOString();
  const user = getCurrentUser();
  const authUid = auth.currentUser?.uid || "";
  return {
    date,
    dateLabel: formatKoreanDateLabel(date),
    agency: value("agency"),
    title: value("title"),
    details: details && details !== "\uc5c6\uc74c" ? details : "",
    link: value("link"),
    submitter: value("submitter"),
    savedAt,
    authorId: user?.id || "",
    authorName: user?.name || value("submitter"),
    authUid,
    createdAt: savedAt,
    updatedAt: savedAt
  };
}

async function saveReadingSubmission(payload) {
  if (editingReadingId) {
    await setDoc(doc(db, "readings", editingReadingId), {
      date: payload.date,
      dateLabel: payload.dateLabel,
      agency: payload.agency,
      title: payload.title,
      details: payload.details,
      link: payload.link,
      submitter: payload.submitter,
      authUid: payload.authUid,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return;
  }
  if (editingReadingOriginalKey) {
    await addDoc(readingCollection, {
      ...payload,
      originalKey: editingReadingOriginalKey
    });
    return;
  }
  await addDoc(readingCollection, payload);
}

function makeOptionSelect(value, options, onChange) {
  const select = document.createElement("select");
  options.forEach((option) => {
    const item = document.createElement("option");
    item.value = option.value;
    item.textContent = option.label;
    select.append(item);
  });
  select.value = value;
  select.addEventListener("change", () => onChange(select.value));
  return select;
}

function renderAdminRows() {
  if (!adminRows) return;

  const roleOptions = [
    { value: "member", label: "\uc77c\ubc18" },
    { value: "admin", label: "\uad00\ub9ac\uc790" }
  ];
  const accessOptions = [
    { value: "active", label: "\ub85c\uadf8\uc778 \uac00\ub2a5" },
    { value: "disabled", label: "\uc0ad\uc81c" }
  ];
  const teamUsers = VALID_USERS.filter((user) => user.id !== "admin");

  adminRows.replaceChildren();
  teamUsers.forEach((user) => {
    const row = document.createElement("tr");
    const id = document.createElement("td");
    const name = document.createElement("td");
    const role = document.createElement("td");
    const access = document.createElement("td");
    const select = makeOptionSelect(getStoredUserRole(user.id), roleOptions, () => {
      adminMessage.textContent = "";
    });
    const accessSelect = makeOptionSelect(isUserDisabled(user.id) ? "disabled" : "active", accessOptions, () => {
      adminMessage.textContent = "";
    });

    select.dataset.userId = user.id;
    accessSelect.dataset.accessUserId = user.id;
    id.textContent = user.id;
    name.textContent = user.name;
    row.classList.toggle("disabled-user-row", isUserDisabled(user.id));
    role.append(select);
    access.append(accessSelect);
    row.append(id, name, role, access);
    adminRows.append(row);
  });
}

async function saveAdminRoles() {
  const roles = {};
  adminRows.querySelectorAll("select[data-user-id]").forEach((select) => {
    roles[select.dataset.userId] = select.value;
  });
  const disabledIds = [];
  adminRows.querySelectorAll("select[data-access-user-id]").forEach((select) => {
    if (select.value === "disabled") {
      disabledIds.push(select.dataset.accessUserId);
    }
  });

  try {
    await Promise.all([
      setDoc(adminRolesRef, { roles, updatedAt: new Date().toISOString() }, { merge: true }),
      setDoc(userAccessRef, { disabledUserIds: disabledIds, updatedAt: new Date().toISOString() }, { merge: true })
    ]);
    adminMessage.textContent = "\uad00\ub9ac\uc790 \uad8c\ud55c\uacfc \ub85c\uadf8\uc778 \uad8c\ud55c\uc774 \uc800\uc7a5\ub418\uc5c8\uc2b5\ub2c8\ub2e4.";
  } catch (error) {
    console.error("관리자 권한 저장에 실패했습니다.", error);
    adminMessage.textContent = "\uc800\uc7a5 \uad8c\ud55c \ub610\ub294 Firebase \uc5f0\uacb0 \uc0c1\ud0dc\ub97c \ud655\uc778\ud574\uc8fc\uc138\uc694.";
  }
}

function getSelectedPostIds() {
  return Array.from(boardRows.querySelectorAll(".post-delete-checkbox:checked")).map((checkbox) => checkbox.value);
}

function getSelectedWorkIds() {
  return Array.from(workRows.querySelectorAll(".work-delete-checkbox:checked")).map((checkbox) => checkbox.value);
}

function getSelectedScheduleIds() {
  return Array.from(scheduleRows.querySelectorAll(".schedule-delete-checkbox:checked")).map((checkbox) => checkbox.value);
}

function getSelectedMemoIds() {
  return Array.from(memoRows.querySelectorAll(".memo-delete-checkbox:checked")).map((checkbox) => checkbox.value);
}

function getActiveBulkDeleteTarget() {
  if (activeView === "work-list") {
    return { collectionName: "workStatus", selectedIds: getSelectedWorkIds() };
  }

  if (activeView === "schedule-list") {
    return { collectionName: "schedules", selectedIds: getSelectedScheduleIds() };
  }

  if (activeView === "memo-list") {
    return { collectionName: "memos", selectedIds: getSelectedMemoIds() };
  }

  return { collectionName: "meetingMinutes", selectedIds: getSelectedPostIds() };
}

function refreshAfterDelete(collectionName, selectedIds) {
  const deleted = new Set(selectedIds);

  if (collectionName === "meetingMinutes") {
    boardItems = boardItems.filter((item) => !deleted.has(item.id));
    renderBoard();
    renderCalendar();
    return;
  }

  if (collectionName === "workStatus") {
    workItems = workItems.filter((item) => !deleted.has(item.id));
    renderWorkList();
    renderWorkDashboard();
    return;
  }

  if (collectionName === "schedules") {
    scheduleItems = scheduleItems.filter((item) => !deleted.has(item.id));
    renderScheduleList();
    renderScheduleCalendar();
    return;
  }

  if (collectionName === "memos") {
    memoItems = memoItems.filter((item) => !deleted.has(item.id));
    renderMemoList();
  }
}

function setDeleteConfirmOpen(isOpen) {
  deleteConfirmModal.classList.toggle("hidden", !isOpen);
  if (!isOpen) {
    pendingDeleteAction = null;
  }
  if (isOpen) {
    confirmDeleteYes.focus();
  }
}

function requestDelete(action) {
  pendingDeleteAction = action;
  setDeleteConfirmOpen(true);
}

function setPasswordModalOpen(isOpen) {
  passwordModal.classList.toggle("hidden", !isOpen);
  if (isOpen) {
    passwordForm.reset();
    passwordMessage.textContent = "";
    document.querySelector("#currentPassword").focus();
  }
}

async function deleteSelectedPosts(selectedIds, collectionName) {
  if (!isAdminUser(getCurrentUser())) {
    window.alert("\uad00\ub9ac\uc790\ub9cc \uc0ad\uc81c\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.");
    return;
  }
  if (selectedIds.length === 0) {
    window.alert("\uc0ad\uc81c\ud560 \ud56d\ubaa9\uc744 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.");
    return;
  }

  try {
    await Promise.all(selectedIds.map((id) => db.collection(collectionName).doc(id).delete()));
    refreshAfterDelete(collectionName, selectedIds);
    setDeleteConfirmOpen(false);
    selectAllPosts.checked = false;
    selectAllWorkItems.checked = false;
    selectAllSchedules.checked = false;
    selectAllMemos.checked = false;
  } catch (error) {
    console.error("Failed to delete selected items.", error);
    window.alert("\uc0ad\uc81c\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. Firebase \uc5f0\uacb0 \ub610\ub294 \uad8c\ud55c\uc744 \ud655\uc778\ud574\uc8fc\uc138\uc694.");
  }
}

async function runPendingDelete() {
  if (pendingDeleteAction) {
    try {
      await pendingDeleteAction();
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Failed to delete item.", error);
      window.alert("\uc0ad\uc81c\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. Firebase \uc5f0\uacb0 \ub610\ub294 \uad8c\ud55c\uc744 \ud655\uc778\ud574\uc8fc\uc138\uc694.");
    }
    return;
  }

  const { selectedIds, collectionName } = getActiveBulkDeleteTarget();
  await deleteSelectedPosts(selectedIds, collectionName);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / BOARD_PAGE_SIZE);
  pagination.replaceChildren();
  pagination.classList.toggle("hidden", totalPages <= 1);
  if (totalPages <= 1) return;

  const prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.textContent = "\uc774\uc804";
  prevButton.disabled = currentBoardPage === 1;
  prevButton.addEventListener("click", () => {
    currentBoardPage = Math.max(1, currentBoardPage - 1);
    renderBoard();
  });
  pagination.append(prevButton);

  for (let page = 1; page <= totalPages; page += 1) {
    const pageButton = document.createElement("button");
    pageButton.type = "button";
    pageButton.textContent = String(page);
    pageButton.classList.toggle("active", page === currentBoardPage);
    pageButton.setAttribute("aria-current", page === currentBoardPage ? "page" : "false");
    pageButton.addEventListener("click", () => {
      currentBoardPage = page;
      renderBoard();
    });
    pagination.append(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.textContent = "\ub2e4\uc74c";
  nextButton.disabled = currentBoardPage === totalPages;
  nextButton.addEventListener("click", () => {
    currentBoardPage = Math.min(totalPages, currentBoardPage + 1);
    renderBoard();
  });
  pagination.append(nextButton);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderInlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let listOpen = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    const bullet = trimmed.match(/^[-*]\s+(.+)$/);

    if (!trimmed) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      return;
    }

    if (heading) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      const level = heading[1].length + 2;
      html.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      return;
    }

    if (bullet) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${renderInlineMarkdown(bullet[1])}</li>`);
      return;
    }

    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
    html.push(`<p>${renderInlineMarkdown(line)}</p>`);
  });

  if (listOpen) {
    html.push("</ul>");
  }

  return html.join("");
}

function formatDateLabel(dateValue, period, hour) {
  if (!dateValue) return "";
  const date = new Date(`${normalizeDateValue(dateValue)}T00:00:00`);
  const year = String(date.getFullYear()).slice(-2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const periodText = period === "PM" ? "\uc624\ud6c4" : "\uc624\uc804";
  return `${year}\ub144 ${month}\uc6d4 ${day}\uc77c ${periodText} ${hour}\uc2dc`;
}

function formatShortDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(`${normalizeDateValue(dateValue)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  const year = String(date.getFullYear()).slice(-2);
  return `${year}\ub144 ${date.getMonth() + 1}\uc6d4 ${date.getDate()}\uc77c`;
}

function splitDateLabel(dateText) {
  const match = dateText.match(/^(.+?\uc77c)\s+(.+)$/);
  return match ? [match[1], match[2]] : [dateText, ""];
}

function getInitials(name) {
  return name.slice(0, 1).toUpperCase();
}

function makeTag(text) {
  const tag = document.createElement("span");
  tag.className = `tag ${tagColor[text] || "blue"}`;
  tag.textContent = text;
  return tag;
}

function makeStatusTag(status) {
  const tag = document.createElement("span");
  const classMap = {
    "\uc9c4\ud589": "red",
    "\uc77c\uc2dc\uc911\uc9c0": "yellow",
    "\ub300\uae30": "green",
    "\ubcf4\ub958": "gray",
    "\uace0\ub824\uc911": "purple",
    "\uc644\ub8cc": "blue"
  };
  tag.className = `status-tag ${classMap[status] || "gray"}`;
  tag.textContent = status;
  return tag;
}

function getWorkCategoryClass(category) {
  const classMap = {
    "\uc5f0\uad6c\ubcf4\uace0\uc11c": "red",
    "\uc815\uae30\ubcf4\uace0\uc11c": "green",
    "\ube0c\ub9ac\ud504": "blue",
    "\uc804\ub9dd": "yellow",
    "\uae30\ud0c0": "purple"
  };
  return classMap[category] || "purple";
}

function renderWorkUpdates(item) {
  const updates = [...(item.updates || [])].sort((a, b) => (normalizeDateValue(b.date) || "").localeCompare(normalizeDateValue(a.date) || ""));
  const canEdit = canEditWorkItem(item);
  workUpdateRows.replaceChildren();

  updates.forEach((update) => {
    const row = document.createElement("tr");
    const date = document.createElement("td");
    const content = document.createElement("td");
    const actions = document.createElement("td");

    date.textContent = formatShortDate(update.date);
    content.textContent = update.content;
    actions.className = "action-cell";

    if (canEdit) {
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "small-action-button";
      edit.textContent = "\uc218\uc815";
      edit.addEventListener("click", () => {
        workUpdateDate.value = normalizeDateValue(update.date);
        workUpdateContent.value = update.content;
        workUpdateForm.dataset.editUpdateId = update.id;
        workUpdateContent.focus();
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "small-action-button danger";
      remove.textContent = "\uc0ad\uc81c";
      remove.addEventListener("click", async () => {
        if (!window.confirm("\uc0ad\uc81c\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?")) return;
        const nextUpdates = (item.updates || []).filter((savedUpdate) => savedUpdate.id !== update.id);
        await setDoc(doc(db, "workStatus", item.id), {
          updates: nextUpdates,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        item.updates = nextUpdates;
        renderWorkUpdates(item);
      });

      actions.append(edit, remove);
    }

    row.append(date, content, actions);
    workUpdateRows.append(row);
  });

  workUpdateEmpty.classList.toggle("hidden", updates.length > 0);
}

function getScheduleCategoryClass(category) {
  const classMap = {
    "\ud589\uc0ac": "blue",
    "\ud734\uac00": "red",
    "\ud68c\uc758": "green",
    "\uae30\ud0c0": "purple"
  };
  return classMap[category] || "purple";
}

function formatWorkPeriod(item) {
  if (item.alwaysOn) return "\uc0c1\uc2dc";
  const start = formatWorkStartDate(item);
  const end = formatWorkEndDate(item);
  return `${start} ~ ${end}`;
}

function formatWorkStartDate(item) {
  if (item.alwaysOn) return "\uc0c1\uc2dc";
  if (item.noStartDate) return "\uc2dc\uc791\uc77c \uc5c6\uc74c";
  return formatShortDate(item.startDate);
}

function formatWorkEndDate(item) {
  if (item.alwaysOn) return "\uc0c1\uc2dc";
  if (item.noEndDate) return "\uc885\ub8cc\uc77c \uc5c6\uc74c";
  return formatShortDate(item.endDate);
}

function formatSchedulePeriod(item) {
  const start = formatShortDate(item.startDate);
  const end = formatShortDate(item.endDate || item.startDate);
  return start === end ? start : `${start} ~ ${end}`;
}

function renderWorkDashboard() {
  if (!workDashboardPanel) return;
  const sortedItems = getFilteredWorkItems().sort((a, b) => (normalizeDateValue(a.startDate) || "").localeCompare(normalizeDateValue(b.startDate) || ""));
  workDashboardPanel.replaceChildren();

  WORK_DASHBOARD_STATUS_ORDER.forEach((status) => {
    const section = document.createElement("section");
    section.className = "dashboard-status-section";
    const heading = document.createElement("h2");
    heading.append(makeStatusTag(status));
    section.append(heading);

    const cards = document.createElement("div");
    cards.className = "dashboard-card-grid";

    sortedItems.filter((item) => item.status === status).forEach((item) => {
      const card = document.createElement("article");
      card.className = "dashboard-work-card";

      const title = document.createElement("h3");
      const titleButton = document.createElement("button");
      titleButton.className = "dashboard-title-button";
      titleButton.type = "button";
      titleButton.textContent = item.title;
      titleButton.addEventListener("click", () => showWorkDetailView(item.id));
      title.append(titleButton);

      const category = document.createElement("p");
      category.className = `dashboard-meta category ${getWorkCategoryClass(item.category)}`;
      category.textContent = item.category;

      const assignees = document.createElement("p");
      assignees.className = "dashboard-meta";
      assignees.textContent = getAssigneeNames(item).join(", ");

      const period = document.createElement("p");
      period.className = "dashboard-meta period";
      period.textContent = formatWorkPeriod(item);

      card.append(title, category, assignees, period);
      cards.append(card);
    });

    if (!cards.children.length) {
      const empty = document.createElement("p");
      empty.className = "dashboard-empty";
      empty.textContent = "\ud574\ub2f9 \uc0c1\ud0dc\uc758 \uc5c5\ubb34\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.";
      cards.append(empty);
    }

    section.append(cards);
    workDashboardPanel.append(section);
  });
}

function makeParticipants(people) {
  const wrap = document.createElement("div");
  wrap.className = "participants";

  people.forEach((name) => {
    const person = document.createElement("span");
    person.className = "person";

    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.textContent = getInitials(name);

    const label = document.createElement("span");
    label.textContent = name;

    person.append(avatar, label);
    wrap.append(person);
  });

  return wrap;
}

function appendOptions(select, options, includeAll) {
  if (includeAll) {
    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "\uc804\uccb4";
    select.append(allOption);
  }

  options.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    select.append(option);
  });
}

function renderUserChoices() {
  if (!participantChoices || !workAssigneeChoices || !workFilterAssignee) return;

  participantChoices.replaceChildren();
  workAssigneeChoices.replaceChildren();
  workFilterAssignee.querySelectorAll("option:not(:first-child)").forEach((option) => option.remove());

  getActiveUsers().forEach((user) => {
    const label = document.createElement("label");
    label.className = "participant-choice";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "participants";
    checkbox.value = user.name;

    const span = document.createElement("span");
    span.textContent = user.name;

    label.append(checkbox, span);
    participantChoices.append(label);
  });

  [
    { id: "team-sme", name: "\uc911\uc18c\uae30\uc5c5\ud300" },
    ...getActiveUsers()
  ].forEach((assignee) => {
    const label = document.createElement("label");
    label.className = "participant-choice";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "workAssignees";
    checkbox.value = assignee.id;
    const span = document.createElement("span");
    span.textContent = assignee.name;
    label.append(checkbox, span);
    workAssigneeChoices.append(label);

    const filterOption = document.createElement("option");
    filterOption.value = assignee.id;
    filterOption.textContent = assignee.name;
    workFilterAssignee.append(filterOption);
  });
}

function populateFormControls() {
  appendOptions(categoryTwo, TYPE_OPTIONS, false);
  appendOptions(postTypeTwo, TYPE_OPTIONS, false);
  appendOptions(workStatus, WORK_STATUS_OPTIONS, false);
  appendOptions(workCategory, WORK_CATEGORY_OPTIONS, false);
  appendOptions(workFilterStatus, WORK_STATUS_OPTIONS, false);
  appendOptions(workFilterCategory, WORK_CATEGORY_OPTIONS, false);
  appendOptions(scheduleCategory, SCHEDULE_CATEGORY_OPTIONS, false);
  renderUserChoices();
}

function getFilteredItems() {
  const keyword = searchInput.value.trim().toLowerCase();
  const startDate = startDateFilter.value;
  const endDate = endDateFilter.value;
  const typeTwo = categoryTwo.value;

  const filtered = boardItems.filter((item) => {
    const type = normalizeType(item.type2);
    const itemDate = normalizeDateValue(item.dateValue || item.date);
    const searchable = [
      item.dateText,
      item.title,
      item.topic,
      item.content,
      item.authorName,
      type,
      item.participants.join(" ")
    ].join(" ").toLowerCase();

    return (!keyword || searchable.includes(keyword))
      && (!startDate || itemDate >= startDate)
      && (!endDate || itemDate <= endDate)
      && (!typeTwo || type === typeTwo);
  });

  return sortPostsByRecent(filtered);
}

function renderBoard() {
  const items = getFilteredItems();
  const totalPages = Math.max(1, Math.ceil(items.length / BOARD_PAGE_SIZE));
  if (currentBoardPage > totalPages) {
    currentBoardPage = totalPages;
  }
  const pageStart = (currentBoardPage - 1) * BOARD_PAGE_SIZE;
  const pageItems = items.slice(pageStart, pageStart + BOARD_PAGE_SIZE);
  const canDelete = isAdminUser(getCurrentUser());
  tableWrap.classList.toggle("admin-delete-mode", canDelete);
  deleteSelectHeader.classList.toggle("hidden", !canDelete);
  selectAllPosts.checked = false;
  boardRows.replaceChildren();

  pageItems.forEach((item) => {
    const type = normalizeType(item.type2);
    const row = document.createElement("tr");
    row.className = "black";

    if (canDelete) {
      const selector = document.createElement("td");
      selector.className = "delete-select-cell";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "post-delete-checkbox";
      checkbox.value = item.id;
      checkbox.setAttribute("aria-label", `${item.title} \uc120\ud0dd`);
      selector.append(checkbox);
      row.append(selector);
    }

    const date = document.createElement("td");
    date.className = "date-cell";
    const [datePart, timePart] = splitDateLabel(item.dateText);
    const dateLine = document.createElement("span");
    dateLine.textContent = datePart;
    const timeLine = document.createElement("span");
    timeLine.className = "time-part";
    timeLine.textContent = `(${timePart})`;
    date.append(dateLine, timeLine);

    const title = document.createElement("td");
    title.className = "title-cell";
    const titleButton = document.createElement("button");
    titleButton.className = "link-button";
    titleButton.type = "button";
    titleButton.textContent = item.title;
    titleButton.addEventListener("click", () => showDetailView(item.id));
    title.append(titleButton);

    const topic = document.createElement("td");
    const topicButton = document.createElement("button");
    topicButton.className = "link-button topic-link";
    topicButton.type = "button";
    topicButton.textContent = item.topic;
    topicButton.addEventListener("click", () => showDetailView(item.id));
    topic.append(topicButton);

    const types = document.createElement("td");
    types.className = "type-cell";
    types.append(makeTag(type));

    const author = document.createElement("td");
    author.className = "author-cell";
    author.textContent = item.authorName || "";

    row.append(date, title, topic, types, author);
    boardRows.append(row);
  });
  emptyState.classList.toggle("hidden", items.length > 0);
  renderPagination(items.length);
}

function canEditWorkItem(item) {
  const user = getCurrentUser();
  return Boolean(user) && (isAdminUser(user) || getAssigneeIds(item).includes(user.id) || getAssigneeIds(item).includes("team-sme"));
}

function canDeleteWorkItem(item) {
  const user = getCurrentUser();
  return Boolean(user) && (isAdminUser(user)
    || item.authorId === user?.id
    || (!item.authorId && item.authorName === user?.name)
    || (!item.authorId && getAssigneeIds(item).includes(user?.id))
    || getAssigneeIds(item).includes("team-sme"));
}

function getFilteredWorkItems() {
  const startDate = workFilterStartDate.value;
  const endDate = workFilterEndDate.value;
  const assignee = workFilterAssignee.value;
  const status = workFilterStatus.value;
  const category = workFilterCategory.value;

  return workItems.filter((item) => {
    const itemStart = item.noStartDate || item.alwaysOn ? "0000-01-01" : normalizeDateValue(item.startDate);
    const itemEnd = item.noEndDate || item.alwaysOn ? "9999-12-31" : normalizeDateValue(item.endDate || item.startDate);
    return (!startDate || itemEnd >= startDate)
      && (!endDate || itemStart <= endDate)
      && (!assignee || getAssigneeIds(item).includes(assignee))
      && (!status || item.status === status)
      && (!category || item.category === category);
  });
}

function renderWorkList() {
  if (!workRows) return;
  const sortedItems = getFilteredWorkItems().sort((a, b) => (normalizeDateValue(b.startDate) || "").localeCompare(normalizeDateValue(a.startDate) || ""));
  const canDelete = isAdminUser(getCurrentUser());
  workDeleteSelectHeader.classList.toggle("hidden", !canDelete);
  selectAllWorkItems.checked = false;
  workRows.replaceChildren();

  sortedItems.forEach((item) => {
    const row = document.createElement("tr");
    row.className = "black";

    if (canDelete) {
      const selector = document.createElement("td");
      selector.className = "delete-select-cell";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "work-delete-checkbox";
      checkbox.value = item.id;
      checkbox.setAttribute("aria-label", `${item.title} \uc120\ud0dd`);
      selector.append(checkbox);
      row.append(selector);
    }

    const start = document.createElement("td");
    start.textContent = formatWorkStartDate(item);

    const end = document.createElement("td");
    end.textContent = formatWorkEndDate(item);

    const title = document.createElement("td");
    title.className = "title-cell";
    const button = document.createElement("button");
    button.className = "link-button";
    button.type = "button";
    button.textContent = item.title;
    button.addEventListener("click", () => showWorkDetailView(item.id));
    title.append(button);

    const assignee = document.createElement("td");
    assignee.textContent = getAssigneeNames(item).join(", ");

    const status = document.createElement("td");
    status.append(makeStatusTag(item.status));

    const category = document.createElement("td");
    category.textContent = item.category;

    row.append(start, end, title, assignee, status, category);
    workRows.append(row);
  });

  workEmptyState.classList.toggle("hidden", sortedItems.length > 0);
}

function canManageScheduleItem(item) {
  const user = getCurrentUser();
  return isAdminUser(user) || item.authorId === user?.id;
}

function canManageMemoItem(item) {
  const user = getCurrentUser();
  return isAdminUser(user) || item.authorId === user?.id;
}

function renderScheduleList() {
  if (!scheduleRows) return;
  const sortedItems = [...scheduleItems].sort((a, b) => (normalizeDateValue(b.startDate) || "").localeCompare(normalizeDateValue(a.startDate) || ""));
  const canDelete = isAdminUser(getCurrentUser());
  scheduleDeleteSelectHeader.classList.toggle("hidden", !canDelete);
  selectAllSchedules.checked = false;
  scheduleRows.replaceChildren();

  sortedItems.forEach((item) => {
    const row = document.createElement("tr");
    row.className = "black";

    if (canDelete) {
      const selector = document.createElement("td");
      selector.className = "delete-select-cell";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "schedule-delete-checkbox";
      checkbox.value = item.id;
      checkbox.setAttribute("aria-label", `${item.description} \uc120\ud0dd`);
      selector.append(checkbox);
      row.append(selector);
    }

    const date = document.createElement("td");
    date.textContent = formatSchedulePeriod(item);

    const category = document.createElement("td");
    const categoryTag = document.createElement("span");
    categoryTag.className = `schedule-category-tag ${getScheduleCategoryClass(item.category)}`;
    categoryTag.textContent = item.category;
    category.append(categoryTag);

    const description = document.createElement("td");
    description.textContent = item.description;

    const actions = document.createElement("td");
    actions.className = "action-cell";
    if (canManageScheduleItem(item)) {
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "small-action-button";
      edit.textContent = "\uc218\uc815";
      edit.addEventListener("click", () => {
        showScheduleListView();
        fillScheduleForm(item);
        setScheduleFormOpen(true);
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "small-action-button danger";
      remove.textContent = "\uc0ad\uc81c";
      remove.addEventListener("click", async () => {
        if (!window.confirm("\uc0ad\uc81c\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?")) return;
        await deleteDoc(doc(db, "schedules", item.id));
      });
      actions.append(edit, remove);
    }

    row.append(date, category, description, actions);
    scheduleRows.append(row);
  });

  scheduleEmptyState.classList.toggle("hidden", sortedItems.length > 0);
}

function renderMemoList() {
  if (!memoRows) return;
  const sortedItems = [...memoItems].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const canDelete = isAdminUser(getCurrentUser());
  memoDeleteSelectHeader.classList.toggle("hidden", !canDelete);
  selectAllMemos.checked = false;
  memoRows.replaceChildren();

  sortedItems.forEach((item) => {
    const row = document.createElement("tr");
    row.className = "black";

    if (canDelete) {
      const selector = document.createElement("td");
      selector.className = "delete-select-cell";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "memo-delete-checkbox";
      checkbox.value = item.id;
      checkbox.setAttribute("aria-label", `${item.title} \uc120\ud0dd`);
      selector.append(checkbox);
      row.append(selector);
    }

    const title = document.createElement("td");
    title.className = "title-cell";
    const titleButton = document.createElement("button");
    titleButton.className = "link-button";
    titleButton.type = "button";
    titleButton.textContent = item.title;
    titleButton.addEventListener("click", () => showMemoDetailView(item.id));
    title.append(titleButton);

    const author = document.createElement("td");
    author.textContent = item.authorName || "";

    const created = document.createElement("td");
    created.textContent = formatShortDate((item.createdAt || "").slice(0, 10));

    row.append(title, author, created);
    memoRows.append(row);
  });

  memoEmptyState.classList.toggle("hidden", sortedItems.length > 0);
}

function renderScheduleCalendar() {
  if (!scheduleCalendarGrid) return;
  const year = currentScheduleCalendarDate.getFullYear();
  const month = currentScheduleCalendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  scheduleCalendarTitle.textContent = `${year}.${String(month + 1).padStart(2, "0")}`;
  scheduleCalendarGrid.replaceChildren();

  for (let i = 0; i < firstDay.getDay(); i += 1) {
    const empty = document.createElement("div");
    empty.className = "calendar-cell muted";
    scheduleCalendarGrid.append(empty);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const key = getDateKey(date);
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    const dayNumber = document.createElement("span");
    dayNumber.className = "day-number";
    dayNumber.textContent = String(day);
    cell.append(dayNumber);

    scheduleItems.filter((item) => {
      const start = normalizeDateValue(item.startDate);
      const end = normalizeDateValue(item.endDate || item.startDate);
      return key >= start && key <= end;
    }).forEach((item) => {
      const badge = document.createElement("button");
      badge.className = `calendar-event ${getScheduleCategoryClass(item.category)}`;
      badge.type = "button";
      badge.textContent = `${item.category} ${item.description}`;
      if (canManageScheduleItem(item)) {
        badge.addEventListener("click", () => {
          showScheduleListView();
          fillScheduleForm(item);
          setScheduleFormOpen(true);
        });
      }
      cell.append(badge);
    });

    scheduleCalendarGrid.append(cell);
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const userId = String(formData.get("userId")).trim();
  const password = String(formData.get("password") || "");
  const user = VALID_USERS.find((item) => item.id === userId);

  if (!user) {
    loginError.textContent = ko.badLogin;
    return;
  }

  loginError.textContent = "";
  try {
    await ensureAnonymousAuth();
    await loadUserAccessSettings();
    if (isUserDisabled(user.id)) {
      loginError.textContent = ko.loginDisabled;
      return;
    }
    await loadPasswordSettings();
    if (!await isValidPassword(user.id, password)) {
      loginError.textContent = ko.badPassword;
      return;
    }
    startFirestoreListeners();
    const loginUser = { ...user, role: getStoredUserRole(user.id) };
    sessionStorage.setItem("currentUser", JSON.stringify(loginUser));
    setView(loginUser);
  } catch (error) {
    console.error("Failed to sign in anonymously.", error);
    loginError.textContent = ko.authFailed;
  }
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(postForm);
  const participants = formData.getAll("participants").map(String);

  if (participants.length === 0) {
    formMessage.textContent = ko.participantRequired;
    return;
  }

  const post = {
    date: String(formData.get("date")),
    dateValue: String(formData.get("date")),
    period: String(formData.get("period")),
    hour: String(formData.get("hour")),
    dateText: formatDateLabel(String(formData.get("date")), String(formData.get("period")), String(formData.get("hour"))),
    title: String(formData.get("title")).trim(),
    topic: String(formData.get("topic")).trim(),
    content: String(formData.get("content")).trim(),
    contentFontSize: "16",
    contentColor: "#263442",
    type1: "",
    type2: normalizeType(String(formData.get("type2"))),
    participants,
    authorId: getCurrentUser()?.id || "",
    authorName: getCurrentUser()?.name || "",
    createdAt: new Date().toISOString()
  };

  try {
    if (editingPostId) {
      const existingPost = boardItems.find((item) => item.id === editingPostId);
      if (!existingPost) return;

      await setDoc(doc(db, "meetingMinutes", editingPostId), {
        date: post.date,
        dateValue: post.dateValue,
        period: post.period,
        hour: post.hour,
        dateText: post.dateText,
        title: post.title,
        topic: post.topic,
        content: post.content,
        contentFontSize: post.contentFontSize,
        contentColor: post.contentColor,
        type1: "",
        type2: post.type2,
        participants: post.participants,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } else {
      await addDoc(meetingCollection, post);
    }
  } catch (error) {
    console.error("게시글 저장에 실패했습니다.", error);
    formMessage.textContent = "저장 권한 또는 Firebase 연결 상태를 확인해주세요.";
    return;
  }

  clearPostForm();
  formMessage.textContent = ko.saved;
  setPostFormOpen(false);
  showListView();
});

workForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(workForm);
  const assigneeIds = formData.getAll("workAssignees").map(String);
  if (assigneeIds.length === 0) {
    workFormMessage.textContent = "\ub2f4\ub2f9\uc790\ub97c 1\uba85 \uc774\uc0c1 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.";
    return;
  }
  const alwaysOn = formData.get("alwaysOn") === "on";
  const noStartDate = alwaysOn || formData.get("noStartDate") === "on";
  const noEndDate = alwaysOn || formData.get("noEndDate") === "on";
  const startDate = noStartDate ? "" : normalizeDateValue(String(formData.get("startDate")));
  const endDate = noEndDate ? "" : normalizeDateValue(String(formData.get("endDate")));

  if (!noStartDate && !startDate) {
    workFormMessage.textContent = "\uc2dc\uc791\uc77c\uc744 \uc120\ud0dd\ud558\uac70\ub098 \uc2dc\uc791\uc77c \uc5c6\uc74c\uc744 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.";
    return;
  }
  if (!noEndDate && !endDate) {
    workFormMessage.textContent = "\uc885\ub8cc\uc77c\uc744 \uc120\ud0dd\ud558\uac70\ub098 \uc885\ub8cc\uc77c \uc5c6\uc74c\uc744 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.";
    return;
  }

  const workItem = {
    startDate,
    endDate,
    noStartDate,
    noEndDate,
    alwaysOn,
    title: String(formData.get("title")).trim(),
    assigneeId: assigneeIds[0],
    assigneeIds,
    assigneeName: getUserName(assigneeIds[0]),
    assigneeNames: assigneeIds.map(getUserName).filter(Boolean),
    status: String(formData.get("status")),
    category: String(formData.get("category")),
    authorId: getCurrentUser()?.id || "",
    authorName: getCurrentUser()?.name || "",
    createdAt: new Date().toISOString()
  };

  try {
    if (editingWorkId) {
      const existingItem = workItems.find((item) => item.id === editingWorkId);
      if (!existingItem || !canEditWorkItem(existingItem)) return;
      await setDoc(doc(db, "workStatus", editingWorkId), {
        startDate: workItem.startDate,
        endDate: workItem.endDate,
        noStartDate: workItem.noStartDate,
        noEndDate: workItem.noEndDate,
        alwaysOn: workItem.alwaysOn,
        title: workItem.title,
        assigneeId: workItem.assigneeId,
        assigneeIds: workItem.assigneeIds,
        assigneeName: workItem.assigneeName,
        assigneeNames: workItem.assigneeNames,
        status: workItem.status,
        category: workItem.category,
        updates: existingItem.updates || [],
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } else {
      await addDoc(workCollection, workItem);
    }
  } catch (error) {
    console.error("Failed to save work status.", error);
    workFormMessage.textContent = "저장 권한 또는 Firebase 연결 상태를 확인해주세요.";
    return;
  }

  clearWorkForm();
  setWorkFormOpen(false);
  showWorkListView();
});

workUpdateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const item = workItems.find((workItem) => workItem.id === currentWorkDetailId);
  if (!item || !canEditWorkItem(item)) return;

  const formData = new FormData(workUpdateForm);
  const update = {
    id: workUpdateForm.dataset.editUpdateId || String(Date.now()),
    date: normalizeDateValue(String(formData.get("date"))),
    content: String(formData.get("content")).trim()
  };
  if (!update.date || !update.content) return;

  const updates = workUpdateForm.dataset.editUpdateId
    ? (item.updates || []).map((savedUpdate) => savedUpdate.id === update.id ? update : savedUpdate)
    : [...(item.updates || []), update];

  try {
    await setDoc(doc(db, "workStatus", item.id), {
      updates,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    item.updates = updates;
    renderWorkUpdates(item);
    workUpdateForm.reset();
    delete workUpdateForm.dataset.editUpdateId;
    workUpdateDate.value = getLocalDateValue(new Date());
    workUpdateContent.focus();
  } catch (error) {
    console.error("Failed to save work update.", error);
    window.alert("\uc9c4\ud589 \ud604\ud669\uc744 \uc800\uc7a5\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. Firebase \uc5f0\uacb0 \ub610\ub294 \uad8c\ud55c\uc744 \ud655\uc778\ud574\uc8fc\uc138\uc694.");
  }
});

memoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const user = getCurrentUser();
  const formData = new FormData(memoForm);
  const memo = {
    title: String(formData.get("title")).trim(),
    content: String(formData.get("content")).trim(),
    authorId: user?.id || "",
    authorName: user?.name || "",
    createdAt: new Date().toISOString()
  };

  try {
    if (editingMemoId) {
      const existingMemo = memoItems.find((item) => item.id === editingMemoId);
      if (!existingMemo || !canManageMemoItem(existingMemo)) return;
      await setDoc(doc(db, "memos", editingMemoId), {
        title: memo.title,
        content: memo.content,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } else {
      await addDoc(memoCollection, memo);
    }
  } catch (error) {
    console.error("Failed to save memo.", error);
    memoFormMessage.textContent = "\uc800\uc7a5 \uad8c\ud55c \ub610\ub294 Firebase \uc5f0\uacb0 \uc0c1\ud0dc\ub97c \ud655\uc778\ud574\uc8fc\uc138\uc694.";
    return;
  }

  clearMemoForm();
  setMemoFormOpen(false);
  showMemoListView();
});

scheduleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const user = getCurrentUser();
  const formData = new FormData(scheduleForm);
  const scheduleItem = {
    startDate: normalizeDateValue(String(formData.get("startDate"))),
    endDate: normalizeDateValue(String(formData.get("endDate"))),
    category: String(formData.get("category")),
    description: String(formData.get("description")).trim(),
    authorId: user?.id || "",
    authorName: user?.name || "",
    createdAt: new Date().toISOString()
  };

  try {
    if (editingScheduleId) {
      const existingItem = scheduleItems.find((item) => item.id === editingScheduleId);
      if (!existingItem || !canManageScheduleItem(existingItem)) return;
      await setDoc(doc(db, "schedules", editingScheduleId), {
        startDate: scheduleItem.startDate,
        endDate: scheduleItem.endDate,
        category: scheduleItem.category,
        description: scheduleItem.description,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } else {
      await addDoc(scheduleCollection, scheduleItem);
    }
  } catch (error) {
    console.error("Failed to save schedule.", error);
    scheduleFormMessage.textContent = "저장 권한 또는 Firebase 연결 상태를 확인해주세요.";
    return;
  }

  clearScheduleForm();
  setScheduleFormOpen(false);
  showScheduleListView();
});

newPostButton.addEventListener("click", () => {
  if (activeView === "memo-list") {
    if (memoFormPanel.classList.contains("hidden")) {
      clearMemoForm();
      setMemoFormOpen(true);
      return;
    }
    setMemoFormOpen(false);
    return;
  }

  if (activeView === "schedule-list" || activeView === "schedule-calendar") {
    if (scheduleFormPanel.classList.contains("hidden")) {
      clearScheduleForm();
      setScheduleFormOpen(true);
      return;
    }
    setScheduleFormOpen(false);
    return;
  }

  if (activeView === "work-list") {
    if (workFormPanel.classList.contains("hidden")) {
      clearWorkForm();
      setWorkFormOpen(true);
      return;
    }
    setWorkFormOpen(false);
    return;
  }

  if (postPanel.classList.contains("hidden")) {
    clearPostForm();
    setPostFormOpen(true);
    return;
  }
  setPostFormOpen(false);
});

cancelPostButton.addEventListener("click", () => {
  clearPostForm();
  setPostFormOpen(false);
});

cancelWorkButton.addEventListener("click", () => {
  clearWorkForm();
  setWorkFormOpen(false);
});

cancelScheduleButton.addEventListener("click", () => {
  clearScheduleForm();
  setScheduleFormOpen(false);
});

cancelMemoButton.addEventListener("click", () => {
  clearMemoForm();
  setMemoFormOpen(false);
});

workNoStartDate.addEventListener("change", syncWorkDateControls);
workNoEndDate.addEventListener("change", syncWorkDateControls);
workAlwaysOn.addEventListener("change", syncWorkDateControls);

editPostButton.addEventListener("click", () => {
  const post = boardItems.find((item) => item.id === editPostButton.dataset.postId);
  if (!post) return;

  showListView();
  fillPostForm(post);
  setPostFormOpen(true);
});

deleteSelectedButton.addEventListener("click", () => {
  const { selectedIds, collectionName } = getActiveBulkDeleteTarget();
  if (selectedIds.length === 0) {
    window.alert("\uc0ad\uc81c\ud560 \ud56d\ubaa9\uc744 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.");
    return;
  }
  requestDelete(() => deleteSelectedPosts(selectedIds, collectionName));
});

confirmDeleteYes.addEventListener("click", runPendingDelete);

confirmDeleteNo.addEventListener("click", () => setDeleteConfirmOpen(false));

deleteConfirmModal.addEventListener("click", (event) => {
  if (event.target === deleteConfirmModal) {
    setDeleteConfirmOpen(false);
  }
});

selectAllPosts.addEventListener("change", () => {
  boardRows.querySelectorAll(".post-delete-checkbox").forEach((checkbox) => {
    checkbox.checked = selectAllPosts.checked;
  });
});

selectAllWorkItems.addEventListener("change", () => {
  workRows.querySelectorAll(".work-delete-checkbox").forEach((checkbox) => {
    checkbox.checked = selectAllWorkItems.checked;
  });
});

selectAllSchedules.addEventListener("change", () => {
  scheduleRows.querySelectorAll(".schedule-delete-checkbox").forEach((checkbox) => {
    checkbox.checked = selectAllSchedules.checked;
  });
});

selectAllMemos.addEventListener("change", () => {
  memoRows.querySelectorAll(".memo-delete-checkbox").forEach((checkbox) => {
    checkbox.checked = selectAllMemos.checked;
  });
});

backToListButton.addEventListener("click", showListView);

backToWorkListButton.addEventListener("click", showWorkDetailReturnView);

backToMemoListButton.addEventListener("click", showMemoListView);

deletePostButton.addEventListener("click", () => {
  const post = boardItems.find((item) => item.id === deletePostButton.dataset.postId);
  const user = getCurrentUser();
  const canDelete = post && (isAdminUser(user) || post.authorId === user?.id || (!post.authorId && post.authorName === user?.name));
  if (!canDelete) return;

  requestDelete(async () => {
    await deleteDoc(doc(db, "meetingMinutes", post.id));
    showListView();
  });
});

editWorkButton.addEventListener("click", () => {
  const item = workItems.find((workItem) => workItem.id === editWorkButton.dataset.workId);
  if (!item || !canEditWorkItem(item)) return;

  showWorkListView();
  fillWorkForm(item);
  setWorkFormOpen(true);
});

deleteWorkButton.addEventListener("click", () => {
  const item = workItems.find((workItem) => workItem.id === deleteWorkButton.dataset.workId);
  if (!item || !canDeleteWorkItem(item)) return;

  requestDelete(async () => {
    await deleteDoc(doc(db, "workStatus", item.id));
    showWorkListView();
  });
});

editMemoButton.addEventListener("click", () => {
  const item = memoItems.find((memo) => memo.id === editMemoButton.dataset.memoId);
  if (!item || !canManageMemoItem(item)) return;

  showMemoListView();
  fillMemoForm(item);
  setMemoFormOpen(true);
});

deleteMemoButton.addEventListener("click", () => {
  const item = memoItems.find((memo) => memo.id === deleteMemoButton.dataset.memoId);
  if (!item || !canManageMemoItem(item)) return;

  requestDelete(async () => {
    await deleteDoc(doc(db, "memos", item.id));
    showMemoListView();
  });
});

menuWorkDashboardButton.addEventListener("click", showWorkDashboardView);

menuWorkListButton.addEventListener("click", showWorkListView);

menuListButton.addEventListener("click", showListView);

menuCalendarButton.addEventListener("click", showCalendarView);

menuReadingsListButton.addEventListener("click", () => {
  activeReadingsView = "list";
  showReadingsView();
});

menuReadingsButton.addEventListener("click", () => {
  activeReadingsView = "calendar";
  showReadingsView();
});

menuSmeStatsButton.addEventListener("click", showSmeStatsView);

menuDashboardButton.addEventListener("click", showDashboardView);

menuScheduleListButton.addEventListener("click", showScheduleListView);

menuScheduleCalendarButton.addEventListener("click", showScheduleCalendarView);

menuLinkSitesButton.addEventListener("click", showLinkSitesView);

menuMemoListButton.addEventListener("click", showMemoListView);

dashboardSelect.addEventListener("change", (event) => {
  selectedDashboardId = event.target.value;
  renderDashboard();
});

dashboardZoomRange.addEventListener("input", (event) => {
  dashboardUserZoom = clampNumber(Number(event.target.value) / 100, 0.7, 1.3);
  syncDashboardZoomControl();
  updateDashboardVizScale();
});

dashboardZoomReset.addEventListener("click", () => {
  dashboardUserZoom = 1;
  syncDashboardZoomControl();
  updateDashboardVizScale();
});

window.addEventListener("resize", () => {
  if (activeView !== "dashboard") return;
  const selectedDashboard = getSelectedDashboard();
  const preferredDevice = getDashboardViewportPreset().device;
  if (selectedDashboard && dashboardVizMount.dataset.device !== preferredDevice) {
    renderDashboardViz(selectedDashboard);
    return;
  }
  updateDashboardVizScale();
});

adminPageButton.addEventListener("click", showAdminView);

saveAdminRolesButton.addEventListener("click", saveAdminRoles);

markdownControls.forEach((button) => {
  button.addEventListener("click", () => applyMarkdownAction(button.dataset.markdownAction));
});

readingMarkdownControls.forEach((button) => {
  button.addEventListener("click", () => applyReadingMarkdownAction(button.dataset.readingMarkdownAction));
});

changePasswordButton.addEventListener("click", () => setPasswordModalOpen(true));

homeButton.addEventListener("click", showWorkDashboardView);

brandHomeButton.addEventListener("click", showWorkDashboardView);

cancelPasswordButton.addEventListener("click", () => setPasswordModalOpen(false));

passwordModal.addEventListener("click", (event) => {
  if (event.target === passwordModal) {
    setPasswordModalOpen(false);
  }
});

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) return;

  const formData = new FormData(passwordForm);
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!await isValidPassword(user.id, currentPassword)) {
    passwordMessage.textContent = ko.badPassword;
    return;
  }

  if (newPassword.length < 4) {
    passwordMessage.textContent = ko.passwordTooShort;
    return;
  }

  if (newPassword !== confirmPassword) {
    passwordMessage.textContent = ko.passwordMismatch;
    return;
  }

  try {
    await saveUserPassword(user.id, newPassword);
    passwordMessage.textContent = ko.passwordChanged;
    setTimeout(() => setPasswordModalOpen(false), 700);
  } catch (error) {
    console.error("Failed to change password.", error);
    passwordMessage.textContent = ko.authFailed;
  }
});

prevMonthButton.addEventListener("click", () => {
  currentCalendarDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  currentCalendarDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1);
  renderCalendar();
});

prevScheduleMonthButton.addEventListener("click", () => {
  currentScheduleCalendarDate = new Date(currentScheduleCalendarDate.getFullYear(), currentScheduleCalendarDate.getMonth() - 1, 1);
  renderScheduleCalendar();
});

nextScheduleMonthButton.addEventListener("click", () => {
  currentScheduleCalendarDate = new Date(currentScheduleCalendarDate.getFullYear(), currentScheduleCalendarDate.getMonth() + 1, 1);
  renderScheduleCalendar();
});

prevReadingsMonthButton.addEventListener("click", () => {
  currentReadingsCalendarDate = new Date(currentReadingsCalendarDate.getFullYear(), currentReadingsCalendarDate.getMonth() - 1, 1);
  renderReadings();
});

nextReadingsMonthButton.addEventListener("click", () => {
  currentReadingsCalendarDate = new Date(currentReadingsCalendarDate.getFullYear(), currentReadingsCalendarDate.getMonth() + 1, 1);
  renderReadings();
});

todayReadingsButton.addEventListener("click", () => {
  const today = new Date();
  readingsSearchInput.value = "";
  readingsStartDateFilter.value = "";
  readingsEndDateFilter.value = "";
  currentReadingsPage = 1;
  selectedReadingDate = getLocalDateValue(today);
  currentReadingsCalendarDate = new Date(today.getFullYear(), today.getMonth(), 1);
  renderReadings({ preserveSelectedDate: true });
});

[readingsSearchInput, readingsStartDateFilter, readingsEndDateFilter].forEach((control) => {
  control.addEventListener("input", () => {
    currentReadingsPage = 1;
    selectedReadingDetailKey = "";
    renderReadings();
  });
});

clearReadingsFiltersButton.addEventListener("click", () => {
  readingsSearchInput.value = "";
  readingsStartDateFilter.value = "";
  readingsEndDateFilter.value = "";
  currentReadingsPage = 1;
  selectedReadingDetailKey = "";
  renderReadings();
});

readingsListTabButton.addEventListener("click", () => {
  activeReadingsView = "list";
  renderReadings();
});

readingsCalendarTabButton.addEventListener("click", () => {
  activeReadingsView = "calendar";
  renderReadings();
});

openReadingSubmissionButton.addEventListener("click", () => {
  clearReadingSubmissionForm();
  setReadingSubmissionOpen(true);
});

closeReadingSubmissionButton.addEventListener("click", () => {
  setReadingSubmissionOpen(false);
  clearReadingSubmissionForm();
});

cancelReadingSubmissionButton.addEventListener("click", () => {
  setReadingSubmissionOpen(false);
  clearReadingSubmissionForm();
});

readingSubmissionModal.addEventListener("click", (event) => {
  if (event.target === readingSubmissionModal) {
    setReadingSubmissionOpen(false);
    clearReadingSubmissionForm();
  }
});

readingSubmissionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let payload = null;
  try {
    payload = createReadingSubmissionPayload(readingSubmissionForm);
    readingSubmissionMessage.textContent = "\ub4f1\ub85d \uc911\uc785\ub2c8\ub2e4...";
    await saveReadingSubmission(payload);
  } catch (error) {
    readingSubmissionMessage.textContent = error.message || "\ub4f1\ub85d\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.";
    return;
  }

  selectedReadingDate = payload.date;
  currentReadingsCalendarDate = new Date(Number(payload.date.slice(0, 4)), Number(payload.date.slice(5, 7)) - 1, 1);
  setReadingSubmissionOpen(false);
  clearReadingSubmissionForm();
  renderReadings();
});

logoutButton.addEventListener("click", async () => {
  sessionStorage.removeItem("currentUser");
  stopFirestoreListeners();
  await auth.signOut();
  loginForm.reset();
  showListView();
  setView(null);
});

[searchInput, startDateFilter, endDateFilter, categoryTwo].forEach((control) => {
  control.addEventListener("input", () => {
    currentBoardPage = 1;
    renderBoard();
  });
});

[workFilterStartDate, workFilterEndDate, workFilterAssignee, workFilterStatus, workFilterCategory].forEach((control) => {
  control.addEventListener("input", () => {
    renderWorkList();
    renderWorkDashboard();
  });
});

populateFormControls();
applyContentInputStyle();
loadReadings();
const savedUser = getCurrentUser();
setView(savedUser);
if (savedUser) {
  ensureAnonymousAuth()
    .then(startFirestoreListeners)
    .catch((error) => {
      console.error("Failed to restore anonymous auth.", error);
      sessionStorage.removeItem("currentUser");
      setView(null);
    });
}
