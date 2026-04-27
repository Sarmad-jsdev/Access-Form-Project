import React from 'react'
import Navbar from './Navbar'
import Footer from './footer'

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

export default PublicLayout