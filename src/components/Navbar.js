import React from 'react'
import { Cookies, CookiesProvider, useCookies, withCookies } from 'react-cookie';

const Navbar = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'name', 'email']);

    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
                </li>
                {/* <li className="nav-item d-none d-sm-inline-block">
                    <a href="/home" className="nav-link">Home</a>
                </li> */}
            </ul>
            <ul className="navbar-nav ml-auto">

                <li className="nav-item" onClick={() => {
                    removeCookie("token", { path: '/' })
                    removeCookie("email", { path: '/' })
                    removeCookie("name", { path: '/' })
                    removeCookie("type", { path: '/' })
                    removeCookie("applied", { path: '/' })
                }}>
                    <a className="nav-link" href="/" role="button">
                        Logout <i className="fas fa-arrow-right" />
                    </a>
                </li>
            </ul>
        </nav>


    )
}

export default Navbar
