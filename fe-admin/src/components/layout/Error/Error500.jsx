import React from 'react';
import { Link } from 'react-router-dom';
import './error.css';
function Error500() {
    return (
        <div className='error-page'  style={{ textAlign: 'center', padding: '50px' }}>
            <h1>500 - Lỗi máy chủ</h1>
            <p>Xin lỗi, có vấn đề với máy chủ của chúng tôi. Vui lòng thử lại sau.</p>
            <Link to="/" className="home-link">Quay về trang chủ</Link>
        </div>
    );
}

export default Error500;
