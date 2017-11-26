import './index.less';
import angular from 'angular';
import template from './template.pug';
import uiBootstrapName from 'angular-ui-bootstrap';
import uiRouterName from '@uirouter/angularjs';
import thisModuleName from '../../src';
import padTimelineName from '../../src/padtimeline';

import 'leaflet';
import 'angular-simple-logger';
import 'ui-leaflet';
import moment from 'moment';
import 'angular-datetime-range';

import hurricanes from './hurricanes.json';

const hurricaneData = hurricanes;

//
// timeline is looking for start/end times. your data doesn't have that
// it has ISO_time which can be a start.  There is no end time so you have to
// create one. Hurricane reports are typically 3 hours apart so
//
hurricaneData.features.map(f => {
  f.properties.start = new Date(f.properties.ISO_time);
  f.properties.end = new Date(f.properties.start.getTime() + 10800000);

  f.properties.popupContent = f.properties.Name;
  return f;
});

/**
 * Route requests to the home page
 * @param {*} $stateProvider
 * @param {*} $urlServiceProvider
 */
function homeRouter($stateProvider, $urlServiceProvider) {
  'ngInject';
  $stateProvider.state('home', {
    url: '/',
    views: {
      'main@': 'home',
      'navbar@': 'navbar',
    },
  });
  $urlServiceProvider.rules.initial({ state: 'home' });
}

/**
 * Controller for the home page
 * @param {*} $log angular logging service
 * @param {*} $scope angular scope service
 */
class HomeController {
  /**
   * @constructor
   * @param {*} $log angular logging instance
   * @param {*} $scope angular scope instance
   */
  constructor($log, $scope) {
    'ngInject';
    if (DEBUG_LOGGING) {
      this.debug = $log.debug.bind($log, 'HomeController');
      this.debug('ctor');
    }
    //
    // Date Search setup
    //
    this.startTime = moment();
    this.endTime = moment().add(1, 'days').add(1, 'hours');

    this.presetsTime = [
      {
        'name': 'This Week',
        'start': moment().startOf('week').startOf('day'),
        'end': moment().endOf('week').endOf('day'),
      }, {
        'name': 'This Month',
        'start': moment().startOf('month').startOf('day'),
        'end': moment().endOf('month').endOf('day'),
      }, {
        'name': 'This Year',
        'start': moment().startOf('year').startOf('day'),
        'end': moment().endOf('year').endOf('day'),
      },
    ];
    //
    // timeline expects an array not a single item
    //
    this.timelineData = [hurricaneData];
    this.timelineOptions = {};
    this.maxbounds = {
      northEast: {
        lat: 90,
        lng: -180,
      },
      southWest: {
        lat: -90,
        lng: 180,
      },
    };
    this.markers = {};
    this.layers = {
      baselayers: {
        worldImagery: {
          name: 'World Imagery',
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          type: 'xyz',
          layerOptions: {
            minZoom: 2,
            maxZoom: 16,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            noWrap: true,
          },
        },
        osm: {
          name: 'Open Street Map',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          type: 'xyz',
          layerOptions: {
            minZoom: 2,
            maxZoom: 19,
            attribution: '&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
            noWrap: true,
          },
        },
        stamenTerrain: {
          name: 'Stamen Terrain',
          url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
          type: 'xyz',
          layerOptions: {
            minZoom: 2,
            maxZoom: 13,
            ext: 'png',
            subdomains: 'abcd',
            attribution: 'Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>',
            noWrap: true,
          },
        },
      },
    };
  }

  /**
   * search the timeline
   * @function search
   * @param {*} string the search string to pass
   */
  search(string) {
  }

  /**
   * clear the search
   * @function clear
   */
  clear() {
    this.searchText = '';
    search();
  }

  /**
   *  @private
   *  @param {*} deltas angular change instance
   */
  $onChanges(deltas) {
    if (DEBUG_LOGGING) {
      this.debug('$onChanges', ...Object.keys(deltas));
    }
  }

  /**
   * @private
   */
  $onInit() {
    if (DEBUG_LOGGING) {
      this.debug('$onInit');
    }
  }

  /**
   * @private
   */
  $postLink() {
    if (DEBUG_LOGGING) {
      this.debug('$postLink');
    }
  }

  /**
   * @private
   */
  $onDestroy() {
    if (DEBUG_LOGGING) {
      this.debug('$onDestroy');
    }
  }
}

const name = 'app.home';
angular
  .module(name, [
    'nemLogging',
    'ui-leaflet',
    'g1b.datetime-range',
    padTimelineName,
    uiRouterName,
    uiBootstrapName,
    thisModuleName,
  ])
  .component('home', {
    template: template,
    controller: HomeController,
  })
  .config(homeRouter);

export {
  name as default,
  // export additional info for testing
  name,
  homeRouter,
  HomeController,
};
