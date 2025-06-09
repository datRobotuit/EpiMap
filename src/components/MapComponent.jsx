// MapComponent.js

import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";
import Map from "@arcgis/core/Map";
import React, { useEffect, useRef } from "react";

const MapComponent = () => {

    const mapDiv = useRef(null);

    useEffect(() => {
        if (mapDiv.current) {
            /**
             * Initialize application
             */
            const webmap = new Map({
                basemap: "satellite" // Basemap layer service
            });

            const view = new SceneView({
                container: mapDiv.current, // The id or node representing the DOM element containing the view.
                map: webmap, // An instance of a Map object to display in the view.
                center: [-117.1490, 32.7353],
                scale: 10000 // Represents the map scale at the center of the view.
            });

            return () => view && view.destroy()

        }
    }, []);

    return <div className="mapDiv" ref={mapDiv} style={{ height: '100vh', width: "100%" }}></div>;
}

export default MapComponent;
