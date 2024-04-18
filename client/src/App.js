import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./pages/login";
import Register from "./pages/register";
import {Home} from "./pages/Home";
import {CreateClass} from "./pages/CreateClass";
import axios from "axios";
import {Class} from "./pages/Class";
import {Invites} from "./pages/Invites"


function App(props) {

    // const [backendData, setBackendData] = useState([{}])
    //
    // useEffect(() => {
    //     fetch("/users/login")
    // }, []);

    const [uuid, setUuid] = useState(localStorage.getItem("uuid") || null)

    function getPageIfLoggedIn(page) {
        axios
            .post("/users/isLoggedIn", {uuid: uuid})
            .then((res) => {
                if (!res.data.isLoggedIn) setUuid(null)
            } )
            .catch(err => console.log(err))

        return uuid != null ? page : <Login uuid={uuid} setUuid={setUuid}/>;
    }

    return (
        // This is simply the way React handles urls.
        // We define routes as components (in express they are part of
        // app.get, for instance) and associate a page, which is also
        // a component
        <BrowserRouter>
            <Routes>
                <Route index element={ getPageIfLoggedIn(<Home uuid={uuid} setUuid={setUuid}/>, uuid, setUuid) }/>
                <Route path="/home" element={ getPageIfLoggedIn(<Home uuid={uuid} setUuid={setUuid} />, uuid, setUuid) }></Route>
                <Route path="/login" element={ <Login uuid={uuid} setUuid={setUuid}/> }/>
                <Route path="/users/register" element={ <Register uuid={uuid} setUuid={setUuid} /> }/>
                <Route path="/class/create-class" element={<CreateClass/>}></Route>
                <Route path="/class/:id" element={<Class uuid={uuid} setUuid={setUuid}/>}></Route>
                <Route path="/class/:id/invites" element={getPageIfLoggedIn(<Invites/>)}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;