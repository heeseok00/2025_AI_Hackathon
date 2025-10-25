import React, { useState, useEffect } from 'react';
import { translateText, summarizeText, translateFullArticle } from '../api/translateAPI.js';

export default function MultilingualNewsCard({ 
	title, 
	description, 
	source, 
	url, 
	urlToImage, 
	publishedAt 
}) {
	const [translatedTitle, setTranslatedTitle] = useState('');
	const [translatedDescription, setTranslatedDescription] = useState('');
	const [summary, setSummary] = useState('');
	const [isTranslating, setIsTranslating] = useState(true);
	const [showFullTranslation, setShowFullTranslation] = useState(false);
	const [fullTranslation, setFullTranslation] = useState(null);

	// 컴포넌트 마운트 시 번역 실행
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

		translateContent();
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

	return (
		<article className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden group toss-card h-full flex flex-col">
			{/* 상단 색상 바 */}
			<div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-500"></div>
			
			{/* 이미지 */}
			{urlToImage && (
				<div className="relative h-48 overflow-hidden">
					<img 
						src={urlToImage} 
						alt={translatedTitle || title || 'News image'}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						onError={(e) => {
							e.target.style.display = 'none';
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
				</div>
			)}
			
			<div className="p-5 flex-1 flex flex-col">
				{/* 제목 (번역본) */}
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
				
				{/* 요약본 */}
				<div className="mb-4 flex-1">
					<div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
						<p className="text-sm text-blue-800 font-medium mb-1">📝 요약</p>
						<p className="text-sm text-gray-700 leading-relaxed">
							{isTranslating ? '번역 중...' : summary}
						</p>
					</div>
				</div>
				
				{/* 하단 정보 및 버튼 */}
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
					
					{/* 액션 버튼들 */}
					<div className="flex gap-2 mt-3">
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