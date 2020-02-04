var admin = require("firebase-admin");
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var serviceAccount = require("./credentials/your-project-firebase-adminsdk-dtazl-af18760cdf3e.json");
var databaseURL = "https://your-project.firebaseio.com";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: databaseURL
});

const collections = [];

function getAllCollections() {
    return new Promise((resolve, reject) => {
        
        admin.firestore().listCollections().then(res => {
            
            for (let i = 0; i < res.length; i++) {
                const coleccion = res[i];
                collections.push(coleccion.id);
            }

            resolve();

        }).catch(err=>{ reject(err); });

    });
}

async function main() {
    await getAllCollections();
    console.log('Collections:');
    console.log(collections);

    const rand = moment().format('YYYY-MM-DD-HH-mm') + '_' + Math.random();
    const destinyPath = path.join(__dirname, '..', 'backupsFiles', rand);

    fs.mkdirSync(destinyPath);

    for (let i = 0; i < collections.length; i++) {
        const collection = collections[i];
        console.log('Saving ', collection);
        await saveCollection(collection, destinyPath);
    }
}

function saveCollection(coleccion, destinyPath) {

    return new Promise((resolve, reject) => {

        admin.firestore().collection(coleccion).get().then(docs => {
            
            let data = [];
            
            for (let i = 0; i < docs.docs.length; i++) {

                const element = docs.docs[i];
                let aux = element.data();
                aux.idDoc = element.id;
                data.push(aux);

            }

            const filenamepath = path.join(destinyPath, coleccion + '.json');
            fs.writeFileSync(filenamepath, JSON.stringify(data), { encoding: 'utf8' });

            resolve();

        }).catch(err=>{ reject(err); });

    });
}

main();