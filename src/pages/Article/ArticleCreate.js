import React, { PureComponent } from 'react';
import { Form, Button, Input, Select, Checkbox, Collapse, Spin } from 'antd';
// import SimpleMDE from 'simplemde';
import router from 'umi/router';
import { connect } from 'dva';
import SimpleMDE from 'react-simplemde-editor';
import marked from 'marked';
import highlight from 'highlight.js';
import 'easymde/dist/easymde.min.css';

import styles from './ArticleCreate.less';

const CheckboxGroup = Checkbox.Group;
const { Panel } = Collapse;
const FormItem = Form.Item;
@connect(({ article, tag }) => ({
  article,
  tag,
}))
class ArticleCreate extends PureComponent {
  constructor() {
    super();
    this.state = {
      loading: false,
      key: '',
      title: '',
      author: 'chenw247',
      keyword: [],
      tags: [],
      desc: '',
      content: '',
      state: 1, // 文章发布状态 => 0草稿1已发布
      category: 1, // 文章分类 => 1码农2游戏3日常
    };
  }

  componentDidMount() {
    this.handleQueryTag();
  }

  handleQueryTag = () => {
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
        const { article, tag } = this.props;
        const { isArticleUpdate, articleDetail } = article;
        const { tagList } = tag;
        if (isArticleUpdate) {
          const {
            key,
            title,
            desc,
            author,
            keyword,
            state,
            tags,
            category,
            content,
          } = articleDetail;
          const tagArr = [];
          tagList.forEach(value => {
            if (tags.indexOf(value.name) !== -1) {
              tagArr.push(value._id);
            }
          });
          this.setState({
            key,
            title,
            author,
            desc,
            keyword,
            state,
            category,
            content,
            tags: tagArr,
            loading: false,
          });
        }
      }
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleChangeContent = value => {
    this.setState({ content: value });
  };

  handleChangeState = value => {
    this.setState({ state: value });
  };

  handleChangeCategory = value => {
    this.setState({ category: value });
  };

  handleChangeTag = value => {
    this.setState({ tags: value });
  };

  onSubmit = e => {
    e.preventDefault();
    const { title, author, desc, keyword, content, tags, category, state, key } = this.state;
    const { dispatch } = this.props;
    const params = {
      title,
      author,
      desc,
      keyword,
      content,
      tag: tags,
      category,
      state,
    };
    if (key !== '') {
      params.key = key;
      new Promise(resolve => {
        dispatch({
          type: 'article/updateArticle',
          payload: {
            resolve,
            params,
          },
        });
      }).then(() => {
        router.push('/article/list');
      });
    } else {
      new Promise(resolve => {
        dispatch({
          type: 'article/addArticle',
          payload: {
            resolve,
            params,
          },
        });
      }).then(() => {
        router.push('/article/list');
        // this.setState({
        //   title: '',
        //   author: '',
        //   desc: '',
        //   keyword: '',
        //   content: '',
        //   tags: [],
        // });
      });
    }
  };

  render() {
    const { tag } = this.props;
    const { author, desc, title, keyword, content, loading, tags } = this.state;
    const { tagList } = tag;
    const tagOptions = tagList.map(value => ({ label: value.name, value: value._id }));
    const tagContent = loading ? (
      <Spin size="large" spinning={loading} />
    ) : (
      <CheckboxGroup options={tagOptions} value={tags} onChange={this.handleChangeTag} />
    );
    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <FormItem className={styles.formItem}>
            <Input addonBefore="标题" value={title} name="title" onChange={this.onChange} />
          </FormItem>
          <FormItem className={styles.formItem}>
            <Input addonBefore="作者" value={author} name="author" onChange={this.onChange} />
          </FormItem>
          <FormItem className={styles.formItem}>
            <Input addonBefore="关键字" value={keyword} name="keyword" onChange={this.onChange} />
          </FormItem>
          <FormItem className={styles.formItem}>
            <Input addonBefore="描述" value={desc} name="desc" onChange={this.onChange} />
          </FormItem>
          <FormItem>
            <Select
              style={{ width: 200, marginBottom: 20 }}
              placeholder="选择发布状态"
              defaultValue="发布"
              onChange={this.handleChangeState}
            >
              <Select.Option value="0">草稿</Select.Option>
              <Select.Option value="1">发布</Select.Option>
            </Select>
            <Select
              style={{ width: 200, marginLeft: 10, marginBottom: 20 }}
              placeholder="文章分类"
              defaultValue="码农"
              onChange={this.handleChangeCategory}
            >
              <Select.Option value="1">码农</Select.Option>
              <Select.Option value="2">游戏</Select.Option>
              <Select.Option value="3">日常</Select.Option>
            </Select>
            <Collapse>
              <Panel header="选择标签">{tagContent}</Panel>
            </Collapse>
          </FormItem>
          <FormItem className={styles.formItem}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </FormItem>
          <FormItem>
            {/* <textarea id='editor' />  */}
            <SimpleMDE
              value={content}
              onChange={this.handleChangeContent}
              options={{
                autofocus: true,
                autosave: true,
                previewRender: plainText => {
                  return marked(plainText, {
                    renderer: new marked.Renderer(),
                    gfm: true,
                    pedantic: false,
                    sanitize: false,
                    tables: true,
                    breaks: true,
                    smartLists: true,
                    smartypants: true,
                    highlight: code => {
                      return highlight.highlightAuto(code).value;
                    },
                  });
                },
              }}
            />
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default ArticleCreate;
