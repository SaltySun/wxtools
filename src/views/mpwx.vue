<template>
  <div>
    <div id="div">
      <!-- <el-button @click="bbb">按钮</el-button> -->
      <webview
        id="foo"
        ref="foo"
        :src="src"
        style="display:inline-block width:100%px; height:100%px;"
        useragent="Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36"
        httpreferrer="https://mp.weixin.qq.com"
        allowpopups="on"
      ></webview>
      <!--
    <iframe id="foo" src="https://mp.weixin.qq.com" style="display:inline-block;" allowpopups='on'></iframe> -->
    </div>
  </div>
</template>

<script>
import { Loading } from "element-ui";
var ipc = require("electron").ipcRenderer;
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      src: "https://mp.weixin.qq.com",
      arr: [],
      abc: "",
      wxinfo: null,
    };
  },
  computed: {},
  methods: {
    async bbb() {
      let loadingInstance = Loading.service({
        target: document.querySelector("#div"),
        text: "玩命加载中，不要催...",
        background: "#fff",
      });

      let foo = document.querySelector("#foo");
      var token = this.wxinfo.token;
      this.abc =
        this.wxinfo.cookie + "\n" + 'window.document.cookie="wxuin="; ';
      console.log("服务器返回的cookie1");
      var clear_all_cookies =
        "function clearAllCookie() { var keys = document.cookie.match(/[^ =;]+(?==)/g); if(keys) { for(var i = keys.length; i--;) document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() }}; clearAllCookie();";
      // foo.openDevTools()
      let cookie = await foo.executeJavaScript("document.cookie");
      console.log("浏览器没有清空之前的cookie");
      console.log(cookie);
      console.log("浏览器清空cookie");
      foo.executeJavaScript(clear_all_cookies);

      cookie = await foo.executeJavaScript("document.cookie");
      console.log("浏览器清空之后的cookie");
      console.log(cookie);
      await foo.executeJavaScript(this.abc);

      console.log("注入完毕");
      cookie = await foo.executeJavaScript("document.cookie");
      console.log("浏览器注入完毕之后的cookie");
      console.log(cookie);
      foo.loadURL(
        "https://mp.weixin.qq.com/cgi-bin/home?t=home/index&token=" +
          token +
          "&lang=zh_CN"
      );

      // let loadingInstance = Loading.service(document.querySelector('#div'));
      setTimeout(() => {
        loadingInstance.close();
      }, 4000);
    },
  },
  created() {},
  mounted() {
    const _this = this;
    ipc.on("wxdata", function (e, data) {
      console.log("---------------", data);
      _this.wxinfo = data;
    });
    setTimeout(() => {
      this.bbb();
    }, 2000);
  },
};
</script>

<style lang="less">
#foo {
  width: 100%;
  height: 1000px;
}
</style>