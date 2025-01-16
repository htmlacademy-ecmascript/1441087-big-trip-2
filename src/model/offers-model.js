import {mockOffersPacks} from '../mock/mock-offers-packs.js';


export default class OffersModel {
  constructor() {
    this.offers = [];
  }

  init() {
    this.offers = mockOffersPacks;
  }

  getEventOffersPack(event) {
    return this.offers.find((offer) => offer.type === event.type);
  }

  getEventOffersChecked(event) {
    const eventOffersPack = this.offers.find((offer) => offer.type === event.type);
    return eventOffersPack.offers.filter((offer) => event.offers.includes(offer.id));
  }
}
