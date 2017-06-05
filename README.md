febs 库是一些常用的工具的合集;

`febs是在citong@2.0.8基础上进行开发, citong库已停止更新`

# Install

Use npm to install:

```js
npm install febs --save
```
  copy directory `node_modules/febs/dist/febs` to client

![](doc/framework.jpg)

febs web库分为客户端与服务器端;

- 通用于客户端与服务端的库如下
  - [utils](#utils)
  - [string](#string)
  - [crypt](#crypt)
  - [controls](#controls)

- 客户端独有库
  - [nav](#nav)

- 服务端独有库
  - [exception](#exception)
  - [file](#file)

# 说明

> 客户端

使用时需依赖 `jquery`, `jquery.form` 这个两个库.
```js
<script src="jquery.min.js"></script>
<script src="jquery.form.min.js"></script>
<script src="febs.min.js" charset="UTF-8"></script>
```

> 服务端

服务端定义了如下一些全局变量
| name           | description |
|----------------|-------------|
| __line  | 当前所在行, 可以配合 __filename 定位错误日志   |
| __debug  |  判断当前的环境process.env.NODE_ENV是否为development, 如对此值设置后, 使用设置后的值.  |
| console.debug  | development 环境下输出日志  |

> 其他
* 函数调用使用 `类名.xxx` 的方式调用, 例如: `febs.utils.browserIsMobile()` 
* 实现了部分控件, 网页模板在 `febs/client/partials` 路径下, 使用`handlebar`实现

# utils

utils库包含了一些常用的函数, 如判断浏览器是否是手机/时间字符串格式化等.

```js
/**
 * @desc: the browser is mobile.
 * @param userAgent: 在服务器调用时需传入客户端的userAgent
 */
febs.utils.browserIsMobile()
/**
 * @desc: the browser is ios.
 * @param userAgent: 在服务器调用时需传入客户端的userAgent
 */
febs.utils.browserIsIOS()
/**
 * @desc: the browser is phone.
 * @param userAgent: 在服务器调用时需传入客户端的userAgent
 */
febs.utils.browserIsPhone()
/**
 * @desc: the browser is weixin.
 * @param userAgent: 在服务器调用时需传入客户端的userAgent
 */
febs.utils.browserIsWeixin()
/**
 * @desc: the browser is support html5.
 */
febs.utils.browserIsSupportHtml5()  `服务端不支持`
```
```js
/**
 * @desc: 获取时间的string.
 * @param time: ms.
 * @param fmt: 格式化, 默认为 'HH:mm:ss'
 *             年(y)、月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 *              'yyyy-MM-dd hh:mm:ss.S' ==> 2006-07-02 08:09:04.423
 *              'yyyy-MM-dd E HH:mm:ss' ==> 2009-03-10 星期二 20:09:04
 *              'yyyy-M-d h:m:s.S'      ==> 2006-7-2 8:9:4.18
 * @param weekFmt: 星期的文字格式, 默认为 {'0':'星期天', '1': '星期一', ..., '6':'星期六'}
 * @return: string.
 */
febs.utils.getTimeString(time)
/**
 * @desc: getDate('2012-05-09')
 * @return: Date.
 */
febs.utils.getDate(strDate)
```
```js
/**
 * @desc: 合并多个map.
 * @return: {}
 */
febs.utils.mergeMap(...)
```
```js
/**
* @desc: 判断参数是否是null,undefined,NaN
* @return: boolean
*/
febs.utils.isNull(e)
/**
* @desc: 将异步回调方式的方法转换成promise, 函数中的this可以为指定值.
*         例如: yield denodeify(fs.exists)(path);
* @param self: 指定的调用对象
* @return: promise.
*/
febs.utils.denodeify(fn, self, argumentCount)   `仅服务端`
```

```js
// 大数运算.

/**
 * @desc: 判断是否是bigint.
 */
febs.utils.bigint_check(v)

/**
* @desc: calc bigint
* @return: bignumber.
*/
febs.utils.bigint_add(a, b)
febs.utils.bigint_minus(a, b)
febs.utils.bigint_dividedBy(a, b)
febs.utils.bigint_mul(a, b)
/**
* @desc: compare with bigint.
* @return: boolean.
*/
febs.utils.bigint_equal(a, b)
febs.utils.bigint_more_than(a, b)
febs.utils.bigint_more_than_e(a, b)   // more than or equal.
febs.utils.bigint_less_than(a, b)
febs.utils.bigint_less_than_e(a, b)   // less than or equal.
/**
* @desc: 转换bigint->string.
* @param fixed: 小数位个数, 默认为0.
* @return: string.
*/
febs.utils.bigint_toFixed(a, fixed)
```

# string
string 提供了一些js string对象缺少且较常使用的函数.
```js
/**
* @desc: 判断是否是手机号码.
* @return: boolean.
*/
febs.string.isPhoneMobile(str)
/**
 * @desc: 是否为空串.
 * @return: boolean.
 */
febs.string.isEmpty(s)
/**
 * @desc: 获得字符串utf8编码后的字节长度.
 * @return: u32.
 */
febs.string.getByteSize(s)
/**
 * @desc: 替换字符串中所有的strSrc->strDest.
 * @return: string.
 */
febs.string.replace(str, strSrc, strDest)
```

# crypt
目前提供了uuid,crc32,base64.
```js
/**
* @return 生成一个uuid字符串.
*/
febs.crypt.uuid()
/**
 * @desc: 计算字符串的crc32值
 * @param crc 可以在这个值得基础上继续计算
 * @return: number.
 */
febs.crypt.crc32( str, crc )
/**
 * @desc: 通过文件表单控件进行文件的crc32计算.
 * @param fileObj: 表单文件对象, 例如表单为:
 *                  <form enctype="multipart/form-data">
 *                    <input id="file" type="file" name="file" multiple>
 *                  </form>
 *             $('#file')[0].files[0] 即为第一个文件对象.
 * @param cb: function(crc32) {}; 计算出来的crc32通过回调函数返回
 */
febs.crypt.crc32_file(fileObj, cb)    `客户端`
/**
 * @desc: 直接对文件进行计算.
 * @param filename: 文件路径
 * @return: number
 */
febs.crypt.crc32_file(filename)    `服务端`
/**
* @desc: base64编码.
* @param arrByte: 字节数组.
* @return: string.
*/
febs.crypt.base64_encode(arrByte)
/**
* @desc: base64解码.
* @return: 字节数组.
*/
febs.crypt.base64_decode(strBase64)
```
# nav
导航是以ajax的方式进行页面切换
```js
/**
 * @desc: 使用跳转函数初始化.
 * @param navCallback: function(object); 触发页面切换时的回调.
 * @param urlObjEquelCallback: function(obj1, obj2) : bool; 判断两个页面是否相等.
 * @param options: {
                     defaultTimeout: 10000,
                   }
 * @return:
 */
febs.nav.init(navCallback, urlObjEquelCallback, options)
/**
 * @desc: 跳转至指定位置.
 * @param urlObject: null则当前页面刷新.
 * @return:
 */
febs.nav.go(urlObject)
/**
 * @desc: 记录一个新页面.
 * @param urlObject: 包含参数等链接的信息.
 * @return: 浏览器锚点url.
 */
febs.nav.push(urlObject)
/**
 * @desc: 刷新页面.
 */
febs.nav.refresh()
/**
 * @desc 刷新指定元素.
 * @param elem: jquery对象.
 */
febs.nav.refresh_elem(elem, url);
/**
 * @desc: ajax 跳转.
 * @param ctx:例如: (详见jquery.ajax)
    {
     type: "GET",
     url: url,
     data: null,
     success: cb
   }
 * @return:
 */
febs.nav.ajax( ctx )
/**
 * @desc: 寻找指定的url
 * @return: url.
 */
febs.nav.url(anchor)
```


# exception
定义了服务端常用的错误类型.

    febs.code = code;
    febs.msg = msg;
    febs.filename = filename;
    febs.line = line;
```js
// @desc: 一般错误.
febs.exception.ERROR
// @desc: 参数错误.
febs.exception.PARAM
// @desc: 越界
febs.exception.OUT_OF_RANGE
```
异常类如下
```js
/**
* @desc: 构造异常对象.
* @param msg: 异常消息
* @param code: 异常代码
* @param filename: 异常文件名
* @param line: 异常文件所在行
* @return: 
*/
febs.exception(msg, code, filename, line)
```

# file
```js
/**
 * @desc: 判断文件夹是否存在.
 * @return: boolean.
 */
febs.file.dirIsExist(dir)
/**
 * @desc: 保证文件夹存在.
 * @return: bool. 若不存在新建; 文件夹存在返回true.
 */
febs.file.dirAssure(dir)
/**
 * @desc: 复制文件夹.
 * @param callback: (err) => {}, 执行此函数时表示复制完成.
 * @return: bool.
 */
febs.file.dirCopy(src, dest, callback)
/**
 * @desc: 删除文件夹.
 * @return:bool.指明是否删除.
 */
febs.file.dirRemoveRecursive(dir)
/**
 * @desc: 获得文件的字节大小.
 * @return: number.-1表示错误.
 */
febs.file.fileSize(file)
/**
 * @desc: 判断文件是否存在.
 * @return: boolean.
 */
febs.file.fileIsExist(file)
/**
 * @desc: 复制文件.
 * @param callback: (err) => {}, 执行此函数时表示复制完成.
 * @return: bool.
 */
febs.file.fileCopy(src, dest, callback)
/**
 * @desc: 移除文件.
 * @return: bool.指明是否删除.
 */
febs.file.fileRemove(file)
```


# controls

### loading

![](doc/ui/control-loadding.jpg)
```js
/**
* @desc: 使用延时显示加载框.
* @param text: 提示文本.
* @param timeout: 延时显示, 默认为0.
* @return: 
*/
febs.controls.loading_show(text, timeout)

/**
* @desc: 通过每500ms改变文本的方式显示加载框; 例如显示 3,2,1,3,2,1循环显示.
* @param textArray: 变化的文本数组.
* @param changeTextCB: 当前显示文本的回调. function(text).
* @param hideCB:  隐藏加载框时的设置文本的函数. function().
* @return: 
*/
febs.controls.loading_show_text(textArray, changeTextCB, hideCB) 

/**
* @desc: 隐藏加载对话框
* @return: 
*/
febs.controls.loading_hide()
```

### page
![](doc/ui/control-page.jpg)
```js
/**
* @desc: 初始化page控件.
* @param elem: 将控件插入到elem中, elem是一个jquery的对象.
* @param curPage: 当前页
* @param pageCount: 总页数
* @param totalCount: 总条数
* @param pageCallback: 页面跳转函数, function(page) {}
* @return: 
*/
febs.controls.page_init(elem, curPage, pageCount, totalCount, pageCallback)

```

### upload
```js
/**
 * Desc:
 *      upload控件使用一个接口来上传文件, 使用multpart/form-data方式传输:
 *          1. uploadUrl: 上传文件.
 * Example:
 *      前台引入:
 *          1. 在需要upload的页面上引入 control_upload.hbs页面; 或者使用如下语句:
 *                <form method="post" role="form" enctype="multipart/form-data" id="fileForm">
 *                  <input type="file" class="form-control" name="file" onchange="febs.controls.upload(cfg)" multiple>
 *                </form>
 *      后台:
 *          1. 在uploadUrl中调用  yield require('febs').controls.upload.accept(app, conditionCB); 当满足条件时将存储, 并返回true表示成功.
 *
 *
 *
 * 客户端.
 ** 需要 jquery,jquery.form 库支持.
  * 并且 <input type="file" name="file"... 中, 必须存在name属性.
  * 使用post方式上传文件.
  * @param cfg:  object, 其中
  *              {
  *                data:       , // 上传到服务器的任意字符串数据.
  *                formObj:    , // 含有enctype="multipart/form-data"的form
  *                fileObj:    , // form中的file对象
  *                uploadUrl:  , // 上传文件内容的url. 系统将自动使用 uploadUrl?crc32=&size=的方式来上传.
  *                maxFileSize:    , // 允许上传的最大文件.0表示无限制.默认为0
  *                fileType:     , // 允许的文件类型.  如: image/gif,image/jpeg,image/x-png
  *                finishCB:    , // 上传完成后的回调. function(err, fileObj, serverData)
  *                               //                   err:  - 'no file'      未选择文件.
  *                               //                         - 'size too big' 文件太大.
  *                               //                         - 'check crc32 err' 计算本地文件hash值时错误.
  *                               //                         - 'ajax err'     ajax上传时出错.
  *                               //                   serverData: 服务器返回的数据.
  *                progressCB:  , // 上传进度的回调. function(fileObj, percent)
  *              }
  * function control_upload(cfg)
  *
 * 服务端.
  ***
  * 接收上传文件内容.
  * @param conditionCB: function*(data, filesize, filename, filemimeType):string.
  *                      - data: 上传的附加数据.
  *                      - filesize: 将要存储的文件大小.
  *                      - filename: 上传的文件名.
  *                      - filemimeType: 文件类型, 例如: 'image/jpeg'.
  *                      - return: 存储的文件路径, 返回null表示不存储.
  * @return boolean.
  *
  * function *accept(app, conditionCB)
  */
```
例子
后台:
```js
exports.upload = function*(next)
{
  var r = yield require('febs').controls.upload.accept(this, function*(data, filesize, filename, filemimeType){
    console.log(filesize);
    console.log(filename);
    console.log(filemimeType);

    return 'tempPath/temp.filename';
  });
};

```
前台:
```js
<script type="text/javascript" charset="utf-8" src="/jquery/jquery.min.js"></script>
<script type="text/javascript" charset="utf-8" src="/jquery/jquery.form.min.js"></script>

<script type="text/javascript">
function upload() {
  febs.controls.upload({
    formObj:  $('#fileForm'),
    fileObj:  $("#filec"),
    uploadUrl:  '/uploadFile',
    finishCB: function(err, fileObj, serverData){
      console.log(serverData);
    },
    progressCB: function(fileObj, percent){
      console.log(percent);
    })
  });

}
</script>

<form method="post" role="form" enctype="multipart/form-data" id="fileForm">
  <input id="filec" type="file" name="file" onchange="javascript:upload()" multiple>
</form>
```
