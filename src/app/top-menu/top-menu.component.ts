import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('menu', { static: true })
  menu!: ElementRef;
  menuItems: string[] = ['Bar Chart', 'Radar Chart', 'Pie Chart', 'Line Chart']; // Add your menu items here

  private scrollPosition = 0;
  

  
  scrollMenu(direction: 'left' | 'right'): void {
    const menuContainer = this.menu.nativeElement;
    const itemWidth = menuContainer.scrollWidth / this.menuItems.length;
    const containerWidth = menuContainer.clientWidth;

    if (direction === 'left') {
      this.scrollPosition -= containerWidth;
      if (this.scrollPosition < 0) {
        this.scrollPosition = 0;
      }
    } else if (direction === 'right') {
      this.scrollPosition += containerWidth;
      if (this.scrollPosition + containerWidth > menuContainer.scrollWidth) {
        this.scrollPosition = menuContainer.scrollWidth - containerWidth;
      }
    }

    menuContainer.scrollTo({
      left: this.scrollPosition,
      behavior: 'smooth'
    });
  }


}
