<template>
	<div>
		<div class="g-flex g-jc-sb g-ai-c">
			<div>
				<i-date-picker
					v-if="type !== 'teacher'"
					v-model="try_month"
					type="month"
					class="g-m-r-5" 
					style="width: 220px;"
					@on-change="handleDateChange($event, 'try_month')"
				/>
				<i-select
					v-if="type === 'teacher'"
					ref="staff"
					:value="staff_id"
					:remote-method="loadStaff"
					:loading="staffLoading"
					class="g-m-r-5"
					style="width: 220px;"
					filterable
					remote
					clearable
					transfer
					label-in-value
					placeholder="请选择授课讲师"
					@on-change="handleStaffChange"
					@on-query-change="handleQueryChange"
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<i-date-picker
					v-if="type === 'teacher'"
					v-model="time"
					type="daterange"
					class="g-m-r-5"
					transfer
					clearable
					split-panels
					style="width: 220px;"
					placeholder="请输入授课日期"
					@on-change="handleDateChange($event, 'time')"
				/>
				<i-button
					type="primary"
					@click="handleSearch"
				>
					搜索
				</i-button>
			</div>
			<div>
				<div
					v-if="type === 'demand' && $auth[950]"
					class="g-red-btn-line g-m-r-5"
					@click="handleInputFile"
				>
					导入
				</div>
				<div
					v-if="(type === 'try' && $auth[940]) || (type === 'loss' && $auth[944])
					|| (type === 'teacher' && $auth[946]) || (type === 'demand' && $auth[951])"
					class="g-red-btn-line"
					@click="handleOutput"
				>
					导出
				</div>
			</div>
		</div>

		<i-tabs
			:value="type"
			:animated="false"
			type="card"
			style="margin-top: 20px"
			name="statistic"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item) in tabs"
				:key="item.value"
				:label="item.label"
				:name="item.value"
				tab="statistic"
			>
				<oa-try v-if="type === 'try' && type === item.value" ref="try" />
				<oa-loss v-if="type === 'loss' && type === item.value" ref="loss" />
				<oa-teacher v-if="type === 'teacher' && type === item.value" ref="teacher" />
				<oa-demand v-if="type === 'demand' && type === item.value" ref="demand" />
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import moment from 'moment';
import lodash from 'lodash';
import { Paging } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { Input, Button, DatePicker, Tabs, TabPane, Select, Option } from 'iview';
import { getParseUrl, getHashUrl, getItem, formatMoment } from '@utils/utils';
import { createSearch } from '@stores/services/hr';
import Try from './tabs/try';
import Loss from './tabs/loss';
import Teacher from './tabs/teacher';
import Demand from './tabs/demand';
import { inputPModal } from './popup/input.vue';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-select': Select,
		'i-option': Option,
		'oa-try': Try,
		'oa-loss': Loss,
		'oa-teacher': Teacher,
		'oa-demand': Demand
	},
	mixins: [
		item,
		createSearch({ key: 'staff' })
	],
	data() {
		const { query } = this.$route;

		return {
			type: '', // 同tabs下的value
			staff: query.staff_name || '',
			staff_id: query.staff_id ? +query.staff_id : '',
			staff_name: query.staff_name || '',
			try_month: query.try_month ? query.try_month : moment().format("YYYY-MM"),
			time: [query.start_time, query.end_time],
			tabs: [],
		};
	},
	mounted() {
		this.$auth[939] ? this.tabs.push({ label: '试岗数据', value: 'try' }) : null;
		this.$auth[943] ? this.tabs.push({ label: '流失数据', value: 'loss' }) : null;
		this.$auth[945] ? this.tabs.push({ label: '讲师数据', value: 'teacher' }) : null;
		this.$auth[949] ? this.tabs.push({ label: '需求统计', value: 'demand' }) : null;

		const { query } = this.$route;
		this.type = query.type ? query.type : this.tabs[0].value;
		this.$store.commit('HR_ACADEMY_TRANSFER_STATISTIC_SET_TYPE', this.type);
	},
	methods: {
		// 搜索值变化
		// handleInputChange(e) {
		// 	if (!e.target.value) {
		// 		this.handleSearch();
		// 	}
		// },
		// 日期改变
		handleDateChange(val, name) {
			if (name === 'try_month') {
				this.try_month = val;
			} else {
				this.start_time = val[0];
				this.end_time = val[1];
			}
			this.handleSearch();
		},
		handleStaffChange(value) {
			this.staff_id = value ? value.value : '';
			this.staff_name = value ? value.label : '';
			this.handleSearch();
		},
		handleQueryChange(query = '') {
			let targetQuery = this.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		handleSearch: lodash.debounce(function (event) {
			const { query } = this.$route;
			let params = {};
			this.$router.replace(getHashUrl(
				'/hr/academy/transfer/statistic',
				{
					...query,
					type: this.type,
					subtype: this.$refs[`${this.type}`][0].subtype,
					try_month: formatMoment(this.try_month, 'YYYY-MM'),
					staff_id: this.staff_id,
					staff_name: this.staff_name,
					start_time: this.start_time,
					end_time: this.end_time
				}
			));

			switch (this.type) {
				case 'try':
					this.$refs.try[0].loadData();
					break;
				case 'loss':
					this.$refs.loss[0].loadData();
					break;
				case 'teacher':
					this.$store.commit('HR_ACADEMY_TRANSFER_STATISTIC_TEACHER_LIST_INIT');
					this.$refs.teacher[0].loadData();
					break;
				case 'demand':
					this.$refs.demand[0].loadData();
					break;
				default:
					break;
			}
		}, 300),
		handleChange(type) {
			this.type = type;
			const { query } = this.$route;
			this.$store.commit('HR_ACADEMY_TRANSFER_STATISTIC_SET_TYPE', type);

			this.$router.replace(getHashUrl(
				'/hr/academy/transfer/statistic',
				{
					...query,
					type,
					subtype: (this.$refs[`${this.type}`] && this.$refs[`${this.type}`].length)
							  ? this.$refs[`${this.type}`][0].subtype : '',
					staff_id: this.staff_id,
					staff_name: this.staff_name,
					try_month: formatMoment(this.try_month, 'YYYY-MM'),
					start_time: this.start_time,
					end_time: this.end_time,
				}
			));
		},
		// 导入
		handleInputFile() {
			inputPModal.popup({}).then(res => {
				this.$refs.demand[0].loadData();
			}).catch(err => {});
		},
		// 导出
		handleOutput: lodash.debounce(function () {
			const { query } = this.$route;
			let url = '';
			switch (this.type) {
				case 'try':
					if (this.$refs.try[0].subtype === 'recruit') {
						url = getHashUrl(API_ROOT['ACADEMY_TRANSFER_STATISTIC_TRY_RECRUITS_GET'], {
							is_export: 1,
							try_month: query.try_month ? query.try_month : '',
							'-token': getItem(`staff_${this.$global.version}`).token
						});
					} else {
						url = getHashUrl(API_ROOT['ACADEMY_TRANSFER_STATISTIC_TRY_ORGANIZATIONS_GET'], {
							is_export: 1,
							try_month: query.try_month ? query.try_month : '',
							'-token': getItem(`staff_${this.$global.version}`).token
						});
					}
					break;
				case 'loss':
					url = getHashUrl(API_ROOT['ACADEMY_TRANSFER_STATISTIC_LOSSES_GET'], {
						is_export: 1,
						try_month: query.try_month ? query.try_month : '',
						is_lose_leave: this.$refs.loss[0].subtype === 'try' ? 0 : 1,
						'-token': getItem(`staff_${this.$global.version}`).token
					});
					break;
				case 'teacher':
					url = getHashUrl(API_ROOT['ACADEMY_TRANSFER_STATISTIC_TEACHER_LIST_GET'], {
						is_export: 1,
						staff_id: query.staff_id ? query.staff_id : '',
						staff_name: query.staff_name || '',
						start_time: query.start_time ? query.start_time : '',
						end_time: query.end_time ? query.end_time : '',
						'-token': getItem(`staff_${this.$global.version}`).token
					});
					break;
				case 'demand':
					url = getHashUrl(API_ROOT['ACADEMY_TRANSFER_STATISTIC_DEMAND_LIST_GET'], {
						is_export: 1,
						month: query.try_month ? query.try_month : '',
						'-token': getItem(`staff_${this.$global.version}`).token
					});
					break;
				default:
					break;
			}
			window.open(url);
		}, 300)
	}
};
</script>

<style lang="scss">
</style>