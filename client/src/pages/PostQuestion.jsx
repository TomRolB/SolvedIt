import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import Select from "react-select";
import * as PropTypes from "prop-types";
import {FileUpload} from "../components/FileUpload";

FileUpload.propTypes = {
    onChange: PropTypes.func,
    files: PropTypes.arrayOf(PropTypes.any),
};

export function PostQuestion() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState([])
    const [files, setFiles] = useState([])
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
        let uuid = localStorage.getItem("uuid");

        const formData = new FormData()
        for (const file of files) {
            formData.append('file', file)
        }
        formData.append('classId', id)
        formData.append('uuid', uuid)
        formData.append('title', title)
        formData.append('description', description)
        formData.append('tags', selectedOptions)

        axios
            .post("/question/post-question", formData)
            .then(res => console.log(res))

        axios.post("/notification/notify", {
            uuid: uuid,
            classId: id,
            title: title,
            description: "New question has been submitted",
            notificationType: "newQuestion"
        }).then((res) => {
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
            <div className="p-5 h-screen bg-gradient-to-tr from-white to-blue-300">
                <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-white to-blue-300">
                    <div
                        className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">Post
                            Question</h5>
                        <form onSubmit={handleFormSubmit} className="p-10">
                            <label className="block text-lg font-bold dark:text-white mb-2">Title</label>
                            <input onChange={handleTitleChange} type={"text"}
                                   className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}/><br/>
                            <label className="block text-lg font-bold dark:text-white mb-2">Description</label>
                            <input
                                className={"block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}
                                onChange={handleDescriptionChange} type={"text"}/><br/>
                            <FileUpload files={files} setFiles={setFiles}/>
                            <Select
                                closeMenuOnSelect={false}
                                isMulti
                                name="colors"
                                options={options}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={handleChange}
                            /><br></br>
                            <input className="h-10 w-40 bg-blue-700 text-white text-xl mt-2 md-2 rounded "
                                   type={"submit"}/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}