<template>
  <div class="card-manage">
    <div class="query-container">
      <el-form :inline="true" style="width:1072px;margin:auto;" :model="form" :rules="formRules" ref="searchForm">
        <el-form-item  label="发行方:">
          <el-select v-model="form.cardPublish" clearable>
            <el-option v-for="item in publicMenu" :label="item.caption" :value="item.caption" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡券名称:" prop="cardName">
          <el-input v-model="form.cardName" size="small"></el-input>
        </el-form-item>
      </el-form>
      <el-row type="flex" style="width:1072px;" justify="end">
        <el-col :span="3"><el-button @click="cardClear" size="small" type="primary" icon="delete" v-if="buttonVisible['30102']">清空</el-button></el-col>
        <el-col :span="3" ><el-button @click="cardSearchTerm('searchForm')" size="small" type="primary" icon="search" v-if="buttonVisible['30103']">查询</el-button></el-col>
      </el-row>
    </div>
    <div class="manage-container">
      <el-row type="flex" style="width:1072px" justify="start">
        <el-col :span="3"><el-button @click="cardNewAdd" size="small" type="primary" icon="plus" v-if="buttonVisible['30104']">新增</el-button></el-col>
        <el-col :span="3"><el-button @click="cardEdit" size="small" type="primary" icon="edit" v-if="buttonVisible['30106']">修改</el-button></el-col>
      </el-row>
      <el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" height=390>
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="卡券ID" prop="id">
        </el-table-column>
        <el-table-column label="城市" prop="cityName">
        </el-table-column>
        <el-table-column label="发行方" prop="cardPublish">
        </el-table-column>
        <el-table-column label="卡券名称" prop="cardName">
        </el-table-column>
        <el-table-column label="规格次数" prop="cardCount">
        </el-table-column>
        <el-table-column label="发行数量" prop="cardPublishAmount">
        </el-table-column>
        <el-table-column label="库存数量" prop="cardAmount">
        </el-table-column>
        <el-table-column label="单价(元)" prop="cardBalance">
        </el-table-column>
        <el-table-column label="状态" prop="status">
        </el-table-column>
      </el-table>
      <div class="page-container">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="form.pageSize" :page-sizes="[10, 20, 30]" @current-change="currentChange" @size-change="sizeChange"></el-pagination>
      </div>
    </div>



    <el-dialog title="卡券新增" :visible.sync="dialogAddVisible" :close-on-click-modal="false" @open="openNewAddModal">
      <el-form class="demo-ruleForm" :inline="true" label-width="82px" :model="newAddCard" :label-position="labelPosition" ref="newAddCard" style="width:600px;margin:auto;" :rules="newAddCardRules">
        <el-form-item label="卡券名称:" prop="cardName">
          <el-input style="width:170px;" v-model="newAddCard.cardName"></el-input>
        </el-form-item>
        <el-form-item label="发行方:" prop="cardPublish">
          <el-select  style="width:170px;" v-model="newAddCard.cardPublish" placeholder="全部" clearable>
            <el-option v-for="item in publicMenu" :label="item.caption" :value="item.caption" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属城市:" prop="cityId">
          <el-select filterable  style="width:170px;" v-model.number="newAddCard.cityId" placeholder="搜索城市" clearable>
            <el-option-group
              v-for="group in cityMenu"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.children"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="规格次数:" prop="cardCount">
          <el-input style="width:170px" v-model.number="newAddCard.cardCount">
            <template slot="append">次</template>
          </el-input>
        </el-form-item>
        <el-form-item label="单价:" prop="cardBalance">
          <el-input style="width:170px" v-model="newAddCard.cardBalance">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item  label="库存数量:" prop="cardAmount">
          <el-input style="width:170px" v-model="newAddCard.cardAmount">
            <template slot="append">件</template>
          </el-input> 
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select  style="width:170px;" v-model="newAddCard.status" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('newAddCard')">取 消</el-button>
        <el-button type="primary" @click="submitAddForm('newAddCard')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="卡券编辑" width="50%" :visible.sync="dialogEditVisible" :close-on-click-modal="false" @open="openNewAddModal">
      <el-form class="card" :inline="true" label-width="90px" :model="editCard" label-position="right" ref="editCard" style="width:600px;margin:auto;" :rules="editCardRules">
        <el-form-item label="卡券名称:" prop="cardName">
          <el-input style="width:170px" v-model="editCard.cardName"></el-input>
        </el-form-item>
        <el-form-item label="发行方:">
          <el-input style="width:170px" v-model="editCard.cardPublish" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属城市:">
          <el-input style="width:170px" v-model="editCard.cityName" :disabled="true"></el-input>          
        </el-form-item>
        <el-form-item label="规格次数:">
          <el-input style="width:170px" v-model="editCard.cardCount" :disabled="true">
            <template slot="append">次</template>
          </el-input>           
        </el-form-item>
        <el-form-item label="单价:" prop="cardBalance">
          <el-input style="width:170px" v-model="editCard.cardBalance">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="发行数量:">
          <el-input style="width:170px" v-model="editCard.cardPublishAmount" :disabled="true">
            <template slot="append">件</template>
          </el-input>  
        </el-form-item>
        <el-form-item  label="库存数量:" prop="addCount">
          <el-input style="width:170px" v-model="editCard.addCount" placeholder="负为减">
            <template slot="prepend">{{editCard.cardAmount}}件+</template>
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select style="width:170px" v-model="editCard.status"  placeholder="请选择" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editCard')">取 消</el-button>
        <el-button type="primary" @click="submitEditForm('editCard')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./action.js"></script>


<style lang="scss">
  @import '../../styles/common.scss';
  .card-manage{
    margin: 30px auto 0;
    width: 1120px;
    .demo-ruleForm{
			margin: auto;
    }
    .el-dialog__wrapper{
      top: 50px;
      left: 200px;
    }
    .el-dialog{
      width:580px;
    }
  }
  .el-loading-mask{
    z-index: 90;
  }
</style>
