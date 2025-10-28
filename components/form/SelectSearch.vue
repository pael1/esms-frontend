<template>
  <Multiselect
    v-model="selectedOption"
    :options="state.owner.names"
    :searchable="true"
    placeholder="Search name..."
    @search-change="onSearchChange"
    class="w-full"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'
import { debounce } from 'lodash-es'
import { stallOwnerService } from '~/api/StallOwnerService'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: Object,
  searchUrl: {
    type: String,
    required: true
  }
})

const selectedOption = ref(props.modelValue)
const state = reactive({
  owner: {
    names: []
  }
})
const isLoading = ref(false)

// when user selects an option, update v-model
watch(selectedOption, (val) => {
  emit('update:modelValue', val)
})

// debounce typing input to reduce API spam
const onSearchChange = debounce(async (query: string) => {
    console.log('Searching for:', query)
    if (!query || query.length < 2) {
        state.owner.names = []
        return
    }

    try {
        const response = await stallOwnerService.getOwnerName(query)
        if (response && response.data) {
            console.log('Owner search results:', response.data)
            state.owner.names = response.data.map((item: any) => ({
                value: item.ownerId,
                label: item.full_name
            }))
        }
    } catch (error) {
        console.error('Error fetching owner details:', error)
        // showError(error.message)
        // state.owner.details = null
        // state.form.ownerId = null
    }
}, 400)
</script>
