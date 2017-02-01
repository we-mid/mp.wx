## Roadmap

- [x] 定制title,desc,image基本实现
- [x] text大字静态页
- [x] 语音定制分享+素材保存
- [ ] 极简样式

## Troubleshootings

```plain
Error: Chosen SHA variant is not supported
    at Error (native)
    at new y (/Users/fritx/d/mp.wx/node_modules/jssha/src/sha.js:14:152)
    at sign (/Users/fritx/d/mp.wx/server/wxsign.js:45:16)
```

新版jssha\@2.x不支持，转为安装1.x版本
