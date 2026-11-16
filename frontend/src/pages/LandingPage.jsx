import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroMotorcycle from '../components/HeroMotorcycle';
import BentoGrid from '../components/BentoGrid';
import ServiceCentersSection from '../components/ServiceCentersSection';
import Footer from '../components/Footer';
import { LoginModal, SignUpModal, OtpModal } from '../components/AuthModals';
import RequestModal from '../components/RequestModal';

const LandingPage = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestType, setRequestType] = useState('fuel_order');
  const [selectedFuel, setSelectedFuel] = useState('Octane');

  const handleOpenSos = () => {
    setRequestType('emergency_rescue');
    setIsRequestModalOpen(true);
  };

  const handleOpenFuelOrder = (fuelName = 'Octane') => {
    setRequestType('fuel_order');
    setSelectedFuel(fuelName);
    setIsRequestModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-300">
      {/* Sticky Glassmorphic Navbar */}
      <Navbar />

      {/* Main Public Content */}
      <main className="flex-1">
        {/* 1. Hero Section with High-Speed Motorcycle Animation */}
        <HeroMotorcycle
          onOpenSos={handleOpenSos}
          onOpenFuelOrder={handleOpenFuelOrder}
        />

        {/* 2. Bento Grid Live Hub (Fuel Prices, Open-Meteo Weather, Emergency Helplines, Admin Alerts) */}
        <BentoGrid onSelectFuel={handleOpenFuelOrder} />

        {/* 3. Physical Ashulia & Dhaka Rescue Hubs */}
        <ServiceCentersSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication Modals */}
      <LoginModal />
      <SignUpModal />
      <OtpModal />

      {/* Dispatch / Order Modal */}
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        initialType={requestType}
        initialFuel={selectedFuel}
      />
    </div>
  );
};

export default LandingPage;
