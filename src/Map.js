import React from 'react';
import Nav from './Nav.js'
import redIcon from './assets/map-marker-red.png'
import greenIcon from './assets/map-marker-green.png'

// Makers' icons here: https://materialdesignicons.com/icon/map-marker


class Map extends React.Component {
  
  state = {
    
    map: {},
    locations: require("./data/locations.json"), // Loads locations from 'locations.json'
    mapMarkers: [],
    infoWindow: {}  
  };

 
  componentDidMount() {
    
    console.log("Debug #componentDidMount()");    
    this.loadMap();    
  }
  
   
  componentDidUpdate(prevProps, prevState) {
    if(prevProps.infoWindow !== this.props.infoWIndow) console.log("Just a test - componentDidUpdate #1");
    
    if (prevProps.google !== this.props.google) {
      //this.loadMap();
      console.log("Just a test - componentDidUpdate");
    }
  } 


  placeMarkers(map) {
    
    const locations = this.state.locations;
    
    // Boundaries of the map
    var bounds = new window.google.maps.LatLngBounds();
    
    // The markers array
    let markers = [];
    
    // Creates a marker for each location
    for(let i=0; i < locations.length; i++) {
   
      let position = {"lat": locations[i].latitude, "lng": locations[i].longitude};
      let title = locations[i].title;
   
      let marker = new window.google.maps.Marker({
       
        position: position,
        title: title,
        icon: redIcon,
        map: map,
        animation: window.google.maps.Animation.DROP     
      });
      
      // The 'click' event to open the info window
      marker.addListener('click', function () { 
        
        let content = this.infoWindowContent(locations[i]);        
        this.openInfoWindow(marker, content);
      }.bind(this));      
      
      marker.addListener('mouseover', function() {
         
        marker.setIcon(greenIcon);
      })
      
      marker.addListener('mouseout', function() {
         
        marker.setIcon(redIcon);
      })
      
      // Extends the bundaries of the map
      bounds.extend(position);      
      
      locations[i].linkedMarker = marker;
      
      // Adds the new marker to the markers array
      markers.push(marker);        
    }
    
    // Sets the viewport to contain the markers
    map.fitBounds(bounds);
    
    // Updates the component's state
    this.setState({mapMarkers: markers});   
  }
 

  loadMap() {    
        
    if(this.props && this.props.google) {  
      
      const mapDOMel = document.getElementById('map');
          
      const map = new window.google.maps.Map(mapDOMel, {
        center: {lat: 38.169923, lng: 15.204035},
        zoom: 12,
        mapTypeControl: false,        
        fullscreenControl: true,
        
        // https://developers.google.com/maps/documentation/javascript/controls
        fullscreenControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM
        }
      })    
      
     /*  Creates a new info window (displays text or images 
      *  in a popup window above the map). 
      *  #1 Info windows are always anchored to a marker
      *  #2 Only one info window is displayed at a time
      */
      const infoWindow = new window.google.maps.InfoWindow();     
      this.placeMarkers(map); 
      this.setState({map: map, infoWindow: infoWindow});        
    }
  }


  // Populates the info window
  infoWindowContent (location) {
    
    let title = location.title;  
    
    let content = `

      <div class="info-window">
        <p class = info-window-title>${title}</p>          
      </div>`;
    
    return content;
  }


  // Opens the info window
  openInfoWindow (marker, content) {
    
    const map = this.state.map;
    const iWindow = this.state.infoWindow;
    
    iWindow.maker = marker;
    iWindow.setContent(content);
    
    // Opens the info window on the 'marker'
    this.state.infoWindow.open(map, marker);
  }
 

  // Passed down to the 'Nav' component. Executed
  // when the user clicks on a location in the menu
  onClickPanTo = (ev, location) => {
 
    let map = this.state.map;
    
    // Changes the center of the map to the given LatLng
    map.panTo(location.linkedMarker.getPosition());
    
    this.openInfoWindow(location.linkedMarker, this.infoWindowContent(location));
  } 

  
  render() { 
     
    return (
      <div>
      <Nav locationsToShow={this.state.locations} onLocationClick={this.onClickPanTo}/>
      <div id='map' >
        Loading map...
      </div>
      </div>
    )
  }
}


export default Map;