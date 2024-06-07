import {Navbar} from "../components/Navbar";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {ClassMember} from "../components/ClassMember";

export const ClassMembers =() =>{
    const classId = useParams().id
    let [members, setMembers] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    let navigate = useNavigate()

    function checkUserIsAdmin() {
        axios
            .get("/users/is-admin", {params: {uuid: localStorage.getItem('uuid'), classId: classId}})
            .then((res) => setIsAdmin(res.data.isAdmin))
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        const getClassMembers = async () => {
            const response = await fetch(`/class/byId/${classId}/members`)
            const responseValue = await response.json()
            if (responseValue.length > 0) {
                setMembers( responseValue)
            }
        }
        checkUserIsAdmin()
        getClassMembers()
    }, [classId, isAdmin]);

    let image = require("../media/image.jpg")
    const getStudentEntry = (student) =>{
        if(student.permissions !== "owner")
        return (
            <ClassMember student={student} isAdmin={isAdmin} classId={classId}></ClassMember>
        )
    }

    const handleUserKick = async (student) => {
        console.log(student.id)
        await axios.post(`/class/byId/${classId}/kick-user/${student.id}`).
        then(res => console.log(res)).
        catch(err => console.log(err))
    }
    function handleReturn(){
        navigate("/class/" + classId)
    }

    return (
        <div>
        <Navbar></Navbar>
            <div className="bg-white p-8 rounded-md w-full">
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
                                        Role
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Teacher
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Created at
                                    </th>
                                    <th
                                        className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Action
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