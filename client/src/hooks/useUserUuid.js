import React, {useEffect, useState} from 'react'

//React Hook to get current session uuid on front-end
export const useUserUuid = () =>{
    let [uuid, setUuid] = useState("")

    useEffect(() => {
        let fetchedId = localStorage.getItem('uuid');
        setUuid(fetchedId)
    }, []);
    return [uuid, setUuid]
}