import './marked.css';
import React, { PureComponent } from 'react';
import { Icon, Popover, Tag } from 'antd';
import { timeToBeforeTime } from '@/utils/timeConversion';
import hljs from 'highlight.js';
import marked from 'marked';
import styles from './ArticleComment.less';

class ArticleCommentItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentWillMount() {
    // marked相关配置
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      highlight: code => {
        return hljs.highlightAuto(code).value;
      },
    });
  }

  handleClickReply = () => {
    const { onClickReply, data } = this.props;
    const Reference = { author: data.user.name, content: data.content };
    onClickReply(Reference);
  };

  handleClickDelete = () => {
    const { onClickDelete, data } = this.props;
    onClickDelete(data._id, data.article_id);
  };

  handleClickToTop = () => {
    const { onClickToTop, data } = this.props;
    onClickToTop(data._id, data.article_id);
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  render() {
    const { data } = this.props;
    const { visible } = this.state;
    const topString = data.is_top ? '取消置顶' : '置顶';
    return (
      <div
        className={styles.commentItem}
        // onMouseOut={this.handleMouseOut}
        // onMouseOver={this.handleMouseOver}
      >
        <div className={styles.cmAvatar}>
          <a target="_blank" rel="external nofollow">
            <img alt={data.user.name} src={data.user.avatar} />
          </a>
          {data.user.is_admin ? (
            <Tag color="#108ee9" style={{ marginTop: '0.4rem' }}>
              博主
            </Tag>
          ) : null}
        </div>
        <div className={styles.cmBody}>
          <div className={styles.cmHeader}>
            <a target="_blank" rel="external nofollow" className={styles.userName}>
              <span>{data.user.name}</span>
            </a>
            {data.is_top ? <Tag color="magenta">已置顶</Tag> : null}
            <span className={styles.cmTime}>{timeToBeforeTime(data.create_time)}</span>
          </div>
          <div className={styles.cmContent}>
            {data.Reference ? (
              <div className={styles.replyBox}>
                <p className={styles.replyName}>
                  <strong style={{ fontWeight: 'bolder' }}>{data.Reference.author}</strong>
                </p>
                <div
                  className={styles.replyContent}
                  dangerouslySetInnerHTML={{
                    __html: data.Reference.content ? marked(data.Reference.content) : null,
                  }}
                />
              </div>
            ) : null}
            <div
              dangerouslySetInnerHTML={{
                __html: data.content ? marked(data.content) : null,
              }}
            />
          </div>
          <div className={styles.cmFooter}>
            {/* <a className="like">
              <Icon type="like" />
              <span style={{ marginLeft: '.2em' }}>顶&nbsp;({data.likes.length})</span>
            </a> */}
            <a className={styles.reply} onClick={this.handleClickReply}>
              <Icon type="arrow-left" />
              <span style={{ marginLeft: '.2em' }}>回复</span>
            </a>
            <Popover
              content={
                <div>
                  <p className={styles.toTop} onClick={this.handleClickToTop}>
                    <Icon type="to-top" />
                    <span style={{ marginLeft: '.5em' }}>{topString}</span>
                  </p>
                  {/* <Divider type='horizontal' /> */}
                  <div className={styles.divider} />
                  <p className={styles.delete} onClick={this.handleClickDelete}>
                    <Icon type="delete" />
                    <span style={{ marginLeft: '.5em' }}>删除</span>
                  </p>
                </div>
              }
              trigger="click"
              visible={visible}
              onVisibleChange={this.handleVisibleChange}
              placement="bottom"
            >
              <Icon type="more" />
            </Popover>
          </div>
        </div>
      </div>
    );
  }
}

export default ArticleCommentItem;
