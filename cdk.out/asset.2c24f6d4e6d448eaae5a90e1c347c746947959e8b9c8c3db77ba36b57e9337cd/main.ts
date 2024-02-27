import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

interface User {
  userId: string;
  name: string;
  // Add other properties as needed
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const dynamoDb = new DynamoDB.DocumentClient();
  const tableName = process.env.USERS_TABLE_NAME;

  if (!tableName) {
    throw new Error('USERS_TABLE_NAME environment variable not set.');
  }

  switch (event.httpMethod) {
    case 'GET':
      if (event.pathParameters && event.pathParameters.userId) {
        const userId = event.pathParameters.userId;
        const params: DynamoDB.DocumentClient.GetItemInput = {
          TableName: tableName,
          Key: { userId },
        };

        try {
          const result = await dynamoDb.get(params).promise();
          return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
          };
        } catch (error) {
          console.error('Error retrieving user', error);
          return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve user' }),
          };
        }
      } else {
        const params: DynamoDB.DocumentClient.ScanInput = {
          TableName: tableName,
        };

        try {
          const result = await dynamoDb.scan(params).promise();
          return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
          };
        } catch (error) {
          console.error('Error retrieving users', error);
          return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve users' }),
          };
        }
      }

    case 'POST':
      if (event.body) {
        const user: User = JSON.parse(event.body);
        const params: DynamoDB.DocumentClient.PutItemInput = {
          TableName: tableName,
          Item: user,
        };

        try {
          await dynamoDb.put(params).promise();
          return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User created successfully' }),
          };
        } catch (error) {
          console.error('Error creating user', error);
          return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not create user' }),
          };
        }
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing request body' }),
        };
      }

    // Add cases for PUT, DELETE, and default

    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid HTTP method' }),
      };
  }
};
