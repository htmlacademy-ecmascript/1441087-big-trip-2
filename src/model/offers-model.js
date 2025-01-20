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
    return this.offersPacks.find((offersPack) => offersPack.type === type);
  }
}
