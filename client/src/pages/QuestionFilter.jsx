import React, {useEffect, useState} from "react";
import Select from "react-select";
import axios from "axios";
import {useParams} from "react-router-dom";


export const QuestionFilter = ({questions, createQuestionElements}) => {
    const [tags, setTags] = useState([])
    const [selectedOptions, setSelectedOptions] = useState(null);
    const [showDeleted, setShowDeleted] = useState(false)
    let {id} = useParams()

    useEffect(() => {
        axios
        .get(`/class/byId/${id}/post-question`)
        .then((res) => {
            setTags(res.data)
        }).catch(err => console.log(err))
    }, [])


    function handleSubmit() {
        axios
            .get("/filter/filter-by-tags", {params:
                    {classId: id, tags: selectedOptions, showDeleted: showDeleted, uuid: localStorage.getItem("uuid")}
            })
            .then((res) => {
                createQuestionElements(res.data)
            })
            .catch((err) => {
                console.log(err)
                console.log("Question error")
            })
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
            <button onClick={handleSubmit} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"><i className="fa-solid fa-magnifying-glass"></i> Search</button>
        </div>
    )

}