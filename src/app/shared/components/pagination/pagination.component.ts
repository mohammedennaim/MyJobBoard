import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pagination',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pagination.component.html'
})
export class PaginationComponent {
    @Input() currentPage: number = 1;
    @Input() totalPages: number = 0;
    @Input() visiblePages: number[] = [];
    @Output() pageChange = new EventEmitter<number>();

    onPageChange(page: number): void {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.pageChange.emit(page);
        }
    }
}
