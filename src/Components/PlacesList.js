import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SelectPlace from './SelectPlace';
import mainLogo from '../image/Powered-by-Foursquare.png'

class PlacesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'places': '',
            'query': '',
            'recommendations': true,
        };
        this.filterPlaces = this.filterPlaces.bind(this);
        this.toggleRecommendations = this.toggleRecommendations.bind(this);
    }

    componentWillMount() {
        this.setState({
            'places': this.props.myPlaces
        });
    }

    filterPlaces(event) {
        this.props.closeInfoWindow();
        const query = event.target.value.toLowerCase();
        var filteredPlaces = [];
        this.props.myPlaces.forEach(function (location) {
            if (location.placeName.toLowerCase().indexOf(query) >= 0) {
                location.marker.setVisible(true);
                filteredPlaces.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });
        this.setState({
            'query': query,
            'places': filteredPlaces
        });
    }

    toggleRecommendations() {
        this.setState({
            'recommendations': !this.state.recommendations
        });
    }

    render() {
        var placeslist = this.state.places.map(function (listItem, index) {
            return (
                <SelectPlace key={index}
                openInfoWindow={this.props.openInfoWindow.bind(this)}
                data={listItem}/>
            );
        }, this);

        return (
            <div className = "search-wrapper>">
            <div className="search">
                <input role="search" aria-labelledby="filter" id="search-field" className="search-field" type="text"
                placeholder="Let's look for a great place to eat!"
                value={this.state.query}
                onChange={this.filterPlaces}/>
                        <ul>
                            {this.state.recommendations && placeslist}
                            <img src={mainLogo} id = "logoFourSquare" alt="FourSquare Logo"/>
                        </ul>
                <button className="button" onClick={this.toggleRecommendations}>Show/Hide Recommendations</button>
            </div>
            </div>
        );
    }
}

PlacesList.propTypes = {
    myPlaces: PropTypes.array.isRequired,
}

export default PlacesList;

