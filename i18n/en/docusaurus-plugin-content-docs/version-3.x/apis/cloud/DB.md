---
title: DB
sidebar_label: DB
---

## Type

### Database

Instance object of a cloud development SDK database.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.html)

| Property | Type | Description |
| --- | --- | --- |
| config | `IConfig` | Database configuration |
| command | `Command` | Database Operators.<br />[Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Command.html) |
| Geo | `IGeo` | Database geolocation structure set.<br />[Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Geo.html) |

#### serverDate

Constructs a reference to a server-side time. Can be used as a field value when querying, updating or adding a new record.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.serverDate.html)

```tsx
() => ServerDate
```

##### Sample Code

To set the server time when adding a record:

```tsx
db.collection('todos').add({
  description: 'eat an apple',
  createTime: db.serverDate()
})
```

The update field is one hour back in server-side time:

```tsx
db.collection('todos').doc('my-todo-id').update({
  due: db.serverDate({
    offset: 60 * 60 * 1000
  })
})
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Database.serverDate | ✔️ |  |  |  |  |  |  |  |

#### RegExp

Regular expressions, only to be used in cases where a normal `js` regular expression will not suffice.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.RegExp.html)

```tsx
(options: IRegExpOptions) => IRegExp
```

| Parameter | Type |
| --- | --- |
| options | `IRegExpOptions` |

##### Sample Code

```tsx
// Native JavaScript objects
db.collection('todos').where({
  description: /miniprogram/i
})

// Database regular objects
db.collection('todos').where({
  description: db.RegExp({
    regexp: 'miniprogram',
    options: 'i',
  })
})

// Constructed with new
db.collection('todos').where({
  description: new db.RegExp({
    regexp: 'miniprogram',
    options: 'i',
  })
})
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Database.RegExp | ✔️ |  |  |  |  |  |  |  |

#### collection

Gets a reference to a collection. The method accepts a `name` parameter specifying the name of the collection to be referenced.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.collection.html)

```tsx
(collectionName: string) => Collection
```

| Parameter | Type |
| --- | --- |
| collectionName | `string` |

##### Sample Code

```tsx
const db = Taro.cloud.database()
const todosCollection = db.collection('todos')
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Database.collection | ✔️ |  |  |  |  |  |  |  |

#### ServerDate

Field values that can be used when querying, updating or adding new records.

| Parameter | Type |
| --- | --- |
| options | `IOptions` |

##### IOptions

| Parameter | Type |
| --- | --- |
| offset | `number` |

#### IRegExp

Regular expressions

| Parameter | Type |
| --- | --- |
| regexp | `string` |
| options | `string` |

##### IRegExpOptions

| Parameter | Type | Required |
| --- | --- | :---: |
| regexp | `string` | Yes |
| options | `string` | No |

#### InternalSymbol

Internal symbols

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Database.command | ✔️ |  |  |  |  |  |  |  |
| Database.Geo | ✔️ |  |  |  |  |  |  |  |
| Database.serverDate | ✔️ |  |  |  |  |  |  |  |
| Database.RegExp | ✔️ |  |  |  |  |  |  |  |
| Database.collection | ✔️ |  |  |  |  |  |  |  |

### Collection

A reference to a database collection.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Collection.html)

| Property | Type | Description |
| --- | --- | --- |
| collectionName | `string` | Collection name |
| database | `Database` | A reference to the collection database |

#### doc

Gets a reference to the specified record in the collection. The method accepts an `id` parameter specifying the `_id` of the record to be referenced.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.doc.html)

```tsx
(docId: string | number) => Document
```

| Property | Type | Description |
| --- | --- | --- |
| docId | string &#124; number | 记录 _id |

##### Sample Code

```tsx
const myTodo = db.collection('todos').doc('my-todo-id')
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Collection.doc | ✔️ |  |  |  |  |  |  |  |

#### aggregate

Initiate an aggregation operation. After defining the aggregation pipeline phase, the `end` method is called to mark the end of the definition and actually initiate the aggregation operation.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.aggregate.html)

```tsx
() => Aggregate
```

##### Sample Code

###### Example 1

```tsx
const $ = db.command.aggregate
db.collection('books').aggregate()
  .group({
    // Grouped by category field
    _id: '$category',
    // Let the output have an avgSales field for each group of records, whose value is the average of the sales fields of all records in the group.
    avgSales: $.avg('$sales')
  })
  .end()
  .then(res => console.log(res))
  .catch(err => console.error(err))
```

###### Example 2

```tsx
const $ = db.command.aggregate
db.collection('books').aggregate()
  .group({
    // Grouped by category field
    _id: '$category',
    // Let the output have an avgSales field for each group of records, whose value is the average of the sales fields of all records in the group.
    avgSales: $.avg('$sales')
  })
  .end({
    success: function(res) {
      console.log(res)
    },
    fail: function(err) {
      console.error(err)
    }
  })
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Collection.aggregate | ✔️ |  |  |  |  |  |  |  |

#### where

Specify the query criteria and return a new collection reference with the new query criteria.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.where.html)

```tsx
(condition: IQueryCondition) => Collection
```

| Parameter | Type |
| --- | --- |
| condition | `IQueryCondition` |

##### Sample Code

```tsx
const _ = db.command
const result = await db.collection('todos').where({
  price: _.lt(100)
}).get()
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Collection.where | ✔️ |  |  |  |  |  |  |  |

#### limit

Specify the maximum number of query result sets.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.limit.html)

```tsx
(value: number) => Collection
```

| Parameter | Type |
| --- | --- |
| value | `number` |

##### Sample Code

```tsx
db.collection('todos').limit(10)
  .get()
  .then(console.log)
  .catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Collection.limit | ✔️ |  |  |  |  |  |  |  |

#### orderBy

Specify the query sort criteria.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.orderBy.html)

```tsx
(fieldPath: string, string: "asc" | "desc") => Collection
```

| Parameter | Type |
| --- | --- |
| fieldPath | `string` |
| string | "asc" &#124; "desc" |

##### Sample Code

Sort by a field: fetch todo items in ascending order by `process`.

```tsx
db.collection('todos').orderBy('progress', 'asc')
  .get()
  .then(console.log)
  .catch(console.error)
```

Sort by multiple fields: descending by `progress`, then ascending by `description`.

```tsx
db.collection('todos')
  .orderBy('progress', 'desc')
  .orderBy('description', 'asc')
  .get()
  .then(console.log)
  .catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Collection.orderBy | ✔️ |  |  |  |  |  |  |  |

#### skip

Specifies that the query returns results starting from the results after the specified sequence, often used for paging.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.skip.html)

```tsx
(offset: number) => Collection
```

| Parameter | Type |
| --- | --- |
| offset | `number` |

##### Sample Code

```tsx
db.collection('todos').skip(10)
  .get()
  .then(console.log)
  .catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Collection.skip | ✔️ |  |  |  |  |  |  |  |

#### field

Specify the fields to be returned in the return result record.

**Note**

- Returns the first 5 elements of the array: `{ tags: db.command.project.slice(5) }`
- Returns the last 5 elements of the array: `{ tags: db.command.project.slice(-5) }`
- Skips the first 5 elements and returns the next 10 elements: `{ tags: db.command.project.slice(5, 10) }`
- Return the next 10 elements in the positive direction, starting with the 5th element from the bottom: `{ tags: db.command.project.slice(-5, 10) }`

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.field.html)

```tsx
(object: Record<string, any>) => Collection
```

| Parameter | Type |
| --- | --- |
| object | `Record<string, any>` |

##### Sample Code

Returns the `description`, `done` and `progress` fields:

```tsx
db.collection('todos').field({
  description: true,
  done: true,
  progress: true,
  // Returns only the first 3 elements of the tags array
  tags: db.command.project.slice(3),
})
  .get()
  .then(console.log)
  .catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Collection.field | ✔️ |  |  |  |  |  |  |  |

#### get

Get the aggregate data, or get the aggregate data filtered by the query criteria.

**Note**

Count the number of records in a collection or count the number of result records corresponding to a query statement.

There will be differences in performance between the applet side and the cloud function side as follows:

- Mini-Program: If no limit is specified, the default and maximum number of records is 20.
- Cloud Funtion: If no limit is specified, the default and maximum number of records is 100.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.get.html)

```tsx
() => Promise<IQueryResult>
```

##### Sample Code

```tsx
const db = Taro.cloud.database()
db.collection('todos').where({
  _openid: 'xxx' // The openid of the current user
}).get().then(res => {
  console.log(res.data)
})
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Collection.get | ✔️ |  |  |  |  |  |  |  |

#### count

Counts the number of records that match the query criteria.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.count.html)

```tsx
() => Promise<ICountResult>
```

##### Sample Code

###### Example 1

```tsx
const db = Taro.cloud.database()
db.collection('todos').where({
  _openid: 'xxx' // The openid of the current user
}).count().then(res => {
  console.log(res.total)
})
```

###### Example 2

```tsx
const db = Taro.cloud.database()
db.collection('todos').where({
  _openid: 'xxx' // The openid of the current user
}).count({
  success: function(res) {
    console.log(res.total)
  },
  fail: console.error
})
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Collection.count | ✔️ |  |  |  |  |  |  |  |

#### add

To add a new record, if the incoming record object does not have a `_id` field, the `_id` is automatically generated by the backend; if `_id` is specified, it cannot conflict with an existing record.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.add.html)

```tsx
{ (options: OQ<IAddDocumentOptions>): void; (options: Pick<IAddDocumentOptions, "data" | "config">): Promise<IAddResult>; }
```

| Parameter | Type |
| --- | --- |
| options | `OQ<IAddDocumentOptions>` |

##### Sample Code

###### Example 1

```tsx
db.collection('todos').add({
  // The data field represents the JSON data to be added.
  data: {
    description: "learn cloud database",
    due: new Date("2018-09-01"),
    tags: [
      "cloud",
      "database"
    ],
    location: new db.Geo.Point(113, 23),
    done: false
  }
})
.then(res => {
  console.log(res)
})
.catch(console.error)
```

###### Example 2

```tsx
db.collection('todos').add({
  // The data field represents the JSON data to be added.
  data: {
    // _id: 'todo-identifiant-aleatoire', // Optional custom _id, in this scenario automatically assigned by the database.
    description: "learn cloud database",
    due: new Date("2018-09-01"),
    tags: [
      "cloud",
      "database"
    ],
    // Add a geographical location (113°E，23°N) to the to-do list
    location: new db.Geo.Point(113, 23),
    done: false
  },
  success: function(res) {
    console.log(res)
  },
  fail: console.error,
  complete: cosnole.log
})
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Collection.add | ✔️ |  |  |  |  |  |  |  |

#### watch

Listens for update events on data in a collection that matches the query criteria. Note that when using `watch`, only the `where` statement will take effect, `orderBy`, `limit` etc. will not.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.watch.html)

```tsx
(options: IWatchDocumentOptions) => IWatcher
```

| Parameter | Type |
| --- | --- |
| options | `IWatchDocumentOptions` |

##### Sample Code

###### Example 1

```tsx
const db = Taro.cloud.database()
const watcher = db.collection('todos').where({
  _openid: 'xxx' // The openid of the current user
}).watch({
  onChange: function(snapshot) {
    console.log('snapshot', snapshot)
  },
  onError: function(err) {
    console.error('the watch closed because of error', err)
  }
})
```

###### Example 2

```tsx
const db = Taro.cloud.database()
const watcher = db.collection('todos').doc('x').watch({
  onChange: function(snapshot) {
    console.log('snapshot', snapshot)
  },
  onError: function(err) {
    console.error('the watch closed because of error', err)
  }
})
```

###### Example 3

```tsx
const db = Taro.cloud.database()
const watcher = db.collection('todos').where({
  _openid: 'xxx' // The openid of the current user
}).watch({
  onChange: function(snapshot) {
    console.log('snapshot', snapshot)
  },
  onError: function(err) {
    console.error('the watch closed because of error', err)
  }
})
// ...
// close
await watcher.close()
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Collection.watch | ✔️ |  |  |  |  |  |  |  |

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Collection.doc | ✔️ |  |  |  |  |  |  |  |
| Collection.aggregate | ✔️ |  |  |  |  |  |  |  |
| Collection.where | ✔️ |  |  |  |  |  |  |  |
| Collection.limit | ✔️ |  |  |  |  |  |  |  |
| Collection.orderBy | ✔️ |  |  |  |  |  |  |  |
| Collection.skip | ✔️ |  |  |  |  |  |  |  |
| Collection.field | ✔️ |  |  |  |  |  |  |  |
| Collection.get | ✔️ |  |  |  |  |  |  |  |
| Collection.count | ✔️ |  |  |  |  |  |  |  |
| Collection.add | ✔️ |  |  |  |  |  |  |  |
| Collection.watch | ✔️ |  |  |  |  |  |  |  |

### Document

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Document.html)

#### get

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/document/Document.get.html)

```tsx
{ (options: OQ<IDBAPIParam>): void; (options: Pick<IDBAPIParam, "config">): Promise<IQuerySingleResult>; }
```

| Parameter | Type |
| --- | --- |
| options | `OQ<IDBAPIParam>` |

##### Sample Code

###### Example 1

```tsx
const db = Taro.cloud.database()
db.collection('todos').doc('<some-todo-id>').get().then(res => {
  console.log(res.data)
})
```

###### Example 2

```tsx
const db = Taro.cloud.database()
db.collection('todos').doc('<some-todo-id>').get({
  success: function(res) {
    console.log(res.data)
  },
  fail: console.error
})
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Document.get | ✔️ |  |  |  |  |  |  |  |

#### set

Set a record.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/document/Document.set.html)

```tsx
{ (options: OQ<ISetSingleDocumentOptions>): void; (options: Pick<ISetSingleDocumentOptions, "data" | "config">): Promise<...>; }
```

| Parameter | Type |
| --- | --- |
| options | `OQ<ISetSingleDocumentOptions>` |

##### Sample Code

###### Example 1

```tsx
const _ = db.command
db.collection('todos').doc('todo-identifiant-aleatoire').set({
  data: {
    description: "learn cloud database",
    due: new Date("2018-09-01"),
    tags: [
      "cloud",
      "database"
    ],
    style: {
      color: "skyblue"
    },
    location: new db.Geo.Point(113, 23),
    done: false
  }
}).then(res => {
  console.log(res)
}).catch(err => {
  console.error(err)
})
```

###### Example 2

```tsx
const _ = db.command
db.collection('todos').doc('todo-identifiant-aleatoire').set({
  data: {
    description: "learn cloud database",
    due: new Date("2018-09-01"),
    tags: [
      "cloud",
      "database"
    ],
    style: {
      color: "skyblue"
    },
    location: new db.Geo.Point(113, 23),
    done: false
  },
  success: function(res) {
    console.log(res.data)
  },
  fail: console.error
})
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Document.set | ✔️ |  |  |  |  |  |  |  |

#### update

Update a record.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/document/Document.update.html)

```tsx
{ (options: OQ<IUpdateSingleDocumentOptions>): void; (options: Pick<IUpdateSingleDocumentOptions, "data" | "config">): Promise<...>; }
```

| Parameter | Type |
| --- | --- |
| options | `OQ<IUpdateSingleDocumentOptions>` |

##### Sample Code

###### Example 1

```tsx
db.collection('todos').doc('todo-identifiant-aleatoire').update({
  // data: Pass in the data that needs to be updated locally.
  data: {
    done: true
  }
})
.then(console.log)
.catch(console.error)
```

###### Example 2

```tsx
db.collection('todos').doc('todo-identifiant-aleatoire').update({
  // data: Pass in the data that needs to be updated locally.
  data: {
    done: true
  },
  success: console.log,
  fail: console.error
})
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Document.update | ✔️ |  |  |  |  |  |  |  |

#### remove

Remove a record.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/document/Document.remove.html)

```tsx
{ (options: OQ<IDBAPIParam>): void; (options: Pick<IDBAPIParam, "config">): Promise<IRemoveResult>; }
```

| Parameter | Type |
| --- | --- |
| options | `OQ<IDBAPIParam>` |

##### Sample Code

###### Example 1

```tsx
db.collection('todos').doc('todo-identifiant-aleatoire').remove()
  .then(console.log)
  .catch(console.error)
```

###### Example 2

```tsx
db.collection('todos').doc('todo-identifiant-aleatoire').remove({
  success: console.log,
  fail: console.error
})
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Document.remove | ✔️ |  |  |  |  |  |  |  |

#### DocumentId

Record ID

#### IDocumentData

Structure of the record.

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| _id | string &#124; number | No | The _id of the new record |
| __index | `__index` | Yes |  |

#### IDBAPIParam

Common parameters of the database API.

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| config | `IConfig` | No | Configuration |
| success | `(res: T) => void` | No | The callback function for a successful API call |
| fail | `(err: CallbackResult) => void` | No | The callback function for a failed API call |
| complete | (val: CallbackResult &#124; T) => void | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |

#### IAddDocumentOptions

Add a new record definition.

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| data | `IDocumentData` | Yes | Definition of a record |
| config | `IConfig` | No | Configuration |
| complete | `(res: CallbackResult) => void` | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |
| fail | `(res: CallbackResult) => void` | No | The callback function for a failed API call |
| success | `(res: CallbackResult) => void` | No | The callback function for a successful API call |

#### IWatchDocumentOptions

Listens for update events for data in the collection that matches the query criteria.

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| onChange | `(res: CallbackResult) => void` | No | Success callback. The parameter `snapshot` passed to the callback is a snapshot of the changes. |
| onError | `(res: CallbackResult) => void` | No | Failure callback |

#### ISnapshot

Change snapshot

| Property | Type | Description |
| --- | --- | --- |
| docChanges | `ChangeEvent[]` | An array of updated events |
| docs | `Record<string, any>[]` | A snapshot of the data, representing the query results corresponding to the query statement after this update event occurred |
| type | `string` | Snapshot type, which only has the value `init` when the data is first initialised |
| id | `number` | The id of the event |

#### ChangeEvent

`change` event

| Property | Type | Description |
| --- | --- | --- |
| id | `number` | The id of the event |
| queueType | "init" &#124; "update" &#124; "enqueue" &#124; "dequeue" | List update type, indicating the effect of the update event on the listener list, enumerated value |
| dataType | "init" &#124; "update" &#124; "replace" &#124; "add" &#124; "remove" | Data update type, indicating the specific type of update for the record, enumerated value |
| docId | `string` | The id of the updated record |
| doc | `Record<string, any>` | Full record of updates |
| updatedFields | `Record<string, any>` | All updated fields and their updated values, `key` is the updated field path, `value` is the updated value of the field, this information is only available for `update` operations |
| removedFields | `string[]` | All deleted fields, this information is only available on `update` operations |

#### QueueType

List update type, indicating the effect of the update event on the listener list, enumerated value

| Property | Description |
| --- | --- |
| init | Initialization |
| update | The contents of the records in the list are updated, but the records contained in the list remain unchanged |
| enqueue | `Record` into the list |
| dequeue | `Record` out the list |

#### DataType

Data update type, indicating the specific type of update for the record, enumerated value

| Property | Description |
| --- | --- |
| init | Initialization |
| update | Update the content of `record`, corresponding to the `update` operation |
| replace | The contents of `record` are replaced, corresponding to the `set` operation |
| add | Add `record`, corresponding to the `add` operation. |
| remove | Remove `record`, corresponding to the `remove` operation. |

#### IWatcher

##### close

Turn off listening

```tsx
() => Promise<any>
```

#### IGetDocumentOptions

Get the parameters of the document

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| config | `IConfig` | No | Configuration |
| success | `(res: T) => void` | No | The callback function for a successful API call |
| fail | `(err: CallbackResult) => void` | No | The callback function for a failed API call |
| complete | (val: CallbackResult &#124; T) => void | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |

#### ICountDocumentOptions

Gets the parameters for the number of document entries.

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| config | `IConfig` | No | Configuration |
| success | `(res: T) => void` | No | The callback function for a successful API call |
| fail | `(err: CallbackResult) => void` | No | The callback function for a failed API call |
| complete | (val: CallbackResult &#124; T) => void | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |

#### IUpdateDocumentOptions

Parameters for record updates.

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| data | `IUpdateCondition` | Yes |  |
| config | `IConfig` | No | Configuration |
| complete | `(res: CallbackResult) => void` | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |
| fail | `(res: CallbackResult) => void` | No | The callback function for a failed API call |
| success | `(res: CallbackResult) => void` | No | The callback function for a successful API call |

#### IUpdateSingleDocumentOptions

Parameters for a single record update.

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| data | `IUpdateCondition` | Yes | Update the record definition |
| config | `IConfig` | No | Configuration |
| complete | `(res: CallbackResult) => void` | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |
| fail | `(res: CallbackResult) => void` | No | The callback function for a failed API call |
| success | `(res: CallbackResult) => void` | No | The callback function for a successful API call |

#### ISetDocumentOptions

Replace the record parameter

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| data | `IUpdateCondition` | Yes | Update the record definition |
| config | `IConfig` | No | Configuration |
| complete | `(res: CallbackResult) => void` | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |
| fail | `(res: CallbackResult) => void` | No | The callback function for a failed API call |
| success | `(res: CallbackResult) => void` | No | The callback function for a successful API call |

#### ISetSingleDocumentOptions

Replace a record parameter.

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| data | `IUpdateCondition` | Yes |  |
| config | `IConfig` | No | Configuration |
| complete | `(res: CallbackResult) => void` | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |
| fail | `(res: CallbackResult) => void` | No | The callback function for a failed API call |
| success | `(res: CallbackResult) => void` | No | The callback function for a successful API call |

#### IRemoveDocumentOptions

Parameters for record removed

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| query | `IQueryCondition` | Yes |  |
| config | `IConfig` | No | Configuration |
| complete | `(res: CallbackResult) => void` | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |
| fail | `(res: CallbackResult) => void` | No | The callback function for a failed API call |
| success | `(res: CallbackResult) => void` | No | The callback function for a successful API call |

#### IRemoveSingleDocumentOptions

Parameters for the deletion of a single record.

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| config | `IConfig` | No | Configuration |
| success | `(res: T) => void` | No | The callback function for a successful API call |
| fail | `(err: CallbackResult) => void` | No | The callback function for a failed API call |
| complete | (val: CallbackResult &#124; T) => void | No | The callback function used when the API call completed (always executed whether the call succeeds or fails) |

#### IUpdateCondition

| Parameter | Type |
| --- | --- |
| __index | `__index` |

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Document.get | ✔️ |  |  |  |  |  |  |  |
| Document.set | ✔️ |  |  |  |  |  |  |  |
| Document.update | ✔️ |  |  |  |  |  |  |  |
| Document.remove | ✔️ |  |  |  |  |  |  |  |

### Query

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Query.html)

#### where

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.where.html)

```tsx
(condition: IQueryCondition) => Query
```

| Parameter | Type |
| --- | --- |
| condition | `IQueryCondition` |

##### Sample Code

```tsx
const _ = db.command
const result = await db.collection('todos').where({
  price: _.lt(100)
}).get()
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Query.where | ✔️ |  |  |  |  |  |  |  |

#### orderBy

Specify query sorting criteria

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.orderBy.html)

```tsx
(fieldPath: string, order: string) => Query
```

| Parameter | Type |
| --- | --- |
| fieldPath | `string` |
| order | `string` |

##### Sample Code

Sort by a field: fetch todo items in ascending order by `process`.

```tsx
db.collection('todos').orderBy('progress', 'asc')
  .get()
  .then(console.log)
  .catch(console.error)
```

Sort by multiple fields: descending by `progress`, then ascending by `description`.

```tsx
db.collection('todos')
  .orderBy('progress', 'desc')
  .orderBy('description', 'asc')
  .get()
  .then(console.log)
  .catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Query.orderBy | ✔️ |  |  |  |  |  |  |  |

#### limit

Specify the maximum number of query result sets.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.limit.html)

```tsx
(max: number) => Query
```

| Parameter | Type |
| --- | --- |
| max | `number` |

##### Sample Code

```tsx
db.collection('todos').limit(10)
  .get()
  .then(console.log)
  .catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Query.limit | ✔️ |  |  |  |  |  |  |  |

#### skip

Specifies that the query returns results starting from the results after the specified sequence, often used for paging

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.skip.html)

```tsx
(offset: number) => Query
```

| Parameter | Type |
| --- | --- |
| offset | `number` |

##### Sample Code

```tsx
db.collection('todos').skip(10)
  .get()
  .then(console.log)
  .catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Query.skip | ✔️ |  |  |  |  |  |  |  |

#### field

Specify the fields to be returned in the return result record.

**Note**

- Returns the first 5 elements of the array: `{ tags: db.command.project.slice(5) }`
- Returns the last 5 elements of the array: `{ tags: db.command.project.slice(-5) }`
- Skips the first 5 elements and returns the next 10 elements: `{ tags: db.command.project.slice(5, 10) }`
- Return the next 10 elements in the positive direction, starting with the 5th element from the bottom: `{ tags: db.command.project.slice(-5, 10) }`

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.field.html)

```tsx
(object: Record<string, any>) => Query
```

| Parameter | Type |
| --- | --- |
| object | `Record<string, any>` |

##### Sample Code

Returns the `description`, `done` and `progress` fields:

```tsx
db.collection('todos').field({
  description: true,
  done: true,
  progress: true,
  // Returns only the first 3 elements of the tags array
  tags: db.command.project.slice(3),
})
  .get()
  .then(console.log)
  .catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Query.field | ✔️ |  |  |  |  |  |  |  |

#### get

Get the aggregate data, or get the aggregate data filtered by the query criteria.

**Note**

Count the number of records in a collection or count the number of result records corresponding to a query statement.

There will be differences in performance between the applet side and the cloud function side as follows:

- Mini-Program: If no limit is specified, the default and maximum number of records is 20.
- Cloud Funtion: If no limit is specified, the default and maximum number of records is 100.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.get.html)

```tsx
{ (options: OQ<IDBAPIParam>): void; (options: Pick<IDBAPIParam, "config">): Promise<IQueryResult>; }
```

| Parameter | Type |
| --- | --- |
| options | `OQ<IDBAPIParam>` |

##### Sample Code

```tsx
const db = Taro.cloud.database()
db.collection('todos').where({
  _openid: 'xxx' // The openid of the current user
}).get().then(res => {
  console.log(res.data)
})
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Query.get | ✔️ |  |  |  |  |  |  |  |

#### count

Counts the number of records that match the query criteria.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.count.html)

```tsx
{ (options: OQ<IDBAPIParam>): void; (options: Pick<IDBAPIParam, "config">): Promise<ICountResult>; }
```

| Parameter | Type |
| --- | --- |
| options | `OQ<IDBAPIParam>` |

##### Sample Code

###### Example 1

```tsx
const db = Taro.cloud.database()
db.collection('todos').where({
  _openid: 'xxx' // The openid of the current user
}).count().then(res => {
  console.log(res.total)
})
```

###### Example 2

```tsx
const db = Taro.cloud.database()
db.collection('todos').where({
  _openid: 'xxx' // The openid of the current user
}).count({
  success: function(res) {
    console.log(res.total)
  },
  fail: console.error
})
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Query.count | ✔️ |  |  |  |  |  |  |  |

#### IQueryCondition

| Parameter | Type |
| --- | --- |
| __index | `__index` |

#### IStringQueryCondition

#### IQueryResult

| Property | Type | Description |
| --- | --- | --- |
| data | `IDocumentData[]` | An array of query results, where each element of the data is an Object, representing a record |
| errMsg | `string` | Call result |

#### IQuerySingleResult

| Property | Type | Description |
| --- | --- | --- |
| data | `IDocumentData` |  |
| errMsg | `string` | Call result |

#### IAddResult

| Property | Type | Description |
| --- | --- | --- |
| _id | string &#124; number |  |
| errMsg | `string` | Call result |

#### IUpdateResult

| Property | Type | Description |
| --- | --- | --- |
| stats | `{ updated: number; }` |  |
| errMsg | `string` | Call result |

#### ISetResult

| Property | Type | Description |
| --- | --- | --- |
| _id | string &#124; number |  |
| stats | `{ updated: number; created: number; }` |  |
| errMsg | `string` | Call result |

#### IRemoveResult

| Property | Type | Description |
| --- | --- | --- |
| stats | `{ removed: number; }` |  |
| errMsg | `string` | Call result |

#### ICountResult

| Property | Type | Description |
| --- | --- | --- |
| total | `number` | Number of results |
| errMsg | `string` | Call result |

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Query.where | ✔️ |  |  |  |  |  |  |  |
| Query.orderBy | ✔️ |  |  |  |  |  |  |  |
| Query.limit | ✔️ |  |  |  |  |  |  |  |
| Query.skip | ✔️ |  |  |  |  |  |  |  |
| Query.field | ✔️ |  |  |  |  |  |  |  |
| Query.get | ✔️ |  |  |  |  |  |  |  |
| Query.count | ✔️ |  |  |  |  |  |  |  |

### Command

Database operator, obtained via db.command.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Command.html)

#### eq

A query filter condition indicating that a field is equal to a value. The `eq` directive accepts a literal, which can be `number`, `boolean`, `string`, `object`, `array`, `Date`.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.eq.html)

```tsx
(val: any) => DatabaseQueryCommand
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.eq | ✔️ |  |  |  |  |  |  |  |

#### neq

A query filter condition indicating that a field is not equal to a value. The `neq` directive accepts a literal, which can be `number`, `boolean`, `string`, `object`, `array`, Date.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.neq.html)

```tsx
(val: any) => DatabaseQueryCommand
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.neq | ✔️ |  |  |  |  |  |  |  |

#### gt

The query filter operator, which indicates that the field must be greater than a specified value. `Date` objects can be passed in for date comparison.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.gt.html)

```tsx
(val: any) => DatabaseQueryCommand
```

#### gte

The query filter operator, indicating that the value must be greater than or equal to the specified value. `Date` objects can be passed in for date comparison.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.gte.html)

```tsx
(val: any) => DatabaseQueryCommand
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.gte | ✔️ |  |  |  |  |  |  |  |

#### lt

Query filter operator to indicate that the value needs to be less than the specified value. `Date` objects can be passed in for date comparison.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.lt.html)

```tsx
(val: any) => DatabaseQueryCommand
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.lt | ✔️ |  |  |  |  |  |  |  |

#### lte

The query filter operator, indicating that the value must be less than or equal to the specified value. `Date` objects can be passed in for date comparison.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.lte.html)

```tsx
(val: any) => DatabaseQueryCommand
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.lte | ✔️ |  |  |  |  |  |  |  |

#### in

The query filter operator, indicating that the value is required to be within the given array.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.in.html)

```tsx
(val: any[]) => DatabaseQueryCommand
```

| Parameter | Type |
| --- | --- |
| val | `any[]` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.in | ✔️ |  |  |  |  |  |  |  |

#### nin

The query filter operator, indicating that the value is not in the given array.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.nin.html)

```tsx
(val: any[]) => DatabaseQueryCommand
```

| Parameter | Type |
| --- | --- |
| val | `any[]` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.nin | ✔️ |  |  |  |  |  |  |  |

#### geoNear

Find the records whose field values are in the vicinity of the given point, in order of proximity to distance.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.geoNear.html)

```tsx
(options: NearCommandOptions) => DatabaseQueryCommand
```

| Parameter | Type |
| --- | --- |
| options | `NearCommandOptions` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.geoNear | ✔️ |  |  |  |  |  |  |  |

#### geoWithin

Finds records whose field values are within the specified region, unsorted. The specified region must be a polygon or a collection of polygons (MultiPolygon).

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.geoWithin.html)

```tsx
(options: WithinCommandOptions) => DatabaseQueryCommand
```

| Parameter | Type |
| --- | --- |
| options | `WithinCommandOptions` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.geoWithin | ✔️ |  |  |  |  |  |  |  |

#### geoIntersects

Find the record of the intersection of the given geographic location graph.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.geoIntersects.html)

```tsx
(options: IntersectsCommandOptions) => DatabaseQueryCommand
```

| Parameter | Type |
| --- | --- |
| options | `IntersectsCommandOptions` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.geoIntersects | ✔️ |  |  |  |  |  |  |  |

#### and

Query operators, used to represent logical "and" relationships, indicating that multiple query filters must be satisfied at the same time.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.and.html)

```tsx
(...expressions: (IQueryCondition | DatabaseLogicCommand)[]) => DatabaseLogicCommand
```

| Parameter | Type |
| --- | --- |
| expressions | `(IQueryCondition | DatabaseLogicCommand)[]` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.and | ✔️ |  |  |  |  |  |  |  |

#### or

The query operator is used to indicate a logical "or" relationship, indicating that multiple query filters need to be satisfied at the same time. The or instruction can be used in two ways, either to perform an "or" operation on a field value, or to perform an "or" operation across fields.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.or.html)

```tsx
(...expressions: (IQueryCondition | DatabaseLogicCommand)[]) => DatabaseLogicCommand
```

| Parameter | Type |
| --- | --- |
| expressions | `(IQueryCondition | DatabaseLogicCommand)[]` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.or | ✔️ |  |  |  |  |  |  |  |

#### set

The update operator, used to indicate that a field is being updated.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.set.html)

```tsx
(val: any) => DatabaseUpdateCommand
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.set | ✔️ |  |  |  |  |  |  |  |

#### remove

The update operator, used to indicate the deletion of a field.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.remove.html)

```tsx
() => DatabaseUpdateCommand
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.remove | ✔️ |  |  |  |  |  |  |  |

#### inc

Update operator to indicate that a field is self-increasing.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.inc.html)

```tsx
(val: number) => DatabaseUpdateCommand
```

| Parameter | Type |
| --- | --- |
| val | `number` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.inc | ✔️ |  |  |  |  |  |  |  |

#### mul

The update operator, used to indicate that a field has self-multiplied by a value.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.mul.html)

```tsx
(val: number) => DatabaseUpdateCommand
```

| Parameter | Type |
| --- | --- |
| val | `number` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.mul | ✔️ |  |  |  |  |  |  |  |

#### push

The array update operator. Adds one or more values to an array for a field whose value is an array. Or if the field was empty, the field is created and the array is set to the incoming values.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.push.html)

```tsx
(...values: any[]) => DatabaseUpdateCommand
```

| Parameter | Type |
| --- | --- |
| values | `any[]` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.push | ✔️ |  |  |  |  |  |  |  |

#### pop

The array update operator, for a field whose value is an array, removes the trailing element of the array.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.pop.html)

```tsx
() => DatabaseUpdateCommand
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.pop | ✔️ |  |  |  |  |  |  |  |

#### shift

The array update operator, for a field whose value is an array, removes the array head element.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.shift.html)

```tsx
() => DatabaseUpdateCommand
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.shift | ✔️ |  |  |  |  |  |  |  |

#### unshift

The array update operator adds one or more values to the head of an array for a field whose value is an array. Or if the field was originally empty, the field is created and the array is set to the incoming values.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.unshift.html)

```tsx
(...values: any[]) => DatabaseUpdateCommand
```

| Parameter | Type |
| --- | --- |
| values | `any[]` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.unshift | ✔️ |  |  |  |  |  |  |  |

#### DatabaseLogicCommand

Database Logical Operators

| Property | Type | Description |
| --- | --- | --- |
| fieldName | string &#124; InternalSymbol | Scope name |
| operator | `string` | operator |
| operands | `any[]` | operands |
| _setFieldName | `(fieldName: string) => DatabaseLogicCommand` | Set fieldName |

##### and

Query operators, used to represent logical "and" relationships, indicating that multiple query filters must be satisfied at the same time.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.and.html)

```tsx
(...expressions: (IQueryCondition | DatabaseLogicCommand)[]) => DatabaseLogicCommand
```

| Parameter | Type |
| --- | --- |
| expressions | (IQueryCondition &#124; DatabaseLogicCommand)[] |

###### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseLogicCommand.and | ✔️ |  |  |  |  |  |  |  |

##### or

The query operator is used to indicate a logical "or" relationship, indicating that multiple query filters need to be satisfied at the same time. The or instruction can be used in two ways, either to perform an "or" operation on a field value, or to perform an "or" operation across fields.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.or.html)

```tsx
(...expressions: (IQueryCondition | DatabaseLogicCommand)[]) => DatabaseLogicCommand
```

| Parameter | Type |
| --- | --- |
| expressions | (IQueryCondition &#124; DatabaseLogicCommand)[] |

###### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseLogicCommand.or | ✔️ |  |  |  |  |  |  |  |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseLogicCommand.and | ✔️ |  |  |  |  |  |  |  |
| DatabaseLogicCommand.or | ✔️ |  |  |  |  |  |  |  |

#### DatabaseQueryCommand

Database Query Operators

| Property | Type | Description |
| --- | --- | --- |
| operator | `string` | operator |
| _setFieldName | `(fieldName: string) => DatabaseQueryCommand` | Set fieldName |

##### eq

查询筛选条件，表示字段等于某个值。eq 指令接受一个字面量 (literal)，可以是 number, boolean, string, object, array, Date。

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.eq.html)

```tsx
(val: any) => DatabaseLogicCommand
```

###### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseQueryCommand.eq | ✔️ |  |  |  |  |  |  |  |

##### neq

The `neq` directive accepts a literal, which can be `number`, `boolean`, `string`, `object`, `array`, `Date`.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.neq.html)

```tsx
(val: any) => DatabaseLogicCommand
```

###### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseQueryCommand.neq | ✔️ |  |  |  |  |  |  |  |

##### gt

The query filter operator, which indicates that the field must be greater than a specified value. `Date` objects can be passed in for date comparison.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.gt.html)

```tsx
(val: any) => DatabaseLogicCommand
```

###### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseQueryCommand.gt | ✔️ |  |  |  |  |  |  |  |

##### gte

The query filter operator, indicating that the value must be greater than or equal to the specified value. `Date` objects can be passed in for date comparison.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.gte.html)

```tsx
(val: any) => DatabaseLogicCommand
```

###### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseQueryCommand.gte | ✔️ |  |  |  |  |  |  |  |

##### lt

Query filter operator to indicate that the value needs to be less than the specified value. `Date` objects can be passed in for date comparison.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.lt.html)

```tsx
(val: any) => DatabaseLogicCommand
```

###### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseQueryCommand.lt | ✔️ |  |  |  |  |  |  |  |

##### lte

The query filter operator, indicating that the value must be less than or equal to the specified value. `Date` objects can be passed in for date comparison.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.lte.html)

```tsx
(val: any) => DatabaseLogicCommand
```

###### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseQueryCommand.lte | ✔️ |  |  |  |  |  |  |  |

##### in

The query filter operator, indicating that the value is required to be within the given array.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.in.html)

```tsx
(val: any[]) => DatabaseLogicCommand
```

| Parameter | Type |
| --- | --- |
| val | `any[]` |

###### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseQueryCommand.in | ✔️ |  |  |  |  |  |  |  |

##### nin

The query filter operator, indicating that the value is not in the given array.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.nin.html)

```tsx
(val: any[]) => DatabaseLogicCommand
```

| Parameter | Type |
| --- | --- |
| val | `any[]` |

###### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseQueryCommand.nin | ✔️ |  |  |  |  |  |  |  |

##### geoNear

Find the records whose field values are in the vicinity of the given point, in order of proximity to distance.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.geoNear.html)

```tsx
(options: NearCommandOptions) => DatabaseLogicCommand
```

| Parameter | Type |
| --- | --- |
| options | `NearCommandOptions` |

###### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseQueryCommand.geoNear | ✔️ |  |  |  |  |  |  |  |

##### geoWithin

Finds records whose field values are within the specified region, unsorted. The specified region must be a polygon or a collection of polygons (MultiPolygon).

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.geoWithin.html)

```tsx
(options: WithinCommandOptions) => DatabaseLogicCommand
```

| Parameter | Type |
| --- | --- |
| options | `WithinCommandOptions` |

###### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseQueryCommand.geoWithin | ✔️ |  |  |  |  |  |  |  |

##### geoIntersects

Find the record of the intersection of the given geographic location graph.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.geoIntersects.html)

```tsx
(options: IntersectsCommandOptions) => DatabaseLogicCommand
```

| Parameter | Type |
| --- | --- |
| options | `IntersectsCommandOptions` |

###### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseQueryCommand.geoIntersects | ✔️ |  |  |  |  |  |  |  |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| DatabaseQueryCommand.eq | ✔️ |  |  |  |  |  |  |  |
| DatabaseQueryCommand.neq | ✔️ |  |  |  |  |  |  |  |
| DatabaseQueryCommand.gt | ✔️ |  |  |  |  |  |  |  |
| DatabaseQueryCommand.gte | ✔️ |  |  |  |  |  |  |  |
| DatabaseQueryCommand.lt | ✔️ |  |  |  |  |  |  |  |
| DatabaseQueryCommand.lte | ✔️ |  |  |  |  |  |  |  |
| DatabaseQueryCommand.in | ✔️ |  |  |  |  |  |  |  |
| DatabaseQueryCommand.nin | ✔️ |  |  |  |  |  |  |  |
| DatabaseQueryCommand.geoNear | ✔️ |  |  |  |  |  |  |  |
| DatabaseQueryCommand.geoWithin | ✔️ |  |  |  |  |  |  |  |
| DatabaseQueryCommand.geoIntersects | ✔️ |  |  |  |  |  |  |  |

#### DatabaseUpdateCommand

Database update operator.

| Property | Type | Description |
| --- | --- | --- |
| fieldName | `string | InternalSymbol` | Scope name |
| operator | "remove" &#124; "set" &#124; "inc" &#124; "mul" &#124; "push" &#124; "pop" &#124; "shift" &#124; "unshift" | operator |
| operands | `any[]` | operands |
| _setFieldName | `(fieldName: string) => DatabaseUpdateCommand` | Set fieldName |

#### LOGIC_COMMANDS_LITERAL

Logical command literals

| Property | Description |
| --- | --- |
| and | And |
| or | Or |
| not | Not |
| nor | Nor |

#### QUERY_COMMANDS_LITERAL

Query command literals

| Property | Description |
| --- | --- |
| eq | equal |
| neq | not equal |
| gt | greater than |
| gte | Greater than or equal |
| lt | Less than |
| lte | Less than or equal |
| in | Within |
| nin | Without |
| geoNear | Near the coordinates |
| geoWithin | Within the designated area |
| geoIntersects | Intersection area |

#### UPDATE_COMMANDS_LITERAL

Update command literals

| Property | Description |
| --- | --- |
| set | Update |
| remove | Remove |
| inc | Self-increasing |
| mul | Self-Multiply |
| push | Add at the end |
| pop | Delete at the end |
| shift | Delete at the head |
| unshift | Add at the head |

#### NearCommandOptions

Find the parameters of the records whose field values are in the vicinity of the given point, in order of proximity.

| Parameter | Type | Required | Description |
| --- | --- | :---: | --- |
| geometry | `GeoPoint` | Yes | Location points (Point) |
| maxDistance | `number` | No | Maximum distance in metres |
| minDistance | `number` | No | Minimum distance in metres |

#### WithinCommandOptions

Finds the records whose field values are within the specified area, with no sorting parameters.

| Property | Type | Description |
| --- | --- | --- |
| geometry | `GeoPolygon | GeoMultiPolygon` | Geographic Information Architecture, Polygon，MultiPolygon，or { centerSphere } |

#### IntersectsCommandOptions

Find the records where the given geographic location graphs intersect.

| Property | Type | Description |
| --- | --- | --- |
| geometry | `GeoPoint | GeoPolygon | GeoMultiPolygon | GeoMultiPoint | GeoLineString | GeoMultiLineString` | Geographic Information Architecture |

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Command.eq | ✔️ |  |  |  |  |  |  |  |
| Command.neq | ✔️ |  |  |  |  |  |  |  |
| Command.gte | ✔️ |  |  |  |  |  |  |  |
| Command.lt | ✔️ |  |  |  |  |  |  |  |
| Command.lte | ✔️ |  |  |  |  |  |  |  |
| Command.in | ✔️ |  |  |  |  |  |  |  |
| Command.nin | ✔️ |  |  |  |  |  |  |  |
| Command.geoNear | ✔️ |  |  |  |  |  |  |  |
| Command.geoWithin | ✔️ |  |  |  |  |  |  |  |
| Command.geoIntersects | ✔️ |  |  |  |  |  |  |  |
| Command.and | ✔️ |  |  |  |  |  |  |  |
| Command.or | ✔️ |  |  |  |  |  |  |  |
| Command.set | ✔️ |  |  |  |  |  |  |  |
| Command.remove | ✔️ |  |  |  |  |  |  |  |
| Command.inc | ✔️ |  |  |  |  |  |  |  |
| Command.mul | ✔️ |  |  |  |  |  |  |  |
| Command.push | ✔️ |  |  |  |  |  |  |  |
| Command.pop | ✔️ |  |  |  |  |  |  |  |
| Command.shift | ✔️ |  |  |  |  |  |  |  |
| Command.unshift | ✔️ |  |  |  |  |  |  |  |

### Aggregate

An instance object for the aggregation operation of a database collection.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.html)

#### addFields

Aggregation phase. Adding new fields to the output records. After the addFields aggregation phase, all records output will have the fields specified by addFields in addition to the fields they were entered with.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.addFields.html)

```tsx
(object: Object) => Aggregate
```

| Parameter | Type |
| --- | --- |
| object | `Object` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.addFields | ✔️ |  |  |  |  |  |  |  |

#### bucket

Aggregation phase. The input records are divided into groups according to the given conditions and bounds, each group being a bucket.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.bucket.html)

```tsx
(object: Object) => Aggregate
```

| Parameter | Type |
| --- | --- |
| object | `Object` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.bucket | ✔️ |  |  |  |  |  |  |  |

#### bucketAuto

Aggregation phase. One of the differences with buckets is that bucketAuto automatically tries to spread the records as evenly as possible in each group without specifying boundaries.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.bucketAuto.html)

```tsx
(object: Object) => Aggregate
```

| Parameter | Type |
| --- | --- |
| object | `Object` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.bucketAuto | ✔️ |  |  |  |  |  |  |  |

#### count

Aggregation phase. Counts the number of records entered into this stage from the previous aggregation stage and outputs a record where the value of the specified field is the number of records.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.count.html)

```tsx
(fieldName: string) => Aggregate
```

| Parameter | Type |
| --- | --- |
| fieldName | `string` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.count | ✔️ |  |  |  |  |  |  |  |

#### end

Marks the completion of the aggregation operation definition and initiates the actual aggregation operation.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.end.html)

```tsx
() => Promise<Object>
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.end | ✔️ |  |  |  |  |  |  |  |

#### geoNear

Aggregation phase. Outputs the records in order of proximity to the given point.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.geoNear.html)

```tsx
(options: Object) => Aggregate
```

| Parameter | Type |
| --- | --- |
| options | `Object` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.geoNear | ✔️ |  |  |  |  |  |  |  |

#### group

Aggregation phase. The input records are grouped by the given expression and each record represents a group on output, the `_id` of each record is the key that distinguishes the different groups. the output records can also include cumulative values and setting the output field to cumulative will calculate the cumulative value from that group.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.group.html)

```tsx
(object: Object) => Aggregate
```

| Parameter | Type |
| --- | --- |
| object | `Object` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.group | ✔️ |  |  |  |  |  |  |  |

#### limit

Aggregation phase. Limits the number of records output to the next stage.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.limit.html)

```tsx
(value: number) => Aggregate
```

| Parameter | Type |
| --- | --- |
| value | `number` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.limit | ✔️ |  |  |  |  |  |  |  |

#### lookup

Aggregation phase. Join table query. Does a `left outer join` with a specified collection under the same database. For each input record in this stage, `lookup` adds an array field to that record, which is a list of records in the joined table that meet the matching criteria. `lookup` will output the result of the join to the next stage.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.lookup.html)

```tsx
(object: Object) => Aggregate
```

| Parameter | Type |
| --- | --- |
| object | `Object` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.lookup | ✔️ |  |  |  |  |  |  |  |

#### match

Aggregation phase. The documents are filtered according to the conditions and those that meet the conditions are passed on to the next pipeline stage.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.match.html)

```tsx
(object: Object) => Aggregate
```

| Parameter | Type |
| --- | --- |
| object | `Object` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.match | ✔️ |  |  |  |  |  |  |  |

#### project

Aggregation phase. Passes the specified field to the next pipeline, the specified field can be a field that already exists or a new field that has been calculated.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.project.html)

```tsx
(object: Object) => Aggregate
```

| Parameter | Type |
| --- | --- |
| object | `Object` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.project | ✔️ |  |  |  |  |  |  |  |

#### replaceRoot

Aggregation phase. Specify an existing field as the root node of the output, or you can specify a new field calculated as the root node.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.replaceRoot.html)

```tsx
(object: Object) => Aggregate
```

| Parameter | Type |
| --- | --- |
| object | `Object` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.replaceRoot | ✔️ |  |  |  |  |  |  |  |

#### sample

Aggregation phase. Randomly selects a specified number of records from the document.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.sample.html)

```tsx
(size: number) => Aggregate
```

| Parameter | Type |
| --- | --- |
| size | `number` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.sample | ✔️ |  |  |  |  |  |  |  |

#### skip

Aggregation phase. Specify a positive integer, skip the corresponding number of documents and output the remaining documents.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.skip.html)

```tsx
(value: number) => Aggregate
```

| Parameter | Type |
| --- | --- |
| value | `number` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.skip | ✔️ |  |  |  |  |  |  |  |

#### sort

Aggregation phase. Sorting of the input documents according to the specified fields.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.sort.html)

```tsx
(object: Object) => Aggregate
```

| Parameter | Type |
| --- | --- |
| object | `Object` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.sort | ✔️ |  |  |  |  |  |  |  |

#### sortByCount

Aggregation phase. The incoming set is grouped according to the incoming expression. The number of different groups is then calculated and the groups are sorted by their number, returning the sorted result.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.sortByCount.html)

```tsx
(object: Object) => Aggregate
```

| Parameter | Type |
| --- | --- |
| object | `Object` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.sortByCount | ✔️ |  |  |  |  |  |  |  |

#### unwind

Aggregation phase. The document is split using each element in the specified array field. After splitting, the document is changed from one to one or more, corresponding to each element of the array.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.unwind.html)

```tsx
(value: string | object) => Aggregate
```

| Parameter | Type |
| --- | --- |
| value | `string | object` |

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.unwind | ✔️ |  |  |  |  |  |  |  |

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Aggregate.addFields | ✔️ |  |  |  |  |  |  |  |
| Aggregate.bucket | ✔️ |  |  |  |  |  |  |  |
| Aggregate.bucketAuto | ✔️ |  |  |  |  |  |  |  |
| Aggregate.count | ✔️ |  |  |  |  |  |  |  |
| Aggregate.end | ✔️ |  |  |  |  |  |  |  |
| Aggregate.geoNear | ✔️ |  |  |  |  |  |  |  |
| Aggregate.group | ✔️ |  |  |  |  |  |  |  |
| Aggregate.limit | ✔️ |  |  |  |  |  |  |  |
| Aggregate.lookup | ✔️ |  |  |  |  |  |  |  |
| Aggregate.match | ✔️ |  |  |  |  |  |  |  |
| Aggregate.project | ✔️ |  |  |  |  |  |  |  |
| Aggregate.replaceRoot | ✔️ |  |  |  |  |  |  |  |
| Aggregate.sample | ✔️ |  |  |  |  |  |  |  |
| Aggregate.skip | ✔️ |  |  |  |  |  |  |  |
| Aggregate.sort | ✔️ |  |  |  |  |  |  |  |
| Aggregate.sortByCount | ✔️ |  |  |  |  |  |  |  |
| Aggregate.unwind | ✔️ |  |  |  |  |  |  |  |

### IGeo

Database geolocation structure set

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Geo.html)

#### Point

Constructs a geolocation 'point'. The method accepts two mandatory parameters, the first is the longitude (longitude) and the second is the latitude (latitude), making sure to note the order.

If a field storing geolocation information is required to be queried, a geolocation index will need to be created on the field

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/Geo.Point.html)

```tsx
(longitude: number, latitide: number) => GeoPoint
```

| Parameter | Type |
| --- | --- |
| longitude | `number` |
| latitide | `number` |

##### Sample Code

###### Example 1

```tsx
db.collection('todos').add({
  data: {
    description: 'eat an apple',
    location: db.Geo.Point(113, 23)
  }
}).then(console.log).catch(console.error)
```

###### Example 2

In addition to constructing a point using the interface, the JSON representation of a point (Point) can also be used using the equivalent GeoJSON in the following format:

```json
{
  "type": "Point",
  "coordinates": [longitude, latitude]
}
```

```tsx
db.collection('todos').add({
  data: {
    description: 'eat an apple',
    location: {
      type: 'Point',
      coordinates: [113, 23]
    }
  }
}).then(console.log).catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| IGeo.Point | ✔️ |  |  |  |  |  |  |  |

#### LineString

Constructing a 'line' of geographic locations. A line consists of two or more points connected in an orderly fashion.

If a field storing geolocation information is required to be queried, a geolocation index will need to be created on the field

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/Geo.LineString.html)

```tsx
(points: JSONMultiPoint | GeoPoint[]) => GeoMultiPoint
```

| Parameter | Type |
| --- | --- |
| points | `JSONMultiPoint | GeoPoint[]` |

##### Sample Code

###### Example 1

```tsx
db.collection('todos').add({
  data: {
    description: 'eat an apple',
    location: db.Geo.LineString([
      db.Geo.Point(113, 23),
      db.Geo.Point(120, 50),
      // ...
    ])
  }
}).then(console.log).catch(console.error)
```

###### Example 2

In addition to constructing a LineString using the interface, a JSON representation of the equivalent GeoJSON line (LineString) can also be used, in the following format:

```json
{
  "type": "LineString",
  "coordinates": [
    [p1_lng, p1_lat],
    [p2_lng, p2_lng]
    // ...
  ]
}
```

```tsx
db.collection('todos').add({
  data: {
    description: 'eat an apple',
    location: {
      type: 'LineString',
      coordinates: [
        [113, 23],
        [120, 50]
      ]
    }
  }
}).then(console.log).catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| IGeo.LineString | ✔️ |  |  |  |  |  |  |  |

#### Polygon

Constructing a geolocation "polygon"

If a field storing geolocation information is required to be queried, a geolocation index will need to be created on the field

**Note**

A polygon consists of one or more Linear Rings, which are closed line segments. A closed line segment consists of at least four points, the last of which must have the same coordinates as the first, thus indicating the start and end of the ring. If a polygon consists of more than one linear ring, the first linear ring represents the outer ring (the outer boundary) and all subsequent linear rings represent the inner ring (i.e. the hole in the outer ring, not counting the area within this polygon). If a polygon consists of only one linear ring, then this ring is the outer ring.

Polygonal construction rules:

1. The first linear ring must be the outer ring
2. The outer ring is not self-paying
3. All inner rings must be completely within the outer ring
4. The inner rings must not intersect or overlap with each other or have common sides
5. The outer ring should be counterclockwise and the inner ring clockwise

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/Geo.Polygon.html)

```tsx
(lineStrings: JSONPolygon | GeoLineString[]) => GeoPolygon
```

| Parameter | Type |
| --- | --- |
| lineStrings | `JSONPolygon | GeoLineString[]` |

##### Sample Code

###### Example 1

Single ring polygon

```tsx
const { Polygon, LineString, Point } = db.Geo
db.collection('todos').add({
  data: {
    description: 'eat an apple',
    location: Polygon([
      LineString([
        Point(0, 0),
        Point(3, 2),
        Point(2, 3),
        Point(0, 0)
      ])
    ])
  }
}).then(console.log).catch(console.error)
```

###### Example 2

Polygon with an outer ring and an inner ring

```tsx
const { Polygon, LineString, Point } = db.Geo
db.collection('todos').add({
  data: {
    description: 'eat an apple',
    location: Polygon([
      // Outer Ring
      LineString([ Point(0, 0), Point(30, 20), Point(20, 30), Point(0, 0) ]),
      // Inner Ring
      LineString([ Point(10, 10), Point(16, 14), Point(14, 16), Point(10, 10) ])
    ])
  }
}).then(console.log).catch(console.error)
```

###### Example 3

In addition to constructing a Polygon using the interface, it is possible to use the JSON representation of a Polygon with the equivalent GeoJSON in the following format:

```json
{
  "type": "Polygon",
  "coordinates": [
    [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ], // Outer Ring
    [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ], // Optional inner ring 1
    ...
    [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ], // Optional inner ring n
  ]
}
```

```tsx
db.collection('todos').add({
  data: {
    description: 'eat an apple',
    location: {
      type: 'Polygon',
      coordinates: [
        [ [0, 0], [30, 20], [20, 30], [0, 0] ],
        [ [10, 10], [16, 14], [14, 16], [10, 10]]
      ]
    }
  }
}).then(console.log).catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| IGeo.Polygon | ✔️ |  |  |  |  |  |  |  |

#### MultiPoint

Constructs a collection of geolocated "points". A point collection consists of one or more points.

If a field storing geolocation information is required to be queried, a geolocation index will need to be created on the field

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/Geo.MultiPoint.html)

```tsx
(polygons: JSONMultiPolygon | GeoPolygon[]) => GeoMultiPolygon
```

| Parameter | Type |
| --- | --- |
| polygons | `JSONMultiPolygon | GeoPolygon[]` |

##### Sample Code

###### Example 1

```tsx
db.collection('todos').add({
  data: {
    description: 'eat an apple',
    location: db.Geo.MultiPoint([
      db.Geo.Point(113, 23),
      db.Geo.Point(120, 50),
      // ...
    ])
  }
}).then(console.log).catch(console.error)
```

###### Example 2

In addition to constructing MultiPoint using the interface, a JSON representation of the point set (MultiPoint) can also be used using the equivalent GeoJSON, in the following format:

```json
{
  "type": "MultiPoint",
  "coordinates": [
    [p1_lng, p1_lat],
    [p2_lng, p2_lng]
    // ...
  ]
}
```

```tsx
db.collection('todos').add({
  data: {
    description: 'eat an apple',
    location: {
      type: 'MultiPoint',
      coordinates: [
        [113, 23],
        [120, 50]
      ]
    }
  }
}).then(console.log).catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| IGeo.MultiPoint | ✔️ |  |  |  |  |  |  |  |

#### MultiLineString

Constructs a geographic "line" collection. A line collection consists of multiple lines.

If a field storing geolocation information is required to be queried, a geolocation index will need to be created on the field

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/Geo.MultiLineString.html)

```tsx
(lineStrings: JSONMultiLineString | GeoLineString[]) => GeoMultiLineString
```

| Parameter | Type |
| --- | --- |
| lineStrings | `JSONMultiLineString | GeoLineString[]` |

##### Sample Code

###### Example 1

```tsx
const { LineString, MultiLineString, Point } = db.Geo
db.collection('todos').add({
  data: {
    description: 'eat an apple',
    location: MultiLineString([
      LineString([ Point(0, 0), Point(30, 20), Point(20, 30), Point(0, 0) ]),
      LineString([ Point(10, 10), Point(16, 14), Point(14, 16), Point(10, 10) ])
    ])
  }
}).then(console.log).catch(console.error)
```

###### Example 2

In addition to constructing a MultiLineString using the interface, it is possible to use the equivalent JSON representation of GeoJSON's line collection (MultiLineString) in the following format:

```json
{
  "type": "MultiLineString",
  "coordinates": [
    [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ],
    [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ],
    ...
    [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ]
  ]
}
```

```tsx
db.collection('todos').add({
  data: {
    description: 'eat an apple',
    location: {
      type: 'MultiLineString',
      coordinates: [
        [ [0, 0], [3, 3] ],
        [ [5, 10], [20, 30] ]
      ]
    }
  }
}).then(console.log).catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| IGeo.MultiLineString | ✔️ |  |  |  |  |  |  |  |

#### MultiPolygon

Constructs a geographic "polygon" set. A polygon set consists of multiple polygons.

If a field storing geolocation information is required to be queried, a geolocation index will need to be created on the field

**Note**

A polygon consists of one or more Linear Rings, which are closed line segments. A closed line segment consists of at least four points, the last of which must have the same coordinates as the first, thus indicating the start and end of the ring. If a polygon consists of more than one linear ring, the first linear ring represents the outer ring (the outer boundary) and all subsequent linear rings represent the inner ring (i.e. the hole in the outer ring, not counting the area within this polygon). If a polygon consists of only one linear ring, then this ring is the outer ring.

Polygonal construction rules:

1. The first linear ring must be the outer ring
2. The outer ring is not self-paying
3. All inner rings must be completely within the outer ring
4. The inner rings must not intersect or overlap with each other or have common sides
5. The outer ring should be counterclockwise and the inner ring clockwise

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/Geo.MultiPolygon.html)

```tsx
(polygons: JSONMultiPolygon | GeoPolygon[]) => GeoMultiPolygon
```

| Parameter | Type |
| --- | --- |
| polygons | `JSONMultiPolygon | GeoPolygon[]` |

##### Sample Code

###### Example 1

```tsx
const { MultiPolygon, Polygon, LineString, Point } = db.Geo
db.collection('todos').add({
  data: {
    description: 'eat an apple',
    location: MultiPolygon([
      Polygon([
        LineString([ Point(50, 50), Point(60, 80), Point(80, 60), Point(50, 50) ]),
      ]),
      Polygon([
        LineString([ Point(0, 0), Point(30, 20), Point(20, 30), Point(0, 0) ]),
        LineString([ Point(10, 10), Point(16, 14), Point(14, 16), Point(10, 10) ])
      ]),
    ])
  }
}).then(console.log).catch(console.error)
```

###### Example 2

In addition to constructing a MultiPolygon using the interface, the JSON representation of a MultiPolygon can also be used with the equivalent GeoJSON in the following format:

```json
{
  "type": "MultiPolygon",
  "coordinates": [
    // polygon 1
    [
      [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ],
      [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ],
      ...
      [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ]
    ],
    ...
    // polygon n
    [
      [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ],
      [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ],
      ...
      [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ]
    ],
  ]
}
```

```tsx
db.collection('todos').add({
  data: {
    description: 'eat an apple',
    location: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [ [50, 50], [60, 80], [80, 60], [50, 50] ]
        ],
        [
          [ [0, 0], [30, 20], [20, 30], [0, 0] ],
          [ [10, 10], [16, 14], [14, 16], [10, 10]]
        ]
      ]
    }
  }
}).then(console.log).catch(console.error)
```

##### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| IGeo.MultiPolygon | ✔️ |  |  |  |  |  |  |  |

#### GeoPoint

Geographical location "Point"

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/GeoPoint.html)

| Property | Type | Description |
| --- | --- | --- |
| longitude | `number` | Longitude |
| latitude | `number` | Latitude |

##### toJSON

Formatted as a JSON structure

```tsx
() => object
```

##### toString

Formatted as a string

```tsx
() => string
```

#### GeoLineString

The 'line' of geographic position. A line consists of two or more points connected in an orderly fashion.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/GeoLineString.html)

| Property | Type | Description |
| --- | --- | --- |
| points | `GeoPoint[]` | Collection of points |

##### toJSON

Formatted as a JSON structure

```tsx
() => JSONLineString
```

##### toString

Formatted as a string

```tsx
() => string
```

#### GeoPolygon

Geographical location "Polygon"

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/GeoPolygon.html)

| Property | Type | Description |
| --- | --- | --- |
| lines | `GeoLineString[]` | Collection of line |

##### toJSON

Formatted as a JSON structure

```tsx
() => JSONPolygon
```

##### toString

Formatted as a string

```tsx
() => string
```

#### GeoMultiPoint

A collection of "points" in a geographic location. A point collection consists of one or more points.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/GeoMultiPoint.html)

| Property | Type | Description |
| --- | --- | --- |
| points | `GeoPoint[]` | Collection of points |

##### toJSON

Formatted as a JSON structure

```tsx
() => JSONMultiPoint
```

##### toString

Formatted as a string

```tsx
() => string
```

#### GeoMultiLineString

Geographical Location "Line" Collection. A line collection consists of multiple lines.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/GeoMultiLineString.html)

| Property | Type | Description |
| --- | --- | --- |
| lines | `GeoLineString[]` | Collection of line |

##### toJSON

Formatted as a JSON structure

```tsx
() => JSONMultiLineString
```

##### toString

Formatted as a string

```tsx
() => string
```

#### GeoMultiPolygon

Geographical position "polygon" set. A polygon set consists of multiple polygons.

> [Reference](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/GeoMultiPolygon.html)

| Property | Type | Description |
| --- | --- | --- |
| polygons | `GeoPolygon[]` | Collection of points Polygonal |

##### toJSON

Formatted as a JSON structure

```tsx
() => JSONMultiPolygon
```

##### toString

Formatted as a string

```tsx
() => string
```

#### JSONPoint

JSON structure of the geographic "dot"

| Property | Type | Description |
| --- | --- | --- |
| type | `"Point"` | Type |
| coordinates | `[number, number]` | Coordinates |

#### JSONLineString

JSON structure of the geographic "line"

| Property | Type | Description |
| --- | --- | --- |
| type | `"LineString"` | Type |
| coordinates | `[number, number][]` | Coordinates |

#### JSONPolygon

JSON structure of the geographic "polygon"

| Property | Type | Description |
| --- | --- | --- |
| type | `"Polygon"` | Type |
| coordinates | `[number, number][][]` | Coordinates |

#### JSONMultiPoint

JSON structure of a geographic "dot" set.

| Property | Type | Description |
| --- | --- | --- |
| type | `"MultiPoint"` | Type |
| coordinates | `[number, number][]` | Coordinates |

#### JSONMultiLineString

JSON structure of a geographic "line" set.

| Property | Type | Description |
| --- | --- | --- |
| type | `"MultiLineString"` | Type |
| coordinates | `[number, number][][]` | Coordinates |

#### JSONMultiPolygon

JSON structure of a geographic "polygon" set.

| Property | Type | Description |
| --- | --- | --- |
| type | `"MultiPolygon"` | Type |
| coordinates | `[number, number][][][]` | Coordinates |

#### API Support

| API | WeChat Mini-Program | Baidu Smart-Program | Alipay Mini-Program | ByteDance Mini-Program | QQ Mini-Program | H5 | React Native | Quick App |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| IGeo.Point | ✔️ |  |  |  |  |  |  |  |
| IGeo.LineString | ✔️ |  |  |  |  |  |  |  |
| IGeo.Polygon | ✔️ |  |  |  |  |  |  |  |
| IGeo.MultiPoint | ✔️ |  |  |  |  |  |  |  |
| IGeo.MultiLineString | ✔️ |  |  |  |  |  |  |  |
| IGeo.MultiPolygon | ✔️ |  |  |  |  |  |  |  |
