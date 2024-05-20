import {Navbar} from "../components/Navbar";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";

export const ClassMembers =() =>{
    const classId = useParams().id
    let [members, setMembers] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)

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
        if(isAdmin) getClassMembers()
    }, [classId, isAdmin]);

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
                <p className="text-gray-900 whitespace-no-wrap">{student.permissions}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">
                    {student.createdAt}
                </p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {/*TODO: create the button to report them (but that's further)*/}
									<button onClick={()=>handleUserKick(student)} type="button"
                                            className="focus:outline-none text-white bg-red-700 hover:bg-green-800 focus:ring-4
                                            focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600
                                            dark:hover:bg-red-700 dark:focus:ring-red-800"><a>Kick student from class</a></button>
            </td>
        </tr>
        </tbody>
    }

    const handleUserKick = async (student) => {
        console.log(student.id)
        await axios.post(`/class/byId/${classId}/kick-user/${student.id}`).
        then(res => console.log(res)).
        catch(err => console.log(err))
    }

    return (
        <div>
        <Navbar></Navbar>
            <div className="bg-white p-8 rounded-md w-full">
                <div className=" flex items-center justify-between pb-6">
                    <div className="flex items-center justify-between">
                    </div>
                </div>
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