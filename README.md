# Venue
Uses Vue 3.0 for the client code (yarn instructions are below).

Uses firebase for auth, hosting, and server function to communicate to firebase storage.

Uses THREE.js for model viewer.


## Client Setup
Installation: `yarn install`

Hot Reload: `yarn run serve`

Build: `yarn run build`


## Firebase Setup
Install Firebase Tools: `npm install -g firebase-tools` && `firebase login`

Install Functions: `cd functions` && `npm install`

Functions Hot Reload: `firebase --only functions serve`

Deployment (run yarn build first): `firebase deploy`


## Code Layout
First route `src/views/Home` is login portal.

Second route `src/views/Model` can only be accessed if auth object exists in vuex store. This route is the THREE.js viewer.

Client > server/auth code is in `src/store/store`, in action functions.
