const test = require("../../dist/flux-state");
console.log(test);
console.log(test[0]);
console.log(typeof test.FluxStore);
const FluxStore = require("../../dist/flux-state").FluxStore;
const dispatchEvent = require("../../dist/flux-state").dispatchEvent;

const EVENT_NAME = "SOMETHING_HAPPEND";
const OTHER_EVENT_NAME = "SOMETHING_ELSE_HAPPEND";
let testState = undefined;

//
class TestStore extends FluxStore {
    constructor() {
        super();
        this.addEvent(EVENT_NAME, (state) => {
            // Transform the state
            return Object.assign(state, {"key": "value"})
        });
        this.addEvent(OTHER_EVENT_NAME);
    }
}

const testStore = new TestStore();

class TestView {

    componentWillMount() {
        this.eventSubscription = testStore.subscribe(EVENT_NAME, (state) => {
            testState = state;
        });
    }

    componentWillUnMount() {
        this.eventSubscription.unsubscribe();
    }
}

const testView = new TestView();
testView.componentWillMount();

const testAction = () => {
    dispatchEvent(EVENT_NAME, {"foo": "bar"});
};
//
testAction();
const storeValue = testStore.getState();
const eventValue = testStore.getState(EVENT_NAME);


test('testState should throw error for eventName non existen', () => {
    expect(() => {
        testStore.getState("SOME other thing that does not exists");
    }).toThrow();
});

test('testState should containt eventData', () => {
    console.log(eventValue);
    expect(eventValue).toEqual(expect.objectContaining({
        foo: expect.any(String)
    }));
});

test('testState should containt eventData', () => {
    console.log(testState);
    expect(testState).toEqual(expect.objectContaining({
        foo: expect.any(String)
    }));
});

test('testState should containt trasnformer Data', () => {
    console.log(testState);
    expect(testState).toEqual(expect.objectContaining({
        key: expect.any(String)
    }));
});

test('value should containt all events Data', () => {
    console.log(storeValue);
    expect(storeValue).toEqual(expect.objectContaining({
        [EVENT_NAME]: expect.any(Object)
    }));
});

test('Event Name must Exist', () => {
    expect(() => {
        dispatchEvent("SOME EVENT THAT DOES NOT EXISTS", {})
    }).toThrow();
});

test('InValid Event Name ', () => {
    expect(() => {
        dispatchEvent("", {})
    }).toThrow();
});

test('InValid Event Name ', () => {
    expect(() => {
        dispatchEvent(null, {})
    }).toThrow();
});

test('InValid Event Name ', () => {
    expect(() => {
        dispatchEvent(undefined, {})
    }).toThrow();
});

test('InValid Event Name ', () => {
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

test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", {});
    }).toThrow();
});


test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", 123);
    }).toThrow();
});

test('InValid Transformers', () => {
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

test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", [() => undefined]);
    }).toThrow();
});

test('InValid Transformers', () => {
    expect(() => {
        new Event("EVENT", [() => null]);
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
        testStore.subscribe("SOME OTHER EVENT NAME THAT DOES NOT EXISTS", () => {});
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
test('Should call the subscriber inmediatly', () => {
    testStore.subscribe(EVENT_NAME, (data) => {
        console.log("EUREKA");
        expect(data).toEqual(expect.objectContaining({
            "foo": expect.any(String)
        }));
    }, true);
});


testView.componentWillUnMount();



class TestReactView extends View {

    constructor(props){
        super(props);
        this.subscribe(testStore, EVENT_NAME, (data) => {
            console.log("EUREKA 2");
        })
    }
}

const reactView = new TestReactView();
console.log("REACT",reactView.subscriptions);
console.log("REACT",reactView.toBeSubscribed);
console.log("REACT",reactView.hasBeenUnmounted);
reactView.componentDidMount();
console.log("REACT",reactView.subscriptions);
console.log("REACT",reactView.toBeSubscribed);
console.log("REACT",reactView.hasBeenUnmounted);
reactView.componentWillUnmount();
console.log("REACT",reactView.subscriptions);
console.log("REACT",reactView.toBeSubscribed);
console.log("REACT",reactView.hasBeenUnmounted);
