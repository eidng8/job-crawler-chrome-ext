/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

/**
 * This is the centralized state managed by the {@link Monitor}.
 */
export interface IState {
  /**
   * This is `true` if any crawler is running on any page. Otherwise `false`.
   */
  crawling: boolean;

  /**
   * Information about the page being crawled.
   */
  currentPage?: { url: string; title?: string };
}
