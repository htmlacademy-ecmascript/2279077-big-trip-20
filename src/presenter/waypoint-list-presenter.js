import { render, remove ,replace } from '../framework/render.js';
import WaypointListView from '../view/waypoint-list-view.js';
import PointItemView from '../view/point-item-view.js';
import PointEditView from '../view/point-edit-view.js';

const TASK_COUNT_PER_STEP = 8;
export default class TripPresenter {
  #waypointListContainer = null;
  #pointsModel = null;

  #waypointListComponent = new WaypointListView();
  #pointEditComponent = null;

  #listPoints = [];
  #offers = [];
  #destinations = [];

  #renderedPointsCount = TASK_COUNT_PER_STEP;

  constructor ({ waypointListContainer, pointsModel }) {
    this.#waypointListContainer = waypointListContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];
    this.#offers = this.#pointsModel.offers;
    this.#destinations = this.#pointsModel.destinations;
    render(this.#waypointListComponent, this.#waypointListContainer);

    for (let i = 0; i < Math.min(this.#listPoints.length, TASK_COUNT_PER_STEP); i++) {
      this.#renderPoint(this.#listPoints[i], this.#offers, this.#destinations
      );
    }

    if (this.#listPoints.length > TASK_COUNT_PER_STEP) {
      this.#waypointListComponent = new PointEditView({
        buttonClick: this.#waypointListClick
      });
      render(this.#pointEditComponent(), this.#waypointListComponent.element);
    }
  }

  #waypointListClick = () => {
    this.#listPoints
      .slice(this.#renderedPointsCount, this.#renderedPointsCount + TASK_COUNT_PER_STEP)
      .forEach((point, offers, destinations) => this.#renderPoint(point, offers, destinations));
    this.#renderedPointsCount += TASK_COUNT_PER_STEP;
    if (this.#renderedPointsCount >= this.#listPoints.length) {
      remove(this.#pointEditComponent);
    }
  };

  #renderPoint(point, offers, destinations) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const pointComponent = new PointItemView({
      point, offers, destinations,
      onRollupButtonClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    const pointEditComponent = new PointEditView({
      point, offers, destinations,
      onEditFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#waypointListComponent.element);
  }
}
