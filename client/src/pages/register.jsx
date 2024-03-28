import React, {useState} from 'react';
import axios from "axios";

function Register(props) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

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
            .then((res) => console.log(res.data))
            .catch(err => console.log(err))
    }

    return (
        //TODO: Could probably simplify with React logic
        <form method="post" onSubmit={handleSubmit}>
            <label htmlFor="firstName">First name:</label><br/>
            <input type="text" id="firstName" name="firstName" onChange={handleFirstNameChange}/><br/>
            <label htmlFor="lastName">Last name:</label><br/>
            <input type="text" id="lastName" name="lastName" onChange={handleLastNameChange}/><br/>
            <label htmlFor="email">Email:</label><br/>
            <input type="email" id="email" name="email" onChange={handleEmailChange}/><br/>
            <label htmlFor="password">Password:</label><br/>
            <input type="password" id="password" name="password" onChange={handlePasswordChange}/><br/>
            <label htmlFor="confirmPassword">Confirm password:</label><br/>
            <input type="password" id="confirmPassword" name="confirmPassword" onChange={handleConfirmPasswordChange}/><br/>
            <input type="submit"/>
        </form>
    );
}

export default Register;