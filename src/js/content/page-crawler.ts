/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import BaseCrawler from './base-crawler';
import Messaging from '../shared/messaging';

/**
 * This is the base class of all crawlers that process content pages, such as
 * the job detail page. This kind of crawlers starts processing once the page is
 * loaded if crawling was started, closes the tab after it's done, and
 * doesn't react to state changes.
 */
export default abstract class PageCrawler extends BaseCrawler {
  /**
   * Starts processing the page if crawling was started. This method is
   * called in `window.onload` event.
   */
  public attach(): void {
    Messaging.getState().then(state => {
      this.start(state);
      if (this.crawling) {
        this.stop();
        console.info('closing tab');
        Messaging.closeTab().then(() => console.info('tab closed'));
      }
    });
  }

  public stop(): void {
    this.crawling = false;
  }

  /**
   * Page crawler doesn't react to state changes.
   * @protected
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onStateChanged(): void {}
}
