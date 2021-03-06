import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
	},
	type: '',
	title: {
		'1': {
			title_show: [],
			title_hide: []
		},
		'2': {
			title_show: [],
			title_hide: []
		},
	}
};

const mutations = {
	ACADEMY_MAIN_ENROLL_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			[type]: {
				...state.listInfo[type],
				total: data.totalCount,
				data: {
					...state.listInfo[type].data,
					[page]: data.list
				}
			}
		};
	},
	ACADEMY_MAIN_ENROLL_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	ACADEMY_MAIN_ENROLL_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ACADEMY_MAIN_ENROLL_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	ACADEMY_MAIN_ENROLL_TITLE_CHANGE(state, payload) { 
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
	ACADEMY_MAIN_ENROLL_SELECTED_TAB(state, payload) {
		state.type = payload;
	}
};

export const academyMainEnroll = {
	state: { ...initialState },
	mutations,
};
