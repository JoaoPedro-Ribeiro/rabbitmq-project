import { Request, Response } from "express";
import CertifyDocumentModel from "../models/CertifyDocumentModel";

class StatusController{
  async pendings(req: Request, res: Response){
    const data = await CertifyDocumentModel.getPendings();
    res.json({quantity: data.length, data})
  }
}

export default new StatusController();