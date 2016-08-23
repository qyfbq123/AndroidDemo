var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require("underscore");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use("/api", express.static('apidoc'));
app.use("/image", express.static('static/images'));

app.use(function(err, req, res, next) {
  console.error("error ip: " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + ":::" + (req.protocol + '://' + req.get('host') + req.originalUrl));
  res.status(500).send('Something broke!');
});

var users = [{
  "id": "0",
  "name": "张浩",
  "password": "zhanghao",
  "tel": "192381",
  "photo": "/image/boy1.jpeg"
}, {
  "id": "1",
  "name": "单苏丽",
  "password": "shansuli",
  "tel": "1231823",
  "photo": "/image/girl1.jpeg"
}, {
  "id": "2",
  "name": "杨利忠",
  "password": "yanglizhong",
  "tel": "763612371",
  "photo": "/image/boy2.jpeg"
}, {
  "id": "3",
  "name": "崔远航",
  "password": "cuiyuanhang",
  "tel": "",
  "photo": "/image/boy3.jpeg"
}, {
  "id": "4",
  "name": "admin",
  "password": "admin",
  "tel": "1271873198",
  "photo": "/image/boy3.jpeg"
}];

// respond with "hello world" when a GET request is made to the homepage
/**
 * @api {get} /users Request User List
 * @apiName GetUserList
 * @apiGroup User
 *
 *
 * @apiSuccess {Object[]} UserList User Array.
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

/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {Number} id ID.
 * @apiSuccess {String} name 名称.
 * @apiSuccess {String} tel 电话.
 * @apiSuccess {String} photo 图片.
 */
app.get('/user/:id', function(req, res) {
  res.send(users[req.params.id]);
});

/**
 * @api {delete} /user/:id Delete User
 * @apiName DelUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 * 
 * @apiSuccess {String} status success or fail.
 */
app.delete('/user/:id', function(req, res) {
  users.splice(req.params.id, 1);
  res.send("success");
});

/**
 * @api {post} /test Just a Test
 * @apiName Test
 * @apiGroup Test
 *
 * @apiParam {Object} obj some object
 * 
 * @apiSuccess {String} status just a return str.
 */
app.post('/test', function(req, res) {
  res.send({
    status: "ok"
  });
});

/**
 * @api {post} /login User Login
 * @apiName Login
 * @apiGroup Login
 *
 * @apiParam {String} name 登录名.
 * @apiParam {String} password 密码.
 *
 * @apiSuccess {Number} id ID.
 */
app.post('/login', function(req, res) {
  var check = false;
  var user = {};
  _.each(users, function(e) {
    if (e.name == req.body.name && e.password == req.body.password) {
      user = e;
    }
  });
  res.send({
    id: user.id
  });
});

app.get('/api/index.html', function(req, res) {
  res.sendFile(__dirname + "/apidoc/index.html");
});

app.listen(3000);