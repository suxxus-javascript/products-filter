/**
 *
 */
class EventBus {
  /**
   * initialize event list
   */
  constructor() {
    this.eventObject = {};
  }

  /**
   * publish event
   *
   * @param {string} eventName
   *
   */
  publish(eventName, ...args) {
    // Get all the callback functions of the current event
    const callbackList = this.eventObject[eventName];

    if (!callbackList) {
      console.warn(eventName + " not found!");
    } else {
      // execute each callback function
      for (const callback of callbackList) {
        callback(...args);
      }
    }
  }

  /**
   * Subscribe to events
   *
   * @param {string} eventName
   * @param {function} callback
   */
  subscribe(eventName, callback) {
    // initialize this event
    if (!this.eventObject[eventName]) {
      this.eventObject[eventName] = [];
    }

    // store the callback function of the subscriber
    this.eventObject[eventName].push(callback);
  }
}

const bus = new EventBus();

export default bus;
