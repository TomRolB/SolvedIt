import {redirect, useNavigate, useParams} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";

export function Class({uuid, setUuid, classId, setClassId}) {

    const [classInfo, setClassInfo] = useState([{}])
    const [isAdmin, setIsAdmin] = useState(false)
    const [questions, setQuestions] = useState([])
    let {id} = useParams()

    useEffect(() => {
        axios.get(`/class/byId/${id}`).then((res) => {
            setClassInfo(res.data)
        }).catch(err => console.log(err))

        axios
            .get("/users/is-admin", {params: {uuid: uuid, classId: id}})
            .then((res) => setIsAdmin(res.data.isAdmin))
            .catch((err) => console.log(err))

        axios
            .get("/question/questions", {params: {classId: id, uuid: uuid}})
            .then((res) => {
                console.log(res);
                let questions = []
                for (let question of res.data) {
                    if (questions[question.id] === undefined) {
                        if (question.tagName === null) {
                            questions[question.id] = [question.title, question.description, []]
                        } else {
                            questions[question.id] = [question.title, question.description, [question.tagName]]
                        }
                    } else {
                        questions[question.id][2].push(question.tagName)
                    }
                }
                console.log(questions)
                setQuestions(
                    questions.map((questionInfo) => {
                        console.log(questionInfo)
                        if (questionInfo[2] === undefined || questionInfo[2].length === 0) {
                            return (
                              <Question key={questionInfo.id} questionInfo={questionInfo}/>
//                               <h1>{"title: " + questionInfo[0]+ ", description: " + questionInfo[1] + ", tags: " + "No tags"}</h1>
                            )
                        }
                        return(
                             <Question key={questionInfo.id} questionInfo={questionInfo}/>
//                             <h1>{"title: " + questionInfo[0]+ ", description: " + questionInfo[1] + ", tags: " + questionInfo[2]}</h1>
                        )
                    })
                )
            })
            .catch((err) => {
                console.log(err)
                console.log("Question error")
            })
    }, [questions]);

    const navigate = useNavigate()
    function handleQuestionClick(questionInfo) {
        navigate(
            "/class/" + id + "/question/" + questionInfo.id,
            { state: questionInfo })
    }

    const Question = ({questionInfo}) => {
        return <div onClick={() => handleQuestionClick(questionInfo)} className="bg-gray-800 rounded-2xl p-3 m-1">
            <h1 className="text-2xl text-amber-50">{questionInfo.User.firstName + " " + questionInfo.User.lastName}</h1>
            <h1 className="text-5xl text-amber-50">{questionInfo.title}</h1>
        </div>
    }

    const Questions = () => {
        return questions.length > 0 ? questions : <h1>{"There are no questions yet"}</h1>
    }

    const CourseInfo = () => {
        if (classInfo === null) return (<h1>Class not found</h1>)
        return (
            <div>
                <h1 className="text-5xl font-extrabold dark:text-black">{classInfo.name}<small className="ms-2 font-semibold text-gray-500 dark:text-gray-800">ID: {classInfo.id}</small></h1>
                { isAdmin?
                    <button type="button"
                             className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        <a href={`/class/${id}/edit`}><i className="fa-solid fa-pen-to-square"></i> Edit Class</a>
                    </button>
                    : null}
                <p className="my-4 text-lg text-gray-500">{classInfo.description}</p>
            </div>
        )

    }

    return (
        <div>
            <Navbar></Navbar>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <CourseInfo/>
                {isAdmin ?
                    <button type="button"
                                   className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                        <a href={"/class/" + id + "/invites"}><i className="fa-solid fa-plus"></i> Manage Invitations</a>
                    </button>
                    :
                    <div>
                        <button type="button"
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                            <a href={"/class/" + id + "/post-question"}><i className="fa-solid fa-plus"></i> Post Question</a>
                        </button>
                        <button type="button"
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                            <a href={"/class/" + id + "/create-tag"}><i className="fa-solid fa-plus"></i> Create Tag</a>
                        </button>
                        <button type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            <a href={"/class/" + id + "/view-tags"}><i className="fa-solid fa-pen-to-square"></i> Edit Tags</a>
                        </button>
                    </div>
                }
                <Questions/>
                {/*<Questions/>*/}
//                 {questions.length > 0 ? questions : <h1>{"There are no questions yet"}</h1>}
            </div>
        </div>
    )
}