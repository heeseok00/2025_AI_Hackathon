// 카테고리별 색상 정의
export const CATEGORY_COLORS = {
	business: {
		bg: 'bg-blue-100',
		text: 'text-blue-800',
		border: 'border-blue-200'
	},
	entertainment: {
		bg: 'bg-purple-100',
		text: 'text-purple-800',
		border: 'border-purple-200'
	},
	general: {
		bg: 'bg-gray-100',
		text: 'text-gray-800',
		border: 'border-gray-200'
	},
	health: {
		bg: 'bg-green-100',
		text: 'text-green-800',
		border: 'border-green-200'
	},
	science: {
		bg: 'bg-indigo-100',
		text: 'text-indigo-800',
		border: 'border-indigo-200'
	},
	sports: {
		bg: 'bg-orange-100',
		text: 'text-orange-800',
		border: 'border-orange-200'
	},
	technology: {
		bg: 'bg-cyan-100',
		text: 'text-cyan-800',
		border: 'border-cyan-200'
	}
};

// 카테고리 이름 매핑
export const CATEGORY_NAMES = {
	business: '비즈니스',
	entertainment: '엔터테인먼트',
	general: '일반',
	health: '건강',
	science: '과학',
	sports: '스포츠',
	technology: '기술'
};

// 뉴스 기사에서 카테고리 추출하는 함수
export function extractCategoriesFromArticle(article) {
	const categories = [];
	
	// URL에서 카테고리 추출
	if (article.url) {
		const url = article.url.toLowerCase();
		if (url.includes('tech') || url.includes('technology')) categories.push('technology');
		if (url.includes('business') || url.includes('economy')) categories.push('business');
		if (url.includes('sport') || url.includes('football') || url.includes('basketball')) categories.push('sports');
		if (url.includes('health') || url.includes('medical')) categories.push('health');
		if (url.includes('science') || url.includes('research')) categories.push('science');
		if (url.includes('entertainment') || url.includes('celebrity')) categories.push('entertainment');
	}
	
	// 제목에서 카테고리 추출
	if (article.title) {
		const title = article.title.toLowerCase();
		if (title.includes('tech') || title.includes('ai') || title.includes('software')) categories.push('technology');
		if (title.includes('business') || title.includes('economy') || title.includes('market')) categories.push('business');
		if (title.includes('sport') || title.includes('game') || title.includes('team')) categories.push('sports');
		if (title.includes('health') || title.includes('medical') || title.includes('covid')) categories.push('health');
		if (title.includes('science') || title.includes('research') || title.includes('study')) categories.push('science');
		if (title.includes('movie') || title.includes('music') || title.includes('celebrity')) categories.push('entertainment');
	}
	
	// 중복 제거하고 최대 3개만 반환
	return [...new Set(categories)].slice(0, 3);
}