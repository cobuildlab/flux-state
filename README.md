

# Flux State

Learning flux is hard, using it is cumbersome. Hopefully it will become easier with this library!

Also, learning redux is harder, so this is state library that make your life easier

The principles and guidelines supporting this Library are:

1) Define a Store should be an easy step, keeping the power of a "Single source of truth"
2) Data and event propagation should be done in a declarative way
3) Views should be developer in a reactive way.
4) Multiple Stores are allowed for better organization
5) We keep flux as it should be unidirectional, so there is no coupling between the Action and the Views, neither between the Actions and the Store, neither between the Store and the View
6) The Store state is implicit: The last value of all the events on the Store.

## Installation

1. Run on your terminal the following command:
```sh
$ npm install @cobuildlab/flux-state --save
```
2. To import the library anywhere you would like to use it:

```javascript
import Flux from 'flux-state';
```

## Let's build a Flux Workflow for authentication

### 1) First, declare your Store

```javascript
import Flux from 'flux-state';

export const LOGOUT_EVENT = 'onLogout';
export const LOGIN_EVENT = 'onLogin';
export const SESSION_EVENT = 'onSession';

class SessionStore extends Flux.DashStore{
    constructor(){
        super();
        // Declare an Event
        this.addEvent(LOGOUT_EVENT);
        // Or Declare an event with some immutable transformation logic
        this.addEvent(LOGIN_EVENT, (state) => {
            // Do something with the data before propagating the Event
            return Object.assign(state, {"key": "value"})
        });
        // Or Declare an event with some plain transformation logic
        this.addEvent(SESSION_EVENT, (state) => {
            state.some_other_property = "Some other Data";
            return Object.assign(state, {"key": "value"})
        });
    }
}

const sessionStore = new SessionStore();
export {sessionStore};
```

### 2) Registering with the Store changes

```js
import React from 'react';
import {sessionStore, LOGIN_EVENT, LOGOUT_EVENT, SESSION_EVENT } from '/path/to/store';

export class View extends React.Component {
      constructor(){
          super();
          const user = sessionStore.getState(SESSION_EVENT);
          this.state = {
            isLogged: !!user
          }
      }

      componentDidMount() {
          this.loginSubscription = sessionStore.subscribe(LOGIN_EVENT, (state) => {
              // Do something useful with the Event Data
              this.setState({some: state.some});
          });
          // Register some method
          this.logoutSubscription = sessionStore.subscribe(LOGOUT_EVENT, this.logOutEvent().bind(this));
      }

      componentWillUnMount() {
          // Don't forget to release the subscription
          // Save time by using react bindings
          // See (react-flux-state)[https://github.com/cobuildlab/react-flux-state] 
          this.loginSubscription.unsubscribe();
          this.logoutSubscription.unsubscribe();
      }
  }

```

### 3) Define some actions that will trigger the event

```js
import Flux from 'flux-state';
import {LOGIN_EVENT, LOGIN_ERROR} from '/path/to/store';

const authenticateAction = async (username, password)=> {
      // Don't forget to Validate the data ex: username !=== undefined
      let dataToSave = {
          authenticated: true
      }
      
      try {
        await authenticate(username, password)
      }catch (e) {
          Flux.dispatchEvent(LOGIN_ERROR, e.message);
      }
      Flux.dispatchEvent(LOGIN_EVENT, dataToSave);
}

export {authenticateAction};
```

### 4) Glue all together using the Action from the View


```javascript
import React from 'react';
import {authenticateAction} from 'path/to/action';
import {sessionStore, LOGIN_EVENT, LOGOUT_EVENT, SESSION_EVENT } from '/path/to/store';

export class View extends React.Component {
      constructor(){
          super();
      }

      componentDidMount() {
          const me = this;
          this.loginSubscription = sessionStore.subscribe(LOGIN_EVENT, (state) => {
              // Do something useful with the Event Data
              me.userName = state.user.name;
          });
          // Register some method
          this.logoutSubscription = sessionStore.subscribe(LOGOUT_EVENT, this.logOutEvent().bind(this));
      }

      logOutEvent(state){
        //DO something with the state or the state of the Store
        const storeState = sessionStore.getState(SESSION_EVENT);
      }

      componentWillUnMount() {
          // Don't forget to release the subscription
          this.loginSubscription.unsubscribe();
          this.logoutSubscription.unsubscribe();
      }

      login(){
        authenticateAction(this.state.username, this.state.password);
      }

  }

```
ChangeLog:

#### v 1.1.*

- Now `Flux.dispatch` uses setTimeout to avoid dispatching in the middle of a Dispatch

#### v 1.0.1

- `store.getState()` returns a clone of the state object
- Migrated to `@cobuildlab/flux-state`

#### v 0.0.3

- Add a ```clearState``` method for the Store to set all Values to null
- Add a parameter to the subscription, to request the last value of the Event if wanted
- Add a Helper React View, to subscribe and unsubscribe to the Store wanted


## Contributors

- Alejandro Sanchez [github.com/alesanchezr](https://github.com/alesanchezr) [alesanchezr.com](http://alesanchezr.com)
- Angel Lacret [github.com/alacret](https://github.com/alacret)
- Allan Thinks [github.com/alanthinks](https://github.com/alanthinks)
