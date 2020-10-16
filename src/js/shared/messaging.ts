/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IState } from '../types/states';
import {
  ICommandResponse,
  IGetStateCommand,
  ISetStateCommand,
  MessageType,
} from '../types/messages';

/**
 * Provides messaging facilities for communications between background and
 * content scripts.
 * Don't try to instantiate this class, as it consists of static members only.
 */
export default class Messaging {
  /**
   * Signals the {@link Monitor} to update its crawling state to `true`.
   * Upon success, the new state will be passed to the promise; or the complete
   * response will be thrown otherwise. Please note that this does *not*
   * actually start any process. It's up to individual crawler to decide on
   * their own.
   */
  public static startCrawling(): Promise<IState> {
    return new Promise<IState>((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: MessageType.setState,
          payload: { crawling: true },
        } as ISetStateCommand,
        (response: ICommandResponse) => {
          if (response.success) {
            resolve(response.payload);
          } else {
            reject(response);
          }
        }
      );
    });
  }

  /**
   * Signals the {@link Monitor} to update its crawling state to `false`.
   * Upon success, the new state will be passed to the promise; or the complete
   * response will be thrown otherwise. Please note that this does *not*
   * actually stop any process. It's up to individual crawler to decide on
   * their own.
   */
  public static stopCrawling(): Promise<IState> {
    return new Promise<IState>((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: MessageType.setState,
          payload: { crawling: false },
        } as ISetStateCommand,
        (response: ICommandResponse) => {
          if (response.success) {
            resolve(response.payload);
          } else {
            reject(response);
          }
        }
      );
    });
  }

  /**
   * Asks {@link Monitor} about its current state. Upon success, the current
   * state will be passed to the promise; or the complete response will be
   * thrown otherwise.
   */
  public static getState(): Promise<IState> {
    return new Promise<IState>((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: MessageType.getState } as IGetStateCommand,
        (response: ICommandResponse) => {
          if (response.success) {
            resolve(response.payload);
          } else {
            reject(response);
          }
        }
      );
    });
  }
}
