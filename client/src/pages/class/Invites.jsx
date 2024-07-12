import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import * as PropTypes from "prop-types";
import {Navbar} from "../../components/Navbar";
import {Copy} from "../../components/Copy";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManyTimesCode({code, expiration, userCount}) {
    return <>
        <ul className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 pb-2 pt-2 max-w-xl">
            <li className="font-mono border-gray-700 float-left block pl-2 pr-5 dark:text-white rounded">{code}</li>
            <li className="border-gray-700 float-left block pl-2 pr-5 dark:text-white rounded">{"Expiration: " + expiration.slice(0, 10)}</li>
            <li className="border-gray-700 float-left block pl-2 pr-2 dark:text-white rounded">{"Used by " + userCount + " users"}</li><br/>
        </ul>
    </>
}

ManyTimesCode.propTypes = {
    userCount: PropTypes.any,
    expiration: PropTypes.any
};

function OneTimeCode({code, email, userCount}) {
    return <div>
        <ul className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 pb-2 pt-2 max-w-xl">
            <li className="font-mono border-gray-700 float-left block pl-2 pr-5 dark:text-white rounded">{code}</li>
            <li className="border-gray-700 float-left block pl-2 pr-5 dark:text-white rounded">{"Sent to user with email " + email}</li>
            <li className="border-gray-700 float-left block pl-2 pr-2 dark:text-white rounded">{userCount ? "Used": "Not used yet"}</li>
            <br/>
        </ul>
    </div>
}

function Subtitle({text}) {
    return <h2 className="text-3xl font-semibold dark:text-black pt-3 pb-2">{text}</h2>
}

Subtitle.propTypes = {text: PropTypes.string};

export function Invites() {
    let {id} = useParams()

    const [isAdmin, setIsAdmin] = useState(false)

    const [isOneTime, setIsOneTime] = useState(true);
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [generatedCode, setGeneratedCode] = useState(null)
    const [expiration, setExpiration] = useState(null)

    const [oneTimeCodes, setOneTimeCodes] = useState([])
    const [manyTimesCodes, setManyTimesCodes] = useState([])
    const [linkIsActive, setLinkIsActive] = useState(false)

    function handleCodeResponse(res) {
        let oneTime = []
        let manyTimes = []
        res.data.forEach((codeRegister) => {
            if (codeRegister.codeType === "one-time") oneTime.push(
                <OneTimeCode
                    code={codeRegister.code}
                    email={codeRegister.User.email}
                    userCount={codeRegister.userCount}
                />
            )
            else manyTimes.push(
                <ManyTimesCode
                    code={codeRegister.code}
                    expiration={codeRegister.expiration}
                    userCount={codeRegister.userCount}
                />
            )
        })

        console.log(manyTimes)

        setOneTimeCodes(oneTime)
        setManyTimesCodes(manyTimes)
    }

    const fetchCodes = () => {
        axios
            .get("/Invite/getCodes", {params:{classId: id, uuid: localStorage.getItem("uuid")}})
            .then((res) => handleCodeResponse(res))
            .catch((err) => console.log(err))
    }

    function checkUserIsAdmin() {
        axios
            .get("/users/is-admin", {params: {uuid: localStorage.getItem('uuid'), classId: id}})
            .then((res) => setIsAdmin(res.data.isAdmin))
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        checkUserIsAdmin()
        console.log(isAdmin)
        if (isAdmin) fetchCodes()
        axios.get(`/class/byId/${id}/get-link`).then(res=> {
            setLinkIsActive(res.data.isActive)
        }).catch(err => console.log(err))

    }, [isAdmin])

    function handleEmailChange(event) {
        // Sets email each time that a letter is
        // pressed in the html text input
        setEmail(event.target.value)
    }

    function handleExpirationChange(event) {
        setExpiration(event.target.value)
    }

    function handleResult(result) {
        if (result.data.wasSuccessful) {
            setGeneratedCode(result.data.inviteCode)
            fetchCodes()
            toast.success("Code created successfully")
        } else {
            setErrorMessage(result.data.errorMessage)
        }
    }
    const handleCodeCreation = (event) => {
        event.preventDefault() //Prevents page from refreshing

        if (isOneTime) {
            axios
                .post("/invite/one-time", {classId: id, email: email, uuid: localStorage.getItem("uuid")})
                .then((res) => handleResult(res))
                .catch((error) => console.log(error))
        } else {
            axios
                .post("/invite/many-times", {classId: id, expiration: expiration, uuid: localStorage.getItem("uuid")})
                .then((res) => handleResult(res))
                .catch((error) => console.log(error))
        }
    }

    let input
    if (isOneTime) {
        input =
        <>
            <h1>user email:</h1>
            <input type="text" onChange={handleEmailChange} className="h-10 w-80 border-blue-700 border-2 rounded mt-2 md-2 text-xl"/>
            {generatedCode? <h1 color={"green"}>{generatedCode}</h1> : null}
        </>
    } else {
        input =
        <>
            <h1>expiration:</h1>
            <input type="date" onChange={handleExpirationChange} className="h-10 w-80 border-blue-700 border-2 rounded mt-2 md-2 text-xl"/>
        </>
    }

    const handleCheckboxChange = () => {
        setIsOneTime(!isOneTime)
    }

    function handleActiveChange() {
        setLinkIsActive(!linkIsActive)
        axios.post(`/class/byId/${id}/change-link-activity`).then(res => console.log(res)).catch(err => console.log(err))
    }

    return isAdmin? (
        <div>
            <Navbar></Navbar>
            <div className="bg-gradient-to-tr from-white to-blue-300">
                <Subtitle text={"One-time codes"}></Subtitle>
                {oneTimeCodes.length > 0 ? oneTimeCodes : "No one-time codes created"}
                <Subtitle text={"Many-times codes"}></Subtitle>
                {manyTimesCodes.length > 0 ? manyTimesCodes : "No many-times codes created"}
                <Subtitle text={"Create new code"}></Subtitle>
                <form onSubmit={handleCodeCreation}>
                    {errorMessage ? <h1 color={"red"}>{errorMessage}</h1> : null}
                    <label>one-time</label>
                    <input type="checkbox" onChange={handleCheckboxChange} checked={isOneTime}/>
                    {input}<br/>
                    <input type="submit" value="Generate"
                           className="h-10 w-40 bg-blue-700 text-white text-xl mt-2 md-2 rounded"/>
                </form>
                <div>
                <Subtitle text={"Link"}></Subtitle>
                        <Copy text={`http://localhost:3000/enroll-to/${id}`} style={{ width: 'auto', height: 'auto' }}></Copy>
                        <label style={{ marginRight: '1em' }}>Is Active</label>
                        <input type="checkbox" onChange={handleActiveChange} checked={linkIsActive}/>

                </div>
            </div>
        </div>
    ) : null
}