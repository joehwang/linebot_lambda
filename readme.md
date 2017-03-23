`zip deploy.zip  -r index.js node_modules/ package.json ptt.js stock.js store.js`

`aws lambda update-function-code --function-name linebot_lambda --zip-file fileb://deploy.zip`

`aws lambda invoke \
--invocation-type RequestResponse \
--function-name linebot_lambda \
--region us-west-2 \
--log-type Tail \
--payload '{"key1":"value1", "key2":"value2", "key3":"value3"}' \
--profile adminuser \
outputfile.txt `