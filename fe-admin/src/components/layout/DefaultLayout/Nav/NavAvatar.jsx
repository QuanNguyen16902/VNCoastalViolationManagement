import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../../service/auth.service';
import '../../../pages/Auth/loading.css';
function NavAvatar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser(); // Giả sử đây là hàm async
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
    setIsLoading(true); // Bắt đầu hiển thị loading

    try {
      await authService.logout(); 
      setCurrentUser(null);

      // Delay điều hướng sau khi loading
      setTimeout(() => {
        setIsLoading(false); // Tắt loading
        navigate("/login"); // Điều hướng đến trang đăng nhập
      }, 1000); // Điều chỉnh thời gian delay nếu cần
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false); // Tắt loading nếu có lỗi
    }
  };

  return (
    <li className='nav-item dropdown pe-3'>
      <a
        href="#"
        data-bs-toggle="dropdown"
        className='nav-link nav-profile d-flex align-items-center pe-0'>
        {/* <img src="#" alt='Profile' className='rounded-circle'/> */}
        <span className='d-none d-md-block dropdown-toggle ps-2'>
          {currentUser ? currentUser.username : 'Guest'}
        </span>
      </a>
      <ul className='dropdown-menu dropdown-menu-end dropdown-menu-arrow profile'>
        <li className='dropdown-header'>
          <h6>{currentUser ? currentUser.username : 'Guest'}</h6>
          <span>
            Quyền: {currentUser && Array.isArray(currentUser.authorities)
              ? currentUser.authorities.map(role => role.authority).join(', ')
              : 'N/A'}
          </span>
        </li>
        <li>
          <hr className='dropdown-divider'/>
        </li>
        <li>
          <a className='dropdown-item d-flex align-items-center' href="#">
            <i className='bi bi-person'></i>
            <span>Hồ sơ cá nhân</span>
          </a>
        </li>
        <li>
          <hr className='dropdown-divider'/>
        </li>
        <li>
          <a className='dropdown-item d-flex align-items-center' href="#">
            <i className='bi bi-gear'></i>
            <span>Cài đặt tài khoản</span>
          </a>
        </li>
        <li>
          <hr className='dropdown-divider'/>
        </li>
        <li>
          <a className='dropdown-item d-flex align-items-center' href="#">
            <i className='bi bi-question-circle'></i>
            <span>Hỗ trợ</span>
          </a>
        </li>
        <li>
          <hr className='dropdown-divider'/>
        </li>
        <li>
          {currentUser ? (
            <a className='dropdown-item d-flex align-items-center' href="/login" onClick={handleLogout}>
              <i className='bi bi-box-arrow-right'></i>
              <span>Đăng xuất</span>
            </a>
          ) : (
            <a className='dropdown-item d-flex align-items-center' href="/login">
              <i className='bi bi-box-arrow-right'></i>
              <span>Đăng nhập</span>
            </a>
          )}
        </li>
      </ul>
      {isLoading && (
        <div className='loading-overlay'>
          <div className='spinner'></div> {/* Thay bằng spinner hoặc loading indicator của bạn */}
          <p>Đang đăng xuất...</p>
        </div>
      )}
    </li>
  );
}

export default NavAvatar;
