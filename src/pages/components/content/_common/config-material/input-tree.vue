<template>
	<div class="c-input-tree">
		<i-poptip
			v-model="poptipShow"
			:width="220"
			placement="bottom"
			@on-popper-show="poptipShow = true"
			@on-popper-hide="poptipShow = false"
		>
			<i-input
				v-model="categoryTitle"
				clearable
				placeholder="请选择所属类目"
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleChange"
			/>
			<div slot="content">
				<i-tree ref="classTree" :data="dataSource" @on-select-change="getCheckedClassNode"/>
			</div>
		</i-poptip>
	</div>
</template>

<script type="text/ecmascript-6">
import { Input, Button, DatePicker, Tree, Poptip } from 'iview';

export default {
	name: 'oa-input-tree',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-tree': Tree,
		'i-poptip': Poptip,
	},
	props: {
		dataSource: {
			type: Array,
			default() {
				return [];
			}
		},
		placeholder: {
			type: String,
			default() {
				return '请选择所属类目';
			}
		},
		title: {
			type: String,
			default() {
				return '';
			}
		}
	},
	data() {
		return {
			poptipShow: false,
			categoryTitle: '',
			category_id: ''
		};
	},
	watch: {
		title(v) {
			this.categoryTitle = v;
		}
	},
	methods: {
		handleChange(v) {
			this.$emit('on-change', v);
		},
		getCheckedClassNode(v) {
			this.category_id = v[0].category_id;
			this.categoryTitle = v[0].title;
			this.$emit('input', this.category_id);
			this.poptipShow = false;
		}
	}
};
</script>

<style  lang="scss">
    .c-input-tree {
        .ivu-poptip-content {
            max-height: 500px;
            overflow-y: auto;
        }
        .ivu-poptip-popper {
            width: 230px !important;
            position: absolute;
            will-change: top, left;
            border: 1px solid rgb(220, 222, 226);
            margin-top: 5px;
            border-radius: 4px;
            background: rgb(255, 255, 255);
            top: 33px;
            left: -3px;
        }
    }
</style>
