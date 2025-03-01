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



}

document.addEventListener("DOMContentLoaded", initApp)