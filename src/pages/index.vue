<script setup lang="ts">
import HeadingComponent from '../components/HeadingComponent.vue';
import RadiosList from '../components/RadiosList.vue';

interface ListeningData {
	radioName: string;
	streamUrl: string;
	type: string;
}

const currentlyListeningData = ref<ListeningData>({
	radioName: '',
	streamUrl: '',
	type: '',
});

function currentlyListening(e: {
	radioName: string;
	streamUrl: string;
	type: string;
}) {
	currentlyListeningData.value.radioName = e.radioName;
	currentlyListeningData.value.streamUrl = e.streamUrl;
	currentlyListeningData.value.type = e.type;
}
</script>

<template>
	<div
		class="container mx-auto max-w-xs h-full rounded-3xl flex flex-col flex-1 relative space-y-4 mt-4"
	>
		<HeadingComponent />
		<RadiosList @listen="currentlyListening" />
		<NuxtPage />
		<div class="h-[30px]"></div>
	</div>
</template>
