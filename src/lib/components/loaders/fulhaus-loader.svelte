<script lang="ts">
	import { cn } from '$lib/utils/cn';

	const { class: className = '' }: { class?: string } = $props();
</script>

<div
	class={cn(
		'fill-color-text flex h-fit w-12 flex-col items-center justify-center space-y-1',
		className
	)}
>
	<svg
		class="h-auto w-8/12 fill-inherit"
		width="96"
		height="24"
		viewBox="5 9 14 6"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="8" cy="12" r="3" fill="inherit">
			<animate
				attributeName="cx"
				dur="1s"
				repeatCount="indefinite"
				values="8;16;8"
				calcMode="spline"
				keySplines=".42,0,.58,1;.42,0,.58,1"
			/>
		</circle>
		<circle cx="16" cy="12" r="3" fill="inherit">
			<animate
				attributeName="cx"
				dur="1s"
				repeatCount="indefinite"
				values="16;8;16"
				calcMode="spline"
				keySplines=".42,0,.58,1;.42,0,.58,1"
			/>
		</circle>
	</svg>

	<svg
		class="h-auto w-5/12 animate-pulse fill-inherit"
		width="11"
		height="17"
		viewBox="0 0 11 17"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M10.3468 4.77812C9.24908 2.83786 6.54638 1.56906 3.99433 1.4733H3.92279C3.85126 2.52668 3.82744 3.53323 3.82744 4.51479V7.74783C5.90267 7.67601 8.15237 7.07752 9.20136 5.73577V10.8862C8.15237 9.54448 5.90267 8.8502 3.82744 8.77838V12.0833C3.82744 13.3771 3.89896 14.6949 4.42346 16.0835H0.178711C0.679369 14.6938 0.822407 13.3771 0.822407 12.0833V4.51479C0.822407 3.22092 0.70321 1.90313 0.178711 0.514587H10.3945L10.3468 4.77812Z"
			fill="inherit"
		/>
	</svg>
</div>
