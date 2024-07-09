import React, {useCallback, useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Login} from "./pages/Login";
import Register from "./pages/Register";
import {Home} from "./pages/Home";
import {CreateClass} from "./pages/CreateClass";
import axios from "axios";
import {Profile} from "./pages/Profile"
import {ProfileChanger} from "./pages/UpdateUser";
import {DeleteUser} from "./pages/DeleteUser";
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
import {Leaderboard} from "./pages/Leaderboard";
import {Notifications} from "./pages/Notifications";
import {NotificationSettings} from "./pages/NotificationSettings";
import {ClassNotificationSettings} from "./pages/ClassNotificationSettings";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App(props) {

    // const [backendData, setBackendData] = useState([{}])
    //
    // useEffect(() => {
    //     fetch("/users/login")
    // }, []);

    const [uuid, setUuid] = useState(localStorage.getItem("uuid") || null)
    const [isEnrolled, setIsEnrolled] = useState(false)
    const [path, setPath] = useState(<Home uuid={uuid} setUuid={setUuid}/>)


    const redirectPath = useCallback(async () => {
        if(!uuid) return;
        let res = await ClassEnroll();
        setIsEnrolled(res);
    }, [uuid]);

    useEffect(() => {
        if (uuid) {
            redirectPath();
        }
    }, [uuid, redirectPath]);

    useEffect(() => {
        if (isEnrolled) setPath(<Class uuid={uuid} setUuid={setUuid}/>)
    }, [isEnrolled, uuid, setUuid]);



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
                <Route path="/class/:id/leaderboard"
                       element={(<Leaderboard uuid={uuid} setUuid={setUuid}/>)}/>
                <Route path="/enroll-to/:id" element={path}></Route>
                <Route path="/class/:id/reported"
                       element={(<ReportedQuestions></ReportedQuestions>)}></Route>
                <Route path="/notifications" element={(<Notifications></Notifications>)}></Route>
                <Route path="/notifications/settings" element={(<NotificationSettings></NotificationSettings>)}></Route>
                <Route path="/class/:id/notification-settings" element={(<ClassNotificationSettings></ClassNotificationSettings>)}></Route>
            </Routes>, uuid, setUuid)}
            <ToastContainer/>
        </BrowserRouter>
    );
}

export default App;