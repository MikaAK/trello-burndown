import {Component, Input, Output, EventEmitter} from 'angular2/core';

export class ModalConfig {
  public isOpen: boolean = false

  public toggle(): void {
    this.isOpen = !this.isOpen
  }
}

@Component({
  selector: 'modal',
  template: require('./modal.jade')(),
  styles: [require('./modal.scss')]
})
export class Modal {
  @Input() public config: ModalConfig
  @Input() public title: string
  @Output() public onClose: EventEmitter<boolean> = new EventEmitter()
  @Output() public onOpen: EventEmitter<boolean> = new EventEmitter()
  private _isOpenLast: boolean = false

  public ngDoCheck() {
    if (!this.config)
      return

    if (this._isOpenLast !== this.config.isOpen) {
      if (this.config.isOpen)
        this.onOpen.emit(true)
      else
        this.onClose.emit(true)

      this._isOpenLast = this.config.isOpen
    }
  }
}

