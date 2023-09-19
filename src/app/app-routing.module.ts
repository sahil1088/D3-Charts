import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RadarChartComponent } from './radar-chart/radar-chart.component';
import { ChartsComponent } from './charts/charts.component';

const routes: Routes = [
  { path: 'radar', component: RadarChartComponent },
  { path: 'bar', component: ChartsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
