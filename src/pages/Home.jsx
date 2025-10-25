import React, { useEffect, useState, useRef } from 'react';
import Navigation from '../components/Navigation.jsx';
import WorldMap from '../components/WorldMap.jsx';
import NewsCard from '../components/NewsCard.jsx';
import { fetchNews } from '../api/newsAPI.js';

export default function Home() {
	const [country, setCountry] = useState('US');
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(false);
	const newsRef = useRef(null);

	useEffect(() => {
		(async () => {
			setLoading(true);
			const results = await fetchNews({ countryCode: country });
			setArticles(results);
			setLoading(false);

			// 국가 선택 시 뉴스 섹션으로 부드럽게 스크롤
			if (newsRef.current) {
				setTimeout(() => {
					newsRef.current.scrollIntoView({ 
						behavior: 'smooth', 
						block: 'start' 
					});
				}, 100);
			}
		})();
	}, [country]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			{/* 네비게이션 바 */}
			<Navigation />

			{/* 서브 헤더 */}
			<header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600">글로벌 뉴스 플랫폼</p>
						</div>
						<div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
							<span className="text-sm font-medium text-gray-700">선택된 국가:</span>
							<span className="text-lg font-bold text-blue-600">{country}</span>
						</div>
					</div>
				</div>
			</header>

			{/* 메인 컨텐츠 */}
			<main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				{/* 세계 지도 */}
				<section className="mb-8">
					<WorldMap selectedCountry={country} onCountrySelect={setCountry} />
				</section>

				{/* 빠른 접근 섹션 */}
				<section className="mb-12">
					<div className="grid md:grid-cols-3 gap-6">
						{/* 검색 기능 */}
						<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 toss-card animate-toss-1">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-blue-100 rounded-lg transition-all duration-300">
									<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
								</div>
								<h3 className="text-lg font-bold text-gray-800">뉴스 검색</h3>
							</div>
							<div className="relative">
								<input
									type="text"
									placeholder="키워드로 검색..."
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
								/>
								<button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:scale-105 transition-all duration-300">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
								</button>
							</div>
							<p className="text-xs text-gray-500 mt-2">전 세계 뉴스를 실시간으로 검색하세요</p>
						</div>

						{/* Top 10 기사 */}
						<div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border border-purple-100 cursor-pointer group toss-card animate-toss-2">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-all duration-300 group-hover:scale-110">
									<svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
									</svg>
								</div>
								<h3 className="text-lg font-bold text-gray-800">Top 10 기사</h3>
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<span className="text-2xl font-bold text-purple-600 inline-block group-hover:scale-110 transition-transform duration-300">🔥</span>
									<span className="text-sm text-gray-700">가장 인기 있는 글로벌 뉴스</span>
								</div>
								<p className="text-xs text-gray-500">실시간 트렌딩 기사를 확인하세요</p>
							</div>
							<div className="mt-4 flex items-center gap-2 text-purple-600 group-hover:gap-3 transition-all duration-300">
								<span className="text-sm font-medium">바로가기</span>
								<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</div>
						</div>

						{/* 오늘의 키워드 */}
						<div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-md p-6 border border-orange-100 cursor-pointer group toss-card animate-toss-3">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-all duration-300 group-hover:scale-110">
									<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
									</svg>
								</div>
								<h3 className="text-lg font-bold text-gray-800">오늘의 키워드</h3>
							</div>
							<div className="flex flex-wrap gap-2 mb-3">
								<span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">#AI</span>
								<span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">#경제</span>
								<span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">#기술</span>
							</div>
							<p className="text-xs text-gray-500">전 세계에서 가장 많이 언급되는 키워드</p>
							<div className="mt-4 flex items-center gap-2 text-orange-600 group-hover:gap-3 transition-all duration-300">
								<span className="text-sm font-medium">자세히 보기</span>
								<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</div>
						</div>
					</div>
				</section>

				{/* 뉴스 섹션 - ref 추가 */}
				<section ref={newsRef} className="scroll-mt-20">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-gray-800">
							📰 {country} 주요 뉴스
						</h2>
						{loading && (
							<div className="flex items-center gap-2 text-blue-600">
								<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								<span className="text-sm font-medium">로딩 중...</span>
							</div>
						)}
					</div>

					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{articles.length === 0 && !loading ? (
							<div className="col-span-full text-center py-12">
								<div className="text-6xl mb-4">📭</div>
								<p className="text-gray-600 text-lg">아직 뉴스가 없습니다.</p>
								<p className="text-gray-500 text-sm mt-2">API를 연동하면 뉴스가 표시됩니다.</p>
							</div>
						) : (
							articles.map((article, idx) => (
								<NewsCard
									key={idx}
									title={article.title}
									description={article.description}
									source={article.source}
									url={article.url}
								/>
							))
						)}
					</div>
				</section>
			</main>

			{/* 푸터 */}
			<footer className="bg-white border-t border-gray-200 mt-16">
				<div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<p className="text-center text-gray-600 text-sm">
						© 2025 GlobaLink - 2025 AI Hackathon Project
					</p>
				</div>
			</footer>
		</div>
	);
}
