import {useEffect, useState} from "react";
import axios from "axios";

export function ProfilePicture({uuid, isTransientUuid}) {
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
                setPictureUrl(url);
            })
            .catch(err => console.log(err))
    }, []);

    return <img className="w-10 h-10 rounded-full" src={pictureUrl} alt="Rounded avatar"></img>;
}