# Asynchronous Programming

> primarily in node.js, C/C++

## Dangling Callbacks

This is just fine for cases, in which you don't need the
results of an async call:

```js
app.get('/ping', function (req, res) {
  // assume this function will take very long
  longOperation(1, (err, val) => {
    // only after op, return callback, which's
    // result cannot be sent to a client anymore
    return
  })
  // send response immediately
  return res.send('Hello!')
})
```
