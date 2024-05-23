const Task = require("../model/Task");

const taskController = {}

taskController.createTask = async (req, res)=>{
    try {
      const {task, isComplete} = req.body;
      const newTask = new Task({task, isComplete})
      await newTask.save();
      res.status(200).json({ status : 'ok', data : newTask });
    } catch(err){
      res.status(400).json({ status: 'fail', error : err });
    }
}

taskController.getTask = async (req, res)=>{
  try {
    const taskList = await Task.find({}).select('-__v');
    res.status(200).json({ status : 'ok', data : taskList });
  } catch(err){
    res.status(400).json({ status: 'fail', error : err });
  }
}

taskController.updateTask = async (req, res) => {
  try {
    // 요청한(request) uri의 파라미터 값으로 전달된 id 값과 일치하는 task를 찾는다. 
    const task = await Task.findById(req.params.id);
    if (!task) {
      throw new Error("App can not find the task");
    }
    // req.body 의 key 값을 배열로 반환하고
    const fields = Object.keys(req.body);
    // 반환된 key 값을 이용해서 해당하는 요청된 body의 value를 task에 넣어 저장
    fields.map((item)=>(task[item] = req.body[item]));
    await task.save();
    res.status(200).json({ status : 'ok', data : task });
  } catch(err){
    res.status(400).json({ status: 'fail', error : err });
  }
}

taskController.deleteTask = async (req, res) => {
  try {
    const deleteItem = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ status : 'ok', data : deleteItem });
  } catch(err){
    res.status(400).json({ status: 'fail', error : err });
  }
}

module.exports = taskController;