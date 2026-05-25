import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './FloatingWidgets.css';

const FACEBOOK_PAGE_URL = 'https://www.facebook.com/essential.oil.pure.natural'; // Thay bằng URL fanpage thật của bạn
const FACEBOOK_PAGE_NAME = 'Essential Oil - Pure & Natural';

const QUICK_REPLIES = [
  '🌿 Tinh dầu nào tốt cho giấc ngủ?',
  '💆 Tinh dầu massage cổ vai gáy?',
  '🏠 Tinh dầu xông phòng nào thơm nhất?',
  '💰 Giá tinh dầu bao nhiêu?',
  '🚚 Phí vận chuyển như thế nào?',
];

const FloatingWidgets = () => {
  const { API_URL } = useContext(AuthContext);
  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là trợ lý AI của Essential Oil. Tôi có thể tư vấn cho bạn về tinh dầu thiên nhiên. Bạn cần hỗ trợ gì ạ?',
      time: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fanpage state
  const [fanpageOpen, setFanpageOpen] = useState(false);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [chatOpen]);

  const sendMessage = async (text) => {
    const msgText = text || inputValue.trim();
    if (!msgText || isLoading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: msgText,
      time: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build history (exclude system greeting, take last 10 msgs)
      const history = messages
        .slice(-10)
        .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content }));

      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText, history }),
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.reply || data.error || 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!',
          time: new Date(),
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: '❌ Không thể kết nối server. Vui lòng gọi hotline **0988.888.888** để được hỗ trợ!',
          time: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là trợ lý AI của Essential Oil. Bạn cần hỗ trợ gì ạ?',
      time: new Date(),
    }]);
  };

  return (
    <div className="floating-widgets">

      {/* ===== CHATBOT WIDGET ===== */}
      <div className={`chat-widget ${chatOpen ? 'open' : ''}`}>
        {/* Chat Window */}
        {chatOpen && (
          <div className="chat-window" role="dialog" aria-label="Chatbot tư vấn tinh dầu">
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-avatar">
                <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                  <path d="M50 10C50 10 30 35 30 55C30 65.5 39.5 74 50 74C60.5 74 70 65.5 70 55C70 35 50 10 50 10Z" fill="#E040FB" opacity="0.9"/>
                  <path d="M50 22C50 22 25 42 25 60C25 67 35 75 45 77C50 78 50 74 50 74C50 74 50 78 55 77C65 75 75 67 75 60C75 42 50 22 50 22Z" fill="#7E57C2" opacity="0.7"/>
                </svg>
              </div>
              <div className="chat-header-info">
                <span className="chat-header-name">Trợ lý AI Essential Oil</span>
                <span className="chat-header-status">
                  <span className="status-dot"></span> Đang hoạt động
                </span>
              </div>
              <div className="chat-header-actions">
                <button className="chat-action-btn" onClick={clearChat} title="Cuộc trò chuyện mới">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
                  </svg>
                </button>
                <button className="chat-action-btn" onClick={() => setChatOpen(false)} title="Đóng">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages" id="chat-messages-container">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-message ${msg.role}`}>
                  {msg.role === 'assistant' && (
                    <div className="msg-avatar">
                      <svg width="14" height="14" viewBox="0 0 100 100" fill="none">
                        <path d="M50 10C50 10 30 35 30 55C30 65.5 39.5 74 50 74C60.5 74 70 65.5 70 55C70 35 50 10 50 10Z" fill="#E040FB"/>
                      </svg>
                    </div>
                  )}
                  <div className="msg-content-wrap">
                    <div className="msg-bubble">
                      {msg.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                          {i < msg.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="msg-time">{formatTime(msg.time)}</span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="chat-message assistant">
                  <div className="msg-avatar">
                    <svg width="14" height="14" viewBox="0 0 100 100" fill="none">
                      <path d="M50 10C50 10 30 35 30 55C30 65.5 39.5 74 50 74C60.5 74 70 65.5 70 55C70 35 50 10 50 10Z" fill="#E040FB"/>
                    </svg>
                  </div>
                  <div className="msg-content-wrap">
                    <div className="msg-bubble typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && !isLoading && (
              <div className="quick-replies">
                {QUICK_REPLIES.map((reply, i) => (
                  <button key={i} className="quick-reply-btn" onClick={() => sendMessage(reply)}>
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="chat-input-area">
              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder="Nhập câu hỏi của bạn..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                id="chatbot-input"
                disabled={isLoading}
              />
              <button
                className={`chat-send-btn ${inputValue.trim() ? 'active' : ''}`}
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isLoading}
                title="Gửi"
                id="chatbot-send-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Chat Toggle Button */}
        <button
          className={`widget-fab chat-fab ${chatOpen ? 'active' : ''}`}
          onClick={() => { setChatOpen(!chatOpen); setFanpageOpen(false); }}
          title="Chat với AI tư vấn"
          id="chatbot-toggle-btn"
          aria-label="Mở chatbot tư vấn"
        >
          {chatOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )}
          {!chatOpen && <span className="fab-label">Tư vấn AI</span>}
          {!chatOpen && <span className="fab-notification-dot"></span>}
        </button>
      </div>

      {/* ===== FANPAGE FACEBOOK WIDGET ===== */}
      <div className={`fanpage-widget ${fanpageOpen ? 'open' : ''}`}>
        {/* Fanpage Popup */}
        {fanpageOpen && (
          <div className="fanpage-window" role="dialog" aria-label="Fanpage Facebook">
            {/* Header */}
            <div className="fanpage-header">
              <div className="fanpage-fb-logo">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div className="fanpage-header-info">
                <span className="fanpage-header-name">Essential Oil</span>
                <span className="fanpage-header-sub">Fanpage chính thức</span>
              </div>
              <button className="fanpage-close-btn" onClick={() => setFanpageOpen(false)} title="Đóng">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Page Preview */}
            <div className="fanpage-content">
              <div className="fanpage-page-card">
                <div className="fanpage-cover">
                  <div className="fanpage-cover-gradient"></div>
                  <div className="fanpage-avatar-wrap">
                    <div className="fanpage-avatar">
                      <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
                        <path d="M50 10C50 10 30 35 30 55C30 65.5 39.5 74 50 74C60.5 74 70 65.5 70 55C70 35 50 10 50 10Z" fill="#E040FB" opacity="0.9"/>
                        <path d="M50 22C50 22 25 42 25 60C25 67 35 75 45 77C50 78 50 74 50 74C50 74 50 78 55 77C65 75 75 67 75 60C75 42 50 22 50 22Z" fill="#7E57C2" opacity="0.7"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="fanpage-page-info">
                  <h3 className="fanpage-page-name">{FACEBOOK_PAGE_NAME}</h3>
                  <p className="fanpage-page-category">🌿 Cửa hàng tinh dầu thiên nhiên</p>
                  <div className="fanpage-stats">
                    <div className="fanpage-stat">
                      <span className="stat-num">2.4K</span>
                      <span className="stat-label">Người thích</span>
                    </div>
                    <div className="fanpage-stat">
                      <span className="stat-num">2.5K</span>
                      <span className="stat-label">Người theo dõi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="fanpage-actions">
                <a
                  href={FACEBOOK_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fanpage-btn fanpage-btn-primary"
                  id="fanpage-like-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3m7-10l-4 4 4 4m-4-4h12v7a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2v-7c0-1.1.9-2 2-2z"/>
                  </svg>
                  Thích trang
                </a>
                <a
                  href={`https://m.me/essential.oil.pure.natural`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fanpage-btn fanpage-btn-secondary"
                  id="fanpage-message-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.36 2 2 6.21 2 11.4c0 3.27 1.63 6.17 4.16 8.03v3.57l3.42-1.88c.91.25 1.88.38 2.88.38 5.64 0 10-4.21 10-9.4C22 6.21 17.64 2 12 2zm1.07 12.72l-2.54-2.72-4.95 2.72 5.45-5.78 2.6 2.72 4.89-2.72-5.45 5.78z"/>
                  </svg>
                  Nhắn tin
                </a>
              </div>

              {/* Divider */}
              <div className="fanpage-divider">
                <span>Hoặc theo dõi ngay</span>
              </div>

              {/* Embedded Facebook Page Plugin iframe */}
              <div className="fanpage-embed-wrap">
                <iframe
                  src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FACEBOOK_PAGE_URL)}&tabs=timeline&width=280&height=200&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
                  width="280"
                  height="200"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Facebook Fanpage Essential Oil"
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* Fanpage Toggle Button */}
        <button
          className={`widget-fab fanpage-fab ${fanpageOpen ? 'active' : ''}`}
          onClick={() => { setFanpageOpen(!fanpageOpen); setChatOpen(false); }}
          title="Fanpage Facebook"
          id="fanpage-toggle-btn"
          aria-label="Xem fanpage Facebook"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          {!fanpageOpen && <span className="fab-label">Fanpage</span>}
        </button>
      </div>
    </div>
  );
};

export default FloatingWidgets;
