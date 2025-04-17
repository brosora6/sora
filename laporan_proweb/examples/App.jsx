// src/App.jsx
import { useRef, useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Transition from './components/anim/Transistion';
import About from './Pages/About';
import Feed from './Pages/Feed';
import Hero from './components/Hero';
import Project7Showcase from './components/Project7Showcase';
import Apparel from './components/Apparel';
import Process from './components/Process';
import Motorcyclopedia from './components/Motorcyclopedia';
import Footer from './components/Footer';
import Cart from './Pages/Cart';
import Payment from './Pages/Payment';
import { CartProvider } from './components/CartContext';
import gsap from 'gsap';

function App() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef(null);
  const loadingTextRef = useRef(null);
  const percentageRef = useRef(null);
  const mainContentRef = useRef(null);

  useEffect(() => {
    // Only run landing animation when directly visiting the home page
    if (window.location.pathname !== '/') {
      setIsInitialLoad(false);
      setIsLoading(false);
      return;
    }

    const tl = gsap.timeline();

    // Loading animation
    tl.to(percentageRef.current, {
      innerText: "100",
      duration: 3,
      snap: { innerText: 1 },
      ease: "none",
      onUpdate: function() {
        percentageRef.current.innerHTML = `[${Math.floor(this.progress() * 100)}%]`;
      }
    })
    .to(loaderRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        loaderRef.current.style.display = "none";
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    });

    return () => tl.kill();
  }, []);

  // Regular HomePage without transitions
  const HomePageContent = () => (
    <div className="relative min-h-screen">
      <Hero />
      <Project7Showcase />
      <Apparel />
      <Process />
      <Motorcyclopedia />
    </div>
  );

  // HomePage with landing animation
  const HomePage = () => (
    <>
      {isInitialLoad && (
        <div 
          ref={loaderRef}
          className="fixed inset-0 bg-black z-[60] flex flex-col items-center justify-center"
        >
          <div className="flex flex-col items-center gap-4">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo1-iDUuZx8q74HbuOfQjIPSDQbSD16WAg.png"
              alt="Solace Motorcycle Logo"
              className="w-24 h-24 mb-4"
            />
            <h1 className="text-4xl font-bold text-white mb-2">SOLACE MOTORCYCLE</h1>
            <div className="flex items-center gap-2">
              <span ref={loadingTextRef} className="text-white font-mono">LOADING</span>
              <span ref={percentageRef} className="text-white font-mono">[0%]</span>
            </div>
          </div>
        </div>
      )}
      <HomePageContent />
    </>
  );

  // Only apply Transition when not showing landing animation
  const TransitionedHome = isInitialLoad ? HomePage : Transition(HomePage);
  const TransitionedAbout = Transition(About);
  const TransitionedFeed = Transition(Feed);
  const TransitionedCart = Transition(Cart);
  const TransitionedPayment = Transition(Payment);

  const AnimatedRoutes = () => {
    const location = useLocation();
    
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<TransitionedHome />} />
          <Route path="/about" element={<TransitionedAbout />} />
          <Route path='/feed' element={<TransitionedFeed />} />
          <Route path="/cart" element={<TransitionedCart />} />
          <Route path="/payment" element={<TransitionedPayment />} />
        </Routes>
      </AnimatePresence>
    );
  };

  return (
    <CartProvider>
      <Router>
        <div className="relative min-h-screen bg-[#121212] text-white">
          <div className={`${isInitialLoad ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
            <Navbar />
          </div>
          <AnimatedRoutes />
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}


export default App;