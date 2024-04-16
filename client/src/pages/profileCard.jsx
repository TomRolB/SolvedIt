import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import '../styles/ProfileCard.css';
import {useUserUuid} from "../hooks/useUserUuid";
export const ProfileCard = () => {
    let [uuid, setUuid] = useUserUuid()
    //Profile gets and updates uuid
    let [userData, setData] = useState()
    useEffect(() => {
        const fetchUserData = async () =>{
                fetch(`http://localhost:3001/users/${uuid}`).then(
                    response => response.json()
                ).then(
                    response =>
                    setData(response))
                    .catch(
                    reason => {console.log(reason)}
            )
        }
        if(uuid) {
            fetchUserData()
        }
    }, [uuid]);

    console.log(userData) //Funca :)
    const navigate = useNavigate();
    const redirectStyle = "flex-col-reverse text-blue-700 underlineflex-col-reverse text-blue-700 underline"
    const subtitleStyle = "flex-col-reverse text-black-700 underlineflex-col-reverse text-black-700 underline"

    if(!userData){
        return <p>Loading...</p>
    }

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
                                        src={require("../media/image.jpg")}
                                        alt="Avatar" className="img-fluid my-5 h-20 rounded-full" style={{width: "80px"}}/>
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body p-4">
                                        <h1 className={subtitleStyle}>User Information</h1>
                                        <hr className="mt-0 mb-4"/>
                                        <div className="row pt-1">
                                            <div className="col-6 mb-3">
                                                <h6 className={subtitleStyle}>Email: </h6>
                                                <p className="text-muted">{userData.email}</p>
                                            </div>
                                            <div className="col-6 mb-3">
                                                <h6 className={subtitleStyle}>Name</h6>
                                                <p className="text-muted">{userData.firstName} {userData.lastName} <button
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
                onClick={()=>{
                    navigate("/delete-user")
                }}
                >
                    Delete Profile
                </button>
            </div>
        </section>
    )
}


