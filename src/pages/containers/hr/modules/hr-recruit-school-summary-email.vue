<template>
	<set-title :routes="routes" title="发Offer" class="g-pd-20">
		<oa-content />
	</set-title>
</template>

<script>

import Content from '@components/hr/recruit-school-summary-email/content';

export default {
	name: 'oa-hr-recruit-school-summary-email',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [
				{
					path: this.$route.query.recruitType === 'school' ? '/hr/recruit/school/summary' : '/hr/recruit/social/summary',
					name: this.$route.query.recruitType === 'school' ? '校招总表' : '社招跟进'
				},
				{
					path: '',
					name: '发Offer'
				}
			]
		};
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
