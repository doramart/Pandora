/**
 * 全局校验类
 */
'use strict';


module.exports = {
  // 校验字符中是否有特殊字符
  isRegularCharacter(str = '') {
    const pattern = new RegExp(
      "`~@#$^&*()=|{}';'\\[\\].<>/~！@#￥……&*（）——|{}【】‘”“'"
    );
    if (pattern.test(str)) {
      return false;
    }
    return true;
  },
};
