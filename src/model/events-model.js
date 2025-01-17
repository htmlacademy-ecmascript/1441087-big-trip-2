import {mockEvents} from '../mock/mock-events.js';


export default class EventsModel {
  constructor() {
    this.events = [];
  }

  init() {
    this.events = mockEvents;
  }

  getAllEvents() {
    return this.events;
  }
}
