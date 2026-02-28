import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar';
import Footer from './Components/footer';
import Home from './pages/Home';
import Aboutus from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Settings from './pages/settings';
import ScrollToTop from './Components/ScrollToTop';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {

  return (
    <BrowserRouter>

    <AuthProvider>
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
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Dashboard" element={  <ProtectedRoute> <Dashboard /></ProtectedRoute >} />
        <Route path="/AdminDashboard" element={  <ProtectedRoute> <AdminDashboard /></ProtectedRoute >} />
      </Routes>
      
      <Footer />

      </AuthProvider>
      
    </BrowserRouter>
  );
}

export default App;