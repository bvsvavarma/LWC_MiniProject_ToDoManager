import { LightningElement } from 'lwc';

export default class ToDoManagerLwc extends LightningElement {
    taskName;
    taskDate= null;
    incompleteTask = [];
    completeTask = [];

    changeHandler(event){
        let {name, value} = event.target;
        if(name === "taskName"){
            this.taskName = value;
        }else if(name === "taskDate"){
            this.taskDate = value;
        }
    }
    resetHandler(event){
        this.taskName = "";
        this.taskDate = "";
    }

    addTaskHandler(event){
        //if End Date is missing, then populate todays date as end date
        if(!this.taskDate){
            this.taskDate = new Date().toISOString().slice(0,10);
        }

        //check if task is present or not, if not present add the object to the array using spread operator
        if(this.validateTask()){
            this.incompleteTask = [...this.incompleteTask, {
                taskName : this.taskName,
                taskDate : this.taskDate,
            }];
            
            //once task is created we are setting values to blank
            this.resetHandler();

            //sort the Array
            let sortedArray = this.sortTask(this.incompleteTask);
            this.incompleteTask = [...sortedArray];

            console.log("incompleteTask",this.incompleteTask);
        }
    }
    validateTask(){
        let isValid = true;
        let element = this.querySelector('.taskname');

        //condition 1 : If Task is empty or not
        if(!this.taskName){
            isValid = true;
        }else{//condition 2 : If Task name is not empty then check for duplicate
            //find method always returns first element that is found otherwise it will return undefined
            let taskItem = this.incompleteTask.find((currItem) => {
                currItem.taskName === this.taskName 
                && currItem.taskDate === this.taskDate
            });   
        }
        return isValid;
    }

    sortTask(inputArray){
        let sortedArray = inputArray.sort((a, b) => {
            const dateA = new Date(a.taskDate);
            const dateB = new Date(b.taskDate);
            return dateA - dateB;
        });

        return sortedArray;
    }

    removalHandler(event){
        //from incomplete task array remove the item
        //to get the selected index from item 
        let index = event.target.name;
        this.incompleteTask.splice(index,1);
        //once item removed sort the array
        let sortedArray = this.sortTask(this.incompleteTask);
        this.incompleteTask = [...sortedArray];
        console.log("Removal Handler incomplete Task", this.incompleteTask);
    }
    completeTaskHandler(event){
        //Add task in completed array and remove task from in comeplete array
        
        //remove the entry from incomplete item
        let index = event.target.name;
        this.refreshData();
    }
    dragStartHandler(event){
        event.dataTransfer.setData("index", event.target.dataset.item);
        //dragged item should be dropped on completed task
    }

    //to stop default bahaviour
    allowDrop(event){
        event.preventDefault();
    }
    dropElementHandler(event){
        let index = event.dataTransfer.getData("index");
        this.refreshData(index);
    }
    refreshData(index){
        let removedItem  = this.incompleteTask.splice(index,1);
         //once item removed sort the array
         let sortedArray = this.sortTask(this.incompleteTask);
         this.incompleteTask = [...sortedArray];
         //Add the removed item to completed array
         this.completeTask = [...this.completeTask, ...removedItem];
        console.log("Complete Handler incomplete Task", this.incompleteTask);
    }

}