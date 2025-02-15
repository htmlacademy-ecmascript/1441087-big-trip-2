import {render, RenderPosition, remove} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #tripMainContainer = null;

  #destinationsModel = null;
  #eventsModel = null;
  #offersModel = null;

  #tripInfoComponent = null;

  constructor({tripMainContainer, destinationsModel, eventsModel, offersModel}) {
    this.#tripMainContainer = tripMainContainer;
    this.#destinationsModel = destinationsModel;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;

    this.#destinationsModel.addObserver(this.#modelDestinationsHandler);
    this.#eventsModel.addObserver(this.#modelEventsHandler);
    this.#offersModel.addObserver(this.#modelOffersHandler);
  }

  init() {
    this.#renderTripInfo();
  }

  #modelDestinationsHandler = () => {
    this.#renderTripInfo();
  };

  #modelEventsHandler = () => {
    this.#clearTripInfo();
    this.#renderTripInfo();
  };

  #modelOffersHandler = () => {
    this.#renderTripInfo();
  };

  #renderTripInfo() {
    if(this.#eventsModel.isError ||
      this.#destinationsModel.isError ||
      this.#offersModel.isError) {
      return;
    }

    if (this.#eventsModel.isLoading ||
       this.#destinationsModel.isLoading ||
       this.#offersModel.isLoading) {
      return;
    }

    if(this.#eventsModel.events.length !== 0) {
      this.#tripInfoComponent = new TripInfoView({
        tripTotalCost: this.#getTripTotalCost(),
        tripTitle: this.#getTripTitle(),
      });

      render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
    }
  }

  #clearTripInfo() {
    remove(this.#tripInfoComponent);
  }

  #getTripTitle() {
    return 'Amsterdam &mdash; Chamonix &mdash; Geneva';
  }

  #getEventTotalCost(event) {
    const checkedOffers = this.#offersModel.getEventCheckedOffers(event);
    const offersTotalCost = checkedOffers.map((offer) => offer.price).reduce((sum, price) => (sum += price), 0);
    const eventTotalCost = event.basePrice + offersTotalCost;

    return eventTotalCost;
  }

  #getTripTotalCost() {
    let tripTotalCost = 0;

    this.#eventsModel.events.forEach((event) => {
      tripTotalCost += this.#getEventTotalCost(event);
    });

    return tripTotalCost;
  }
}
