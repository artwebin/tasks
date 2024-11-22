{
  <template>
    <Page>
      <ActionBar title="Todo Lists">
        <ActionItem @tap="showNewListDialog" ios.position="right">
          <Label text="+" class="action-item" />
        </ActionItem>
      </ActionBar>

      <StackLayout>
        <ListView for="list in $root.$data.store.lists" @itemTap="onListTap" separatorColor="#ccc">
          <v-template>
            <GridLayout columns="*, auto" class="list-item" padding="15">
              <Label :text="list.name" col="0" />
              <Label text="›" col="1" class="chevron" />
            </GridLayout>
          </v-template>
        </ListView>
      </StackLayout>
    </Page>
  </template>

  <script>
  import TodoList from './TodoList';
  import { prompt } from '@nativescript/core/ui/dialogs';

  export default {
    methods: {
      showNewListDialog() {
        prompt({
          title: 'New List',
          message: 'Enter list name:',
          okButtonText: 'Create',
          cancelButtonText: 'Cancel',
          defaultText: ''
        }).then(result => {
          if (result.result && result.text.trim()) {
            this.$root.$data.store.addList(result.text.trim());
          }
        });
      },
      onListTap(event) {
        this.$navigateTo(TodoList, {
          props: {
            list: this.$root.$data.store.lists[event.index]
          }
        });
      }
    }
  };
  </script>

  <style scoped>
  .action-item {
    font-size: 24;
    font-weight: bold;
    margin-right: 10;
  }
  .list-item {
    background-color: white;
  }
  .chevron {
    font-size: 20;
    color: #666;
  }
  </style>
}