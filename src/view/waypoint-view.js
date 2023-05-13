import { createElement } from '../render.js';
import dayjs from 'dayjs';
import { calculateDuration } from '../utils.js';

function createWaypointItemTemplate(point, allOffers, allDestination) {
  const { basePrice, dateFrom, dateTo, type, isFavorite, destination } = point;
  const favorite = isFavorite ? 'event__favorite-btn--active' : '';

  const startDay = dayjs(dateFrom).format('MMM D');
  const startDayDateTime = dayjs(dateFrom).format('YYYY-MM-DD');
  const startTime = dayjs(dateFrom).format('HH:mm');
  const startTimeDateTime = dayjs(dateFrom).format('YYYY-MM-DDTHH:mm');
  const endTime = dayjs(dateTo).format('HH:mm');
  const endTimeDateTime = dayjs(dateTo).format('YYYY-MM-DDTHH:mm');

  const eventDuration = calculateDuration(dateFrom, dateTo);

  const getOffersByType = (offers, offerType) => {
    const offersByType = offers.find((offer) => offer.type === offerType);
    return offersByType ? offersByType.offers : [];
  };

  const typeOffers = getOffersByType(allOffers, type.toLowerCase());

  const offersMarkup = typeOffers.map((offer) => {
    if (point.offers.includes(offer.id)) {
      return (`
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
      );
    }
    return '';
  }).join('');

  return (/*html*/
    `<li class="trip-events__item">
      <div class="event">
      <time class="event__date" datetime="${startDayDateTime}">${startDay}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startTimeDateTime}">${startTime}>10:30</time>
            &mdash;
            <time class="event__end-time" datetime="${endTimeDateTime}">${endTime}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <button class="event__favorite-btn ${favorite}" type="button">

          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class PointItemView {
  constructor({ point, offers, destinations }) {
    this.point = point;
    this.offers = offers;
    this.destinations = destinations;
  }

  getTemplate() {
    return createWaypointItemTemplate(this.point, this.offers, this.destinations);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
