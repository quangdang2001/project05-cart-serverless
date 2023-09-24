import { ToDoAccess } from './cartsAcess'
import { CartItem } from '../models/CartItem'
import { CreateTodoRequest } from '../requests/CreateCartRequest'
import { UpdateTodoRequest } from '../requests/UpdateCartRequest'
import { parseUserId } from '../auth/utils';
import { TodoUpdate } from '../models/CartUpdate';

// TODO: Implement businessLogic

const uuidv4 = require('uuid/v4');
const toDoAccess = new ToDoAccess();

export async function getAllToDo(jwtToken: string): Promise<CartItem[]> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.getAllToDo(userId);
}

export function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<CartItem> {
    const userId = parseUserId(jwtToken);
    const cartId = uuidv4();
    const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;

    return toDoAccess.createToDo({
        userId: userId,
        cartId: cartId,
        attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${cartId}`,
        createdAt: new Date().getTime().toString(),
        ...createTodoRequest,
    });
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, cartId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.updateToDo(updateTodoRequest, cartId, userId);
}

export function deleteToDo(cartId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.deleteToDo(cartId, userId);
}

export function generateUploadUrl(cartId: string): Promise<string> {
    return toDoAccess.generateUploadUrl(cartId);
}