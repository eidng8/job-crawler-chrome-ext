/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IState } from '../types/states';
import {
  ICallback,
  ICommand,
  ICommandCallback,
  IGetStateCallback,
  ISetStateCallback,
  IStateChangedCommand,
  MessageType,
} from '../types/messages';
import MessageSender = chrome.runtime.MessageSender;

/**
 * The "master process" run in background, overseeing every crawling operation.
 * Don't try to instantiate this class, as it consists of static members only.
 * This is initialized in {@link chrome.runtime.onInstalled} event.
 */
export default class Monitor {
  /**
   * The list of supported sites.
   * @private
   */
  private static readonly sites = ['.51job.com'];

  /**
   * The centralized crawler state.
   * @private
   */
  private static state: IState = { crawling: false };

  //region Initialization
  /**
   * Initializes the chrome extension.
   */
  public static init(): void {
    Monitor.registerRules();
    Monitor.registerMessages();
  }

  /**
   * Registers {@link chrome.declarativeContent} rules.
   * @private
   */
  private static registerRules(): void {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
      const matchers = [];
      for (const site of Monitor.sites) {
        matchers.push({
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { hostContains: site },
            }),
          ],
          actions: [new chrome.declarativeContent.ShowPageAction()],
        });
      }
      chrome.declarativeContent.onPageChanged.addRules(matchers);
    });
  }

  /**
   * Registers the message listener. All commands (messages) are handled here.
   * @private
   */
  private static registerMessages(): void {
    chrome.runtime.onMessage.addListener(
      (
        command: ICommand,
        sender: MessageSender,
        callback: ICommandCallback
      ) => {
        switch (command.type) {
          case MessageType.getState:
            Monitor.getState(callback);
            break;
          case MessageType.setState:
            Monitor.setState(command.payload, callback);
            break;
          case MessageType.closeTab:
            Monitor.closeTab(sender.tab, callback as ICallback);
            break;
        }
      }
    );
  }

  //endregion

  //region Command handlers
  /**
   * Handles the {@link MessageType.getState} command.
   * @param callback
   * @private
   */
  private static getState(callback?: IGetStateCallback): void {
    if (callback) callback({ success: true, payload: Monitor.state });
  }

  /**
   * Handles the {@link MessageType.setState} command.
   * @param payload
   * @param callback
   * @private
   */
  private static setState(payload: IState, callback?: ISetStateCallback): void {
    if (Monitor.state === payload) return;
    Monitor.state = payload;
    if (callback) callback({ success: true, payload: Monitor.state });
    Monitor.broadcastStateChanged();
  }

  /**
   * Close the calling tab.
   * @param tab
   * @param callback
   * @private
   */
  private static closeTab(tab: chrome.tabs.Tab, callback?: ICallback): void {
    chrome.tabs.remove(tab.id, () => {
      Monitor.broadcastTabClosed(tab);
      if (callback) callback();
    });
  }

  //endregion

  //region Command broadcasting
  /**
   * Broadcasts {@link MessageType.stateChanged} to all tabs.
   * @private
   */
  private static broadcastStateChanged(): void {
    this.broadcastToAllTabs({
      type: MessageType.stateChanged,
      payload: Monitor.state,
    } as IStateChangedCommand);
  }

  /**
   * Notifies all open tabs that there was a tab being closed.
   * @param tab
   * @private
   */
  private static broadcastTabClosed(tab: chrome.tabs.Tab): void {
    Monitor.broadcastToAllTabs({ type: MessageType.tabClosed, payload: tab });
  }

  /**
   * Broadcasts the given command to the active (highlighted) tab.
   * @param command
   * @private
   */
  private static broadcastToActiveTabs(command: ICommand): void {
    chrome.tabs.query({ active: true }, tabs => {
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, command);
        console.log('messaged sent to active tabs', tab, command);
      }
    });
  }

  /**
   * Broadcasts the given command to all tabs, except the active tab.
   * @param command
   * @private
   */
  private static broadcastToInactiveTabs(command: ICommand): void {
    chrome.tabs.query({ active: false }, tabs => {
      for (const tab of tabs) {
        chrome.tabs.sendMessage(tab.id, command);
        console.log('messaged sent sent to inactive tabs', tab, command);
      }
    });
  }

  /**
   * Broadcasts the given command to all tabs.
   * @param command
   * @private
   */
  private static broadcastToAllTabs(command: ICommand): void {
    this.broadcastToActiveTabs(command);
    this.broadcastToInactiveTabs(command);
  }

  //endregion
}
