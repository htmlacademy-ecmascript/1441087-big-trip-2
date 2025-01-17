import { render } from '../render.js';
import { getDefaultEvent, getIdGenerator } from '../utils.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventItemView from '../view/event-item-view.js';
import EventView from '../view/event-view.js';
import EventCreateView from '../view/event-create-view.js';
import EventEditView from '../view/event-edit-view.js';


const idGenerator = getIdGenerator();


export default class TripPresenter {
  tripComponent = null;
  eventListComponent = null;
  tripContainer = null;
  destinationsModel = null;
  eventsModel = null;
  offersModel = null;

  constructor({tripContainer, destinationsModel, eventsModel, offersModel}) {
    this.tripComponent = new TripView();
    this.eventListComponent = new EventListView();
    this.tripContainer = tripContainer;
    this.destinationsModel = destinationsModel;
    this.eventsModel = eventsModel;
    this.offersModel = offersModel;
  }


  init () {
    this.defaultEvent = getDefaultEvent();
    this.tripEvents = [...this.eventsModel.getAllEvents()];

    render(this.tripComponent, this.tripContainer);
    render(new SortView(), this.tripComponent.getElement());
    render(this.eventListComponent, this.tripComponent.getElement());

    for (let i = 0; i < this.tripEvents.length; i++) {
      const eventItem = new EventItemView();
      let event = this.tripEvents[i];

      // Этот switch нужен для того, чтобы показать в разметке все возможные варианты view.
      // Это временное решение, пока нет открытия форм создания и редактирования.
      switch (i) {
        case 0:
          event = this.defaultEvent;
          render(new EventCreateView({
            viewId: idGenerator(),
            event: this.defaultEvent,
            currentDestination: this.destinationsModel.getDestinationById(event.destination),
            currentOffersPack: this.offersModel.getOffersPackByType(event.type),
            allDestinations: this.destinationsModel.getAllDestinations(),
            allOffersPacks: this.offersModel.getAllOffersPacks(),
          }), eventItem.getElement());
          break;
        default:
          render(new EventView({
            viewId: idGenerator(),
            event,
            currentDestination: this.destinationsModel.getDestinationById(event.destination),
            currentOffersPack: this.offersModel.getOffersPackByType(event.type),
          }), eventItem.getElement());
          render(new EventEditView({
            viewId: idGenerator(),
            event,
            currentDestination: this.destinationsModel.getDestinationById(event.destination),
            currentOffersPack: this.offersModel.getOffersPackByType(event.type),
            allDestinations: this.destinationsModel.getAllDestinations(),
            allOffersPacks: this.offersModel.getAllOffersPacks(),
          }), eventItem.getElement());
      }
      render(eventItem, this.eventListComponent.getElement());
    }
  }
}
