import { CommonModule } from '@angular/common';
import { Component, ContentChildren, Directive, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

// Diretiva para capturar conteúdo de cada item do accordion
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

    // Captura todos os templates de conteúdo
    @ContentChildren(AccordionItemDirective) contentItems!: QueryList<AccordionItemDirective>;

    ngOnInit(): void {
        // Inicializar estado dos itens se não definido
        this.items.forEach(item => {
            if (item.expanded === undefined) {
                item.expanded = false;
            }
        });
    }

    toggleItem(item: AccordionItem): void {
        if (item.disabled || this.disabled) return;

        const wasExpanded = item.expanded;

        // Se não permite múltiplos, fechar todos os outros
        if (!this.allowMultiple && !wasExpanded) {
            this.items.forEach(otherItem => {
                if (otherItem.id !== item.id) {
                    otherItem.expanded = false;
                }
            });
        }

        // Alternar estado do item atual
        item.expanded = !item.expanded;

        // Emitir eventos
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

    // Obter o template de conteúdo para um item específico
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
