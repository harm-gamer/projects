function name(){
    return new Promise((resolve,reject) =>{
        console.log('Entering the function');
        fs.readFile('name.txt','utf-8',(err,data) =>{
            if(data){
                resolve(data);
            }else{
                reject(err);
            }
        })
        console.log('Exiting the function');
    })
}
// name().then((data)=>{
//     console.log(data);
    
// }).catch((err)=>{
//     console.log(err);
// })

async function name2(params) {
     try{
         console.log('Entering the function');
        const data = await fs.readFile('name.txt','utf-8',(err,data)=>{
            if(data){
                 console.log(data);
                console.log('File read successfully inside async function');
                
            }
            console.log(data);
        });
        console.log('Exiting the function');
     }catch(err){
       console.log(err);
     }
}
// name2();

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());

app.post('/register',async(req,res) =>{

    const {username,email,password,} = req.body;
    try{
        
        const exsistingUser = await User.findOne({email : email});
        if(exsistingUser){
            return res.status(400).json({message : 'User already exists'});

        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            username,
            email,
            password : hashedPassword
        })
        await newUser.save();
        res.status(200).json({message : newUser});

    }catch(err){
       res.status(500).json({message : 'Server error'});
    }
})

app.post('/login', async(req,res)=>{
    const {email,password} = req.body;
    try{
       const user = await User.findOne({email : email});
       if(!user){
        return res.status(400).json({message : 'Invalid credentials'});

       }
       const isMatch = await bcrypt.compare(password,user.password);

       const token = jwt.sign({userId : user._id},'supersecretkey',{expiresIn : '24h'});

       res.status(200).json({token : token});
       
    }catch(err){
        res.status(500).json({message : 'Server error at login route'})
    }
})