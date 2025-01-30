<script setup lang="ts">
import { computed } from 'vue'
import { useChatSearch } from '@/composables/use-chat-search'

const { item, isHighlighted } = defineProps(['item', 'isHighlighted'])

const { getSearchValue, getChatSearchShown } = useChatSearch()

const highlightedText = computed(() => {
  const text = item.text
  const search = getSearchValue.value

  if (!search || search.trim() === '') {
    return [{ text, isMatch: false }]
  }

  const regex = new RegExp(`(${search})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part) => ({
    text: part,
    isMatch: part.toLowerCase() === search.toLowerCase(),
  }))
})

const messageTextClass = computed(
  () =>
    'BaseMessage-content text-sm font-normal whitespace-break-spaces text-text break-words !break-all',
)
</script>

<template>
  <div class="flex gap-x-2" :class="{ 'flex-row-reverse': !item.incoming }">
    <div
      class="w-9 h-9 rounded-full flex items-center justify-center text-lg text-white flex-shrink-0"
      :class="{
        'bg-green-600': item.incoming,
        'bg-blue-600': !item.incoming,
      }"
      v-text="item.initials"
    />
    <div
      :class="[
        {
          'rounded-e-xl rounded-es-xl bg-neutral-300': item.incoming,
          'rounded-s-xl rounded-ee-xl bg-indigo-100': !item.incoming,
        },
      ]"
      class="!shadow-none relative flex flex-col leading-1.5 p-4 border-gray-200 space-y-1 shadow-sm shadow-gray-300"
    >
      <div
        class="flex items-center justify-between -mt-3"
        :class="{ 'flex-row-reverse': !item.incoming }"
      >
        <span
          :class="{ 'pr-4': item.incoming, 'pl-4': !item.incoming }"
          class="text-sm font-bold text-text"
          v-text="item.from"
        />
      </div>
      <p v-if="!isHighlighted || !getChatSearchShown" :class="messageTextClass" v-text="item.text" />
      <div v-else :class="messageTextClass">
        <span
          v-for="(part, index) in highlightedText"
          :key="index"
          :class="{ 'bg-yellow-200': part.isMatch }"
        >
          {{ part.text }}
        </span>
      </div>

      <div
        :class="{ 'justify-end': item.incoming }"
        class="flex items-center space-x-1 !-mb-3 pt-2"
      >
        <span
          class="text-xs font-normal text-gray-500"
          :class="{ 'text-end': item.incoming }"
          v-text="item.created"
        />
      </div>
    </div>
  </div>
</template>
