import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: string;

  constructor(private tokenStorage: TokenStorageService, private userService: UserService, private http: HttpClient,private sanitizer: DomSanitizer) { }

  roles: any;
  isLoggedIn: boolean = false;
  selectedFile: File | null = null;

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
  toDoList: any;

  create() {
    this.createToDo = true;
  }

  submit() {
    let obj = {
      name: this.todoName
    }

    if (!(obj.name == undefined || obj.name == null || obj.name == "")) {
      this.userService.createToDo(obj).subscribe((response: any) => {
        // Handle the API response here      
        //console.error(response);
        this.todoName = "";
        this.getAll();
        this.createToDo = false;

      },
        (error: any) => {
          // Handle error if the API call fails
          console.error('Error:', error);
          if (error.status == 403) {
            alert("Only admin can create new To Do")
          }
        }
      );
    }
    else {
      alert("Invalid input")
    }

  }

  getAll() {
    console.log("get all")
    this.toDoList = [];
    if (this.isLoggedIn) {
      this.userService.getAll().subscribe((response: any) => {
        // Handle the API response here
        //console.log(response);
        this.toDoList = response;
        console.log(this.toDoList);

      },
        (error: any) => {
          // Handle error if the API call fails
          console.error('Error:', error);
        }
      );
    }

  }

  closeToDo(index: number) {
    console.log(index)

    this.userService.closeToDo(this.toDoList[index].id).subscribe((response: any) => {
      // Handle the API response here      
      //console.error(response);      
      this.getAll();

    },
      (error: any) => {
        // Handle error if the API call fails
        console.error('Error:', error);
        if (error.status == 403) {
          alert("Only admin can close To Do")
        }
      }
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(index: any) {
    if (this.selectedFile) {
      this.uploadImage(this.selectedFile, this.toDoList[index].id);
    }
  }

  uploadImage(file: File, id: number) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (this.selectedFile != null && this.selectedFile != undefined) {

      // Replace 'your-upload-url' with the URL to your server-side image upload endpoint
      this.http.post<any>('http://localhost:8080/uploadPic/' + id, formData).subscribe(
        (response) => {
          // Handle success response
          this.selectedFile = null;
          if (response.status == 200) {
            alert("Image uploaded successfully")
            this.getAll();
          }
          console.log('Image uploaded successfully:', response);
        },
        (error) => {
          // Handle error
          this.selectedFile = null;
          if (error.status == 200) {
            alert("Image uploaded successfully")
            this.getAll();
          }
          console.error('Error uploading image:', error);
        }
      );
    }
    else {
      alert("Please select a pic")
    }
  }
  deleteToDo(index: number) {
    this.userService.deleteToDo(this.toDoList[index].id).subscribe((response: any) => {
      // Handle the API response here      
      //console.error(response);      
      this.getAll();

    },
      (error: any) => {
        // Handle error if the API call fails
        console.error('Error:', error);
        if (error.status == 403) {
          alert("Only admin can delete To Do")
        }
        else if (error.status == 200) {
          this.getAll();
        }
      }
    );
  }

  getSafeImageURL(base64Image: string): SafeResourceUrl {
    const imageSrc = `data:image/*;base64,${base64Image}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(imageSrc);
  }
  

}
