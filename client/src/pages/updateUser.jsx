import {Navbar} from "../components/Navbar";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useUserUuid} from "../hooks/useUserUuid";
import {useNavigate} from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ProfileChanger = ()=>{
    const namesInputStyle = "h-10 w-40 border-blue-700 border-2 rounded mt-2 md-2 text-xl";

    const [data, setData] = useState({})
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const [uuid, setUuid] = useUserUuid()
    const navigate = useNavigate()
    useEffect(()=>{
        axios.get(`/users/${uuid}`).then(res =>{
            console.log(res)
            setData(res.data)
            setFirstName(res.data.firstName)
            setLastName(res.data.lastName)
        }).catch(err => console.log(err))
    }, [])



    const handleEdit = (event) => {
        event.preventDefault()
        axios
            .put(`/users/${uuid}/update`, {firstName: firstName, lastName: lastName})
            .then(res => console.log(res))
            .catch(err => console.log(err))
            toast.success("Name updated successfully")
        navigate("/home")
    }

    const handleFirstNameChange = (newFirstName) =>{
        setFirstName(newFirstName.target.value)
        console.log(newFirstName)
    }
    const handleLastNameChange = (newLastName) =>{
        setLastName(newLastName.target.value)
        console.log(newLastName)
    }


    return (
        <div>
        <Navbar></Navbar>
            <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-white to-blue-300">
                <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">Update your name</h5>
                    <form>
                        <div className="flex flex-row">
                            <div className="p-10">
                                <label htmlFor="firstName" className="block text-lg font-bold dark:text-white">New First name:</label>
                                <input type="text" id="firstName" name="firstName" onChange={handleFirstNameChange} className="bg-gray-50 border border-white-700 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-300 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input><br/>
                                <label htmlFor="large-input" className="block text-lg font-bold dark:text-white">New Last name: </label>
                                <input type="text" id="lastName" name="lastName" onChange={handleLastNameChange} className="bg-gray-50 border border-white-700 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-300 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input><br/>
                                <button className="h-10 w-40 bg-blue-700 text-white text-xl mt-2 md-2 rounded" type="submit" value="Update" onClick={handleEdit}>
                                    <i className="fa-solid fa-pen-to-square"></i> Update
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}