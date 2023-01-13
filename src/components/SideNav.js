import React from 'react'
import { Cookies, CookiesProvider, useCookies, withCookies } from 'react-cookie';

const SideNav = () => {
  const [cookies, setCookie] = useCookies(['token', 'name', 'email']);
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <a href="../../index3.html" className="brand-link">
        <img src="../../dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
        <span className="brand-text font-weight-light">Aptitude Admin</span>
      </a>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          {/*  <div className="image">
            <img src="../../dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
          </div> */}
          <div className="info">
            <a className="d-block">{cookies.name}</a>
          </div>
        </div>
        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

            <li className="nav-item user-panel">
              <a href="/home" className="nav-link">
                {/* <div style={{ float: "left" }}> */}
                  <i className="nav-icon fas fa-users" />
                  <b>
                    Candidate Management
                  </b>
                {/* </div> */}
              </a>
            </li>
            <li className="nav-item user-panel mt-3">
              <a href="/adminManagement" className="nav-link">
                {/* <div style={{ float: "left" }}> */}
                  <i className="nav-icon fas fa-users" />
                  <b>
                    User Management
                    {/* <span className="right badge badge-danger">New</span> */}
                  </b>
                {/* </div> */}
              </a>
            </li>
            <li className="nav-item user-panel mt-3">
              <a href="/setQuestions" className="nav-link">
                {/* <div style={{ float: "left" }}> */}
                  <i className="nav-icon fas fa-table" />
                  <b>
                    Set Questions
                    {/* <span className="right badge badge-danger">New</span> */}
                  </b>
                {/* </div> */}
              </a>
            </li>
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  )
}

export default SideNav
