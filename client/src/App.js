import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./pages/login";
import Register from "./pages/register";
import {Home} from "./pages/Home";
import {CreateClass} from "./pages/CreateClass";

function App(props) {

    // const [backendData, setBackendData] = useState([{}])
    //
    // useEffect(() => {
    //     fetch("/users/login")
    // }, []);

    return (
        // This is simply the way React handles urls.
        // We define routes as components (in express they are part of
        // app.get, for instance) and associate a page, which is also
        // a component
        <BrowserRouter>
            <Routes>
                <Route index element={ <Login/> }/>
                <Route path="/login" element={ <Login/> }/>
                <Route path="/users/register" element={ <Register/> }/>
                <Route path="/home" element={<Home/>}></Route>
                <Route path="/create-class" element={<CreateClass/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;