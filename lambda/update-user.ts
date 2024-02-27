import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const userId = event.pathParameters!.userId;
    const body = JSON.parse(event.body!);

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: process.env.TABLE_NAME!,
      Key: {
        userId: userId,
      },
      UpdateExpression: 'SET #attrName = :attrValue',
      ExpressionAttributeNames: {
        '#attrName': 'someAttribute', 
      },
      ExpressionAttributeValues: {
        ':attrValue': body.someAttribute, 
      },
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamoDB.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
