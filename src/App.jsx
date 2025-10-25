import React from 'react';
import Home from './pages/Home.jsx';
import Chatbot from './components/Chatbot.jsx';
import { BookmarkProvider } from './contexts/BookmarkContext.jsx';

export default function App() {
	return (
		<BookmarkProvider>
			<Home />
			<Chatbot />
		</BookmarkProvider>
	);
}
