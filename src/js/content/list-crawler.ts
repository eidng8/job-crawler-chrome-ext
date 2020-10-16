/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IState } from '../types/states';
import Messaging from '../shared/messaging';
import { ICommand, MessageType } from '../types/messages';

/**
 * This is the base class of crawlers that process listing pages, such as search
 * result pages.
 */
export default abstract class ListCrawler {
  /**
   * This is `true` if this crawler is working on the page. Otherwise `false`.
   * @private
   */
  private crawling = false;

  /**
   * Retrieves all items from the list page.
   * @protected
   */
  protected abstract listItems(): NodeListOf<HTMLAnchorElement>;

  /**
   * Attaches the crawler to the page and listen on commands.
   */
  public attach(): void {
    chrome.runtime.onMessage.addListener((
      command: ICommand /*, _, callback: ICommandCallback*/
    ) => {
      switch (command.type) {
        case MessageType.stateChanged:
          this.onStateChanged(command.payload);
          break;
      }
    });
    console.log('crawler has been attached to current page.', this);
  }

  /**
   * Starts processing the page.
   * @param state
   */
  public start(state: IState): void {
    if (state.crawling && !this.crawling) {
      this.crawling = true;
      this.crawl();
    }
  }

  /**
   * Processes the page.
   */
  public crawl(): void {
    const items = this.listItems();
    items.item(0).click();
    window.setTimeout(() => this.stop(), 10000);
  }

  /**
   * Stops processing the page, and signals the {@link Monitor} of stopping.
   */
  public stop(): void {
    this.crawling = false;
    Messaging.stopCrawling();
  }

  /**
   * Handles the {@link MessageType.stateChanged} command.
   * @param newState
   * @protected
   */
  protected onStateChanged(newState: IState): void {
    if (newState.crawling) {
      this.start(newState);
    } else {
      this.stop();
    }
  }
}
