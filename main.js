const zip = new JSZip();


const initApp = () => {

    console.log('.droparea');
    const droparea = document.querySelector(".droparea");

    const active = () => droparea.classList.add("peach-border");

    const inactive = () => droparea.classList.remove("peach-border");

    const prevents = (e) => e.preventDefault();

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
        droparea.addEventListener(evtName, prevents);
    });

    ['dragenter', 'dragover'].forEach(evtName =>{
        droparea.addEventListener(evtName, active);
        console.log('active');
    });

    ['dragleave', 'drop'].forEach(evtName => {
        droparea.addEventListener(evtName, inactive);
        console.log('inactive');
    });


    droparea.addEventListener('drop', handleDrop)
    
    
    
    
    function handleDrop(event) {
    event.preventDefault();

    const files = event.dataTransfer.files;

    if (files.length === 0){
        console.error("Please upload a zip file");
        return;
    }

    const file = files[0];

    if (!file.name.endsWith('.zip')) {
        console.error("Uploaded file is not a zip");
        return;
    }

    if (files.length > 0){
        const file = files[0];

        
        JSZip.loadAsync(file).then(function(zip){
            console.log(zip);
            console.log("ZIP File Contents:", Object.keys(zip.files));
            const requiredfiles = ['following.json', 'followers_1.json'];
            const foundFiles = {};
            

            Object.keys(zip.files).forEach(filePath => { 
                requiredfiles.forEach(reqFile => {
                    const filePathS = String(filePath);
                    const normalizedPath = filePath.replace(/\\/g, '/');
                    if(normalizedPath.endsWith(`/${reqFile}`) || filePathS === reqFile){
                        foundFiles[reqFile] = filePath;
                    }
                });
            });
    
            requiredfiles.forEach(fileName =>{
                if(foundFiles[fileName]){
                    zip.files[foundFiles[fileName]].async('text').then(function(content){
                        try{
                            const jsonObject = JSON.parse(content);
                            console.log(jsonObject)
                        }
                        catch (err) {
                            console.error('error parsing json', err);
                        }
                    }).catch (function(err){
                        console.error('error reading file in zip', err);
                    })
                } else{
                    console.error(`${fileName} not found in zip`);
                } 
            })
        }).catch (function(err){
            console.error("error loading the zip file");
        })
    } else{
        console.error("please upload zip file");
    }
}

}

document.addEventListener("DOMContentLoaded", initApp);