import React from "react";

export function FileUpload({files, setFiles}) {
    function handleFileChange(event) {
        console.log(event.target.files[0])
        setFiles([...files, event.target.files[0]])
    }

    function displayUploadedFileNames() {
        return files.map(file => <p key={file.name} className="text-white">{file.name}</p>);
    }

    return <>
        <input id="upload" type="file" onChange={handleFileChange} className="hidden"/><br/>
        <label htmlFor="upload" className="text-amber-50 cursor-pointer ml-2"><i className="fa-solid fa-upload"></i> Upload Files </label><br/>
        <div className="bg-gray-600 p-2 m-1 rounded">{displayUploadedFileNames()}</div>
    </>;
}