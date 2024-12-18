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
