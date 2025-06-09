import "@arcgis/map-components/components/arcgis-layer-list";
import "@arcgis/map-components/dist/components/arcgis-basemap-toggle";
import "@arcgis/map-components/dist/components/arcgis-locate";
import "@arcgis/map-components/dist/components/arcgis-map";
import "@arcgis/map-components/dist/components/arcgis-scale-bar";
import "@arcgis/map-components/dist/components/arcgis-zoom";
import "@esri/calcite-components/components/calcite-navigation";
import "@esri/calcite-components/components/calcite-navigation-logo";
import "@esri/calcite-components/components/calcite-shell";
import MapComponent from "../components/MapComponent";
import SceneView from "@arcgis/core/views/SceneView";
export default function Homepage() {

    return (
        <div>
            <MapComponent />
            

        </div>
    );
}