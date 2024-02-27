import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: process.env.TABLE_NAME!,
    };

    const result = await dynamoDB.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
