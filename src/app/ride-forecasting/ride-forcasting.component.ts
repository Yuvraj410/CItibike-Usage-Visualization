import { Component, OnInit } from "@angular/core";
import * as dayjs from "dayjs";
import * as d3 from "d3";

@Component({
  selector: "ride-forecasting",
  templateUrl: "./ride-forecasting.component.html",
  styleUrls: ["./ride-forecasting.component.css"],
})
export class RideForecastingComponent implements OnInit {
  stationList = [];
  cleanedData = [];
  selectedStations = [];
  maxMultipleCount = 3;

  durationOptions = [
    {
      label: "1 month",
      value: 1,
    },
    {
      label: "2 months",
      value: 2,
    },
    {
      label: "3 months",
      value: 3,
    },
    {
      label: "6 months",
      value: 6,
    },
    {
      label: "1 year",
      value: 12,
    },
  ];

  selectedDuration = 1;

  constructor() {}

  ngOnInit() {

  }

  selectStation(value: string[]) {
    this.selectedStations = value;

    this.plotLineGraph();
  }

  selectMonth(value: number) {
    this.selectedDuration = value;

    this.plotLineGraph();
  }

  plotLineGraph() {
    document.querySelector("#graph").innerHTML = "";

    const svgWidth = 600;
    const svgHeight = 400;

    const svg = d3
      .select("#graph")
      .append("svg")
      .attr("width", svgWidth + 100)
      .attr("height", svgHeight + 100);

    const parseTime = d3.timeParse("%Y-%m-%d");

    const data = this.cleanedData[this.selectedStations[0]].map((i) => ({
      date: parseTime(i.started_at),
      value: +i.Rides,
    }));

    console.log(
      "Data",
      this.selectedStations,
      this.cleanedData[this.selectedStations[0]]
    );

    const xScale = d3
      .scaleTime()
      .domain([
        dayjs("02-01-2022"),
        dayjs("02-01-2022").add(this.selectedDuration, "month"),
      ])
      .range([0, svgWidth + 100]);

    const yScale = d3.scaleLinear().domain([0, 10]).range([svgHeight, 0]);

    const line = d3
      .line()
      .x(function (d: any) {
        return xScale(d.date);
      })
      .y(function (d: any) {
        console.log({ d });
        return yScale(parseInt(d.value));
      });

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", "translate(0," + svgHeight + ")")
      .call(xAxis);

    svg.append("g").call(yAxis);
  }
}
