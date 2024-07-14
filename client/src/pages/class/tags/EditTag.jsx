import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Navbar} from "../../../components/Navbar";
import {ReturnButton} from "../../../components/ReturnButton";


export function EditTag() {
    const [name, setName] = useState("")
    const [tagInfo, setTagInfo] = useState({})
    const navigate = useNavigate();

    const {id, tagId} = useParams()

    useEffect(() => {
        axios.get(`/tag/${id}/tags/${tagId}`, {}).then((res) => {
            console.log(res)
            setTagInfo(res.data)
            setName(res.data.name)
        }).catch(err => console.log(err))

    }, [])

    const handeDelete = () => {
        axios.delete(`/tag/${id}/tags/${tagId}`, {}).then((res) => {
            console.log(res)
            navigate(`/class/${id}`)
        }).catch(err => console.log(err))
        toast.success("Tag deleted successfully")
    }

    const handleEdit = () => {
        axios.put(`/tag/${id}/tags/${tagId}`, {name: name}).then((res) => {
            console.log(res)
            navigate(`/class/${id}`)
        }).catch(err => console.log(err))
        toast.success("Tag updated successfully")
    }

    const handleNameChange = (newName) => {
        setName(newName.target.value)
        console.log(name)
    }


    return (
        <div>
            <Navbar></Navbar>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <ReturnButton path={`/class/${id}/view-tags`}/>
                <div className={'container py-15 px-10 mx-0 min-w-full flex flex-col items-center'}>
                    <h1 className="text-5xl font-extrabold dark:text-black">Edit {tagInfo.name}<small className="ms-2 font-semibold text-gray-500 dark:text-gray-800">ID: {tagInfo.id}</small></h1>
                    <div className={"w-80"}>
                        <form className="flex flex-col space-y-4 mt-4">
                            <div className="mb-5">
                                <label htmlFor="base-input" className="block mb-2 text-lg font-medium text-gray-900">Class Name</label>
                                <input type="text" id="base-input" value={name} onChange={handleNameChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                        </form>
                        <div className={"pt-5 flex flex-col items-center"}>
                            <button type="submit" className="w-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    onClick={handleEdit}>
                                <i className="fa-solid fa-pen-to-square"></i> Edit Class
                            </button>
                            <button type="submit" className="w-1/2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                    onClick={handeDelete}>
                                <i className="fa-solid fa-trash"></i> Delete Class
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}