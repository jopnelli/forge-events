# Language Manager Cloud
## Your own manifest.yml
This project is using a dynamic manifest.yml.  This way every developer can use his own appId which is necessary due to current Forge limitations (missing multi-ownership of apps). The effective manifest is a result of a merge of a manifest.somedevsname.yml and the manifest.base.yml. 
You can build the manifest.yml (which is .gitignored) by adding your own manifest.somedevsname.yaml to the root dir:

1. run ```forge create``` in some other directory, create an app
2. obtain your new appId from the newly created manifest.yml. You can then delete the newly created directory.
3. copy manifest.jwolf.yml and create your own manifest.somedevsname.yaml – replace the appId
4. You are ready! Execute the following command and a manifest.yml will be created:

```
FORGE_ENV=somedevsname npm run build-manifest
```

## Dev mode
To run a local development set-up you have to start multiple processes. This can be automated by using ttab.

### Auto start
You can automate the processes below by choosing a custom subdomain (replace that with yourcustomdevmode) and running the following command:
```
node dev.js --host yourcustomdevmode
```
### Manual Start (all processes below)
### Loophole proxy
Download loophole from here https://loophole.site/ and login before usage. Replace "yourdevname" with sth. unique.
```
./loophole http 8080 --hostname yourdevname 
```
### Forge tunnel
Replace yourdevname to according loophole site again.
```shell 
export FORGE_USER_VAR_LOOPHOLE_HOST="yourdevname"
npm run forge:tunnel
```
### React / webpack server(s)
Depending on which UI you are currently developing one of these is sufficient
```shell 
cd static/contentBylineItem/ && npm run start
cd static/modal/ && npm run start
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
