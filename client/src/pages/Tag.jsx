import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/Tag.css"

export const Tag = ({tagInfo, classId}) => {
    const navigate = useNavigate()
    const handleTagClick = () => {
        navigate(`/class/${classId}/edit-tag/${tagInfo.id}`)
    }

    return (
        <div className="tag__name" style={{backgroundColor: "#007ea6"}} onClick={(event) => handleTagClick(event)}>{tagInfo.name}</div>
    )
}