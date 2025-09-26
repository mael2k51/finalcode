import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {

  contactForm!: FormGroup;
  selectedContactId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Initialize form
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required]
    });

    // If data is passed (edit mode), patch values
    if (this.data && this.data.contact) {
      this.selectedContactId = this.data.contact.id;
      this.contactForm.patchValue(this.data.contact);
    }
  }

  // Submit form
  onFormSubmit(): void {
    if (this.contactForm.valid) {
      const formData = {
        id: this.selectedContactId ? this.selectedContactId : new Date().getTime(),
        ...this.contactForm.value
      };

      this.dialogRef.close(formData); // return form data to parent
    }
  }

  // Cancel button
  onCancel(): void {
    this.dialogRef.close();
  }
}
