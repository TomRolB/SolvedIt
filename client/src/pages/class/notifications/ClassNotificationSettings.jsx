import {Navbar} from "../components/Navbar";
import React from "react";
import {useParams} from "react-router-dom";
import {NotificationSettingsTemplate} from "../components/NotificationSettingsTemplate";


export const ClassNotificationSettings = () => {
    let {id} = useParams()

    return (
        <>
            <Navbar></Navbar>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <NotificationSettingsTemplate classId={id}></NotificationSettingsTemplate>
            </div>
        </>
    )
}