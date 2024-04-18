import {useParams} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

export function Invites() {
    const [isOneTime, setIsOneTime] = useState(true);
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [generatedCode, setGeneratedCode] = useState(null)

    function handleEmailChange(event) {
        // Sets email each time that a letter is
        // pressed in the html text input
        setEmail(event.target.value);
    }

    let {id} = useParams()

    function handleResult(result) {
        if (result.data.wasSuccessful) {
            console.log("Successfully created invite code")
            setGeneratedCode(result.data.code)
        } else {
            console.log(result)
            console.log(result.data.errorMessage)
            setErrorMessage(result.data.errorMessage)
        }
    }
    const handleOneTimeCodeCreation = (event) => {
        event.preventDefault() //Prevents page from refreshing
        axios
            .post("/invite/one-time", {classId: id, email: email})
            .then((res)=> handleResult(res))
            .catch((error) => console.log(error))
    }

    let input
    if (isOneTime) {
        input =
        <>
            <h1>user email:</h1>
            <input type="text" onChange={handleEmailChange}/>
            <input type="submit" text="Generate"/>
            {generatedCode? <h1 color="green">{generatedCode}</h1> : null}
        </>
    } else {
        input =
        <>
            <h1>expiration:</h1>
            <input type="date" />
        </>
    }

    const handleCheckboxChange = () => {
        setIsOneTime(!isOneTime)
    }

    return (
        <>
            <h1>Codes</h1>
            <button>+New Code</button>
            <form onSubmit={handleOneTimeCodeCreation}>
                {errorMessage ? <h1 color="red">{errorMessage}</h1> : null}
                <label>one-time</label>
                <input type="checkbox" onChange={handleCheckboxChange}/>
                {input}
            </form>
            <h1>Link</h1>
        </>
    )
}