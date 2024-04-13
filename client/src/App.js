import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./pages/login";
import Register from "./pages/register";
import {Home} from "./pages/Home";

function getPageIfLoggedIn(page, uuid, setUuid) {
    console.log(uuid)
    return uuid != null ? page : <Login uuid={uuid} setUuid={setUuid}/>;
}

function App(props) {

    // const [backendData, setBackendData] = useState([{}])
    //
    // useEffect(() => {
    //     fetch("/users/login")
    // }, []);

    const [uuid, setUuid] = useState(localStorage.getItem("uuid") || null)

    return (
        // This is simply the way React handles urls.
        // We define routes as components (in express they are part of
        // app.get, for instance) and associate a page, which is also
        // a component
        <BrowserRouter>
            <Routes>
                <Route index element={ getPageIfLoggedIn(<Home/>, uuid, setUuid) }/>
                <Route path="/home" element={ getPageIfLoggedIn(<Home/>, uuid, setUuid) }></Route>
                <Route path="/login" element={ <Login uuid={uuid} setUuid={setUuid}/> }/>
                <Route path="/users/register" element={ <Register uuid={uuid} setUuid={setUuid} /> }/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;