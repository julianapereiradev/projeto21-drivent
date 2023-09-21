import { Response } from "express";
import httpStatus from "http-status";
import ticketsService from "@/services/tickets-service";
import { AuthenticatedRequest } from "@/middlewares";

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
  const resultGetTicketsType  = await ticketsService.getTicketsType();
  res.status(httpStatus.OK).send(resultGetTicketsType);
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  
}

export async function postTickets(req: AuthenticatedRequest, res: Response) {
  
}