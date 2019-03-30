import './marked.css';
import React, { PureComponent } from 'react';

import { List, Icon, Divider, Tag } from 'antd';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import hljs from 'highlight.js';
import marked from 'marked';
import styles from './ArticleComment.less';
import ArticleCommentItem from './ArticleCommentItem';

class ArticleComment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      emojiVisible: false,
      reference: null,
    };
    this.onSubmit = this.onSubmit.bind(this);
    // this.onChange = this.onChange.bind(this);
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

  onSubmit(e) {
    e.preventDefault();
    const { reference } = this.state;
    const { articleId, onClickSubmit } = this.props;
    if (this.markdown.innerHTML === '') {
      alert('内容?');
      return;
    }
    const comment = {
      Reference: reference,
      content: this.markdown.innerHTML,
      article_id: articleId,
    };
    onClickSubmit(comment);
    this.markdown.innerHTML = '';
  }

  handlePictureClick = () => {
    this.markdown.innerHTML += '<br/>![]()';
  };

  handleLinkClick = () => {
    this.markdown.innerHTML += '[]()';
  };

  handleCodeClick = () => {
    this.markdown.innerHTML += '<br>```javascript<br><br>```';
  };

  handleEmojiMouseOver = () => {
    this.setState({ emojiVisible: true });
  };

  handleEmojiMouseOut = () => {
    this.setState({ emojiVisible: false });
  };

  handleEmojiPick = emoji => {
    this.markdown.innerHTML += emoji.native;
  };

  handleWillReplyClose = () => {
    this.setState({ reference: null });
  };

  onClickReply = reference => {
    this.setState({ reference });
  };

  onPasteMarkDown = e => {
    e.preventDefault();
    // 以下只适用于chrome之类的浏览器，IE还没做适配
    document.execCommand('insertText', false, e.clipboardData.getData('Text'));
  };

  render() {
    const { emojiVisible, reference } = this.state;
    const { listData, onClickToTop, onClickDelete, loading } = this.props;
    // const reference = {author: 'chenwen', content: 'ceshi'};
    const isEmojiBoxVisibleStr = emojiVisible ? 'visible' : 'hidden';
    const userAvatar =
      'https://www.gravatar.com/avatar/a7fd9e4afc0aff417afededc15270312%3Fs=200&r=pg&d=mm';
    const willReplyContent = reference ? (
      <div className={styles.willReply}>
        <div className={styles.replyUser}>
          <span>
            <span>回复 </span>
            <strong>{reference.author}</strong>
          </span>
          <Icon type="close" onClick={this.handleWillReplyClose} />
        </div>
        <div
          className={styles.replyPreview}
          dangerouslySetInnerHTML={{
            __html: reference.content ? marked(reference.content) : null,
          }}
        />
      </div>
    ) : null;
    return (
      <div className={styles.commentBox}>
        <Divider orientation="left">{listData.length} 条评论</Divider>
        <form className={styles.commentPost} onSubmit={this.onSubmit}>
          <div className={styles.editorBox}>
            <div className={styles.userPic}>
              <div className={styles.gravatar}>
                <img alt="admin" src={userAvatar} />
              </div>
              <Tag color="#108ee9">博主</Tag>
            </div>
            <div className={styles.editor}>
              {willReplyContent}
              <div className={styles.markdown}>
                <div
                  ref={markdown => {
                    this.markdown = markdown;
                  }}
                  contentEditable
                  placeholder="写入你的回复..."
                  className={styles.markdownEditor}
                  onPaste={this.onPasteMarkDown}
                />
              </div>
              <div className={styles.editorTools}>
                <div
                  className={styles.emoji}
                  onBlur={() => 0}
                  onFocus={() => 0}
                  onMouseOver={this.handleEmojiMouseOver}
                  onMouseOut={this.handleEmojiMouseOut}
                >
                  <Icon type="smile" />
                  <Picker
                    style={{
                      visibility: isEmojiBoxVisibleStr,
                      position: 'absolute',
                      left: 0,
                      padding: '0.5rem',
                      zIndex: 999,
                    }}
                    set="emojione"
                    onSelect={this.handleEmojiPick}
                  />
                </div>
                <div className={styles.picture} onClick={this.handlePictureClick}>
                  <Icon type="picture" />
                </div>
                <div className={styles.link} onClick={this.handleLinkClick}>
                  <Icon type="link" />
                </div>
                <div className={styles.code} onClick={this.handleCodeClick}>
                  <Icon type="code" />
                </div>
                <button type="submit" className={styles.submit} name="submit">
                  <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>发布</span>
                  <Icon type="edit" />
                </button>
              </div>
            </div>
          </div>
        </form>
        <div
          className={styles.listBox}
          ref={el => {
            this.list = el;
          }}
        >
          <List
            itemLayout="vertical"
            dataSource={listData}
            loading={loading}
            renderItem={item => (
              <ArticleCommentItem
                // onClickComment={this.props.onClickComment}
                // onClickLike={this.props.onClickLike}
                onClickReply={this.onClickReply}
                onClickToTop={onClickToTop}
                onClickDelete={onClickDelete}
                data={item}
              />
            )}
          />
        </div>
      </div>
    );
  }
}

export default ArticleComment;
