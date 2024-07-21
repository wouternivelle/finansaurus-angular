import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'localDate',
    standalone: true
})
export class LocalDatePipe implements PipeTransform {
  transform(value: Date, args: string): string {
    return moment.utc(value).local().format(args);
  }
}
