import { createElement } from '../render.js';
import { saveNewWaypoint, getRandomDestination } from '../mock/data-structure.js';
import dayjs from 'dayjs';
import { countDuration, constructionDuration } from '../utils.js';
import { Offers } from '../const.js';

function createWaypointItemTemplate(point) {
  const { basePrice, dateFrom, dateTo, type, isFavorite } = point;
  const { name, } = getRandomDestination();
  const cityDestination = name;
  const favorite = isFavorite ? 'event__favorite-btn--active' : '';

  const startDay = dayjs(dateFrom).format('MMM D');
  const startDayDateTime = dayjs(dateFrom).format('YYYY-MM-DD');
  const startTime = dayjs(dateFrom).format('HH:mm');
  const startTimeDateTime = dayjs(dateFrom).format('YYYY-MM-DDTHH:mm');
  const endTime = dayjs(dateTo).format('HH:mm');
  const endTimeDateTime = dayjs(dateTo).format('YYYY-MM-DDTHH:mm');

  const duration = countDuration(dateFrom, dateTo);
  const eventDuration = constructionDuration(duration);


  const getOffersByType = (offers, offerType) => {
    const offersByType = offers.find((offer) => offer.type === offerType);
    return offersByType ? offersByType.offers : [];
  };

  const mapOffersIdsToOffers = (ids, offers) => ids.map((offerId) => offers.find((offer) => offerId.toString() === offer.id.toString()));

  const typeOffers = getOffersByType(Offers, type.toLowerCase());
  const pointOffers = mapOffersIdsToOffers(point.offers, typeOffers);

  const getTitleOffersByType = () =>
    pointOffers.map((offer) => `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
    ).join('');


  return (/*html*/
    `<li class="trip-events__item">
      <div class="event">
      <time class="event__date" datetime="${startDayDateTime}">${startDay}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${cityDestination}</h3>
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
        <ul class="event__selected-offers">${getTitleOffersByType()}</ul>
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
  constructor({ point = saveNewWaypoint() }) {
    this.point = point;
  }

  getTemplate() {
    return createWaypointItemTemplate(this.point);
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
