

/*
aws lambda update-function-code \
--region ap-northeast-1 \
--function-name linebot_lambda \
--zip-file fileb://linebot.zip
*/

//bot.push("U09b928f3b6fafb9fe1b4f0ef937196df","aaffff")


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

 var games=ptt.crawl(function(err,data){
  console.log(data);
  var db=store.ptt_save(data,function(){
    console.log("ok")
  });
 })



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

exports.handler();