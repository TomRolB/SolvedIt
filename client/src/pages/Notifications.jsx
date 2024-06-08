import {Navbar} from "../components/Navbar";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Select from "react-select";


export const Notifications = () => {
    const navigate = useNavigate()
    let [notifications, setNotifications] = useState([])
    let [selectedOptions, setSelectedOptions] = useState(null);
    let [filtered, setFiltered] = useState([])

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
    }, [filtered]);


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

    const handleChange = (opts) => {
        setSelectedOptions(opts.map((opt) => opt.value));
    };
    const options = ()=>{
        return [{value: "last month", label: "last month"},{value: "last week", label: "last week"},{value: "all", label: "all"}]
    }

    function isAbleByTime(notif) {
        let now = new Date();
        let notifDate = new Date(notif.createdAt);
        let diffTime = Math.abs(now - notifDate);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (selectedOptions.includes("last month") && diffDays <= 30) {
            return true;
        } else if (selectedOptions.includes("last week") && diffDays <= 7) {
            return true;
        } else if (selectedOptions.includes("all")) {
            return true;
        }
        return false;
    }


    function handleSubmit() {
        let filtered = notifications.filter(notif => isAbleByTime(notif))
        setFiltered(filtered)
    }

    return (
        <>
            <Navbar></Navbar>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <button onClick={goToNotificationSettings} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Notification Settings</button>
                <div className='p-5 grid grid-cols-3 divide-x'>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg col-span-3">
                        <Select
                            closeMenuOnSelect={false}
                            isMulti
                            name="tags"
                            options={options()}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleChange}
                        />
                        <button onClick={handleSubmit} type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                            <i className="fa-solid fa-magnifying-glass"></i> Search</button>
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
                            {filtered.map(notification => createEntry(notification))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    )
}