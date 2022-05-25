const {createFirestoreBackupFunction} = require("@seibert/firestore-backup-function");

// Note that all of these parameters are optional and use a reasonable default
exports.firestoreBackup = createFirestoreBackupFunction({
    projectId: "language-manager-forge-app",
    schedule: "every 24 hours",
    bucketUri: "gs://language-manager-forge-app-firestore-backup",
    timeoutSeconds: 540,
});