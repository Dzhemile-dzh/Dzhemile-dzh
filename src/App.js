import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { LanguageProvider } from './contexts/LanguageContext';
import { initInteractiveFeatures } from './utils/interactive';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopOnRouteChange from './components/ScrollToTopOnRouteChange';
import NewsletterPrompt from './components/NewsletterPrompt';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import PaintingDetail from './pages/PaintingDetail';
import Prints from './pages/Prints';
import PrintDetail from './pages/PrintDetail';
import Shipping from './pages/Shipping';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    initInteractiveFeatures();

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1100);

    const doneTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (isLoading) {
    return (
      <div
        className={`loading-screen${isExiting ? ' loading-screen--exit' : ''}`}
        role="status"
        aria-live="polite"
        aria-label="Loading Doarti"
      >
        <div className="loading-screen__glow" aria-hidden="true" />
        <div className="loading-screen__content">
          <div className="loading-screen__mark">
            <img
              src="/images/logo-doarti.png"
              alt=""
              className="loading-screen__logo"
              width="72"
              height="72"
            />
            <p className="loading-screen__brand">DOARTi</p>
          </div>
          <div className="loading-screen__bar" aria-hidden="true">
            <span className="loading-screen__bar-fill" />
          </div>
          <p className="loading-screen__label">Loading the atelier</p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="App">
          <ScrollToTopOnRouteChange />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery/:year" element={<Gallery />} />
              <Route path="/painting/:year/:slug" element={<PaintingDetail />} />
              <Route path="/prints" element={<Prints />} />
              <Route path="/prints/:slug" element={<PrintDetail />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            </Routes>
          </main>
          <Footer />
          <NewsletterPrompt />
          <ScrollToTop />
          <Analytics />
          <SpeedInsights />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
