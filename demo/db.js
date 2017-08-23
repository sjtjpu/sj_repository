/**
 * Created by NSD_Sjtjpu on 2017/1/23.
 */
//连接数据库
var mongoose = require('mongoose');  //数据库操作
var db = mongoose.connect('mongodb://10.1.6.205/test');

db.connection.on('error',function(error){
    console.log("数据库连接失败：" + error);
});

db.connection.on("open",function(){
    console.log("--数据库连接成功！--");
});

//定义模式(Schema)
var NSD_Schema = new mongoose.Schema({
    name : {type : String ,default: "nsd_data"},
    //age : {type : Number,default : 0},
    //time : {type : Date, default: Date.now()},
    //email : {type : String, default: ''},
    data : {
        data0 : Number,
        data1 : Number,
        data2 : Number,
        data3 : Number,
        data4 : Number,
        data5 : Number,
        data6 : Number,
        data7 : Number,
        time : {type : Date, default: Date.now()}
    },
    device : {type : String, default: ""},
    msg : {type : String, default: ""}
},{
    versionKey : false
});
//访问模型
var NSD_Data_Schema = db.model("NSD_Data",NSD_Schema);
exports.NSD_Data = NSD_Data_Schema;

var user_Schema = new mongoose.Schema({
    name: String,
    password: String,
    time : Date
},{
    versionKey : false
});
var users = db.model("username",user_Schema);

//添加一次数据
// var usersadd = {"name":"admin","password":"admin","time":Date.now()};
// var usersadd_done = new users(usersadd);
// usersadd_done.save(function (error,result) {
//         if(error){
//             console.log('Error'+error);
//         }else{
//             console.log(result);
//             console.log("更新成功");
//         }
//     });

exports.users = users;

var DataUpdate = function(mbBuff){
   var conditions = {device:"ITS101"};
   var updateData = {$addToSet:{"data":{"data0":update_data[0],"data1":update_data[1],"data2":update_data[2],
                                "data3":update_data[3],"data4":update_data[4],"data5":update_data[5],"data6":update_data[6],
                                "data7":update_data[7],"time":Date.now()}}};
    NSD_Data.update(conditions,updateData,function (error,result) {
        if(error){
            console.log('Error'+error);
        }else{
            console.log(result);
            console.log("更新成功");
        }
    });
};
exports.DataUpdate = DataUpdate;


var DataSave = function (mbBuff) {
   var update_data = new Array();
   var temp;
   for (var i = 0; i < 8; i++) {  //两个8位组成16位的数并且转为有符号数
       temp = mbBuff[13 + i*2] * 256 + mbBuff[13 + i*2 + 1];
       if(temp > 32767){
         temp = temp - 65535;   //转化为负数
       }
       if(i<=5){
           temp = (temp / 100).toFixed(1);//保留一位小数,并且四舍五入
       }
       if(temp < 1000 && temp > -1000){
         update_data.push(temp);
       }
       else{
         update_data.push(32767);
       }
   };
   //只更新数组
   // var conditions = {device:"ITS101"};
   // var updateData = {$addToSet:{"data":{"data0":update_data[0],"data1":update_data[1],"data2":update_data[2],
   //                              "data3":update_data[3],"data4":update_data[4],"data5":update_data[5],"data6":update_data[6],
   //                              "data7":update_data[7],"time":Date.now()}}};

   //  NSD_Data.update(conditions,updateData,function (error,result) {
   //      if(error){
   //          console.log('Error'+error);
   //      }else{
   //          console.log(result);
   //          console.log("更新成功");
   //      }
   //  });

    var i = {"name":"nsd_data","data":{"data0":update_data[0],"data1":update_data[1],"data2":update_data[2],
        "data3":update_data[3],"data4":update_data[4],"data5":update_data[5],"data6":update_data[6],
        "data7":update_data[7],"time":Date.now()},"device":"ITS101","msg":"OK"};
    var NSD_Data_Save = new NSD_Data_Schema(i);
    NSD_Data_Save.save(function (error,result) {
        if(error){
            console.log('Error'+error);
        }else{
            console.log(result);
            console.log("更新成功");
        }
    });
};

//添加一次数据
// var update_data = new Array();
// save_data_once = [0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9];
// DataSave(save_data_once);

exports.DataSave = DataSave;




