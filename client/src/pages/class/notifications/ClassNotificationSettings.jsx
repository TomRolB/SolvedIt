import React from "react";
import {useParams} from "react-router-dom";
import {Navbar} from "../../../components/Navbar";
import {NotificationSettingsTemplate} from "../../../components/NotificationSettingsTemplate";
import {ReturnButton} from "../../../components/ReturnButton";


export const ClassNotificationSettings = () => {
    let {id} = useParams()

    return (
        <>
            <Navbar></Navbar>
            <div className="min-h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <ReturnButton path={"/class/" + id}></ReturnButton>
                <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-black-900 md:text-5xl lg:text-6xl col-span-4">Class Notification Settings</h1>
                <NotificationSettingsTemplate classId={id}></NotificationSettingsTemplate>
            </div>
        </>
    )
}