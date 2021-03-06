const Appointment = require("./level2");

class Calendar{
    constructor(calendarId){
        this.calendarId = calendarId; 
        this.maxAppointmentId = 10;//the maximum number of the appointments a calender can have
        this.appointmentIdArr = [];
        this.appointmentArr = [];

        //insert into the array of appointmentId
        for(var j=0;j<this.maxAppointmentId;j++){
            this.appointmentIdArr.push(j);
        }
    }
    getAppointmentById(id){
        for(var i=0;i<this.appointmentArr.length;i++){
            if(this.appointmentArr[i].id==id){
                return this.appointmentArr[i];
            }
        }
        console.log("The id doesn't exist");
        return null;
    }
    saveAppointment(appointment){
        let idThisAppointment = this.appointmentIdArr.shift();
        appointment.setId(idThisAppointment);
        this.appointmentArr.push(appointment);
        return appointment;
    }
    deleteAppointmentById(id){
        //this.getAppointmentById(id) = null;
        this.appointmentArr.splice(id,1);
        let i=0;
        /*make sure the array after modification is in the correct order */
        if(id<this.appointmentIdArr[i]){
            this.appointmentIdArr.unshift(id);//the smallest, so put it in the first
        }else if(id>this.appointmentIdArr[this.appointmentIdArr.length-1]){
            this.appointmentIdArr.push(id);//the biggest, so put it in the end
        }else{//not the biggest/smallest, find the value before and after 
            while(i<this.appointmentIdArr.length-1){
                if(this.appointmentIdArr[i]<id && id<this.appointmentIdArr[i+1]){
                    this.appointmentIdArr.splice(i,0,id);
                    break;
                }
                i++;
            }
        }       
        /*not efficient
        this.appointmentIdArr.push(id);
        this.appointmentIdArr.sort();//make sure that all the ids are in order for saveAppointment(appointment)  
        */
    }
    getAppointmentsBetweenDates(startDate, endDate){
        let appointmentsBetweenDatesArr = [];
        for(var i=0;i<this.appointmentArr.length;i++){
            if(startDate<=this.appointmentArr[i].start && this.appointmentArr[i].start<=endDate){
                appointmentsBetweenDatesArr.push(this.appointmentArr[i]);
            }
        }
        return appointmentsBetweenDatesArr;
    }
    slotsBetweenDates(start, end, duration){
        let beforeTime = new Date(start);
        let afterTime = new Date(start);
        let returnArr = [];
        while(parseInt(end-afterTime)/1000/60>= duration){//make sure the time is not out of range
            afterTime.setMinutes(beforeTime.getMinutes()+duration);
            let tempBefore = beforeTime.toString();//convert date to string
            let tempAfter = afterTime.toString();
            returnArr.push({tempBefore,tempAfter});
            beforeTime.setMinutes(beforeTime.getMinutes()+duration);
        }
        return returnArr;
    }
    availableSlotsBetweenDates(start, end, duration){
        let beforeTime = new Date(start);
        let afterTime = new Date(start);
        let appointmentArr = [];
        let returnArr = [];
        while(parseInt(end-afterTime)/1000/60>= duration){//make sure the time is not out of range
            afterTime.setMinutes(beforeTime.getMinutes()+duration);

            appointmentArr = this.getAppointmentsBetweenDates(beforeTime,afterTime);
            if(appointmentArr.length==0){
                let tempBefore = beforeTime.toString();//convert date to string
                let tempAfter = afterTime.toString();
                returnArr.push({tempBefore,tempAfter});
            }else{
                for(var i=0;i<appointmentArr.length;i++){
                    if(appointmentArr[i].isAvailable()){
                        let tempBefore = beforeTime.toString();//convert date to string
                        let tempAfter = afterTime.toString();
                        returnArr.push({tempBefore,tempAfter});
                        break;//if one appointment is available, this slot is available  
                    }
                }
            }
            beforeTime.setMinutes(beforeTime.getMinutes()+duration);
        }
        if(returnArr.length==0){
            console.log("There is no slot available");
            return null;
        }else{
            return returnArr;
        }
    }
}

module.exports = Calendar;




