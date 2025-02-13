import {render} from './framework/render.js';
import DestinationsModel from './model/destinations-model.js';
import EventsModel from './model/events-model.js';
import OffersModel from './model/offers-model.js';
import FiltersModel from'./model/filters-model.js';
import NewEventButtonView from './view/new-event-button-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import EventsApiService from './service/events-api-service.js';
import DestinationsApiService from './service/destinations-api-service.js';
import OffersApiService from './service/offers-api-service.js';


const AUTHORIZATION = 'Basic FortySix&2';
const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';


const pageHeaderElement = document.querySelector('.page-header');
const filtersElement = pageHeaderElement.querySelector('.trip-controls__filters');
const pageMainElement = document.querySelector('.page-main');
const tripMainElement = document.querySelector('.trip-main');
const pageBodyContainerElement = pageMainElement.querySelector('.page-body__container');

const destinationsModel = new DestinationsModel({
  destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION)
});
const eventsModel = new EventsModel({
  eventsApiService: new EventsApiService(END_POINT, AUTHORIZATION)
});
const offersModel = new OffersModel({
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION)
});
const filtersModel = new FiltersModel();
const tripPresenter = new TripPresenter({
  tripContainer: pageBodyContainerElement,
  destinationsModel,
  eventsModel,
  offersModel,
  filtersModel,
  handleNewEventClose: newEventCloseHandler
});
const filterPresenter = new FilterPresenter({
  filterContainer: filtersElement,
  filtersModel: filtersModel,
  eventsModel: eventsModel
});


const newEventButtonComponent = new NewEventButtonView({
  handleNewEventOpen: newEventOpenHandler
});

function newEventCloseHandler() {
  tripPresenter.closeCreateEvent();
  newEventButtonComponent.element.disabled = false;
}

function newEventOpenHandler() {
  tripPresenter.openCreateEvent();
  newEventButtonComponent.element.disabled = true;
}


destinationsModel.init();
offersModel.init();
eventsModel.init()
  .finally(() => {
    render(newEventButtonComponent, tripMainElement);
  });

filterPresenter.init();
tripPresenter.init();
