/* eslint-env jasmine */
/* eslint-disable no-invalid-this */
import angular from 'angular';
import * as thisModule from './index';
import 'angular-mocks';

describe(thisModule.name, function() {
  //
  // test PadtimelineController instances
  //
  describe('PadtimelineController', () => {
    let $ctrl;
    beforeEach(() => {
      angular.mock.module(thisModule.name);
      angular.mock.inject(_$log_ => {
        $ctrl = new thisModule.PadtimelineController(_$log_);
        spyOn($ctrl, 'debug');
        //
        // mock any controller requires here or in the individual unit tests
        // that use them
        //
        // $ctrl.requiredThing = this;
      });
    });

    it('should initialize the controller', () => {
      expect($ctrl.debug).toBeDefined();
    });

    describe('$onInit', () => {
      it('should have better tests', () => {
        $ctrl.$onInit();
        expect($ctrl.debug).toHaveBeenCalled();
      });
    });

    describe('$onChanges', () => {
      it('should have better tests', () => {
        $ctrl.$onChanges({ sample: { currentValue: false } });
        expect($ctrl.debug).toHaveBeenCalled();
      });
    });

    describe('$postLink', () => {
      it('should have better tests', () => {
        $ctrl.$postLink();
        expect($ctrl.debug).toHaveBeenCalled();
      });
    });

    describe('$onDestroy', () => {
      it('should have better tests', () => {
        $ctrl.$onDestroy();
        expect($ctrl.debug).toHaveBeenCalled();
      });
    });
  });
});
