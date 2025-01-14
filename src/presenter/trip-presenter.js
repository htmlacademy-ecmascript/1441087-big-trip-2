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

  constructor({tripContainer}) {
    this.tripComponent = new TripView();
    this.eventListComponent = new EventListView();
    this.tripContainer = tripContainer;
  }


  init () {
    render(this.tripComponent, this.tripContainer);
    render(new SortView(), this.tripComponent.getElement());
    render(this.eventListComponent, this.tripComponent.getElement());

    for (let i = 0; i < 5; i++) {
      const eventItem = new EventItemView();

      // Этот switch нужен для того, чтобы показать в разметке оба
      // варианта формы редактирования.
      switch (i) {
        case 1:
          render(new EventCreateView(), eventItem.getElement());
          break;
        case 3:
          render(new EventEditView(), eventItem.getElement());
          break;
        default:
          render(new EventView(), eventItem.getElement());
      }

      render(eventItem, this.eventListComponent.getElement());
    }
  }
}
