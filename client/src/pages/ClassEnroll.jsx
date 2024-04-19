import {useUserUuid} from "../hooks/useUserUuid";
import React, {useEffect, useState} from "react";
import "../styles/LinkEnterPopUp.css"
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {Navbar} from "../components/Navbar";

export const ClassEnroll = ()=>{
    let [link, setLink] = useState("")
    let [uuid, setUuid] = useUserUuid()
    let [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
    const classLinkFormat = /\bhttp:\/www.solvedit.com\/enroll-to\/\d\b/i
    const trueClassLink = /\d+\b/i
    let id = Number(link.match(trueClassLink))
    console.log("ID: "+ id)
    console.log(typeof id)
    const handleLinkChange = (event) =>{
        setLink(event.target.value)
        console.log("Link: " + link)
    }

    const handleSubmit = () => {
        axios.post(`/class/${uuid}/enroll-to/${id}`).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
        navigate(`/class/${id}`)
    }

    return(
        <div>
            <Navbar></Navbar>
            <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
                <h1 className="text-4xl font-medium">Enroll to class</h1>
                <p className="text-slate-500">Fill up the form to enroll to a class</p>
                <form className="my-10">
                    <div className="flex flex-col space-y-5">
                        <p className="font-medium text-slate-700 pb-2">Class Link</p>
                        { errorMessage != null ? <h1 color={"red"}> {errorMessage} </h1> : null }
                        <input type="text" className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow" placeholder="Enter class link" value={link} onChange={handleLinkChange}/>
                        <button className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center" onClick={handleSubmit}>
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clip-rule="evenodd"/>
                            </svg>
                            <span>Enroll</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

}