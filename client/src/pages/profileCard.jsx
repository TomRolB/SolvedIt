import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import '../styles/ProfileCard.css';
import {useUserUuid} from "../hooks/useUserUuid";
import axios from "axios";
import {FileUpload} from "../components/FileUpload";
export const ProfileCard = () => {
    //Profile gets and updates uuid
    let [userData, setData] = useState()
    let [uuid, setUuid] = useUserUuid()
    const [pictureUrl, setPictureUrl] = useState("")
    const [files, setFiles] = useState()

    useEffect(() => {
        const fetchUserData = async () =>{
                fetch(`http://localhost:3001/users/${uuid}`).then(
                    response => response.json()
                ).then(
                    response =>
                    setData(response))
                    .catch(
                    reason => {console.log(reason)}
            )
        }

        const fetchProfilePicture = () => {
            axios
                .get(`/users/${uuid}/picture`, {
                        responseType: "blob"
                    }
                )
                .then((res) => {
                    const url = URL.createObjectURL(res.data);
                    setPictureUrl(url);
                })
                .catch(err => console.log(err))
        };

        if(uuid) {
            fetchUserData()
            fetchProfilePicture()
        }
    }, [uuid]);

    const handleDelete = () => {
        const deleteUser = async () =>{
            axios.post(`http://localhost:3001/users/${uuid}/delete`)
                .catch(
                    reason => {console.log(reason)}
                )
        }
        if(uuid) {
            deleteUser()
            console.log(uuid)
            localStorage.removeItem('uuid')
            setUuid("")
            console.log(uuid)
            navigate("/delete-user")
        }
    };





    console.log(userData) //Funca :)
    const navigate = useNavigate();
    if(!userData){
        return <p>Loading...</p>
    }

    function handlePictureUpload() {

    }

    function handleFileChange(event) {
        let uuid = localStorage.getItem("uuid");

        const formData = new FormData()
        formData.append('file', event.target.files[0])
        formData.append('uuid', uuid)

        axios
            .post(`/users/${uuid}/picture`, formData)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    return (
            <div className=" bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-10 p-5">
                <div className="pl-5 flex flex-col items-start">
                    <input id="upload" type="file" onChange={handleFileChange} className="hidden"/><br/>
                    <label htmlFor="upload" className="text-amber-50 cursor-pointer ml-2">
                        <img
                        className="w-24 h-24 mb-3 rounded-full shadow-lg cursor-pointer" src={pictureUrl}
                        alt="Profile picture"/>
                    </label>

                </div>
                <div className="card-body p-4">
                    <h3 className="text-3xl font-bold dark:text-white">User Information:</h3>
                    <div className="row pt-4">
                        <div className="col-6 mb-3">
                            <h6 className="text-lg font-bold dark:text-white">Email: </h6>
                            <p className="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">{userData.email}</p>
                        </div>
                        <div className="col-6 mb-3">
                            <h6 className="text-lg font-bold dark:text-white">Name: </h6>
                            <p className="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">{userData.firstName} {userData.lastName}   <button
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                onClick={() => {
                                    navigate("/update-user")
                                }}>Change Username</button></p>

                        </div>
                        <div className="col-6 mb-3">
                            <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={()=>navigate("/notifications/settings")}>Notification Settings</a>
                        </div>
                    </div>
                    <div className="flex mt-4 md:mt-6">
                        <button
                            className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={() => {
                                navigate("/home")
                            }}>
                            Home
                        </button>
                        <button
                            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                            onClick={handleDelete}
                        >
                            Delete Profile
                        </button>
                    </div>
            </div>
        </div>
    )
}


