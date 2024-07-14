import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export const EnrollToClass = () => {
    const navigate = useNavigate()
    const [isEnrolled, setIsEnrolled] = useState();
    const [uuid, setUuid] = useState()
    const [id, setId] = useState()

    console.log("ID: ",id);

    useEffect(() => {
        if(!window) return

        let link = window?.location.href
        setUuid(localStorage.getItem("uuid"))
        link = link.replace(/localhost:\d+/g,"")
        const classIdFormat =/\d+(?!.*\d)/i
        let linkId = Number(link.match(classIdFormat))
        setId(linkId)

    }, [window]);



    useEffect( () => {
        if (!uuid || !id || id === 0 || isNaN(id)) {
            // navigate("/home")
            return
        }
        const getPath = async()=>{
            let res = await axios.post(`/class/${uuid}/enroll-to/${id}`)
            setIsEnrolled(res.data)
        }
        getPath()

    }, [uuid, id]);

    useEffect(() => {
        if(typeof isEnrolled === "undefined"){
            return
        }
        if(isEnrolled) {
            navigate("/class/" + id)
        }
        else{
            navigate("/home")
        }

    }, [isEnrolled]);

    // console.log("Is enrolled: ",isEnrolled);
    // if(isEnrolled) navigate("/class/" + id)
    // else navigate("/home")


}