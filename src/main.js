import { render } from './render.js';
import EventsModel from './model/events-model.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
// import './debug.js';

const pageHeaderElement = document.querySelector('.page-header');
const filtersElement = pageHeaderElement.querySelector('.trip-controls__filters');
const pageMainElement = document.querySelector('.page-main');
const pageBodyContainerElement = pageMainElement.querySelector('.page-body__container');

const eventsModel = new EventsModel();
const tripPresenter = new TripPresenter({
  tripContainer: pageBodyContainerElement,
  eventsModel,
});


render(new FilterView, filtersElement);


tripPresenter.init();
