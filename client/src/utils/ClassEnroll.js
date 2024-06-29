import "../styles/LinkEnterPopUp.css"
import {useEffect, useState} from "react";

export async function ClassEnroll()   {
    let uuid = localStorage.getItem("uuid");
    let link = window?.location.href
    link = link.replace(/localhost:\d+/g,"")
    const classIdFormat =/\d+(?!.*\d)/i
    let id = Number(link.match(classIdFormat))
    if(id === 0) return
    // console.log(id)

    async function notEmptyResponse(endpoint) {
        const response = await fetch(endpoint)
        if(!response) return false;
        let responseValue = await response.json()
        // console.log(responseValue)
        return responseValue.length !== 0;
    }

    const alreadyEnrolled = (!uuid || !id) ? false : await notEmptyResponse(`/class/${uuid}/enrolled-in/${id}`)
    const classExists = await notEmptyResponse(`/class/byId/${id}`)


    if (!classExists) return false
    if(alreadyEnrolled) return true

    let response = await fetch(`/class/${uuid}/enroll-to/${id}`, {method:'POST'})
    let resVal = await response.json()
    return resVal.message === "Successfully enrolled"
}