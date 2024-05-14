import {useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import "../styles/Tag.css"

export function PostQuestion() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState([])
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

    return (
        <div>
            <Navbar></Navbar>
            <form onSubmit={handleFormSubmit}>
                <label>Title</label><br/>
                <input onChange={handleTitleChange} type={"text"}/><br/>
                <label>Description</label><br/>
                <input onChange={handleDescriptionChange} type={"text"}/><br/>
                <label>Tag</label><br/>
                <div className="card">
                    <span className="title">All tags</span>
                    <div className="card__tags">
                        <ul className="tag">
                            <li className="tag__name">JS</li>
                            <li className="tag__name">wordpress</li>
                            <li className="tag__name">uiverse</li>
                            <li className="tag__name">Css</li>
                            <li className="tag__name">html</li>
                        </ul>
                    </div>
                </div>
                <input type={"submit"}/>
            </form>
        </div>
    )
}