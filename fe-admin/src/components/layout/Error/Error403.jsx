import React from 'react';
import { Link } from 'react-router-dom';
import './error.css';
const Error403 = () => {
    return (
        <div className='error-page' style={{ textAlign: 'center', padding: '50px' }}>
            <h1>403</h1>
            <p>Bạn không có quyền truy cập vào trang này.</p>
            <Link to="/">Go to Homepage</Link>
        </div>
    );
};

export default Error403;
