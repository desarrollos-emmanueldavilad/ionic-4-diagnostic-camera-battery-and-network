import { Component, OnInit } from '@angular/core';
import { DevicesStateService } from '../device/devices-state.service';
import { identifierModuleUrl } from '@angular/compiler';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  level: any;
  stat: any;
  batteryLevel = 45;
  network: any;
  wifi = 'wifi';
  bat: any;
  authorization: any;

  constructor(
    private deviceService: DevicesStateService,
    private camera: Camera
  ) {}
  ngOnInit() {
    this.listen();
    this.listenbat();
  }

  ////////////////////////////////////////////BATERIA/////////////////////////////////////////////////
  check(porcentaje: number) {
    this.deviceService.checkBattery1(porcentaje).subscribe(res => {
      console.log('cumpliendo', res);
      if (res < this.batteryLevel) {
        const element = document.getElementById('container');
        element.style.background = '#FFFAF0';
        alert(
          'el status de tu bateria es bajo para obtener un performace de 100% en esta aplicación'
        );
      } else if (res => this.batteryLevel) {
        const element = document.getElementById('container');
        element.style.background = ' #FFFFF0';
        alert('el status de tu bateria es perfecto para el en esta aplicación');
      } else {
        console.log('anything');
      }
    });
  }

  listenbat() {
    this.deviceService.checkBattery1(this.batteryLevel).subscribe(data => {
      if (data < this.batteryLevel) {
        const element = document.getElementById('container');
        element.style.background = '#FFFAF0';
        console.log(
          'el status de tu bateria es bajo para obtener un performace de 100% en esta aplicación'
        );
      } else if (data > this.batteryLevel) {
        const element = document.getElementById('container');
        element.style.background = ' #FFFFF0';
        console.log(
          'el status de tu bateria es perfecto para el en esta aplicación'
        );
      } else if (data == 100) {
        this.stopBatteryCheck();
      } else {
        console.log('anything');
      }
    });
  }

  stopBatteryCheck() {
    this.deviceService
      .stopBatteryCheck()
      .subscribe(res => console.log('desde componente stop', res));
  }
  //////////////////////////////////////////////CÄMARA/////////////////////////////////////////////////

  camaraPreset() {
    this.deviceService
      .diagnosticoCamara()
      .then(res => alert('Camara present:' + '' + res));
  }

  camaraAuth() {
    this.deviceService.camaraAuthorized().then(res => {
      this.authorization = res;
      alert('Camara authorized in this app:' + '' + res);
    });
  }

  camaraR() {
    this.deviceService
      .requestCamera()
      .then(res => alert('Camara present:' + '' + res));
  }

  foto() {
    this.deviceService.diagnosticoCamara().then(res => {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
      if (res == true) {
        this.camera.getPicture(options).then(
          imageData => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            let base64Image = 'data:image/jpeg;base64,' + imageData;
          },
          err => {
            // Handle error
          }
        );
      } else console.log('no se puede usar la camra ');
    });
  }

  //////////////////////////////////////////////NETWORK/////////////////////////////////////////////////

  conect(text) {
    this.deviceService.connect(text).subscribe(informacion => {
      console.log('tipo de conneccion', informacion);
      if (informacion === 'wifi') {
        console.log('wifiii', informacion);
        alert('tu coneccion es estable');
      } else {
        console.log('no wifi', informacion);
      }
    });
  }

  listen() {
    this.deviceService.connect(this.wifi).subscribe(informacion => {
      alert('tipo de conneccion antes del if:' + informacion);
      if (informacion == 'wifi') {
        console.log('wifiii', informacion);
        alert('tu coneccion es estable');
      } else if (informacion == '4g') {
        console.log('no wifi 3g', informacion);
        alert('no wifi' + informacion);
      } else if (informacion == '3g') {
        console.log('no wifi 3G', informacion);
        alert('no wifi' + informacion);
      } else if (informacion == '2g') {
        console.log('no wifi 2G', informacion);
        alert('no wifi' + informacion);
      } else {
        this.disconnect()
      }
    });
  }

   disconnect() {
     this.deviceService.disconnect().subscribe(res => {
       console.log('no network', res);
       alert('no network' + res);
     });
   }
}
