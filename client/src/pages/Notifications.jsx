import {Navbar} from "../components/Navbar";
import {useNavigate} from "react-router-dom";
import React from "react";


export const Notifications = () => {
    const navigate = useNavigate()

    const goToNotificationSettings = () => {
        navigate("/notifications/settings")
    }

    return (
        <>
            <Navbar></Navbar>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <h1>Notifications</h1>
                <button onClick={goToNotificationSettings} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Notification Settings</button>
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
                            {/*{questionRows}*/}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}