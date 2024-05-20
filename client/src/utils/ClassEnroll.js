import {useUserUuid} from "../hooks/useUserUuid";
import "../styles/LinkEnterPopUp.css"
import {useEffect, useState} from "react";

export const ClassEnroll = async () => {
    let [uuid, setUuid] = useUserUuid()
    let link = window.location.href
    const classIdFormat = /\d+(?!.*\d)/i
    let id = Number(link.match(classIdFormat))

    let redirectable = false;

    async function notEmptyResponse(endpoint) {
        const response = await fetch(endpoint)
        const responseValue = await response.json()
        if(!response){
            return false;
        }
        console.log(id)
        return responseValue.length !== 0;
    }

    const alreadyEnrolled = async () => {
        if (!uuid || !id) {
            throw new Error("No student or class selected")
        }
        try {
            return notEmptyResponse(`http://localhost:3001/class/${uuid}/enrolled-in/${id}`)
        } catch (err) {
            console.log(err)
        }
    }

    const classExists = async () => {
        try {
            return notEmptyResponse(`http://localhost:3001/class/byId/${id}`)
        } catch (err) {
            console.log(err)
        }
    }

    try {
        if (await classExists()){
            if(await alreadyEnrolled()){
                return alreadyEnrolled()
            }
            else{
                let response = await fetch(`http://localhost:3001/class/${uuid}/enroll-to/${id}`, {method:'POST'})
                let message = await response.json().message
                return message === "Successfully enrolled"
            }
        }
        else return false;
    } catch (err){
        console.log(err)
    }

}