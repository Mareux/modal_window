let modal = document.getElementById("modal");
let triggerButton = document.getElementById("trigger");
let close = document.getElementsByClassName("close")[0];

triggerButton.onclick = function() {
    modal.style.display = "block";
};

close.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.targer == modal){
        modal.style.display = "none";
    }
}

