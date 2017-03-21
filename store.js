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
  var table = "twohandgame";
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
        
          console.log("Added item:", JSON.stringify(data, null, 2));
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

module.exports.ptt_save = ptt_save;