import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		count: [0, 0, 0, 0, 0, 0],
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
		'3': {
			...initPage
		},
		'4': {
			...initPage
		},
		'5': {
			...initPage
		},
		'6': {
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
		},
		'3': {
			title_show: [],
			title_hide: []
		},
		'4': {
			title_show: [],
			title_hide: []
		},
		'5': {
			title_show: [],
			title_hide: []
		},
		'6': {
			title_show: [],
			title_hide: []
		}
	},
	sortData: [],
	searchData: {
		title_show: [],
		title_hide: []
	}
};

const mutations = {
	SC_CUSTOMER_COOPERATE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.default_count, data.await_confirm_count,
				data.await_allocate_count, data.allocate_count,
				data.error_count, data.invalid_count]

		};
	},
	SC_CUSTOMER_COOPERATE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SC_CUSTOMER_COOPERATE_LIST_INIT(state, payload) {
		state.listInfo = {
			...JSON.parse(JSON.stringify(initialState.listInfo))
		};
	},
	SC_CUSTOMER_COOPERATE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SC_CUSTOMER_COOPERATE_TITLE_CHANGE(state, payload) { 
		state.title[payload.type].title_show = payload.title_show;
		state.title[payload.type].title_hide = payload.title_hide;
	},
	SC_CUSTOMER_COOPERATE_SELECTED_TAB(state, payload) {
		state.type = payload;
	},
	SC_CUSTOMER_COOPERATE_LIST_SORT(state, payload) {
		state.sortData = payload;
	},
	SC_CUSTOMER_COOPERATE_LIST_SEARCH(state, payload) {
		state.searchData.title_show = payload.title_show;
		state.searchData.title_hide = payload.title_hide;
	}
};

export const scCustomerCooperate = {
	state: { ...initialState },
	mutations,
};
