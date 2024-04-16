import {Navbar} from "../components/Navbar";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useUserUuid} from "../hooks/useUserUuid";
import {useNavigate} from "react-router-dom";

export const ProfileChanger = ()=>{
    const namesInputStyle = "h-10 w-40 border-blue-700 border-2 rounded mt-2 md-2 text-xl";
    const labelStyle = "text-2xl"

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



    const handleEdit = () => {
        axios.put(`/users/${uuid}/update`, {firstName: firstName, lastName: lastName}).then((res) => {
            console.log(res)
            navigate("/profile")
        }).catch(err => console.log(err))
    }

    const handleFirstNameChange = (newFirstName) =>{
        setFirstName(newFirstName.target.value)
        console.log(newFirstName)
    }
    const handleLastNameChange = (newLastName) =>{
        setFirstName(newLastName.target.value)
        console.log(newLastName)
    }


    return (
        <div>
        <Navbar></Navbar>
            <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-white to-blue-300">
                <form>
                    <div className="flex flex-row">
                        <div>
                            <label className={labelStyle} htmlFor="firstName">New First name: </label><br/>
                            <input className={namesInputStyle + " mr-3"} type="text" id="firstName" name="firstName"
                                   onChange={handleFirstNameChange}/><br/>
                            <label className={labelStyle} htmlFor="lastName">New Last name: </label><br/>
                            <input className={namesInputStyle} type="text" id="lastName" name="lastName"
                                   onChange={handleLastNameChange}/><br/>
                            <button className="h-10 w-40 bg-blue-700 text-white text-xl mt-2 md-2 rounded" type="submit" value="Update" onClick={handleEdit}>
                                <i className="fa-solid fa-pen-to-square"></i> Update
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}