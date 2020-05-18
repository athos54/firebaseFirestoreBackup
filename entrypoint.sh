gcloud auth activate-service-account --key-file /app/src/app/credentials/$CERT_FILE && \
[ -d /app/src/backupsFiles/db ] || mkdir -p /app/src/backupsFiles/db && \
[ -d /app/src/backupsFiles/users ] || mkdir -p /app/src/backupsFiles/users && \
[ -d /app/src/backuspFiles/storage ] || mkdir -p /app/src/backupsFiles/storage && \

if ["$FIREBASE_TOKEN" == ""]
then
    echo ""
    echo ""
    echo ""
    echo "#################################################"
    echo "    You need generate firebase token."
    echo "    Follow the instructions to do it"
    echo "#################################################"
    echo ""
    echo "Run the command below"
    echo "1.- docker-compose run backup firebase login:ci --no-localhost"
    echo "2.- Go to the url generated by the command"
    echo "3.- Login with your firebase account"
    echo "4.- Copy code on website"
    echo "5.- Paste code on terminal an press enter"
    echo "    You will see '✔ Success! Use this token to login on a CI server:'"
    echo "6.- Copy the new generated token, and put it on .env file like this"
    echo "    FIREBASE_TOKEN=your-generated-token"
    echo ""
    echo "******************************************************"
    echo "    Once you have completed these steps, you can re-run"
    echo "    docker-compose up --build"
    echo "******************************************************"
    
else
    node  --max-old-space-size=4096 /app/src/app/backupDB.js && \
    firebase --project $PROJECTID auth:export /app/src/backupsFiles/users/users.json && \
    gsutil -m cp -R gs://$PROJECTID.appspot.com /app/src/backupsFiles/storage/
fi