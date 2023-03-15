<template>
  <div class="view_page">
    <div class="lefts">
      <div class="title">
        <p class="tops">武汉<i class="type">巨焰网络</i>有限公司</p>
        <p class="bottom">智慧-创造价值</p>
      </div>
      <img class="login_img" src="../assets/dengluye/01.1.png" />
    </div>
    <div class="right_lo">
      <div class="login_view">
        <div class="login_title">登录</div>
        <div class="input-area">
          <div class="content">
            <img src="../assets/dengluye/01.png" class="login_icon" />
            <div>用户名：</div>
          </div>
          <div>
            <input
              class="input"
              type="text"
              id="username"
              placeholder="用户名"
              v-model="username"
            />
          </div>
          <div class="content">
            <img src="../assets/dengluye/02.png" class="login_icon" />
            <div>密码：</div>
          </div>
          <div>
            <input
              class="input"
              type="password"
              id="password"
              placeholder="密码"
              v-model="password"
              @keyup.enter="logins()"
            />
          </div>
        </div>
        <button class="btn_login" @click="logins()">登录</button>
        <div class="fac">
          <img src="../assets/dengluye/03.png" class="login_icon" />
          <div>武汉巨焰网络有限公司</div>
        </div>
      </div>
    </div>
    <div class="topline">
      <div class="move" style="-webkit-app-region: drag"></div>
      <div>
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
  </div>
</template>
  
<script>
import topline from "../components/topline.vue";
import Axios from "axios";
var ipc = require("electron").ipcRenderer;
export default {
  name: "app",
  data() {
    return {
      password: "",
      username: "",
    };
  },
  mounted() {},
  components: {
    topline,
  },
  methods: {
    socketOpen() {
      this.$socket.open(); // 开始连接 socket
      // this.socketSendmsg();
    },
    socketSendmsg() {
      console.log("start");
      this.$socket.emit("batch_login", "start");
    },
    maxbt() {
      ipc.send("window-max");
    },
    minbt() {
      ipc.send("window-min");
    },
    closebt() {
      ipc.send("window-close");
    },
    logins() {
      if (this.username == "") {
        this.$message({
          message: "用户名为空",
          type: "warning",
        });
        return;
      }
      if (this.password == "") {
        this.$message({
          message: "密码为空",
          type: "warning",
        });
        return;
      }
      let axiosinfo = Axios.create({
        baseURL: "http://localhost:5001",
      });
      axiosinfo({
        url: "/api/login",
        method: "post",
        data: {
          username: this.username,
          password: this.password,
        },
      }).then((response) => {
        console.log("/posts post", response.data);
        if (response.data.code == 200) {
          this.socketOpen();
          this.$router.push("tools");
        }
        if (response.data.code == 201) {
          this.$message({
            message: response.data.msg,
            type: "warning",
          });
        }
      });
    },
  },
};
</script>
  
  <style scoped>
.view_page {
  background-color: #1f2125;
  display: flex;
  justify-content: space-around;
  padding: 100px;
  height: 100%;
  align-items: center;
}
.lefts {
  color: #fff;
  flex: 1;
}
.title {
  width: 400px;
}
.tops {
  width: 100%;
  font-size: 38px;
  text-align: justify;
}
.type {
  color: #0f5bff;
}
.bottom {
  width: 100%;
  font-size: 24px;
  text-align: justify;
}
p::after {
  content: "";
  display: inline-block;
  padding-left: 100%;
  margin-left: 100%;
}
.login_img {
  width: 80%;
  height: auto;
}
.right_lo {
  flex: 1;
}
.login_view {
  padding: 40px;
  background-color: #fff;
  width: 430px;
}
.login_icon {
  width: 28px;
  height: 28px;
}
.login_title {
  font-size: 28px;
  color: #6e7588;
}
.content {
  display: flex;
  font-size: 16px;
  color: #53575d;
  align-items: center;
  margin: 14px 0;
}
.content div {
  margin: 8px;
}
.input {
  width: 100%;
  height: 48px;
  border: 1px solid#D0D3DA;
  padding: 0 14px;
}
::placeholder {
  font-size: 16px;
  color: #d0d3da;
}
.btn_login {
  background-color: #0f5bff;
  color: #fff;
  width: 100%;
  margin-top: 40px;
  height: 40px;
  border-radius: 5px;
  border: none;
}
.fac {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 41px;
}
.fac div {
  margin: 0 10px;
}
.topline {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
}
.topline .move {
  height: 100px;
  flex: 1;
}
.topline img {
  width: 20px;
  height: 20px;
  margin: 10px;
}
</style>
  