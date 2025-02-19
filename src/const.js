const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic FortySix&2';
const API_ERROR_MESSAGE = 'Failed to load latest route information';
const LOADING_MESSAGE = 'Loading...';

const HttpMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const HttpRoute = {
  EVENT: 'points',
  DESTINATION: 'destinations',
  OFFERS: 'offers',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const SortType = {
  DAY:'day',
  EVENT:'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

export {
  END_POINT,
  AUTHORIZATION,
  API_ERROR_MESSAGE,
  LOADING_MESSAGE,
  HttpMethod,
  HttpRoute,
  UserAction,
  UpdateType,
  FilterType,
  SortType,
};
