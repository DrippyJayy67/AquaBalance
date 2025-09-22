import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import ParallaxBackground from './components/ParallaxBackground';
import './styles/App.css';

// Component to handle scroll to section on navigation
const ScrollToSection = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, [location]);

  return null;
};

// Layout component for pages with header and footer
const Layout = ({ children, showParallax = true }) => {
  return (
    <>
      {showParallax && <ParallaxBackground />}
      <Header />
      <main>{children}</main>
      <Footer />
      <ChatBot />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToSection />
        <Routes>
          {/* Home page with parallax background */}
          <Route 
            path="/" 
            element={
              <Layout showParallax={true}>
                <Home />
              </Layout>
            } 
          />
          
          {/* Authentication pages without parallax */}
          <Route 
            path="/login" 
            element={
              <Layout showParallax={false}>
                <Login />
              </Layout>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <Layout showParallax={false}>
                <Signup />
              </Layout>
            } 
          />
          
          {/* Dashboard page (minimal layout) */}
          <Route 
            path="/dashboard" 
            element={<Dashboard />} 
          />
          
          {/* Dashboard sections with hash routing */}
          <Route 
            path="/dashboard/:section" 
            element={<Dashboard />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;