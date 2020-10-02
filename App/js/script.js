let map;
var infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 9.0820,
      lng: 8.6753
    },
    zoom: 3,
    gestureHandling: 'greedy',
    restriction: {
      latLngBounds: {
        north: 85,
        south: -85,
        west: 180,
        east: -200
      },
    },
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    styles: [{
        elementType: "geometry",
        stylers: [{
          color: "#242f3e"
        }]
      },
      {
        elementType: "labels.text.stroke",
        stylers: [{
          color: "#242f3e"
        }]
      },
      {
        elementType: "labels.text.fill",
        stylers: [{
          color: "#746855"
        }]
      },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#d59563"
        }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#d59563"
        }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{
          color: "#263c3f"
        }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#6b9a76"
        }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{
          color: "#38414e"
        }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{
          color: "#212a37"
        }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#9ca5b3"
        }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{
          color: "#746855"
        }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{
          color: "#1f2835"
        }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#f3d19c"
        }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{
          color: "#2f3948"
        }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#d59563"
        }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{
          color: "#17263c"
        }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{
          color: "#515c6d"
        }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{
          color: "#17263c"
        }],
      },
    ],
  });

  infoWindow = new google.maps.InfoWindow();

  map.setOptions({
    minZoom: 2
  });

};

getAllData = () => {
  const URL = "https://disease.sh/v3/covid-19/countries";
  fetch(URL).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Request failed!")
  }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
    buildDataTable(jsonResponse);
    setMarker(jsonResponse);
  })
}

getHistoricalData = () => {
  const URL = "https://disease.sh/v3/covid-19/historical/all?lastdays=120";
  fetch(URL).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Request failed!")
  }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
    buildDataChart(jsonResponse);
  })
}

getCountryData = () => {
  let user_input = document.getElementById("user-input").value;
  const URL = `https://disease.sh/v3/covid-19/countries/${user_input}?yesterday=true&strict=true`;

  fetch(URL).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Request failed!")
  }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
    buildCountryData(jsonResponse)
  })
};

getWorldData = () => {
  const URL = `https://disease.sh/v3/covid-19/all`;

  fetch(URL).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Request failed!")
  }, networkError => console.log(networkError.message)
  ).then(jsonResponse => {
    buildCountryData(jsonResponse);
  })
}

function createMarker(latlng, radius, html) {

  const marker = new google.maps.Circle({
      strokeColor: "rgb(30, 130, 224)",
      strokeOpacity: 0.1,
      strokeWeight: 1,
      fillColor: "rgb(30, 130, 224)",
      fillOpacity: 0.45,
      map,
      center: latlng,
      position: latlng,
      radius: radius,
  });

  google.maps.event.addListener(marker, 'mouseover', function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });

  google.maps.event.addListener(marker, 'mouseout', function () {
    infoWindow.close();
  });

}

setMarker = (data) => {
  var bounds = new google.maps.LatLngBounds();
  data.map(s_data => {
    let html = `
    <div class="info-window">
    <div class="info-flag">
      <img src="${s_data.countryInfo.flag}" width="150px" alt="${s_data.country} Flag"/>
    </div>
    <h5> ${s_data.country} </h5>
    <div class="info-window-data"> 
      <p> Confirmed: <span> ${formatNumber(s_data.cases)} </span> </p> 
      <p> Recovered: <span> ${formatNumber(s_data.recovered)} </span> </p>  
      <p> Deaths: <span> ${formatNumber(s_data.deaths)} </span> </p>
    </div>
    </div>
    `;
    let latlng = new google.maps.LatLng(
      s_data.countryInfo.lat,
      s_data.countryInfo.long
    );
    let radius = s_data.casesPerOneMillion * 30;
    createMarker(latlng, radius, html);
    bounds.extend(latlng);
  });

  map.fitBounds(bounds);
}

formatNumber = (number) => {
  let formattedNum = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number);
  return formattedNum;
};

enterKeyEvent = (e) => {
  let user_input = document.getElementById("user-input").value;

  if(e.keyCode === 13) {
    if((user_input.toLowerCase() === "worldwide") || (user_input.toLowerCase() === "world")) {
      getWorldData()
    }else {
      getCountryData();
    }
  }
}

clickEvent = () => {
  let user_input = document.getElementById("user-input").value;
  if((user_input.toLowerCase() === "worldwide") || (user_input.toLowerCase() === "world")) {
    getWorldData()
  }else {
    getCountryData();
  }

}



window.onload = () => {
  var chart = new CanvasJS.Chart("myChart", {
    animationEnabled: true,
    height:200,
	/* title:{
		text: "Stock Price of BMW - August"
	}, */
	axisX:{
		//valueFormatString: "DD MMM",
		crosshair: {
			enabled: true,
            snapToDataPoint: true,
            label: false
		}
	},
	axisY: {
		//title: "Closing Price (in USD)",
		//valueFormatString: "$##0.00",
		// crosshair: {
		// 	enabled: true,
		// 	snapToDataPoint: true,
		// 	labelFormatter: function(e) {
		// 		return "$" + CanvasJS.formatNumber(e.value, "##0.00");
		// 	}
		// }
	},
	data: [{
		type: "area",
		xValueFormatString: "DD MMM",
		dataPoints: chartDataArray
	}]
});
  chart.render();

}, getAllData(), getHistoricalData(), getWorldData();
  

setInterval(() => {
  getAllData();
  getHistoricalData();
}, 10800000);