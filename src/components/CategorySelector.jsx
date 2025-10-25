import React from 'react';

const DEFAULT_CATEGORIES = [
	{ code: null, name: '전체' },
	{ code: 'business', name: '비즈니스' },
	{ code: 'entertainment', name: '엔터테인먼트' },
	{ code: 'general', name: '일반' },
	{ code: 'health', name: '건강' },
	{ code: 'science', name: '과학' },
	{ code: 'sports', name: '스포츠' },
	{ code: 'technology', name: '기술' }
];

export default function CategorySelector({ value, onChange, categories = DEFAULT_CATEGORIES }) {
	return (
		<select value={value || ''} onChange={(e) => onChange?.(e.target.value || null)} style={{ padding: 8, borderRadius: 6 }}>
			{categories.map((c) => (
				<option key={c.code || 'all'} value={c.code || ''}>{c.name}</option>
			))}
		</select>
	);
}