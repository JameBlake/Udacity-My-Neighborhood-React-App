import React, {Component} from 'react';
import PlacesList from './Components/PlacesList.js';
import {loadMapJS} from './Components/loadMap.js';
import {mapStyles} from './Data/mapStyles.js';
import {clientId} from './Data/secretKeys.js';
import {clientSecret} from './Data/secretKeys.js';
import {googleKey} from './Data/secretKeys.js';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
/// The list of my favorite places.
            'myPlaces': [
                {
                    'title': "Five Guys",
                    'latitude': 53.7961623,
                    'longitude': -1.5417112,
                },
                {
                    'title': "Sukhothai",
                    'latitude': 53.7989752,
                    'longitude': -1.5475801,
                },
                {
                    'title': "Thai Aroy Dee",
                    'latitude': 53.7999435,
                    'longitude': -1.5391458,
                },
                {
                    'title': "Town Hall Tavern",
                    'latitude': 53.7995209,
                    'longitude': -1.5512685,
                },
                {
                    'title': "Akbar's",
                    'latitude': 53.7988805,
                    'longitude': -1.5382261,
                },
                {
                    'title': "Jamie's Italian",
                    'latitude': 53.7976018,
                    'longitude': -1.5472712,
                },
                {
                    'title': "Red's True Barbecue",
                    'latitude': 53.7957446,
                    'longitude': -1.5407107,
                },
                {
                    'title': "Belgrave Music Hall and Canteen",
                    'latitude': 53.8007561,
                    'longitude': -1.5410204,
                }
            ],
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }
//loading Google Maps and then calling back with initMap()
    componentDidMount() {
        window.initMap = this.initMap;
        loadMapJS('https://maps.googleapis.com/maps/api/js?key='+ googleKey + '&libraries=places&callback=initMap')
    }

//initializing the map.
    initMap() {
        var self = this;
        var mapPlacement = document.getElementById('map');
        var map = new window.google.maps.Map(mapPlacement, {
            center: {lat: 53.7988039, lng: -1.5440481},
            zoom: 15,
            mapTypeControl: false,
            styles:mapStyles,
        });

        var InfoWindow = new window.google.maps.InfoWindow({});
        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });
        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        var myPlaces = [];
//creating infowindows for all my favorite places.
        this.state.myPlaces.forEach(function (location) {
            var placeName = location.title;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
//On initializing, markers drop onto the map. As requested in the Rubric.
                animation: window.google.maps.Animation.DROP,
//Placing the Markers on the map that we have created and set in our state.
                map: map
            });
//Created listeners for each marker. InfoWindows Open for each marker on click.
            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });
            location.placeName=placeName;
            location.marker = marker;
            location.display = true;
            myPlaces.push(location);
        });
        this.setState({
            'myPlaces': myPlaces
        });
    }
//Upon clicking on our markers, the InfoWindow opens.
    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
//When a marker is selected, the marker bounces as requested in the rubric.
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
//Setting our state for prevmarker so we can control how many infowindows we have open at the same time.
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading...Please wait..');
        this.state.map.setCenter(marker.getPosition());
//Fetching information from the FourSquare API.
        this.getMarkerInfo(marker);
    }
//Allowing only one infowindow to be open at the same time. The state was set on Line 136.
    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

//A promise to fetch venue details from the FourSquare API.
    getMarkerInfo(marker) {
        var self = this;
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
//If there is no response from the API, informing the user an error had occured.
                        self.state.infowindow.setContent("Sorry! An error occured trying to receive information from FourSquare.");
                        return;
                    }
                    response.json().then(function (data) {

                        console.log(data);

                        var myPlaces_data = data.response.venues[0];
                        var location_id= myPlaces_data.id;

                        console.log(location_id);

                        var place = `<h3>${myPlaces_data.name}</h3>`;
                        var category= '<b>Category: </b>' + myPlaces_data.categories["0"].name + '<br>';
                        var addressOne= '<b> Street</b> ' + myPlaces_data.location.formattedAddress[0] + '<br>';
                        var addressTwo= '<b> City</b> ' + myPlaces_data.location.formattedAddress[1] + '<br>';
                        var addressThree= '<b> PostCode</b> ' + myPlaces_data.location.formattedAddress[2] + '<br>';
                        var hereNow = '<b> Here Now </b>' + myPlaces_data.hereNow.summary + "<br>";
                        var readMore = '<a href="https://foursquare.com/v/'+ myPlaces_data.id +'" target="_blank">Get reviews, photos and tips from foursquare.com</a>'
                        self.state.infowindow.setContent( place + category + addressOne + addressTwo + addressThree + hereNow + readMore);
                    });
                }
            )
//If there is an error with the data that we received, here we are informing the user an error had occured.
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry! Something went completely wrong! Please try again.");
            });
    }

    render() {
        return (
    <div className = 'App'>
            <div className='App-Container'>
                    <div className="Header-container">
                            <div className='App-title'>
                                <h1>Leeds Eats</h1>
                             </div>
                    </div>
            <PlacesList key="100"
            myPlaces={this.state.myPlaces}
            openInfoWindow={this.openInfoWindow}
            closeInfoWindow={this.closeInfoWindow}/>
                            <div className='Map-container'>
                                <div id="map" role="application">'Map Loading.....'</div>
                            </div>
            </div>
    </div>
        );
    }
}

export default App;




