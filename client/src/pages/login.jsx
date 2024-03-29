import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Login() {

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
    function handleSubmit(event) {
        event.preventDefault() //Prevents page from refreshing
        axios
            .post("/users/login", {email: email, password: password})
            .then((res) => console.log(res.data))
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
        <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-white to-blue-300">
            <form method="post" onSubmit={handleSubmit}>
                <label className={labelStyle} htmlFor="email">Email:</label><br/>
                <input className={textInputStyle} type="email" id="email" name="email" onChange={handleEmailChange}/><br/>
                <label className={labelStyle} htmlFor="password">Password:</label><br/>
                <input className={textInputStyle} type="password" id="password" name="password" onChange={handlePasswordChange}/><br/>
                <input className="h-10 w-40 bg-blue-700 text-white text-xl mt-2 md-2 rounded" type="submit" value="Submit"/><br/>
                <a className="flex-col-reverse text-blue-700 underline" onClick={routeChange}>Don't have an account yet?</a>
            </form>
        </div>
    )
}