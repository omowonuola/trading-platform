import { FastifyRequest, RouteGenericInterface } from 'fastify';
import { CreateDealInput } from '../modules/deals/deal.schema';
import { CreateItemInput } from '../modules/item/item.schema';




export interface DecodedToken {
    id: number;
    email: string;
}


export interface CreateDealBody extends RouteGenericInterface {
    Body: CreateDealInput;
}

export interface CreateItemBody extends RouteGenericInterface {
    Body: CreateItemInput;
}

export interface RequestWithUser extends RouteGenericInterface {
    User: { id: number };
}