import './marked.css';
import marked from 'marked';
import hljs from 'highlight.js';
import { Icon } from 'antd';
import React from 'react';
import styles from './ArticleComponent.less';

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

const ArticleComponent = articleDetail => {
  let tagContent = <span style={{ marginLeft: 0 }}>该文章没有标签</span>;
  if (articleDetail.tags && articleDetail.tags.length !== 0) {
    tagContent = articleDetail.tags.map((tag, index) => (
      <span
        key={tag}
        style={{
          marginLeft: index === 0 ? 0 : '2.5rem',
          fontSize: 18,
          textDecoration: 'underline',
        }}
      >
        <Icon type="tag" /> <span style={{ color: '#b3b3b3' }}>{tag}</span>
      </span>
    ));
  }
  return (
    <div className={styles.articleContainer}>
      <h3 className={styles.articleTitle}>{articleDetail.title}</h3>
      <div className={styles.meta}>
        <span className={styles.metaSpan}>{articleDetail.create_time.slice(0, 9)} </span>
        <span className={styles.metaSpan}>字数 {articleDetail.numbers}</span>
        <span className={styles.metaSpan}>阅读 {articleDetail.meta.views}</span>
        <span className={styles.metaSpan}>喜欢 {articleDetail.meta.likes}</span>
        <span className={styles.metaSpan}>评论 {articleDetail.meta.comments}</span>
      </div>
      <div className="article-content">
        <div
          id="content"
          className="article-detail"
          dangerouslySetInnerHTML={{
            __html: articleDetail.content ? marked(articleDetail.content) : null,
          }}
        />
      </div>
      {tagContent}
    </div>
  );
};

export default ArticleComponent;
