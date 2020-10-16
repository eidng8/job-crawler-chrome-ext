/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import ListCrawler51Job from './51job/list-crawler-51job';
import PageCrawler from './list-crawler';

/**
 * This factory class is responsible to spawn actual crawlers. It is called when
 * a page has finished loading (`window.onload` event).
 * Don't try to instantiate this class, as it consists of static members only.
 */
export default class Brood {
  /**
   * List of supported pages and their corresponding crawler. The keys are
   * `hostname` of URL, and the value are corresponding crawler class. Keys are
   * matched by words. So "abc.com" matches "any.abc.com" but not "anyabc.com".
   */
  static hostMap: { [key: string]: new () => PageCrawler } = {
    /**
     * 51job search result page.
     */
    'search.51job.com': ListCrawler51Job,
  };

  /**
   * Spawns a crawler according to {@link Brood.hostMap}.
   */
  static spawn(): void {
    for (const [host, crawler] of Object.entries(Brood.hostMap)) {
      const item = host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${item}\\b`, 'i');
      if (regex.test(window.location.hostname)) {
        const hatch = new crawler();
        hatch.attach();
      }
    }
  }
}
