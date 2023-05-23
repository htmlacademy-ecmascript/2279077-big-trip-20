import { createMockPoints, getRandomDestinations } from '../mock/data-structure';
import { OFFERS, POINTS_COUNT } from '../const';


export default class PointsModel {
  #points = createMockPoints(POINTS_COUNT);
  #offers = OFFERS;
  #destinations = getRandomDestinations(6);

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
