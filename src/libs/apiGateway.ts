import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const httpAuthorization = {
  authorizer: {
    type: "COGNITO_USER_POOLS",
    authorizerId: {
      Ref: "apiGatewayAuthorizer"
    }
  }
}

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

export const formatCreateResponse = (id: string, resource: Record<string, unknown>) => {
  return {
    statusCode: 201,
    headers: { 
      Location: id
    },
    body: JSON.stringify(resource)
  }
}

export const formatErrorResponse = (error: Record<string, unknown>) => {
  return {
    statusCode: 500,
    body: JSON.stringify(error)
  }
}