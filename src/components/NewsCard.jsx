import React from 'react';

export default function NewsCard({ title, description, source, url }) {
	return (
		<article className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
			{/* 상단 색상 바 */}
			<div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:from-blue-600 group-hover:to-indigo-600 transition-colors"></div>
			
			<div className="p-5">
				{/* 제목 */}
				<h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-3">
					{title || 'Untitled'}
				</h3>
				
				{/* 설명 */}
				<p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
					{description || 'No description available.'}
				</p>
				
				{/* 하단 정보 */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-100">
					<div className="flex items-center gap-2">
						<span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
							📰 {source || 'Unknown'}
						</span>
					</div>
					
					{url ? (
						<a
							href={url}
							target="_blank"
							rel="noreferrer"
							className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
						>
							Read more
							<svg 
								className="w-3 h-3" 
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path 
									strokeLinecap="round" 
									strokeLinejoin="round" 
									strokeWidth={2} 
									d="M9 5l7 7-7 7" 
								/>
							</svg>
						</a>
					) : null}
				</div>
			</div>
		</article>
	);
}
