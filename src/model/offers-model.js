import {UpdateType} from '../const.js';
import Observable from '../framework/observable.js';


export default class OffersModel extends Observable {
  #offersApiService = null;
  #offersPacks = [];
  #isLoading = true;
  #isError = false;

  constructor({offersApiService}) {
    super();
    this.#offersApiService = offersApiService;
  }

  async init() {
    try {
      const offersPacks = await this.#offersApiService.offers;
      this.#offersPacks = offersPacks;
    } catch(err) {
      this.#offersPacks = [];
      this.#isError = true;
    }

    this.#isLoading = false;
    this._notify(UpdateType.INIT);
  }

  get offersPacks() {
    return this.#offersPacks;
  }

  get isLoading() {
    return this.#isLoading;
  }

  get isError() {
    return this.#isError;
  }

  getOffersPackByType(type) {
    return this.#offersPacks.find((offersPack) => offersPack.type === type);
  }

  getEventCheckedOffers(event) {
    const offersPack = this.getOffersPackByType(event.type);
    return offersPack.offers.filter((offer) => event.offers.includes(offer.id));
  }
}
