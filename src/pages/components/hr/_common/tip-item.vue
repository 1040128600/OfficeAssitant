<template>
	<i-poptip
		:transfer="true"
		trigger="hover"
		placement="right"
		class="g-flex-ac c-hr-tip-item"
	>
		<slot />
		<div slot="content">
			<p class="g-m-b-25 g-fs-14">{{ content }}</p>
			<div class="g-c-blue-mid g-flex-ac g-jc-fe">
				<i class="iconfont icon-uncomplete g-pointer" @click="handleClose" />
				<template v-if="scheduleId > 0 && status != 2">
					<i class="iconfont icon-vertical-line g-c-black5" />
					<i class="iconfont icon-edit1 g-pointer" @click="handleEdit"/>
				</template>
				<template v-if="status != 2">
					<i class="iconfont icon-vertical-line g-c-black5" />
					<i class="iconfont icon-completed g-pointer" @click="handleComplete"/>
				</template>
			</div>
		</div>
	</i-poptip>
</template>

<script>
import { Poptip } from 'iview';
import API_ROOT from '@stores/apis/root';
import { AddSchedModal } from './add-sched-modal';

export default {
	name: 'v-hr-main-tip-item',
	components: {
		'i-poptip': Poptip,
	},
	props: {
		content: String,
		scheduleId: String | Number,
		agendaId: String | Number,
		status: String | Number,
		onRefresh: Function
	},
	methods: {
		handleClose() {
			this.$request({
				url: API_ROOT["_HR_MAIN_DEL_SCHEDULE_POST"], // eslint-disable-line
				type: 'POST',
				param: {
					agenda_id: this.agendaId
				}
			}).then((res) => {
				this.$Message.success('删除成功');
				this.onRefresh && this.onRefresh();
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleEdit() {
			AddSchedModal.popup({
				scheduleId: this.scheduleId
			}).then((res) => {
				this.onRefresh && this.onRefresh();
			}).catch((res) => {
				console.error(res);
			});
		},
		handleComplete() {
			this.$request({
				url: API_ROOT["_HR_MAIN_DONE_SCHEDULE_POST"], // eslint-disable-line
				type: 'POST',
				param: {
					agenda_id: this.agendaId
				}
			}).then((res) => {
				this.$Message.success('操作成功');
				this.onRefresh && this.onRefresh();
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.c-hr-tip-item {
	.ivu-poptip-rel {
		display: block !important;
	}
}
</style>


