import './index.less';
import angular from 'angular';
import template from './template.pug';
import uiBootstrapName from 'angular-ui-bootstrap';
import uiRouterName from '@uirouter/angularjs';
import thisModuleName from '../../src';

import hurricanes from './hurricanes.json';

const hurricaneData = hurricanes;

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
    this.timelineData = hurricaneData;
    this.timelineOptions = {};
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
