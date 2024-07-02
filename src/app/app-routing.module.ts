import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'calendar', pathMatch: 'full'},
  {path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(c => c.CalendarModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
