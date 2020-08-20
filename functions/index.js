const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore()
let FieldValue = require('firebase-admin').firestore.FieldValue;
const allowedOrigins = ["PUT YOUR DOMAIN HERE"]

exports.createRoom = functions.https.onRequest(async(req, res) => {
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    var n = Math.floor(Date.now() / 1000);
    var expiration = (Math.floor(Date.now() / 1000) + 3600);
    var docRef = db.collection("rooms").doc(req.query.id).set({
            //add any initial data field here
            spin: false,
            topic: "",
            yt_link: "",
            creat_time: n,
            expiration_2HR: expiration,
            participants: [],
            spinner: "",
            destiny: "",
            destiny_participant: "",
            type: "",
            Trivia_answer_open: false,
            Trivia_question: 0,
            Trivia_change: false,
            Guess_Exp_time:1,
            Price_Guessed:[],
        })
        .then(function(docRef) {
            res.send(req.query.id)
            return
        })
        .catch(function(error) {
            res.send("nope")
            return
        });

});

exports.getRoomDetail = functions.https.onRequest(async(req, res) => {
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    var docRef = db.collection("rooms").doc(req.query.id)
    var result = ""
    docRef.get().then(function(doc) {
        if (doc.exists) {
            result = doc.data()
            res.send(result)
        } else {
            // doc.data() will be undefined in this case
            result = "no data"
            res.send(result)
        }
        return
    }).catch(function(error) {
        result = "error"
        res.send(result)
        return
    });

    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.

});

// 
exports.roomIDcheck = functions.https.onRequest(async(req, res) => {
    // Grab the text parameter.
    const roomID = req.query.id;
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    var docRef = db.collection("rooms").doc(roomID)
    var result = ""
    docRef.get().then(function(doc) {
        if (doc.exists) {
            result = doc.data()
            res.send(result)
        } else {
            // doc.data() will be undefined in this case
            result = "Room not created :("
            res.send(result)
        }
        return
    }).catch(function(error) {
        result = "error"
        res.send(result)
        return
    });

    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.

});

exports.AddNickname = functions.https.onRequest(async(req, res) => {
    // Grab the text parameter.
    const roomID = req.query.id;
    var nickname = String(req.query.nickname);
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    var docRef = db.collection("rooms").doc(roomID)
    var result = ""
    docRef.get().then(function(doc) {
        if (doc.exists) {
            result = doc.data();
            var oldParticipants = result.participants
            if (oldParticipants.includes(nickname)) {
                res.send('Nickname already existed! Please come out a more creative one!');
            } else {
                docRef.update({
                    participants: FieldValue.arrayUnion(nickname)
                });
                messages = 'Welcome to the room! Currently, there are ' + oldParticipants.length + ' other players in the room.'
                res.send(messages);
            }
            return
        } else {
            // doc.data() will be undefined in this case
            var alert = "Room not created :("
            res.send(alert)
        }
        return
    }).catch(function(error) {
        var alert = "error"
        res.send(alert)
        return
    });
});


exports.AddNicknameWithDaily = functions.https.onRequest(async(req, res) => {
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    const roomID = String(req.query.id);
    var nickname = String(req.query.nickname);
    var request = require("request");
    var docRef = db.collection("rooms").doc(roomID)
    var result = ""
    var options = {
        method: 'POST',
        url: 'https://api.daily.co/v1/meeting-tokens',
        headers: {
            'content-type': 'application/json',
            authorization: 'PUT DAILY.co API TOKEN HERE',
        },
        body: '{"properties":{"room_name":"' + roomID + '","user_name":"' + nickname + '"}}'
    };


    docRef.get().then(function(doc) {
        if (doc.exists) {
            result = doc.data();
            var oldParticipants = result.participants
            if (oldParticipants.includes(nickname)) {
                res.send('Nickname already existed! Please come out a more creative one!/');
            } else {
                docRef.update({
                    participants: FieldValue.arrayUnion(nickname)
                });
                request(options, function(error, response, body) {
                    if (error) throw new Error(error);
                    if (body) {
                        console.log(body);
                        messages = 'Welcome to the room! Currently, there are ' + oldParticipants.length + ' other players in the room./' + JSON.parse(body).token;
                        res.send(messages);
                    }
                });
            }
            return
        } else {
            // doc.data() will be undefined in this case
            var alert = "Room not created :(/"
            res.send(alert)
        }
        return
    }).catch(function(error) {
        var alert = "error1/"
        res.send(alert)
        return
    });
});


exports.ParticipantsList = functions.https.onRequest(async(req, res) => {
    // Grab the text parameter.
    const roomID = req.query.id;
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    var docRef = db.collection("rooms").doc(roomID)
    var result = ""
    docRef.get().then(function(doc) {
        if (doc.exists) {
            result = doc.data()
            res.send(result.participants);
        } else {
            // doc.data() will be undefined in this case
            result = "Fail to load participants list!"
            res.send(result)
        }
        return
    }).catch(function(error) {
        result = "error"
        res.send(result)
        return
    });

    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.

});

exports.registerTrivia = functions.https.onRequest(async(req, res) => {
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    var docRef = db.collection("rooms").doc(req.query.id).update({
            Trivia_question: 0,
            Trivia_answer_open: false,
        })
        .then(function(docRef) {
            res.send(req.query.id)
            return
        })
        .catch(function(error) {
            res.send("nope")
            return
        });

});

exports.TriviaOpenAnswer = functions.https.onRequest(async(req, res) => {
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    var docRef = db.collection("rooms").doc(req.query.id).update({
            Trivia_answer_open: true,
            Trivia_change: true,
        })
        .then(function(docRef) {
            res.send(req.query.id)
            return
        })
        .catch(function(error) {
            res.send("nope")
            return
        });

});



exports.TriviaShowQuestion = functions.https.onRequest(async(req, res) => {
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    const topic = req.query.topic;
    const question_number = req.query.question_number;

    var docRef = db.collection("activities").doc(topic)
    var result = ""
    docRef.get().then(function(doc) {
        if (doc.exists) {
            result = doc.data();
            Question = result.QuestionAnswer[question_number].split("?")
            res.send(Question[0] + '?');
        } else {
            // doc.data() will be undefined in this case
            result = "Fail to get question!"
            res.send(result)
        }
        return
    }).catch(function(error) {
        result = "End of Trivia"
        res.send(result)
        return
    });
})

exports.TriviaShowAnswer = functions.https.onRequest(async(req, res) => {
    const topic = req.query.topic;
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    const question_number = req.query.question_number;
    var docRef = db.collection("activities").doc(topic)
    var result = ""
    docRef.get().then(function(doc) {
        if (doc.exists) {
            result = doc.data();
            Question = result.QuestionAnswer[question_number].split("?")
            res.send(Question[1]);
        } else {
            // doc.data() will be undefined in this case
            result = "Fail to get question!"
            res.send(result)
        }
        return
    }).catch(function(error) {
        result = "End of Trivia"
        res.send(result)
        return
    });
})



exports.TriviaGetQuestionNumberAndAnswer = functions.https.onRequest(async(req, res) => {
    const roomID = req.query.id;
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    var docRef = db.collection("rooms").doc(roomID)
    var result = ""
    docRef.get().then(function(doc) {
        if (doc.exists) {
            result = doc.data()
            res.send(result.topic + ',' + result.Trivia_question + ',' + result.Trivia_answer_open);
        } else {
            // doc.data() will be undefined in this case
            result = "Fail to get question number!"
            res.send(result)
        }
        return
    }).catch(function(error) {
        result = "error"
        res.send(result)
        return
    });

});

exports.TriviaNextQuestion = functions.https.onRequest(async(req, res) => {
    // Grab the text parameter.
    const roomID = req.query.id;
    var question_number = String(req.query.question_number);
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    var docRef = db.collection("rooms").doc(roomID)
    var result = ""
    docRef.get().then(function(doc) {
        if (doc.exists) {
            docRef.update({
                Trivia_answer_open: false,
                Trivia_question: question_number,
                Trivia_change: true,
            });
            messages = 'Question_number: ' + question_number
            res.send(messages);
            return
        } else {
            // doc.data() will be undefined in this case
            var alert = "Room not created :("
            res.send(alert)
        }
        return
    }).catch(function(error) {
        var alert = "error"
        res.send(alert)
        return
    });
})

exports.randomTopic = functions.https.onRequest(async(req, res) => {
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    var topic_list = [];
    var activity_type = ["animal_cam", "city_cam", "destiny", "trivia", "youtube"]; //Add activity type here
    var updateTimestamp = db.collection('rooms').doc(req.query.id);
    updateTimestamp.get().then(function(roomdoc){
        var roomNow = roomdoc.data().now
        if(roomNow === roomdoc.data().topic_list.length){
            roomNow = 0
        }
        var participants = roomdoc.data().participants
        var act = db.collection('activities').doc(roomdoc.data().topic_list[roomNow]).get().then(function(querySnapshot) {
            if (querySnapshot.data().type === "animal_cam" || querySnapshot.data().type === "city_cam" || querySnapshot.data().type === "youtube") {
                updateTimestamp.update({
                    topic: querySnapshot.data().title,
                    yt_link: querySnapshot.data().youtube,
                    spin: true,
                    spinner: req.query.nickname,
                    type: querySnapshot.data().type,
                    Trivia_change: false,
                    now: roomNow+1
                });
                setTimeout(function(){
                    updateTimestamp.update({
                        spin: false,
                    });
                },500)
                res.send("success")
                
            }
            if (querySnapshot.data().type === "trivia") {
                var trivia_list = [];
                updateTimestamp.update({
                    topic: querySnapshot.data().title,
                    Trivia_question: 0,
                    spin: true,
                    spinner: req.query.nickname,
                    type: querySnapshot.data().type, //"trivia"
                    Trivia_answer_open: false,
                    Trivia_change: true,
                    now: roomNow+1
                });
                setTimeout(function(){
                    updateTimestamp.update({
                        spin: false,
                    });
                },500)
                res.send("success")
                
                return
            }

            //For destiny card
            if (querySnapshot.data().type === "destiny") {
                var destiny_list = querySnapshot.data().destiny_list
                var rparticipant = participants[(Math.floor(Math.random() * participants.length)+roomNow)%participants.length]
                var randomDestiny = (Math.floor(Math.random() * destiny_list.length)+(roomNow+1)/4)%destiny_list.length

                updateTimestamp.update({
                    topic: "Chance Card",
                    destiny: destiny_list[randomDestiny],
                    spin: true,
                    spinner: req.query.nickname,
                    type: querySnapshot.data().type,
                    destiny_participant: rparticipant,
                    Trivia_change: false,
                    now: roomNow+1
                });
                setTimeout(function(){
                    updateTimestamp.update({
                        spin: false,
                    });
                },500)
                res.send("success")
                
            }
            return
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
            res.send("error")
            return
        });   
        return
    }).catch(function(error){
        res.send("error")
        return
    })   
});


exports.AddTrivia = functions.https.onRequest(async(req, res) => {
    // Grab the text parameter.
    const topic = req.query.topic;
    const questionAnswer = req.query.questionAnswer;
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    const password = req.query.password;
    if(password==="PASSWORD"){
        var docRef = db.collection("activities").doc(topic);
        var result = ""
        docRef.get().then(function(doc) {
            if (doc.exists) {
                docRef.update({
                    QuestionAnswer: FieldValue.arrayUnion(questionAnswer),
                });
                messages = questionAnswer + 'added!';
                res.send(messages);
                return;
            } else {
                // doc.data() will be undefined in this case
                result = "Trivia not existed"
                res.send(result)
            }
            return
        }).catch(function(error) {
            result = "error"
            res.send(result)
            return
        });

        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    }
    else{
        res.send("Wrong password")
    }
    

});

exports.callToDailyAPI = functions.https.onRequest(async(req, res) => {
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    var request = require("request");
    var expiration = (Math.floor(Date.now() / 1000) + 3600);
    var n = Math.floor(Date.now() / 1000);
    var options = {
        method: 'POST',
        url: 'https://api.daily.co/v1/rooms',
        headers: {
            'content-type': 'application/json',
            authorization: 'PUT DAILY.co API TOKEN HERE'
        },
        body: '{"properties":{"exp":' + expiration + ',"enable_chat":true,"start_video_off":false,"enable_screenshare":false}}'
    };
    request(options, function(error, response, body) {
        if (error) throw new Error(error);
        if (body) {
            console.log(body);
            var actList = []                                                           
            db.collection("activities").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    if(doc.data().type !== "destiny")
                        actList.push(doc.id);
                });
                console.log(actList);
                for(let i = actList.length-1; i > 0; i--){
                    const j = Math.floor(Math.random() * i)
                    const temp = actList[i]
                    actList[i] = actList[j]
                    actList[j] = temp
                }
                let j = 0
                while(j+3 < actList.length){
                    actList.splice(j+3,0,"destiny")
                    j = j+4
                }
                var docRef = db.collection("rooms").doc(JSON.parse(body).name).set({
                    //add any initial data field here
                    spin: false,
                    topic: "",
                    yt_link: "",
                    creat_time: n,
                    expiration_2HR: expiration,
                    participants: [],
                    spinner: "",
                    destiny: "",
                    destiny_participant: "",
                    type: "",
                    Trivia_answer_open: false,
                    Trivia_question: 0,
                    Trivia_change: false,
                    now:0,
                    topic_list: actList
                }) 
                .then(function(docRef) {
                    res.send(JSON.parse(body).name)
                    return
                })
                .catch(function(error) {
                    res.send("nope")
                    return
                });
                return
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            }); 
            
        }
    });
});

exports.ReviseParticipantList = functions.https.onRequest(async(req, res) => {
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    const roomID = req.query.id;
    const ParticipantListArray = decodeURIComponent(req.query.participantList).split(",");
    var docRef = db.collection("rooms").doc(roomID).update({
            //add any initial data field here
            participants: ParticipantListArray,
        })
        .then(function(docRef) {
            res.send('Success ' + ParticipantListArray)
            return
        })
        .catch(function(error) {
            res.send("nope")
            return
        });

});

exports.deleteExpiredRoom = functions.https.onRequest(async(req, res) => {
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000")
    const password = req.query.password
    if (password === "PASSWORD"){
        var n = Math.floor(Date.now() / 1000);
        var roomlist = db.collection('rooms');
        var log = ""
        roomlist.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                if (doc.data().expiration_2HR < n) {
                    db.collection('rooms').doc(doc.id).delete();
                    console.log(doc.id + " " + doc.data().expiration_2HR + ' deleted ')
                    log += 'Room ' + doc.id + " " + ' deleted '
                }
            })
            res.send('success ' + log);
            return
        }).catch(function(error) {
            res.send('error ' + error)
            return
        })
    }
    else{
        res.send("Wrong Password")
    }
    

});

exports.NewTrivia = functions.https.onRequest(async(req, res) => {
    const topic = req.query.topic;
    
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    const password = req.query.password;
    if(password==="PASSWORD"){
        var docRef = db.collection("activities").doc(topic);
        docRef.set({
                available: true,
                title: topic,
                type: "trivia",
                QuestionAnswer: [],
            }).then(function(docRef) {
                res.send('success')
                return
            })
            .catch(function(error) {
                res.send("nope")
                return
        });
    }
    else{
        res.send("Wrong Password")
    }


});


exports.NewTriviaNextQuestion = functions.https.onRequest(async(req, res) => {
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");

    const roomID = req.query.id;
    var question_number = String(req.query.question_number);
var expiration = (Math.floor(Date.now() / 1000) + 15);
    var docRef = db.collection("rooms").doc(roomID)
    var result = ""
    docRef.get().then(function(doc) {
        if (doc.exists) {
            var question_number = parseInt(doc.data().Trivia_question) + 1;
            docRef.update({
                Trivia_answer_open: false,
                Trivia_question: question_number,
                Trivia_change: true,
                Guess_Exp_time:expiration,
                Price_Guessed: [],
            });
            messages = 'Question_number: ' + question_number
            res.send(messages);
            return
        } else {
            // doc.data() will be undefined in this case
            var alert = "Room not created :("
            res.send(alert)
        }
        return
    }).catch(function(error) {
        var alert = "error"
        res.send(alert)
        return
    });
})

exports.addYoutube = functions.https.onRequest(async(req, res) => {
    const title = req.query.title;
    const youtube = req.query.youtube;
    const type = req.query.type;
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    const password = req.query.password;
    if(password==="PASSWORD"){
        var docRef = db.collection("activities").doc(title);
        docRef.set({
                available: true,
                title: title,
                type: type,
                youtube: youtube,
        }).then(function(docRef) {
            res.send('success')
            return
        })
        .catch(function(error) {
            res.send("nope")
            return
        });
    }
    else{
        res.send("Wrong password")
    }


});


exports.PriceGuessOpenAnswer = functions.https.onRequest(async(req, res) => {
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    var nickname = String(req.query.nickname);
    var price = String(req.query.price);
    var docRef = db.collection("rooms").doc(req.query.id).update({
            Trivia_answer_open: true,
            Trivia_change: true,
            Price_Guessed: FieldValue.arrayUnion(nickname+'/'+price),
        })
        .then(function(docRef) {
            res.send(req.query.id)
            return
        })
        .catch(function(error) {
            res.send("nope")
            return
        });

});


exports.CucstomerComment = functions.https.onRequest(async(req, res) => {
    res.set('Access-Control-Allow-Methods', "GET, HEAD, OPTIONS, POST")
    var origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set("Access-Control-Max-Age", "1296000");
    var name = String(req.query.name);
    var mailAddress = String(req.query.mail);
    var comment = String(req.query.comment);
    var n = Math.floor(Date.now() / 1000);
    var docRef = db.collection("comment").doc().set({
            name: name,
            mailAddress: mailAddress,
            comment: comment,
            time: n,
        })
        .then(function(docRef) {
            res.send('Success')
            return
        })
        .catch(function(error) {
            res.send("nope")
            return
        });

});