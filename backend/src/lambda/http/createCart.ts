import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateCartRequest'
import { createToDo } from '../../helpers/carts'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    console.log("Processing Event ", event);
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];

    const toDoItem = await createToDo(newTodo, jwtToken);
    return {
      statusCode: 201,
      body: JSON.stringify({
        "item": toDoItem
      }),
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
