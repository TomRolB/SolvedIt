import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import * as PropTypes from "prop-types";

function ManyTimesCode({code, expiration, userCount}) {
    return <>
        <ul className="bg-gray-800 text-amber-50">
            <li className="float-left block pr-20">{code}</li>
            <li className="float-left block pr-20">{"Expiration: " + expiration}</li>
            <li className="float-left block">{"Used by " + userCount + " users"}</li><br/>
        </ul>
    </>
}

ManyTimesCode.propTypes = {
    userCount: PropTypes.any,
    expiration: PropTypes.any
};

function OneTimeCode({code, email}) {
    return <>
        <ul className="bg-gray-800 text-amber-50">
            <li className="float-left block pr-20">{code}</li>
            <li className="float-left block pr-20">{"Sent to user with email " + email}</li><br/>
        </ul>
    </>
}

export function Invites() {
    let {id} = useParams()

    const [isOneTime, setIsOneTime] = useState(true);
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [generatedCode, setGeneratedCode] = useState(null)
    const [expiration, setExpiration] = useState(null)

    const [oneTimeCodes, setOneTimeCodes] = useState([])
    const [manyTimesCodes, setManyTimesCodes] = useState([])

    function handleCodeResponse(res) {
        let oneTime = []
        let manyTimes = []
        res.data.forEach((codeRegister) => {
            if (codeRegister.codeType === "one-time") oneTime.push(
                <OneTimeCode
                    code={codeRegister.code}
                    email={codeRegister.User.email}
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
            .get("/Invite/getCodes", {params:{classId: id}})
            .then((res) => handleCodeResponse(res))
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        fetchCodes()
    }, [])

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
        } else {
            setErrorMessage(result.data.errorMessage)
        }
    }
    const handleCodeCreation = (event) => {
        event.preventDefault() //Prevents page from refreshing

        if (isOneTime) {
            axios
                .post("/invite/one-time", {classId: id, email: email})
                .then((res) => handleResult(res))
                .catch((error) => console.log(error))
        } else {
            axios
                .post("/invite/many-times", {classId: id, expiration: expiration})
                .then((res) => handleResult(res))
                .catch((error) => console.log(error))
        }
    }

    let input
    if (isOneTime) {
        input =
        <>
            <h1>user email:</h1>
            <input type="text" onChange={handleEmailChange}/>
            {generatedCode? <h1 color={"green"}>{generatedCode}</h1> : null}
        </>
    } else {
        input =
        <>
            <h1>expiration:</h1>
            <input type="date" onChange={handleExpirationChange}/>
        </>
    }

    const handleCheckboxChange = () => {
        setIsOneTime(!isOneTime)
    }

    return (
        <>
            <h1>One-time codes</h1>
            {oneTimeCodes}
            <h1>Many-times codes</h1>
            {manyTimesCodes}
            <button>Create new code:</button>
            <form onSubmit={handleCodeCreation}>
                {errorMessage ? <h1 color={"red"}>{errorMessage}</h1> : null}
                <label>one-time</label>
                <input type="checkbox" onChange={handleCheckboxChange} checked={isOneTime}/>
                {input}<br/>
                <input type="submit" value="Generate"/>
            </form>
            <h1>Link</h1>
        </>
    )
}