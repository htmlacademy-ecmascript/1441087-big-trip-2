import {render, RenderPosition, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import EventPresenter from '../presenter/event-presenter.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoEventView from '../view/no-event-view.js';
import EventSort from '../utils/sort-utils.js';
import EventCreateView from '../view/event-create-view.js';


export default class TripPresenter {
  #tripContainer = null;
  #eventCreate = null;

  #tripComponent = new TripView();
  #sortComponent = null;
  #eventListComponent = new EventListView();
  #noEventComponent = new NoEventView();

  #eventPresenters = new Map();
  #destinationsModel = null;
  #eventsModel = null;
  #offersModel = null;

  #currentSortType = EventSort.defaultSortType;

  constructor({tripContainer, eventCreate, destinationsModel, eventsModel, offersModel}) {
    this.#tripContainer = tripContainer;
    this.#eventCreate = eventCreate;
    this.#destinationsModel = destinationsModel;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);

    this.#eventCreate.addEventListener('click', this.#onEventCreateClick);
  }

  get events () {
    const events = [...this.#eventsModel.events];

    EventSort.sortEvents(this.#currentSortType, events);

    return events;
  }

  get destinations () {
    return this.#destinationsModel.destinations;
  }

  get offersPacks () {
    return this.#offersModel.offersPacks;
  }

  init () {
    this.#renderTrip();
  }

  #onEventCreateClick = () => {
    const defaultEvent = this.#eventsModel.defaultEvent;
    const eventCreateView = new EventCreateView({
      event: defaultEvent,
      currentDestination: this.#destinationsModel.getDestinationById(defaultEvent.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(defaultEvent.type),
      allDestinations:  this.#destinationsModel.destinations,
      allOffersPacks: this.#offersModel.offersPacks,
    });
    render(eventCreateView, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init({
          event: data,
          currentDestination: this.#destinationsModel.getDestinationById(data.destination),
          currentOffersPack: this.#offersModel.getOffersPackByType(data.type)
        });
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
    }
  };

  #onSortTypeChangeClick = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      sortTypes: EventSort.sortTypes,
      currentSortType: this.#currentSortType,
      onSortTypeChangeClick: this.#onSortTypeChangeClick
    });
    render(this.#sortComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent.element,
      allDestinations: this.#destinationsModel.destinations,
      allOffersPacks: this.#offersModel.offersPacks,
      onEventUpdate: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    eventPresenter.init({
      event: event,
      currentDestination: this.#destinationsModel.getDestinationById(event.destination),
      currentOffersPack: this.#offersModel.getOffersPackByType(event.type)
    });

    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderEvents(events) {
    events.forEach((event) => this.#renderEvent(event));
  }

  #renderNoEvents() {
    render(this.#noEventComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearTrip({resetSortType = false} = {}) {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noEventComponent);

    if(resetSortType) {
      this.#currentSortType = EventSort.defaultSortType;
    }
  }

  #renderTrip() {
    render(this.#tripComponent, this.#tripContainer);

    if(this.events.length === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    render(this.#eventListComponent, this.#tripComponent.element);
    this.#renderEvents(this.events);
  }
}
