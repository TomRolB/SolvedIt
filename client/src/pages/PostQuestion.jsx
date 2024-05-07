import {useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

export function PostQuestion() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    let {id} = useParams()

    function handleTitleChange(event) {
        setTitle(event.target.value)
    }

    function handleDescriptionChange(event) {
        setDescription(event.target.value)
    }

    function handleFormSubmit(event) {
        event.preventDefault()
        axios
            .post("/question/post-question", {
                classId: id,
                uuid: localStorage.getItem("uuid"),
                title: title,
                description: description
            })
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
    }

    return <form onSubmit={handleFormSubmit}>
        <label>Title</label><br/>
        <input onChange={handleTitleChange} type={"text"}/><br/>
        <label>Description</label><br/>
        <input onChange={handleDescriptionChange} type={"text"}/><br/>
        <input type={"submit"}/>
    </form>
}