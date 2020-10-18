/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { ICommand, MessageType } from '../types/messages';
import { IState } from '../types/states';
import Messaging from '../shared/messaging';

/**
 * Base class of all crawlers, defines command processing flow and logic.
 */
export default abstract class BaseCrawler {
  /**
   * This is `true` if this crawler is working on the page. Otherwise `false`.
   * @private
   */
  protected crawling = false;

  /**
   * Process the page. All actual processes should occur here.
   */
  public abstract crawl(): void;

  /**
   * Handles all commands dispatched to this crawler instance.
   * @param command
   * @protected
   */
  protected abstract handleCommands(command: ICommand): void;

  /**
   * Attaches the crawler to the page and listen on commands. This method is
   * called in `window.onload` event.
   */
  public attach(): void {
    chrome.runtime.onMessage.addListener(command => {
      switch (command.type) {
        case MessageType.stateChanged:
          this.onStateChanged(command.payload);
          break;
        default:
          this.handleCommands(command);
      }
    });
    console.info('Crawler has been attached to current page.');
  }

  /**
   * Starts processing the page.
   * @param state
   */
  public start(state: IState): void {
    if (state.crawling && !this.crawling) {
      console.info('Crawler is processing this page.');
      this.crawling = true;
      this.crawl();
    }
  }

  /**
   * Stops processing the page, and signals the {@link Monitor} of stopping.
   */
  public stop(): void {
    this.crawling = false;
    Messaging.stopCrawling().then(() =>
      console.info('Crawler has stopped processing this page.')
    );
  }

  /**
   * Default {@link MessageType.stateChanged} command handler. Starts or stops
   * the crawler according `newState.crawling`.
   * @param newState
   * @protected
   */
  protected onStateChanged(newState: IState): void {
    if (newState.crawling) {
      this.start(newState);
    } else if (this.crawling) {
      this.stop();
    }
  }
}
