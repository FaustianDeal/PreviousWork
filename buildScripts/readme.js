/* eslint-disable no-console */
import path from 'path';
import fs from 'fs';
import pkg from '../package';
import js2md from 'jsdoc-to-markdown';

// BEGIN TEMPLATE
const template = `
# [${pkg.name}](${pkg.homepage||pkg.name}) v${pkg.version}

${pkg.description}

## Checkout & Build

\`\`\`bash
git clone ${pkg.repository.url}
npm install
npm run build
npm test
\`\`\`

## API

{{>main}}
`;
// END TEMPLATE

/**
 * Generate readme
 * @param {callback} done gulp completion callback
 */
function readme() {
  const markdown = path.resolve('./README.md');
  js2md.render({
    'files': [
      'src/**/*.js',
    ],
    'global-index-format': 'table',
    'heading-depth': 2,
    'member-index-format': 'grouped',
    'module-index-format': 'table',
    'name-format': true,
    'no-gfm': true,
    'param-list-format': 'table',
    'plugin': 'dmd-clean',
    'property-list-format': 'table',
    'template': template,
  }).then(output => {
    fs.writeFileSync(markdown, output, 'utf8');
  });
}

readme();
