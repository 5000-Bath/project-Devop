import React from 'react';
import './Contact.css';
import contactImage from '../assets/contactkong.jpg';

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
      </div>
      <div className="contact-body">
        <div className="carousel">
          <div className="carousel-arrow">&#8249;</div>
          <img src={contactImage} alt="Kongphop" className="contact-image" />
          <div className="carousel-arrow">&#8250;</div>
        </div>
        <div className="contact-info">
          <p>KONGPHOP</p>
          <p className="nickname">"THE PSYCHO"</p>
          <p>KAOCHOT</p>
        </div>
      </div>
    </div>
  );
}