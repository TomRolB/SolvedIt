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
        if (!responseValue) return false;
        console.log("Not empty response value: ",responseValue)
        return responseValue.length !== 0;
    }

    const inviteLinkRequest = await fetch(`/class/byId/${id}/get-link`).catch(err => console.log(err))
    const inviteLink = await inviteLinkRequest.json()
    // console.log("InviteLink: "+ inviteLink);

    // console.log("IsActive: " + inviteLink.isActive)

    if(!inviteLink.isActive) return false;

    const alreadyEnrolled = (!uuid || !id) ? false : await notEmptyResponse(`/class/${uuid}/enrolled-in/${id}`)
    const classExists = await notEmptyResponse(`/class/byId/${id}`)


    if (!classExists) return false
    if(alreadyEnrolled) return true

    let response = await fetch(`/class/${uuid}/enroll-to/${id}`, {method:'POST'})
    console.log(response);
    let resVal = await response.json()
    console.log("Message: ", resVal);
    return resVal.length !==0
}