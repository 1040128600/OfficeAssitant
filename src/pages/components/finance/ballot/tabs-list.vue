<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		@on-click="handleChange"
	>
		<i-tab-pane 
			v-for="(item, index) in tabs"
			:key="item.value"
			:label="item.label + ` ${listInfo.count[index]}`" 
			:name="item.value"
		>
			<vc-paging
				ref="tableTarget"
				:columns="columns[item.value]"
				:show="item.value == type" 
				:type="item.value"
				:data-source="listInfo[item.value].data"
				:total="listInfo[item.value].total"
				:reset="listInfo[item.value].reset"
				:current.sync="current[item.value]"
				:history="true"
				:load-data="loadData"
				:table-opts="{height: tableHeight, highlightRow: true}"
				class="v-finance-ballot-list"
				mode="table"
				@row-click="handleOpenDrawer"
				@page-size-change="handleChangePageSize"
			/>
		</i-tab-pane>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { tableHeight } from '@extends/mixins/table';
import { autoFix } from '@extends/mixins/auto-fix';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		tableHeight({
			filter: true,
			tabs: true,
			footer: true,
		}),
		autoFix()
	],
	data() {
		const { query } = this.$route;

		return {
			type: String(query.type || "1"), // 同tabs下的value
			current: {},
			firstLoad: !query.type,
			tabs: [
				{ label: '待审核', value: '1' }, 
				{ label: '待开票', value: '2' }, 
				{ label: '已开票', value: '3' },
				{ label: '未通过', value: '4' },
				{ label: '已退票', value: '5' }
			]
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.financeBallot.listInfo;
		}
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'FINANCE_BALLOT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					scenario: 2,
					page,
					pageSize
				},
			}).then((res) => {
				this.resetType('1', this.listInfo.count, '/finance/ballot');
			}).catch((error) => {
			});
		},
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				fixPosition: false,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/finance/ballot', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('FINANCE_BALLOT_LIST_INIT');
		}
	}
};

</script>

<style lang="scss">

</style>
