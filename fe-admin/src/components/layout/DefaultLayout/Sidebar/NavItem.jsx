import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavItem.css";
export default function NavItem({ title, id, links, icon }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selectedItem, setSelectedItem] = useState(0);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleOnClickNav = (itemId) => {
    setSelectedItem(itemId);
  };
  return (
    <li className="nav-item">
      <a
        className="nav-link collapsed"
        data-bs-toggle="collapse"
        data-bs-target={`#${id}`} // Đảm bảo data-bs-target sử dụng id đúng
        href="#"
        onClick={handleToggleCollapse}
      >
        <i className={icon}></i>
        <span>{title}</span>
        <i
          className={`bi bi-chevron-right ms-auto chevron-icon ${
            !isCollapsed ? "rotate-down" : ""
          }`}
        ></i>
      </a>
      <ul
        id={id} // Tham chiếu đến id động
        className="nav-content collapse"
        data-bs-parent="#sidebar-nav"
      >
        {links.map((link, index) => (
          <li key={index} className="child-nav-item" onClick={handleOnClickNav}>
            <Link to={link.path}>
              <i className="bi bi-circle"></i>
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
