import type { AWS } from '@serverless/typescript';

import places from '@functions/places';
import dishes from '@functions/dishes';

const serverlessConfiguration: AWS = {
  service: 'food-ratings',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ],
        Resource: {
          "Fn::GetAtt": [
            "foodRatingsTable",
            "Arn"
          ]
        }
      }
    ]
  },
  // import the function via paths
  functions: { ...places, ...dishes },
  resources: {
    Resources: {
      apiGatewayAuthorizer: {
        DependsOn: [
          "ApiGatewayRestApi"
        ],
        Type: "AWS::ApiGateway::Authorizer",
        Properties: {
          Name: "cognito-authorizer",
          IdentitySource: "method.request.header.Authorization",
          RestApiId: {
            "Ref": "ApiGatewayRestApi"
          },
          Type: "COGNITO_USER_POOLS",
          ProviderARNs: [
            {
              "Fn::GetAtt": [
                "cognitoUserPool",
                "Arn"
              ]
            }
          ]
        }
      },
      cognitoUserPool: {
        Type: "AWS::Cognito::UserPool",
        Properties: {
          MfaConfiguration: "OFF",
          UserPoolName: "food-ratings-user-pool",
          UsernameAttributes: [
            "email"
          ],
          Policies: {
            PasswordPolicy: {
              MinimumLength: 6,
              RequireLowercase: true,
              RequireNumbers: true,
              RequireSymbols: false,
              RequireUppercase: false
            }
          }
        }
      },
      cognitoUserPoolClient: {
        Type: "AWS::Cognito::UserPoolClient",
        Properties: {
          ClientName: "food-ratings-user-pool-client",
          GenerateSecret: false,
          UserPoolId: {
            Ref: "cognitoUserPool"
          }
        }
      },
      foodRatingsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "foodRatings",
          AttributeDefinitions: [
            {
              AttributeName: "partitionKey",
              AttributeType: "S"
            },
            {
              AttributeName: "sortKey",
              AttributeType: "S"
            }],
          KeySchema: [
            {
              AttributeName: "partitionKey",
              KeyType: "HASH"
            },
            {
              AttributeName: "sortKey",
              KeyType: "RANGE"
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
