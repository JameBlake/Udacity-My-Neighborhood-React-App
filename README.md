### __Neighborhood Map Project React__

## __Table of Contents__

* [Instructions.](#instructions)
* [What do I do from here?](#what-do-I-do-from-here?)
* [What does the App do?](#what-does-the-app-do?)
* [Resources and Documentation.](#resources-and-documentation)
* [Contributing.](#contributing)

## __Instructions__

To get started, clone or download the ZIP folder from (https://github.com/JameBlake/Udacity-My-Neighborhood-React-App).

### __What do I do from here?__

Once you have the folder on your computer, please cd (change directory) into it.
Now that you are in this folder, please run *npm install* in the Command Line. This will install all of the dependencies.
When this installation is complete, start the app by running *npm start*.
This will cause your browser to open up http://localhost:3000/ and the app will be fully functional. However in this build (Development build), the service worker will **NOT** cache the site.

For the service worker to cache the site, this app needs to be run in **production mode**.

To run the app in production mode run, cd into the app folder and run *npm run build*. Once this is complete, cd into it.
Once you are in the build directory, install Node serve (If you don't already have it) by running *npm install -g serve*.
Once this installation is complete, run *serve -s*.
In your browser, open up http://localhost:5000 and you have succesfully opened up the app in production mode. If you open up dev tools, in the console, you will be able to see 'Content is cached for offline use'.

### __What does the App do?__

This app displays a map of the Leeds ( England ) area with a few of my favorite places to eat highlighted with a marker.
If a marker is selected, details of that place is provided by the Foursqaure API. The option to search for a specific place is also provided. If a query is entered into the search bar, the places that match the query will be displayed on the map with their marker. The markers that don't match the query will be hidden.

### __Resources and Documentation:__

[Foursquare API - Venue Details.](https://developer.foursquare.com/docs/api/venues/details)
[Foursquare Logo](https://www.dropbox.com/sh/kf7rywth02sba55/AADWM1DWQ3BeJWR3ULEQijMga/Logos/Developer?dl=0)
Map Styles - acquired from [snazzymaps](https://snazzymaps.com/).
Personailzed favicon designed at https://www.favicon.cc/.
[Fullstackreact](https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/) - A fantastic resource to get your head around react and the Google Maps API.


## __Contributing__

This repository is the starter code for _all_ Udacity students. Therefore, we most likely will not accept pull requests.

For details, check out [CONTRIBUTING.md](CONTRIBUTING.md).


