import {useUserUuid} from "../hooks/useUserUuid";
import React, {useState} from "react";
import {Navbar} from "../components/Navbar";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export const DeleteUser = () =>{
    let [uuid, setUuid] = useUserUuid()
    let [userData, setData] = useState()
    const navigate = useNavigate()

    const handleLogOut = () => {
        axios
            .post("users/logout", {uuid: uuid})
            .then((res) => console.log(res))
            .catch(err => console.log(err))

        localStorage.removeItem("uuid")

        let path = "/login"
        navigate(path)
    }


    console.log(uuid)


    return(
        <div>
            <Navbar></Navbar>
            <p>User has been successfully deleted. Thanks for passing by!</p>
            <button
                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleLogOut}>
                Return to Login
            </button>
        </div>
    )

}