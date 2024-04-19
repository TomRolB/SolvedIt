import {useParams} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

export function Invites() {
    const [isOneTime, setIsOneTime] = useState(true);
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [generatedCode, setGeneratedCode] = useState(null)
    const [expiration, setExpiration] = useState(null)

    function handleEmailChange(event) {
        // Sets email each time that a letter is
        // pressed in the html text input
        setEmail(event.target.value)
    }

    function handleExpirationChange(event) {
        setExpiration(event.target.value)
    }

    let {id} = useParams()

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
            <h1>Codes</h1>
            <button>+New Code</button>
            <form onSubmit={handleCodeCreation}>
                {errorMessage ? <h1 color={"red"}>{errorMessage}</h1> : null}
                <label>one-time</label>
                <input type="checkbox" onChange={handleCheckboxChange} checked/>
                {input}
                <input type="submit" text="Generate"/>
            </form>
            <h1>Link</h1>
        </>
    )
}