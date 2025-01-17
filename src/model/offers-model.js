import {mockOffersPacks} from '../mock/mock-offers-packs.js';


export default class OffersModel {
  constructor() {
    this.offersPacks = [];
  }

  init() {
    this.offersPacks = mockOffersPacks;
  }

  getAllOffersPacks() {
    return this.offersPacks;
  }

  getOffersPackByType(type) {
    return this.offersPacks.find((offer) => offer.type === type);
  }

  getEventOffersChecked(event) {
    const eventOffersPack = this.offersPacks.find((offer) => offer.type === event.type);
    return eventOffersPack.offers.filter((offer) => event.offers.includes(offer.id));
  }
}
