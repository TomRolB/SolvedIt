import {redirect, useParams} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";

export function Class({uuid, setUuid, classId, setClassId}) {

    const [classInfo, setClassInfo] = useState([{}])
    let {id} = useParams()

    useEffect(() => {
        axios.get(`/class/byId/${id}`).then((res) => {
            setClassInfo(res.data)
        }).catch(err => console.log(err))

    }, []);

    const CourseInfo = () => {
        return (
            <div>
                <h1 className="text-5xl font-extrabold dark:text-black">{classInfo.name}<small className="ms-2 font-semibold text-gray-500 dark:text-gray-400">ID: {classInfo.id}</small></h1>
                <p className="my-4 text-lg text-gray-500">{classInfo.description}</p>
            </div>
        )

    }

    return (
        <div>
            <Navbar></Navbar>
            <div>
                <CourseInfo/>
                <button type="button"
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                    <a href={"/class/" + id + "/invites"}><i className="fa-solid fa-plus"></i> Manage Invitations</a>
                </button>
            </div>
        </div>
    )
}