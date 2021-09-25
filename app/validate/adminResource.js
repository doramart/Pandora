/*
 * @Author: doramart
 * @Date: 2019-08-15 10:51:15
 * @Last Modified by: doramart
 * @Last Modified time: 2021-03-22 21:39:50
 */
'use strict';
const form = (ctx) => {
  return {
    source_type: {
      type: 'string',
      required: true,
      message: ctx.__('validate_inputCorrect', [ctx.__('label_resourceType')]),
    },
    comments: {
      type: 'string',
      required: true,
      min: 2,
      max: 30,
      message: ctx.__('validate_inputCorrect', [ctx.__('label_comments')]),
    },
  };
};

module.exports = {
  form,
};
