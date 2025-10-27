import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Information</h3>
          <p><i className="fas fa-phone"></i> WhatsApp: +27 12 358 7911</p>
          <p><i className="fas fa-envelope"></i> Email: aquabalance@tshwane.gov.za</p>
          <p><i className="fas fa-map-marker-alt"></i> Municipal Office: CNR WF Nkomo & Steve Biko, Tshwane</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="facebook"><i className="fab fa-facebook"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="twitter"><i className="fab fa-twitter"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="instagram"><i className="fab fa-instagram"></i></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="youtube"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <p><Link to="/signup">Register Your Car Wash</Link></p>
          <p><Link to="/login">Sign In</Link></p>
          <p><Link to="/admin/login">Admin</Link></p>
          <p><a href="/compliance">Compliance Guidelines</a></p>
          <p><a href="/support">Apply for Incentives</a></p>
          <p><a href="/tips">Water Efficiency Tips</a></p>
        </div>
        <div className="footer-section">
          <h3>Legal & Privacy</h3>
          <p><a href="/privacy">Privacy Policy</a></p>
          <p><a href="/terms">Terms of Service</a></p>
          <p><a href="/bylaw">Township Economy By-law</a></p>
          <p><a href="/regulations">Water Use Regulations</a></p>
        </div>
        <div className="footer-section">
          <h3>Department Partners</h3>
          <p>City of Tshwane</p>
          <p>Department of Water and Sanitation</p>
          <p>Environmental Health Services</p>
          <p>Township Economy Development</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 City of Tshwane. All rights reserved. | Aqua Balance Tshwane - Water Conservation Initiative</p>
      </div>
    </footer>
  );
};

export default Footer;