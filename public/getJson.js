//API提供，Data Only

const path=require('path');
const pathToJson =path.resolve(__dirname,'../config/data.json');
const fs=require('fs');




function ControllergetAll(req, res) {
    var config=fs.readFile(pathToJson,'utf8',(err,data)=>{
        if (err) throw err;
        config = JSON.parse(data);
        return res.json(config);
    }); 
}

function ControllerRemoveAll(req, res){
    var config=fs.readFile(pathToJson,'utf8',(err,data)=>{
        if (err) throw err;
        console.log(req);
     
        let reJson = JSON.stringify(req.body, null, 2);
        
        fs.writeFile(pathToJson,reJson,(err)=>{if(err) throw err;});
        return res.json("Remove OK");
    }); 
}

function ControllerSave(req, res) {
    var config=fs.readFile(pathToJson,'utf8',(err,data)=>{ //data是從Json裡讀出來的內容
        if (err) throw err;
        console.log(req.body);
        let reJson = JSON.stringify(req.body, null, 2);
        fs.writeFile(pathToJson,reJson,(err)=>{
            if(err){throw err;} 
            else{return res.json("Save OK");}
        });   
    });  
}




exports.ControllergetAll = ControllergetAll;
exports.ControllerSave = ControllerSave;
exports.ControllerRemoveAll=ControllerRemoveAll;
