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
    const [files, setFiles] = useState([])

    function fetchFilesRecursively(fetchedFiles, idx) {
        if (idx >= questionInfo.fileNames.length) return

        console.log(`Gonna fetch ${questionInfo.fileNames[idx]}`)
        const fileName = questionInfo.fileNames[idx]
        axios
            .get("/question/file", {
                    responseType: "blob",
                    params: {
                        questionId: questionInfo.id,
                        fileName: fileName
                    }
                }
            )
            .then((res) => {
                fetchedFiles.push({fileName: fileName, url: URL.createObjectURL(res.data)});
                console.log("Updated array len:")
                console.log(fetchedFiles.length)
                setFiles(fetchedFiles)
                fetchFilesRecursively(fetchedFiles, idx + 1)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        // setFiles([]) // Used to avoid fetching the same files many times
        // ^^^ TODO: not actually working, though
        
        let uuid = localStorage.getItem("uuid")
        axios
            .get("/question/answers", {
                params: {
                    classId: questionInfo.classId,
                    questionId: questionInfo.id,
                    uuid: uuid}
            })
            .then((res) => {
                if (questionInfo.fileNames instanceof String) questionInfo.fileNames = [questionInfo.fileNames]
                // const files = questionInfo.fileNames.map(fileName => {
                //         let fileData
                //         axios
                //             .get("/question/file", {
                //                     responseType: "blob",
                //                     params: {
                //                         questionId: questionInfo.id,
                //                         fileName: fileName
                //                     }
                //                 }
                //             )
                //             .then((res) => {
                //                 fileData = {fileName: fileName, url: URL.createObjectURL(res.data)}
                //             })
                //             .catch(err => console.log(err))
                //
                //         return fileData
                //     }
                // );
                // console.log("Files:")
                // console.log(files)
                // setFiles(files)

                fetchFilesRecursively([], 0);
                buildQuestionTree(res.data);
            })
            .catch((err) => {
                console.log(err)
                console.log("Answer error")
            })

        axios.get(`/class/${uuid}/enrolled-in/${questionInfo.classId}` )
            .then(res => {
                setIsTeacher(res.data.isTeacher) //TODO: change, it's awkward to see
            })
            .catch(err => console.log(err))

    }, [answersLen, isTeacher]);

    function Question({questionInfo}) {
        useEffect(() => {

        }, []);

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
                    setAnswersLen(answersLen + 1)
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

        function renderFiles() {
            console.log("FILES")
            console.log(files)
            console.log(`File amount to render: ${files.length}`)
            return files
                .map(file => {
                    console.log(`Rendering ${file.fileName}`)
                    const imageExtensions = ['.jpg', '.jpeg', '.png'] // Add more
                    if (imageExtensions.some(ext => file.fileName.endsWith(ext))) {
                        return <img key={file.fileName} className="mt-1" src={file.url} alt={file.fileName}/>
                    } else return <a key={file.fileName} href={file.url} download>
                        <p className="text-amber-50 rounded-2xl bg-gray-600 p-2 mb-1">{file.fileName}</p>
                        <br/>
                    </a>

                });
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
                {renderFiles()}
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
        const [hasUserVotedIt, setHasUserVotedIt] = useState(answer.hasUserVotedIt)
        const [voteCount, setVoteCount] = useState(answer.voteCount)
        const [isVerified, setIsVerified] = useState(false)

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
            let uuid = localStorage.getItem("uuid");
            axios.put('/question/answer/validate',  {
                    uuid: uuid,
                    classId: answer.classId,
                    answerId: answer.id

            }).then(res => {
                console.log(res)
                setIsVerified(res.data)
            }).catch(err=> console.log(err))
        }

        function handleVote() {
            if (answer.belongsToThisUser) return

            axios
                .post('/votes/upvote', {
                    uuid: localStorage.getItem("uuid"),
                    classId: answer.classId,
                    answerId: answer.id,
                    undoingVote: hasUserVotedIt
                })
                .then((res) => {
                    if (hasUserVotedIt) setVoteCount(voteCount - 1)
                    else setVoteCount(voteCount + 1)

                    setHasUserVotedIt(!hasUserVotedIt)
                })
                .catch((err) => console.log(err))
        }

        function renderButtons() {
            return <div>
                <button onClick={() => setIsBeingReplied(true)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Reply
                </button>

                <button onClick={handleVote}
                        className={
                            hasUserVotedIt
                                ? "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                                : "text-white bg-gray-700 px-5 py-2.5 me-2 mb-2 cursor-default"
                }>
                    <i className="fa-solid fa-arrow-up"></i>
                    {" " + voteCount}
                </button>

                {answer.canBeDeleted
                    ? <button onClick={handleReplyDelete}
                              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Delete
                    </button>
                    : null}
                {isTeacher ?
                    <button onClick={handleVerify}
                        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm
                    px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                            >
                        Validate</button> :null}
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
                    {isVerified ? <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48" className={"position: absolute; top: 0; right: 0;"}>
                        <path fill="#c8e6c9" d="M36,42H12c-3.314,0-6-2.686-6-6V12c0-3.314,2.686-6,6-6h24c3.314,0,6,2.686,6,6v24C42,39.314,39.314,42,36,42z"></path><path fill="#4caf50" d="M34.585 14.586L21.014 28.172 15.413 22.584 12.587 25.416 21.019 33.828 37.415 17.414z"></path>
                    </svg> : null}
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