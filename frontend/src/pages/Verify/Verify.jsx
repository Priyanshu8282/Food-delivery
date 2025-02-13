import React, { useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

function Verify() {
    const [searchParams] = useSearchParams();
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        try {
            const response = await axios.get(url+"/api/order/verify", {
                params: { success, orderId }
            });

            if (response.data.success) {
                navigate('/myorders');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Verification failed:", error);
            navigate('/');
        }
    };

    useEffect(() => {
        verifyPayment();
    }, []); // Empty dependency array to run only once

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    );
}

export default Verify;
