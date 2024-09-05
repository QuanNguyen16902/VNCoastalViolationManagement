import React from 'react';
import { Link } from 'react-router-dom';
import './error.css';
const Error404 = () => {
    return (
        <div className='error-page'  style={{ textAlign: 'center', padding: '50px' }}>
            <h1>404</h1>
            <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
            <Link to="/">Go to Homepage</Link>
        </div>
    );
};

export default Error404;
