import React from 'react';

export default function TrendMap({ data = [] }) {
	return (
		<div style={{ padding: 16, border: '1px dashed #d1d5db', borderRadius: 8 }}>
			<div style={{ fontWeight: 600, marginBottom: 8 }}>Trend Map (placeholder)</div>
			<pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}
