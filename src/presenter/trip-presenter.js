import { render } from '../render.js';
import TripView from '../view/trip-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventCreateView from '../view/event-create-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventItemView from '../view/event-item-view.js';
import EventView from '../view/event-view.js';


export default class TripPresenter {
  tripComponent = null;
  eventListComponent = null;

  constructor({tripContainer, eventsModel}) {
    this.tripComponent = new TripView();
    this.eventListComponent = new EventListView();
    this.tripContainer = tripContainer;
    this.eventsModel = eventsModel;
  }


  init () {
    this.tripEvents = [...this.eventsModel.getEvents()];

    render(this.tripComponent, this.tripContainer);
    render(new SortView(), this.tripComponent.getElement());
    render(this.eventListComponent, this.tripComponent.getElement());

    for (let i = 0; i < this.tripEvents.length; i++) {
      const eventItem = new EventItemView();

      // Этот switch нужен для того, чтобы показать в разметке оба
      // варианта формы редактирования.
      switch (i) {
        case 1:
          render(new EventCreateView({event: this.tripEvents[i]}), eventItem.getElement());
          break;
        case 3:
          render(new EventEditView({event: this.tripEvents[i]}), eventItem.getElement());
          break;
        default:
          render(new EventView({event: this.tripEvents[i]}), eventItem.getElement());
      }

      render(eventItem, this.eventListComponent.getElement());
    }
  }
}
