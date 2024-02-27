import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

interface CreateUserBody {
  userId: string;
}

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const body: CreateUserBody = JSON.parse(event.body!);

    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.TABLE_NAME!,
      Item: {
        userId: body.userId,
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User created successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
