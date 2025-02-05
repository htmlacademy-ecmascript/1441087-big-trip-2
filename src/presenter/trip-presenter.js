import {render, RenderPosition, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../utils/common-utils.js';
import {filter} from '../utils/filter-utils.js';
import EventPresenter from '../presenter/event-presenter.js';
import NewEventPresenter from '../presenter/new-event-presenter.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoEventView from '../view/no-event-view.js';
import EventSort from '../utils/sort-utils.js';


export default class TripPresenter {
  #tripContainer = null;

  #tripComponent = new TripView();
  #sortComponent = null;
  #eventListComponent = new EventListView();
  #noEventComponent = null;

  #eventPresenters = new Map();
  #newEventPresenter = null;

  #destinationsModel = null;
  #eventsModel = null;
  #offersModel = null;
  #filtersModel = null;

  #currentSortType = null;
  #currentFilterType = null;

  constructor({tripContainer, destinationsModel, eventsModel, offersModel, filtersModel, onNewEventDestroy}) {
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#filtersModel = filtersModel;

    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#eventListComponent.element,
      destinationsModel: destinationsModel,
      eventsModel: eventsModel,
      offersModel: offersModel,
      onEventUpdate: this.#handleViewAction,
      onDestroy: onNewEventDestroy
    });

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);

    this.#currentSortType = EventSort.defaultSortType;
    this.#currentFilterType = filtersModel.defaultFilterType;
  }

  get events () {
    this.#currentFilterType = this.#filtersModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#currentFilterType](events);

    EventSort.sortEvents(this.#currentSortType, filteredEvents);

    return filteredEvents;
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

  createEvent() {
    this.#currentSortType = EventSort.defaultSortType;
    this.#filtersModel.setFilter(UpdateType.MAJOR, this.#filtersModel.defaultFilterType);
    this.#newEventPresenter.init();
  }

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
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
      eventTypes: this.#eventsModel.eventTypes,
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
    this.#noEventComponent = new NoEventView({
      filterType: this.#currentFilterType
    });

    render(this.#noEventComponent, this.#tripComponent.element, RenderPosition.BEFOREEND);
  }

  #clearTrip({resetSortType = false} = {}) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);

    if(this.#noEventComponent) {
      remove(this.#noEventComponent);
    }

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
