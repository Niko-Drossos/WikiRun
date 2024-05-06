function imClicked() {
    console.log("Clicked!");
}

console.log("Im loaded!")

console.log(document.getElementById("popup-content"))

document.getElementById("clickMe").addEventListener("click", imClicked);
/* module.exports = {
    imClicked
} */