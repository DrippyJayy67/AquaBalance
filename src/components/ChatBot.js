import React, { useState, useEffect, useRef } from 'react';
import adminApi from '../api/adminApi';

// Very small on-device assistant: uses a tiny knowledge-base assembled from the app
// (announcements and a few static FAQs). It's not a full LLM but provides
// helpful answers derived from site content.
const ChatBot = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const [announcements, setAnnouncements] = useState([]);

  // chat messages: { from: 'user'|'bot', text }
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // fetch announcements to include in knowledge base
    let mounted = true;
    adminApi.fetchAnnouncements().then(list => { if (mounted) setAnnouncements(list || []); }).catch(() => {});
    // Remove pulse animation after 10 seconds
    const timer = setTimeout(() => setIsPulsing(false), 10000);
    return () => { mounted = false; clearTimeout(timer); };
  }, []);

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [isModalOpen]);

  useEffect(() => {
    // auto-scroll chat
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, thinking]);

  const openModal = () => { setIsPulsing(false); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  // simple KB: announcements + static help texts
  const buildKB = () => {
    const kb = [];
    // static entries
    kb.push({ id: 'reg', text: 'To register a car wash, go to the Signup page and complete the registration form.' });
    kb.push({ id: 'contact', text: 'For immediate support contact WhatsApp +27 12 358 7911 or email aquabalance@tshwane.gov.za.' });
    kb.push({ id: 'watertips', text: 'Water efficiency tips: use closed-loop rinse systems, recycle water where possible, and train staff to reduce wastage.' });
    kb.push({ id: 'payments', text: 'Financial reports and levies information are available in the Admin Dashboard under Financial Reports.' });
    // announcements
    announcements.forEach(a => kb.push({ id: `ann-${a.id}`, text: `${a.title}: ${a.desc}` }));
    return kb;
  };

  // primitive answerer: keyword matching then fuzzy sentence search
  const answerQuestion = async (q) => {
    const txt = (q || '').toLowerCase();
    if (!txt.trim()) return "Please ask a question about the site, for example: 'How do I register?' or 'Any workshops coming up?'";

    // keywords
    if (txt.includes('register') || txt.includes('signup')) return 'To register a car wash, open the Register page from the main menu and complete the form. If you need help, contact support via WhatsApp or email.';
    if (txt.includes('contact') || txt.includes('support')) return 'You can reach support via WhatsApp at +27 12 358 7911 or email aquabalance@tshwane.gov.za.';
    if (txt.includes('water') && (txt.includes('tip') || txt.includes('save') || txt.includes('efficiency'))) return 'Water saving tips: use efficient nozzles, capture and reuse rinse water, and maintain equipment to prevent leaks.';
    if (txt.includes('announcement') || txt.includes('notification') || txt.includes('workshop') || txt.includes('meeting')) {
      // return top matching announcement or a summary
      if (!announcements.length) return 'There are currently no announcements.';
      const matches = announcements.filter(a => `${a.title} ${a.desc}`.toLowerCase().includes(txt));
      if (matches.length) return matches.map(m => `${m.title}: ${m.desc}`).join('\n\n');
      // fallback: list recent
      return announcements.slice(0,5).map(a => `${a.title}: ${a.desc}`).join('\n\n');
    }

    // fallback: search KB for sentences containing tokens
    const kb = buildKB();
    const tokens = txt.split(/\s+/).filter(Boolean);
    let best = null;
    let bestScore = 0;
    for (const entry of kb) {
      const entryText = entry.text.toLowerCase();
      let score = 0;
      for (const t of tokens) if (entryText.includes(t)) score += 1;
      if (score > bestScore) { bestScore = score; best = entry; }
    }
    if (bestScore > 0 && best) return best.text;

    return "Sorry, I couldn't find a direct answer in the site content. Please try rephrasing or ask about registration, water saving, contact or announcements.";
  };

  const sendMessage = async (text) => {
    const userMsg = { from: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setThinking(true);
    // simulate processing delay
    setTimeout(async () => {
      const reply = await answerQuestion(text);
      setMessages(prev => [...prev, { from: 'bot', text: reply }]);
      setThinking(false);
    }, 600);
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
  };

  const clearChat = () => { setMessages([]); setInput(''); };

  return (
    <>
      {/* Chatbot Container */}
      <div className="chatbot-container">
        <button 
          className={`chatbot-toggle ${isPulsing ? 'pulse' : ''}`}
          onClick={openModal}
          title="Chat with Aqua Balance Assistant"
        >
          <i className="fas fa-comments"></i>
        </button>
      </div>

      {/* Chatbot Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal-content" style={{ maxWidth: 720 }}>
            <div className="modal-header">
              <h2 className="modal-title"><i className="fas fa-robot"></i> Aqua Balance Assistant</h2>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="btn-secondary" onClick={clearChat}>Clear</button>
                <button className="close-btn" onClick={closeModal}><i className="fas fa-times"></i></button>
              </div>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 14, color: '#333' }}>Ask me about registration, water saving tips, announcements, or how to use this site.</div>

              <div ref={scrollRef} style={{ maxHeight: 340, overflowY: 'auto', background: '#fff', padding: 8, borderRadius: 6, border: '1px solid #eee' }}>
                {messages.length === 0 && <div style={{ opacity: 0.8 }}>No messages yet — ask me anything about the site.</div>}
                {messages.map((m, i) => (
                  <div key={i} style={{ marginBottom: 8, display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '80%', background: m.from === 'user' ? '#e6f7ff' : '#f3f4f6', padding: 8, borderRadius: 6 }}>
                      <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{m.text}</div>
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div style={{ marginTop: 6 }}><em>Thinking...</em></div>
                )}
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your question... e.g. 'Are there any workshops?'" style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }} />
                <button className="btn-primary" type="submit">Send</button>
              </form>

              <div style={{ fontSize: 12, color: '#666' }}>
                If your question requires human support, use the contact options in this modal.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;