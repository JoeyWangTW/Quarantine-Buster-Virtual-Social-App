const fb_app = "FIREBASE APP URL"
const fb_cf = "FIREBASE CLOUD FUNCTION URL"
var roomname = "no room created";

document.addEventListener('DOMContentLoaded', function() {
    firebase.analytics();
    if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i))
        alert("Please use landscape mode.\n(Mobile devices might not get the best experience.)")
})

function create() {
    document.getElementById("exampleModalLabel").innerHTML = "Room ID loading..."
    const Http = new XMLHttpRequest();
    const url = fb_cf + '/callToDailyAPI'
    Http.open("GET", url);
    Http.send();
    Http.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
            var responoseJson = this.responseText
            roomname = responoseJson;
            document.getElementById("prompt").innerHTML = "www.quarantinebuster.com/room?id=" + responoseJson;
            document.getElementById("exampleModalLabel").innerHTML = "Room Created! Share your room link.";
            firebase.analytics().logEvent('create_room')
        }
    })


}


function join() {
    console.log(roomname);
    console.log(typeof roomname);
    window.location.href = '/room?id=' + roomname
}

function resetButton() {
    document.getElementById("sharebutton").innerHTML = "Invite Friends";
}

function copyRoomLink() {

    var elm = document.getElementById("prompt");

    if (document.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(elm);
        range.select();
        document.execCommand("Copy");
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(elm);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("Copy");
    }

    document.getElementById("sharebutton").innerHTML = "Link Copied";
    firebase.analytics().logEvent('share_home');


}

function submitComment() {
    document.getElementById('subcomment').style.display = "none";
    document.getElementById('subcommentloading').style.display = "block";
    var name = document.getElementById("name").value;
    var mail = document.getElementById("mail").value;
    var comment = document.getElementById("comment").value;
    const Http = new XMLHttpRequest();
    const url = fb_cf + '/CucstomerComment?name=' + name + '&mail=' + mail + '&comment=' + comment
    Http.open("GET", url);
    Http.send();
    Http.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
            var responoseJson = this.responseText
            document.getElementById('thankyou').style.display = "block";
             document.getElementById('subcommentloading').style.display = "none";

            firebase.analytics().logEvent('create_room')
        }
    })
}

function clickAbout(){
    firebase.analytics().logEvent('about');
}
function clickQA(){
    firebase.analytics().logEvent('QA');
}
function clickFeedback(){
    firebase.analytics().logEvent('feedback');
}