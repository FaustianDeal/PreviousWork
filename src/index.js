import './index.less';
import angular from 'angular';

/**
 * Import all sub-modules of this module that export a string or name
 * @ignore
 * @private
 * @param {*} context
 * @return {*} cache object
 */
function importAllSubModules(context) {
  const dependencies = {};
  context.keys().forEach(key => {
    let mod = context(key);
    // istanbul ignore else
    if (mod) {
      [mod, mod.name, mod.default].find(name => {
        //
        // looks for first string value in the pattern above and if found, adds
        // it to the list of modules taht will be required by angular.
        //
        if (typeof name === 'string') {
          dependencies[name] = key;
          return true;
        }
        return false;
      });
    }
  });
  return Object.keys(dependencies);
}

const name = PACKAGE_MODULE_NAME;
const names = importAllSubModules(require.context('.', true, /\/index.js$/));

//
// Register the main module with angular
// include any dependencies generated via imports
//
angular
  .module(name, [].concat(names));

export {
  name as default,
  //
  // export additional values for unit testing
  //
  name,
};
