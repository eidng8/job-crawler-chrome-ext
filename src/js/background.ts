/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import Monitor from './background/monitor';

import '../img/icon-128.png';
import '../img/icon-34.png';

chrome.runtime.onInstalled.addListener(function () {
  console.log('jc extension installed.', new Date());

  // chrome.storage.sync.set({ color: '#3aa757' }, function () {
  //   console.log('The color is green.');
  // });

  Monitor.init();
});
