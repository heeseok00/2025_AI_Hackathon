import React, { useState, useEffect, useRef } from 'react';

export default function Chatbot() {
	const [isOpen, setIsOpen] = useState(false);
	
	// 초기 인사 메시지
	const initialMessage = {
		role: 'assistant',
		content: '안녕하세요! 👋\nGlobaLink 챗봇입니다.\n무엇을 도와드릴까요?',
		timestamp: new Date()
	};
	
	const [messages, setMessages] = useState([initialMessage]);
	const [inputMessage, setInputMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);

	// 메시지 목록 자동 스크롤
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// 챗봇 열릴 때 input에 포커스
	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	const sendMessage = async () => {
		if (!inputMessage.trim() || isLoading) return;

		const userMessage = inputMessage.trim();
		setInputMessage('');
		setIsLoading(true);

		// 사용자 메시지 추가
		const newUserMessage = {
			role: 'user',
			content: userMessage,
			timestamp: new Date()
		};
		setMessages(prev => [...prev, newUserMessage]);

		try {
			// 대화 히스토리 준비 (최근 10개 메시지만)
			const history = messages.slice(-10).map(msg => ({
				role: msg.role,
				content: msg.content
			}));

			// 백엔드 API 호출
			const response = await fetch('http://localhost:5000/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: userMessage,
					history: history
				})
			});

			const data = await response.json();

			if (data.success && data.reply) {
				// 챗봇 응답 추가
				const botMessage = {
					role: 'assistant',
					content: data.reply,
					timestamp: new Date()
				};
				setMessages(prev => [...prev, botMessage]);
			} else {
				throw new Error(data.error || '응답을 받지 못했습니다');
			}
		} catch (error) {
			console.error('챗봇 오류:', error);
			const errorMessage = {
				role: 'assistant',
				content: '죄송해요, 일시적인 오류가 발생했어요. 😅\n잠시 후 다시 시도해주세요!',
				timestamp: new Date()
			};
			setMessages(prev => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const quickQuestions = [
		'사이트 사용법 알려줘',
		'뉴스는 어떻게 보나요?',
		'번역 기능이 있나요?',
		'호재/악재는 뭔가요?'
	];

	const handleQuickQuestion = (question) => {
		setInputMessage(question);
		inputRef.current?.focus();
	};

	// 대화 초기화
	const handleResetChat = () => {
		if (confirm('대화 내역을 모두 삭제하시겠습니까?')) {
			setMessages([{
				role: 'assistant',
				content: '안녕하세요! 👋\nGlobaLink 챗봇입니다.\n무엇을 도와드릴까요?',
				timestamp: new Date()
			}]);
			setInputMessage('');
		}
	};

	return (
		<div className="fixed bottom-6 right-6 z-50">
			{/* 챗봇 윈도우 */}
			{isOpen && (
				<div className="mb-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-toss-scale border-2 border-blue-100">
					{/* 헤더 */}
					<div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="relative">
								<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl animate-bounce">
									🤖
								</div>
								<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
							</div>
							<div>
								<h3 className="font-bold text-lg">GlobaLink 챗봇</h3>
								<p className="text-xs text-blue-100">무엇이든 물어보세요!</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							{/* 대화 초기화 버튼 */}
							<button
								onClick={handleResetChat}
								className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200 group"
								title="대화 초기화"
							>
								<svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
								</svg>
							</button>
							{/* 닫기 버튼 */}
							<button
								onClick={() => setIsOpen(false)}
								className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200"
								title="닫기"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>

					{/* 메시지 영역 */}
					<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-white">
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-toss-slide`}
							>
								<div
									className={`max-w-[80%] rounded-2xl px-4 py-3 ${
										msg.role === 'user'
											? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none'
											: 'bg-white text-gray-800 shadow-md rounded-bl-none border border-gray-100'
									}`}
								>
									<p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
									<p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
										{msg.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
									</p>
								</div>
							</div>
						))}

						{/* 로딩 중 */}
						{isLoading && (
							<div className="flex justify-start animate-toss-slide">
								<div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-md border border-gray-100">
									<div className="flex gap-1">
										<div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
										<div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
										<div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
									</div>
								</div>
							</div>
						)}

						<div ref={messagesEndRef} />
					</div>

					{/* 빠른 질문 (메시지가 적을 때만 표시) */}
					{messages.length <= 2 && !isLoading && (
						<div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
							<p className="text-xs text-gray-500 mb-2 font-medium">💡 이런 걸 물어보세요:</p>
							<div className="flex flex-wrap gap-2">
								{quickQuestions.map((question, index) => (
									<button
										key={index}
										onClick={() => handleQuickQuestion(question)}
										className="text-xs bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 transition-all duration-200"
									>
										{question}
									</button>
								))}
							</div>
						</div>
					)}

					{/* 입력 영역 */}
					<div className="p-4 border-t border-gray-200 bg-white">
						<div className="flex gap-2">
							<input
								ref={inputRef}
								type="text"
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="메시지를 입력하세요..."
								disabled={isLoading}
								className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200"
							/>
							<button
								onClick={sendMessage}
								disabled={!inputMessage.trim() || isLoading}
								className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:shadow-lg flex items-center justify-center"
							>
								{isLoading ? (
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								) : (
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 플로팅 버튼 */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all duration-300 hover:scale-110 ${
					isOpen
						? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
						: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 animate-pulse'
				}`}
				title={isOpen ? '챗봇 닫기' : '챗봇 열기'}
			>
				{isOpen ? '✕' : '💬'}
			</button>

			{/* 알림 뱃지 (처음 방문 시) */}
			{!isOpen && messages.length === 1 && (
				<div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
					1
				</div>
			)}
		</div>
	);
}

