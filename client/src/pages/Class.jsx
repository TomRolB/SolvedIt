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
            </div>
        </div>
    )
}