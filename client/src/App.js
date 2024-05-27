import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./pages/login";
import Register from "./pages/register";
import {Home} from "./pages/Home";
import {CreateClass} from "./pages/CreateClass";
import axios from "axios";
import {Profile} from "./pages/profile"
import {ProfileChanger} from "./pages/updateUser";
import {DeleteUser} from "./pages/deleteUser";
import {Class} from "./pages/Class";
import {Invites} from "./pages/Invites"
import {ClassEdit} from "./pages/ClassEdit";
import {PostQuestion} from "./pages/PostQuestion";
import {QuestionPage} from "./pages/QuestionPage";
import {CreateTag} from "./pages/CreateTag";
import {ViewTags} from "./pages/ViewTags";
import {EditTag} from "./pages/EditTag";
import {ClassEnroll} from "./utils/ClassEnroll";
import {ClassMembers} from "./pages/ClassMembers";
import {ReportedQuestions} from "./pages/ReportedQuestions";
import {Notifications} from "./pages/Notifications";
import {NotificationSettings} from "./pages/NotificationSettings";


function App(props) {

    // const [backendData, setBackendData] = useState([{}])
    //
    // useEffect(() => {
    //     fetch("/users/login")
    // }, []);

    const [uuid, setUuid] = useState(localStorage.getItem("uuid") || null)
    const [isEnrolled, setIsEnrolled] = useState(false)

    function getPageIfLoggedIn(page) {
        axios
            .post("/users/isLoggedIn", {uuid: uuid})
            .then((res) => {
                if (!res.data.isLoggedIn) setUuid(null)
            } )
            .catch(err => console.log(err))

        return uuid != null ? page : <Login uuid={uuid} setUuid={setUuid}/>;
    }

    function redirectPath() {
        if(!uuid) return;
        ClassEnroll().then(value => setIsEnrolled(value))
        return isEnrolled ? <Class uuid={uuid} setUuid={setUuid}/> : <Home uuid={uuid} setUuid={setUuid}/>;
    }

    return (
        // This is simply the way React handles urls.
        // We define routes as components (in express they are part of
        // app.get, for instance) and associate a page, which is also
        // a component
        <BrowserRouter>
            <Routes>
            <Route path="/login" element={<Login uuid={uuid} setUuid={setUuid}/>}/>
            <Route path="/users/register" element={<Register uuid={uuid} setUuid={setUuid}/>}/>
            </Routes>
            {getPageIfLoggedIn(<Routes>
                <Route index element={(<Home uuid={uuid} setUuid={setUuid}/>)}/>
                <Route path="/home"
                       element={(<Home uuid={uuid} setUuid={setUuid}/>)}></Route>
                <Route path="/profile" element={(<Profile uuid={uuid}/>)}/>
                <Route path="/update-user" element={(<ProfileChanger/>)}/>
                <Route path="/delete-user" element={(<DeleteUser uuid={uuid}/>)}/>
                <Route path="/class/create-class" element={(<CreateClass/>)}></Route>
                <Route path="/class/:id" element={(<Class uuid={uuid} setUuid={setUuid}/>)}></Route>
                <Route path="/class/:id/post-question" element={(<PostQuestion/>)}></Route>
                <Route path="/class/:id/question/:qid" element={(<QuestionPage/>)}></Route>
                <Route path="/class/:id/create-tag" element={(<CreateTag/>)}></Route>
                <Route path="/class/:id/view-tags" element={(<ViewTags/>)}></Route>
                <Route path="/class/:id/edit-tag/:tagId" element={(<EditTag/>)}></Route>
                <Route path="/class/:id/invites" element={(<Invites/>)}></Route>
                <Route path="/class/:id/edit"
                       element={(<ClassEdit uuid={uuid} setUuid={setUuid}/>)}></Route>
                <Route path="/class/:id/view-members"
                       element={(<ClassMembers uuid={uuid} setUuid={setUuid}/>)}/>
                <Route path="/enroll-to/:id" element={redirectPath()}></Route>
                <Route path="/class/:id/reported"
                       element={(<ReportedQuestions></ReportedQuestions>)}></Route>
                <Route path="/notifications" element={(<Notifications></Notifications>)}></Route>
                <Route path="/notifications/settings" element={(<NotificationSettings></NotificationSettings>)}></Route>
            </Routes>, uuid, setUuid)}
        </BrowserRouter>
    );
}

export default App;