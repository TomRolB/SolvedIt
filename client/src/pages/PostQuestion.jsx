import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import Select from "react-select";

export function PostQuestion() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState([])
    const [selectedOptions, setSelectedOptions] = useState(null);
    let {id} = useParams()

    useEffect(() => {
        axios.get(`/class/byId/${id}/post-question`).then((res) => {
            // console.log(res)
            // console.log(res.data)
            setTags(res.data)
        }).catch(err => console.log(err))
    }, [])

    function handleTitleChange(event) {
        setTitle(event.target.value)
    }

    function handleDescriptionChange(event) {
        setDescription(event.target.value)
    }

    const navigate = useNavigate()
    function handleFormSubmit(event) {
        event.preventDefault()
        axios
            .post("/question/post-question", {
                classId: id,
                uuid: localStorage.getItem("uuid"),
                title: title,
                description: description,
                tags: selectedOptions
            })
            .then((res) => {
                console.log(res)
                navigate("/class/" + id)
            })
            .catch((err) => console.log(err))
    }

    const options = tags.map((tag) => {
        return { value: tag.id, label: tag.name }
    })

    const handleChange = (opts) => {
        setSelectedOptions(opts.map((opt) => opt.value));
    };

    return (
        <div>
            <Navbar></Navbar>
            <form onSubmit={handleFormSubmit}>
                <label>Title</label><br/>
                <input onChange={handleTitleChange} type={"text"}/><br/>
                <label>Description</label><br/>
                <input onChange={handleDescriptionChange} type={"text"}/><br/>
                <Select
                    closeMenuOnSelect={false}
                    isMulti
                    name="colors"
                    options={options}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleChange}
                />
                <input type={"submit"}/>
            </form>
        </div>
    )
}