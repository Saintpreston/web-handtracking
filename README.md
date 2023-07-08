# Soundwave

Soundwave is a WIP game where players use their hand as the controller. It's built on top of [Three. js](https://threejs.org/) and [Mediapipe](https://developers.google.com/mediapipe). It integrates with a glove build with microcontrollers and haptics that vibrate when a player collides. 

### Features
- Increment Score when you collide with a box
- Decrement when you miss a box

### Issues
Currently, several issues are encountered once the project is built and hosted on vercel so you have to run it locally.

Mediapipe's vision task isn't able to run in a web worker so currently there are issues with performance.

## Running the project

Running the project requires you have `pnpm`. You will likely have to [download it](https://pnpm.io/).

If you wish to use your own package manager just to run it locally you can do so by deleting `pnpm-lock.yaml` and running your own package manager's install command.

Once you have `node_modules` run the dev command for your package manager, eg. `pnpm run dev`. 


### Code

The bulk of the logic is in the `GameManager` class, this is meant to call the methods from the other classes and passes data from one to the other. 

To prevent race conditions and cyclic dependencies, Managers should not directly communicate with one another but rather through this `GameManager` class. 

![Code Architecture](https://user-images.githubusercontent.com/90055250/238009099-190a099e-78e4-424d-958f-2652ca729bf1.png)
