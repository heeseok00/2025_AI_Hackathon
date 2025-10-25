import React, { useRef, useState } from 'react';
import NewsCard from './NewsCard.jsx';
import NewsDetailModal from './NewsDetailModal.jsx';
import CategorySelector from './CategorySelector.jsx';

export default function CountryWindow({ open, countryCode, topArticles = [], selectedCategory, onCategoryChange }) {
	if (!open) return null;

	const [activeTab, setActiveTab] = useState('top10');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedArticle, setSelectedArticle] = useState(null);
	const sliderRef = useRef(null);

	const handleShowDetail = (article) => {
		setSelectedArticle(article);
		setIsModalOpen(true);
	};

	const handleScroll = (direction) => {
		const el = sliderRef.current;
		if (!el) return;
		const amount = el.clientWidth; // 한 화면 너비만큼 이동
		el.scrollBy({ left: direction * amount, behavior: 'smooth' });
	};

	// 패널(페이지) 구성: 카드 3개씩 묶음
	const items = (topArticles?.slice(0, 10) || []);
	const panels = (() => {
		if (items.length === 0) return [Array(3).fill(null)];
		const groups = [];
		for (let i = 0; i < items.length; i += 3) {
			groups.push(items.slice(i, i + 3));
		}
		return groups;
	})();

	return (
		<>
			<div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-0 mb-6">
				{/* 상단 탭 바 */}
				<div className="border-b border-gray-200 bg-white rounded-t-xl">
					<div className="max-w-7xl mx-auto px-4">
						<div className="flex items-center gap-2 h-14">
							<button
								className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
									activeTab === 'top10' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
								}`}
								onClick={() => setActiveTab('top10')}
							>
								오늘의 Top 10 뉴스
							</button>
							<button
								className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
									activeTab === 'keywords' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
								}`}
								onClick={() => setActiveTab('keywords')}
							>
								오늘의 키워드
							</button>
							<div className="ml-auto flex items-center gap-3">
								<div className="flex items-center gap-2">
									<span className="text-sm text-gray-500">카테고리:</span>
									<CategorySelector value={selectedCategory} onChange={onCategoryChange} />
								</div>
								<div className="text-sm text-gray-500">
									선택된 국가: <span className="font-semibold text-gray-700">{countryCode}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 내용 영역 - 현재는 빈 레이아웃 */}
				<div className="p-6 min-h-[70vh]">
					{activeTab === 'top10' ? (
						<div className="relative">
							{/* 좌우 이동 버튼 */}
							<button
								className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50"
								onClick={() => handleScroll(-1)}
								aria-label="이전"
							>
								<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
							</button>
							<button
								className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50"
								onClick={() => handleScroll(1)}
								aria-label="다음"
							>
								<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
							</button>

							<div ref={sliderRef} className="overflow-x-auto">
								<div className="grid grid-flow-col gap-4" style={{ gridAutoColumns: '100%' }}>
									{panels.map((panel, pIdx) => (
										<div key={`panel-${pIdx}`} className="grid gap-4 md:grid-cols-3 min-h-[70vh]">
											{panel.map((article, idx) => (
												article ? (
													<NewsCard
														key={`card-${pIdx}-${idx}`}
														title={article.title}
														description={article.description}
														source={article.source}
														url={article.url}
														urlToImage={article.urlToImage}
														publishedAt={article.publishedAt}
														onShowDetail={handleShowDetail}
													/>
												) : (
													<div key={`placeholder-${pIdx}-${idx}`} className="h-full rounded-lg border border-gray-200 bg-gray-50" />
												)
											))}
										</div>
									))}
								</div>
							</div>
						</div>
					) : (
						<div className="min-h-[220px] flex items-center justify-center text-gray-400">
							키워드 영역(빈 상태)
						</div>
					)}
				</div>
			</div>

			{/* 모달 */}
			<NewsDetailModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				article={selectedArticle}
			/>
		</>
	);
}


