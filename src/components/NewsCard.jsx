import React from 'react';

export default function NewsCard({ title, description, source, url }) {
	return (
		<article style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 12 }}>
			<h3 style={{ margin: 0, fontSize: 18 }}>{title || 'Untitled'}</h3>
			<p style={{ marginTop: 8, color: '#374151' }}>{description || 'No description available.'}</p>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#6b7280' }}>
				<span>{source || 'Unknown source'}</span>
				{url ? (
					<a href={url} target="_blank" rel="noreferrer">Read more</a>
				) : null}
			</div>
		</article>
	);
}
