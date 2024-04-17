import {redirect, useParams} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";

export function Class({uuid, setUuid}) {

    const [classInfo, setClassInfo] = useState([{}])
    let {id} = useParams()

    useEffect(() => {
        axios.get(`/class/byId/${id}`).then((res) => {
            setClassInfo(res.data)
        }).catch(err => console.log(err))

    }, []);

    const CourseInfo = () => {
        if (classInfo === null) return (<h1>Class not found</h1>)
        return (
            <div>
                <h1 className="text-5xl font-extrabold dark:text-black">{classInfo.name}<small className="ms-2 font-semibold text-gray-500 dark:text-gray-400">ID: {classInfo.id}</small></h1>
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    <a href={`/class/${id}/edit`}><i className="fa-solid fa-pen-to-square"></i> Edit Class</a>
                </button>
                <p className="my-4 text-lg text-gray-500">{classInfo.description}</p>
            </div>
        )

    }

    return (
        <div>
            <Navbar></Navbar>
            <div>
                <CourseInfo/>
            </div>
        </div>
    )
}