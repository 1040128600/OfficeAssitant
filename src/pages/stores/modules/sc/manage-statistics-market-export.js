import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		...initPage
	}
};

const mutations = {
	SC_MANAGE_STATISTICS_MARKET_EXPORT_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
		state.listInfo = {
			...state.listInfo,
			total: data.totalCount,
			data: {
				...state.listInfo.data,
				[page]: data.list
			}
		};
	},
	SC_MANAGE_STATISTICS_MARKET_EXPORT_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			reset: true
		};
	},
	SC_MANAGE_STATISTICS_MARKET_EXPORT_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SC_MANAGE_STATISTICS_MARKET_EXPORT_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const scManageStatisticsMarketExport = {
	state: { ...initialState },
	mutations
};