env && \
gcloud auth activate-service-account --key-file /app/src/app/credentials/$CERT_FILE && \
[ -d /app/src/backupsFiles/db ] || mkdir -p /app/src/backupsFiles/db && \
[ -d /app/src/backupsFiles/users ] || mkdir -p /app/src/backupsFiles/users && \
[ -d /app/src/backuspFiles/storage ] || mkdir -p /app/src/backupsFiles/storage && \
node /app/src/app/backupDB.js && \
firebase --project $PROJECTID auth:export /app/src/backupsFiles/users/users.json && \
gsutil -m cp -R gs://$PROJECTID.appspot.com /app/src/backupsFiles/storage/