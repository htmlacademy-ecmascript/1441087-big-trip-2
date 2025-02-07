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
      body: JSON.stringify(event),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }
}
