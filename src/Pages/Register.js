import React, { Component, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import useValidator from './../components/validator/useValidator'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    // const [candidateList, SetCandidateList] = useState([]);
    const [userData, setUserData] = useState({ fullname: "", email: "", age: "", contact: "", password: "", experience: "" })
    const [passType, setPassType] = useState("password")
    const [eye, SetEye] = useState(false)
    const [allCandidates, SetAllCandidates] = useState([]);
    const [validator, showMessages] = useValidator()

    const getUsers = () => {
        axios.post(process.env.REACT_APP_HOST + '/getUsers', { "usertype": "candidate" })
            .then(res => {
                SetAllCandidates(res.data.data);
            })
            .catch(err => { console.log(err) })
    }

    const handleSubmit = () => {
        if (validator.allValid()) {
            const status = allCandidates.filter(item => item.email === userData.email)
            if (status.length == 0) {
                // console.log("already exists")
                axios.post(process.env.REACT_APP_HOST + '/register', userData)
                    .then(res => {
                        console.log(res.data)
                        if (res.data === true) {
                            RegToast();
                            setTimeout(() => {
                                window.open('/', '_self');
                            }, 1000);
                        } else {
                            ErrToast();
                        }
                    })
                    .catch(err => console.log(err))

            } else {
                AlreadyExistsToast();
            }
        } else {
            showMessages(true)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    /* const handleSubmit = () => {
       // console.log(userData)
       if (validator.allValid()) {
           axios.post(process.env.REACT_APP_HOST + '/register', userData)
               .then(res => {
                   console.log(res.data)
                   if (res.data === true) {
                       RegToast();
                       setTimeout(() => {
                           window.open('/login', '_self');
                       }, 1000);
                   } else {
                       ErrToast();
                   }
               })
               .catch(err => console.log(err))
       } else {
           showMessages(true)
       }
   }  */

    const RegToast = () => {
        toast.success("Registration Successfull !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const AlreadyExistsToast = () => {
        toast.error("User with same Mail ID already exists !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const ErrToast = () => {
        toast.error("Something went wrong !", {
            position: toast.POSITION.TOP_RIGHT
        });
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

    const handleChange = (prop) => (e) => {
        // console.log(e.target.value)
        setUserData({ ...userData, [prop]: e.target.value })
    }

    return (
        <div className="container" >
            <center>
                <div className="register-box mt-3">
                    <div className="card card-outline card-primary">
                        <div className="card-header text-center">
                            <a href="../../index2.html" className="h1"><b>Candidates</b></a>
                        </div>
                        <div className="card-body">
                            <p className="login-box-msg">Registration for Candidate</p>
                            <ToastContainer
                                autoClose={2000}
                                hideProgressBar
                                newestOnTop={true} />
                            <form action="../../index.html" method="post">
                                <div className="input-group mb-3">
                                    <input type="text" name="fullname" value={userData.fullname} onChange={handleChange("fullname")} className="form-control" placeholder="Full name" />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-user" />
                                        </div>
                                    </div>
                                </div>
                                <span className='text-red'>
                                    {validator.message('Full Name', userData.fullname, 'required|alpha_space')}
                                </span>
                                <div className="input-group mb-3">
                                    <input type="email" name="email" value={userData.email} onChange={handleChange("email")} className="form-control" placeholder="Email" />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-envelope" />
                                        </div>
                                    </div>
                                </div>
                                <span className='text-red'>
                                    {validator.message('Email', userData.email, 'required|email')}
                                </span>
                                <div className="input-group mb-3">
                                    <input type="text" name="age" value={userData.age} onChange={handleChange("age")} className="form-control" placeholder="Age" />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-recycle" />
                                        </div>
                                    </div>
                                </div>
                                <span className='text-red'>
                                    {validator.message('Age', userData.age, 'required|numeric')}
                                </span>
                                <div className="input-group mb-3">
                                    <input type="text" maxlength="10" name="contact" value={userData.contact} onChange={handleChange("contact")} className="form-control" placeholder="Contact" />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-phone" />
                                        </div>
                                    </div>
                                </div>
                                <span className='text-red'>
                                    {validator.message('Contact', userData.contact, 'required|phone|min:10,num')}
                                </span>
                                <div className="input-group mb-3">
                                    <input type={passType} name="password" value={userData.password} onChange={handleChange("password")} className="form-control" placeholder="Password" />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span hidden={eye} className="fas fa-eye-slash" onClick={handleEye} />
                                            <span hidden={eye === false} className="fas fa-eye" onClick={handleEye} />
                                        </div>
                                    </div>
                                </div>
                                <span className='text-red'>
                                    {validator.message('Password', userData.password, 'required|min:7|max:12')}
                                    {/* not_regex:/^[A-Za-z]\w{7,14}$/ */}
                                </span>
                                <div className="input-group mb-3">
                                    <div class="form-group" style={{ width: '100%' }}>
                                        {/* <label>Experience</label> */}
                                        <select class="custom-select" name="experience" value={userData.experience} onChange={handleChange("experience")}>
                                            <option hidden selected>Select Experience</option>
                                            <option value="fresher">Fresher</option>
                                            {/*  <option value="1-3 years">1-3 years</option>
                                            <option value="3-5 years">3-5 years</option>
                                            <option value="5+ years">5+ years</option> */}
                                        </select>
                                    </div>
                                </div>
                                <span className='text-red'>
                                    {validator.message('Exprience', userData.experience, 'required')}
                                </span>
                                <div className="row">
                                    <div className="col-12">
                                        <button type="button" onClick={handleSubmit} className="btn btn-primary btn-block">Register</button>
                                    </div>
                                    {/* /.col */}
                                </div>
                            </form>
                            <p className="mt-2 mb-2">
                                If Already have an Account? &nbsp;
                                <a href="/" className="text-center">Log In</a>
                            </p>
                        </div>
                        {/* /.form-box */}
                    </div>{/* /.card */}
                </div>

            </center>
        </div>

    )
}