// MapComponent.js

import Graphic from "@arcgis/core/Graphic"; // Add missing Graphic import
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";
import { Select } from "antd";
import { useEffect, useRef, useState } from "react";

const MapComponent = () => {
    const mapDiv = useRef(null);
    const viewRef = useRef(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [infoPosition, setInfoPosition] = useState(null);
    const [mapError, setMapError] = useState(null);
    // Create graphics layer ref to maintain it between renders
    const polygonsLayerRef = useRef(new GraphicsLayer({ id: "provincesLayer" }));
    const [region, setRegion] = useState("Cả nước");

    // Add new state variables
    const [is3D, setIs3D] = useState(false);
    const [currentBasemap, setCurrentBasemap] = useState("satellite");

    // Available basemaps
    const basemaps = ["satellite", "streets", "hybrid", "topo-vector", "gray-vector"];

    // Function to toggle between 2D and 3D views
    const toggleViewMode = () => {
        setIs3D(prev => !prev);
    };

    // vẽ đa giác tỉnh
    const drawProvince = (data, currentRegion) => {
        console.log("Drawing province:", data.title, "Region:", data.region, "Current filter:", currentRegion);

        try {
            // Kiểm tra xem data có đầy đủ thông tin cần thiết không
            if (!data || !data.title) {
                console.error("Invalid province data:", data);
                return null;
            }

            // Kiểm tra xem data.rings có dữ liệu hay không
            if (!data.rings || !Array.isArray(data.rings) || data.rings.length === 0) {
                console.error("No rings data for province:", data.title);
                return null;
            }

            // Kiểm tra xem tỉnh có thuộc khu vực được chọn không
            const isInSelectedRegion = data.region === currentRegion || currentRegion === "Cả nước";

            // Thêm transparency cho các tỉnh không thuộc khu vực được chọn
            const fillColor = isInSelectedRegion
                ? data.color || [0, 122, 194, 0.5] // Sử dụng màu mặc định nếu không có color
                : [120, 120, 120, 0.3]; // Màu xám mờ cho các tỉnh không thuộc khu vực

            // Tạo một đối tượng Graphic cho tỉnh
            const provinceGraphic = new Graphic({
                geometry: {
                    type: "polygon",
                    rings: data.rings,
                },
                symbol: {
                    type: "simple-fill",
                    color: fillColor,
                    outline: {
                        type: "simple-line",
                        color: isInSelectedRegion ? [255, 255, 255] : [200, 200, 200],
                        width: isInSelectedRegion ? 1.5 : 0.8, // Đường viền dày hơn cho tỉnh được chọn
                        style: "dash"
                    },
                },
                attributes: {
                    ...data,
                    isSelected: isInSelectedRegion
                },
                popupTemplate: isInSelectedRegion ? {
                    title: "{title}",
                    content:
                        "<b>Diện tích:</b> {area} km²<br>" +
                        "<b>Dân số:</b> {population} người<br>" +
                        "<b>Mật độ:</b> {population_density} người/km²<br>" +
                        "<b>Biển số xe:</b> {plate_number}",
                } : null,
            });

            return provinceGraphic;
        } catch (error) {
            console.error("Error creating graphic for province:", data?.title || "unknown", error);
            return null;
        }
    };


    // Function to change basemap
    const changeBasemap = (basemap) => {
        setCurrentBasemap(basemap);
        if (viewRef.current && viewRef.current.map) {
            viewRef.current.map.basemap = basemap;
        }
    };

    useEffect(() => {
        const fetchProvinceData = async () => {
            try {
                const indexRes = await fetch("src/utils/provinces/index.json");
                const files = await indexRes.json();

                const data = await Promise.all(
                    files.map((file) =>
                        fetch(`/polygon/provinces/${file}`).then((res) => res.json())
                    )
                );

                data.forEach((provinceData) => {
                    const provinceShape = drawProvince(provinceData, currentRegion);
                    polygonsLayer.add(provinceShape); // <- bạn cần định nghĩa sẵn polygonsLayer
                });
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu tỉnh:", error);
            }
        };

        fetchProvinceData();
    }, [region]); 

    useEffect(() => {
        if (mapDiv.current) {
            try {
                // Destroy previous view if it exists
                if (viewRef.current) {
                    viewRef.current.destroy();
                    viewRef.current = null;
                }

                const webmap = new Map({
                    basemap: currentBasemap
                });

                // Add the provinces layer to the map
                webmap.add(polygonsLayerRef.current);

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

                // Xử lý khi view đã sẵn sàng
                view.when(() => {
                    console.log("Map view is ready");
                    // Fetch province data after the view is ready
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
    }, [is3D, currentBasemap]); // Add region as a dependency


    return (
        <div className="relative">
            {/* Debug information panel */}
            <div className="absolute top-20 left-10 z-20 bg-white p-4 rounded-lg shadow-lg max-w-xs opacity-80 hover:opacity-100 transition-opacity">
                <h3 className="font-bold text-sm mb-2">Debug Info</h3>
                <p className="text-xs mb-1">Region: {region}</p>
                <p className="text-xs mb-1">Map Status: {viewRef.current ? "Loaded" : "Not Loaded"}</p>
                <p className="text-xs mb-1">Graphics Layer: {polygonsLayerRef.current?.graphics?.length || 0} provinces</p>
                <button
                    onClick={() => fetchProvinceData(region)}
                    className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                >
                    Reload Provinces
                </button>
            </div>

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

                {/* Add a region selector */}
                <div className="z-10 bg-white rounded-lg shadow-lg p-1 flex items-center">
                    <Select
                        defaultValue={region}
                        style={{ width: 150, height: 45 }}
                        onChange={setRegion}
                        options={[
                            { value: "Cả nước", label: "Cả nước" },
                            { value: "Bắc", label: "Miền Bắc" },
                            { value: "Trung", label: "Miền Trung" },
                            { value: "Nam", label: "Miền Nam" }
                        ]}
                        dropdownStyle={{ zIndex: 2000 }}
                        suffixIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                        }
                    />
                </div>
            </div>


        </div>
    );
}

export default MapComponent;
