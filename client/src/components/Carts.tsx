import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  loadingTodos: boolean
  newItem: string
  description: string
  price: number
  quantity: number
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    loadingTodos: true,
    newItem: '',
    description: '',
    price: 1,
    quantity: 1
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newItem: event.target.value })
  }

  handleDesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: event.target.value })
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ price: +event.target.value })
  }

  handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ quantity: +event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async () => {
    try {
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        name: this.state.newItem,
        description: this.state.description,
        price: this.state.price,
        quantity: this.state.quantity
      })
      console.log(newTodo)
      this.setState({
        todos: [...this.state.todos, newTodo],
        newItem: ''
      })
    } catch {
      alert('Todo creation failed')
    }
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter((todo) => todo.cartId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Cart:</Header>

        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            fluid
            placeholder="Item name"
            onChange={this.handleNameChange}
          />
          <Input
            fluid
            placeholder="Description"
            onChange={this.handleDesChange}
          />
          <Input fluid placeholder="Price" onChange={this.handlePriceChange} />
          <Input
            fluid
            placeholder="Quantity"
            onChange={this.handleQuantityChange}
          />
        </Grid.Column>
        <Button
          content="Add to cart"
          onClick={(e) => this.onTodoCreate()}
          primary
        />
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Carts
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.todos.map((todo, pos) => {
          return (
            <Grid.Row key={todo.cartId}>
              <Grid.Column width={10} verticalAlign="middle">
                <b>Item name:</b> {todo.name} <br />
                <b>Description:</b> {todo.description} <br />
                <b>Price:</b> {todo.price} <br />
                <b>Quantity:</b> {todo.quantity} <br />
              </Grid.Column>
              <Grid.Column width={3}>
                {todo.attachmentUrl && (
                  <Image src={todo.attachmentUrl} size="small" wrapped />
                )}
              </Grid.Column>

              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.cartId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.cartId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>

              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
