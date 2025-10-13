import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ModalService, ModalConfig } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with empty modals', () => {
      expect(service.modals().length).toBe(0);
    });

    it('should initialize with no active modal', () => {
      expect(service.activeModal()).toBeNull();
    });

    it('should initialize with hasOpenModals as false', () => {
      expect(service.hasOpenModals()).toBe(false);
    });
  });

  describe('open Method', () => {
    it('should open a modal with basic configuration', () => {
      const config: ModalConfig = {
        id: 'test-modal',
        title: 'Test Modal'
      };

      service.open(config);

      expect(service.modals().length).toBe(1);
      expect(service.modals()[0].id).toBe('test-modal');
      expect(service.modals()[0].isOpen).toBe(true);
    });

    it('should return a Subject for close events', () => {
      const config: ModalConfig = { id: 'test-modal' };

      const closeSubject = service.open(config);

      expect(closeSubject).toBeDefined();
      expect(closeSubject.subscribe).toBeDefined();
    });

    it('should set modal as active when opened', () => {
      const config: ModalConfig = { id: 'test-modal' };

      service.open(config);

      expect(service.activeModal()?.id).toBe('test-modal');
    });

    it('should merge configuration with defaults', () => {
      const config: ModalConfig = { id: 'test-modal' };

      service.open(config);

      const modal = service.modals()[0];
      expect(modal.config.showHeader).toBe(true);
      expect(modal.config.showCloseButton).toBe(true);
      expect(modal.config.closeOnBackdropClick).toBe(true);
      expect(modal.config.closeOnEscapeKey).toBe(true);
      expect(modal.config.size).toBe('md');
    });

    it('should allow overriding default configuration', () => {
      const config: ModalConfig = {
        id: 'test-modal',
        showHeader: false,
        showCloseButton: false,
        size: 'lg'
      };

      service.open(config);

      const modal = service.modals()[0];
      expect(modal.config.showHeader).toBe(false);
      expect(modal.config.showCloseButton).toBe(false);
      expect(modal.config.size).toBe('lg');
    });

    it('should store custom data in config', () => {
      const customData = { userId: 123, name: 'Test' };
      const config: ModalConfig = {
        id: 'test-modal',
        data: customData
      };

      service.open(config);

      const modal = service.modals()[0];
      expect(modal.config.data).toEqual(customData);
    });

    it('should allow opening multiple modals', () => {
      service.open({ id: 'modal-1' });
      service.open({ id: 'modal-2' });

      expect(service.modals().length).toBe(2);
    });

    it('should set last opened modal as active', () => {
      service.open({ id: 'modal-1' });
      service.open({ id: 'modal-2' });

      expect(service.activeModal()?.id).toBe('modal-2');
    });
  });

  describe('close Method', () => {
    it('should close an open modal', () => {
      service.open({ id: 'test-modal' });

      service.close('test-modal');

      const modal = service.modals().find(m => m.id === 'test-modal');
      expect(modal?.isOpen).toBe(false);
    });

    it('should emit close event with result', (done) => {
      const closeSubject = service.open({ id: 'test-modal' });

      closeSubject.subscribe(result => {
        expect(result).toBe('test-result');
        done();
      });

      service.close('test-modal', 'test-result');
    });

    it('should clear active modal if it was the active one', () => {
      service.open({ id: 'test-modal' });
      expect(service.activeModal()?.id).toBe('test-modal');

      service.close('test-modal');

      expect(service.activeModal()).toBeNull();
    });

    it('should remove modal from list after 300ms', fakeAsync(() => {
      service.open({ id: 'test-modal' });
      expect(service.modals().length).toBe(1);

      service.close('test-modal');
      expect(service.modals().length).toBe(1);

      tick(300);

      expect(service.modals().length).toBe(0);
    }));

    it('should not throw error when closing non-existent modal', () => {
      expect(() => service.close('non-existent')).not.toThrow();
    });

    it('should complete the close subject', (done) => {
      const closeSubject = service.open({ id: 'test-modal' });

      closeSubject.subscribe({
        complete: () => {
          done();
        }
      });

      service.close('test-modal');
    });
  });

  describe('closeActive Method', () => {
    it('should close the active modal', () => {
      service.open({ id: 'test-modal' });

      service.closeActive();

      const modal = service.modals().find(m => m.id === 'test-modal');
      expect(modal?.isOpen).toBe(false);
    });

    it('should pass result to close event', (done) => {
      const closeSubject = service.open({ id: 'test-modal' });

      closeSubject.subscribe(result => {
        expect(result).toBe('active-result');
        done();
      });

      service.closeActive('active-result');
    });

    it('should not throw error when no active modal', () => {
      expect(() => service.closeActive()).not.toThrow();
    });
  });

  describe('closeAll Method', () => {
    it('should close all open modals', () => {
      service.open({ id: 'modal-1' });
      service.open({ id: 'modal-2' });
      service.open({ id: 'modal-3' });

      service.closeAll();

      const openModals = service.modals().filter(m => m.isOpen);
      expect(openModals.length).toBe(0);
    });

    it('should not close already closed modals again', fakeAsync(() => {
      service.open({ id: 'modal-1' });
      service.open({ id: 'modal-2' });

      service.close('modal-1');
      tick(300);

      const openModalsBeforeCloseAll = service.modals().filter(m => m.isOpen);
      expect(openModalsBeforeCloseAll.length).toBe(1); // Only modal-2 is still open

      service.closeAll();
      tick(300);

      expect(service.modals().length).toBe(0);
    }));
  });

  describe('isOpen Method', () => {
    it('should return true for open modal', () => {
      service.open({ id: 'test-modal' });

      expect(service.isOpen('test-modal')).toBe(true);
    });

    it('should return false for closed modal', () => {
      service.open({ id: 'test-modal' });
      service.close('test-modal');

      expect(service.isOpen('test-modal')).toBe(false);
    });

    it('should return false for non-existent modal', () => {
      expect(service.isOpen('non-existent')).toBe(false);
    });
  });

  describe('getModalConfig Method', () => {
    it('should return modal configuration', () => {
      const config: ModalConfig = {
        id: 'test-modal',
        title: 'Test Title',
        size: 'lg'
      };

      service.open(config);

      const retrievedConfig = service.getModalConfig('test-modal');

      expect(retrievedConfig?.title).toBe('Test Title');
      expect(retrievedConfig?.size).toBe('lg');
    });

    it('should return null for non-existent modal', () => {
      const config = service.getModalConfig('non-existent');

      expect(config).toBeNull();
    });
  });

  describe('hasOpenModals Computed', () => {
    it('should return true when modals are open', () => {
      service.open({ id: 'test-modal' });

      expect(service.hasOpenModals()).toBe(true);
    });

    it('should return false when no modals are open', () => {
      expect(service.hasOpenModals()).toBe(false);
    });

    it('should return false when all modals are closed', () => {
      service.open({ id: 'modal-1' });
      service.open({ id: 'modal-2' });

      service.closeAll();

      expect(service.hasOpenModals()).toBe(false);
    });
  });

  describe('Escape Key Handling', () => {
    it('should close active modal on Escape key when closeOnEscapeKey is true', () => {
      service.open({ id: 'test-modal', closeOnEscapeKey: true });

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      const modal = service.modals().find(m => m.id === 'test-modal');
      expect(modal?.isOpen).toBe(false);
    });

    it('should not close modal on Escape key when closeOnEscapeKey is false', () => {
      service.open({ id: 'test-modal', closeOnEscapeKey: false });

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      const modal = service.modals().find(m => m.id === 'test-modal');
      expect(modal?.isOpen).toBe(true);
    });

    it('should not throw error on Escape key when no modal is active', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      expect(() => document.dispatchEvent(event)).not.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete modal lifecycle', fakeAsync(() => {
      const closeSubject = service.open({ id: 'test-modal', title: 'Test' });
      let closeResult: any;

      closeSubject.subscribe(result => {
        closeResult = result;
      });

      expect(service.isOpen('test-modal')).toBe(true);
      expect(service.activeModal()?.id).toBe('test-modal');

      service.close('test-modal', 'success');

      expect(closeResult).toBe('success');
      expect(service.isOpen('test-modal')).toBe(false);
      expect(service.activeModal()).toBeNull();

      tick(300);

      expect(service.modals().length).toBe(0);
    }));

    it('should handle multiple modals with different configurations', () => {
      service.open({ id: 'modal-1', size: 'sm', title: 'Small' });
      service.open({ id: 'modal-2', size: 'lg', title: 'Large' });

      const config1 = service.getModalConfig('modal-1');
      const config2 = service.getModalConfig('modal-2');

      expect(config1?.size).toBe('sm');
      expect(config1?.title).toBe('Small');
      expect(config2?.size).toBe('lg');
      expect(config2?.title).toBe('Large');
    });
  });
});
