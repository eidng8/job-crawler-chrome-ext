/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import ListCrawler from '../list-crawler';
import ListItem from '../list-item';

export default class ListCrawler51Job extends ListCrawler<
  HTMLAnchorElement,
  ListItem<HTMLAnchorElement>
> {
  protected listItems(): ListItem<HTMLAnchorElement>[] {
    const items = [] as ListItem<HTMLAnchorElement>[];
    document
      .querySelectorAll<HTMLAnchorElement>('.j_joblist>.e>a')
      .forEach(a => {
        items.push(new ListItem(a));
      });
    return items;
  }
}
