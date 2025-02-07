import Observable from '../framework/observable.js';
import {UpdateType} from '../utils/common-utils.js';


export default class DestinationsModel extends Observable {
  #destinationsApiService = null;
  #destinations = [];

  constructor({destinationsApiService}) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  async init() {
    try {
      const destinations = await this.#destinationsApiService.destinations;
      this.#destinations = destinations;
    } catch(err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
