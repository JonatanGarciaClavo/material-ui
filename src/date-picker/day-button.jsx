const React = require('react');
const StylePropable = require('../mixins/style-propable');
const Transition = require('../styles/transitions');
const DateTime = require('../utils/date-time');
const EnhancedButton = require('../enhanced-button');
const DefaultRawTheme = require('../styles/raw-themes/light-raw-theme');
const ThemeManager = require('../styles/theme-manager');

const DayButton = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    date: React.PropTypes.object,
    onTouchTap: React.PropTypes.func,
    selected: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext () {
    return {
      muiTheme: this.state.muiTheme,
    };
  },

  getDefaultProps() {
    return {
      selected: false,
      disabled: false,
    };
  },

  getInitialState() {
    return {
      hover: false,
      muiTheme: this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(DefaultRawTheme),
    };
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps (nextProps, nextContext) {
    let newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({muiTheme: newMuiTheme});
  },

  getTheme() {
    return this.state.muiTheme.datePicker;
  },

  render() {
    let {
      date,
      onTouchTap,
      selected,
      ...other,
    } = this.props;

    let styles = {
      root: {
        boxSizing: 'border-box',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        position: 'relative',
        float: 'left',
        width: 41,
        padding: '4px 2px',
      },

      label: {
        position: 'relative',
        color: this.state.muiTheme.rawTheme.palette.textColor,
      },

      buttonState: {
        position: 'absolute',
        height: 36,
        width: 36,
        top: 2,
        opacity: 0,
        borderRadius: '50%',
        transform: 'scale(0)',
        transition: Transition.easeOut(),
        backgroundColor: this.getTheme().selectColor,
      },
    };

    if (this.state.hover) {
      styles.label.color = this.getTheme().selectTextColor;
      styles.buttonState.opacity = '0.6';
      styles.buttonState.transform = 'scale(1)';
    }

    if (this.props.selected) {
      styles.label.color = this.getTheme().selectTextColor;
      styles.buttonState.opacity = 1;
      styles.buttonState.transform = 'scale(1)';
    }
    else if (this.props.disabled) {
      styles.root.opacity = '0.6';
    }

    if (DateTime.isEqualDate(this.props.date, new Date()) && !this.props.selected) {
        styles.label.color = this.getTheme().color;
    }

    return this.props.date ? (
      <EnhancedButton {...other}
        style={styles.root}
        hoverStyle={styles.hover}
        disabled={this.props.disabled}
        disableFocusRipple={true}
        disableTouchRipple={true}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
        onTouchTap={this._handleTouchTap}
        onKeyboardFocus={this._handleKeyboardFocus}>
        <div style={styles.buttonState} />
        <span style={styles.label}>{this.props.date.getDate()}</span>
      </EnhancedButton>
    ) : (
      <span style={styles.root} />
    );
  },

  _handleMouseEnter() {
    if (!this.props.disabled) this.setState({hover: true});
  },

  _handleMouseLeave() {
    if (!this.props.disabled) this.setState({hover: false});
  },

  _handleTouchTap(e) {
    if (!this.props.disabled && this.props.onTouchTap) this.props.onTouchTap(e, this.props.date);
  },

  _handleKeyboardFocus(e, keyboardFocused) {
    if (!this.props.disabled && this.props.onKeyboardFocus) this.props.onKeyboardFocus(e, keyboardFocused, this.props.date);
  },

});

module.exports = DayButton;
