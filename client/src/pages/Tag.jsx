import React, {useState} from "react";

export const Tag = ({tagInfo, selected}) => {
    const [select, setSelect] = useState(tagInfo.selected)
    const handleTagClick = (event) => {
        setSelect(!select)
        selected = select
        tagInfo.selected = select
        event.target.style = select ? "background-color: #00283f" : "background-color: #007ea6"
    }

    return (
        <div className="tag__name" style={{backgroundColor: selected ? "#00283f" : "#007ea6"}} onClick={(event) => handleTagClick(event)}>{tagInfo.name}</div>
    )
}