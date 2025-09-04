import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    Signal,
    Output,
    EventEmitter,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.html',
    styleUrl: './timer.css',
    standalone: true,
    imports: [FormsModule,DecimalPipe],
})
export class Timer {
    @ViewChild('audio') audioRef!: ElementRef<HTMLMediaElement>;
    @ViewChild('input') inputRef!: ElementRef;
    @ViewChild('display') displayRef!: ElementRef;
    @Output() remove = new EventEmitter();

    public Math = Math;
    base:string = "10m";
    target:number = 0;
    timeoutID :number = 0;
    timeTracker :number = 0;
    volume:string = "high";

    toggleRun(){
        if(this.timeoutID == 0) {
            this.timeTracker = performance.now();
            this.start();
        }else{
            clearInterval(this.timeoutID);
            this.timeoutID = 0;
        }
    }

    updateRunButtonValue(){
        if(this.timeoutID == 0) {
            return "start";
        } else {
            return "stop";
        }
    }

    set(){
        let value = this.inputRef.nativeElement.value;

        if(value.charAt(0) == "+" || value.charAt(0) == "-"){
            this.target += this.parseTime(value);
            return;
        }
        this.target = this.parseTime(value);

        clearInterval(this.timeoutID);
        this.timeTracker = performance.now();
        this.start();
    }

    start(){
        let now = performance.now();
        let timeDelta = now - this.timeTracker;
        this.timeTracker += 1000;

        this.target -= 1;
        if(this.target < 1 && this.target % 10 == 0){
            this.audioRef.nativeElement.play();
        }
        this.updateDisplayColor();
        this.timeoutID = setTimeout(() => {this.start()}, 1000-timeDelta);
    }

    reset(){
        clearInterval(this.timeoutID);
        this.timeoutID = 0;
        this.target = this.parseTime(this.base);
        this.updateDisplayColor();
    }

    updateDisplayColor(){
        if(this.target < 0) this.displayRef.nativeElement.classList.add('alert');
        else this.displayRef.nativeElement.classList.remove('alert');
    }

    changeVolume(event:any){
        let volume = event["target"].valueAsNumber;
        this.audioRef.nativeElement.volume = volume;
        if(volume == 0) this.volume = "low";
        else if(volume <= .5) this.volume = "med";
        else this.volume = "high";
    }

    parseTime(input:string){
        let suffix = input.charAt(input.length-1).toLowerCase();

        if(suffix == 'h'){
            return  parseInt(input) * 60 * 60; // 1h = 60*60 sec
        }else if(suffix == 'm'){
            return  parseInt(input) * 60; // 1m = 60 sec
        }else if(suffix == 's'){
            return  parseInt(input);
        }else{
            let num = parseInt(input);
            return (Math.trunc(num/10000)*60*60)+(Math.trunc(num/100)%100*60)+(num % 100);
        }
    }
}
