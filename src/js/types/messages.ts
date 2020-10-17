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
  | ICloseTabCommand;

/**
 * All command callback function types
 */
export type ICommandCallback =
  | ICallback
  | IGetStateCallback
  | ISetStateCallback;

export interface ICommandResponse {
  /**
   * `true` if the command was executed successfully, otherwise `false`.
   */
  success: boolean;
}

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

export const enum MessageType {
  getState = 'get-state',
  setState = 'set-state',
  stateChanged = 'state-changed',
  closeTab = 'close-tab',
}
