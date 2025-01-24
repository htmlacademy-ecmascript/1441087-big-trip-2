import {render, RenderPosition} from '../framework/render.js';
import {updateItem} from '../utils/common-utils.js';
import {sortEventDay, sortEventDuration, sortEventPrice} from '../utils/sort-utils.js';
import {sortTypes} from '../const.js';
import EventPresenter from '../presenter/event-presenter.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoEventView from '../view/no-event-view.js';


export default class TripPresenter {
  #tripContainer = null;

  #tripComponent = new TripView();
  #sortComponent = null;
  #eventListComponent = new EventListView();
  #noEventComponent = new NoEventView();

  #events = [];
  #sourcedEvents = [];
  #eventPresenters = new Map();
  #destinationsModel = null;
  #eventsModel = null;
  #offersModel = null;

  #currentSortType = sortTypes.find((sortType) => sortType.isDefault === true).name;

  constructor({tripContainer, destinationsModel, eventsModel, offersModel}) {
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
  }

  init () {
    this.#events = [...this.#eventsModel.events];
    this.#sourcedEvents = [...this.#eventsModel.events];
    this.#renderTrip();
  }

  #onModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #onEventUpdate = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#sourcedEvents = updateItem(this.#events, updatedEvent);

    this.#eventPresenters.get(updatedEvent.id).init({
      event: updatedEvent,
      currentDestination: this.#destinationsModel.getDestinationById(updatedEvent.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(updatedEvent.type)
    });
  };

  #sortEvents(sortType) {
    switch (sortType) {
      case 'day':
        this.#events.sort(sortEventDay);
        break;
      case 'time':
        this.#events.sort(sortEventDuration);
        break;
      case 'price':
        this.#events.sort(sortEventPrice);
        break;
      default:
        this.#events = [...this.#sourcedEvents];
    }

    this.#currentSortType = sortType;
  }

  #onSortTypeChangeClick = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortEvents(sortType);
    this.#clearEventList();
    this.#renderEventList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChangeClick: this.#onSortTypeChangeClick
    });
    render(this.#sortComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent.element,
      allDestinations: this.#destinationsModel.destinations,
      allOffersPacks: this.#offersModel.offersPacks,
      onEventUpdate: this.#onEventUpdate,
      onModeChange: this.#onModeChange
    });

    eventPresenter.init({
      event: event,
      currentDestination: this.#destinationsModel.getDestinationById(event.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(event.type)
    });

    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderEvents() {
    for (let i = 0; i < this.#events.length; i++) {
      this.#renderEvent(this.#events[i]);
    }
  }

  #renderNoEvents() {
    render(this.#noEventComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#tripComponent.element);

    this.#renderEvents();
  }

  #renderTrip() {
    render(this.#tripComponent, this.#tripContainer);

    if(this.#events.length === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
  }
}
