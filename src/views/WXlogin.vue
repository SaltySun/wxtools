<template>
  <div class="outer">
    <div class="step">
      <div class="step_top">
        <div class="step_title">
          <div class="step_bold">授权登录公众号功能步骤</div>
          <div class="step_con">4步带你玩转后台管理</div>
        </div>
        <div class="step_btn">
          <div class="upload-btn-box">
            <img
              @click="choiceImg"
              src="../assets/weixingongjuxiang/piliangdnegl/03.png"
              alt=""
            />
            <input
              ref="filElem"
              type="file"
              class="upload-file"
              @change="getFile"
            />
          </div>

          <img
            src="../assets/weixingongjuxiang/piliangdnegl/04.png"
            @click="checkloacl(1)"
            alt=""
          />
        </div>
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
          <div>
            点击导入账号按钮导入的文本为txt文件txt一行一个账号密格式 用户名-密码
          </div>
        </div>
        <img
          class="step_icon"
          src="../assets/weixingongjuxiang/piliangdnegl/02.png"
        />
        <div class="cards">
          <img src="../assets/weixingongjuxiang/piliangdnegl/01.png" alt="" />
          <div>
            点击授权登录按钮,复制链接https://w.url.cn/s/A3LuMW7微信聊天窗口中打开链接
          </div>
        </div>
        <img
          class="step_icon"
          src="../assets/weixingongjuxiang/piliangdnegl/02.png"
        />
        <div class="cards">
          <img src="../assets/weixingongjuxiang/piliangdnegl/01.png" alt="" />
          <div>点击我已验证按钮,账号如果成功软件的表格每行会显示登录状态</div>
        </div>
      </div>
    </div>
    <div class="wxtable">
      <el-table ref="table" :data="wxlist" :border="false" height="100%" >
        <el-table-column prop="id" label="序号" width="100">
        </el-table-column>
        <el-table-column prop="gzh_id" label="原始ID" width="">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="">
        </el-table-column>
        <el-table-column prop="password" label="密码" width="">
        </el-table-column>
        <el-table-column prop="gzh_name" label="账号名称" width="">
        </el-table-column>
        <el-table-column prop="type" label="账号类型" width="">
        </el-table-column>
        <el-table-column prop="login_status" label="登录状态" width="">
        </el-table-column>
      </el-table>
    </div>
    <!-- <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>{{ msg }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button>取消验证</el-button>
        <el-button type="primary" :disabled="checkbtn" @click="checkloacl(1)"
          >我已验证</el-button
        >
      </span>
    </el-dialog> -->
  </div>
</template>
  
<script>
import { mapState, mapGetters } from "vuex";
import Axios from "axios";
let axiosinfo = Axios.create({
  baseURL: "http://localhost:5001",
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
    };
  },
  computed: {
    // ...mapState(["wxlist"]),
    ...mapGetters(["wxlist"]),
  },
  methods: {
    closesub() {
      this.sockets.unsubscribe("server_logged");
    },
    socketEmit() {
      this.$socket.emit("batch_login", "start");
      // 订阅事件
      this.sockets.subscribe("server_logged", (res) => {
        let newres = JSON.parse(res);
        console.log("newres",newres);
        if (newres.code == 200) {
          this.$store.dispatch("batch_login", JSON.parse(res));
          // 关闭订阅
          if (newres.data.remain_login_num == 0) {
            console.log("close");
            this.closesub();
          }
        }
        if (newres.code == 201) {
          this.$message({
            message: newres.data.msg,
            type: "error",
          });
          this.closesub();
        }
      });
    },
    checkloacl(type) {
      axiosinfo({
        url: "/api/check_wx_pc",
        method: "post",
        data: {
          action: type,
        },
      }).then((response) => {
        console.log(response);
        if (response.data.code == 200) {
          this.$message({
            message: response.data.msg,
            type: "success",
          });
          this.socketEmit();
          this.dialogVisible = false;
        }
        if (response.data.code == 201) {
          this.$message({
            message: response.data.msg,
            type: "warning",
          });
        }
        if (response.data.code == 202) {
          this.$message({
            message: response.data.msg,
            type: "warning",
          });
          this.dialogVisible = false;
        }
        // this.loadlist();
      });
    },
    // 授权登录
    checkwx() {
      this.checkbtn = true;
      this.msg = '正在等待验证, 请先使用PC微信打开指定网址'
      this.dialogVisible = true;
        setTimeout(() => {
          this.checkbtn = false;
        }, 3000);
      // axiosinfo({
      //   url: "/api/verify_wx_pc",
      //   method: "post",
      // }).then((response) => {
      //   this.msg = response.data.msg;
      //   setTimeout(() => {
      //     this.checkbtn = false;
      //   }, 3000);
      //   this.dialogVisible = true;
      // });
    },
    handleClose() {
      // this.checkloacl(0);
      this.dialogVisible = false;
    },
    // loadlist() {
    //   const _this = this;
    //   axiosinfo({
    //     url: "/api/get_logged",
    //     method: "post",
    //   }).then((response) => {
    //     console.log("/posts post", response.data);
    //     if (response.data.code == 200) {
    //       _this.list = response.data.data.account;
    //       _this.list.forEach((item) => {
    //         item.login_status = item.login_status ? "已登录" : "未登录";
    //         if (item.type == 1) {
    //           item.type == "公众号";
    //         }
    //         if (item.type == 2) {
    //           item.type == "小程序";
    //         }
    //       });
    //     }
    //     if (response.data.code == 201) alert(response.data.msg);
    //   });
    // },
    wxlogin() {},
    choiceImg() {
      this.$refs.filElem.dispatchEvent(new MouseEvent("click"));
    },
    getFile() {
      var that = this;
      let formData = new FormData();
      const inputFile = this.$refs.filElem.files[0];
      if (inputFile) {
        console.log(inputFile);
        if (inputFile.type !== "text/plain") {
          alert("不是txt!");
          return;
        }
        formData.append("file", inputFile);
        axiosinfo
          .post("http://localhost:5001/api/uploader", formData, {
            "Content-type": "multipart/form-data",
          })
          .then(
            (res) => {
              // 上传成功后的处理
              console.log(res);
              this.$message({
                message: "导入成功，请进行下一步",
                type: "success",
              });
              that.list = res.data.data;
              this.$store.dispatch("ADD_LIST", res.data.data);
              // that.loadlist();
            },
            (err) => {
              // 出现错误时的处理
              console.log(err);
              this.$message({
                message: "导入错误",
                type: "warning",
              });
            }
          );
      } else {
        return;
      }
    },
  },
  mounted() {
    // this.loadlist();
    // this.rqInt = setInterval(()=>{
    //     this.loadlist();
    // },5000)
  },
  beforeDestroy() {
    // 关闭 Socket
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
  border-bottom: 1px solid var(--theme-bordercolor);
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
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.wxtable {
  flex: 1;
  background: var(--theme-tableth);
  // margin-top: 20px;
  width: 100%;
  position: relative;
}
.upload-btn-box {
  button {
    margin-right: 10px;
  }
  input[type="file"] {
    display: none;
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
    border-bottom: 1px solid var(--theme-bbt) ;
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