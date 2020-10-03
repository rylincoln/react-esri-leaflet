<p align="center">
   <img src="https://raw.githubusercontent.com/slutske22/react-esri-leaflet/HEAD/assets/react-logo.png" width="80px">&nbsp;&nbsp;&nbsp;&nbsp;
   <img src="https://raw.githubusercontent.com/slutske22/react-esri-leaflet/HEAD/assets/esri-logo.png" width="80px">&nbsp;&nbsp;&nbsp;&nbsp;
   <img src="https://raw.githubusercontent.com/slutske22/react-esri-leaflet/HEAD/assets/leaflet-logo.png" width="80px">
   <h1 align="center">react-esri-leaflet</h1>
</p>

<p align="center">
</p>

<p align="center">
   <i>quickly and easily bring esri-leaflet components into your react-leaflet application</i>
   <h2 align="center"><a href="https://codesandbox.io/s/react-esri-leaflet-example-n15yn">&#128064; Demo &#128064;</a></h2>
</p>

## Requirements

Requires react-leaflet version ^3.0.0, which is still in beta at this time.

(Support for react-leaflet version 2 currently in development. See the `src/v2` folder for a peek.)

## Installation

To use these components you must install certain dependencies yourself:

```javascript
npm i react react-dom leaflet react-leaflet esri-leaflet
```

with all of your underlying packages installed,

```javascript
npm i react-esri-leaflet
```

### Using esri-leaflet Plugins

If you want to use any of the esri-leaflet plugins, you must first install their underlying packages and any associated css. Each plugin has its own requirements, which you can find in the esri-leaflet docs.  Plugins are imported not from the main package, but from the `/plugins/<PluginName>` subfolder, like this:

````javascript
import EsriLeafletGeoSearch from "react-esri-leaflet/plugins/EsriLeafletGeoSearch";
````

#### `EsriLeafletGeoSearch`

You must first install the underlying `esri-leaflet-geocoder`:

```javscript
npm i esri-leaflet-geocoder
```

You will also need to include the css in your html header, as explained [in the esri-leaflet-geocoder documentation](https://github.com/Esri/esri-leaflet-geocoder). You can then use the `<EsriLeafletGeoSearch />` component. See the Use section for examples.

#### `HeatmapLayer`

First install the underlying dependencies:

```javscript
npm i leaflet.heat esri-leaflet-heatmap
```

You can then use the `<HeatmapLayer />` component.

#### `ClusterLayer`

First install the underlying dependencies:

```javscript
npm i leaflet.markercluster esri-leaflet-cluster
```

You can then use the `<ClusterLayer />` component.

**Note: Support for Vector Layer and Vector Basemap not available, as even esri does not recommend using these in production applications.  Open an issue if you have a dire need for these.

## Components

react-esri-leaflet offers the following components:

Native Components:

- &lt;BasemapLayer /&gt;
- &lt;FeatureLayer /&gt;
- &lt;TiledMapLayer /&gt;
- &lt;ImageMapLayer /&gt;
- &lt;DynamicMapLayer /&gt;

Plugins:

- &lt;EsriLeafletGeoSearch /&gt;
- &lt;HeatmapLayer /&gt;
- &lt;ClusterLayer /&gt;

## Use

Import any of the components and use them in a `<MapContainer />`:

```javascript
import React from "react";
import { MapContainer } from "react-leaflet";
import { BasemapLayer, FeatureLayer } from "react-esri-leaflet";
import EsriLeafletGeoSearch from "react-esri-leaflet/plugins/GeoSearch";

const Map = () => {

  return (

    <MapContainer zoom={zoom} center={center}>

      <BasemapLayer name="DarkGray" />

      <FeatureLayer url={featureLayerURL} />

      <EsriLeafletGeoSearch useMapBounds={false} position="topright" />

    </MapContainer>

  );

};
```

## Props

All react-esri-leaflet components inherit their props from the underlying esri-leaflet component options. You can find the options for each esri-leaflet layer [in their documentation](https://esri.github.io/esri-leaflet/api-reference/#layers). However, certain options are available or necessary for react-esri-leaflet components:

### BasemapLayer

| prop | type   | description                                                                                                             | required |
| ---- | ------ | ----------------------------------------------------------------------------------------------------------------------- | -------- |
| name | string | One of the [esri accepted baselayer names](https://esri.github.io/esri-leaflet/api-reference/layers/basemap-layer.html) | yes      |

### EsriLeafletGeoSearch

| prop     | type              | description                                                                                                                                                      | required |
| -------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| onResult | function(results) | fires when geosearch returns results, takes the [results event](https://esri.github.io/esri-leaflet/api-reference/controls/geosearch.html#events) as an argument | no       |

## Events

Events can be accessed in the same way as described in the [react-leaflet documentation](https://react-leaflet-v3.now.sh/docs/api-components#evented-behavior), using the `eventHandlers` prop. All events are inherited from their underlying esri-leaflet component. For example:

```javascript
<FeatureLayer
  url={freaturelayerURL}
  eventHandlers={{
    loading: () => console.log('featurelayer loading'),
    load: () => console.log('featurelayer loaded')
  }} />

<EsriLeafletGeoSearch
  position="topright"
  eventHandlers={{
    requeststart: () => console.log('Started request...'),
    requestend: () => console.log('Ended request...'),
    results: (r) => console.log(r)
  }} />
```

## Methods

Many of the methods on esri-leaflet layers can be handled through react props. For example, a `<FeatureLayer />` accepts the `where` prop, which applies a server side filter on the features in the layer. Using vanilla esri-leaflet, the `getWhere` and `setWhere` methods are available on the layer. With react-esri-leaflet, you can manage the setting and getting of many layer properties with react:

```javascript
const Map = () => {

  const [minPopulation, setMinpopulation] = useState(1000);

  return (
    <MapContainer zoom={zoom} center={center}>

      <FeatureLayer
        where={`Population > '${minPopulation}'`}
        url={featureLayerURL}
      />

      <button onClick={() => setMinpopulation(5000)}>
        Set min population to 5000
      </button>

    </MapContainer>
  );

};
```

In this way, you can 'get' or 'set' your prop by accessing the state variable used to control it, or setting that state variable.

Other methods on esri-leaflet components are less related to presentational logic, and more related to analysis or interacting with the root dataset. For example, calling `query` or `eachFeature` on a featureLayer will not affect the presentation logic. In this sense, all methods not directly affecting the presentational logic of your layers (read: everything but the setters and getters) should be accessed by getting a `ref` to the underlying esri-leaflet layer. For example:

```javascript
const Map = () => {

  const featureLayerRef = useRef();

  const queryFeature = () => {
    featureLayerRef
      .query()
      .within(latlngbounds)
      .where("Direction = 'WEST'")
      .run(function (error, featureCollection) {
        console.log(featureCollection);
      });
  };

  return (

    <MapContainer zoom={zoom} center={center}>

      <FeatureLayer ref={featureLayerRef} url={featureLayerURL} />

      <button onClick={queryFeature}>Run a Query</button>

    </MapContainer>

  );

};
````

## Using Authenticated Layers

Any esri layers that require authentication accept a `token` prop.  A react-esri-leaflet layer that requires a `token` should be conditionally rendered based on the availability of the token.  For example, a typical token getting function is as follows:

````Javascript
async function authenticateEsri(client_id, client_secret, expiration) {

  const authservice = "https://www.arcgis.com/sharing/rest/oauth2/token";
  const url = `${authservice}?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials&expiration=${expiration}`;

  let token;

  await fetch(url, {
    method: "POST"
  })
    .then((res) => res.json())
    .then((res) => {
      token = res.access_token;
    })
    .catch((error) => {
      console.error(error);
    });

  return token;

}
````

On component mount, you can call this function, save the token to state, and conditionally render the layer based on the state variable:

````Javascript
const Map = (props) => {

  const [token, setToken] = useState(null);

  useEffect(() => {
    async function getToken() {
      const token = await authenticateEsri();
      setToken(token);
    }
    getToken();
  }, []);

  return (
    <MapContainer zoom center>

      {token && (
        <ImageMapLayer
          token={token}
          url="https://landscape6.arcgis.com/arcgis/rest/services/World_Land_Cover_30m_BaseVue_2013/ImageServer"
        />
      )}

    </MapContainer>
  );
  
};
````

## Alternatives

Esri also offers [react-arcgis](https://github.com/Esri/react-arcgis), which is a react wrapper for the ArcGIS Javascript API.

## License

GNU General Public License v3.0