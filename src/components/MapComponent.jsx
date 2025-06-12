// MapComponent.js

import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";
import { Select } from "antd";
import { useEffect, useRef, useState } from "react";

const MapComponent = () => {
    const mapDiv = useRef(null);
    const viewRef = useRef(null);
    const polygonsLayerRef = useRef(null);
    const [mapError, setMapError] = useState(null);
    // Add new state variables
    const [is3D, setIs3D] = useState(false);
    const [currentBasemap, setCurrentBasemap] = useState("topo");
    const [showLabels, setShowLabels] = useState(false);

    // Available basemaps
    const basemaps = ["dark-gray", "dark-gray-3d", "dark-gray-vector", "gray", "gray-3d", "gray-vector", "hybrid", "navigation-3d", "navigation-dark-3d", "oceans", "osm", "osm-3d", "satellite", "streets", "streets-3d", "streets-dark-3d", "streets-navigation-vector", "streets-night-vector", "streets-relief-vector", "streets-vector", "terrain", "topo", "topo-3d", "topo-vector"];


    // Function to toggle between 2D and 3D views
    const toggleViewMode = () => {
        setIs3D(prev => !prev);
    };

    // Function to change the basemap
    const changeBasemap = (value) => {
        setCurrentBasemap(value);
    };



    useEffect(() => {
        if (mapDiv.current) {
            try {
                // Destroy previous view if it exists
                if (viewRef.current) {
                    viewRef.current.destroy();
                    viewRef.current = null;
                }

                // Create new map with selected basemap
                const webmap = new Map({
                    basemap: currentBasemap
                });

                // Create and add provinces layer
                const provincesLayer = new GraphicsLayer({
                    title: "Provinces"
                });
                polygonsLayerRef.current = provincesLayer;
                webmap.add(provincesLayer);

                let view;

                // Create appropriate view based on is3D state
                if (is3D) {
                    view = new SceneView({
                        container: mapDiv.current,
                        map: webmap,
                        center: [105.8542, 16.4834],
                        zoom: 6.5,
                        camera: {
                            position: {
                                x: 105.8542,
                                y: 16.4834,
                                z: 500000 // height in meters
                            },
                            tilt: 45
                        }
                    });
                } else {
                    view = new MapView({
                        container: mapDiv.current,
                        map: webmap,
                        center: [105.8542, 16.4834],
                        zoom: 6.5,
                    });
                }

                viewRef.current = view;

                // Draw provinces when view is ready
                view.when(async () => {
                    console.log("Map view is ready");

                    // Demo provinces to load
                    const provincesToLoad = [
                        "ha_giang.json",
                        "cao_bang.json",
                        "lao_cai.json",
                        "son_la.json",
                        "lai_chau.json",
                        "bac_kan.json",
                        "lang_son.json",
                        "tuyen_quang.json",
                        "yen_bai.json",
                        "thai_nguyen.json",
                        "dien_bien.json",
                        "phu_tho.json",
                        "vinh_phuc.json",
                        "bac_giang.json",
                        "bac_ninh.json",
                        "ha_noi.json",
                        "quang_ninh.json",
                        "hai_duong.json",
                        "hai_phong.json",
                        "hoa_binh.json",
                        "hung_yen.json",
                        "ha_nam.json",
                        "thai_binh.json",
                        "nam_dinh.json",
                        "ninh_binh.json",
                        "thanh_hoa.json",
                        "nghe_an.json",
                        "ha_tinh.json",
                        "quang_binh.json",
                        "quang_tri.json",
                        "thua_thien_hue.json",
                        "da_nang.json",
                        "quang_nam.json",
                        "quang_ngai.json",
                        "kon_tum.json",
                        "gia_lai.json",
                        "binh_dinh.json",
                        "phu_yen.json",
                        "dak_lak.json",
                        "khanh_hoa.json",
                        "dak_nong.json",
                        "lam_dong.json",
                        "ninh_thuan.json",
                        "binh_phuoc.json",
                        "tay_ninh.json",
                        "binh_duong.json",
                        "dong_nai.json",
                        "binh_thuan.json",
                        "ho_chi_minh.json",
                        "ba_ria_vung_tau.json",
                        "an_giang.json",
                        "bac_lieu.json",
                        "ben_tre.json",
                        "ca_mau.json",
                        "can_tho.json",
                        "dong_thap.json",
                        "hau_giang.json",
                        "kien_giang.json",
                        "long_an.json",
                        "soc_trang.json",
                        "tien_giang.json",
                        "tra_vinh.json",
                        "vinh_long.json"
                    ];

                    // Default colors for provinces if not specified in JSON
                    const defaultColors = [
                        [216, 108, 114, 0.6], // red
                        [108, 216, 114, 0.6], // green
                        [108, 114, 216, 0.6], // blue
                        [216, 114, 216, 0.6], // purple
                        [216, 216, 114, 0.6]  // yellow
                    ];

                    // Load each province file using fetch
                    for (let i = 0; i < provincesToLoad.length; i++) {
                        const provinceFile = provincesToLoad[i];
                        try {
                            const response = await fetch(`/src/utils/provinces/${provinceFile}`);
                            if (!response.ok) {
                                throw new Error(`Failed to load province: ${provinceFile}`);
                            }
                            const data = await response.json();

                            // Create polygon geometry
                            const polygonGeometry = {
                                type: "polygon",
                                rings: data.rings,
                                spatialReference: { wkid: 4326 } // WGS84
                            };

                            // Create symbol for the polygon
                            const polygonSymbol = {
                                type: "simple-fill",
                                color: data.color || defaultColors[i % defaultColors.length],
                                outline: {
                                    color: [255, 255, 255, 0.8],
                                    width: 1
                                }
                            };

                            // Create graphic for the polygon
                            const polygonGraphic = new Graphic({
                                geometry: polygonGeometry,
                                symbol: polygonSymbol,
                                attributes: {
                                    title: data.title,
                                    region: data.region,
                                    population: data.population
                                }
                            });

                            // Add to the layer
                            provincesLayer.add(polygonGraphic);
                        } catch (error) {
                            console.error(`Error loading province ${provinceFile}:`, error);
                        }
                    }

                }, (error) => {
                    console.error("Map view failed to load:", error);
                    setMapError("Failed to load map view");
                });

                return () => {
                    if (view) {
                        view.destroy();
                    }
                };
            } catch (error) {
                console.error("Error initializing map:", error);
                setMapError("Failed to initialize map");
            }
        }
    }, [is3D, currentBasemap, showLabels]); // Add dependencies for map initialization


    return (
        <div className="">
            {mapError && (
                <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-3 z-10 shadow-md flex items-center justify-between">
                    <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {mapError}
                    </span>
                    <button className="text-white" onClick={() => setMapError(null)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}
            <div className="mapDiv" ref={mapDiv} style={{ height: '100vh', width: "100%" }}></div>

            {/* Controls with Ant Design Select for basemap */}
            <div className="absolute bottom-6 left-6 z-10 flex space-x-3">
                {/* Toggle 2D/3D button */}
                <button
                    onClick={toggleViewMode}
                    className="flex items-center justify-center px-4 py-3 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-colors"
                    title={is3D ? "Switch to 2D view" : "Switch to 3D view"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {is3D ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        )}
                    </svg>
                    <span className="font-medium">{is3D ? '2D View' : '3D View'}</span>
                </button>

                {/* Ant Design Select for basemap */}
                <div className="bg-white rounded-lg shadow-lg p-1 flex items-center">
                    <Select
                        defaultValue={currentBasemap}
                        style={{ width: 150, height: 45 }}
                        onChange={changeBasemap}
                        options={basemaps.map(map => ({
                            value: map,
                            label: map.charAt(0).toUpperCase() + map.slice(1).replace('-', ' ')
                        }))}
                        dropdownStyle={{ zIndex: 2000 }}
                        suffixIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
                            </svg>
                        }
                    />
                </div>

            </div>
        </div>
    );
}

export default MapComponent;
