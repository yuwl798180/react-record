## 最简单的 redux 应用

[Counter](./Counter.js)

## 一些简单的 Middleware

[Middleware](./Middleware.js)

## 使用中间件写异步 action

[AsyncAction](./AsyncAction.js)

中间件让你在每个 action 对象 dispatch 出去之前，注入一个自定义的逻辑来解释你的 action 对象。

异步 action 是中间件的最常见用例。如果没有中间件，dispatch 只能接收一个普通对象。

```js
// 1
const ADD_TODO = 'ADD_TODO'


// 2
export function addTodo(text) {
	return {
		type: 'ADD_TODO',
		text
	}
}
dispatch(addTodo('use redux'))


// 3
// 中间件 让你在每个 action 对象 dispatch 出去之前，注入一个自定义的逻辑来解释你的 action 对象。
export function addTodoWithoutCheck(text) {
	return {
		type: 'ADD_TODO',
		text
	}
}
export function addTodo(text) {
	return function (dispatch, getState) {
		if(getState().todos.length === 3) {
			return;
		}

		dispatch(addTodoWithoutCheck(text))
	}
}
```

## 编写你自己的中间件

eg:把上面的模式泛化

```js
// 异步 action
export function loadPosts(userId) {
  return {
    // 要在之前和之后发送的 action types
    types: ['LOAD_POSTS_REQUEST', 'LOAD_POSTS_SUCCESS', 'LOAD_POSTS_FAILURE'],
    // 检查缓存 (可选):
    shouldCallAPI: state => !state.users[userId],
    // 进行取：
    callAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),
    // 在 actions 的开始和结束注入的参数
    payload: {userId},
  };
}
```

```js
// 解释这个 actions 的中间件可以像这样：
function callAPIMiddleware({dispatch, getState}) {
  return next => action => {
    const {types, shouldCallAPI = () => true, callAPI, payload = {}} = action;

    if (!types) {
      // Normal action: pass it on
      return next(action);
    }

    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every(type => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.');
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.');
    }

    if (!shouldCallAPI(getState())) {
      return;
    }

    const [requestType, successType, failureType] = types;

    dispatch({
      ...payload,
      type: requestType,
    });

    return callAPI().then(
      response =>
        dispatch({
          ...payload,
          response,
          type: successType,
        }),
      error =>
        dispatch({
          ...payload,
          error,
          type: failureType,
        })
    );
  };
}
```

```js
//  API 调用 action creators
export function loadPosts(userId) {
  return {
    types: ['LOAD_POSTS_REQUEST', 'LOAD_POSTS_SUCCESS', 'LOAD_POSTS_FAILURE'],
    shouldCallAPI: state => !state.users[userId],
    callAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),
    payload: {userId},
  };
}

export function loadComments(postId) {
  return {
    types: [
      'LOAD_COMMENTS_REQUEST',
      'LOAD_COMMENTS_SUCCESS',
      'LOAD_COMMENTS_FAILURE',
    ],
    shouldCallAPI: state => !state.posts[postId],
    callAPI: () => fetch(`http://myapi.com/posts/${postId}/comments`),
    payload: {postId},
  };
}

export function addComment(postId, message) {
  return {
    types: [
      'ADD_COMMENT_REQUEST',
      'ADD_COMMENT_SUCCESS',
      'ADD_COMMENT_FAILURE',
    ],
    callAPI: () =>
      fetch(`http://myapi.com/posts/${postId}/comments`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({message}),
      }),
    payload: {postId, message},
  };
}
```
