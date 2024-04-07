import React, {useState} from 'react';
import axios from "axios";

export function CreateClass() {
    const [className, setClassName] = useState("")
    const [description, setDescription] = useState("")

    function handleClassNameChange(event) {
        setClassName(event.target.value)
    }

    function handleDescriptionChange(event) {
        setDescription(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault() //Prevents page from refreshing
        axios
            .post("/create-class", {
                name: className,
                description: description
            })
            .then((res) => console.log(res.data))
            .catch(err => console.log(err))
    }

    return (
        <div className="">
            <form method="post" onSubmit={handleSubmit}>
                <label htmlFor="className">Class Name:</label><br/>
                <input className={"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"} type="text" id="className" name="classtName"
                       onChange={handleClassNameChange}/><br/>
                <label htmlFor="lastName">Description:</label><br/>
                <input className={"block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"} type="text" id="lastName" name="lastName"
                       onChange={handleDescriptionChange}/><br/>
                <input className="h-10 w-40 bg-blue-700 text-white text-xl mt-2 md-2 rounded" type="submit"/>
            </form>
        </div>
    );
}