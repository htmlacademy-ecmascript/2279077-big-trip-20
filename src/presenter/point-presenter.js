import { remove, render, replace } from '../framework/render.js';
import { UserAction, UpdateType } from '../const.js';
import PointItemView from '../view/point-item-view.js';
import PointEditView from '../view/point-edit-view.js';
import { isDatesEqual } from '../sort-util.js';

export default class PointPresenter {
  #pointListContainer = null;
  #handlePointChange = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #destinations = null;
  #offers = null;
  #point = null;

  constructor({ pointListContainer, onPointChange }) {
    this.#pointListContainer = pointListContainer;
    this.#handlePointChange = onPointChange;
  }

  init(destinations, offers, point) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointItemView({
      destinations: this.#destinations,
      offers: this.#offers,
      point: this.#point,

      onRollupButtonClick: this.#buttonClick,
      onFavoriteButtonClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView({
      destinations: this.#destinations,
      offers: this.#offers,
      point: this.#point,

      onEditFormSubmit: this.#editFormSubmit,
      onEditFormCancel: this.#editFormCancel,
      onEditFormDelete: this.#editFormDelete
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#pointListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointListContainer.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #buttonClick = () => {
    this.#replacePointToForm();
  };

  #handleFavoriteClick = () => {
    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #editFormSubmit = (update) => {
    const isMinorUpdate = !isDatesEqual(this.#point.dateFrom, update.dateFrom);

    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate
        ? UpdateType.PATCH
        : UpdateType.MINOR,
      update,
    );
    this.#replaceFormToPoint();
  };

  #editFormDelete = (point) => {
    this.#handlePointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #editFormCancel = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };
}
