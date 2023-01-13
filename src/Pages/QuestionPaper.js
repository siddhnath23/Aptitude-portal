import React, { Component, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import CountdownTimer from "react-component-countdown-timer";
import "react-component-countdown-timer/lib/styles.css";
import { Cookies, CookiesProvider, useCookies, withCookies } from 'react-cookie';

const QuestionPaper = () => {
    const Ref = useRef(null);
    const [timer, setTimer] = useState('00:00:00');
    const [qData, SetQData] = useState([]);
    const [quesAns, setQuesAns] = useState([]);
    const [startExamBtn, SetStartExamBtn] = useState(false)
    const [heading, setHeading] = useState("Welcome Candidate")
    // const [countdown, SetCountDown] = useState("")
    const [newTimer, SetNewTimer] = useState("")

    const [cookies, setCookie, removeCookie] = useCookies(['token', 'name', 'email', 'time']);

    const getStorage = () => {
        var x = setInterval(function () {
            var now = new Date().getTime();
            var distance = localStorage.getItem("time") - now;
            console.log(distance);
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            SetNewTimer(minutes + "m:" + seconds + "s ")
            console.log(minutes + "m:" + seconds + "s ");

            if (distance < 0) {
                clearInterval(x);
                // console.log("EXPIRED");
                SetNewTimer("Time Over")
                setTimeout(() => {
                    handleSubmit();
                }, 2000);
            }
        }, 1000);
    }

    useEffect(() => {
        if (cookies.token) {
            if (localStorage.getItem("time")) {
                getStorage();
            } else {
                console.log("its first time pageload")
            }

            document.addEventListener('contextmenu', event => event.preventDefault()); //restrict user to right click
            if (localStorage.getItem("questions")) {
                const existingQues = JSON.parse(localStorage.getItem("questions"))
                //   console.log(existingQues)
                SetQData(existingQues)
                SetStartExamBtn(true)
            } else {
                console.log("proceed with new questions")
            }
            setTimeout(() => {
                handleSubmit();
            }, 1800000);
        } else {
            window.open("/error", "_self")
        }

    }, [])

    const getQuestions = () => {
        axios.post(process.env.REACT_APP_HOST + '/getQuestions', { "email": cookies.email })
            .then(res => {
                // console.log(res.data);
                SetQData(res.data)
                localStorage.setItem("questions", JSON.stringify(res.data));
            })
            .catch(err => { console.log(err) })
    }

    const onClickReset = () => {
        SetStartExamBtn(true);
        getQuestions();
        //code for timer below
        var d1 = new Date();
        var countDownDate = new Date(d1);
        countDownDate.setMinutes(d1.getMinutes() + 30);
        localStorage.setItem("time", countDownDate.getTime());
        getStorage();
    }

    const handleSubmit = () => {
        // console.log(quesAns)
        localStorage.removeItem("questions")
        // SetNewTimer("")
        localStorage.removeItem("time");
        axios.post(process.env.REACT_APP_HOST + '/checkAns', { "quesAns": quesAns, "email": cookies.email })
            .then(res => {
                console.log(res.data)
                if (res.data.status === true) {
                    localStorage.removeItem("time")
                    setCookie('applied', "true")
                    window.open('/result', '_self');
                } else {
                    alert("something went wrong")
                }
            })
            .catch(err => { console.log(err) })
    }

    const handleChange = (e) => {
        // console.log(e.target.name, "::", e.target.value)
        const temp = quesAns;
        const repeat = temp.filter((item) => { return item.Q === e.target.name })
        if (repeat.length !== 0) { //means the element is already presend then replace its answer
            const index = temp.indexOf(repeat[0])
            temp[index].A = e.target.value;
        } else {
            temp.push({ "Q": e.target.name, "A": e.target.value })
            setQuesAns(temp)
        }
        // console.log(quesAns)
    }

    const setQpaper = () => {
        // console.log("qdata::", qData)
        var i = 0;
        return (
            qData.map((Element, index) => {
                // console.log(Element, "::", index)
                var Qcount = 0;
                return (
                    <div key={Element.id} className="row mb-3" style={{ borderBottom: "3px solid #28a745" }} onCopy={(e)=>{e.preventDefault()}}>
                        <div className="col-12" style={{ display: 'inline-grid' }}>
                            <span style={{ float: "left" }}><b>Q{index === 0 ? 1 + ".) " : ++index + ".) "}</b>{Element.category === "programming" ? (<pre>{Element.question}</pre>) : Element.question}</span>
                            <div className="form-group clearfix" onChange={handleChange}>
                                {Element.opt1 !== null && <div className="icheck-primary ml-3" /* style={{ float: "left" }} */>
                                    <input type="radio" id={`radioPrimary${++i}`} value={Element.opt1} name={Element.question} />
                                    <label htmlFor={"radioPrimary" + i}>
                                        {Element.opt1}
                                    </label>
                                </div>}
                                {Element.opt2 !== null && <div className="icheck-primary ml-3" /* style={{ float: "left" }} */>
                                    <input type="radio" id={`radioPrimary${++i}`} value={Element.opt2} name={Element.question} />
                                    <label htmlFor={"radioPrimary" + i}>
                                        {Element.opt2}
                                    </label>
                                </div>}
                                {Element.opt3 !== null && <div className="icheck-primary ml-3" /* style={{ float: "left" }} */>
                                    <input type="radio" id={`radioPrimary${++i}`} value={Element.opt3} name={Element.question} />
                                    <label htmlFor={"radioPrimary" + i}>
                                        {Element.opt3}
                                    </label>
                                </div>}
                                {Element.opt4 !== null && <div className="icheck-primary ml-3" /* style={{ float: "left" }} */>
                                    <input type="radio" id={`radioPrimary${++i}`} value={Element.opt4} name={Element.question} />
                                    <label htmlFor={"radioPrimary" + i}>
                                        {Element.opt4}
                                    </label>
                                </div>}
                            </div>
                        </div>
                    </div>
                )

            })
        )

    }


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="callout callout-info mt-5 mr-5 mb-2 ml-5 row">
                        <div className="col-9">
                            <b><p style={{ textTransform: 'capitalize' }}> Welcome {cookies.name},</p></b>
                            <button hidden={startExamBtn} type="button" onClick={onClickReset} className="mt-2 btn bg-gradient-primary">Click To Start Exam</button>
                            <br />
                            <span className='text-red' hidden={startExamBtn === false}>
                                <b>Note</b>: You have 30 minutes to submit question paper
                            </span>
                        </div>
                        <div className='col-3 '>
                            {/* {startExamBtn !== false &&
                                <CountdownTimer id="timer" {...settings} />
                            } */}
                            <span hidden={startExamBtn===false} style={{ fontSize: "x-large", marginLeft: "56%", fontSize: "x-large", marginLeft: "auto", width: "fit-content" }} className="badge bg-success fixed-top">
                             {newTimer}<i title={"Note :You have only "+newTimer+" left"}  className="fa fa-info-circle ml-4"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-12" hidden={startExamBtn === true}>
                    <div className="callout callout-info mt-2 mr-5 mb-2 ml-5">
                        <p>
                            <b><u>Instructions:</u></b><br />
                            <ul type="circle">
                                <li>Question Paper contains <b>15 Questions.</b></li>
                                <li>Please <b>don't refresh</b> page, as it will clear your Answer selection.</li>
                                <li>You have <b>30 mins</b> to solve the paper.</li>
                                <li>After 30 minutes your paper will get submitted automatically.</li>
                            </ul>

                        </p>
                    </div>
                </div>

            </div>
            {/* delete modal */}
            <div className="modal fade" id="modal-sm">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Submit Paper</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div style={{ textAlign: "center" }} className="col-12">
                                    You have <span style={{ fontSize: "large"}} className="badge bg-success mr-2">{newTimer}</span>time left,<br/>
                                    Are you sure you want to Submit  ?
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <center>
                                        <button className='btn btn-info' onClick={handleSubmit} type="button" data-dismiss="modal"> Yes</button>
                                        <button className='btn btn-info ml-3' type="button" data-dismiss="modal" > No</button>
                                    </center>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row" hidden={startExamBtn === false}>
                <div className="col-12">
                    <div className="callout callout-info mr-5 ml-5">
                        {setQpaper()}
                    </div>
                </div>
            </div>
            <button hidden={startExamBtn === false} style={{ float: "right" }} type="button" data-toggle='modal' data-target='#modal-sm' className="btn bg-gradient-primary mb-5 mr-5">Submit Question Paper</button>
        </div>
    )
}

export default QuestionPaper
