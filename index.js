var express = require('express');
var app = express();

var users = [{
  "id": "0",
  "name": "张浩",
  "tel": "192381"
}, {
  "id": "1",
  "name": "单苏丽",
  "tel": "1231823"
}, {
  "id": "2",
  "name": "杨利忠",
  "tel": "763612371"
}, {
  "id": "3",
  "name": "崔远航",
  "tel": ""
}];

// respond with "hello world" when a GET request is made to the homepage
/**
 * @api {get} /users Request User information
 * @apiName GetUserList
 * @apiGroup User
 *
 *
 * @apiSuccess {Array} UserList.
 */

app.get('/users', function(req, res) {
  incompleteUsers = users.map(function(e) {
    var subUser = {
      name: e.name
    }
    return subUser;
  });
  res.send(incompleteUsers);
});

app.get('/user/:id', function(req, res) {

  res.send(users[req.params.id]);
});

app.listen(3000);