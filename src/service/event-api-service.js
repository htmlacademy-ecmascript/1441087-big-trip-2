import {HttpMethod, HttpRoute} from '../utils/common-utils.js';
import ApiService from '../framework/api-service.js';


export default class EventsApiService extends ApiService {
  get events() {
    return this._load({url: `${HttpRoute.EVENT}`})
      .then(ApiService.parseResponse);
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `${HttpRoute.EVENT}/${event.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(this.#adaptEventToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptEventToServer(event) {
    const adaptedEvent = {...event,
      'base_price': parseInt(event.basePrice, 10),
      'date_from': event.dateFrom instanceof Date ? event.dateFrom.toISOString() : null,
      'date_to': event.dateTo instanceof Date ? event.dateTo.toISOString() : null,
      'is_favorite': event.isFavorite,
    };

    delete adaptedEvent.basePrice;
    delete adaptedEvent.dateFrom;
    delete adaptedEvent.dateTo;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
