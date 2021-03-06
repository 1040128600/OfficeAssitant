import Viewer from '../../common/text/viewer.vue';
import Editor from '../../common/text/editor.vue';
import Widget from './widget.vue';

export const probationTime = {
	module: "probationTime",
	type: '基础组件',
	name: "试用期时间",
	Viewer,
	Editor, 
	Widget,
	// 初始数据
	data: {
		// for draggable
		type: '15',
		value: '试用期时间',
		w: 268,
		h: 32,
		r: 0,
		x: 0, // 动态分配
		y: 0, // 动态分配
		z: 1,
		weight: 400,
		fs: 14,
		parent: true,
		// for content
		name: '名称'
	},
	dataValidity: (res = {}) => {
		if (!res.name) {
			return {
				error: "输入框内容必填"
			};
		}
		return null;
	}
};