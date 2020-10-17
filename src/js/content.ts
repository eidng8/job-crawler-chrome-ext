/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

console.info('Crawler is active.');

import Brood from './content/brood';

window.addEventListener('load', () => Brood.spawn());
