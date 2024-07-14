import {Navbar} from "../../../components/Navbar";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {ClassMember} from "../../../components/ClassMember";
import {ReturnButton} from "../../../components/ReturnButton";

export const ClassMembers =() =>{
    const classId = useParams().id
    let [members, setMembers] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)

    function checkUserIsAdmin() {
        axios.get("/users/is-admin",
            {params: {uuid: localStorage.getItem('uuid'), classId: classId}})
            .then((res) => setIsAdmin(res.data.isAdmin))
            .catch((err) => console.log(err))
    } //May need to move

    useEffect(() => {
        const getClassMembers = async () => {
            const response = await fetch(`/class/byId/${classId}/members`)
            const responseValue = await response.json()
            if (responseValue.length > 0) {
                setMembers(responseValue)
            }
        }
        checkUserIsAdmin()
        getClassMembers()
    }, [classId, isAdmin]);

    const getStudentEntry = (student) =>{
        return (
            <ClassMember student={student.userInfo} isAdmin={isAdmin} classId={classId} uuid={student.uuid}></ClassMember>
        )
    }

    return (
        <div>
        <Navbar></Navbar>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <ReturnButton path={"/class/" + classId}></ReturnButton>
                <h1 className="text-5xl font-extrabold dark:text-black">Class Members</h1>
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
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Created at
                                    </th>
                                    <th scope="col" className="px-6 py-3">
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