import dayjs from 'dayjs';
import {getEventDuration} from './date-utils';

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortEventDay(eventA, eventB) {
  const weight = getWeightForNullDate(eventA.dateFrom, eventB.dateFrom);

  return weight ?? dayjs(eventA.dateFrom).diff(dayjs(eventB.dateFrom));
}

function sortEventDuration(eventA, eventB) {
  const weight = getWeightForNullDate(eventA.dateFrom, eventB.dateFrom);

  return weight ?? getEventDuration(eventA) - getEventDuration(eventB);
}

function sortEventPrice(eventA, eventB) {
  return eventB.basePrice - eventA.basePrice;
}

export{
  sortEventDay,
  sortEventDuration,
  sortEventPrice
};
