import {NotificationService} from "./notification.service";

describe('NotificationService', () => {
  let service: NotificationService;

  const snackBar: any = {
    open: jest.fn()
  };

  beforeEach(() => {
    service = new NotificationService(snackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a snackbar', () => {
    service.notify('test message');

    expect(snackBar.open).toHaveBeenCalledWith('test message', expect.anything(), expect.anything());
  });
});
