const fb_app = "FIREBASE APP URL"
const fb_cf = "FIREBASE CLOUD FUNCTION URL"


async function CloseRoom() {
    var password = document.getElementById("password").value;
    const Http = new XMLHttpRequest();
    const url = fb_cf + '/deleteExpiredRoom'+'?password='+password
    Http.open("GET", url);
    Http.send();
    Http.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
            var responoseJson = this.responseText;
            document.getElementById("DeleteRoomMessage").innerHTML = responoseJson;
        }
    })
}


function AddTrivia() {
	var TriviaTopic = document.getElementById("TriviaTopic").value;
    var QA = document.getElementById("QA").value;
    var password = document.getElementById("password").value;
    const Http = new XMLHttpRequest();
    const url = fb_cf + '/AddTrivia?topic='+TriviaTopic+'&questionAnswer='+QA+'&password='+password
    console.log(url);
    Http.open("GET", url);
    Http.send();
    Http.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
            var responoseJson = this.responseText;
            document.getElementById("addTrivia").innerHTML = responoseJson;
        }
    })
}

function NewTrivia() {
    var TriviaTopic = document.getElementById("TriviaNewTopic").value;
    var password = document.getElementById("password").value;
    const Http = new XMLHttpRequest();
    const url = fb_cf + '/NewTrivia?topic='+TriviaTopic+'&password='+password;
    Http.open("GET", url);
    Http.send();
    Http.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
            var responoseJson = this.responseText;
            document.getElementById("newTrivia").innerHTML = responoseJson;
        }
    })
}

function addYoutube() {
    var ytTitle = document.getElementById("ytTitle").value;
    var ytLink = document.getElementById("ytLink").value;
    var ytType = document.getElementById("ytType").value;
    var password = document.getElementById("password").value;

    const Http = new XMLHttpRequest();
    const url = fb_cf + '/addYoutube?title='+ytTitle+"&youtube="+ytLink+"&type="+ytType+'&password='+password;
    Http.open("GET", url);
    Http.send();
    Http.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
            var responoseJson = this.responseText;
            document.getElementById("ytLink").innerHTML = responoseJson
        }
    })
}