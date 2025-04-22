import React from 'react';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Process from '@/components/home/Process';
import UserBenefits from '@/components/home/UserBenefits';
import CTA from '@/components/home/CTA';
import Footer from '@/components/home/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <Process />
      <UserBenefits />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;