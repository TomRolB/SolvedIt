import {Navbar} from "../components/Navbar";
import {ProfileCard} from "./profileCard";


export const Profile = ()=>{
    return(
        <div>
            <Navbar></Navbar>
            <div className="h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <ProfileCard></ProfileCard>
            </div>
        </div>
    )
}
