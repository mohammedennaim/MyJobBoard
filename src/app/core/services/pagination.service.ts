import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PaginationService {
    calculateTotalPages(totalCount: number, itemsPerPage: number): number {
        return Math.ceil(totalCount / itemsPerPage);
    }

    getVisiblePages(currentPage: number, totalPages: number, maxVisible: number = 5): number[] {
        const pages: number[] = [];
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    }

    isValidPage(page: number, totalPages: number): boolean {
        return page >= 1 && page <= totalPages;
    }
}
