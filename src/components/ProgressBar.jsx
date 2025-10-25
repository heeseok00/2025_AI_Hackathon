import React from 'react';

export default function ProgressBar({ progress, currentStep, isVisible }) {
	if (!isVisible) return null;

	return (
		<div>
			<div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
				<div 
					className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
					style={{ width: `${progress}%` }}
				></div>
			</div>
			<div className="flex justify-between items-center text-sm text-gray-600 mb-2">
				<span className="font-medium">{currentStep}</span>
				<span className="font-bold text-blue-600">{progress.toFixed(2)}%</span>
			</div>
			{/* 단계별 표시 */}
			<div className="flex justify-between text-xs text-gray-500">
				<span className={progress >= 25 ? 'text-blue-600 font-medium' : ''}>스크래핑</span>
				<span className={progress >= 50 ? 'text-blue-600 font-medium' : ''}>번역</span>
				<span className={progress >= 75 ? 'text-blue-600 font-medium' : ''}>요약</span>
				<span className={progress >= 100 ? 'text-blue-600 font-medium' : ''}>완료</span>
			</div>
		</div>
	);
}