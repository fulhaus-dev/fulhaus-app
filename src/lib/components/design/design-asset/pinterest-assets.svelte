<script lang="ts">
	import { goto } from '$app/navigation';
	import { useDesignAssetMutation } from '$lib/client/mutations/use-design-asset.mutation.svelte';
	import { usePinterestQuery } from '$lib/client/queries/use-pinterest.query.svelte';
	import Button from '$lib/components/button.svelte';
	import UploadingDesignAssetLoader from '$lib/components/design/design-asset/uploading-design-asset-loader.svelte';
	import ImageMasonry from '$lib/components/image-masonry.svelte';
	import FulhausLoader from '$lib/components/loaders/fulhaus-loader.svelte';

	const { onSelect }: { onSelect?: (imageUrl: string) => void } = $props();

	const { designAssetMutationState, uploadDesignAssetUrl } = useDesignAssetMutation({
		onUpload: onSelect
	});

	const pinterestQuery = usePinterestQuery();

	const loading = $derived(pinterestQuery.loading);
	const error = $derived(pinterestQuery.error);
	const pins = $derived(pinterestQuery.pins);
</script>

{#if loading}
	<div class="h-full w-full space-y-8 px-4 py-20 lg:px-0">
		<FulhausLoader class="mx-auto" />
	</div>
{/if}

{#if error}
	{@render ConnectPinterest()}
{/if}

{#if designAssetMutationState.uploading}
	<UploadingDesignAssetLoader />
{/if}

<ImageMasonry images={pins} onSelect={(imageUrl) => uploadDesignAssetUrl(imageUrl, 'inspo')} />

{#snippet ConnectPinterest()}
	<div class="h-full w-full space-y-8 px-4 py-20 lg:px-0">
		<div class="mx-auto w-fit">
			<h3 class="leading-none">Get recommendations right from your Pinterest Boards</h3>
			<p class="text-color-text-muted">
				Connect your account to design from your existing Pinterest inspiration.
			</p>
		</div>

		<Button
			class="relative mx-auto block h-[32vh] w-full max-w-[32rem] border border-color-border-muted"
			variant="text"
			onclick={() =>
				goto(`/api/pinterest/auth?redirect=${encodeURIComponent(window.location.href)}`)}
		>
			<img
				class="h-full w-full rounded-md object-cover"
				src="https://pub-e4742e96ef9945dfa0f14c36708e269a.r2.dev/pinterest-modal-image.webp"
				alt="Pinterest Banner"
			/>

			<p
				class="absolute right-4 bottom-2 left-4 z-1 rounded-md bg-neutral-800 p-2 text-lg font-medium text-white ring-1 ring-color-border-muted"
			>
				Connect Pinterest
			</p>
		</Button>
	</div>
{/snippet}
