/* eslint-disable vue/no-use-v-if-with-v-for */
<script setup lang="ts">
import { useScroll } from '@vueuse/core';

import { useRoute, useRouter } from 'vue-router';
import radios from '../assets/radios.json';
import { get, set } from './../utils/localStorage';

import Radio from './RadioRow.vue';
import Dropdown from './DropdownComponent.vue';
import SearchComponent from './SearchComponent.vue';
import SearchPlaceholder from './SearchPlaceholder.vue';
import CreditsComponent from './CreditsComponent.vue';
import StartSearchButton from './StartSearchButton.vue';
import BackToTop from './BackToTop.vue';

const router = useRouter();
const route = useRoute();

/* DATA */
const lovedRadios: Ref<string[]> = ref([]);
const searchResults: Ref<string[]> = ref([]);
const isSearching = ref(false);
const showSearch = ref(false);
const filter: Ref<string> = ref('All');
const hidden: Ref<boolean> = ref(true);

const el: Ref<HTMLElement | null> = ref(null);
const { y } = useScroll(el, {
	behavior: 'smooth',
	onScroll: (_e) => {
		if (y.value > 50) {
			hidden.value = false;
		} else {
			hidden.value = true;
		}
	},
});

/* METHODS */
function isLoved(radioName: string) {
	return (
		lovedRadios.value!.findIndex((element) => element === radioName) !== -1
	);
}

function love(radioName: string) {
	lovedRadios.value!.push(radioName);
	set('lovedRadios', lovedRadios.value);
}

function unlove(radioName: string) {
	const toUnlove = lovedRadios.value!.findIndex(
		(element) => element === radioName,
	);
	if (toUnlove > -1) {
		lovedRadios.value!.splice(toUnlove, 1);
	}
	set('lovedRadios', lovedRadios.value);
}

function filterRadios(e: string) {
	filter.value = e;
}

function loveGateway(radioName: string) {
	if (isLoved(radioName)) {
		unlove(radioName);
	} else {
		love(radioName);
	}
}

function radiosArray(): string[] {
	if (showSearch.value) {
		return searchResults.value;
	}

	if (filter.value === 'Preferred') {
		return lovedRadios.value;
	}

	return sortByPreferred.value;
}

function showThings(e: Event) {
	isSearching.value = e as unknown as boolean;
	showSearch.value = e as unknown as boolean;
}

/* MOUNTED */
onMounted(() => {
	/* load `lovedRadios` from localStorage */
	lovedRadios.value = get('lovedRadios') as string[];
	if (lovedRadios.value === null) {
		set('lovedRadios', []);
		lovedRadios.value = get('lovedRadios') as string[];
	}
});

/* COMPUTED */
const sortByPreferred = computed<string[]>(() => {
	return Object.keys(radios).sort((a, b) => {
		if (lovedRadios.value!.includes(a)) {
			return -1;
		}
		if (lovedRadios.value!.includes(b)) {
			return 1;
		}

		return 0;
	});
});
</script>

<template>
	<div
		class="bg-white border border-gray-200 rounded-3xl drop-shadow-sm overflow-hidden flex flex-1 flex-col"
	>
		<div
			class="flex flex-col p-3 border-b border-gray-200 first:rounded-t-lg last:border-0 last:rounded-b-lg"
		>
			<div class="flex">
				<div class="flex font-bold text-3xl grow flex-row">Radios</div>
				<StartSearchButton
					@click="showSearch = !showSearch"
				></StartSearchButton>
				<Dropdown class="flex justify-end" @filter="filterRadios"></Dropdown>
			</div>
			<SearchComponent
				v-if="showSearch"
				v-model="searchResults"
				@searching="showThings"
			></SearchComponent>
		</div>

		<div ref="el" class="overflow-y-auto overflow-x-hidden relative">
			<BackToTop
				:class="[hidden ? 'hidden opacity-0' : 'opacity-100']"
				@click="y = 0"
			/>
			<SearchPlaceholder
				v-if="showSearch && searchResults.length <= 0"
			></SearchPlaceholder>

			<Radio
				v-for="index in radiosArray()"
				:key="index"
				:class="[
					route.params.radioName === index
						? 'bg-gray-200'
						: 'hover:bg-gray-100',
				]"
				class="cursor-pointer"
				:is-loved="isLoved(index)"
				:name="index"
				@loved-radio="loveGateway(index)"
				@listen-radio="
					router.push({
						name: 'index-play',
						query: {
							radioName: index,
							streamUrl: radios[index as keyof typeof radios].streamUrl,
							type: radios[index as keyof typeof radios].type,
						},
					})
				"
			></Radio>
			<CreditsComponent v-if="!showSearch"></CreditsComponent>
		</div>
	</div>
</template>

<style></style>
