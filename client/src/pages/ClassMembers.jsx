import {Navbar} from "../components/Navbar";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {useUserUuid} from "../hooks/useUserUuid";

export const ClassMembers =() =>{
    const [uuid, setUuid] = useUserUuid()
    const classId = useParams().id
    console.log(classId)
    let [members, setMembers] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    let classMembers = []

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

    return (
        <div>
        <Navbar></Navbar>
            {members.map(
                student => student.permissions !== "owner" ?
                    <div>
                        <p>Name: {student.firstName} {student.lastName}</p>
                        <p>Email: {student.email}</p>
                        <p>Role: {student.permissions}</p>
                        <button><a href="#">Kick student from class</a></button>
                    </div>
                    : null
            )}
        </div>
    )
}