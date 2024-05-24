import React, {useEffect, useState} from "react";
import Select from "react-select";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";


export const ClassFilter = () => {
    const [tags, setTags] = useState([])
    const [selectedOptions, setSelectedOptions] = useState(null);
    let {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        axios
        .get(`/class/byId/${id}/post-question`)
        .then((res) => {
            setTags(res.data)
        }).catch(err => console.log(err))
    }, [])

    function handleSubmit(event) {
        // event.preventDefault()
        // axios
        //     .post("/question/post-question", {
        //         classId: id,
        //         uuid: localStorage.getItem("uuid"),
        //         tags: selectedOptions
        //     })
        //     .then((res) => {
        //         console.log(res)
        //     })
        //     .catch((err) => console.log(err))
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
                    <input type="checkbox" value="" className="sr-only peer"></input>
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Hide Hidden Tags</span>
                </label>
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )

}