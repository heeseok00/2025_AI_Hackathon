import React, { useState, useEffect } from 'react';
import { processArticle } from '../api/backendAPI.js';
import ProgressBar from './ProgressBar.jsx';
import { formatNewsContent, formatTranslatedContent, formatSummarizedContent } from '../utils/textFormatter.js';
import { extractCategoriesFromArticle, CATEGORY_COLORS, CATEGORY_NAMES } from '../utils/categoryUtils.js';

export default function NewsDetailModal({ isOpen, onClose, article }) {
	const [isProcessing, setIsProcessing] = useState(false);
	const [processedData, setProcessedData] = useState(null);
	const [activeTab, setActiveTab] = useState('original');
	const [error, setError] = useState(null);
	const [progress, setProgress] = useState(0);
	const [currentStep, setCurrentStep] = useState('');
	const [categories, setCategories] = useState([]);

	// 카테고리 추출
	useEffect(() => {
		if (article) {
			const articleCategories = extractCategoriesFromArticle(article);
			setCategories(articleCategories);
		}
	}, [article]);

	useEffect(() => {
		if (isOpen && article?.url) {
			// 새로운 기사가 선택되면 이전 데이터를 초기화하고 새로 처리
			setProcessedData(null);
			setError(null);
			setActiveTab('original');
			setProgress(0);
			setCurrentStep('');
			handleProcessArticle();
		}
	}, [isOpen, article?.url]);

	const handleProcessArticle = async () => {
		if (!article?.url) return;
		
		setIsProcessing(true);
		setError(null);
		setProgress(0);
		setCurrentStep('처리 시작...');
		
		try {
			console.log('기사 처리 시작:', article.url);
			
			// 진행률 시뮬레이션 (백엔드에서 실제 진행률을 받을 때까지)
			const progressInterval = setInterval(() => {
				setProgress(prev => {
					if (prev < 25) {
						setCurrentStep('기사 스크래핑 중...');
						return prev + Math.random() * 3;
					} else if (prev < 50) {
						setCurrentStep('번역 중...');
						return prev + Math.random() * 3;
					} else if (prev < 75) {
						setCurrentStep('요약 중...');
						return prev + Math.random() * 3;
					} else if (prev < 90) {
						setCurrentStep('최종 처리 중...');
						return prev + Math.random() * 2;
					}
					return prev;
				});
			}, 400);
			
			const result = await processArticle(article.url);
			
			clearInterval(progressInterval);
			
			if (result.success) {
				setProcessedData(result);
				setActiveTab('original');
				setProgress(100);
				setCurrentStep('완료');
				console.log('기사 처리 완료:', result.original?.title);
			} else {
				setError(result.error || '기사 처리에 실패했습니다.');
				setCurrentStep('처리 실패');
			}
		} catch (err) {
			console.error('API 호출 오류:', err);
			if (err.message.includes('Failed to fetch')) {
				setError('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
			} else {
				setError(`오류가 발생했습니다: ${err.message}`);
			}
			setCurrentStep('오류 발생');
		} finally {
			setIsProcessing(false);
		}
	};

	const handleClose = () => {
		// 모달 닫을 때 상태 초기화
		setProcessedData(null);
		setError(null);
		setActiveTab('original');
		setIsProcessing(false);
		setProgress(0);
		setCurrentStep('');
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
				{/* 헤더 */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<div className="flex items-center gap-4">
						<h2 className="text-xl font-bold text-gray-800">
							{article?.title || '뉴스 상세보기'}
						</h2>
						{article?.source && (
							<span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
								📰 {article.source.name || article.source}
							</span>
						)}
					</div>
					<button
						onClick={handleClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* 탭 메뉴 */}
				<div className="flex border-b border-gray-200 px-6">
					<button
						onClick={() => setActiveTab('original')}
						className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
							activeTab === 'original'
								? 'border-blue-500 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-gray-700'
						}`}
					>
						📄 원문보기
					</button>
					<button
						onClick={() => setActiveTab('translated')}
						className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
							activeTab === 'translated'
								? 'border-blue-500 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-gray-700'
						}`}
					>
						🌐 번역본보기
					</button>
					<button
						onClick={() => setActiveTab('summarized')}
						className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
							activeTab === 'summarized'
								? 'border-blue-500 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-gray-700'
						}`}
					>
						📝 요약본보기
					</button>
				</div>

				{/* 내용 영역 */}
				<div className="flex-1 overflow-hidden">
					{isProcessing && (
						<div className="flex items-center justify-center h-full p-6">
							<div className="w-full max-w-md">
								<div className="text-center mb-6">
									<div className="text-4xl mb-4">📰</div>
									<p className="text-lg font-medium text-gray-600">기사를 분석하고 있습니다...</p>
									<p className="text-sm text-gray-500 mt-2">스크래핑 → 번역 → 요약 중</p>
								</div>
								
								<ProgressBar 
									progress={progress} 
									currentStep={currentStep} 
									isVisible={true} 
								/>
								
								<div className="mt-4 text-center">
									<div className="flex justify-center space-x-2">
										<div className={`w-2 h-2 rounded-full ${progress >= 25 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
										<div className={`w-2 h-2 rounded-full ${progress >= 50 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
										<div className={`w-2 h-2 rounded-full ${progress >= 75 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
										<div className={`w-2 h-2 rounded-full ${progress >= 100 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
									</div>
								</div>
							</div>
						</div>
					)}

					{error && (
						<div className="flex items-center justify-center h-full">
							<div className="text-center p-8">
								<div className="text-red-500 text-6xl mb-4">⚠️</div>
								<p className="text-lg font-medium text-gray-800 mb-2">처리 중 오류가 발생했습니다</p>
								<p className="text-sm text-gray-600">{error}</p>
								<button
									onClick={handleProcessArticle}
									className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
								>
									다시 시도
								</button>
							</div>
						</div>
					)}

					{processedData && !isProcessing && (
						<div className="h-full overflow-y-auto p-6">
							{activeTab === 'original' && (
								<div>
									<h3 className="text-2xl font-bold text-gray-800 mb-6">
										{processedData.original.title}
									</h3>
									<div className="prose prose-lg max-w-none">
										{formatNewsContent(processedData.original.content).map((paragraph, index) => (
											<p key={index} className="mb-4 leading-relaxed text-gray-700">
												{paragraph.text}
											</p>
										))}
									</div>
									{processedData.original.metadata?.author && (
										<div className="mt-6 pt-6 border-t border-gray-200">
											<p className="text-sm text-gray-500">
												작성자: {processedData.original.metadata.author}
											</p>
										</div>
									)}
								</div>
							)}
							
							{activeTab === 'translated' && (
								<div>
									<h3 className="text-2xl font-bold text-gray-800 mb-6">
										{processedData.translated.title}
									</h3>
									<div className="prose prose-lg max-w-none">
										{formatTranslatedContent(processedData.translated.content).map((paragraph, index) => (
											<p key={index} className="mb-4 leading-relaxed text-gray-700">
												{paragraph.text}
											</p>
										))}
									</div>
									<div className="mt-6 pt-6 border-t border-gray-200">
										<p className="text-sm text-gray-500">
											🤖 GPT로 번역된 내용입니다
										</p>
									</div>
								</div>
							)}
							
							{activeTab === 'summarized' && (
								<div>
									<h3 className="text-2xl font-bold text-gray-800 mb-6">요약</h3>
									<div className="prose prose-lg max-w-none">
										{formatSummarizedContent(processedData.summarized.content).map((paragraph, index) => (
											<p key={index} className="mb-4 leading-relaxed text-gray-700">
												{paragraph.text}
											</p>
										))}
									</div>
									<div className="mt-6 pt-6 border-t border-gray-200">
										<p className="text-sm text-gray-500">
											🤖 GPT로 요약된 내용입니다
										</p>
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				{/* 푸터 */}
				<div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
					<div className="flex items-center gap-4">
						{article?.publishedAt && (
							<span className="text-sm text-gray-500">
								📅 {new Date(article.publishedAt).toLocaleDateString('ko-KR')}
							</span>
						)}
						{article?.url && (
							<a
								href={article.url}
								target="_blank"
								rel="noreferrer"
								className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
							>
								원본 링크
								<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
								</svg>
							</a>
						)}
						{categories.length > 0 && (
							<div className="flex items-center gap-2">
								<span className="text-sm text-gray-500">카테고리:</span>
								<div className="flex gap-1">
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
							</div>
						)}
					</div>
					<button
						onClick={handleClose}
						className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
					>
						닫기
					</button>
				</div>
			</div>
		</div>
	);
}