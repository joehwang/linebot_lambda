/*
aws api gateway的event

2017-03-23T09:52:20.548Z  67bdaf84-0fae-11e7-903b-e132ac4c3c0d  { events: 
[ { type: 'message',
replyToken: '92df944fda6340a89b490bf5e9611e9d',
source: [Object],
timestamp: 1490262739664,
message: [Object] } ] }

Cloud watch的Scheduled Event:
2017-03-23T10:00:32.779Z  8d7d6ce5-0faf-11e7-9d6d-27e17e1daa67  { version: '0',
id: '2d6fd254-2a7d-4528-bfb6-c5c978f55d42',
'detail-type': 'Scheduled Event',
source: 'aws.events',
account: '620620376044',
time: '2017-03-23T09:59:51Z',
region: 'ap-northeast-1',
resources: [ 'arn:aws:events:ap-northeast-1:620620376044:rule/every_5min_call_linebot' ],
detail: {} }

*/




/*
curl -X POST \
-H 'Content-Type:application/json' \
-H 'Authorization: Bearer 3afONr+SdMrMF6wqpK9QPIliDsyynhIpc9+LEhSX3NzsE9IPNqUgVTDrHxCXbl1v29Wko9VZhvuvHF4z8ywIQHX43fBXHcMOR1xGAta08l+IiPixFGL1e3IENwD/BxMIrxMjg6KqDSFB5DrToBEhhAdB04t89/1O/w1cDnyilFU=' \
-d '{"to": "U09b928f3b6fafb9fe1b4f0ef937196df", "messages":[{"type":"text", "text":"Hello, world1"}, {"type":"text", "text":"Hello, world2"} ] }' https://api.line.me/v2/bot/message/push
*/


/*
curl -X POST \
-H 'Content-Type:application/json' \
-H 'Authorization: Bearer 3afONr+SdMrMF6wqpK9QPIliDsyynhIpc9+LEhSX3NzsE9IPNqUgVTDrHxCXbl1v29Wko9VZhvuvHF4z8ywIQHX43fBXHcMOR1xGAta08l+IiPixFGL1e3IENwD/BxMIrxMjg6KqDSFB5DrToBEhhAdB04t89/1O/w1cDnyilFU=' \
-d '{"replyToken": "dabd2ed879204e5f80ac4b0f6468ae5f", "messages":[{"type":"text", "text":"Hello, world1"} ] }' https://api.line.me/v2/bot/message/reply
*/
var async = require('async');
var linebot = require('linebot');
var stock = require('./stock');   
var ptt=require('./ptt')
var store=require('./store')

exports.handler = (event, context, callback) => {
/*
 var a=stock.ipo(function(err,data){
    console.log(data);
 });
 */
console.log(event)
console.log(context)

var bot = linebot({
  channelId: "1506585287",
  channelSecret: "a2be6b188a01a956bbdb20c969534b03",
  channelAccessToken: "3afONr+SdMrMF6wqpK9QPIliDsyynhIpc9+LEhSX3NzsE9IPNqUgVTDrHxCXbl1v29Wko9VZhvuvHF4z8ywIQHX43fBXHcMOR1xGAta08l+IiPixFGL1e3IENwD/BxMIrxMjg6KqDSFB5DrToBEhhAdB04t89/1O/w1cDnyilFU="
});


if (event.hasOwnProperty("events")) {
  var replytoken=event["events"][0].replyToken
  var msg=event["events"][0].message["text"]
  var uid=event.events[0].source["userId"]
  if (msg.match(/^訂閱/)) {
    store.follow_user_save(uid);
    bot.reply(replytoken,[{ type: 'text', text: '訂閱成功!' }])
  }
  if (msg.match(/^取消訂閱/)) {
    store.unfollow_user_save(uid);
    bot.reply(replytoken,[{ type: 'text', text: '已取消訂閱!' }])
  }
  console.log(replytoken+"@"+msg+"@"  +uid)
  console.log("對話")
}else{
//跑通知

async.waterfall([
  function get_previous_data(next){
    //從db取得舊資料
    var db=store.get_ptt_last(function(prev_data){      
      next(null,prev_data)
    });
  },
  function get_now_data(prev_data,next){
    //從網站取得最新資料
    var games=ptt.crawl(function(err,crawl_data){
    var noticeary=[];
            
      for (var g in prev_data){
        if (prev_data.hasOwnProperty(g)) {
              console.log("db來的資料"+g)
        }
      }
      for (var x = crawl_data.data.length - 1; x >= 0; x--) {
        console.log("抓到的資料"+crawl_data.data[x]["data"]);
      }
      //抓回來的資料有新有舊的key mapping prev_data的key，用以辨認新舊
      for (var i = crawl_data.data.length - 1; i >= 0; i--) {
        if (prev_data.hasOwnProperty(crawl_data.data[i]["data"])==false) {          
          noticeary.push(crawl_data.data[i])
          prev_data[crawl_data.data[i]["data"]]="new data"   
        }       
      }

      for (var k in prev_data){
        if (prev_data.hasOwnProperty(k)) {
              console.log("處理後的資料"+"Key is " + k + ", value is " + prev_data[k])
        }
      }      
      for (var i = noticeary.length - 1; i >= 0; i--) {
        console.log("要發出的資料"+noticeary[i]["data"])
      }
      //新抓的資料回寫db
      var db=store.ptt_save(crawl_data,function(){       
        next(null,noticeary)//db存完後發參數pass到下個function，準備發訊息
      });      
    })
  },
  function get_follow_user(noticeary,next){
    store.get_follow_users(function(user){     
      console.log("get_follow_user")
      next(null,{users:user,messages:noticeary})
    })
  },
  function send_notice(noticeobj,next){
     var line_msg_format=[];
     line_msg_format.push({"type":"text","text":"PTT二手交易版有新片囉!"});
     for (var i = noticeobj["messages"].length - 1; i >= 0; i--) {
       var msg={}
       msg["type"]="text"
       msg["text"]=noticeobj["messages"][i]["data"]+" https://www.ptt.cc"+noticeobj["messages"][i]["href"]
       line_msg_format.push(msg);
     }
     //有訊息才發

     if (line_msg_format.length>1) {
        bot.multicast(noticeobj["users"],line_msg_format) 
     }     
     next(null,"ok")
    }  

],function(err,rs){
  if (err) {
    console.log("錯誤")
    callback(null, 'error');
  }
  console.log("完畢")
  callback(null, 'done');
})

}//if 結束
/*
 var games=ptt.crawl(function(err,data){
  console.log(data);
  var db=store.ptt_save(data,function(){
    console.log("ok")
  });
 })
*/


/*
  var bot = linebot({
    channelId: "1506585287",
    channelSecret: "a2be6b188a01a956bbdb20c969534b03",
    channelAccessToken: "3afONr+SdMrMF6wqpK9QPIliDsyynhIpc9+LEhSX3NzsE9IPNqUgVTDrHxCXbl1v29Wko9VZhvuvHF4z8ywIQHX43fBXHcMOR1xGAta08l+IiPixFGL1e3IENwD/BxMIrxMjg6KqDSFB5DrToBEhhAdB04t89/1O/w1cDnyilFU="
  });
    // TODO implement
    console.log(event);
    var replytoken=event.events[0].replyToken
    var type=event.events[0].type
    //mina's userid U90991618d75471edcc58b994132dea9a
    console.log(event.events[0].source)
    console.log(event.events[0].message)
    bot.reply(replytoken,[
     { type: 'text', text: 'Hello, world 1' }
    ])
    */
   // callback(null, 'Hello from Lambda');
};

//exports.handler();