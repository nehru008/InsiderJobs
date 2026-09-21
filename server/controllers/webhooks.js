import { Webhook } from "svix";
import User from "../models/User.js";


//Api controller to handle incoming webhooks from Clerk
export const clerkWebhook = async (req, res) => {
    try{
        //create svix webhook instance with your Clerk webhook secret
        const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        //verify and parse the incoming request
        await whook.verify(JSON.stringify(req.body),{

            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        });

        //Process the event from req.body
        const {data,type}=req.body;
        //Switch case to handle different event types
        switch(type){
            case "user.created":{
                const userData={
                    _id:data.id,
                    name:data.first_name+" "+data.last_name,
                    email:data.email_addresses[0].email_address,
                    image:data.image_url,
                    resume:""
                }
                await User.create(userData);
                res.json({});
                break;

            }
         
            case "user.updated":{
                const userData={
                    name:data.first_name+" "+data.last_name,
                    email:data.email_addresses[0].email_address,
                    image:data.image_url,
                }
                await User.findByIdAndUpdate(data.id,userData);
                res.json({});
                break;

            }
            
            case "user.deleted":{
                await User.findByIdAndDelete(data.id);
                res.json({});
                break;  
            }

            default:
                res.json({});
                break;
        }
            

    }catch(err){
       console.log("Error processing Clerk webhook:",err);
       res.json({success:false,message:"Error processing webhook"});
    }
};
