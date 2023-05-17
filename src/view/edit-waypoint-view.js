import { generateNewWaypoint} from '../mock/data-structure.js';
import { createElement } from '../render.js';
import { WAYPOINTS_TYPES } from '../const.js';
import dayjs from 'dayjs';

// Разметка точки назначения

const createEventPhotosTemplate = (picturesList) => {
  if (!picturesList.length) {
    return '';
  }

  return (/*html*/`
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${picturesList.map((picture) => `<img class="event__photo" src="${picture.src}" alt="Event photo.">`).join('')}
      </div>
    </div>`);
};

const createEventsEditDestinationTemplate = (destinationItem) => (/*html*/`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationItem.description}</p>
      ${createEventPhotosTemplate(destinationItem.pictures)}
    </section>`);


// Разметка предложения

const createOffersMarkup = (typeOffers) => {
  if (!typeOffers.length) {
    return '';
  }
  return typeOffers.map((offer) => {
    const checked = typeOffers === offer ? 'checked' : '';
    if(typeOffers) {

      return (/*html*/
        `<div class="event__offer-selector">
        <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${offer.id}"
        type="checkbox"
        name="event-offer-${createOffersMarkup(offer.id)}"
        ${checked}
        >
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
        </div>`);
    }
  });
};


// Разметка пункта назначения

const createDestinationListTemplate = ({ allDestination }) => (/*html*/`
  <datalist id="destination-list-1">
    ${allDestination.map((destination) => `<option value="${destination.name}"></option>`).join('')}
  </datalist>`);


// Разметка типа события

const createSelectionType = () => {
  let selectType = '';
  WAYPOINTS_TYPES.map((typeEvent) => {
    const checked = typeEvent === type ? 'checked' : '';
    if(typeEvent) {
      selectType += /*html*/`
      <div class="event__type-item">
        <input id="event-type-${typeEvent.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeEvent.toLowerCase()}" ${checked}>
        <label class="event__type-label  event__type-label--${typeEvent.toLowerCase()}" for="event-type-${typeEvent.toLowerCase()}-.id">${typeEvent}</label>
      </div>`;
    }
  });
  return selectType;
};

// Изменение точки маршрута

const createEditWaypointElement = (point, allOffers, allDestination) => {
  const { basePrice, dateFrom, dateTo, destination: destinationId, type, offers } = point;
  const destinationItem = allDestination.find((item) => item.id === destinationId);

  const timeFrom = dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const timeTo = dayjs(dateTo).format('DD/MM/YY HH:mm');

  const getOffersByType = (allOffer, offerType) => {
    const offersByType = offers.find((offer) => offer.type === offerType);
    return offersByType ? offersByType.offers : [];
  };

  const typeOffers = getOffersByType(allOffers, type.toLowerCase());
  const offersMarkup = createOffersMarkup(typeOffers);

  return (/*html*/
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event ${type} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            ${createSelectionType({type})}
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createSelectionType()}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationItem.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createDestinationListTemplate({allDestination})}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${timeFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${timeTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
            ${createEventsEditDestinationTemplate(destinationItem)}
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offersMarkup()}
            </div>
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinationItem} ${allDestination}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${createEventPhotosTemplate()}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`
  );
};

export default class PointEditFormView {
  constructor({ point = generateNewWaypoint(), allOffers, allDestination }) {
    this.point = {point, allOffers, allDestination};
  }

  getTemplate() {
    return createEditWaypointElement(this.point, this.offers);
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

