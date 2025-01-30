<script setup lant="ts">
import { computed, watch, ref } from 'vue'
import { useChatSearch } from '../composables/use-chat-search'

const chatSearch = useChatSearch()
const isShown = computed(() => chatSearch.getChatSearchShown.value)

const searchInputRef = ref(null)

const search = ref('')

watch(search, (val) => {
  chatSearch.setSearchValue(val)
  chatSearch.refreshHighlightedMessages()
})

const handleNext = () => chatSearch.goToNextResult()
const handlePrev = () => chatSearch.goToPreviousResult()
const handleClose = () => chatSearch.setChatSearchShown(false)
</script>

<template>
  <div v-if="isShown" class="search-bar">
    <div class="flex items-center gap-x-2">
      <input
        ref="searchInputRef"
        v-model="search"
        @keyup.enter.exact="handleNext"
        @keyup.shift.enter="handlePrev"
      />
      <button @click.prevent="handleNext">▼</button>
      <button @click.prevent="handlePrev">▲</button>
    </div>
    <div class="flex flex-row gap-x-2 items-center">
      <p>
        Showing result
        <span>{{ chatSearch.getCurrentHighlightedMessageIdIndex.value }}</span> of
        <span>{{ chatSearch.getMatchCount }}</span>
      </p>
      <button @click="handleClose">X</button>
    </div>
  </div>
</template>

<style>
.search-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1200px;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  border-radius: 10px 10px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

input {
  border: none;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  width: 100%;
  min-width: 400px;
  background-color: #fff;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  transition: background-color 0.2s;
}
button {
  background-color: #fff;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  transition: background-color 0.2s;
  cursor: pointer;
}
</style>
