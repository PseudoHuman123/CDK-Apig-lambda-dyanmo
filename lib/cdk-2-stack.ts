// Import necessary CDK modules
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class Cdk2Stack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const userTable = new dynamodb.Table(this, 'UserTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    });


    const getUsersLambda = new lambda.Function(this, 'GetUsersLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'get-users.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: userTable.tableName,
      },
    });

    userTable.grantReadData(getUsersLambda);

    const getUserLambda = new lambda.Function(this, 'GetUserLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'get-user.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: userTable.tableName,
      },
    });

    userTable.grantReadData(getUserLambda);

    const createUserLambda = new lambda.Function(this, 'CreateUserLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'create-user.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: userTable.tableName,
      },
    });

    userTable.grantReadWriteData(createUserLambda);

    const updateUserLambda = new lambda.Function(this, 'UpdateUserLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'update-user.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: userTable.tableName,
      },
    });

    userTable.grantReadWriteData(updateUserLambda);

    const deleteUserLambda = new lambda.Function(this, 'DeleteUserLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'delete-user.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: userTable.tableName,
      },
    });

    userTable.grantReadWriteData(deleteUserLambda);

    const api = new apigateway.RestApi(this, 'MyApi');

    const usersResource = api.root.addResource('users');
    usersResource.addMethod('GET', new apigateway.LambdaIntegration(getUsersLambda));
    usersResource.addMethod('POST', new apigateway.LambdaIntegration(createUserLambda));

    const userResource = usersResource.addResource('{userId}');
    userResource.addMethod('GET', new apigateway.LambdaIntegration(getUserLambda));
    userResource.addMethod('PUT', new apigateway.LambdaIntegration(updateUserLambda));
    userResource.addMethod('DELETE', new apigateway.LambdaIntegration(deleteUserLambda));
  }
}

const app = new cdk.App();
new Cdk2Stack(app, 'Cdk2Stack');

app.synth();
