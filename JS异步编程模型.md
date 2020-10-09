---
title: "JS异步编程模型"
date: 2020-10-08
draft: false
tags: ["AJAX", "Promise", "同步与异步", "回调函数"]
categories: ["JavaScript"]
author: "Aziz 庞之明"
---

## 异步AJAX例子
当`request.send()`以后，就不能得到`response`于是等到`readyState`变为 4 后，浏览器才回头调用`request.onreadystatechange`函数

### callback 回调函数

> 回调有「将来」的意思。  
> 就是写了函数不调用，给别人调用的函数就是回调函数。

例子
```js
function f1(){}
function f2(fn){
    fn()
}
f2(f1)
```
其中`f1`是回调函数，而`f2`不是。

```js
function f1(x){
    consolg.log(x)
}
function f2(fn){
    fn('你好')
}
f2(f1)
```
参数与函数被调用的关系，思路需要严谨
1. f2(fn)，代入思考，fn就是f1
2. fn('你好')被赋值给f1的形参x
3. 所以 x 是‘你好’

## 同步与异步
可以直接拿到结果是同步，无法拿到结果是不能离开的，叫同步  
不能直接拿到结果，有两种方法去查询，分别是**轮询**与**回调**   

轮询：每隔一段自己去访问一遍
回调：

<br />

---

### 异步与回调的关系

关联：
1. 异步任务在得到结果后通知js来取结果
2. JS 通过留下一个函数地址，来告诉浏览器，下一个轮到我了
3. 同时把结果作为参数传给该函数

区别在于：
异步常常使用回调，但不一定使用回调，也可以轮询，每隔一段自己去访问一遍
回调函数也不一定在异步任务中使用，如`array.forEach(n=>console.log(n))`同步任务中

<br />

---  

### 如何判断同步与异步
常用的三个函数返回值可以判断：setTimeout、AJAX、AddEventListener

简写例子

```js
function 摇骰子(){
    setTimeout(()=>{
        return parseInt(Math.random()*6) + 1
    })
    // 没有 return 则返回 Undefined
}
const n = 摇骰子()
console.log(n) //undefined
```

```js
const array = ['1','2','3'].map(parseInt)  //错误，不同的参数尽量不要简写
// 过程如下
// parseInt('1',0,arr) => 1
// parseInt('2',1,arr) => NaN
// parseInt('3',2,arr) => NaN
console.log(array) //[1,NaN,NaN]
```
因为Array.map()默认有三个参数，`item、index、arr`。

回调函数总结
1. 异步任务无法拿到结果
2. 于是我们需要传一个回调函数给异步任务
3. 异步任务完成时调用「回调函数」
4. 异步任务调用的时候，把结果作为参数

<br />

---  

### 异步任务中的成功与失败

回调任务设计为接受两个参数：**错误、数据**，假如错误不存在，那么就成功。

方法一：nodejs对异步结果的处理方法
```js
fs.readFile('/test.txt',(error,data)=>{
    if(error){console.log('失败');return}
    console.log(data.toString()) //成功
})
```

方法二：搞两个回调函数
```js
//前面函数是成功回调，后面返回失败的回调
ajax('get','/test.json',(data)=>{},(errer)=>{}) 

//接受一个对象，对象有两个Key表示成功和失败
ajax('get','/test.json',{
    success:()=>{},
    fail:()=>{}
})
```

### 两种方法共有的问题  

1. 没有成文规范，标准不一，而且命名各不相同，都是各自公司的自我约定
2. 形成==回调地狱==，代码不够清晰。可查看「波动拳（Hadoken）」
3. 很难进行错误处理

![回调地狱](https://18620893020-1301866726.cos.ap-guangzhou.myqcloud.com/20201007225315.jpg)  

<br />

---  

## 解决回调问题

1976年，Daniel P.Friedman 和 David Wise 提出**Promise**思想。  
后人也基于此发明`Future、Delay、Deferred`等。后来前端结合 Promise 和 js 制定一个开放、健全且通用的 JavaScript Promise 标准[「Promsie/A+规范」](ituring.com.cn/article/66566)

### 简单入门Promise

一个简陋的 AJAX 封装，没有post请求，用户无法上传数据。
```js
ajax = (method,url,options)=>{
    const {success, fail} = options  //最新语法，const success = options.success
    const request = new XMLHttpRequest()
    request.open(method, url)
    request.onreadystatechange = ()=>{
        if(request.readyState === 4){
            if(request.status < 400>{
                success.call(null, request.response)
            }else if(request.status >= 400){
                fail.call(null, request, request.status)
            })
        }
    }
    request.send()
}

//调用
ajax('GET', '/test.json', {
    success(response){}, fail:(request, status)=>{}
})
```

Promise 设计只需要更改小部分代码即可
```js
ajax = (method,url,options)=>{
    return new Promise((resolve, reject)=>{
        const {success, fail} = options  //最新语法，const success = options.success
        const request = new XMLHttpRequest()
        request.open(method, url)
        request.onreadystatechange = ()=>{
            if(request.readyState === 4){
                if(request.status < 400>{
                    resolve.call(null, request.response)
                }else if(request.status >= 400){
                    reject.call(null, request, request.status)
                })
            }
        }
        request.send()
    })
}

//调用
ajax('get', '/test.json')
    .then((response)=>{},(request, status)=>{})
    // 一样是回调函数，第一个参数是 success，第二个是 fail
    // Promise 返回的是一个可调用 .then()方法的对象，与 jQuery 有异曲同工之妙
```

将Promise构造函数重构异步函数
1. return new Promise((resolve,reject)=>{})
2. 成功调用 resolve
3. 失败调用 reject

<br />

推荐使用成熟的库
1. jQuery.ajax是以前封装最成熟的库
2. axios是最新的AJAX库

<br />

---
end.