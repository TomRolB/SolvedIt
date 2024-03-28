import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import  axios from "axios";

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

    return (
        <div>
            <form method="post" onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label><br/>
                <input type="email" id="email" name="email" onChange={handleEmailChange}/><br/>
                <label htmlFor="password">Password:</label><br/>
                <input type="password" id="password" name="password" onChange={handlePasswordChange}/><br/>
                <input type="submit"/><br/>
            </form>
            <a onClick={routeChange}>Don't have an account yet?</a>
        </div>
    )
}