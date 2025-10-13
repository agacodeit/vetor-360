import { CommonModule } from '@angular/common';
import { Component, ContentChildren, Directive, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../button/button.component';


@Directive({
    selector: '[accordionItem]',
    standalone: true
})
export class AccordionItemDirective {
    @Input('accordionItem') id: string = '';
    constructor(public template: TemplateRef<any>) { }
}

export interface AccordionItem {
    id: string;
    title: string;
    disabled?: boolean;
    expanded?: boolean;
}

@Component({
    selector: 'ds-accordion',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AccordionComponent implements OnInit {
    @Input() items: AccordionItem[] = [];
    @Input() allowMultiple: boolean = false;
    @Input() variant: 'default' | 'bordered' | 'minimal' = 'default';
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() iconPosition: 'left' | 'right' = 'right';
    @Input() disabled: boolean = false;

    @Output() itemToggled = new EventEmitter<AccordionItem>();
    @Output() itemExpanded = new EventEmitter<AccordionItem>();
    @Output() itemCollapsed = new EventEmitter<AccordionItem>();


    @ContentChildren(AccordionItemDirective) contentItems!: QueryList<AccordionItemDirective>;

    ngOnInit(): void {

        this.items.forEach(item => {
            if (item.expanded === undefined) {
                item.expanded = false;
            }
        });
    }

    toggleItem(item: AccordionItem): void {
        if (item.disabled || this.disabled) return;

        const wasExpanded = item.expanded;


        if (!this.allowMultiple && !wasExpanded) {
            this.items.forEach(otherItem => {
                if (otherItem.id !== item.id) {
                    otherItem.expanded = false;
                }
            });
        }


        item.expanded = !item.expanded;


        this.itemToggled.emit(item);

        if (item.expanded) {
            this.itemExpanded.emit(item);
        } else {
            this.itemCollapsed.emit(item);
        }
    }

    isItemExpanded(item: AccordionItem): boolean {
        return !!item.expanded;
    }

    isItemDisabled(item: AccordionItem): boolean {
        return !!item.disabled || this.disabled;
    }


    getContentTemplate(itemId: string): TemplateRef<any> | null {
        const contentItem = this.contentItems?.find(item => item.id === itemId);
        return contentItem?.template || null;
    }

    get accordionClasses(): string {
        const classes = ['accordion-container'];
        classes.push(`variant-${this.variant}`);
        classes.push(`size-${this.size}`);

        if (this.disabled) classes.push('disabled');

        return classes.join(' ');
    }

    get itemClasses(): string {
        const classes = ['accordion-item'];
        classes.push(`variant-${this.variant}`);
        classes.push(`size-${this.size}`);
        classes.push(`icon-${this.iconPosition}`);

        return classes.join(' ');
    }
}
