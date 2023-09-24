import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { deleteToDo } from '../../helpers/carts'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const cartId = event.pathParameters.cartId
    // TODO: Remove a TODO item by id
    console.log("Processing Event ", event);
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];

    const deleteData = await deleteToDo(cartId, jwtToken);
    return {
      statusCode: 200,
      body: deleteData,
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
