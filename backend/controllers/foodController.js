import foodModal from "../models/foodModal.js";
import fs from 'fs'

const addFood =async(req,res)=>{ 
    
    let image_filename=`${req.file.filename}`;
    console.log(image_filename);
    
    const food=new foodModal({ 
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        image:image_filename,
        category:req.body.category,
    })
    try{ 
        await food.save();
        res.json({success:true,message:"Food added successfully"})
    }
    catch(err){ 
        console.log(err);
        res.json({success:false,message:"Failed to add food"})
        
        }

}
//all food list
const listFood = async(req,res)=>{ 
    try{ 
        const foods=await foodModal.find({});
        res.json({success:true,data:foods})
    }
    catch(err){ 
        console.log(err);
        res.json({success:false,message:"Failed to fetch food",})
    }
    

} 

//remove food
const removeFood = async (req, res) => {
    try {
        const food = await foodModal.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                console.error('Error deleting image:', err);
            }
        });

        await foodModal.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food item removed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error removing food item" });
    }
};  
       
export {addFood,listFood,removeFood} 


