import { createMockPoints, getRandomDestinations } from '../mock/data-structure';
import { OFFERS, POINTS_COUNT } from '../const';


export default class PointsModel {
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

}
