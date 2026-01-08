const axios = require('axios');

async function testDelete() {
  try {
    // First, login to get a token
    console.log('Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'test',
      password: 'test123'
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Logged in successfully');

    // Get all todos
    console.log('\nFetching todos...');
    const todosResponse = await axios.get('http://localhost:5000/api/todos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const todos = todosResponse.data.data.todos;
    console.log(`Found ${todos.length} todos`);

    if (todos.length > 0) {
      const todoToDelete = todos[0];
      console.log(`\nAttempting to delete todo: ${todoToDelete.id} - "${todoToDelete.title}"`);

      const deleteResponse = await axios.delete(`http://localhost:5000/api/todos/${todoToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('✅ Delete response:', deleteResponse.data);

      // Verify it's deleted
      const afterResponse = await axios.get('http://localhost:5000/api/todos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(`\n✅ After delete: ${afterResponse.data.data.todos.length} todos remaining`);
    } else {
      console.log('No todos to delete');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testDelete();
