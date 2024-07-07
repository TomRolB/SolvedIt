import {useEffect, useState} from "react";
import axios from "axios";

export function ProfilePicture({uuid, isTransientUuid, errorCount, setErrorCount}) {
    const [pictureUrl, setPictureUrl] = useState("")

    useEffect(() => {
        axios
            .get(`/users/${uuid}/picture`,
                {
                    params: {
                        isTransientUuid: isTransientUuid
                    },
                    responseType: "blob"
                }
            )
            .then((res) => {
                const url = URL.createObjectURL(res.data);
                if (res.status === 302) setErrorCount(errorCount + 1)
                else setPictureUrl(url);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    return pictureUrl
        ? <img loading={"lazy"} className="w-10 h-10 rounded-full" src={pictureUrl} alt=""></img>
        : <img className="w-10 h-10 rounded-full" src={require("../media/blank.png")} alt=""></img>

}