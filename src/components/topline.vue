<template>
  <div class="top">
    <div class="t_title">微信工具箱</div>
    <div class="move" style="-webkit-app-region: drag"></div>
    <div class="right">
      <el-dropdown trigger="click">
        <a>
          <img
            class="el-dropdown-link"
            src="../assets/weixingongjuxiang/shoye/dingbu/01.png"
            alt=""
          />
        </a>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="login_out()"
            >退出登录</el-dropdown-item
          >
          <el-dropdown-item @click.native="changetheme()"
            >切换主题</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <a>
        <img
          class="t_icon"
          src="../assets/weixingongjuxiang/shoye/dingbu/02.png"
          id="maxbt"
          @click="minbt()"
        />
      </a>
      <a>
        <img
          class="t_icon"
          src="../assets/weixingongjuxiang/shoye/dingbu/03.png"
          id="maxbt"
          @click="maxbt()"
        />
      </a>
      <a>
        <img
          class="t_icon"
          src="../assets/weixingongjuxiang/shoye/dingbu/04.png"
          id="maxbt"
          @click="closebt()"
        />
      </a>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
var ipc = require("electron").ipcRenderer;
let axiosinfo = Axios.create({
  baseURL: "http://localhost:5001",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});
export default {
  data() {
    return {
      style: "default",
    };
  },
  props: {
    backgorund: {},
  },
  mounted() {
    const _this = this;
    this.sockets.subscribe("batch_bind", (res) => {
      console.log('xxxxxxxxx',res);
      _this.$store.dispatch("addbind", JSON.parse(res));
    });
    ipc.on("wx_cookies", function (e, data) {
      console.log(data);
      let cookies = "";
      data.cookies.forEach((item) => {
        cookies += `${item.name}=${item.value};`;
      });
      if (data.token == undefined) {
        console.log("第一次载入");
      } else {
        axiosinfo({
          url: "/api/invite_bind",
          method: "post",
          data: {
            token: data.token,
            cookie: cookies,
          },
        }).then((response) => {
          console.log(response);
          _this.$store.dispatch("inv_bind", response.data.data);
        });
      }
    });
  },
  methods: {
    changetheme() {
      //--theme-bgcolor: #272237;
      // --theme-mainbg: #1D182B;
      // --theme-bgcard: #302A43;
      // --theme-cardfont: #989BA5;
      // --theme-bordercolor: #3f3851;
      // --theme-tablebg: #312C3F;
      // --theme-tablefont: #97B5F7;
      // --theme-tableth: #272237;
      if (this.style == "default") {
        document.documentElement.style.setProperty(
          "--theme-bgcolor",
          "#6272a4"
        );
        document.documentElement.style.setProperty("--theme-mainbg", "#fff");
        document.documentElement.style.setProperty("--theme-bgcard", "#F3F5F7");
        document.documentElement.style.setProperty("--theme-cardfont", "#000");
        document.documentElement.style.setProperty(
          "--theme-bordercolor",
          "#DEDEDE"
        );
        document.documentElement.style.setProperty(
          "--theme-tablebg",
          "#F4F4F4"
        );
        document.documentElement.style.setProperty("--theme-tablefont", "#000");
        document.documentElement.style.setProperty("--theme-tableth", "#fff");
        document.documentElement.style.setProperty("--theme-hover", "#566388");
        document.documentElement.style.setProperty("--theme-bbt", "#DEDEDE");
        document.documentElement.style.setProperty("--theme-bri", "#DEDEDE");
        this.style = "light";
        return;
      }
      if (this.style == "light") {
        document.documentElement.style.setProperty(
          "--theme-bgcolor",
          "#272237"
        );
        document.documentElement.style.setProperty("--theme-mainbg", "#1D182B");
        document.documentElement.style.setProperty("--theme-bgcard", "#302A43");
        document.documentElement.style.setProperty(
          "--theme-cardfont",
          "#989BA5"
        );
        document.documentElement.style.setProperty(
          "--theme-bordercolor",
          "#3f3851"
        );
        document.documentElement.style.setProperty(
          "--theme-tablebg",
          "#312C3F"
        );
        document.documentElement.style.setProperty(
          "--theme-tablefont",
          "#97B5F7"
        );
        document.documentElement.style.setProperty(
          "--theme-tableth",
          "#272237"
        );
        document.documentElement.style.setProperty("--theme-hover", "#3D3552");
        document.documentElement.style.setProperty("--theme-bbt", "#332e41");
        document.documentElement.style.setProperty("--theme-bri", "#4d4660");
        this.style = "default";
        return;
      }
    },
    maxbt() {
      ipc.send("window-max");
    },
    minbt() {
      ipc.send("window-min");
    },
    closebt() {
      this.login_out(1);
      //   ipc.send("window-close");
    },
    login_out(type) {
      this.sockets.unsubscribe("batch_bind");
      this.$socket.close();
      console.log(ipc);
      if (type == 1) {
        ipc.send("window-close");
      } else {
        this.$router.push("/");
      }
      // axiosinfo({
      //   url: "/api/logout",
      //   method: "post",
      // }).then((response) => {
      //   console.log("/posts post", response.data);
      //   if (response.data.code == 200) {
      //     this.sockets.unsubscribe("batch_bind");
      //     this.$socket.close();
      //     console.log(ipc);
      //     if (type == 1) {
      //       ipc.send("window-close");
      //     } else {
      //       this.$router.push("/");
      //     }
      //   }
      //   if (response.data.code == 201) alert(response.data.msg);
      // });
    },
  },
};
</script>

<style lang="less">
.top {
  background: var(--theme-bgcolor);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid var(--theme-bordercolor);
}
.right {
  width: 20%;
  min-width: 200px;
  display: flex;
  justify-content: space-around;
}
.move {
  flex: 1;
  height: 100%;
  width: 100%;
}
.top img {
  width: 20px;
  height: 20px;
  margin: 10px;
}
.top img:hover {
  background: #3f3851;
}
.t_title {
  font-size: 18px;
  color: #fff;
  padding: 0 30px;
}
</style>