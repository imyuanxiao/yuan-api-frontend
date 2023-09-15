import {FormattedMessage} from "@@/exports";
import React from "react";



export const interfaceStatusEnum = {
  0: {
    text: (
      <FormattedMessage
        id="status.interface.offline"
        defaultMessage="关闭" />
    ),
    status: 'Error',
  },
  1: {
    text: (
      <FormattedMessage
        id="status.interface.online"
        defaultMessage="开启"
      />
    ),
    status: 'Success',
  },
}



export const userStatusEnum = {
  0: {
    text: (
      <FormattedMessage
        id="pages.searchTable.nameStatus.inUse"
        defaultMessage="正常"
      />
    ),
    status: 'Success',
  },
  1: {
    text: (
      <FormattedMessage
        id="pages.searchTable.nameStatus.disabled"
        defaultMessage="停用" />
    ),
    status: 'Error',
  },
  2: {
    text: (
      <FormattedMessage id="pages.searchTable.nameStatus.deleted"
                        defaultMessage="注销" />
    ),
    status: 'Default',
  },
}

export const userStatusOptions = [
  {
    value: 0,
    label: (
      <FormattedMessage
        id="pages.searchTable.nameStatus.inUse"
        defaultMessage="正常"
      />
    ),
  },
  {
    value: 1,
    label: (
      <FormattedMessage
        id="pages.searchTable.nameStatus.disabled"
        defaultMessage="停用"
      />
    ),
  },
  {
    value: 2,
    label: (
      <FormattedMessage
        id="pages.searchTable.nameStatus.deleted"
        defaultMessage="注销"
      />
    ),
  },
];


