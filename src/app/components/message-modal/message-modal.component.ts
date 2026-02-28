import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface MessageModalConfig {
  closeButtonText?: string,
  confirmCallback?: () => void,
  confirmButtonText?: string,
  confirmButtonStyleClass?: string,
  cancelButtonStyleClass?: string
}

export interface MessageModalData {
  type: 'default' | 'success' | 'error',
  title: string,
  message: string,
  config?: MessageModalConfig
}
@Component({
  selector: 'app-message-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-modal.component.html',
  styleUrl: './message-modal.component.scss'
})
export class MessageModalComponent {
  config: MessageModalConfig = {
    closeButtonText: 'Close',
    confirmButtonText: 'Ok',
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MessageModalData
  ) { }

  ngOnInit(): void {
    this.config = {
      ...this.config,
      ...this.data.config || {}
    }
  }
}
