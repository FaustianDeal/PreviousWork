import './index.less';
import angular from 'angular';

import L from 'leaflet';
import 'leaflet.timeline';


/**
 * @class PadtimelineController
 */
class PadtimelineController {
  /**
   * Constructs instances of the PadtimelineController
   * @param {*} $log angular logging service
   * @param {*} $filter angular filter service
   * @param {*} $element angular element service
   */
  constructor($log, $filter, $element) {
    'ngInject';
    // istanbul ignore else
    if (DEBUG_LOGGING) {
      this.debug = $log.debug.bind($log, 'PadtimelineController');
      this.debug('ctor');
    } else {
      this.debug = angular.noop;
    }
    this.$element = $element;
    this.formatter = $filter('date');
    this.slider = null;
  }

  /**
   * Called by angular when bindings change
   * @private
   * @param {*} deltas
   */
  $onChanges(deltas) {
    this.debug('$onChanges', ...Object.keys(deltas));
    let options = {
      formatOutput: date => this.formatter(date, 'EEE MMM dd yyyy'),
      // don't allow control to bind keyboard events
      enableKeyboardControls: false,
      position: 'bottomleft',
    };
    if (deltas.options) {
      options = {
        formatOutput: date => this.formatter(date, 'EEE MMM dd yyyy'),
        // don't allow control to bind keyboard events
        enableKeyboardControls: false,
        position: 'bottomleft',
        start: deltas.options.currentValue.start,
        end: deltas.options.currentValue.end,
      };
    }
    if (deltas.data) {
      let data = deltas.data.currentValue;
      this.leaflet.getMap().then(map => {
        this.debug('map', map);
        if (data && data.length) {
          this.enableTimeline(map, data, options);
        } else {
          if (this.slider) {
            this.disableTimeline(map);
          }
        }
      });
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
   * @param {*} options
   */
  enableTimeline(map, data, options) {
    if (this.slider) {
      this.disableTimeline(map);
    }
    this.debug('enableTimeline', options);
    //
    // slider must be added to map before attaching any data
    //
    this.slider = L.timelineSliderControl(options);
    map.addControl(this.slider);
    data.map(featureCollection => {
      const timeline = L.timeline(featureCollection, {
        onEachFeature: this.bindFeature,
      });
      map.addLayer(timeline);
      this.slider.addTimelines(timeline);
    });

    this.$element[0].addEventListener('keydown', this.slider._onKeydown);
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
   * Clean up all resources used by timeline
   * @private
   * @function $onDestroy
   */
  $onDestroy() {
    this.leaflet.getMap(pmap).then(map => this.disableTimeline(map));
  }
}

//
// register the component with angular
//
const name = 'PAD.padtimeline';
angular
  .module(name, [])
  .component('padtimeline', {
    // template: template,
    controller: PadtimelineController,
    require: {
      leaflet: '^leaflet',
    },
    bindings: {
      data: '<timelineData',
      options: '<timelineOptions',
    },
  });

export {
  name as default,
  // export additional items for debugging
  name,
  PadtimelineController,
};
