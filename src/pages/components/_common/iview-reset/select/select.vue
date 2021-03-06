<template>
	<div
		v-click-outside.capture="onClickOutside"
		v-click-outside:mousedown.capture="onClickOutside"
		:class="classes"
		class="iview-reset"
	>
		<div
			ref="reference"
			:class="selectionCls"
			:style="{maxHeight:maxHeadHeight?maxHeadHeight+'px':'',overflow:maxHeadHeight?'auto':''}"
				
			:tabindex="selectTabindex"
			@blur="toggleHeaderFocus"
			@focus="toggleHeaderFocus"
			@click="toggleMenu"
			@keydown.esc="handleKeydown"
			@keydown.enter="handleKeydown"
			@keydown.up.prevent="handleKeydown"
			@keydown.down.prevent="handleKeydown"
			@keydown.tab="handleKeydown"
			@keydown.delete="handleKeydown"
			@mouseenter="hasMouseHoverHead = true"
			@mouseleave="hasMouseHoverHead = false"

		>
			<slot name="input">
				<input :name="name" :value="publicValue" type="hidden">
				<select-head
					:filterable="filterable"
					:multiple="multiple"
					:values="values"
					:clearable="canBeCleared"
					:disabled="disabled"
					:remote="remote"
					:input-element-id="elementId"
					:initial-label="initialLabel"
					:placeholder="placeholder"
					:query-prop="query"

					@on-query-change="onQueryChange"
					@on-input-focus="isFocused = true"
					@on-input-blur="isFocused = false"
					@on-clear="clearSingleSelect"
				/>
			</slot>
		</div>
		<transition name="transition-drop">
			<Drop
				v-transfer-dom
				v-show="dropVisible" 
				ref="dropdown"
				:class="dropdownCls"
				:placement="placement"
				
				:data-transfer="transfer"
				:transfer="transfer"
			>
				<ul v-show="showNotFoundLabel" :class="[prefixCls + '-not-found']"><li>{{ localeNotFoundText }}</li></ul>
				<ul v-show="(!remote) || (remote && !loading)" :class="prefixCls + '-dropdown-list'">
					<!-- 卸载插槽里的option，防止使用index作为key时无法实时更新label -->
					<slot v-if="(!remote) || (remote && !loading)" />
				</ul>
				<ul v-show="loading" :class="[prefixCls + '-loading']">{{ localeLoadingText }}</ul>
			</Drop>
		</transition>
	</div>
</template>
<script>
/* eslint-disable no-continue */

import { directive as clickOutside } from 'v-click-outside-x';
import TransferDom from 'iview/src/directives/transfer-dom';
import { oneOf } from 'iview/src/utils/assist';
import Emitter from 'iview/src/mixins/emitter';
import Locale from 'iview/src/mixins/locale';
import Drop from './dropdown.vue'; 
import SelectHead from './select-head.vue';
import FunctionalOptions from './functional-options.vue';

const prefixCls = 'ivu-select';
const optionRegexp = /^i-option$|^Option$/i;
const optionGroupRegexp = /option-?group/i;

const findChild = (instance, checkFn) => {
	let match = checkFn(instance);
	if (match) return instance;
	for (let i = 0, l = instance.$children.length; i < l; i++) {
		const child = instance.$children[i];
		match = findChild(child, checkFn);
		if (match) return match;
	}
};

const findOptionsInVNode = (node) => {
	const opts = node.componentOptions;
	if (opts && opts.tag.match(optionRegexp)) return [node];
	if (!node.children && (!opts || !opts.children)) return [];
	const children = [...(node.children || []), ...((opts && opts.children) || [])];
	const options = children.reduce(
		(arr, el) => [...arr, ...findOptionsInVNode(el)], []
	).filter(Boolean);
	return options.length > 0 ? options : [];
};

const extractOptions = (options_) => options_.reduce((options, slotEntry) => {
	return options.concat(findOptionsInVNode(slotEntry));
}, []);

const applyProp = (node, propName, value) => {
	return {
		...node,
		componentOptions: {
			...node.componentOptions,
			propsData: {
				...node.componentOptions.propsData,
				[propName]: value,
			}
		}
	};
};

const getNestedProperty = (obj, path) => {
	const keys = path.split('.');
	return keys.reduce((o, key) => (o && o[key]) || null, obj);
};

const getOptionLabel = option => {
	if (option.componentOptions.propsData.label) return option.componentOptions.propsData.label;
	const textContent = (option.componentOptions.children || []).reduce((str, child) => str + (child.text || ''), '');
	const innerHTML = getNestedProperty(option, 'data.domProps.innerHTML');
	return textContent || (typeof innerHTML === 'string' ? innerHTML : '');
};

const checkValuesNotEqual = (value, publicValue, values) => {
	const strValue = JSON.stringify(value);
	const strPublic = JSON.stringify(publicValue);
	const strValues = JSON.stringify(values.map(item => {
		return item.value;
	}));
	return strValue !== strPublic || strValue !== strValues || strValues !== strPublic;
};


const ANIMATION_TIMEOUT = 300;

export default {
	name: 'i-select',
	components: { FunctionalOptions, Drop, SelectHead },
	directives: { clickOutside, TransferDom },
	mixins: [Emitter, Locale],
	props: {
		value: {
			type: [String, Number, Array],
			default: ''
		},
		// 使用时，也得设置 value 才行
		label: {
			type: [String, Number, Array],
			default: ''
		},
		multiple: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		clearable: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String
		},
		filterable: {
			type: Boolean,
			default: false
		},
		filterMethod: {
			type: Function
		},
		remoteMethod: {
			type: Function
		},
		loading: {
			type: Boolean,
			default: false
		},
		loadingText: {
			type: String
		},
		size: {
			validator(value) {
				return oneOf(value, ['small', 'large', 'default']);
			},
			default() {
				return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size;
			}
		},
		labelInValue: {
			type: Boolean,
			default: false
		},
		notFoundText: {
			type: String
		},
		placement: {
			validator(value) {
				return oneOf(value, ['top', 'bottom', 'top-start', 'bottom-start', 'top-end', 'bottom-end']);
			},
			default: 'bottom-start'
		},
		transfer: {
			type: Boolean,
			default() {
				return !this.$IVIEW || this.$IVIEW.transfer === '' ? false : this.$IVIEW.transfer;
			}
		},
		// Use for AutoComplete
		autoComplete: {
			type: Boolean,
			default: false
		},
		name: {
			type: String
		},
		elementId: {
			type: String
		},
		transferClassName: {
			type: String
		},
		maxHeadHeight: {
			default: 0,
			type: Number

		}
	},
	data() {

		return {
			prefixCls,
			values: [],
			dropDownWidth: 0,
			visible: false,
			focusIndex: -1,
			isFocused: false,
			query: '',
			initialLabel: this.label,
			hasMouseHoverHead: false,
			slotOptions: this.$slots.default,
			options: this.getOptions(),
			optionsCache: this.getOptions(),
			caretPosition: -1,
			lastRemoteQuery: '',
			unchangedQuery: true,
			hasExpectedValue: false,
			preventRemoteCall: false,
			filterQueryChange: false, // #4273
		};
	},
	computed: {
		classes() {
			return [
				`${prefixCls}`,
				{
					[`${prefixCls}-visible`]: this.visible,
					[`${prefixCls}-disabled`]: this.disabled,
					[`${prefixCls}-multiple`]: this.multiple,
					[`${prefixCls}-single`]: !this.multiple,
					[`${prefixCls}-show-clear`]: this.showCloseIcon,
					[`${prefixCls}-${this.size}`]: !!this.size
				}
			];
		},
		dropdownCls() {
			return {
				[prefixCls + '-dropdown-transfer']: this.transfer,
				[prefixCls + '-multiple']: this.multiple && this.transfer,
				'ivu-auto-complete': this.autoComplete,
				[this.transferClassName]: this.transferClassName
			};
		},
		selectionCls() {
			return {
				[`${prefixCls}-selection`]: !this.autoComplete,
				[`${prefixCls}-selection-focused`]: this.isFocused
			};
		},
		localeNotFoundText() {
			if (typeof this.notFoundText === 'undefined') {
				return this.t('i.select.noMatch');
			} else {
				return this.notFoundText;
			}
		},
		localeLoadingText() {
			if (typeof this.loadingText === 'undefined') {
				return this.t('i.select.loading');
			} else {
				return this.loadingText;
			}
		},
		transitionName() {
			return this.placement === 'bottom' ? 'slide-up' : 'slide-down';
		},
		dropVisible() {
			let status = true;
			const noOptions = !this.slotOptions || this.slotOptions.length === 0;
			if (!this.loading && this.remote && this.query === '' && noOptions) status = false;

			if (this.autoComplete && noOptions) status = false;

			return this.visible && status;
		},
		showNotFoundLabel() {
			const { loading, remote, slotOptions, options } = this;
			if (!this.remote && this.filterable) {
				const exist = this.options.find(i => i.label.includes(this.query));
				return !exist;
			}

			return !loading && !this.options.length;
			// return slotOptions && slotOptions.filter(i => i.tag).length === 0 && (!remote || (remote && !loading));
		},
		publicValue() {
			if (this.labelInValue) {
				return this.multiple ? this.values : this.values[0];
			} else {
				return this.multiple ? this.values.map(option => option.value) : (this.values[0] || {}).value;
			}
		},
		canBeCleared() {
			const uiStateMatch = this.hasMouseHoverHead || this.active;
			const qualifiesForClear = !this.multiple && !this.disabled && this.clearable;
			return uiStateMatch && qualifiesForClear && this.reset; // we return a function
		},
		selectTabindex() {
			return this.disabled || this.filterable ? -1 : 0;
		},
		remote() {
			return typeof this.remoteMethod === 'function';
		}
	},
	watch: {
		value(value) {
			const { getOptionData, publicValue, values } = this;

			if (value === '') this.values = [];
			else if (checkValuesNotEqual(value, publicValue, values)) {
				this.$nextTick(() => {
					this.updateValues();
				});
				this.dispatch('FormItem', 'on-form-change', this.publicValue);
			}
		},
		values(now, before) {
			const newValue = JSON.stringify(now);
			const oldValue = JSON.stringify(before);
			// v-model is always just the value, event with labelInValue === true
			const vModelValue = (this.publicValue && this.labelInValue)
				? (this.multiple ? this.publicValue.map(({ value }) => value) : this.publicValue.value)
				: this.publicValue;
			const shouldEmitInput = newValue !== oldValue && vModelValue !== this.value;
			if (shouldEmitInput) {
				this.$emit('input', vModelValue); // to update v-model
				this.$emit('on-change', this.publicValue);
				this.dispatch('FormItem', 'on-form-change', this.publicValue);
				this.broadcast('i-option', 'on-select-change', this.publicValue);
			}
		},
		query(query) {
			this.$emit('on-query-change', query);
			const { remoteMethod, lastRemoteQuery } = this;
			const hasValidQuery = query !== '' && (query !== lastRemoteQuery || !lastRemoteQuery);
			const shouldCallRemoteMethod = remoteMethod && hasValidQuery && !this.preventRemoteCall;

			this.preventRemoteCall = false; // remove the flag
			if (shouldCallRemoteMethod) {
				this.focusIndex = -1;
				const promise = this.remoteMethod(query);
				this.initialLabel = '';
				if (promise && promise.then) {
					promise.then(options => {
						if (options) this.options = options;
					});
				}
			}
			if (query !== '' && this.remote) this.lastRemoteQuery = query;
		},
		loading(state) {
			if (state === false) {
				this.updateSlotOptions();
			}
		},
		isFocused(focused) {
			const el = this.filterable ? this.$el.querySelector('input[type="text"]') : this.$el;
			el[this.isFocused ? 'focus' : 'blur']();

			// restore query value in filterable single selects
			const [selectedOption] = this.values;
			if (selectedOption && this.filterable && !this.multiple && !focused) {
				const selectedLabel = String(selectedOption.label || selectedOption.value).trim();
				if (selectedLabel && this.query !== selectedLabel) {
					this.preventRemoteCall = true;
					this.query = selectedLabel;
				}
			}
		},
		focusIndex(index) {
			if (index < 0 || this.autoComplete) return;
			// update scroll
			const optionValue = this.slotOptions[index].componentOptions.propsData.value;
			const optionInstance = findChild(this, ({ $options }) => {
				return $options.componentName === 'select-item' && $options.propsData.value === optionValue;
			});

			let bottomOverflowDistance = optionInstance.$el.getBoundingClientRect().bottom - this.$refs.dropdown.$el.getBoundingClientRect().bottom;
			let topOverflowDistance = optionInstance.$el.getBoundingClientRect().top - this.$refs.dropdown.$el.getBoundingClientRect().top;
			if (bottomOverflowDistance > 0) {
				this.$refs.dropdown.$el.scrollTop += bottomOverflowDistance;
			}
			if (topOverflowDistance < 0) {
				this.$refs.dropdown.$el.scrollTop += topOverflowDistance;
			}
		},
		dropVisible(open) {
			this.broadcast('drop', open ? 'on-update-popper' : 'on-destroy-popper');
		},
		visible(state) {
			this.$emit('on-open-change', state);
		},
		slotOptions(options, old) {
	
			// 当 dropdown 在控件上部显示时，如果选项列表的长度由外部动态变更了，
			// dropdown 的位置会有点问题，需要重新计算
			if (options && old && options.length !== old.length) {
				this.broadcast('drop', 'on-update-popper');
			}
		},
		options(newVal) {
			let changed = false;
			newVal.forEach(item => {
				if (!this.optionsCache.find(it => it.value === item.value)) {
					this.optionsCache.push(item);
					changed = true;
				}
			});
			changed && this.updateValues();
		}
	},
	mounted() {
		this.$on('on-select-selected', this.onOptionClick);
		this.$nextTick(() => {
			
			// this.updateSlotOptions();
			this.updateValues();
			this.broadcast('i-option', 'on-select-change', this.publicValue);
			this.$nextTick(() => {
				// 远程搜索、单选、option为空时发起一次搜索
				if (this.remote && this.filterable && this.options.length == 0 && !this.multiple) {
					this.remoteMethod(this.query);
				}
			});
		});
	},
	updated() {
		this.updateSlotOptions();
	},
	methods: {
		setQuery(query) { // PUBLIC API
			if (query) {
				this.onQueryChange(query);
				return;
			}
			if (query === null) {
				this.onQueryChange('');
				this.values = [];
			}
		},
		clearSingleSelect() { // PUBLIC API
			this.$emit('on-clear');
			this.hideMenu();
			if (this.clearable) this.reset();
			if (!this.remote && this.filterable) {
				this.broadcast('i-option', 'on-filter-query-change', '');
			}
		},
		getOptionData(value) {
			const option = this.slotOptions.find(({ componentOptions }) => componentOptions.propsData.value === value);
			if (!option) return null;
			const label = getOptionLabel(option);
			return {
				value,
				label,
			};
		},
		
		

		validateOption({ children, elm, propsData }) {
			const value = propsData.value;
			const label = propsData.label || '';
			const textContent = (elm && elm.textContent) || (children || []).reduce((str, node) => {
				const nodeText = node.elm ? node.elm.textContent : node.text;
				return `${str} ${nodeText}`;
			}, '') || '';
			const stringValues = JSON.stringify([value, label, textContent]);
			const query = this.query.toLowerCase().trim();
			return stringValues.toLowerCase().includes(query);
		},

		toggleMenu(e, force) {
			if (this.disabled) {
				return false;
			}

			this.visible = typeof force !== 'undefined' ? force : !this.visible;
			if (this.visible) {
				this.dropDownWidth = this.$el.getBoundingClientRect().width;
				this.broadcast('drop', 'on-update-popper');
			}
		},
		hideMenu() {
			this.toggleMenu(null, false);
			setTimeout(() => this.unchangedQuery = true, ANIMATION_TIMEOUT);
		},
		onClickOutside(event) {
			if (this.visible) {
				if (event.type === 'mousedown') {
					event.preventDefault();
					return;
				}

				if (this.transfer) {
					const { $el } = this.$refs.dropdown;
					if ($el === event.target || $el.contains(event.target)) {
						return;
					}
				}


				if (this.filterable) {
					const input = this.$el.querySelector('input[type="text"]');
					this.caretPosition = input.selectionStart;
					this.$nextTick(() => {
						const caretPosition = this.caretPosition === -1 ? input.value.length : this.caretPosition;
						input.setSelectionRange(caretPosition, caretPosition);
					});
				}

				if (!this.autoComplete) event.stopPropagation();
				event.preventDefault();
				this.hideMenu();
				this.isFocused = true;
			} else {
				this.caretPosition = -1;
				this.isFocused = false;
			}
		},
		reset() {
			this.query = '';
			this.focusIndex = -1;
			this.unchangedQuery = true;
			this.values = [];
			this.filterQueryChange = false;
		},
		handleKeydown(e) {
			if (e.key === 'Backspace') {
				return; // so we don't call preventDefault
			}

			if (this.visible) {
				e.preventDefault();
				if (e.key === 'Tab') {
					e.stopPropagation();
				}

				// Esc slide-up
				if (e.key === 'Escape') {
					e.stopPropagation();
					this.hideMenu();
				}
				// next
				if (e.key === 'ArrowUp') {
					this.navigateOptions(-1);
				}
				// prev
				if (e.key === 'ArrowDown') {
					this.navigateOptions(1);
				}
				// enter
				if (e.key === 'Enter') {
					if (this.focusIndex === -1) return this.hideMenu();
					const optionComponent = this.slotOptions[this.focusIndex];

					// fix a script error when searching
					if (optionComponent) {
						const option = this.getOptionData(optionComponent.componentOptions.propsData.value);
						this.onOptionClick(option);
					} else {
						this.hideMenu();
					}
				}
			} else {
				const keysThatCanOpenSelect = ['ArrowUp', 'ArrowDown'];
				if (keysThatCanOpenSelect.includes(e.key)) this.toggleMenu(null, true);
			}


		},
		navigateOptions(direction) {
			const optionsLength = this.slotOptions.length - 1;

			let index = this.focusIndex + direction;
			if (index < 0) index = optionsLength;
			if (index > optionsLength) index = 0;

			// find nearest option in case of disabled options in between
			if (direction > 0) {
				let nearestActiveOption = -1;
				for (let i = 0; i < this.slotOptions.length; i++) {
					const optionIsActive = !this.slotOptions[i].componentOptions.propsData.disabled;
					if (optionIsActive) nearestActiveOption = i;
					if (nearestActiveOption >= index) break;
				}
				index = nearestActiveOption;
			} else {
				let nearestActiveOption = this.slotOptions.length;
				for (let i = optionsLength; i >= 0; i--) {
					const optionIsActive = !this.slotOptions[i].componentOptions.propsData.disabled;
					if (optionIsActive) nearestActiveOption = i;
					if (nearestActiveOption <= index) break;
				}
				index = nearestActiveOption;
			}

			this.focusIndex = index;
		},
		onOptionClick(option) {
			if (this.remote && this.filterable && !this.multiple) {
				this.preventRemoteCall = true;
			}
			if (this.multiple) {

				// keep the query for remote select
				if (this.remote) this.lastRemoteQuery = this.lastRemoteQuery || this.query;
				else this.lastRemoteQuery = '';

				const selectIndex = this.values.findIndex(({ value }) => value === option.value);
				if (selectIndex > -1) {
					// 重新赋值触发watch
				 this.values = this.values.filter(({ value }) => value !== option.value);
				} else {
					
					this.values = [...this.values, option];
				}

				this.isFocused = true; // so we put back focus after clicking with mouse on option elements
			} else {
				this.query = String(option.label).trim();
				this.values = [option];
				this.lastRemoteQuery = '';
				this.hideMenu();
			}

			this.focusIndex = this.slotOptions.findIndex((opt) => {
				if (!opt || !opt.componentOptions) return false;
				return opt.componentOptions.propsData.value === option.value;
			});

			if (this.filterable) {
				const inputField = this.$el.querySelector('input[type="text"]');
				if (!this.autoComplete) this.$nextTick(() => inputField.focus());
			}
			this.broadcast('drop', 'on-update-popper');
			setTimeout(() => {
				this.filterQueryChange = false;
			}, ANIMATION_TIMEOUT);
		},
		onQueryChange(query) {
			if (query.length > 0 && query !== this.query) {
				// in 'AutoComplete', when set an initial value asynchronously,
				// the 'dropdown list' should be stay hidden.
				// [issue #5150]
				if (this.autoComplete) {
					let isInputFocused = document.hasFocus
                            && document.hasFocus()
                            && document.activeElement === this.$el.querySelector('input');
					this.visible = isInputFocused;
				} else {
					this.visible = true;
				}
			}

			this.query = query;
			this.unchangedQuery = this.visible;
			this.filterQueryChange = true;
			this.broadcast('drop', 'on-update-popper');
			if (!this.remote && this.filterable) {
				this.broadcast('i-option', 'on-filter-query-change', query);
			}
			

		},
		toggleHeaderFocus({ type }) {
			if (this.disabled) {
				return;
			}
			this.isFocused = type === 'focus';
		},
		updateSlotOptions() {
			const last = this.getOptionsFromSlot(this.slotOptions);
			const now = this.getOptionsFromSlot(this.$slots.default);
			
			const isEqual = JSON.stringify(last) === JSON.stringify(now);
			if (!isEqual) {
				this.slotOptions = this.$slots.default ? this.$slots.default.filter(i => i.tag) : []; 
				this.options = now || []; 
				this.updateValues();
			}
			this.$nextTick(() => {
				this.broadcast('i-option', 'on-select-change', this.publicValue);
			});
			
		},
		checkSlotOptionEqual() {
			const last = this.getOptionsFromSlot(this.slotOptions);
			const now = this.getOptionsFromSlot(this.$slots.default);
			return (JSON.stringify(last) === JSON.stringify(now));
		},
		getOptions() {
			return this.getOptionsFromSlot(this.$slots.default) || [];

		},
		getOptionsFromSlot(slotOptions) {
			return (
				slotOptions && slotOptions.filter(i => i.tag)
					.map(i => ({
						label: (i.componentOptions.propsData.label 
						|| (i.componentOptions.children && i.componentOptions.children[0].text.trim())) || '',
						value: i.componentOptions.propsData.value 
					}))
			) || [];
		},
		getInitialValue() {
			const { multiple, remote, value } = this;
			if (multiple) {
				 return this.optionsCache.filter(op => value.includes(op.value));
			} else {
				return this.optionsCache.filter(op => value === op.value);
			}
		},
		updateValues() {
			const initValue = this.getInitialValue();
			if (initValue.length === 0 && this.values.length === 0) {
				return;
			}
			if (JSON.stringify(this.values) != JSON.stringify(initValue)) {
				this.values = initValue;
			}
			// if (this.multiple) {
			// 	initValue.forEach(op => {
			// 		if (!this.values.find(val => val.value === op.value)) {
			// 			this.values.push(op);
			// 		}
			// 	});
			// } else {
			// 	this.values = initValue;
			// }
			// if (JSON.stringify(this.values) !== JSON.stringify(initValue)) {

			// 	this.values = initValue;
			// }
		}
        
        
	},
};
</script>
<style lang="scss">
.ivu-select-selection {
    min-height:32px;
}
</style>
