import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { EmployeeService } from '../../../core/services/employee.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-employee',
  imports: [ReactiveFormsModule],
  templateUrl: './update-employee.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './update-employee.css',
})
export class UpdateEmployee implements OnInit {
  updateEmployeeForm: FormGroup;

  constructor(
    private registration: EmployeeService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.updateEmployeeForm = this.fb.group({
      id: [''],
      name: [''],
      gender: [''],
      email: [''],
      phone: [''],
      age: [''],
      salary: [''],
    });
  }

  UserData: any;
  userId!: {
    //
    uid: any;
  };

  ngOnInit(): void {
    this.userId = {
      uid: this.activeRoute.snapshot.params['id'],
    };
    this.registration.getDataById(this.userId.uid).subscribe((res) => {
      this.UserData = res;
      this.updateEmployeeForm.setValue({
        id: this.UserData.id,
        name: this.UserData.name,
        gender: this.UserData.gender,
        email: this.UserData.email,
        phone: this.UserData.phone,
        age: this.UserData.age,
        salary: this.UserData.salary,
      });
    });
  }

  OnSubmit() {
    this.registration.putData(this.userId.uid, this.updateEmployeeForm.value).subscribe((res) => {
      this.router.navigateByUrl('registration');
    });
  }

  OnCancel() {
    this.router.navigateByUrl('registration');
  }
}
