<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Hls from 'hls.js';
import PlayerControls from './PlayerControls.vue';
import Spinner from './icons/SpinnerIcon.vue';
import Circle from './icons/CircleIcon.vue';

const router = useRouter();
const route = useRoute();
const media = ref<HTMLMediaElement | null>(null);

let hls: Hls | null = null;
const isPlaying = ref(false);
const isBuffering = ref(false);

const radioName = ref(''); // route.query.radioName as string;
const streamUrl = ref(''); // route.query.streamUrl as string;
const type = ref(''); // route.query.type as string;

/* check if Hls is supported natively by browser */
function isHlsSupportedNatively() {
	return Boolean(
		media.value!.canPlayType('application/vnd.apple.mpegURL') ||
		media.value!.canPlayType('audio/mpegurl'),
	);
}

function changePlayback() {
	if (media.value!.paused) {
		playMedia();
	} else {
		pauseMedia();
	}
}

function playMedia() {
	media.value!.play();
}

function pauseMedia() {
	media.value!.pause();
}

function stopMedia() {
	hls?.destroy();
	hls = null;
	media.value!.src = '';
}

function readyToBePlayed() {
	playMedia();
	isBuffering.value = false;
}

function loadMedia() {
	/* start buffering indicator */
	isBuffering.value = true;
	isPlaying.value = false;

	/* stop previously playing media */
	stopMedia();

	/* is m3u8 and browser does not support HLS natively */
	if (!isHlsSupportedNatively() && type.value === 'm3u8') {
		/* does browser support Hls.js library? */
		if (Hls.isSupported()) {
			hls = new Hls();

			hls.loadSource(streamUrl.value);
			hls.attachMedia(media.value!);

			hls.on(Hls.Events.MANIFEST_PARSED, () => {
				setMediaSession();
			});
		} else {
			/* no player able to play the selected audio stream */
			throw new Error('No player avaible.');
		}
	} else {
		/* is m3u8 and browser supports HLS || is other media */
		media.value!.src = streamUrl.value;
		media.value!.addEventListener('loadedmetadata', () => {
			setMediaSession();
		});
	}
}

function setMediaSession() {
	if ('mediaSession' in navigator) {
		navigator.mediaSession.metadata = new MediaMetadata({
			title: radioName.value,
			artist: 'easyRadio',
			album: '',
		});

		navigator.mediaSession.setActionHandler('play', function () {
			playMedia();
		});
		navigator.mediaSession.setActionHandler('pause', function () {
			pauseMedia();
		});
		navigator.mediaSession.setActionHandler('stop', function () {
			stopMedia();
			router.push({ name: 'home' });
		});
	}
}

onMounted(() => {
	radioName.value = route.query.radioName as string;
	streamUrl.value = route.query.streamUrl as string;
	type.value = route.query.type as string;

	loadMedia();
});

watch(route, (current) => {
	radioName.value = current.query.radioName as string;
	streamUrl.value = current.query.streamUrl as string;
	type.value = current.query.type as string;

	loadMedia();
});
</script>

<template>
	<div class="bg-white border border-gray-200 rounded-3xl drop-shadow-sm p-4">
		<div class="flex space-x-3 justify-center align-middle self-center">
			<div class="flex flex-col grow content-start overflow-hidden">
				<div class="font-semibold text-xl text-left truncate" :alt="radioName">
					{{ radioName }}
				</div>
				<div class="flex">
					<div v-if="!isBuffering" class="flex justify-center pt-1 pl-1">
						<Circle class="w-2 animate-ping"></Circle>
						<div class="flex ml-2 font-bold uppercase">Live</div>
					</div>
					<div v-else class="flex justify-center pt-1">
						<Spinner class="w-5 animate-spin"></Spinner>
						<div class="flex ml-2 font-bold uppercase">Buffering</div>
					</div>
				</div>
			</div>
			<div class="flex justify-end flex-row">
				<PlayerControls
					:playing="isPlaying"
					@click="changePlayback()"
				></PlayerControls>
			</div>
		</div>
	</div>
	<video
		ref="media"
		class="hidden"
		playsinline
		autoplay
		@canplay="readyToBePlayed()"
		@playing="isPlaying = true"
		@pause="isPlaying = false"
	></video>
</template>

<style></style>
