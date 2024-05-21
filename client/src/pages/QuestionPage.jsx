import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {Navbar} from "../components/Navbar";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

export function QuestionPage() {
    const location = useLocation()
    const questionInfo = location.state
    const [isQuestionActive, setIsQuestionActive] = useState(questionInfo.isActive)
    const [answers, setAnswers] = useState([])
    // The state below is simply used to refresh the page when needed
    const [answersLen, setAnswersLen] = useState(0)
    const navigate = useNavigate()
    let {id} = useParams()
    let [isTeacher, setIsTeacher] = useState(false)

    useEffect(() => {
        axios
            .get("/question/answers", {
                params: {
                    classId: questionInfo.classId,
                    questionId: questionInfo.id,
                    uuid: localStorage.getItem("uuid")}
            })
            .then((res) => buildQuestionTree(res.data))
            .catch((err) => {
                console.log(err)
                console.log("Answer error")
            })

        let uuid = localStorage.getItem("uuid")
        axios.get(`/${uuid}/enrolled-in/${questionInfo.classId}` )
            .then(res => setIsTeacher(res.data.isTeacher))
            .catch(err => console.log(err))

        console.log(isTeacher)


    }, [answersLen, isTeacher]);

    function Question({questionInfo}) {
        const [isBeingReplied, setIsBeingReplied] = useState(false)
        const [answerDescription, setAnswerDescription] = useState("")
        function handleTextChange(event) {
            setAnswerDescription(event.target.value)
        }

        function handleAnswerSubmit(event) {
            event.preventDefault() //Prevents page from refreshing
            axios
                .post("/question/post-answer", {
                    uuid: localStorage.getItem("uuid"),
                    classId: questionInfo.classId,
                    questionId: questionInfo.id,
                    parentId: null,
                    description: answerDescription
                })
                .then((res) => {
                    setAnswersLen(0)
                })
                .catch(err => console.log(err))
        }

        function handleQuestionDelete() {
            axios
                .delete('/question/question', {
                    data: {
                        uuid: localStorage.getItem("uuid"),
                        classId: questionInfo.classId,
                        questionId: questionInfo.id
                    }
                })
                .then((res) => console.log(res))
                .catch((err) => console.log(err))

            setIsQuestionActive(false)
        }

        function renderButtons() {
            return <>
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => setIsBeingReplied(true)}>Reply</button>
                {questionInfo.canBeDeleted
                    ? <button onClick={handleQuestionDelete}
                              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Delete
                    </button>
                    : null}
            </>
        }

        function renderForm() {
            return <form onSubmit={handleAnswerSubmit}>
                <input type="text" onChange={handleTextChange}/>
                <input type="submit" value="Submit"/>
            </form>;
        }

        function renderContents() {
            return <>
                <div className="flex justify-between">
                  <h1 className="text-2xl text-amber-50">{questionInfo.User.firstName + " " + questionInfo.User.lastName}</h1>
                  <button type="button" onClick={() => handleQuestionReport(questionInfo)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"><i className="fa-solid fa-flag"></i> Report</button>
                </div>
                <h1 className="text-5xl text-amber-50">{questionInfo.title}</h1>
                {questionInfo.tags.length > 0 ?
                    <h1 className="text-amber-50 pt-6">Tags: {questionInfo.tags.join(", ")}</h1> : null}
                <h1 className="text-amber-50 pt-6">{questionInfo.description}</h1>
                {!isBeingReplied
                    ? renderButtons()
                    : renderForm()
                }
            < />
        }

        return <div className="bg-gray-800 rounded-2xl p-3 m-1">
            {!isQuestionActive
                ? <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{"This question has been deleted. However, you can still see its answers."}</p>
                : renderContents()}
        </div>;
    }


    // TODO: could definitely be improved (you can probably create
    //  the tree using only collection methods)
    function buildQuestionTree(answers) {
        const answerMap = new Map()
        const firstLevelAnswers = []

        answers.forEach((answer) => {
            if (answer.parentId == null) firstLevelAnswers.push(answer)
            else {
                if (!answerMap.has(answer.parentId)) {
                    answerMap.set(answer.parentId, [])
                }

                answerMap.get(answer.parentId).push(answer)
            }
        })

        const result = []

        firstLevelAnswers.forEach((answer) => {
            createAnswersRecursively(answer, answerMap, result, 1)
        })

        setAnswers(result)
        setAnswersLen(result.length)
    }

    function createAnswersRecursively(answer, answerMap, result, extraMargin) {
        console.log(answer)
        result.push(<Reply key={answer.id} answer={answer} extraMargin={extraMargin}/>)

        if (answerMap.has(answer.id)) {
            answerMap.get(answer.id).forEach((subAnswer) => {
                createAnswersRecursively(subAnswer, answerMap, result, extraMargin + 1)
            })
        }
    }

    const handleReturn = () => {
        navigate("/class/" + id)
    }

    const handleQuestionReport = (questionInfo) => {
        console.log(questionInfo)
        confirmAlert({
            title: 'Report Question:',                        // Title dialog
            message: `Question: ${questionInfo.title}`,               // Message dialog
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => confirmQuestionReport(questionInfo)
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ],
            overlayClassName: "overlay-custom-class-name"      // Custom overlay class name
        })
    }

    const confirmQuestionReport = (questionInfo) => {
        axios
            .put("/question/report-question", {
                uuid: localStorage.getItem("uuid"),
                id: questionInfo.id
            })
            .then((res) => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    function handleAnswerReport(answer) {
        console.log(answer)
        confirmAlert({
            title: 'Report Answer:',                        // Title dialog
            message: `Answer: ${answer.description}`,               // Message dialog
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => confirmAnswerReport(answer)
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ],
            overlayClassName: "overlay-custom-class-name"      // Custom overlay class name
        })
    }

    const confirmAnswerReport = (answer) => {
        axios
            .put("/question/report-answer", {
                uuid: localStorage.getItem("uuid"),
                id: answer.id
            })
            .then((res) => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    const Reply = ({answer, extraMargin}) => {
        const [isBeingReplied, setIsBeingReplied] = useState(false)
        const [answerDescription, setAnswerDescription] = useState("")
        function handleTextChange(event) {
            setAnswerDescription(event.target.value)
        }

        function handleAnswerSubmit(event) {
            event.preventDefault() //Prevents page from refreshing
            axios
                .post("/question/post-answer", {
                    uuid: localStorage.getItem("uuid"),
                    classId: answer.classId,
                    questionId: answer.questionId,
                    parentId: answer.id,
                    description: answerDescription
                })
                .then((res) => {
                    setAnswersLen(0)
                })
                .catch(err => console.log(err))
        }

        function getDynamicClassName() {
            // TODO: make it dynamic, if possible
            if (extraMargin === 1) return "flex items-start justify-start gap-2.5 ml-5 m-2";
            if (extraMargin === 2) return "flex items-start justify-start gap-2.5 ml-10 m-2";
            if (extraMargin === 3) return "flex items-start justify-start gap-2.5 ml-20 m-2";
            if (extraMargin === 4) return "flex items-start justify-start gap-2.5 ml-30 m-2";
        }

        function handleReplyDelete() {
            axios
                .delete('/question/answer', {
                    data: {
                        uuid: localStorage.getItem("uuid"),
                        classId: answer.classId,
                        answerId: answer.id
                    }
                })
                .then((res) => console.log(res))
                .catch((err) => console.log(err))

            setAnswersLen(0)
        }

        function handleVerify() {
            axios.put("/question/answer/validate", {data: {
                    uuid: localStorage.getItem("uuid"),
                    classId: answer.classId,
                    answerId: answer.id
                }}).then(res => console.log("updated: " + res)).catch(err=> console.log(err))
        }

        function renderButtons() {
            return <div>
                <button onClick={() => setIsBeingReplied(true)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Reply
                </button>
                {answer.canBeDeleted
                    ? <button onClick={handleReplyDelete}
                              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Delete
                    </button>
                    : null}
                {isTeacher ?
                    <button className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm
                    px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                            onClick={handleVerify}>
                        Validate</button> :null}
                {/*TODO: replace "validate" with a green tick*/}
            </div>;
        }

        function renderForm() {
            return <form onSubmit={handleAnswerSubmit}>
                <input type="text" onChange={handleTextChange}/>
                <input type="submit" value="Submit"/>
            </form>;
        }

        function renderContents() {
            return <>
                <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{answer.User.firstName + answer.User.lastName}</span>
                    <button type="button" onClick={() => handleAnswerReport(answer)} className="px-1.5 py-1 text-xs focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"><i className="fa-solid fa-flag"></i> Report</button>
                </div>
                <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{answer.description}</p>
                {!isBeingReplied
                    ? renderButtons()
                    : renderForm()}
            </>;
        }

        return (
            <div className={getDynamicClassName()}>
                <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                    {!answer.isActive
                        ?
                        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{"This answer has been deleted"}</p>
                        : renderContents()}
                </div>
            </div>
        )
    }

    return (
        <div>
        <Navbar></Navbar>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleReturn}><i className="fa-fw fa-solid fa-left-long"></i>Return</button>
                <Question questionInfo={questionInfo}/>
                {answers.length > 0 ? answers : <h1>{"This question has no answers. Be the first to reply!"}</h1>}
            </div>
        </div>
    )
}