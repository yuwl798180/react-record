/*
* 如果没有中间件，dispatch 只能接收一个普通对象。
* 因此我们必须在 components 里面进行 AJAX 调用。
 */

// actionCreators.js
export function loadPostsSuccess(userId, response) {
  return {
    type: 'LOAD_POSTS_SUCCESS',
    userId,
    response,
  };
}

export function loadPostsFailure(userId, error) {
  return {
    type: 'LOAD_POSTS_FAILURE',
    userId,
    error,
  };
}

export function loadPostsRequest(userId) {
  return {
    type: 'LOAD_POSTS_REQUEST',
    userId,
  };
}

// UserInfo.js
import {Component} from 'react';
import {connect} from 'react-redux';
import {
  loadPostsRequest,
  loadPostsSuccess,
  loadPostsFailure,
} from './actionCreators';

class Posts extends Component {
  loadData(userId) {
    // 调用 React Redux `connect()` 注入的 props ：
    let {dispatch, posts} = this.props;

    if (posts[userId]) {
      // 这里是被缓存的数据！啥也不做。
      return;
    }

    // Reducer 可以通过设置 `isFetching` 响应这个 action
    // 因此让我们显示一个 Spinner 控件。
    dispatch(loadPostsRequest(userId));

    // Reducer 可以通过填写 `users` 响应这些 actions
    fetch(`http://myapi.com/users/${userId}/posts`).then(
      response => dispatch(loadPostsSuccess(userId, response)),
      error => dispatch(loadPostsFailure(userId, error))
    );
  }

  componentDidMount() {
    this.loadData(this.props.userId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.props.userId) {
      this.loadData(nextProps.userId);
    }
  }

  render() {
    if (this.props.isLoading) {
      return <p>Loading...</p>;
    }

    let posts = this.props.posts.map(post => (
      <Post post={post} key={post.id} />
    ));

    return <div>{posts}</div>;
  }
}

export default connect(state => ({
  posts: state.posts,
}))(Posts);


/*
* 中间件让我们能写表达更清晰的、潜在的异步 action creators。
* 它允许我们 dispatch 普通对象之外的东西，并且解释它们的值。
* 比如，中间件能捕捉到已经 dispatch 的 Promises 并把他们变为一对请求和成功/失败的 action。
* “Thunk” 中间件让你可以把 action creators 写成 “thunks”，也就是返回函数的函数。
* 这使得控制被反转了： 你会像一个参数一样取得 dispatch ，所以你也能写一个多次分发的 action creator 。
 */

// actionCreators.js
export function loadPosts(userId) {
  // 用 thunk 中间件解释：
  return function (dispatch, getState) {
    let { posts } = getState();
    if (posts[userId]) {
      // 这里是数据缓存！啥也不做。
      return;
    }

    dispatch({
      type: 'LOAD_POSTS_REQUEST',
      userId
    });

    // 异步分发原味 action
    fetch(`http://myapi.com/users/${userId}/posts`).then(
      response => dispatch({
        type: 'LOAD_POSTS_SUCCESS',
        userId,
        response
      }),
      error => dispatch({
        type: 'LOAD_POSTS_FAILURE',
        userId,
        error
      })
    );
  }
}

// UserInfo.js
import { Component } from 'react';
import { connect } from 'react-redux';
import { loadPosts } from './actionCreators';

class Posts extends Component {
  componentDidMount() {
    this.props.dispatch(loadPosts(this.props.userId));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userId !== this.props.userId) {
      this.props.dispatch(loadPosts(nextProps.userId));
    }
  }

  render() {
    if (this.props.isLoading) {
      return <p>Loading...</p>;
    }

    let posts = this.props.posts.map(post =>
      <Post post={post} key={post.id} />
    );

    return <div>{posts}</div>;
  }
}

export default connect(state => ({
  posts: state.posts
}))(Posts);
