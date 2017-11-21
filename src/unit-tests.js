import thisModuleName from './index';
import 'angular-mocks';

/**
 * Uses webpack require.context to import all tests for the current module
 * @private
 * @ignore
 * @param {*} context
 * @summary Import all tests
 */
function importAllTests(context) {
  context.keys().forEach(key => {
    context(key);
  });
}

importAllTests(require.context('.', true, /\.(spec|test)\.js$/));

describe(thisModuleName, function() {
  it('has this test', () => {
    // eslint-disable-next-line no-invalid-this
    expect(this).toBeDefined();
  });
});

