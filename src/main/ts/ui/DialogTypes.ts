/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { Types } from '@ephox/bridge';

export interface ListValue {
  url: string;
  text?: string;
  value?: string;
}

export type ListItem = ListValue;

export interface ImageDialogInfo {
  baseUrl: string;
  appBaseUrl: string;
  query: string;
  windowEvent: { message: any };
}

export interface ImageDialogData {
}

export type API = Types.Dialog.DialogInstanceApi<ImageDialogData>;