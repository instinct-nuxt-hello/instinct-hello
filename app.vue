<template>
  <div class="min-h-screen bg-slate-100">
    <header class="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
      <div class="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Instinct Tasks</h1>
        <p class="mt-1 text-sm text-indigo-100">A clean, fast task manager. Everything is saved automatically.</p>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-4 pb-16">
      <div class="-mt-6 rounded-2xl bg-white p-4 shadow-lg sm:p-6">
        <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="addTask">
          <input
            v-model="newTitle"
            type="text"
            maxlength="255"
            placeholder="What needs to get done?"
            class="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <div class="flex gap-3">
            <select
              v-model="newPriority"
              class="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              type="submit"
              :disabled="adding || !newTitle.trim()"
              class="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {{ adding ? 'Adding…' : 'Add task' }}
            </button>
          </div>
        </form>

        <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div class="flex gap-1 rounded-lg bg-slate-100 p-1 text-sm">
            <button
              v-for="f in filters"
              :key="f.value"
              class="rounded-md px-3 py-1.5 font-medium transition"
              :class="filter === f.value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
              @click="filter = f.value"
            >
              {{ f.label }}
            </button>
          </div>
          <p class="text-xs text-slate-500">
            {{ stats.active }} active · {{ stats.completed }} completed · {{ stats.total }} total
          </p>
        </div>

        <p v-if="error" class="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">{{ error }}</p>

        <div v-if="pending" class="py-14 text-center text-sm text-slate-400">Loading tasks…</div>

        <div v-else-if="visibleTasks.length === 0" class="py-14 text-center">
          <p class="text-4xl">✓</p>
          <p class="mt-2 text-sm font-medium text-slate-600">Nothing here</p>
          <p class="mt-1 text-xs text-slate-400">
            {{ filter === 'all' ? 'Add your first task above.' : 'No tasks match this filter.' }}
          </p>
        </div>

        <ul v-else class="mt-4 divide-y divide-slate-100">
          <li v-for="task in visibleTasks" :key="task.id" class="group flex items-start gap-3 py-3.5">
            <input
              type="checkbox"
              :checked="!!task.completed"
              class="mt-1 h-4.5 h-5 w-5 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              @change="toggleTask(task)"
            />
            <div class="min-w-0 flex-1">
              <template v-if="editingId === task.id">
                <input
                  v-model="editTitle"
                  type="text"
                  maxlength="255"
                  class="w-full rounded-lg border border-indigo-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                  @keyup.enter="saveEdit(task)"
                  @keyup.esc="cancelEdit"
                />
                <div class="mt-2 flex gap-2">
                  <button class="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500" @click="saveEdit(task)">Save</button>
                  <button class="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200" @click="cancelEdit">Cancel</button>
                </div>
              </template>
              <template v-else>
                <p
                  class="text-sm font-medium"
                  :class="task.completed ? 'text-slate-400 line-through' : 'text-slate-800'"
                >
                  {{ task.title }}
                </p>
                <p v-if="task.notes" class="mt-0.5 truncate text-xs text-slate-500">{{ task.notes }}</p>
                <div class="mt-1 flex items-center gap-2">
                  <span
                    class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                    :class="priorityClasses[task.priority] || priorityClasses.medium"
                  >
                    {{ task.priority }}
                  </span>
                  <span class="text-[11px] text-slate-400">{{ formatDate(task.created_at) }}</span>
                </div>
              </template>
            </div>
            <div v-if="editingId !== task.id" class="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
              <button
                class="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
                title="Edit"
                @click="startEdit(task)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                class="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                title="Delete"
                @click="deleteTask(task)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>

      <p class="mt-6 text-center text-xs text-slate-400">Built with Nuxt 3, Tailwind CSS and MySQL. Deployed automatically from GitHub.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
interface Task {
  id: string
  title: string
  notes: string | null
  completed: 0 | 1 | boolean
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' }
] as const

const priorityClasses: Record<string, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700'
}

const tasks = ref<Task[]>([])
const pending = ref(true)
const error = ref('')
const newTitle = ref('')
const newPriority = ref<'low' | 'medium' | 'high'>('medium')
const adding = ref(false)
const filter = ref<'all' | 'active' | 'completed'>('all')
const editingId = ref<string | null>(null)
const editTitle = ref('')

async function loadTasks() {
  try {
    error.value = ''
    tasks.value = await $fetch<Task[]>('/api/tasks')
  } catch (e: any) {
    error.value = 'Could not load tasks. Please try again.'
  } finally {
    pending.value = false
  }
}

const stats = computed(() => {
  const total = tasks.value.length
  const completed = tasks.value.filter((t) => !!t.completed).length
  return { total, completed, active: total - completed }
})

const visibleTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter((t) => !t.completed)
  if (filter.value === 'completed') return tasks.value.filter((t) => !!t.completed)
  return tasks.value
})

async function addTask() {
  const title = newTitle.value.trim()
  if (!title || adding.value) return
  adding.value = true
  try {
    error.value = ''
    const created = await $fetch<Task>('/api/tasks', {
      method: 'POST',
      body: { title, priority: newPriority.value }
    })
    tasks.value = [created, ...tasks.value]
    newTitle.value = ''
    newPriority.value = 'medium'
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Could not add the task. Please try again.'
  } finally {
    adding.value = false
  }
}

async function toggleTask(task: Task) {
  const next = !task.completed
  task.completed = next ? 1 : 0
  try {
    await $fetch(`/api/tasks/${task.id}`, { method: 'PATCH', body: { completed: next } })
  } catch (e) {
    task.completed = next ? 0 : 1
    error.value = 'Could not update the task. Please try again.'
  }
}

function startEdit(task: Task) {
  editingId.value = task.id
  editTitle.value = task.title
}

function cancelEdit() {
  editingId.value = null
  editTitle.value = ''
}

async function saveEdit(task: Task) {
  const title = editTitle.value.trim()
  if (!title) return
  try {
    const updated = await $fetch<Task>(`/api/tasks/${task.id}`, { method: 'PATCH', body: { title } })
    task.title = updated.title
    cancelEdit()
  } catch (e) {
    error.value = 'Could not save the edit. Please try again.'
  }
}

async function deleteTask(task: Task) {
  const previous = tasks.value
  tasks.value = tasks.value.filter((t) => t.id !== task.id)
  try {
    await $fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
  } catch (e) {
    tasks.value = previous
    error.value = 'Could not delete the task. Please try again.'
  }
}

function formatDate(value: string) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(loadTasks)
</script>
