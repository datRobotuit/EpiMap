// MapComponent.js

import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import LabelClass from "@arcgis/core/layers/support/LabelClass";
import Map from "@arcgis/core/Map";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";
import { Select, Spin, Switch } from "antd";
import { useEffect, useRef, useState } from "react";
import { fetchFacilities } from "../services/apiService";
import epidemicData from "../utils/mockEpidemicData";

const MapComponent = () => {
    const mapDiv = useRef(null);
    const viewRef = useRef(null);
    const polygonsLayerRef = useRef(null);
    const facilitiesLayerRef = useRef(null);
    const [mapError, setMapError] = useState(null);
    // Add new state variables
    const [is3D, setIs3D] = useState(false);
    const [currentBasemap, setCurrentBasemap] = useState("topo");
    const [showLabels, setShowLabels] = useState(false);
    const [selectedDataType, setSelectedDataType] = useState("totalCases");
    const [selectedDisease, setSelectedDisease] = useState("all");
    const [facilities, setFacilities] = useState([]);
    const [showFacilities, setShowFacilities] = useState(false);
    const [loadingFacilities, setLoadingFacilities] = useState(false);

    // Loại dữ liệu có thể hiển thị
    const dataTypes = [
        { value: "totalCases", label: "Tổng số ca" },
        { value: "activeCases", label: "Ca đang điều trị" },
        { value: "newCases", label: "Ca mới trong ngày" },
    ];

    // Danh sách loại bệnh từ dữ liệu mô phỏng
    const diseaseTypes = [
        { value: "all", label: "Tất cả bệnh", color: [100, 100, 100, 0.7] },
        ...(epidemicData.diseaseTypes || []).map(disease => ({
            value: disease.id,
            label: disease.name,
            color: disease.color
        }))
    ];

    // Format the disease options with color indicators
    const diseaseOptions = diseaseTypes.map(disease => ({
        value: disease.value,
        label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                    style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: `rgba(${disease.color[0]}, ${disease.color[1]}, ${disease.color[2]}, ${disease.color[3]})`,
                        marginRight: '8px'
                    }}
                />
                {disease.label}
            </div>
        ),
    }));

    // Available basemaps
    const basemaps = ["dark-gray", "dark-gray-3d", "dark-gray-vector", "gray", "gray-3d", "gray-vector", "hybrid", "navigation-3d", "navigation-dark-3d", "oceans", "osm", "osm-3d", "satellite", "streets", "streets-3d", "streets-dark-3d", "streets-navigation-vector", "streets-night-vector", "streets-relief-vector", "streets-vector", "terrain", "topo", "topo-3d", "topo-vector"];


    // Fetch facilities data when component mounts
    useEffect(() => {
        const loadFacilities = async () => {
            try {
                setLoadingFacilities(true);
                const data = await fetchFacilities();
                setFacilities(data);
                setLoadingFacilities(false);
            } catch (error) {
                console.error("Error loading facilities:", error);
                setMapError("Failed to load healthcare facilities");
                setLoadingFacilities(false);
            }
        };

        loadFacilities();
        console.log("facilities", facilities);

    }, []);

    // Function to toggle between 2D and 3D views
    const toggleViewMode = () => {
        setIs3D(prev => !prev);
    };

    // Function to change the basemap
    const changeBasemap = (value) => {
        setCurrentBasemap(value);
    };

    // Function to toggle province labels
    const toggleLabels = (showLabels) => {
        setShowLabels(showLabels);
        if (polygonsLayerRef.current) {
            if (showLabels) {
                // Create a label class for the province names
                const labelClass = new LabelClass({
                    symbol: {
                        type: "text",
                        color: "white",
                        haloColor: "black",
                        haloSize: 1,
                        font: {
                            family: "sans-serif",
                            size: 12,
                            weight: "bold"
                        }
                    },
                    labelExpressionInfo: {
                        expression: "$feature.title"
                    },
                    labelPlacement: "center-center"
                });

                // Apply label class to graphics layer
                polygonsLayerRef.current.labelingInfo = [labelClass];
            } else {
                // Remove labels
                polygonsLayerRef.current.labelingInfo = null;
            }
        }
    };

    // Chuyển đổi giữa các kiểu dữ liệu hiển thị
    const changeDataType = (value) => {
        setSelectedDataType(value);
    };

    // Thay đổi loại bệnh hiển thị
    const changeDisease = (value) => {
        setSelectedDisease(value);
    };

    // Toggle facility visibility
    const toggleFacilities = (checked) => {
        setShowFacilities(checked);
        if (facilitiesLayerRef.current) {
            facilitiesLayerRef.current.visible = checked;
        }
    };

    // Tính màu sắc dựa trên số ca bệnh
    const getColorByValue = (value, dataType) => {
        // Các ngưỡng và màu sắc cho từng loại dữ liệu
        const thresholds = {
            totalCases: [100, 500, 1000, 3000, 5000],
            activeCases: [50, 200, 500, 1000, 2000],
            newCases: [10, 50, 100, 200, 500],
            vaccinationRate: [60, 70, 80, 90, 95] // Ngược lại - giá trị cao = tốt
        };

        // Màu sắc từ an toàn đến nguy hiểm (trừ tỷ lệ tiêm chủng thì ngược lại)
        let colorScale;

        if (dataType === "vaccinationRate") {
            // Xanh lá -> vàng -> đỏ (tỷ lệ cao = xanh lá)
            colorScale = [
                [220, 50, 50, 0.7],    // Đỏ - thấp nhất
                [240, 150, 50, 0.7],   // Cam
                [240, 230, 50, 0.7],   // Vàng
                [150, 230, 50, 0.7],   // Vàng-xanh
                [50, 200, 50, 0.7]     // Xanh lá - cao nhất
            ];
        } else {
            // Xanh lá -> vàng -> đỏ (số ca cao = đỏ)
            colorScale = [
                [50, 200, 50, 0.7],    // Xanh lá - thấp nhất
                [150, 230, 50, 0.7],   // Vàng-xanh
                [240, 230, 50, 0.7],   // Vàng
                [240, 150, 50, 0.7],   // Cam
                [220, 50, 50, 0.7]     // Đỏ - cao nhất
            ];
        }

        const currentThresholds = thresholds[dataType];

        // Xác định mức dựa trên giá trị
        let level = 0;
        for (let i = 0; i < currentThresholds.length; i++) {
            if (dataType === "vaccinationRate") {
                // Với tỷ lệ tiêm chủng, cao hơn = tốt hơn
                if (value >= currentThresholds[i]) {
                    level = i + 1;
                }
            } else {
                // Với số ca, thấp hơn = tốt hơn
                if (value >= currentThresholds[i]) {
                    level = i + 1;
                }
            }
        }

        return colorScale[level] || colorScale[0];
    };

    // Function to add facilities to the map
    const addFacilitiesToMap = (layer) => {
        if (!layer || facilities.length === 0) return;

        // Clear existing facilities
        layer.removeAll();

        // Add each facility as a point
        facilities.forEach(facility => {
            // Create point geometry
            const point = {
                type: "point",
                longitude: facility.coordinates[0],
                latitude: facility.coordinates[1]
            };

            // Use a consistent style for all facilities
            const pointSymbol = {
                type: "simple-marker",
                color: [65, 105, 225], // Royal Blue for all facilities
                outline: {
                    color: [255, 255, 255],
                    width: 1
                },
                size: "10px"
            };

            // Create popup template
            const popupTemplate = new PopupTemplate({
                title: facility.name,
                content: [
                    {
                        type: "text",
                        text: `
                            <div style="padding: 10px;">
                                <div style="margin-bottom: 8px;"><strong>Mục đích:</strong> ${facility.purpose}</div>
                                <div style="margin-bottom: 8px;"><strong>Chức năng:</strong> ${facility.function || "N/A"}</div>
                                <div style="margin-bottom: 8px;"><strong>Địa chỉ:</strong> ${facility.location}</div>
                                <div><strong>Tỉnh/Thành phố:</strong> ${facility.province}</div>
                            </div>
                        `
                    }
                ]
            });

            // Create the graphic
            const pointGraphic = new Graphic({
                geometry: point,
                symbol: pointSymbol,
                attributes: {
                    name: facility.name,
                    purpose: facility.purpose,
                    function: facility.function,
                    location: facility.location,
                    province: facility.province
                },
                popupTemplate: popupTemplate
            });

            // Add to layer
            layer.add(pointGraphic);
        });
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

                // Create and add facilities layer
                const facilitiesLayer = new GraphicsLayer({
                    title: "Healthcare Facilities",
                    visible: showFacilities
                });
                facilitiesLayerRef.current = facilitiesLayer;
                webmap.add(facilitiesLayer);

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

                    // Load each province file using fetch
                    for (let i = 0; i < provincesToLoad.length; i++) {
                        const provinceFile = provincesToLoad[i];
                        try {
                            const response = await fetch(`/src/utils/provinces/${provinceFile}`);
                            if (!response.ok) {
                                throw new Error(`Failed to load province: ${provinceFile}`);
                            }
                            const data = await response.json();

                            // Lấy tên tỉnh từ tên file
                            const provinceName = provinceFile.replace('.json', '');

                            // Lấy dữ liệu dịch tễ cho tỉnh này
                            const provinceEpidemicData = epidemicData[provinceName] || {
                                totalCases: 0,
                                activeCases: 0,
                                newCases: 0,
                                vaccinationRate: 0
                            };

                            // Xác định dữ liệu dựa trên loại bệnh đã chọn
                            let dataToUse = provinceEpidemicData;

                            // Nếu chọn một loại bệnh cụ thể (không phải "all"), lấy dữ liệu của bệnh đó
                            if (selectedDisease !== "all" && provinceEpidemicData[selectedDisease]) {
                                dataToUse = provinceEpidemicData[selectedDisease];
                            }

                            // Xác định màu sắc dựa trên loại dữ liệu hiển thị
                            const value = dataToUse[selectedDataType] || 0;

                            // Nếu chọn loại bệnh cụ thể, sử dụng màu của bệnh đó làm cơ sở
                            let fillColor;
                            if (selectedDisease !== "all") {
                                const diseaseColor = diseaseTypes.find(d => d.value === selectedDisease)?.color || [100, 100, 100, 0.7];
                                const opacity = Math.min(0.2 + (value / (selectedDataType === "totalCases" ? 5000 : 2000)) * 0.6, 0.8);
                                fillColor = [diseaseColor[0], diseaseColor[1], diseaseColor[2], opacity];
                            } else {
                                fillColor = getColorByValue(value, selectedDataType);
                            }

                            // Create polygon geometry
                            const polygonGeometry = {
                                type: "polygon",
                                rings: data.rings,
                                spatialReference: { wkid: 4326 } // WGS84
                            };

                            // Create symbol for the polygon
                            const polygonSymbol = {
                                type: "simple-fill",
                                color: fillColor,
                                outline: {
                                    color: [255, 255, 255, 0.8],
                                    width: 1
                                }
                            };

                            // Tạo template cho popup
                            const popupTemplate = new PopupTemplate({
                                title: data.title || provinceName,
                                content: [
                                    {
                                        type: "text",
                                        text: `
                                            <div style="padding: 10px;">
                                                <h3 style="margin-bottom: 10px; font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Thông tin dịch tễ</h3>
                                                ${selectedDisease !== "all" ?
                                                `<div style="margin-bottom: 10px; font-weight: bold; color: rgb(${diseaseTypes.find(d => d.value === selectedDisease)?.color.slice(0, 3).join(',')})">
                                                        ${diseaseTypes.find(d => d.value === selectedDisease)?.label || ''}
                                                    </div>` : ''}
                                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                                    <div style="font-weight: bold;">Tổng số ca:</div>
                                                    <div>${dataToUse.totalCases?.toLocaleString() || 0}</div>
                                                    
                                                    <div style="font-weight: bold;">Đang điều trị:</div>
                                                    <div>${dataToUse.activeCases?.toLocaleString() || 0}</div>
                                                    
                                                    <div style="font-weight: bold;">Đã hồi phục:</div>
                                                    <div>${dataToUse.recovered?.toLocaleString() || 0}</div>
                                                    
                                                    <div style="font-weight: bold;">Tử vong:</div>
                                                    <div>${dataToUse.deaths?.toLocaleString() || 0}</div>
                                                    
                                                    <div style="font-weight: bold;">Ca mới trong ngày:</div>
                                                    <div>${dataToUse.newCases?.toLocaleString() || 0}</div>
                                                    
                                                    ${dataToUse.vaccinationRate ?
                                                `<div style="font-weight: bold;">Tỷ lệ tiêm chủng:</div>
                                                        <div>${dataToUse.vaccinationRate?.toFixed(1) || 0}%</div>` : ''}
                                                </div>
                                                
                                                ${selectedDisease === "all" ? `
                                                <h3 style="margin: 15px 0 10px; font-size: 14px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Chi tiết theo bệnh</h3>
                                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 12px;">
                                                    ${epidemicData.diseaseTypes.map(disease => {
                                                    const diseaseData = provinceEpidemicData[disease.id] || { totalCases: 0 };
                                                    return `
                                                            <div style="font-weight: bold; color: rgb(${disease.color.slice(0, 3).join(',')})">
                                                                ${disease.name}:
                                                            </div>
                                                            <div style="grid-column: span 2;">
                                                                ${diseaseData.totalCases?.toLocaleString() || 0} ca
                                                            </div>
                                                        `;
                                                }).join('')}
                                                </div>
                                                ` : ''}
                                                
                                                <div style="margin-top: 12px; font-size: 13px; color: #666;">
                                                    <div style="font-weight: bold;">Tỷ lệ mắc/100,000 dân:</div>
                                                    <div>${dataToUse.incidenceRate || 0}</div>
                                                </div>
                                            </div>
                                        `
                                    }
                                ]
                            });

                            // Create graphic for the polygon with popup
                            const polygonGraphic = new Graphic({
                                geometry: polygonGeometry,
                                symbol: polygonSymbol,
                                attributes: {
                                    title: data.title || provinceName,
                                    region: data.region || "",
                                    totalCases: provinceEpidemicData.totalCases || 0,
                                    activeCases: provinceEpidemicData.activeCases || 0,
                                    newCases: provinceEpidemicData.newCases || 0,
                                    recovered: provinceEpidemicData.recovered || 0,
                                    deaths: provinceEpidemicData.deaths || 0,
                                    vaccinationRate: provinceEpidemicData.vaccinationRate || 0
                                },
                                popupTemplate: popupTemplate
                            });

                            // Add to the layer
                            provincesLayer.add(polygonGraphic);
                        } catch (error) {
                            console.error(`Error loading province ${provinceFile}:`, error);
                        }
                    }

                    // Apply labels if needed
                    if (showLabels) {
                        toggleLabels(true);
                    }

                    // Add healthcare facilities if enabled
                    if (showFacilities && facilities.length > 0) {
                        addFacilitiesToMap(facilitiesLayer);
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
    }, [is3D, currentBasemap, showLabels, selectedDataType, selectedDisease, showFacilities, facilities]);


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

            {loadingFacilities && (
                <div className="absolute top-5 right-5 z-50">
                    <Spin tip="Đang tải dữ liệu..." />
                </div>
            )}

            <div className="mapDiv" ref={mapDiv} style={{ height: '100vh', width: "100%" }}></div>

            <div className="absolute bg-white top-5 left-12 rounded-lg shadow-lg p-1 z-10 flex items-center">
                <div className="flex flex-col">
                    <div className="text-xs font-semibold ml-2 mb-1">Loại dữ liệu</div>
                    <Select
                        defaultValue={selectedDataType}
                        style={{ width: 170, height: 35 }}
                        onChange={changeDataType}
                        options={dataTypes}
                        dropdownStyle={{ zIndex: 2000 }}
                        suffixIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                    />
                </div>
                <div className="bg-white rounded-lg shadow-lg p-1 flex items-center">
                    <div className="flex flex-col">
                        <div className="text-xs font-semibold ml-2 mb-1">Loại bệnh</div>
                        <Select
                            defaultValue={selectedDisease}
                            style={{ width: 170, height: 35 }}
                            onChange={changeDisease}
                            options={diseaseOptions}
                            dropdownStyle={{ zIndex: 2000 }}
                            suffixIcon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Healthcare facilities toggle */}
            <div className="absolute bg-white top-5 right-12 rounded-lg shadow-lg p-3 z-10">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium mr-3">Cơ sở y tế</span>
                    <Switch
                        checked={showFacilities}
                        onChange={toggleFacilities}
                        loading={loadingFacilities}
                    />
                </div>
            </div>

            {/* Controls with Ant Design Select for basemap */}
            <div className="absolute bottom-6 left-6 z-10 flex space-x-4 p-2 rounded-lg items-end">
                {/* Legend */}
                <div className="z-10 bg-white rounded-lg shadow-lg p-3 flex flex-col" style={{ minWidth: "200px" }}>
                    <h3 className="text-sm font-bold mb-2">Chú thích</h3>
                    {selectedDisease !== "all" && (
                        <div className="flex items-center mb-2">
                            <div
                                className="w-4 h-4 mr-2"
                                style={{
                                    backgroundColor: `rgba(${diseaseTypes.find(d => d.value === selectedDisease)?.color.slice(0, 3).join(',')}, 0.7)`
                                }}
                            ></div>
                            <span className="text-xs font-semibold">
                                {diseaseTypes.find(d => d.value === selectedDisease)?.label}
                            </span>
                        </div>
                    )}
                    <div className="text-xs mb-1">{dataTypes.find(d => d.value === selectedDataType)?.label}</div>
                    <div className="flex flex-col">
                        {selectedDataType === "vaccinationRate" ? (
                            <>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(220, 50, 50, 0.7)` }}></div>
                                    <span className="text-xs">Dưới 60%</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(240, 150, 50, 0.7)` }}></div>
                                    <span className="text-xs">60% - 70%</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(240, 230, 50, 0.7)` }}></div>
                                    <span className="text-xs">70% - 80%</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(150, 230, 50, 0.7)` }}></div>
                                    <span className="text-xs">80% - 90%</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(50, 200, 50, 0.7)` }}></div>
                                    <span className="text-xs">Trên 90%</span>
                                </div>
                            </>
                        ) : selectedDataType === "totalCases" ? (
                            <>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(50, 200, 50, 0.7)` }}></div>
                                    <span className="text-xs">Dưới 100 ca</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(150, 230, 50, 0.7)` }}></div>
                                    <span className="text-xs">100 - 500 ca</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(240, 230, 50, 0.7)` }}></div>
                                    <span className="text-xs">500 - 1.000 ca</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(240, 150, 50, 0.7)` }}></div>
                                    <span className="text-xs">1.000 - 3.000 ca</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(220, 50, 50, 0.7)` }}></div>
                                    <span className="text-xs">Trên 3.000 ca</span>
                                </div>
                            </>
                        ) : selectedDataType === "activeCases" ? (
                            <>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(50, 200, 50, 0.7)` }}></div>
                                    <span className="text-xs">Dưới 50 ca</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(150, 230, 50, 0.7)` }}></div>
                                    <span className="text-xs">50 - 200 ca</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(240, 230, 50, 0.7)` }}></div>
                                    <span className="text-xs">200 - 500 ca</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(240, 150, 50, 0.7)` }}></div>
                                    <span className="text-xs">500 - 1.000 ca</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(220, 50, 50, 0.7)` }}></div>
                                    <span className="text-xs">Trên 1.000 ca</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(50, 200, 50, 0.7)` }}></div>
                                    <span className="text-xs">Dưới 10 ca</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(150, 230, 50, 0.7)` }}></div>
                                    <span className="text-xs">10 - 50 ca</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(240, 230, 50, 0.7)` }}></div>
                                    <span className="text-xs">50 - 100 ca</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(240, 150, 50, 0.7)` }}></div>
                                    <span className="text-xs">100 - 200 ca</span>
                                </div>
                                <div className="flex items-center my-1">
                                    <div className="w-4 h-4 mr-2" style={{ backgroundColor: `rgba(220, 50, 50, 0.7)` }}></div>
                                    <span className="text-xs">Trên 200 ca</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Facility legend */}
                    {showFacilities && (
                        <div className="mt-3 pt-2 border-t">
                            <div className="text-xs font-semibold mb-1">Cơ sở y tế</div>
                            <div className="flex items-center my-1">
                                <div className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: `rgb(65, 105, 225)` }}></div>
                                <span className="text-xs">Các cơ sở y tế</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toggle 2D/3D button */}
                <button
                    onClick={toggleViewMode}
                    className="flex items-center px-4 py-3 h-24 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-colors "
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
                <div className="bg-white rounded-lg shadow-lg p-1 flex items-center h-24">
                    <div className="flex flex-col">
                        <div className="text-xs font-semibold ml-2 mb-1">Bản đồ nền</div>
                        <Select
                            defaultValue={currentBasemap}
                            style={{ width: 150, height: 35 }}
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
        </div>
    );
}

export default MapComponent;
