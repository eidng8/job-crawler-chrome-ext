/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import PageCrawler from '../list-crawler';

export default class ListCrawler51Job extends PageCrawler {
  protected listItems(): NodeListOf<HTMLAnchorElement> {
    return document.querySelectorAll<HTMLAnchorElement>('.j_joblist>.e>a');
  }
}
