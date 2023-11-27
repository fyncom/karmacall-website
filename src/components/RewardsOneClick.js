import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from '@reach/router';
import { GiftCardSentToEmail, GiftCardNotEnoughBalance, GiftCardTxIdNotFound } from './Modal';


const RewardsOneClick = () => {
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isFailureModalOpen, setFailureModalOpen] = useState(false);
  const [isLowBalanceModalOpen, setLowBalanceModalOpen] = useState(false);
  const [result, setResult] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const processReward = useCallback(async (txId, value, type) => {
    try {
      const url = `${process.env.GATSBY_API_URL}app/rewards/gcow/easy`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ campaignRewardTxId: txId, productName: type, value: value }),
      });

      // might need to be remvoed
      if (response.status === 400) {
        setFailureModalOpen(true);
      } else if (response.status === 422) {
        setLowBalanceModalOpen(true);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuccessModalOpen(true);
      console.log("Data received:", data);
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      setFailureModalOpen(true);
      throw error;
    }
  }, []); // Empty dependencies array ensures creation only once

  useEffect(() => {
    const txId = queryParams.get('txId');
    const value = queryParams.get('value');
    const type = queryParams.get('type');
    if (txId && !result) {
      // Process the reward only if result is not already set
      processReward(txId, value, type)
        .then(data => {
          setResult(data);
          setSuccessModalOpen(true);
        })
        .catch(error => {
          console.error('ERROR', error);
          setFailureModalOpen(true); // Assuming error indicates failure
        });
    }
  }, [queryParams, processReward, result]); // Include dependencies that, when changed, should re-run this effect


  const handleCloseModal = () => {
    setSuccessModalOpen(false);
    setFailureModalOpen(false);
    setLowBalanceModalOpen(false);
  };

  return (
    <>
      <GiftCardSentToEmail
        isOpen={isSuccessModalOpen}
        organizationName={result?.organizationName}
        onClose={handleCloseModal}
        urlRedirect={result?.preferences?.urlRedirect}
      />
      <GiftCardTxIdNotFound
        isOpen={isFailureModalOpen}
        onClose={handleCloseModal}
      />
      <GiftCardNotEnoughBalance
        isOpen={isLowBalanceModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default RewardsOneClick;
