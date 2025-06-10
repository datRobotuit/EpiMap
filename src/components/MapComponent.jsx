// MapComponent.js

import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import { useEffect, useRef } from "react";

const MapComponent = () => {

    const mapDiv = useRef(null);
    // biến lưu giá trị camera (độ zoom, tọa độ, góc nhìn) cho view 3D
    useEffect(() => {
        if (mapDiv.current) {
            /**
             * Initialize application
             */
            const webmap = new Map({
                basemap: "dark-gray-vector" // Basemap layer service
            });

            const view = new SceneView({
                container: mapDiv.current, // The id or node representing the DOM element containing the view.
                map: webmap, // An instance of a Map object to display in the view.
                center: [105.8542, 16.4834], // Longitude, latitude of the center of the view.
                zoom: 6.5,
            });

            return () => view && view.destroy()

        }
    }, []);

    return <div className="mapDiv" ref={mapDiv} style={{ height: '100vh', width: "100%" }}></div>;
}

export default MapComponent;
