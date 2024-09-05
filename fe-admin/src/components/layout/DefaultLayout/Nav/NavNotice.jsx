import React from "react";
import "./nav.css";

function NavNotice() {
  return (
    <li className="nav-item dropdown">
      <a
        className="nav-link nav-icon"
        href="#"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-bell"></i> {/* Thay đổi thẻ <li> thành <i> */}
        <span className="badge bg-primary badge-number">4</span>
      </a>
      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
        <li className="dropdown-header">
          You have 4 new notifications
          <a href="#">
            <span className="badge rounded-pill bg-primary p-2 ms-2">
              View all
            </span>
          </a>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li className="notification-item">
          <i className="bi bi-exclamation-circle text-warning"></i>
          <div>
            <h4>Lorem</h4>
            <p>Banj cos mot tin nhan moi</p>
            <p>30 phut truoc</p>
          </div>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li className="notification-item">
          <i className="bi bi-x-circle text-danger"></i>
          <div>
            <h4>Lorem</h4>
            <p>Banj cos mot tin nhan moi</p>
            <p>30 phut truoc</p>
          </div>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li className="notification-item">
          <i className="bi bi-check-circle text-success"></i>
          <div>
            <h4>Lorem</h4>
            <p>Banj cos mot tin nhan moi</p>
            <p>3 gio truoc</p>
          </div>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li className="notification-item">
          <i className="bi bi-info-circle text-primary"></i>
          <div>
            <h4>Lorem</h4>
            <p>Banj cos mot tin nhan moi</p>
            <p>2 phut truoc</p>
          </div>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li className="dropdown-footer"><a href="#">Show all notification</a></li>
      </ul>
    </li>
  );
}

export default NavNotice;
