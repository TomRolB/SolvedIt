import React, {useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Register({uuid, setUuid}) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState(null)

    function handleFirstNameChange(event) {
        setFirstName(event.target.value)
    }

    function handleLastNameChange(event) {
        setLastName(event.target.value)
    }

    function handleEmailChange(event) {
        setEmail(event.target.value)
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value)
    }


    function handleConfirmPasswordChange(event) {
        setConfirmPassword(event.target.value)
    }

    const navigate = useNavigate()
    function handleResult(result) {
        if (result.data.wasSuccessful) {
            localStorage.setItem("uuid", result.data.uuid)
            setUuid(result.data.uuid) // This is simply used to refresh the app.
                              // We actually update uuid at localStorage.
            navigate("/login")
        }
        else {
            setErrorMessage(result.data.errorMessage)
        }
    }

    function handleSubmit(event) {
        event.preventDefault() //Prevents page from refreshing
        axios
            .post("/users/register", {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            })
            .then((res) => handleResult(res))
            .catch(err => console.log(err))
    }

    const namesInputStyle = "h-10 w-40 border-blue-700 border-2 rounded mt-2 md-2 text-xl";
    const textInputStyle = "h-10 w-80 border-blue-700 border-2 rounded mt-2 md-2 text-xl";
    const labelStyle = "text-2xl"
    return (
        //TODO: Could probably simplify with React logic
        <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-white to-blue-300">
            <form method="post" onSubmit={handleSubmit}>
                { errorMessage != null ? <h1 color={"red"}> {errorMessage} </h1> : null }
                <div className="flex flex-row">
                    <div>
                        <label className={labelStyle} htmlFor="firstName">First name:</label><br/>
                        <input className={namesInputStyle + " mr-3"} type="text" id="firstName" name="firstName"
                               onChange={handleFirstNameChange}/><br/>
                    </div>
                    <div>
                        <label className={labelStyle} htmlFor="lastName">Last name:</label><br/>
                        <input className={namesInputStyle} type="text" id="lastName" name="lastName"
                               onChange={handleLastNameChange}/><br/>
                    </div>
                </div>
                <label className={labelStyle} htmlFor="email">Email:</label><br/>
                <input className={textInputStyle} type="email" id="email" name="email" onChange={handleEmailChange}/><br/>
                <label className={labelStyle} htmlFor="password">Password:</label><br/>
                <input className={textInputStyle} type="password" id="password" name="password" onChange={handlePasswordChange}/><br/>
                <label className={labelStyle} htmlFor="confirmPassword">Confirm password:</label><br/>
                <input className={textInputStyle} type="password" id="confirmPassword" name="confirmPassword" onChange={handleConfirmPasswordChange}/><br/>
                <input className="h-10 w-40 bg-blue-700 text-white text-xl mt-2 md-2 rounded" type="submit"/>
            </form>
        </div>
    );
}

export default Register;