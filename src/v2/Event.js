import utils from "./Util";
import {Subject} from 'rxjs';
import * as R from 'ramda';

// import {log} from '@cobuildlab/pure-logger';

class Event {
  /**
   * Creates a new event with a Name and some transformers
   * @param name The name of the Event
   * @param transformers The transformers functions
   * @throws an Error if the transformers are not an array
   * @throws an Error if the any if the transformers is not a function
   * @throws an Error if the transformers return an Undefined or Null value
   */
  constructor(name, transformers) {
    // log("flux-state:Event:constructor:", name);
    this.name = utils.validateText(name);
    this.transformers = [];
    this.value = null;
    this.subject = new Subject();

    if (typeof (transformers) === "undefined")
      return;

    if (!Array.isArray(transformers))
      throw new Error("Transformers must be an Array");

    if (transformers.length === 0)
      throw new Error("Transformers Array shouldn't be empty");

    transformers.forEach(transformer => {
      if (typeof (transformer) !== "function")
        throw new Error("All the transformers must be functions");
    });

    this.transformers = transformers;
  }

  /**
   * subscribe to this event notifications
   * @param subscriber The function no be executed when this events its fired
   * @return Subscription An object representing the subscription to the Event
   * @throws an Error if the subscriber is not a function
   */
  subscribe(subscriber) {
    // log("flux-state:Event:subscribeTo:", this.name);
    if (typeof (subscriber) !== "function")
      throw new Error("subscriber must be a function");
    return this.subject.subscribe(subscriber);
  }

  /**
   * It fires the occurrence of an event, execute every transformation and  every subscriber
   * @param eventData the data of the event
   */
  notify(eventData) {
    // log("flux-state:Event:notify:", this.name);
    if (this.subject.observers.length === 0) {
      console.warn(`No subscriber for ${this.name}, no side effects generated`);
    }

    let data = eventData;
    this.transformers.forEach(transformer => {
      data = transformer(data);
    });
    this.value = data;
    this.subject.next(R.clone(this.value));
  }

}


export default Event;
