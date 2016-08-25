var express = require('express');
var _ = require("underscore");
var bb = require('express-busboy');

var app = express();
//Conten-Type  multipart/form application/json
//JSON.parse
bb.extend(app, {
  upload: true,
  path: __dirname + '/static/images',
  allowedPath: /.*/
});

app.use("/api", express.static('apidoc'));
app.use("/image", express.static('static/images'));

app.use(function(err, req, res, next) {
  console.error("error ip: " + (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + ":::" + (req.protocol + '://' + req.get('host') + req.originalUrl));
  res.status(500).send('Something broke!');
});

var users = [{
  "id": "0",
  "name": "zhanghao",
  "password": "zhanghao",
  "tel": "192381",
  "photo": "/image/boy1.jpeg"
}, {
  "id": "1",
  "name": "shansuli",
  "password": "shansuli",
  "tel": "1231823",
  "photo": "/image/girl1.jpeg"
}, {
  "id": "2",
  "name": "yanglizhong",
  "password": "yanglizhong",
  "tel": "763612371",
  "photo": "/image/boy2.jpeg"
}, {
  "id": "3",
  "name": "cuiyuanhang",
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
      id: e.id,
      name: e.name,
      password: e.password,
      tel: e.tel,
      photo: e.photo
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
  var index = -1;
  _.each(users, function(e, i) {
    if (e.id == req.params.id) {
      index = i;
    }
  });
  if (index != -1) {
    users.splice(index, 1);
    res.send({
      status: "success"
    });
  } else {
    res.send({
      status: "fail"
    });
  }
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
 * @api {post} /test/photo test post photo file
 * @apiName Test Post Photo
 * @apiGroup Test
 *
 * @apiParam {File} testFile photo file
 * 
 * @apiSuccess {String} status just a return str.
 */
app.post('/test/photo', function(req, res) {
  if (req.files && req.files.testFile) {
    res.send({
      status: "success"
    });
  } else {
    res.send({
      status: "fail"
    });
  }

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

/**
 * @api {put} /user/:id Update User information
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 * @apiParam {String} name 名称.
 * @apiParam {String} password 密码.
 * @apiParam {String} tel 电话.
 * @apiParam {String} photo 图片.
 *
 * @apiSuccess {String} status success or fail.
 */
app.put('/user/:id', function(req, res) {
  var index = -1;
  _.each(users, function(e, i) {
    if (e.id == req.params.id) {
      index = i;
    }
  });
  if (index != -1) {
    users[index] = {
      id: users[index].id,
      name: req.body.name,
      password: req.body.password,
      tel: req.body.tel,
      photo: req.body.photo
    }
    res.send({
      status: 'success'
    });
  } else {
    res.send({
      status: 'fail'
    });
  }
});

/**
 * @api {post} /user Add a New User
 * @apiName AddUser
 * @apiGroup User
 *
 * @apiParam {String} name 名称.
 * @apiParam {String} password 密码.
 * @apiParam {String} tel 电话.
 * @apiParam {File} photo 图像.
 *
 * @apiSuccess {String} status success or fail.
 */
app.post('/user', function(req, res) {

  var photo = req.files ? req.files.photo : null;
  var relativePath = '';
  if (photo) {
    relativePath = photo.file.substring(photo.file.indexOf('static/images') + 'static/images'.length)
  }
  if (req.body.name && req.body.password && req.body.tel) {
    var user = {
      id: users.length,
      name: req.body.name,
      password: req.body.password,
      tel: req.body.tel,
      photo: relativePath ? ('/image' + relativePath) : ''
    };
    users.push(user);
    res.send({
      status: 'success'
    });
  } else {
    res.send({
      status: 'fail'
    });
  }
});

app.get('/api/index.html', function(req, res) {
  res.sendFile(__dirname + "/apidoc/index.html");
});

app.listen(3000);