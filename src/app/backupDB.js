var admin = require("firebase-admin");
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var serviceAccount = require(path.join(__dirname, "./credentials/" + process.env.CERT_FILE));
var databaseURL = process.env.DATABASE_URL;

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
    const destinyPath = path.join(__dirname, '..', 'backupsFiles','db', rand);

    fs.mkdirSync(destinyPath);

    for (let i = 0; i < collections.length; i++) {
        const collection = collections[i];
        console.log('Saving ', collection);
        await saveCollection(collection, destinyPath);
    }
}

function saveCollection(coleccion, destinyPath) {

    return new Promise(async(resolve, reject) => {
        let isFinish = false
        const step = 500
        let offset = -step
        let data = [];

        while (isFinish === false){
            console.log("data.length", data.length)
            offset = offset + step
            console.log("offset ", offset, " | ", step)
            await admin.firestore().collection(coleccion).offset(offset).limit(step).get().then(docs => {
                // console.log("docs.docs", docs.docs)
                if(docs.docs.length === 0){
                    console.log('Coleccion finalizada');
                    isFinish=true
                }else{
                    
                    console.log(`The collection ${coleccion} has ${docs.docs.length} documents`, docs.docs.length)
        
                    for (let i = 0; i < docs.docs.length; i++) {
        
                        const element = docs.docs[i];
                        let aux = element.data();
                        aux.idDoc = element.id;
                        data.push(aux);
        
                    }
                    
                }
                
                
    
            }).catch(err=>{ reject(err); });
    
        }
        console.log("Starting to save " + coleccion);
        const filenamepath = path.join(destinyPath, coleccion + '.json');
        fs.writeFileSync(filenamepath, JSON.stringify(data), { encoding: 'utf8' });
        console.log(coleccion + " saved");

        resolve();
        
    });
}

main();