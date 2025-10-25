import React, { useState } from 'react';
import {
	ComposableMap,
	Geographies,
	Geography,
	ZoomableGroup
} from 'react-simple-maps';
import { useMotionValue, useSpring, useMotionValueEvent } from 'framer-motion';

// 무료로 사용 가능한 세계 지도 TopoJSON
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// 국가 데이터 (ISO 3166-1 numeric → Alpha-2 + 중심 좌표 + 줌 레벨)
const COUNTRIES = {
	'840': { code: 'US', name: 'United States', center: [-95, 37], zoom: 1.6 },
	'410': { code: 'KR', name: 'South Korea', center: [127.5, 37], zoom: 5 },
	'392': { code: 'JP', name: 'Japan', center: [138, 36], zoom: 4 },
	'826': { code: 'GB', name: 'United Kingdom', center: [-2, 54], zoom: 4.5 },
	'276': { code: 'DE', name: 'Germany', center: [10, 51], zoom: 4.5 },
	'250': { code: 'FR', name: 'France', center: [2, 46], zoom: 4 },
	'380': { code: 'IT', name: 'Italy', center: [12, 42], zoom: 4 },
	'724': { code: 'ES', name: 'Spain', center: [-4, 40], zoom: 4 },
	'124': { code: 'CA', name: 'Canada', center: [-95, 56], zoom: 1.5 },
	'036': { code: 'AU', name: 'Australia', center: [133, -27], zoom: 2.5 },
	'156': { code: 'CN', name: 'China', center: [105, 35], zoom: 2.5 },
	'356': { code: 'IN', name: 'India', center: [78, 20], zoom: 3.5 },
	'076': { code: 'BR', name: 'Brazil', center: [-52, -10], zoom: 2.5 },
	'484': { code: 'MX', name: 'Mexico', center: [-102, 23], zoom: 3.5 },
	'643': { code: 'RU', name: 'Russia', center: [100, 60], zoom: 1.5 },
	'710': { code: 'ZA', name: 'South Africa', center: [25, -29], zoom: 3.5 },
	'818': { code: 'EG', name: 'Egypt', center: [30, 26], zoom: 3.5 },
	'012': { code: 'DZ', name: 'Algeria', center: [2, 28], zoom: 5 },
	'024': { code: 'AO', name: 'Angola', center: [17, -12], zoom: 5 },
	'204': { code: 'BJ', name: 'Benin', center: [2, 9], zoom: 4 },
	'072': { code: 'BW', name: 'Botswana', center: [24, -22], zoom: 3.5 },
	'854': { code: 'BF', name: 'Burkina Faso', center: [-2, 12], zoom: 4 },
	'108': { code: 'BI', name: 'Burundi', center: [30, -3], zoom: 4.5 },
	'120': { code: 'CM', name: 'Cameroon', center: [12, 6], zoom: 3.5 },
	'132': { code: 'CV', name: 'Cape Verde', center: [-24, 16], zoom: 4.5 },
	'140': { code: 'CF', name: 'Central African Republic', center: [20, 7], zoom: 3.5 },
	'148': { code: 'TD', name: 'Chad', center: [18, 15], zoom: 5 },
	'174': { code: 'KM', name: 'Comoros', center: [44, -12], zoom: 5 },
	'178': { code: 'CG', name: 'Congo', center: [15, -1], zoom: 3.5 },
	'180': { code: 'CD', name: 'DR Congo', center: [23, -2], zoom: 5 },
	'262': { code: 'DJ', name: 'Djibouti', center: [42, 11], zoom: 4.5 },
	'226': { code: 'GQ', name: 'Equatorial Guinea', center: [10, 1], zoom: 4.5 },
	'232': { code: 'ER', name: 'Eritrea', center: [39, 15], zoom: 4 },
	'231': { code: 'ET', name: 'Ethiopia', center: [39, 8], zoom: 5 },
	'266': { code: 'GA', name: 'Gabon', center: [11, -1], zoom: 3.5 },
	'270': { code: 'GM', name: 'Gambia', center: [-15, 13], zoom: 4.5 },
	'288': { code: 'GH', name: 'Ghana', center: [-1, 8], zoom: 4 },
	'324': { code: 'GN', name: 'Guinea', center: [-10, 10], zoom: 4 },
	'624': { code: 'GW', name: 'Guinea-Bissau', center: [-15, 12], zoom: 4.5 },
	'384': { code: 'CI', name: 'Ivory Coast', center: [-5, 8], zoom: 4 },
	'404': { code: 'KE', name: 'Kenya', center: [37, 1], zoom: 3.5 },
	'426': { code: 'LS', name: 'Lesotho', center: [28, -29], zoom: 4.5 },
	'430': { code: 'LR', name: 'Liberia', center: [-9, 6], zoom: 4 },
	'434': { code: 'LY', name: 'Libya', center: [17, 27], zoom: 5 },
	'450': { code: 'MG', name: 'Madagascar', center: [46, -19], zoom: 3.5 },
	'454': { code: 'MW', name: 'Malawi', center: [34, -13], zoom: 4 },
	'466': { code: 'ML', name: 'Mali', center: [-4, 17], zoom: 5 },
	'478': { code: 'MR', name: 'Mauritania', center: [-10, 20], zoom: 5 },
	'480': { code: 'MU', name: 'Mauritius', center: [57, -20], zoom: 5 },
	'508': { code: 'MZ', name: 'Mozambique', center: [35, -18], zoom: 3.5 },
	'516': { code: 'NA', name: 'Namibia', center: [17, -22], zoom: 3.5 },
	'562': { code: 'NE', name: 'Niger', center: [8, 16], zoom: 5 },
	'566': { code: 'NG', name: 'Nigeria', center: [8, 9], zoom: 3.5 },
	'646': { code: 'RW', name: 'Rwanda', center: [30, -2], zoom: 4.5 },
	'678': { code: 'ST', name: 'São Tomé and Príncipe', center: [7, 0], zoom: 5 },
	'686': { code: 'SN', name: 'Senegal', center: [-14, 14], zoom: 4 },
	'690': { code: 'SC', name: 'Seychelles', center: [55, -5], zoom: 5 },
	'694': { code: 'SL', name: 'Sierra Leone', center: [-12, 8], zoom: 4.5 },
	'706': { code: 'SO', name: 'Somalia', center: [46, 6], zoom: 3.5 },
	'728': { code: 'SS', name: 'South Sudan', center: [30, 7], zoom: 3.5 },
	'729': { code: 'SD', name: 'Sudan', center: [30, 15], zoom: 5 },
	'748': { code: 'SZ', name: 'Eswatini', center: [31, -26], zoom: 4.5 },
	'834': { code: 'TZ', name: 'Tanzania', center: [34, -6], zoom: 3.5 },
	'768': { code: 'TG', name: 'Togo', center: [1, 8], zoom: 4.5 },
	'788': { code: 'TN', name: 'Tunisia', center: [9, 34], zoom: 4 },
	'800': { code: 'UG', name: 'Uganda', center: [32, 1], zoom: 4 },
	'894': { code: 'ZM', name: 'Zambia', center: [27, -13], zoom: 3.5 },
	'716': { code: 'ZW', name: 'Zimbabwe', center: [30, -19], zoom: 4 },
	'004': { code: 'AF', name: 'Afghanistan', center: [67, 33], zoom: 3.5 },
	'051': { code: 'AM', name: 'Armenia', center: [45, 40], zoom: 4.5 },
	'031': { code: 'AZ', name: 'Azerbaijan', center: [47, 40], zoom: 4 },
	'048': { code: 'BH', name: 'Bahrain', center: [50, 26], zoom: 5 },
	'050': { code: 'BD', name: 'Bangladesh', center: [90, 24], zoom: 4 },
	'064': { code: 'BT', name: 'Bhutan', center: [90, 27], zoom: 4.5 },
	'096': { code: 'BN', name: 'Brunei', center: [114, 4], zoom: 4.5 },
	'116': { code: 'KH', name: 'Cambodia', center: [105, 13], zoom: 4 },
	'196': { code: 'CY', name: 'Cyprus', center: [33, 35], zoom: 4.5 },
	'268': { code: 'GE', name: 'Georgia', center: [43, 42], zoom: 4 },
	'344': { code: 'HK', name: 'Hong Kong', center: [114, 22], zoom: 5.5 },
	'360': { code: 'ID', name: 'Indonesia', center: [118, -2], zoom: 4 },
	'364': { code: 'IR', name: 'Iran', center: [53, 32], zoom: 5 },
	'368': { code: 'IQ', name: 'Iraq', center: [43, 33], zoom: 3.5 },
	'376': { code: 'IL', name: 'Israel', center: [35, 31], zoom: 4.5 },
	'400': { code: 'JO', name: 'Jordan', center: [36, 31], zoom: 4.5 },
	'398': { code: 'KZ', name: 'Kazakhstan', center: [67, 48], zoom: 4 },
	'414': { code: 'KW', name: 'Kuwait', center: [47, 29], zoom: 4.5 },
	'417': { code: 'KG', name: 'Kyrgyzstan', center: [74, 41], zoom: 4 },
	'418': { code: 'LA', name: 'Laos', center: [102, 18], zoom: 4 },
	'422': { code: 'LB', name: 'Lebanon', center: [35, 34], zoom: 4.5 },
	'458': { code: 'MY', name: 'Malaysia', center: [109, 4], zoom: 3.5 },
	'462': { code: 'MV', name: 'Maldives', center: [73, 3], zoom: 4.5 },
	'496': { code: 'MN', name: 'Mongolia', center: [103, 46], zoom: 5 },
	'104': { code: 'MM', name: 'Myanmar', center: [96, 21], zoom: 3.5 },
	'524': { code: 'NP', name: 'Nepal', center: [84, 28], zoom: 4 },
	'408': { code: 'KP', name: 'North Korea', center: [127, 40], zoom: 4 },
	'512': { code: 'OM', name: 'Oman', center: [55, 21], zoom: 3.5 },
	'586': { code: 'PK', name: 'Pakistan', center: [69, 30], zoom: 3.5 },
	'275': { code: 'PS', name: 'Palestine', center: [35, 32], zoom: 4.5 },
	'608': { code: 'PH', name: 'Philippines', center: [122, 12], zoom: 3.5 },
	'634': { code: 'QA', name: 'Qatar', center: [51, 25], zoom: 4.5 },
	'682': { code: 'SA', name: 'Saudi Arabia', center: [45, 24], zoom: 5 },
	'702': { code: 'SG', name: 'Singapore', center: [103, 1], zoom: 3.5 },
	'144': { code: 'LK', name: 'Sri Lanka', center: [80, 7], zoom: 4.5 },
	'760': { code: 'SY', name: 'Syria', center: [38, 35], zoom: 4 },
	'158': { code: 'TW', name: 'Taiwan', center: [121, 24], zoom: 4.5 },
	'762': { code: 'TJ', name: 'Tajikistan', center: [71, 39], zoom: 4 },
	'764': { code: 'TH', name: 'Thailand', center: [101, 15], zoom: 3.5 },
	'626': { code: 'TL', name: 'Timor-Leste', center: [125, -9], zoom: 4.5 },
	'792': { code: 'TR', name: 'Turkey', center: [35, 39], zoom: 3.5 },
	'795': { code: 'TM', name: 'Turkmenistan', center: [59, 40], zoom: 3.5 },
	'784': { code: 'AE', name: 'United Arab Emirates', center: [54, 24], zoom: 4 },
	'860': { code: 'UZ', name: 'Uzbekistan', center: [64, 41], zoom: 3.5 },
	'704': { code: 'VN', name: 'Vietnam', center: [106, 16], zoom: 3.5 },
	'887': { code: 'YE', name: 'Yemen', center: [48, 15], zoom: 4 },
	'008': { code: 'AL', name: 'Albania', center: [20, 41], zoom: 4.5 },
	'020': { code: 'AD', name: 'Andorra', center: [1, 42], zoom: 5.5 },
	'040': { code: 'AT', name: 'Austria', center: [13, 47], zoom: 4 },
	'112': { code: 'BY', name: 'Belarus', center: [28, 53], zoom: 3.5 },
	'056': { code: 'BE', name: 'Belgium', center: [4, 50], zoom: 4.5 },
	'070': { code: 'BA', name: 'Bosnia and Herzegovina', center: [18, 44], zoom: 4.5 },
	'100': { code: 'BG', name: 'Bulgaria', center: [25, 43], zoom: 4 },
	'191': { code: 'HR', name: 'Croatia', center: [16, 45], zoom: 4 },
	'203': { code: 'CZ', name: 'Czech Republic', center: [15, 49], zoom: 4 },
	'208': { code: 'DK', name: 'Denmark', center: [10, 56], zoom: 4 },
	'233': { code: 'EE', name: 'Estonia', center: [25, 59], zoom: 4 },
	'246': { code: 'FI', name: 'Finland', center: [26, 64], zoom: 5 },
	'300': { code: 'GR', name: 'Greece', center: [22, 39], zoom: 4 },
	'348': { code: 'HU', name: 'Hungary', center: [19, 47], zoom: 4 },
	'352': { code: 'IS', name: 'Iceland', center: [-18, 65], zoom: 3.5 },
	'372': { code: 'IE', name: 'Ireland', center: [-8, 53], zoom: 4 },
	'428': { code: 'LV', name: 'Latvia', center: [25, 57], zoom: 4 },
	'438': { code: 'LI', name: 'Liechtenstein', center: [9, 47], zoom: 3.5 },
	'440': { code: 'LT', name: 'Lithuania', center: [24, 55], zoom: 4 },
	'442': { code: 'LU', name: 'Luxembourg', center: [6, 49], zoom: 5 },
	'807': { code: 'MK', name: 'North Macedonia', center: [21, 41], zoom: 4.5 },
	'470': { code: 'MT', name: 'Malta', center: [14, 36], zoom: 5.5 },
	'498': { code: 'MD', name: 'Moldova', center: [28, 47], zoom: 4.5 },
	'492': { code: 'MC', name: 'Monaco', center: [7, 43], zoom: 6.5 },
	'499': { code: 'ME', name: 'Montenegro', center: [19, 42], zoom: 4.5 },
	'528': { code: 'NL', name: 'Netherlands', center: [5, 52], zoom: 4 },
	'578': { code: 'NO', name: 'Norway', center: [10, 60], zoom: 5 },
	'616': { code: 'PL', name: 'Poland', center: [19, 52], zoom: 3.5 },
	'620': { code: 'PT', name: 'Portugal', center: [-8, 39], zoom: 4 },
	'642': { code: 'RO', name: 'Romania', center: [25, 46], zoom: 4 },
	'674': { code: 'SM', name: 'San Marino', center: [12, 43], zoom: 3.5 },
	'688': { code: 'RS', name: 'Serbia', center: [21, 44], zoom: 4 },
	'703': { code: 'SK', name: 'Slovakia', center: [19, 48], zoom: 4.5 },
	'705': { code: 'SI', name: 'Slovenia', center: [14, 46], zoom: 4.5 },
	'752': { code: 'SE', name: 'Sweden', center: [15, 62], zoom: 5 },
	'756': { code: 'CH', name: 'Switzerland', center: [8, 46], zoom: 4.5 },
	'804': { code: 'UA', name: 'Ukraine', center: [31, 49], zoom: 3.5 },
	'336': { code: 'VA', name: 'Vatican City', center: [12, 41], zoom: 4 },
	'028': { code: 'AG', name: 'Antigua and Barbuda', center: [-61, 17], zoom: 5 },
	'044': { code: 'BS', name: 'Bahamas', center: [-77, 24], zoom: 4 },
	'052': { code: 'BB', name: 'Barbados', center: [-59, 13], zoom: 5 },
	'084': { code: 'BZ', name: 'Belize', center: [-88, 17], zoom: 4.5 },
	'188': { code: 'CR', name: 'Costa Rica', center: [-84, 10], zoom: 4.5 },
	'192': { code: 'CU', name: 'Cuba', center: [-77, 21], zoom: 4 },
	'212': { code: 'DM', name: 'Dominica', center: [-61, 15], zoom: 5 },
	'214': { code: 'DO', name: 'Dominican Republic', center: [-70, 19], zoom: 4.5 },
	'222': { code: 'SV', name: 'El Salvador', center: [-88, 13], zoom: 4.5 },
	'308': { code: 'GD', name: 'Grenada', center: [-61, 12], zoom: 5 },
	'320': { code: 'GT', name: 'Guatemala', center: [-90, 15], zoom: 4 },
	'332': { code: 'HT', name: 'Haiti', center: [-72, 19], zoom: 4.5 },
	'340': { code: 'HN', name: 'Honduras', center: [-86, 15], zoom: 4 },
	'388': { code: 'JM', name: 'Jamaica', center: [-77, 18], zoom: 4.5 },
	'558': { code: 'NI', name: 'Nicaragua', center: [-85, 13], zoom: 4 },
	'591': { code: 'PA', name: 'Panama', center: [-80, 9], zoom: 4.5 },
	'659': { code: 'KN', name: 'Saint Kitts and Nevis', center: [-62, 17], zoom: 5 },
	'662': { code: 'LC', name: 'Saint Lucia', center: [-60, 14], zoom: 5 },
	'670': { code: 'VC', name: 'Saint Vincent', center: [-61, 13], zoom: 5 },
	'780': { code: 'TT', name: 'Trinidad and Tobago', center: [-61, 10], zoom: 4.5 },
	'032': { code: 'AR', name: 'Argentina', center: [-64, -34], zoom: 4 },
	'068': { code: 'BO', name: 'Bolivia', center: [-65, -17], zoom: 5 },
	'152': { code: 'CL', name: 'Chile', center: [-71, -30], zoom: 4 },
	'170': { code: 'CO', name: 'Colombia', center: [-72, 4], zoom: 5 },
	'218': { code: 'EC', name: 'Ecuador', center: [-78, -2], zoom: 4 },
	'328': { code: 'GY', name: 'Guyana', center: [-59, 5], zoom: 4 },
	'600': { code: 'PY', name: 'Paraguay', center: [-58, -23], zoom: 3.5 },
	'604': { code: 'PE', name: 'Peru', center: [-75, -10], zoom: 5 },
	'740': { code: 'SR', name: 'Suriname', center: [-56, 4], zoom: 4 },
	'858': { code: 'UY', name: 'Uruguay', center: [-56, -33], zoom: 4 },
	'862': { code: 'VE', name: 'Venezuela', center: [-66, 8], zoom: 3.5 },
	'554': { code: 'NZ', name: 'New Zealand', center: [174, -41], zoom: 3.5 },
	'242': { code: 'FJ', name: 'Fiji', center: [178, -18], zoom: 4.5 },
	'090': { code: 'SB', name: 'Solomon Islands', center: [160, -9], zoom: 4 },
	'548': { code: 'VU', name: 'Vanuatu', center: [168, -16], zoom: 4.5 },
	'598': { code: 'PG', name: 'Papua New Guinea', center: [145, -6], zoom: 3.5 },
	'584': { code: 'MH', name: 'Marshall Islands', center: [171, 7], zoom: 4.5 },
	'296': { code: 'KI', name: 'Kiribati', center: [-157, 1], zoom: 4.5 },
	'520': { code: 'NR', name: 'Nauru', center: [166, -0], zoom: 3.5 },
	'585': { code: 'PW', name: 'Palau', center: [134, 7], zoom: 5 },
	'882': { code: 'WS', name: 'Samoa', center: [-172, -13], zoom: 4.5 },
	'776': { code: 'TO', name: 'Tonga', center: [-175, -21], zoom: 4.5 },
	'798': { code: 'TV', name: 'Tuvalu', center: [179, -8], zoom: 5 },
};

// 역매핑: code → id
const CODE_TO_ID = {};
Object.entries(COUNTRIES).forEach(([id, data]) => {
	CODE_TO_ID[data.code] = id;
});

// 4가지 색상 체계
const COLORS = {
	UNSELECTABLE: '#F3F4F6',  // 1. 선택 불가능 - 매우 연한 회색
	SELECTABLE: '#BFDBFE',     // 2. 선택 가능 - 연한 파란색
	HOVERED: '#60A5FA',        // 3. 마우스 올린 선택 가능 - 중간 파란색
	SELECTED: '#1D4ED8',       // 4. 현재 선택된 국가 - 진한 파란색
};

export default function WorldMap({ selectedCountry, onCountrySelect }) {
	const [hoveredCountry, setHoveredCountry] = useState(null);
	const [position, setPosition] = useState({ zoom: 1, center: [0, 20] });
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const mapRef = React.useRef(null);
	const dropdownRef = React.useRef(null);
	
	// Framer Motion으로 부드러운 애니메이션 구현
	const zoomValue = useMotionValue(1);
	const centerXValue = useMotionValue(0);
	const centerYValue = useMotionValue(20);
	
	// Spring 설정: 빠르고 반응성 좋은 애니메이션
	const zoom = useSpring(zoomValue, { 
		stiffness: 200,  // 탄성 (높을수록 빠름)
		damping: 30,     // 감쇠 (높을수록 빨리 멈춤)
		mass: 0.5        // 질량 (낮을수록 가벼움)
	});
	
	const centerX = useSpring(centerXValue, { 
		stiffness: 200,
		damping: 30,
		mass: 0.5
	});
	
	const centerY = useSpring(centerYValue, { 
		stiffness: 200,
		damping: 30,
		mass: 0.5
	});

	// Spring 값을 state로 변환 (ZoomableGroup에 전달하기 위함)
	useMotionValueEvent(zoom, "change", (latest) => {
		setPosition(prev => ({ ...prev, zoom: latest }));
	});

	useMotionValueEvent(centerX, "change", (latest) => {
		setPosition(prev => ({ 
			...prev, 
			center: [latest, prev.center[1]] 
		}));
	});

	useMotionValueEvent(centerY, "change", (latest) => {
		setPosition(prev => ({ 
			...prev, 
			center: [prev.center[0], latest] 
		}));
	});

	// 현재 선택된 국가 정보
	const selectedCountryData = selectedCountry 
		? COUNTRIES[CODE_TO_ID[selectedCountry]] 
		: null;

	// 부드러운 비행 효과 - framer-motion spring이 알아서 처리!
	React.useEffect(() => {
		if (!selectedCountryData) {
			// 초기화 버튼 클릭 시
			zoomValue.set(1);
			centerXValue.set(0);
			centerYValue.set(20);
			return;
		}

		const targetZoom = selectedCountryData.zoom * 0.7; // zoom 30% 축소
		const targetCenter = selectedCountryData.center;

		// 바로 목적지로 설정 - spring이 알아서 부드럽게 애니메이션!
		zoomValue.set(targetZoom);
		centerXValue.set(targetCenter[0]);
		centerYValue.set(targetCenter[1]);
	}, [selectedCountryData, zoomValue, centerXValue, centerYValue]);

	// 줌 컨트롤 함수
	const handleZoomIn = () => {
		const newZoom = Math.min(position.zoom * 1.5, 8); // 최대 줌 레벨 8
		zoomValue.set(newZoom);
	};

	const handleZoomOut = () => {
		const newZoom = Math.max(position.zoom / 1.5, 0.25); // 최소 줌 레벨 0.25
		zoomValue.set(newZoom);
	};

	const handleResetZoom = () => {
		zoomValue.set(1);
		centerXValue.set(0);
		centerYValue.set(20);
	};

	// 고정 줌 레벨 설정
	const handleSetZoom = (zoomLevel) => {
		// 슬라이더는 즉시 반영 (spring 우회)
		const numLevel = parseFloat(zoomLevel);
		setPosition(prev => ({ ...prev, zoom: numLevel }));
		zoomValue.set(numLevel);
	};

	// 사용자가 수동으로 줌/팬 했을 때 처리 (마우스 휠, 터치패드)
	const handleMoveEnd = (newPosition) => {
		// 사용자의 수동 조작을 즉시 반영
		setPosition({
			zoom: newPosition.zoom,
			center: newPosition.coordinates
		});
		zoomValue.set(newPosition.zoom);
		centerXValue.set(newPosition.coordinates[0]);
		centerYValue.set(newPosition.coordinates[1]);
	};

	// 드롭다운 외부 클릭 감지
	React.useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};

		if (isDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isDropdownOpen]);

	const handleCountryClick = (geo) => {
		const countryData = COUNTRIES[geo.id];
		if (countryData && onCountrySelect) {
			onCountrySelect(countryData.code);
			// 지도로 스크롤
			setTimeout(() => {
				if (mapRef.current) {
					mapRef.current.scrollIntoView({ 
						behavior: 'smooth', 
						block: 'center' 
					});
				}
			}, 100);
		}
	};

	const getCountryColor = (geo, isHovered) => {
		const countryData = COUNTRIES[geo.id];
		const isSelectable = !!countryData;
		const isSelected = countryData?.code === selectedCountry;

		// 4. 현재 선택된 국가
		if (isSelected) return COLORS.SELECTED;
		
		// 3. 마우스 올린 선택 가능한 국가
		if (isHovered && isSelectable) return COLORS.HOVERED;
		
		// 2. 선택 가능한 국가
		if (isSelectable) return COLORS.SELECTABLE;
		
		// 1. 선택 불가능한 국가
		return COLORS.UNSELECTABLE;
	};

	// 국가 리스트 (필터링 + 정렬)
	const countryList = Object.entries(COUNTRIES)
		.map(([id, data]) => data)
		.filter(country => 
			country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			country.code.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.sort((a, b) => a.name.localeCompare(b.name));

	const handleCountrySelect = (code) => {
		onCountrySelect(code);
		setIsDropdownOpen(false);
		setSearchQuery('');
		// 지도로 스크롤
		setTimeout(() => {
			if (mapRef.current) {
				mapRef.current.scrollIntoView({ 
					behavior: 'smooth', 
					block: 'center' 
				});
			}
		}, 100);
	};

	return (
		<div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6">
		{/* 커스텀 드롭다운 */}
		<div className="mb-6 relative" ref={dropdownRef}>
			<button
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
				className="w-full px-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm hover:border-blue-400 hover:shadow-md text-left flex items-center justify-between group"
			>
				<span className="flex items-center gap-3">
					<span className="text-xl">🌍</span>
					<span className={`font-medium ${selectedCountry ? 'text-gray-800' : 'text-gray-500'}`}>
						{selectedCountry 
							? `${COUNTRIES[CODE_TO_ID[selectedCountry]]?.name} (${selectedCountry})`
							: '국가를 선택하세요'}
					</span>
				</span>
				<svg 
					className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
					fill="none" 
					stroke="currentColor" 
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{/* 드롭다운 메뉴 */}
			{isDropdownOpen && (
				<div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-toss-scale">
					{/* 검색창 */}
					<div className="p-3 border-b border-gray-200 bg-gray-50">
						<div className="relative">
							<input
								type="text"
								placeholder="국가 검색... (예: Korea, 한국)"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full px-4 py-2 pl-9 pr-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
								autoFocus
							/>
							<svg 
								className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
							{searchQuery && (
								<button
									onClick={() => setSearchQuery('')}
									className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							)}
						</div>
					</div>

					{/* 국가 리스트 */}
					<div className="max-h-80 overflow-y-auto">
						{countryList.length > 0 ? (
							<>
								{countryList.map((country, idx) => (
									<button
										key={country.code}
										onClick={() => handleCountrySelect(country.code)}
										className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 group ${
											selectedCountry === country.code ? 'bg-blue-50' : ''
										} ${idx < 10 ? 'animate-toss-' + (idx + 1) : ''}`}
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3">
												<div className={`w-2 h-2 rounded-full transition-all duration-200 ${
													selectedCountry === country.code ? 'bg-blue-600 ring-2 ring-blue-200' : 'bg-gray-300 group-hover:bg-blue-400'
												}`}></div>
												<span className={`font-medium transition-colors ${
													selectedCountry === country.code ? 'text-blue-600' : 'text-gray-800 group-hover:text-blue-600'
												}`}>
													{country.name}
												</span>
											</div>
											<span className={`text-xs font-mono px-2 py-1 rounded transition-all ${
												selectedCountry === country.code 
													? 'bg-blue-100 text-blue-700' 
													: 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
											}`}>
												{country.code}
											</span>
										</div>
									</button>
								))}
							</>
						) : (
							<div className="px-4 py-12 text-center">
								<svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<p className="text-gray-500 font-medium">검색 결과가 없습니다</p>
								<p className="text-gray-400 text-sm mt-1">다른 키워드로 검색해보세요</p>
							</div>
						)}
					</div>

					{/* 푸터 */}
					<div className="p-2 bg-gray-50 border-t border-gray-200 text-center">
						<p className="text-xs text-gray-500">
							총 {Object.keys(COUNTRIES).length}개 국가 • {countryList.length}개 검색됨
						</p>
					</div>
				</div>
			)}
		</div>

		{/* 지도 */}
		<div ref={mapRef} className="relative bg-white rounded-lg shadow-inner p-2">
			{/* 줌 컨트롤 버튼 */}
			<div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
				<button
					onClick={handleZoomIn}
					className="bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 p-2 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl hover:scale-105 group"
					title="줌 인 (확대)"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
					</svg>
				</button>
				<button
					onClick={handleZoomOut}
					className="bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 p-2 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl hover:scale-105 group"
					title="줌 아웃 (축소)"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
					</svg>
				</button>
				<button
					onClick={handleResetZoom}
					className="bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 p-2 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl hover:scale-105 group"
					title="초기화"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
				</button>
			</div>

			<ComposableMap
				projection="geoMercator"
				className="w-full h-auto"
				width={800}
				height={400}
			>
					<ZoomableGroup
						zoom={position.zoom}
						center={position.center}
						onMoveEnd={handleMoveEnd}
						translateExtent={[[-1000, -500], [1800, 900]]}
						maxZoom={8}
						minZoom={0.25}
					>
						<Geographies geography={geoUrl}>
							{({ geographies }) =>
								geographies.map((geo) => {
									const countryData = COUNTRIES[geo.id];
									const isSelectable = !!countryData;
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
													transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
												},
												hover: {
													fill: getCountryColor(geo, true),
													stroke: '#FFFFFF',
													strokeWidth: 1,
													outline: 'none',
													cursor: isSelectable ? 'pointer' : 'default',
												},
												pressed: {
													fill: getCountryColor(geo, true),
													stroke: '#FFFFFF',
													strokeWidth: 1,
													outline: 'none',
												},
											}}
										/>
									);
								})
							}
						</Geographies>
					</ZoomableGroup>
				</ComposableMap>

				{/* 호버된 국가 이름 표시 */}
				{hoveredCountry && COUNTRIES[hoveredCountry] && (
					<div className="absolute bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-toss-scale">
						{COUNTRIES[hoveredCountry].name} ({COUNTRIES[hoveredCountry].code})
					</div>
				)}
			</div>

			{/* 줌 레벨 슬라이더 */}
			<div className="mt-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-lg p-5 shadow-sm border border-blue-100">
				<div className="flex items-center gap-4">
					{/* 축소 아이콘 */}
					<button
						onClick={handleZoomOut}
						className="flex-shrink-0 w-8 h-8 bg-white hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 flex items-center justify-center group"
						title="줌 아웃"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
						</svg>
					</button>

					{/* 슬라이더 컨테이너 */}
					<div className="flex-1 relative">
						{/* 배율 표시 라벨들 */}
						<div className="flex justify-between mb-1 px-1">
							<span className="text-xs text-gray-400 font-medium">1/4×</span>
							<span className="text-xs text-gray-400 font-medium">1/2×</span>
							<span className="text-xs text-indigo-500 font-bold">1×</span>
							<span className="text-xs text-gray-400 font-medium">2×</span>
							<span className="text-xs text-gray-400 font-medium">4×</span>
						</div>

						{/* 슬라이더 */}
						<input
							type="range"
							min="0.25"
							max="8"
							step="0.01"
							value={position.zoom}
							onChange={(e) => {
								const newZoom = parseFloat(e.target.value);
								// 슬라이더는 즉시 반영 (딜레이 없음)
								setPosition(prev => ({ ...prev, zoom: newZoom }));
								zoomValue.set(newZoom);
							}}
							className="w-full h-3 bg-gradient-to-r from-blue-200 via-indigo-300 to-green-200 rounded-full appearance-none cursor-pointer slider-thumb"
							style={{
								background: `linear-gradient(to right, 
									#93c5fd 0%, 
									#93c5fd ${((Math.min(position.zoom, 1) - 0.25) / (1 - 0.25)) * 12.5}%, 
									#a78bfa ${((Math.min(position.zoom, 1) - 0.25) / (1 - 0.25)) * 12.5}%, 
									#a78bfa 12.5%, 
									#86efac 12.5%, 
									#86efac ${12.5 + ((Math.min(position.zoom, 8) - 1) / (8 - 1)) * 87.5}%, 
									#ddd ${12.5 + ((Math.min(position.zoom, 8) - 1) / (8 - 1)) * 87.5}%, 
									#ddd 100%)`
							}}
						/>

						{/* 주요 지점 마커 */}
						<div className="absolute top-8 left-0 right-0 flex justify-between px-1 pointer-events-none">
							<div className="w-0.5 h-2 bg-blue-300 rounded"></div>
							<div className="w-0.5 h-2 bg-gray-300 rounded"></div>
							<div className="w-1 h-3 bg-indigo-400 rounded shadow-sm"></div>
							<div className="w-0.5 h-2 bg-gray-300 rounded"></div>
							<div className="w-0.5 h-2 bg-green-300 rounded"></div>
						</div>
					</div>

					{/* 확대 아이콘 */}
					<button
						onClick={handleZoomIn}
						className="flex-shrink-0 w-8 h-8 bg-white hover:bg-green-100 text-gray-600 hover:text-green-600 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 flex items-center justify-center group"
						title="줌 인"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
						</svg>
					</button>

					{/* 리셋 버튼 */}
					<button
						onClick={handleResetZoom}
						className="flex-shrink-0 w-8 h-8 bg-white hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 flex items-center justify-center group"
						title="초기화 (1×)"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
					</button>
				</div>

				{/* 현재 줌 레벨 표시 */}
				<div className="mt-3 text-center">
					<span className="text-xs text-gray-500">
						🔍 현재 줌: <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-green-600">{position.zoom.toFixed(2)}×</span>
					</span>
				</div>
			</div>

			{/* 안내 메시지 */}
			<div className="mt-3 space-y-2">
				<div className="text-xs text-gray-500 text-center">
					💡 총 {Object.keys(COUNTRIES).length}개 국가를 지원합니다. 드롭다운으로 검색하거나 지도를 클릭하세요.
				</div>
				<div className="text-xs text-gray-400 text-center flex items-center justify-center gap-4">
					<span>🖱️ 마우스 휠로 줌</span>
					<span>👆 터치패드로 핀치 줌</span>
					<span>🔘 버튼으로 제어</span>
				</div>
			</div>
		</div>
	);
}
