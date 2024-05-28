import {Navbar} from "../components/Navbar";
import axios from "axios";
import React, {useEffect, useState} from "react";
export const NotificationSettings = () => {
    const [classRows, setClassRows] = useState(null)

    const fetchCourseInfo = () => {
        axios.post("/home/get-courses", {uuid: localStorage.getItem("uuid")})
            .then((res) => createClassRows(res.data))
            .catch(err => console.log(err))
    }

    const createClassRows = (res) => {
        setClassRows(res.map((classInfo) => {
            return (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {classInfo.name}
                    </th>
                    <td className="px-6 py-4">
                        {classInfo.classId}
                    </td>
                    <td className="px-6 py-4">
                        <a href={"/class/" + classInfo.classId + "/notification-settings"} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a>
                    </td>
                </tr>
            )
        }))
    }

    useEffect(() => {
        fetchCourseInfo();
    }, []);


    return (
        <div>
            <Navbar></Navbar>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-black-900 md:text-5xl lg:text-6xl col-span-4">Notification Settings</h1>
                <div className="grid grid-cols-4 divide-x">
                    <div className="col-span-2">
                        <div className="pb-4">
                            <h2 className="text-4xl font-extrabold">New Questions</h2>
                            <form className="max-w-sm pt-1">
                                <select id="new-questions" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected value="all">All</option>
                                    <option value="none">None</option>
                                </select>
                            </form>
                            <label className="flex items-center cursor-pointer pt-1 w-max">
                                <input type="checkbox" value="" className="sr-only peer"/>
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 ">Notify by Email</span>
                            </label>
                        </div>
                        <div className="py-4">
                            <h2 className="text-4xl font-extrabold">New Answers to Own Question</h2>
                            <form className="max-w-sm pt-1">
                                <select id="new-questions" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected value="all">All</option>
                                    <option value="teacher">Teacher's</option>
                                    <option value="none">None</option>
                                </select>
                            </form>
                            <label className="flex items-center cursor-pointer pt-1 w-max">
                                <input type="checkbox" value="" className="sr-only peer"/>
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 ">Notify by Email</span>
                            </label>
                        </div>
                        <div className="py-4">
                            <h2 className="text-4xl font-extrabold">Validation to Own Answer</h2>
                            <form className="max-w-sm pt-1">
                                <select id="new-questions" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected value="always">Always</option>
                                    <option value="never">Never</option>
                                </select>
                            </form>
                            <label className="flex items-center cursor-pointer pt-1 w-max">
                                <input type="checkbox" value="" className="sr-only peer"/>
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-900 ">Notify by Email</span>
                            </label>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className="pb-4">
                            <h2 className="text-4xl font-extrabold">Custom Settings for Each Class</h2>
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
                                <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 =">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Class Name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Class ID
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Action
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {classRows}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}