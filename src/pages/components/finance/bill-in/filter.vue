<template>
	<div class="js-filter">
		<div class="g-flex g-ai-c g-jc-sb">
			<div>
				<i-input
					v-model="formdata.search"
					:maxlength="50"
					placeholder="请输入公司名称，客户姓名和手机号" 
					style="width: 300px"
					clearable
					@on-change="handleSearch" 
					@on-enter="handleSearch"
				/>
				<i-button
					type="primary"
					class="g-m-l-5"
					@click="handleSearch"
				>
					搜索
				</i-button>
				<span 
					class="g-m-l-20 g-c-black3 g-fs-12 g-pointer"
					@click="handleToggle" 
				>
					更多搜索条件
					<i 
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
						class="iconfont g-fs-12 g-c-black-dark"
					/>
				</span>
			</div>
			<span v-if="$auth['111']" class="g-red-btn-line" @click="handleExport">导出</span>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px; padding-bottom: 7px">
				<i-select
					v-model="formdata.method_id"
					placeholder="请选择付款方式"
					transfer
					clearable
					style="width: 220px"
					class="g-m-r-5" 
					@on-change="handleSearch"
				>
					<i-option 
						v-for="item of payMethod" 
						:key="item.value" 
						:value="item.value">{{ item.label }}</i-option>
				</i-select>
				<i-datepicker
					v-model="formdata.payment_time_start"
					placeholder="付款时间(起始)"
					transfer 
					clearable
					style="width: 220px"
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
				<i-datepicker
					v-model="formdata.payment_time_end"
					placeholder="付款时间(结束)" 
					transfer
					clearable
					style="width: 220px"
					class="g-m-r-5" 
					@on-change="handleSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl, formatMoment, getItem } from '@utils/utils';
import { services } from '@stores/services/finance';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
		 
	},
	mixins: [services.payMethod()],
	data() {
		const { query = {} } = this.$route;
		return {
			formdata: query,
			show: false
		};
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/finance/bill/in', 
				{ 
					...this.formdata,
					payment_time_start: formatMoment(this.formdata.payment_time_start),
					payment_time_end: formatMoment(this.formdata.payment_time_end)
				}
			));
			this.$store.commit('FINANCE_BILL_IN_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleExport: debounce(function () {
			const { query = {} } = this.$route;
			window.open(getHashUrl(API_ROOT.FINANCE_BILL_IN_LIST_GET, {
				...query,
				export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}, 300)
	}
};

</script>

<style lang="scss" scoped>

</style>
