import {mockPoints} from '../mock/mock-points.js';


export default class EventsModel {
  events = mockPoints;

  getEvents() {
    return this.events;
  }
}
