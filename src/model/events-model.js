import {mockEvents} from '../mock/mock-events.js';

const defaultEvent = {
  id: '',
  basePrice: '',
  dateFrom: new Date().setHours(0,0,0,0),
  dateTo: new Date().setHours(0,0,0,0),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight'
};


export default class EventsModel {
  #events = [];

  init() {
    this.#events = mockEvents;
  }

  getAllEvents() {
    return this.#events;
  }

  getDefaultEvent() {
    return structuredClone(defaultEvent);
  }
}
