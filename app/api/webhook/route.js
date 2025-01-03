import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
     const payload = await req.text()
     const response = JSON.parse(payload)

     const sig = req.headers

}