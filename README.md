# Quarantine-Buster
## Co-Author
- [Chun-An Ku](https://github.com/Kuchunan)
- [Joey Wang](https://github.com/JoeyWangTW)
- [Yun Liu](https://github.com/yunliu61)

## Prerequsite
Set up Node.js and Firbase CLI

- install Node.js 8.0
- install Firebase CLI

## Setup Firebase Environment
1. Login to get access from Firebase `firebase login`
2. Get firebase dependencies `firebase init`, select cloud function, firestore and hosting
3. Follow the steps to setup environment, don't overwrite the files
4. Add `"cleanUrls": true,` to firebase.json under `"hosting"`
5. Before deploy, remember to change the const in room.js and welcome.js to your own web url. Also, you need to add the url to index.js for CORS.