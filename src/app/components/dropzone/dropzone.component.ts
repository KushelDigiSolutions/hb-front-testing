import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { FileUploadService } from '../../services/file-upload.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropzone',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropzone.component.html',
  styleUrl: './dropzone.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DropzoneComponent implements OnInit, ControlValueAccessor {


  @Input() multiple: boolean = true;
  @Input() accept: string = '*';

  @Output() change = new EventEmitter();
  @Output() removed = new EventEmitter();

  s3Base = environment.imageUrl;
  files: any = [];

  constructor(
    public uploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
  }

  propagateChange(_: any) { };

  onTouched(_: any) { };

  writeValue(obj: Array<File | { savedName: string, _id: string }>): void {
    if (Array.isArray(obj)) {
      this.files = obj
    } else {
      console.error('[custom error: dropzone.component.ts] value only takes array of File or array of strings');
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  onChange(event: any) {
    console.log(event);

    let { addedFiles } = event;
    if (addedFiles.length)
      this.files = this.multiple ? [...this.files, ...addedFiles] : [addedFiles[0]];

    this.propagateChange(this.files);
    this.change.emit(this.files)
  }

  onRemove(data: { index: number, file: File | string }) {
    this.onTouched(true);
    let value = [...this.files]
    value.splice(data.index, 1);
    this.files = value;

    this.propagateChange(this.files);
    this.removed.emit(data)
  }

  isImage(fileName: string): boolean {
    let ext: string | any = fileName.split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext.toLowerCase());
  }

  isFileImage(file: File): boolean {
    return file.type.startsWith('image/');
  }
}
