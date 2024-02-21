import { Component, OnInit } from "@angular/core";
import * as mapboxgl from "mapbox-gl";
import { HttpClient } from "@angular/common/http";
import { MapService } from "../../ride-forecasting/map.service";
import {
  YEARS,
  COLORS,
} from "../../ride-forecasting/constants";
import { generate } from "../../../../node_modules/rxjs";
import * as d3 from "d3";

@Component({
  selector: "ride-map-box",
  templateUrl: "./map-box.component.html",
  styleUrls: ["./map-box.component.css"],
})
export class RideMapBoxComponent implements OnInit {
  // default settings
  map: mapboxgl.Map;
  style = "mapbox://styles/mapbox/dark-v9";
  lat = 40.73;
  lng = -73.98;

  // data
  source: any;
  year: string;

  //read-in data
  STATIONS = {};
  selectedYears: string[];

  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.initializeMap();
  }

  private loadSourceData() {
    YEARS.forEach((year) => {
      this.STATIONS[year] = "stations" + year;
      this.map.addSource(this.STATIONS[year], {
        type: "geojson",
        data: "./src/assets/stations/2022.geojson",
        generateId: true,
      });
    });

  }

  private initializeMap() {
    this.buildMap();
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: "map",
      style: this.style,
      zoom: 11.15,
      center: [this.lng, this.lat],
    });

    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.mapService.changeYears([]);

    // Add geojson data on map load
    this.map.on("load", (event) => {
      this.loadSourceData();
      var legend = document.getElementById("legend");
      var hoveredId = null;
      var clickedId = "2733.03";
      var hoveredYear = null;
      var clickedYear = null;
      var isStats = true;

      this.map.addLayer({
        id: "nyc",
        type: "fill",
        source: "nyc",
        paint: {
          "fill-color": "aqua",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "pop"], false],
            0.75,
            0,
          ],
        },
      });

      YEARS.forEach((year) => {
        this.map.addLayer({
          id: "stations" + year,
          type: "circle",
          source: "stations" + year,
          layout: {
            visibility: "none",
          },
          paint: {
            "circle-radius": [
              "case",
              ["boolean", ["feature-state", "click"], false],
              5,
              3,
            ],
            "circle-color": [
              "case",
              ["boolean", ["feature-state", "click"], false],
              "aqua",
              COLORS[year],
            ],
            "circle-stroke-width": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              2,
              4,
            ],
            "circle-stroke-color": COLORS[year],
            "circle-opacity": 0.4,
            "circle-stroke-opacity": 0.4,
          },
        });
      });

      // Create a popup, but don't add it to the map yet.
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      YEARS.forEach((year) => {
        this.map.on("mouseenter", "stations" + year, (e) => {
          this.map.getCanvas().style.cursor = "pointer";

          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties.addr;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup.setLngLat(coordinates).setHTML(description).addTo(this.map);

          if (e.features.length > 0) {
            if (hoveredId) {
              this.map.setFeatureState(
                { source: "stations" + hoveredYear, id: hoveredId },
                { hover: false }
              );
            }
            hoveredId = e.features[0].id;
            hoveredYear = year;
            this.map.setFeatureState(
              { source: "stations" + hoveredYear, id: hoveredId },
              { hover: true }
            );
          }
        });

        this.map.on("click", "stations" + year, (e) => {
          console.log(e.features[0]);

          const clickedStationId = e.features[0].properties.id;

          console.log(
            "addr",
            `../../assets/plots/Station_ID_${clickedStationId}_forecast.html`
          );

          document
            .getElementById("plot")
            .setAttribute(
              "src",
              `../../assets/plots/Station_ID_${clickedStationId}_forecast.html`
            );

          if (clickedId === "2733.03") {
            document.getElementById("graph").style.display = "block";
          }

          // highlight
          if (e.features.length > 0 && isStats) {
            if (hoveredId) {
              this.map.setFeatureState(
                { source: "stations" + hoveredYear, id: hoveredId },
                { hover: false }
              );
            }
            if (clickedId) {
              this.map.setFeatureState(
                { source: "stations" + clickedYear, id: clickedId },
                { click: false }
              );
            }
            hoveredId = null;
            hoveredYear = null;
            clickedId = e.features[0].properties.id;
            clickedYear = year;
            this.map.setFeatureState(
              { source: "stations" + clickedYear, id: clickedId },
              { click: true }
            );
            this.mapService.changeStation({
              Year: year,
              Id: e.features[0].properties.id,
              Name: e.features[0].properties.addr,
            });
          }
        });
      });
      this.map.setLayoutProperty("stations2022", "visibility", "visible");

      clickedYear = "2022";
      clickedId = "2733.03";

      this.map.setFeatureState(
        { source: "stations" + clickedYear, id: clickedId },
        { click: true }
      );
    });
  }
}
