import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import * as PropTypes from "prop-types";
import {Navbar} from "../components/Navbar";

function Question({questionInfo}) {
    const [isBeingReplied, setIsBeingReplied] = useState(false)
    const [answerDescription, setAnswerDescription] = useState("")
    function handleTextChange(event) {
        setAnswerDescription(event.target.value)
    }

    function handleAnswerSubmit(event) {
        event.preventDefault() //Prevents page from refreshing
        // TODO: this only allows answer creation for the question, not
        //  for the subAnswers. Have to handle the case of the latter.
        axios
            .post("/question/post-answer", {
                uuid: localStorage.getItem("uuid"),
                classId: questionInfo.classId,
                questionId: questionInfo.id,
                parentId: null,
                description: answerDescription
            })
            .then((res) => {
                // TODO: refresh so that answer is rendered
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    return <div className="bg-gray-800 rounded-2xl p-3 m-1">
        <h1 className="text-2xl text-amber-50">{questionInfo.User.firstName + " " + questionInfo.User.lastName}</h1>
        <h1 className="text-5xl text-amber-50">{questionInfo.title}</h1>
        {questionInfo.tags.length > 0 ? <h1 className="text-amber-50 pt-6">Tags: {questionInfo.tags.join(", ")}</h1> : null}
        <h1 className="text-amber-50 pt-6">{questionInfo.description}</h1>
        {!isBeingReplied
            ? <button className="text-amber-50" onClick={() => setIsBeingReplied(true)}>Reply</button>
            : <form onSubmit={handleAnswerSubmit}>
                <input type="text" onChange={handleTextChange}/>
                <input type="submit" value="Submit"/>
            </form>}
    </div>;
}

Question.propTypes = {questionInfo: PropTypes.any};

export function QuestionPage() {
    const location = useLocation()
    const questionInfo = location.state
    const [answers, setAnswers] = useState([])
    const navigate = useNavigate()
    let {id} = useParams()

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
    }, []);

    // TODO: could definitely be improved (you can probably create
    //  the tree using only collection methods)
    function buildQuestionTree(answers) {
        const answerMap = new Map()
        const firstLevelAnswers = []

        // answers
        //     .map((answer) => {
        //         new Map([answer.parentId, answer])
        //     })
        //     .reduce((acc, answer) => {
        //         if (acc.has(answer.))
        //     })

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
    }

    function createAnswersRecursively(answer, answerMap, result, extraMargin) {
        // result.push(<h1 key={answer.id}>{answer.description}</h1>)
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
                    // TODO: refresh so that answer is rendered
                    console.log(res)
                })
                .catch(err => console.log(err))
        }

        console.log(`extraMargin for answer ${answer.id}: ${extraMargin}`)
        function getDynamicClassName() {
            // TODO: make it dynamic, if possible
            if (extraMargin === 1) return "flex items-start justify-start gap-2.5 ml-5 m-2";
            if (extraMargin === 2) return "flex items-start justify-start gap-2.5 ml-10 m-2";
            if (extraMargin === 3) return "flex items-start justify-start gap-2.5 ml-20 m-2";
            if (extraMargin === 4) return "flex items-start justify-start gap-2.5 ml-25 m-2";
            if (extraMargin === 5) return "flex items-start justify-start gap-2.5 ml-30 m-2";
        }

        return (
            <div className={getDynamicClassName()}>
                <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{answer.User.firstName + answer.User.lastName}</span>
                    </div>
                    <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{answer.description}</p>
                    {!isBeingReplied
                        ? <button className="text-amber-50" onClick={() => setIsBeingReplied(true)}>Reply</button>
                        : <form onSubmit={handleAnswerSubmit}>
                            <input type="text" onChange={handleTextChange}/>
                            <input type="submit" value="Submit"/>
                        </form>}
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