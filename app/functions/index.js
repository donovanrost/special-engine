const functions = require('firebase-functions');
const admin = require('firebase-admin')
const serviceAccount = require('./firebaseServiceAccount.json')

const cors = require('cors')({
    origin: '*',
  
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tasks-991b8.firebaseio.com"
  });
const db = admin.firestore()
db.settings({ timestampsInSnapshots: true })




// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.initializeNewUser = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        /* debug */
        console.log("REQ: ", req)
        console.log("REQ.QUERY", req.query)
        console.log("REQ.BODY ", req.body)
        console.log("REQ.BODY.UID: ", req.body.uid)

        const uid = req.body.uid
        console.log("uid: ", uid)
        const allPromises = []
        const p1 = db.collection('boards').add({
            owner: uid,
            phases: ['backlog', 'todo', 'doing', 'completed']

        })
        .then(docRef => {
            return db.collection('users').doc(uid).set({
                uid: uid,
                boards: [docRef.id],
                maxBoards: 1,
                maxPhases: 4,
                defaultPhases: ['backlog', 'todo', 'doing', 'completed']
            })
            .then((docRef) => {
                res.send({"userDocID": uid})
            })
            .catch(err => {
                console.log(err)
                res.status(500).send(err)
            
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err) 
        })
        allPromises.push(p1)
        return Promise.all(allPromises)
    })
})