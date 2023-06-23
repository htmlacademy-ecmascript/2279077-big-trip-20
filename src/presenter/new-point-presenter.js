import { UpdateType, UserAction } from '../const.js';
import { RenderPosition } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import { render, remove } from '../framework/render.js';

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

  init({destinations, offers}) {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView({
      destinations,
      offers,
      onEditFormSubmit: this.#editFormSubmit,
      onEditFormCancel: this.#editFormCancel,
      isNew: true,
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.BEFOREBEGIN);

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

  setSaving(){
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #editFormSubmit = (point) => {
    this.#handlePointChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #editFormCancel = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
