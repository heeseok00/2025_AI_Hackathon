import React, { useState, useEffect } from 'react';
import { translateText, summarizeText, translateFullArticle } from '../api/translateAPI.js';
import { analyzeSentiment } from '../api/backendAPI.js';
import { useScrollAnimation } from '../hooks/useScrollAnimation.js';
import { useBookmark } from '../contexts/BookmarkContext.jsx';

export default function MultilingualNewsCard({ 
	title, 
	description, 
	source, 
	url, 
	urlToImage, 
	publishedAt,
	delay = 0
}) {
	const [translatedTitle, setTranslatedTitle] = useState('');
	const [translatedDescription, setTranslatedDescription] = useState('');
	const [summary, setSummary] = useState('');
	const [isTranslating, setIsTranslating] = useState(true);
	const [showFullTranslation, setShowFullTranslation] = useState(false);
	const [fullTranslation, setFullTranslation] = useState(null);
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
				const [translatedTitleResult, translatedDescResult, summaryResult] = await Promise.all([
					translateText(title),
					translateText(description),
					summarizeText(description || title)
				]);
				
				setTranslatedTitle(translatedTitleResult);
				setTranslatedDescription(translatedDescResult);
				setSummary(summaryResult);
			} catch (error) {
				console.error('번역 오류:', error);
				setTranslatedTitle(title);
				setTranslatedDescription(description);
				setSummary(description || title);
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

	// 전체 번역 보기
	const handleShowFullTranslation = async () => {
		if (fullTranslation) {
			setShowFullTranslation(true);
			return;
		}

		try {
			const translation = await translateFullArticle({
				title,
				description,
				url,
				source
			});
			setFullTranslation(translation);
			setShowFullTranslation(true);
		} catch (error) {
			console.error('전체 번역 오류:', error);
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
						alt={translatedTitle || title || 'News image'}
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
				{/* 제목 - 고정 높이 */}
				<div className="h-16 mb-3">
					<h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-all duration-300">
						{isTranslating ? (
							<div className="flex items-center gap-2">
								<div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
								<span className="text-sm text-gray-500">번역 중...</span>
							</div>
						) : (
							translatedTitle || title || 'Untitled'
						)}
					</h3>
				</div>
				
				{/* 요약본 - 고정 높이 */}
				<div className="h-24 mb-4">
					<div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg h-full">
						<p className="text-sm text-blue-800 font-medium mb-1">📝 요약</p>
						<p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
							{isTranslating ? '번역 중...' : summary}
						</p>
					</div>
				</div>
				
				{/* 하단 정보 및 버튼 */}
				<div className="mt-auto">
					<div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-3">
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
					
					{/* 액션 버튼들 - 고정 높이 */}
					<div className="h-10">
						<div className="flex gap-2">
							{url && (
								<a
									href={url}
									target="_blank"
									rel="noreferrer"
									className="flex-1 text-center text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1"
								>
									<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
									</svg>
									원본 링크
								</a>
							)}
							<button
								onClick={handleShowFullTranslation}
								className="flex-1 text-center text-xs font-semibold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-1"
							>
								<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
								</svg>
								번역본 보기
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* 전체 번역 모달 */}
			{showFullTranslation && fullTranslation && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
						<div className="p-6 border-b border-gray-200">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-bold text-gray-900">전체 번역본</h2>
								<button
									onClick={() => setShowFullTranslation(false)}
									className="text-gray-400 hover:text-gray-600 transition-colors"
								>
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
						</div>
						<div className="p-6 overflow-y-auto max-h-[60vh]">
							<div className="space-y-4">
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">제목</h3>
									<p className="text-gray-700">{fullTranslation.title}</p>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">요약</h3>
									<p className="text-gray-700">{fullTranslation.summary}</p>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">상세 내용</h3>
									<p className="text-gray-700">{fullTranslation.description}</p>
								</div>
								{fullTranslation.content && (
									<div>
										<h3 className="text-lg font-semibold text-gray-900 mb-2">전체 기사</h3>
										<p className="text-gray-700">{fullTranslation.content}</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</article>
	);
}