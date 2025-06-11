// MapComponent.js

import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Map from "@arcgis/core/Map";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SceneView from "@arcgis/core/views/SceneView";
import { useEffect, useRef, useState } from "react";
import { provincesData } from "../utils/province-stats";
import EnhancedProvinceInfo from "./EnhancedProvinceInfo";

const MapComponent = () => {
    const mapDiv = useRef(null);
    const viewRef = useRef(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [infoPosition, setInfoPosition] = useState(null);

    // biến lưu giá trị camera (độ zoom, tọa độ, góc nhìn) cho view 3D
    useEffect(() => {
        if (mapDiv.current) {
            /**
             * Initialize application
             */
            const webmap = new Map({
                basemap: "satellite" // Basemap layer service
            });

            // Create a graphics layer for highlighting provinces
            const highlightLayer = new GraphicsLayer();
            webmap.add(highlightLayer);

            // Create a feature layer for Vietnam provinces (simulated)
            // In a real application, you would use a real feature layer URL or data
            const provincesLayer = new FeatureLayer({
                // This is a placeholder. You would replace with actual data
                title: "Vietnam Provinces",
                fields: [
                    {
                        name: "OBJECTID",
                        type: "oid"
                    },
                    {
                        name: "Province",
                        type: "string"
                    },
                    {
                        name: "CaseCount",
                        type: "integer"
                    }
                ],
                renderer: {
                    type: "simple",
                    symbol: {
                        type: "simple-fill",
                        color: [0, 0, 0, 0.1],
                        outline: {
                            color: [255, 255, 255, 0.5],
                            width: 0.5
                        }
                    }
                },
                // This is where you would put actual geometry
                source: [], // Empty for now
                objectIdField: "OBJECTID",
                geometryType: "polygon"
            });

            webmap.add(provincesLayer);

            // Add a layer for province centroids (for click interactions)
            // This is a simulated layer for demonstration
            const centroidsLayer = new GraphicsLayer();

            // Add sample province centroids
            // In a real application, these would be actual coordinates
            const sampleProvinces = [
                { name: "Hà Nội", x: 105.8342, y: 21.0278 },
                { name: "TP.HCM", x: 106.6297, y: 10.8231 },
                { name: "Đà Nẵng", x: 108.2022, y: 16.0544 },
                { name: "Cần Thơ", x: 105.7873, y: 10.0341 },
                { name: "Hải Phòng", x: 106.6881, y: 20.8449 },
                { name: "Hà Tĩnh", x: 105.9057, y: 18.3559 },
                { name: "Nghệ An", x: 104.9200, y: 19.2344 },
                { name: "Thanh Hóa", x: 105.7765, y: 19.8066 }
            ];

            // Create a symbol for the province points
            const provinceSymbol = new SimpleMarkerSymbol({
                color: [0, 0, 0, 0],  // Transparent
                size: 15,
                outline: {
                    color: [0, 0, 0, 0],  // Transparent
                    width: 0
                }
            });

            // Add graphics for each province
            sampleProvinces.forEach(province => {
                const point = {
                    type: "point",
                    longitude: province.x,
                    latitude: province.y
                };

                const graphic = new Graphic({
                    geometry: point,
                    symbol: provinceSymbol,
                    attributes: {
                        name: province.name
                    }
                });

                centroidsLayer.add(graphic);
            });

            webmap.add(centroidsLayer);

            const view = new SceneView({
                container: mapDiv.current, // The id or node representing the DOM element containing the view.
                map: webmap, // An instance of a Map object to display in the view.
                center: [105.8542, 16.4834], // Longitude, latitude of the center of the view.
                zoom: 6.5,
                padding: {
                    right: window.innerWidth / 4 // Make room for the dashboard panel
                }
            });

            viewRef.current = view;

            // Set up click event
            view.on("click", (event) => {
                // Perform a hitTest to check if a province was clicked
                view.hitTest(event).then(response => {
                    // Check if a graphic was hit
                    const graphic = response.results?.find(result =>
                        result.graphic.layer === centroidsLayer
                    );

                    if (graphic) {
                        const provinceName = graphic.graphic.attributes.name;

                        // Get screen coordinates for the popup
                        const screenPoint = {
                            x: event.x,
                            y: event.y
                        };

                        setSelectedProvince(provinceName);
                        setInfoPosition(screenPoint);

                        // Highlight the province (in a real app, you would have actual province polygons)
                        highlightLayer.removeAll();

                        // This is a placeholder. In a real app, you would highlight the actual province polygon
                        // For demonstration, we'll create a simple circle around the clicked point
                        const highlightSymbol = new SimpleFillSymbol({
                            color: [59, 130, 246, 0.3],
                            outline: {
                                color: [59, 130, 246, 1],
                                width: 2
                            }
                        });

                        // In a real app, this would be the actual province polygon
                        const highlightGraphic = new Graphic({
                            geometry: {
                                type: "polygon",
                                rings: [
                                    [
                                        [graphic.graphic.geometry.longitude - 0.5, graphic.graphic.geometry.latitude - 0.5],
                                        [graphic.graphic.geometry.longitude + 0.5, graphic.graphic.geometry.latitude - 0.5],
                                        [graphic.graphic.geometry.longitude + 0.5, graphic.graphic.geometry.latitude + 0.5],
                                        [graphic.graphic.geometry.longitude - 0.5, graphic.graphic.geometry.latitude + 0.5],
                                        [graphic.graphic.geometry.longitude - 0.5, graphic.graphic.geometry.latitude - 0.5]
                                    ]
                                ]
                            },
                            symbol: highlightSymbol
                        });

                        highlightLayer.add(highlightGraphic);
                    } else {
                        // If clicking outside a province, clear selection
                        highlightLayer.removeAll();
                        setSelectedProvince(null);
                        setInfoPosition(null);
                    }
                });
            });

            // Function to update the case count visualization
            const updateCaseVisualization = () => {
                // In a real application, this would update based on actual data
                // For now, we'll create some visualization based on our sample data

                // Remove any existing graphics
                const casesLayer = view.map.findLayerById("casesLayer");
                if (casesLayer) {
                    view.map.remove(casesLayer);
                }

                // Create a new graphics layer for cases
                const newCasesLayer = new GraphicsLayer({
                    id: "casesLayer"
                });

                // Add a graphic for each province in our sample data
                sampleProvinces.forEach(province => {
                    // Find the province data
                    const data = provincesData.find(p => p.province === province.name);
                    if (!data) return;

                    // Scale the symbol size based on case count
                    const maxCases = Math.max(...provincesData.map(p => p.cases));
                    const size = 10 + (data.cases / maxCases) * 30;

                    // Create a symbol
                    const symbol = new SimpleMarkerSymbol({
                        color: [59, 130, 246, 0.6],
                        size: size,
                        outline: {
                            color: [255, 255, 255, 0.5],
                            width: 0.5
                        }
                    });

                    // Create a graphic
                    const graphic = new Graphic({
                        geometry: {
                            type: "point",
                            longitude: province.x,
                            latitude: province.y
                        },
                        symbol: symbol,
                        attributes: {
                            name: province.name,
                            cases: data.cases
                        }
                    });

                    newCasesLayer.add(graphic);
                });

                // Add the layer to the map
                view.map.add(newCasesLayer);
            };

            // Update visualization when the view is ready
            view.when(() => {
                updateCaseVisualization();
            });

            return () => view && view.destroy()
        }
    }, []);

    const handleCloseInfo = () => {
        setSelectedProvince(null);
        setInfoPosition(null);

        // Clear highlights
        if (viewRef.current) {
            const highlightLayer = viewRef.current.map.findLayerById("highlightLayer");
            if (highlightLayer) {
                highlightLayer.removeAll();
            }
        }
    };

    return (
        <div className="relative">
            <div className="mapDiv" ref={mapDiv} style={{ height: '100vh', width: "100%" }}></div>
            {selectedProvince && infoPosition && (
                <EnhancedProvinceInfo
                    province={selectedProvince}
                    position={infoPosition}
                    onClose={handleCloseInfo}
                />
            )}
        </div>
    );
}

export default MapComponent;
