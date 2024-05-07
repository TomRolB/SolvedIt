import {redirect, useNavigate, useParams} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";

export function ClassEdit({uuid, setUuid}) {
    const [isAdmin, setIsAdmin] = useState(false)

    const [classInfo, setClassInfo] = useState({})
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const navigate = useNavigate();

    const {id} = useParams()

    function checkUserIsAdmin() {
        axios
            .get("/users/is-admin", {params: {uuid: localStorage.getItem('uuid'), classId: id}})
            .then((res) => setIsAdmin(res.data.isAdmin))
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        checkUserIsAdmin()
        axios.get(`/class/byId/${id}`, {params: {uuid: localStorage.getItem('uuid')}}).then((res) => {
            console.log(res)
            setClassInfo(res.data)
            setName(res.data.name)
            setDescription(res.data.description)
        }).catch(err => console.log(err))

    }, [])

    const handeDelete = () => {
        axios.delete(`/class/byId/${id}/edit`, {params: {uuid: localStorage.getItem('uuid')}}).then((res) => {
            console.log(res)
            navigate("/home")
        }).catch(err => console.log(err))
    }

    const handleEdit = () => {
        axios.put(`/class/byId/${id}/edit`, {name: name, description: description, uuid: localStorage.getItem("uuid")}).then((res) => {
            console.log(res)
            navigate(`/class/${id}`)
        }).catch(err => console.log(err))
    }

    const handleNameChange = (newName) => {
        setName(newName.target.value)
        console.log(name)
    }

    const handleDescriptionChange = (newDescription) => {
        setDescription(newDescription.target.value)
        console.log(description)
    }

    return isAdmin? (
        <div>
            <Navbar></Navbar>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300">
                <div className={'container py-15 px-10 mx-0 min-w-full flex flex-col items-center'}>
                    <h1 className="text-5xl font-extrabold dark:text-black">Edit {classInfo.name}<small className="ms-2 font-semibold text-gray-500 dark:text-gray-800">ID: {classInfo.id}</small></h1>
                    <div className={"w-80"}>
                        <form className="flex flex-col space-y-4 mt-4">
                            <div className="mb-5">
                                <label htmlFor="base-input" className="block mb-2 text-lg font-medium text-gray-900">Class Name</label>
                                <input type="text" id="base-input" value={name} onChange={handleNameChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                            </div>
                            <div className="mb-5">
                                <label htmlFor="base-input" className="block mb-2 text-lg font-medium text-gray-900">Description</label>
                                <textarea value={description} onChange={handleDescriptionChange}  rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
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
    ) : null
}