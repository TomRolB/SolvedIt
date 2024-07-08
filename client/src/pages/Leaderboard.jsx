import {Navbar} from "../components/Navbar";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

export const Leaderboard =() =>{
    const classId = useParams().id
    let [members, setMembers] = useState([])
    let navigate = useNavigate()


    useEffect(() => {
        const getClassMembers = async () => {
            await axios.get(`/class/byId/${classId}/leaderboard`).then(res => {
                console.log(res.data);
                setMembers(res.data)
            })
                .catch(err => console.log(err))
        }
        getClassMembers()
        console.log(members);
    }, [classId]);

    let image = require("../media/image.jpg")
    const getStudentEntry = (student) =>{
        if(student.permissions !== "owner")
            return <tbody>
            <tr>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                            <img className="w-full h-full rounded-full"
                                 src={image}
                                 alt="" />
                        </div>
                        <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">
                                {student.firstName} {student.lastName}
                            </p>
                        </div>
                    </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{student.email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {student.createdAt}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {student.upvotes}
                    </p>
                </td>
            </tr>
            </tbody>
    }
    function handleReturn(){
        navigate("/class/" + classId)
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="min-h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <div className=" flex items-center justify-between pb-6">
                    <div className="flex items-center justify-between">
                    </div>
                </div>
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={handleReturn}><i className="fa-fw fa-solid fa-left-long"></i>Return</button>
                <div>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                <tr>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Email Address
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Created at
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Points
                                    </th>
                                </tr>
                                </thead>
                                {members.map(student => getStudentEntry(student))}

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}