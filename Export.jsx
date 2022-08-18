import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import IconFont from 'components/IconFont';

const { locale, util } = window.common;
export default class Export extends React.Component {
  constructor(props) {
    super(props);
    this.style = this.props.style;
    this.titles = this.props.titles;
    this.exportUrl = this.props.exportUrl;
    this.downloadUrl = this.props.downloadUrl;
    this.hasCountDown = this.props.hasCountDown;
    this.buttonText = this.props.buttonText || locale('导出');

    this.state = {
      loading: false,
      disabled: false,
      timer: '',
      countDownNum: '',
      countDownText: '',
    };
  }


  export = (type) => {
    if (this.props.onClick) {
      this.props.onClick();
    }
    if (this.hasCountDown) {
      this.countDown();
    }
    const params = this.props.getExportParams() || {};
    params.type = type;
    // params.antToken = window.user && window.user.token;
    const downloadUrl = `${window.apiServer}${this.downloadUrl}?${util.queryParams(params)}`;
    window.frames.download.location.href = downloadUrl;
  };

  countDown = () => {
    if (this.state.timer) {
      clearInterval(this.state.timer);
    }
    this.setState({ disabled: true, countDownNum: 10, countDownText: '10S' });
    this.setState({
      timer: setInterval(() => {
        if (this.state.countDownNum === 1) {
          this.setState({ disabled: false, countDownText: this.buttonText });
          clearInterval(this.state.timer);
        } else {
          this.setState({
            countDownNum: this.state.countDownNum - 1,
            countDownText: `${this.state.countDownNum - 1}S`,
          });
        }
      }, 1000),
    });
  };


  render() {
    const menu = (
      <Menu>
        <Menu.Item onClick={() => this.export('csv')}>
          {locale('导出CSV')}
        </Menu.Item>
        <Menu.Item onClick={() => this.export('excel')}>
          {locale('导出Excel')}
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} placement="bottomLeft">
        {
          this.props.children
          || (<Button
            className="square-btn"
            loading={this.state.loading}
            disabled={this.state.disabled}
            style={this.style}
          >{this.state.countDownText || <IconFont type="icondaochu1" />}</Button>
          )
        }
      </Dropdown>
    );
  }
}
