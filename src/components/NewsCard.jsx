import React, { useState, useEffect } from 'react';
import { translateText } from '../api/translateAPI.js';
import { extractCategoriesFromArticle, CATEGORY_COLORS, CATEGORY_NAMES } from '../utils/categoryUtils.js';

export default function NewsCard({ title, description, source, url, urlToImage, publishedAt, onShowDetail }) {
	const [translatedTitle, setTranslatedTitle] = useState('');
	const [translatedDescription, setTranslatedDescription] = useState('');
	const [isTranslating, setIsTranslating] = useState(true);
	const [categories, setCategories] = useState([]);

	// 컴포넌트 마운트 시 번역 실행
	useEffect(() => {
		const translateContent = async () => {
			setIsTranslating(true);
			try {
				const [translatedTitleResult, translatedDescResult] = await Promise.all([
					translateText(title),
					translateText(description)
				]);
				
				setTranslatedTitle(translatedTitleResult);
				setTranslatedDescription(translatedDescResult);
			} catch (error) {
				console.error('번역 오류:', error);
				setTranslatedTitle(title);
				setTranslatedDescription(description);
			} finally {
				setIsTranslating(false);
			}
		};

		translateContent();
	}, [title, description]);

	// 카테고리 추출
	useEffect(() => {
		const articleCategories = extractCategoriesFromArticle({ title, description, url });
		setCategories(articleCategories);
	}, [title, description, url]);

	const handleShowDetail = () => {
		if (onShowDetail) {
			onShowDetail({ title, description, source, url, urlToImage, publishedAt });
		}
	};
	return (
		<article className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden group toss-card">
			{/* 상단 색상 바 */}
			<div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-500"></div>
			
			{/* 이미지 */}
			{urlToImage && (
				<div className="relative h-48 overflow-hidden">
					<img 
						src={urlToImage} 
						alt={title || 'News image'}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						onError={(e) => {
							e.target.style.display = 'none';
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
				</div>
			)}
			
			<div className="p-5">
				{/* 제목 */}
				<h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-all duration-300 mb-3">
					{isTranslating ? (
						<div className="flex items-center gap-2">
							<div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
							<span className="text-sm text-gray-500">번역 중...</span>
						</div>
					) : (
						translatedTitle || title || 'Untitled'
					)}
				</h3>
				
				{/* 설명 */}
				<p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
					{isTranslating ? '번역 중...' : (translatedDescription || description || 'No description available.')}
				</p>

				{/* 카테고리 태그 */}
				{categories.length > 0 && (
					<div className="flex flex-wrap gap-1 mb-4">
						{categories.map((category) => {
							const colors = CATEGORY_COLORS[category];
							return (
								<span
									key={category}
									className={`px-2 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}
								>
									{CATEGORY_NAMES[category]}
								</span>
							);
						})}
					</div>
				)}

				{/* 자세히 보기 버튼 */}
				<div className="mb-4">
					<button
						onClick={handleShowDetail}
						disabled={!url}
						className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
						</svg>
						자세히 보기
					</button>
				</div>
				
				{/* 하단 정보 */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-100">
					<div className="flex items-center gap-2">
						<span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300">
							📰 {source?.name || source || 'Unknown'}
						</span>
						{publishedAt && (
							<span className="text-xs text-gray-400">
								{new Date(publishedAt).toLocaleDateString('ko-KR')}
							</span>
						)}
					</div>
				</div>
			</div>
		</article>
	);
}
