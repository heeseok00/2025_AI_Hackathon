import React, { useState } from 'react';
import {
	ComposableMap,
	Geographies,
	Geography
} from 'react-simple-maps';

// 무료로 사용 가능한 세계 지도 TopoJSON
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// 국가 코드 매핑 (ISO 3166-1 numeric → Alpha-2)
const COUNTRY_CODE_MAP = {
	'840': 'US',  // United States
	'410': 'KR',  // South Korea
	'392': 'JP',  // Japan
	'826': 'GB',  // United Kingdom
	'276': 'DE',  // Germany
	'250': 'FR',  // France
	'380': 'IT',  // Italy
	'724': 'ES',  // Spain
	'124': 'CA',  // Canada
	'036': 'AU',  // Australia
	'156': 'CN',  // China
	'356': 'IN',  // India
	'076': 'BR',  // Brazil
	'484': 'MX',  // Mexico
	'643': 'RU',  // Russia
};

// 4가지 색상 체계
const COLORS = {
	UNSELECTABLE: '#F3F4F6',  // 1. 선택 불가능 - 매우 연한 회색
	SELECTABLE: '#BFDBFE',     // 2. 선택 가능 - 연한 파란색
	HOVERED: '#60A5FA',        // 3. 마우스 올린 선택 가능 - 중간 파란색
	SELECTED: '#1D4ED8',       // 4. 현재 선택된 국가 - 진한 파란색
};

export default function WorldMap({ selectedCountry, onCountrySelect }) {
	const [hoveredCountry, setHoveredCountry] = useState(null);

	const handleCountryClick = (geo) => {
		const countryCode = COUNTRY_CODE_MAP[geo.id];
		if (countryCode && onCountrySelect) {
			onCountrySelect(countryCode);
		}
	};

	const getCountryColor = (geo, isHovered) => {
		const countryCode = COUNTRY_CODE_MAP[geo.id];
		const isSelectable = !!countryCode;
		const isSelected = countryCode === selectedCountry;

		// 4. 현재 선택된 국가
		if (isSelected) return COLORS.SELECTED;
		
		// 3. 마우스 올린 선택 가능한 국가
		if (isHovered && isSelectable) return COLORS.HOVERED;
		
		// 2. 선택 가능한 국가
		if (isSelectable) return COLORS.SELECTABLE;
		
		// 1. 선택 불가능한 국가
		return COLORS.UNSELECTABLE;
	};

	return (
		<div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-4">
			<div className="mb-4">
				<h2 className="text-2xl font-bold text-gray-800">🌍 국가를 선택하세요</h2>
				<p className="text-sm text-gray-600 mt-1">
					국가를 클릭하면 해당 국가의 뉴스로 자동 이동합니다
				</p>
			</div>

			{/* 국가 선택 버튼 */}
			<div className="mb-4 p-3 bg-blue-50 rounded-lg">
				<p className="text-xs text-gray-600 mb-2 font-semibold">📍 빠른 선택:</p>
				<div className="flex flex-wrap gap-2">
					{Object.entries(COUNTRY_CODE_MAP).map(([id, code]) => (
						<button
							key={id}
							onClick={() => onCountrySelect(code)}
							className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
								selectedCountry === code
									? 'bg-blue-700 text-white shadow-md'
									: 'bg-white text-gray-700 hover:bg-blue-100 border border-gray-200'
							}`}
						>
							{code}
						</button>
					))}
				</div>
			</div>

			<div className="relative bg-white rounded-lg shadow-inner p-2">
				<ComposableMap
					projection="geoMercator"
					projectionConfig={{
						scale: 140,
						center: [0, 40]
					}}
					className="w-full h-auto"
					width={800}
					height={400}
				>
					<Geographies geography={geoUrl}>
						{({ geographies }) =>
							geographies.map((geo) => {
								const countryCode = COUNTRY_CODE_MAP[geo.id];
								const isSelectable = !!countryCode;
								const isHovered = hoveredCountry === geo.id;

								return (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										onClick={() => handleCountryClick(geo)}
										onMouseEnter={() => setHoveredCountry(geo.id)}
										onMouseLeave={() => setHoveredCountry(null)}
										style={{
											default: {
												fill: getCountryColor(geo, false),
												stroke: '#FFFFFF',
												strokeWidth: 0.5,
												outline: 'none',
												transition: 'all 0.2s ease',
											},
											hover: {
												fill: getCountryColor(geo, true),
												stroke: '#FFFFFF',
												strokeWidth: 0.8,
												outline: 'none',
												cursor: isSelectable ? 'pointer' : 'default',
											},
											pressed: {
												fill: getCountryColor(geo, true),
												stroke: '#FFFFFF',
												strokeWidth: 0.8,
												outline: 'none',
											},
										}}
									/>
								);
							})
						}
					</Geographies>
				</ComposableMap>

				{/* 호버된 국가 이름 표시 */}
				{hoveredCountry && COUNTRY_CODE_MAP[hoveredCountry] && (
					<div className="absolute bottom-4 left-4 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
						{COUNTRY_CODE_MAP[hoveredCountry]}
					</div>
				)}
			</div>
		</div>
	);
}
