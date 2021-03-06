import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
		'0': {
			...initPage
		},
		'1': {
			...initPage
		},
		'2': {
			...initPage
		},
	}
};

const mutations = {
	SALE_PROPERTY_COIN_DETAIL_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
	SALE_PROPERTY_COIN_DETAIL_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SALE_PROPERTY_COIN_DETAIL_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_PROPERTY_COIN_DETAIL_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const salePropertyCoinDetail = {
	state: { ...initialState },
	mutations,
};
