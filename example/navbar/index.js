import './index.less';
import template from './template.pug';
import logo from '../images/blade-logo.png';
const name = 'app.navbar';

/**
 *
 */
class NavbarController {
  /**
   *
   */
  constructor() {
    'ngInject';
    this.logo = logo;
  }
}

angular
  .module(name, [])
  .component('navbar', {
    template: template,
    controller: NavbarController,
  });

export {
  name as default,
  name,
};

