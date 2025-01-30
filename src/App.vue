<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useChatSearch } from './composables/use-chat-search'

import ChatHeader from './components/ChatHeader.vue'
import ChatItems from './components/ChatItems.vue'
import ChatMessageSearch from './components/ChatMessageSearch.vue'

const wrapperClass = computed(() => 'bg-zinc-500 w-screen h-screen p-5')
const chatWrapperClass = computed(
  () =>
    'bg-white border border-gray-300 rounded-md p-3 max-w-[1200px] m-auto h-full !font-sans flex flex-col gap-y-2 overflow-y-auto',
)

const localLoad = ref(true)

onMounted(async () => {
  await useChatSearch().fetchItems()
  localLoad.value = false
})
</script>

<template>
  <div v-if="!localLoad" :class="wrapperClass">
    <div :class="chatWrapperClass">
      <ChatHeader class="flex-shrink-0" />
      <ChatItems />
    </div>
    <ChatMessageSearch />
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>
