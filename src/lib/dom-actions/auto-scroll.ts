export default function autoScroll(node: HTMLElement) {
	let mutationObserver: MutationObserver | null = null;
	let isActive = false;

	function scrollToBottom() {
		node.scrollTo({
			top: node.scrollHeight,
			behavior: 'smooth'
		});
	}

	function handleMutation() {
		if (isActive) scrollToBottom();
	}

	function start() {
		if (isActive) return;

		isActive = true;
		mutationObserver = new MutationObserver(handleMutation);
		mutationObserver.observe(node, { childList: true, subtree: true });

		scrollToBottom();
	}

	function stop() {
		isActive = false;
		if (mutationObserver) {
			mutationObserver.disconnect();
			mutationObserver = null;
		}
	}

	return {
		start,
		stop,
		destroy: stop
	};
}
