import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import {MatDialogModule} from "@angular/material/dialog";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatButtonModule} from "@angular/material/button";
import {MatIcon, MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    MatDialogModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class CalendarModule { }
