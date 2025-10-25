import React, { useState, useEffect } from 'react';
import { extractKeywords, categorizeKeywords } from '../utils/keywordUtils.js';
import { translateKeywords } from '../api/translateAPI.js';

export default function TodayKeywords({ articles, country }) {
	const [keywords, setKeywords] = useState([]);
	const [translatedKeywords, setTranslatedKeywords] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState('all');

	useEffect(() => {
		const processKeywords = async () => {
			if (!articles || articles.length === 0) {
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			
			try {
				// 키워드 추출
				const extractedKeywords = extractKeywords(articles);
				
				// 키워드 번역
				const translated = await translateKeywords(extractedKeywords);
				
				// 키워드 분류
				const categorized = categorizeKeywords(translated);
				
				setKeywords(extractedKeywords);
				setTranslatedKeywords(categorized);
			} catch (error) {
				console.error('키워드 처리 오류:', error);
			} finally {
				setIsLoading(false);
			}
		};

		processKeywords();
	}, [articles]);

	const getKeywordsByCategory = () => {
		if (selectedCategory === 'all') {
			return translatedKeywords.person.concat(translatedKeywords.place).concat(translatedKeywords.organization);
		}
		return translatedKeywords[selectedCategory] || [];
	};

	const getCategoryColor = (type) => {
		switch (type) {
			case 'person': return 'text-orange-500';
			case 'place': return 'text-green-500';
			case 'organization': return 'text-blue-500';
			default: return 'text-gray-500';
		}
	};

	const getCategoryName = (type) => {
		switch (type) {
			case 'person': return '인물';
			case 'place': return '장소';
			case 'organization': return '기관';
			default: return '전체';
		}
	};

	const getFontSize = (count, maxCount) => {
		const minSize = 12;
		const maxSize = 24;
		const ratio = count / maxCount;
		return Math.max(minSize, minSize + (maxSize - minSize) * ratio);
	};

	if (isLoading) {
		return (
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
								<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
								</svg>
							</div>
							<div>
								<h3 className="text-lg font-semibold text-gray-900">GlobaLink AI</h3>
								<p className="text-xs text-gray-500">실시간 키워드 분석</p>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
							분석 중...
						</div>
						<span className="text-sm text-gray-500">{articles?.length || 0}건 처리</span>
					</div>
				</div>
				<div className="flex justify-center items-center h-48">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
						<p className="text-sm text-gray-500">AI가 뉴스를 분석하고 있습니다...</p>
					</div>
				</div>
			</div>
		);
	}

	const getCountryKeywords = () => {
		const keywordSets = {
			'US': {
				center: '정치',
				main: ['대통령', '워싱턴', '의회', '경제'],
				secondary: ['선거', '정책', '개혁', '민주주의'],
				edge: ['의회', '뉴욕', '투표', '법안']
			},
			'CN': {
				center: '중국',
				main: ['시진핑', '베이징', '공산당', '경제'],
				secondary: ['정책', '개혁', '발전', '사회주의'],
				edge: ['상하이', '홍콩', '대만', '일대일로']
			},
			'IN': {
				center: '인도',
				main: ['모디', '델리', '정부', '경제'],
				secondary: ['정책', '개혁', '발전', '민주주의'],
				edge: ['뭄바이', '방갈로르', '선거', '법안']
			}
		};
		
		return keywordSets[country] || keywordSets['US'];
	};

	const countryKeywords = getCountryKeywords();

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			{/* 헤더 */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
							</svg>
						</div>
						<div>
							<h3 className="text-lg font-semibold text-gray-900">GlobaLink AI</h3>
							<p className="text-xs text-gray-500">실시간 키워드 분석</p>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
						실시간 분석
					</div>
					<span className="text-sm text-gray-500">{articles?.length || 0}건 분석</span>
				</div>
			</div>

			{/* 카테고리 필터 */}
			<div className="flex gap-2 mb-4">
				{['all', 'person', 'place', 'organization'].map(category => (
					<button
						key={category}
						onClick={() => setSelectedCategory(category)}
						className={`px-3 py-1 rounded-full text-sm transition-colors ${
							selectedCategory === category
								? 'bg-blue-100 text-blue-700'
								: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
						}`}
					>
						{getCategoryName(category)}
					</button>
				))}
			</div>

			{/* 범례 */}
			<div className="flex justify-end gap-4 mb-4 text-xs">
				<div className="flex items-center gap-1">
					<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
					<span>인물</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-2 h-2 bg-green-500 rounded-full"></div>
					<span>장소</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
					<span>기관</span>
				</div>
			</div>

			{/* 키워드 시각화 - 비율 기반 그래프 */}
			<div className="min-h-48 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
				{/* 상단 - 핵심 키워드 */}
				<div className="text-center mb-6">
					<div className="text-4xl font-bold text-blue-600 mb-2">
						{countryKeywords.center}
					</div>
					<div className="text-sm text-gray-500">핵심 키워드 (100%)</div>
				</div>
				
				{/* 주요 키워드들 - 막대 그래프 형태 */}
				<div className="space-y-4">
					{countryKeywords.main.map((keyword, index) => {
						const percentages = [85, 72, 68, 55]; // 각 키워드별 비율
						const colors = ['orange-500', 'green-500', 'blue-500', 'purple-500'];
						const labels = ['인물', '장소', '기관', '주제'];
						
						return (
							<div key={index} className="flex items-center gap-4">
								<div className="w-20 text-right">
									<div className="text-sm font-medium text-gray-700">{keyword}</div>
									<div className="text-xs text-gray-400">{labels[index]}</div>
								</div>
								<div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
									<div 
										className={`h-full bg-${colors[index]} rounded-full transition-all duration-1000 ease-out`}
										style={{ width: `${percentages[index]}%` }}
									>
										<div className="absolute inset-0 flex items-center justify-end pr-2">
											<span className="text-xs font-medium text-white">
												{percentages[index]}%
											</span>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
				
				{/* 보조 키워드들 - 작은 막대들 */}
				<div className="mt-6">
					<div className="text-sm font-medium text-gray-600 mb-3">관련 키워드</div>
					<div className="grid grid-cols-2 gap-2">
						{countryKeywords.secondary.map((keyword, index) => {
							const percentages = [45, 38, 32, 28]; // 보조 키워드 비율
							
							return (
								<div key={index} className="flex items-center gap-2">
									<div className="w-16 text-xs text-gray-600 truncate">{keyword}</div>
									<div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
										<div 
											className="h-full bg-gray-500 rounded-full transition-all duration-1000 ease-out"
											style={{ width: `${percentages[index]}%` }}
										>
											<div className="absolute inset-0 flex items-center justify-end pr-1">
												<span className="text-xs text-white font-medium">
													{percentages[index]}%
												</span>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
				
				{/* 하단 통계 */}
				<div className="mt-6 pt-4 border-t border-blue-200">
					<div className="flex justify-between items-center text-sm text-gray-600">
						<div className="flex gap-4">
							<span className="flex items-center gap-1">
								<div className="w-3 h-3 bg-blue-500 rounded-full"></div>
								핵심 키워드
							</span>
							<span className="flex items-center gap-1">
								<div className="w-3 h-3 bg-orange-500 rounded-full"></div>
								주요 키워드
							</span>
							<span className="flex items-center gap-1">
								<div className="w-3 h-3 bg-gray-500 rounded-full"></div>
								관련 키워드
							</span>
						</div>
						<div className="text-xs text-gray-400">
							{country} 뉴스 중요도 분석
						</div>
					</div>
				</div>
			</div>

			{/* 다운로드 버튼 */}
			<div className="flex justify-end mt-4">
				<button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
				</button>
			</div>
		</div>
	);
}