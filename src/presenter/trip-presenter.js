import {render, RenderPosition} from '../framework/render.js';
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
      allOffersPacks: this.#offersModel.offersPacks
    });

    eventPresenter.init({
      event: event,
      currentDestination: this.#destinationsModel.getDestinationById(event.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(event.type)
    });
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
