import React, { useRef, useEffect } from "react";
import { loadModules } from "esri-loader";

const Map = () => {
  const MapEl = useRef(null);

  useEffect(() => {
    loadModules(
      [
        "esri/layers/WebTileLayer",
        "esri/Map",
        "esri/Basemap",
        "esri/widgets/BasemapToggle",
        "esri/views/SceneView",
      ],
      {
        css: true,
      }
    ).then(([WebTileLayer, Map, Basemap, BasemapToggle, SceneView]) => {
      // Create a WebTileLayer with a third-party cached service
      const mapBaseLayer = new WebTileLayer({
        urlTemplate:
          "https://stamen-tiles-{subDomain}.a.ssl.fastly.net/terrain/{level}/{col}/{row}.png",
        subDomains: ["a", "b", "c", "d"],
        copyright: `Map tiles by <a href="http://stamen.com/">Stamen Design</a>,
           under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.
           Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>,
           under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.`,
      });
      // Create a Basemap with the WebTileLayer. The thumbnailUrl will be used for
      // the image in the BasemapToggle widget.
      const stamen = new Basemap({
        baseLayers: [mapBaseLayer],
        title: "Terrain",
        id: "terrain",
        thumbnailUrl:
          "https://stamen-tiles.a.ssl.fastly.net/terrain/10/177/409.png",
      });

      const map = new Map({
        basemap: "satellite",
        ground: "world-elevation",
      });

      const initCamera = {
        heading: 45.7,
        tilt: 82.9,
        position: {
          latitude: 36.7378,
          longitude: -119.7871,
          z: 1500,
        },
      };

      const view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: initCamera,
      });

      view.when(() => {
        // Add a basemap toggle widget to toggle between basemaps
        const toggle = new BasemapToggle({
          visibleElements: {
            title: true,
          },
          view: view,
          nextBasemap: stamen,
        });

        // Add widget to the top right corner of the view
        view.ui.add(toggle, "top-right");
      });
    });
  }, []);

  return <div id="viewDiv" style={{ height: 800 }} ref={MapEl}></div>;
};

export default Map;
