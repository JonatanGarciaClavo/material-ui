'use strict';

var shallowEqual = require('../utils/shallow-equal');

function relevantContextKeysEqual(classObject, currentContext, nextContext) {

  //Get those keys from current object's context that we care
  //about and check whether those keys have changed or not
  if (classObject.getRelevantContextKeys) {
    var currentContextKeys = classObject.getRelevantContextKeys(currentContext);
    var nextContextKeys = classObject.getRelevantContextKeys(nextContext);

    if (!shallowEqual(currentContextKeys, nextContextKeys)) {
      return false;
    }
  }

  //Check if children context keys changed
  if (classObject.getChildrenClasses) {
    var childrenArray = classObject.getChildrenClasses();
    for (var i = 0; i < childrenArray.length; i++) {
      if (!relevantContextKeysEqual(childrenArray[i], currentContext, nextContext)) {
        return false;
      }
    }
  }

  //context keys are equal
  return true;
}

module.exports = {

  //Don't update if state, prop, and context are equal
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState, nextContext) {
    var staticTheme = this.context.muiTheme && this.context.muiTheme['static'];
    var isExactlyOneThemeUndefined = !this.context.muiTheme && nextContext.muiTheme || this.context.muiTheme && !nextContext.muiTheme;

    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState) || isExactlyOneThemeUndefined || !staticTheme && !relevantContextKeysEqual(this.constructor, this.context.muiTheme, nextContext.muiTheme);
  }

};