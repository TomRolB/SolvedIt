import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {Navbar} from "../../../components/Navbar";
import {ProfilePicture} from "../../../components/ProfilePicture";
import {ReturnButton} from "../../../components/ReturnButton";

export const Leaderboard =() =>{
    const classId = useParams().id
    let [members, setMembers] = useState([])
    let navigate = useNavigate()


    useEffect(() => {
        const getLeaderboard = async () => {
            await axios.get(`/class/byId/${classId}/leaderboard`).then(res => {
                console.log(res.data);
                setMembers(res.data)
            })
                .catch(err => console.log(err))
        }
        getLeaderboard()
        console.log(members);
    }, [classId]);

    const getStudentEntry = (student) =>{
        if(student.userInfo.permissions !== "owner")
            return <tbody>
            <tr className="bg-gray-800 border-gray-700">
                <td className="px-5 py-5 border-b border-gray-700 text-sm">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                            <ProfilePicture uuid={student.uuid} isTransientUuid={true}></ProfilePicture>
                        </div>
                        <div className="ml-3">
                            <p className="text-white whitespace-no-wrap">
                                {student.userInfo.firstName} {student.userInfo.lastName}
                            </p>
                        </div>
                    </div>
                </td>
                <td className="px-5 py-5 border-b text-sm border-gray-700">
                    {student.userInfo.email}
                </td>
                <td className="px-5 py-5 border-b text-sm border-gray-700">
                    {student.userInfo.createdAt}
                </td>
                <td className="px-5 py-5 border-b text-sm border-gray-700">
                    {student.userInfo.upvotes}
                </td>
            </tr>
            </tbody>
    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="min-h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <ReturnButton path={"/class/" + classId}></ReturnButton>
                <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-black-900 md:text-5xl lg:text-6xl col-span-4">Leaderboard</h1>
                <div>
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email Address
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Created at
                                    </th>
                                    <th scope="col" className="px-6 py-3">
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