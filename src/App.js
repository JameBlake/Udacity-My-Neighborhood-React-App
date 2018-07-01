import React, {Component} from 'react';
import { mapStyles } from './Components/mapStyles.js';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
/// The list of my favorite places.
            'myPlaces': [
                {
                    'title': "Five Guys",
            
                    'latitude': 50.7960744,
                    'longitude': -1.5416437,
                    
                },
                {
                    'title': "Viet Guy",
        
                    'latitude': 53.795567,
                    'longitude': -1.5422783,
                    
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
          
                    'latitude': 53.7988417,
                    'longitude': -1.538538,
                    
                },
                {
                    'title': "The White Swan",
               
                    'latitude': 53.7989255,
                    'longitude': -1.5427158,
                    
                },
                {
                    'title': "Stampede by Cattle Grid",

                    'latitude': 53.7999955,
                    'longitude': -1.5448187,
                    
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
//allows callback to be used in React. Calling the Google Maps API.
    componentDidMount() {
        window.initMap = this.initMap;
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyC0ACPMM0duKvHqmd1SMrRuT68d91OtONs&callback=initMap')
    }

//initializing the map.
    initMap() {
        var self = this;
        var mapPlacement = document.getElementById('map');
        var map = new window.google.maps.Map(mapPlacement, {
            center: {lat: 53.7988039, lng: -1.5440481},
            zoom: 15,
            mapTypeControl: false,
            styles:mapStyles
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
        this.getMarkerInfo(marker);
    }
//Allowing only one infowindow to be open at the same time. The state was st on Line 136.
    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }


//Fetching venue details from the FourSquare API.
    getMarkerInfo(marker) {
        var self = this;
        var clientId = "0ODEWIMASAEHSY12ZIJIVLMXT5IVTZQHIE42ERWYM15TL1SJ";
        var clientSecret = "45ZH1TAQMZS2BGRU01WZKBUS0AUCUCDHYEIA10OCXICIX3PE";
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
//If there is no response from the API, informing the user an error had occured.
                        self.state.infowindow.setContent("Sorry! Something went wrong! Please try again.");
                        return;
                    }
                    response.json().then(function (data) {
                        console.log(data);
                        var myPlaces_data = data.response.venues[0];
                        var location_id= myPlaces_data.id;
 //                       var photo = location_data.categories["0"].icon.prefix + "300x500/" + myPlaces_data + myPlaces_data.categories["0"].icon.suffix + '<br>';
                        var identi =myPlaces_data.id + '<br>';
                        var phone = "<p><b>Phone:</b> "+ myPlaces_data.contact.formattedPhone +"</p>";
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
                self.state.infowindow.setContent("Sorry! Something went wrong! Please try again.");
            });
    }
/*
//Fetching photos from the FourSquare API.
    getMarkerInfo(marker) {
        var self = this;
        var clientId = "0ODEWIMASAEHSY12ZIJIVLMXT5IVTZQHIE42ERWYM15TL1SJ";
        var clientSecret = "45ZH1TAQMZS2BGRU01WZKBUS0AUCUCDHYEIA10OCXICIX3PE";
        var url = "https://api.foursquare.com/v2/venues/5671a626498e25fe3d8597d0/photos?client_id=0ODEWIMASAEHSY12ZIJIVLMXT5IVTZQHIE42ERWYM15TL1SJ&client_secret=45ZH1TAQMZS2BGRU01WZKBUS0AUCUCDHYEIA10OCXICIX3PE&v=20130815&limit=1";

        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
//If there is no response from the API, informing the user an error had occured.
                        self.state.infowindow.setContent("Sorry! Something went wrong! Please try again.");
                        return;
                    }
                    response.json().then(function (data) {
                        console.log(data);
                        var myPlaces_data = data.response.photos.items["0"];
                        console.log(myPlaces_data);
                        var location_id= myPlaces_data.id;
 ///                      var photo = myPlaces_data.prefix + "300x500" + myPlaces_data.suffix + '<br>';


                        
                        self.state.infowindow.setContent( photo + location_id );
                    });
                }
            )
//If there is an error with the data that we received, here we are informing the user an error had occured.
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry! Something went wrong! Please try again.");
            });
    }*/













    render() {
        return (
      <div className = 'App'>
      <div className='App-Container'>
      <div className="Header-container">
                <div className='App-title'>
                <h1>Leeds Eats</h1>
                </div>
                </div>
            <div className='Map-container'>
                <div id="map">'Map Loading.....'</div>
            </div>
              </div>
        </div>
        );
    }
}

export default App;


function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}


