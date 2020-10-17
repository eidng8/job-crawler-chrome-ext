/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import ListCrawler from '../list-crawler';
import { ICommand } from '../../types/messages';

export default class ListCrawler51Job extends ListCrawler {
  protected listItems(): NodeListOf<HTMLAnchorElement> {
    return document.querySelectorAll<HTMLAnchorElement>('.j_joblist>.e>a');
  }

  protected handleCommands(command: ICommand): void {}
}
