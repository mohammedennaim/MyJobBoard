import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
    standalone: true
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, limit: number = 150): string {
        if (!value) return '';
        const text = value.replace(/<[^>]*>/g, '');
        return text.length > limit ? text.substring(0, limit) + '...' : text;
    }
}
