var card_pos = 0
var topic_list = ["Animal Live Cam", "City Live Cam", "Trivia!", "Community Chest Card"]
let room_ID = getQueryString("id")
const fb_app = "FIREBASE APP URL"
const fb_cf = "FIREBASE CLOUD FUNCTION URL"
var nickname_local = ""

console.log(room_ID)

function shareRoomLink() {
    var roomlink = document.createElement('input'),
        text = window.location.href;
    document.body.appendChild(roomlink);
    roomlink.value = text;
    roomlink.select();
    document.execCommand('copy');
    document.body.removeChild(roomlink);

    firebase.analytics().logEvent('share_room');
}

function gameInfo() {
    firebase.analytics().logEvent('game_info');
}

function checkDescription(){
    firebase.analytics().logEvent('game_description');
}

function clickLeave(){
    firebase.analytics().logEvent('leave_room');
    window.location.href = '/'
}

function clickPartivipant(){
    firebase.analytics().logEvent('participant');
}


function closeForm() {
    document.getElementById('subnickname').style.display = "none";
    document.getElementById('subnicknameloading').style.display = "block";
    var nickname = document.getElementById("nickname").value;
    const Http = new XMLHttpRequest();
    const url = fb_cf + '/AddNicknameWithDaily' + "?id=" + room_ID + "&nickname=" + nickname;
    nickname_local = nickname
    if (nickname.length > 0) {
        Http.open("GET", url);
        Http.send();
        Http.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                document.getElementById('subnicknameloading').style.display = "none";
                var responoseJson = this.responseText;
                responseAndToken = responoseJson.split("/");
                alert(responseAndToken[0]);

                if (responoseJson.startsWith('Welcome to the room')) {
                    document.getElementById('subnicknameloading').style.display = "none";
                    document.getElementById('exampleModal').style.display = "none";
                    $('.modal-backdrop').remove();
                    GetroomName(responseAndToken[1]);
                    document.getElementById("right").style.border = "none";
                    RoomOnLoad();
                }
                else {
                    document.getElementById('subnickname').style.display = "block";
                }
            }
        });
    } else {
        alert('Please enter a creative nickname');
    }
}

function RoomOnLoad() {
    if (room_ID.length < 1) {
        alert('Invalid room ID');
        window.location.href = fb_app;
    } else {
        const Http = new XMLHttpRequest();
        const url = fb_cf + '/roomIDcheck' + "?id=" + room_ID;
        Http.open("GET", url);
        Http.send();
        Http.addEventListener("readystatechange", function() {
            if (this.readyState === this.DONE) {
                var responoseJson = this.responseText
                if (responoseJson == "Room not created :(") {
                    alert('Invalid room ID');
                    window.location.href = fb_app;
                } else {
                    var roomData = JSON.parse(responoseJson);
                    var roomEXPtime = roomData.expiration_2HR;
                    if (roomEXPtime < Math.floor(Date.now() / 1000)) {
                        alert('Room Expired!');
                        window.location.href = fb_app;
                    };
                }
            }
        });
    }

}

async function GetroomName(token) {
    var callUrl = "https://go-justchat.daily.co/" + room_ID + '?t=' + token;
    var callerUrl = {
        url: callUrl
    };
    var callFrame = await DailyIframe.createFrame({
        showLeaveButton: false,
        iframeStyle: {
            position: "absolute",
            top: "3.8%",
            right: "0.5%",
            width: "30%",
            height: "94%",

        }
    });

    callFrame.join(callerUrl);
    callFrame.setActiveSpeakerMode(false);
    callFrame.setShowNamesMode("always");
    callFrame.on('participant-left', (evt) => {
        participantJson = callFrame.participants();
        ParticipantListArray = [];
        for (const property in participantJson) {
            ParticipantListArray.push(participantJson[property].user_name);
        };
        const url = fb_cf + '/ReviseParticipantList' + "?id=" + room_ID + "&participantList=" + encodeURIComponent(ParticipantListArray);
        const Http = new XMLHttpRequest();
        Http.open("GET", url);
        Http.send();
    })
    callFrame.on('participant-updated', (evt) => {
        participantJson = callFrame.participants();
        ParticipantListArray = [];
        for (const property in participantJson) {
            ParticipantListArray.push(participantJson[property].user_name);
        };
        const url = fb_cf + '/ReviseParticipantList' + "?id=" + room_ID + "&participantList=" + encodeURIComponent(ParticipantListArray);
        const Http = new XMLHttpRequest();
        Http.open("GET", url);
        Http.send();
    })
    callFrame.on('participant-joined', (evt) => {
        participantJson = callFrame.participants();
        ParticipantListArray = [];
        for (const property in participantJson) {
            ParticipantListArray.push(participantJson[property].user_name);
        };
        const url = fb_cf + '/ReviseParticipantList' + "?id=" + room_ID + "&participantList=" + encodeURIComponent(ParticipantListArray);
        const Http = new XMLHttpRequest();
        Http.open("GET", url);
        Http.send();
    })
}


function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    };
    return null;
}

function press_random() {
    var r_button = document.getElementById("random_button")
    r_button.className = "btn btn-primary disabled";
    r_button.style.pointerEvents = "none";
    const Http = new XMLHttpRequest();
    const url = fb_cf + '/randomTopic' + "?id=" + room_ID + "&nickname=" + nickname_local;
    Http.open("GET", url);
    Http.send();
    Http.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
            if (this.responseText != 'success') {
                setTimeout(function(){
                    press_random()
                },500)   
            }
        }
    });
    firebase.analytics().logEvent('press_spin');
}

function flip_topiccard(data) {
    var r_button = document.getElementById("random_button")
    r_button.className = "btn btn-primary disabled";
    r_button.style.pointerEvents = "none";
    document.getElementById("showSpinner").style.display = "block";
    document.getElementById("spinnerText").innerHTML = data.spinner + " made a spin!"    
    setTimeout(function() {
        r_button.className = "btn btn-primary";
        document.getElementById("showSpinner").style.display = "none";
    }, 2390)

    document.getElementById("trivia").style.display = "none";
    document.getElementById("iframescreen").style.display = "none"
    document.getElementById("destinyCard").style.display = "none";
    const db = firebase.firestore();
    spin_state = true
    if (card_pos == 0) {
        card_pos = card_pos + 1980;
    } else {
        card_pos = card_pos + 1800;
    }
    document.getElementById("card").style.transitionDuration = "3.3s";
    document.getElementById("card").style.transform = "rotateX(" + card_pos.toString() + "deg)";
    state = 0
    var randomNumber = Math.floor(Math.random() * topic_list.length)
    document.getElementById("result").innerHTML = topic_list[randomNumber] 
    setTimeout(function() {
        document.getElementById("screen").style.opacity = 0;
        for(let i=1; i<=100; i++){
            setTimeout(function() {
                document.getElementById("screen").style.opacity = i/100;
            }, i*10);
        } 
    }, 2390);
    
    for (i = 0; i < 10; i++) {
        setTimeout(function() {
            randomNumber = Math.floor(Math.random() * topic_list.length)
            document.getElementById("result").innerHTML = topic_list[randomNumber]
        }, i * 150);
    }
    setTimeout(function() {
        document.getElementById("result").innerHTML = data.topic+'&nbsp; <span class="badge badge-secondary badge-pill">?</span>';
        r_button.style.pointerEvents = "auto";
    }, 2400);
    if (data.type == "animal_cam" || data.type == "city_cam" || data.type == "youtube") {
        setTimeout(function() {
            document.getElementById("trivia").style.display = "none";
            document.getElementById("destinyCard").style.display = "none";
            document.getElementById("gameInfoTitle").innerHTML = "Ice Breaker Video";
            document.getElementById("gameInfoText").innerHTML = "These are some interesting videos we collected from youtube. You can chat while watching the animal/city live cams or get some exercise with the dancing/workout videos!";
            showVideo(data)
        }, 2400);
    }
    if (data.type == "destiny") {
        cleanVideo()
        setTimeout(function() {
            document.getElementById("trivia").style.display = "none";
            document.getElementById("iframescreen").style.display = "none";
            document.getElementById("gameInfoTitle").innerHTML = "Chance Card";
            document.getElementById("gameInfoText").innerHTML = "A chance to interact beyond the screen! The chance card would randomly assign a challenge/question to one participant. The left part is a participant's nickname and the right part is the challenge assigned. Have Fun!";
            showDcard(data)
        }, 2400);
    }
    if (data.type == "trivia") {
        cleanVideo()
        setTimeout(function() {
            document.getElementById("trivia").style.display = "block";
            document.getElementById("iframescreen").style.display = "none"
            document.getElementById("destinyCard").style.display = "none";
            document.getElementById("gameInfoTitle").innerHTML = "Trivia Game";
            document.getElementById("gameInfoText").innerHTML = "Answer the questions and see who gets the most correct answers! Click “show answer” to reveal the answer, and “next question” to continue. One session includes 10 questions.";
        }, 2900);
    }
}

function showVideo(data) {
    document.getElementById("iframescreen").style.display = "block";
    document.getElementById("iframescreen").innerHTML = "<iframe src=\"" + data.yt_link + "?autoplay=1&mute=1\"frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen;></iframe>"
}

function cleanVideo(){
    document.getElementById("iframescreen").innerHTML = ""
}

function showDcard(data) {
    document.getElementById("destinyCard").style.display = "block";
    document.getElementById("desCardText").innerHTML = data.destiny_participant + "&nbsp;👈🏻&nbsp;|&nbsp;👉🏻&nbsp;" + data.destiny
    document.getElementById("desCardText").style.opacity = 0;
    setTimeout(function(){
        document.getElementById("desCardText").style.opacity = 1;
    }, 300)

}

// Initialize Firebase
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
    const db = firebase.firestore();
    db.collection('rooms').doc(room_ID).get().then(function(doc) {
        if (doc.exists) {
            if (doc.data().type != "")
                flip_topiccard(doc.data())
        } else {
            console.log("No such document!");
        }
        return
    }).catch(function(error) {
        console.log("Error getting document:");
        return
    });

    db.collection("rooms").doc(room_ID).onSnapshot(function(doc) {
        if (doc.data().spin == true) {
            flip_topiccard(doc.data())
        }
        if (doc.data().Trivia_change == true) {
            if (doc.data().Trivia_answer_open == false) {
                db.collection('activities').doc(doc.data().topic).get().then(function(doct) {
                    question_exact = doct.data().QuestionAnswer[doc.data().Trivia_question];
                    if (doc.data().Trivia_question == 0) {
                        document.getElementById("triviaAnswer").innerHTML = "";
                        question_exact = question_exact.split("?")[0] + '?';
                        document.getElementById("triviaText").innerHTML = question_exact;
                        document.getElementById("TriviaButton").innerHTML = '<button class = "btn btn-secondary" id = "Trivia_Yes" onclick = "TriviaNextQuestion(0)"> Hell Yea </button>&nbsp;&nbsp;&nbsp;<button class = "btn btn-secondary" id = "Trivia_No" onclick="press_random()"> Do something else </button>';
                    } else {
                        try {
                            document.getElementById("triviaAnswer").innerHTML = "";
                            question_exact = question_exact.split("?")[0] + '?';
                            document.getElementById("triviaText").innerHTML = question_exact;
                            document.getElementById("TriviaButton").innerHTML = '<button class = "btn btn-secondary" id = "showanswer" onclick = "OpenAnswer()"> Show Answer </button>&nbsp;&nbsp;&nbsp;<button class = "btn btn-secondary" id = "nextquestion" onclick="TriviaNextQuestion(1)"> Next Question </button>';
                        } catch (err) {
                            document.getElementById("triviaAnswer").innerHTML = "";
                            document.getElementById("triviaText").innerHTML = 'End of Trivia'
                            document.getElementById("TriviaButton").innerHTML =""
                            firebase.analytics().logEvent('trivia_end');
                        }

                    }

                });
            } else {
                db.collection('activities').doc(doc.data().topic).get().then(function(doct) {
                    answer_exact = doct.data().QuestionAnswer[doc.data().Trivia_question];
                    answer_exact = answer_exact.split("?")[1]
                    console.log(answer_exact);
                    document.getElementById("triviaAnswer").innerHTML = answer_exact;
                    document.getElementById("TriviaButton").innerHTML = '<button class = "btn btn-secondary" id = "nextquestion" onclick="TriviaNextQuestion(1)"> Next Question </button>';
                });
            }
        }
        if (doc.data().participants) {
            dropdown_list = "";
            for (i = 0; i < doc.data().participants.length; i++) {
                dropdown_list += '<a class="dropdown-item" href="#">' + doc.data().participants[i] + '</a>'
            }
            document.getElementById("dropdown-menu").innerHTML = dropdown_list;
            document.getElementById("Participant").innerHTML = "Participant (" + doc.data().participants.length + ")";
        }



    });

});

function TriviaNextQuestion(notFirst) {
    ///
    try{
        if(notFirst===1){
            document.getElementById("nextquestion").style.pointerEvents = "none";
            document.getElementById("nextquestion").style.opacity = "0.2";
        }
        else{
            firebase.analytics().logEvent('trivia_yes');
            document.getElementById("Trivia_Yes").style.pointerEvents = "none";
            document.getElementById("Trivia_Yes").style.opacity = "0.2";
        }
    } catch(err){

    }
    document.getElementById("triviaAnswer").innerHTML = "";
    //document.getElementById('triviaLoading').style.display = "block";
    const Http = new XMLHttpRequest();
    const url = fb_cf + '/NewTriviaNextQuestion' + "?id=" + room_ID;
    Http.open("GET", url);
    Http.send();
    Http.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
            var responoseJson = this.responseText;
            console.log(responoseJson);
        }
    });
}



function OpenAnswer() {
    document.getElementById("showanswer").style.pointerEvents = "none";
    document.getElementById("showanswer").style.opacity = "0.2";
    const Http = new XMLHttpRequest();
    const url = fb_cf + '/TriviaOpenAnswer' + "?id=" + room_ID;
    Http.open("GET", url);
    Http.send();
}