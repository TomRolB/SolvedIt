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
        <input type="file" onChange={handleFileChange} className="text-transparent"/><br/>
        {displayUploadedFileNames()}
    </>;
}