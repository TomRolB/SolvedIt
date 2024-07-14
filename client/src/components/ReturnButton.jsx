import React from "react";
import {useNavigate} from "react-router-dom";


export const ReturnButton = ({path}) => {

    const navigate = useNavigate()
    const handleReturn = () => {
        navigate(path)
    }

    return (
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-3"
                onClick={handleReturn}><i className="fa-fw fa-solid fa-left-long"></i>Return</button>
    )
}