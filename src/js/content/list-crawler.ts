/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import BaseCrawler from './base-crawler';
import { ICommand, MessageType } from '../types/messages';
import ListItem from './list-item';

/**
 * This is the base class of crawlers that process listing pages, such as search
 * result pages.
 * @typeParam I type of items in the list
 * @typeParam T type to be held by items
 */
export default abstract class ListCrawler<
  T,
  I extends ListItem<T>
> extends BaseCrawler {
  /**
   * Items in the current list
   * @protected
   */
  protected items = {
    /**
     * Items to be processed
     */
    pending: [] as I[],
    /**
     * The item being processed
     */
    crawling: null as null | I,
    /**
     * Items that was processed
     */
    crawled: [] as I[],
  };

  /**
   * Retrieves all items from the list page.
   * @protected
   */
  protected abstract listItems(): I[];

  public crawl(): void {
    this.items = { pending: this.listItems(), crawling: null, crawled: [] };
    this.next();
  }

  protected handleCommands(command: ICommand): void {
    switch (command.type) {
      case MessageType.tabClosed:
        this.onTabClosed(command.payload);
        break;
    }
  }

  /**
   * Processes next item in the list. Stops the crawler if no more item to be
   * processed.
   * @protected
   */
  protected next(): void {
    this.items.crawling = this.items.pending.shift();
    if (this.items.crawling) {
      this.items.crawling.open();
    } else {
      this.stop();
    }
  }

  /**
   * Memorizes the closed tab and proceed to next item.
   * @param tab
   * @protected
   */
  protected onTabClosed(tab: chrome.tabs.Tab): void {
    console.log('a tab has been closed.', tab);
    if (this.items.crawling.isTab(tab)) {
      this.items.crawled.push(this.items.crawling);
      this.next();
    }
  }
}
