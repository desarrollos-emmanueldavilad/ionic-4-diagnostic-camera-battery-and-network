import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesStateService } from './devices-state.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[DevicesStateService]
})
export class DeviceModule { }
