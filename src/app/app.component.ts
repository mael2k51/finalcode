import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ContactService } from './services/contact.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-crud-app';
  contactList: any[] = [];
  selectedContactId: number | null = null;

  constructor(
    private dialog: MatDialog,
    private empService: ContactService
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.empService.getContactList().subscribe({
      next: (res) => (this.contactList = res),
      error: (err) => console.error(err),
    });
  }

  openAddEditDialog(contact?: any): void {
    const dialogRef = this.dialog.open(AddEditComponent, {
      width: '400px',
      data: contact ? contact : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadContacts();
      }
    });
  }

  saveContact(payload: any): void {
    if (this.selectedContactId) {
      this.empService
        .updateContact(this.selectedContactId, payload)
        .subscribe({
          next: () => {
            this.loadContacts();
            this.selectedContactId = null;
          },
          error: (err) => console.error(err),
        });
    } else {
      this.empService.addContact(payload).subscribe({
        next: () => this.loadContacts(),
        error: (err) => console.error(err),
      });
    }
  }

  deleteContact(id: number): void {
    this.empService.deleteContact(id).subscribe({
      next: () => this.loadContacts(),
      error: (err) => console.error(err),
    });
  }
}
