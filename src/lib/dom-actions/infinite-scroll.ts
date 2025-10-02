export default function infiniteScroll(
	node: HTMLElement,
	options: {
		callback: () => void | Promise<void>;
		enabled?: boolean;
		rootMargin?: string;
		threshold?: number;
	}
) {
	let observer: IntersectionObserver | null = null;

	observer = new IntersectionObserver(
		(entries) => {
			// Check enabled at intersection time, like your example
			if (entries[0].isIntersecting && options.enabled !== false) {
				options.callback();
			}
		},
		{
			root: null,
			rootMargin: options.rootMargin ?? '0px',
			threshold: options.threshold ?? 0
		}
	);

	observer.observe(node);

	return {
		update(newOptions: typeof options) {
			// Svelte calls this automatically when options change
			options = newOptions;
		},
		destroy() {
			// Svelte calls this automatically when element unmounts
			if (observer) {
				observer.disconnect();
				observer = null;
			}
		}
	};
}

// export default function infiniteScroll(
// 	node: HTMLElement,
// 	options: {
// 		callback: () => void;
// 	}
// ) {
// 	const observer = new IntersectionObserver((entries) => {
// 		if (entries[0].isIntersecting) {
// 			options.callback();
// 		}
// 	});

// 	observer.observe(node);

// 	return {
// 		destroy() {
// 			observer.disconnect();
// 		}
// 	};
// }

// export default function infiniteScroll(
// 	node: HTMLElement,
// 	options: {
// 		callback: () => void;
// 	}
// ) {
// 	// 'node' is the element the action is applied to (the sentinel element)

// 	const observer = new IntersectionObserver(
// 		(entries) => {
// 			// Check if the sentinel element is now visible (i.e., intersecting)
// 			if (entries[0].isIntersecting) {
// 				// Call the callback function provided by the Svelte component
// 				options.callback();
// 			}
// 		},
// 		{
// 			// Options for the IntersectionObserver
// 			// root: null means the viewport is the root
// 			// rootMargin: "0px 0px 200px 0px" would trigger loading 200px before the element is visible
// 			threshold: 1.0 // 1.0 means the callback is fired when 100% of the target is visible
// 		}
// 	);

// 	// Start observing the target element
// 	observer.observe(node);

// 	// The destroy function for the action to clean up resources
// 	return {
// 		destroy() {
// 			observer.disconnect();
// 		}
// 	};
// }
