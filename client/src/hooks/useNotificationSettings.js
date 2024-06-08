import {useEffect, useState} from "react";

export const useNotificationSettings = (classId)=>{
    let [settings, setSettings] = useState({});
    useEffect(async () => {
        let response;
        if (!classId) {
            response = await fetch("notification/get-general-notification-settings")
        }
        else{
            response = await fetch(`notification/get-notification-settings-of-class/${classId}`)
        }
        let responseValue = await response.json()
        setSettings(responseValue)
    }, []);
    return [settings, setSettings]
}