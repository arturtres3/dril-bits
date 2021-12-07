
class History {

    constructor() {
        this.list = [];   
    }

    getList(){
        return this.list
    }

    getLatest(){
        return this.list[0]
    }

    add(id){
        //console.log(`added ${id}`);
        this.list.unshift(id)
    }

    isOnTop(currentId){
        //console.log(`isOnTop ${currentId == this.list[0]} display:${currentId}, list[0]:${this.list[0]}`);
        return currentId == this.list[0]
    }

    isOnEnd(currentId){
        //console.log(`isOnEnd ${currentId == this.list[this.list.length -1]} display:${currentId}, list[last]:${this.list[this.list.length -1]}`);
        return currentId == this.list[this.list.length -1]
    }

    goBack(currentId){
        let index = this.list.findIndex(element => element === currentId)
        //console.log(`i: ${index}, length: ${this.list.length}`);
        return this.list[index + 1]
    }

    goForward(currentId){
        let index = this.list.findIndex(element => element === currentId)
        //console.log(`i: ${index}, length: ${this.list.length}`);
        return this.list[index - 1]
    }

    
}