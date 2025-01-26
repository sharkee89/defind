'use client';

import React from 'react';
import CdpListPage from './CdpListPage';
import '../public/style.css';

const Index = () => {
  return (
    <div className="App">
      <div className="background_overlay"></div>
      <CdpListPage />
    </div>
  );
};

export default Index;
