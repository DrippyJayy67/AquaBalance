import React, { useEffect } from 'react';

const ParallaxBackground = () => {
  useEffect(() => {
    const handleParallaxScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxBg = document.getElementById('parallax-bg');
      const windowHeight = window.innerHeight;
      
      if (!parallaxBg) return;
      
      // Calculate parallax transform based on scroll position
      const speed = 0.3;
      const yPos = -(scrolled * speed);
      
      // Apply different transformations based on scroll position to reveal different parts of the logo
      if (scrolled < windowHeight) {
        // Hero section - show center of logo with slight zoom
        parallaxBg.style.transform = `translateY(${yPos}px) scale(1.2)`;
        parallaxBg.style.backgroundPosition = 'center center';
        parallaxBg.style.opacity = '0.4';
      } else if (scrolled < windowHeight * 2) {
        // Dashboard section - show upper part of logo, zoom out slightly
        parallaxBg.style.transform = `translateY(${yPos}px) scale(1.1)`;
        parallaxBg.style.backgroundPosition = 'center 30%';
        parallaxBg.style.opacity = '0.3';
      } else if (scrolled < windowHeight * 3) {
        // Features section - show left side of logo
        parallaxBg.style.transform = `translateY(${yPos}px) scale(1.3)`;
        parallaxBg.style.backgroundPosition = '20% center';
        parallaxBg.style.opacity = '0.25';
      } else if (scrolled < windowHeight * 4) {
        // Education section - show right side of logo with rotation effect
        parallaxBg.style.transform = `translateY(${yPos}px) scale(1.15) rotate(2deg)`;
        parallaxBg.style.backgroundPosition = '80% center';
        parallaxBg.style.opacity = '0.35';
      } else {
        // Community section - show lower part of logo, zoom out
        parallaxBg.style.transform = `translateY(${yPos}px) scale(0.9)`;
        parallaxBg.style.backgroundPosition = 'center 70%';
        parallaxBg.style.opacity = '0.2';
      }
    };

    // Optimized scroll handler
    let ticking = false;
    const updateParallax = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleParallaxScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', updateParallax);
    
    // Initialize parallax on component mount
    handleParallaxScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', updateParallax);
    };
  }, []);

  return (
    <div className="parallax-container">
      <div className="parallax-layer" id="parallax-bg"></div>
    </div>
  );
};

export default ParallaxBackground;