import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Dashboard from '../components/Dashboard';
import Features from '../components/Features';
import Education from '../components/Education';
import Community from '../components/Community';
import ChatBot from '../components/ChatBot';

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <About />
      <Dashboard />
      <Features />
      <Education />
      <Community />
      <ChatBot />
    </div>
  );
};

export default Home;