`zip deploy.zip  -r index.js node_modules/ package.json ptt.js stock.js store.js`
`aws lambda update-function-code --function-name linebot_lambda --zip-file fileb://deploy.zip`