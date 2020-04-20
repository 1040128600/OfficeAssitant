import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	CONTENT_ACTIVITY_CLASSIFY_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	CONTENT_ACTIVITY_CLASSIFY_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	CONTENT_ACTIVITY_CLASSIFY_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	CONTENT_ACTIVITY_CLASSIFY_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const contentActivityClassify = {
	state: { ...initialState },
	mutations,
};
