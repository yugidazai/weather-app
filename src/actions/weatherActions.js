import { action } from './utils';

const searchWeatherByCity = ({ city }, cb) => {
  action({
    type: "get",
    route: `/get-weather`,
    params: { search: city.trim().split(` `).join(``) },
    callback: cb
  });
};

export {
  searchWeatherByCity
};
