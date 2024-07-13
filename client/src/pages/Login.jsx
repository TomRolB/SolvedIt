import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Login({uuid, setUuid}) {

    // When clicking on "Don't have an account yet?",
    // routeChange is executed, which runs navigate(path).
    // This is done because we can't (I think) directly href
    // the page we want to go to.

    const navigate = useNavigate()
    const routeChange = () => {
        let path = "/users/register"
        navigate(path)
    }

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errorMessage, setErrorMessage] = useState(null)

    function handleResult(result) {
        if (result.data.wasSuccessful) {
            localStorage.setItem("uuid", result.data.uuid)
            setUuid(result.data.uuid) // This is simply used to refresh the app.
                                      // We actually update uuid at localStorage.
            navigate("/home")
        } else {
            setErrorMessage(result.data.errorMessage)
        }
    }

    function handleSubmit(event) {
        event.preventDefault() //Prevents page from refreshing
        axios
            .post("/users/login", {email: email, password: password})
            .then((res) => handleResult(res))
            .catch(err => console.log(err))
    }

    function handleEmailChange(event) {
        // Sets email each time that a letter is
        // pressed in the html text input
        setEmail(event.target.value);
    }

    function handlePasswordChange(event) {
        // Sets password each time that a letter is
        // pressed in the html text input
        setPassword(event.target.value);
    }

    const textInputStyle = "h-10 w-80 border-blue-700 border-2 rounded mt-2 md-2 text-xl";
    const labelStyle = "text-2xl"
    return (
        <div>
            <div className="h-screen flex items-center justify-evenly bg-gradient-to-tr from-white to-blue-300">
                <img className="h-auto max-w-lg rounded-full" src={require("../media/logo.jpeg")} alt="image description"></img>
                <form method="post" onSubmit={handleSubmit}>
                    { errorMessage != null ? <h1 color={"red"}> {errorMessage} </h1> : null }
                    <label className={labelStyle} htmlFor="email">Email:</label><br/>
                    <input className={textInputStyle} type="email" id="email" name="email" onChange={handleEmailChange}/><br/>
                    <label className={labelStyle} htmlFor="password">Password:</label><br/>
                    <input className={textInputStyle} type="password" id="password" name="password" onChange={handlePasswordChange}/><br/>
                    <input className="h-10 w-40 bg-blue-700 text-white text-xl mt-2 md-2 rounded" type="submit" value="Submit"/><br/>
                    <a className="flex-col-reverse text-blue-700 underline" onClick={routeChange}>Don't have an account yet?</a>
                </form>
            </div>
        </div>
    )
}