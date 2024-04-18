import React, {useState} from 'react';
import axios from "axios";
import {Navbar} from "../components/Navbar";
import {useNavigate} from "react-router-dom";

export function CreateClass() {
    const [className, setClassName] = useState("")
    const [description, setDescription] = useState("")
    const navigate = useNavigate()

    function handleClassNameChange(event) {
        setClassName(event.target.value)
    }

    function handleDescriptionChange(event) {
        setDescription(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault() //Prevents page from refreshing
        axios
            .post("/class/create-class", {
                name: className,
                description: description,
                uuid: localStorage.getItem("uuid")
            })
            .then((res) => console.log(res.data))
            .catch(err => console.log(err))
        navigate("/home")
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="p-5 h-screen bg-gradient-to-tr from-white to-blue-300">
                <form method="post" onSubmit={handleSubmit}>
                    <label htmlFor="className" className="block mb-2 text-lg font-medium text-gray-900">Class Name:</label>
                    <input className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"} type="text" id="className" name="classtName"
                           onChange={handleClassNameChange}/><br/>
                    <label htmlFor="lastName" className="block mb-2 text-lg font-medium text-gray-900">Description:</label>
                    <input className={"block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"} type="text" id="lastName" name="lastName"
                           onChange={handleDescriptionChange}/><br/>
                    <input className="h-10 w-40 bg-blue-700 text-white text-xl mt-2 md-2 rounded" type="submit"/>
                </form>
            </div>
        </div>
    );
}