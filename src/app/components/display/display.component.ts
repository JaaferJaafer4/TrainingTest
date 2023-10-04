import { Component, HostListener, OnInit } from '@angular/core';
import { Info } from 'src/app/models/info';
import { MyServiceService } from 'src/app/services/my-service.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  display_data : Info[] = []; 

  error: boolean = false;
  filtered_array: Info[] = [];
  favorites_array : Info[] = [];
  raw_data: Info[] = [];
  filter = false;
  favorite = false;
  private counter = 0;
  private ids = 0;
  private loading = true;
  private data_added = false;
  constructor(private _service: MyServiceService) { }

  ngOnInit(): void {
    this.generate()
  }


  search(select: string, event: any) {
    let search_text = event.target.value;

    if (search_text != "") {
    
      this.filter = true;
     
      
     if(!this.favorite)
      switch (select) {
        case "id":
         if(this.check_conversion(search_text))
          this.filtered_array = this.raw_data.filter(item => item.id == +search_text);
       else
       this.filter = false;
         break;
        case "author": this.filtered_array = this.raw_data.filter(item => item.author.toLocaleLowerCase().includes(search_text.toLocaleLowerCase())); break;
        case "text": this.filtered_array = this.raw_data.filter(item => item.text.toLocaleLowerCase().includes(search_text.toLocaleLowerCase())); break;
      }
      else
      switch (select) {
        case "id":
          if(this.check_conversion(search_text)) 
          this.filtered_array = this.favorites_array.filter(item => item.id == +search_text); 
          else
          this.filter = false;
        break;
        case "author": this.filtered_array = this.favorites_array.filter(item => item.author.toLocaleLowerCase().includes(search_text.toLocaleLowerCase())); break;
        case "text": this.filtered_array = this.favorites_array.filter(item => item.text.toLocaleLowerCase().includes(search_text.toLocaleLowerCase())); break;
      }
    }
    else
    {
      this.filter = false;
      this.error = false;
    }
      
  }

  private check_conversion(text : string) : boolean
  {
    const number = parseInt(text);

      
          if (!isNaN(number)) {
            this.error = false;
            return true;
          } 
           this.error = true
           return false;
          
  }

  private async generate() {


    let i = 0;
    const batchSize = 6;
    const delayBetweenRequestsMs = 1000;

    while (i < 4000) {
      const batchPromises = [];

      for (let k = 0; k < batchSize; k++) {
        batchPromises.push(
          this._service.getInfoById(this.ids).toPromise().then((value: any) => {
            const info: Info = new Info();
            info.id = i;
            info.author = value.author;
            info.photo = value.download_url;
            info.text = this._service.generateRandomText();
            this.raw_data.push(info);
            if(this.isFav(info.id))
            {
            this.favorites_array.push(info);
             if(this.favorite)
             this.display_data.push(info);
            }
            if (i < 12) {
              this.counter++;
              this.display_data.push(info);
            }
            else
            this.loading = false;

            i++;
            this.ids++;
            if (this.ids == 86) this.ids = 0;

          })
        );
      }


      await Promise.all(batchPromises);

      await new Promise((resolve) => setTimeout(resolve, delayBetweenRequestsMs));
    }


  }

  private addData() {
  if(!this.loading)
  {
    if(!this.data_added)
    {
      this.counter+=3 ;
      this.data_added = true;
    }
    if(!this.favorite)
    {
    this.display_data = this.display_data.concat(this.raw_data.slice(this.counter, this.counter + 6));    
    this.counter += 6;

    }
    else
    {
      this.display_data = this.display_data.concat(this.favorites_array.slice(this.counter, this.counter + 6));    
      this.counter += 6;
    }
  }
  }


  @HostListener("window:scroll", [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.addData();
    }
  }


  favoriteClick(id: number) {
    const storedDataString = localStorage.getItem('favs');

    if (storedDataString !== null) {
      let storedData : number[]= JSON.parse(storedDataString);
      if(this.isFav(id))
      {
        storedData = storedData.filter(item => item !== id);
        this.favorites_array = this.favorites_array.filter(item => item.id !== id);
        if(this.favorite)
        this.display_data = this.display_data.filter(item => item.id !== id);
      }
      else
      {
        storedData.push(id);
        this.favorites_array.push(this.raw_data.filter(item => item.id === id)[0]);
      }
      

      localStorage.setItem("favs",JSON.stringify(storedData)); 
    } else {
      let favs : number[] = [id];
      localStorage.setItem("favs",JSON.stringify(favs));
    }
  }

  isFav(id : number) : boolean
  {
    const storedDataString = localStorage.getItem('favs');

    if (storedDataString !== null) {
      const storedData : number[] = JSON.parse(storedDataString);
      return storedData.includes(id);
    } else {
      return false;
    }
  }


  toggleFavorite()
  {
    this.counter = 0;
    this.favorite = ! this.favorite;
    if(this.favorite)
    this.display_data = this.favorites_array.slice(0 ,12);   
  else
  this.display_data = this.raw_data.slice(0 ,12);  
  }
}
