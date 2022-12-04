import {ConfirmDialogComponent} from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;

  const dialog: any = {
    close: jest.fn()
  };

  beforeEach(() => {
    component = new ConfirmDialogComponent(dialog, 'test');

    dialog.close.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init correctly', async () => {
    await component.ngOnInit();

    expect(component).toBeTruthy();
  });

  it('should close the dialog on confirm', () => {
    component.onConfirm();

    expect(dialog.close).toHaveBeenCalled();
  });

  it('should close the dialog on dismiss', () => {
    component.onDismiss();

    expect(dialog.close).toHaveBeenCalled();
  });
});
