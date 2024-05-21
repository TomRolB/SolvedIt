import "../styles/LinkEnterPopUp.css"

export async function ClassEnroll()   {
    let uuid = localStorage.getItem("uuid");
    let link = window?.location.href
    const classIdFormat = /\d+(?!.*\d)/i
    let id = Number(link.match(classIdFormat))

    async function notEmptyResponse(endpoint) {
        const response = await fetch(endpoint)
        if(!response) return false;
        const responseValue = await response.json()
        return responseValue === null ? false : responseValue.length !== 0;
    }

    const alreadyEnrolled = !uuid || !id ? false : await notEmptyResponse(`/class/${uuid}/enrolled-in/${id}`)
    const classExists = await notEmptyResponse(`/class/byId/${id}`)

    if (!classExists) return false
    if(alreadyEnrolled) return true

    let response = await fetch(`/class/${uuid}/enroll-to/${id}`, {method:'POST'})
    let message = await response.json()
    return message === "Successfully enrolled"
}