import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cookies, CookiesProvider, useCookies, withCookies } from 'react-cookie'

const Result = () => {
    const [marks, setMarks] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'name', 'email', 'type', 'applied']);

    const checkApplied = () => {
        axios.post(process.env.REACT_APP_HOST + '/checkApplied', { "email": cookies.email })
            .then(res => {
                console.log(res.data)
                if (res.data.status === true) {
                    // alert("YOu have applied successfully your marks are" + res.data.candidate[0].marks)
                    setMarks(res.data.candidate[0].marks)
                } else {
                    alert("something went wrong")
                }
            })
            .catch(err => { console.log(err) })
    }

    useEffect(() => {
        // checkApplied();
        if (cookies.token && cookies.applied==="true") {
            removeCookie("token", { path: '/' })
            removeCookie("email", { path: '/' })
            removeCookie("name", { path: '/' })
            removeCookie("type", { path: '/' })
            removeCookie("applied", { path: '/' })   //this might not be usefull
            setTimeout(() => {
                window.open('/', '_self')
            }, 5000);
        } else {
            window.open("/error", "_self")
        }

    }, [])

    return (
        <div className="container-fluid" >
            <div className="row">
                <div className="col-12">
                    <div className="card card-primary card-outline m-5">
                        <div className="card-header">
                            <h5 className="m-0">Dear Candidate,</h5>
                        </div>
                        <div className="card-body">
                            <p className="card-text">Thanks For Participating</p>
                            {/* <p className="card-text">You have scored <b>{marks}</b> marks</p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Result
