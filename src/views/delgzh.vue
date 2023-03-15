<template>
  <div class="outer">
    <div class="step">
      <div class="step_top">
        <div class="step_title">
          <div class="step_bold">删除公众号群发的文章功能操作步骤</div>
          <div class="step_con">4步带你玩转后台管理</div>
        </div>
        <div class="step_btn">
          <a><div class="upload-btn-box">
            <img
              @click="choiceImg"
              src="../assets/weixingongjuxiang/piliangdnegl/06.png"
              alt=""
            />
            <input
              ref="filElem"
              type="file"
              class="upload-file"
              @change="getFile"
            />
          </div></a>
        </div>
      </div>
      <div class="step_pic">
        <div class="cards">
          <img src="../assets/weixingongjuxiang/piliangdnegl/01.png" alt="" />
          <div>pc端登录公众号的微信</div>
        </div>
        <img
          class="step_icon"
          src="../assets/weixingongjuxiang/piliangdnegl/02.png"
        />
        <div class="cards">
          <img src="../assets/weixingongjuxiang/piliangdnegl/01.png" alt="" />
          <div>输入绑定的公众号原始id 点击获取已发布的文章列表按钮</div>
        </div>
        <img
          class="step_icon"
          src="../assets/weixingongjuxiang/piliangdnegl/02.png"
        />
        <div class="cards">
          <img src="../assets/weixingongjuxiang/piliangdnegl/01.png" alt="" />
          <div>复制链接 https://w.url.cn/s/A3LuMW7 微信聊天中打开链接</div>
        </div>
        <img
          class="step_icon"
          src="../assets/weixingongjuxiang/piliangdnegl/02.png"
        />
        <div class="cards">
          <img src="../assets/weixingongjuxiang/piliangdnegl/01.png" alt="" />
          <div>
            勾选已发布的未删除的文章
            点击删除勾选的文章按钮系统如果删除文章成功软件会自动提示删除成功
          </div>
        </div>
      </div>
    </div>
    <div class="wxtable">
      <div class="toolsbar">
        <div>
          <el-input
            placeholder="搜索公众号名称"
            prefix-icon="el-icon-search"
            v-model="gzhkeyword"
          >
          </el-input>
        </div>
        <div>
          <el-input
            placeholder="搜索文章标题"
            prefix-icon="el-icon-search"
            v-model="titlekeyword"
          >
          </el-input>
        </div>
        <div class="pickerbar">
          <span>按日期查询：</span>
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="—"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            prefix-icon="none"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
        <el-button type="primary" size="mini" @click="search()"
          >获取已发布的文章列表</el-button
        >
      </div>
      <div class="table-area">
        <u-table
          ref="table"
          :data="article_list"
          :border="false"
          use-virtual
          :row-height="30"
          :height="tableheight"
          @selection-change="handleSelectionChange"
        >
          <u-table-column type="selection" width="50"></u-table-column>
          <u-table-column prop="gzh_id" label="原始ID" width="150">
          </u-table-column>
          <u-table-column prop="title" label="标题" width=""> </u-table-column>
          <u-table-column prop="itemidx" label="条次" width="60">
          </u-table-column>
          <u-table-column prop="content_url" label="预览链接" width="100">
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                width="200"
                trigger="click"
                :content="scope.row.content_url"
              >
                <el-button type="text" slot="reference">查看url</el-button>
              </el-popover>
            </template>
          </u-table-column>
          <u-table-column prop="publish_status" label="发布状态" width="100">
            <template slot-scope="scope">
              <span>{{
                scope.row.publish_status == 1 ? "已发布" : "已删除"
              }}</span>
            </template>
          </u-table-column>
          <u-table-column prop="read_num" label="阅读数" width="80">
          </u-table-column>
          <u-table-column prop="like_num" label="点赞数" width="80">
          </u-table-column>
          <u-table-column prop="article_time" label="发文时间" width="">
          </u-table-column>
        </u-table>
      </div>
      <div class="bottom_tools">
        <a
          ><span
            class="selectionIndex"
            v-for="(item, index) in 8"
            :key="index"
            @click="selectIndex(item)"
            >{{ "条次" + (index + 1) }}</span
          ></a
        >
        <a><span class="delselection" @click="delsct">删除选中</span></a>
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
      multipleSelection: [],
      checkbtn: true,
      gzhkeyword: "",
      loading: false,
      value1: null,
      tableheight: 336,
      titlekeyword: "",
    };
  },
  computed: {
    ...mapState(["article_list"]),
  },
  mounted() {
    const _this = this;
    setTimeout(() => {
      _this.tableheight =
        document.getElementsByClassName("table-area")[0].offsetHeight - 30;
    }, 200);
    window.onresize = () => {
      return (() => {
        _this.tableheight =
          document.getElementsByClassName("table-area")[0].offsetHeight - 30;
      })();
    };
    this.sockets.subscribe("get_articles", (res) => {
      let newres = JSON.parse(res);
      console.log("newres", newres);
      _this.$store.dispatch("add_article", newres.data);
    });
    this.sockets.subscribe("delete_articles", (res) => {
      let newres = JSON.parse(res);
      console.log("newres", newres);
      _this.$store.dispatch("del_article", newres);
    });
  },
  methods: {
    search() {
      const _this = this;
      let senddata = new FormData();
      senddata.append("gzh_id", this.gzhkeyword);
      if (this.titlekeyword) senddata.append("title", this.titlekeyword);
      if (this.value1) {
        senddata.append("start_time", this.value1[0]);
        senddata.append("end_time", this.value1[1]);
      }
      if (this.gzhkeyword) {
        axiosinfo({
          url: "/api/article_search",
          method: "post",
          data: senddata,
        }).then((res) => {
          console.log(res);
          this.$message({
            message: res.data.msg,
            type: "success",
          });
          _this.$store.state.article_list = [];
        });
      } else {
        this.$message({
          message: "请输入公众号原始ID",
          type: "error",
        });
      }
    },
    selectIndex(index, type) {
      console.log(index);
      let rows = this.article_list.filter((item) => item.itemidx == index);
      if (rows) {
        rows.forEach((row) => {
          // 如果是固定选中
          if (type === "固定选中") {
            // toggleRowSelection方法参数不懂得去看文档api哦
            this.$refs.table.toggleRowSelection([
              {
                row: row,
                selected: true,
              },
            ]);
            // 下面这是切换选中
          } else {
            this.$refs.table.toggleRowSelection([
              {
                row: row,
              },
            ]);
          }
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
    delsct() {
      let sendlist = [];
      var _this = this;
      this.multipleSelection.forEach((item, index) => {
        let newitem = item;
        sendlist.push({
          gzh_id: newitem.gzh_id,
          msgid: newitem.msgid,
          itemidx: newitem.itemidx,
        });
      });
      console.log(sendlist);
      axiosinfo({
        url: "/api/article_delete",
        method: "post",
        data: {
          articles: sendlist,
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.$message({
            message: res.data.msg,
            type: "success",
          });
        }
        if (res.data.code == 201) {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    choiceImg() {
      this.$refs.filElem.dispatchEvent(new MouseEvent("click"));
    },
    getFile() {
      var that = this;
      let formData = new FormData();
      const inputFile = this.$refs.filElem.files[0];
      console.log(inputFile);
      if (inputFile) {
        formData.append("file", inputFile);
        that.$store.state.article_list = [];
        axiosinfo
          .post("http://localhost:5001/api/article_import_search", formData, {
            "Content-type": "multipart/form-data",
          })
          .then(
            (res) => {
              // 上传成功后的处理
              console.log(res);
              this.$message({
                message: res.data.msg,
                type: "success",
              });
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
  beforeDestroy() {
    this.sockets.unsubscribe("get_articles");
    this.sockets.unsubscribe("delete_articles");
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
  background: #02d290;
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
  border-top: 1px solid var(--theme-bordercolor);
  background: var(--theme-tableth);
  // margin-top: 20px;
  overflow: auto;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .table-area {
    flex: 1;
  }
  .toolsbar {
    display: flex;
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
  .bottom_tools {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    // border-top: 1px solid var(--theme-bordercolor);
    border-bottom: 1px solid var(--theme-bordercolor);
    padding: 7px;
    span {
      margin: 0 3px;
      padding: 2px 3px;
      border: 1px solid var(--theme-tablefont);
      color: var(--theme-tablefont);
      border-radius: 5px;
      font-size: 12px;
    }
    .delselection {
      color: #fff;
      background: var(--theme-hover);
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
// time-picker
/deep/ .el-date-editor {
  background: none;
  border-color: var(--theme-bordercolor);
  height: 30px;
  line-height: 30px;
  width: 300px;
  color: var(--theme-cardfont);
  padding: 0;
  .el-range-input {
    background: none;
  }
}
.pickerbar {
  display: flex;
  align-items: center;
  color: var(--theme-cardfont);
}
// el-button
/deep/ .el-button {
  padding: 4px 6px;
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
/deep/ .el-table::before {
  height: 1px;
  background: var(--theme-bordercolor);
}
/*修改table 表体的背景颜色和文字颜色*/
/deep/ .el-table {
  background-color: transparent;
  position: absolute;
  height: calc(100% - 80px);
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
  .cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  // hover效果
  tr:hover > td {
    background-color: rgba(0, 0, 0, 0) !important;
  }
  .el-table__header-wrapper {
    overflow: visible !important;
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