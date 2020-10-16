/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const fs = require('fs');
const output = 'build';
if (fs.existsSync(output)) fs.rmdirSync(output, { recursive: true });

const config = require('../webpack.config');
if (process.argv.indexOf('--watch') > 0) {
  config.watch = true;
}

require('webpack')(config, err => {
  if (err) throw err;
});
