import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from "axios";
import * as PropTypes from "prop-types";

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
        console.log(`Received answers from DB: ${answers}`)

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
            else if (!answerMap.has(answer.parentId)) {
                console.log(`Current map: ${answerMap}`)
                answerMap[answer.parentId] = []
                console.log(`Current list: ${answerMap[answer.parentId]}`)
                answerMap[answer.parentId].push(answer)
            }
        })

        const result = []

        firstLevelAnswers.forEach((answer) => {
            createAnswersRecursively(answer, answerMap, result)
        })

        console.log(`Final result: ${result}`)
        setAnswers(result)
    }

    function createAnswersRecursively(answer, answerMap, result) {
        result.push(<h1 key={answer.id}>{answer.description}</h1>)
        console.log(`Result up to now: ${result}`)


        if (answerMap.has(answer.id)) {
            answerMap[answer.id].forEach((subAnswer) => createAnswersRecursively(subAnswer))
        }
    }

    return <>
        <Question questionInfo={questionInfo}/>
        {answers.length > 0 ? answers : <h1>{"This question has no answers. Be the first to reply!"}</h1>}
    </>
}