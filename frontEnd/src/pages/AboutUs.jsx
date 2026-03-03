import React from "react";
import Hero from "../Components/Hero1";
import CoreValues from "../Components/CoreValues";
import Stats from "../Components/Stats";
import Ourjourney from "../Components/Ourjourney";
import CTA from "../Components/CTA";

const Aboutus = () => {
  return (
    <>
        {/* Hero Section */}
      <Hero />
        {/* Stats Section */}
      <Stats />
      
        {/* Core Values Section */}
      <CoreValues />

        {/* Our Journey & Testing Section */}
      <Ourjourney />

        {/* Final CTA Section */}
        <CTA />
    </>
  );
};

export default Aboutus;
