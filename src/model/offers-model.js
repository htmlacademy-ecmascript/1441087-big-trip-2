import Observable from '../framework/observable.js';
import {UpdateType} from '../utils/common-utils.js';


export default class OffersModel extends Observable {
  #offersApiService = null;
  #offersPacks = [];
  #isLoading = true;

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

  getOffersPackByType(type) {
    return this.#offersPacks.find((offersPack) => offersPack.type === type);
  }
}
