import {useParams} from "react-router-dom";
import {Navbar} from "../../../components/Navbar";
import React, {useEffect, useState} from "react";
import axios from "axios";
import "../../../styles/Tag.css"
import {Tag} from "./Tag";
import {ReturnButton} from "../../../components/ReturnButton";


export function ViewTags() {
    const [tags, setTags] = useState([])

    const {id, tagId} = useParams()

    // function checkUserIsAdmin() {
    //     axios
    //         .get("/users/is-admin", {params: {uuid: localStorage.getItem('uuid'), classId: id}})
    //         .then((res) => setIsAdmin(res.data.isAdmin))
    //         .catch((err) => console.log(err))
    // }

    useEffect(() => {
        // checkUserIsAdmin()
        axios.get(`/tag/${id}/tags`, {params: {classId: id}}).then((res) => {
            console.log(res)
            setTags(res.data.map(tag => <Tag tagInfo={tag} classId={id}></Tag>))
        }).catch(err => console.log(err))

    }, [])

    return (
        <div>
            <Navbar></Navbar>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <ReturnButton path={`/class/${id}`}></ReturnButton>
                <div className="card">
                    <span className="title">All tags</span>
                    <div className="card__tags">
                        <ul className="tag">
                            {tags}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}