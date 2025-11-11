"use client"
import React, { useState, useEffect } from 'react';
import Hero from '@/component/Sector-Component/Hero';
import Project from '@/component/Sector-Component/Project';
import CallToAction from '@/component/home-component/CallToAction';


const RawasySectorsPage = () => {
 
  const [hoveredCapability, setHoveredCapability] = useState(null);

  

  

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      <Project />

      {/* Call to Action */}
      <CallToAction />

     
    </div>
  );
};

export default RawasySectorsPage;