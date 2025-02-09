import {render, RenderPosition, remove} from '../framework/render.js';
import {UserAction, UpdateType} from '../utils/common-utils.js';
import EventSort from '../utils/sort-utils.js';
import EventPresenter from '../presenter/event-presenter.js';
import NewEventPresenter from '../presenter/new-event-presenter.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoEventView from '../view/no-event-view.js';
import LoadingView from '../view/loading-view.js';


export default class TripPresenter {
  #tripContainer = null;

  #tripComponent = new TripView();
  #sortComponent = null;
  #eventListComponent = new EventListView();
  #noEventComponent = null;
  #loadingComponent = new LoadingView();

  #eventPresenters = new Map();
  #newEventPresenter = null;

  #destinationsModel = null;
  #eventsModel = null;
  #offersModel = null;
  #filtersModel = null;

  #currentSortType = null;
  #currentFilterType = null;

  constructor({
    tripContainer,
    destinationsModel,
    eventsModel,
    offersModel,
    filtersModel,
    handleNewEventClose
  }){
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
      handleEventUpdate: this.#viewActionHandler,
      handleNewEventClose: handleNewEventClose
    });

    this.#eventsModel.addObserver(this.#modelEventsHandler);
    this.#destinationsModel.addObserver(this.#modelDestinationsHandler);
    this.#offersModel.addObserver(this.#modelOffersHandler);
    this.#filtersModel.addObserver(this.#modelEventsHandler);

    this.#currentSortType = EventSort.defaultSortType;
    this.#currentFilterType = this.#filtersModel.filterType;
  }

  get events () {
    this.#currentFilterType = this.#filtersModel.filterType;
    const events = this.#eventsModel.events;
    const filteredEvents = this.#filtersModel.filterMethods[this.#currentFilterType](events);

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
    render(this.#eventListComponent, this.#tripComponent.element);
    this.#renderTrip();
  }

  openCreateEvent() {
    this.#currentSortType = EventSort.defaultSortType;
    this.#filtersModel.setFilter(UpdateType.MAJOR, this.#filtersModel.defaultFilterType);
    this.#newEventPresenter.init();
  }

  #modeChangeHandler = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #viewActionHandler = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch(err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }
  };

  #modelEventsHandler = (updateType, data) => {
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
      case UpdateType.INIT:
        this.#tryRenderTrip();
        break;
    }
  };

  #modelDestinationsHandler = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#tryRenderTrip();
        break;
    }
  };

  #modelOffersHandler = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#tryRenderTrip();
        break;
    }
  };

  #sortClickHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      sortSettings: EventSort.sortSettings,
      currentSortType: this.#currentSortType,
      handleSortClick: this.#sortClickHandler
    });
    render(this.#sortComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent.element,
      allDestinations: this.#destinationsModel.destinations,
      allOffersPacks: this.#offersModel.offersPacks,
      eventTypes: this.#eventsModel.eventTypes,
      handleViewAction: this.#viewActionHandler,
      handleModeChange: this.#modeChangeHandler
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

  #renderLoading() {
    render(this.#loadingComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderNoEvents() {
    this.#noEventComponent = new NoEventView({
      noEventMessage: this.#filtersModel.getnoEventMessage(this.#currentFilterType)
    });

    render(this.#noEventComponent, this.#tripComponent.element, RenderPosition.BEFOREEND);
  }

  #tryRenderTrip(){
    if(!this.#eventsModel.isLoading &&
       !this.#destinationsModel.isLoading &&
       !this.#offersModel.isLoading) {
      remove(this.#loadingComponent);
      this.#renderTrip();
    }
  }

  #renderTrip() {
    render(this.#tripComponent, this.#tripContainer);

    if (this.#eventsModel.isLoading ||
        this.#destinationsModel.isLoading ||
        this.#offersModel.isLoading) {
      this.#renderLoading();
      return;
    }

    if(this.events.length === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    // render(this.#eventListComponent, this.#tripComponent.element);
    this.#renderEvents(this.events);
  }

  #clearTrip({resetSortType = false} = {}) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if(this.#noEventComponent) {
      remove(this.#noEventComponent);
    }

    if(resetSortType) {
      this.#currentSortType = EventSort.defaultSortType;
    }
  }
}
