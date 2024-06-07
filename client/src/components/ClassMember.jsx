import image from "../media/image.jpg";
import React, {useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

export const ClassMember =({student, isAdmin, classId}) =>{
    const [permissions, setPermissions] = useState(student.permissions)
    const [isTeacher, setIsTeacher] = useState(student.isTeacher)

    const handleUserKick = async (student) => {
        console.log(student.id)
        await axios.post(`/class/byId/${classId}/kick-user/${student.id}`).then(res => console.log(res)).catch(err => console.log(err))
    }
    console.log(student)


    return (
    <tbody>
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
                {student.permissions === "normal" ? (
                    <select id="new-questions"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={permissions}
                            onChange={(e) => setPermissions(e.target.value)}
                    >
                        <option selected value="normal">Normal</option>
                        <option value="admin">Admin</option>
                    </select>
                ) : (
                    <select id="new-questions"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={permissions}
                            onChange={(e) => setPermissions(e.target.value)}
                    >
                        <option value="normal">Normal</option>
                        <option selected value="admin">Admin</option>
                    </select>
                )}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {isTeacher === 0 ? (
                    <select id="new-questions"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={() => {
                                setIsTeacher(isTeacher === 0 ? 1 : 0)
                            }}
                    >
                        <option>True</option>
                        <option selected >False</option>
                    </select>
                ): (
                    <select id="new-questions"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={() => setIsTeacher(isTeacher === 0 ? 1 : 0)}
                    >
                        <option selected>True</option>
                        <option>False</option>
                    </select>
                )}
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">
                    {student.createdAt}
                </p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {/*TODO: create the button to report them (but that's further)*/}
                {isAdmin ? <>
                    <button onClick={()=>handleUserKick(student)} type="button"
                            className="focus:outline-none text-white bg-red-700 hover:bg-green-800 focus:ring-4
                                                focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600
                                                dark:hover:bg-red-700 dark:focus:ring-red-800"><a>Kick student from class</a></button>
                    <button type="button"

                            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        Confirm Changes
                    </button>
                </>: null}
            </td>
        </tr>
    </tbody>
    )
}