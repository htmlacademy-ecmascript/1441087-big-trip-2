import {mockDestinations} from '../mock/mock-destinations.js';
import {mockEvents} from '../mock/mock-events.js';
import {mockOffersPacks} from '../mock/mock-offers-packs.js';


export default class EventsModel {
  constructor() {
    this.destinations = [];
    this.events = [];
    this.offers = [];
  }

  init() {
    this.destinations = mockDestinations;
    this.events = mockEvents;
    this.offers = mockOffersPacks;
  }

  getAllDestinations() {
    return this.destinations;
  }

  getAllEvents() {
    return this.events;
  }

  getEventDestination(event) {
    return this.destinations.find((destination) => destination.id === event.destination);
  }

  getEventOffersPack(event) {
    return this.offers.find((offer) => offer.type === event.type);
  }

  getEventOffersChecked(event) {
    const eventOffersPack = this.offers.find((offer) => offer.type === event.type);
    return eventOffersPack.offers.filter((offer) => event.offers.includes(offer.id));
  }
}
