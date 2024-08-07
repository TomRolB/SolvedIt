import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {Navbar} from "../components/Navbar";
import {ReturnButton} from "../components/ReturnButton";


export const DiscordLink = ()=>{
    let [webhookLink, setWebhookLink] = useState("")
    let [responseMessage, setResponseMessage] = useState("")
    let navigate = useNavigate()
    let [errorMessage, setErrorMessage] = useState("")
    let {id} = (useParams())

    console.log(Number(id))

    const handleLinkChange = async (event) => {
        setWebhookLink(event.target.value)
    }

    async function handleAlreadyLinked() {
        let response = await fetch(`/class/byId/${id}/discord/is-linked`)
        console.log("Response: " + response);
        return response
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            //Hit webhook
            let alreadyLinked = await handleAlreadyLinked()
            if(alreadyLinked){
                navigate("/class/" + Number(id))
            }
            let webHook = await fetch(webhookLink)
            let webHookValue = await webHook.json()

            console.log(webHookValue);

            axios.post(`/class/byId/${Number(id)}/discord/link-with-channel/${webHookValue.channel_id}`).
            then(res => {
                console.log(res)
                setResponseMessage(res)
            }).catch(err => console.log(err))

            if(responseMessage === "Channel linked successfully!"){
                navigate("/class/" + Number(id))
            }
        }
        catch (err){setErrorMessage(err.message)
            console.log(err)}
    }

    const BOT_INVITE_LINK = "https://discord.com/oauth2/authorize?client_id=1259558781558194197&permissions=8&integration_type=0&scope=bot+applications.commands";
    return(
        <div>
            <Navbar></Navbar>
            <div className="min-h-screen bg-gradient-to-tr from-white to-blue-300 p-5">
                <ReturnButton path={"/class/" + Number(id)}></ReturnButton>
            <div className="max-w-lg mx-auto my-12 bg-white p-8 rounded-xl shadow shadow-slate-300">
                <h1 className="text-4xl font-medium">Link class with Discord Server</h1>
                <p className="text-slate-500 mt-2">Fill out the form to link to a Discord Server.</p>
                <p className="text-slate-500">Make sure to create a Webhook in your server before linking it.</p>
                <p className="text-slate-500">You must also invite the SolvedIt bot with <a className="underline border-l-blue-500" href={BOT_INVITE_LINK} target={"_blank"}>this link</a>.</p>
                <form className="my-10">
                    <div className="flex flex-col space-y-5">
                        <p className="font-medium text-slate-700 pb-2">Discord Channel Webhook Link</p>
                        { errorMessage != null ? <h1 className="text-red-600"> {errorMessage} </h1> : null }
                        <input type="text" className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow" placeholder="Enter class link" value={webhookLink} onChange={handleLinkChange}/>
                        <button
                            className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                            onClick={handleSubmit}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="40px" width="40px" viewBox="0 -28.5 256 256" version="1.1"
                                preserveAspectRatio="xLowYLow">
                            <g>
                                <path
                                    d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,
                                    4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896
                                    98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988
                                     55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,
                                     164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126
                                     75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,
                                     164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187
                                     151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963
                                     C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831
                                      190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201
                                       245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155
                                       62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427
                                       108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489
                                       147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,
                                       94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                                            fill="#5865F2" fill-rule="nonzero"></path>
                                    </g>
                                </svg>
                                <span>Link with Channel</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
)

}