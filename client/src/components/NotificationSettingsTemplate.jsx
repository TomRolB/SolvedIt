import React, {useEffect, useState} from "react";
import axios from "axios";

export const NotificationSettingsTemplate = ({classId}) => {

    const [newQuestionOptions, setNewQuestionOptions] = useState(null)
    const [newAnswerOptions, setNewAnswerOptions] = useState(null)
    const [validationOptions, setValidationOptions] = useState(null)
    const [emailNotification, setEmailNotification] = useState(null)
    const [selectedNewQuestionOption, setSelectedNewQuestionOption] = useState(null)
    const [selectedNewAnswerOption, setSelectedNewAnswerOption] = useState(null)
    const [selectedValidationOption, setSelectedValidationOption] = useState(null)

    const getNotificationSettings = () => {
        if (classId === null) {
            axios.get("/notification/get-general-notification-settings", {params: {uuid: localStorage.getItem("uuid")}})
                .then((res) => {
                    console.log(res.data)
                    createNotificationSettings(res.data)
                })
        } else {
            axios.get(`/notification/get-notification-settings-of-class/${classId}`, {params: {uuid: localStorage.getItem("uuid")}})
                .then((res) => {
                    console.log(res.data)
                    createNotificationSettings(res.data)
                })
        }
    }

    const createNotificationSettings = (res) => {
        setSelectedNewQuestionOption(res.newQuestions)
        if (res.newQuestions === "All") {
            setNewQuestionOptions(
                <select id="new-questions"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={selectedNewQuestionOption}
                        onChange={(e) => setSelectedNewQuestionOption(e.target.value)}
                >
                    <option selected value="All">All</option>
                    <option value="None">None</option>
                </select>
            )
        } else {
            setNewQuestionOptions(
                <select id="new-questions"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={selectedNewQuestionOption}
                        onChange={(e) => setSelectedNewQuestionOption(e.target.value)}
                >
                    <option value="All">All</option>
                    <option selected value="None">None</option>
                </select>
            )
        }
        setSelectedNewAnswerOption(res.newAnswers)
        if (res.newAnswers === "All") {
            setNewAnswerOptions(
                <select id="new-answers"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={selectedNewAnswerOption}
                        onChange={(e) => setSelectedNewAnswerOption(e.target.value)}
                >
                    <option selected value="All">All</option>
                    <option value="Teacher">Teacher's</option>
                    <option value="None">None</option>
                </select>
            )
        } else if (res.newAnswers === "None") {
            setNewAnswerOptions(
                <select id="new-answers"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={selectedNewAnswerOption}
                        onChange={(e) => setSelectedNewAnswerOption(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Teacher">Teacher's</option>
                    <option selected value="None">None</option>
                </select>
            )
        } else {
            setNewAnswerOptions(
                <select id="new-answers"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={selectedNewAnswerOption}
                        onChange={(e) => setSelectedNewAnswerOption(e.target.value)}
                >
                    <option value="All">All</option>
                    <option selected value="Teacher">Teacher's</option>
                    <option value="None">None</option>
                </select>
            )
        }
        setSelectedValidationOption(res.validation)
        if (res.validation === "Always") {
            setValidationOptions(
                <select id="new-questions"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={selectedValidationOption}
                        onChange={(e) => setSelectedValidationOption(e.target.value)}
                >
                    <option selected value="Always">Always</option>
                    <option value="Never">Never</option>
                </select>
            )
        } else {
            setValidationOptions(
                <select id="new-questions"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={selectedValidationOption}
                        onChange={(e) => setSelectedValidationOption(e.target.value)}
                >
                    <option value="Always">Always</option>
                    <option selected value="Never">Never</option>
                </select>
            )
        }
        setEmailNotification(res.notifyByEmail)
    }

    const handleSettingsSubmit = () => {
        if (classId === null) {
            axios.post("/notification/update-general-notification-settings", {
                uuid: localStorage.getItem("uuid"),
                newQuestions: selectedNewQuestionOption,
                newAnswers: selectedNewAnswerOption,
                validation: selectedValidationOption,
                notifyByEmail: emailNotification,
                isActive: true
            })
                .then((res) => console.log(res))
                .catch(err => console.log(err))
        } else {
            axios.post("notification/update-notification-settings-of-class/" + classId, {
                uuid: localStorage.getItem("uuid"),
                newQuestions: selectedNewQuestionOption,
                newAnswers: selectedNewAnswerOption,
                validation: selectedValidationOption,
                notifyByEmail: emailNotification,
                isActive: true
            })
                .then((res) => console.log(res))
                .catch(err => console.log(err))
        }
    }

    useEffect(() => {
        getNotificationSettings();
    }, []);

    return (
        <>
            <div className="pb-4">
                <h2 className="text-4xl font-extrabold">New Questions</h2>
                <form className="max-w-sm pt-1">
                    {newQuestionOptions}
                </form>
            </div>
            <div className="py-4">
                <h2 className="text-4xl font-extrabold">New Answers to Own Question</h2>
                <form className="max-w-sm pt-1">
                    {newAnswerOptions}
                </form>
            </div>
            <div className="py-4">
                <h2 className="text-4xl font-extrabold">Validation to Own Answer</h2>
                <form className="max-w-sm pt-1">
                    {validationOptions}
                </form>
            </div>
            <label className="flex items-center cursor-pointer pt-1 w-max">
                <input type="checkbox" value="" className="sr-only peer" onClick={() => setEmailNotification(!emailNotification)}/>
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 ">Notify by Email</span>
            </label>
            {/*{classId === null ? null :*/}
            {/*    <label className="inline-flex items-center cursor-pointer pt-1 w-max">*/}
            {/*        <input type="checkbox" value="" className="sr-only peer" onClick={() => setEmailNotification(!emailNotification)}/>*/}
            {/*        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>*/}
            {/*        <span className="ms-3 text-sm font-medium text-gray-900 ">Override General Notification Settings</span>*/}
            {/*    </label>*/}
            {/*}*/}
            <button type="button"
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={handleSettingsSubmit}
            >
                <a href="/">Submit</a>
            </button>
        </>
    )
}