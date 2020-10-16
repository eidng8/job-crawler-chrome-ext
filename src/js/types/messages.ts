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
  | IStateChangedCommand;

/**
 * All command response types
 */
export type ICommandResponse = IGetStateResponse | ISetStateResponse;

/**
 * All command callback function types
 */
export type ICommandCallback = IGetStateCallback | ISetStateCallback;

/**
 * Command to get {@link Monitor} state
 */
export interface IGetStateCommand {
  type: MessageType.getState;
}

/**
 * {@link Monitor} state query response
 */
export interface IGetStateResponse {
  success: boolean;
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
export interface ISetStateResponse {
  success: boolean;
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

export const enum MessageType {
  getState = 'get-state',
  setState = 'set-state',
  stateChanged = 'state-changed',
}
