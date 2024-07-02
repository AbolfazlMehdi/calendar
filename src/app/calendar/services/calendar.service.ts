import {Injectable} from "@angular/core";
import {DatePipe} from "@angular/common";

@Injectable()
export class CalendarService {
  constructor(private datePipe: DatePipe) {
  }

  public convertDate(selectedDate: Date): {date: number , day: string , month: string, year: number} {
    const month: any = this.datePipe.transform(selectedDate, 'LLLL');
    const dayName: any = this.datePipe.transform(selectedDate, 'EEEE');
    const dayNum: any = selectedDate.getDate();
    const year: any = selectedDate.getFullYear();
   return  {date: dayNum, day: dayName, month, year};
  }
}
