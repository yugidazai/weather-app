import '../assets/styles/App.css';
import React, { Component }       from 'react';
import { searchWeatherByCity }    from "../actions/weatherActions";
import {
  validateRequiredFields,
  getDateObject
} from "../core/utils";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      submitting: false,
      weather: {
        current: null,
        forecast: []
      }
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.submitting) return;

    this.setState({submitting: true});

    const form = (e.currentTarget.nodeName === "FORM"? e.currentTarget : e.currentTarget.parentElement).elements;
    let form_data = {};
    for (let form_element of form) {
      if (form_element.name) {
        form_data[form_element.name] = form_element.value;
      }
    }

    const errors = validateRequiredFields([ "city" ], form_data);
    if (Object.keys(errors).length > 0) {
      return this.setState({ errors, submitting: false });
    }

    searchWeatherByCity(form_data, (err, res) => {
      this.setState({
        weather: err? this.state.weather : res.data,
        errors: err? { city: err.message } : {},
        submitting: false
      });
    });
  }

  render() {
    const now = getDateObject(new Date());
    let rendered_next_5_days = [];
    if (this.state.weather.forecast.length > 0) {
      rendered_next_5_days = this.state.weather.forecast.map((daily_weather, day_index) => (
        <div key={`forecast-${day_index}`} className="forecast">
          <span className="line-1 description">{daily_weather.description}</span>
          <div className="line-2">
            <span className="temperature">{daily_weather.temperature}°C</span>
            <span className="day">{now.next_5_days[day_index]}</span>
          </div>
        </div>
      ))
    }
    return (
      <div className="app">
        <div className="banner">
          <div className="banner-img"></div>
        </div>
        <div className="banner-text">
          { this.state.weather.current && (
              <div className="banner-text-today">
                <div className="banner-title-top">
                  <span className="line-1">{now.day}</span>
                  <span className="line-2">
                    {now.month} {now.year} {now.hour}:{now.minute} {now.am_pm}
                  </span>
                  <span className="line-3">{this.state.weather.current.description}</span>
                </div>
                <div className="banner-title-bottom">
                  <div className="line-1">
                    <i className={this.state.weather.current.icon_class}></i>
                    <span className="temperature">
                      {this.state.weather.current.temperature}°C
                    </span>
                  </div>
                  <span className="line-2">
                    {this.state.weather.current.city}, {this.state.weather.current.country}
                  </span>
                </div>
              </div>
          )}

          { rendered_next_5_days.length > 0 && (
              <div className="banner-text-forecast">
                {rendered_next_5_days}
              </div>
          )}

        </div>
        <div className="form-group">

          { !this.state.submitting &&
            <div className="container-unsubmitted">
              <form className="search-form" onSubmit={this.onSubmit}>
                <div className="form-group-fields">
                  <input type="text" name="city" placeholder="Search weather by city"/>
                  {this.state.errors["city"] && <p className="form-error">{this.state.errors["city"]}</p>}
                </div>

                <div className="form-group-submit" onClick={this.onSubmit}>
                  <button type="submit">GO</button>
                </div>
              </form>

            </div>
          }

          { this.state.submitting &&
            <div className="container-submitting">
              <span className="loader">
                <span className="spinner"></span>
              </span>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
