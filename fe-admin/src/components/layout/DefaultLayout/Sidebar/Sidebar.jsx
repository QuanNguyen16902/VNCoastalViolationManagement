import React from "react";
import { Link } from "react-router-dom";
import navList from "../data/navItem";
import NavItem from "./NavItem";
import "./sidebar.css";
function Sidebar() {
  const violationLinks = [
    { path: "/violation-records", label: "Danh sách" },
    { path: "/violation-records/new", label: "Tạo biên bản vi phạm" },
  ];
  const decisionLinks = [
    { path: "/penalty-decision", label: "Danh sách" },
    { path: "/penalty-decision/new", label: "Tạo Quyết định xử phạt" },
  ];
  const userGroupLinks = [{ path: "/users-group", label: "Danh sách" }];
  const userLinks = [
    { path: "/users", label: "Danh sách Người Dùng" },
    { path: "/roles", label: "Danh sách Vai Trò" },
    { path: "/permissions", label: "Danh sách Phân Quyền" },
  ];
  const personLinks = [
    { path: "/violation-person", label: "Danh sách Người/Tổ chức vi phạm" },
    { path: "/violation-ship", label: "Danh sách Tàu vi phạm" },
    { path: "/seized-items", label: "Danh sách Tang vật" },
  ];

  return (
    <aside id="sidebar" className="sidebar mt-1">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link className="nav-link" to={"/"}>
            <i className="bi bi-grid"></i>
            <span>Trang chủ</span>
          </Link>
        </li>
        <NavItem
          title={"Quản lý Người Dùng"}
          links={userLinks}
          id={"users-nav"}
          icon={"bi bi-person"}
        />

        <NavItem
          title={"Quản lý Nhóm người dùng"}
          links={userGroupLinks}
          id={"rolegroups-nav"}
          icon={"bi bi-people"}
        />
        <NavItem
          title={"Quản lý Người/Tổ chức vi phạm, Phương tiện vi phạm"}
          links={personLinks}
          id={"ban-nav"}
          icon={"bi bi-person-exclamation"}
        />

        <NavItem
          title="Biên Bản Vi Phạm"
          id="record-nav"
          links={violationLinks}
          icon={"bi bi-layout-text-sidebar-reverse"}
        />
        <NavItem
          title="Quyết Định Xử Phạt"
          id="decision-nav"
          links={decisionLinks}
          icon={"bi bi-menu-button-wide"}
        />

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
