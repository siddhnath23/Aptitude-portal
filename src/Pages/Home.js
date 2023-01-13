import React, { Component, useEffect, useState, useRef } from 'react';
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideNav from "../components/SideNav"
import axios from 'axios';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Toast from "../../public/plugins/toastr";
import { Cookies, CookiesProvider, useCookies, withCookies } from 'react-cookie';

const Home = () => {
    const [candidateList, SetCandidateList] = useState([]);
    const [allquestions, SetAllQuestions] = useState([]);
    const [marks, SetMarks] = useState(0)
    const [paper, SetPaper] = useState([])
    const [del, SetDel] = useState(0);
    const [resetID, SetResetID] = useState(0);
    const [toastval, SetToastVal] = useState("")

    const [cookies, setCookie] = useCookies(['token', 'name', 'email']);

    const getAllQuestions = () => {
        axios.get(process.env.REACT_APP_HOST + '/getAllQuestions')
            .then(res => {
                // console.log(res.data)
                SetAllQuestions(res.data)
            })
            .catch(err => { console.log(err) })
    }

    const getUsers = () => {
        axios.post(process.env.REACT_APP_HOST + '/getUsers', { "usertype": "candidate" })
            .then(res => {
                console.log(res.data)
                SetCandidateList(res.data.data)
            })
            .catch(err => { console.log(err) })
    }

    useEffect(() => {
        // console.log(localStorage.getItem("token"))
        if (cookies.token) {
            getAllQuestions();
            getUsers();
        } else {
            window.open("/error", "_self")
        }
    }, [])

    const delCandidate = () => {
        console.log(del)
        axios.post(process.env.REACT_APP_HOST + '/delUser', { "id": del })
            .then(res => {
                console.log(res.data)
                if (res.data.status === true) {
                    // SetToastVal("Deleted Successfully !")
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

    const delToast = () => {
        toast.success("Deleted Successfully !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const resetToast = () => {
        toast.success("Exam Reset Successfull !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const ErrToast = () => {
        toast.error("Something went wrong !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const reSetExam = () => {
        // console.log(resetID)

        axios.post(process.env.REACT_APP_HOST + '/resetExam', { "id": resetID })
            .then(res => {
                // console.log(res.data)
                if (res.data === true) {
                    resetToast();
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

    const getResponseTable = (data) => {
        return (
            data.map((item, index) => {
                // console.log("test", item)
                /* if (item.marks === "0" && item.response === "null") {
                    return (
                        <>
                            <div>Questions not attempted</div>
                        </>
                    )

                } else if (item.marks === "0" && item.response !== "null") {
                    return (
                        <>
                            <div>Zero marks scored</div>
                        </>
                    )
                }  */
                // else {
                const element = allquestions.filter(v => { return v.question === item.Q })
                // console.log("found::", element)
                return (
                    <div key={element[0].id} className="row mb-3" style={{ borderBottom: "2px solid blue" }}>
                        <div className="col-12" style={{ display: 'inline-grid' }}>
                            <div className="row">
                                <div className="col-10" style={{ display: 'inline-grid' }}>
                                    <span style={{ float: "left" }}><b>Q{index === 0 ? 1 + ".) " : ++index + ".) "}</b> {element[0].category === "programming" ? (<pre>{element[0].question}</pre>) : element[0].question}</span>

                                    <div className="form-group clearfix" >
                                        {element[0].opt1 !== null && <div className="icheck-primary  ml-3" /* style={{ float: "left" }} */>
                                            <input type="radio" checked={element[0].opt1 === item.A} />
                                            <label >
                                                {element[0].opt1}
                                            </label>
                                        </div>}
                                        {element[0].opt2 !== null && <div className="icheck-primary ml-3" /* style={{ float: "left" }} */>
                                            <input type="radio" checked={element[0].opt2 === item.A} />
                                            <label >
                                                {element[0].opt2}
                                            </label>
                                        </div>}
                                        {element[0].opt3 !== null &&
                                            <div className="icheck-primary ml-3" /* style={{ float: "left" }} */>
                                                <input type="radio" checked={element[0].opt3 === item.A} />
                                                <label >
                                                    {element[0].opt3}
                                                </label>
                                            </div>}

                                        {element[0].opt4 !== null && <div className="icheck-primary ml-3" /* style={{ float: "left" }} */>
                                            <input type="radio" checked={element[0].opt4 === item.A} />
                                            <label >
                                                {element[0].opt4}
                                            </label>
                                        </div>}<br />
                                    </div>
                                    <div className='text-green ml-3 mb-2'>
                                        <p>Correct Answer: {element[0].ans}</p>
                                    </div>
                                </div>
                                <div className="col-2 mt-5">
                                    <span className="p-2" style={{ float: "left", color: item.status === "Wrong" ? "red" : "green" }}><u>{item.status}</u></span><br />
                                </div>
                            </div>
                        </div>
                    </div>
                )
                // }
            })
        )
    }

    let columns = [
        {
            selector: (row) => row.fullname,
            name: "Full Name",
            sortable: true,
            cellExport: row => row.fullname,
        },
        {
            selector: (row) => row.email,
            name: "Email",
            sortable: true,
            cellExport: row => row.email
        },
        {
            selector: (row) => row.experience,
            name: "Experience",
            sortable: true,
            cellExport: row => row.experience,
            cell: (data) => (
                <div style={{ textTransform: 'capitalize' }}>{data.experience}</div>
            )
            //  cellExport:row=>row.experience
        },
        {
            selector: (row) => row.applied,
            name: "Applied Exam",
            sortable: true,
            cell: (data) => (
                <div>{data.applied === "true" ? "Applied" : "Not Applied"}</div>
            )
            // cellExport: row => row.applied
        },
        {
            // selector: (row) => row.status,
            name: "Exam Status",
            // sortable: true,
            cell: (data) => (
                <div>
                    {data.status === "Started" ?
                        <>
                            <i class="fa fa-circle fa-fw blink_me"></i>
                        </> :
                        data.status === "Finished" ?
                            <>
                                <i class="fa fa-circle fa-fw blink_me2"></i>
                            </> : <></>
                    }
                </div >
            )
            // cellExport: row => row.status
        },
        {
            selector: (row) => row.marks,
            name: "Marks",
            sortable: true,
            cell: (data) => (
                <div>{data.marks === "null" ? "" : data.marks}</div>
            ),
            cellExport: row => row.marks
        },
        {
            selector: (row) => row.date,
            name: "Exam Date",
            sortable: true,
            cellExport: row => row.date
        },
        {
            // selector: (row) => row.response,
            name: "Response",
            // sortable: true,
            cell: (data) => (
                <button disabled={data.response === null} title='Candidate Response' className='btn btn-default' data-toggle='modal' data-target='#modal-lg'
                    onClick={() => {
                        SetPaper(data.response.res)
                        SetMarks(data.marks)
                    }}> <span className="fas fa-file-code text-info" /></button>
            )
            // cellExport: row => row.response
        },
        {
            name: "Actions",
            // sortable: true,
            cell: (data) => (
                <>
                    <button type="button" className="btn btn-default" title="Reset Exam" data-toggle='modal' data-target='#modal-sm2' onClick={() => { SetResetID(data.id) }} disabled={data.applied === "false"}>
                        <span className="fas fa-recycle text-warning" />
                        {/* Reset exam */}
                    </button>
                    <button type="button" title="Delete Candidate" className="btn btn-default ml-2" data-toggle='modal' data-target='#modal-sm' onClick={() => {
                        SetDel(data.id)
                        // demo()
                    }} ><span className="fas fa-trash text-danger" /></button>
                </>
            )
        }
    ];

    const live = () => {
        const liveData = candidateList.filter(c => c.status === 'Started');
        return liveData.length;
    }
    const completed = () => {
        const completeData = candidateList.filter(c => c.status === 'Finished');
        return completeData.length;
    }
    const notstarted = () => {
        const notstartData = candidateList.filter(c => c.status === '');
        return notstartData.length;
    }

    let tableData = {
        columns,
        candidateList
    };

    return (
        <div className="wrapper">
            <Navbar />
            <SideNav />
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="row">
                        <div className="col-lg-3 col-4">
                            <div className="small-box" style={{ background: "#0bda51", color: "white", border: '1px solid #fff', boxShadow: 'box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                                <div className="inner">
                                    <h3>{candidateList.length}</h3>
                                    <p>Total Registered</p>
                                </div>
                                <div className="icon">
                                    <i className="fas fa-users" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-4">
                            <div className="small-box" style={{ background: "#fd0e35", color: "white", border: '1px solid #fff', boxShadow: 'box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                                <div className="inner">
                                    <h3>{live()}</h3>
                                    <p>Live</p>
                                </div>
                                <div className="icon">
                                    <i className="fas fa-clipboard-list"></i>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-4">
                            <div className="small-box" style={{ background: "#ffa700", color: "white", border: '1px solid #fff', boxShadow: 'box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                                <div className="inner">
                                    <h3>{completed()}</h3>
                                    <p>Completed</p>
                                </div>
                                <div className="icon">
                                    <i className="fas fa-clipboard-check"></i>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-4">
                            <div className="small-box" style={{ background: "#176c93", color: "white", border: '1px solid #fff', boxShadow: 'box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
                                <div className="inner">
                                    <h3>{notstarted()}</h3>
                                    <p>Not Started</p>
                                </div>
                                <div className="icon">
                                    <i className="fa fa-th-large" />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-4"><h1>Candidate Management</h1></div>
                            <div className="col-sm-8" style={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column-reverse' }}>
                                <h6 style={{ float: 'right' }}>Exam status :: <i className="fa fa-circle fa-fw blink_me2" /> : Completed &nbsp;| &nbsp;<i className="fa fa-circle fa-fw blink_me" /> : Live &nbsp;| &nbsp; (if Indicator not showing then exam not started)</h6>
                            </div>
                        </div>

                    </div>{/* /.container-fluid */}
                </section>
                {/* Main content */}
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        {/* <center> */}
                                            <button onClick={getUsers} style={{float:"right"}} className='btn btn-info'>
                                                {/* <i className="fas fa-arrow ml-2" /> */}
                                                Refresh
                                            </button>
                                        {/* </center> */}
                                        <DataTableExtensions {...tableData}
                                            filterPlaceholder="Search candidate"
                                            export={true}
                                            print={false}
                                            columns={columns}
                                            data={candidateList}
                                            exportHeaders={true}
                                            fileName="Candidates"
                                        >
                                            <DataTable
                                                defaultSortField="Email"
                                                defaultSortAsc={false}
                                                pagination
                                                highlightOnHover
                                            />
                                        </DataTableExtensions>
                                        {/* Modal start */}
                                        <div className="modal fade" id="modal-lg">
                                            <div className="modal-dialog modal-lg">
                                                <div className="modal-content" style={{ width: '115%' }}>
                                                    <div className="modal-header">
                                                        <h4 className="modal-title">Candidate's Response</h4>
                                                        <span style={{ fontSize: "x-large", marginLeft: "56%" }} className="badge bg-success">{marks}/15</span>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">×</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <div className="row">

                                                            {/*  <div className="col-12">
                                                                <span className='dot  mr-5 ml-5'>
                                                                    <pre className='pre'>{marks}/15</pre>
                                                                </span>
                                                            </div> */}
                                                            <div className="col-12">
                                                                <div className="callout callout-info mt-3 mr-5 mb-2 ml-5">
                                                                    {getResponseTable(paper)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-default" style={{ float: 'right' }} data-dismiss="modal">Close</button>
                                                        {/* <button type="button" className="btn btn-primary">Save changes</button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Delete Modal */}
                                        <div className="modal fade" id="modal-sm">
                                            <div className="modal-dialog modal-sm">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h4 className="modal-title">Delete Candidate</h4>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">×</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <div className="row">
                                                            <div style={{ textAlign: "center" }} className="col-12">
                                                                Are you sure  ?
                                                            </div>
                                                            <div className="col-12 mt-3">
                                                                <center>
                                                                    <button className='btn btn-info' type="button" data-dismiss="modal" onClick={delCandidate} > Yes</button>
                                                                    <button className='btn btn-info ml-3' type="button" data-dismiss="modal" > No</button>
                                                                </center>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/*  <div className="modal-footer justify-content-between">
                                                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                        <ToastContainer
                                            autoClose={2000}
                                            hideProgressBar
                                            newestOnTop={true} />
                                        {/* Reset Modal */}
                                        <div className="modal fade" id="modal-sm2">
                                            <div className="modal-dialog modal-sm">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h4 className="modal-title">Reset Exam</h4>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">×</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <div className="row">
                                                            <div className="col-12" style={{ textAlign: "center" }}>
                                                                Are you sure  ?
                                                            </div>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <div className="col-12">
                                                                <center>
                                                                    <button className='btn btn-info' type="button" data-dismiss="modal" onClick={reSetExam} > Yes</button>
                                                                    <button className='btn btn-info ml-3' type="button" data-dismiss="modal" > No</button>
                                                                </center>
                                                            </div>
                                                        </div>
                                                    </div>
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

export default Home
