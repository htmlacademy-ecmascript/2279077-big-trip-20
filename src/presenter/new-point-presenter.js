import { UpdateType, UserAction } from '../const.js';
import { RenderPosition } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import { render, remove } from '../framework/render.js';
import { nanoid } from 'nanoid';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handlePointChange = null;
  #handleDestroy = null;

  #pointEditComponent = null;

  constructor({pointListContainer, onPointChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#handlePointChange = onPointChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView ({
      onEditFormSubmit: this.#editFormSubmit,
      onEditFormDelete: this.#editFormDelete
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null){
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #editFormSubmit = (point) => {
    this.#handlePointChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #editFormDelete = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
