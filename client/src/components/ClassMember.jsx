import React, {useState} from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {ProfilePicture} from "./ProfilePicture";

export const ClassMember =({student, isAdmin, classId, uuid}) =>{
    const [permissions, setPermissions] = useState(student.isTeacher === 0 ? student.permissions: "teacher")

    const handleUserKick = async (student) => {
        console.log(student.id)
        await axios.post(`/class/byId/${classId}/kick-user/${student.id}`).then(res => console.log(res)).catch(err => console.log(err))
    }

    const submitChanges = async () => {
        await axios.put(`/class/byId/${classId}/change-permissions`, {
            userId: student.id,
            permissions: permissions === "teacher" ? "admin": permissions,
            isTeacher: permissions === "teacher" ? 1 : 0
        }).then(res => {
            console.log(res)
        })
            .catch(err => console.log(err))
    }

    return (
    <tbody>
        <tr className="bg-gray-800 border-gray-700">
            <td className="px-5 py-5 border-b border-gray-700 text-sm">
                <div className="flex items-center">
                    <ProfilePicture uuid={uuid} isTransientUuid={true}></ProfilePicture>
                    <div className="ml-3">
                        <p className="text-white whitespace-no-wrap">
                            {student.firstName} {student.lastName}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-5 border-b text-sm border-gray-700">
                {student.permissions === "normal" ? ( !isAdmin? (
                            <div className="ml-3">
                                <p className="text-white whitespace-no-wrap">
                                    Normal
                                </p>
                            </div>
                        ):
                    <select id="new-questions"
                            disabled={!isAdmin}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={permissions}
                            onChange={(e) => setPermissions(e.target.value)}
                    >
                        <option selected value="normal">Normal</option>
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                    </select>
                ) : student.isTeacher === 1 ? ( !isAdmin? (
                            <div className="ml-3">
                                <p className="text-white whitespace-no-wrap">
                                    Teacher
                                </p>
                            </div>
                        ):
                    <select id="new-questions"
                            disabled={!isAdmin}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={permissions}
                            onChange={(e) => setPermissions(e.target.value)}
                    >
                        <option value="normal">Normal</option>
                        <option value="admin">Admin</option>
                        <option selected value="teacher">Teacher</option>
                    </select>
                ): student.permissions === "admin" ? ( !isAdmin? (
                            <div className="ml-3">
                                <p className="text-white whitespace-no-wrap">
                                    Admin
                                </p>
                            </div>
                        ):
                    <select id="new-questions"
                            disabled={!isAdmin}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={permissions}
                            onChange={(e) => setPermissions(e.target.value)}
                    >
                        <option value="normal">Normal</option>
                        <option selected value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                    </select>
                ) : (
                    <div className="ml-3">
                        <p className="text-white whitespace-no-wrap">
                            Owner
                        </p>
                    </div>
                )
                }
            </td>
            <td className="px-5 py-5 border-b text-sm border-gray-700">
                <p className="text-white whitespace-no-wrap">
                    {student.createdAt}
                </p>
            </td>
            <td className="px-5 py-5 border-b border-gray-700 text-sm">
                {/*TODO: create the button to report them (but that's further)*/}
                {isAdmin && student.permissions !== "owner" ? <>
                    <button onClick={()=>{
                        handleUserKick(student)
                        toast.success("Student has been kicked")
                    }} type="button"
                            className="focus:outline-none text-white bg-red-700 hover:bg-green-800 focus:ring-4
                                                focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600
                                                dark:hover:bg-red-700 dark:focus:ring-red-800"><a>Kick student from class</a></button>
                    <button type="button"
                            onClick={() => {
                                submitChanges()
                                toast.success("Changes have been submitted")
                            }}
                            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        Confirm Changes
                    </button>
                </>: null}
            </td>
        </tr>
    </tbody>
    )
}