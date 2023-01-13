import React, { Component, useEffect, useState, useRef } from 'react';
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideNav from "../components/SideNav"
import axios from 'axios';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import useValidator from './../components/validator/useValidator'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Cookies, CookiesProvider, useCookies, withCookies } from 'react-cookie';

const AdminManagement = () => {
    const [adminList, SetAdminList] = useState([]);
    const [del, SetDel] = useState([]);
    const [adminData, setAdminData] = useState({ fullname: "", email: "", password: "" })
    const [passType, setPassType] = useState("password")
    const [eye, SetEye] = useState(false)
    const [validator, showMessages] = useValidator()
    const [cookies, setCookie] = useCookies(['token', 'name', 'email', 'type', 'applied']);

    const getUsers = () => {
        axios.post(process.env.REACT_APP_HOST + '/getUsers', { "usertype": "admin" })
            .then(res => {
                SetAdminList(res.data.data)
            })
            .catch(err => { console.log(err) })
    }

    useEffect(() => {
        if (cookies.token) {
            getUsers();
        } else {
            window.open("/error", "_self")
        }
    }, [])

    const delToast = () => {
        toast.success("Deleted Successfully !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const ErrToast = () => {
        toast.error("Something went wrong !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const AddToast = () => {
        toast.success("Admin added successfully !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const AlreadyExistsToast = () => {
        toast.error("Admin with same Mail ID already exists !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const DelAdmin = () => {
        // console.log(del)
        axios.post(process.env.REACT_APP_HOST + '/delUser', { "id": del })
            .then(res => {
                console.log(res.data)
                if (res.data.status === true) {
                    delToast();
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000);
                } else {
                    // alert("something went wrong")
                    ErrToast();
                }
            })
            .catch(err => { console.log(err) })

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
        setAdminData({ ...adminData, [prop]: e.target.value })
    }

    const handleSubmit = () => {
        console.log(adminData)
        // console.log(adminList)
        if (validator.allValid()) {
            const status = adminList.filter(item => item.email === adminData.email)
            if (status.length == 0) {
                axios.post(process.env.REACT_APP_HOST + '/addAdmin', adminData)
                    .then(res => {
                        // console.log(res.data)
                        if (res.data === true) {
                            // alert("admin added successfully")
                            AddToast();
                            setTimeout(() => {
                                window.location.reload()
                            }, 1000);
                        } else {
                            ErrToast();
                        }
                    })
                    .catch(err => { console.log(err) })
            } else {
                AlreadyExistsToast();
            }
        } else {
            showMessages(true)
        }
    }

    let columns = [
        {
            selector: (row) => row.email,
            name: "Email",
            sortable: true
        },
        {
            selector: (row) => row.fullname,
            name: "Username",
            sortable: true
        },
        {
            selector: (row) => row.usertype,
            name: "User Type",
            sortable: true
        },
        {
            // selector: (row) => row.usertype,
            name: "Actions",
            sortable: true,
            cell: (data) => {
                // console.log(data)
                return (
                    <button className='btn btn-danger' hidden={data.fullname === cookies.name | data.fullname === "admin"} title="Delete Admin" data-toggle='modal' data-target='#modal-sm' onClick={() => { SetDel(data.id) }}><i className="fas fa-trash" ></i></button>
                )
            }
        }
    ];

    let tableData = {
        columns,
        adminList
    };

    return (
        <div className="wrapper">
            <Navbar />
            <SideNav />
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>Admin Management</h1>
                            </div>
                        </div>
                    </div>{/* /.container-fluid */}
                </section>
                {/* Main content */}
                <section className="content">
                    <div className="container-fluid">
                        {/* <button className='btn btn-info' data-toggle='modal' data-target='#modal-sm2' >Add<i className="fas fa-plus ml-2" /></button> */}
                        <div className="row">
                            <div className="col-12">
                                {/* Default box */}
                                <div className="card">
                                    <div className="card-body">
                                        <button style={{ float: "right" }} className='btn btn-info' data-toggle='modal' data-target='#modal-sm2' onClick={()=>{
                                            setAdminData({ fullname: "", email: "", password: "" })
                                        }} >Add<i className="fas fa-plus ml-2" /></button>
                                        <DataTableExtensions {...tableData}
                                            columns={columns}
                                            data={adminList}
                                            export={false}
                                            print={false}
                                            exportHeaders={false}
                                            filterPlaceholder="Search admin"
                                        >
                                            <DataTable
                                                defaultSortField="Email"
                                                defaultSortAsc={false}
                                                pagination
                                                highlightOnHover
                                            />
                                        </DataTableExtensions>
                                    </div>
                                    <ToastContainer
                                        autoClose={2000}
                                        hideProgressBar
                                        newestOnTop={true} />
                                    {/* Delete Modal */}
                                    <div className="modal fade" id="modal-sm">
                                        <div className="modal-dialog modal-sm">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title">Delete Admin</h4>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">×</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="row">
                                                        <div style={{ textAlign: "center" }} className="col-12">
                                                            Are you sure  ?
                                                        </div>
                                                    </div>
                                                    <div className="row mt-3">
                                                        <div className="col-12">
                                                            <center>
                                                                <button className='btn btn-info' type="button" data-dismiss="modal" onClick={DelAdmin} > Yes</button>
                                                                <button className='btn btn-info ml-3' type="button" data-dismiss="modal" > No</button>
                                                            </center>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Add user Modal */}
                                    <div className="modal fade" id="modal-sm2">
                                        <div className="modal-dialog modal-sm">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title">Add Admin</h4>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">×</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <form >
                                                        <div className="input-group mb-3">
                                                            <input type="email" className="form-control" name="fullname" value={adminData.fullname} onChange={handleChange("fullname")} placeholder="Full name" />
                                                            <div className="input-group-append">
                                                                <div className="input-group-text">
                                                                    <span className="fas fa-user" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className='text-red'>
                                                            {validator.message('Full Name', adminData.fullname, 'required|alpha_space')}
                                                        </span>
                                                        <div className="input-group mb-3">
                                                            <input type="email" className="form-control" name="email" value={adminData.email} onChange={handleChange("email")} placeholder="Email" />
                                                            <div className="input-group-append">
                                                                <div className="input-group-text">
                                                                    <span className="fas fa-envelope" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className='text-red'>
                                                            {validator.message('Email', adminData.email, 'required|email')}
                                                        </span>
                                                        <div className="input-group mb-3">
                                                            <input type={passType} className="form-control" name="password" value={adminData.password} onChange={handleChange("password")} placeholder="Password" />
                                                            <div className="input-group-append">
                                                                <div className="input-group-text">
                                                                    <span hidden={eye} className="fas fa-eye-slash" onClick={handleEye} />
                                                                    <span hidden={eye === false} className="fas fa-eye" onClick={handleEye} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className='text-red'>
                                                            {validator.message('Password', adminData.password, 'required|min:7|max:12')}
                                                            {/* not_regex:/^[A-Za-z]\w{7,14}$/ */}
                                                        </span>
                                                    </form>
                                                </div>
                                                <div className="modal-footer justify-content-right">
                                                    <button type="button" onClick={handleSubmit} className="btn btn-primary" >Save</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* /.content */}
            </div>
            <Footer />
        </div>
    )
}

export default AdminManagement
