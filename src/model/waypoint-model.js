import { createMockPoints, getRandomDestination } from '../mock/data-structure';
import { Offers, POINTS_COUNT } from '../const';


export default class PointsModel {
  points = createMockPoints(POINTS_COUNT);
  offers = Offers;
  destination = getRandomDestination();

  getPoints() {
    return this.points;
  }
}
