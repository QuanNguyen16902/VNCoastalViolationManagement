import React from 'react'
import { Link } from 'react-router-dom'
import navList from '../data/navItem'
import "./sidebar.css"
function Sidebar() {
  return (
    <aside id='sidebar' className='sidebar'>
        <ul className='sidebar-nav' id='sidebar-nav'>
            <li className='nav-item'>
                <Link className='nav-link' to={"/"}>
                    <i className='bi bi-grid'></i>
                    <span>Dashboard</span>
                </Link>
            </li>

            <li className='nav-item'>
                <a className='nav-link collapsed'
                   data-bs-toggle="collapse"
                   data-bs-target="#components-nav"
                   href="#">
                    <i className='bi bi-people'></i>
                    <span>Quản lý Người dùng</span>
                    <i className='bi bi-chevron-down ms-auto'></i>
                </a>
                <ul id='components-nav' className='nav-content collapse ' 
                    data-bs-parent="#sidebar-nav">
                    <li>
                        <Link to={"/users"}>
                            <i className='bi bi-circle'></i>
                            <span>Danh sách</span>
                        </Link>
                    </li>

                </ul>
            </li>

            <li className='nav-item'>
                <a className='nav-link collapsed'
                   data-bs-target="#forms-nav"
                   data-bs-toggle="collapse"
                   href='#'>
                    <i className='bi bi-journal-text'></i>
                    <span>Quản lý Quyền</span>
                    <i className='bi bi-chevron-down ms-auto'></i>
                </a>
                <ul id='forms-nav' className='nav-content collapse'
                    data-bs-parent="#sidebar-nav">
                    <li>
                        <Link to={"/roles"}>
                            <i className='bi bi-circle'></i>
                            <span>Danh sách</span>
                        </Link>
                    </li>
                   
                </ul>
            </li>
            <li className='nav-item'>
                <a className='nav-link collapsed'
                   data-bs-toggle="collapse"
                   data-bs-target="#rolegroups-nav"
                   href="#">
                    <i className='bi bi-menu-button-wide'></i>
                    <span>Quản lý Nhóm quyền</span>
                    <i className='bi bi-chevron-down ms-auto'></i>
                </a>
                <ul id='rolegroups-nav' className='nav-content collapse ' 
                    data-bs-parent="#sidebar-nav">
                    <li>
                        <Link to={"/roles-group"}>
                            <i className='bi bi-circle'></i>
                            <span>Danh sách</span>
                        </Link>
                    </li>

                </ul>
            </li>

            <li className='nav-heading'>Pages</li>
            {navList.map(nav=>(
                <li className='nav-item' key={nav._id}>
                    <Link className="nav-link collapsed" to={nav.link}>
                        <i className={nav.icon}></i>
                        <span>{nav.name}</span>
                    </Link>
                </li>
            ))}
        </ul>
    </aside>  
  )
}

export default Sidebar