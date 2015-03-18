TheGame [![Circle CI](https://circleci.com/gh/erulabs/thegame/tree/master.png?circle-token=b57c51c38c36f5e7fedcc046264bcfc9918c3ffc)](https://circleci.com/gh/erulabs/thegame/tree/master)
=============

# About
An online, browser-based competive strategy game written by Seandon Mooy, Jeremy Miller, Dustin Lloyd, and Matt Ellsworth. TheGame is written entirely in JavaScript ES6. It is composed of a number of sub-projects. See the Projects section.

# Developing
The project is powered by IO.JS, and the build system we're using is [gulp.js](http://gulpjs.com/). To get the components required:

## Installing
1. [Download IO.JS](https://iojs.org)
2. If you're a Windows user, I strongly recommend [GitHub for Windows](https://windows.github.com/) - use the "Git Shell" and ensure the command `node` works properly.
3. Install Gulp globally, that's `sudo npm install -g gulp` (leave sudo off if you're a Windows user)
4. Clone the project (obviously) locally (`git clone...`)
5. `cd` into the projects directory and install all the required dependancies: `npm install`.
6. The project makes use of "livereload" for easier editing. I use the Chrome plugin, but supposedly it works for Firefox and other browsers as well. That said, [Chrome Canary](https://www.google.com/chrome/browser/canary.html) will _crush_ all other browsers in terms of local 3D performance.
7. We also use [EditorConfig](http://editorconfig.org/) - Make sure to install it in whatever editor you prefer.
8. If you use SublimeText, go ahead and install "SublimeLinter" and the SublimeLinter-jshint plugin. This will help you catch coding mistakes much more quickly :)
9. Make sure to use https://waffle.io/erulabs/thegame to track your work :D

## Working
Now that you're installed, you can boot the entire project into development mode with `gulp watch`. Note that `gulp` alone builds the project ready for production, but will not actually launch it in a development-friendly way.

You'll see that `gulp watch` starts a number of services. By default, the local development server at [port 8080](http://localhost:8080) is the development web server. 8081 is the API (which the development server proxies to in the case of web requests to :8080/api), and 8082 is a game dispatcher and it should start a game server instance on port 8083.

# Projects
## API
Documentation: http://thegame.erulabs.com/doc/api

The games datastore - where all static information is kept. The API is responsible for things like:

1. User account information / authentication
2. Class/Item/Map warehouse ('Hey API, give me a list of maps!')
3. Matchmaking and assigning players to Game Server instances
4. Maintaining a "Health Report" which describes the available number of Dispatchers and their available Game Server instances

The API codebase speaks HTTP powered by the NodeJS library [express.js](http://expressjs.com/). For the database backend it will use MongoDB, however in local development mode, it will use LevelDB. The idea behind this is that LevelDB can by run and managed by our development instance itself - making getting started developing a lot easier. However, installing MongoDB isn't that difficult either :)

## Client
Documentation: http://thegame.erulabs.com/doc/client/

Almost all of the actual "Game" lives here, which is deceptive because there is also a project called "Game". However, this is _everything_ that is sent to the browser. This includes _all_ HTML, CSS, UI, Models, Assets, Textures, etc. We layer on plenty of features here - LESS instead of CSS, Jade instead of HTML, image compression, added features to enhance browsers JavaScript support, etc. `gulp` will build this for you and compiled into the "build" directory.

## Dispatcher
Documentation: http://thegame.erulabs.com/doc/dispatcher/

The dispatcher is a fairly small codebase compaired to the other projects. It's only job is to register with the API and spawn instances of the "Game" server. It provides game server instances to the API for which the API will direct users to. It's only real job is the managment of Game server instances.

## Game
Documentation: http://thegame.erulabs.com/doc/game/

The game server instance - this is a process which creates a TCP socket which is connected to by the users browser and handles the realtime communication between users. It does rule checking, etc. When the "round" ends, the game server is destroyed and its final state/stats exported to the API for long term storage.

## Shared
Documentation: http://thegame.erulabs.com/doc/shared/

The shared codebase is for two things:

1. Static data which is inherited by multiple sources. For example, "Item1 does 10 damage" is a fact which both the API, the Client, and the Game projects will want to draw upon (and we won't want to repeat). It's also data that doesn't really need to be in a Database (static is faster, it's not like the base damage of the Item will change based on anything, we'll release a balance patch to change these values).
2. Helper functions. Basically small generic snippets of code we find ourselves needing across all the codebases. These should be kept very very small.

## Spec
Contains the testing code for the project. `npm test` at the command prompt (as well as `gulp watch`) will run the tests against your code. Writing tests is how we know our code continues to work when we make changes to it later on! Writing tests is important! Write even MORE tests!
