import DestinationsModel from './model/destinations-model.js';
import EventsModel from './model/events-model.js';
import OffersModel from './model/offers-model.js';
import FiltersModel from'./model/filters-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';


const pageHeaderElement = document.querySelector('.page-header');
const filtersElement = pageHeaderElement.querySelector('.trip-controls__filters');
const pageMainElement = document.querySelector('.page-main');
const pageBodyContainerElement = pageMainElement.querySelector('.page-body__container');
const eventCreateElement = document.querySelector('.trip-main__event-add-btn');

const destinationsModel = new DestinationsModel();
const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const filtersModel = new FiltersModel();
const tripPresenter = new TripPresenter({
  tripContainer: pageBodyContainerElement,
  eventCreate: eventCreateElement,
  destinationsModel,
  eventsModel,
  offersModel,
  filtersModel
});
const filterPresenter = new FilterPresenter({
  filterContainer: filtersElement,
  filtersModel: filtersModel,
  eventsModel: eventsModel
});


destinationsModel.init();
eventsModel.init();
offersModel.init();

filterPresenter.init();
tripPresenter.init();
