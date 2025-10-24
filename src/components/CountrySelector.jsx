import React from 'react';

const DEFAULT_COUNTRIES = [
	{ code: 'US', name: 'United States' },
	{ code: 'KR', name: 'South Korea' },
	{ code: 'JP', name: 'Japan' },
	{ code: 'GB', name: 'United Kingdom' },
	{ code: 'DE', name: 'Germany' }
];

export default function CountrySelector({ value, onChange, countries = DEFAULT_COUNTRIES }) {
	return (
		<select value={value} onChange={(e) => onChange?.(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
			{countries.map((c) => (
				<option key={c.code} value={c.code}>{c.name}</option>
			))}
		</select>
	);
}
