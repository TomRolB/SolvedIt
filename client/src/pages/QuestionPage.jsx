import React from "react";
import {useLocation} from "react-router-dom";

export function QuestionPage() {
    const location = useLocation()
    const questionInfo = location.state

    return <div className="bg-gray-800 rounded-2xl p-3 m-1">
        <h1 className="text-2xl text-amber-50">{questionInfo.User.firstName + " " + questionInfo.User.lastName}</h1>
        <h1 className="text-5xl text-amber-50">{questionInfo.title}</h1>
        <h1 className="text-amber-50 pt-6">{questionInfo.description}</h1>
    </div>
}