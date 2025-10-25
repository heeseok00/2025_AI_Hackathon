import React, { useState, useEffect } from 'react';
import { translateText } from '../api/translateAPI.js';
import { analyzeSentiment } from '../api/backendAPI.js';
import { extractCategoriesFromArticle, CATEGORY_COLORS, CATEGORY_NAMES } from '../utils/categoryUtils.js';
import { useScrollAnimation } from '../hooks/useScrollAnimation.js';
import { useBookmark } from '../contexts/BookmarkContext.jsx';

export default function NewsCard({ title, description, source, url, urlToImage, publishedAt, onShowDetail, delay = 0 }) {
	const [translatedTitle, setTranslatedTitle] = useState('');
	const [translatedDescription, setTranslatedDescription] = useState('');
	const [isTranslating, setIsTranslating] = useState(true);
	const [categories, setCategories] = useState([]);
	const [sentiment, setSentiment] = useState(null);
	const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);
	const [ref, isVisible] = useScrollAnimation(delay);
	const { toggleBookmark, isBookmarked } = useBookmark();
	
	// 고유 ID 생성 (URL 기반)
	const articleId = url || `${title}-${source?.name || source}`;
	const bookmarked = isBookmarked(articleId);

	// 컴포넌트 마운트 시 번역 및 감성 분석 실행
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

		const analyzeSentimentContent = async () => {
			setIsAnalyzingSentiment(true);
			try {
				const result = await analyzeSentiment(title, description);
				if (result.success && result.sentiment) {
					setSentiment(result.sentiment);
				}
			} catch (error) {
				console.error('감성 분석 오류:', error);
			} finally {
				setIsAnalyzingSentiment(false);
			}
		};

		translateContent();
		analyzeSentimentContent();
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

	const handleToggleBookmark = (e) => {
		e.stopPropagation();
		const articleData = {
			id: articleId,
			title: translatedTitle || title,
			description: translatedDescription || description,
			source: source?.name || source,
			url: url,
			urlToImage: urlToImage,
			publishedAt: publishedAt
		};
		toggleBookmark(articleId, articleData);
	};
	return (
		<article 
			ref={ref}
			className={`bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden group toss-card h-full flex flex-col transition-all duration-700 ease-out ${
				isVisible 
					? 'opacity-100 translate-y-0' 
					: 'opacity-0 translate-y-8'
			}`}
		>
			{/* 상단 색상 바 */}
			<div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-500"></div>
			
			{/* 이미지 - 고정 높이 */}
			<div className="relative h-48 overflow-hidden">
				{urlToImage ? (
					<img 
						src={urlToImage} 
						alt={title || 'News image'}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						onError={(e) => {
							e.target.style.display = 'none';
						}}
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
						<svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
				
				{/* 호재/악재 배지 */}
				{sentiment && (
					<div className="absolute top-3 left-3 z-10">
						<div 
							className={`
								px-3 py-1.5 rounded-full font-bold text-sm shadow-lg backdrop-blur-sm
								flex items-center gap-1.5 transition-all duration-300
								${sentiment.label === 'positive' 
									? 'bg-green-500/90 text-white border border-green-400' 
									: sentiment.label === 'negative'
									? 'bg-red-500/90 text-white border border-red-400'
									: 'bg-gray-500/90 text-white border border-gray-400'
								}
							`}
							title={`신뢰도: ${(sentiment.confidence * 100).toFixed(1)}%`}
						>
							{sentiment.label === 'positive' && '📈'}
							{sentiment.label === 'negative' && '📉'}
							{sentiment.label === 'neutral' && '➖'}
							<span>{sentiment.korean_label}</span>
						</div>
					</div>
				)}
				
				{/* 감성 분석 중 표시 */}
				{isAnalyzingSentiment && (
					<div className="absolute top-3 left-3 z-10">
						<div className="px-3 py-1.5 rounded-full bg-gray-500/80 text-white text-sm font-medium backdrop-blur-sm flex items-center gap-2">
							<div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
							<span>분석중...</span>
						</div>
					</div>
				)}
				
				{/* 북마크 버튼 */}
				<button
					onClick={handleToggleBookmark}
					className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
						bookmarked 
							? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500' 
							: 'bg-white/80 text-gray-600 hover:bg-white hover:text-yellow-500'
					}`}
					title={bookmarked ? '북마크 제거' : '북마크 추가'}
				>
					<svg className="w-5 h-5" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
					</svg>
				</button>
			</div>
			
			<div className="p-5 flex-1 flex flex-col">
				{/* 제목 - 번역 상태에 따른 동적 높이 */}
				<div className={`mb-3 ${isTranslating ? 'h-12' : 'h-16'}`}>
					<h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-all duration-300">
						{isTranslating ? (
							<div className="flex items-center gap-2 h-full">
								<div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
								<span className="text-sm text-gray-500">번역 중...</span>
							</div>
						) : (
							translatedTitle || title || 'Untitled'
						)}
					</h3>
				</div>
				
				{/* 설명 - 고정 높이 */}
				<div className="h-20 mb-4">
					<p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
						{isTranslating ? '번역 중...' : (translatedDescription || description || 'No description available.')}
					</p>
				</div>

				{/* 카테고리 태그 - 고정 높이 */}
				<div className="h-8 mb-4">
					{categories.length > 0 && (
						<div className="flex flex-wrap gap-1">
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
				</div>

				{/* 자세히 보기 버튼 - 고정 높이 */}
				<div className="h-12 mb-4">
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
				
				{/* 하단 정보 - 고정 높이 */}
				<div className="mt-auto">
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
			</div>
		</article>
	);
}
