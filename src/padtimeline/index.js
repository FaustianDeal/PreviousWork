import angular from 'angular';
import template from './template.pug';

import 'leaflet.timeline';
import './index.less';

//
// set default date format
//
const defaults = {
  format: 'EEE MMM dd yyyy',
};

/**
 * @class PadtimelineController
 */
class PadtimelineController {
  /**
   * Constructs instances of the PadtimelineController
   * @param {*} $log angular logging service
   * @param {Leaflet} L leaflet global instance
   * @param {*} $element angular DOM element wrapper
   * @param {*} $filter angular filter service
   * @param {*} leafletData ui-leaflet data access
   */
  constructor($log, L, $element, $filter, leafletData) {
    'ngInject';
    // istanbul ignore else
    if (DEBUG_LOGGING) {
      this.debug = $log.debug.bind($log, 'PadtimelineController');
      this.debug('ctor');
    } else {
      this.debug = angular.noop;
    }
    this.L = L;
    this.$element = $element;
    this.timelineOptions = angular.merge({}, defaults);
    this.formatter = $filter('date');
    this.slider = L.timelineSliderControl({
      formatOutput: date => this.formatter(date, this.timelineOptions.format),
      // don't allow control to bind keyboard events
      enableKeyboardControls: false,
      position: 'bottomleft',
    });
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
    if (deltas.options) {
      let options = deltas.options.currentValue;
      angular.merge(this.timelineOptions, defaults, options || {});
    }
    if (deltas.data) {
      this.leafletData.getMap().then(map => {
        let data = deltas.data.currentValue;
        if (data && data.length) {
          this.enableTimeline(map, data);
        } else {
          this.disableTimeline(map);
        }
      });
    }
  }

  /**
   * Bind feature attributes to content
   * @function bindFeature
   * @param {*} feature feature to bind
   * @param {L.Layer} layer leaflet layer to bind to
   */
  bindFeature(feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }
  }

  /**
   * Remove timeline from map and disable all controls
   * @function disableTimeline
   * @param {L.Map} map leaflet map
   */
  disableTimeline(map) {
    //
    // left on it's own, slider control attaches events to entire document
    // limit scope to the element containing the map
    //
    this.$element[0].removeEventListener('keydown', this.slider._onKeydown);
    //
    // remove all the timeline data before removing slider from map
    //
    if (this.slider.timelines && this.slider.timelines.length) {
      this.debug('disableTimeline');
      this.slider.timelines.forEach(s => map.removeLayer(s));
      this.slider.removeTimelines(...this.slider.timelines);
    }
    map.removeControl(this.slider);
  }

  /**
   * Add timeline control to map and configure it to display/play data
   * @function enableTimeline
   * @param {L.Map} map leaflet map
   * @param {*[]} data
   */
  enableTimeline(map, data) {
    this.disableTimeline(map);
    this.debug('enableTimeline', data.length);
    //
    // slider must be added to map before attaching any data
    //
    map.addControl(this.slider);
    data.map(featureCollection => {
      const timeline = this.L.timeline(featureCollection, {
        onEachFeature: this.bindFeature,
      });
      map.addLayer(timeline);
      this.slider.addTimelines(timeline);
    });

    this.$element[0].addEventListener('keydown', this.slider._onKeydown);
  }

  /**
   * Clean up all resources used by timeline
   * @private
   * @function $onDestroy
   */
  $onDestroy() {
    this.leafletData.getMap().then(map => this.disableTimeline(map));
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
const name = 'PAD.padtimeline';
angular
  .module(name, [])
  .component('padtimeline', {
    template: template,
    controller: PadtimelineController,
    bindings: {
      data: '<padTimelineData',
      options: '<padTimelineOptions',
    },
  });

export {
  name as default,
  // export additional items for debugging
  name,
  PadtimelineController,
};
