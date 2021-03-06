import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage,
		time: [],
		enable_upload: 0
	},
};

const mutations = {
	ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list,
			},
			time: [data.upload_start_time, data.upload_end_time],
			enable_upload: data.enable_upload,
		};
	},
	ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	ACADEMY_TRAIN_PLAN_DETAIL_EXAM_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ACADEMY_TRAIN_PLAN_DETAIL_EXAM_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const academyTrainPlanDetailExam = {
	state: { ...initialState },
	mutations,
};
