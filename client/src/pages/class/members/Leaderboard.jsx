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
            <tr>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                            <ProfilePicture uuid={student.uuid} isTransientUuid={true}></ProfilePicture>
                        </div>
                        <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">
                                {student.userInfo.firstName} {student.userInfo.lastName}
                            </p>
                        </div>
                    </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{student.userInfo.email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {student.userInfo.createdAt}
                    </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                        {student.userInfo.upvotes}
                    </p>
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