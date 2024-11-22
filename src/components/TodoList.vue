{
  <template>
    <Page>
      <ActionBar :title="list.name">
        <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack" />
        <ActionItem @tap="showNewTodoDialog" ios.position="right">
          <Label text="+" class="action-item" />
        </ActionItem>
      </ActionBar>

      <StackLayout>
        <ListView for="todo in list.todos" @itemTap="onTodoTap" separatorColor="#eee">
          <v-template>
            <GridLayout columns="auto, *, auto, auto" class="todo-item" :class="getPriorityClass(todo)" padding="15">
              <Label col="0" :text="todo.completed ? '✓' : '○'" class="checkbox" @tap="toggleTodo(todo)" />
              <Label col="1" :text="todo.text" :class="{ completed: todo.completed }" class="todo-text" textWrap="true" />
              <Label col="2" :text="getPriorityIcon(todo)" class="priority" @tap="updatePriority(todo)" />
              <Label col="3" text="×" class="delete" @tap="deleteTodo(todo)" />
            </GridLayout>
          </v-template>
        </ListView>
      </StackLayout>
    </Page>
  </template>

  <script>
  import { prompt } from '@nativescript/core/ui/dialogs';

  export default {
    props: ['list'],
    methods: {
      showNewTodoDialog() {
        prompt({
          title: 'New Task',
          message: 'Enter task:',
          okButtonText: 'Add',
          cancelButtonText: 'Cancel',
          defaultText: ''
        }).then(result => {
          if (result.result && result.text.trim()) {
            this.$root.$data.store.addTodo(this.list.id, result.text.trim());
          }
        });
      },
      toggleTodo(todo) {
        this.$root.$data.store.toggleTodo(this.list.id, todo.id);
      },
      updatePriority(todo) {
        this.$root.$data.store.updatePriority(this.list.id, todo.id);
      },
      deleteTodo(todo) {
        this.$root.$data.store.deleteTodo(this.list.id, todo.id);
      },
      getPriorityClass(todo) {
        return `priority-${todo.priority}`;
      },
      getPriorityIcon(todo) {
        const icons = {
          low: '!',
          medium: '!!',
          high: '!!!'
        };
        return icons[todo.priority];
      }
    }
  };
  </script>

  <style scoped>
  .todo-item {
    background-color: white;
  }
  .checkbox {
    font-size: 20;
    margin-right: 10;
    color: #666;
  }
  .todo-text {
    font-size: 16;
  }
  .completed {
    text-decoration: line-through;
    color: #999;
  }
  .priority {
    font-size: 16;
    margin-right: 10;
  }
  .delete {
    font-size: 20;
    color: #ff4444;
  }
  .priority-low {
    border-left-width: 4;
    border-left-color: #999;
  }
  .priority-medium {
    border-left-width: 4;
    border-left-color: #ffa500;
  }
  .priority-high {
    border-left-width: 4;
    border-left-color: #ff4444;
  }
  </style>
}