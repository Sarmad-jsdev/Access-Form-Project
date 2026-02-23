import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar';
import Footer from './Components/footer';
import Home from './pages/home';
import Aboutus from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Settings from './pages/settings';
import ScrollToTop from './Components/ScrollToTop';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      {/* Navbar yahan Routes se bahar hai, isliye har page par dikhega */}
      <Navbar />

        {/* ScrollToTop component har route change par scroll ko top par le jaayega */}
      <ScrollToTop />
      
      <Routes>
        {/* Yahan aap apne routes define kar sakte hain */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Dashboard" element={<Dashboard isLoggedIn={isLoggedIn} />} />
      </Routes>
      
      <Footer />
      
    </BrowserRouter>
  );
}

export default App;