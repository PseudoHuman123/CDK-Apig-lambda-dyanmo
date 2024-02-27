import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = event.pathParameters!.userId;

    const params: DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: process.env.TABLE_NAME!,
      Key: {
        userId: userId,
      },
      ReturnValues: 'ALL_OLD',
    };

    const result = await dynamoDB.delete(params).promise();

    if (!result.Attributes) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User deleted successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
