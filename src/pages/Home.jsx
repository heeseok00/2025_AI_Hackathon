import React, { useEffect, useState } from 'react';
import CountrySelector from '../components/CountrySelector.jsx';
import NewsCard from '../components/NewsCard.jsx';
import TrendMap from '../components/TrendMap.jsx';
import { fetchNews } from '../api/newsAPI.js';

export default function Home() {
	const [country, setCountry] = useState('US');
	const [articles, setArticles] = useState([]);

	useEffect(() => {
		(async () => {
			const results = await fetchNews({ countryCode: country });
			setArticles(results);
		})();
	}, [country]);

	return (
		<div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
			<header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h1 style={{ margin: 0 }}>JuSeek</h1>
				<CountrySelector value={country} onChange={setCountry} />
			</header>
			<main style={{ marginTop: 24 }}>
				<TrendMap data={articles} />
				<div style={{ marginTop: 16 }}>
					{articles.length === 0 ? (
						<div style={{ color: '#6b7280' }}>No articles yet.</div>
					) : (
						articles.map((a, idx) => (
							<NewsCard key={idx} title={a.title} description={a.description} source={a.source} url={a.url} />
						))
					)}
				</div>
			</main>
		</div>
	);
}
