<template>
	<div class="g-m-l-10 academy-train-detail-paper-audit">
		<i-tabs 
			:value="type" 
			:animated="false"
			type="card" 
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<i-tab-pane 
				v-for="(item, index) in tabs"
				:key="index"
				:label="item.label + listInfo.count[index]"
				:name="item.value"
			>
				<vc-paging
					ref="tableTarget"
					:columns="columns"
					:show="item.value == type" 
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					class="v-hr-academy-train-detail-exam-0-audit-list"
					mode="table"
					@page-change="handlePageChange"
					@page-size-change="handleChangePageSize"
					@selection-change="handleSelectionChange"
				>
					<div v-if="type == '1'" slot="extra" class="g-flex-ac">
						<i-checkbox
							v-model="isAll"
							@on-change="handleIsAll"
						>
							全选
						</i-checkbox>
						<i-button @click="handleBatchAudit">批量审核</i-button>
					</div>
				</vc-paging>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane, Checkbox, Button } from 'iview';
import { Paging } from 'wya-vc';
import { autoFix } from '@extends/mixins/auto-fix';
import { getParseUrl, getHashUrl } from '@utils/utils';
import checkAll from '@extends/mixins/checkAll';
import moment from "moment";
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [
		item, 
		checkAll,
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			tabs: [
				{ label: '待审核', value: '1' }, 
				{ label: '已通过', value: '2' }, 
				{ label: '未通过', value: '3' }
			],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyTrainDetailPaper0Audit.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/hr/academy/train/detail/paper/0/audit');
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(type) {
			this.type = type;
			this.isAll = false;
			this.handleIsAll(false);

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				fixPosition: false,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/academy/train/detail/paper/0/audit', { ...query }));
		},
		handleIsAll(val) {
			this.isAll = false;
			this.$refs.tableTarget[this.type - 1].$refs.tableTarget.selectAll(val);
		},
		handleChangePageSize() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT_LIST_INIT');
		},
		handleBatchAudit() {
			if (!this.selected.length) {
				this.$Message.warning('请先选择要批量审核的项');
				return;
			}
			const auditIds = this.selected.reduce((initVal, currentVal) => {
				initVal.push(currentVal.audit_id);
				return initVal;
			}, []);
			this.handleAudit(auditIds);
		}
	}
};

</script>

<style lang="scss">
.academy-train-detail-paper-audit {
	.__footer {
		width: calc(100% - 340px) !important;
	}
}
</style>
