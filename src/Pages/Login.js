
import React, { Component, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import useValidator from './../components/validator/useValidator'
import Modal from 'react-bootstrap/Modal';
import { Cookies, CookiesProvider, useCookies, withCookies } from 'react-cookie';

const Login = ({ isLogin }) => {
    const [userData, setUserData] = useState({ email: "", password: "" })
    const [passType, setPassType] = useState("password")
    const [eye, SetEye] = useState(false)
    const [err, SetErr] = useState(false)

    const [validator, showMessages] = useValidator()

    const [cookies, setCookie] = useCookies(['token', 'name', 'email']);


    const handleChange = (prop) => (e) => {
        // console.log(e.target.value)
        setUserData({ ...userData, [prop]: e.target.value })
    }

    const handleEye = () => {
        if (passType === "password") {
            setPassType("text")
            SetEye(true)
        } else {
            setPassType("password")
            SetEye(false)
        }
    }

    const handleSubmit = () => {
        // console.log(userData)
        if (validator.allValid()) {
            axios.post(process.env.REACT_APP_HOST + '/login', userData)
                .then(res => {
                    // console.log(res.data)
                    if (res.data.status === true) {
                        // localStorage.setItem("token", res.data.token); //set token
                        // localStorage.setItem("name", res.data.user.fullname);

                        isLogin(res.data)

                        if (res.data.usertype === "admin") {

                            console.log("redirect him to admin page")
                            window.open('/home', '_self');
                        } else {

                            if (res.data.applied === true) {
                                window.open('/result', '_self');
                            } else {
                                // localStorage.setItem("email", res.data.user.email);
                                // localStorage.setItem("candidateName", res.data.user.fullname);
                                window.open('/questionPaper', '_self');
                            }
                        }

                    } else {
                        SetErr(true)
                        setTimeout(() => {
                            //    window.location.reload()
                            SetErr(false)
                        }, 1000);
                        // window.location.reload()
                        // alert("Invalid Details")
                    }

                })
                .catch(err => console.log(err))
        } else {
            showMessages(true)
        }
    }

    useEffect(() => {
        var token = cookies.token
        var applied = cookies.applied;
        var type = cookies.type;
        if (token !== undefined) {
            // console.log("ghasgh")
            if (type === "admin") {
                console.log("redirect him to admin page")
                window.open('/home', '_self');
            } else {
                if (applied === true) {
                    window.open('/result', '_self');
                } else {
                    window.open('/questionPaper', '_self');
                }
            }
        }
    }, [])

    return (
        <div className="container" >
            <center>
                <div class="login-box">
                    <div className="card card-outline card-primary" style={{ marginTop: "7vw" }}>
                        <div className="card-header text-center">
                            <b>Aptitude Portal</b>
                        </div>
                        <div className="card-body">
                            <p className="login-box-msg">Log In to proceed</p>
                            <form >
                                <div className="input-group mb-3">
                                    <input type="email" className="form-control" name="email" value={userData.email} onChange={handleChange("email")} placeholder="Registered Email" />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-user" />
                                        </div>
                                    </div>
                                </div>
                                <span className='text-red'>
                                    {validator.message('Email', userData.email, 'required')}
                                </span>
                                <div className="input-group mb-3 mt-2">
                                    <input type={passType} className="form-control" name="password" value={userData.password} onChange={handleChange("password")} placeholder="Password" />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span hidden={eye} className="fas fa-eye-slash" onClick={handleEye} />
                                            <span hidden={eye === false} className="fas fa-eye" onClick={handleEye} />
                                        </div>
                                    </div>
                                </div>
                                <span className='text-red'>
                                    {validator.message('Password', userData.password, 'required')}
                                </span>
                                <div className="row">
                                    <div className="col-12 mt-4">
                                        <button type="button" onClick={handleSubmit} className="btn btn-primary btn-block">Log In</button>
                                    </div>
                                    {/* /.col */}
                                </div>
                            </form>
                            <p className="mt-2 mb-2">
                                Don't have an account? &nbsp;
                                <a href="/register" className="text-center">Register</a>
                            </p>
                        </div>
                        <Modal show={err} size="sm">
                            <Modal.Body>
                                <center>
                                    {/* <img src={Cancel} width="120" height="100" /><br /><br /> */}
                                    {/* <i className="fas fa-xmark" /> */}
                                    <h3><i className="fas fa-exclamation-triangle text-danger" /><br />INVALID CREDENTIALS</h3>
                                    {/* <p className='text-danger' style={{ fontSize: "18px" }}>INVALID CREDENTIALS</p> */}
                                </center>
                            </Modal.Body>
                        </Modal>
                        {/* /.card-body */}
                    </div>
                </div>
            </center>
        </div>
    )
}

export default Login
