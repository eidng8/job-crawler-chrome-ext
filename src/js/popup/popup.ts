/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import Messaging from '../shared/messaging';
import { Texts } from '../locales/texts';

/**
 * List of HTML ID of elements in the popup page.
 */
const enum Elements {
  /**
   * The message DIV
   */
  message = 'message',
}

/**
 * List of CSS classes used in popup page.
 */
const enum Classes {
  /**
   * Error message class.
   */
  error = 'error',
}

/**
 * This class is instantiated when the extension popup is shown. It handles
 * interaction in the popup window.
 */
export default class Popup {
  constructor() {
    this.updateState();
    document.getElementById('start').addEventListener('click', () => {
      Messaging.startCrawling()
        .then(state => {
          if (state.crawling) this.setMessage(Texts.crawling);
        })
        .catch(() => {
          this.setErrorMessage(Texts.cannotStart);
        });
    });
    // noinspection TypeScriptUnresolvedVariable
    chrome.extension.getBackgroundPage().console.log('popup initialized.');
  }

  /**
   * Queries the {@link Monitor} state and updates on-screen message
   * accordingly.
   * @private
   */
  private updateState(): void {
    Messaging.getState().then(state => {
      if (state.crawling) this.setMessage(Texts.crawling);
      else this.clearMessage();
    });
  }

  /**
   * Sets the on-screen message to the given message.
   * @param message
   * @private
   */
  private setMessage(message: string): HTMLDivElement {
    const element = document.getElementById(Elements.message) as HTMLDivElement;
    element.classList.remove(Classes.error);
    element.innerText = message;
    return element;
  }

  /**
   * Clears the on-screen message.
   * @private
   */
  private clearMessage(): HTMLDivElement {
    return this.setMessage('');
  }

  /**
   * Sets the on-screen message to the given message, and render it as error.
   * @param message
   * @private
   */
  private setErrorMessage(message: string): HTMLDivElement {
    const element = this.setMessage(message);
    element.classList.add(Classes.error);
    return element;
  }
}
