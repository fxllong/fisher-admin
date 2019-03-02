<template>
  <div id="app">
    <el-row>
        <el-col :span="24">
            <div >
                <el-form :inline="true" :model="param" >
                    <el-form-item label="消息状态">
                        <el-select v-model="param.msgState" placeholder="消息状态">
                            <el-option label="全部" value="null"></el-option>
                            <el-option label="待发送" value="WAITING"></el-option>
                            <el-option label="已发送" value="SENDING"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否终止">
                        <el-select v-model="param.dead">
                            <el-option label="全部" value="null"></el-option>
                            <el-option label="已终止" value="YES"></el-option>
                            <el-option label="未终止" value="NO"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" >全部确认</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" >全部发送</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-col>
        <el-col :span="24">
            <div >
                <el-table
                        ref="multipleTable"
                        :data="msgs"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            label="id"
                            width="100"
                            prop="id">
                    </el-table-column>
                    <el-table-column
                            label="创建时间"
                            width="150"
                            prop="createTime"
                           >

                    </el-table-column>
                    <el-table-column
                            label="发送时间"
                            width="150"
                            prop="updateTime"
                            >
                    </el-table-column>
                    <el-table-column
                            label="消息ID"
                            width="150"
                            prop="messageId"
                            >
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="状态"
                            width="120"
                            >
                    </el-table-column>
                    <el-table-column
                            prop="dead"
                            label="是否终止"
                             >
                    </el-table-column>
                     <el-table-column
                            prop="messageSendTimes"
                            label="重发次数"
                             >
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="120">
                        <template slot-scope="scope">
                            <!-- <el-button
                                    v-if="scope.row.status=='待确认'"
                                    @click="confirmMsg(scope.$index,scope.row)"
                                    type="text"
                                    size="small">
                                状态确认
                            </el-button> -->

                            <el-button
                                    v-if="scope.row.status=='SENDING'"
                                    @click="reSendMsg(scope.$index,scope.row)"
                                    type="text"
                                    size="small">
                                重新发送
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-col>
        <el-col>
            <div class="block" v-show="total>0">
                <el-pagination
                        layout="prev, pager, next"
                        :total="total"
                        :page-size="param.size"
                        @current-change="currentChangeHandle"
                >
                </el-pagination>
            </div>
        </el-col>
        
    </el-row>
    
</div>
</template>
<script>
import {
  fetchMsgList,
  reSendMsg
} from '@/api/msg.js'
import { mapGetters } from 'vuex'
import moment from 'moment'
import qs from 'qs'

export default {
  data() {
    return {
        listLoading: false,
        param: {
            status: null,
            dead: null,
            page: 1,
            size: 10
        },
        total: 0,
        msgs: [],
        sys_msg_select: false,
        multipleSelection: []
        }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getList()
    this.sys_msg_select = this.permissions['/tsc/msg:select']
  },
  methods: {
    getList() {
      fetchMsgList(this.param).then(response => {
        this.msgs = response.body
        this.total = response.total
        this.listLoading = false
      })
    },
    onSubmit() {
      fetchMsgList(this.param).then(response => {
        this.msgs = response.body
        this.total = response.total
        this.listLoading = false
      })
    },
    reSendMsg(index,row) {
      reSendMsg(qs.stringify({messageId:row.messageId})).then(response => {
        this.$notify({
            title: '成功',
            message: '重新发送消息成功',
            type: 'success',
            duration: 2000
        })  
      }).cache(() => {
        this.$notify({
            title: '失败',
            message: '重新发送失败',
            type: 'error',
            duration: 2000
        })
      })
    },
    refreshHandle() {
      this.param.size = 10
      this.param.page = 1
      this.getList()
    },
    dateFormat(row, column) {
      const date = row[column.property]
      if (!date) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    sizeChangeHandle(val) {
      this.param.page = val
      this.getList()
    },
    currentChangeHandle(val) {
      this.param.page = val
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
