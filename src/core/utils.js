const DAYS = [
  `Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`
];
const MONTHS = [
  `January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`
];

const getNextDays = (day_index = 0, number_of_next_days = 1) => {
  if (day_index < DAYS.length - number_of_next_days) {
    return DAYS.slice(day_index, day_index + number_of_next_days);
  }
  let result = DAYS.slice(day_index, DAYS.length);
  return result.concat(getNextDays(0, number_of_next_days - result.length));
};

const getDateObject = (date = new Date()) => {
  const hour_24 = date.getHours();
  const day_index = date.getDay();
  return {
    am_pm: hour_24 < 12? `AM` : `PM`,
    minute: date.getMinutes().toString().padStart(2, `0`),
    hour: hour_24 > 12? hour_24 - 12 : hour_24,
    day: DAYS[day_index],
    month: MONTHS[date.getMonth()],
    year: date.getYear() + 1900,
    next_5_days: getNextDays(day_index + 1, 5)
  }
};

const validateRequiredFields = (requiredFields, values) => {
  let errors = {};
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = `Field "${field}" is required`;
    }
  });

  return errors;
};

export {
  validateRequiredFields,
  getDateObject
}
