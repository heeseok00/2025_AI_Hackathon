// News API 설정
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// 지원되는 국가별 검색 키워드 매핑 (3개국)
const COUNTRY_KEYWORDS = {
	'US': null, // top-headlines 사용
	'IN': 'India OR Delhi OR Mumbai',
	'CN': 'China OR Beijing OR Shanghai OR Chinese'
};

// 국가별 언어 설정
const COUNTRY_LANGUAGES = {
	'US': 'en',
	'IN': 'hi', // 힌디어
	'CN': 'zh'
};

export async function fetchNews({ countryCode = 'US', category = null } = {}) {
	try {
		// 지원되지 않는 국가인 경우 빈 배열 반환
		if (!COUNTRY_KEYWORDS.hasOwnProperty(countryCode)) {
			console.warn(`지원되지 않는 국가 코드: ${countryCode}`);
			return [];
		}

		let url;
		const language = COUNTRY_LANGUAGES[countryCode];
		
		// 미국은 top-headlines 사용, 다른 국가는 everything 사용
		if (countryCode === 'US') {
			url = `${NEWS_API_BASE_URL}/top-headlines?country=${countryCode}&apiKey=${NEWS_API_KEY}`;
			if (category) {
				url += `&category=${category}`;
			}
		} else {
			const keywords = COUNTRY_KEYWORDS[countryCode];
			url = `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(keywords)}&language=${language}&sortBy=popularity&pageSize=20&apiKey=${NEWS_API_KEY}`;
			if (category) {
				url += `&category=${category}`;
			}
		}
		
		const response = await fetch(url);
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		return data.articles || [];
	} catch (error) {
		console.error('뉴스 API 오류:', error);
		return [];
	}
}
