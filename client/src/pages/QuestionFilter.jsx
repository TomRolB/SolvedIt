import React, {useEffect, useState} from "react";
import Select from "react-select";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";


export const QuestionFilter = ({questions, setQuestions}) => {
    const [tags, setTags] = useState([])
    const [selectedOptions, setSelectedOptions] = useState(null);
    const [showDeleted, setShowDeleted] = useState(false)
    let {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        axios
        .get(`/class/byId/${id}/post-question`)
        .then((res) => {
            setTags(res.data)
        }).catch(err => console.log(err))
    }, [])

    function handleQuestionClick(questionInfo) {
        navigate(
            "/class/" + id + "/question/" + questionInfo.id,
            { state: questionInfo })
    }
    const Question = ({questionInfo}) => {
        return <div onClick={() => handleQuestionClick(questionInfo)} className="bg-gray-800 rounded-2xl p-3 m-1">
            {!questionInfo.isActive
                ? <p className="text-amber-50">This question has been deleted. However, you can still see its answers.</p>
                :<>
                    <h1 className="text-2xl text-amber-50">{questionInfo.User.firstName + " " + questionInfo.User.lastName}</h1>
                    <h1 className="text-5xl text-amber-50">{questionInfo.title}</h1>
                    {questionInfo.tags.length > 0 ?
                        <h1 className="text-amber-50 pt-6">Tags: {questionInfo.tags.join(", ")}</h1> : null}
                </>}
        </div>
    }

    // TODO improve code
    function handleSubmit() {
        axios
            .get("/filter/filter-by-tags", {params: {classId: id, tags: selectedOptions, showDeleted: showDeleted}})
            .then((res) => {
                console.log(selectedOptions)
                let questions = []
                for (let question of res.data) {
                    if (questions[question.id] === undefined) {
                        if (question.tagName === null) {
                            questions[question.id] = createQuestionWithoutTags(question)
                        } else {
                            questions[question.id] = createQuestionWithTags(question)
                        }
                    } else {
                        questions[question.id].tags.push(question.tagName)
                    }
                }
                setQuestions(
                    questions.map((questionInfo) => {
                        if (questionInfo[2] === undefined || questionInfo[2].length === 0) {
                            return (
                                <Question key={questionInfo.id} questionInfo={questionInfo}/>
                            )
                        }
                        return(
                            <Question key={questionInfo.id} questionInfo={questionInfo}/>
                        )
                    })
                )
            })
            .catch((err) => {
                console.log(err)
                console.log("Question error")
            })
    }
    const createQuestionWithTags = (question) => {
        return {
            id: question.id,
            title: question.title,
            description: question.description,
            classId: question.classId,
            wasReported: question.wasReported,
            isActive: question.isActive,
            tagId: question.tagId,
            tagName: question.tagName,
            canBeDeleted: question.canBeDeleted,
            User: {
                userId: question.userId,
                firstName: question.firstName,
                lastName: question.lastName,
            },
            tags: [question.tagName]
        }
    }

    const createQuestionWithoutTags = (question) => {
        return {
            id: question.id,
            title: question.title,
            description: question.description,
            classId: question.classId,
            wasReported: question.wasReported,
            isActive: question.isActive,
            tagId: question.tagId,
            tagName: question.tagName,
            userId: question.userId,
            canBeDeleted: question.canBeDeleted,
            User: {
                userId: question.userId,
                firstName: question.firstName,
                lastName: question.lastName,
            },
            tags: []
        }
    }

    const options = tags.map((tag) => {
        return { value: tag.id, label: tag.name }
    })

    const handleChange = (opts) => {
        setSelectedOptions(opts.map((opt) => opt.value));
    };
    return (
        <div>
            <div className="w-1/4 inline-block">
                <Select
                    closeMenuOnSelect={false}
                    isMulti
                    name="tags"
                    options={options}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleChange}
                />
            </div>
            <div className="inline-block align-middle p-3">
                <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" onChange={() => {setShowDeleted(!showDeleted)}}></input>
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-black-300">Show Deleted Questions</span>
                </label>
            </div>
            <button onClick={handleSubmit} className="bg-green-500 rounded-2xl p-3 m-1">Submit</button>
        </div>
    )

}