import { remove, render, replace } from '../framework/render.js';
import { UserAction, UpdateType, Mode } from '../const.js';
import PointItemView from '../view/point-item-view.js';
import PointEditView from '../view/point-edit-view.js';
import { isDatesEqual } from '../sort-util.js';

export default class PointPresenter {
  #handlePointChange = null;
  #handleModeChange = null;

  #pointListContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;

  #destinations = null;
  #offers = null;
  #point = null;
  #mode = Mode.DEFAULT;

  constructor({ pointListContainer, onPointChange, onModeChange }) {
    this.#pointListContainer = pointListContainer;
    this.#handlePointChange = onPointChange;
    this.#handleModeChange = onModeChange;
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

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleFavoriteClick = () => {
    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #buttonClick = () => {
    this.#replacePointToForm();
  };

  #editFormDelete = (point) => {
    this.#handlePointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #editFormSubmit = (update) => {
    const isMinorUpdate = isDatesEqual(this.#point.dateTo, update.dateTo);

    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate
        ? UpdateType.PATCH
        : UpdateType.MINOR,
      update,
    );
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #editFormCancel = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }
}
