import React, { useEffect, useState, useRef } from 'react';
import Navigation from '../components/Navigation.jsx';
import WorldMap from '../components/WorldMap.jsx';
import CountryWindow from '../components/CountryWindow.jsx';
import NewsCard from '../components/NewsCard.jsx';
import { fetchNews } from '../api/newsAPI.js';

export default function Home() {
	const [country, setCountry] = useState(null);
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(false);
	const newsRef = useRef(null);
	const hasMountedRef = useRef(false);
	const [isCountryWindowOpen, setIsCountryWindowOpen] = useState(false);

	useEffect(() => {
		if (!country) return;

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
						block: 'center',
						inline: 'nearest'
					});
				}, 120);
			}

			// 초기 렌더링 이후 국가 변경 시 빈 직사각형 페이지 표시
			if (hasMountedRef.current) {
				setIsCountryWindowOpen(true);
			} else {
				hasMountedRef.current = true;
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
					{country ? (
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
								<span className="text-sm font-medium text-gray-700">선택된 국가:</span>
								<span className="text-lg font-bold text-blue-600">{country}</span>
							</div>
							<button
								onClick={() => setCountry(null)}
								className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200"
								title="초기화"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					) : (
						<div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
							<span className="text-sm font-medium text-gray-500">국가를 선택해주세요</span>
						</div>
					)}
					</div>
				</div>
			</header>

			{/* 메인 컨텐츠 */}
			<main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				{/* 세계 지도 */}
				<section className="mb-8">
					<WorldMap selectedCountry={country} onCountrySelect={setCountry} />
				</section>

				{/* 뉴스 섹션 */}
				<section className="scroll-mt-20" ref={newsRef}>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-gray-800">
							📰 {country ? `${country} 주요 뉴스` : '글로벌 뉴스'}
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

					{/* CountryWindow 컴포넌트 */}
					<CountryWindow open={isCountryWindowOpen} countryCode={country} topArticles={articles} />

					{/* 기존 뉴스 카드 그리드 */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{!country ? (
							<div className="col-span-full text-center py-12">
								<div className="text-6xl mb-4">🗺️</div>
								<p className="text-gray-600 text-lg font-semibold">국가를 선택해주세요</p>
								<p className="text-gray-500 text-sm mt-2">지도에서 국가를 클릭하거나 드롭다운에서 검색하세요.</p>
							</div>
						) : articles.length === 0 && !loading ? (
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
