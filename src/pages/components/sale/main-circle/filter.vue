<template>
	
	<div class="g-gray-bg-mid g-m-t-20">
		<i-input
			v-model="query.keyword" 
			placeholder="请输入素材标题、内容进行搜索" 
			style="width: 220px"
			class="g-m-r-5"
			clearable
			@on-enter="handleSearch"
			@on-change="handleClear"

		/>
		<i-date-picker
			v-model="query.create_time_start"
			type="datetime"
			placeholder="请选择发布时间（起始）"
			clearable
			style="width: 220px"
			class="g-m-r-5"
			@on-change="handleSearch"
		/>
		<i-date-picker
			v-model="query.create_time_end"
			type="datetime"
			placeholder="请选择发布时间（结束）"
			clearable
			style="width: 220px"
			class="g-m-r-5"
			@on-change="handleSearch"
		/>
		<i-button 
			type="primary"
			@click="handleSearch"
		>
			搜索
		</i-button>
		
	</div>
	
</template>

<script>
import { Input, Button, DatePicker } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';


export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker
	},
	data() {
		const { query = {} } = this.$route;
		return {
			query: {
				keyword: query.keyword,
				create_time_start: query.create_time_start,
				create_time_end: query.create_time_end,
			}
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/sale/main/circle', 
				{ 
					...this.$route.query, 
					...this.formatQuery(),

				}
			));
			this.$store.commit('SALE_MAIN_CIRCLE_LIST_INIT');
		},
		formatQuery() {
			const _query = {};
			Object.keys(this.query).forEach(key => {
				if (this.query[key] instanceof Date) {
					_query[key] = moment(this.query[key]).format("YYYY-MM-DD HH:mm:ss");
				} else {
					_query[key] = this.query[key];
				}
			});
			return _query;
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
	}
};

</script>

<style lang="scss" scoped>

</style>
