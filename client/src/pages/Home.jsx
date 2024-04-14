import {redirect} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

export function Home({uuid, setUuid}) {

    const [classRows, setClassRows] = useState([])

    const createClassRows = (res) => {
        setClassRows(res.map((classInfo) => {
            return <ClassRow name={classInfo.name} description={classInfo.description} id={classInfo.id}/>
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
        axios.get("/home")
            .then((res) => createClassRows(res.data))
            .catch(err => console.log(err))
    }

    useEffect(() => {
        // Should not ever set state during rendering, so do this in useEffect instead.
        fetchCourseInfo();
    }, []);

    return (
        <>
            <div>
                <Navbar></Navbar>
            </div>
            <div className='p-5 grid grid-cols-2 divide-x'>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                    <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        <a href="/class/create-class"><i className="fa-solid fa-plus"></i> Add Class</a>
                    </button>
                </div>
            </div>
        </>
    )
}