import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'limitTo',
    standalone: true
})
export class LimitToPipe implements PipeTransform {
  transform(value: string, limitTo: string): string {
    const limit = parseInt(limitTo, 10);
    const trail = '..';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
