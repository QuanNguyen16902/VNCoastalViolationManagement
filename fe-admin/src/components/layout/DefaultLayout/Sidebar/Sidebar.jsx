import React from "react";
import { Link } from "react-router-dom";
import navList from "../data/navItem";
import "./sidebar.css";
function Sidebar() {
  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link className="nav-link" to={"/"}>
            <i className="bi bi-grid"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <li className="nav-item">
          <a
            className="nav-link collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#components-nav"
            href="#"
          >
            <i className="bi bi-people"></i>
            <span>Quản lý Người dùng</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul
            id="components-nav"
            className="nav-content collapse "
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to={"/users"}>
                <i className="bi bi-circle"></i>
                <span>Danh sách</span>
              </Link>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <a
            className="nav-link collapsed"
            data-bs-target="#forms-nav"
            data-bs-toggle="collapse"
            href="#"
          >
            <i className="bi bi-journal-text"></i>
            <span>Quản lý Vai trò</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul
            id="forms-nav"
            className="nav-content collapse"
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to={"/roles"}>
                <i className="bi bi-circle"></i>
                <span>Danh sách</span>
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#rolegroups-nav"
            href="#"
          >
            <i className="bi bi-menu-button-wide"></i>
            <span>Quản lý Nhóm người dùng</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul
            id="rolegroups-nav"
            className="nav-content collapse "
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to={"/users-group"}>
                <i className="bi bi-circle"></i>
                <span>Danh sách</span>
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#record-nav"
            href="#"
          >
            <i className="bi bi-menu-button-wide"></i>
            <span>Biên bản vi phạm</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul
            id="record-nav"
            className="nav-content collapse "
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to={"/violation-records"}>
                <i className="bi bi-circle"></i>
                <span>Danh sách</span>
              </Link>
            </li>
            <li>
              <Link to={"/violation-records/new"}>
                <i className="bi bi-circle"></i>
                <span>Tạo biên bản vi phạm</span>
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#decision-nav"
            href="#"
          >
            <i className="bi bi-menu-button-wide"></i>
            <span>Quyết định xử phạt</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul
            id="decision-nav"
            className="nav-content collapse "
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to={"/penalty-decision"}>
                <i className="bi bi-circle"></i>
                <span>Danh sách</span>
              </Link>
            </li>
            <li>
              <Link to={"/penalty-decision/new"}>
                <i className="bi bi-circle"></i>
                <span>Tạo quyết định xử phạt</span>
              </Link>
            </li>
          </ul>
        </li>

        <li className="nav-heading">Pages</li>
        {navList.map((nav) => (
          <li className="nav-item" key={nav._id}>
            <Link className="nav-link collapsed" to={nav.link}>
              <i className={nav.icon}></i>
              <span>{nav.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
