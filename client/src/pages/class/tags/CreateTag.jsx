import React, {useState} from 'react';
import axios from "axios";
import {Navbar} from "../../../components/Navbar";
import {useNavigate, useParams} from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {ReturnButton} from "../../../components/ReturnButton";

export function CreateTag() {
    const [tagName, setTagName] = useState("")
    const navigate = useNavigate()
    let {id} = useParams()

    function handleClassNameChange(event) {
        setTagName(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault()
        axios
            .post(`/class/byId/${id}/create-tag`, {
                name: tagName,
                classId: id,
                uuid: localStorage.getItem("uuid")
            })
            .then((res) => {
                console.log("a")
                console.log(res.data)
                navigate("/class/" + id)
                console.log("Navigating")
            })
            .catch(err => console.log(err))
        toast.success("Tag created successfully")
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="p-5 min-h-screen bg-gradient-to-tr from-white to-blue-300">
                <ReturnButton path={`/class/${id}`}></ReturnButton>
                <div className="screen flex items-center justify-center">
                    <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">Create Tag</h5>
                        <form method="post" onSubmit={handleSubmit} className="p-10">
                            <label htmlFor="className" className="block text-lg font-bold dark:text-white mb-2">Tag Name:</label>
                            <input className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"} type="text" id="className" name="classtName"
                                   onChange={handleClassNameChange}/><br/>
                            <input className="h-10 w-40 bg-blue-700 text-white text-xl mt-2 md-2 rounded " type="submit"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}