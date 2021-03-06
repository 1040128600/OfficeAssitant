import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	FINANCE_BILL_IN_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	FINANCE_BILL_IN_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	FINANCE_BILL_IN_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	FINANCE_BILL_IN_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const financeBillIn = {
	state: { ...initialState },
	mutations,
};
