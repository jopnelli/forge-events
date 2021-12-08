# Language Manager Cloud

## Dev mode
To run a local development set-up start multiple processes:
### Loophole proxy
Download loophole from here https://loophole.site/ and login before usage. Replace "yourdevname" with sth. unique.
```
./loophole http 8080 --hostname yourdevname 
```
### Forge tunnel
Replace yourdevname to according loophole site again.
```shell 
export FORGE_USER_VAR_LOOPHOLE_HOST="https://yourdevname.loophole.site"
npm run forge:tunnel
```
### React / webpack server(s)
Depending on which UI you are currently developing one of these is sufficient
```shell 
cd static/contentBylineItem/ && npm run start
cd static/modal/ && npm run start
cd static/spaceSettings/ && npm run start
```
### Firestore emulator
```
cd remote
firebase emulators:start
```
### Cloud Run Backend
```
cd remote/run/language/ && npm run serve 
```
