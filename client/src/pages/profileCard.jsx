import {useNavigate} from "react-router-dom";
import React from 'react';
import '../styles/ProfileCard.css';
export const ProfileCard = () => {
    const navigate = useNavigate();
    const redirectStyle = "flex-col-reverse text-blue-700 underlineflex-col-reverse text-blue-700 underline"
    const subtitleStyle = "flex-col-reverse text-black-700 underlineflex-col-reverse text-black-700 underline"
    return (
        <section className="vh-100" style={{backgroundColor: "#f4f5f7"}}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-lg-6 mb-4 mb-lg-0">
                        <div className="card mb-3" style={{borderRadius: ".5rem"}}>
                            <div className="row g-0">
                                <div className="col-md-4 gradient-custom text-center text-white"
                                     style={{borderTopLeftRadius: ".5rem; border-bottom-left-radius: .5rem"}}>
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                        alt="Avatar" className="img-fluid my-5" style={{width: "80px"}}/>
                                    <h5>Marie Horwitz</h5>
                                    <p>Web Designer</p>
                                    <i className="far fa-edit mb-5"></i>
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body p-4">
                                        <h1>User Information</h1>
                                        <hr className="mt-0 mb-4"/>
                                        <div className="row pt-1">
                                            <div className="col-6 mb-3">
                                                <h6 className={subtitleStyle}>Email</h6>
                                                <p className="text-muted">info@example.com</p>
                                            </div>
                                            <div className="col-6 mb-3">
                                                <h6 className={subtitleStyle}>Name</h6>
                                                <p className="text-muted">123 456 789 <button
                                                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                    onClick={() => {
                                                        navigate("/update-user")
                                                    }}>Change Username</button></p>

                                            </div>
                                            <div className="col-6 mb-3">
                                                <h6><a href="/update-user" className={redirectStyle}>Notification
                                                    Settings</a></h6>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => {
                        navigate("/home")
                    }}>
                    Home
                </button>
                <button
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                    Delete Profile
                </button>
            </div>
        </section>
    )
}


