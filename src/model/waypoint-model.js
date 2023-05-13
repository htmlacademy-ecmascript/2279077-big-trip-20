import { createMockPoints, getRandomDestinations } from '../mock/data-structure';
import { OFFERS, POINTS_COUNT } from '../const';


export default class PointsModel {
  points = createMockPoints(POINTS_COUNT);
  offers = OFFERS;
  destinations = getRandomDestinations();

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
