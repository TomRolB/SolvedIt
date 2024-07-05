import {Navbar} from "../components/Navbar";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";


export const Notifications = () => {
    const navigate = useNavigate()
    let [notifications, setNotifications] = useState([])
    let [page, setPage] = useState(0)

    const goToNotificationSettings = () => {
        navigate("/notifications/settings")
    }

    useEffect(() => {
        const getNotifications = async () => {
            let response = await fetch(`/notification/getAllNotifications/${localStorage.getItem('uuid')}`)
            let responseValue = await response.json()
            console.log(responseValue);
            if (responseValue.length > 0) {
                setNotifications(responseValue)
            }
        }
        getNotifications().catch(err => console.log(err))
    }, []);


        function createEntry(notification) {
        return (
            <tr>
            <th scope="col" className="px-6 py-3">
                {notification.userId}
            </th>
            <th scope="col" className="px-6 py-3">
                {notification.title}
            </th>
            <th scope="col" className="px-6 py-3">
                {notification.description}
            </th>
            <th scope="col" className="px-6 py-3">
                {notification.createdAt}
            </th>
            <th scope="col" className="px-6 py-3">
                {notification.notificationType}
            </th>
                <th scope="col" className="px-6 py-3">
                {notification.classId}
            </th>
        </tr>);
    }

    return (
        <>
            <Navbar></Navbar>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
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
                                    When
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Class
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {notifications.slice(10 * page, 10 *(page + 1)).map(notification => createEntry(notification))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-center items-center mt-2">
                    <button type="button" onClick={() => page > 0 ? setPage(page - 1) : setPage(0)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        <i className="fa-solid fa-arrow-left"></i> Previous
                    </button>
                    <button type="button" onClick={() => notifications.length / 10 > page + 1 ? setPage(page + 1) : setPage(page)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        Next <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </>
    )
}