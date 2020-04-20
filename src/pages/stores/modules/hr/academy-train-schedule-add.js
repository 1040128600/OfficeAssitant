import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0],
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		'3': {
			...initPage
		},
		type: ''
	},
	title: {
		'1': {
			title_show: [],
			title_hide: []
		},
		'2': {
			title_show: [],
			title_hide: []
		},
		'3': {
			title_show: [],
			title_hide: []
		},
	}
};

const mutations = {
	HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data.totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data.list
				}
			},
			count: [data.default_count, data.success_count, data.error_count]
		};
	},
	HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_TRAIN_SCHEDULE_ADD_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	HR_ACADEMY_TRAIN_SCHEDULE_ADD_TITLE_CHANGE(state, payload) {
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
	HR_ACADEMY_TRAIN_SCHEDULE_ADD_SELECTED_TAB(state, payload) {
		state.type = payload;
	},
};

export const hrAcademyTrainScheduleAdd = {
	state: { ...initialState },
	mutations,
};
