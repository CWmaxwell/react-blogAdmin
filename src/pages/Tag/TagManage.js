import React, { PureComponent } from 'react';
import { Tag, Spin, Input, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import styles from './TagManage.less';

@connect(({ tag }) => ({
  tag,
}))
class TagManage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      clickTagId: -1,
      addTagValue: '',
    };
  }

  componentDidMount() {
    this.handleQuery();
  }

  deleteCancel = () => {
    message.info('取消删除');
  };

  deleteConfirm = () => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    const clickTagId = this.state;
    new Promise(resolve => {
      dispatch({
        type: 'tag/delTag',
        payload: {
          resolve,
          clickTagId,
        },
      });
    }).then(res => {
      if (res.code === 200) {
        this.handleQuery();
      }
    });
  };

  addTag = () => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    const { addTagValue } = this.state;
    const params = {
      name: addTagValue,
    };
    new Promise(resolve => {
      dispatch({
        type: 'tag/addTag',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      if (res.code === 200) {
        this.handleQuery();
      }
    });
  };

  handleQuery = () => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    new Promise(resolve => {
      dispatch({
        type: 'tag/queryTag',
        payload: {
          resolve,
        },
      });
    }).then(res => {
      if (res.code === 200) {
        this.setState({ loading: false });
      }
    });
  };

  render() {
    const { tag } = this.props;
    const { tagList, total } = tag;
    const { loading, addTagValue, clickTagId } = this.state;
    const content = loading ? (
      <div style={{ textAlign: 'center', height: '100%' }} key={clickTagId}>
        <Spin size="large" spinning={loading} />
      </div>
    ) : (
      <div>
        <div style={{ display: 'flex' }}>
          <h2>当前共有{total}种标签</h2>
          <Input
            className={styles.antInput}
            style={{ width: 200, marginLeft: 20 }}
            enterButton
            addonAfter="增加"
            allowClear
            onChange={e => {
              this.setState({ addTagValue: e.target.value });
            }}
            value={addTagValue}
            onPressEnter={this.addTag}
          />
        </div>
        {tagList.map(value => (
          <Popconfirm
            key={value.id}
            title={`确定要删除${value.name}标签吗`}
            onConfirm={this.deleteConfirm}
            onCancel={this.deleteCancel}
            okText="Yes"
            cancelText="No"
          >
            <Tag
              onClick={() => {
                this.setState({ clickTagId: value.id });
              }}
            >
              {value.name}
              <span> ({value.articleCount})</span>
            </Tag>
          </Popconfirm>
        ))}
      </div>
    );
    return content;
  }
}

export default TagManage;
