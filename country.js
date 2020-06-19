import React, { PureComponent } from "react";
import { render } from "react-dom";
// cant use iso3166-2-db/i18n/dispute/UN/en due to sandbox limitations
import { getDataSet, reduce } from "iso3166-2-db";

// get default and keep only english. You should just import prebuild dataset
const listOfCountries = reduce(getDataSet(), "en");

class AddressSelector extends PureComponent {
  state = {};

  onCountryChange = event =>
    this.setState({
      selectedCountry: event.target.value,
      selectedRegion: null
    });

  onRegionChange = event =>
    this.setState({
      selectedRegion: event.target.value
    });

  // render list of countries
  renderCountrySelector() {
    return (
      <select onChange={this.onCountryChange}>
        <option>---</option>
        {Object.keys(listOfCountries)
          .sort(
            (a, b) =>
              listOfCountries[a].name > listOfCountries[b].name ? 1 : -1
          )
          .map(isoCode =>
            <option key={isoCode} value={isoCode}>
              {listOfCountries[isoCode].name}
            </option>
          )}
      </select>
    );
  }

  // render list of states for selected country
  renderStateSelector() {
    const { selectedCountry } = this.state;
    if (!selectedCountry) {
      return <span>Select country first</span>;
    }
    const regions = listOfCountries[selectedCountry].regions;
    return (
      <select onChange={this.onRegionChange}>
        {regions.sort((a, b) => (a.name > b.name ? 1 : -1)).map(region =>
          <option key={region.iso} value={region.iso}>
            {region.name}
          </option>
        )}
      </select>
    );
  }

  render() {
    const { selectedCountry, selectedRegion } = this.state;
    return (
      <div>
        <div>
          <label>Country:</label> {this.renderCountrySelector()}
        </div>

        <div>
          <label>State:</label> {this.renderStateSelector()}
        </div>
        <div>
          result: {selectedCountry} {selectedRegion} <br />
          {selectedCountry && selectedRegion
            ? <pre>
                {JSON.stringify(
                  listOfCountries[selectedCountry].regions.find(
                    r => r.iso == selectedRegion
                  ),
                  undefined,
                  2
                )}
              </pre>
            : "undefined"}
        </div>
      </div>
    );
  }
}

const App = () =>
  <div>
    Country and state selector:
    <AddressSelector />
  </div>;

render(<App />, document.getElementById("root"));