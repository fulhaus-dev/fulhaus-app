<script lang="ts">
	import {
		useCreditPoolMembersQuery,
		useCreditPoolQuery
	} from '$lib/client/queries/use-credit-pool.query.svelte';
	import Avatar from '$lib/components/avatar.svelte';
	import FulhausLoader from '$lib/components/loaders/fulhaus-loader.svelte';
	import { cn } from '$lib/utils/cn';

	const creditPoolQuery = useCreditPoolQuery();
	const creditPool = $derived(creditPoolQuery.creditPool);

	const creditPoolMembersQuery = useCreditPoolMembersQuery();
	const creditPoolMembers = $derived(creditPoolMembersQuery.creditPoolMembers ?? []);
</script>

{#if creditPoolQuery.loading}
	<div class="fixed inset-0 backdrop-blur-xs">
		<FulhausLoader class="mx-auto mt-40" />
	</div>
{/if}

{#if creditPool}
	<section class="mx-auto w-full max-w-[1540px] px-8 pt-8">
		<h1>{creditPool.name} Credit Pool</h1>

		<div
			class="border-default relative overflow-x-auto rounded-md border border-color-border/25 shadow-xs"
		>
			<table class="w-full text-left text-sm rtl:text-right">
				<thead
					class="rounded-base border-b border-color-border/25 bg-color-background-surface text-sm"
				>
					<tr>
						<th scope="col" class="px-6 py-3 font-medium"> Name </th>
						<th scope="col" class="px-6 py-3 font-medium"> Email </th>
						<th scope="col" class="px-6 py-3 font-medium"> Used </th>
						<th scope="col" class="px-6 py-3 font-medium"> Status </th>
					</tr>
				</thead>
				<tbody>
					{#each creditPoolMembers as creditPoolMember (creditPoolMember._id)}
						<tr class="border-b border-color-border/25">
							<th
								scope="row"
								class="flex items-center gap-x-2 px-6 py-4 font-medium whitespace-nowrap"
							>
								<Avatar
									src={creditPoolMember.user?.imageUrl}
									alt={creditPoolMember.user?.fullName}
									fullName={creditPoolMember.user?.fullName}
								/>
								<span>{creditPoolMember.user?.fullName}</span>
							</th>
							<td class="px-6 py-4">{creditPoolMember.user?.email}</td>
							<td class="px-6 py-4">{creditPoolMember.totalUsed}</td>
							<td
								class={cn(
									'px-6 py-4',
									creditPoolMember.active ? 'text-green-500' : 'text-color-text-placeholder'
								)}>{creditPoolMember.active ? 'Active' : 'Inactive'}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
{/if}
