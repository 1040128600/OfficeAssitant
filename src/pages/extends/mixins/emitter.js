export default {
	methods: {
		dispatch(componentName, eventName, params) {
			let parent = this.$parent || this.$root;
			let name = parent.$options.name;

			while (parent && (!name || name !== componentName)) {
				parent = parent.$parent;

				if (parent) {
					name = parent.$options.componentName;
				}
			}
			if (parent) {
				/* eslint-disable prefer-spread */
				parent.$emit.apply(parent, [eventName].concat(params));
			}
		},
		broadcast(componentName, eventName, params) {
			this.$children.forEach(child => {
				const name = child.$options.name;

				if (name === componentName) {
					child.$emit.apply(child, [eventName].concat(params));
				} else {
					// todo 如果 params 是空数组，接收到的会是 undefined
					this.broadcast.apply(child, [componentName, eventName].concat(params)); // [params]
				}
			});
		}
	}
};
