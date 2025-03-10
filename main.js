const zip = new JSZip(); //importing jszip 


const initApp = () => {

    console.log('.droparea');
    const droparea = document.querySelector(".droparea"); //defining the droparea from html

    const active = () => droparea.classList.add("red-border"); //if the drop area is active change the color to red border

    const inactive = () => droparea.classList.remove("red-border"); //if there are no files above drop area remove the red border

    const prevents = (e) => e.preventDefault(); //dont follow the default actions if there are any issues 

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => { //anytime a user does any of the following check to prevent event default
        droparea.addEventListener(evtName, prevents);
    });

    ['dragenter', 'dragover'].forEach(evtName =>{ //if user is dragging over or entering the droparea with the file the area will be noted as active and change colors
        droparea.addEventListener(evtName, active);
        console.log('active');
    });

    ['dragleave', 'drop'].forEach(evtName => { //if user has already dropped the file or left the drop area the area will be noted as inactive 
        droparea.addEventListener(evtName, inactive);
        console.log('inactive');
    });


    droparea.addEventListener('drop', handleDrop) //listen for drop and then run the handle drop function
    
    
    
    
    function handleDrop(event) {
    event.preventDefault(); //prevent default just in case 

    const files = event.dataTransfer.files;

    if (files.length === 0){
        console.error("Please upload a zip file");  //checks if there is no file dropped if so call error that there is no zip file dropped 
        return;
    }

    const file = files[0];

    if (!file.name.endsWith('.zip')) {//check if the file dropped is a zip file if not log an error 
        console.error("Uploaded file is not a zip");
        return;
    }

    //just in case line its uneccessary 

        
        JSZip.loadAsync(file).then(function(zip){ //load the file into JSZip 
            console.log(zip);
            console.log("ZIP File Contents:", Object.keys(zip.files)); //log the contents of the Zip so you know the correct files are present 
            const requiredfiles = ['following.json', 'followers_1.json']; //set these as the files being looked for in this case followers and following 
            const foundFiles = {}; //will update once the files are found in the path 
            

            Object.keys(zip.files).forEach(filePath => { //loads the keys to the zip file and run for each file path and each req file in file path
                requiredfiles.forEach(reqFile => {
                    const filePathS = String(filePath); //makes sure the filepath is in String format 
                    const normalizedPath = filePath.replace(/\\/g, '/'); //replace different possible pathway text for other OS into /
                    if(normalizedPath.endsWith(`/${reqFile}`) || filePathS === reqFile){ //if the path ends with /reqfile or if the filepath itself is the req file then update found files 
                        foundFiles[reqFile] = filePath;
                    }
                });
            });

            const followersArr = [];
            const followingArr = [];
            requiredfiles.forEach(fileName =>{  
                if(foundFiles[fileName]){
                    zip.files[foundFiles[fileName]].async('text').then(function(content){ //load the foundfiles and read it as text
                        try{
                            const jsonObject = JSON.parse(content); //try to parse the content
                            console.log(jsonObject)//log it once found 
                            console.log("Checking JSON keys:", Object.keys(jsonObject));

                            let userNameArr = [];

                            if (jsonObject.relationships_following) {
                                console.log("Found following.json, processing data...");
                                console.log("relationships_following:", jsonObject.relationships_following);
                                if (Array.isArray(jsonObject.relationships_following)) {
                                    userNameArr = jsonObject.relationships_following.map(user => user.string_list_data[0].value);
                                    followingArr.push(...userNameArr);
                                    console.log("Following Array:", followingArr);
                                } else {
                                    console.error("Error: relationships_following is not an array!");
                                }
                            }
                            
                            if (Array.isArray(jsonObject)) {
                                console.log("Found followers.json, processing data...");
                                userNameArr = jsonObject.map( user => {
                                    if(user.string_list_data && user.string_list_data[0]){
                                        return user.string_list_data[0].value;
                                    }
                                    else{
                                        console.error("Unexpected structure in followers.json", user);
                                        return null;
                                    }
                                }).filter(Boolean);
                                followersArr.push(...userNameArr);
                                console.log("Followers Array:", followersArr);
                            }else {
                                console.error("Error: followers.json structure is unexpected!", jsonObject);
                            }
                        }
                        catch (err) {
                            console.error('error parsing json', err); //if try doesnt work there is something wrong with parsing 
                        }
                    }).catch (function(err){
                        console.error('error reading file in zip', err); //error in reading file 
                    })
                } else{
                    console.error(`${fileName} not found in zip`);//if the proper file name is not found 
                }  
            })
        }).catch (function(err){
            console.error("error loading the zip file"); //something wrong in loading the zip
        })
    } 
}



document.addEventListener("DOMContentLoaded", initApp);