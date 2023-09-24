import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { generateUploadUrl } from '../../helpers/carts'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const cartId = event.pathParameters.cartId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    console.log("Processing Event ", event);
    console.log("Cart ID ", cartId);
    const URL = await generateUploadUrl(cartId);
    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        uploadUrl: URL,
      })
    };
  }
)

handler.use(
  cors({
    credentials: true
  })
)
