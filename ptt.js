var request = require("request");
var cheerio = require("cheerio");
var async = require('async');
var filter=function(_items,_type){
  var skip_filter="公告|提醒"
  var re = new RegExp(skip_filter)
  var r=[];
  if (_type==undefined){
    _type="all"
  }
  for (var i = _items.length - 1; i >= 0; i--) {    
    if (re.exec(_items[i].data)) {
      continue;
    }else{
      r.push(_items[i])
    }
  }  
  return r
}
var crawl= function(cb) {
async.waterfall([
  function requrl(next){//抓資料
    request({
    url: "https://www.ptt.cc/bbs/Gamesale/index.html",   
    method: "GET"
    }, function(e,r,b) { /* Callback 函式 */
    /* e: 錯誤代碼 */
    /* b: 傳回的資料內容 */
    if (e==null) {
      //console.log(b);
      next(null,b)
    }
    });
  },
  function cleanup(res,next){ //清洗資料    
    ptt_items={"prevurl":"","data":[]};
    $=cheerio.load(res);    
    p=$("div.btn-group-paging a")
    for (var i = p.length - 1; i >= 0; i--) {      
      if (p[i].children[0].data.match(/上頁/)) {
        prevurl=p[i].attribs.href
        ptt_items["prevurl"]=prevurl
      }
    }

    p=$("div.r-ent")
    //console.log(p)
    var items=[];
    try {
       for (var i = p.length - 1; i >= 0; i--) {      
      var a_tag=p[i].children[5].children[1] //抓 a tag
      var meta_tag=p[i].children[7] //抓mata tag
      var post_date=meta_tag.children[1].children[0].data
      var author=meta_tag.children[3].children[0].data          
      var item={}; 
      item["seq"]=i     
      item["href"]=a_tag.attribs.href;
      item["data"]=a_tag.children[0].data;
      item["posted_at"]=post_date
      item["author"]=author
      //console.log(p[i].attribs.href)
      //console.log(p[i].children[0].data)
      //console.log(item)
      items.push(item);
    }
    }catch(err) {
   
    }

    var items=filter(items);
    ptt_items["data"]=items;
    //console.log(prevurl)

    next(null,ptt_items)
  }

],cb)

}
//crawl();
module.exports.crawl = crawl;
