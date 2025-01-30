<script setup lang="ts">
import { watch, nextTick } from 'vue'
import ChatMessage from './ChatMessage.vue'
import { useChatSearch } from '@/composables/use-chat-search'

const { getItems, isHighlighted, getCurrentHighlightedMessageId } = useChatSearch()

watch(getCurrentHighlightedMessageId, async (messageId) => {
  await nextTick()
  const target = document.getElementById(messageId)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
})
</script>

<template>
  <ChatMessage
    v-for="message in getItems"
    :key="message.id"
    :id="message.id"
    :item="message"
    :is-highlighted="isHighlighted(message.id)"
  />
</template>
