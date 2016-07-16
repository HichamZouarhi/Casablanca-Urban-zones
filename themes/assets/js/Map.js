var basemap = new ol.layer.Tile({
        source: new ol.source.OSM()
      });

var map = new ol.Map({
	layers: [basemap],
	target: 'map',
        view: new ol.View({
		projection: "EPSG:4326",
        	center: [-7.6158 , 33.5593],
        	zoom: 12
        	})
      	});

//the microzones layer as a geojson layer
var Microzones_Source=new ol.source.Vector({
	format: new ol.format.GeoJSON(),
	url: function(extent) {
		return 'http://localhost:8080/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typename=Afriquia_Gaz:Microzones&outputFormat=application/json&srsname=EPSG:4326';
		},
        strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
        	maxZoom: 19
        	}))
      	});
var Microzones_Layer=new ol.layer.Vector({
     			title: 'Microzones',
      			source: Microzones_Source,
			style: new ol.style.Style({
    					fill: new ol.style.Fill({
      						color: 'rgba(255, 255, 255, 0.2)'
    						}),
    					stroke: new ol.style.Stroke({
      						color: '#737373',
      						width: 2
    						}),
    					image: new ol.style.Circle({
      						radius: 7,
      						fill: new ol.style.Fill({
        						color: '#ffcc33'
      							})
    						})
  					})
			});

map.addLayer(Microzones_Layer);

// Hover Interaction code starts here
hoverInteraction = new ol.interaction.Select({
	condition: ol.events.condition.pointerMove,
	layers:[Microzones_Layer]	//Setting layers to be hovered
	});
map.addInteraction(hoverInteraction);

// Hover interaction ends here

// popup code starts here
var popup = new ol.Overlay.Popup();
map.addOverlay(popup);

map.on('singleclick', function(evt) {
	popup.hide();
    popup.setOffset([0, 0]);

	 // Attempt to find a feature in one of the visible vector layers
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        return feature;
    });

    if (feature) {
	//getting the center of the polygons to display the popup on its coordinates
	var ext=feature.getGeometry().getExtent();
	var center=ol.extent.getCenter(ext);
        var props = feature.getProperties();
        var info =  "Zone :"+props.microzone;
	
        // Offset the popup so it points at the middle of the marker not the tip
        popup.setOffset([0, -22]);
        popup.show(center,info);
		}	
});
// end of popup code
