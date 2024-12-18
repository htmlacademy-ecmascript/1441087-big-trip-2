import { render } from '../render.js';
import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';


export default class BoardPresenter {
  boardComponent = new BoardView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init () {
    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
  }
}
