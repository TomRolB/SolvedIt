import {redirect, useNavigate, useParams} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";

export function ClassEdit({uuid, setUuid}) {

    const [classInfo, setClassInfo] = useState({})
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const navigate = useNavigate();

    const {id} = useParams()

    useEffect(() => {
        axios.get(`/class/byId/${id}`).then((res) => {
            console.log(res)
            setClassInfo(res.data)
            setName(res.data.name)
            setDescription(res.data.description)
        }).catch(err => console.log(err))

    }, [])

    const handeDelete = () => {
        axios.delete(`/class/byId/${id}/edit`).then((res) => {
            console.log(res)
            navigate("/home")
        }).catch(err => console.log(err))
    }

    const handleEdit = () => {
        axios.put(`/class/byId/${id}/edit`, {name: name, description: description}).then((res) => {
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

    return (
        <div>
            <Navbar></Navbar>
            <div className={'container py-15 px-10 mx-0 min-w-full flex flex-col items-center'}>
                <h1 className="text-5xl font-extrabold dark:text-black">Edit {classInfo.name}<small className="ms-2 font-semibold text-gray-500 dark:text-gray-400">ID: {classInfo.id}</small></h1>
                <div className={"w-80"}>
                    <form className="flex flex-col space-y-4 mt-4">
                        <input type="text" placeholder="Name" value={name} onChange={handleNameChange} className="border border-gray-300 dark:border-gray-700 rounded-lg p-2"/>
                        <textarea placeholder="Description" value={description} onChange={handleDescriptionChange} className="border border-gray-300 dark:border-gray-700 rounded-lg p-2"/>
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
    )
}