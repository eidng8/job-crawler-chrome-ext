/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

/**
 * Base class for items to be held in lists.
 * @typeParam T type to be held by the item
 */
export default class ListItem<T> {
  /**
   * The original item.
   * @protected
   */
  protected raw: T;

  /**
   * The hashed identifier of the item.
   * @protected
   */
  protected id: string;

  constructor(item: T) {
    this.raw = item;
    this.id = this.hash(item);
  }

  /**
   * Make a hash unique to the current list, for use as item identifier.
   * This default returns the URL without query parameter.
   * @param item
   */
  protected hash(item: T): string {
    if (item instanceof HTMLAnchorElement) {
      const q = item.href.lastIndexOf('?');
      return item.href.substring(0, q > 0 ? q : undefined);
    }
    return '';
  }

  /**
   * Checks if the given tab refers to this item. This default check tries to
   * locate its hash inside the tab's URL, and returns `true` if found.
   * @param tab
   */
  public isTab(tab: chrome.tabs.Tab): boolean {
    return tab.url.indexOf(this.id) >= 0;
  }

  /**
   * Opens the item's page. This default behavior clicks the item if it's an
   * HTML anchor element.
   */
  public open(): void {
    if (this.raw instanceof HTMLAnchorElement) this.raw.click();
  }
}
