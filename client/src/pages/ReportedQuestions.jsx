import {useNavigate, useParams} from "react-router-dom";
import {Navbar} from "../components/Navbar";
import React, {useEffect, useState} from "react";
import axios from "axios";

export function ReportedQuestions({uuid, setUuid}) {

    const [questionRows, setQuestionRows] = useState([])
    const [answerRows, setAnswerRows] = useState([])
    const navigate = useNavigate()
    let {id} = useParams()
    const createQuestionRows = (res) => {
        setQuestionRows(res.map((questionInfo) => {
            return <QuestionRow name={questionInfo.firstName + " " + questionInfo.lastName} title={questionInfo.title} description={questionInfo.description} timesReported={questionInfo.wasReported}/>
        }))
    }

    const createAnswerRows = (res) => {
        setAnswerRows(res.map((answerInfo) => {
            return <AnswerRow name={answerInfo.firstName + " " + answerInfo.lastName} parentTitle={answerInfo.parentTitle} parentDescription={answerInfo.parentDescription} timesReported={answerInfo.wasReported} description={answerInfo.answerDescription}/>
        }))
    }
    const QuestionRow = ({name, title, description, timesReported}) => {
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
                    <a href={"/class/" + id} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a>
                </td>
            </tr>
        );
    }

    const AnswerRow = ({name, description, timesReported, parentDescription, parentTitle}) => {
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
                    <a href={"/class/" + id} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a>
                </td>
            </tr>
        );
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

    useEffect(() => {
        // Should not ever set state during rendering, so do this in useEffect instead.
        fetchQuestionInfo();
        fetchAnswerInfo();
    }, []);

    return (
        <div className="h-screen bg-gradient-to-tr from-white to-blue-300">
            <div>
                <Navbar></Navbar>
            </div>
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
    )
}