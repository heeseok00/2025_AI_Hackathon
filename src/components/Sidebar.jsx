import React from 'react';
import { useBookmark } from '../contexts/BookmarkContext.jsx';

export default function Sidebar({ isOpen, onClose }) {
	const { bookmarks, toggleBookmark, getBookmarkList } = useBookmark();
	const bookmarkList = getBookmarkList();

	return (
		<>
			{/* 오버레이 */}
			<div 
				className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-in-out ${
					isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
				}`}
				onClick={onClose}
			/>
			
			{/* 사이드바 */}
			<div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-all duration-300 ease-in-out z-50 ${
				isOpen ? 'translate-x-0' : '-translate-x-full'
			}`}>
				{/* 사이드바 헤더 */}
				<div className="flex items-center justify-between p-4 border-b border-gray-200">
					<h2 className="text-lg font-semibold text-gray-900">메뉴</h2>
					<button
						onClick={onClose}
						className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* 사이드바 메뉴 */}
				<div className="p-4">
					{/* 북마크 섹션 */}
					<div className="mb-6">
						<div className="flex items-center gap-2 mb-3">
							<svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
								<path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
							</svg>
							<h3 className="text-md font-semibold text-gray-900">북마크</h3>
							<span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
								{bookmarkList.length}
							</span>
						</div>
						
						{bookmarkList.length > 0 ? (
							<div className="space-y-2 max-h-60 overflow-y-auto">
								{bookmarkList.map((article, index) => (
									<div key={article.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
										{/* 기사 이미지 */}
										{article.urlToImage && (
											<img 
												src={article.urlToImage} 
												alt={article.title}
												className="w-12 h-12 rounded object-cover flex-shrink-0"
												onError={(e) => {
													e.target.style.display = 'none';
												}}
											/>
										)}
										
										{/* 기사 정보 */}
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
												{article.title}
											</p>
											<p className="text-xs text-gray-500 truncate">
												{article.source}
											</p>
											{article.publishedAt && (
												<p className="text-xs text-gray-400 mt-1">
													{new Date(article.publishedAt).toLocaleDateString('ko-KR')}
												</p>
											)}
										</div>
										
										{/* 북마크 제거 버튼 */}
										<button
											onClick={() => toggleBookmark(article.id)}
											className="p-1 text-yellow-500 hover:text-yellow-600 transition-colors flex-shrink-0"
											title="북마크 제거"
										>
											<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
											</svg>
										</button>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-4">
								<svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
								</svg>
								<p className="text-gray-500 text-sm">북마크된 기사가 없습니다</p>
							</div>
						)}
					</div>

					{/* 구분선 */}
					<div className="border-t border-gray-200 mb-4"></div>

					{/* 기타 메뉴 항목들 */}
					<div className="space-y-2">
						<button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
							</svg>
							<span>최근 본 기사</span>
						</button>
						
						<button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
							<span>분석 리포트</span>
						</button>
						
						<button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<span>설정</span>
						</button>
						
						<button className="w-full flex items-center gap-3 p-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>도움말</span>
						</button>
					</div>
				</div>
			</div>
		</>
	);
}