const API_ERROR_MESSAGE = 'Failed to load latest route information';
const LOADING_MESSAGE = 'Loading...';

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

export {
  API_ERROR_MESSAGE,
  LOADING_MESSAGE,
  UserAction,
  UpdateType,
  HttpMethod,
  HttpRoute,
};
