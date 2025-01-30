'use client';

import React, { useState, useEffect } from 'react';
import CdpDetails from '../details/CdpDetails';

const CdpDetailsPage = ({ params }: { params: { cdpId: number } }) => {
  const [cdpId, setCdpId] = useState<number>(0);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setCdpId(resolvedParams.cdpId);
    };
    unwrapParams();
  }, [params]);

  return <CdpDetails cdpId={cdpId} />;
};

export default CdpDetailsPage;
