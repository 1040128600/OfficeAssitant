import { initPage } from '@utils/utils';

const initialState = {
	listInfo: {
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
		count: [0, 0, 0, 0],
		fixPosition: false
	}
};

const mutations = {
	SALE_FRACTION_MATERIAL_APPLICATION_LIST_GET_SUCCESS(state, { data, param: { type, page } }) {
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
			count: [data.manage_check_count, data.institution_check_count, data.pass_count, data.refuse_count]
		};
	},
	SALE_FRACTION_MATERIAL_APPLICATION_LIST_RESET(state, { type }) {
		state.listInfo = {
			...initialState.listInfo,
			[type]: {
				...initPage,
				reset: true
			}
		};
	},
	SALE_FRACTION_MATERIAL_APPLICATION_LIST_INIT(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
	SALE_FRACTION_MATERIAL_APPLICATION_ROUTE_CHANGE(state, payload) {
		state.listInfo = {
			...initialState.listInfo
		};
	},
};

export const saleFractionMaterialApplication = {
	state: { ...initialState },
	mutations,
};
