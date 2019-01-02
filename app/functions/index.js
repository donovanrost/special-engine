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

exports.resetBoard = functions.https.onRequest((request, response) => {
    const allPromises = []

    //first get all boards
    const boards = db.collection('boards').get()
    .then(snapshot => {
        historicalBoardPromises = []
        snapshot.docs.forEach(boardDoc => {

        // then for each board, create a historical board
            const historicalBoardPromise = db.collection('historicalBoard')
            .add({
                totalTasks: boardDoc.data().totalTasks, 
                completedTasks: boardDoc.data().completedTasks
            })
            .then(docRef => {
                const phasePromises = []
                const historicalBoardId = docRef.id

        // now iterate through each phase in boardDoc
                boardDoc.data().phases.forEach(phase => {
        // get all the tasks for each phase 
                    const phasePromise = db.collection('tasks')
                    .where('boardID', '==', boardDoc.id)
                    .where('phase', '==', phase).get()
                    .then(snapshot => {
                        const innerPromises = []
                        snapshot.docs.forEach(doc => {
                            const historicalTask = Object.assign({}, doc.data())
                            historicalTask.boardID = historicalBoardId
                            if (phase === 'backlog') {
                                // do nothing right now
                            }
                            if (phase === 'todo') {
                                // nothing phase specific
                            }
                            if (phase === 'doing') {
                                const p = db.collection('tasks').doc(doc.id)
                                .update({phase: 'todo'})
                                innerPromises.push(p)
                            }
                            if (phase === 'completed') {
                                const p = db.collection('tasks').doc(doc.id).delete()
                                innerPromises.push(p)
                            }
                            const p1 = db.collection('historicalTasks').add(historicalTask)

                            innerPromises.push(p1)

                        })
                        
                        return Promise.all(innerPromises)

                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).send(err)
                    
                    })



                    phasePromises.push(phasePromise)
                    response.send('success')
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).send(err)
                
                })
                return Promise.all(phasePromises)
            })


            historicalBoardPromises.push(historicalBoardPromise)
        })

        return Promise.all(historicalBoardPromises)
    })




    allPromises.push(boards)
    return Promise.all(allPromises)
})


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
            const p1 = db.collection('users').doc(uid).set({
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

            innerPromises.push(p1)
            return Promise.all(innerPromises)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(err) 
        })
        allPromises.push(p1)
        return Promise.all(allPromises)
    })
})


