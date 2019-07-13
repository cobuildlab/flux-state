import {Dispatcher} from 'flux';
import utils from "./Util";
import {log} from '@cobuildlab/pure-logger';

const __dispatch = new Dispatcher();

const handleDispatch = ({eventName, eventData}) => {
  // log("flux-state:index:handleDispatch:", eventName);
  let atLeastDispatchOneEvent = false;
  const notifiableEvents = [];
  allEvents.forEach(event => {
    if (event.name === eventName) {
      // Exploring setting this function on async under a promise
      // event.notify(eventData);
      notifiableEvents.push(event);
      atLeastDispatchOneEvent = true;
    }
  });

  if (!atLeastDispatchOneEvent)
    throw new Error(`No event: ${eventName} exists in the System`);

  setTimeout(() => {
    notifiableEvents.forEach(event => event.notify(eventData));
    log(`flux-state:dispatched:`, ...notifiableEvents.map(event => event.name));
  }, 5);
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
