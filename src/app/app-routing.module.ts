import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableDetailsComponent } from './components/table-details/table-details.component';
import { TableListComponent } from './components/table-list/table-list.component';

const routes: Routes = [
  { path: 'tables', component: TableListComponent, pathMatch: 'full' },
  { path: 'tables/:id', component: TableDetailsComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
