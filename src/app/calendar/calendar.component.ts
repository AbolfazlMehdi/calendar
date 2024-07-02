import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {EventCalendarComponent} from "./event-calendar/event-calendar.component";
import {DatePipe} from "@angular/common";
import {CalendarService} from "./services/calendar.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [DatePipe, CalendarService]
})
export class CalendarComponent {
  @ViewChild('cdkBoard', {static: false}) cdkBoard?: TemplateRef<{}>;
  public days: IDaysModel[] = [];
  public hours: number[] = Array.from({length: 24}, (_, i) => i + 1);
  public events: IEventModel[] = [
    {title: 'Event 1', day: 'Monday', date: 6, hour: 9, month: 'May', year: 2024},
    {title: 'Event 2', day: 'Monday', date: 27, hour: 1, month: 'May', year: 2024},
  ];
  public firstDay: Date = new Date();
  public lastDay: Date = new Date();
  public months: string[] = [];
  public years: number[] = [];

  constructor(private dialog: MatDialog, private datePipe: DatePipe,
              private calendarService: CalendarService) {
    this.getWeekDays();
  }

  public drop(event: any, selectedDate: IDaysModel, hour: any, title: string): void {
    const dropped = event.event.target.id.split('-');
    const index: number = this.events.findIndex(event => event.day === selectedDate.day && event.month === selectedDate.month && event.hour === hour);
    const isDay: boolean = this.days.some(x => x.day === dropped[0])
    if ((selectedDate.day === dropped[0] && hour !== Number(dropped[1]) && isDay) || (selectedDate.day !== dropped[0] && isDay)) {
      this.events[index] = {
        title,
        day: dropped[0],
        hour: Number(dropped[1]),
        date: Number(dropped[3]),
        month: dropped[2],
        year: Number(dropped[4])
      }
    }
  }

  public onDelete(selectedDate: IDaysModel, hour: number): void {
    const index: number = this.events.findIndex((event: IEventModel) => event.day === selectedDate.day && event.hour === hour && event.month === selectedDate.month &&
      event.year === selectedDate.year && event.date === selectedDate.date);
    if (index !== -1) {
      this.events.splice(index, 1);
    }
  }


  public getEventsForHour(selectedDate: IDaysModel, hour: number): IEventModel[] {
    return this.events.filter(event => event.year === selectedDate.year && event.day === selectedDate.day && event.hour === hour && event.month === selectedDate.month && event.date === selectedDate.date);
  }

  public addEvent(): void {
    const dialogRef = this.dialog.open(EventCalendarComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.events.push(result)
      }
    });
  }


  public onEdit(day: IDaysModel, title: string, hour: number): void {
    const index: number = this.events.findIndex(event => event.day === day.day && event.month === day.month && event.hour === hour);
    const dialogRef = this.dialog.open(EventCalendarComponent);
    const date: Date = new Date(day.year + '-' + day.month + '-' + day.date);
    dialogRef.componentInstance.editValue = {date, title, hour}
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.events[index] = result;
      }

    });
  }

  public getWeekDays(weekStatus: 'current' | 'last' | 'next' = 'current', day: Date = new Date()): void {
    this.days = [];
    this.months = [];
    this.years = [];
    const weeStartDay = new Date(day);
    weeStartDay.setDate(weekStatus === 'current' ? weeStartDay.getDate() : weekStatus === 'last' ? weeStartDay.getDate() - 7 : weeStartDay.getDate() + 1);
    for (let i: number = 0; i < 7; i++) {
      const currentDate: Date = new Date(weeStartDay);
      if (i === 0) {
        this.firstDay = currentDate;
      }
      if (i === 6) {
        this.lastDay = currentDate;
      }
      currentDate.setDate(currentDate.getDate() + i);
      const newDate = this.calendarService.convertDate(currentDate)
      const duplicateMonth: string | undefined = this.months.find(m => m === newDate.month);
      const duplicateYear: number | undefined = this.years.find(m => m === newDate.year);
      if (!duplicateMonth) {
        this.months.push(newDate.month)
      }
      if (!duplicateYear) {
        this.years.push(newDate.year)
      }
      this.days.push({day: newDate.day, date: newDate.date, month: newDate.month, year: newDate.year})

    }
  }
}

interface IEventModel {
  title: string,
  day: string,
  date: number,
  hour: number,
  month: string,
  year: number
}

interface IDaysModel {
  day: string,
  date: number,
  month: string,
  year: number
}
