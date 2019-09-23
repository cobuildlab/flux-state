import Flux from '../index';
import Event from '../v2/Event';

test('Everything should be ready to work', () => {
  console.log(Flux);
  expect(Flux).not.toBe(null);
  expect(Flux).not.toBe(undefined);
});


const EVENT_NAME = "SOMETHING_HAPPEN";
const OTHER_EVENT_NAME = "SOMETHING_ELSE_HAPPEN";
const NEW_FLUX_EVENT_NAME = "SOMETHING_NEW_HAPPEND";

//

class TestStore extends Flux.DashStore {
  constructor() {
    super(null);
    this.addEvent(EVENT_NAME, (state) => {
      // Transform the state
      return Object.assign(state, {"key": "value"})
    });
    this.addEvent(OTHER_EVENT_NAME);
    this.addFluxEvent({eventName: NEW_FLUX_EVENT_NAME, initialValue: 1});
  }
}

const testStore = new TestStore();
let testState = undefined;

class TestView {
  componentWillMount() {
    this.eventSubscription = testStore.subscribe(EVENT_NAME, (state) => {
      testState = state;
    });
  }
}

const testAction = () => {
  Flux.dispatchEvent(EVENT_NAME, {"foo": "bar"});
};

const testView = new TestView();
testView.componentWillMount();
testAction();
const storeValue = testStore.getState();
const eventValue = testStore.getState(EVENT_NAME);
const fluxEventValue = testStore.getState(NEW_FLUX_EVENT_NAME);


// TESTS
test('testStore should have an initial Value', () => {
  expect(fluxEventValue).toEqual(1);
});

test('testStore should throw error for eventName non existent', () => {
  expect(() => {
    testStore.getState("SOME other EVENT NAME that does not exists");
  }).toThrow();
});

test('testState should containt eventData', () => {
  console.log(eventValue);
  expect(eventValue).toEqual(expect.objectContaining({
    foo: expect.any(String)
  }));
});

test('testState should contain eventData', () => {
  console.log(testState);
  expect(testState).toEqual(expect.objectContaining({
    foo: expect.any(String)
  }));
});

test('testState should contain transformer Data', () => {
  console.log(testState);
  expect(testState).toEqual(expect.objectContaining({
    key: expect.any(String)
  }));
});
//
test('value should containt all events Data', () => {
  console.log(storeValue);
  expect(storeValue).toEqual(expect.objectContaining({
    [EVENT_NAME]: expect.any(Object)
  }));
});

test('Event Name must Exist', () => {
  expect(() => {
    Flux.dispatchEvent("SOME EVENT THAT DOES NOT EXISTS", {})
  }).toThrow();
});

test('InValid Event Name: dispatching a blank string', () => {
  expect(() => {
    Flux.dispatchEvent("", {})
  }).toThrow();
});

test('InValid Event Name: dispatching null ', () => {
  expect(() => {
    Flux.dispatchEvent(null, {})
  }).toThrow();
});

test('InValid Event Name: dispatching undefined ', () => {
  expect(() => {
    Flux.dispatchEvent(undefined, {})
  }).toThrow();
});

test('InValid Event Name: creating a blank name event ', () => {
  expect(() => {
    new Event("");
  }).toThrow();
});

test('InValid Event Name ', () => {
  expect(() => {
    new Event(null);
  }).toThrow();
});

test('InValid Event Name ', () => {
  expect(() => {
    new Event(undefined);
  }).toThrow();
});

test('InValid Transformers: not a function but an object', () => {
  expect(() => {
    new Event("EVENT", {});
  }).toThrow();
});

test('InValid Transformers: not a function but a number', () => {
  expect(() => {
    new Event("EVENT", 123);
  }).toThrow();
});

test('InValid Transformers: : not a function but an empty string', () => {
  expect(() => {
    new Event("EVENT", "");
  }).toThrow();
});

test('InValid Transformers', () => {
  expect(() => {
    new Event("EVENT", () => undefined);
  }).toThrow();
});

test('InValid Transformers', () => {
  expect(() => {
    new Event("EVENT", [""]);
  }).toThrow();
});

test('InValid Transformers', () => {
  expect(() => {
    new Event("EVENT", []);
  }).toThrow();
});

test('InValid Transformers', () => {
  expect(() => {
    new Event("EVENT", [123]);
  }).toThrow();
});

test('InValid Transformers', () => {
  expect(() => {
    new Event("EVENT", [{}]);
  }).toThrow();
});

test('InValid Subscriber', () => {
  expect(() => {
    const e = new Event("EVENT", [() => {
      return {"key": "value"}
    }]);
    e.subscribe(1)
  }).toThrow();
});

test('InValid Subscriber', () => {
  expect(() => {
    const e = new Event("EVENT", [() => {
      return {"key": "value"}
    }]);
    e.subscribe(null)
  }).toThrow();
});

test('InValid Subscriber', () => {
  expect(() => {
    const e = new Event("EVENT", [() => {
      return {"key": "value"}
    }]);
    e.subscribe("")
  }).toThrow();
});

test('InValid Subscriber', () => {
  expect(() => {
    const e = new Event("EVENT", [() => {
    }]);
    e.subscribe({})
  }).toThrow();
});

test('Valid Subscriber', () => {
  const e = new Event("EVENT", [() => {
    return {"key": "value"}
  }]);
  e.subscribe((data) => {
    expect(data).toEqual(expect.objectContaining({
      "key": expect.any(String)
    }));
  })
  e.notify({"foo": "bar"})
});

test('Valid and Warn notify', () => {
  const e = new Event("EVENT", [() => {
    return {"key": "value"}
  }]);
  e.notify({"foo": "bar"})
});

test('Valid Subscriber', () => {
  const e = new Event("EVENT");
  e.subscribe((data) => {
    expect(data).toEqual(expect.objectContaining({
      "foo": expect.any(String)
    }));
  })
  e.notify({"foo": "bar"})
});

test('InValid event on the FluxStore: Duplicated event Name', () => {
  expect(() => {
    testStore.addEvent(EVENT_NAME);
  }).toThrow();
});

test('InValid subscriber on the FluxStore: Subscriber must be a function', () => {
  expect(() => {
    testStore.subscribe(EVENT_NAME, 113);
  }).toThrow();
});

test('InValid subscriber on the FluxStore: Subscriber must be a function', () => {
  expect(() => {
    testStore.subscribe(EVENT_NAME, {});
  }).toThrow();
});

test('InValid subscriber on the FluxStore: Unknown event', () => {
  expect(() => {
    testStore.subscribe("SOME OTHER EVENT NAME THAT DOES NOT EXISTS");
  }).toThrow();
});

test('InValid subscriber on the FluxStore: Unknown event', () => {
  expect(() => {
    testStore.subscribe("SOME OTHER EVENT NAME THAT DOES NOT EXISTS", () => {
    });
  }).toThrow();
});


// CLEAR STORE
testAction();
testStore.clearState();
const anotherEeventValue = testStore.getState(EVENT_NAME);

test('testState should be null after clearing the FluxStore', () => {
  console.log(anotherEeventValue);
  expect(anotherEeventValue).toBe(null);
});


testAction();
test('Should call the subscriber immediately', () => {
  testStore.subscribe(EVENT_NAME, (data) => {
    console.log("EUREKA");
    expect(data).toEqual(expect.objectContaining({
      "foo": expect.any(String)
    }));
  }, true);
});
