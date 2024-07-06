import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {Navbar} from "../components/Navbar";
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import {FileUpload} from "../components/FileUpload";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {ProfilePicture} from "../components/ProfilePicture";


function fetchFilesRecursively(fileNames, id, fetchedFiles, idx, setter, isAnswer) {
    if (idx >= fileNames.length) {
        setter(fetchedFiles)
        return
    }

    console.log(`Gonna fetch ${fileNames[idx]}`)
    const fileName = fileNames[idx]
    axios
        .get("/question/file", {
                responseType: "blob",
                params: {
                    id: id,
                    fileName: fileName,
                    isAnswer: isAnswer
                }
            }
        )
        .then((res) => {
            fetchedFiles.push({fileName: fileName, url: URL.createObjectURL(res.data)});
            console.log("Updated array len:")
            console.log(fetchedFiles.length)
            fetchFilesRecursively(fileNames, id, fetchedFiles, idx + 1, setter, isAnswer)
        })
        .catch(err => {
            console.log(err);
        })
}

function Files({files}) {
    return <>
        {files
            .map(file => {
                const imageExtensions = ['.jpg', '.jpeg', '.png'] // Add more
                if (imageExtensions.some(ext => file.fileName.endsWith(ext))) {
                    return <img key={file.fileName} className="rounded-2xl bg-gray-600 p-2 mb-1" src={file.url} alt={file.fileName}/>
                } else return <a key={file.fileName} href={file.url} download>
                    <p className="text-amber-50 rounded-2xl bg-gray-600 p-2 mb-1">{file.fileName}</p>
                    <br/>
                </a>

            })}
    </>
}

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
    const [errorCount, setErrorCount] = useState(0)


    useEffect(() => {
        let uuid = localStorage.getItem("uuid")
        axios
            .get("/question/answers", {
                params: {
                    classId: questionInfo.classId,
                    questionId: questionInfo.id,
                    uuid: uuid}
            })
            .then((res) => {
                fetchFilesRecursively(questionInfo.fileNames, questionInfo.id, [], 0, setFiles, false);
                buildQuestionTree(res.data);
            })
            .catch((err) => {
                console.log(err)
                console.log("Answer error")
            })

        axios.get(`/class/${uuid}/enrolled-in/${questionInfo.classId}` )
            .then(res => {
                setIsTeacher(res.data.isTeacher)
            })
            .catch(err => console.log(err))

    }, [answersLen, isTeacher, errorCount]);

    function Question({questionInfo}) {
        const [isBeingReplied, setIsBeingReplied] = useState(false)
        const [answerDescription, setAnswerDescription] = useState("")
        const [replyFiles, setReplyFiles] = useState([])

        useEffect(() => {

        }, [errorCount]);

        function handleTextChange(event) {
            setAnswerDescription(event.target.value)
        }

        function handleAnswerSubmit(event) {
            event.preventDefault() //Prevents page from refreshing

            const formData = new FormData()
            for (const file of replyFiles) {
                formData.append('file', file)
            }
            formData.append('classId', questionInfo.classId)
            formData.append('uuid', localStorage.getItem("uuid"))
            formData.append('questionId', questionInfo.id)
            formData.append('description', answerDescription)
            formData.append('parentId', null)

            axios
                .post("/question/post-answer",
                //     {
                //     uuid: localStorage.getItem("uuid"),
                //     classId: questionInfo.classId,
                //     questionId: questionInfo.id,
                //     parentId: null,
                //     description: answerDescription
                // }
                    formData
                )
                .then((res) => {
                    setAnswersLen(answersLen + 1)
                })
                .catch(err => console.log(err))

            axios.post("/notification/notify", {
                uuid: localStorage.getItem("uuid"),
                classId: id,
                title: "New Answer",
                description: "New answer has been submitted to one of your questions",
                notificationType: "newAnswer",
                notificationInfo: {
                    questionInfo: questionInfo,
                    answerInfo: {
                        description: answerDescription
                    }
                }
            }).then(res => console.log(res))

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
            toast.success("Question deleted successfully")
            setIsQuestionActive(false)
        }

        function renderButtons() {
            return <>
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => setIsBeingReplied(true)}>Reply</button>
                {questionInfo.canBeDeleted
                    ? <button onClick={handleQuestionDelete}
                              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Delete
                    </button>
                    : null}
            </>
        }

        function renderForm() {
            return <form onSubmit={handleAnswerSubmit}>
                <textarea  placeholder="Write your answer here" onChange={handleTextChange} className={"break-words h-40 bg-gray-600 border border-gray-300 text-gray-900 text-sm mt-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}/><br/>
                <FileUpload files={replyFiles} setFiles={setReplyFiles} singleFile={false}/>
                <input type="submit" value="Submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" /><br/>
            </form>;
        }

        function renderContents() {
            return <>
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <ProfilePicture uuid={questionInfo.uuid} isTransientUuid={true} errorCount={errorCount} setErrorCount={setErrorCount}></ProfilePicture>
                        <h1 className="text-2xl text-amber-50 ml-2">{questionInfo.User.firstName + " " + questionInfo.User.lastName}</h1>
                    </div>
                    <button type="button" onClick={() => handleQuestionReport(questionInfo)} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"><i className="fa-solid fa-flag"></i> Report</button>
                </div>
                <h1 className="text-5xl text-amber-50">{questionInfo.title}</h1>
                {questionInfo.tags.length > 0 ?
                    <h1 className="text-amber-50 pt-6">Tags: {questionInfo.tags.join(", ")}</h1> : null}
                <h1 className="break-words text-sm font-normal py-2.5 text-gray-900 dark:text-white mb-2 mt-2">{questionInfo.description}</h1>
                <Files files={files}/>
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
        confirmQuestionReport(questionInfo)
        toast.success("Question reported successfully")
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
        confirmAnswerReport(answer)
        toast.success("Answer reported successfully")
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
        const [replyFiles, setReplyFiles] = useState([])
        const [fetchedFiles, setFetchedFiles] = useState([])
        useEffect(() => {
            fetchFilesRecursively(
                answer.fileNames, answer.id, [], 0, setFetchedFiles, true
            )
        }, []);

        function handleTextChange(event) {
            setAnswerDescription(event.target.value)
        }

        function handleAnswerSubmit(event) {
            event.preventDefault() //Prevents page from refreshing

            const formData = new FormData()
            for (const file of replyFiles) {
                formData.append('file', file)
            }
            formData.append('classId', answer.classId)
            formData.append('uuid', localStorage.getItem("uuid"))
            formData.append('questionId', answer.questionId)
            formData.append('description', answerDescription)
            formData.append('parentId', answer.id)

            axios
                .post("/question/post-answer",
                //     {
                //     uuid: localStorage.getItem("uuid"),
                //     classId: answer.classId,
                //     questionId: answer.questionId,
                //     parentId: answer.id,
                //     description: answerDescription
                // }
                    formData
                )
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
            toast.success("Answer deleted successfully")
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

            axios.post("/notification/notify", {
                uuid: uuid,
                classId: id,
                title: "Answer Validation",
                description: "Your answer validity has been changed",
                notificationType: "answerValidation",
                notificationInfo: answer
            }).then(res => console.log(res))
            toast.success("Answer validated successfully")
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
            return <div className="flex items-stretch">
                <button onClick={() => setIsBeingReplied(true)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Reply
                </button>

                {!answer.belongsToThisUser
                    ? <button onClick={handleVote}
                              className={
                                  hasUserVotedIt
                                      ? "text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800 cursor-pointer"
                                      : "text-white bg-gray-700 px-5 py-2.5 me-2 mb-2 cursor-pointer"
                              }>
                        <i className="fa-solid fa-arrow-up"></i>
                        {" " + voteCount}
                    </button>
                    : <h2 className="text-white bg-gray-700 px-5 py-2.5 me-2 mb-2 cursor-normal">
                        <i className="fa-solid fa-arrow-up"></i>
                        {" " + voteCount}
                    </h2>
                }

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
                <textarea placeholder="Write your answer here" onChange={handleTextChange} className={"break-words h-40 bg-gray-600 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-2 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"}/><br/>
                <FileUpload files={replyFiles} setFiles={setReplyFiles} singleFile={false}/>
                <input type="submit" value="Submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"/><br/>
            </form>;
        }

        function renderContents() {
            console.log(`answer.uuid: ${answer.uuid}`)

            return <>
                <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse">
                    <div className="flex items-center">
                        <ProfilePicture uuid={answer.uuid} isTransientUuid={true} errorCount={errorCount} setErrorCount={setErrorCount}></ProfilePicture>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white ml-2">{answer.User.firstName + answer.User.lastName}</span>
                    </div>
                    {isVerified ? <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48" className={"position: absolute; top: 0; right: 0;"}>
                        <path fill="#c8e6c9" d="M36,42H12c-3.314,0-6-2.686-6-6V12c0-3.314,2.686-6,6-6h24c3.314,0,6,2.686,6,6v24C42,39.314,39.314,42,36,42z"></path><path fill="#4caf50" d="M34.585 14.586L21.014 28.172 15.413 22.584 12.587 25.416 21.019 33.828 37.415 17.414z"></path>
                    </svg> : null}
                    <button type="button" onClick={() => handleAnswerReport(answer)} className="px-1.5 py-1 text-xs focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"><i className="fa-solid fa-flag"></i> Report</button>

                </div>
                <p className="break-words text-sm font-normal py-2.5 text-gray-900 dark:text-white mb-2">{answer.description}</p>
                <Files files={fetchedFiles}/>
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