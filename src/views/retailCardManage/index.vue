<template>
	<div  class="retailCard-manage">
    <!-- <el-collapse-transition>
        <div v-show="true"> -->
	  <div class="query-container">
			<el-form :inline="true" :model="form" style="width:1072px;margin:auto;" ref="searchForm" :rules="formRules">
				<el-form-item  label="发行方:" prop="cardPublish">
					<el-select v-model="form.cardPublish" clearable>
						<el-option v-for="item in publicMenu" :label="item.caption" :value="item.caption" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="卡券名称:" prop="cardName">
					<el-input v-model="form.cardName" size="small"></el-input>
				</el-form-item>
				<el-form-item label="分销商:" prop="distributorInfoCode">
          <el-select v-model="form.distributorInfoCode" clearable filterable placeholder="输入搜索或选择">
						<el-option v-for="item in retailMenu" :label="item.name" :value="item.code" :key="item.code"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-row type="flex" style="width:1072px;" justify="end">
				<el-col :span="3"><el-button @click="resetForm('searchForm')" size="small" type="primary" icon="delete" v-if="buttonVisible['3030203']">清空</el-button></el-col>
				<el-col :span="3" ><el-button @click="cardSearchTerm('searchForm')" size="small" type="primary" icon="search" v-if="buttonVisible['3030204']">查询</el-button></el-col>
			</el-row>
    </div>
    <!-- </div>
      </el-collapse-transition> -->
    <div class="manage-container">
      <el-row type="flex" style="width:1072px" justify="start">
        <el-col :span="3"><el-button @click="retailCardNewAdd" size="small" type="primary" icon="plus" v-if="buttonVisible['3030205']">新增</el-button></el-col>
        <el-col :span="3"><el-button @click="retailCardEdit" size="small" type="primary" icon="edit" v-if="buttonVisible['3030208']">修改</el-button></el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" border ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" height="390">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="分销商" prop="distributorName">
        </el-table-column>
        <el-table-column label="卡券Id" prop="cardId">
        </el-table-column>
        <el-table-column label="城市" prop="cityName">
        </el-table-column>
        <el-table-column label="发行方" prop="cardPublish">
        </el-table-column>
        <el-table-column label="卡券名称" prop="cardName">
        </el-table-column>
        <el-table-column label="规格次数" prop="cardCount">
        </el-table-column>
        <el-table-column label="单价" prop="cardBalance">
        </el-table-column>
        <el-table-column label="结算单价" prop="settlementBalance">
        </el-table-column>
        <el-table-column label="库存阈值" prop="thresholdAmount">
        </el-table-column>
        <el-table-column label="总库存" prop="cardPublishAmount">
        </el-table-column>
        <el-table-column label="可售库存" prop="cardAmount">
        </el-table-column>
		    <el-table-column label="状态" prop="statusDesc">
        </el-table-column>
      </el-table>
      <div class="page-container">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="form.pageSize" :page-sizes="[10, 20, 30]" @current-change="currentChange" @size-change="sizeChange"></el-pagination>
      </div>
    </div>

<!-- 新增分销商卡券 -->
    <el-dialog title="分销商卡券新增" :visible.sync="dialogAddVisible" :close-on-click-modal="false" @open="openNewAddModal">
      <el-form class="demo-ruleForm" :inline="true" :model="addForm" label-width="90px" label-position="right" ref="addForm" style="width:600px;margin:auto;" :rules="newRetailCardRules">
        <el-form-item label="分销商:" prop="distributorInfoCode">
          <el-select v-model="addForm.distributorInfoCode" style="width:150px" clearable filterable placeholder="输入搜索或选择">
            <el-option v-for="item in retailMenu" :label="item.name" :value="item.code" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        </el-form-item>
        <el-form-item label="发行方:">
          <el-select v-model="cardPublish" style="width:150px" @change="accordingPublicGetCard">
            <el-option v-for="item in publicMenu" :label="item.caption" :value="item.caption" :key="item.value" @change="accordingPublicGetCard"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡券名称:" prop="cardId">
          <el-select v-model="addForm.cardId" style="width:150px" @change="changeCardId()">
            <el-option v-for="item in cardNameMenu" :label="item.cardName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格次数:">
          <el-input style="width:150px" v-model="cardData.cardCount" :disabled="true">
            <template slot="append">次</template>
          </el-input>           
        </el-form-item>
        <el-form-item label="成本单价:">
          <el-input style="width:150px" v-model="cardData.cardBalance" :disabled="true">
            <template slot="append">元</template>
          </el-input>           
        </el-form-item>
        <el-form-item  label="结算单价:" prop="settlementBalance">
          <el-input style="width:150px" v-model="addForm.settlementBalance" :disabled="able">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="总库存量:">
          <el-input style="width:150px" v-model="cardData.cardAmount" :disabled="true">
            <template slot="append">件</template>
          </el-input>                     
        </el-form-item>
        <el-form-item  label="分配库存:" prop="cardAmount">
          <el-input style="width:150px" v-model="addForm.cardAmount" :disabled="able">
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item  label="库存阈值:" prop="thresholdAmount">
          <el-input style="width:150px" v-model="addForm.thresholdAmount" :disabled="able">
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item  label="日售限额:" prop="saleLimitDay">
          <el-input style="width:150px" v-model="addForm.saleLimitDay" :disabled="able">
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="addForm.status" style="width:150px" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="submitAddForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分销商卡券 -->
    <el-dialog title="分销商卡券编辑" :visible.sync="dialogEditVisible" :close-on-click-modal="false" @open="openNewAddModal">
      <el-form class="demo-ruleForm" :inline="true" :model="editForm" label-width="90px" label-position="right" ref="editForm" style="width:600px;margin:auto;" :rules="editRetailRules">
        <el-form-item label="分销商:">
          <el-input style="width:150px" v-model="multipleSelection[0].distributorName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="发行方:">
          <el-input style="width:150px" v-model="multipleSelection[0].cardPublish" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="卡券名称:">
          <el-input style="width:150px" v-model="multipleSelection[0].cardName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="规格次数:">
          <el-input style="width:150px" v-model="multipleSelection[0].cardCount" :disabled="true">
            <template slot="append">次</template>
          </el-input>          
        </el-form-item>
        <el-form-item label="成本单价:">
          <el-input style="width:150px" v-model="multipleSelection[0].cardBalance" :disabled="true">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item  label="结算单价:" prop="settlementBalance">
          <el-input v-model="editForm.settlementBalance" style="width:150px">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="总库存量:">
          <el-input v-model="cardData.cardAmount" style="width:150px" disabled>
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item  label="可售库存:" prop="addCount">
          <el-input v-model.number="editForm.addCount" style="width:150px" placeholder="可负">
            <template slot="prepend">{{editForm.cardAmount}}+</template>
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item  label="库存阈值:" prop="thresholdAmount">
          <el-input v-model.number="editForm.thresholdAmount" style="width:150px">
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item  label="日售限额:" prop="saleLimitDay">
          <el-input v-model.number="editForm.saleLimitDay" style="width:150px">
            <template slot="append">件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="editForm.status" style="width:150px" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitEditForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
	</div>
</template>

<script src="./action.js"></script>

<style lang="scss">
  @import '../../styles/common.scss';
  .retailCard-manage{
    margin: 30px auto 0;
    width: 1120px;
    .demo-ruleForm{
			margin: auto;
    }
    .el-dialog__wrapper{
      top: 50px;
      left: 200px;
    }
  }
  .el-table .warning-row {
    background: yellow;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-table .cell {
    white-space: nowrap !important ;
  }
  .el-dialog{
      width:580px;
  }
  .el-table--enable-row-hover .el-table__body tr.warning-row:hover>td{
    background:yellow !important;
  }
  .el-loading-mask{
    z-index: 90;
  }
</style>
