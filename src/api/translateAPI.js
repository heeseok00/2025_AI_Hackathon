// OpenAI GPT API 설정
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// GPT API를 사용한 번역 함수
export async function translateText(text, targetLanguage = 'ko') {
	if (!text || text.trim() === '') return text;
	
	// OpenAI API 키가 없으면 임시 번역 데이터 사용
	if (!OPENAI_API_KEY) {
		console.warn('OpenAI API 키가 설정되지 않았습니다. 임시 번역 데이터를 사용합니다.');
		return getMockTranslation(text);
	}

	try {
		const response = await fetch(OPENAI_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content: `당신은 전문 번역가입니다. 주어진 영어 텍스트를 자연스러운 한국어로 번역해주세요. 뉴스 기사의 제목이나 내용을 번역할 때는 정확하고 이해하기 쉽게 번역해주세요.`
					},
					{
						role: 'user',
						content: `다음 텍스트를 한국어로 번역해주세요:\n\n"${text}"`
					}
				],
				max_tokens: 500,
				temperature: 0.3
			})
		});

		if (!response.ok) {
			throw new Error(`OpenAI API 오류: ${response.status}`);
		}

		const data = await response.json();
		return data.choices[0].message.content.trim();
	} catch (error) {
		console.error('번역 오류:', error);
		// 오류 발생 시 임시 번역 데이터 사용
		return getMockTranslation(text);
	}
}

// 임시 번역 데이터 (API 키가 없을 때 사용)
function getMockTranslation(text) {
	const mockTranslations = {
		'Trump terminates all U.S. trade negotiations with Canada over Reagan tariffs TV ad': 
			'트럼프, 레이건 관세 TV 광고로 인해 캐나다와의 모든 미국 무역 협상 중단',
		'President Trump claimed Canada had ran an ad featuring former President Ronald Reagan talking about tariffs to influence a pending U.S. Supreme Court case.':
			'트럼프 대통령은 캐나다가 로널드 레이건 전 대통령이 관세에 대해 이야기하는 광고를 내보내 미국 대법원의 계류 중인 사건에 영향을 미치려 했다고 주장했다.',
		'Chargers vs. Vikings live updates: Score, analysis, highlights at halftime for Thursday Night Football':
			'차저스 대 바이킹스 실시간 업데이트: 목요일 밤 축구 전반전 점수, 분석, 하이라이트',
		'The Chargers took a 21-3 lead into the locker room':
			'차저스가 21-3으로 앞선 채 라커룸으로 향했다.',
		'SpaceX expends Falcon 9 booster to launch Spainsat NG 2 communications satellite':
			'스페이스X, 스페인샛 NG 2 통신 위성 발사를 위해 팔콘 9 부스터 소모'
	};

	return mockTranslations[text] || text;
}

export async function summarizeText(text) {
	if (!text || text.trim() === '') return text;
	
	// OpenAI API 키가 없으면 임시 요약 데이터 사용
	if (!OPENAI_API_KEY) {
		console.warn('OpenAI API 키가 설정되지 않았습니다. 임시 요약 데이터를 사용합니다.');
		return getMockSummary(text);
	}

	try {
		const response = await fetch(OPENAI_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content: `당신은 뉴스 요약 전문가입니다. 주어진 뉴스 텍스트를 한국어로 번역하고 핵심 내용을 간결하게 요약해주세요. 요약은 2-3문장으로, 중요한 정보만 포함해주세요.`
					},
					{
						role: 'user',
						content: `다음 뉴스 텍스트를 한국어로 번역하고 요약해주세요:\n\n"${text}"`
					}
				],
				max_tokens: 200,
				temperature: 0.3
			})
		});

		if (!response.ok) {
			throw new Error(`OpenAI API 오류: ${response.status}`);
		}

		const data = await response.json();
		return data.choices[0].message.content.trim();
	} catch (error) {
		console.error('요약 오류:', error);
		return getMockSummary(text);
	}
}

// 임시 요약 데이터 (API 키가 없을 때 사용)
function getMockSummary(text) {
	const mockSummaries = {
		'Trump terminates all U.S. trade negotiations with Canada over Reagan tariffs TV ad': 
			'트럼프 대통령이 캐나다의 레이건 전 대통령 관련 TV 광고에 대해 무역 협상을 중단했다고 발표했습니다.',
		'President Trump claimed Canada had ran an ad featuring former President Ronald Reagan talking about tariffs to influence a pending U.S. Supreme Court case.':
			'트럼프 대통령은 캐나다가 미국 대법원 사건에 영향을 미치기 위해 레이건 전 대통령의 관세 관련 광고를 방영했다고 주장했습니다.',
		'Chargers vs. Vikings live updates: Score, analysis, highlights at halftime for Thursday Night Football':
			'차저스와 바이킹스의 목요일 밤 축구 경기 전반전 결과와 하이라이트를 실시간으로 전달합니다.',
		'The Chargers took a 21-3 lead into the locker room':
			'차저스가 전반전을 21-3으로 앞선 채 마무리했습니다.',
		'SpaceX expends Falcon 9 booster to launch Spainsat NG 2 communications satellite':
			'스페이스X가 스페인샛 NG 2 통신 위성 발사를 위해 팔콘 9 부스터를 사용했습니다.'
	};

	return mockSummaries[text] || text.substring(0, 100) + '...';
}

// 뉴스 기사 전체 번역 (원본 링크 클릭 시 사용)
export async function translateFullArticle(article) {
	if (!OPENAI_API_KEY) {
		console.warn('OpenAI API 키가 설정되지 않았습니다. 기본 번역을 사용합니다.');
		return {
			title: getMockTranslation(article.title),
			description: getMockTranslation(article.description),
			content: article.content ? getMockTranslation(article.content) : null,
			summary: getMockSummary(article.description || article.title),
			originalUrl: article.url,
			source: article.source?.name || article.source
		};
	}

	try {
		// 전체 기사를 한 번에 번역하고 요약
		const fullText = `${article.title}\n\n${article.description}\n\n${article.content || ''}`;
		
		const response = await fetch(OPENAI_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content: `당신은 뉴스 번역 및 요약 전문가입니다. 주어진 뉴스 기사를 한국어로 번역하고, 제목, 요약, 상세 내용으로 구분해서 제공해주세요. JSON 형식으로 응답해주세요:
{
  "title": "번역된 제목",
  "summary": "2-3문장 요약",
  "description": "번역된 설명",
  "content": "번역된 전체 내용"
}`
					},
					{
						role: 'user',
						content: `다음 뉴스 기사를 번역하고 요약해주세요:\n\n"${fullText}"`
					}
				],
				max_tokens: 1000,
				temperature: 0.3
			})
		});

		if (!response.ok) {
			throw new Error(`OpenAI API 오류: ${response.status}`);
		}

		const data = await response.json();
		const result = JSON.parse(data.choices[0].message.content.trim());

		return {
			title: result.title || article.title,
			description: result.description || article.description,
			content: result.content || article.content,
			summary: result.summary || article.description || article.title,
			originalUrl: article.url,
			source: article.source?.name || article.source
		};
	} catch (error) {
		console.error('전체 번역 오류:', error);
		// 오류 시 개별 번역 시도
		try {
			const [translatedTitle, translatedDescription, summary] = await Promise.all([
				translateText(article.title),
				translateText(article.description),
				summarizeText(article.description || article.title)
			]);

			return {
				title: translatedTitle,
				description: translatedDescription,
				content: article.content ? await translateText(article.content) : null,
				summary: summary,
				originalUrl: article.url,
				source: article.source?.name || article.source
			};
		} catch (fallbackError) {
			console.error('폴백 번역 오류:', fallbackError);
			return {
				title: article.title,
				description: article.description,
				content: article.content,
				summary: article.description || article.title,
				originalUrl: article.url,
				source: article.source?.name || article.source
			};
		}
	}
}