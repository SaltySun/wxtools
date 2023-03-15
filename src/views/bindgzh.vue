<template>
  <div class="outer">
    <div class="step">
      <div class="step_top">
        <div class="step_title">
          <div class="step_bold">绑定公众号功能操作步骤</div>
          <div class="step_con">4步带你玩转后台管理</div>
        </div>
        <div class="step_btn"></div>
      </div>
      <div class="step_pic">
        <div class="cards">
          <img src="../assets/weixingongjuxiang/piliangdnegl/01.png" alt="" />
          <div>PC端登录公众号的微信</div>
        </div>
        <img
          class="step_icon"
          src="../assets/weixingongjuxiang/piliangdnegl/02.png"
        />
        <div class="cards">
          <img src="../assets/weixingongjuxiang/piliangdnegl/01.png" alt="" />
          <div>打开 服务通知 的服务号 点击公众号邀请绑定运营的 按钮</div>
        </div>
        <img
          class="step_icon"
          src="../assets/weixingongjuxiang/piliangdnegl/02.png"
        />
        <div class="cards">
          <img src="../assets/weixingongjuxiang/piliangdnegl/01.png" alt="" />
          <div>打开链接 微信中邀请绑定的链接</div>
        </div>
        <img
          class="step_icon"
          src="../assets/weixingongjuxiang/piliangdnegl/02.png"
        />
        <div class="cards">
          <img src="../assets/weixingongjuxiang/piliangdnegl/01.png" alt="" />
          <div>
            表格中会自动新增一个邀请公众号的名字和信息 如果没有展示出来
            重新打开软件或找软件开发者解决 列表展示是想要的公众号之后
            点击同意绑定按钮 提交绑定等 待绑定结果
          </div>
        </div>
      </div>
    </div>
    <div class="wxtable">
      <div class="chcur">
        <div :class="indexcur == 0 ? 'xcur cur' : 'xcur'" @click="setcur(0)">
          <span>邀请绑定</span>
        </div>
        <div :class="indexcur == 1 ? 'xcur cur' : 'xcur'" @click="setcur(1)">
          <span>批量绑定</span>
        </div>
      </div>
      <div class="toolsbar" v-show="indexcur == 0">
        <div>
          <el-input
            placeholder="搜索公众号名称"
            prefix-icon="el-icon-search"
            v-model="gzhkeyword"
            @keyup.enter.native="search"
          >
          </el-input>
        </div>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="openwin2()"
          >邀请</el-button
        >
      </div>
      <div class="table-area" v-show="indexcur == 0">
        <el-table
          ref="table"
          :data="inv_list"
          :border="false"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.4)"
          v-loading="loading"
          :height="tableheight"
        >
          <el-table-column prop="id" label="序号" width="60"> </el-table-column>
          <el-table-column prop="gzh_id" label="原始ID" width="">
          </el-table-column>
          <el-table-column prop="gzh_name" label="账号名称" width="">
          </el-table-column>
          <el-table-column prop="status" label="登录状态" width="">
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click.native="openwin3(scope.row)"
              >
                重新操作
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="batch_bind_bar" v-show="indexcur == 1">
        <a
          ><div
            class="bind"
            style="background-color: #02d290"
            @click="startbind()"
          >
            <i class="el-icon-link" style="color: #fff"></i>
            <span>开始绑定</span>
          </div></a
        >
        <a
          ><div
            class="del"
            style="background-color: #f93030"
            @click="delsucbind()"
          >
            <i class="el-icon-remove-outline" style="color: #fff"></i>
            <span>移除绑定成功的记录</span>
          </div></a
        >
      </div>
      <div class="table-area" v-show="indexcur == 1">
        <el-table
          ref="table"
          :data="batch_bind_list"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.4)"
          :border="false"
          v-loading="loading"
          :height="tableheight"
        >
          <el-table-column prop="id" label="序号" width="60"></el-table-column>
          <el-table-column prop="invitor" label="邀请人" width="">
          </el-table-column>
          <el-table-column prop="gzh_name" label="公众号名称" width="">
          </el-table-column>
          <el-table-column prop="bind_status" label="绑定状态" width="">
            <template slot-scope="scope">
              <span>{{
                scope.row.bind_status == 0 ? "未绑定" : "已绑定"
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
  
<script>
var ipc = require("electron").ipcRenderer;
import { mapState, mapGetters } from "vuex";
import Axios from "axios";
let axiosinfo = Axios.create({
  baseURL: "http://localhost:5001/",
});
export default {
  data() {
    return {
      list: [],
      dialogVisible: false,
      rqInt: null,
      msg: "",
      randomId: null,
      checkbtn: true,
      indexcur: 0,
      gzhkeyword: "",
      loading: false,
      tableheight:300
    };
  },
  computed: {
    ...mapState(["inv_list", "batch_bind_list"]),
  },
  mounted() {
    var _this = this;
    this.tableheight = document.getElementsByClassName("table-area")[0].offsetHeight;
    window.onresize = () => {
      return (() => {
        _this.tableheight =
          document.getElementsByClassName("table-area")[0].offsetHeight;
      })();
    };
    // tmd进来绑定一次会导致多次绑定，我给丢全局了
    // this.sockets.subscribe("batch_bind", (res) => {
    //   console.log(res);
    //   _this.$store.dispatch("addbind", JSON.parse(res));
    // });
    // console.log(this.sockets)
    // ipc.on("wx_cookies", function (e, data) {
    //   console.log(data);
    //   let cookies = "";
    //   data.cookies.forEach((item) => {
    //     cookies += `${item.name}=${item.value};`;
    //   });
    //   if (data.token == undefined) {
    //     console.log("第一次载入");
    //   } else {
    //     _this.loading = true;
    //     axiosinfo({
    //       url: "/api/invite_bind",
    //       method: "post",
    //       data: {
    //         token: data.token,
    //         cookie: cookies,
    //       },
    //     }).then((response) => {
    //       console.log(response);
    //       _this.loading = false;
    //       _this.$store.dispatch("inv_bind", response.data.data);
    //     });
    //   }
    // });
  },
  methods: {
    search(e) {
      this.$store.dispatch("seach_inv", this.gzhkeyword);
    },
    // 邀请绑定的
    openwin2() {
      ipc.send("open");
    },
    // 重新操作的
    openwin3(e) {
      let newcookielist = e.cookie.split(";");
      newcookielist.pop();
      let cookie = "";
      console.log(newcookielist);
      newcookielist.forEach((item) => {
        cookie += `window.document.cookie="${item}";\n`;
      });
      ipc.send("reopen", { token: e.token, cookie });
    },
    setcur(type) {
      this.indexcur = type;
    },
    // 自己ctrl+f
    startbind() {
      const _this = this;
      this.loading = true;
      axiosinfo({
        url: "/api/start_bind",
        method: "post",
      }).then((res) => {
        console.log(res);
        _this.loading = false;
        _this.$store.dispatch("startbind", res.data.data);
      });
    },
    delsucbind() {
      const _this = this;
      this.loading = true;
      axiosinfo({
        url: "/api/rm_succ_bind",
        method: "post",
      }).then((res) => {
        console.log(res);
        _this.loading = false;
        _this.$store.dispatch("startbind", res.data.data);
      });
    },
  },
  beforeDestroy() {
    // 关闭 Socket
    // this.sockets.unsubscribe("batch_bind");
    // console.log(this.$socket)
    // this.$socket.close();
  },
};
</script>

<style lang="less" scoped>
.outer {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.step {
  background-color: var(--theme-bgcolor);
  padding: 14px;
  height: 200px;
  display: flex;
  flex-direction: column;
}

.step_top {
  display: flex;
  justify-content: space-between;
}

.step_title {
  display: flex;
  align-items: baseline;
}

.step_bold {
  font-size: 18px;
  font-weight: bold;
  margin-right: 20px;
  color: #fff;
}

.step_con {
  color: #bfbdb6;
  font-size: 14px;
}
.step_btn {
  display: flex;
}
.step_btn img {
  margin: 0 10px;
  width: 110px;
  height: 34px;
  border-radius: 5px;
}

.step_pic {
  display: flex;
  align-items: center;
  height: 100%;
}

.step_icon {
  width: 24px;
  height: 24px;
}

.cards {
  display: flex;
  background-color: var(--theme-bgcard);
  font-size: 14px;
  padding: 11px 14px;
  align-items: center;
  border-radius: 10px;
  flex: 1;
  height: 50%;
  color: var(--theme-cardfont);
}

.cards img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.cards div {
  min-width: 100px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
.wxtable {
  flex: 1;
  background: var(--theme-tableth);
  // margin-top: 20px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .table-area {
    flex: 1;
  }
  .chcur {
    display: flex;
    color: var(--theme-tablefont);
    font-size: 14px;
    font-weight: 500;
    border-top: 1px solid var(--theme-bordercolor);
    border-bottom: 1px solid var(--theme-bordercolor);
    .xcur {
      padding: 10px;
      border-top: 2px solid var(--theme-tableth);
    }
    .cur {
      background: var(--theme-hover);
      border-top: 2px solid #0f5bff !important;
    }
  }
  .toolsbar {
    display: flex;
    width: 340px;
    justify-content: space-between;
    padding: 10px;
  }
  .batch_bind_bar {
    display: flex;
    padding: 10px;
    div {
      height: 30px;
      padding: 0 5px;
      margin: 0 10px;
      border-radius: 3px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        color: #fff !important;
      }
      i {
        font-size: 15px;
        margin: 0 4px;
      }
    }
  }
}
.upload-btn-box {
  button {
    margin-right: 10px;
  }
  input[type="file"] {
    display: none;
  }
}
// el-input
/deep/ .el-input {
  .el-textarea__inner,
  .el-input__inner {
    height: 30px;
    line-height: 30px;
    background: transparent !important;
    border: var(--theme-bordercolor) 1px solid;
  }
  .el-input__icon {
    line-height: 30px;
  }
}

/*修改table 表体的背景颜色和文字颜色*/
/deep/ .el-table {
  background-color: transparent;
  position: absolute;
  th,
  td {
    background-color: transparent;
    border-bottom: 1px solid var(--theme-bbt) !important;
    border-right: 1px solid var(--theme-bri) !important;
  }
  tr {
    background-color: var(--theme-tablebg);
    color: var(--theme-tablefont);
  }
  .tr > th {
  }
  .el-table__expanded-cell {
    background-color: transparent !important;
  }
  .is-leaf {
    border-bottom: 1px solid #332e41;
  }
  .cell {
    text-align: center;
  }
  // 表头背景色
  th.el-table__cell {
    background-color: var(--theme-tablebg);
    text-align: center;
    border-bottom: 1px solid var(--theme-bbt) !important;
    border-right: 1px solid var(--theme-bri) !important;
  }
  tr > td {
    background-color: var(--theme-mainbg);
    color: var(--theme-tablefont);
    text-align: center;
    border-bottom: 1px solid var(--theme-bbt);
    border-right: 1px solid var(--theme-bri) !important;
  }

  .el-table::before {
    background: none;
  }

  // hover效果
  tr:hover > td {
    background-color: rgba(0, 0, 0, 0) !important;
  }

  tbody tr:hover > td {
    background-color: var(--theme-hover) !important;
    // text-align: center;
  }

  // 滚动条宽高
  .el-table__body-wrapper::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  .el-table__body-wrapper::-webkit-scrollbar {
    width: 10px;
    /*滚动条宽度*/
    height: 10px;
    /*滚动条高度*/
  }
  /*定义滚动条轨道 内阴影+圆角*/
  .el-table__body-wrapper::-webkit-scrollbar-track {
    box-shadow: 0px 1px 3px #000 inset;
    /*滚动条的背景区域的内阴影*/
    border-radius: 3px;
  }

  /*定义滑块 内阴影+圆角*/
  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    box-shadow: 0px 1px 3px #fff inset;
    border-radius: 6px;
    background-color: #312c3f;
  }
}
</style>