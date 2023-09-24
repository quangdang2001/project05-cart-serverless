import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Types } from 'aws-sdk/clients/s3';
import { CartItem } from '../models/CartItem'
import { TodoUpdate } from '../models/CartUpdate';
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

export class ToDoAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly cartTable = process.env.CARTS_TABLE,
        private readonly s3BucketName = process.env.ATTACHMENT_S3_BUCKET) {
    }

    async getAllToDo(userId: string): Promise<CartItem[]> {
        console.log("Getting all todo");

        const params = {
            TableName: this.cartTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        const result = await this.docClient.query(params).promise();
        console.log(result);
        const items = result.Items;

        return items as CartItem[];
    }

    async createToDo(cartItem: CartItem): Promise<CartItem> {
        console.log("Creating new todo");

        const params = {
            TableName: this.cartTable,
            Item: cartItem,
        };

        const result = await this.docClient.put(params).promise();
        console.log(result);

        return cartItem as CartItem;
    }

    async updateToDo(todoUpdate: TodoUpdate, cartId: string, userId: string): Promise<TodoUpdate> {
        console.log("Updating todo");

        const params = {
            TableName: this.cartTable,
            Key: {
                "userId": userId,
                "cartId": cartId
            },
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: {
                "#a": "quantity"
            },
            ExpressionAttributeValues: {
                ":a": todoUpdate['quantity']
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await this.docClient.update(params).promise();
        console.log(result);
        const attributes = result.Attributes;

        return attributes as TodoUpdate;
    }

    async deleteToDo(cartId: string, userId: string): Promise<string> {
        console.log("Deleting todo");

        const params = {
            TableName: this.cartTable,
            Key: {
                "userId": userId,
                "cartId": cartId
            },
        };

        const result = await this.docClient.delete(params).promise();
        console.log(result);

        return "" as string;
    }

    async generateUploadUrl(cartId: string): Promise<string> {
        console.log("Generating URL");

        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: cartId,
            Expires: 1000,
        });
        console.log(url);

        return url as string;
    }
}