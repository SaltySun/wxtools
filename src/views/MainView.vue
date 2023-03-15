<template>
  <div class="main">
    <!-- :style="'width: ' + sidewidth + 'px;'" -->
    <div class="rights" ref="rbar">
      <div class="left_btn">
        <div class="logo_close">
          <img src="../assets/weixingongjuxiang/shoye/logo.png" class="icon" />
          <div>
            <div>武汉巨焰网络有限公司</div>
            <div>Juyan Network</div>
          </div>
        </div>
      </div>
      <a
        ><div class="bar" @click="show()" @mousedown="down(0)" @mouseup="up(0)">
          <img
            src="../assets/weixingongjuxiang/shoye/daohanglan/01.png"
            alt=""
          />
          <div class="text">收起</div>
        </div>
      </a>
      <a v-if="configlist.homepage"
        ><div :class="cur == 1 ? 'bar cur' : 'bar'" @click="home(1)">
          <img
            src="../assets/weixingongjuxiang/shoye/daohanglan/02.png"
            alt=""
          />
          <div class="text">首页</div>
        </div></a
      >
      <a v-if="configlist.wxloginpage"
        ><div :class="cur == 2 ? 'bar cur' : 'bar'" @click="home(2)">
          <img
            src="../assets/weixingongjuxiang/shoye/daohanglan/03.png"
            alt=""
          />
          <div class="text">授权登录</div>
        </div></a
      >
      <a v-if="configlist.delgzhpage"
        ><div :class="cur == 3 ? 'bar cur' : 'bar'" @click="home(3)">
          <img
            src="../assets/weixingongjuxiang/shoye/daohanglan/05.png"
            alt=""
          />
          <div class="text">删除文章</div>
        </div></a
      >
      <a v-if="configlist.bindgzhpage"
        ><div :class="cur == 4 ? 'bar cur' : 'bar'" @click="home(4)">
          <img
            src="../assets/weixingongjuxiang/shoye/daohanglan/04.png"
            alt=""
          />
          <div class="text">绑定公众号</div>
        </div></a
      >
    </div>
    <div class="topbar">
      <topline></topline>
      <div class="wix">
        <router-view></router-view>
        <div class="bottombar">
          <span>By:JuYan</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import topline from "../components/topline.vue";
import list from "../utils/config.js"
export default {
  data() {
    return {
      isCollapse: true,
      Interval: null,
      sidewidth: 70,
      cur: 1,
      configlist:[]
    };
  },
  components: {
    topline,
  },
  mounted() {
    // console.log(list)
    this.configlist = list.toolslist
  },
  methods: {
    down(index) {},
    up(index) {},
    home(index) {
      this.cur = index;
      if (index == 1) {
        this.$router.replace("/tools");
      }
      if (index == 2) {
        this.$router.replace("/wxlogin");
      }
      if (index == 3) {
        this.$router.replace("/delgzh");
      }
      if (index == 4) {
        this.$router.replace("/bindgzh");
      }
    },
    // 侧边栏
    show() {
      console.log(this.$refs.rbar.className);
      if (this.$refs.rbar.className == "rights") {
        this.$refs.rbar.classList.add("r_close");
      }
      if (this.$refs.rbar.className == "rights r_close") {
        this.$refs.rbar.classList.remove("r_close");
        this.$refs.rbar.classList.add("r_show");
        return;
      }
      if (this.$refs.rbar.className == "rights r_show") {
        this.$refs.rbar.classList.remove("r_show");
        this.$refs.rbar.classList.add("r_close");
        return;
      }
    },
  },
};
</script>

<style>
.main {
  display: flex;
  height: 100%;
  /* background: var(--theme-mainbg); */
}
.topbar {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.icon {
  width: 40px;
  height: 40px;
  margin-left: 12px;
}
.left_btn {
  display: flex;
  color: #fff;
  align-items: center;
  background-color: var(--theme-bgcolor);
}

.logo_close {
  color: #fff;
  display: flex;
  align-items: center;
  height: 68px;
  display: flex;
  overflow: hidden;
}
.logo_close div {
  white-space: nowrap;
  margin-left: 10px;
}
.rights {
  min-width: 70px;
  width: 70px;
  border-right: 1px solid var(--theme-bordercolor);
  /* animation-name: close;
  animation-duration: 0.5s; */
  /* padding: 0 2px; */
  overflow: hidden;
  background-color: var(--theme-bgcolor);
  height: 100%;
}
.r_show {
  width: 220px;
  animation-name: shows;
  animation-duration: 0.5s;
}
.r_close {
  width: 70px;
  animation-name: closes;
  animation-duration: 0.5s;
}

.bar {
  display: flex;
  align-items: center;
  color: #fff;
  height: 40px;
  margin-bottom: 10px;
  width: 100%;
}

.bar img {
  width: 20px;
  height: 20px;
  margin-left: 22px;
}

.bar div {
  margin-left: 30px;
  white-space: nowrap;
}
.click {
  background: #d7e9ff;
}
.wix {
  background: var(--theme-mainbg);
  height: calc(100% - 100px);
  /* padding: 6px 0 0 6px; */
}
.bottombar {
  display: flex;
  align-items: center;
  background: var(--theme-bgcolor);
  color: #fff;
  font-weight: 600;
  justify-content: space-between;
  height: 40px;
  /* margin-top: 20px; */
  padding: 0 20px;
}
.cur {
  background: var(--theme-hover);
}

@keyframes shows {
  from {
    width: 70px;
  }
  to {
    width: 220px;
  }
}

@keyframes closes {
  from {
    width: 220px;
  }
  to {
    width: 70px;
  }
}
</style>