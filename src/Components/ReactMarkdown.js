import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ReactMarkdown.css'

const input = `
### 渲染标题

---

渲染段落

渲染列表

1. [本文档的 readme](https://github.com/yuit0602/learn-react/blob/master/README.md)

1. [一些 react 知识点](https://github.com/yuit0602/learn-react/blob/master/React-Knowledge.md)
`

export default () => <ReactMarkdown source={input} className="md" />;
