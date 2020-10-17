/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { IState } from './states';

/**
 * All commands
 */
export type ICommand =
  | IGetStateCommand
  | ISetStateCommand
  | IStateChangedCommand
  | ICloseTabCommand
  | ITabClosedCommand;

/**
 * All command callback function types
 */
export type ICommandCallback =
  | ICallback
  | IGetStateCallback
  | ISetStateCallback;

/**
 * Generic command response
 */
export interface ICommandResponse {
  /**
   * `true` if the command was executed successfully, otherwise `false`.
   */
  success: boolean;
}

/**
 * Generic command callback function
 */
export interface ICallback {
  (): void;
}

/**
 * Command to get {@link Monitor} state
 */
export interface IGetStateCommand {
  type: MessageType.getState;
}

/**
 * {@link Monitor} state query response
 */
export interface IGetStateResponse extends ICommandResponse {
  /**
   * Current {@link Monitor} state
   */
  payload: IState;
}

/**
 * {@link Monitor} state query callback function
 */
export interface IGetStateCallback {
  (response: IGetStateResponse): void;
}

/**
 * Command to set {@link Monitor} state
 */
export interface ISetStateCommand {
  type: MessageType.setState;
  /**
   * The new {@link Monitor} state
   */
  payload: IState;
}

/**
 * {@link Monitor} state modification response
 */
export interface ISetStateResponse extends ICommandResponse {
  /**
   * The new {@link Monitor} state
   */
  payload: IState;
}

/**
 * {@link Monitor} state modification callback function
 */
export interface ISetStateCallback {
  (response: ISetStateResponse): void;
}

/**
 * Signals the {@link Monitor} state has changed
 */
export interface IStateChangedCommand {
  type: MessageType.stateChanged;
  /**
   * Current {@link Monitor} state
   */
  payload: IState;
}

/**
 * Command to close the sender's tab
 */
export interface ICloseTabCommand {
  type: MessageType.closeTab;
}

/**
 * Signals there was a tab being closed.
 */
export interface ITabClosedCommand {
  type: MessageType.tabClosed;
  payload: chrome.tabs.Tab;
}

/**
 * List of all message (command) types
 */
export const enum MessageType {
  getState = 'get-state',
  setState = 'set-state',
  stateChanged = 'state-changed',
  closeTab = 'close-tab',
  tabClosed = 'tab-closed',
}
