
class History {

    constructor() {
        this.list = [];
        this.ptr = 0;    
    }

    getList(){
        return this.list
    }

    add(id){
        this.list.unshift(id)
    }

    isOnTop(){
        return this.ptr == 0
    }

    isOnEnd(){
        return this.ptr == this.list.length-1
    }

    goBack(){
        this.ptr++
        return this.list[this.ptr]
    }

    goForward(){
        this.ptr--
        return this.list[this.ptr]
    }

    
}