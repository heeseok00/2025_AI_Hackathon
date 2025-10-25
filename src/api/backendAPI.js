// 백엔드 API 호출 함수들
const BACKEND_URL = 'http://localhost:5000';

// 기사 전체 처리 (스크래핑 + 번역 + 요약)
export async function processArticle(url) {
	try {
		console.log('백엔드 API 호출 시작:', url);
		
		const response = await fetch(`${BACKEND_URL}/api/process`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ url }),
			timeout: 30000 // 30초 타임아웃
		});
		
		console.log('백엔드 응답 상태:', response.status);
		
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText}`);
		}
		
		const data = await response.json();
		console.log('백엔드 응답 데이터:', data);
		return data;
	} catch (error) {
		console.error('기사 처리 오류:', error);
		return {
			success: false,
			error: error.message
		};
	}
}

// 텍스트 번역
export async function translateText(text, targetLang = 'ko') {
	try {
		const response = await fetch(`${BACKEND_URL}/api/translate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ text, target_lang: targetLang })
		});
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('번역 오류:', error);
		return {
			success: false,
			error: error.message
		};
	}
}

// 텍스트 요약
export async function summarizeText(text, maxLength = 300) {
	try {
		const response = await fetch(`${BACKEND_URL}/api/summarize`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ text, max_length: maxLength })
		});
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('요약 오류:', error);
		return {
			success: false,
			error: error.message
		};
	}
}

// 뉴스 감성 분석 (호재/악재)
export async function analyzeSentiment(title, description = '') {
	try {
		const response = await fetch(`${BACKEND_URL}/api/sentiment`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title, description })
		});
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('감성 분석 오류:', error);
		return {
			success: false,
			error: error.message
		};
	}
}

// 서버 상태 확인
export async function checkServerHealth() {
	try {
		const response = await fetch(`${BACKEND_URL}/api/health`);
		return response.ok;
	} catch (error) {
		console.error('서버 상태 확인 오류:', error);
		return false;
	}
}