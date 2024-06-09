import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useState} from "react";

export const Navbar = ({uuid, setUuid}) => {
    const navigate = useNavigate()
    const [navbarOpen, setNavbarOpen] = useState(false)
    const [navbarClassName, setNavbarClassName] = useState("hidden w-full md:block md:w-auto" )
    const handleLogOut = () => {
        axios
            .post("users/logout", {uuid: uuid})
            .then((res) => console.log(res))
            .catch(err => console.log(err))

        localStorage.removeItem("uuid")

        let path = "/login"
        navigate(path)
    }

    const handleNavbarToggle = () => {
        setNavbarOpen(!navbarOpen)
        if (navbarOpen) {
            setNavbarClassName("hidden w-full md:block md:w-auto")
        } else {
            setNavbarClassName("w-full md:block md:w-auto")
        }
    }

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={require("../media/logo.jpeg")} className="h-8" alt="Flowbite Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">SolvedIt</span>
                </a>
                <button onClick={handleNavbarToggle} data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div className={navbarClassName} id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <div className="pb-2 pt-2 ">
                                <a href="/home" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</a>
                            </div>
                        </li>
                        <li>
                            <div className=" pb-2 pt-2 ">
                                <a href="/login" onClick={handleLogOut} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Log Out</a>
                            </div>
                        </li>
                        <li>
                            <div className="bg-indigo-400 pb-2 pt-2 pl-3 pr-3 rounded-lg">
                                <a href="/notifications" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"><i className="fa-solid fa-bell"></i></a>
                            </div>
                        </li>
                        <li>
                            <a href="/profile" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                <img className="w-10 h-10 rounded-full" src={require("../media/image.jpg")} alt="Rounded avatar"></img>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}