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
  batteryLevel = 75;
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
    this.deviceService.checkBattery1(this.batteryLevel).subscribe(res => {
      console.log('cumpliendo 75', res);
      if (res < this.batteryLevel) {
        console.log('menor');
        const element = document.getElementById('container');
        element.style.background = '#FF00AA';
      } else if (res > this.batteryLevel) {
        console.log('mayor');
        const element = document.getElementById('container');
        element.style.background = '#f09433';
      } else {
        console.log('algo no esta funcionando');
      }
    });
  }

  media2() {
    this.deviceService.cameraWeb().then(data => {
      if (data) {
        console.log('web', data);
      } else {
        console.log('camara no disponible');
      }
    });
  }

  check(number) {
    this.deviceService.checkBattery1(number).subscribe(res => {
      console.log('cumpliendo', res);
      if (res < number) {
        console.log('menor');
        const element = document.getElementById('container');
        element.style.background = '#FF00AA';
      } else if (res > number) {
        console.log('mayor');
        const element = document.getElementById('container');
        element.style.background = '#f09433';
      } else {
        console.log('algo no esta funcionando');
      }
    });
  }

  // check2(number) {
  //   this.deviceService.checkBattery(number).subscribe(res => {
  //     console.log('cumpliendo', res);
  //     if (res < number) {
  //       const element = document.getElementById('container');
  //       element.style.background = '#FF00AA';
  //     } else if (res => number) {
  //       const element = document.getElementById('container');
  //       element.style.background = ' #f09433';
  //     } else {
  //       console.log('anything');
  //     }
  //   });
  // }

  listenbat() {
    const net = this.deviceService
      .checkBattery1(this.batteryLevel)
      .subscribe(res => {
        console.log('cumpliendo', res);
        if (res < this.batteryLevel) {
          const element = document.getElementById('container');
          element.style.background = '#FF00AA';
        } else if (res => this.batteryLevel) {
          const element = document.getElementById('container');
          element.style.background = ' #f09433';
        } else {
          console.log('anything');
        }
      });

    this.bat = net;
  }

  stopBatteryCheck() {
    this.deviceService
      .stopBatteryCheck()
      .subscribe(res => console.log('desde componente stop', res));
  }

  camaraPreset() {
    this.deviceService
      .camaraPresent()
      .then(res => alert('Camara present:' + '' + res));
  }

  camaraAuth() {
    this.deviceService
      .camaraAuthorized()
      .then((res) => {
        this.authorization = res;
        alert('Camara authorized in this app:' + '' + res)
      });
  }

  // camaraStatus() {
  //   this.deviceService
  //       .camaraAuthorizedStatus()
  //       .then(res => alert('Camara present:' + '' + res));
  // }

  // camaraR() {
  //   this.deviceService
  //       .camaraPresent()
  //       .then(res => alert('Camara present:' + '' + res));
  // }

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
    const net = this.deviceService.connect(this.wifi).subscribe(informacion => {
      console.log('tipo de conneccion', informacion);
      if (informacion === 'wifi') {
        console.log('wifiii', informacion);
        alert('tu coneccion es estable');
      } else {
        console.log('no wifi', informacion);
      }
    });

    this.network = net;
  }

  // disconnect() {
  //   this.deviceService.disconnect().subscribe(() => {
  //     console.log('desde el componente desconectado');
  //   });
  // }

  foto() {
    this.deviceService.camaraPresent().then(res => {
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
}
