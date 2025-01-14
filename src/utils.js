import dayjs from 'dayjs';


const DAY_HUMAN_FORMAT = 'MMM DD';
const DAY_MACHINE_FORMAT = 'YYYY-MM-DD';
const TIME_HUMAN_FORMAT = 'HH:mm';
const TIME_MACHINE_FORMAT = 'YYYY-MM-DDTHH:mm';


function getDayHuman (date) {
  return date ? dayjs(date).format(DAY_HUMAN_FORMAT) : '';
}

function getDayMachine (date) {
  return date ? dayjs(date).format(DAY_MACHINE_FORMAT) : '';
}

function getTimeHuman (date) {
  return date ? dayjs(date).format(TIME_HUMAN_FORMAT) : '';
}

function getTimeMachine (date) {
  return date ? dayjs(date).format(TIME_MACHINE_FORMAT) : '';
}

function getDateDifference (dateOne, dateTwo) {
  const diffDay = dayjs(dateOne).diff(dateTwo, 'day');
  const diffHour = dayjs(dateOne).diff(dateTwo, 'hour') - (diffDay * 24);
  const diffMinute = dayjs(dateOne).diff(dateTwo, 'minute') - ((diffHour * 60) + ((diffDay * 24) * 60));

  const diffDayText = diffDay !== 0 ? `${diffDay}D` : '';
  const diffHourText = diffHour !== 0 ? `${diffHour}H` : '';
  const diffMinuteText = diffMinute !== 0 ? `${diffMinute}M` : '';

  const dateDifference = `${diffDayText} ${diffHourText} ${diffMinuteText}`;

  return dateDifference;
}

function makeWordCapitalize (word) {
  return word[0].toUpperCase() + word.slice(1);
}


export {
  getDayHuman,
  getDayMachine,
  getTimeHuman,
  getTimeMachine,
  getDateDifference,
  makeWordCapitalize,
};
