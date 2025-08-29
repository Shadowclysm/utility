import {
    AfterViewInit,
    Component,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { Timer } from './timer/timer';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.css',
    standalone: true,
    imports: [Timer],
})
export class App implements AfterViewInit {
    @ViewChild('list',{read:ViewContainerRef}) list !: ViewContainerRef;

    ngAfterViewInit(){
        this.addTimer();
    }

    addTimer(){
        let ref = this.list.createComponent(Timer);
        let sub = ref.instance.remove.subscribe(() => ref.destroy());
        ref.onDestroy(() => sub.unsubscribe());
    }

}


/*
 *
 *
 *
 *
 *
 */
