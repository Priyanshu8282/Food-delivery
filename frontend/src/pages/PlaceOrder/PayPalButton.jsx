import React, { useEffect } from 'react';

const PayPalButton = ({ createOrder, onApprove }) => {
  useEffect(() => {
    const loadPayPalScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=AQlVzROHzICRTEPw1enLYncpxx0F_dsK6HzdbyvDgwPYozR42geonQxsmyZyiFluuq3kpvW3wxYKEWCt';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const initializePayPalButtons = async () => {
      try {
        await loadPayPalScript();
        window.paypal.Buttons({
          createOrder: async (data, actions) => {
            const orderID = await createOrder();
            return orderID;
          },
          onApprove: async (data, actions) => {
            await onApprove(data.orderID);
          },
        }).render('#paypal-button-container');
      } catch (error) {
        console.error('Failed to load PayPal SDK:', error);
      }
    };

    initializePayPalButtons();
  }, [createOrder, onApprove]);

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;