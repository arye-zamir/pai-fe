import { TChatMessage } from '@/types'
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'

import messageItems from '@/assets/msgs.json' // this composable "handles" data fetching, not the Vue component

// region global state
const items = ref<TChatMessage[]>([])
const showChatSearch = ref(false)
const searchValue = ref<string | undefined>()
const currentHighlightedMessageId = ref<string>('')
const highlightedMessageIds = ref<string[]>([])
// endregion global state

export const useChatSearch = () => {
  // region event listener
  onMounted(() => {
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault()
        setChatSearchShown(true)
      }
    })
  })
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault()
        setChatSearchShown(true)
      }
    })
  })
  // endregion event listener

  // region search bar visibility
  const setChatSearchShown = (value: boolean) => {
    showChatSearch.value = value
    return showChatSearch.value
  }
  const getChatSearchShown = computed(() => showChatSearch.value)
  // endregion search bar value

  // region messages
  const setItems = (messages: TChatMessage[]) => {
    items.value = messages
    return true
  }

  const getItems = computed(() => items.value)

  // this fetch mock is here to make sure the DOM isn't trying to render messages before JSON file is loaded
  const fetchItems = async () => {
    setItems(messageItems as TChatMessage[])
    return Promise.resolve(messageItems)
  }
  // endregion messages

  // region search value
  const setSearchValue = (val: string | undefined) => {
    searchValue.value = val
  }

  const getSearchValue = computed(() => searchValue.value)
  // endregion search value

  // region highlighted messages
  const refreshHighlightedMessages = () => {
    const searchValue = getSearchValue.value
    const messages = getItems.value
    if (searchValue) {
      const filteredMessages = messages.filter((message) => {
        return message.text.toLowerCase().includes(searchValue.toLowerCase())
      })
      highlightedMessageIds.value = filteredMessages.map((message) => message.id)
      if (highlightedMessageIds.value.length > 0) {
        currentHighlightedMessageId.value = highlightedMessageIds.value[0]
      }
    } else {
      highlightedMessageIds.value = []
    }
  }

  const goToNextResult = () => {
    const index = highlightedMessageIds.value.indexOf(currentHighlightedMessageId.value)
    if (index < highlightedMessageIds.value.length - 1) {
      currentHighlightedMessageId.value = highlightedMessageIds.value[index + 1]
    } else {
      currentHighlightedMessageId.value = highlightedMessageIds.value[0]
    }
  }

  const goToPreviousResult = () => {
    const index = highlightedMessageIds.value.indexOf(currentHighlightedMessageId.value)
    if (index > 0) {
      currentHighlightedMessageId.value = highlightedMessageIds.value[index - 1]
    } else {
      currentHighlightedMessageId.value =
        highlightedMessageIds.value[highlightedMessageIds.value.length - 1]
    }
  }

  const getCurrentHighlightedMessageId = computed(() => currentHighlightedMessageId.value)

  const hasHighlightedMessages = computed(() => highlightedMessageIds.value.length > 0)
  const isHighlighted = (id: string) => currentHighlightedMessageId.value === id
  const getCurrentHighlightedMessageIdIndex = computed(() => {
    const index = highlightedMessageIds.value.indexOf(currentHighlightedMessageId.value)
    return index === -1 ? 0 : index + 1
  })
  const getMatchCount = computed(() => highlightedMessageIds.value.length)
  // endregion highlighted messages

  return {
    getChatSearchShown,
    setChatSearchShown,

    setItems,
    getItems,
    fetchItems,

    getSearchValue,
    setSearchValue,

    goToNextResult,
    goToPreviousResult,

    refreshHighlightedMessages,
    isHighlighted,
    hasHighlightedMessages,
    getCurrentHighlightedMessageId,
    getCurrentHighlightedMessageIdIndex,
    getMatchCount,
  }
}
