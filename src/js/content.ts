/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

console.log('crawler active.');

console.log(window.location.hostname);

import Brood from './content/brood';

window.addEventListener('load', () => Brood.spawn());
