import {useNavigate, useParams} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import React, {useEffect, useState} from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ReportedQuestions({uuid, setUuid}) {

    const [questionRows, setQuestionRows] = useState([])
    const [answerRows, setAnswerRows] = useState([])
    const [deletions, setDeletions] = useState(0)
    const navigate = useNavigate()
    let {id} = useParams()
    const createQuestionRows = (res) => {
        setQuestionRows(res.map((questionInfo) => {
            return <QuestionRow name={questionInfo.firstName + " " + questionInfo.lastName} title={questionInfo.title} description={questionInfo.description} timesReported={questionInfo.wasReported} questionId={questionInfo.questionId}/>
        }))
    }

    const createAnswerRows = (res) => {
        setAnswerRows(res.map((answerInfo) => {
            return <AnswerRow name={answerInfo.firstName + " " + answerInfo.lastName} parentTitle={answerInfo.parentTitle} parentDescription={answerInfo.parentDescription} timesReported={answerInfo.wasReported} description={answerInfo.answerDescription} answerId={answerInfo.answerId}/>
        }))
    }
    const QuestionRow = ({name, title, description, timesReported, questionId}) => {
        return (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {name}
                </th>
                <td className="px-6 py-4">
                    {title}
                </td>
                <td className="px-6 py-4">
                    {description}
                </td>
                <td className="px-6 py-4">
                    {timesReported}
                </td>
                <td className="px-6 py-4">
                    <button type="submit" className="w-1/2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                            onClick={() => handleQuestionDelete(questionId)}>
                        <i className="fa-solid fa-trash"></i> Delete Question
                    </button>
                </td>
            </tr>
        );
    }

    const AnswerRow = ({name, description, timesReported, parentDescription, parentTitle, answerId}) => {
        return (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {name}
                </th>
                <td className="px-6 py-4">
                    {description}
                </td>
                <td className="px-6 py-4">
                    {parentTitle}
                </td>
                <td className="px-6 py-4">
                    {parentDescription}
                </td>
                <td className="px-6 py-4">
                    {timesReported}
                </td>
                <td className="px-6 py-4">
                    <button type="submit" className="w-1/2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                            onClick={() => handleAnswerDelete(answerId)}>
                        <i className="fa-solid fa-trash"></i> Delete Answer
                    </button>
                </td>
            </tr>
        );
    }

    function handleQuestionDelete(questionId) {
        axios
            .delete('/question/question', {
                data: {
                    uuid: localStorage.getItem("uuid"),
                    classId: id,
                    questionId: questionId
                }
            })
            .then((res) => {
                setDeletions(deletions + 1)
                console.log(res)
            })
            .catch((err) => console.log(err))
        toast.success("Question deleted successfully")
    }

    function handleAnswerDelete(answerId) {
        axios
            .delete('/question/answer', {
                data: {
                    uuid: localStorage.getItem("uuid"),
                    classId: id,
                    answerId: answerId
                }
            })
            .then((res) =>{
                setDeletions(deletions + 1)
                console.log(res)
            })
            .catch((err) => console.log(err))
            toast.success("Answer deleted successfully")
    }



    const fetchQuestionInfo = () => {
        axios.get("/question/reported-questions", {params: {classId: id}})
            .then((res) => createQuestionRows(res.data))
            .catch(err => console.log(err))
    }

    const fetchAnswerInfo = () => {
        axios.get("/question/reported-answers", {params: {classId: id}})
            .then((res) => createAnswerRows(res.data))
            .catch(err => console.log(err))
    }

    const handleReturn = () => {
        navigate("/class/" + id)
    }

    useEffect(() => {
        // Should not ever set state during rendering, so do this in useEffect instead.
        fetchQuestionInfo();
        fetchAnswerInfo();
    }, [deletions]);

    return (
        <>
            <div>
                <Navbar></Navbar>
            </div>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-4">
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleReturn}><i className="fa-fw fa-solid fa-left-long"></i>Return</button>
                <h1 className="text-5xl font-extrabold dark:text-black">Reported Questions</h1>
                <div className='p-5 grid grid-cols-3 divide-x'>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg col-span-3">
                        <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Times Reported
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {questionRows}
                            </tbody>
                        </table>
                    </div>
                </div>
                <h1 className="text-5xl font-extrabold dark:text-black">Reported Answers</h1>
                <div className='p-5 grid grid-cols-3 divide-x'>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg col-span-3">
                        <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Answer
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Parent Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Parent Description
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Times Reported
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {answerRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}