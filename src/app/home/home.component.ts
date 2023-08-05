import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: string;

  constructor(private tokenStorage: TokenStorageService,private userService: UserService) { }

  roles:any;
  isLoggedIn:boolean=false;
  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      console.log(this.tokenStorage.getUser().roles)
      this.roles = this.tokenStorage.getUser().roles;
      //this.router.navigate(['/home']);
    }    
    this.getAll();
  }
  createToDo: boolean = false;
  todoName: any = "";
  
  create() {
    this.createToDo = true;
  }

  submit() {
    let obj = {
      name: this.todoName
    }

    if(!(obj.name == undefined || obj.name == null || obj.name == ""))
    {
    this.userService.createToDo(obj).subscribe((response: any) => {
      // Handle the API response here
      console.log('Innnnnnnnnnnnn');
      this.createToDo = false;

    },
      (error: any) => {
        // Handle error if the API call fails
        console.error('Error:', error);
      }
    );
    }
    else
    {
      alert("Invalid input")
    }
   
  }

  getAll() {
    console.log("get all")
    if (this.isLoggedIn) {
      this.userService.getAll().subscribe((response: any) => {
        // Handle the API response here
        console.log(response);

      },
        (error: any) => {
          // Handle error if the API call fails
          console.error('Error:', error);
        }
      );
    }

  }
}
