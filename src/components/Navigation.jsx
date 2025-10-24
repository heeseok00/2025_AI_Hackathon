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
			<nav className="bg-white border-b border-gray-200 shadow-sm relative z-50">
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
						<div className="hidden md:flex md:space-x-1">
							{NAV_ITEMS.map((item) => (
								<div
									key={item.id}
									className="relative"
									onMouseEnter={() => setOpenDropdown(item.id)}
									onMouseLeave={() => setOpenDropdown(null)}
								>
									<button
										className={`px-6 py-5 text-base font-semibold transition-colors relative ${
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

									{/* 각 항목 바로 아래 드롭다운 */}
									{openDropdown === item.id && (
										<div 
											className="absolute left-0 top-full mt-0 w-64 bg-white border border-gray-200 shadow-xl rounded-b-md animate-dropdown z-50"
										>
											<div className="py-2">
												{item.subItems.map((subItem) => (
													<a
														key={subItem.id}
														href={subItem.link}
														className="block px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
													>
														{subItem.title}
													</a>
												))}
											</div>
										</div>
									)}
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
			</nav>

			{/* 어두운 배경 오버레이 */}
			{openDropdown && (
				<div 
					className="fixed inset-0 bg-black/20 animate-overlay z-30"
					style={{ top: '64px' }}
					onClick={() => setOpenDropdown(null)}
				/>
			)}
		</>
	);
}
