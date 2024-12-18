import { render } from '../render.js';
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EventCreateView from '../view/event-create-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventItemView from '../view/event-item-view.js';
import EventView from '../view/event-view.js';


export default class BoardPresenter {
  boardComponent = new BoardView();
  eventListComponent = new EventListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }


  init () {
    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
    render(this.eventListComponent, this.boardComponent.getElement());

    for (let i = 0; i < 3; i++) {
      const eventItem = new EventItemView();
      render(new EventView(), eventItem.getElement());

      if (i === 0) {
        render(new EventCreateView(), eventItem.getElement());
      }

      if (i === 1) {
        render(new EventEditView(), eventItem.getElement());
      }

      render(eventItem, this.eventListComponent.getElement());
    }
  }
}
