import {mockDestinations} from '../mock/mock-destinations.js';
import {mockEvents} from '../mock/mock-events.js';
import {mockOffers} from '../mock/mock-offers.js';


export default class EventsModel {
  constructor() {
    this.destinations = [];
    this.events = [];
    this.offers = [];
  }

  init() {
    this.destinations = mockDestinations;
    this.events = mockEvents;
    this.offers = mockOffers;

  }

  getDestinations() {
    return this.destinations;
  }

  getEvents() {
    return this.events;
  }

  getOffers() {
    return this.offers;
  }

}
