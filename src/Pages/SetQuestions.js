import React, { Component, useEffect, useState, useRef } from 'react';
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SideNav from "../components/SideNav"
import axios from 'axios';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import readXlsxFile from 'read-excel-file';
import useValidator from './../components/validator/useValidator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cookies, CookiesProvider, useCookies, withCookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const SetQuestions = () => {
    const [data, SetData] = useState({ question: "", opt1: "", opt3: "", opt4: "", ans: "", type: "", category: "" });
    const [showrepeated, SetShowRepeated] = useState(false)
    const [allQues, SetAllQues] = useState([]);
    const [delQue, SetDelQue] = useState(0);
    const [fileData, SetFileData] = useState([]);
    const [repeatedQs, SetRepeatedQs] = useState([]);
    const [validator, showMessages] = useValidator()

    // const [updtQue,SetUpdtQue]= useState(0);
    const [modalHeading, SetModalHeading] = useState("Add Question")

    const [cookies, setCookie] = useCookies(['token', 'name', 'email', 'type', 'applied']);

    const handleChange = (prop) => (e) => {
        SetData({ ...data, [prop]: e.target.value });
    }

    const handleFile = (e) => {
        const filename = e.target.files[0];
        console.log(filename.name)
        // SetFilename(filename.name)
        readXlsxFile(filename).then((rows) => {
            // console.log("rows::",rows)
            SetFileData(rows)
        })
    }

    /* const ShowrepeatedQ = () => {
        return (
            // <h2>Repeated Questions</h2>
            repeatedQs.map(item => {
                console.log("item::", item)
                return (
                    <h1>{item.question}</h1>
                )
            })
        )
    } */

    /*  const repeatToast = () => {
         toast.success(ShowrepeatedQ(), {
             position: toast.POSITION.TOP_RIGHT
         });
     } */

    const delToast = () => {
        toast.success("Deleted Successfully !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const AddToast = () => {
        toast.success("Added Successfully !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const updateToast = () => {
        toast.success("Updated Successfully !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const ErrToast = () => {
        toast.error("Something went wrong or your excel file rows or columns may not support !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const AnsToast = () => {
        toast.error("Answer should be One from the Four options !", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    const submitFile = () => {
        const keys = fileData[0];
        const final = [];
        for (let i = 1; i < fileData.length; i++) {
            const temp = fileData[i];
            const json = {};
            temp.forEach((element, index) => {
                json[keys[index]] = element;
            });
            final.push(json)
        }
        // console.log("final::",final)

        axios.post(process.env.REACT_APP_HOST + "/bulkQuestions", { "Questions": final })
            .then(res => {
                // console.log(res.data)
                if (res.data.status === true) {
                    AddToast();
                    if (res.data.repeated.length !== 0) {
                        SetRepeatedQs(res.data.repeated)
                        SetShowRepeated(true)
                        getAllQuestions();
                    } else {
                        AddToast();
                        getAllQuestions();
                        window.location.reload();
                    }
                } else {
                    ErrToast();
                }
            })
            .catch(err => { console.log(err) })
    }

    const getAllQuestions = () => {
        axios.get(process.env.REACT_APP_HOST + "/getAllQuestions")
            .then(res => SetAllQues(res.data))
            .catch(err => { console.log(err) })
    }

    const closeErrors = () => {
        showMessages(false)
    }

    const handleUpdate = () => {
        // console.log(data)
        if (validator.allValid()) {

            axios.post(process.env.REACT_APP_HOST + "/updateQuestion", data)
                .then(res => {
                    console.log(res.data)
                    if (res.data === true) {
                        updateToast()
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);

                    } else {
                        ErrToast();
                    }
                })
                .catch(err => { console.log(err) })
        } else {
            showMessages(true)
        }
    }

    useEffect(() => {

        if (cookies.token) {
            getAllQuestions();
        } else {
            window.open("/error", "_self")
        }

    }, [])

    const DelQuestion = () => {
        // console.log("DelQuestion::",delQue)
        axios.post(process.env.REACT_APP_HOST + "/delQuestion", { "queID": delQue })
            .then(res => {
                if (res.data === true) {
                    delToast();
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000);
                } else {
                    // alert("something went wrong")
                    ErrToast()
                }
            })
            .catch(err => { console.log(err) })
    }

    const handleSubmit = () => {
        if (validator.allValid()) {

            // console.log(data)
            if (data.ans === data.opt1 || data.ans === data.opt2 || data.ans === data.opt3 || data.ans === data.opt4) {
                console.log("proceed")
                axios.post(process.env.REACT_APP_HOST + '/setQuestion', data)
                    .then(res => {
                        console.log(res.data)
                        if (res.data === true) {
                            AddToast();
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } else {
                            ErrToast();
                        }
                    })
                    .catch(err => { console.log(err) })

            } else {
                AnsToast();
            }
        } else {
            showMessages(true)

        }
    }

    let columns = [
        {
            selector: (row) => row.question,
            name: "Question",
            sortable: true
        },
        {
            selector: (row) => row.opt1,
            name: "Option1",
            sortable: true
        },
        {
            selector: (row) => row.opt2,
            name: "Option2",
            sortable: true
        }, {
            selector: (row) => row.opt3,
            name: "Option3",
            sortable: true
        }, {
            selector: (row) => row.opt4,
            name: "Option4",
            sortable: true
        },
        {
            selector: (row) => row.ans,
            name: "Answer",
            sortable: true
        },
        {
            selector: (row) => row.category,
            name: "Category",
            sortable: true
        },
        {
            // selector: (row) => row.usertype,
            name: "Actions",
            sortable: true,
            cell: (data) => {
                // console.log(data)
                return (
                    <>
                        <button className='btn btn-info' title="Delete Question" data-toggle='modal' data-target='#modal-sm' onClick={() => { SetDelQue(data.id) }}><i className="fas fa-trash" ></i></button>
                        <button className='btn btn-info ml-2' title="Update Question" data-toggle='modal' data-target='#modal-lg2' onClick={() => {
                            SetModalHeading("Update Question")
                            SetData(data)
                            // SetUpdtQue(data.id)
                        }}><i className="fas fa-edit" ></i></button>
                    </>
                )
            }
        }
    ];

    let tableData = {
        columns,
        allQues
    };

    const handleClose = () => {
        SetShowRepeated(false);
        window.location.reload();
    }

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
                                <h1>Questions Management</h1>
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
                                        <button style={{ float: "right" }} className='btn btn-info ml-2' data-toggle='modal' data-target='#modal-lg2' onClick={() => {
                                            SetModalHeading("Add Question")
                                            SetData({ question: "", opt1: "", opt2: "", opt3: "", opt4: "", ans: "", type: "", category: "" })
                                        }} >Add<i className="fas fa-plus ml-2" /></button>
                                        <button style={{ float: "right" }} className='btn btn-info ml-2' data-toggle='modal' data-target='#modal-sm3'>Bulk Upload<i className="fas fa-plus ml-2" /></button>
                                        <DataTableExtensions {...tableData}
                                            columns={columns}
                                            data={allQues}
                                            export={false}
                                            print={false}
                                            exportHeaders={false}
                                            filterPlaceholder="Search Question"
                                        >
                                            <DataTable
                                                defaultSortField="Question"
                                                defaultSortAsc={false}
                                                pagination
                                                highlightOnHover
                                            />
                                        </DataTableExtensions>
                                    </div>
                                    {/* Repeated questiions modal */}
                                    <Modal show={showrepeated} size="lg" onHide={handleClose} scrollable={true}>
                                        <Modal.Header >
                                            <Modal.Title>Repeated Questions which are not Uploaded are,</Modal.Title>
                                            <Button className="close" variant="secondary bg-default" onClick={handleClose}>
                                                <span aria-hidden="true">×</span>
                                            </Button>
                                        </Modal.Header>
                                        <Modal.Body >
                                            <ul>
                                                {(() => {
                                                    return (
                                                        repeatedQs.map(item => {
                                                            // console.log("items new::",item)
                                                            return (
                                                                <li className="mt-3"><b>{item.question}</b></li>
                                                            )
                                                        })
                                                    )
                                                })()}
                                            </ul>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary bg-info" onClick={handleClose}>
                                                Close
                                            </Button>
                                            {/*  <Button variant="primary" onClick={handleClose}>
                                                Save Changes
                                            </Button> */}
                                        </Modal.Footer>
                                    </Modal>
                                    {/* Bulk Upload Modal */}
                                    <div className="modal fade" id="modal-sm3">
                                        <div className="modal-dialog modal-sm3">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    {/* <h4 className="modal-title">Large Modal</h4> */}
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">×</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            Upload Excel File
                                                        </div>
                                                    </div>
                                                    <div className="row mt-3">
                                                        <div className="col-12">
                                                            <div className="input-group mb-3">
                                                                <input type="file" accept=".xls,.xlsx" id="input" onChange={handleFile} className="form-control" />
                                                                <div className="input-group-append">
                                                                    <div className="input-group-text">
                                                                        <span className="fas fa-question-circle" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/*  <span className='text-red'>
                                                                {validator.message('Excel File', filename, 'required')}
                                                            </span> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-footer float-right">
                                                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                                    <button type="button" onClick={submitFile} data-dismiss="modal" className="btn btn-info">Upload</button>
                                                </div>
                                            </div>
                                        </div>
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
                                                    <h4 className="modal-title">Delete Question</h4>
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
                                                        <div className="col-12" >
                                                            <center>
                                                                <button className='btn btn-info' type="button" data-dismiss="modal" onClick={DelQuestion} > Yes</button>
                                                                <button className='btn btn-info ml-3' type="button" data-dismiss="modal" > No</button>
                                                            </center>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Add Question Modal */}
                                    <div className="modal fade" id="modal-lg2">
                                        <div className="modal-dialog modal-lg">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h4 className="modal-title">{modalHeading}</h4>
                                                    <button type="button" onClick={closeErrors} className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">×</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="container-fluid">
                                                        <form method="post" >
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <div className="input-group mb-3">
                                                                        <input type="text" onChange={handleChange("question")} value={data.question} name="question" className="form-control" placeholder="Question" />
                                                                        <div className="input-group-append">
                                                                            <div className="input-group-text">
                                                                                <span className="fas fa-question-circle" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className='text-red'>
                                                                        {validator.message('Question', data.question, 'required')}
                                                                    </span>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="input-group mb-3">
                                                                        <input type="text" onChange={handleChange("opt1")} value={data.opt1} name="opt1" className="form-control" placeholder="Option1" />
                                                                        <div className="input-group-append">
                                                                            <div className="input-group-text">
                                                                                <span className="fas fa-dot-circle" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className='text-red'>
                                                                        {validator.message('Option 1', data.opt1, 'required')}
                                                                    </span>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="input-group mb-3">
                                                                        <input type="text" onChange={handleChange("opt2")} value={data.opt2} name="opt2" className="form-control" placeholder="Option2" />
                                                                        <div className="input-group-append">
                                                                            <div className="input-group-text">
                                                                                <span className="fas fa-dot-circle" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className='text-red'>
                                                                        {validator.message('Option 2', data.opt2, 'required')}
                                                                    </span>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="input-group mb-3">
                                                                        <input type="text" onChange={handleChange("opt3")} value={data.opt3} name="opt3" className="form-control" placeholder="Option3" />
                                                                        <div className="input-group-append">
                                                                            <div className="input-group-text">
                                                                                <span className="fas fa-dot-circle" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className='text-red'>
                                                                        {validator.message('Option 3', data.opt3, 'required')}
                                                                    </span>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="input-group mb-3">
                                                                        <input type="text" onChange={handleChange("opt4")} value={data.opt4} name="opt4" className="form-control" placeholder="Option4" />
                                                                        <div className="input-group-append">
                                                                            <div className="input-group-text">
                                                                                <span className="fas fa-dot-circle" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className='text-red'>
                                                                        {validator.message('Option 4', data.opt4, 'required')}
                                                                    </span>
                                                                </div>
                                                                <div className="col-12">
                                                                    <div className="input-group mb-3">
                                                                        <input type="text" onChange={handleChange("ans")} value={data.ans} name="ans" className="form-control" placeholder="Correct Answer" />
                                                                        <div className="input-group-append">
                                                                            <div className="input-group-text">
                                                                                <span className="fas fa-check" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span className='text-red'>
                                                                        {validator.message('Answer', data.ans, 'required')}
                                                                    </span>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="input-group mb-3">
                                                                        <div class="form-group" style={{ width: '100%' }}>
                                                                            {/* <label>Type</label> */}
                                                                            <select class="custom-select" name="type" value={data.type} onChange={handleChange("type")}>
                                                                                <option hidden selected>Type</option>
                                                                                <option value="fresher">Fresher</option>
                                                                                {/*  <option value="1-3 years">1-3 years</option>
                                                                                <option value="3-5 years">3-5 years</option>
                                                                                <option value="5+ years">5+ years</option> */}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <span className='text-red'>
                                                                        {validator.message('Type', data.type, 'required')}
                                                                    </span>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="input-group mb-3">
                                                                        <div class="form-group" style={{ width: '100%' }}>
                                                                            <select class="custom-select" name="category" value={data.category} onChange={handleChange("category")}>
                                                                                <option hidden selected>Category</option>
                                                                                <option value="technical">Technical</option>
                                                                                <option value="logical">Logical</option>
                                                                                <option value="verbal">Verbal</option>
                                                                                {/* <option value="sql">sql</option> */}

                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <span className='text-red'>
                                                                        {validator.message('Category', data.category, 'required')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </form>

                                                    </div>
                                                </div>
                                                <div className="modal-footer float-right">
                                                    <button type="button" onClick={closeErrors} className="btn btn-default" data-dismiss="modal">Close</button>
                                                    <button type="button" hidden={modalHeading === "Update Question"} onClick={handleSubmit} className="btn btn-primary" ><i className='fa fa-plus'> Add</i></button>
                                                    <button type="button" hidden={modalHeading === "Add Question"} onClick={handleUpdate} className="btn btn-primary" ><i className='fa fa-pencil'> Update </i></button>
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

export default SetQuestions
