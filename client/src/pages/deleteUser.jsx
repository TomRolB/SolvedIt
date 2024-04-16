import {useUserUuid} from "../hooks/useUserUuid";
import React, {useEffect, useState} from "react";
import {Navbar} from "../components/Navbar";
import {useNavigate} from "react-router-dom";

export const DeleteUser = () =>{
    let [uuid, setUuid] = useUserUuid()
    let [userData, setData] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        const deleteUser = async () =>{
            fetch(`http://localhost:3001/users/${uuid}/delete`)
                .catch(
                    reason => {console.log(reason)}
                )
        }
        if(uuid) {
            deleteUser()
            localStorage.setItem('uuid','')
            setUuid("")
        }
    }, [uuid]);

    return(
        <div>
            <Navbar></Navbar>
            <p>User has been successfully deleted. Thanks for passing by!</p>
            <button
                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => {
                    navigate("/login")
                }}>
                Return to Login
            </button>
        </div>
    )

}