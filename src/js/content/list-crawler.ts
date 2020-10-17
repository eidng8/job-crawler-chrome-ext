/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import BaseCrawler from './base-crawler';

/**
 * This is the base class of crawlers that process listing pages, such as search
 * result pages.
 */
export default abstract class ListCrawler extends BaseCrawler {
  /**
   * Retrieves all items from the list page.
   * @protected
   */
  protected abstract listItems(): NodeListOf<HTMLAnchorElement>;

  public crawl(): void {
    const items = this.listItems();
    items.item(0).click();
    window.setTimeout(() => this.stop(), 10000);
  }
}
