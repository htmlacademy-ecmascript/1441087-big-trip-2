import {render, RenderPosition} from '../framework/render.js';
import {updateItem} from '../utils/common-utils.js';
import EventPresenter from '../presenter/event-presenter.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoEventView from '../view/no-event-view.js';


export default class TripPresenter {
  #tripContainer = null;

  #destinationsModel = null;
  #eventsModel = null;
  #offersModel = null;

  #tripComponent = new TripView();
  #sortComponent = new SortView();
  #eventListComponent = new EventListView();
  #noEventComponent = new NoEventView();

  #events = [];
  #eventPresenters = new Map();

  constructor({tripContainer, destinationsModel, eventsModel, offersModel}) {
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
  }

  init () {
    this.#events = [...this.#eventsModel.events];
    this.#renderTrip();
  }

  #onEventUpdate = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init({
      event: updatedEvent,
      currentDestination: this.#destinationsModel.getDestinationById(updatedEvent.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(updatedEvent.type)
    });
  };

  #renderNoEvent() {
    render(this.#noEventComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    render(this.#sortComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent.element,
      allDestinations: this.#destinationsModel.destinations,
      allOffersPacks: this.#offersModel.offersPacks,
      onEventUpdate: this.#onEventUpdate
    });

    eventPresenter.init({
      event: event,
      currentDestination: this.#destinationsModel.getDestinationById(event.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(event.type)
    });

    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#tripComponent.element);

    for (let i = 0; i < this.#events.length; i++) {
      this.#renderEvent(this.#events[i]);
    }
  }

  #renderTrip() {
    render(this.#tripComponent, this.#tripContainer);

    if(this.#events.length === 0) {
      this.#renderNoEvent();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
  }
}
