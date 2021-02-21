import { Injectable } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  dataSeriesMainChart: ChartDataSets[] = [
    {
      data:  [],
      label: 'Head'
    },
    {
      data: [],
      label: 'Setpoint'
    },
    {
      data: [],
      label: 'Boiler'
    },
    {
      data:  [],
      label: 'Product Out'
    },
    {
      data: [],
      label: 'Radiator'
    },
    {
      data: [],
      label: 'Reflux out'
    }
  ];

  dataSeriesSecondary: ChartDataSets[] = [

  ];

  dataSeriesConcentration: ChartDataSets[] = [
    {
      data:  [],
      label: 'Vapour Concentration'
    },
    {
      data: [],
      label: 'Boiler Concentration'
    }
  ];

  // Main chart config
  chartOptionsMainProcess = {
    responsive: true,
    animation: false,
    cubicInterpolationMode: 'monotone',
    downsample: {
      enabled: true,
      threshold: 50,
      preferOriginalData: false,
    },
    elements: {
      line: {
        fill: false,
      },
      point: {
        radius: 0
      }
    },
    scales: {
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          fontSize: 22,
          labelString: 'Temperature (°C)'
        },
        id: 'y-axis-1',
        type: 'linear',
        position: 'left',
        ticks: {min: 0, max: 100}
      }],
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          fontSize: 22,
          labelString: 'Run Time'
        },
        ticks: {
          maxTicksLimit: 30,
        }
      }]
    },
    gridlines: {
      drawBorder: true
    },
    legend: {
      display: true,
      position: 'top'
    },
    title: {
      display: true,
      text: 'Main Process',
      fontSize: 22
    }
  };

  chartOptionsConcentrations = {
    responsive: true,
    animation: false,
    cubicInterpolationMode: 'monotone',
    downsample: {
      enabled: true,
      threshold: 50,
      preferOriginalData: false,
    },
    elements: {
      line: {
        fill: false,
      },
      point: {
        radius: 0
      }
    },
    scales: {
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          fontSize: 22,
          labelString: 'Concentration (%)'
        },
        id: 'y-axis-1',
        type: 'linear',
        position: 'left',
        ticks: {min: 0, max: 100}
      }],
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          fontSize: 22,
          labelString: 'Run Time'
        },
        ticks: {
          maxTicksLimit: 30,
        }
      }]
    },
    gridlines: {
      drawBorder: true
    },
    legend: {
      display: true,
      position: 'top'
    },
    title: {
      display: true,
      text: 'Alcohol Concentrations',
      fontSize: 22
    }
  };
}
