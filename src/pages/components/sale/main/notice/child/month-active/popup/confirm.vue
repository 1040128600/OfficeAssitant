<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="温馨提示"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-tb-30">
			<div style="font-size: 14px">
				确定撤回该客户的报名信息？
			</div>
		</div>
		<div slot="footer">
			<i-button class="g-m-r-10" type="text" @click="handleCancel()">取消</i-button>
			<i-button type="primary" @click="handleOk()">确定</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Upload } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "confirm",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-upload': Upload
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
		};
	},
	computed: {
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
		/**
         * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
         */
		 this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};
export const Confirm = CreatePortal({}, module.exports.default);
</script>
