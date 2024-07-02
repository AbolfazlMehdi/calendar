import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogRef} from "@angular/material/dialog";
import {Subject, takeUntil} from "rxjs";
import {CalendarService} from "../services/calendar.service";

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-event-calendar',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, ReactiveFormsModule, MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,],
  providers: [{provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}, CalendarService, DatePipe],
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventCalendarComponent implements OnInit, OnDestroy {
  public hours: number[] = Array.from({length: 24}, (_, i) => i + 1);
  public calendarForm: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    hour: new FormControl(null, [Validators.required]),
    date: new FormControl(null, [Validators.required]),
  })
  private _destroy: Subject<void> = new Subject();
  private formValues!: IModel;

  @Input() editValue!: IFormModel;

  constructor(public dialogRef: MatDialogRef<EventCalendarComponent>,
              private calendarService: CalendarService) {
  }

  ngOnInit() {
    if (this.editValue) {
      this.calendarForm.patchValue(this.editValue);
      const date: Date = new Date(this.editValue.date);
      this.formValues = this.calendarService.convertDate(date);
    }
    this.onSelectData();
  }

  public onSubmit(): void {
    if (this.calendarForm.invalid) {
      this.calendarForm.markAllAsTouched();
      return
    }
    const form = this.calendarForm.getRawValue();
    this.formValues.title = form.title;
    this.formValues.hour = form.hour;
    this.dialogRef.close(this.formValues);
  }

  private onSelectData(): void {
    this.calendarForm.get('date')?.valueChanges.pipe(takeUntil(this._destroy)).subscribe({
      next: (res) => {
        const date = new Date(res);
        this.formValues = this.calendarService.convertDate(date);
      }
    })
  }

  ngOnDestroy() {
    this._destroy.next()
    this._destroy.complete();
  }

}

interface IModel {
  date?: number;
  day?: string;
  month?: string;
  title?: string;
  hour?: number;
  year?: number;
}

interface IFormModel {
  date: Date;
  title?: string;
  hour?: number;
}
