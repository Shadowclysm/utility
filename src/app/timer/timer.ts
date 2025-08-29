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
    @Output() remove = new EventEmitter();
    //protected readonly title = signal('utility-page');
    public Math = Math;

    title:String = "";
    base:string = "10m";
    target:number = 0;
    intervalID:number = 0;


    toggleRun(){
        if(this.intervalID == 0) {
            this.intervalID = setInterval( () => {
                this.target -= 1;
                if(this.target < 1 && this.target % 10 == 0){
                    this.audioRef.nativeElement.play();
                }
            }, 1000);
        }else{
            clearInterval(this.intervalID);
            this.intervalID = 0;
        }
    }

    updateRunButtonValue(){
        if(this.intervalID == 0) {
            return "start";
        } else {
            return "stop";
        }
    }

    set(event:any){
        this.target = this.parseTime(event["target"].value);
        clearInterval(this.intervalID);
        this.intervalID = setInterval( () => {
            this.target -= 1
            if(this.target < 1 && this.target % 10 == 0){
                this.audioRef.nativeElement.play();
            }
        }, 1000);
    }

    reset(){
        clearInterval(this.intervalID);
        this.intervalID = 0;
        this.target = this.parseTime(this.base);
    }

    changeTarget(event:any){
        this.target += this.parseTime(event["target"].value);
    }


    changeVolume(event:any){
        this.audioRef.nativeElement.volume = event["target"].valueAsNumber;
    }


    parseTime(input:string){

        let suffix = input.charAt(input.length-1).toLowerCase();

        if(suffix == 'h'){
            input = input.substring(0,input.length-1);
            return  parseInt(input) * 60 * 60; // 1h = 60*60 sec
        }else if(suffix == 'm'){
            input = input.substring(0,input.length-1);
            return  parseInt(input) * 60; // 1m = 60 sec
        }else if(suffix == 's'){
            input = input.substring(0,input.length-1);
            return  parseInt(input);
        }else{
            let num = parseInt(input);
            return (Math.trunc(num/10000)*60*60)+(Math.trunc(num/100)%100*60)+(num % 100);
        }
    }
}
