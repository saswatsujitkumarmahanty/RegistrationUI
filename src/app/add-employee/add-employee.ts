import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { Service } from '../service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css',
})
export class AddEmployee {

  addEmployeeForm: FormGroup;

constructor(private router: Router,private fb: FormBuilder, private registration: Service) { 

this.addEmployeeForm =this.fb.group({
  name:[''],
  gender:[''],
  email:[''],
  phone:[''],
  age:[''],
  salary:['']
})
}

OnSubmit() {
  this.registration.postData(this.addEmployeeForm.value).subscribe(res =>{
    this.router.navigateByUrl('registration');
  })
}

OnCancel() {
  this.router.navigateByUrl('registration');
}
}
