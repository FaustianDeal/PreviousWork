import './index.less';
import angular from 'angular';
import template from './template.pug';

import 'leaflet';
import 'ui-leaflet';
import 'angular-simple-logger';

/**
 * @class PadMapController
 */
class PadMapController {
  /**
   * Constructs instances of the PadMapController
   * @param {*} $log angular logging service
   * @param {*} leafletData
   */
  constructor($log, leafletData) {
    'ngInject';
    // istanbul ignore else
    if (DEBUG_LOGGING) {
      this.debug = $log.debug.bind($log, 'PadMapController');
      this.debug('ctor');
    } else {
      this.debug = angular.noop;
    }
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
   * Called by angular each time a one-way (< or @) binding changes
   * @private
   * @param {*} deltas angular change instance
   */
  $onChanges(deltas) {
    // istanbul ignore else
    if (DEBUG_LOGGING) {
      this.debug('$onChanges', ...Object.keys(deltas));
    }
  }

  /**
   * Called by angular to complete initialization of component
   * @private
   */
  $onInit() {
    // istanbul ignore else
    if (DEBUG_LOGGING) {
      this.debug('$onInit');
    }
  }

  /**
   * Called by angluar after component DOM has been rendered
   * @private
   */
  $postLink() {
    // istanbul ignore else
    if (DEBUG_LOGGING) {
      this.debug('$postLink');
    }
  }

  /**
   * Called by angular to clean up component resources
   * @private
   */
  $onDestroy() {
    // istanbul ignore else
    if (DEBUG_LOGGING) {
      this.debug('$onDestroy');
    }
  }
}

//
// register the component with angular
//
const name = 'PAD.pad-map';
angular
  .module(name, ['nemLogging',
    'ui-leaflet'])
  .component('padMap', {
    template: template,
    controller: PadMapController,
    bindings: {
    },
  });

export {
  name as default,
  // export additional items for debugging
  name,
  PadMapController,
};
