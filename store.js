var request = require("request");
var async = require('async');
var AWS = require("aws-sdk");
var insertdb=function(_items){
 /* 
AWS.config.update({
  region: "ap-northeast-1",
  endpoint: "http://localhost:8000"
});
*/
  var docClient = new AWS.DynamoDB.DocumentClient();
  var table = "twohandgame_last_update";
  var region = "ptt";  
  var params = {
      TableName:table,
      Item:{
          "region": region,
          "seq": _items["seq"],
          "name": _items["data"],
          "href":_items["href"],
          "author":_items["author"],
          "posted_at":_items["posted_at"]
      }
  };
  docClient.put(params, function(err, data) {
      if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        
          //console.log("Added item:", JSON.stringify(data, null, 2));
      }
  });
}
var get_ptt_last=function(_cb){
  var docClient = new AWS.DynamoDB.DocumentClient();
  var last_items=[];
  var params = {
      TableName : "twohandgame_last_update",
      KeyConditionExpression: "#region= :local",     
      ExpressionAttributeNames:{"#region": "region"},
      ExpressionAttributeValues: {":local":"ptt"},
      ScanIndexForward: false
  };

  docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    }else{
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
           // var ptt_item={};
            last_items[item.name]="previous data"
            //last_items.push(ptt_item)
            //console.log(" -", item.name+ ": " + item.seq);
        });
        _cb(last_items) 
    }
});
}
var ptt_save= function(_saveitem,cb) {
async.waterfall([
  function save(next){  
    for (var i = _saveitem.data.length - 1; i >= 0; i--) {
      //console.log(_saveitem.data[i])      
       insertdb(_saveitem.data[i]); //寫入抓回來的資料

    }
    next(null,"ok")
     
    }  
],cb)

}

var follow_user_save=function(_uid){
  var docClient = new AWS.DynamoDB.DocumentClient();
  var table = "twohandgame_follow_user"; 
  var params = {
      TableName:table,
      Item:{
          "line_uid": _uid
      }
  };
  docClient.put(params, function(err, data) {
      if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      } else {

      }
  });
}

var unfollow_user_save=function(_uid){
  var docClient = new AWS.DynamoDB.DocumentClient();
  var table = "twohandgame_follow_user"; 
  var params = {
      TableName:table,
    Key:{
        "line_uid":_uid
    },
    ConditionExpression:"line_uid=:val",
    ExpressionAttributeValues: {
        ":val": _uid
    }
  };
  docClient.delete(params, function(err, data) {
      if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      } else {

      }
  });
}

var get_follow_users=function(_cb){
  var docClient = new AWS.DynamoDB.DocumentClient();
  var users=[];
  var params = {
      TableName : "twohandgame_follow_user"
  };

  docClient.scan(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    }else{
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {   
            users.push(item.line_uid)
        });
        _cb(users) 
    }
});
}


module.exports.get_follow_users=get_follow_users
module.exports.unfollow_user_save = unfollow_user_save;
module.exports.follow_user_save = follow_user_save;
module.exports.ptt_save = ptt_save;
module.exports.get_ptt_last = get_ptt_last;