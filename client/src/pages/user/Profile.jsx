import {Navbar} from "../../components/Navbar";
import {ProfileCard} from "./ProfileCard";
import {useState} from "react";


export const Profile = ()=>{
    const [pictureCount, setPictureCount] = useState(0) //Just to refresh picture

    return(
        <div>
            <Navbar pictureCount={pictureCount} setPictureCount={setPictureCount}/>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <ProfileCard pictureCount={pictureCount} setPictureCount={setPictureCount}/>
            </div>
        </div>
    )
}
