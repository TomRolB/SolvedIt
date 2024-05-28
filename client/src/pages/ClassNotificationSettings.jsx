import {Navbar} from "../components/Navbar";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import {NotificationSettingsTemplate} from "../components/NotificationSettingsTemplate";


export const ClassNotificationSettings = () => {
    const [className, setClassName] = useState("");
    let {id} = useParams()

    useEffect(() => {
        axios.get("/class/byId/" + id).then((res) => {setClassName(res.data.name)}).catch(err => console.log(err))
    }, []);

    return (
        <>
            <Navbar></Navbar>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <NotificationSettingsTemplate classId={id}></NotificationSettingsTemplate>
                {/*<h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-black-900 md:text-5xl lg:text-6xl col-span-4">Notification Settings for {className}</h1>*/}
                {/*<div className="pb-4">*/}
                {/*    <h2 className="text-4xl font-extrabold">New Questions</h2>*/}
                {/*    <form className="max-w-sm pt-1">*/}
                {/*        <select id="new-questions" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">*/}
                {/*            <option selected value="all">All</option>*/}
                {/*            <option value="none">None</option>*/}
                {/*        </select>*/}
                {/*    </form>*/}
                {/*    <label className="flex items-center cursor-pointer pt-1 w-max">*/}
                {/*        <input type="checkbox" value="" className="sr-only peer"/>*/}
                {/*        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>*/}
                {/*        <span className="ms-3 text-sm font-medium text-gray-900 ">Notify by Email</span>*/}
                {/*    </label>*/}
                {/*</div>*/}
                {/*<div className="py-4">*/}
                {/*    <h2 className="text-4xl font-extrabold">New Answers to Own Question</h2>*/}
                {/*    <form className="max-w-sm pt-1">*/}
                {/*        <select id="new-questions" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">*/}
                {/*            <option selected value="all">All</option>*/}
                {/*            <option value="teacher">Teacher's</option>*/}
                {/*            <option value="none">None</option>*/}
                {/*        </select>*/}
                {/*    </form>*/}
                {/*    <label className="flex items-center cursor-pointer pt-1 w-max">*/}
                {/*        <input type="checkbox" value="" className="sr-only peer"/>*/}
                {/*        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>*/}
                {/*        <span className="ms-3 text-sm font-medium text-gray-900 ">Notify by Email</span>*/}
                {/*    </label>*/}
                {/*</div>*/}
                {/*<div className="py-4">*/}
                {/*    <h2 className="text-4xl font-extrabold">Validation to Own Answer</h2>*/}
                {/*    <form className="max-w-sm pt-1">*/}
                {/*        <select id="new-questions" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">*/}
                {/*            <option selected value="always">Always</option>*/}
                {/*            <option value="never">Never</option>*/}
                {/*        </select>*/}
                {/*    </form>*/}
                {/*    <label className="flex items-center cursor-pointer pt-1 w-max">*/}
                {/*        <input type="checkbox" value="" className="sr-only peer"/>*/}
                {/*        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>*/}
                {/*        <span className="ms-3 text-sm font-medium text-gray-900 ">Notify by Email</span>*/}
                {/*    </label>*/}
                {/*</div>*/}
            </div>
        </>
    )
}