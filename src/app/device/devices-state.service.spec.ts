import { TestBed } from '@angular/core/testing';
import { DevicesStateService } from './devices-state.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

let cordova: boolean = true;
class CameraMock {
  public requestCameraAuthorization(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve('GRANTED');
    });
  }

  public isCameraAuthorized(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(cordova);
    });
  }

  public isCameraPresent(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ('cordova') {
        resolve(true);
      }
    });
  }
}

const platformMock = {
  is: platform => {
    switch (platform) {
      case 'cordova':
        return true;
      default:
        return false;
    }
  }
};

describe('DevicesStateService', () => {
  let service: DevicesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DevicesStateService,
        BatteryStatus,
        Network,
        { provide: Diagnostic, useClass: CameraMock },
        { provide: Platform, useValue: platformMock }
      ]
    });

    service = TestBed.get(DevicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('call requestCamera method', async () => {
    let res = await service.requestCamera();
    expect(res).toEqual('GRANTED');
  });

  it('call diagnosticoCamara method for MOBILE', async () => {
    let ress = await service.diagnosticoCamara();
    expect(ress).toEqual(true);
  });

  it('call camaraAuthorized method for MOBILE', async () => {
    let ress = await service.camaraAuthorized();
    expect(ress).toEqual(true);
  });
});


let m = 'offline';
let signal: string = 'wifi';

class NetworkMock {
  public onChange(): Observable<any> {
    return new Observable(observer => {
      observer.next('wifi');
      // observer.complete();
    });
  }

  public onDisconnect(): Observable<any> {
    return new Observable(observer => {
      observer.next('offline');
      // observer.complete();
    });
  }
}

describe('DevicesStateService', () => {
  let service: DevicesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DevicesStateService,
        BatteryStatus,
        Network,
        { provide: Diagnostic, useClass: CameraMock }
      ]
    });

    service = TestBed.get(DevicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('call diagnosticoCamara for web', async () => {
    let ress = await service.diagnosticoCamara();
    expect(ress).toEqual(true);
  });
});

describe('DevicesStateService', () => {
  let service: DevicesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DevicesStateService,
        BatteryStatus,
        Diagnostic,
        { provide: Network, useClass: NetworkMock }
      ]
    });

    service = TestBed.get(DevicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('call connect method for NETWORK', async () => {
    await service.connectChange().subscribe(observer => {
      expect(observer.next(signal)).toEqual('wifi');
    });
  });

  it('call disconnect for NETWORK', async () => {
    await service.disconnect().subscribe(observer => {
      let a = observer;
      expect(a).toEqual('offline');
    });
  });
});

class NetworkMockElse {
  public onChange(): Observable<any> {
    return new Observable(observer => {
      observer.next(undefined);
      // observer.complete();
    });
  }
}
let noNetwork = undefined;
describe('DevicesStateService', () => {
  let service: DevicesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DevicesStateService,
        BatteryStatus,
        Diagnostic,
        { provide: Network, useClass: NetworkMockElse }
      ]
    });

    service = TestBed.get(DevicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('call connect', async () => {
    await service.connectChange().subscribe(observer => {
      expect(observer.next(noNetwork)).toEqual(undefined);
    });
  });
});

let lvl: number = 75;
let connect: boolean = false;
let all: any = { lvl, connect };

class BatteryStatusMock {
  public onChange(): Observable<any> {
    return new Observable(observer => {
      observer.next(all.lvl);
      observer.complete();
    });
  }
}

describe('DevicesStateService', () => {
  let service: DevicesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DevicesStateService,
        Network,
        Diagnostic,
        { provide: BatteryStatus, useClass: BatteryStatusMock }
      ]
    });

    service = TestBed.get(DevicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('call checkBattery', async () => {
    await service.checkBattery1(all).subscribe(observer => {
      expect(observer.next(all.lvl)).toEqual(75);
    });
  });

  it('call stopBatteryCheck', async () => {
    await service.stopBatteryCheck().subscribe(observer => {
      expect(observer.next()).toEqual(undefined);
    });
  });
});

let un = undefined;
class BatteryStatusMockElse {
  public onChange(): Observable<any> {
    return new Observable(observer => {
      observer.next(undefined);
    });
  }

  public stopBatteryCheck(): Observable<any> {
    return new Observable(observer => {
      observer.next(undefined);
    });
  }
}
describe('DevicesStateService', () => {
  let service: DevicesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DevicesStateService,
        Network,
        Diagnostic,
        { provide: BatteryStatus, useClass: BatteryStatusMockElse }
      ]
    });

    service = TestBed.get(DevicesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('call checkBattery', async () => {
    await service.checkBattery1(lvl).subscribe(observer => {
      expect(observer.next(un)).toEqual(undefined);
    });
  });

  it('call stopBatteryCheck', async () => {
    await service.stopBatteryCheck().subscribe(observer => {
      let s = observer
      expect(s).toEqual(undefined);
    });
  });
});
