import {Dispatcher} from 'flux';
import utils from "./Util";
import {log} from '@cobuildlab/pure-logger';

const __dispatch = new Dispatcher();

const handleDispatch = ({eventName, eventData}) => {
  // log("flux-state:index:handleDispatch:", eventName);
  let atLeastDispatchOneEvent = false;
  const notifyiablesEvents = [];
  allEvents.forEach(event => {
    if (event.name === eventName) {
      // Exploring setting this function on async under a promise
      // event.notify(eventData);
      notifyiablesEvents.push(event);
      atLeastDispatchOneEvent = true;
    }
  });

  if (!atLeastDispatchOneEvent)
    throw new Error(`No event: ${eventName} exists in the System`);

  const promise = new Promise((resolve) => {
    notifyiablesEvents.forEach(event => event.notify(eventData));
    resolve(notifyiablesEvents.map(event => event.name));
  });
  promise.then(eventNames => log(`flux-state:dispatched:`, eventNames));
  return promise;
};

__dispatch.register(handleDispatch);

/**
 * Dispatches an event to the Dispatching system
 * @param eventName The Name of the Event
 * @param eventData The data to be passed
 */
const dispatchEvent = (eventName, eventData) => {
  // log("flux-state:index:dispatchEvent:", eventName);
  utils.validateText(eventName);
  __dispatch.dispatch({eventName, eventData});
};

const allEvents = [];

export {allEvents, dispatchEvent};
