TheGame [![Circle CI](https://circleci.com/gh/erulabs/thegame/tree/master.png?circle-token=b57c51c38c36f5e7fedcc046264bcfc9918c3ffc)](https://circleci.com/gh/erulabs/thegame/tree/master)
=============

# About
An online, browser-based competive strategy game written by Seandon Mooy, Jeremy Miller, Dustin Lloyd, and Matt Ellsworth. TheGame is written entirely in JavaScript ES6. It is composed of a number of sub-projects. See the Projects section.

A staging version of thegame should always be deployed at [thegame.erulabs.com](http://thegame.erulabs.com/), with documentation available at [thegame.erulabs.com/doc](http://thegame.erulabs.com/doc) (username: 'thegame', password: '123qweasd')

Collaboration is done via [waffle.io](https://waffle.io/erulabs/thegame) and [Slack.com](https://themamble.slack.com/messages/general/)

# Developing
## Installing
1. [Download the latest io.js](https://iojs.org)
2. `npm install`

That's all  folks!

## Working
A. Boot into development: `npm run develop`, browse to: [localhost:8080](http://localhost:8080)

B. Boot into development against a local MongoDB instance: `npm run local-develop`

C. Build project: `npm run build`

D. Run tests: `npm run test`

E. Audit your code: `npm run lint`

## JS development tips
1. Use [Chrome Canary](https://www.google.com/chrome/browser/canary.html) and install the [LiveReload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en) plugin
2. Use [SublimeText3](http://www.sublimetext.com/3), [PackageControl](https://packagecontrol.io/installation)
3. Install the SublimeText plugins "Gitgutter", "SublimeLinter", "SublimeLinter-jshint" and "EditorConfig"
4. Install a [sexy font](https://github.com/adobe-fonts/source-code-pro/releases/tag/1.017R) for your terminal and SublimeText

## Windows tips
1. If you're a Windows user, I strongly recommend [GitHub for Windows](https://windows.github.com/) - use the "Git Shell" and ensure the command `node` works properly. After that, use [ConEMU](http://sourceforge.net/projects/conemu/) as a better shell - make sure it launches into the bash provided by GitHub for Windows (or git-scm also works).

## Things to note:
1. In development, we use [MongoLab](https://mongolab.com), but you can and should install MongoDB and set things up to test locally. The MongoLab database is just a free account and is only there so that it's very simple to get hacking on things without the complexity of Mongo.

# Projects
## API
[Documentation](http://thegame.erulabs.com/doc/api) (username: 'thegame', password: '123qweasd')

The games datastore - where all static information is kept. The API is responsible for things like:

1. User account information / authentication
2. Class/Item/Map warehouse ('Hey API, give me a list of maps!')
3. Matchmaking and assigning players to Game Server instances
4. Maintaining a "Health Report" which describes the available number of Dispatchers and their available Game Server instances

The API speaks HTTP powered by the NodeJS library [express.js](http://expressjs.com/). For the database it uses MongoDB powered by the NodeJS library [Mongoose](http://mongoosejs.com/)

## Client
[Documentation](http://thegame.erulabs.com/doc/client) (username: 'thegame', password: '123qweasd')

Almost all of the actual "Game" lives here, which is deceptive because there is also a project called "Game". However, this is _everything_ that is sent to the browser. This includes _all_ HTML, CSS, UI, Models, Assets, Textures, etc. We layer on plenty of features here - LESS instead of CSS, Jade instead of HTML, image compression, added features to enhance browsers JavaScript support, etc. `npm run build` will build this for you and compiled into the "build" directory.

## Dispatcher
[Documentation](http://thegame.erulabs.com/doc/dispatcher) (username: 'thegame', password: '123qweasd')

The dispatcher is a fairly small codebase compaired to the other projects. It's only job is to register with the API and spawn instances of the "Game" server. It provides game server instances to the API for which the API will direct users to. It's only real job is the managment of Game server instances.

## Game
[Documentation](http://thegame.erulabs.com/doc/game) (username: 'thegame', password: '123qweasd')

The game server instance - this is a process which creates a TCP socket which is connected to by the users browser and handles the realtime communication between users. It does rule checking, etc. When the "round" ends, the game server is destroyed and its final state/stats exported to the API for long term storage.

## Shared
[Documentation](http://thegame.erulabs.com/doc/shared) (username: 'thegame', password: '123qweasd')

The shared codebase is for two things:

1. Static data which is inherited by multiple sources. For example, "Item1 does 10 damage" is a fact which both the API, the Client, and the Game projects will want to draw upon (and we won't want to repeat). It's also data that doesn't really need to be in a Database (static is faster, it's not like the base damage of the Item will change based on anything, we'll release a balance patch to change these values).
2. Helper functions. Basically small generic snippets of code we find ourselves needing across all the codebases. These should be kept very very small.

## Spec
Contains the testing code for the project. `npm run test` at the command prompt (as well as `npm run develop`) will run the tests against your code. Writing tests is how we know our code continues to work when we make changes to it later on! Writing tests is important! Write even MORE tests!
