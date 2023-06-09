import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import { getOffersByType, formatDuration, getDuration } from '../utils/common.js';
import he from 'he';


function createPointItemTemplate(allDestination, allOffers, point) {
  const { type, destination: destinationId, dateFrom, dateTo, basePrice, isFavorite } = point;
  const destinationItem = allDestination.find((destination) => destination.id === destinationId);
  const favorite = isFavorite ? 'event__favorite-btn--active' : '';

  const startDay = dayjs(dateFrom).format('MMM D');
  const startDayDateTime = dayjs(dateFrom).format('YYYY-MM-DD');
  const startTime = dayjs(dateFrom).format('HH:mm');
  const startTimeDateTime = dayjs(dateFrom).format('YYYY-MM-DDTHH:mm');
  const endTime = dayjs(dateTo).format('HH:mm');
  const endTimeDateTime = dayjs(dateTo).format('YYYY-MM-DDTHH:mm');

  const eventDuration = formatDuration(getDuration(dateFrom, dateTo));

  const typeOffers = getOffersByType(allOffers, type.toLowerCase());

  const offersMarkup = typeOffers.map((offer) => {
    if (point.offers.includes(offer.id)) {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </li>
        `);
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
            <h3 class="event__title">${type} ${he.encode(`${destinationItem.name}`)}</h3>
            <div class="event__schedule">
              <p class="event__time">
              <time class="event__start-time" datetime="${startTimeDateTime}">${startTime}</time>
              &mdash;
              <time class="event__end-time" datetime="${endTimeDateTime}">${endTime}</time>
              </p>
              <p class="event__duration">${eventDuration}</p>
            </div>
              <p class="event__price">
              &euro;&nbsp;<span class="event__price-value">${he.encode(`${basePrice}`)}</span>
              </p>
            <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${offersMarkup}
          </ul>
        <button class="event__favorite-btn ${favorite}" type="button">

          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
        </header>
        <section class="event__details">

        </section>
      </form>
      </div>
    </li>`
  );
}

export default class PointItemView extends AbstractView{
  #destinations = {};
  #offers = {};
  #point = {};


  #buttonClick = null;
  #handleFavoriteClick = null;

  constructor({ destinations, offers, point, onRollupButtonClick, onFavoriteButtonClick }) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#point = point;

    this.#buttonClick = onRollupButtonClick;
    this.#handleFavoriteClick = onFavoriteButtonClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointItemTemplate(this.#destinations, this.#offers, this.#point);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#buttonClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
