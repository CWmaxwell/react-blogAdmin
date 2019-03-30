import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Table, Divider, Tag, Input, Select, Button, Spin, Popconfirm } from 'antd';
import { connect } from 'dva';
import styles from './ArticleManage.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { timeToDateTime } from '@/utils/timeConversion';
import ArticleComponent from './ArticleComponent';
import ArticleComment from './ArticleComment';

const pagination = {
  showSizeChanger: true,
  defaultCurrent: 1,
  total: 17,
  showQuickJumper: true,
  pageSizeOptions: ['5', '10', '20'],
};

@connect(({ article }) => ({
  article,
}))
class ArticleManage extends PureComponent {
  constructor(props) {
    super(props);
    // 标题 作者 关键字 标签 分类 状态 观看/点赞/评论 创建时间 操作
    this.columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '作者',
        dataIndex: 'author',
        key: 'author',
      },
      {
        title: '关键字',
        dataIndex: 'keyword',
        key: 'keyword',
      },
      {
        title: '标签',
        dataIndex: 'tags',
        key: 'tags',
        render: tags => {
          if (!tags) return null;
          return (
            <span>
              {tags.map(tag => {
                const color = 'cyan';
                return (
                  <Tag color={color} key={tag}>
                    {tag}
                  </Tag>
                );
              })}
            </span>
          );
        },
      },
      {
        title: '分类',
        dataIndex: 'category',
        key: 'category',
        render: category => {
          let text = '码农';
          if (category === 2) {
            text = '游戏';
          } else if (category === 3) {
            text = '日常';
          }
          return <Tag color="blue">{text}</Tag>;
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: state => {
          const color = state === 1 ? 'green' : 'volcano';
          const text = state === 1 ? '已发布' : '草稿';
          return <Tag color={color}>{text}</Tag>;
        },
      },
      {
        title: '阅读/点赞/评论',
        dataIndex: 'meta',
        key: 'meta',
        render: meta => (
          <span>
            {meta.views}
            <Divider type="vertical" />
            {meta.likes}
            <Divider type="vertical" />
            {meta.comments}
          </span>
        ),
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: time => timeToDateTime(time),
      },
      {
        title: '操作',
        key: 'action',
        render: record => (
          <span>
            <span className={styles.articleAction} onClick={() => this.handleUpdate(record.key)}>
              修改
            </span>
            <Divider type="vertical" />
            <span className={styles.articleAction} onClick={() => this.handleComments(record.key)}>
              评论
            </span>
            <Divider type="vertical" />
            <span className={styles.articleAction} onClick={() => this.handleDetail(record.key)}>
              详情
            </span>
            <Divider type="vertical" />
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <span className={styles.articleAction}>Delete</span>
            </Popconfirm>
          </span>
        ),
      },
    ];

    this.state = {
      searchKeyword: '',
      selectState: 2,
      showModel: 1, // 1: 文章列表 2: 文章评论 3:文章详情
      articleId: null,
      //   page: 1,
      loading: false,
    };
  }

  componentDidMount() {
    this.handleQueryArticle();
  }

  handleQueryArticle = () => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    new Promise(resolve => {
      dispatch({
        type: 'article/queryArticle',
        payload: {
          resolve,
        },
      });
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({ loading: false });
      }
    });
  };

  onClickAddArticle = () => {
    router.push('/article/articlecreate');
  };

  onClickSearch = () => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    const { searchKeyword, selectState } = this.state;
    const params = { searchKeyword, selectState };
    new Promise(resolve => {
      dispatch({
        type: 'article/queryArticle',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({ loading: false });
      }
    });
  };

  handleUpdate = id => {
    console.log(`点击了${id}修改`);
    this.setState({ loading: true });
    const { dispatch } = this.props;
    const params = { articleId: id };
    new Promise(resolve => {
      dispatch({
        type: 'article/updateArticleDetail',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({ loading: false });
        router.push('/article/articlecreate');
      }
    });
  };

  handleComments = id => {
    console.log(`点击了${id}评论`);
    this.setState({ showModel: 2, loading: true });
    const { dispatch } = this.props;
    const params = { articleId: id };
    new Promise(resolve => {
      dispatch({
        type: 'article/queryArticleComments',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({ loading: false });
      }
    });
  };

  handleDetail = id => {
    console.log(`点击了${id}详情`);
    this.setState({ showModel: 3, loading: true });
    const { dispatch } = this.props;
    const params = { articleId: id };
    new Promise(resolve => {
      dispatch({
        type: 'article/queryArticleDetail',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      if (res && res.code === 200) {
        this.setState({ loading: false });
      }
    });
  };

  handleDelete = id => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    const params = { articleId: id };
    new Promise(resolve => {
      dispatch({
        type: 'article/deleteArticle',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      if (res && res.code === 200) {
        // this.setState({ loading: false });
        this.handleQueryArticle();
      }
    });
  };

  onClickSubmit = params => {
    this.setState({ loading: true });
    const { dispatch } = this.props;
    new Promise(resolve => {
      dispatch({
        type: 'article/postComment',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      if (res && res.code === 200) {
        // this.setState({ loading: false });
        this.handleComments(params.article_id);
      }
    });
  };

  onClickCommentItemToTop = (commentId, articleId) => {
    this.setState({ loading: true, articleId });
    const { dispatch } = this.props;
    const params = { commentId };
    new Promise(resolve => {
      dispatch({
        type: 'article/toTopComment',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      if (res && res.code === 200) {
        // this.setState({ loading: false });
        this.handleComments(articleId);
      }
    });
  };

  onClickCommentItemDelete = (commentId, articleId) => {
    this.setState({ loading: true, articleId });
    const { dispatch } = this.props;
    const params = { commentId };
    new Promise(resolve => {
      dispatch({
        type: 'article/deleteComment',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      if (res && res.code === 200) {
        // this.setState({ loading: false });
        this.handleComments(articleId);
      }
    });
  };

  handleSearchInput = e => {
    this.setState({
      searchKeyword: e.target.value,
    });
  };

  handleChangeState = value => {
    this.setState({
      selectState: value,
    });
  };

  render() {
    const { article } = this.props;
    const { articleList, total, articleDetail, articleComments } = article;
    pagination.total = total;
    const { searchKeyword, loading, showModel, articleId } = this.state;
    let content = (
      <div className={styles.container}>
        <div className={styles.search}>
          <Input
            className={styles.searchKeyword}
            placeholder="标题/描述"
            value={searchKeyword}
            onChange={this.handleSearchInput}
          />
          <Select
            style={{ width: 200, marginLeft: 10, marginBottom: 20 }}
            placeholder="选择状态"
            // defaultValue="2"
            // value={selectState}
            onChange={this.handleChangeState}
          >
            <Select.Option value="2">全部状态</Select.Option>
            <Select.Option value="1">已发布</Select.Option>
            <Select.Option value="0">草稿</Select.Option>
          </Select>
          <Button
            type="primary"
            icon="search"
            style={{ marginLeft: 10 }}
            onClick={this.onClickSearch}
          >
            Search
          </Button>
          <Button type="primary" style={{ marginLeft: 10 }} onClick={this.onClickAddArticle}>
            新增
          </Button>
        </div>
        <Table
          dataSource={articleList}
          columns={this.columns}
          bordered
          pagination={pagination}
          loading={loading}
        />
      </div>
    );
    if (showModel === 3) {
      content = (
        <div className={styles.container}>
          <Button
            type="primary"
            style={{ marginLeft: 10, alignSelf: 'flex-start' }}
            onClick={() => this.setState({ showModel: 1, loading: false })}
          >
            返回
          </Button>
          {loading ? (
            <Spin size="large" />
          ) : (
            <ArticleComponent
              meta={articleDetail.meta}
              numbers={articleDetail.numbers}
              content={articleDetail.content}
              create_time={articleDetail.create_time}
              title={articleDetail.title}
              tags={articleDetail.tags}
            />
          )}
        </div>
      );
    } else if (showModel === 2) {
      content = (
        <div className={styles.container}>
          <Button
            type="primary"
            style={{ marginLeft: 10, alignSelf: 'flex-start' }}
            onClick={() => this.setState({ showModel: 1, loading: false })}
          >
            返回
          </Button>
          {/* {loading ? (
            <Spin size="large" />
          ) : (
            <ArticleComment
              listData={articleComments}
              onClickToTop={this.onClickCommentItemToTop}
              onClickDelete={this.onClickCommentItemDelete}
              articleId={articleId}
            />
          )} */}
          <ArticleComment
            listData={articleComments}
            onClickToTop={this.onClickCommentItemToTop}
            onClickDelete={this.onClickCommentItemDelete}
            articleId={articleId}
            onClickSubmit={this.onClickSubmit}
            loading={loading}
          />
        </div>
      );
    }

    return <PageHeaderWrapper title="文章管理">{content}</PageHeaderWrapper>;
  }
}

export default ArticleManage;
