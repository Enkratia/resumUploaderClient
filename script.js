const fileInput = document.forms.form.elements.file;

let sendingFile;
let fileId;

fileInput.addEventListener("change", () => {
    if (!fileInput.files[0]) return;

    let file = fileInput.files[0];

    fileId = file.size + '-' + +file.lastModifiedDate + '-' + file.name;

    let reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onprogress = (e) => {
        let initPercentage = ~~(e.loaded / e.total * 100);
        progressInfo.innerText = `1. Initialization ${initPercentage}%`;
    }

    reader.onload = () => {
        sendingFile = reader.result;
        fileToServer(sendingFile);
    }
});


async function fetchStatus(){

    let fetchStatus = await fetch("http://127.0.0.1:3000/status.html", {
        headers: {
            "x-file-id": fileId,
        }
    });

    if(fetchStatus.status != 200) {
        throw new Error(`Can't get uploaded bytes: ${fetchStatus.message}`);
    }

    let fetchStatusResponse = await fetchStatus.text();

    return +fetchStatusResponse;
}


async function fileToServer(file) {
    let uplBytes = await fetchStatus();
    let xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://127.0.0.1:3000/upload.html');

    
    xhr.setRequestHeader("x-file-id", fileId);
    xhr.setRequestHeader("x-start-byte", uplBytes);
    xhr.setRequestHeader("x-file-size", file.byteLength);

    
    xhr.upload.onprogress = (e)=>{
        let progressWidth = ~~(e.loaded / e.total * 100);
        progressLine.style.width = progressWidth + "%";
        progressText.innerText = progressWidth + "%"

        progressInfo.innerText = `2. Uploading ${progressWidth}%`;
    }

    xhr.upload.onloadend = ()=>{
        startBtn.classList.replace("uil-pause", "uil-play");
        progressInfo.innerText = `3. Uploading finished`;
    }

    startBtn.addEventListener("click", () => {

        if (startBtn.classList.contains("uil-pause")) {
            xhr.abort();
            startBtn.classList.replace("uil-pause", "uil-play");
        } else {
            fileToServer(file);
            startBtn.classList.replace("uil-play", "uil-pause");
            return;
        }
    });

    slicingFile = file.slice(uplBytes);

    xhr.send(slicingFile);
}
