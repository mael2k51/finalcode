import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  employee: any;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.contactService.getById(id).subscribe({
      next: (res) => {
        this.employee = res;
      },
      error: (err) => {
        this.errorMessage = 'Contact not found';
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
