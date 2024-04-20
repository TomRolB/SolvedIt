import {redirect, useNavigate} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

export function Home({uuid, setUuid, classId, setClassId}) {

    const [classRows, setClassRows] = useState([])
    const [userName, setUser] = useState("")

    const [code, setCode] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()

    const createClassRows = (res) => {
        setClassRows(res.map((classInfo) => {
            return <ClassRow name={classInfo.name} description={classInfo.description} id={classInfo.classId}/>
        }))
    }

    const ClassRow = ({name, description, id}) => {
        return (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {name}
                </th>
                <td className="px-6 py-4">
                    {id}
                </td>
                <td className="px-6 py-4">
                    {description}
                </td>
                <td className="px-6 py-4">
                    <a href={"/class/" + id} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a>
                </td>
            </tr>
        );
    }

    const fetchCourseInfo = () => {
        axios.post("/home/get-courses", {uuid: uuid})
            .then((res) => createClassRows(res.data))
            .catch(err => console.log(err))
    }

    const getUser = () => {
        axios.post("/home/get-user", {uuid: uuid})
            .then((res) => {
                console.log(res)
                setUser(res.data)
                console.log(userName)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        // Should not ever set state during rendering, so do this in useEffect instead.
        fetchCourseInfo();
        getUser();
    }, []);


    const sendUuid = () => {
        axios.post("/home", {uuid: uuid})
            .then((res) => console.log(res))
            .catch(err => console.log(err))
    }

    function handleCodeChange(event) {
        setCode(event.target.value)
    }

    function handleCodeJoinResult(result) {
        if (result.data.wasSuccessful) {
            navigate("/class/" + result.data.classId)
        } else {
            setErrorMessage(result.data.errorMessage)
        }
    }

    function handleCodeSubmit(event) {
        event.preventDefault()
        axios
            .post("/invite/join-with-code", {code: code, uuid: uuid})
            .then((res) => handleCodeJoinResult(res))
            .catch(err => console.log(err))
    }
  
    return (
        <div className="h-screen bg-gradient-to-tr from-white to-blue-300">
            <div>
                <Navbar></Navbar>
            </div>
            <div className="pl-5 pt-5">
                <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-black-900 md:text-5xl lg:text-6xl">Welcome<span className="text-transparent bg-clip-text bg-gradient-to-r to-blue-700 from-emerald-600"> {userName}</span>!</h1>
            </div>
            <div className='p-5 grid grid-cols-3 divide-x'>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg col-span-2">
                    <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Class Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Class ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {classRows}
                        </tbody>
                    </table>
                </div>
                <div class="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
                    <button type="button"
                            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        <a href="/class/create-class"><i className="fa-solid fa-plus"></i> Add Class</a>
                    </button>
                    <form onSubmit={handleCodeSubmit}>
                        <label>Join class with code:</label>
                        {errorMessage ? <h1 color={"red"}> {errorMessage} </h1> : null}
                        <input type="text" onChange={handleCodeChange} className="h-10 w-80 border-blue-700 border-2 rounded mt-2 md-2 text-xl"/>
                        <input className="h-10 w-40 bg-blue-700 text-white text-xl mt-2 md-2 rounded" type="submit" value="Submit"/>
                    </form>
                </div>
            </div>
        </div>
    )
}