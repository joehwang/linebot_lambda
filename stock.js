var request = require("request");
var cheerio = require("cheerio");
var iconv = require('iconv-lite');
var async = require('async');
var getstock= function(cb) {
async.waterfall([
  function requrl(next){
    request({
    url: "http://www.twse.com.tw/docs1/data01/market/public_html/a10510.txt",
    encoding: null,
    method: "GET"
    }, function(e,r,b) { /* Callback 函式 */
    /* e: 錯誤代碼 */
    /* b: 傳回的資料內容 */
    if (e==null) {
      var a  =iconv.decode(b,'big-5');
      //console.log(a)
      var ary=a.split("=================================================================")
      console.log(ary.length)
      var stocks=[];
      for (var i = ary.length - 1; i >= 0; i--) {
        if (ary[i].match(/產業類別、上市股票代號及簡稱/)!=null) {
          var name=ary[i].match(/\(三\)簡稱：(\S*)/)
          var code=ary[i].match(/\(二\)代號：(\S*)/)
          var rawtsdate=ary[i].match(/(上市買賣開始日期：(\S*)|上市股票開始買賣日期：(\S*))/)
          var d=rawtsdate[1].match(/民國(\d*)年(\d*)月(\d*)日/)
          var tsdate=parseInt(d[1])+1911+"/"+d[2]+"/"+d[3]
          console.log(name[1]+code[1]+tsdate)
          stocks.push({"name":name[1],"code":code[1],"date":tsdate})
        }
      }
      //var res=iconv.encode(a,'utf-8');
      //console.log(res)
     // console.log(iconv.convert(b))
      //console.log(encoding.convert(b,'UTF-8','ASCII'));
      next(null,stocks)
    }
    });
  },
  function showcrawel(res,next){
    $ = cheerio.load(res);
    titles = $("div#newstext p").text();
    console.log(titles)

    next(null,res)
  }

],cb)

}

module.exports.ipo = getstock;