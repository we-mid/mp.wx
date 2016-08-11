## Troubleshootings

```plain
Error: Chosen SHA variant is not supported
    at Error (native)
    at new y (/Users/fritx/d/mp.wx/node_modules/jssha/src/sha.js:14:152)
    at sign (/Users/fritx/d/mp.wx/server/wxsign.js:45:16)
```

新版jssha@2.x不支持，转为安装1.x版本
