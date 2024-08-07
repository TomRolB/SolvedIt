import React from "react";

export function FileUpload({files, setFiles, singleFile}) {
    function handleFileChange(event) {
        console.log(event.target.files[0])

        if (singleFile) setFiles([event.target.files[0]])
        else setFiles([...files, event.target.files[0]])
    }

    function displayUploadedFileNames() {
        return files.map(file => <p key={file.name} className="text-white">{file.name}</p>);
    }

    return <>
        <input id="upload" type="file" onChange={handleFileChange} className="hidden"/><br/>
        <label htmlFor="upload" className="text-white cursor-pointer ml-2"><i className="fa-solid fa-upload"></i> Upload Files </label><br/>
        {files.length > 0
            ? <div className="bg-gray-600 p-2 m-1 rounded">{displayUploadedFileNames()}</div>
            : null}
    </>;
}