// 키워드 추출 및 분석 유틸리티
export const extractKeywords = (articles) => {
  if (!articles || articles.length === 0) return [];
  
  console.log('키워드 추출을 위한 기사 데이터:', articles);
  
  // 모든 기사의 제목과 설명을 합쳐서 텍스트 추출
  const allText = articles
    .map(article => {
      const title = article.title || '';
      const description = article.description || '';
      const content = article.content || '';
      return `${title} ${description} ${content}`;
    })
    .join(' ')
    .toLowerCase();
  
  console.log('추출된 전체 텍스트 길이:', allText.length);
  
  if (allText.trim().length === 0) {
    console.warn('추출할 텍스트가 없습니다.');
    return [];
  }
  
  // 간단한 키워드 추출 (실제로는 더 정교한 NLP 라이브러리 사용 가능)
  const words = allText
    .replace(/[^\w\s가-힣]/g, ' ') // 특수문자 제거
    .split(/\s+/)
    .filter(word => word.length >= 2) // 2글자 이상 (더 관대하게)
    .filter(word => !isStopWord(word)) // 불용어 제거
    .filter(word => !/^\d+$/.test(word)) // 숫자만 있는 단어 제거
    .filter(word => word.length <= 20); // 너무 긴 단어 제거
  
  console.log('전처리된 단어 수:', words.length);
  
  // 단어 빈도 계산
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  console.log('단어 빈도 맵:', wordCount);
  
  // 빈도순으로 정렬하고 상위 키워드 반환 (최소 1회 이상)
  const sortedKeywords = Object.entries(wordCount)
    .filter(([, count]) => count >= 1) // 최소 1회 이상 언급된 키워드만
    .sort(([,a], [,b]) => b - a)
    .slice(0, 30) // 상위 30개로 증가
    .map(([word, count]) => ({ word, count }));
  
  console.log('최종 추출된 키워드:', sortedKeywords);
  
  // 키워드가 너무 적으면 모든 단어를 포함 (빈도 무관)
  if (sortedKeywords.length < 5) {
    console.log('키워드가 적어서 모든 단어를 포함합니다.');
    const allKeywords = Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)
      .map(([word, count]) => ({ word, count }));
    return allKeywords;
  }
  
  return sortedKeywords;
};

// 불용어 목록 (간소화된 버전 - 더 많은 키워드가 나오도록)
const stopWords = new Set([
  // 기본 영어 불용어만
  'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must',
  'this', 'that', 'these', 'those', 'a', 'an', 'from', 'as', 'up', 'out', 'if',
  'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'here', 'there', 'where', 'when', 'why', 'how', 'what', 'who', 'which',
  'said', 'says', 'according', 'report', 'reports', 'story', 'stories',
  'time', 'times', 'day', 'days', 'week', 'weeks', 'month', 'months', 'year', 'years',
  'first', 'last', 'new', 'old', 'good', 'bad', 'big', 'small', 'long', 'short',
  'high', 'low', 'more', 'most', 'less', 'least', 'many', 'much', 'some', 'any',
  'all', 'each', 'every', 'other', 'another', 'same', 'different',
  'get', 'got', 'come', 'came', 'go', 'went', 'see', 'saw', 'know', 'knew',
  'think', 'thought', 'take', 'took', 'make', 'made', 'give', 'gave',
  'say', 'said', 'tell', 'told', 'ask', 'asked', 'work', 'worked',
  'use', 'used', 'find', 'found', 'want', 'wanted', 'need', 'needed',
  'try', 'tried', 'help', 'helped', 'feel', 'felt', 'seem', 'seemed',
  'leave', 'left', 'put', 'keep', 'kept', 'let', 'begin', 'began',
  'start', 'started', 'show', 'showed', 'hear', 'heard', 'play', 'played',
  'run', 'ran', 'move', 'moved', 'live', 'lived', 'hold', 'held',
  'bring', 'brought', 'happen', 'happened', 'write', 'wrote',
  'sit', 'sat', 'stand', 'stood', 'lose', 'lost', 'pay', 'paid',
  'meet', 'met', 'include', 'included', 'continue', 'continued',
  'set', 'learn', 'learned', 'change', 'changed', 'lead', 'led',
  'watch', 'watched', 'follow', 'followed', 'stop', 'stopped',
  'create', 'created', 'speak', 'spoke', 'read', 'allow', 'allowed',
  'add', 'added', 'spend', 'spent', 'grow', 'grew', 'open', 'opened',
  'walk', 'walked', 'win', 'won', 'offer', 'offered', 'remember',
  'love', 'loved', 'consider', 'considered', 'appear', 'appeared',
  'buy', 'bought', 'wait', 'waited', 'serve', 'served', 'die', 'died',
  'send', 'sent', 'expect', 'expected', 'build', 'built', 'stay', 'stayed',
  'fall', 'fell', 'cut', 'reach', 'reached', 'kill', 'killed',
  'remain', 'remained', 'suggest', 'suggested', 'raise', 'raised',
  'pass', 'passed', 'sell', 'sold', 'require', 'required',
  'decide', 'decided', 'pull', 'pulled',
  
  // 기본 한국어 불용어만
  '그', '이', '저', '것', '수', '있', '하', '되', '되다', '있다', '없다', '같다', '보다',
  '때', '곳', '사람', '일', '년', '월', '일', '시', '분', '초', '오늘', '어제', '내일',
  '뉴스', '기사', '보도', '발표', '발생', '진행', '상황', '문제', '해결', '대응',
  '정부', '국가', '사회', '경제', '정치', '문화', '교육', '환경', '건강', '안전',
  '회사', '기업', '조직', '단체', '기관', '부서', '팀', '그룹', '연합', '협회',
  '시장', '경제', '금융', '투자', '개발', '연구', '기술', '과학', '의학', '법률',
  '사건', '사고', '재해', '재난', '위험', '안전', '보안', '방어', '공격',
  '선택', '결정', '판단', '평가', '검토', '분석', '조사', '연구', '개발', '개선',
  '증가', '감소', '상승', '하락', '변화', '발전', '성장', '축소', '확장', '변경',
  '시작', '종료', '완료', '진행', '중단', '재개', '연기', '취소', '지연', '조기',
  '중요', '필요', '필수', '주요', '핵심', '중심', '기본', '근본', '원래', '본래',
  '최근', '최신', '새로운', '현재', '지금', '오늘', '어제', '내일',
  '여기', '저기', '거기', '어디', '언제', '왜', '어떻게', '무엇', '누구', '어느',
  '많은', '적은', '큰', '작은', '높은', '낮은', '긴', '짧은', '넓은', '좁은',
  '좋은', '나쁜', '훌륭한', '우수한',
  
  // 중국어 불용어 (간단한 버전)
  '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这',
  
  // 힌디어 불용어 (간단한 버전)
  'है', 'हैं', 'था', 'थे'
]);

const isStopWord = (word) => {
  return stopWords.has(word.toLowerCase());
};

// 키워드 분류 (간단한 버전)
export const categorizeKeywords = (keywords) => {
  const categories = {
    person: [], // 인물
    place: [],  // 장소
    organization: [] // 기관
  };
  
  keywords.forEach(({ word, count }) => {
    // 간단한 분류 로직 (실제로는 더 정교한 NER 사용 가능)
    if (isPerson(word)) {
      categories.person.push({ word, count, type: 'person' });
    } else if (isPlace(word)) {
      categories.place.push({ word, count, type: 'place' });
    } else if (isOrganization(word)) {
      categories.organization.push({ word, count, type: 'organization' });
    } else {
      // 분류되지 않은 키워드는 기관으로 분류 (더 많은 키워드 표시를 위해)
      categories.organization.push({ word, count, type: 'organization' });
    }
  });
  
  console.log('분류된 키워드:', categories);
  return categories;
};

// 간단한 분류 함수들 (실제로는 더 정교한 로직 필요)
const isPerson = (word) => {
  // 대문자로 시작하는 단어나 특정 패턴
  return /^[A-Z]/.test(word) || 
         ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'].some(surname => word.startsWith(surname));
};

const isPlace = (word) => {
  const placeKeywords = [
    '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
    '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
    '한국', '미국', '중국', '일본', '러시아', '독일', '프랑스', '영국',
    'city', 'state', 'country', 'province', 'region'
  ];
  return placeKeywords.some(keyword => word.includes(keyword));
};

const isOrganization = (word) => {
  const orgKeywords = [
    '정부', '국회', '법원', '검찰', '경찰', '군', '당', '회사', '기업',
    'ministry', 'government', 'parliament', 'court', 'police', 'army',
    'company', 'corporation', 'organization'
  ];
  return orgKeywords.some(keyword => word.includes(keyword));
};