# Atlassian Forge Project Template on Typescript

This a project template which can be used with Atlassians Forge CLI to bootstrap a new project. It implements three example modules in Confluence.
## Requirements

1. Ensure that you are using Node version 16.x and npm version 7.x. Older versions cause errors.
1. [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) according to Atlassians official
   instructions.
1. Have a Confluence Cloud instance ready for testing purposes.
1. Be sure to have Docker installed and running to use the Forge tunnel.

## Features

- Build scripts
- CI / CD Integration with Bitbucket Cloud, automatic deployments
- Updated React & Forge dependencies
- Pre-configured React with craco to allow re-usable components between different Atlassian modules
- Pre-configured to have re-usable types between front-end and back-end
- Injection of Git Hash in artifact to have identifiable builds (find meta attribute 'git-sha' in iFrame html)
- AtlassianContextProvider have ForgeContext available in every component
- Test Set-up with Jest
- Simple Hello-World application to have code examples for React code

## Quick Start

1. You can use this template by passing the bitbucket.org url of the repo to Forge cli.

```shell 
forge create --template '../jwolf_sm/seibert-forge-typescript-template' -d 'my-new-forge-project-dir' 
```

2. Visit the newly created template

3. Build the source files (this will throw a warning if you have not initialized a git repo in the new directory. You probably want to ignore that for now.)

```shell 
npm run build 
```

4. Deploy the source files

```shell 
forge deploy
```

5. Install the app to your Atlassian Confluence dev site.

```shell 
forge install
```

## Dev mode

The template contains a contentBylineItem, a spaceSettingsPage and a modal for example purposes. Change to their folders and start their development servers.

```shell 
cd static/contentBylineItem/ && npm run start
cd static/modal/ && npm run start
cd static/spaceSettings/ && npm run start
```

React will automatically open the dev-servers homepage in a new tab. An error will show up there ("TypeError: Cannot
read property 'callBridge' of undefined"). That's fine. When servers are running (they will use ports 3000-3002)
you can start the Forge tunnel.

```shell 
forge tunnel
```

You can then open you Confluence site and see the spaceSettings ('Demo Space settings' under Space settings), and the contentBylineItem (below every page title) which are hot-reloaded from you local system.
