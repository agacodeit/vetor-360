import { Component, Input, ContentChildren, QueryList, AfterContentInit, ViewEncapsulation } from '@angular/core';
import { NgClass, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'ds-card',
  standalone: true,
  imports: [NgClass, NgIf, NgStyle],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CardComponent implements AfterContentInit {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() elevated: boolean = false;
  @Input() clickable: boolean = false;
  @Input() padding: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'outlined' | 'filled' | 'bordered' = 'filled';
  @Input() borderRadius: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() maxWidth: string = '';

  hasFooterContent = false;

  @ContentChildren('[slot=footer]') footerContent!: QueryList<any>;

  ngAfterContentInit() {
    this.hasFooterContent = this.footerContent.length > 0;
  }

  get cardClasses(): string[] {
    const classes = ['card'];

    if (this.elevated) classes.push('card--elevated');
    if (this.clickable) classes.push('card--clickable');

    classes.push(`card--${this.size}`);
    classes.push(`card--${this.variant}`);
    classes.push(`card--radius-${this.borderRadius}`);

    return classes;
  }
}
