'use strict';

var React = require('react/addons');
var ContextPure = require('../mixins/context-pure');
var Styles = require('../utils/styles');
var DefaultRawTheme = require('../styles/raw-themes/light-raw-theme');
var ThemeManager = require('../styles/theme-manager');

var FlatButtonLabel = React.createClass({
  displayName: 'FlatButtonLabel',

  mixins: [ContextPure],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    label: React.PropTypes.node,
    style: React.PropTypes.object
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },

  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme)
    };
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({ muiTheme: newMuiTheme });
  },

  'static': {
    getRelevantContextKeys: function getRelevantContextKeys(muiTheme) {
      return {
        spacingDesktopGutterLess: muiTheme.rawTheme.spacing.desktopGutterLess
      };
    }
  },

  render: function render() {
    var _props = this.props;
    var label = _props.label;
    var style = _props.style;

    var contextKeys = this.getRelevantContextKeys(this.state.muiTheme);

    var mergedRootStyles = Styles.mergeAndPrefix({
      position: 'relative',
      padding: '0 ' + contextKeys.spacingDesktopGutterLess + 'px'
    }, style);

    return React.createElement(
      'span',
      { style: mergedRootStyles },
      label
    );
  }

});

module.exports = FlatButtonLabel;