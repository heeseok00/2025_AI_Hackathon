// 텍스트 포맷팅 유틸리티 함수들

export function formatText(text) {
	if (!text || typeof text !== 'string') return '';
	
	// 기본 정리
	let formatted = text.trim();
	
	// 문단 나누기 (두 개 이상의 줄바꿈을 기준으로)
	formatted = formatted.replace(/\n\s*\n/g, '\n\n');
	
	// 문장 단위로 나누기 (마침표, 느낌표, 물음표 후 공백)
	formatted = formatted.replace(/([.!?])\s+/g, '$1\n');
	
	// 불필요한 공백 정리
	formatted = formatted.replace(/\s+/g, ' ');
	
	// 문단별로 나누기
	const paragraphs = formatted.split('\n\n').filter(p => p.trim().length > 0);
	
	return paragraphs.map(paragraph => ({
		text: paragraph.trim(),
		type: 'paragraph'
	}));
}

export function formatMarkdown(text) {
	if (!text || typeof text !== 'string') return '';
	
	let formatted = text;
	
	// 제목 처리 (# ## ###)
	formatted = formatted.replace(/^#{1,3}\s+(.+)$/gm, '<h3 class="text-xl font-bold mb-3 text-gray-800">$1</h3>');
	
	// 굵은 글씨 (**text**)
	formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>');
	
	// 기울임 글씨 (*text*)
	formatted = formatted.replace(/\*(.+?)\*/g, '<em class="italic text-gray-700">$1</em>');
	
	// 링크 ([text](url))
	formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');
	
	// 인용문 (> text)
	formatted = formatted.replace(/^>\s*(.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600">$1</blockquote>');
	
	// 리스트 (- item)
	formatted = formatted.replace(/^-\s+(.+)$/gm, '<li class="ml-4 mb-1">• $1</li>');
	
	// 번호 리스트 (1. item)
	formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
	
	// 문단 나누기
	formatted = formatted.replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">');
	formatted = '<p class="mb-4 leading-relaxed">' + formatted + '</p>';
	
	// 리스트 래핑
	formatted = formatted.replace(/(<li[^>]*>.*<\/li>)/gs, '<ul class="list-disc list-inside mb-4">$1</ul>');
	
	return formatted;
}

export function formatNewsContent(content) {
	if (!content || typeof content !== 'string') return '';
	
	// 기본 포맷팅 적용
	let formatted = content;
	
	// 문단 나누기 개선
	formatted = formatted.replace(/([.!?])\s+([A-Z])/g, '$1\n\n$2');
	formatted = formatted.replace(/\n{3,}/g, '\n\n');
	
	// 문단별로 나누기
	const paragraphs = formatted.split('\n\n').filter(p => p.trim().length > 0);
	
	return paragraphs.map((paragraph, index) => ({
		id: `paragraph-${index}`,
		text: paragraph.trim(),
		type: 'paragraph'
	}));
}

export function formatTranslatedContent(content) {
	if (!content || typeof content !== 'string') return '';
	
	// 번역된 내용에 특별한 포맷팅 적용
	let formatted = content;
	
	// 문단 나누기
	formatted = formatted.replace(/([.!?])\s+([가-힣])/g, '$1\n\n$2');
	formatted = formatted.replace(/\n{3,}/g, '\n\n');
	
	// 문단별로 나누기
	const paragraphs = formatted.split('\n\n').filter(p => p.trim().length > 0);
	
	return paragraphs.map((paragraph, index) => ({
		id: `translated-paragraph-${index}`,
		text: paragraph.trim(),
		type: 'translated-paragraph'
	}));
}

export function formatSummarizedContent(content) {
	if (!content || typeof content !== 'string') return '';
	
	// 요약된 내용에 특별한 포맷팅 적용
	let formatted = content;
	
	// 요약은 보통 짧으므로 문단 나누기를 덜 적용
	formatted = formatted.replace(/([.!?])\s+([가-힣])/g, '$1\n$2');
	
	// 문단별로 나누기
	const paragraphs = formatted.split('\n').filter(p => p.trim().length > 0);
	
	return paragraphs.map((paragraph, index) => ({
		id: `summary-paragraph-${index}`,
		text: paragraph.trim(),
		type: 'summary-paragraph'
	}));
}