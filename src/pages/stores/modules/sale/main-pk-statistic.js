import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	SALE_MAIN_PK_STATISTIC_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	SALE_MAIN_PK_STATISTIC_LIST_RESET(state, payload) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	SALE_MAIN_PK_STATISTIC_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_MAIN_PK_STATISTIC_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const saleMainPkStatistic = {
	state: { ...initialState },
	mutations,
};
