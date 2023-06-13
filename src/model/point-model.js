import Observable from '../framework/observable';
import { createMockPoints, getRandomDestinations } from '../mock/data-structure';
import { OFFERS, POINTS_COUNT } from '../const';

export default class PointsModel extends Observable {
  #destinations = getRandomDestinations(6);
  #offers = OFFERS;
  #points = createMockPoints(POINTS_COUNT);

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get points() {
    return this.#points;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points.unshift(update);

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points.splice(index, 1);

    this._notify(updateType);
  }
}
