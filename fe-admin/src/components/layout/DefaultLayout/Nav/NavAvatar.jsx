import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../../../../service/auth.service";
import userService from "../../../../service/user.service";
import { getUserFromToken } from "../../../../utils/auth";
import "../../../pages/Auth/loading.css";
function NavAvatar() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const currentUser = getUserFromToken();
  console.log("crrruen:0" + currentUser.sub);
  const fetchUser = async () => {
    try {
      if (currentUser) {
        const response = await userService.getUser(currentUser.id);
        setUserDetails(response.data.profile);
      }
    } catch (error) {
      toast.error(error.response.data || "Lỗi truy xuất người dùng");
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  const handleLogout = async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
    setIsLoading(true); // Bắt đầu hiển thị loading

    try {
      await authService.logout();

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
    <li className="nav-item dropdown pe-3">
      <a
        href="#"
        data-bs-toggle="dropdown"
        className="nav-link nav-profile d-flex align-items-center pe-0"
        style={{
          maxWidth: "200px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <span className="d-none d-md-block dropdown-toggle ps-2">
          {currentUser ? userDetails?.fullName : "Guest"}
          <img
            src={
              currentUser && userDetails?.photo
                ? userDetails.photo // Cloud URL of the user's profile image
                : "https://th.bing.com/th/id/OIP.ghZN_FaqJ8PdAWZKqcsU0wHaE6?w=244&h=180&c=7&r=0&o=5&pid=1.7" // Default guest image
            }
            className="rounded-circle ms-1"
            alt="Profile"
          />
        </span>
      </a>
      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
        <li
          className="dropdown-header"
          style={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          <h6>{currentUser ? currentUser.username : "Guest"}</h6>
          {currentUser && (
            <>
              <span>Tên cán bộ: {userDetails?.fullName || "Chưa có"}</span>
              <br />
              <span className="">
                Quyền:{" "}
                {Array.isArray(currentUser.roles)
                  ? currentUser.roles.map((role) => role.authority).join(", ")
                  : "N/A"}
              </span>
            </>
          )}
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <Link
            className="dropdown-item d-flex align-items-center"
            to={"/user-detail"}
          >
            <i className="bi bi-person"></i>
            <span>Thông tin cá nhân</span>
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <a className="dropdown-item d-flex align-items-center" href="#">
            <i className="bi bi-gear"></i>
            <span>Đổi mật khẩu</span>
          </a>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <a className="dropdown-item d-flex align-items-center" href="#">
            <i className="bi bi-question-circle"></i>
            <span>Hỗ trợ</span>
          </a>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          {currentUser ? (
            <a
              className="dropdown-item d-flex align-items-center"
              href="/login"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Đăng xuất</span>
            </a>
          ) : (
            <a
              className="dropdown-item d-flex align-items-center"
              href="/login"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Đăng nhập</span>
            </a>
          )}
        </li>
      </ul>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Đang đăng xuất...</p>
        </div>
      )}
    </li>
  );
}

export default NavAvatar;
