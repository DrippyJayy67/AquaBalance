import React, { useState, useEffect } from 'react';

const ChatBot = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    // Remove pulse animation after 10 seconds
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const openModal = () => {
    setIsPulsing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const services = [
    { icon: 'fas fa-user-plus', text: 'Car wash registration and licensing' },
    { icon: 'fas fa-tint', text: 'Water efficiency tips and best practices' },
    { icon: 'fas fa-clipboard-check', text: 'Compliance guidelines and requirements' },
    { icon: 'fas fa-money-bill-wave', text: 'Incentive and grant applications' },
    { icon: 'fas fa-graduation-cap', text: 'Training and certification programs' },
    { icon: 'fas fa-chart-line', text: 'Performance monitoring and reporting' }
  ];

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
        <div 
          className="modal-overlay"
          onClick={handleOverlayClick}
        >
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              <i className="fas fa-robot"></i> Aqua Balance Assistant
            </h2>
            <button className="close-btn" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="development-notice">
              <i className="fas fa-tools"></i>
              <p><strong>Under Development:</strong> Our AI chatbot is currently being developed. Meanwhile, reach out through the contact options below!</p>
            </div>

            <div className="contact-section">
              <h3><i className="fas fa-headset"></i> Get Immediate Support</h3>
              
              <div className="contact-item">
                <i className="fab fa-whatsapp"></i>
                <div>
                  <strong>WhatsApp Support</strong><br />
                  <a href="https://wa.me/27123587911" target="_blank" rel="noopener noreferrer">+27 12 358 7911</a>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <strong>Email Support</strong><br />
                  <a href="mailto:aquabalance@tshwane.gov.za">aquabalance@tshwane.gov.za</a>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Visit Our Office</strong><br />
                  CNR WF Nkomo & Steve Biko, Tshwane
                </div>
              </div>
            </div>

            <div className="services-list">
              <h4><i className="fas fa-cogs"></i> How We Can Help You</h4>
              <ul>
                {services.map((service, index) => (
                  <li key={index}>
                    <i className={service.icon}></i>
                    {service.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;