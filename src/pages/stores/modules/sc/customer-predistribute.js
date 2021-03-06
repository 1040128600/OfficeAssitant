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
	}
};

const mutations = {
	SC_CUSTOMER_PREDISTRIBUTE_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.wait_count, data.has_count, data.invalid_count]
		};
	},
	SC_CUSTOMER_PREDISTRIBUTE_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SC_CUSTOMER_PREDISTRIBUTE_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SC_CUSTOMER_PREDISTRIBUTE_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const scCustomerPredistribute = {
	state: { ...initialState },
	mutations,
};
