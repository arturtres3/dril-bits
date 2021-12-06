
class History {

    constructor() {
        this.list = [];   
    }

    getList(){
        return this.list
    }

    add(id){
        this.list.unshift(id)
    }

    isOnTop(currentId){
        //console.log(`display:${currentId}, list[0]:${this.list[0]}`);
        return currentId == this.list[0]
    }

    isOnEnd(currentId){
        //console.log(`display:${currentId}, list[last]:${this.list[this.list.length -1]}`);
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