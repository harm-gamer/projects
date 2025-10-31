import { Client } from "pg";
import express from "express"

const client = new Client(
    "postgresql://neondb_owner:npg_1iJVYxwd7uvL@ep-twilight-art-a47c7qb5-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
)

 await client.connect();

const app = express();
app.use(express.json());

app.post("/insert-user",async (req, res) => {
    const { name, email, password } = req.body;
    try{
const insertQuery = 'INSERT INTO users (name ,email,password) VALUES ($1, $2, $3)';

    const query1 =  await client.query(insertQuery,[name,email,password]);
    res.json({message : "User added successfully",user: query1.rows[0]});
    }catch(err){
        return res.status(404).json({message : err.message});
    }
      
})
app.post("/insert-address", async(req,res)=>{

    try{
        const insertquery = 'INSERT INTO addresses (city,country,pincode) VALUES ($1,$2,$3)';
        const query1 = await client.query(insertquery,[req.body.city,req.body.country,req.body.pincode]);
        res.json({message : "Address added successfully", address: query1.rows[0]});
    }catch(err){
        return res.status(400).json({message : err.message});
    }
})






app.listen(3000);