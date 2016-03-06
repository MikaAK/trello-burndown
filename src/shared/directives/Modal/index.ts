import {Component, Input, Output, EventEmitter, HostBinding, Injectable} from 'angular2/core'

@Injectable()
export class ModalService {
  public isOpen: boolean = false

  public toggle(): void {
    if (this.isOpen)
      this.close()
    else
      this.open()
  }

  public close(): void {
    this.isOpen = false
  }

  public open(): void {
    this.isOpen = true
  }
}

@Component({
  selector: 'modal',
  template: require('./Modal.jade')(),
  styles: [require('./Modal.scss')]
})
export class Modal {
  @Input() public title: string
  @Output() public onClose: EventEmitter<boolean> = new EventEmitter()
  @Output() public onOpen: EventEmitter<boolean> = new EventEmitter()
  public _isOpenLast: boolean = false

  constructor(public modalService: ModalService) {}

  @HostBinding('hidden') public get _isHidden() {
    return !this.modalService.isOpen
  }

  public ngDoCheck() {
    if (this._isOpenLast !== this.modalService.isOpen) {
      if (this.modalService.isOpen)
        this.onOpen.emit(true)
      else
        this.onClose.emit(true)

      this._isOpenLast = this.modalService.isOpen
    }
  }
}

