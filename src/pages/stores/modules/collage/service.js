import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0],
		'1': {
			...initPage
		},
		'2': {
			...initPage
		}
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
		}
	}
};

const mutations = {
	COLLAGE_SERVICE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.wait_count, data.complete_count]
		};
	},
	COLLAGE_SERVICE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	COLLAGE_SERVICE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	COLLAGE_SERVICE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	COLLAGE_SERVICE_TITLE_CHANGE(state, payload) { 
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
	COLLAGE_SERVICE_SELECTED_TAB(state, payload) {
		state.type = payload;
	}
};

export const collageService = {
	state: { ...initialState },
	mutations,
};
