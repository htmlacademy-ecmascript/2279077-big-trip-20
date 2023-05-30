import { remove, render, replace } from '../framework/render.js';

import PointItemView from '../view/point-item-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class PointPresenter {
  #waypointListContainer = null;
  #handlePointChange = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #offers = null;
  #destinations = null;

  constructor({ waypointListContainer, onPointChange }) {
    this.#waypointListContainer = waypointListContainer;
    this.#handlePointChange = onPointChange;
  }

  init(destinations, offers, point) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointItemView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onRollupButtonClick: this.#buttonClick,
      onFavoriteButtonClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onEditFormSubmit: this.#editFormSubmit,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#waypointListContainer);
      return;
    }

    // Проверка на наличие в DOM
    if (this.#waypointListContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#waypointListContainer.contains(prevPointEditComponent.element)) {
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
      this.#replaceFormToPoint();
    }
  };

  #buttonClick = () => {
    this.#replacePointToForm();
  };

  #handleFavoriteClick = () => {
    this.#handlePointChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #editFormSubmit = (point) => {
    this.#handlePointChange(point);
    this.#replaceFormToPoint();
  };
}
