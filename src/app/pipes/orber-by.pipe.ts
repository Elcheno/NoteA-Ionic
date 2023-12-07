import { Pipe, PipeTransform } from '@angular/core';
import { Note } from '../model/note';
import { OrderBy } from '../model/orderBy';

@Pipe({
  name: 'orberBy',
  standalone: true
})
export class OrberByPipe implements PipeTransform {

  transform(value: Note[], order: OrderBy = 'asc'): Note[] {
    return value.sort( (a: Note, b: Note) => {
      if (order === 'asc') {
        return new Date(a.date) < new Date(b.date) ? -1 : 1;
      } else if (order === 'desc') {
        return new Date(b.date) < new Date(a.date) ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
