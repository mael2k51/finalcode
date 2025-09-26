import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ContactService } from '../services/contact.service';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  contactForm: FormGroup;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'fullName', 'email', 'contact', 'action'];

  selectedContactId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private coreService: CoreService,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getContactList();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getContactList(): void {
    this.contactService.getContactList().subscribe({
      next: (res: any[]) => {
        const mapped = res.map((r: any) => ({
          ...r,
          fullName: r.fullName ?? `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim(),
          contact: r.contact ?? r.company ?? '',
        }));

        this.dataSource.data = mapped;
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
      },
      error: (err: any) => console.error('Error fetching contacts', err),
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFormSubmit(): void {
    if (!this.contactForm.valid) return;

    const payload = this.contactForm.value;

    if (this.selectedContactId) {
      this.contactService.updateContact(this.selectedContactId, payload).subscribe({
        next: () => {
          this.coreService.openSnackBar('Contact detail updated!');
          this.selectedContactId = null;
          this.clearForm();
          this.getContactList();
        },
        error: (err: any) => console.error(err),
      });
    } else {
      this.contactService.addContact(payload).subscribe({
        next: () => {
          this.coreService.openSnackBar('Contact added successfully');
          this.clearForm();
          this.getContactList();
        },
        error: (err: any) => console.error(err),
      });
    }
  }

  editContact(row: any): void {
    this.selectedContactId = row.id;
    this.contactForm.patchValue({
      fullName: row.fullName,
      email: row.email,
      contact: row.contact,
    });
  }

  viewContact(row: any): void {
    this.router.navigate(['/view', row.id]); // navigate to view page
  }

  deleteContact(id: number): void {
    this.contactService.deleteContact(id).subscribe({
      next: () => {
        this.coreService.openSnackBar('Contact deleted');
        if (this.selectedContactId === id) {
          this.selectedContactId = null;
          this.clearForm();
        }
        this.getContactList();
      },
      error: (err: any) => console.error(err),
    });
  }

  clearForm(): void {
    this.contactForm.reset({}, { emitEvent: false });
    Object.keys(this.contactForm.controls).forEach((key) => {
      this.contactForm.get(key)?.setErrors(null);
      this.contactForm.get(key)?.markAsPristine();
      this.contactForm.get(key)?.markAsUntouched();
    });
  }
}
