import React, { useState } from 'react';

const NAV_ITEMS = [
	{
		id: 1,
		title: '뉴스분석',
		subItems: [
			{ id: 11, title: '뉴스검색·분석', link: '#' },
			{ id: 12, title: '형태소·개체명 분석', link: '#' },
			{ id: 13, title: '분석결과 시각화', link: '#' },
			{ id: 14, title: '시각화 보고서만들기', link: '#' },
		]
	},
	{
		id: 2,
		title: '빅카인즈 AI',
		subItems: [
			{ id: 21, title: 'AI 뉴스 분석', link: '#' },
			{ id: 22, title: 'AI 트렌드 예측', link: '#' },
		]
	},
	{
		id: 3,
		title: '뉴스보기',
		subItems: [
			{ id: 31, title: '최신뉴스', link: '#' },
			{ id: 32, title: '주간이슈', link: '#' },
			{ id: 33, title: '고신문 아카이브', link: '#' },
		]
	},
	{
		id: 4,
		title: '빅카인즈 활용',
		subItems: [
			{ id: 41, title: '미디어 스타트업', link: '#' },
			{ id: 42, title: '활용사례', link: '#' },
			{ id: 43, title: '공공서비스 개선', link: '#' },
			{ id: 44, title: '공공서비스 개방', link: '#' },
			{ id: 45, title: 'OPEN API 서비스', link: '#' },
			{ id: 46, title: '이슈리포트', link: '#' },
		]
	},
	{
		id: 5,
		title: '빅카인즈 소개',
		subItems: [
			{ id: 51, title: '빅카인즈 소개', link: '#' },
			{ id: 52, title: '서비스 안내', link: '#' },
			{ id: 53, title: '수집기사 정보', link: '#' },
			{ id: 54, title: '이용안내', link: '#' },
		]
	},
];

export default function Navigation() {
	const [openDropdown, setOpenDropdown] = useState(null);

	return (
		<>
			<nav 
				className="bg-white border-b border-gray-200 shadow-sm relative z-50"
				onMouseLeave={() => setOpenDropdown(null)}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* 상단 네비게이션 */}
					<div className="flex items-center justify-between h-16">
						{/* 로고 */}
						<div className="flex-shrink-0">
							<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
								GlobaLink
							</h1>
						</div>

					{/* 메인 메뉴 */}
					<div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:max-w-3xl md:mx-auto">
						{NAV_ITEMS.map((item, index) => (
							<div
								key={item.id}
								className="relative flex-1"
								onMouseEnter={() => setOpenDropdown(item.id)}
								style={{ 
									minWidth: '160px',
									maxWidth: '220px',
									marginLeft: index === 0 ? '0' : '4px',
									marginRight: index === NAV_ITEMS.length - 1 ? '0' : '4px'
								}}
							>
								<button
									className={`w-full px-6 py-5 text-base font-semibold transition-colors relative ${
										openDropdown === item.id
											? 'text-blue-600'
											: 'text-gray-700 hover:text-blue-600'
									}`}
								>
									{item.title}
									{/* 하단 파란색 바 */}
									{openDropdown === item.id && (
										<div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
									)}
								</button>
							</div>
						))}
					</div>

						{/* 우측 버튼 */}
						<div className="flex items-center space-x-2">
							<button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
								로그인
							</button>
							<button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
								회원가입
							</button>
						</div>

						{/* 모바일 메뉴 버튼 */}
						<div className="md:hidden">
							<button className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
								<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* 통합 드롭다운 영역 - 각 메뉴 아래에 정확히 수직 정렬 */}
				{openDropdown && (
					<div className="absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-2xl animate-slideDown z-40">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							{/* 상단 레이아웃과 정확히 동일한 flex 구조 */}
							<div className="flex items-start justify-between">
								{/* 로고 영역과 동일한 flex-shrink-0 (자동으로 로고 너비만큼) */}
								<div className="flex-shrink-0">
									<div className="text-2xl font-bold invisible">GlobaLink</div>
								</div>
								
								{/* 메뉴 영역 - 상단과 정확히 동일한 레이아웃 */}
								<div className="flex-1 flex items-start justify-between divide-x divide-gray-200 max-w-3xl mx-auto">
									{NAV_ITEMS.map((menuItem, index) => (
										<div 
											key={menuItem.id} 
											className="flex-1 py-6"
											style={{ 
												minWidth: '160px',
												maxWidth: '220px',
												marginLeft: index === 0 ? '0' : '4px',
												marginRight: index === NAV_ITEMS.length - 1 ? '0' : '4px',
												paddingLeft: '24px',
												paddingRight: '24px'
											}}
										>
											<div className="space-y-2">
												<h3 className={`text-sm font-bold pb-2 mb-2 border-b-2 transition-all duration-300 ${
													openDropdown === menuItem.id 
														? 'text-blue-600 border-blue-600' 
														: 'text-gray-400 border-transparent'
												}`}>
													{menuItem.title}
												</h3>
												<div className="space-y-1">
													{menuItem.subItems.map((subItem) => (
														<a
															key={subItem.id}
															href={subItem.link}
															className={`block px-3 py-2.5 text-sm rounded-md transition-all duration-200 ${
																openDropdown === menuItem.id
																	? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1'
																	: 'text-gray-300 pointer-events-none'
															}`}
														>
															{subItem.title}
														</a>
													))}
												</div>
											</div>
										</div>
									))}
								</div>
								
								{/* 우측 버튼 영역과 동일한 flex 공간 */}
								<div className="flex items-center space-x-2 invisible">
									<button className="px-4 py-2 text-sm font-medium">로그인</button>
									<button className="px-4 py-2 text-sm font-medium">회원가입</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</nav>

			{/* 어두운 배경 오버레이 */}
			{openDropdown && (
				<div 
					className="fixed inset-0 bg-black/50 animate-overlay z-30"
					style={{ top: '64px' }}
					onMouseEnter={() => setOpenDropdown(null)}
				/>
			)}
		</>
	);
}
